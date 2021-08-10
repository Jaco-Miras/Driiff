import React from "react";
import styled from "styled-components";
import { Avatar } from "../../common";
import ChatBubbleVirtualized from "./ChatBubbleVirtualized";
import ChatMessageOptions from "./ChatMessageOptions";
import ChatNewMessagesLine from "./ChatNewMessageLine";
import ChatReactionButton from "./ChatReactionButton";
//import ChatUnfurl from "./ChatUnfurl";
import ChatReactions from "./Reactions/ChatReactions";
import SeenIndicator from "./SeenIndicator";
import SystemMessageVirtualized from "./SystemMessageVirtualized";
import { FindGifRegex } from "../../../helpers/stringFormatter";
import { useSelector } from "react-redux";

const ChatList = styled.li`
  position: relative;
  display: inline-block;
  width: 100%;
  margin-bottom: ${(props) => (props.isLastChat ? "20px" : "5px")};
  text-align: center;
  .chat-reply-list-item {
    position: relative;
    :before {
      top: 7px;
    }
  }
  .chat-actions-container {
    opacity: 0;

    .star-wrap {
      position: relative;
      display: flex;
      &[data-star="true"] {
        .feather-star {
          fill: #7a1b8bcc;
          color: #7a1b8bcc;
        }
      }
      .feather-star {
        width: 16px;
        height: 16px;
        cursor: pointer;
      }
      .star-count {
        font-size: 0.835rem;
        color: #a7abc3;
        height: 16px;
        line-height: 16px;
        padding: 0 4px;
      }
      .star-user-popup {
        position: absolute;
        width: 250px;
        padding: 4px;
        background-color: #ffffff;
        top: 100%;
        z-index: 1;
        border-top: 1px solid #eeeeee;
        border-radius: 8px;
        color: #4d4d4d;

        .dark & {
          background-color: #25282c;
          border-top: 1px solid #25282c;
          border-radius: 8px;
          color: #c7c7c7;
        }

        .name {
          display: block;
          width: 100%;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
      }

      display: none;
      visibility: hidden;
    }
  }

  &:hover {
    .chat-actions-container {
      opacity: 1;
    }
  }
`;
const TimestampDiv = styled.div`
  z-index: 1;
  display: inline-flex;
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
  &:before {
    ${(props) => props.showAvatar && "content: '';"};
    border: 10px solid transparent;
    border-right-color: ${(props) => (props.isImportant ? "#7B68EE" : props.isExternalChat ? "#FFDB92" : "#f0f0f0")};
    position: absolute;
    top: ${(props) => (props.showAvatar && !props.isAuthor ? "42px" : "6px")};
    left: 30px;
    z-index: 1;
    @media all and (max-width: 620px) {
      display: none;
    }
    ${(props) =>
      props.isAuthor === true &&
      `
            left: auto;
            right: -16px;
            border-left-color:  ${(props) => (props.isImportant ? "#7B68EE" : "#7A1B8B")};
            border-right-color: transparent;
            @media all and (max-width: 620px) {
              display: none;
            }
        `};
  }
  .dark & {
    &:before {
      display: none;
    }
  }
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

  @media (max-width: 620px) {
    margin-right: 0;
  }

  .more-options-tooltip {
    &.orientation-bottom {
      top: calc(100% - 35px);
      @media (max-width: 620px) {
        top: 100%;
      }
    }

    &.orientation-top {
      @media (max-width: 620px) {
        bottom: 30px;
      }
    }

    &.orientation-right {
      left: calc(100% + 10px);
      @media (max-width: 620px) {
        left: 0;
      }
    }
    &.orientation-left {
      @media (max-width: 620px) {
        left: auto;
        right: 0;
      }
    }
  }
`;

