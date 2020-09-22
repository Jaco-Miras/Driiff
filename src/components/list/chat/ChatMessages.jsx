import {groupBy} from "lodash";
import React from "react";
import {InView} from "react-intersection-observer";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import styled from "styled-components";
import {Avatar, Loader, SvgEmptyState} from "../../common";
import ChatBubble from "./ChatBubble";
import ChatMessageOptions from "./ChatMessageOptions";
import ChatNewMessagesLine from "./ChatNewMessageLine";
import ChatReactionButton from "./ChatReactionButton";
import ChatUnfurl from "./ChatUnfurl";
import ChatReactions from "./Reactions/ChatReactions";
import SeenIndicator from "./SeenIndicator";
import SystemMessage from "./SystemMessage";

const ChatReplyContainer = styled.div`
  background: transparent;
  background-repeat: repeat;
  height: calc(100% - 181px);
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  z-index: 1;
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
  .mention {
    background: transparent;
    display: inline-block;
    width: auto;
    height: auto;
    padding: 0;
  }
  .mention.is-author {
    background: transparent;
    padding: 0;
  }
`;

const ChatList = styled.li`
  position: relative;
  display: inline-block;
  width: 100%;
  margin-bottom: 5px;
  text-align: center;
  
  .workspace-chat & {
    margin:0 0.5% 5px;  
  }
  
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
  position: relative;
  padding: 0 20px;
  color: #a7abc3;
  padding: 26px 0 14px 0;
  position: sticky;
  top: 0px;
  span {
    padding: 4px 8px;
    border-radius: 4px;
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
  display: flex;
  flex-flow: ${(props) => (props.isAuthor ? "row-reverse" : "row")};
  flex-wrap: wrap;
  ${(props) => (props.isAuthor ? "margin-right: 10px" : "margin-left: 10px")};
  min-width: 150px;
  height: 100%;
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
  display: flex;
  flex-flow: ${(props) => (props.isAuthor ? "row-reverse" : "row")};
  flex-wrap: wrap;
  ${(props) => (props.isAuthor ? "margin-right: 10px" : "margin-left: 10px")};
  min-width: 150px;
  height: 100%;
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

class ChatMessages extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      hasArrowUpListener: false,
      initializing: false,
      loadMoreInView: false,
      fetchingReplies: false,
    };

    this.scrollComponent = React.createRef();
    this.infiniteScroll = React.createRef();
  }

  attachedImgEventListener = () => {
    document.querySelectorAll(".anchor-blot").forEach((el) => {
      const src = el.getAttribute("src");
      if (src) {
        el.addEventListener("mousedown", (e) => {
          window.open(el.getAttribute("src"), "_blank");
        });
        el.classList.remove("anchor-blot");
      }
    });
  };

  attachedClickListenerToChatUrl = () => {
    document.querySelectorAll(".chat-url").forEach((el) => {
      const cid = el.dataset.cid;
      const mid = el.dataset.mid;
      if (cid) {
        el.addEventListener("mousedown", (e) => {
          if (mid) {
            this.props.history.push(`/chat/${cid}/${mid}`);
            let messageEl = document.querySelector(`.code-${mid}`);
            if (messageEl) {
              setTimeout(() => {
                messageEl.scrollIntoView(false);
                messageEl.focus();
                messageEl.classList.add("bounceIn");
                setTimeout(() => {
                  messageEl.classList.remove("bounceIn");
                }, 200);
              }, 200);
            }
          } else {
            this.props.history.push(`/chat/${cid}`);
          }
        });
        el.classList.remove("chat-url");
      }
    });
  };

  componentWillUnmount() {
    const scrollComponent = this.scrollComponent.current;
    console.log("save historical position");
    this.props.chatMessageActions.channelActions.saveHistoricalPosition(this.props.selectedChannel.id, scrollComponent);
    document.removeEventListener("keydown", this.handleEditOnArrowUp, false);
  }

  loadReplies = () => {
    console.log("load more");
    const { selectedChannel, chatMessageActions } = this.props;
    const scrollComponent = this.scrollComponent.current;
    if (!selectedChannel.isFetching && selectedChannel.hasMore) {
      console.log("load more trigger");
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
      if (selectedChannel.skip === 0) {
        scrollComponent.scrollTop = scrollComponent.scrollHeight;
      }
      chatMessageActions.fetch(selectedChannel, payload, (err, res) => {
        if (err) {
          chatMessageActions.channelActions.fetchingMessages(selectedChannel, false);
          return;
        }

        if (selectedChannel.replies.length === 0 || selectedChannel.skip === 0) {
          scrollComponent.scrollTop = scrollComponent.scrollHeight;
          let initialScrollHeight = scrollComponent.scrollHeight;
          console.log("initial load", scrollComponent.scrollHeight);
          setTimeout(() => {
            if (initialScrollHeight < scrollComponent.scrollHeight) {
              scrollComponent.scrollTop = scrollComponent.scrollHeight;
            }
          }, 1000);
        }

        if (this.state.initializing === true) this.setState({ initializing: false });
      });
    }
  };

  handleReadChannel = () => {
    if (this.props.unreadCount > 0) {
      const {
        selectedChannel,
        chatMessageActions: { channelActions },
      } = this.props;

      channelActions.markAsRead(selectedChannel);
    }
  };

  componentDidMount() {
    const { selectedChannel, historicalPositions } = this.props;

    const scrollComponent = this.scrollComponent.current;

    if (historicalPositions.length) {
      historicalPositions.forEach((hp) => {
        if (hp.channel_id === selectedChannel.id && scrollComponent) {
          scrollComponent.scrollTop = scrollComponent.scrollHeight - hp.scrollPosition;
        }
      });
    }

    if (selectedChannel.hasMore) this.loadReplies();

    if (selectedChannel.is_read) {
      this.handleReadChannel();
    }
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    const { selectedChannel } = this.props;
    const scrollComponent = this.scrollComponent.current;
    if (prevProps.selectedChannel) {
      if (scrollComponent) {
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
    let el = document.querySelectorAll(`.mention[data-id="${user.id}"]`);
    if (el.length) {
      el.forEach((mentionEl) => {
        mentionEl.classList.add("is-author");
      });
    }
    const scrollComponent = this.scrollComponent.current;

    //change channel
    if (this.props.selectedChannel && prevProps.selectedChannel.id !== selectedChannel.id) {
      if (selectedChannel.hasMore && selectedChannel.skip === 0) this.loadReplies();
      this.handleReadChannel();

      if (historicalPositions.length) {
        historicalPositions.forEach((hp) => {
          if (hp.channel_id === selectedChannel.id && scrollComponent) {
            console.log("scroll to this", scrollComponent.scrollHeight - hp.scrollPosition, hp.scrollPosition);
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
      if (selectedChannel.replies.length) {
        if (selectedChannel.replies.length - prevProps.selectedChannel.replies.length === 1) {
          if (selectedChannel.last_reply && selectedChannel.last_reply.user && selectedChannel.last_reply.user.id === this.props.user.id) {
            if (scrollComponent) {
              //own user message scroll to bottom after sending
              scrollComponent.scrollTop = scrollComponent.scrollHeight;
            }
          } else if (this.props.isLastChatVisible) {
            if (this.props.isBrowserActive) {
              if (selectedChannel.is_read === 1) {
                this.handleReadChannel();
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

    if (this.props.unreadCount > 0 && this.props.isLastChatVisible) {
      //need clarification if need to trigger if channel is unread
      this.handleReadChannel();
    }

    // intersectionRatio not working propperly
    // const observer = new IntersectionObserver(([e]) => e.target.toggleAttribute("stuck", e.intersectionRatio < 1), { threshold: [1], root: null, rootMargin: "20px" });

    // document.querySelectorAll(".timestamp-container").forEach((element) => observer.observe(element));
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
    this.setState({ loadMoreInView: inView });
  };


  handleMessageRefChange = (inView, entry, id) => {
    const scrollComponent = this.scrollComponent.current;
    if (inView) {
      if (scrollComponent) {
        if (scrollComponent.scrollTop < scrollComponent.scrollHeight * 0.5) {
          this.loadReplies();
        }
      }
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
      let sortedReplies = [...selectedChannel.replies.sort((a, b) => a.created_at.timestamp - b.created_at.timestamp)];
      let index = sortedReplies.findIndex(isEqual);
      if (index < Math.round(sortedReplies.length / 2)) {
        if (index % 2 === 0) {
          loadMoreRef = true;
        }
      }
    }
    return loadMoreRef;
  };

  render() {
    const { selectedChannel } = this.props;

    let lastReplyUserId = 0;

    let groupedMessages = [];

    if (selectedChannel.replies && selectedChannel.replies.length) {
      groupedMessages = Object.entries(
        groupBy(
          selectedChannel.replies.map((r) => {
            if (r.hasOwnProperty("g_date")) {
              return r;
            } else {
              return {
                ...r,
                g_date: this.props.timeFormat.localizeDate(r.created_at.timestamp, "YYYY-MM-DD"),
              };
            }
          }),
          "g_date"
        )
      )
        .map((entries) => {
          return {
            key: entries[0],
            replies: entries[1],
          };
        })
        .sort((a, b) => a.key.localeCompare(b.key));
    }

    return (
      <ChatReplyContainer ref={this.scrollComponent} id={"component-chat-thread"} className={`component-chat-thread messages ${this.props.className}`} tabIndex="2" data-init={1} data-channel-id={selectedChannel.id}>
        {selectedChannel.isFetching && selectedChannel.hasMore && selectedChannel.replies.length === 0 && selectedChannel.skip === 0 && (
          <ChatLoader className={"initial-load"}>
            <Loader />
          </ChatLoader>
        )}
        <InfiniteScroll ref={this.infiniteScroll} className={"infinite-scroll"} id="infinite-scroll-chat-replies">
          {selectedChannel.replies && selectedChannel.replies.length >= 20 && (
            <InView as="div" onChange={(inView, entry) => this.handleLoadMoreRefChange(inView, entry)}>
              <span className="intersection-load-more-ref"></span>
            </InView>
          )}
          <ul>
            {selectedChannel.isFetching && !(selectedChannel.hasMore && selectedChannel.replies.length === 0) && (
              <ChatLoader>
                <Loader />
              </ChatLoader>
            )}
            {selectedChannel.replies && selectedChannel.replies.length
              ? groupedMessages.map((gm, i) => {
                return (
                  <div key={gm.key}>
                    <TimestampDiv className="timestamp-container">{
                      <span>{this.props.timeFormat.localizeChatTimestamp(gm.replies[0].created_at.timestamp, "ddd, MMM DD, YYYY")}</span>}</TimestampDiv>

                    {gm.replies
                      .sort((a, b) => a.created_at.timestamp - b.created_at.timestamp)
                      .map((reply, k, e) => {
                        const isAuthor = reply.user
                          ? selectedChannel.is_shared && this.props.sharedSlugs.length
                            ? this.props.sharedSlugs.filter((s) => s.slug_name === selectedChannel.slug_owner)[0].external_id === reply.user.id
                            : reply.user.id === this.props.user.id
                          : false;

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

                          if (typeof reply.body !== "undefined" && reply.body !== null) {
                            if (reply.body.match(/\.(gif)/g) !== null) {
                              showGifPlayer = true;
                            }
                          }
                          let botCodes = ["gripp_bot_account", "gripp_bot_invoice", "gripp_bot_offerte", "gripp_bot_project", "gripp_bot_account", "driff_webhook_bot"];
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

                        //let animation = false;
                        // if (isAuthor && reply.created_at.diff_for_humans) {
                        //     //animation = true;
                        // } else if (!isAuthor && !reply.is_read) {
                        //     //animation = true;
                        // }

                        return (
                          <ChatList
                            key={reply.id}
                            data-message-id={reply.id}
                            data-code={reply.code}
                            data-timestamp={reply.created_at.timestamp}
                            className={`chat-list chat-list-item-${reply.id} code-${reply.code}`}
                            showTimestamp={showTimestamp}
                          >
                            {reply.user && showMessageLine && this.props.unreadCount > 0 && <ChatNewMessagesLine/>}
                            {reply.user && (
                              <ChatBubbleContainer
                                isAuthor={isAuthor}
                                className={`chat-reply-list-item chat-reply-list-item-${reply.id} ${!isAuthor ? "chat-left" : "chat-right"}`}
                                data-message-id={reply.id}
                                showAvatar={showAvatar}
                                isBot={isBot}
                              >
                                {reply.message_failed ? (
                                  <FailedSpan>
                                    <i className="fas fa-times-circle"
                                       onClick={(e) => this.handleResendMessage(reply.payload)}></i>
                                  </FailedSpan>
                                ) : null}
                                <ChatBubbleQuoteDiv
                                  isAuthor={isAuthor}
                                  showAvatar={showAvatar}
                                  className={"chat-bubble-quote-div"}
                                >
                                  <ChatBubble
                                    recipients={this.props.recipients}
                                    user={this.props.user}
                                    reply={reply}
                                    showAvatar={showAvatar}
                                    selectedChannel={this.props.selectedChannel}
                                    showGifPlayer={showGifPlayer}
                                    isAuthor={isAuthor}
                                    addMessageRef={this.getLoadRef(reply.id)}
                                    removeUnfurl={this.props.chatMessageActions.removeUnfurl}
                                    isLastChat={[...selectedChannel.replies.sort((a, b) => a.created_at.timestamp - b.created_at.timestamp)][selectedChannel.replies.length - 1].id === reply.id}
                                    loadReplies={this.loadReplies}
                                  >
                                    <ChatActionsContainer isAuthor={isAuthor} className="chat-actions-container">
                                      {<ChatReactionButton isAuthor={isAuthor} scrollRef={this.infiniteScroll.current}
                                                           reply={reply}/>}
                                      {!isNaN(reply.id) && !reply.is_deleted && (
                                        <MessageOptions dictionary={this.props.dictionary}
                                                        className={"chat-message-options"}
                                                        selectedChannel={this.props.selectedChannel} isAuthor={isAuthor}
                                                        replyData={reply}/>
                                      )}
                                    </ChatActionsContainer>
                                  </ChatBubble>
                                  {reply.reactions.length > 0 &&
                                  <ChatReactions reactions={reply.reactions} isAuthor={isAuthor} reply={reply}
                                                 loggedUser={this.props.user}
                                                 chatReactionAction={this.props.chatReactionV2Action}/>}
                                  {selectedChannel.last_reply && selectedChannel.last_reply.id === reply.id && this.filterSeenMembers().length > 0 && (
                                    <SeenIndicator isAuthor={isAuthor} onClick={this.handleShowSeenUsers}
                                                   seenMembers={this.filterSeenMembers()}
                                                   isPersonal={this.props.selectedChannel.members.length === 2}/>
                                  )}
                                </ChatBubbleQuoteDiv>

                                {!isAuthor && showAvatar &&
                                <StyledAvatar isForwardedMessage={reply.is_transferred} id={reply.user.id}
                                              imageLink={reply.user.profile_image_link} name={reply.user.name}
                                              isBot={isBot}/>}
                              </ChatBubbleContainer>
                            )}
                            {reply.user === null && (
                              <ChatBubbleContainer
                                className={`chat-reply-list-item system-reply-list-item chat-reply-list-item-${reply.id}`}
                                data-message-id={reply.id}
                                isAuthor={false}
                              >
                                <ChatBubbleQuoteDiv
                                  isAuthor={isAuthor}
                                  showAvatar={showAvatar}
                                  className={"chat-bubble-quote-div"}
                                >
                                  <SystemMessageContainer className="system-message" isAuthor={false}>
                                    <SystemMessage
                                      selectedChannel={this.props.selectedChannel}
                                      reply={reply} chatName={this.props.chatName}
                                      addMessageRef={this.getLoadRef(reply.id)}
                                      isLastChat={[...selectedChannel.replies.sort((a, b) => a.created_at.timestamp - b.created_at.timestamp)][selectedChannel.replies.length - 1].id === reply.id}
                                    />
                                    {reply.unfurls.length ? (
                                      <ChatUnfurl
                                        unfurlData={reply.unfurls}
                                        isAuthor={false}
                                        deleteChatUnfurlAction={this.props.deleteChatUnfurlAction}
                                        removeChatUnfurlAction={this.props.removeChatUnfurlAction}
                                        channelId={this.props.selectedChannel.id}
                                        replyId={reply.id}
                                        removeUnfurl={this.props.chatMessageActions.removeUnfurl}
                                      />
                                    ) : null}
                                    <SystemChatActionsContainer isAuthor={isAuthor} className="chat-actions-container">
                                      {<ChatReactionButton isAuthor={isAuthor} scrollRef={this.infiniteScroll.current}
                                                           reply={reply}/>}
                                      {!isNaN(reply.id) && !reply.is_deleted && (
                                        <MessageOptions
                                          dictionary={this.props.dictionary}
                                          scrollRef={this.scrollComponent}
                                          replyData={reply}
                                          className={"chat-message-options"}
                                          selectedChannel={this.props.selectedChannel}
                                          isAuthor={isAuthor}
                                        />
                                      )}
                                    </SystemChatActionsContainer>
                                  </SystemMessageContainer>
                                  {reply.reactions.length > 0 &&
                                  <ChatReactions reactions={reply.reactions} reply={reply} isAuthor={false}
                                                 loggedUser={this.props.user}
                                                 chatReactionAction={this.props.chatReactionV2Action}/>}
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
            {!this.state.initializing && !selectedChannel.isFetching && selectedChannel.replies && selectedChannel.replies.length < 1 && (
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
    global: { isBrowserActive, recipients, slugs },
    session: { user },
    users: { onlineUsers },
    chat: { historicalPositions, isLastChatVisible },
  } = state;

  return {
    user,
    settings: state.settings.user.CHAT_SETTINGS,
    sharedSlugs: slugs,
    onlineUsers,
    isBrowserActive,
    historicalPositions,
    recipients,
    isLastChatVisible
  };
}

export default withRouter(connect(mapStateToProps, null)(ChatMessages));
