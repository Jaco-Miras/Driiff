import React from "react";
import styled from "styled-components";
import {useSelector} from "react-redux";
import { Avatar, Loader, SvgEmptyState } from "../../common";
import ChatBubble from "./ChatBubble";
import ChatMessageOptions from "./ChatMessageOptions";
import ChatNewMessagesLine from "./ChatNewMessageLine";
import ChatReactionButton from "./ChatReactionButton";
import ChatUnfurl from "./ChatUnfurl";
import ChatReactions from "./Reactions/ChatReactions";
import SeenIndicator from "./SeenIndicator";
import SystemMessage from "./SystemMessage";

const ChatList = styled.li`
  position: relative;
  display: inline-block;
  width: 100%;
  margin-bottom: 5px;
  text-align: center;
  .chat-actions-container {
    opacity: 0;
  }
  &:hover {
    .chat-actions-container {
      opacity: 1;
    }
  }
`;
const TimestampDiv = styled.div`
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #a7abc3;
  padding: 26px 0 14px 0;
  position: sticky;
  top: 0;
  span {
    padding: 4px 8px;
    display: inline-block;
    font-size: 11px;
    border-radius: 6px;
    margin: 0 4px;
    background: #f0f0f0;
  }
  &[stuck] {
    &:before,
    &:after {
      display: none;
    }
  }
  @media (max-width: 620px) {
    padding: 14px 0 10px 0;
  }
`;
const ChatBubbleContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  //align-items: ${(props) => (props.isAuthor ? "flex-end" : "flex-start")};
  justify-content: flex-end;
  flex-flow: column;
  flex-flow: ${(props) => (props.isAuthor ? "row" : "row-reverse")};
  margin-left: ${(props) => (!props.isAuthor && !props.showAvatar ? "22px" : "0")};
  ${(props) => props.isAuthor === true && "position: relative; right: 15px;"};
  margin-top: ${(props) => props.showAvatar && "36px"};
  margin-top: ${(props) => props.showAvatar && props.isAuthor && "20px"};
  @media (max-width: 620px) {
    margin-top: ${(props) => props.showAvatar && "12px"};
    margin-top: ${(props) => props.showAvatar && props.isAuthor && "8px"};
    ${(props) => !props.showAvatar && !props.isAuthor && !props.isBot && "margin-left: 0"};
    ${(props) => props.isAuthor === true && !props.showAvatar && "position: relative; right: 0px;"};
    ${(props) => props.isAuthor === true && "position: relative; right: 0px;"};
  }
  ${(props) =>
    !props.isEmoticonOnly &&
    `
    &:before {
        ${(props) => props.showAvatar && "content: '';"};
        border: 10px solid transparent;
        border-right-color: transparent;
        border-right-color: #f0f0f0;
        position: absolute;
        top: ${(props) => (props.showAvatar && !props.isAuthor ? "42px" : "8px")};;
        left: 20px;
        z-index: 1;
        ${(props) =>
          props.isAuthor === true &&
          `
            left: auto;
            right: -20px;
            border-left-color: #7A1B8B;
            border-right-color: transparent;
        `};
    }`}
`;
const ChatActionsContainer = styled.div`
  flex-flow: ${(props) => (props.isAuthor ? "row-reverse" : "row")};
  flex-wrap: wrap;
  ${(props) => (props.isAuthor ? "margin-right: 10px" : "margin-left: 10px")};
  min-width: 150px;
  color: #a7abc3;
  background: #ffffff;
  position: absolute;
  display: flex;
  align-items: center;
  top: 0;
  ${(props) => (props.isAuthor ? "right: 100%" : "left: 100%")};
  height: calc(100% + 4px);
  margin-top: -2px;
  transition: opacity 0.3s ease;
