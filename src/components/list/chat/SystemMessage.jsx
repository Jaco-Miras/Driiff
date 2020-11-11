import React, {forwardRef, useEffect, useState} from "react";
import {renderToString} from "react-dom/server";
import {useHistory, useParams} from "react-router-dom";
import styled from "styled-components";
import {SvgIconFeather} from "../../common";
import {useInView} from "react-intersection-observer";
import quillHelper from "../../../helpers/quillHelper";
//import {useTranslation} from "../../hooks";

const SystemMessageContainer = styled.span`
  display: block;
  
  .push-link {
    display: inline-block;
    position: relative;
    padding-bottom: 25px;
    margin-bottom: -25px;
    
    &:before {
      position: absolute;
      left: -14px;
      top: -7px;
      bottom: 0;
      width: 6px;
      height: calc(100% - 12px);
      background: #ffa341;
      content: "";
      border-radius: 6px 0 0 6px;
    }
    
    .card-body {
      margin-top: 0.5rem;
      margin-bottom: 0.5rem;
      padding: 1rem;
    }
    .open-post {
      display: flex;
      position: absolute;
      right: 0;
      bottom: -10px;
      justify-content: center;
      align-items: center;      
      
      svg {
        margin-left: 0.5rem;
        height: 16px;
      }
    }
  }
`;