const ChatBubbleQuoteDiv = styled.div`
  //width: 100%;
  //overflow: hidden;
  max-width: 75%;
  position: relative;
  flex-flow: column;
  display: inherit;
  margin-left: ${(props) => (props.showAvatar && !props.isAuthor ? "1rem" : "1.6rem")};
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
  @media (max-width: 991.99px) {
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

const StyledAvatar = styled(Avatar)`
  align-self: flex-start;
  width: 2rem !important;
  height: 2rem !important;
  margin-top: ${(props) => (props.isForwardedMessage === true ? "25px" : "0")};

  img {
    width: 2rem !important;
    height: 2rem !important;
  }
  @media (max-width: 620px) {
    display: none;
  }
  .pixel-avatar {
    padding-top: 2px !important;
  }
`;

let lastReplyUserId = 0;

const VirtualizedChat = (props) => {
  const { actualIndex, reply, lastReply, isLastChatVisible, dictionary, timeFormat, chatMessageActions, translate, language, translated_channels, chat_language, scrollComponent } = props;
  const user = useSelector((state) => state.session.user);
  const selectedChannel = useSelector((state) => state.chat.selectedChannel);
  const chatSettings = useSelector((state) => state.settings.user.CHAT_SETTINGS);
  const users = useSelector((state) => state.users.users);

  const previousReply = selectedChannel.replies[actualIndex - 1];

  const isAuthor = reply && reply.user ? reply.user.id === user.id : false;

  let showAvatar = false;
  let showTimestamp = false;
  let showGifPlayer = false;
  let isBot = false;
  let showMessageLine = false;

  if (reply && reply.user) {
    if (reply.created_at.timestamp) {
      if (actualIndex === 0) {
        showTimestamp = true;
        showAvatar = true;
      }
      if (actualIndex !== 0 && previousReply && timeFormat.localizeDate(previousReply.created_at.timestamp, "D") !== timeFormat.localizeDate(reply.created_at.timestamp, "D")) {
        showTimestamp = true;
        showAvatar = true;
      }
      if (actualIndex !== 0 && previousReply && reply.created_at.timestamp - previousReply.created_at.timestamp > 600) {
        //600 = 10 minutes
        showAvatar = true;
      }
    }

    if (actualIndex !== 0 && previousReply && previousReply.is_read === true && reply.is_read === false) {
      showMessageLine = true;
    }
    if (actualIndex !== 0 && previousReply && previousReply.user === null) {
      showAvatar = true;
    }
    if (lastReplyUserId !== reply.user.id) {
      showAvatar = true;
      lastReplyUserId = reply.user.id;
    }
    if (typeof reply.body !== "undefined" && reply.body !== null && reply.body.match(FindGifRegex) !== null) {
      showGifPlayer = true;
    }
    let botCodes = ["gripp_bot_account", "gripp_bot_invoice", "gripp_bot_offerte", "gripp_bot_project", "gripp_bot_account", "driff_webhook_bot"];
    isBot = botCodes.includes(reply.user.code);
  }

  const seenMembers = selectedChannel.members
    .filter((m) => {
      if (selectedChannel.members.length === 2) {
        if (selectedChannel.last_reply && selectedChannel.last_reply.user) {
          if (selectedChannel.last_reply.user.id === user.id) {
            //own user message
            return !(user.id === m.id);
          } else {
            // other user message
            return !(selectedChannel.last_reply.user.id === m.id);
          }
        } else {
          return false;
        }
      } else {
        if (selectedChannel.last_reply && selectedChannel.last_reply.user && selectedChannel.last_reply.user.id === m.id) return false;
        else if (user.id === m.id) return false;
        else return true;
      }
    })
    .filter((m) => {
      if (m.last_visited_at) {
        return m.last_visited_at.timestamp >= selectedChannel.last_reply.created_at.timestamp;
      } else {
        return false;
      }
    });

  return (
    <ChatList data-message-id={reply.id} data-code={reply.code} data-timestamp={reply.created_at.timestamp} className={`chat-list chat-list-item-${reply.id} code-${reply.code}`} showTimestamp={showTimestamp}>
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
            <ChatBubbleVirtualized
              chatMessageActions={chatMessageActions}
              timeFormat={timeFormat}
              user={user}
              reply={reply}
              showAvatar={showAvatar}
              selectedChannel={selectedChannel}
              showGifPlayer={showGifPlayer}
              isAuthor={isAuthor}
              isLastChat={lastReply.id === reply.id}
              chatSettings={chatSettings}
              dictionary={dictionary}
              users={users}
              translate={translate}
              language={language}
              translated_channels={translated_channels}
              chat_language={chat_language}
            />
            <ChatActionsContainer isAuthor={isAuthor} className="chat-actions-container">
              {<ChatReactionButton isAuthor={isAuthor} reply={reply} chatMessageActions={chatMessageActions} scrollComponent={scrollComponent} />}
              {!isNaN(reply.id) && !reply.is_deleted && (
                <MessageOptions dictionary={dictionary} className={"chat-message-options"} selectedChannel={selectedChannel} isAuthor={isAuthor} replyData={reply} scrollComponent={scrollComponent} chatMessageActions={chatMessageActions} />
              )}
            </ChatActionsContainer>

            {reply.reactions.length > 0 && <ChatReactions reactions={reply.reactions} isAuthor={isAuthor} reply={reply} loggedUser={user} chatReactionAction={props.chatReactionV2Action} />}
            {selectedChannel.last_reply && selectedChannel.last_reply.id === reply.id && seenMembers.length > 0 && (
              <SeenIndicator isAuthor={isAuthor} onClick={props.handleShowSeenUsers} seenMembers={seenMembers} isPersonal={selectedChannel.members.length === 2} />
            )}
          </ChatBubbleQuoteDiv>

          {!isAuthor && showAvatar && (
            <StyledAvatar
              isForwardedMessage={reply.is_transferred}
              id={reply.user.id}
              type="USER"
              imageLink={reply.user.profile_image_thumbnail_link ? reply.user.profile_image_thumbnail_link : reply.user.profile_image_link}
              name={reply.user.name}
              isBot={isBot}
            />
          )}
        </ChatBubbleContainer>
      )}
      {reply.user === null && (
        <ChatBubbleContainer className={`chat-reply-list-item system-reply-list-item chat-reply-list-item-${reply.id}`} data-message-id={reply.id} isAuthor={false} hasGif={showGifPlayer}>
          <ChatBubbleQuoteDiv isAuthor={isAuthor} showAvatar={showAvatar} className={"chat-bubble-quote-div"}>
            <SystemMessageContainer className="system-message" isAuthor={false}>
              <SystemMessageVirtualized
                user={user}
                chatMessageActions={chatMessageActions}
                timeFormat={timeFormat}
                selectedChannel={selectedChannel}
                reply={reply}
                isLastChat={lastReply.id === reply.id}
                dictionary={dictionary}
                users={users}
              />
              <SystemChatActionsContainer isAuthor={isAuthor} className="chat-actions-container">
                {<ChatReactionButton isAuthor={isAuthor} reply={reply} chatMessageActions={chatMessageActions} scrollComponent={scrollComponent} />}
                {!isNaN(reply.id) && !reply.is_deleted && (
                  <MessageOptions
                    dictionary={dictionary}
                    replyData={reply}
                    className={"chat-message-options"}
                    selectedChannel={selectedChannel}
                    isAuthor={isAuthor}
                    scrollComponent={scrollComponent}
                    chatMessageActions={chatMessageActions}
                  />
                )}
              </SystemChatActionsContainer>
            </SystemMessageContainer>
            {reply.reactions.length > 0 && <ChatReactions reactions={reply.reactions} reply={reply} isAuthor={false} loggedUser={user} chatReactionAction={props.chatReactionV2Action} />}
          </ChatBubbleQuoteDiv>
        </ChatBubbleContainer>
      )}
    </ChatList>
  );
};

export default React.memo(VirtualizedChat);
