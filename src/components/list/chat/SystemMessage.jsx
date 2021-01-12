import React, { forwardRef, useEffect } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { useInView } from "react-intersection-observer";
import { useSystemMessage } from "../../hooks";
import { SvgIconFeather } from "../../common";

const SystemMessageContainer = styled.span`
  display: block;
  width: 100%;

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
const THRESHOLD = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9];
const SystemMessage = forwardRef((props, ref) => {
  const { reply, selectedChannel, chatName, isLastChat, chatMessageActions, recipients, user, timeFormat, isLastChatVisible, dictionary, users } = props;

  const history = useHistory();

  const { parseBody } = useSystemMessage({ dictionary, reply, recipients, selectedChannel, user, users });

  const [lastChatRef, inView, entry] = useInView({
    threshold: THRESHOLD,
    skip: !isLastChat,
  });

  useEffect(() => {
    if (isLastChat && entry) {
      if (entry.boundingClientRect.height - entry.intersectionRect.height >= 16) {
        if (isLastChatVisible) chatMessageActions.setLastMessageVisiblility({ status: false });
      } else {
        if (!isLastChatVisible) chatMessageActions.setLastMessageVisiblility({ status: true });
      }
    }
  }, [isLastChat, entry, isLastChatVisible, inView]);

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

  return (
    <SystemMessageContainer ref={isLastChat ? lastChatRef : null}>
      <SystemMessageContent ref={ref} id={`bot-${reply.id}`} dangerouslySetInnerHTML={{ __html: parseBody }} isPostNotification={reply.body.includes("POST_CREATE::")} />
      <ChatTimeStamp className="chat-timestamp" isAuthor={false}>
        <span className="reply-date created">
          {/* <span className="star-wrap">
            <SvgIconFeather className={`mr-1 ${reply.i_starred ? "active" : ""}`} icon="star" />
            {reply.star_count > 0 && <span className="star-count">{reply.star_count}</span>}
          </span> */}
          {timeFormat.localizeTime(reply.created_at.timestamp)}
        </span>
      </ChatTimeStamp>
    </SystemMessageContainer>
  );
});

export default React.memo(SystemMessage);
