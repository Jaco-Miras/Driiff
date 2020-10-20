import React, { Component } from "react";
import { isSafari } from "react-device-detect";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import { sessionService } from "redux-react-session";
import { pushBrowserNotification } from "../../helpers/pushHelper";
import { replaceChar, stripHtml } from "../../helpers/stringFormatter";
import { urlify } from "../../helpers/urlContentHelper";
import {
  addToChannels,
  deletePostNotification,
  getChannel,
  getChannelDetail,
  getChannelMembers,
  incomingArchivedChannel,
  incomingChatMessage,
  incomingChatMessageFromOthers,
  incomingChatMessageReaction,
  incomingDeletedChatMessage,
  incomingPostNotificationMessage,
  incomingUpdatedChannelDetail,
  incomingUpdatedChatMessage,
  setAllMessagesAsRead,
  setChannel,
  setMemberTimestamp,
  setSelectedChannel,
  unreadChannelReducer,
  updateChannelMembersTitle
} from "../../redux/actions/chatActions";
import {
  addFilesToChannel,
  deleteFilesFromChannel,
  incomingCompanyDeletedFile,
  incomingCompanyDeletedFiles,
  incomingCompanyDeletedFolder,
  incomingCompanyEmptyTrash,
  incomingCompanyFile,
  incomingCompanyFiles,
  incomingCompanyFolder,
  incomingCompanyMovedFile,
  incomingCompanyMoveFile,
  incomingCompanyRestoreFile,
  incomingCompanyRestoreFolder,
  incomingCompanyUpdatedFile,
  incomingCompanyUpdatedFolder,
  incomingDeletedFile,
  incomingDeletedFiles,
  incomingDeletedFolder,
  incomingDeletedGoogleFile,
  incomingDeletedPostFile,
  incomingEmptyTrash,
  incomingFile,
  incomingFiles,
  incomingFolder,
  incomingGoogleFile,
  incomingGoogleFolder,
  incomingMovedFile,
  incomingRemovedCompanyFile,
  incomingRemovedCompanyFolder,
  incomingRemovedFile,
  incomingRemovedFolder,
  incomingRestoreFile,
  incomingRestoreFolder,
} from "../../redux/actions/fileActions";
import {
  addToModals,
  addUserToReducers,
  generateUnfurl,
  generateUnfurlReducer,
  getConnectedSlugs,
  incomingDoneToDo,
  incomingFavouriteItem,
  incomingRemoveToDo,
  incomingToDo,
  incomingUpdateToDo,
  refetchMessages,
  refetchOtherMessages,
  setBrowserTabStatus,
  setGeneralChat,
  setUnreadNotificationCounterEntries,
} from "../../redux/actions/globalActions";
import {
  fetchPost,
  incomingComment,
  incomingCommentClap,
  incomingDeletedComment,
  incomingDeletedPost,
  incomingMarkAsRead,
  incomingPost,
  incomingPostClap,
  incomingPostMarkDone,
  incomingPostViewer,
  incomingReadUnreadReducer,
  incomingUpdatedPost
} from "../../redux/actions/postActions";
import {
  getOnlineUsers,
  getUser,
  incomingExternalUser,
  incomingInternalUser,
  incomingUpdatedUser,
  incomingUserRole
} from "../../redux/actions/userAction";
import {
  getWorkspace,
  getWorkspaceFolder,
  incomingArchivedWorkspaceChannel,
  incomingDeletedWorkspaceFolder,
  incomingMovedTopic,
  incomingTimeline,
  incomingUnArchivedWorkspaceChannel,
  incomingUpdatedWorkspaceFolder,
  incomingWorkspace,
  incomingWorkspaceFolder,
  incomingWorkspaceRole,
  joinWorkspaceReducer,
  updateWorkspaceCounter
} from "../../redux/actions/workspaceActions";
import { incomingUpdateCompanyName, updateCompanyPostAnnouncement } from "../../redux/actions/settingsActions";
import { isIPAddress } from "../../helpers/commonFunctions";
import { incomingReminderNotification } from "../../redux/actions/notificationActions";

