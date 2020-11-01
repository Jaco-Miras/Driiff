import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import styled from "styled-components";
import { SvgEmptyState } from "../../common";
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
    const scrollComponent = document.querySelector(".chat-scroll-container")
    console.log("save historical position");
    if (scrollComponent) {
      this.props.chatMessageActions.channelActions.saveHistoricalPosition(this.props.selectedChannel.id, scrollComponent);
    }
    document.removeEventListener("keydown", this.handleEditOnArrowUp, false);
  }

  loadReplies = () => {
    console.log("load more virtuoso");
    const { selectedChannel, chatMessageActions } = this.props;
    if (!selectedChannel.isFetching && selectedChannel.hasMore) {
      console.log("load more trigger virtuoso");
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
          this.setState({scrollingToBottom: true}, () => {
            const scrollComponent = document.querySelector(".chat-scroll-container")
            if (scrollComponent) {
              setTimeout(() => {
                scrollComponent.scrollTop = scrollComponent.scrollHeight;
              }, 300)
            }
          })
        } else {
          if (this.virtuoso.current) {
            this.virtuoso.current.adjustForPrependedItems(res.data.results.length)
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

    if (historicalPositions.length) {
      historicalPositions.forEach((hp) => {
        if (hp.channel_id === selectedChannel.id) {
          //scrollComponent.scrollTop = scrollComponent.scrollHeight - hp.scrollPosition;
          this.setState({restoringScroll: true}, () => {
            const scrollComponent = document.querySelector(".chat-scroll-container")
            console.log(scrollComponent, 'restore this')
            if (scrollComponent) {
              scrollComponent.scrollTop = scrollComponent.scrollHeight - hp.scrollPosition;
            }
          })
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
    //const scrollComponent = this.scrollComponent.current;
    const scrollComponent = document.querySelector(".chat-scroll-container")
    
    if (prevProps.selectedChannel) {
      if (scrollComponent) {
        if ((selectedChannel.replies.length > 20) & (prevProps.selectedChannel.replies.length < selectedChannel.replies.length)) {
          if (selectedChannel.replies.length - prevProps.selectedChannel.replies.length >= 2) {
            console.log('snapshot', scrollComponent.scrollHeight, scrollComponent.scrollTop)
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
    // const scrollComponent = this.scrollComponent.current;
    const scrollComponent = document.querySelector(".chat-scroll-container")
    //change channel
    if (this.props.selectedChannel && prevProps.selectedChannel.id !== selectedChannel.id) {
      if (selectedChannel.hasMore && selectedChannel.skip === 0) this.loadReplies();
      this.handleReadChannel();

      if (historicalPositions.length) {
        historicalPositions.forEach((hp) => {
          if (hp.channel_id === selectedChannel.id && scrollComponent) {
            console.log("scroll to this", scrollComponent.scrollHeight - hp.scrollPosition, hp.scrollPosition);
            this.setState({restoringScroll: true}, () => {
              scrollComponent.scrollTop = scrollComponent.scrollHeight - hp.scrollPosition;
            })
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
          console.log(snapshot, 'didupdate',  scrollComponent.scrollHeight, scrollComponent.scrollHeight - snapshot)
          this.setState({restoringScroll: true}, () => {
            scrollComponent.scrollTop = scrollComponent.scrollHeight - snapshot;
          })
        }
      }
      // has replies
      if (selectedChannel.replies.length) {
        if (selectedChannel.replies.length - prevProps.selectedChannel.replies.length === 1) {
          if (selectedChannel.last_reply && selectedChannel.last_reply.user && selectedChannel.last_reply.user.id === this.props.user.id) {
            this.setState({scrollingToBottom: true}, () => {
              if (scrollComponent) {
                //own user message
                scrollComponent.scrollTop = scrollComponent.scrollHeight;
              }
            })
          } else if (this.props.isLastChatVisible) {
            if (this.props.isBrowserActive) {
              if (selectedChannel.is_read) {
                this.handleReadChannel();
              }
              //other user message scroll to bottom after receiving
              this.setState({scrollingToBottom: true}, () => {
                if (scrollComponent) {
                  scrollComponent.scrollTop = scrollComponent.scrollHeight;
                }
              })
            }
          }
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
