import {groupBy} from "lodash";
import React from "react";
import {InView} from "react-intersection-observer";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import styled from "styled-components";
import {localizeChatTimestamp, localizeDate} from "../../../helpers/momentFormatJS";
import {Avatar, Loader} from "../../common";
import NoReply from "../../common/NoReply";
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
  .intersection-bottom-ref {
        //visibility: hidden;
        font-size: .5rem;
        color: transparent;
  }
  .mention {
    background: transparent;
    display: inline-block;
    width: auto;
    height: auto;
    ${"" /* color: #ffffff; */}
    padding: 0;
  }
  .mention.is-author {
    ${"" /* color: #7A1B8B; */}
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
    z-index: 10;
    position: sticky;
    top: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    padding: 0 20px;
    color: #a7abc3;
    margin: 20px 0;
    &:before, &:after {
        content: '';
        display: block;
        height: 1px;
        background-color: #e1e1e1;
        flex: 1;
    }
    span {

        padding: 5px 10px;
        border-radius: 5px;
        display: inline-block;
        font-size: 11px;
    }
`;
const ChatBubbleContainer = styled.div`
    display: flex;
    width: 100%;
    align-items: center;
    //align-items: ${props => props.isAuthor ? "flex-end" : "flex-start"};
    justify-content: flex-end;
    flex-flow: column;
    flex-flow: ${props => (props.isAuthor ? "row" : "row-reverse")};
    margin-left: ${props => (!props.isAuthor && !props.showAvatar) || (!props.isAuthor && props.showAvatar && props.isBot) ? "22px" : "0"};
    ${props => (props.isAuthor === true && "position: relative; right: 15px;")};
    margin-top: ${props => ((props.showAvatar) && "36px")};
    margin-top: ${props => ((props.showAvatar && props.isAuthor) && "20px")};

    ${props => (!props.isEmoticonOnly && `
    &:before {
        ${props => (props.showAvatar && "content: '';")};
        border: 10px solid transparent;
        border-right-color: transparent;
        border-right-color: #f0f0f0;
        position: absolute;
        top: ${props => ((props.showAvatar && !props.isAuthor) ? "42px" : "8px")};;
        left: 20px;
        z-index: 1;
        ${props => (props.isAuthor === true && `
            left: auto;
            right: -20px;
            border-left-color: #7A1B8B;
            border-right-color: transparent;
        `)};
    }`)}
`;
const ChatActionsContainer = styled.div`
    display: flex;
    flex-flow: ${props => (props.isAuthor ? "row-reverse" : "row")};
    flex-wrap: wrap;
    ${props => (props.isAuthor ? "margin-right: 10px" : "margin-left: 10px")};
    min-width: 150px;
    height: 100%;
    color: #a7abc3;
    background: #ffffff;
    position: absolute;
    display: flex;
    align-items: center;
    top: 0;
    ${props => (props.isAuthor ? "right: 100%" : "left: 100%")};
    height: calc(100% + 4px);
    margin-top: -2px;
    transition: opacity 0.3s ease;
`;
const SystemChatActionsContainer = styled.div`
    ${"" /* display: flex;
 flex-direction: row;
 flex-wrap: wrap;
 ${props => (props.isAuthor ? "margin-right: 10px" : "margin-left: 10px")}; */}

    display: flex;
    flex-flow: ${props => (props.isAuthor ? "row-reverse" : "row")};
    flex-wrap: wrap;
    ${props => (props.isAuthor ? "margin-right: 10px" : "margin-left: 10px")};
    min-width: 150px;
    height: 100%;
    color: #a7abc3;
    background: #ffffff;
    position: absolute;
    display: flex;
    align-items: center;
    top: 0;
    ${props => (props.isAuthor ? "right: 100%" : "left: 100%")};
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
`;
const ChatBubbleQuoteDiv = styled.div`
  //width: 100%;
  //overflow: hidden;
  max-width: 75%;
  position: relative;
  flex-flow: column;
  display: inherit;
  ${props => (!props.isAuthor === true && "margin-left: 18px")};
  > img {
    // max-height: ${props => props.maxImgHeight > 300 ? `${props.maxImgHeight}px;` : "300px"};
    max-height: 300px;
    max-width: 100%;
    width: auto;
    object-fit: cover;
  }
  .edited-message{
    color: #AAB0C8;
    font-style: italic;
    display: flex;
    align-items: center;
    font-size: 12px;
    position: absolute;
    top: 50%;
    margin: 0 10px;
    height: 25px;
    white-space: nowrap;
    ${props => !props.isAuthor ? "left: 100%" : "right: 100%;"};
  }
  .chat-options {
    visibility: hidden;
  }
  .chat-options.active {
      visibility: visible;
  }
  :hover{
    .chat-options {
        visibility: visible;
    }
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
    ${"" /* font-weight: 100; */}
    ${"" /* font-size: 15px; */}
    padding: 7px 15px;
    line-height: 1.5rem;
    float: left;
    align-items: center;
    justify-content: flex-end;
    flex-flow: ${props => (props.isAuthor ? "row" : "row-reverse")};
    .chat-options {
        visibility: hidden;
    }
    :hover{
        .chat-options {
            visibility: visible;
        }
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
    margin-top: ${props => props.isForwardedMessage === true ? "25px" : "4px"};

    img {
        width: 21px !important;
        height: 21px !important;
    }
`;

class ChatMessages extends React.PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            hasArrowUpListener: false,
            initializing: false,
            loadMoreInView: false,
            bottomRefInView: false,
            messageRefInView: false,
            fetchingReplies: false,
        };

        this.scrollComponent = React.createRef();
        this.infiniteScroll = React.createRef();
        //this.chatBottomRef = React.createRef();
    }


    attachedImgEventListener = () => {
        document.querySelectorAll(".anchor-blot").forEach(el => {
            const src = el.getAttribute("src");
            if (src) {
                el.addEventListener("mousedown", e => {
                    //window.open(el.getAttribute('data-src'), "_blank");
                    window.open(el.getAttribute("src"), "_blank");
                });
                el.classList.remove("anchor-blot");
            }
        });
    };

    attachedClickListenerToChatUrl = () => {
        document.querySelectorAll(".chat-url").forEach(el => {
            const cid = el.dataset.cid;
            const mid = el.dataset.mid;
            if (cid) {
                el.addEventListener("mousedown", e => {
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

        this.props.chatMessageActions.channelActions.saveHistoricalPosition(
            this.props.selectedChannel.id,
            scrollComponent,
        );
        document.removeEventListener("keydown", this.handleEditOnArrowUp, false);
    }

    loadReplies = () => {
        const {
            selectedChannel,
            chatMessageActions,
        } = this.props;

        if (!this.state.fetchingReplies) {
            if (selectedChannel.hasMore) {
                this.setState({fetchingReplies: true});

                let payload = {
                    skip: 0,
                    limit: 20,
                };

                if (typeof selectedChannel.replies !== "undefined") {
                    payload = {
                        skip: selectedChannel.skip === 0 && selectedChannel.replies.length ?
                              selectedChannel.replies.length : selectedChannel.skip,
                        limit: 20,
                    };
                }

                chatMessageActions.fetch(selectedChannel, payload, (err, res) => {

                    setTimeout(() => {
                        this.setState({fetchingReplies: false});
                    }, 500);
                    if (err) {
                        return;
                    }

                    if (selectedChannel.replies.length === 0 || selectedChannel.skip === 0) {
                        if (this.props.bottomRef.current) {
                            this.props.bottomRef.current.scrollIntoView(false);
                        } else {
                            let scrollC = document.querySelector(".intersection-bottom-ref");
                            if (scrollC) scrollC.scrollIntoView();
                        }
                    }

                    if (this.state.initializing === true)
                        this.setState({initializing: false});
                });
            }
        }
    };

    handleReadChannel = () => {
        const {
            selectedChannel,
            chatMessageActions: {
                channelActions,
            },
        } = this.props;

        channelActions.markAsRead(selectedChannel);
    };

    componentDidMount() {
        const {
            selectedChannel,
            historicalPositions,
        } = this.props;

        const scrollComponent = this.scrollComponent.current;

        if (historicalPositions.length) {
            historicalPositions.forEach(hp => {
                if (hp.channel_id === selectedChannel.id && scrollComponent) {
                    scrollComponent.scrollTop = scrollComponent.scrollHeight - hp.scrollPosition;
                }
            });
        }

        if (selectedChannel.skip === 0)
            this.loadReplies();

        if (selectedChannel.is_read === 1) {
            this.handleReadChannel();
        }
    }

    getSnapshotBeforeUpdate(prevProps, prevState) {
        const {selectedChannel} = this.props;
        const scrollComponent = this.scrollComponent.current;
        if (prevProps.selectedChannel) {

            if (scrollComponent) {
                if (selectedChannel.replies.length > 20 & prevProps.selectedChannel.replies.length < selectedChannel.replies.length) {
                    return scrollComponent.scrollHeight - scrollComponent.scrollTop;
                }
            }
        }
        return null;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {
            selectedChannel,
            historicalPositions,
            user,
        } = this.props;

        //to be relocated
        let el = document.querySelectorAll(`.mention[data-id="${user.id}"]`);
        if (el.length) {
            el.forEach(mentionEl => {
                mentionEl.classList.add("is-author");
            });
        }
        // @to do
        // if (selectedChannel.replies.length && !this.state.fetchingReplies) {
        //     this.attachedImgEventListener();
        //     this.attachedClickListenerToChatUrl();
        // }
        const scrollComponent = this.scrollComponent.current;

        //change channel
        if (this.props.selectedChannel && prevProps.selectedChannel.id !== selectedChannel.id) {

            if (selectedChannel.skip === 0) this.loadReplies();
            this.handleReadChannel();

            if (historicalPositions.length) {
                historicalPositions.forEach(hp => {
                    if (hp.channel_id === selectedChannel.id && scrollComponent) {
                        scrollComponent.scrollTop = scrollComponent.scrollHeight - hp.scrollPosition;
                    }
                });
            }
        }

        if (selectedChannel && prevProps.selectedChannel.id === this.props.selectedChannel.id) {
            if (snapshot !== null && selectedChannel.replies.length !== prevProps.selectedChannel.replies.length) {
                scrollComponent.scrollTop = scrollComponent.scrollHeight - snapshot;
            }
            // has replies
            if (selectedChannel.replies.length) {

                let hasUnreadMessage = selectedChannel.replies.filter(r => r.is_read === false).length > 0;
                if (this.props.bottomRefVisible && hasUnreadMessage && this.props.isBrowserActive && selectedChannel.is_read === 1) {
                    this.props.chatMessageActions.channelActions.markAsRead(selectedChannel);
                }

                if (this.state.messageRefInView || this.state.loadMoreInView) {
                    this.loadReplies();
                }

                if (this.props.bottomRefVisible && (selectedChannel.replies.length - prevProps.selectedChannel.replies.length === 1)) {
                    if (this.bottomRef && this.props.bottomRef.current) {
                        this.props.bottomRef.current.scrollIntoView(false);
                    } else {
                        let scrollC = document.querySelector(".intersection-bottom-ref");
                        if (scrollC) scrollC.scrollIntoView(false);
                    }
                } else if (selectedChannel.replies.length - prevProps.selectedChannel.replies.length === 1) {
                    if (selectedChannel.last_reply && selectedChannel.last_reply.user && selectedChannel.last_reply.user.id === this.props.user.id) {
                        this.props.bottomRef.current.scrollIntoView(false);
                    }
                }
            }
        }
    }

    handleResendMessage = payload => {
        this.props.createChatMessageV2Action(payload, (err, res) => {
            if (err) {
                this.props.onFailedMessageSend(payload);
            }
        });
    };
    handleRemoveReply = reply => {
        this.props.cbOnRemoveReply(reply);
    };

    handleEditReply = reply => {
        alert("test");
        this.props.onEditReply(reply);
    };

    handleQuoteReply = reply => {
        this.props.onSelectQuote(reply);
    };

    handleLoadMoreRefChange = (inView, entry) => {
        this.setState({loadMoreInView: inView});
    };

    handleBottomRefChange = (inView, entry) => {
        this.props.onBottomRefVisible(inView);
    };

    handleMessageRefChange = (inView, entry, id) => {
        this.setState({messageRefInView: inView});
    };
    getLoadRef = (id) => {
        const {selectedChannel} = this.props;
        let loadMoreRef = false;
        if (selectedChannel.replies.length && !this.state.fetchingReplies) {
            let sortedReplies = selectedChannel.replies.sort((a, b) => a.created_at.timestamp - b.created_at.timestamp);
            if (selectedChannel.replies.length && selectedChannel.replies.length > 10 && selectedChannel.replies.length <= 20) {
                if (id === sortedReplies[2].id) {
                    loadMoreRef = true;
                }
            } else if (selectedChannel.replies.length && selectedChannel.replies.length > 30) {
                if (id === sortedReplies[12].id) {
                    loadMoreRef = true;
                }
                // if (selectedChannel.replies.length > 40){
                //     if (id === sortedReplies[20].id){
                //         loadMoreRef = true
                //     }
                // }
            }
        }
        return loadMoreRef;
    };

    handleShowSeenUsers = () => this.setState({showSeenUsers: !this.state.showSeenUsers});

    filterSeenMembers = () => {
        return this.props.selectedChannel.members.filter(m => {
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
        }).filter(m => {
            if (m.last_visited_at) {
                return (m.last_visited_at.timestamp >= this.props.selectedChannel.last_reply.created_at.timestamp);
            } else {
                return false;
            }
        });
    };

    render() {
        const {selectedChannel} = this.props;

        let lastReplyUserId = 0;

        let groupedMessages = [];

        if (selectedChannel.replies && selectedChannel.replies.length) {
            groupedMessages = Object.entries(groupBy(selectedChannel.replies, "g_date")).map(entries => {
                return {
                    key: entries[0],
                    replies: entries[1],
                };
            }).sort((a, b) => a.key.localeCompare(b.key));
        }

        return <ChatReplyContainer
            ref={this.scrollComponent}
            id={`component-chat-thread`}
            className={`component-chat-thread messages ${this.props.className}`}
            tabIndex="2"
            data-init={1}
            data-channel-id={selectedChannel.id}>
            {
                this.state.fetchingReplies && (selectedChannel.hasMore && selectedChannel.replies.length === 0 && selectedChannel.skip === 0) &&
                <ChatLoader className={"initial-load"}><Loader/></ChatLoader>
            }
            <InfiniteScroll
                ref={this.infiniteScroll}
                className={"infinite-scroll"}
                id='infinite-scroll-chat-replies'
            >
                {
                    (selectedChannel.replies && selectedChannel.replies.length >= 20) &&
                    <InView as="div" onChange={(inView, entry) => this.handleLoadMoreRefChange(inView, entry)}>
                        <span className='intersection-load-more-ref'></span>
                    </InView>
                }
                <ul>
                    {
                        this.state.fetchingReplies &&
                        !(selectedChannel.hasMore && selectedChannel.replies.length === 0) &&
                        <ChatLoader><Loader/></ChatLoader>
                    }
                    {
                        selectedChannel.replies && selectedChannel.replies.length ?
                        groupedMessages.map((gm, i) => {

                            return (
                                <div key={gm.key}>
                                    <TimestampDiv className="timestamp-container">
                                        {
                                            <span>{localizeChatTimestamp(gm.replies[0].created_at.timestamp, "ddd, MMM DD, YYYY")}</span>
                                        }
                                    </TimestampDiv>

                                    {
                                        gm.replies.sort((a, b) => a.created_at.timestamp - b.created_at.timestamp)
                                            .map((reply, k, e) => {

                                                const isAuthor = reply.user ? selectedChannel.is_shared && this.props.sharedSlugs.length ?
                                                                              this.props.sharedSlugs.filter(s => s.slug_name === selectedChannel.slug_owner)[0].external_id === reply.user.id
                                                                                                                                         : reply.user.id === this.props.user.id : false;

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
                                                        if (
                                                            k !== 0 &&
                                                            localizeDate(e[k - 1].created_at.timestamp, "D") !==
                                                            localizeDate(reply.created_at.timestamp, "D")
                                                        ) {
                                                            showTimestamp = true;
                                                            showAvatar = true;
                                                        }
                                                        if (k !== 0 && (reply.created_at.timestamp - e[k - 1].created_at.timestamp) > 600) {
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
                                                    let botCodes = ["gripp_bot_account", "gripp_bot_invoice", "gripp_bot_offerte",
                                                        "gripp_bot_project", "gripp_bot_account", "driff_webhook_bot"];
                                                    isBot = botCodes.includes(reply.user.code);
                                                } else {

                                                    //remove duplicate messages from bot
                                                    if (k !== 0) {
                                                        let prevReply = gm.replies[k - 1];
                                                        if (prevReply.body === reply.body) {
                                                            if (Math.abs(reply.created_at.timestamp - prevReply.created_at.timestamp) <= 10)
                                                                return <></>;
                                                        }
                                                    }
                                                }

                                                //let animation = false;
                                                // if (isAuthor && reply.created_at.diff_for_humans) {
                                                //     //animation = true;
                                                // } else if (!isAuthor && !reply.is_read) {
                                                //     //animation = true;
                                                // }

                                                return <ChatList
                                                    key={reply.id}
                                                    //ref={this.getLoadRef(reply.id)}
                                                    //ref={selectedChannel.replies[1].id === reply.id ? ref : null}
                                                    data-message-id={reply.id}
                                                    data-code={reply.code}
                                                    data-timestamp={reply.created_at.timestamp}
                                                    //data-chatdate={localizeChatTimestamp(reply.created_at.timestamp, 'llll')}
                                                    className={`chat-list chat-list-item-${reply.id} code-${reply.code}`}
                                                    showTimestamp={showTimestamp}
                                                >
                                                    {
                                                        reply.user && showMessageLine && !this.props.bottomRefVisible &&
                                                        <ChatNewMessagesLine/>
                                                    }
                                                    {
                                                        reply.user &&
                                                        <ChatBubbleContainer
                                                            isAuthor={isAuthor}
                                                            className={`chat-reply-list-item chat-reply-list-item-${reply.id} ${!isAuthor ? "chat-left" : "chat-right"}`}
                                                            data-message-id={reply.id}
                                                            showAvatar={showAvatar}
                                                            isBot={isBot}
                                                        >
                                                            {
                                                                reply.message_failed ?
                                                                <FailedSpan><i
                                                                    className="fas fa-times-circle"
                                                                    onClick={e => this.handleResendMessage(reply.payload)}></i></FailedSpan>
                                                                                     : null
                                                            }
                                                            <ChatBubbleQuoteDiv
                                                                //className={`chat-bubble-quote-div ${animation ? isAuthor ? "animated fadeInRightBig" : "animated fadeInLeftBig" : ""}`}
                                                                isAuthor={isAuthor}
                                                                className={`chat-bubble-quote-div`}
                                                            >

                                                                <ChatBubble
                                                                    reply={reply}
                                                                    showAvatar={showAvatar}
                                                                    selectedChannel={this.props.selectedChannel}
                                                                    showGifPlayer={showGifPlayer}
                                                                    isAuthor={isAuthor}
                                                                    addMessageRef={this.getLoadRef(reply.id)}>
                                                                    <ChatActionsContainer
                                                                        isAuthor={isAuthor}
                                                                        className="chat-actions-container">
                                                                        {
                                                                            <ChatReactionButton
                                                                                isAuthor={isAuthor}
                                                                                scrollRef={this.infiniteScroll.current}
                                                                                reply={reply}
                                                                            />
                                                                        }
                                                                        {
                                                                            !isNaN(reply.id) && (reply.is_deleted === 0 || !reply.is_deleted) &&
                                                                            <MessageOptions
                                                                                className={"chat-message-options"}
                                                                                selectedChannel={this.props.selectedChannel}
                                                                                isAuthor={isAuthor}
                                                                                replyData={reply}
                                                                            />
                                                                        }
                                                                    </ChatActionsContainer></ChatBubble>
                                                                {
                                                                    reply.reactions.length > 0 &&
                                                                    <ChatReactions
                                                                        reactions={reply.reactions}
                                                                        isAuthor={isAuthor}
                                                                        reply={reply}
                                                                        loggedUser={this.props.user}
                                                                        chatReactionAction={this.props.chatReactionV2Action}
                                                                    />
                                                                }
                                                                {
                                                                    selectedChannel.last_reply && selectedChannel.last_reply.id === reply.id && this.filterSeenMembers().length > 0 &&
                                                                    <SeenIndicator
                                                                        isAuthor={isAuthor}
                                                                        onClick={this.handleShowSeenUsers}
                                                                        seenMembers={this.filterSeenMembers()}
                                                                        isPersonal={this.props.selectedChannel.members.length === 2}
                                                                    />
                                                                }
                                                            </ChatBubbleQuoteDiv>

                                                            {
                                                                !isAuthor && showAvatar && !isBot &&
                                                                <StyledAvatar
                                                                    isForwardedMessage={reply.is_transferred}
                                                                    id={reply.user.id}
                                                                    imageLink={reply.user.profile_image_link}
                                                                    name={reply.user.name}
                                                                />
                                                            }
                                                        </ChatBubbleContainer>
                                                    }
                                                    {
                                                        reply.user === null &&
                                                        <ChatBubbleContainer
                                                            //ref={this.getLoadRef(reply.id)}
                                                            className={`chat-reply-list-item system-reply-list-item chat-reply-list-item-${reply.id}`}
                                                            data-message-id={reply.id}
                                                            isAuthor={false}>

                                                            <ChatBubbleQuoteDiv
                                                                //className={`chat-bubble-quote-div ${animation ? isAuthor ? "animated fadeInRightBig" : "animated fadeInLeftBig" : ""}`}
                                                                className={`chat-bubble-quote-div`}
                                                            >
                                                                <SystemMessageContainer isAuthor={false}>
                                                                    <SystemMessage
                                                                        selectedChannel={this.props.selectedChannel}
                                                                        reply={reply}
                                                                        chatName={this.props.chatName}
                                                                    />
                                                                    {
                                                                        reply.unfurls.length ?
                                                                        <ChatUnfurl
                                                                            unfurlData={reply.unfurls}
                                                                            isAuthor={false}
                                                                            deleteChatUnfurlAction={this.props.deleteChatUnfurlAction}
                                                                            removeChatUnfurlAction={this.props.removeChatUnfurlAction}
                                                                            channelId={this.props.channelId}
                                                                            replyId={reply.id}
                                                                        />
                                                                                             : null
                                                                    }
                                                                    <SystemChatActionsContainer
                                                                        isAuthor={isAuthor}
                                                                        className="chat-actions-container"
                                                                    >
                                                                        {
                                                                            <ChatReactionButton
                                                                                isAuthor={isAuthor}
                                                                                scrollRef={this.infiniteScroll.current}
                                                                                reply={reply}
                                                                            />
                                                                        }
                                                                        {
                                                                            !isNaN(reply.id) && reply.is_deleted === 0 &&
                                                                            <ChatMessageOptions
                                                                                scrollRef={this.scrollComponent}
                                                                                replyData={reply}
                                                                                className={"chat-message-options"}
                                                                                selectedChannel={this.props.selectedChannel}
                                                                                isAuthor={isAuthor}
                                                                            />
                                                                        }
                                                                    </SystemChatActionsContainer>
                                                                </SystemMessageContainer>
                                                                {
                                                                    reply.reactions.length > 0 &&
                                                                    <ChatReactions
                                                                        reactions={reply.reactions}
                                                                        reply={reply}
                                                                        isAuthor={false}
                                                                        loggedUser={this.props.user}
                                                                        chatReactionAction={this.props.chatReactionV2Action}
                                                                    />
                                                                }
                                                            </ChatBubbleQuoteDiv>

                                                        </ChatBubbleContainer>
                                                    }
                                                </ChatList>;
                                            })
                                    }
                                    {
                                        groupedMessages.length >= 1 && i === (groupedMessages.length - 1) &&
                                        <InView as="div"
                                                onChange={(inView, entry) => this.handleBottomRefChange(inView, entry)}>
                                                        <span className='intersection-bottom-ref'
                                                              ref={this.props.bottomRef}></span>
                                        </InView>
                                    }
                                </div>
                            );
                        }) : null
                    }
                    {
                        (!this.state.initializing && !this.state.fetchingReplies && selectedChannel.replies && selectedChannel.replies.length < 1) &&
                        <NoReply/>
                    }
                </ul>
            </InfiniteScroll>
        </ChatReplyContainer>;
    }
}

function mapStateToProps(state) {
    const {
        global: {isBrowserActive, slugs},
        session: {user},
        users: {onlineUsers},
        chat: {historicalPositions},
    } = state;

    return {
        user,
        settings: state.settings.user.CHAT_SETTINGS,
        sharedSlugs: slugs,
        onlineUsers,
        isBrowserActive,
        historicalPositions,
    };
}

export default withRouter(connect(
    mapStateToProps,
    null,
)(ChatMessages));