import React, { useCallback } from "react";
import quillHelper from "../../helpers/quillHelper";
import { renderToString } from "react-dom/server";
import { ImageTextLink, SvgIconFeather } from "../common";
import { getEmojiRegexPattern, GifRegex, stripGif, hasCurrencySymbol } from "../../helpers/stringFormatter";
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

const useChatReply = ({ reply, dictionary, isAuthor, user, recipients, selectedChannel, users }) => {
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

      return newBody;
    } else if (message.includes("MEMBER_REMOVE_CHANNEL")) {
      if (selectedChannel.type === "DIRECT") {
        newBody = `<p><span class='channel-new-members'>${message.substr(message.indexOf(" "))}</span><br> ${dictionary.left} <span class='channel-title'>#${selectedChannel.title}</span></p>`;
      } else {
        newBody = `<p><span class='channel-new-members'>${message.substr(message.indexOf(" "))}</span><br> ${dictionary.left} <span class='channel-title'>#${selectedChannel.title}</span></p>`;
      }

      return newBody;
    } else if (message.includes("ACCOUNT_DEACTIVATED")) {
      let newBody = message.replace("ACCOUNT_DEACTIVATED ", "");
      if (newBody[newBody.length - 1] === "s") {
        newBody = `${dictionary.update}: ${newBody}' ${dictionary.accountDeactivated}.`;
      } else {
        newBody = `${dictionary.update}: ${newBody}'s ${dictionary.accountDeactivated}.`;
      }

      return newBody;
    } else if (message.includes("NEW_ACCOUNT_ACTIVATED")) {
      let newBody = message.replace("NEW_ACCOUNT_ACTIVATED ", "");
      if (newBody[newBody.length - 1] === "s") {
        newBody = `${dictionary.update}: ${newBody}' ${dictionary.accountActivated}.`;
      } else {
        newBody = `${dictionary.update}: ${newBody}'s ${dictionary.accountActivated}.`;
      }

      return newBody;
    } else if (message.includes("CHANNEL_UPDATE::")) {
      const data = JSON.parse(message.replace("CHANNEL_UPDATE::", ""));
      let author = {
        name: dictionary.someone,
        id: null,
      };

      if (data.author && data.author.id === user.id) {
        author = {
          name: <b>{dictionary.you}</b>,
          id: user.id,
        };
      } else if (data.author && data.author.id !== user.id) {
        let sysAuthor = Object.values(users).find((u) => data.author.id === u.id);
        if (sysAuthor) {
          author = {
            name: sysAuthor.name,
            id: sysAuthor.id,
          };
        }
      }

      if (data.accepted_members && data.author) {
        let sysAuthor = Object.values(users).find((u) => data.author === u.id);
        if (sysAuthor) {
          author = {
            name: sysAuthor.name,
            id: sysAuthor.id,
          };
        }
      }

      let newBody = "";
      if (data.title !== "") {
        newBody = (
          <>
            <SvgIconFeather width={16} icon="edit-3" /> {author.name} {selectedChannel.type === "TOPIC" ? dictionary.renameThisWorkspace : dictionary.renameThisChat} <b>#{data.title}</b>
            <br />
          </>
        );
      }

      if (data.title === "" && data.added_members.length === 0 && data.removed_members.length === 0 && !data.hasOwnProperty("accepted_members")) {
        newBody = (
          <>
            {user.id === data.author.id ? <b>{dictionary.you}</b> : <b>{author.name}</b>} updated <b>#{selectedChannel.title}</b>
          </>
        );
      }

      if (data.added_members.length === 1 && data.removed_members.length === 0 && data.title === "") {
        //for adding one member without changes in title and for user who join the channel / workspace
        const am = Object.values(users).find((u) => data.added_members.includes(u.id));
        if (am && data.author && data.author.id === am.id) {
          newBody = (
            <>
              {user.id === data.author.id ? <b>{dictionary.you}</b> : <b>{author.name}</b>} {dictionary.joined} <b>#{selectedChannel.title}</b>
            </>
          );
        } else if (am) {
          newBody = (
            <>
              <b>{author.name}</b> {dictionary.added} <b>{am.name}</b>
            </>
          );
        }
      } else if (data.added_members.length >= 1) {
        let am = Object.values(users).filter((u) => data.added_members.includes(u.id));
        if (newBody === "") {
          newBody = (
            <>
              <b>{author.name}</b> {dictionary.added}{" "}
            </>
          );
        } else {
          newBody = (
            <>
              {newBody} {dictionary.andAdded}
            </>
          );
        }

        if (data.added_members.includes(user.id)) {
          am = am.filter((m) => m.type_id !== user.id);
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
              {newBody} <b>{am.map((m) => m.name).join(", ")}</b>
              <br />
            </>
          );
        }
      }

      if (data.removed_members.length === 1) {
        if (data.author && data.author.id === data.removed_members[0]) {
          if (newBody === "") {
            if (data.author.id === user.id && data.removed_members[0] === user.id) {
              newBody = (
                <>
                  <b>{dictionary.you}</b> {selectedChannel.type === "TOPIC" ? dictionary.leftTheWorkspace : dictionary.leftTheChat}{" "}
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
            newBody = (
              <>
                {newBody} {selectedChannel.type === "TOPIC" ? dictionary.andHasLeftWorkspace : dictionary.andHasLeftChat}
              </>
            );
          }
        } else {
          let userLeft = Object.values(users).find((u) => data.removed_members.includes(u.id));
          if (newBody === "") {
            newBody = (
              <>
                {author.name} {dictionary.removed} <b>{userLeft ? userLeft.name : null}</b>
              </>
            );
          } else {
            newBody = (
              <>
                {newBody} {dictionary.andRemoved} <b>{userLeft ? userLeft.name : null}</b>
              </>
            );
          }
        }
      } else if (data.removed_members.length > 1) {
        let rm = Object.values(users).filter((u) => data.removed_members.includes(u.id));
        if (data.removed_members.includes(user.id) && data.author && data.author.id === user.id) {
          if (newBody === "") {
            newBody = (
              <>
                <b>{author.name}</b> {dictionary.left}{" "}
              </>
            );
          } else {
            newBody = (
              <>
                {newBody} {dictionary.andLeft}
              </>
            );
          }

          if (rm.length !== 0) {
            newBody = (
              <>
                {newBody} {dictionary.andRemoved} <b>{rm.join(", ")}</b>
                <br />
              </>
            );
          }
        } else {
          if (newBody === "") {
            newBody = (
              <>
                {author.name} {dictionary.removed}{" "}
              </>
            );
          } else {
            newBody = (
              <>
                {newBody} {dictionary.andRemoved}
              </>
            );
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
                <br />
              </>
            );
          }
        }
      } else if (data.accepted_members) {
        const am = Object.values(users).find((u) => data.accepted_members[0] === u.id);
        newBody = (
          <>
            <b>{author.name}</b> {dictionary.added} <b>{am && am.name}</b>
          </>
        );
      }

      return renderToString(newBody);
    } else if (message.includes("POST_CREATE::")) {
      try {
        let item = JSON.parse(message.replace("POST_CREATE::", "").replace("</div>", ""));
        let description = item.post.description;
        newBody = renderToString(
          <>
            <b>{item.author.first_name}</b> {dictionary.createdThePost} <b>"{item.post.title}"</b>
            <span className="card card-body" style={{ margin: 0, padding: "10px" }} dangerouslySetInnerHTML={{ __html: description }} />
          </>
        );
      } catch (err) {
        newBody = message;
      }

      return newBody;
    } else if (message.startsWith("{\"Welk punt geef je ons\"") || message.startsWith("ZAP_SUBMIT::")) {
      const renderStars = (num) => {
        let star = "";
        for (let i = 1; i <= 10; i++) {
          star += renderToString(<SvgIconFeather width={16} icon="star" fill={i <= num ? "#ffc107" : "none"} />);
        }
        return star;
      };
      const renderBoolean = (value) => {
        if (value.toLowerCase() === "true") return "👍";
        else if (value.toLowerCase() === "false") return "👎";
        else return value;
      };
      try {
        const data = JSON.parse(message.replace("ZAP_SUBMIT::", ""));
        newBody = "<span class='zap-submit'>";
        newBody += `<span>Hoi, ${data.project_manager} Bedrijf ${data.company_name} heeft een NPS review achtergelaten voor project: ${data.project_name}</span><div><br/></div>`;
        Object.keys(data)
          .filter((key) => {
            if (key === "submission_id") return false;
            else return true;
          })
          .forEach((key) => {
            if (data[key] !== "") {
              newBody += `<span class="data-key">${key}</span> : <span class="data-value">${isNaN(data[key]) ? renderBoolean(data[key]) : renderStars(parseInt(data[key]))}</span><br/>`;
            }
          });
        newBody += "</span>";
      } catch (e) {
        return message;
      }
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

  replyBody = parseSystemMessage(quillHelper.parseEmoji(stripGif(replyBody)));

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
        <StyledImageTextLink className={"image-quote"} target={"_blank"} href={images[0].getAttribute("src")} icon={"image-video"} isAuthor={isAuthor}>
          Photo
        </StyledImageTextLink>
      );
    }

    let videos = div.getElementsByTagName("video");
    for (let i = 0; i < videos.length; i++) {
      quoteBody += renderToString(
        <StyledImageTextLink className={"video-quote"} target={"_blank"} href={videos[0].getAttribute("player-source")} icon={"image-video"} isAuthor={isAuthor}>
          Video
        </StyledImageTextLink>
      );
    }
    if (reply.quote.files) {
      reply.quote.files.forEach((file) => {
        if (file.type === "image") {
          quoteBody += renderToString(
            <StyledImageTextLink className={"image-quote"} target={"_blank"} href={file.thumbnail_link} icon={"image-video"} isAuthor={isAuthor}>
              {dictionary.photo}
            </StyledImageTextLink>
          );
        } else if (file.type === "video") {
          quoteBody += renderToString(
            <StyledImageTextLink className={"video-quote"} target={"_blank"} href={file.view_link} icon={"image-video"} isAuthor={isAuthor}>
              {dictionary.video}
            </StyledImageTextLink>
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

  let isGifOnly = !!reply.body.substring(15, reply.body.length - 8).match(GifRegex);

  const message = reply.body.substring(5, reply.body.length - 6);
  let hasMessage = !(message === "" || message === "><");

  let isEmoticonOnly = false;
  const emoji = replyBody.substring(5, replyBody.length - 6);
  if (emoji.length <= 3 && emoji.match(getEmojiRegexPattern()) && !hasCurrencySymbol(emoji)) {
    isEmoticonOnly = true;
  }

  return {
    parseSystemMessage,
    quoteBody,
    quoteAuthor,
    replyBody,
    hasMessage,
    isGifOnly,
    isEmoticonOnly,
  };
};

export default useChatReply;
