import { groupBy } from "lodash";
import React from "react";
import { InView } from "react-intersection-observer";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import styled from "styled-components";
import { Avatar, Loader, SvgEmptyState } from "../../common";
import ChatBubble from "./ChatBubble";
import ChatMessageOptions from "./ChatMessageOptions";
import ChatNewMessagesLine from "./ChatNewMessageLine";
import ChatReactionButton from "./ChatReactionButton";
import ChatUnfurl from "./ChatUnfurl";
import ChatReactions from "./Reactions/ChatReactions";
import SeenIndicator from "./SeenIndicator";
import SystemMessage from "./SystemMessage";
import Virtualized from "./Virtualized";

const Wrapper = styled.div`
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
    this.virtuoso = React.createRef();
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
    //this.props.chatMessageActions.channelActions.saveHistoricalPosition(this.props.selectedChannel.id, scrollComponent);
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
        //scrollComponent.scrollTop = scrollComponent.scrollHeight;
      }
      chatMessageActions.fetch(selectedChannel, payload, (err, res) => {
        if (err) {
          chatMessageActions.channelActions.fetchingMessages(selectedChannel, false);
          return;
        }

        if (selectedChannel.replies.length === 0 || selectedChannel.skip === 0) {
            if (this.virtuoso.current) {
                setTimeout(()=> {
                    this.virtuoso.current.scrollToIndex(res.data.results.length - 1, "end")
                }, 0)
            }
        }

        if (this.state.initializing === true) this.setState({ initializing: false });
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

    if (selectedChannel && prevProps.selectedChannel.id === this.props.selectedChannel.id) {
      if (selectedChannel.replies.length !== prevProps.selectedChannel.replies.length) {
        if (selectedChannel.replies.length - prevProps.selectedChannel.replies.length === 1) {
          if (selectedChannel.last_reply && selectedChannel.last_reply.user && selectedChannel.last_reply.user.id !== this.props.user.id) {
            if (!this.props.isLastChatVisible) {
              //receiving other messsage
              //scrollComponent.scrollTop = scrollComponent.scrollHeight - snapshot;
            }
          }
        } else {
          //load more messages
          console.log(scrollComponent, this.virtuoso)
          if (this.virtuoso.current) {
            this.virtuoso.current.adjustForPrependedItems(20)
          }
            //scrollComponent._outerRef.scrollTop = scrollComponent._outerRef.scrollHeight - snapshot
        }
      }
      
    }

    if (this.props.unreadCount > 0 && this.props.isLastChatVisible) {
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

    return (
        <Wrapper id={"component-chat-thread"} className={`component-chat-thread messages ${this.props.className}`} tabIndex="2" data-init={1} data-channel-id={selectedChannel.id}>
          {
          selectedChannel.replies && selectedChannel.replies.length > 0 && 
            <Virtualized
                selectedChannel={selectedChannel}
                loadReplies={this.loadReplies}
                virtuosoRef={this.virtuoso}
                handleResendMessage={this.handleResendMessage}
                filterSeenMembers={this.filterSeenMembers}
                handleShowSeenUsers={this.handleShowSeenUsers}
                recipients={this.props.recipients}
                chatSettings={this.props.settings}
                dictionary={this.props.dictionary}
                chatMessageActions={this.props.chatMessageActions}
                timeFormat={this.props.timeFormat}
                user={this.props.user}
                isLastChatVisible={this.props.isLastChatVisible}
                getLoadRef={this.getLoadRef}
                chatName={this.props.chatName}
            />
          }
          {
              selectedChannel.replies && selectedChannel.replies.length === 0 && !selectedChannel.hasMore &&
              <EmptyState className="no-reply-container"><SvgEmptyState icon={3} /></EmptyState>
          }
        </Wrapper>
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
    isLastChatVisible,
  };
}

export default withRouter(connect(mapStateToProps, null)(ChatMessages));
