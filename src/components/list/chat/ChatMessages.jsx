import { groupBy } from "lodash";
import React, { lazy, Suspense } from "react";
import { InView } from "react-intersection-observer";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import styled from "styled-components";
import { Avatar, Loader, SvgEmptyState } from "../../common";
//import ChatBubble from "./ChatBubble";
import ChatMessageOptions from "./ChatMessageOptions";
import ChatNewMessagesLine from "./ChatNewMessageLine";
import ChatReactionButton from "./ChatReactionButton";
//import ChatUnfurl from "./ChatUnfurl";
import ChatReactions from "./Reactions/ChatReactions";
import SeenIndicator from "./SeenIndicator";
//import SystemMessage from "./SystemMessage";
import { FindGifRegex } from "../../../helpers/stringFormatter";

const ChatBubble = lazy(() => import("./ChatBubble"));
const SystemMessage = lazy(() => import("./SystemMessage"));

const ChatReplyContainer = styled.div`
  background: transparent;
  background-repeat: repeat;
  height: calc(100% - 125px);
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  //z-index: 1;
  scrollbar-width: none;
  > ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .chat-message-options svg {
    fill: currentColor;
  }
  &.is-processed {
    opacity: 0;
  }
`;

const ChatList = styled.li`
  position: relative;
  display: inline-block;
  width: 100%;
  margin-bottom: ${(props) => (props.isLastChat ? "20px" : "5px")};
  text-align: center;
  .chat-actions-container {
    opacity: 0;
  }

  &:hover {
    .chat-actions-container {
      opacity: 1;
    }
  }
  &.pulsating div.chat-bubble {
    animation: blinker 2s linear forwards;
    @keyframes blinker {
      50% {
        opacity: 0.5;
      }
    }
  }
`;
const TimestampDiv = styled.div`
  z-index: 2;
  color: #a7abc3;
  display: inline-block;
  left: 50%;
  position: sticky;
  top: 10px;
  transform: translateX(-50%);
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
`;
const ChatBubbleContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
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
      ${(props) => props.showAvatar && "content: '';"};
      border: 10px solid transparent;
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
            border-right-color: transparent;
            @media all and (max-width: 620px) {
              display: none;
            }
        `};
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

class ChatMessages extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasArrowUpListener: false,
      //initializing: false,
      loadMoreInView: false,
      fetchingReplies: false,
      showEmoji: {},
    };

    //this.props.scrollComponent = React.createRef();
    this.infiniteScroll = React.createRef();
    this.mouseOver = React.createRef(false);
  }

  componentWillUnmount() {
    const scrollComponent = this.props.scrollComponent.current;
    this.props.chatMessageActions.channelActions.saveHistoricalPosition(this.props.selectedChannel.id, scrollComponent);
  }

  loadReplies = () => {
    const { selectedChannel, chatMessageActions } = this.props;
    const scrollComponent = this.props.scrollComponent.current;
    if (!selectedChannel.isFetching && selectedChannel.hasMore) {
      chatMessageActions.channelActions.fetchingMessages(selectedChannel, true);
      let payload = {
        skip: 0,
        limit: 20,
      };

      if (typeof selectedChannel.replies !== "undefined") {
        payload = {
          skip: selectedChannel.skip === 0 && selectedChannel.replies.length ? selectedChannel.replies.length : selectedChannel.skip,
          limit: 20,
        };
      }
      chatMessageActions.fetch(selectedChannel, payload, (err, res) => {
        if (err) {
          chatMessageActions.channelActions.fetchingMessages(selectedChannel, false);
          return;
        }

        if ((selectedChannel.replies.length === 0 || selectedChannel.skip === 0) && typeof this.props.history.location.state !== "object") {
          scrollComponent.scrollTop = scrollComponent.scrollHeight;
          let initialScrollHeight = scrollComponent.scrollHeight;
          setTimeout(() => {
            if (initialScrollHeight < scrollComponent.scrollHeight) {
              scrollComponent.scrollTop = scrollComponent.scrollHeight;
            }
          }, 1000);
        }
      });
    }
  };

  handleReadChannel = () => {
    if (this.props.unreadCount > 0 || this.props.selectedChannel.total_unread > 0) {
      const {
        selectedChannel,
        chatMessageActions: { channelActions },
      } = this.props;

      channelActions.markAsRead(selectedChannel);
    }
  };

  componentDidMount() {
    const { selectedChannel, historicalPositions } = this.props;

    const scrollComponent = this.props.scrollComponent.current;

    if (typeof this.props.history.location.state !== "object") {
      if (historicalPositions.length) {
        historicalPositions.forEach((hp) => {
          if (hp.channel_id === selectedChannel.id && scrollComponent) {
            scrollComponent.scrollTop = scrollComponent.scrollHeight - hp.scrollPosition;
          }
        });
      } else {
        if (scrollComponent) {
          scrollComponent.scrollTop = scrollComponent.scrollHeight;
        }
      }
    }

    if (selectedChannel.hasMore && selectedChannel.skip === 0) this.loadReplies();

    if (selectedChannel.is_read) {
      this.handleReadChannel();
    }
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    const { selectedChannel } = this.props;
    const scrollComponent = this.props.scrollComponent.current;
    if (prevProps.selectedChannel) {
      if (prevProps.selectedChannel && prevProps.selectedChannel.replies && selectedChannel.replies && scrollComponent) {
        if ((selectedChannel.replies.length > 20) & (prevProps.selectedChannel.replies.length < selectedChannel.replies.length)) {
          if (selectedChannel.replies.length - prevProps.selectedChannel.replies.length >= 2) {
            return scrollComponent.scrollHeight - scrollComponent.scrollTop;
          }
        }
      }
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { selectedChannel, historicalPositions, user } = this.props;

    //to be relocated
    // let el = document.querySelectorAll(`.mention[data-id="${user.id}"]`);
    // if (el.length) {
    //   el.forEach((mentionEl) => {
    //     mentionEl.classList.add("is-author");
    //   });
    // }
    const scrollComponent = this.props.scrollComponent.current;

    //change channel
    if (this.props.selectedChannel && prevProps.selectedChannel.id !== selectedChannel.id) {
      // this.props.chatMessageActions.channelActions.fetchUnpublishedAnswers({ channel_id: selectedChannel.id });
      if (selectedChannel.hasMore && selectedChannel.skip === 0) this.loadReplies();
      this.handleReadChannel();

      if (historicalPositions.length) {
        historicalPositions.forEach((hp) => {
          if (hp.channel_id === selectedChannel.id && scrollComponent) {
            scrollComponent.scrollTop = scrollComponent.scrollHeight - hp.scrollPosition;
          }
        });
      }
    }

    if (selectedChannel && prevProps.selectedChannel.id === this.props.selectedChannel.id) {
      if (snapshot !== null && selectedChannel.replies.length !== prevProps.selectedChannel.replies.length) {
        if (selectedChannel.replies.length - prevProps.selectedChannel.replies.length === 1) {
          if (selectedChannel.last_reply && selectedChannel.last_reply.user && selectedChannel.last_reply.user.id !== this.props.user.id) {
            if (!this.props.isLastChatVisible) {
              //receiving other messsage
              scrollComponent.scrollTop = scrollComponent.scrollHeight - snapshot;
            }
          }
        } else {
          //load more messages
          scrollComponent.scrollTop = scrollComponent.scrollHeight - snapshot;
        }
      }
      // has replies
      if (selectedChannel.replies && selectedChannel.replies.length) {
        if (selectedChannel.replies.length - prevProps.selectedChannel.replies.length === 1) {
          if (selectedChannel.last_reply && selectedChannel.last_reply.user && selectedChannel.last_reply.user.id === this.props.user.id) {
            if (scrollComponent) {
              //own user message scroll to bottom after sending
              scrollComponent.scrollTop = scrollComponent.scrollHeight;
            }
          } else if (this.props.isLastChatVisible) {
            if (!this.props.isIdle && this.props.isBrowserActive && document.hasFocus()) {
              if (selectedChannel.is_read) {
                this.props.chatMessageActions.channelActions.markAsRead(selectedChannel);
              }
              if (scrollComponent) {
                //other user message scroll to bottom after receiving
                scrollComponent.scrollTop = scrollComponent.scrollHeight;
              }
            }
          }
        }
      }
    }

    if (this.props.unreadCount > 0 && this.props.isLastChatVisible && !this.props.isIdle && this.props.isBrowserActive && document.hasFocus()) {
      //need clarification if need to trigger if channel is unread
      this.handleReadChannel();
    }
  }

  handleResendMessage = (payload) => {
    this.props.createChatMessageV2Action(payload, (err, res) => {
      if (err) {
        this.props.onFailedMessageSend(payload);
      }
    });
  };

  handleRemoveReply = (reply) => {
    this.props.cbOnRemoveReply(reply);
  };

  handleEditReply = (reply) => {
    this.props.onEditReply(reply);
  };

  handleQuoteReply = (reply) => {
    this.props.onSelectQuote(reply);
  };

  handleLoadMoreRefChange = (inView, entry) => {
    if (inView) {
      this.loadReplies();
    }
  };

  handleShowSeenUsers = () => this.setState({ showSeenUsers: !this.state.showSeenUsers });

  filterSeenMembers = () => {
    return this.props.selectedChannel.members
      .filter((m) => {
        if (this.props.selectedChannel.members.length === 2) {
          if (this.props.selectedChannel.last_reply && this.props.selectedChannel.last_reply.user) {
            if (this.props.selectedChannel.last_reply.user.id === this.props.user.id) {
              //own user message
              return !(this.props.user.id === m.id);
            } else {
              // other user message
              return !(this.props.selectedChannel.last_reply.user.id === m.id);
            }
          } else {
            return false;
          }
        } else {
          if (this.props.selectedChannel.last_reply && this.props.selectedChannel.last_reply.user && this.props.selectedChannel.last_reply.user.id === m.id) return false;
          else if (this.props.user.id === m.id) return false;
          else return true;
        }
      })
      .filter((m) => {
        if (m.last_visited_at) {
          return m.last_visited_at.timestamp >= this.props.selectedChannel.last_reply.created_at.timestamp;
        } else {
          return false;
        }
      });
  };

  getLoadRef = (id) => {
    const { selectedChannel } = this.props;
    let loadMoreRef = false;
    const isEqual = (reply) => reply.id === id;
    if (selectedChannel.replies.length && !selectedChannel.isFetching) {
      //let sortedReplies = [...selectedChannel.replies.sort((a, b) => a.created_at.timestamp - b.created_at.timestamp)];
      //let index = sortedReplies.findIndex(isEqual);
      let index = selectedChannel.replies.findIndex(isEqual);
      if (index < Math.round(selectedChannel.replies.length / 2)) {
        if (index % 2 === 0) {
          loadMoreRef = true;
        }
      }
    }
    return loadMoreRef;
  };

  sortedReplies = () => {
    return this.props.selectedChannel.replies
      .map((r) => {
        if (r.hasOwnProperty("g_date")) {
          return r;
        } else {
          return {
            ...r,
            g_date: this.props.timeFormat.localizeDate(r.created_at.timestamp, "YYYY-MM-DD"),
          };
        }
      })
      .sort((a, b) => {
        if (a.created_at.timestamp - b.created_at.timestamp === 0) {
          return a.id - b.id;
        } else {
          return a.created_at.timestamp - b.created_at.timestamp;
        }
      });
  };

  isLastChat = (reply) => {
    const sortedReplies = this.sortedReplies();
    return sortedReplies[this.props.selectedChannel.replies.length - 1].id === reply.id;
  };

  groupedMessages = () =>
    Object.entries(groupBy(this.sortedReplies(), "g_date"))
      .map((entries) => {
        return {
          key: entries[0],
          replies: entries[1],
        };
      })
      .sort((a, b) => a.key.localeCompare(b.key));

  render() {
    //const { selectedChannel } = this.props;

    let lastReplyUserId = 0;

    // let groupedMessages = [];

    // if (this.props.selectedChannel.replies && this.props.selectedChannel.replies.length) {
    //   groupedMessages = Object.entries(
    //     groupBy(
    //       this.props.selectedChannel.replies.map((r) => {
    //         if (r.hasOwnProperty("g_date")) {
    //           return r;
    //         } else {
    //           return {
    //             ...r,
    //             g_date: this.props.timeFormat.localizeDate(r.created_at.timestamp, "YYYY-MM-DD"),
    //           };
    //         }
    //       }),
    //       "g_date"
    //     )
    //   )
    //     .map((entries) => {
    //       return {
    //         key: entries[0],
    //         replies: entries[1],
    //       };
    //     })
    //     .sort((a, b) => a.key.localeCompare(b.key));
    // }

    return (
      <ChatReplyContainer
        ref={this.props.scrollComponent}
        id={"component-chat-thread"}
        className={`component-chat-thread messages ${this.props.className}`}
        tabIndex="2"
        //data-init={1} data-channel-id={this.props.selectedChannel.id}
      >
        {this.props.selectedChannel.isFetching && this.props.selectedChannel.hasMore && this.props.selectedChannel.replies.length === 0 && this.props.selectedChannel.skip === 0 && (
          <ChatLoader className={"initial-load"}>
            <Loader />
          </ChatLoader>
        )}
        <InfiniteScroll ref={this.infiniteScroll} className={"infinite-scroll"} id="infinite-scroll-chat-replies">
          {this.props.selectedChannel.replies && this.props.selectedChannel.replies.length >= 20 && (
            <InView as="div" onChange={(inView, entry) => this.handleLoadMoreRefChange(inView, entry)}>
              <span className="intersection-load-more-ref"></span>
            </InView>
          )}
          <ul>
            {this.props.selectedChannel.replies && this.props.selectedChannel.replies.length
              ? this.groupedMessages().map((gm, i) => {
                  return (
                    <div key={`${gm.replies[0].created_at.timestamp}`}>
                      <TimestampDiv className="timestamp-container">{<span>{this.props.timeFormat.localizeChatDate(gm.replies[0].created_at.timestamp, "ddd, MMM DD, YYYY")}</span>}</TimestampDiv>

                      {gm.replies
                        // .sort((a, b) => a.created_at.timestamp - b.created_at.timestamp)
                        .map((reply, k, e) => {
                          const isAuthor = reply.user && reply.user.id === this.props.user.id;

                          let showAvatar = false;
                          let showTimestamp = false;
                          let showGifPlayer = false;
                          let isBot = false;
                          let showMessageLine = false;

                          if (reply.user) {
                            if (reply.created_at.timestamp) {
                              if (k === 0) {
                                showTimestamp = true;
                                showAvatar = true;
                              }
                              if (k !== 0 && this.props.timeFormat.localizeDate(e[k - 1].created_at.timestamp, "D") !== this.props.timeFormat.localizeDate(reply.created_at.timestamp, "D")) {
                                showTimestamp = true;
                                showAvatar = true;
                              }
                              if (k !== 0 && reply.created_at.timestamp - e[k - 1].created_at.timestamp > 600) {
                                //600 = 10 minutes
                                showAvatar = true;
                              }
                            }

                            if (k !== 0 && e[k - 1].is_read === true && reply.is_read === false) {
                              showMessageLine = true;
                            }
                            if (k !== 0 && e[k - 1].user === null) {
                              showAvatar = true;
                            }
                            if (lastReplyUserId !== reply.user.id) {
                              showAvatar = true;
                              lastReplyUserId = reply.user.id;
                            }

                            if (typeof reply.body !== "undefined" && reply.body !== null && reply.body.match(FindGifRegex) !== null) {
                              showGifPlayer = true;
                            }
                            let botCodes = ["gripp_bot_account", "gripp_bot_invoice", "gripp_bot_offerte", "gripp_bot_project", "gripp_bot_account", "driff_webhook_bot", "huddle_bot"];
                            isBot = botCodes.includes(reply.user.code);
                          } else {
                            //remove duplicate messages from bot
                            if (k !== 0) {
                              let prevReply = gm.replies[k - 1];
                              if (prevReply.body === reply.body) {
                                if (Math.abs(reply.created_at.timestamp - prevReply.created_at.timestamp) <= 10) return <></>;
                              }
                            }
                          }
                          return (
                            <ChatList
                              key={reply.id}
                              // data-message-id={reply.id}
                              // data-code={reply.code}
                              // data-timestamp={reply.created_at.timestamp}
                              className={`chat-list chat-list-item-${reply.id} code-${reply.code} `}
                              showTimestamp={showTimestamp}
                              isLastChat={this.isLastChat(reply)}
                            >
                              {reply.user && showMessageLine && this.props.unreadCount > 0 && <ChatNewMessagesLine />}
                              {reply.user && (
                                <ChatBubbleContainer
                                  isAuthor={isAuthor}
                                  className={`chat-reply-list-item chat-reply-list-item-${reply.id} ${!isAuthor ? "chat-left" : "chat-right"}`}
                                  //data-message-id={reply.id}
                                  showAvatar={showAvatar}
                                  isBot={isBot}
                                  isImportant={reply.is_important}
                                  isExternalChat={reply.user && this.props.users[reply.user.id] && this.props.users[reply.user.id].type === "external" && !isAuthor}
                                >
                                  {reply.message_failed ? (
                                    <FailedSpan>
                                      <i className="fas fa-times-circle" onClick={(e) => this.handleResendMessage(reply.payload)}></i>
                                    </FailedSpan>
                                  ) : null}
                                  <ChatBubbleQuoteDiv isAuthor={isAuthor} showAvatar={showAvatar} className={"chat-bubble-quote-div"}>
                                    <Suspense fallback={<div></div>}>
                                      <ChatBubble
                                        chatMessageActions={this.props.chatMessageActions}
                                        timeFormat={this.props.timeFormat}
                                        user={this.props.user}
                                        reply={reply}
                                        showAvatar={showAvatar}
                                        selectedChannel={this.props.selectedChannel}
                                        showGifPlayer={showGifPlayer}
                                        isAuthor={isAuthor}
                                        addMessageRef={this.getLoadRef(reply.id)}
                                        isLastChat={this.isLastChat(reply)}
                                        loadReplies={this.loadReplies}
                                        //isBot={isBot}
                                        chatSettings={this.props.settings}
                                        isLastChatVisible={this.props.isLastChatVisible}
                                        dictionary={this.props.dictionary}
                                        users={this.props.users}
                                        translate={this.props.translate}
                                        language={this.props.language}
                                        translated_channels={this.props.translated_channels}
                                        chat_language={this.props.chat_language}
                                      >
                                        <ChatActionsContainer isAuthor={isAuthor} className="chat-actions-container">
                                          {<ChatReactionButton isAuthor={isAuthor} reply={reply} showEmojiSwitcher={this.state.showEmoji[reply.id]} />}
                                          {!isNaN(reply.id) && !reply.is_deleted && (
                                            <MessageOptions
                                              dictionary={this.props.dictionary}
                                              className={"chat-message-options"}
                                              selectedChannel={this.props.selectedChannel}
                                              isAuthor={isAuthor}
                                              replyData={reply}
                                              teamChannelId={this.props.teamChannelId}
                                              isExternalUser={this.props.user.type === "external"}
                                            />
                                          )}
                                        </ChatActionsContainer>
                                      </ChatBubble>
                                    </Suspense>
                                    {reply.reactions.length > 0 && <ChatReactions reactions={reply.reactions} isAuthor={isAuthor} reply={reply} loggedUser={this.props.user} chatReactionAction={this.props.chatReactionV2Action} />}
                                    {this.props.selectedChannel.last_reply && this.props.selectedChannel.last_reply.id === reply.id && this.filterSeenMembers().length > 0 && (
                                      <SeenIndicator isAuthor={isAuthor} onClick={this.handleShowSeenUsers} seenMembers={this.filterSeenMembers()} isPersonal={this.props.selectedChannel.members.length === 2} />
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
                                      isHuddleBot={reply.user.code === "huddle_bot"}
                                      showSlider={true}
                                    />
                                  )}
                                </ChatBubbleContainer>
                              )}
                              {reply.user === null && (
                                <ChatBubbleContainer
                                  className={`chat-reply-list-item system-reply-list-item chat-reply-list-item-${reply.id}`}
                                  //data-message-id={reply.id}
                                  isAuthor={false}
                                >
                                  <ChatBubbleQuoteDiv isAuthor={isAuthor} showAvatar={showAvatar} className={"chat-bubble-quote-div"}>
                                    <SystemMessageContainer className="system-message" isAuthor={false}>
                                      <Suspense fallback={<div></div>}>
                                        <SystemMessage
                                          user={this.props.user}
                                          chatMessageActions={this.props.chatMessageActions}
                                          timeFormat={this.props.timeFormat}
                                          selectedChannel={this.props.selectedChannel}
                                          reply={reply}
                                          addMessageRef={this.getLoadRef(reply.id)}
                                          isLastChat={this.isLastChat(reply)}
                                          isLastChatVisible={this.props.isLastChatVisible}
                                          dictionary={this.props.dictionary}
                                          users={this.props.users}
                                        />
                                      </Suspense>
                                      {/* {reply.unfurls.length ? (
                                          <ChatUnfurl
                                            unfurlData={reply.unfurls}
                                            isAuthor={false}
                                            deleteChatUnfurlAction={this.props.deleteChatUnfurlAction}
                                            removeChatUnfurlAction={this.props.removeChatUnfurlAction}
                                            channelId={this.props.this.props.selectedChannel.id}
                                            replyId={reply.id}
                                          />
                                        ) : null} */}
                                      <SystemChatActionsContainer isAuthor={isAuthor} className="chat-actions-container">
                                        {<ChatReactionButton isAuthor={isAuthor} reply={reply} showEmojiSwitcher={this.state.showEmoji[reply.id]} />}
                                        {!isNaN(reply.id) && !reply.is_deleted && (
                                          <MessageOptions
                                            dictionary={this.props.dictionary}
                                            scrollRef={this.props.scrollComponent}
                                            replyData={reply}
                                            className={"chat-message-options"}
                                            selectedChannel={this.props.selectedChannel}
                                            isAuthor={isAuthor}
                                            teamChannelId={this.props.teamChannelId}
                                            isExternalUser={this.props.user.type === "external"}
                                          />
                                        )}
                                      </SystemChatActionsContainer>
                                    </SystemMessageContainer>
                                    {reply.reactions.length > 0 && <ChatReactions reactions={reply.reactions} reply={reply} isAuthor={false} loggedUser={this.props.user} chatReactionAction={this.props.chatReactionV2Action} />}
                                  </ChatBubbleQuoteDiv>
                                </ChatBubbleContainer>
                              )}
                            </ChatList>
                          );
                        })}
                    </div>
                  );
                })
              : null}
            {!this.props.selectedChannel.isFetching && this.props.selectedChannel.replies && this.props.selectedChannel.replies.length < 1 && (
              <EmptyState className="no-reply-container">
                <SvgEmptyState icon={3} />
              </EmptyState>
            )}
          </ul>
        </InfiniteScroll>
      </ChatReplyContainer>
    );
  }
}

function mapStateToProps(state) {
  const {
    global: { isIdle, isBrowserActive },
    session: { user },
    chat: { historicalPositions, isLastChatVisible, selectedChannel },
    users: { users },
  } = state;

  return {
    user,
    settings: state.settings.user.CHAT_SETTINGS,
    historicalPositions,
    isLastChatVisible,
    users,
    isIdle,
    isBrowserActive,
    selectedChannel,
  };
}

export default withRouter(connect(mapStateToProps, null)(ChatMessages));
