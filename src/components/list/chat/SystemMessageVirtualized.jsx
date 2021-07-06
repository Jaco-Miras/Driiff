import React, { forwardRef, useEffect } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { useSystemMessage } from "../../hooks";

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

  .star-wrap {
    .feather-star {
      width: 16px;
      height: 16px;

      &.active {
        fill: #7a1b8bcc;
        color: #7a1b8bcc;
      }
    }
  }
`;

const SystemMessageVirtualized = forwardRef((props, ref) => {
  const { reply, selectedChannel, chatMessageActions, user, timeFormat, dictionary, users } = props;

  const history = useHistory();

  const { parseBody } = useSystemMessage({ dictionary, reply, selectedChannel, user, users });

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
  };

  const handleHistoryKeyDown = (e) => {
    if (e.which === 17) e.currentTarget.dataset.ctrl = "1";
  };

  const handleHistoryKeyUp = (e) => {
    e.currentTarget.dataset.ctrl = "0";
  };

  useEffect(() => {
    if (reply) {
      let pushLinks = document.querySelectorAll('.push-link[data-has-link="0"]');
      pushLinks.forEach((p) => {
        p.addEventListener("click", handleHistoryPushClick);
        p.dataset.hasLink = "1";
        p.addEventListener("keydown", handleHistoryKeyDown);
        p.addEventListener("keyup", handleHistoryKeyUp);
      });
    }
  }, [reply]);

  const handleMessageClick = () => {
    if (reply.body.startsWith("UPLOAD_BULK::")) {
      const data = JSON.parse(reply.body.replace("UPLOAD_BULK::", ""));
      if (data.files) {
        chatMessageActions.viewFiles(data.files);
      }
    }
  };
  return (
    <SystemMessageContainer>
      <SystemMessageContent ref={ref} id={`bot-${reply.id}`} onClick={handleMessageClick} dangerouslySetInnerHTML={{ __html: parseBody }} isPostNotification={reply.body.includes("POST_CREATE::")} />
      <ChatTimeStamp className="chat-timestamp" isAuthor={false}>
        <span className="reply-date created">{timeFormat.localizeTime(reply.created_at.timestamp)}</span>
      </ChatTimeStamp>
    </SystemMessageContainer>
  );
});

export default SystemMessageVirtualized;
