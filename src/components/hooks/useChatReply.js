import React, { useCallback } from "react";
import quillHelper from "../../helpers/quillHelper";
import { renderToString } from "react-dom/server";
import { ImageTextLink, SvgIconFeather } from "../common";
import { getEmojiRegexPattern, GifRegex } from "../../helpers/stringFormatter";
import styled from "styled-components";

const StyledImageTextLink = styled(ImageTextLink)`
  display: block;
  svg,
  polyline,
  circle,
  g {
    stroke: ${(props) => (props.isAuthor ? "#ffffffe6" : "#8C3B9B")};
  }
`;

const useChatReply = ({ reply, dictionary, isAuthor, user, recipients, selectedChannel }) => {

  const parseSystemMessage = useCallback((message) => {
    let newBody = "";
    if (message.includes("JOIN_CHANNEL")) {
      let ids = /\d+/g;
      let extractedIds = message.match(ids);
      let newMembers = recipients
        .filter((r) => {
          let userFound = false;
          extractedIds.forEach((id) => {
            if (parseInt(id) === r.type_id) {
              userFound = true;
            }
          });
          return userFound;
        })
        .map((user) => user.name);
      if (selectedChannel.type === "DIRECT") {
        newBody = `<p><span class='channel-new-members'>${newMembers.join(", ")}</span><br> ${dictionary.joined} <span class='channel-title'>#${selectedChannel.title}</span></p>`;
      } else {
        newBody = `<p><span class='channel-new-members'>${newMembers.join(", ")}</span><br> ${dictionary.joined} <span class='channel-title'>#${selectedChannel.title}</span></p>`;
      }
    } else if (message.includes("MEMBER_REMOVE_CHANNEL")) {
      if (selectedChannel.type === "DIRECT") {
        newBody = `<p><span class='channel-new-members'>${message.substr(message.indexOf(" "))}</span><br> ${dictionary.left} <span class='channel-title'>#${selectedChannel.title}</span></p>`;
      } else {
        newBody = `<p><span class='channel-new-members'>${message.substr(message.indexOf(" "))}</span><br> ${dictionary.left} <span class='channel-title'>#${selectedChannel.title}</span></p>`;
      }
    } else if (message.includes("ACCOUNT_DEACTIVATED")) {
      let newBody = message.replace("ACCOUNT_DEACTIVATED ", "");
      if (newBody[newBody.length - 1] === "s") {
        newBody = `${dictionary.update}: ${newBody}' ${dictionary.accountDeactivated}.`;
      } else {
        newBody = `${dictionary.update}: ${newBody}'s ${dictionary.accountDeactivated}.`;
      }
    } else if (message.includes("NEW_ACCOUNT_ACTIVATED")) {
      let newBody = message.replace("NEW_ACCOUNT_ACTIVATED ", "");
      if (newBody[newBody.length - 1] === "s") {
        newBody = `${dictionary.update}: ${newBody}' ${dictionary.accountActivated}.`;
      } else {
        newBody = `${dictionary.update}: ${newBody}'s ${dictionary.accountActivated}.`;
      }
    } else if (message.includes("CHANNEL_UPDATE::")) {
      const data = JSON.parse(message.replace("CHANNEL_UPDATE::", ""));
      let author = recipients.find((r) => data.author && r.type_id === data.author.id);
      if (author) {
        if (data.author && data.author.id === user.id) {
          author.name = dictionary.you;
        }
      } else {
        author = {
          name: dictionary.someone
        };
      }

      let newBody = "";
      if (data.title !== "") {
        newBody = (
          <>
            <SvgIconFeather width={16}
                            icon="edit-3"/> {author.name} {selectedChannel.type === "TOPIC" ? dictionary.renameThisWorkspace : dictionary.renameThisChat}
            <b>#{data.title}</b>
            <br/>
          </>
        );
      }

      if (data.added_members.includes(user.id) && data.added_members.length >= 1) {
        const am = recipients.filter((r) => data.added_members.includes(r.type_id) && r.type_id !== user.id).map((r) => r.name);

        if (data.author && data.author.id === user.id) {
          if (newBody === "") {
            newBody = (
              <>
                <b>{author.name}</b> {dictionary.joined}{" "}
              </>
            );
          } else {
            newBody = <>{newBody} {dictionary.andJoined}</>;
          }

          if (am.length !== 0) {
            newBody = (
              <>
                {newBody} {dictionary.andAdded} <b>{am.join(", ")}</b>
                <br/>
              </>
            );
          }
        } else {
          if (newBody === "") {
            newBody = <>{author.name} {dictionary.added} </>;
          } else {
            newBody = <>{newBody} {dictionary.andAdded}</>;
          }

          if (data.added_members.includes(user.id)) {
            if (am.length !== 0) {
              newBody = (
                <>
                  {newBody} <b>{dictionary.youAnd} </b>
                </>
              );
            } else {
              newBody = (
                <>
                  {newBody} <b>{dictionary.you}</b>
                </>
              );
            }
          }

          if (am.length !== 0) {
            newBody = (
              <>
                {newBody} <b>{am.join(", ")}</b>
                <br/>
              </>
            );
          }
        }
      }

      if (data.removed_members.length === 1) {
        if (data.author && data.author.id === data.removed_members[0]) {
          if (newBody === "") {
            if (data.author.id === user.id && data.removed_members[0] === user.id) {
              newBody = (
                <>
                  {selectedChannel.type === "TOPIC" ? dictionary.youLeftWorkspace : dictionary.youLeftChat}{" "}
                </>
              );
            } else {
              newBody = (
                <>
                  <b>{data.author.name}</b> {selectedChannel.type === "TOPIC" ? dictionary.hasLeftWorkspace : dictionary.hasLeftChat}{" "}
                </>
              );
            }
          } else {
            newBody = <>{newBody} {selectedChannel.type === "TOPIC" ? dictionary.andHasLeftWorkspace : dictionary.andHasLeftChat}</>;
          }
        } else {
          if (newBody === "") {
            newBody = (
              <>
                <b>{data.author.name}</b> {selectedChannel.type === "TOPIC" ? dictionary.hasLeftWorkspace : dictionary.hasLeftChat}{" "}
              </>
            );
          } else {
            newBody = <>{newBody} {selectedChannel.type === "TOPIC" ? dictionary.andHasLeftWorkspace : dictionary.andHasLeftChat}</>;
          }
        }
      } else if (data.removed_members.length > 1) {
        const rm = recipients.filter((r) => data.removed_members.includes(r.type_id) && r.type_id !== user.id).map((r) => r.name);

        if (data.removed_members.includes(user.id) && data.author && data.author.id === user.id) {
          if (newBody === "") {
            newBody = (
              <>
                <b>{author.name}</b> {dictionary.left}{" "}
              </>
            );
          } else {
            newBody = <>{newBody} {dictionary.andLeft}</>;
          }

          if (rm.length !== 0) {
            newBody = (
              <>
                {newBody} {dictionary.andRemoved} <b>{rm.join(", ")}</b>
                <br/>
              </>
            );
          }
        } else {
          if (newBody === "") {
            newBody = <>{author.name} {dictionary.removed} </>;
          } else {
            newBody = <>{newBody} {dictionary.andRemoved}</>;
          }

          if (data.removed_members.includes(user.id)) {
            if (rm.length !== 0) {
              newBody = (
                <>
                  {newBody} <b>{dictionary.youAnd} </b>
                </>
              );
            } else {
              newBody = (
                <>
                  {newBody} <b>{dictionary.you}</b>
                </>
              );
            }
          }

          if (rm.length !== 0) {
            newBody = (
              <>
                {newBody} <b>{rm.join(", ")}</b>
                <br/>
              </>
            );
          }
        }
      }
      newBody = renderToString(newBody);
    } else if (message.includes("POST_CREATE::")) {
      let item = JSON.parse(message.replace("POST_CREATE::", "").replace("</div>", ""));
      let description = item.post.description;
      newBody = renderToString(
        <>
          <b>{item.author.first_name}</b> {dictionary.createdThePost} <b>"{item.post.title}"</b>
          <span className="card card-body" style={{ margin: 0, padding: "10px" }}
                dangerouslySetInnerHTML={{ __html: description }}/>
        </>
      );
    }

    return newBody === "" ? message : newBody;
  }, []);

  let replyBody = reply.body;
  if (reply.is_deleted) {
    replyBody = dictionary.chatRemoved;
  } else {
    if (reply.created_at.timestamp !== reply.updated_at.timestamp) {
      replyBody = `${replyBody}<span class='edited-message'>(edited)</span>`;
    }
  }

  replyBody = parseSystemMessage(quillHelper.parseEmoji(replyBody));

  let quoteAuthor = "";
  let quoteBody = "";
  if (reply.quote) {
    if (reply.quote.user) {
      if (user.id !== reply.quote.user.id) {
        quoteAuthor = reply.quote.user.name;
      } else {
        quoteAuthor = dictionary.you;
      }
    }

    let div = document.createElement("div");
    div.innerHTML = reply.quote.body;
    let images = div.getElementsByTagName("img");
    for (let i = 0; i < images.length; i++) {
      quoteBody += renderToString(
        <StyledImageTextLink className={"image-quote"} target={"_blank"} href={images[0].getAttribute("src")}
                             icon={"image-video"} isAuthor={isAuthor}>
          Photo
        </StyledImageTextLink>
      );
    }

    let videos = div.getElementsByTagName("video");
    for (let i = 0; i < videos.length; i++) {
      quoteBody += renderToString(
        <StyledImageTextLink className={"video-quote"} target={"_blank"} href={videos[0].getAttribute("player-source")}
                             icon={"image-video"} isAuthor={isAuthor}>
          Video
        </StyledImageTextLink>
      );
    }
    if (reply.quote.files) {
      reply.quote.files.forEach((file) => {
        if (file.type === "image") {
          quoteBody += renderToString(
            <StyledImageTextLink
              className={"image-quote"} target={"_blank"} href={file.thumbnail_link}
              icon={"image-video"} isAuthor={isAuthor}>{dictionary.photo}</StyledImageTextLink>
          );
        } else if (file.type === "video") {
          quoteBody += renderToString(
            <StyledImageTextLink
              className={"video-quote"} target={"_blank"} href={file.view_link} icon={"image-video"}
              isAuthor={isAuthor}>{dictionary.video}</StyledImageTextLink>
          );
        } else {
          quoteBody += renderToString(
            <StyledImageTextLink
              //className={`video-quote`}
              target={"_blank"}
              href={file.view_link}
              icon={"documents"}
              isAuthor={isAuthor}
            >
              {file.filename ? `${file.filename} ` : `${file.name} `}
            </StyledImageTextLink>
          );
        }
      });
    }

    quoteBody += quillHelper.parseEmoji(reply.quote.body);
    quoteBody = parseSystemMessage(quoteBody);
  }

  let isGifOnly = !!replyBody.substring(15, replyBody.length - 8).match(GifRegex);

  let hasMessage = reply.body.substring(5, reply.body.length - 6) !== "";

  let isEmoticonOnly = false;
  const emoji = replyBody.substring(5, replyBody.length - 6);
  if (emoji.length <= 3 && emoji.match(getEmojiRegexPattern())) {
    isEmoticonOnly = false;
  }

  return {
    parseSystemMessage,
    quoteBody,
    quoteAuthor,
    replyBody,
    hasMessage,
    isGifOnly,
    isEmoticonOnly
  };
};

export default useChatReply;
