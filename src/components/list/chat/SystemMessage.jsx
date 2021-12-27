import React, { useEffect, useRef, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { useInView } from "react-intersection-observer";
import { useSystemMessage, useZoomActions } from "../../hooks";
import { replaceChar } from "../../../helpers/stringFormatter";
import { addToModals } from "../../../redux/actions/globalActions";

const SystemMessageContainer = styled.span`
  display: block;
  width: 100%;

  .chat-file-notification {
    b:hover {
      text-decoration: underline;
      cursor: pointer;
    }
  }

  .push-link {
    display: inline-block;
    position: relative;
    padding-bottom: 25px;
    margin-bottom: -25px;
    width: 100%;

    &:before {
      position: absolute;
      left: -14px;
      top: -7px;
      bottom: 0;
      width: 6px;
      height: calc(100% - 12px);
      background: linear-gradient(180deg, rgba(106, 36, 126, 1) 0%, rgba(216, 64, 113, 1) 100%);
      content: "";
      border-radius: 6px 0 0 6px;
    }

    .card-body {
      margin-top: 0.5rem;
      margin-bottom: 0.5rem;
      padding: 1rem;
      max-width: 95%;
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 12px;
    }

    .open-post {
      display: flex;
      position: absolute;
      right: -20px;
      bottom: -10px;
      justify-content: center;
      align-items: center;
      font-size: 12px;

      svg {
        margin-left: 0;
        height: 12px;
      }
    }
  }
`;

const SystemMessageContent = styled.span`
  display: block;
  width: 100%;
  cursor: ${(props) => (props.isPostNotification ? "pointer" : "auto")};
  strong {
    cursor: ${(props) => (props.isZoomMessage ? "pointer" : "auto")};
  }
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
const THRESHOLD = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9];
const SystemMessage = (props) => {
  const { reply, selectedChannel, isLastChat, chatMessageActions, user, timeFormat, dictionary } = props;

  const zoomActions = useZoomActions();
  const messageRef = useRef();
  const history = useHistory();
  const params = useParams();
  const dispatch = useDispatch();

  const componentIsMounted = useRef(true);
  const [generatingSignature, setGeneratingSignature] = useState(false);
  const { parseBody } = useSystemMessage({ dictionary, reply, selectedChannel, user });

  const [lastChatRef, inView, entry] = useInView({
    threshold: THRESHOLD,
    skip: !isLastChat,
  });

  useEffect(() => {
    if (isLastChat && entry) {
      if (entry.boundingClientRect.height - entry.intersectionRect.height >= 16) {
        chatMessageActions.setLastMessageVisiblility({ status: false });
      } else {
        chatMessageActions.setLastMessageVisiblility({ status: true });
      }
    }
  }, [isLastChat, entry, inView]);

  const handleZoomLink = (e) => {
    e.preventDefault();
    if (reply.body.startsWith("ZOOM_MEETING::{") && !generatingSignature) {
      const meetingSDKELement = document.getElementById("meetingSDKElement");
      const meetingSDKELementFirstChild = meetingSDKELement.firstChild;
      if (meetingSDKELementFirstChild && meetingSDKELementFirstChild.classList.contains("react-draggable")) {
        let modalPayload = {
          type: "zoom_inprogress",
        };

        dispatch(addToModals(modalPayload));
      } else {
        setGeneratingSignature(true);
        const data = JSON.parse(reply.body.replace("ZOOM_MEETING::", ""));
        let payload = {
          meetingNumber: data.meetingNumber,
          role: 0,
          password: data.password,
          channel_id: selectedChannel.id,
        };
        const cb = () => {
          if (componentIsMounted.current) setGeneratingSignature(false);
        };
        zoomActions.generateSignature(payload, cb);
      }
    }

    return false;
  };

  useEffect(() => {
    // const zoomLink = refs.container.current.querySelector("a.zoom-link");
    // if (zoomLink) zoomLink.addEventListener("click", handleZoomLink, true);

    let zLink = null;

    if (reply.body.startsWith("ZOOM_MEETING::{")) {
      zLink = messageRef.current.querySelector("strong");
      if (zLink) zLink.addEventListener("click", handleZoomLink, true);
    }

    return () => {
      if (zLink) zLink.removeEventListener("click", handleZoomLink, true);
    };
  }, []);

  const handleMessageClick = () => {
    if (reply.body.startsWith("UPLOAD_BULK::")) {
      const data = JSON.parse(reply.body.replace("UPLOAD_BULK::", ""));
      if (data.files) {
        chatMessageActions.viewFiles(data.files);
      }
    } else if (reply.body.startsWith("POST_CREATE::")) {
      let parsedData = reply.body.replace("POST_CREATE::", "");
      if (parsedData.trim() !== "") {
        let item = JSON.parse(reply.body.replace("POST_CREATE::", ""));
        if (params && params.workspaceId) {
          if (params.folderId) {
            history.push(`/workspace/posts/${params.folderId}/${params.folderName}/${params.workspaceId}/${replaceChar(params.workspaceName)}/post/${item.post.id}/${replaceChar(item.post.title)}`);
          } else {
            history.push(`/workspace/posts/${params.workspaceId}/${params.workspaceName}/post/${item.post.id}/${replaceChar(item.post.title)}`);
          }
        } else {
          history.push(`/posts/${item.post.id}/${replaceChar(item.post.title)}`);
        }
      }
    }
  };
  return (
    <SystemMessageContainer ref={isLastChat ? lastChatRef : null}>
      <SystemMessageContent
        id={`bot-${reply.id}`}
        onClick={handleMessageClick}
        ref={messageRef}
        dangerouslySetInnerHTML={{ __html: parseBody }}
        isPostNotification={reply.body.includes("POST_CREATE::")}
        isZoomMessage={reply.body.includes("ZOOM_MEETING::")}
      />
      <ChatTimeStamp className="chat-timestamp" isAuthor={false}>
        <span className="reply-date created">{timeFormat.todayOrYesterdayDate(reply.created_at.timestamp)}</span>
      </ChatTimeStamp>
    </SystemMessageContainer>
  );
};

export default React.memo(SystemMessage);
