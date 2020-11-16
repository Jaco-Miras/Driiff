import React, {forwardRef, useEffect} from "react";
import {useHistory} from "react-router-dom";
import styled from "styled-components";
import {useInView} from "react-intersection-observer";
import {useSystemMessage} from "../../hooks";

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

  const history = useHistory();

  const { parseBody } = useSystemMessage({dictionary, reply, recipients, selectedChannel, user});

  const [lastChatRef, inView, entry] = useInView({
    threshold: THRESHOLD,
    skip: !isLastChat
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
  }

  const handleHistoryKeyDown = (e) => {
    if (e.which === 17)
      e.currentTarget.dataset.ctrl = "1";
  }

  const handleHistoryKeyUp = (e) => {
    e.currentTarget.dataset.ctrl = "0";
  }

  useEffect(() => {
    if (reply) {
      let pushLinks = document.querySelectorAll('.push-link[data-has-link="0"]');
      pushLinks.forEach(p => {
        p.addEventListener("click", handleHistoryPushClick);
        p.dataset.hasLink = "1";
        p.addEventListener("keydown", handleHistoryKeyDown);
        p.addEventListener("keyup", handleHistoryKeyUp);
      })
    }
  }, [reply]);

  return (
    <SystemMessageContainer ref={isLastChat ? lastChatRef : null}>
      <SystemMessageContent
        ref={ref} id={`bot-${reply.id}`}
        dangerouslySetInnerHTML={{__html: parseBody}}
        isPostNotification={reply.body.includes("POST_CREATE::")}/>
      <ChatTimeStamp className="chat-timestamp" isAuthor={false}>
        <span
          className="reply-date created">{timeFormat.localizeTime(reply.created_at.timestamp)}</span>
      </ChatTimeStamp>
    </SystemMessageContainer>
  );
});

export default React.memo(SystemMessage);
