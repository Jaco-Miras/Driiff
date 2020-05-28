import Echo from "laravel-echo";
import React, {PureComponent} from "react";
import {isSafari} from "react-device-detect";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {bindActionCreators} from "redux";
import {sessionService} from "redux-react-session";
import styled from "styled-components";
//import toaster from "toasted-notes";
// import chatSound from "../../../assets/sound/light.mp3";
import {$_GET, isIPAddress} from "../../helpers/commonFunctions";
import {localizeDate} from "../../helpers/momentFormatJS";
import {pushBrowserNotification} from "../../helpers/pushHelper";
import {updateFaviconState} from "../../helpers/slugHelper";
import {stripHtml} from "../../helpers/stringFormatter";
import {urlify} from "../../helpers/urlContentHelper";
import {
    addToChannels,
    getChannel,
    getChannelMembers,
    incomingArchivedChannel,
    incomingChatMessage,
    incomingChatMessageFromOthers,
    incomingChatMessageReaction,
    incomingDeletedChatMessage,
    incomingUpdatedChannelDetail,
    incomingUpdatedChatMessage,
    markAllMessagesAsRead,
    updateChannelMembersTitle,
    updateChannelReducer,
    updateMemberTimestamp,
} from "../../redux/actions/chatActions";
import {addFilesToChannel} from "../../redux/actions/fileActions";
import {
    addUserToReducers,
    generateUnfurl,
    generateUnfurlReducer,
    getConnectedSlugs,
    setBrowserTabStatus,
} from "../../redux/actions/globalActions";
import {getOnlineUsers, getUser} from "../../redux/actions/userAction";
import {
    incomingMovedTopic,
    incomingUpdatedWorkspaceFolder,
    incomingWorkspace,
    incomingWorkspaceFolder,
} from "../../redux/actions/workspaceActions";
// import {
//     addChatBox,
//     addChatMembers,
//     addTaskAssigneesSocket,
//     addUnreadChatCount,
//     addUserToMentions,
//     getChatChannel,
//     getChatMembersV2,
//     getConnectedSlugs,
//     getUserSettings,
//     incomingChatMessage,
//     incomingChatMessageFromOthers,
//     incomingChatMessageReaction,
//     incomingCreatedTask,
//     incomingCreatedTopic,
//     incomingDeletedChatMessage,
//     incomingDeletedTaskCommentReducer,
//     incomingDeletedTaskReducer,
//     incomingDeletedTopic,
//     incomingNewBoard,
//     incomingReadChannelReducer,
//     incomingTaskCommentReducer,
//     incomingTaskReactionReducer,
//     incomingTaskReducer,
//     incomingUnreadChannel,
//     incomingUpdatedChatChannelName,
//     incomingUpdatedChatMessage,
//     incomingUpdatedTaskCommentReducer,
//     incomingUpdatedTaskReducer,
//     incomingUpdatedTopic,
//     incomingVideoChatCall,
//     loggingInUser,
//     loggingOutUser,
//     logout,
//     markAllMessagesAsRead,
//     moveTaskSocketReducer,
//     newColumnReducer,
//     onlineUsers,
//     setBrowserTabStatus,
//     setSelectedChannel,
//     updateChatBox,
//     updateChatChannelV2,
//     updateChatCounter,
//     updateMemberTimestamp,
//     updateOnlineUserTimestamp,
//     updatePostCommentViewers,
//     updatePostReaders,
//     updateTaskCounterReducer,
//     userFollowPost,
//     userUnfollowPost,
// } from "../../../redux/actions";
// import {
//     addActiveChatChannels,
//     addChatNotification,
//     addRemovePostRecipient,
//     clearPostReplyNotification,
//     createPostMessage,
//     currentOnlineUsers,
//     generateUnfurl,
//     generateUnfurlReducer,
//     getAllEntriesCount,
//     getAllRecipients,
//     getNotifications,
//     getPost,
//     getPostEntries,
//     getQuickLinks,
//     getTotalUnreadNotification,
//     getTotalUnreadPosts,
//     getUnreadChatReplies,
//     getUser,
//     getUsersOnline,
//     incomingArchivedChat,
//     incomingClapCount,
//     incomingDeletedPost,
//     incomingPost,
//     incomingReply,
//     incomingUpdatedReply,
//     postUsersOnline,
//     removeUserFromRecipients,
//     simpleAddNewNotificationLength,
//     simpleAddUnreadPost,
//     simpleNewNotificationSocket,
//     updateChannel,
//     updatePostSimple,
//     updatePostViewers,
//     updateStreamCounter,
//     updateTeamReducer,
//     updateTopicMembers,
// } from "../../../redux/actions/revampActions";

const PreloadEmojiImage = styled.img`
    display: none;
`;

class Socket extends PureComponent {
    constructor() {
        super();
        this.state = {
            hasInitiateEcho: false,
            hasInitiateNotification: false,
            hasSubscribed: false,
            focus: false,
            hasNotification: false,
            postIds: [],
            updateUserData: false,
            hidden: null,
            visibilityChange: null,
        };
    }

    handleVisibilityChange = () => {
        if (document[this.state.hidden]) {
            this.setState({focus: false});
            this.props.setBrowserTabStatus({status: false});
        } else {
            this.setState({focus: true});
            this.props.setBrowserTabStatus({status: true});
        }
    };

