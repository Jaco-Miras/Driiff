import React from "react";
import {isSafari} from "react-device-detect";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {bindActionCreators} from "redux";
import {pushBrowserNotification} from "../../helpers/pushHelper";
import {replaceChar, stripHtml} from "../../helpers/stringFormatter";
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
    setAllMessagesAsRead,
    setChannel,
    setMemberTimestamp,
    setSelectedChannel,
    unreadChannelReducer,
    updateChannelMembersTitle,
} from "../../redux/actions/chatActions";
import {
    addFilesToChannel,
    deleteFilesFromChannel,
    incomingDeletedFile,
    incomingDeletedFolder,
    incomingDeletedPostFile,
    incomingEmptyTrash,
    incomingFile,
    incomingFiles,
    incomingFolder,
    incomingMovedFile,
    incomingRemovedFile,
    incomingRemovedFolder,
} from "../../redux/actions/fileActions";
import {
    addUserToReducers,
    generateUnfurl,
    generateUnfurlReducer,
    getConnectedSlugs,
    setBrowserTabStatus,
    setGeneralChat,
    setUnreadNotificationCounterEntries
} from "../../redux/actions/globalActions";
import {
    fetchPost,
    incomingComment,
    incomingCommentClap,
    incomingDeletedComment,
    incomingDeletedPost,
    incomingPost,
    incomingPostClap,
    incomingPostViewer,
    incomingUpdatedPost
} from "../../redux/actions/postActions";
import {getOnlineUsers, getUser, incomingUpdatedUser} from "../../redux/actions/userAction";
import {
    getWorkspace,
    incomingArchivedWorkspaceChannel,
    incomingMovedTopic,
    incomingTimeline,
    incomingUnArchivedWorkspaceChannel,
    incomingUpdatedWorkspaceFolder,
    incomingWorkspace,
    incomingWorkspaceFolder,
    updateWorkspaceCounter
} from "../../redux/actions/workspaceActions";