const SystemMessageContent = styled.span`
  display: block;
  max-width: ${(props) => props.isPostNotification ? "400px" : "100%"};
`;
const ChatTimeStamp = styled.div`
  color: #a7abc3;
  font-style: italic;
  font-size: 11px;
  position: absolute;
  top: 0;
  left: calc(100% + 10px);
  display: flex;
  height: 100%;
  align-items: center;
  white-space: nowrap;
`;
const THRESHOLD = [.1, .2, .3, .4, .5, .6, .7, .8, .9];
const SystemMessage = forwardRef((props, ref) => {
  const {reply, selectedChannel, chatName, isLastChat, chatMessageActions, recipients, user, timeFormat, isLastChatVisible, dictionary } = props;

  const params = useParams();
  const history = useHistory();

  const [mounted, setMounted] = useState(false);
  const [body, setBody] = useState(reply.body);

  const [lastChatRef, inView, entry] = useInView({
    threshold: THRESHOLD,
    skip: !isLastChat
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isLastChat && entry) {
      if (entry.boundingClientRect.height - entry.intersectionRect.height >= 16) {
        if (isLastChatVisible) chatMessageActions.setLastMessageVisiblility({ status: false });
      } else {
        if (!isLastChatVisible) chatMessageActions.setLastMessageVisiblility({ status: true });
      }
    }
  }, [isLastChat, entry, isLastChatVisible, inView]);

  useEffect(() => {
    if (reply.body.includes("JOIN_CHANNEL")) {
      let ids = /\d+/g;
      let extractedIds = reply.body.match(ids);
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
        setBody(`<p><span class='channel-new-members'>${newMembers.join(", ")}</span><br> ${dictionary.joined} <span class='channel-title'>#${chatName}</span></p>`);
      } else {
        setBody(`<p><span class='channel-new-members'>${newMembers.join(", ")}</span><br> ${dictionary.joined} <span class='channel-title'>#${selectedChannel.title}</span></p>`);
      }
    } else if (reply.body.includes("MEMBER_REMOVE_CHANNEL")) {
      if (selectedChannel.type === "DIRECT") {
        setBody(`<p><span class='channel-new-members'>${reply.body.substr(reply.body.indexOf(" "))}</span><br> ${dictionary.left} <span class='channel-title'>#${chatName}</span></p>`);
      } else {
        setBody(`<p><span class='channel-new-members'>${reply.body.substr(reply.body.indexOf(" "))}</span><br> ${dictionary.left} <span class='channel-title'>#${selectedChannel.title}</span></p>`);
      }
    } else if (reply.body.includes("ACCOUNT_DEACTIVATED")) {
      let newBody = reply.body.replace("ACCOUNT_DEACTIVATED ", "");
      if (newBody[newBody.length - 1] === "s") {
        setBody(`${dictionary.update}: ${newBody}' ${dictionary.accountDeactivated}.`);
      } else {
        setBody(`${dictionary.update}: ${newBody}'s ${dictionary.accountDeactivated}.`);
      }
    } else if (reply.body.includes("NEW_ACCOUNT_ACTIVATED")) {
      let newBody = reply.body.replace("NEW_ACCOUNT_ACTIVATED ", "");
      if (newBody[newBody.length - 1] === "s") {
        setBody(`${dictionary.update}: ${newBody}' ${dictionary.accountActivated}.`);
      } else {
        setBody(`${dictionary.update}: ${newBody}'s ${dictionary.accountActivated}.`);
      }
    } else if (reply.body.includes("CHANNEL_UPDATE::")) {
      const data = JSON.parse(reply.body.replace("CHANNEL_UPDATE::", ""));
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
            <SvgIconFeather width={16} icon="edit-3"/> {author.name} {selectedChannel.type === "TOPIC" ? dictionary.renameThisWorkspace : dictionary.renameThisChat} <b>#{data.title}</b>
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

      setBody(renderToString(newBody));
    }
  }, []);

  const handleHistoryPushClick = (e) => {
    e.preventDefault();
    if (e.currentTarget.dataset.ctrl === "1") {
      e.currentTarget.dataset.ctrl = "0";
      let link = document.createElement("a");
      link.href = e.currentTarget.dataset.href;
      link.target = "_blank";
      link.click();
    } else {
      history.push(e.currentTarget.dataset.href);
    }
  }

  const handleHistoryKeyDown = (e) => {
    if (e.which === 17)
      e.currentTarget.dataset.ctrl = "1";
  }

  const handleHistoryKeyUp = (e) => {
    e.currentTarget.dataset.ctrl = "0";
  }
  
  const parseBody = () => {
    if (reply.body.includes("POST_CREATE::")) {
      let item = JSON.parse(reply.body.replace("POST_CREATE::", ""));
      let link = "";
      if (params && params.workspaceId) {
        if (params.folderId) {
          link = `/workspace/posts/${params.folderId}/${params.folderName}/${params.workspaceId}/${params.workspaceName}/post/${item.post.id}/${item.post.title}`
        } else {
          link = `/workspace/posts/${params.workspaceId}/${params.workspaceName}/post/${item.post.id}/${item.post.title}`
        }
      } else {
        link = `/posts/${item.post.id}/${item.post.title}`;
      }

      let description = quillHelper.parseToText(item.post.description);
      return (renderToString(<a href={link} className="push-link" data-href={link} data-has-link="0" data-ctrl="0">
        <b>{item.author.first_name}</b> {dictionary.createdThePost} <b>"{item.post.title}"</b>
        {
          description.trim() !== "" &&
          <span className="card card-body"
                dangerouslySetInnerHTML={{__html: description}}/>
        }
        <span className="open-post">{dictionary.openPost} <SvgIconFeather icon="arrow-right"/></span>
      </a>));
    } else if (reply.body.includes("JOIN_CHANNEL")) {
        let ids = /\d+/g;
        let extractedIds = reply.body.match(ids);
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
          return (`<p><span class='channel-new-members'>${newMembers.join(", ")}</span><br> ${dictionary.joined} <span class='channel-title'>#${chatName}</span></p>`);
        } else {
          return (`<p><span class='channel-new-members'>${newMembers.join(", ")}</span><br> ${dictionary.joined} <span class='channel-title'>#${selectedChannel.title}</span></p>`);
        }
      } else if (reply.body.includes("MEMBER_REMOVE_CHANNEL")) {
        if (selectedChannel.type === "DIRECT") {
          return (`<p><span class='channel-new-members'>${reply.body.substr(reply.body.indexOf(" "))}</span><br> ${dictionary.left} <span class='channel-title'>#${chatName}</span></p>`);
        } else {
          return (`<p><span class='channel-new-members'>${reply.body.substr(reply.body.indexOf(" "))}</span><br> ${dictionary.left} <span class='channel-title'>#${selectedChannel.title}</span></p>`);
        }
      } else if (reply.body.includes("ACCOUNT_DEACTIVATED")) {
        let newBody = reply.body.replace("ACCOUNT_DEACTIVATED ", "");
        if (newBody[newBody.length - 1] === "s") {
          return (`${dictionary.update}: ${newBody}' ${dictionary.accountDeactivated}.`);
        } else {
          return (`${dictionary.update}: ${newBody}'s ${dictionary.accountDeactivated}.`);
        }
      } else if (reply.body.includes("NEW_ACCOUNT_ACTIVATED")) {
        let newBody = reply.body.replace("NEW_ACCOUNT_ACTIVATED ", "");
        if (newBody[newBody.length - 1] === "s") {
          return (`${dictionary.update}: ${newBody}' ${dictionary.accountActivated}.`);
        } else {
          return (`${dictionary.update}: ${newBody}'s ${dictionary.accountActivated}.`);
        }
      } else if (reply.body.includes("CHANNEL_UPDATE::")) {
        const data = JSON.parse(reply.body.replace("CHANNEL_UPDATE::", ""));
  
        let author = recipients.find((r) => data.author && r.type_id === data.author.id);
        if (author) {
          if (data.author.id === user.id) {
            author.name = dictionary.you;
          }
        } else {
          author = {
            name: dictionary.someone,
          };
        }
  
        let newBody = "";
        if (data.title !== "") {
          newBody = (
            <>
              <SvgIconFeather width={16} icon="edit-3"/> {author.name} {selectedChannel.type === "TOPIC" ? dictionary.renameThisWorkspace : dictionary.renameThisChat} <b>#{data.title}</b>
              <br/>
            </>
          );
        }
  
        if (data.added_members.length >= 1) {
          const am = recipients.filter((r) => {
            return r.type === "USER" && data.added_members.includes(r.type_id) && r.type_id !== user.id
          }).map((r) => r.name);
  
          if (data.added_members.includes(user.id) && data.author && data.author.id === user.id) {
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
  
        if (data.removed_members.length >= 1) {
          const rm = recipients.filter((r) => {
            return r.type === "USER" && data.removed_members.includes(r.type_id) && r.type_id !== user.id
          }).map((r) => r.name);
  
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
  
        return(renderToString(newBody));
      }
  }

  useEffect(() => {
    if (reply.body.includes("POST_CREATE::")) {
      let item = JSON.parse(reply.body.replace("POST_CREATE::", ""));
      let link = "";
      if (params && params.workspaceId) {
        if (params.folderId) {
          link = `/workspace/posts/${params.folderId}/${params.folderName}/${params.workspaceId}/${params.workspaceName}/post/${item.post.id}/${item.post.title}`
        } else {
          link = `/workspace/posts/${params.workspaceId}/${params.workspaceName}/post/${item.post.id}/${item.post.title}`
        }
      } else {
        link = `/posts/${item.post.id}/${item.post.title}`;
      }

      let description = quillHelper.parseToText(item.post.description);
      setBody(renderToString(<a href={link} className="push-link" data-href={link} data-has-link="0" data-ctrl="0">
        <b>{item.author.first_name}</b> {dictionary.createdThePost} <b>"{item.post.title}"</b>
        {
          description.trim() !== "" &&
          <span className="card card-body"
                dangerouslySetInnerHTML={{__html: description}}/>
        }
        <span className="open-post">{dictionary.openPost} <SvgIconFeather icon="arrow-right"/></span>
      </a>));
    } else if (reply.body.includes("JOIN_CHANNEL")) {
      let ids = /\d+/g;
      let extractedIds = reply.body.match(ids);
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
        setBody(`<p><span class='channel-new-members'>${newMembers.join(", ")}</span><br> ${dictionary.joined} <span class='channel-title'>#${chatName}</span></p>`);
      } else {
        setBody(`<p><span class='channel-new-members'>${newMembers.join(", ")}</span><br> ${dictionary.joined} <span class='channel-title'>#${selectedChannel.title}</span></p>`);
      }
    } else if (reply.body.includes("MEMBER_REMOVE_CHANNEL")) {
      if (selectedChannel.type === "DIRECT") {
        setBody(`<p><span class='channel-new-members'>${reply.body.substr(reply.body.indexOf(" "))}</span><br> ${dictionary.left} <span class='channel-title'>#${chatName}</span></p>`);
      } else {
        setBody(`<p><span class='channel-new-members'>${reply.body.substr(reply.body.indexOf(" "))}</span><br> ${dictionary.left} <span class='channel-title'>#${selectedChannel.title}</span></p>`);
      }
    } else if (reply.body.includes("ACCOUNT_DEACTIVATED")) {
      let newBody = reply.body.replace("ACCOUNT_DEACTIVATED ", "");
      if (newBody[newBody.length - 1] === "s") {
        setBody(`${dictionary.update}: ${newBody}' ${dictionary.accountDeactivated}.`);
      } else {
        setBody(`${dictionary.update}: ${newBody}'s ${dictionary.accountDeactivated}.`);
      }
    } else if (reply.body.includes("NEW_ACCOUNT_ACTIVATED")) {
      let newBody = reply.body.replace("NEW_ACCOUNT_ACTIVATED ", "");
      if (newBody[newBody.length - 1] === "s") {
        setBody(`${dictionary.update}: ${newBody}' ${dictionary.accountActivated}.`);
      } else {
        setBody(`${dictionary.update}: ${newBody}'s ${dictionary.accountActivated}.`);
      }
    } else if (reply.body.includes("CHANNEL_UPDATE::")) {
      const data = JSON.parse(reply.body.replace("CHANNEL_UPDATE::", ""));

      let author = recipients.find((r) => data.author && r.type_id === data.author.id);
      if (author) {
        if (data.author.id === user.id) {
          author.name = dictionary.you;
        }
      } else {
        author = {
          name: dictionary.someone,
        };
      }

      let newBody = "";
      if (data.title !== "") {
        newBody = (
          <>
            <SvgIconFeather width={16} icon="edit-3"/> {author.name} {selectedChannel.type === "TOPIC" ? dictionary.renameThisWorkspace : dictionary.renameThisChat} <b>#{data.title}</b>
            <br/>
          </>
        );
      }

      if (data.added_members.length >= 1) {
        const am = recipients.filter((r) => {
          return r.type === "USER" && data.added_members.includes(r.type_id) && r.type_id !== user.id
        }).map((r) => r.name);

        if (data.added_members.includes(user.id) && data.author && data.author.id === user.id) {
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
        const rm = recipients.filter((r) => {
          return r.type === "USER" && data.removed_members.includes(r.type_id) && r.type_id !== user.id
        }).map((r) => r.name);
        console.log(data.removed_members.includes(user.id), data.removed_members)
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

      setBody(renderToString(newBody));
    }
  }, [recipients, recipients.length, chatName, reply.body, selectedChannel.title, selectedChannel.type]);

  useEffect(() => {
    if (body) {
      let pushLinks = document.querySelectorAll('.push-link[data-has-link="0"]');
      pushLinks.forEach(p => {
        p.addEventListener("click", handleHistoryPushClick);
        p.dataset.hasLink = "1";
        p.addEventListener("keydown", handleHistoryKeyDown);
        p.addEventListener("keyup", handleHistoryKeyUp);
      })
    }
  }, [body]);

  return (
    <SystemMessageContainer ref={isLastChat ? lastChatRef : null}>
      <SystemMessageContent
        ref={ref} id={`bot-${reply.id}`}
        dangerouslySetInnerHTML={{__html: !mounted ? parseBody() : body}}
        isPostNotification={reply.body.includes("POST_CREATE::")}/>
      <ChatTimeStamp className="chat-timestamp" isAuthor={false}>
        <span
          className="reply-date created">{timeFormat.localizeTime(reply.created_at.timestamp)}</span>
      </ChatTimeStamp>
    </SystemMessageContainer>
  );
});

export default React.memo(SystemMessage);