    _initializedSocket = () => {
        var visibilityChange;
        if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support 
            visibilityChange = "visibilitychange";
        } else if (typeof document.msHidden !== "undefined") {
            visibilityChange = "msvisibilitychange";
        } else if (typeof document.webkitHidden !== "undefined") {
            visibilityChange = "webkitvisibilitychange";
        }
        document.addEventListener(visibilityChange, this.handleVisibilityChange, false);
    };

    componentDidMount() {
        this.props.addUserToReducers({
            id: this.props.user.id,
            name: this.props.user.name,
            partial_name: this.props.user.partial_name,
            profile_image_link: this.props.user.profile_image_link,
        });
        // Set the name of the hidden property and the change event for visibility
        if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support 
            this.setState({hidden: "hidden", visibilityChange: "visibilitychange"});
        } else if (typeof document.msHidden !== "undefined") {
            this.setState({hidden: "msHidden", visibilityChange: "msvisibilitychange"});
        } else if (typeof document.webkitHidden !== "undefined") {
            this.setState({hidden: "webkitHidden", visibilityChange: "webkitvisibilitychange"});
        }

        this.props.getOnlineUsers();
        setInterval(() => {
            this.props.getOnlineUsers();
        }, 60000);
        sessionService.loadSession().then(current => {
            let myToken = current.token;
            let accessBroadcastToken = current.access_broadcast_token;
            let host = process.env.REACT_APP_socketAddress;
            // localStorage.setItem("my_token", myToken);
            // localStorage.setItem("socket_token", accessBroadcastToken);
            // localStorage.setItem("host", host);
            if (!window.io) window.io = require("socket.io-client");
            if (!window.Echo) {
                window.Echo = new Echo({
                    broadcaster: "socket.io",
                    host: host,
                    auth: {
                        headers: {
                            Authorization: myToken,
                            "Driff-Broadcast-Token": accessBroadcastToken,
                        },
                    },
                });
                //this.setState({hasInitiateEcho: true})
                setTimeout(() => {
                    this.onListen(localStorage.getItem("slug"), this.props.user.id);
                }, 2000);
            }
        });
        this.props.getConnectedSlugs({}, (err, res) => {
            console.log(res, "slugs");
        });
        // this.props.getAllEntriesCountAction();

        this._initializedSocket();

        if ($_GET("_calling")) {
            let e = {
                selectedChannel: {
                    id: 1,
                    title: "Channel Title",
                },
            };
            let cb = {
                id: e.selectedChannel.id,
                type: "modal",
                modal: "modal_video_chat_calling",
                className: "",
                caller: this.props.user,
                selectedChannel: e.selectedChannel,
                callback: {
                    handleClose: () => {
                    },
                    handleYes: () => {
                    },
                    handleNo: () => {
                    },
                },
            };
            this.props.addChatBoxAction(cb);
        }
    }

    componentWillUnmount() {
        localStorage.removeItem("has_active");
        document.removeEventListener(this.state.visibilityChange, this.handleVisibilityChange, false);
    }

    componentDidUpdate(prevProps, prevState) {
        if (!this.state.updateUserData && this.props.user.id) {
            this.setState({updateUserData: true});
            // get the updated user data and save to session when refreshed
            this.props.getUser({id: this.props.user.id}, (err, res) => {
                if (err) return;
                sessionService.saveUser({...res.data});
            });
        }
        if (this.props.unreadChatReplies !== prevProps.unreadChatReplies ||
            this.props.notificationLength !== prevProps.notificationLength) {
            if (this.props.unreadChatReplies + this.props.notificationLength) {
                this.setState({
                    hasNotification: true,
                });
            } else {
                this.setState({
                    hasNotification: false,
                });
            }
        }

        if (this.state.hasInitiateEcho && this.props.user.id && !this.state.hasSubscribed) {
            this.setState({hasSubscribed: true});
            this.onListen(localStorage.getItem("slug"), null);
        }
        if (!this.state.hasInitiateEcho && this.props.user.id && !this.state.hasSubscribed) {
            this._initializedSocket();
        }

        if (prevProps.unreadPostEntries !== this.props.unreadPostEntries ||
            //prevProps.unreadTaskEntries !== this.props.unreadTaskEntries ||
            prevProps.unreadChatReplies !== this.props.unreadChatReplies
        ) {
            let count = this.props.unreadPostEntries + this.props.unreadChatReplies;
            updateFaviconState(count === 0 ? false : true);
        }
    }

    onListen = (external = localStorage.getItem("slug"), ex_id = this.props.user.id) => {
        window.Echo.join(external + ".App.User.Online")
            .here(viewers => {
                console.log(viewers, "viewers");
            })
            .joining(user => {
                console.log(user, "joining");
            })
            .leaving(user => {
                console.log(user, "leaving");
            });
        if (window.Echo.connector.channels[`presence-${external}.App.User.Online`]) {
            window.Echo.connector.channels[`presence-${external}.App.User.Online`].socket.on("connect", function () {
                console.log("online users channel connected", window[external]);
            });
            window.Echo.connector.channels[`presence-${external}.App.User.Online`].socket.on("reconnect", function () {
                console.log("online users channel re-connected");
            });
            window.Echo.connector.channels[`presence-${external}.App.User.Online`].socket.on("disconnect", function () {
                console.log("online users channel disconnected");
            });
        }

        //let audio = document.createElement("audio");
        // audio.src = chatSound;
        window.Echo.channel(external + ".App.User.Inactive")
            .listen(".user-inactive", e => {
                console.log(e, "user-inactive");
                if (e.user.id === this.props.profile_detail.id) {
                    this.props.logoutAction(() => {
                        sessionService.deleteSession()
                            .then(() => sessionService.deleteUser())
                            .then(() => this.props.history.push("/login"));
                    });
                } else {
                    this.props.getAllRecipientsAction();
                    this.props.removeUserFromRecipientsAction({id: e.user.id});
                }
            });
        window.Echo.channel(external + ".App.roles")
            .listen(".updated-roles", e => {
                if (this.props.user && this.props.user.id) {
                    this.props.getUser({id: this.props.user.id}, (err, res) => {
                        if (err) return;

                        sessionService.saveUser({...res.data});
                    });
                }
            });

        window.Echo.private(`${external}.App.Broadcast`)
            .listen(".user-activated", e => {
                console.log(e, "user-activated");
                this.props.getAllRecipientsAction();
                this.props.addUserToMentions(e);
            })
            .listen(".updated-version", e => {
                if (!(isIPAddress(window.location.hostname) || window.location.hostname === "localhost") &&
                    localStorage.getItem("driffVersion") !== e.version) {
                    localStorage.setItem("driffVersion", e.version);
                    let requirement = e.requirement;

                    /*if (!this.props.user.personal_bot) {
                     requirement = 'logout';
                     }*/

                    let cb = {
                        id: e.version,
                        type: "modal",
                        modal: "modal_new_update_found_confirm",
                        className: "",
                        requirement: requirement,
                    };
                    this.props.addChatBoxAction(cb);
                }
            })
            .listen(".chat-channel", e => {

            })
            .listen(".read_channel", e => {
                this.props.updateChatCounterAction(e);
            })
            .listen(".archive-chat-discussion", e => {
                //console.log(e, 'archive');
                this.props.incomingArchivedChatAction(e);
            })
            .listen(".post-follow", e => {
                console.log(e, "follow");
                this.props.addRemovePostRecipientAction({
                    type: "add",
                    id: e.recipient.id,
                    post_id: parseInt(e.post_id),
                    user_id: e.recipient.type_id,
                    is_author: e.recipient.type_id === this.props.user.id,
                    mode: "post-follow",
                });
            })
            .listen(".post-unfollow", e => {
                console.log(e, "unfollow");
                let isAuthor = false;
                e.user_unfollow.forEach(u => {
                    if (u.id === this.props.user.id) {
                        isAuthor = true;

                    }
                });
                let payload = {
                    ...e,
                    is_followed: !isAuthor,
                };
                this.props.userUnfollowPost(payload);
            })
            .listen(".create-topic", e => {
                this.props.incomingCreatedTopic(e);
            })
            .listen(".update-topic", e => {
                this.props.incomingUpdatedTopic(e);
            })
            .listen(".delete-topic", e => {
                this.props.incomingDeletedTopic(e);
            })
            .listen(".new-workspace", e => {
                console.log(e, "new workspace");
                if (e.topic !== undefined) {
                    this.props.incomingWorkspace(e);
                } else {
                    this.props.incomingWorkspaceFolder(e.workspace);
                }
            })
            .listen(".update-workspace", e => {
                console.log(e, "update workspace");
                this.props.incomingUpdatedWorkspaceFolder(e);
            })
            .listen(".move-topic-workspace", e => {
                console.log(e, "move workspace");
                this.props.incomingMovedTopic(e);
            })
            .notification((notification) => {
                console.log(notification, "broadcast notification");
            });


        window.Echo.private(`${external}.App.User.${this.props.user.id}`)
            .listen(".users-online", e => {
                //console.log(e, 'users-online');
                this.props.currentOnlineUsers(e.current_users_online.map(u => {
                    return {
                        ...u,
                        id: u.user_id,
                    };
                }));
            })
            // .listen(".post-read-require", e => {
            //     console.log("post-read-require", e);
            //     this.props.updatePostReaders({
            //         post_id: e.result.post_id,
            //         user_reads: e.result.user_reads,
            //     });
            // })
            // .listen(".post-require-author-notify", e => {
            //     console.log("post-read-require autor", e);
            //     this.props.updatePostReaders({
            //         post_id: e.result.post_data.id,
            //         user_reads: e.result.post_data.user_reads,
            //     });
            //     toaster.notify(`${e.result.message}`, {position: "bottom-left"});
            // })
            .listen(".start-discussion-message", e => {
                console.log("chat notif socket", e);

                this.props.getChatMembersV2Action({channel_id: e.channel_data.channel_id}, (err, res) => {
                    let channel = {
                        id: e.channel_data.channel_id,
                        entity_id: e.channel_data.post_id,
                        type: e.channel_data.entity_type,
                        title: e.channel_data.channel_title,
                        is_archived: 0,
                        is_pinned: 0,
                        is_hidden: 0,
                        is_muted: 0,
                        total_unread: 0,
                        profile: null,
                        selected: true,
                        inviter: null,
                        hasMore: true,
                        skip: 0,
                        members: res.data.results.map(u => u.user),
                        replies: [],
                        created_at: {
                            timestamp: Math.round(+new Date() / 1000),
                        },
                        last_reply: null,
                    };
                    this.props.addActiveChatChannelsAction([channel]);
                });

                //this.props.addChatNotificationAction(e)
            })
            .listen(".post-created", e => {
                //console.log(e, 'post created');
            })
            .listen(".post-view", e => {
                //console.log(e, 'post view');
                let payload = {
                    post_id: e.post_id,
                    viewers: [e.user.id],
                };
                this.props.updatePostViewersAction(payload);
            })
            .listen(".updated-post-visitors", e => {
                console.log(e, "comment post view");
                this.props.updatePostCommentViewers(e);
            })
            .listen(".post-updated", e => {
                //console.log(e, 'post updated')
            })
            .listen(".post-deleted", e => {
                //console.log(e, 'post deleted');
                this.props.incomingDeletedPostAction({post_id: e.post_id});
            })
            .listen(".reply-created", e => {
                //console.log(e, 'reply created');
            })
            .listen(".reply-updated", e => {
                console.log(e, "reply updated");
                if (e.message.invited_recipient_ids.length) {
                    this.props.getPostAction({
                        post_id: e.message.post_id,
                        personal_for_id: e.message.personalized_for_id,
                    });
                }
                this.props.incomingUpdatedReplyAction(e.message);
            })
            .listen(".move-private-topic-workspace", e => {
                console.log(e, "move workspace private");
                this.props.incomingMovedTopic(e);
            })
            .listen(".new-private-topic", e => {
                this.props.incomingCreatedTopic(e);
            })
            .listen(".update-private-topic", e => {
                this.props.incomingUpdatedTopic(e);
            })
            .listen(".new-member", e => {
                if (typeof e.user !== "undefined") {
                    let payload = {
                        group_id: e.group_id,
                        user_id: e.user.id,
                        type: "join",
                        mode: "member",
                        user: e.user,
                    };
                    this.props.updateTopicMembersAction(payload);
                }
            })
            .listen(".left-member", e => {
                //console.log(e, 'left member');
                if (e.user.id !== undefined) {
                    let payload = {
                        group_id: e.group_id,
                        user_id: e.user.id,
                        type: "remove",
                        mode: "member",
                        user: e.user,
                    };
                    this.props.updateTopicMembersAction(payload);
                }
            })
            .listen(".unread-channel", e => {
                console.log(e, "unread channel");
                this.props.incomingUnreadChannel(e);
            })
            .listen(".update-channel-name", e => {
                console.log(e, "updated channel name");
                let data = {
                    ...e,
                    message: {
                        ...e.message,
                        g_date: localizeDate(e.message.created_at.timestamp, "YYYY-MM-DD"),
                        user: null,
                        is_read: true,
                        files: [],
                        reactions: [],
                        unfurls: [],
                        mention_html: null,
                        quote: null,
                    },
                };
                this.props.incomingUpdatedChannelDetail(data);
            })
            .listen(".member-update-timestamp", e => {
                console.log("seen member", e);
                this.props.updateMemberTimestamp(e);
            })
            .listen(".chat-notification", e => {
                console.log(e);

                if (e.entity_type === "REMINDER_MESSAGE") {
                    e.message_original = e.message;

                    const channelName = e.message.replace(e.message.substr(0, e.message.search(" in ") + 4, e.message), "");
                    e.message = e.message.replace(` in ${channelName}`, ` in <a data-href="/chat/${e.channel_code}">#${channelName}</a>`);

                    const link = `/chat/${e.channel_code}/${e.code}`;
                    e.message = e.message.replace("this message", `<a class="push" data-href="${link}">this message</a>`);
                    e.message = `${e.message}<br/> <span class="action"><a class="btn btn-complete btn-action">Mark as Complete</a> <a class="btn btn-delete btn-action"">Delete</a></span>`;
                }

                let urlArray = [...new Set(urlify(e.message))];
                if (urlArray.length) {
                    this.props.generateUnfurl({
                        type: "chat",
                        message_id: e.entity_id,
                        link_url: urlArray[0],
                    }, (err, res) => {
                        if (res) {
                            this.props.generateUnfurlReducer({
                                unfurls: res.data.unfurls,
                                channel_id: e.channel_id,
                                message_id: e.entity_id,
                            });
                        } else {
                            console.log(err);
                        }
                    });
                }

                let fromUser = {};
                if (e.message_from === 0) {
                    fromUser = {
                        id: this.props.user.id,
                        first_name: this.props.user.name,
                        name: e.message_from.user_name,
                        profile_image_link: this.props.user.profile_image_link,
                    };
                } else {
                    fromUser = {
                        id: e.message_from.user_id,
                        first_name: e.message_from.first_name,
                        name: e.message_from.user_name,
                        profile_image_link: e.message_from.profile_image_link,
                    };
                }

                if (e.reference_id === undefined || e.reference_id === null) {
                    let payload = {
                        last_reply: {
                            user: fromUser,
                            body: e.message,
                            id: e.entity_id,
                            created_at: e.created_at,
                        },
                        reply: {
                            body: e.message,
                            created_at: e.created_at,
                            updated_at: e.created_at,
                            files: e.files,
                            id: e.entity_id,
                            is_deleted: 0,
                            is_transferred: e.is_transferred,
                            quote: e.quote ? {
                                ...e.quote,
                                user_id: e.quote.user ? e.quote.user.id : e.quote.user_id,
                            } : null,
                            is_read: false,
                            reactions: [],
                            user: fromUser,
                            unfurls: e.unfurls,
                            mention_html: e.mention_html ? e.mention_html : null,
                            channel_id: e.channel_id,
                            g_date: localizeDate(e.created_at.timestamp, "YYYY-MM-DD"),
                            code: e.code,
                        },
                    };

                    if (e.message_original) {
                        payload = {
                            ...payload,
                            reply: {
                                ...payload.reply,
                                original_body: e.message_original,
                            },
                        };
                    }

                    if (urlArray.length) {
                        payload = {
                            ...payload,
                            reply: {
                                ...payload.reply,
                                unfurl_loading: true,
                            },
                        };
                    }

                    this.props.incomingChatMessageFromOthers(payload);
                    this.props.addFilesToChannelAction({
                        channel_id: e.channel_id,
                        files: e.files,
                    });

                    //@todo together with service worker
                    //if incoming chat message is on selected channel and current url is not on chat page
                    // if (this.props.selectedChannel && this.props.selectedChannel.id === e.channel_id && this.props.match.path !== "/chat") {
                    //     if (e.id !== 0) {
                    //         this.props.addUnreadChatCount({channel_id: e.channel_id});
                    //     }
                    // }

                    if (e.id === 0 && e.is_muted) {

                    } else {
                        // if incoming chat is not on selected channel or if the window is not focused
                        if ((e.message_from.user_id !== this.props.user.id &&
                            this.props.selectedChannel && this.props.selectedChannel.id !== e.channel_id) ||
                            (e.message_from.user_id !== this.props.user.id && !this.state.focus)) {


                            if (isSafari) {
                                if (e.message_from === 0) {
                                    pushBrowserNotification(`Personal BOT`,
                                        `${stripHtml(e.message)}`,
                                        e.message_from.profile_image_link,
                                        null);
                                } else {
                                    pushBrowserNotification(`${e.message_from.first_name} ${e.reference_title ? `in #${e.reference_title}` : "in a direct message"}`,
                                        `${e.message_from.first_name}: ${stripHtml(e.message)}`,
                                        e.message_from.profile_image_link,
                                        null);
                                }
                            }

                            if (!(this.props.selectedChannel && this.props.selectedChannel.id === e.channel_id && document.querySelector("body").classList.contains("visible"))
                                && (Object.entries(this.props.settings).length === 0 ||
                                    this.props.settings.DISABLE_SOUND !== "1")) {
                                //@todo
                                // audio.play({
                                //     onplay: () => {
                                //     },
                                //     onerror: function (errorCode, description) {
                                //         console.log(errorCode, description);
                                //     },
                                // });
                            }

                        }
                    }
                } else {
                    // with reference id
                    let reply = {
                        body: e.message,
                        created_at: e.created_at,
                        updated_at: e.created_at,
                        files: e.files,
                        id: e.entity_id,
                        is_deleted: 0,
                        is_read: true,
                        is_transferred: e.is_transferred,
                        quote: e.quote ? {
                            ...e.quote,
                            user_id: e.quote.user.id,
                        } : null,
                        reactions: [],
                        user: fromUser,
                        unfurls: e.unfurls,
                        mention_html: e.mention_html ? e.mention_html : null,
                        channel_id: e.channel_id,
                        g_date: localizeDate(e.created_at.timestamp, "YYYY-MM-DD"),
                        code: e.code,
                        reference_id: e.reference_id,
                    };

                    if (e.message_original) {
                        reply = {
                            ...reply,
                            original_body: e.message_original,
                        };
                    }

                    let payload = {
                        last_reply: {
                            user: fromUser,
                            body: e.message,
                            id: e.entity_id,
                            created_at: e.created_at,
                            is_read: true,
                        },
                        reply: reply,
                    };

                    if (urlArray.length) {
                        payload = {
                            ...payload,
                            reply: {
                                ...payload.reply,
                                unfurl_loading: true,
                            },
                        };
                    }
                    //this.props.markAllMessagesAsRead({channel_id: e.channel_id});
                    this.props.incomingChatMessage(payload);
                    this.props.addFilesToChannelAction({
                        channel_id: e.channel_id,
                        files: e.files,
                    });
                }
            })
            .listen(".delete-post-channel-member", e => {
                console.log(e, "delete chat member");
                if (e.remove_member_ids[0] === this.props.user.id) return;
                let message = {
                    ...e.message_data,
                    is_deleted: 0,
                    reactions: [],
                    last_reply: null,
                    reply: {
                        body: e.message_data.body,
                        created_at: e.message_data.created_at,
                        updated_at: e.message_data.created_at,
                        files: [],
                        id: e.message_data.id,
                        is_deleted: 0,
                        quote: null,
                        reactions: [],
                        user: null,
                        unfurls: [],
                        is_read: false,
                        channel_id: e.channel_id,
                        g_date: localizeDate(e.message_data.created_at.timestamp, "YYYY-MM-DD"),
                        code: e.code,
                    },
                    unfurls: [],
                    created_at: e.message_data.created_at,
                    id: e.id,
                    channel_id: e.channel_id,
                    body: e.message_data.body,
                    user: null,
                    files: [],
                    quote: null,
                };
                this.props.incomingChatMessageFromOthers(message);
                //get the chat channel details
                if (this.props.activeChatChannels.length) {
                    this.props.getChatChannelAction({channel_id: e.channel_id}, (err, res) => {
                        console.log(res);
                        if (err) return;
                        // update chat members
                        if (this.props.activeChatChannels.filter(ac => ac.id === res.data.id).length) {
                            let channel = this.props.activeChatChannels.filter(ac => ac.id === res.data.id)[0];
                            let updatedChannel = {
                                ...channel,
                                members: res.data.members,
                                profile: res.data.members.length === 2 ? res.data.members.filter(m => m.id !== this.props.user.id)[0] : null,
                            };
                            if (channel.type === "DIRECT") {
                                let payload = {
                                    //title: res.data.members.map(m => m.first_name).slice(0, 6).join(', '),
                                    title: res.data.title,
                                    id: channel.id,
                                    is_pinned: channel.is_pinned,
                                    is_archived: channel.is_archived,
                                    is_muted: channel.is_muted,
                                };
                                this.props.updateChatChannelV2Action(payload, (err, res) => {
                                    if (err) {
                                        console.log(err, "error");
                                    }
                                });
                                updatedChannel = {
                                    ...updatedChannel,
                                    //title: res.data.members.length === 2 ? res.data.members.filter(m => m.id !== this.props.user.id)[0].first_name : res.data.members.map(m => m.first_name).slice(0, 6).join(', ')
                                };
                                this.props.updateChannelAction(updatedChannel);
                            } else {
                                this.props.updateChannelAction(updatedChannel);
                            }
                        }

                    });
                }
            })
            .listen(".topic-first-message", e => {

            })
            .listen(".new-added-member-chat", e => {
                console.log("new chat member", e);
                let message = {
                    ...e,
                    is_deleted: 0,
                    reactions: [],
                    last_reply: null,
                    reply: {
                        body: e.body,
                        created_at: e.created_at,
                        updated_at: e.created_at,
                        files: [],
                        id: e.id,
                        is_deleted: 0,
                        quote: null,
                        reactions: [],
                        user: null,
                        unfurls: [],
                        is_read: false,
                        channel_id: e.channel_id,
                        g_date: localizeDate(e.created_at.timestamp, "YYYY-MM-DD"),
                        code: e.code,
                    },
                    unfurls: [],
                    created_at: e.created_at,
                    id: e.id,
                    channel_id: e.channel_id,
                    body: e.body,
                    user: null,
                    files: [],
                    quote: e.quote,
                };
                this.props.incomingChatMessageFromOthers(message);
                this.props.getChannel({channel_id: e.channel_id}, (err, res) => {
                    console.log(res);
                    if (err) return;
                    let payload = {
                        channel_id: e.channel_id,
                        members: res.data.members,
                        title: res.data.title,
                    };
                    this.props.updateChannelMembersTitle(payload);
                });
                //this.props.getChannelMembers({channel_id: e.channel_id})
                // if (this.props.activeChatChannels.length) {
                //     this.props.getChatChannelAction({channel_id: e.channel_id}, (err, res) => {
                //         console.log(res);
                //         if (err) return;
                //         // update chat members
                //         if (this.props.activeChatChannels.filter(ac => ac.id === res.data.id).length) {
                //             let channel = this.props.activeChatChannels.filter(ac => ac.id === res.data.id)[0];
                //             let updatedChannel = {
                //                 ...channel,
                //                 members: res.data.members,
                //                 profile: null,
                //             };
                //             if (channel.type === "DIRECT") {
                //                 let payload = {
                //                     //title: res.data.members.map(m => m.first_name).slice(0, 6).join(', '),
                //                     title: res.data.title,
                //                     id: channel.id,
                //                     is_pinned: channel.is_pinned,
                //                     is_archived: channel.is_archived,
                //                     is_muted: channel.is_muted,
                //                 };
                //                 this.props.updateChatChannelV2Action(payload, (err, res) => {
                //                     if (err) {
                //                         console.log(err, "error");
                //                     }
                //                 });
                //                 updatedChannel = {
                //                     ...updatedChannel,
                //                     //title: res.data.members.map(m => m.first_name).slice(0, 6).join(', ')
                //                 };
                //                 this.props.updateChannelAction(updatedChannel);
                //             } else {
                //                 this.props.updateChannelAction(updatedChannel);
                //             }
                //         }

                //     });
                // }
            })
            .listen(".archived-chat-channel", e => {
                console.log(e, "archived chat");
                this.props.incomingArchivedChannel(e.channel_data);
            })
            .listen(".new-chat-channel", e => {
                console.log(e, "chat channel");
                if (e.channel_data.creator_by.id !== this.props.user.id) {
                    this.props.getChannel({channel_id: e.channel_data.channel_id}, (err, res) => {
                        if (err) return;
                        let channel = {
                            ...res.data,
                            selected: false,
                            replies: [],
                            skip: 0,
                            hasMore: true,
                        };
                        this.props.addToChannels(channel);
                    });
                }
            })
            .listen(".update-chat-message", e => {
                console.log("incoming update chat message", e);
                let payload = {
                    channel_id: e.channel_id,
                    message_id: e.entity_id,
                    body: e.message,
                    mention_html: e.mention_html,
                    updated_at: e.created_at,
                    unfurls: e.unfurls,
                };
                this.props.incomingUpdatedChatMessage(payload);
            })
            .listen(".delete-chat-notification", e => {
                let payload = {
                    channel_id: e.channel_id,
                    message_id: e.id,
                };
                this.props.incomingDeletedChatMessage(payload);
            })
            .listen(".chat-message-react", e => {
                console.log(e);
                this.props.incomingChatMessageReaction({...e, user_name: e.name});
            })
            .listen(".updated-notification-counter", e => {
                console.log(e, "updated counter");
                //const reducer = (accumulator, currentValue) => accumulator + currentValue;
                //let count = 0;
                let chatCount = e.result.filter(c => {
                    if (c.entity_type === "CHAT_MESSAGE" || c.entity_type === "CHAT_REMINDER_MESSAGE") return true;
                    else return false;
                });
                if (chatCount.length) {
                    //count = chatCount.map(c => c.count).flat().reduce(reducer);
                }
                // let chat_count = null;
                // if (e.result.filter(r => r.entity_type === 'CHAT_MESSAGE').length) {
                //     chat_count = e.result.filter(r => r.entity_type === 'CHAT_MESSAGE')[0].count
                // }

                //disabled temporarily
                //this.props.incomingReadChannelReducer({channel_id: e.entity_id, updated_chat_count: count});
            })
            .notification((notification) => {
                //let checkNotificationExists = this.props.notifications.filter(n => n.id === notification.id).length;
                // if (checkNotificationExists === 0) {
                //     if (this.props.notifications.length === 0) {
                //         this.props.getNotificationsAction();
                //     }


                //     let slugName = getSlugName();
                //     let formattedSlugName = slugName.charAt(0).toUpperCase() + slugName.slice(1);
                //     let pushNotificationTitle = formattedSlugName;

                //     if (notification.data.notification_type === "POST" || notification.data.notification_type === "MULTI_POST") {
                //         let pid = (notification.data.personalized_for_id) ? `?personalized_for_id=${notification.data.personalized_for_id}` : "";
                //         if (notification.data.author.id !== this.props.user.id) {
                //             this.props.incomingPostAction(notification.data);
                //             //plus one only
                //             this.props.updateStreamCounterAction({post: notification.data, type: "plus", value: 1});
                //             pushBrowserNotification(pushNotificationTitle,
                //                 `${notification.author.name} has posted ${notification.data.title}.`,
                //                 notification.author.profile_image_link,
                //                 () => this.props.history.push(`/postdetail/${notification.post_id}${pid}`));
                //             if (notification.data.type !== "REDIRECT") {
                //                 let notificationData = {
                //                     id: notification.id,
                //                     message: notification.data.title,
                //                     entity_id: notification.post_id,
                //                     entity_type: "NEW_POST",
                //                     message_from: notification.author,
                //                     is_read: 0,
                //                     created_at: notification.created_at,
                //                     data: {
                //                         post_id: notification.post_id,
                //                         type: notification.data.notification_type,
                //                         must_read: notification.data.is_must_read ? 1 : 0,
                //                         must_reply: notification.data.is_must_reply ? 1 : 0,
                //                         personalized_for_id: notification.data.personalized_for_id,
                //                     },
                //                     status: "NEW",
                //                 };
                //                 this.props.simpleNewNotificationSocketAction(notificationData);
                //                 this.props.simpleAddNewNotificationLengthAction();
                //             }
                //         } else {
                //             let updatedPost = {
                //                 ...notification.data,
                //                 is_updated: true,
                //             };
                //             if (notification.data.original_type === "MULTI_POST") {
                //                 updatedPost = {
                //                     ...updatedPost,
                //                     type: "MULTI_POST",
                //                     personalized_for_id: null,
                //                 };
                //             }
                //             this.props.incomingPostAction(updatedPost);
                //         }
                //         if (!window.location.pathname.includes("stream")) {
                //             this.props.simpleAddUnreadPostAction();
                //         }
                //     }
                //     if (notification.data.notification_type === "MENTION") {
                //         let pid = (notification.data.personalized_for_id) ? `?personalized_for_id=${notification.data.post.personalized_for_id}` : "";
                //         pushBrowserNotification(pushNotificationTitle,
                //             `${notification.author.name} has replied to ${notification.data.post.title}`,
                //             notification.author.profile_image_link,
                //             () => this.props.history.push(`/postdetail/${notification.data.post.id}${pid}`));
                //         let notificationData = {
                //             id: notification.id,
                //             message: notification.data.post.title,
                //             entity_id: notification.data.post.id,
                //             entity_type: "POST_MENTION",
                //             message_from: notification.author,
                //             is_read: 0,
                //             created_at: notification.created_at,
                //             data: {
                //                 post_id: notification.data.post.id,
                //                 type: "POST",
                //                 must_read: 0,
                //                 must_reply: 0,
                //                 personalized_for_id: notification.data.post.personalized_for_id,
                //             },
                //             status: "NEW",
                //         };
                //         this.props.simpleNewNotificationSocketAction(notificationData);
                //         this.props.simpleAddNewNotificationLengthAction();
                //         if (!notification.data.title) {
                //             this.props.incomingReplyAction({
                //                 ...notification.data,
                //                 isAuthor: notification.data.author.id === this.props.user.id,
                //             });
                //         } else {
                //             this.props.incomingPostAction(notification.data);
                //         }
                //     }
                //     if (notification.data.notification_type === "REPLY") {
                //         //console.log(notification.data, 'incoming reply');
                //         if (notification.data.body === notification.data.code) return;
                //         if (notification.data.is_chat) {
                //         } else {

                //             let pid = (notification.data.personalized_for_id) ? `?personalized_for_id=${notification.data.post.personalized_for_id}` : "";
                //             if (!this.state.focus && this.props.user.id !== notification.author.id) {
                //                 pushBrowserNotification(pushNotificationTitle,
                //                     `${notification.author.name} has replied to ${notification.data.post.title}`,
                //                     notification.author.profile_image_link,
                //                     () => this.props.history.push(`/postdetail/${notification.data.post.id}${pid}`));
                //             }
                //             if (notification.data.author.id !== this.props.user.id) {
                //                 let notificationData = {
                //                     id: notification.id,
                //                     message: notification.data.post.title,
                //                     entity_id: notification.data.id,
                //                     entity_type: "POST_COMMENT",
                //                     message_from: notification.author,
                //                     is_read: 0,
                //                     created_at: notification.created_at,
                //                     data: {
                //                         post_id: notification.data.post_id,
                //                         type: "POST",
                //                         must_read: 0,
                //                         must_reply: 0,
                //                         personalized_for_id: notification.data.personalized_for_id,
                //                     },
                //                     status: "NEW",
                //                 };
                //                 this.props.simpleNewNotificationSocketAction(notificationData);
                //                 this.props.simpleAddNewNotificationLengthAction();

                //                 if (this.props.allPosts && this.props.allPosts.posts) {
                //                     let postExist = false;
                //                     let postUpdated = false;
                //                     let post = null;
                //                     this.props.allPosts.posts.forEach(p => {
                //                         if (p.id === notification.data.post_id) {
                //                             postExist = true;
                //                             post = p;
                //                             this.props.updatedPostIds.forEach(id => {
                //                                 if (id === notification.data.post_id) {
                //                                     postUpdated = true;

                //                                 }
                //                             });

                //                         }
                //                     });
                //                     //console.log(postExist, postUpdated, post)
                //                     if (!postExist) {
                //                         //fetch the post here
                //                         this.props.getPostAction({
                //                             post_id: notification.data.post_id,
                //                             personal_for_id: notification.data.personalized_for_id,
                //                         });
                //                         //check notification data post unread reply ids length for adding counter
                //                         this.props.updateStreamCounterAction({type: "plus", value: 1});
                //                         this.setState({postIds: [...this.state.postIds, notification.data.post_id]});
                //                     } else if (postUpdated) {
                //                         this.props.updateStreamCounterAction({type: "plus", value: 1});
                //                     } else if (!postUpdated) {
                //                         if (post.is_updated) {
                //                             this.setState({postIds: [...this.state.postIds, notification.data.post_id]});
                //                             let payload = {
                //                                 ...post,
                //                                 is_updated: false,
                //                             };
                //                             this.props.updatePostSimpleAction(payload);
                //                             //plus one only since the post existed
                //                             this.props.updateStreamCounterAction({type: "plus", value: 1});
                //                         } else {
                //                             if (post.unread_count > 0) {
                //                                 this.props.updateStreamCounterAction({type: "plus", value: 1});
                //                             }
                //                         }
                //                     }
                //                 }
                //             } else {
                //                 console.log(notification.data);
                //                 let clearPostReply = false;
                //                 this.props.replyNotifications.forEach(rn => {
                //                     if (rn.post_id === notification.data.post_id && rn.personalized_for_id === notification.data.personalized_for_id) {
                //                         clearPostReply = true;

                //                     }
                //                 });
                //                 if (clearPostReply) {
                //                     this.props.clearPostReplyNotification({
                //                         post_id: notification.data.post_id,
                //                         personalized_for_id: notification.data.personalized_for_id,
                //                     });
                //                 }
                //             }
                //             this.props.incomingReplyAction({
                //                 ...notification.data,
                //                 isAuthor: notification.data.author.id === this.props.user.id,
                //             });
                //         }
                //     }
                //     if ((notification.data.notification_type === "CLAP" || notification.data.notification_type === "CHAT_CLAP") &&
                //         notification.data.author.id !== this.props.user.id) {

                //         let pid = (notification.data.post.personalized_for_id) ? `?personalized_for_id=${notification.data.post.personalized_for_id}` : "";
                //         if (!localStorage.getItem("has_active") && notification.data.clap_count > 0) {
                //             pushBrowserNotification(pushNotificationTitle,
                //                 `${notification.author.name} 👏 at ${notification.data.post.title}`,
                //                 notification.author.profile_image_link,
                //                 () => this.props.history.push(`/postdetail/${notification.data.post.id}${pid}`));
                //         }
                //         if (notification.data.clap_count > 0 && notification.initiator_id === this.props.user.id) {
                //             toaster.notify(`${notification.author.name} 👏 at ${notification.data.post.title}`, {position: "bottom-left"});
                //         }
                //         let user_clap_count = 0;
                //         if (notification.data.prev_clap_count < notification.data.clap_count) {
                //             user_clap_count = notification.data.clap_count - notification.data.prev_clap_count;
                //         } else {
                //             user_clap_count = notification.data.clap_count - notification.data.prev_clap_count;
                //         }
                //         let payload = {
                //             isAuthor: this.props.user.id === notification.author.id,
                //             total_clap_count: user_clap_count,
                //             post_id: notification.data.post.id,
                //             //user_clap_count: user_clap_count,
                //             user_clap_count: notification.data.clap_count,
                //             message_id: notification.data.message_id,
                //             parent_id: notification.data.parent_id,
                //         };
                //         this.props.incomingClapCountAction(payload);
                //     }

                //     this.setState({
                //         hasNotificationRecieve: true,
                //     });
                // }

            });


    };

    render() {
        return <PreloadEmojiImage
            src={"https://unpkg.com/emoji-datasource-apple@5.0.1/img/apple/sheets-256/64.png"}/>;
    }
}