`;
const SystemChatActionsContainer = styled.div`
  flex-flow: ${(props) => (props.isAuthor ? "row-reverse" : "row")};
  flex-wrap: wrap;
  ${(props) => (props.isAuthor ? "margin-right: 10px" : "margin-left: 10px")};
  min-width: 150px;
  color: #a7abc3;
  background: #ffffff;
  position: absolute;
  display: flex;
  align-items: center;
  top: 0;
  ${(props) => (props.isAuthor ? "right: 100%" : "left: 100%")};
  height: calc(100% + 4px);
  margin-top: -2px;
  transition: opacity 0.3s ease;
  button {
    margin: 5px;
  }
`;

const MessageOptions = styled(ChatMessageOptions)`
  display: flex;
  flex-direction: column;
  flex-basis: 100%;
  flex: 1;
  margin: 5px;
  max-width: 25px;

  .more-options-tooltip {
    &.orientation-bottom {
      top: calc(100% - 35px);
    }

    &.orientation-top {
    }

    &.orientation-right {
      left: calc(100% + 10px);
    }
    &.orientation-left {
    }
  }
  @media (max-width: 620px) {
    margin-right: 0;
  }
`;
const ChatBubbleQuoteDiv = styled.div`
  //width: 100%;
  //overflow: hidden;
  max-width: 75%;
  position: relative;
  flex-flow: column;
  display: inherit;
  ${(props) => !props.isAuthor === true && "margin-left: 18px"};
  > img {
    // max-height: ${(props) => (props.maxImgHeight > 300 ? `${props.maxImgHeight}px;` : "300px")};
    max-height: 300px;
    max-width: 100%;
    width: auto;
    object-fit: cover;
  }
  .edited-message {
    color: #aab0c8;
    font-style: italic;
    display: flex;
    align-items: center;
    font-size: 12px;
    position: absolute;
    top: 50%;
    margin: 0 10px;
    height: 25px;
    white-space: nowrap;
    ${(props) => (!props.isAuthor ? "left: 100%" : "right: 100%;")};
  }
  .chat-options {
    visibility: hidden;
  }
  .chat-options.active {
    visibility: visible;
  }
  :hover {
    .chat-options {
      visibility: visible;
    }
  }
  @media (max-width: 768px) {
    max-width: calc(100% - 110px);
  }

  @media (max-width: 620px) {
    ${(props) => !props.showAvatar && !props.isAuthor && "margin-left: 0"};
    ${(props) => !props.isAuthor === true && "margin-left: 0"};
  }
`;
const SystemMessageContainer = styled.div`
  position: relative;
  display: inline-flex;
  border-radius: 8px;
  background: #f4f4f4f4;
  text-align: left;
  min-width: 100px;
  max-width: 100%;
  padding: 7px 15px;
  line-height: 1.5rem;
  float: left;
  align-items: center;
  justify-content: flex-end;
  flex-flow: ${(props) => (props.isAuthor ? "row" : "row-reverse")};
  .chat-options {
    visibility: hidden;
  }
  :hover {
    .chat-options {
      visibility: visible;
    }
  }
  @media (max-width: 620px) {
    padding: 7px;
  }
`;

const FailedSpan = styled.span`
  color: red;
  margin: 0 10px;
`;

const ChatLoader = styled.div`
  display: flex;
  justify-content: center;
  &.initial-load {
    position: absolute;
    top: 45%;
    left: 45%;
    transform: translate(-45%, -45%);
  }
`;

const InfiniteScroll = styled.div`
  width: 100%;
  ul {
    margin: 0;
  }
`;

const StyledAvatar = styled(Avatar)`
  align-self: flex-start;
  width: 21px !important;
  height: 21px !important;
  margin-top: ${(props) => (props.isForwardedMessage === true ? "25px" : "4px")};

  img {
    width: 21px !important;
    height: 21px !important;
  }
  @media (max-width: 620px) {
    display: none;
  }
  .pixel-avatar {
    padding-top: 2px !important;
  }