class SocketListeners extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reconnected: null,
      disconnectedTimestamp: null,
      reconnectedTimestamp: null,
    };
  }

  refetch = () => {
    if (this.props.lastReceivedMessage) {
      this.props.refetchMessages({message_id: this.props.lastReceivedMessage.id})
    }
  }

  refetchOtherMessages = () => {
    if (this.props.lastReceivedMessage && Object.values(this.props.channels).length) {
      let channels = Object.values(this.props.channels)
      this.props.refetchOtherMessages(
        { message_id: this.props.lastReceivedMessage.id, 
          channel_ids: channels.filter((c) => {
            return typeof c.id === "number" && c.id !== this.props.lastReceivedMessage.channel_id
          }).map((c) => c.id)
        }, (err, res) => {
          if (err) return;
          let channelsWithMessage = res.data.filter((c) => c.count_message > 0);
          channelsWithMessage.forEach((c) => {
            this.props.getChannelDetail({id: c.channel_id});
          })
        }
      )
    }
  }

  componentDidMount() {

    window.Echo.connector.socket.on("connect", () => {
      console.log("socket connected");
    });
    window.Echo.connector.socket.on("disconnect", () => {
      console.log("socket disconnected");
      this.setState({disconnectedTimestamp: Math.floor(Date.now() / 1000)});
    });
    window.Echo.connector.socket.on("reconnect", () => {
      console.log("socket reconnected");
      this.setState({ reconnected: true, reconnectedTimestamp: Math.floor(Date.now() / 1000)});
      this.refetch();
      this.refetchOtherMessages();
    });
    window.Echo.connector.socket.on("reconnecting", function () {
      console.log("socket reconnecting");
    });
    /**
     * @todo Online users are determined every 30 seconds
     * online user reducer should be updated every socket call
     */
    this.props.getOnlineUsers();
    setInterval(() => {
      this.props.getOnlineUsers();
    }, 30000);

    // this.props.addUserToReducers({
    //   id: this.props.user.id,
    //   name: this.props.user.name,
    //   partial_name: this.props.user.partial_name,
    //   profile_image_link: this.props.user.profile_image_link,
    //   type: this.props.user.type,
    // });

    // new socket
    window.Echo.private(`${localStorage.getItem("slug") === "dev24admin" ? "dev" : localStorage.getItem("slug")}.Driff.User.${this.props.user.id}`)
      .listen(".todo-notification", (e) => {
        console.log("todo notification", e);
        switch (e.SOCKET_TYPE) {
          case "CREATE_TODO": {
            this.props.incomingToDo(e);
            break;
          }
          case "UPDATE_TODO": {
            this.props.incomingUpdateToDo(e);
            break;
          }
          case "DONE_TODO": {
            this.props.incomingDoneToDo(e);
            break;
          }
          case "DELETE_TODO": {
            this.props.incomingRemoveToDo(e);
            break;
          }
          case "REMIND_TODO": {
            //pushBrowserNotification(`${e.author.first_name} shared a post`, e.title, e.author.profile_image_link, null);
            this.props.incomingUpdateToDo(e);
            break;
          }
          case "ADVANCE_REMIND_TODO": {
            if (isSafari) {
              if (this.props.notificationsOn) {
                let redirect = () => {
                  if (e.link_type) {
                    let link = "";
                    if (e.link_type === "POST_COMMENT" || e.link_type === "POST") {
                      if (e.data.workspaces.length) {
                        if (e.data.workspaces[0].workspace){
                          link = `/workspace/posts/${e.data.workspaces[0].workspace.id}/${replaceChar(e.data.workspaces[0].workspace.name)}/${e.data.workspaces[0].topic.id}/${replaceChar(e.data.workspaces[0].topic.name)}/post/${e.data.post.id}/${replaceChar(e.data.post.title)}`;
                        } else {
                          link = `/workspace/posts/${e.data.workspaces[0].topic.id}/${replaceChar(e.data.workspaces[0].topic.name)}/post/${e.data.post.id}/${replaceChar(e.data.post.title)}`;
                        }
                      } else {
                        link = `/posts/${e.data.post.id}/${replaceChar(e.data.post.title)}`;
                      }
                    } else if (e.link_type === "CHAT") {
                      link = `/chat/${e.data.channel.code}/${e.data.chat_message.code}`;
                    }
                    if (link !== "") {
                      this.props.history.push(link);
                    }
                  } else {
                    this.props.history.push("/todos");
                  }
                }
                pushBrowserNotification(`You asked to be reminded about ${e.title}`, e.title, this.props.user.profile_image_link, redirect);
              }
            }
            this.props.incomingReminderNotification(e);
            break;
          }
          default:
            return null;
        }
      })
      .listen(".workspace-role-notification", (e) => {
        console.log("workspace role", e);
        this.props.incomingWorkspaceRole(e);
      })
      .listen(".google-attachment-notification", (e) => {
        console.log("google attachment", e)
        switch (e.SOCKET_TYPE) {
          case "GOOGLE_ATTACHMENT_CREATE": {
            if (e.attachment_type === "GOOGLE_DRIVE_FILE") {
              this.props.incomingGoogleFile(e);
            } else if (e.attachment_type === "GOOGLE_DRIVE_FOLDER") {
              this.props.incomingGoogleFolder(e);
            }
            break;
          }
          default:
            return null;
        }
      })
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
            if (this.props.match.url === "/workspace/files") {
              if (this.props.location.pathname.includes(e.folder.id) && this.props.location.pathname.includes(e.topic_id)) {
                let pathname = this.props.location.pathname.split("/folder/")[0];
                this.props.history.push(pathname);
              }
            }
            break;
          }
          case "FOLDER_RESTORE": {
            this.props.incomingRestoreFolder(e);
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
        console.log(e, "file", "line 170");
        switch (e.SOCKET_TYPE) {
          case "FILE_RESTORE": {
            this.props.incomingRestoreFile(e);
            break;
          }
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
          case "FILE_BULK_TRASH": {
            this.props.incomingDeletedFiles(e);
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
      .listen(".favourite-notification", (e) => {
        console.log(e, "favourite-notification");
        switch (e.SOCKET_TYPE) {
          case "FAVOURITE_ITEM": {
            this.props.incomingFavouriteItem(e);
            break;
          }
          default: {
            return null;
          }
        }
      })
      .listen(".unread-post", (e) => {
        console.log(e, "unread-post");
        this.props.incomingReadUnreadReducer(e);
      })
      .listen(".post-notification", (e) => {
        console.log(e, "post-notif");
        switch (e.SOCKET_TYPE) {
          case "POST_CREATE": {
            if (this.props.user.id !== e.author.id) {
              if (isSafari) {
                if (this.props.notificationsOn) {
                  pushBrowserNotification(`${e.author.first_name} shared a post`, e.title, e.author.profile_image_link, null);
                }
              }
            }
            if (e.show_at !== null && this.props.user.id === e.author.id) {
              this.props.incomingPost(e);
            } else {
              this.props.incomingPost(e);
            }
            if (e.workspace_ids && e.workspace_ids.length >= 1) {
              if (this.props.user.id !== e.author.id) {
                this.props.setGeneralChat({
                  count: 1,
                  entity_type: "WORKSPACE_POST",
                });
              }
            }
            if (typeof e.channel_messages === "undefined") {
              console.log(e);
            }
            e.channel_messages && e.channel_messages.forEach(m => {
              m.system_message.files = [];
              m.system_message.editable = false;
              m.system_message.unfurls = [];
              m.system_message.reactions = [];
              m.system_message.is_deleted = false;
              m.system_message.todo_reminder = null;
              m.system_message.is_read = false;
              m.system_message.is_completed = false;
              m.system_message.user = null;
              this.props.incomingPostNotificationMessage(m.system_message);
            });
            break;
          }
          case "POST_UPDATE": {
            this.props.incomingUpdatedPost(e);
            if (e.channel_messages && e.post_participant_data) {
              if (!e.post_participant_data.all_participant_ids.some((p) => p === this.props.user.id)) {
                //user is not participant of post
                this.props.deletePostNotification(e.channel_messages)
              } else {
                e.channel_messages && e.channel_messages.forEach(m => {
                  m.system_message.files = [];
                  m.system_message.editable = false;
                  m.system_message.unfurls = [];
                  m.system_message.reactions = [];
                  m.system_message.is_deleted = false;
                  m.system_message.todo_reminder = null;
                  m.system_message.is_read = true;
                  m.system_message.is_completed = false;
                  m.system_message.user = null;
                  this.props.incomingPostNotificationMessage(m.system_message);
                });
              }
              if (!e.post_participant_data.from_company) {
                // from private to public post
                this.props.incomingPost(e);
                e.channel_messages && e.channel_messages.forEach(m => {
                  m.system_message.files = [];
                  m.system_message.editable = false;
                  m.system_message.unfurls = [];
                  m.system_message.reactions = [];
                  m.system_message.is_deleted = false;
                  m.system_message.todo_reminder = null;
                  m.system_message.is_read = true;
                  m.system_message.is_completed = false;
                  m.system_message.user = null;
                  this.props.incomingPostNotificationMessage(m.system_message);
                });
              }
            }
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
          case "MARKED_DONE": {
            this.props.incomingPostMarkDone(e);
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
              if (e.author.id !== this.props.user.id) {
                this.props.setGeneralChat({
                  count: 1,
                  entity_type: "WORKSPACE_POST",
                });
              }
            }
            if (e.author.id !== this.props.user.id) {
              if (isSafari) {
                if (this.props.notificationsOn) {
                  let link = "";
                  if (e.workspaces.length) {
                    if (e.workspaces[0].workspace_id){
                      link = `/workspace/posts/${e.workspaces[0].workspace_id}/${replaceChar(e.workspaces[0].workspace_name)}/${e.workspaces[0].topic_id}/${replaceChar(e.workspaces[0].topic_name)}/post/${e.post_id}/${replaceChar(e.post_title)}`;
                    } else {
                      link = `/workspace/posts/${e.workspaces[0].topic_id}/${replaceChar(e.workspaces[0].topic_name)}/post/${e.post_id}/${replaceChar(e.post_title)}`;
                    }
                  } else {
                    link = `/posts/${e.post_id}/${replaceChar(e.post_title)}`;
                  }
                  const redirect = () => this.props.history.push(link, {focusOnMessage: e.id})
                  if (link !== this.props.location.pathname || !this.props.isBrowserActive) {
                    pushBrowserNotification(`${e.author.first_name} replied in a post`, stripHtml(e.body), e.author.profile_image_link, redirect);
                  }
                }
              }
              e.workspaces.forEach((ws) => {
                this.props.getWorkspace({topic_id: ws.topic_id}, (err, res) => {
                  if (err) return;
                  this.props.updateWorkspaceCounter({
                    folder_id: ws.workspace_id,
                    topic_id: ws.topic_id,
                    unread_count: res.data.workspace_data.unread_count,
                    unread_posts: res.data.workspace_data.topic_detail.unread_posts,
                    unread_chats: res.data.workspace_data.topic_detail.unread_chats,
                  });
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

        switch (e.SOCKET_TYPE) {
          case "CHAT_CREATE": {
            //unfurl link
            let message = {...e};
            let urlArray = [...new Set(urlify(e.body))];
            if (urlArray.length) {
              this.props.generateUnfurl(
                {
                  type: "chat",
                  message_id: message.id,
                  link_url: urlArray[0],
                },
                (err, res) => {
                  if (res) {
                    this.props.generateUnfurlReducer({
                      unfurls: res.data.unfurls,
                      channel_id: message.channel_id,
                      message_id: message.id,
                    });
                  } else {
                    console.log(err);
                  }
                }
              );
            }
            if (message.user.id !== user.id && !message.is_muted) {
              this.props.soundPlay();
            }
            if (this.props.user.id !== message.user.id) {
              delete message.reference_id;
              message.g_date = this.props.localizeDate(e.created_at.timestamp, "YYYY-MM-DD");
              if (this.props.isLastChatVisible && this.props.selectedChannel && this.props.selectedChannel.id === message.channel_id && isBrowserActive) {
                message.is_read = true;
              }
            }
            this.props.incomingChatMessage(message);
            delete e.SOCKET_TYPE;
            delete e.socket;
            if (e.user.id !== user.id) {
              if (!e.is_muted) {
                if (this.props.notificationsOn && isSafari) {
                  if (!(this.props.location.pathname.includes("/chat/") && selectedChannel.code === e.channel_code) || !isBrowserActive) {
                    const redirect = () => this.props.history.push(`/chat/${e.channel_code}/${e.code}`);
                    pushBrowserNotification(`${e.reference_title}`, e.reference_title.includes("in a direct message") ? `${stripHtml(e.body)}` : `${e.user.first_name}: ${stripHtml(e.body)}`, e.user.profile_image_link, redirect);
                  }
                }
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
                if (message.user.id !== user.id) {
                  notificationCounterEntryPayload = {
                    count: 1,
                    entity_type: "CHAT_MESSAGE",
                  };
                }
              }
              this.props.setGeneralChat(notificationCounterEntryPayload);
            } else {
              if (message.user.id !== user.id) {
                this.props.setGeneralChat({
                  count: 1,
                  entity_type: "WORKSPACE_CHAT_MESSAGE",
                });
              }
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
      .listen(".updated-version", (e) => {
        if (!(isIPAddress(window.location.hostname) || window.location.hostname === "localhost")
          && localStorage.getItem("site_ver") !== e.version) {
          const { version, requirement } = e;
          const handleReminder = () => {
            setTimeout(() => {
              this.props.addToModals({
                id: version,
                type: "update_found",
                requirement: requirement,
                handleReminder: handleReminder,
              });
            }, [30 * 60 * 1000]);
          };

          this.props.addToModals({
            id: version,
            type: "update_found",
            requirement: requirement,
            handleReminder: handleReminder,
          });
          localStorage.setItem("site_ver", version);
        }
      })
      .listen(".user-role-notification", (e) => {
        console.log(e, "updated role")
        this.props.incomingUserRole(e);
        if (e.user_id === this.props.user.id) {
          this.props.getUser({ id: this.props.user.id }, (err, res) => {
            if (err) return;
            sessionService.saveUser({ ...res.data });
          });
        }
      })
      .listen(".company-announcement", (e) => {
        this.props.updateCompanyPostAnnouncement(e);
      })
      .listen(".company-request-form-notification", (e) => {
        console.log(e, "company-request-form-notification");
        switch (e.SOCKET_TYPE) {
          case "CREATE_REQUEST_FORM": {
            this.props.incomingInternalUser(e);
            break;
          }
        }
      })
      .listen(".company-notification", (e) => {
        console.log(e, "company-notification");
        switch (e.SOCKET_TYPE) {
          case "UPDATE_COMPANY_NAME": {
            this.props.incomingUpdateCompanyName(e);
            break;
          }
        }
      })
      .listen(".company-file-notification", (e) => {
        console.log(e, "company file");
        switch (e.SOCKET_TYPE) {
          case "FILE_EMPTY": {
            this.props.incomingCompanyEmptyTrash(e);
            break;
          }
          case "UPLOAD_BULK": {
            this.props.incomingCompanyFiles(e);
            break;
          }
          case "FILE_MOVE": {
            this.props.incomingCompanyMoveFile(e);
            break;
          }
          case "FILE_RESTORE": {
            this.props.incomingCompanyRestoreFile(e);
            break;
          }
          case "FILE_TRASH": {
            this.props.incomingCompanyRemovedFile(e);
            break;
          }
          case "FILE_UPDATE": {
            this.props.incomingCompanyUpdatedFile(e);
            break;
          }
          default:
            return null
        }
      })
      .listen(".company-folder-notification", (e) => {
        console.log(e, "company folder");
        switch (e.SOCKET_TYPE) {
          case "FOLDER_CREATE": {
            this.props.incomingCompanyFolder(e);
            break;
          }
          case "FOLDER_UPDATE": {
            this.props.incomingCompanyUpdatedFolder(e);
            break;
          }
          case "FOLDER_DELETE": {
            this.props.incomingCompanyDeletedFolder(e);
            break;
          }
          case "FOLDER_RESTORE": {
            this.props.incomingCompanyRestoreFolder(e);
            break;
          }
          default:
            return null
        }
      })
      .listen(".delete-workspace", (e) => {
        console.log("deleted folder", e)
        this.props.incomingDeletedWorkspaceFolder(e);
      })
      .listen(".workspace-role-notification", (e) => {
        console.log("workspace role", e);
        this.props.incomingWorkspaceRole(e);
      })
      .listen(".google-attachment-notification", (e) => {
        console.log("google attachment", e)
        switch (e.SOCKET_TYPE) {
          case "ATTACHMENT_CREATE": {
            if (e.attachment_type === "GOOGLE_DRIVE_FILE") {
              this.props.incomingGoogleFile(e);
            } else if (e.attachment_type === "GOOGLE_DRIVE_FOLDER") {
              this.props.incomingGoogleFolder(e);
            }
            break;
          }
          case "ATTACHMENT_DELETE": {
            this.props.incomingDeletedGoogleFile(e);
            break;
          }
          default:
            return null;
        }
      })
      .listen(".user-activated", (e) => {
        console.log(e, "new user");

      })
      .listen(".external-user-notification", (e) => {
        console.log(e, "new external user");
        this.props.incomingExternalUser(e);
      })
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
        console.log(e, "file", "line 506");
        switch (e.SOCKET_TYPE) {
          case "FILE_RESTORE": {
            this.props.incomingRestoreFile(e);
            break;
          }
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
          case "FILE_BULK_TRASH": {
            this.props.incomingDeletedFiles(e);
            break;
          }
          default:
            return null;
        }
      })
      .listen(".new-workspace", (e) => {
        console.log(e, "new workspace");
        if (e.topic !== undefined) {
          if (e.workspace !== null) {
            if (!this.props.folders.hasOwnProperty(e.workspace.id)) {
              this.props.getWorkspaceFolder({folder_id: e.workspace.id}, (err, res) => {
                if (err) return;
                this.props.incomingWorkspace(e);
              });
            } else {
              this.props.incomingWorkspace(e);
            }
          } else {
            this.props.incomingWorkspace(e);
          }

          this.props.getChannel({code: e.channel.code}, (err, res) => {
            if (err) return;
            let channel = {
              ...res.data,
              hasMore: true,
              skip: 0,
              replies: [],
              selected: true,
              isFetching: false,
            };
            this.props.addToChannels(channel);
          });
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
              if (e.workspace_id !== 0 && !this.props.folders.hasOwnProperty(e.workspace_id)) {
                this.props.getWorkspaceFolder({folder_id: e.workspace_id}, (err, res) => {
                  if (err) return;
                  this.props.getWorkspace({topic_id: e.id});
                });
              } else {
                this.props.getWorkspace({topic_id: e.id});
              }
              // get the folder if the workspace folder does not exists yet
            }
          }
          if (e.remove_member_ids.length > 0) {
            if (e.remove_member_ids.some((id) => id === this.props.user.id)) {
              if (this.props.user.type === "external" || e.private === 1) {
                if (Object.keys(this.props.workspaces).length) {
                  let workspace = Object.values(this.props.workspaces)[0];
                  if (workspace.folder_id) {
                    this.props.history.push(`/workspace/chat/${workspace.folder_id}/${replaceChar(workspace.folder_name)}/${workspace.id}/${replaceChar(workspace.name)}`);
                  } else {
                    this.props.history.push(`/workspace/chat/${workspace.id}/${replaceChar(workspace.name)}`);
                  }
                }
              }
            }
            if (this.props.selectedChannel) {
              if (this.props.selectedChannel.id === e.system_message.channel_id) {
                //redirect to first channel
                let wsChannels = Object.values(this.props.channels).filter((c) => {
                  const checkForId = (id) => id === this.props.user.id;
                  let isMember = c.members.map((m) => m.id).some(checkForId);
                  return c.type === "TOPIC" && isMember && !c.is_hidden;
                });
                if (wsChannels.length > 0 && this.props.location.pathname === `/chat/${this.props.selectedChannel.code}`) {
                  let channel = wsChannels[0];
                  this.props.setSelectedChannel(channel);
                  this.props.history.push(`/chat/${channel.code}`);
                }
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
      .listen(".post-require-author-notify", (e) => {
        console.log(e, ".post-read-require");
      })
      .listen(".post-read-require", (e) => {
        console.log(e, ".post-read-require");
        this.props.incomingMarkAsRead(e);
      })
      .listen(".new-lock-workspace", (e) => {
        console.log(e, "new workspace lock");

        if (e.topic !== undefined) {
          if (e.workspace !== null) {
            if (!this.props.folders.hasOwnProperty(e.workspace.id)) {
              this.props.getWorkspaceFolder({folder_id: e.workspace.id}, (err, res) => {
                if (err) return;
                this.props.incomingWorkspace(e);
              });
            } else {
              this.props.incomingWorkspace(e);
            }
          } else {
            this.props.incomingWorkspace(e);
          }

          this.props.getChannel({code: e.channel.code}, (err, res) => {
            if (err) return;
            let channel = {
              ...res.data,
              hasMore: true,
              skip: 0,
              replies: [],
              selected: true,
              isFetching: false,
            };
            this.props.addToChannels(channel);
          });
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
              if (e.workspace_id !== 0 && !this.props.folders.hasOwnProperty(e.workspace_id)) {
                this.props.getWorkspaceFolder({folder_id: e.workspace_id}, (err, res) => {
                  if (err) return;
                  this.props.getWorkspace({topic_id: e.id});
                });
              } else {
                this.props.getWorkspace({topic_id: e.id});
              }
              // get the folder if the workspace folder does not exists yet
            }
          }
          if (e.remove_member_ids.length > 0) {
            if (e.remove_member_ids.some((id) => id === this.props.user.id)) {
              if (this.props.user.type === "external" || e.private === 1) {
                if (Object.keys(this.props.workspaces).length) {
                  let workspace = Object.values(this.props.workspaces)[0];
                  if (workspace.folder_id) {
                    this.props.history.push(`/workspace/chat/${workspace.folder_id}/${replaceChar(workspace.folder_name)}/${workspace.id}/${replaceChar(workspace.name)}`);
                  } else {
                    this.props.history.push(`/workspace/chat/${workspace.id}/${replaceChar(workspace.name)}`);
                  }
                }
              }
            }
            if (this.props.selectedChannel) {
              if (this.props.selectedChannel.id === e.system_message.channel_id) {
                //redirect to first channel
                let wsChannels = Object.values(this.props.channels).filter((c) => {
                  const checkForId = (id) => id === this.props.user.id;
                  let isMember = c.members.map((m) => m.id).some(checkForId);
                  return c.type === "TOPIC" && isMember && !c.is_hidden;
                });
                if (wsChannels.length > 0 && this.props.location.pathname === `/chat/${this.props.selectedChannel.code}`) {
                  let channel = wsChannels[0];
                  this.props.setSelectedChannel(channel);
                  this.props.history.push(`/chat/${channel.code}`);
                }
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
      .listen(".update-channel-name", (e) => {
        console.log(e, "updated channel name");
        let data = {
          ...e,
          message: {
            ...e.message,
            g_date: this.props.localizeDate(e.message.created_at.timestamp, "YYYY-MM-DD"),
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
      .listen(".new-added-member-chat", (e) => {
        console.log("new chat member", e);
        if (e.id) {
          let data = JSON.parse(e.body.replace("CHANNEL_UPDATE::", ""));
          let message = {
            ...e,
            is_deleted: false,
            reactions: [],
            last_reply: null,
            body: e.body,
            created_at: e.created_at,
            updated_at: e.created_at,
            files: [],
            id: e.id,
            quote: null,
            user: null,
            unfurls: [],
            is_read: false,
            channel_id: e.channel_id,
            g_date: this.props.localizeDate(e.created_at.timestamp, "YYYY-MM-DD"),
            code: e.code,
          };

          let newMembers = Object.values(this.props.users).filter((u) => {
            return data.added_members.some((id) => id === u.id);
          }).map((m) => {
            return {
              ...m,
              bot_profile_image_link: null,
              last_visited_at: null,
              active: 1,
              workspace_role: ""
            }
          });

          let payload = {
            users: newMembers,
            channel_id: e.channel_id,
            data: e,
            message: message,
          }

          if (!this.props.channels.hasOwnProperty(e.channel_id) && data.author.id !== this.props.user.id) {
            this.props.getChannel({code: e.channel_code}, (err, res) => {
              if (err) return;
              let channel = {
                ...res.data,
                hasMore: true,
                skip: 0,
                replies: [],
                selected: true,
                is_archived: res.data.is_archived === 1,
                isFetching: false,
              };
              this.props.addToChannels(channel);
            });
            if (e.workspace_data) {
              if (e.workspace_data.workspace && !this.props.folders.hasOwnProperty(e.workspace_data.workspace.id)) {
                this.props.getWorkspaceFolder({folder_id: e.workspace_data.workspace.id}, (err, res) => {
                  if (err) return;
                  this.props.getWorkspace({topic_id: e.workspace_data.topic.id});
                });
              } else {
                this.props.getWorkspace({topic_id: e.workspace_data.topic.id});
              }
            }
          } else {
            this.props.joinWorkspaceReducer(payload);
          }
        }
      })
      .listen(".archived-chat-channel", (e) => {
        console.log(e, "archived chat", this.props);
        if (e.channel_data.topic_detail) {
          if (e.channel_data.status === "UNARCHIVED") {
            this.props.incomingUnArchivedWorkspaceChannel(e.channel_data)
          } else {
            if (this.props.activeTopic && this.props.activeTopic.id === e.channel_data.topic_detail.id) {
              let workspace = null;
              if (e.channel_data.topic_detail.workspace_id !== null || e.channel_data.topic_detail.workspace_id !== 0) {
                // set the workspace to the first workspace of the folder
                // get the workspaces under the folder
                if (this.props.folders.hasOwnProperty(e.channel_data.topic_detail.workspace_id) && this.props.folders[e.channel_data.topic_detail.workspace_id].workspace_ids.length > 1) {

                  let otherWorkspaces = Object.values(this.props.workspaces).filter((ws) => {
                    return this.props.folders[e.channel_data.topic_detail.workspace_id].workspace_ids.some((id) => id === ws.id);
                  }).sort((a,b) => a.name.localeCompare(b.name));
                  console.log(otherWorkspaces, "other workspaces")
                  if (otherWorkspaces[0].id === this.props.activeTopic.id) {
                    workspace = otherWorkspaces[1];
                  } else {
                    workspace = otherWorkspaces[0];
                  }
                } else {
                  //set the workspace to the first workspace of the general folder
                  let workspaces = Object.values(this.props.workspaces).filter((ws) => {
                    return ws.folder_id === null;
                  }).sort((a,b) => a.name.localeCompare(b.name))

                  if (workspaces.length) {
                    workspace = workspaces[0];
                  }
                }
              } else {
                //set the workspace to the first workspace of the general folder
                let workspaces = Object.values(this.props.workspaces).filter((ws) => {
                  return ws.folder_id === null;
                }).sort((a,b) => a.name.localeCompare(b.name))

                if (workspaces.length) {
                  workspace = workspaces[0];
                }
              }

              if (workspace) {
                this.props.workspaceActions.selectWorkspace(workspace);
                this.props.workspaceActions.redirectTo(workspace);
              }
            }
            this.props.incomingArchivedWorkspaceChannel(e.channel_data);
          }
        } else {
          this.props.incomingArchivedChannel(e.channel_data);
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
              isFetching: false,
              creator: e.channel_data.creator_by
            };
            this.props.addToChannels(channel);
          });
        }
      })
      .listen(".chat-message-react", (e) => {
        console.log(e);
        this.props.incomingChatMessageReaction({ ...e, user_name: e.name });
      })
      .listen(".updated-notification-counter", (e) => {
        console.log(e, "updated counter");
        this.props.setUnreadNotificationCounterEntries(e);
      });
  }

  componentDidUpdate(prevProps, prevState) {
    this.props.useDriff.updateFaviconState(Object.keys(this.props.unreadCounter)
      .filter(k => k !== "chat_reminder_message")
      .reduce((total, k) => {
        total += this.props.unreadCounter[k];
        return total;
      }, 0) !== 0);
  }

  render() {
    return null;
  }
}

function mapStateToProps({
                           session: { user },
                           settings: { userSettings },
                           chat: { channels, selectedChannel, isLastChatVisible, lastReceivedMessage },
                           workspaces: { workspaces, workspacePosts, folders, activeTopic, workspacesLoaded },
                           global: { isBrowserActive, unreadCounter },
                           users: { mentions, users }
                         }) {
  return {
    user,
    users,
    settings: userSettings,
    channels,
    selectedChannel,
    isBrowserActive,
    workspacePosts,
    folders,
    mentions,
    activeTopic,
    workspacesLoaded,
    workspaces,
    isLastChatVisible,
    lastReceivedMessage,
    unreadCounter
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
    incomingRestoreFile: bindActionCreators(incomingRestoreFile, dispatch),
    incomingRestoreFolder: bindActionCreators(incomingRestoreFolder, dispatch),
    incomingEmptyTrash: bindActionCreators(incomingEmptyTrash, dispatch),
    incomingCompanyFolder: bindActionCreators(incomingCompanyFolder, dispatch),
    incomingCompanyUpdatedFolder: bindActionCreators(incomingCompanyUpdatedFolder, dispatch),
    incomingCompanyDeletedFolder: bindActionCreators(incomingCompanyDeletedFolder, dispatch),
    incomingCompanyFile: bindActionCreators(incomingCompanyFile, dispatch),
    incomingCompanyFiles: bindActionCreators(incomingCompanyFiles, dispatch),
    incomingCompanyDeletedFile: bindActionCreators(incomingCompanyDeletedFile, dispatch),
    incomingCompanyMovedFile: bindActionCreators(incomingCompanyMovedFile, dispatch),
    incomingCompanyEmptyTrash: bindActionCreators(incomingCompanyEmptyTrash, dispatch),
    incomingCompanyRemovedFile: bindActionCreators(incomingRemovedCompanyFile, dispatch),
    incomingCompanyMoveFile: bindActionCreators(incomingCompanyMoveFile, dispatch),
    incomingCompanyRestoreFile: bindActionCreators(incomingCompanyRestoreFile, dispatch),
    incomingCompanyRestoreFolder: bindActionCreators(incomingCompanyRestoreFolder, dispatch),
    incomingCompanyRemovedFolder: bindActionCreators(incomingRemovedCompanyFolder, dispatch),
    incomingCompanyDeletedFiles: bindActionCreators(incomingCompanyDeletedFiles, dispatch),
    incomingCompanyUpdatedFile: bindActionCreators(incomingCompanyUpdatedFile, dispatch),
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
    incomingDeletedFiles: bindActionCreators(incomingDeletedFiles, dispatch),
    incomingGoogleFile: bindActionCreators(incomingGoogleFile, dispatch),
    incomingGoogleFolder: bindActionCreators(incomingGoogleFolder, dispatch),
    joinWorkspaceReducer: bindActionCreators(joinWorkspaceReducer, dispatch),
    incomingDeletedGoogleFile: bindActionCreators(incomingDeletedGoogleFile, dispatch),
    incomingWorkspaceRole: bindActionCreators(incomingWorkspaceRole, dispatch),
    incomingDeletedWorkspaceFolder: bindActionCreators(incomingDeletedWorkspaceFolder, dispatch),
    incomingExternalUser: bindActionCreators(incomingExternalUser, dispatch),
    getWorkspaceFolder: bindActionCreators(getWorkspaceFolder, dispatch),
    incomingUpdateCompanyName: bindActionCreators(incomingUpdateCompanyName, dispatch),
    incomingInternalUser: bindActionCreators(incomingInternalUser, dispatch),
    incomingToDo: bindActionCreators(incomingToDo, dispatch),
    incomingUpdateToDo: bindActionCreators(incomingUpdateToDo, dispatch),
    incomingDoneToDo: bindActionCreators(incomingDoneToDo, dispatch),
    incomingRemoveToDo: bindActionCreators(incomingRemoveToDo, dispatch),
    incomingPostMarkDone: bindActionCreators(incomingPostMarkDone, dispatch),
    incomingFavouriteItem: bindActionCreators(incomingFavouriteItem, dispatch),
    incomingReadUnreadReducer: bindActionCreators(incomingReadUnreadReducer, dispatch),
    updateCompanyPostAnnouncement: bindActionCreators(updateCompanyPostAnnouncement, dispatch),
    incomingUserRole: bindActionCreators(incomingUserRole, dispatch),
    deletePostNotification: bindActionCreators(deletePostNotification, dispatch),
    incomingPostNotificationMessage: bindActionCreators(incomingPostNotificationMessage, dispatch),
    incomingMarkAsRead: bindActionCreators(incomingMarkAsRead, dispatch),
    addToModals: bindActionCreators(addToModals, dispatch),
    refetchMessages: bindActionCreators(refetchMessages, dispatch),
    refetchOtherMessages: bindActionCreators(refetchOtherMessages, dispatch),
    getChannelDetail: bindActionCreators(getChannelDetail, dispatch),
    incomingReminderNotification: bindActionCreators(incomingReminderNotification, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SocketListeners));