function mapStateToProps({
                             session: {user},
                             settings: {userSettings},
                             chat: {channels, selectedChannel},
                             posts: {posts},
                         }) {
    return {
        user,
        settings: userSettings,
        channels,
        selectedChannel,
        posts,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        addToChannels: bindActionCreators(addToChannels, dispatch),
        addUserToReducers: bindActionCreators(addUserToReducers, dispatch),
        getChannel: bindActionCreators(getChannel, dispatch),
        setBrowserTabStatus: bindActionCreators(setBrowserTabStatus, dispatch),
        getOnlineUsers: bindActionCreators(getOnlineUsers, dispatch),
        getConnectedSlugs: bindActionCreators(getConnectedSlugs, dispatch),
        getUser: bindActionCreators(getUser, dispatch),
        updateMemberTimestamp: bindActionCreators(updateMemberTimestamp, dispatch),
        markAllMessagesAsRead: bindActionCreators(markAllMessagesAsRead, dispatch),
        incomingChatMessage: bindActionCreators(incomingChatMessage, dispatch),
        incomingChatMessageFromOthers: bindActionCreators(incomingChatMessageFromOthers, dispatch),
        addFilesToChannelAction: bindActionCreators(addFilesToChannel, dispatch),
        generateUnfurl: bindActionCreators(generateUnfurl, dispatch),
        generateUnfurlReducer: bindActionCreators(generateUnfurlReducer, dispatch),
        updateChannelReducer: bindActionCreators(updateChannelReducer, dispatch),
        incomingArchivedChannel: bindActionCreators(incomingArchivedChannel, dispatch),
        incomingChatMessageReaction: bindActionCreators(incomingChatMessageReaction, dispatch),
        incomingUpdatedChatMessage: bindActionCreators(incomingUpdatedChatMessage, dispatch),
        incomingDeletedChatMessage: bindActionCreators(incomingDeletedChatMessage, dispatch),
        incomingUpdatedChannelDetail: bindActionCreators(incomingUpdatedChannelDetail, dispatch),
        getChannelMembers: bindActionCreators(getChannelMembers, dispatch),
        updateChannelMembersTitle: bindActionCreators(updateChannelMembersTitle, dispatch),
        incomingWorkspaceFolder: bindActionCreators(incomingWorkspaceFolder, dispatch),
        incomingWorkspace: bindActionCreators(incomingWorkspace, dispatch),
        incomingUpdatedWorkspaceFolder: bindActionCreators(incomingUpdatedWorkspaceFolder, dispatch),
        incomingMovedTopic: bindActionCreators(incomingMovedTopic, dispatch),

        // logoutAction: bindActionCreators(logout, dispatch),
        // simpleNewNotificationSocketAction: bindActionCreators(simpleNewNotificationSocket, dispatch),
        // getNotificationsAction: bindActionCreators(getNotifications, dispatch),
        // simpleAddNewNotificationLengthAction: bindActionCreators(simpleAddNewNotificationLength, dispatch),
        // incomingPostAction: bindActionCreators(incomingPost, dispatch),
        // incomingReplyAction: bindActionCreators(incomingReply, dispatch),
        // incomingUpdatedReplyAction: bindActionCreators(incomingUpdatedReply, dispatch),
        // incomingClapCountAction: bindActionCreators(incomingClapCount, dispatch),
        // simpleAddUnreadPostAction: bindActionCreators(simpleAddUnreadPost, dispatch),
        // getUserAction: bindActionCreators(getUser, dispatch),
        // updateTopicMembersAction: bindActionCreators(updateTopicMembers, dispatch),
        // updatePostViewersAction: bindActionCreators(updatePostViewers, dispatch),
        // incomingDeletedPostAction: bindActionCreators(incomingDeletedPost, dispatch),
        // onlineUsersAction: bindActionCreators(onlineUsers, dispatch),
        // loggingInUserAction: bindActionCreators(loggingInUser, dispatch),
        // loggingOutUserAction: bindActionCreators(loggingOutUser, dispatch),
        // addChatNotificationAction: bindActionCreators(addChatNotification, dispatch),
        // incomingArchivedChatAction: bindActionCreators(incomingArchivedChat, dispatch),
        // addRemovePostRecipientAction: bindActionCreators(addRemovePostRecipient, dispatch),
        // createPostMessageAction: bindActionCreators(createPostMessage, dispatch),
        // getTotalUnreadNotificationAction: bindActionCreators(getTotalUnreadNotification, dispatch),
        // getTotalUnreadPostsAction: bindActionCreators(getTotalUnreadPosts, dispatch),
        // getPostEntriesAction: bindActionCreators(getPostEntries, dispatch),
        // getUnreadChatRepliesAction: bindActionCreators(getUnreadChatReplies, dispatch),
        // incomingCreatedTaskAction: bindActionCreators(incomingCreatedTask, dispatch),
        // updateStreamCounterAction: bindActionCreators(updateStreamCounter, dispatch),
        // getPostAction: bindActionCreators(getPost, dispatch),
        // updatePostSimpleAction: bindActionCreators(updatePostSimple, dispatch),
        // updateChatCounterAction: bindActionCreators(updateChatCounter, dispatch),
        // incomingChatMessageAction: bindActionCreators(incomingChatMessage, dispatch),
        // incomingUpdatedChatMessageAction: bindActionCreators(incomingUpdatedChatMessage, dispatch),
        // incomingDeletedChatMessageAction: bindActionCreators(incomingDeletedChatMessage, dispatch),
        // incomingChatMessageReaction: bindActionCreators(incomingChatMessageReaction, dispatch),
        // incomingVideoChatCallAction: bindActionCreators(incomingVideoChatCall, dispatch),
        // //getAllTotalUnreadChatV2Action: bindActionCreators(getAllTotalUnreadChatV2, dispatch),
        // addChatBoxAction: bindActionCreators(addChatBox, dispatch),
        // addActiveChatChannelsAction: bindActionCreators(addActiveChatChannels, dispatch),
        // setSelectedChannelAction: bindActionCreators(setSelectedChannel, dispatch),
        // updateChatBoxAction: bindActionCreators(updateChatBox, dispatch),
        // incomingNewBoardAction: bindActionCreators(incomingNewBoard, dispatch),
        // incomingTaskReducer: bindActionCreators(incomingTaskReducer, dispatch),
        // getUserSettingsAction: bindActionCreators(getUserSettings, dispatch),
        // newColumnReducer: bindActionCreators(newColumnReducer, dispatch),
        // incomingTaskCommentReducer: bindActionCreators(incomingTaskCommentReducer, dispatch),
        // incomingTaskReactionReducer: bindActionCreators(incomingTaskReactionReducer, dispatch),
        // incomingUpdatedTaskCommentReducer: bindActionCreators(incomingUpdatedTaskCommentReducer, dispatch),
        // incomingDeletedTaskCommentReducer: bindActionCreators(incomingDeletedTaskCommentReducer, dispatch),
        // incomingUpdatedTaskReducer: bindActionCreators(incomingUpdatedTaskReducer, dispatch),
        // getAllEntriesCountAction: bindActionCreators(getAllEntriesCount, dispatch),
        // incomingDeletedTaskReducer: bindActionCreators(incomingDeletedTaskReducer, dispatch),
        // updateTaskCounterReducer: bindActionCreators(updateTaskCounterReducer, dispatch),
        // getChatMembersV2Action: bindActionCreators(getChatMembersV2, dispatch),
        // addChatMembersAction: bindActionCreators(addChatMembers, dispatch),
        // incomingReadChannelReducer: bindActionCreators(incomingReadChannelReducer, dispatch),
        // getChatChannelAction: bindActionCreators(getChatChannel, dispatch),
        // updateChannelAction: bindActionCreators(updateChannel, dispatch),
        // clearPostReplyNotification: bindActionCreators(clearPostReplyNotification, dispatch),
        // updateTeamReducer: bindActionCreators(updateTeamReducer, dispatch),
        // moveTaskSocketReducer: bindActionCreators(moveTaskSocketReducer, dispatch),
        // postUsersOnlineAction: bindActionCreators(postUsersOnline, dispatch),
        // currentOnlineUsers: bindActionCreators(currentOnlineUsers, dispatch),
        // generateUnfurlAction: bindActionCreators(generateUnfurl, dispatch),
        // generateUnfurlReducer: bindActionCreators(generateUnfurlReducer, dispatch),
        // markAllMessagesAsReadAction: bindActionCreators(markAllMessagesAsRead, dispatch),
        // updateChatChannelV2Action: bindActionCreators(updateChatChannelV2, dispatch),
        // getConnectedSlugsAction: bindActionCreators(getConnectedSlugs, dispatch),
        // updatePostCommentViewers: bindActionCreators(updatePostCommentViewers, dispatch),
        // addTaskAssigneesSocket: bindActionCreators(addTaskAssigneesSocket, dispatch),
        // updatePostReaders: bindActionCreators(updatePostReaders, dispatch),
        // getUsersOnlineAction: bindActionCreators(getUsersOnline, dispatch),
        // userUnfollowPost: bindActionCreators(userUnfollowPost, dispatch),
        // updateOnlineUserTimestamp: bindActionCreators(updateOnlineUserTimestamp, dispatch),
        // getQuickLinks: bindActionCreators(getQuickLinks, dispatch),
        // userFollowPost: bindActionCreators(userFollowPost, dispatch),
        // addUnreadChatCount: bindActionCreators(addUnreadChatCount, dispatch),
        // incomingUpdatedChatChannelNameAction: bindActionCreators(incomingUpdatedChatChannelName, dispatch),
        // setBrowserTabStatus: bindActionCreators(setBrowserTabStatus, dispatch),
        // updateMemberTimestamp: bindActionCreators(updateMemberTimestamp, dispatch),
        // incomingUnreadChannel: bindActionCreators(incomingUnreadChannel, dispatch),
        // incomingCreatedTopic: bindActionCreators(incomingCreatedTopic, dispatch),
        // incomingDeletedTopic: bindActionCreators(incomingDeletedTopic, dispatch),
        // incomingUpdatedTopic: bindActionCreators(incomingUpdatedTopic, dispatch),
        // removeUserFromRecipientsAction: bindActionCreators(removeUserFromRecipients, dispatch),
        // getAllRecipientsAction: bindActionCreators(getAllRecipients, dispatch),
        // addUserToMentions: bindActionCreators(addUserToMentions, dispatch),
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Socket));