`;

const EmptyState = styled.div`
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  svg {
    max-width: 100%;
    width: 100%;
    max-height: 40%;
    margin: auto;
  }
`;

let lastReplyUserId = 0;

const VirtualizedChat = (props) => {

    const { index, reply, selectedChannel, chatMessageActions, timeFormat, user, messages, isLastChatVisible, recipients, chatSettings, loadReplies, getLoadRef, chatName } = props;

    const lastReply = messages[index - 1];
    const isAuthor = reply && reply.user ? reply.user.id === user.id : false;

    let showAvatar = false;
    let showTimestamp = false;
    let showGifPlayer = false;
    let isBot = false;
    let showMessageLine = false;

    if (reply && reply.user) {
    if (reply.created_at.timestamp) {
        if (index === 0) {
        showTimestamp = true;
        showAvatar = true;
        }
        if (index !== 0 && lastReply && timeFormat.localizeDate(lastReply.created_at.timestamp, "D") !== timeFormat.localizeDate(reply.created_at.timestamp, "D")) {
        showTimestamp = true;
        showAvatar = true;
        }
        if (index !== 0 && lastReply && reply.created_at.timestamp - lastReply.created_at.timestamp > 600) {
        //600 = 10 minutes
        showAvatar = true;
        }
    }

    if (index !== 0 && lastReply && lastReply.is_read === true && reply.is_read === false) {
        showMessageLine = true;
    }
    if (index !== 0 &&  lastReply && lastReply.user === null) {
        showAvatar = true;
    }
    if (lastReplyUserId !== reply.user.id) {
        showAvatar = true;
        lastReplyUserId = reply.user.id;
    }

    if (typeof reply.body !== "undefined" && reply.body !== null) {
        if (reply.body.match(/\.(gif)/g) !== null) {
        showGifPlayer = true;
        }
    }
    let botCodes = ["gripp_bot_account", "gripp_bot_invoice", "gripp_bot_offerte", "gripp_bot_project", "gripp_bot_account", "driff_webhook_bot"];
    isBot = botCodes.includes(reply.user.code);
    }

    return (
        <ChatList
            data-message-id={reply.id}
            data-code={reply.code}
            data-timestamp={reply.created_at.timestamp}
            className={`chat-list chat-list-item-${reply.id} code-${reply.code}`}
            showTimestamp={showTimestamp}
          >
            {showTimestamp && <TimestampDiv className="timestamp-container">{<span>{timeFormat.localizeChatDate(reply.created_at.timestamp, "ddd, MMM DD, YYYY")}</span>}</TimestampDiv>}
            {reply.user && showMessageLine && !isLastChatVisible && <ChatNewMessagesLine />}
            {reply.user && (
              <ChatBubbleContainer
                isAuthor={isAuthor}
                className={`chat-reply-list-item chat-reply-list-item-${reply.id} ${!isAuthor ? "chat-left" : "chat-right"}`}
                data-message-id={reply.id}
                showAvatar={showAvatar}
                isBot={isBot}
                hasGif={showGifPlayer}
                
              >
                {reply.message_failed ? (
                  <FailedSpan>
                    <i className="fas fa-times-circle" onClick={(e) => props.handleResendMessage(reply.payload)}></i>
                  </FailedSpan>
                ) : null}
                <ChatBubbleQuoteDiv isAuthor={isAuthor} showAvatar={showAvatar} className={"chat-bubble-quote-div"}>
                  <ChatBubble
                    chatMessageActions={chatMessageActions}
                    timeFormat={timeFormat}
                    recipients={recipients}
                    user={user}
                    reply={reply}
                    showAvatar={showAvatar}
                    selectedChannel={selectedChannel}
                    showGifPlayer={showGifPlayer}
                    isAuthor={isAuthor}
                    //addMessageRef={getLoadRef(reply.id)}
                    isLastChat={index + 1 === messages.length ? true : null}
                    loadReplies={loadReplies}
                    isBot={isBot}
                    chatSettings={chatSettings}
                    isLastChatVisible={isLastChatVisible}
                    dictionary={props.dictionary}
                  >
                    <ChatActionsContainer isAuthor={isAuthor} className="chat-actions-container">
                      {<ChatReactionButton isAuthor={isAuthor} scrollRef={props.infiniteScrollRef} reply={reply} />}
                      {!isNaN(reply.id) && !reply.is_deleted && <MessageOptions dictionary={props.dictionary} className={"chat-message-options"} selectedChannel={props.selectedChannel} isAuthor={isAuthor} replyData={reply} />}
                    </ChatActionsContainer>
                  </ChatBubble>
                  {reply.reactions.length > 0 && <ChatReactions reactions={reply.reactions} isAuthor={isAuthor} reply={reply} loggedUser={user} chatReactionAction={props.chatReactionV2Action} />}
                  {selectedChannel.last_reply && selectedChannel.last_reply.id === reply.id && props.filterSeenMembers().length > 0 && (
                    <SeenIndicator isAuthor={isAuthor} onClick={props.handleShowSeenUsers} seenMembers={props.filterSeenMembers()} isPersonal={props.selectedChannel.members.length === 2} />
                  )}
                </ChatBubbleQuoteDiv>
  
                {!isAuthor && showAvatar && <StyledAvatar isForwardedMessage={reply.is_transferred} id={reply.user.id} imageLink={reply.user.profile_image_link} name={reply.user.name} isBot={isBot} />}
              </ChatBubbleContainer>
            )}
            {reply.user === null && (
              <ChatBubbleContainer
                className={`chat-reply-list-item system-reply-list-item chat-reply-list-item-${reply.id}`}
                data-message-id={reply.id}
                isAuthor={false}
                hasGif={showGifPlayer}
              >
                <ChatBubbleQuoteDiv
                  isAuthor={isAuthor}
                  showAvatar={showAvatar}
                  className={"chat-bubble-quote-div"}
                >
                  <SystemMessageContainer className="system-message" isAuthor={false}>
                    <SystemMessage 
                        recipients={recipients}
                        user={user}
                        chatMessageActions={chatMessageActions}
                        timeFormat={timeFormat}
                        selectedChannel={selectedChannel}
                        reply={reply}
                        chatName={chatName}
                        //addMessageRef={getLoadRef(reply.id)}
                        isLastChat={index + 1 === messages.length ? true : null} 
                        isLastChatVisible={isLastChatVisible}
                        dictionary={props.dictionary}
                    />
                    {reply.unfurls.length ? (
                      <ChatUnfurl
                        unfurlData={reply.unfurls}
                        isAuthor={false}
                        deleteChatUnfurlAction={props.deleteChatUnfurlAction}
                        removeChatUnfurlAction={props.removeChatUnfurlAction}
                        channelId={props.selectedChannel.id}
                        replyId={reply.id}
                        removeUnfurl={chatMessageActions.removeUnfurl}
                      />
                    ) : null}
                    <SystemChatActionsContainer isAuthor={isAuthor} className="chat-actions-container">
                      {<ChatReactionButton isAuthor={isAuthor} scrollRef={props.infiniteScrollRef} reply={reply} />}
                      {!isNaN(reply.id) && !reply.is_deleted && <MessageOptions dictionary={props.dictionary} replyData={reply} className={"chat-message-options"} selectedChannel={props.selectedChannel} isAuthor={isAuthor} />}
                    </SystemChatActionsContainer>
                  </SystemMessageContainer>
                  {reply.reactions.length > 0 && <ChatReactions reactions={reply.reactions} reply={reply} isAuthor={false} loggedUser={user} chatReactionAction={props.chatReactionV2Action} />}
                </ChatBubbleQuoteDiv>
              </ChatBubbleContainer>
            )}
          </ChatList>
    )
};

export default React.memo(VirtualizedChat);