class SocketListeners extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        /**
         * @todo Online users are determined every 30 seconds
         * online user reducer should be updated every socket call
         */
        this.props.getOnlineUsers();
        setInterval(() => {
            this.props.getOnlineUsers();
        }, 30000);

        this.props.addUserToReducers({
            id: this.props.user.id,
            name: this.props.user.name,
            partial_name: this.props.user.partial_name,
            profile_image_link: this.props.user.profile_image_link,
        });

        // new socket
        window.Echo.private(`${localStorage.getItem("slug") === "dev24admin" ? "dev" : localStorage.getItem("slug")}.Driff.User.${this.props.user.id}`)
            .listen(".workspace-folder-notification", (e) => {
                console.log(e, "folder");
                switch (e.SOCKET_TYPE) {
                    case "FOLDER_CREATE": {
                        this.props.incomingFolder(e);
                        break;
                    }
                    case "FOLDER_UPDATE": {
                        this.props.incomingFolder(e);
                        break;
                    }
                    case "FOLDER_DELETE": {
                        this.props.incomingDeletedFolder(e);
                        break;
                    }
                    case "FOLDER_FORCE_DELETE": {
                        this.props.incomingRemovedFolder(e);
                        break;
                    }
                    default:
                        return null;
                }
            })
            .listen(".workspace-file-notification", (e) => {
                console.log(e, "file");
                switch (e.SOCKET_TYPE) {
                    case "FILE_UPDATE": {
                        this.props.incomingFile(e);
                        break;
                    }
                    case "FILE_MOVE": {
                        this.props.incomingMovedFile(e);
                        break;
                    }
                    case "FILE_TRASH": {
                        this.props.incomingDeletedFile(e);
                        break;
                    }
                    case "FILE_EMPTY": {
                        this.props.incomingEmptyTrash(e);
                        break;
                    }
                    case "FILE_DELETE": {
                        this.props.incomingRemovedFile(e);
                        break;
                    }
                    default:
                        return null;
                }
            })
            .listen(".workspace-timeline-notification", (e) => {
                console.log(e, "timeline");
                this.props.incomingTimeline(e);
            })
            .listen(".upload-bulk-private-workspace-files", (e) => {
                console.log(e, "files bulk");
                this.props.incomingFiles(e);
            })
            .listen(".post-notification", (e) => {
                console.log(e, "post-notif");
                switch (e.SOCKET_TYPE) {
                    case "POST_CREATE": {
                        if (e.show_at !== null && this.props.user.id === e.author.id) {
                            this.props.incomingPost(e);
                            // let show = e.show_at;
                            // show = show.split("-")
                            // show = {
                            //     'year': show[0],
                            //     'month': show[1],
                            //     'date': show[2].substring(0,2)
                            // }
                            // let d = new Date();
                            // let currentDate = {
                            //     'year': d.getFullYear(),
                            //     'month': d.getMonth() + 1,
                            //     'date': d.getDate()
                            // }
                            // if (moment(show).dayOfYear() <= moment(currentDate).dayOfYear()) {
                            //     this.props.incomingPost(e);
                            // }
                        } else {
                            this.props.incomingPost(e);
                        }
                        if (e.workspace_ids && e.workspace_ids.length >= 1) {
                            this.props.setGeneralChat({
                                count: 1,
                                entity_type: "WORKSPACE_POST",
                            });
                        }
                        break;
                    }
                    case "POST_UPDATE": {
                        this.props.incomingUpdatedPost(e);
                        break;
                    }
                    case "POST_DELETE": {
                        this.props.incomingDeletedPost(e);
                        break;
                    }
                    case "POST_COMMENT_UPDATE": {
                        this.props.incomingComment(e);
                        break;
                    }
                    case "POST_CLAP_TOGGLE": {
                        this.props.incomingPostClap(e);
                        break;
                    }

                    default:
                        return null;
                }
            })
            .listen(".post-comment-notification", (e) => {
                console.log(e, "comment-notif");

                switch (e.SOCKET_TYPE) {
                    case "POST_COMMENT_CREATE": {
                        this.props.incomingComment(e);
                        if (e.workspaces && e.workspaces.length >= 1) {
                          this.props.setGeneralChat({
                            count: 1,
                            entity_type: "WORKSPACE_POST",
                          });
                        }
                        if (e.author.id !== this.props.user.id) {
                          e.workspaces.forEach((ws) => {
                            this.props.fetchPost({ post_id: e.post_id }, (err, res) => {
                              if (err) return;
                              console.log(res);
                              if (!res.data.is_updated && res.data.unread_count === 1) {
                                //no changes
                              } else {
                                //plus 1
                                this.props.updateWorkspaceCounter({
                                  folder_id: ws.workspace_id,
                                  topic_id: ws.topic_id,
                                  unread_posts: 1,
                                });
                              }
                            });
                          });
                        }
                        break;
                    }
                    case "POST_COMMENT_DELETE": {
                        this.props.incomingDeletedComment(e);
                        break;
                    }
                    case "POST_COMMENT_UPDATE": {
                        this.props.incomingComment(e);
                        break;
                    }
                    case "POST_COMMENT_CLAP_TOGGLE": {
                        this.props.incomingCommentClap(e);
                        break;
                    }

                    default:
                        return null;
                }
            })
            .listen(".chat-notification", (e) => {
                console.log(e, "chat-notification");
                const {user, selectedChannel, isBrowserActive} = this.props;

                if (e.user.id !== user.id) {
                    this.props.soundPlay();
                }

                switch (e.SOCKET_TYPE) {
                    case "CHAT_CREATE": {
                        //@to do add unfurl
                        if (this.props.user.id !== e.user.id) {
                            delete e.reference_id;
                            e.g_date = this.props.localizeDate(e.created_at.timestamp, "YYYY-MM-DD");
                        }
                        this.props.incomingChatMessage(e);
                        delete e.SOCKET_TYPE;
                        delete e.socket;
                        if ((e.user.id !== user.id && selectedChannel && selectedChannel.id !== e.channel_id) || (e.user.id !== user.id && !isBrowserActive)) {
                            if (isSafari) {
                                pushBrowserNotification(`${e.user.first_name} ${e.reference_title ? `in #${e.reference_title}` : "in a direct message"}`, `${e.user.first_name}: ${stripHtml(e.body)}`, e.user.profile_image_link, null);
                            }
                        }

                        // update the unread indicator
                        if (e.workspace_id === undefined || e.workspace_id === null || e.workspace_id === 0) {
                            let notificationCounterEntryPayload = {};
                            if (e.entity_type === "CHAT_REMINDER_MESSAGE") {
                                notificationCounterEntryPayload = {
                                    count: 1,
                                    entity_type: "CHAT_REMINDER_MESSAGE",
                                };
                            } else {
                                notificationCounterEntryPayload = {
                                    count: 1,
                                    entity_type: "CHAT_MESSAGE",
                                };
                            }
                            this.props.setGeneralChat(notificationCounterEntryPayload);
                        } else {
                            this.props.setGeneralChat({
                                count: 1,
                                entity_type: "WORKSPACE_CHAT_MESSAGE",
                            });
                        }

                        break;
                    }
                    case "CHAT_UPDATE": {
                        this.props.incomingUpdatedChatMessage(e);
                        break;
                    }
                    case "CHAT_DELETE": {
                        //@change response and add the delete file reducer
                        this.props.incomingDeletedChatMessage(e);
                        break;
                    }

                    default:
                        return null;
                }
            });

        window.Echo.private(`${localStorage.getItem("slug") === "dev24admin" ? "dev" : localStorage.getItem("slug")}.App.Broadcast`)
            .listen(".user-notification", (e) => {
                console.log(e, "user notif");
                switch (e.SOCKET_TYPE) {
                    case "USER_UPDATE": {
                        this.props.incomingUpdatedUser(e);
                        break;
                    }
                    default:
                        return null;
                }
            })
            .listen(".post-notification", (e) => {
                console.log(e, "post notif broadcast");
                switch (e.SOCKET_TYPE) {
                    case "POST_DELETE_ATTACHMENT": {
                        this.props.incomingDeletedPostFile(e);
                        break;
                    }
                    case "POST_COMMENT_DELETE_ATTACHMENT": {
                        this.props.incomingDeletedPostFile(e);
                        break;
                    }
                    default:
                        return null;
                }
            })
            .listen(".workspace-timeline-notification", (e) => {
                console.log(e, "timeline");
                this.props.incomingTimeline(e);
            })
            .listen(".upload-bulk-workspace-files", (e) => {
                console.log(e, "files bulk");
                this.props.incomingFiles(e);
            })
            .listen(".workspace-file-notification", (e) => {
                console.log(e, "file");
                switch (e.SOCKET_TYPE) {
                    case "FILE_UPDATE": {
                        this.props.incomingFile(e);
                        break;
                    }
                    case "FILE_MOVE": {
                        this.props.incomingMovedFile(e);
                        break;
                    }
                    case "FILE_TRASH": {
                        this.props.incomingDeletedFile(e);
                        break;
                    }
                    case "FILE_EMPTY": {
                        this.props.incomingEmptyTrash(e);
                        break;
                    }
                    case "FILE_DELETE": {
                        this.props.incomingRemovedFile(e);
                        break;
                    }
                    default:
                        return null;
                }
            })
            .listen(".new-workspace", (e) => {
                console.log(e, "new workspace");
                if (e.topic !== undefined) {
                    this.props.incomingWorkspace(e);
                } else {
                    this.props.incomingWorkspaceFolder({
                        ...e.workspace,
                        key_id: e.key_id,
                        type: e.type,
                    });
                }
            })
            .listen(".update-workspace", (e) => {
                console.log(e, "update workspace");
                this.props.incomingUpdatedWorkspaceFolder(e);
                if (e.type === "WORKSPACE") {
                    if (e.new_member_ids.length > 0) {
                        const isMember = e.new_member_ids.some((id) => id === this.props.user.id);
                        if (isMember) {
                            this.props.getWorkspace({topic_id: e.id});
                        }
                    }
                    if (e.remove_member_ids.length > 0 && this.props.selectedChannel) {
                        if (this.props.selectedChannel.id === e.system_message.channel_id) {
                            //redirect to first channel
                            let wsChannels = Object.values(this.props.channels).filter((c) => {
                                const checkForId = (id) => id === this.props.user.id;
                                let isMember = c.members.map((m) => m.id).some(checkForId);
                                return c.type === "TOPIC" && isMember && c.is_hidden === 0;
                            });
                            if (wsChannels.length > 0 && this.props.location.pathname === `/chat/${this.props.selectedChannel.code}`) {
                                let channel = wsChannels[0];
                                this.props.setSelectedChannel(channel);
                                this.props.history.push(`/chat/${channel.code}`);
                            }
                        }
                    }
                }
                if (this.props.activeTopic && this.props.activeTopic.id === e.id && e.type === "WORKSPACE" && this.props.match.path === "/workspace") {
                    let currentPage = this.props.location.pathname;
                    currentPage = currentPage.split("/")[2];
                    if (e.workspace_id === 0) {
                        //direct workspace
                        if (e.original_workspace_id !== 0) {
                            //now direct workspace url
                            this.props.history.push(`/workspace/${currentPage}/${e.id}/${replaceChar(e.name)}`);
                        }
                    } else {
                        //moved workspace to another folder
                        if (e.original_workspace_id !== e.workspace_id) {
                            this.props.history.push(`/workspace/${currentPage}/${e.workspace_id}/${replaceChar(e.current_workspace_folder_name)}/${e.id}/${replaceChar(e.name)}`);
                        }
                    }
                }
            });
        // old / legacy channel
        window.Echo.private(`${localStorage.getItem("slug") === "dev24admin" ? "dev" : localStorage.getItem("slug")}.App.User.${this.props.user.id}`)
            .listen(".new-lock-workspace", (e) => {
                console.log(e, "new workspace lock");
                this.props.getChannel({code: e.channel.code}, (err, res) => {
                    if (err) return;
                    let channel = {
                        ...res.data,
                        hasMore: true,
                        skip: 0,
                        replies: [],
                        selected: true,
                    };
                    this.props.addToChannels(channel);
                });
                if (e.topic !== undefined) {
                    this.props.incomingWorkspace(e);
                } else {
                    this.props.incomingWorkspaceFolder({
                        ...e.workspace,
                        key_id: e.key_id,
                        type: e.type,
                    });
                }
            })
            .listen(".update-lock-workspace", (e) => {
                console.log(e, "update lock workspace");
                this.props.incomingUpdatedWorkspaceFolder(e);
                if (e.type === "WORKSPACE") {
                    if (e.new_member_ids.length > 0) {
                        const isMember = e.new_member_ids.some((id) => id === this.props.user.id);
                        if (isMember) {
                            this.props.getWorkspace({topic_id: e.id});
                        }
                    }
                    if (e.remove_member_ids.length > 0 && this.props.selectedChannel) {
                        if (this.props.selectedChannel.id === e.system_message.channel_id) {
                            //redirect to first channel
                            let wsChannels = Object.values(this.props.channels).filter((c) => {
                                const checkForId = (id) => id === this.props.user.id;
                                let isMember = c.members.map((m) => m.id).some(checkForId);
                                return c.type === "TOPIC" && isMember && c.is_hidden === 0;
                            });
                            if (wsChannels.length > 0 && this.props.location.pathname === `/chat/${this.props.selectedChannel.code}`) {
                                let channel = wsChannels[0];
                                this.props.setSelectedChannel(channel);
                                this.props.history.push(`/chat/${channel.code}`);
                            }
                        }
                    }
                }
                if (this.props.activeTopic && this.props.activeTopic.id === e.id && e.type === "WORKSPACE" && this.props.match.path === "/workspace") {
                    let currentPage = this.props.location.pathname;
                    currentPage = currentPage.split("/")[2];
                    if (e.workspace_id === 0) {
                        //direct workspace
                        if (e.original_workspace_id !== 0) {
                            //now direct workspace url
                            this.props.history.push(`/workspace/${currentPage}/${e.id}/${replaceChar(e.name)}`);
                        }
                    } else {
                        //moved workspace to another folder
                        if (e.original_workspace_id !== e.workspace_id) {
                            this.props.history.push(`/workspace/${currentPage}/${e.workspace_id}/${replaceChar(e.current_workspace_folder_name)}/${e.id}/${replaceChar(e.name)}`);
                        }
                    }
                }
            })
            .listen(".users-online", (e) => {
                console.log(e, "users-online");
                this.props.currentOnlineUsers(
                    e.current_users_online.map((u) => {
                        return {
                            ...u,
                            id: u.user_id,
                        };
                    })
                );
            })
            .listen(".post-view", (e) => {
                console.log(e, "post view");
                let payload = {
                    post_id: e.post_id,
                    viewer: e.user,
                };
                this.props.incomingPostViewer(payload);
            })
            .listen(".updated-post-visitors", (e) => {
                console.log(e, "comment post view");
                //this.props.updatePostCommentViewers(e);
            })
            .listen(".move-private-topic-workspace", (e) => {
                console.log(e, "move workspace private");
                this.props.incomingMovedTopic(e);
            })
            .listen(".new-member", (e) => {
                console.log(e, "join member");
                // if (typeof e.user !== "undefined") {
                //   let payload = {
                //     group_id: e.group_id,
                //     user_id: e.user.id,
                //     type: "join",
                //     mode: "member",
                //     user: e.user,
                //   };
                //   // this.props.updateTopicMembersAction(payload);
                // }
            })
            .listen(".new-topic-member", (e) => {
                console.log("new workspace member", e);
            })
            .listen(".left-member", (e) => {
                console.log(e, "left member");
                // if (e.user.id !== undefined) {
                //   let payload = {
                //     group_id: e.group_id,
                //     user_id: e.user.id,
                //     type: "remove",
                //     mode: "member",
                //     user: e.user,
                //   };
                //   //this.props.updateTopicMembersAction(payload);
                // }
            })
            // .listen(".unread-channel", (e) => {
            //   console.log(e, "unread channel");
            //   this.props.unreadChannelReducer(e);
            // })
            .listen(".update-channel-name", (e) => {
                console.log(e, "updated channel name");
                let data = {
                    ...e,
                    message: {
                        ...e.message,
                        g_date: this.props.localizeDate(e.message.created_at.timestamp),
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
            .listen(".member-update-timestamp", (e) => {
                //console.log("seen member", e);
                this.props.setMemberTimestamp(e);
            })
            .listen(".chat-notification", (e) => {
                console.log(e);

                let urlArray = [...new Set(urlify(e.message))];
                if (urlArray.length) {
                    this.props.generateUnfurl(
                        {
                            type: "chat",
                            message_id: e.entity_id,
                            link_url: urlArray[0],
                        },
                        (err, res) => {
                            if (res) {
                                this.props.generateUnfurlReducer({
                                    unfurls: res.data.unfurls,
                                    channel_id: e.channel_id,
                                    message_id: e.entity_id,
                                });
                            } else {
                                console.log(err);
                            }
                        }
                    );
                }
            })
            .listen(".delete-post-channel-member", (e) => {
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
                        g_date: this.props.localizeDate(e.message_data.created_at.timestamp),
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
                        if (this.props.activeChatChannels.filter((ac) => ac.id === res.data.id).length) {
                            let channel = this.props.activeChatChannels.filter((ac) => ac.id === res.data.id)[0];
                            let updatedChannel = {
                                ...channel,
                                members: res.data.members,
                                profile: res.data.members.length === 2 ? res.data.members.filter((m) => m.id !== this.props.user.id)[0] : null,
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
            .listen(".new-added-member-chat", (e) => {
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
                        g_date: this.props.localizeDate(e.created_at.timestamp),
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
            })
            .listen(".archived-chat-channel", (e) => {
                console.log(e, "archived chat");
                this.props.incomingArchivedChannel(e.channel_data);

                if (typeof e.channel_data.topic_detail !== "undefined") {
                    if (e.channel_data.status === "UNARCHIVED") {
                        this.props.incomingUnArchivedWorkspaceChannel(e.channel_data.topic_detail)
                    } else {
                        this.props.incomingArchivedWorkspaceChannel(e.channel_data.topic_detail)
                    }
                }
            })
            .listen(".new-chat-channel", (e) => {
                console.log(e, "chat channel");
                if (e.channel_data.creator_by.id !== this.props.user.id) {
                    this.props.getChannel({code: e.channel_data.code}, (err, res) => {
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
            .listen(".chat-message-react", (e) => {
                console.log(e);
                this.props.incomingChatMessageReaction({...e, user_name: e.name});
            })
            .listen(".updated-notification-counter", (e) => {
                console.log(e, "updated counter");

                this.props.setUnreadNotificationCounterEntries(e);
            });
    }

    render() {
        return null;
    }
}

function mapStateToProps({
                             session: {user},
                             settings: {userSettings},
                             chat: {channels, selectedChannel},
                             workspaces: {workspaces, workspacePosts},
                             global: {isBrowserActive}
                         }) {
    return {
        user,
        settings: userSettings,
        channels,
        selectedChannel,
        isBrowserActive,
        workspaces,
        workspacePosts,
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
        setMemberTimestamp: bindActionCreators(setMemberTimestamp, dispatch),
        setAllMessagesAsRead: bindActionCreators(setAllMessagesAsRead, dispatch),
        incomingChatMessage: bindActionCreators(incomingChatMessage, dispatch),
        incomingChatMessageFromOthers: bindActionCreators(incomingChatMessageFromOthers, dispatch),
        addFilesToChannelAction: bindActionCreators(addFilesToChannel, dispatch),
        deleteFilesFromChannelAction: bindActionCreators(deleteFilesFromChannel, dispatch),
        generateUnfurl: bindActionCreators(generateUnfurl, dispatch),
        generateUnfurlReducer: bindActionCreators(generateUnfurlReducer, dispatch),
        setChannel: bindActionCreators(setChannel, dispatch),
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
        setGeneralChat: bindActionCreators(setGeneralChat, dispatch),
        setUnreadNotificationCounterEntries: bindActionCreators(setUnreadNotificationCounterEntries, dispatch),

        incomingPost: bindActionCreators(incomingPost, dispatch),
        incomingPostClap: bindActionCreators(incomingPostClap, dispatch),
        incomingDeletedPost: bindActionCreators(incomingDeletedPost, dispatch),
        incomingComment: bindActionCreators(incomingComment, dispatch),
        incomingCommentClap: bindActionCreators(incomingCommentClap, dispatch),
        incomingFolder: bindActionCreators(incomingFolder, dispatch),
        incomingDeletedFolder: bindActionCreators(incomingDeletedFolder, dispatch),
        incomingFile: bindActionCreators(incomingFile, dispatch),
        incomingFiles: bindActionCreators(incomingFiles, dispatch),
        incomingDeletedFile: bindActionCreators(incomingDeletedFile, dispatch),
        incomingMovedFile: bindActionCreators(incomingMovedFile, dispatch),
        incomingEmptyTrash: bindActionCreators(incomingEmptyTrash, dispatch),
        incomingPostViewer: bindActionCreators(incomingPostViewer, dispatch),
        incomingUpdatedPost: bindActionCreators(incomingUpdatedPost, dispatch),
        incomingTimeline: bindActionCreators(incomingTimeline, dispatch),
        incomingDeletedPostFile: bindActionCreators(incomingDeletedPostFile, dispatch),
        incomingDeletedComment: bindActionCreators(incomingDeletedComment, dispatch),
        incomingUpdatedUser: bindActionCreators(incomingUpdatedUser, dispatch),
        unreadChannelReducer: bindActionCreators(unreadChannelReducer, dispatch),
        incomingRemovedFile: bindActionCreators(incomingRemovedFile, dispatch),
        incomingRemovedFolder: bindActionCreators(incomingRemovedFolder, dispatch),
        getWorkspace: bindActionCreators(getWorkspace, dispatch),
        setSelectedChannel: bindActionCreators(setSelectedChannel, dispatch),
        incomingArchivedWorkspaceChannel: bindActionCreators(incomingArchivedWorkspaceChannel, dispatch),
        incomingUnArchivedWorkspaceChannel: bindActionCreators(incomingUnArchivedWorkspaceChannel, dispatch),
        updateWorkspaceCounter: bindActionCreators(updateWorkspaceCounter, dispatch),
        fetchPost: bindActionCreators(fetchPost, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SocketListeners));
