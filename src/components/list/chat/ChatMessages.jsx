import {groupBy} from "lodash";
import React from "react";
import {InView} from "react-intersection-observer";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {bindActionCreators} from "redux";
import styled from "styled-components";
import {localizeChatTimestamp, localizeDate} from "../../../helpers/momentFormatJS";
import {
    getChatMessages,
    markAllMessagesAsRead,
    markReadChannel,
    setChannelHistoricalPosition,
    setSelectedChannel,
    updateChannelReducer,
    updateUnreadChatReplies,
} from "../../../redux/actions/chatActions";
// import {
//     addChatBox,
//     addChatChannelMembersV2,
//     addSelectedChannelChatMessage,
//     chatReactionV2,
//     clearHistoricalPosition,
//     createChatMessageV2,
//     getChatMessage,
//     getTaskData,
//     markAllMessagesAsRead,
//     onFailedMessageSend,
//     setDetailModalOpen,
//     setFetchingReplies,
//     updateChannelMembers,
//     updateChatMessageV2,
//     updateLastVisitedChannel,
// } from "../../../redux/actions";
// import {deleteChatThreadScrollPosition, setChatThreadScrollPosition} from "../../../redux/actions/chatActions";
// import {
//     deleteUnfurl,
//     markAsUnreadChat,
//     markReadChatChannel,
//     removeUnfurl,
//     updateChannel,
//     updateUnreadChatReplies,
// } from "../../../redux/actions/revampActions";
import {Avatar, Loader} from "../../common";
import NoReply from "../../common/NoReply";
import ChatBubble from "./ChatBubble";
import ChatMessageOptions from "./ChatMessageOptions";
import ChatNewMessagesLine from "./ChatNewMessageLine";
import ChatReactionButton from "./ChatReactionButton";
import ChatUnfurl from "./ChatUnfurl";
import ChatUnreadLine from "./ChatUnreadLine";
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

  &.is-processed {
    opacity: 0;
  }
  .intersection-bottom-ref {
        //visibility: hidden;
        font-size: .5rem;
        color: transparent;
  }
  .mention {
    background: rgb(189, 189, 189);
    box-shadow: none;
    padding: 5px;
    border-radius: 30px;
    color: #fff;
    display: inline-block;
    width: auto;
    height: auto;
  }
  .mention.is-author {
    background-image: linear-gradient(105deg, #972c86, #794997);
  }
`;

const ChatList = styled.li`
    position: relative;
    display: inline-block;
    width: 100%;
    margin-bottom: 5px;
    text-align: center;
    .chat-actions-container {
        opacity: 1;
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
        background: #fff;
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


    ${"" /* margin-top: ${props => ((props.showAvatar && !props.isAuthor ) ? "20px" : "0px")}; */}
    margin-top: ${props => ((props.showAvatar) && "36px")};

    margin-top: ${props => ((props.showAvatar && props.isAuthor) && "20px")};
    ${"" /* background: ${props => ((props.isAuthor ) ? "red" : "blue")}; */}



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
    }
`;
const ChatActionsContainer = styled.div`
    display: flex;
    flex-flow: ${props => (props.isAuthor ? "row-reverse" : "row")};
    flex-wrap: wrap;
    ${props => (props.isAuthor ? "margin-right: 10px" : "margin-left: 10px")};
    min-width: 100px;
    ${"" /* max-height: 25px; */}

    height: 100%;
    background: blue;
    ${"" /* position: absolute; */}

    ${"" /* ${props => (props.isAuthor ? "left: 100%" : "right: 100%")}; */}

`;
const SystemChatActionsContainer = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    ${props => (props.isAuthor ? "margin-right: 10px" : "margin-left: 10px")};
    min-width: 100px;
    max-height: 25px;
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
            bottom: auto;
            top: 35px;

            @media (max-width: 575.99px) {
                top: 20px;
            }
            &.hOrientation-right {
                left: -10px;
                top: 35px;

                &:before {
                    left: auto;
                    right: 85%;
                    bottom: 100%;
                }
                &:after {
                    left: auto;
                    right: 86%;
                    bottom: 100%;
                }
            }
            &.hOrientation-left {
                right: -5px;
                left: auto;

                &:before {
                    left: 90%;
                }
                &:after {
                    left: 90%;
                }
            }
            &::before {
                top: auto;
                bottom: 100%;
                transform: rotate(180deg)
            }

            &::after {
                top: auto;
                bottom: 100%;
                transform: rotate(180deg)
            }

            @media (max-width: 1399.99px) {
                &.hOrientation-right {
                    left: -10px;
                    top: 35px;

                    &:before {
                        left: auto;
                        right: 85%;
                        bottom: 100%;
                    }
                    &:after {
                        left: auto;
                        right: 86%;
                        bottom: 100%;
                    }
                }

                &.hOrientation-left {
                    right: -5px;
                    left: auto;

                    &:before {
                        left: 90%;
                    }
                    &:after {
                        left: 90%;
                    }
                }
            }

            @media (max-width: 575.99px) {
                &.hOrientation-left {
                    right: 200px;

                    &:before {
                        left: 90%;
                        right: auto;
                    }
                    &:after {
                        left: 90%;
                        right: auto;
                    }
                }
            }
        }

        &.orientation-top {
            @media (max-width: 575.99px) {
                bottom: 110%;
                top: auto;
            }

            &.hOrientation-right {
                left: -5px;

                &:before {
                    left: 12px;
                }
                &:after {
                    left: 12px;
                }

                @media (max-width: 575.99px) {
                    top: auto;
                    bottom: 120%;
                    right: auto;
                    left: 0;

                    &:before {
                        right: auto;
                        top: 100%;
                        transform: unset;
                    }
                    &:after {
                        right: auto;
                        top: 100%;
                        transform: unset;
                    }
                }
            }

            &.hOrientation-left {
                right: -5px;
                left: auto;

                &:before {
                    top: 100%;
                    right: 5px;
                    left: auto;
                    transform: unset;
                }
                &:after {
                    top: 100%;
                    right: 8px;
                    left: auto;
                    transform: unset;
                }
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
  ${props => (!props.isAuthor === true && "margin-left: 18px")};
  > img {
    // max-height: ${props => props.maxImgHeight > 300 ? `${props.maxImgHeight}px;` : "300px"};
    max-height: 300px;
    max-width: 100%;
    width: auto;
    object-fit: cover;
  }
  .edited-message{
      color: #646464;
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
    //background: #f1e6ef;
    background: #f4f4f4f4;
    text-align: left;
    min-width: 100px;
    max-width: 100%;
    color: #201e1e;
    font-weight: 100;
    font-size: 15px;
    padding: 5px 10px;
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
    margin-top: 4px;
    width: 21px !important;
    height: 21px !important;
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
        this.chatBottomRef = React.createRef();
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
        this.props.setChannelHistoricalPosition({
            channel_id: this.props.selectedChannel.id,
            scrollPosition: scrollComponent.scrollHeight - scrollComponent.scrollTop,
        });
        document.removeEventListener("keydown", this.handleEditOnArrowUp, false);
    }

    loadReplies = () => {
        const {selectedChannel, sharedSlugs, getChatMessages} = this.props;
        if (!this.state.fetchingReplies) {
            if (selectedChannel.hasMore) {
                let payload = {};
                let slug = sharedSlugs.filter(s => s.slug_name === selectedChannel.slug_owner);
                this.setState({fetchingReplies: true});
                if (typeof selectedChannel.replies === "undefined") {
                    payload = {
                        channel_id: selectedChannel.id,
                        skip: 0,
                        limit: 20,
                    };
                    if (sharedSlugs.length) {
                        payload = {
                            ...payload,
                            is_shared_topic: selectedChannel.is_shared ? 1 : null,
                            topic_id: selectedChannel.is_shared ? selectedChannel.entity_id : null,
                            is_shared: selectedChannel.is_shared ? selectedChannel.entity_id : null,
                            token: selectedChannel.is_shared && slug.length ? slug[0].access_token : null,
                            slug: selectedChannel.is_shared && slug.length ? slug[0].slug_name : null,
                        };
                    }
                } else {
                    payload = {
                        channel_id: selectedChannel.id,
                        skip: selectedChannel.skip === 0 && selectedChannel.replies.length ?
                            selectedChannel.replies.length : selectedChannel.skip,
                        limit: 20,
                    };
                    if (sharedSlugs.length) {
                        payload = {
                            ...payload,
                            is_shared_topic: selectedChannel.is_shared ? 1 : null,
                            topic_id: selectedChannel.is_shared ? selectedChannel.entity_id : null,
                            is_shared: selectedChannel.is_shared ? selectedChannel.entity_id : null,
                            token: selectedChannel.is_shared && slug.length ? slug[0].access_token : null,
                            slug: selectedChannel.is_shared && slug.length ? slug[0].slug_name : null,
                        };
                    }
                }

                getChatMessages(payload, (err, res) => {
                    //console.log(res, 'load message');
                    setTimeout(() => {
                        this.setState({fetchingReplies: false});
                    }, 500);
                    if (err) {
                        return;
                    }
                    if (selectedChannel.replies.length === 0 || selectedChannel.skip === 0) {
                        if (this.chatBottomRef.current) {
                            this.chatBottomRef.current.scrollIntoView(false);
                        } else {
                            let scrollC = document.querySelector(".intersection-bottom-ref");
                            if (scrollC) scrollC.scrollIntoView();
                        }
                    }

                    if (this.state.initializing === true) this.setState({initializing: false});

                });
            }
        }
    };

    handleReadChannel = () => {
        const {
            selectedChannel,
            sharedSlugs,
            markReadChannel,
            updateChannelReducer,
        } = this.props;

        if (selectedChannel.is_read === 1) {
            if (selectedChannel.is_shared && sharedSlugs.length) {
                let slug = sharedSlugs.filter(s => s.slug_name === selectedChannel.slug_owner);
                if (slug.length) {
                    markReadChannel({
                        channel_id: selectedChannel.id,
                        is_shared: true,
                        topic_id: selectedChannel.entity_id,
                        token: slug[0].access_token,
                        slug: slug[0].slug_name,
                    });
                }
            } else {
                markReadChannel({channel_id: selectedChannel.id});
            }
            let updatedChannel = {
                ...selectedChannel,
                total_unread: 0,
            };
            updateChannelReducer(updatedChannel);
        }
    };

    componentDidMount() {
        const {
            selectedChannel,
        } = this.props;
        //document.addEventListener("keydown", this.handleEditOnArrowUp, false);
        // this.setState({activeChannelId: this.props.selectedChannel.id});

        if (selectedChannel.skip === 0) this.loadReplies();
        this.handleReadChannel();
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
            markReadChannel,
            markAllMessagesAsRead,
            updateUnreadChatReplies,
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
                // document.removeEventListener("keydown", this.handleEditOnArrowUp, false);
                // document.addEventListener("keydown", this.handleEditOnArrowUp, false);

                let hasUnreadMessage = selectedChannel.replies.filter(r => r.is_read === false).length > 0;
                if (this.state.bottomRefInView && hasUnreadMessage && this.props.isBrowserActive && selectedChannel.is_read === 1) {
                    markAllMessagesAsRead({channel_id: selectedChannel.id});
                    markReadChannel({channel_id: selectedChannel.id}, (err, res) => {
                        if (err) return;
                        let updatedChannel = {
                            ...selectedChannel,
                            mark_new_messages_as_read: true,
                            mark_unread: selectedChannel.mark_unread,
                            total_unread: 0,
                            minus_count: selectedChannel.total_unread,
                        };
                        updateUnreadChatReplies(updatedChannel);
                    });

                }

                if (this.state.messageRefInView || this.state.loadMoreInView) {
                    this.loadReplies();
                }

                if (this.state.bottomRefInView && (selectedChannel.replies.length - prevProps.selectedChannel.replies.length === 1)) {
                    if (this.chatBottomRef && this.chatBottomRef.current) {
                        this.chatBottomRef.current.scrollIntoView(false);
                    } else {
                        let scrollC = document.querySelector(".intersection-bottom-ref");
                        if (scrollC) scrollC.scrollIntoView(false);
                    }
                } else if (selectedChannel.replies.length - prevProps.selectedChannel.replies.length === 1) {
                    if (selectedChannel.last_reply.user && selectedChannel.last_reply.user.id === this.props.user.id) {
                        this.chatBottomRef.current.scrollIntoView(false);
                    }
                }
            }
        }
    }

    handleEditOnArrowUp = e => {
        const {selectedChannel} = this.props;
        if (e.keyCode === 38) {
            if (e.target.classList.contains("ql-editor")) {
                if (e.target.innerText.trim() === "" && !e.target.contains(document.querySelector(".ql-editor .anchor-blot"))) {
                    e.preventDefault();
                    let lastReply = selectedChannel.replies.sort((a, b) => b.created_at.timestamp - a.created_at.timestamp)
                        .filter(r => {
                                if (selectedChannel.is_shared && this.props.sharedSlugs.length) {
                                    return (this.props.sharedSlugs.filter(s => s.slug_name === selectedChannel.slug_owner)[0].external_id) && (typeof r.id === "number") && r.is_deleted === 0;
                                } else {
                                    return r.is_deleted === 0 && r.user.id === this.props.user.id && (typeof r.id === "number");
                                }
                            },
                        )[0];

                    if (typeof lastReply !== "undefined") {
                        this.handleEditReply(lastReply);
                    }
                }
            }
        }
    };

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
        this.props.onEditReply(reply);
    };

    handleQuoteReply = reply => {
        this.props.onSelectQuote(reply);
    };

    handleLoadMoreRefChange = (inView, entry) => {
        this.setState({loadMoreInView: inView});
    };

    handleBottomRefChange = (inView, entry) => {
        this.setState({bottomRefInView: inView});
        //this.props.handleIsBottomRefVisibleChange(inView);
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
                        if (this.props.user.id === m.id) return false;
                        else return true;
                    } else {
                        // other user message
                        if (this.props.selectedChannel.last_reply.user.id === m.id) return false;
                        else return true;
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
                if (m.last_visited_at.timestamp >= this.props.selectedChannel.last_reply.created_at.timestamp) {
                    return true;
                } else return false;
            } else {
                return false;
            }
        });
    };

    render() {
        const {
            selectedChannel,
            showFloatBar,
        } = this.props;

        let lastReplyUserId = 0;
        let hasUnReadLine = false;
        let unreadMessage = false;
        let hasNewMessageLine = false;
        let newMessage = false;

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
                                        <TimestampDiv>
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

                                                    //let lastReply = false;
                                                    let showAvatar = false;
                                                    let showTimestamp = false;
                                                    let showGifPlayer = false;
                                                    let isBot = false;

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

                                                        if (unreadMessage) {
                                                            hasUnReadLine = true;
                                                            unreadMessage = false;
                                                        }

                                                        if (newMessage) {
                                                            hasNewMessageLine = true;
                                                            newMessage = false;
                                                        }

                                                        if (!hasUnReadLine && reply.user.id !== this.props.user.id && selectedChannel.mark_unread && selectedChannel.last_visited_at_timestamp < reply.created_at.timestamp) {
                                                            unreadMessage = true;
                                                        }

                                                        if (!hasNewMessageLine && reply.user.id !== this.props.user.id && showFloatBar &&
                                                            !reply.is_read && !selectedChannel.mark_new_messages_as_read && !selectedChannel.mark_unread && selectedChannel.last_visited_at_timestamp < reply.created_at.timestamp) {
                                                            newMessage = true;
                                                        }

                                                        // if (k === selectedChannel.replies.length - 1) {
                                                        //     lastReply = true;
                                                        // }
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
                                                            reply.user && unreadMessage ? (
                                                                <ChatUnreadLine/>
                                                            ) : null
                                                        }
                                                        {
                                                            reply.user && newMessage ? (
                                                                <ChatNewMessagesLine/>
                                                            ) : null
                                                        }
                                                        {
                                                            reply.user &&
                                                            <ChatBubbleContainer
                                                                isAuthor={isAuthor}
                                                                className={`chat-reply-list-item chat-reply-list-item-${reply.id}`}
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

                                                                <ChatActionsContainer
                                                                    isAuthor={isAuthor}
                                                                    className="chat-actions-container"
                                                                >
                                                                    {
                                                                        <ChatReactionButton
                                                                            isAuthor={isAuthor}
                                                                            theme={this.props.settings.CHAT_SETTINGS.chat_message_theme}
                                                                            scrollRef={this.props.innerRef}
                                                                            reply={reply}
                                                                            chatReactionAction={this.props.chatReactionV2Action}
                                                                        />
                                                                    }
                                                                    {
                                                                        !isNaN(reply.id) && reply.is_deleted === 0 &&
                                                                        <MessageOptions
                                                                            className={"chat-message-options"}
                                                                            selectedChannel={this.props.selectedChannel}
                                                                            isAuthor={isAuthor}
                                                                            replyData={reply}
                                                                            cbOnRemoveReply={this.handleRemoveReply}
                                                                            onEditReply={this.handleEditReply}
                                                                            onQuoteReply={this.handleQuoteReply}
                                                                            cbSetReminderPopUp={this.props.cbSetReminderPopUp}
                                                                            slugs={this.props.sharedSlugs}
                                                                            onForwardMessage={this.props.onForwardMessage}
                                                                        />
                                                                    }
                                                                </ChatActionsContainer>

                                                                <ChatBubbleQuoteDiv
                                                                    //className={`chat-bubble-quote-div ${animation ? isAuthor ? "animated fadeInRightBig" : "animated fadeInLeftBig" : ""}`}
                                                                    isAuthor={isAuthor}
                                                                    className={`chat-bubble-quote-div`}
                                                                >
                                                                    <ChatBubble
                                                                        isAuthor={isAuthor}
                                                                        reply={reply}
                                                                        loggedUser={this.props.user}
                                                                        showAvatar={showAvatar}
                                                                        unfurlAction={this.props.unfurlAction}
                                                                        createRatingAction={this.props.createRatingAction}
                                                                        addClapCount={this.props.addClapCount}
                                                                        addUnfurlData={e => {
                                                                            this.props.addUnfurlData(e, selectedChannel.replies.length <= 10);
                                                                        }}
                                                                        channelId={this.props.selectedChannel.id}
                                                                        getReplyClapsAction={this.props.getReplyClapsAction}
                                                                        recipients={this.props.recipients}
                                                                        updateChatMessageAction={this.props.updateChatMessageAction}
                                                                        deleteUnfurlAction={this.props.deleteUnfurlAction}
                                                                        removeUnfurl={this.props.removeUnfurl}
                                                                        addChatChannelMembersV2Action={this.props.addChatChannelMembersV2Action}
                                                                        updateChannelMembersAction={this.props.updateChannelMembersAction}
                                                                        updateLastVisitedChannelAction={this.props.updateLastVisitedChannelAction}
                                                                        selectedChannel={this.props.selectedChannel}
                                                                        chatReactionV2Action={this.props.chatReactionV2Action}
                                                                        showGifPlayer={showGifPlayer}
                                                                        chatName={this.props.chatName}
                                                                        filterSearch={this.props.filterSearch}
                                                                        handleMessageRefChange={this.handleMessageRefChange}
                                                                        addMessageRef={this.getLoadRef(reply.id)}
                                                                        {...this.props}
                                                                    />
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
                                                                className={`chat-reply-list-item chat-reply-list-item-${reply.id}`}
                                                                data-message-id={reply.id}
                                                                isAuthor={false}>
                                                                <SystemChatActionsContainer
                                                                    isAuthor={isAuthor}
                                                                    className="chat-actions-container"
                                                                >
                                                                    {
                                                                        <ChatReactionButton
                                                                            isAuthor={isAuthor}
                                                                            theme={this.props.settings.CHAT_SETTINGS.chat_message_theme}
                                                                            scrollRef={this.props.innerRef}
                                                                            reply={reply}
                                                                            chatReactionAction={this.props.chatReactionV2Action}
                                                                        />
                                                                    }
                                                                    {
                                                                        !isNaN(reply.id) && reply.is_deleted === 0 &&
                                                                        <ChatMessageOptions
                                                                            className={"chat-message-options"}
                                                                            selectedChannel={this.props.selectedChannel}
                                                                            isAuthor={isAuthor}
                                                                            replyData={reply}
                                                                            cbOnRemoveReply={this.handleRemoveReply}
                                                                            onEditReply={this.handleEditReply}
                                                                            onQuoteReply={this.handleQuoteReply}
                                                                            setDetailModalOpenAction={
                                                                                this.props.setDetailModalOpenAction
                                                                            }
                                                                            chatData={this.props.chatData}
                                                                            cbSetReminderPopUp={this.props.cbSetReminderPopUp}
                                                                            slugs={this.props.sharedSlugs}
                                                                        />
                                                                    }

                                                                </SystemChatActionsContainer>
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
                                                              ref={this.chatBottomRef}>bot</span>
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
        settings: {userSettings},
        users: {onlineUsers},
        chat: {selectedChannel, historicalPositions},
    } = state;
    return {
        user,
        settings: userSettings,
        sharedSlugs: slugs,
        onlineUsers,
        isBrowserActive,
        selectedChannel,
        historicalPositions,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        getChatMessages: bindActionCreators(getChatMessages, dispatch),
        setSelectedChannel: bindActionCreators(setSelectedChannel, dispatch),
        updateChannelReducer: bindActionCreators(updateChannelReducer, dispatch),
        markReadChannel: bindActionCreators(markReadChannel, dispatch),
        markAllMessagesAsRead: bindActionCreators(markAllMessagesAsRead, dispatch),
        updateUnreadChatReplies: bindActionCreators(updateUnreadChatReplies, dispatch),
        setChannelHistoricalPosition: bindActionCreators(setChannelHistoricalPosition, dispatch),
        // addSelectedChannelChatMessageReducer: bindActionCreators(addSelectedChannelChatMessage, dispatch),
        // updateChatMessageAction: bindActionCreators(updateChatMessageV2, dispatch),
        // setDetailModalOpenAction: bindActionCreators(setDetailModalOpen, dispatch),
        // chatReactionV2Action: bindActionCreators(chatReactionV2, dispatch),
        // markAsUnreadChatAction: bindActionCreators(markAsUnreadChat, dispatch),
        // addChatChannelMembersV2Action: bindActionCreators(addChatChannelMembersV2, dispatch),
        // updateChannelMembersAction: bindActionCreators(updateChannelMembers, dispatch),
        // updateLastVisitedChannelAction: bindActionCreators(updateLastVisitedChannel, dispatch),
        // updateChannelAction: bindActionCreators(updateChannel, dispatch),
        // updateUnreadChatRepliesAction: bindActionCreators(updateUnreadChatReplies, dispatch),
        // createChatMessageV2Action: bindActionCreators(createChatMessageV2, dispatch),
        // onFailedMessageSend: bindActionCreators(onFailedMessageSend, dispatch),
        // markReadChatChannelAction: bindActionCreators(markReadChatChannel, dispatch),
        // deleteUnfurlAction: bindActionCreators(deleteUnfurl, dispatch),
        // removeUnfurl: bindActionCreators(removeUnfurl, dispatch),
        // setChatThreadScrollPositionAction: bindActionCreators(setChatThreadScrollPosition, dispatch),
        // deleteChatThreadScrollPositionAction: bindActionCreators(deleteChatThreadScrollPosition, dispatch),
        // markAllMessagesAsReadAction: bindActionCreators(markAllMessagesAsRead, dispatch),
        // addChatBoxAction: bindActionCreators(addChatBox, dispatch),
        // getTaskDataAction: bindActionCreators(getTaskData, dispatch),
        // setFetchingReplies: bindActionCreators(setFetchingReplies, dispatch),
        // clearHistoricalPosition: bindActionCreators(clearHistoricalPosition, dispatch),
        // getChatMessageAction: bindActionCreators(getChatMessage, dispatch),
    };
}

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps,
)(ChatMessages));