import React, { Component } from "react";
import { isSafari } from "react-device-detect";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import { sessionService } from "redux-react-session";
import { pushBrowserNotification } from "../../helpers/pushHelper";
import { replaceChar, stripHtml } from "../../helpers/stringFormatter";
//import { urlify } from "../../helpers/urlContentHelper";
import {
  addToChannels,
  deletePostNotification,
  getChannel,
  getChannelDetail,
  getChannelMembers,
  incomingArchivedChannel,
  incomingChatMessage,
  incomingChatMessageReaction,
  incomingDeletedChatMessage,
  incomingDeletedHuddleBot,
  incomingImportantChat,
  incomingHuddleBot,
  incomingHuddleAnswers,
  incomingPostNotificationMessage,
  incomingUpdatedChannelDetail,
  incomingUpdatedChatMessage,
  incomingUpdatedHuddleBot,
  setChannel,
  setMemberTimestamp,
  setSelectedChannel,
  clearUnpublishedAnswer,
  incomingHuddleSkip,
  transferChannelMessages,
  removeWorkspaceChannel,
  removeWorkspaceChannelMembers,
  incomingJitsiEnded,
  getSharedChannels,
  removeChannel,
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
  incomingRemoveFileAfterDownload,
  incomingRemoveFileAutomatically,
  incomingDriveLink,
  incomingDeletedDriveLink,
  incomingUpdatedDriveLink,
} from "../../redux/actions/fileActions";
import {
  addToModals,
  addUserToReducers,
  generateUnfurl,
  getConnectedSlugs,
  getLatestReply,
  getToDoDetail,
  getUnreadNotificationCounterEntries,
  incomingCreatedAnnouncement,
  incomingDoneToDo,
  incomingFavouriteItem,
  incomingRemoveToDo,
  incomingToDo,
  incomingUpdateToDo,
  incomingUpdatedAnnouncement,
  refetchMessages,
  refetchOtherMessages,
  setBrowserTabStatus,
  setGeneralChat,
  setUnreadNotificationCounterEntries,
  incomingDeletedAnnouncement,
  incomingZoomData,
  setNewDriffData,
  incomingZoomCreate,
  incomingZoomUserLeft,
  incomingZoomEnded,
  updateUnreadCounter,
} from "../../redux/actions/globalActions";
import {
  fetchPost,
  incomingArchivedSelectedPosts,
  incomingClosePost,
  incomingComment,
  incomingCommentApproval,
  incomingCommentClap,
  incomingDeletedComment,
  incomingDeletedPost,
  incomingImportantComment,
  incomingMarkAsRead,
  incomingPost,
  incomingPostApproval,
  incomingPostClap,
  incomingPostMarkDone,
  incomingPostRecipients,
  incomingPostViewer,
  incomingReadSelectedPosts,
  incomingReadUnreadReducer,
  incomingUpdatedPost,
  refetchPostComments,
  refetchPosts,
  getPostList,
  incomingPostListConnect,
  incomingPostListDisconnect,
  incomingPostRequired,
  incomingFollowPost,
  incomingUnfollowPost,
  updatePostCategoryCount,
  incomingWorkspacePost,
} from "../../redux/actions/postActions";
import {
  getOnlineUsers,
  getUser,
  incomingExternalUser,
  incomingInternalUser,
  incomingUpdatedUser,
  incomingUserRole,
  incomingArchivedUser,
  incomingUnarchivedUser,
  incomingDeactivatedUser,
  incomingActivatedUser,
  incomingOnlineUsers,
  incomingDeletedUser,
  incomingAcceptedInternal,
  incomingTeam,
  incomingUpdatedTeam,
  incomingDeletedTeam,
  incomingTeamMember,
  incomingRemovedTeamMember,
} from "../../redux/actions/userAction";
import {
  getFavoriteWorkspaceCounters,
  getUnreadWorkspacePostEntries,
  getWorkspace,
  getWorkspaceAndSetToFavorites,
  getWorkspaceFolder,
  incomingArchivedWorkspaceChannel,
  incomingDeletedWorkspaceFolder,
  incomingFavouriteWorkspace,
  incomingMovedTopic,
  incomingTeamChannel,
  incomingTimeline,
  incomingUnArchivedWorkspaceChannel,
  incomingUpdatedWorkspaceFolder,
  incomingWorkspace,
  incomingWorkspaceFolder,
  incomingWorkspaceRole,
  joinWorkspaceReducer,
  updateWorkspacePostCount,
  setActiveTopic,
  getAllWorkspaceFolders,
  incomingWorkpaceNotificationStatus,
  incomingUpdatedWorkspaceQuickLinks,
  incomingAcceptedSharedUser,
  getSharedWorkspaces,
  getWorkspaces,
  removeWorkspace,
} from "../../redux/actions/workspaceActions";
import { incomingUpdateCompanyName, updateCompanyPostAnnouncement, incomingFaviconImage } from "../../redux/actions/settingsActions";
import { isIPAddress } from "../../helpers/commonFunctions";
import { incomingReminderNotification, getNotifications, incomingSnoozedNotification, incomingSnoozedAllNotification, removeNotificationReducer, incomingReadNotifications } from "../../redux/actions/notificationActions";
import { toast } from "react-toastify";
import { driffData } from "../../config/environment.json";
import {
  incomingWIP,
  incomingWIPSubject,
  incomingWIPComment,
  incomingWIPFileComment,
  incomingReplacedWIPFile,
  incomingNewFileVersion,
  incomingUpdatedWIPFileComment,
  incomingClosedFileComments,
  incomingApprovedFileVersion,
  incomingUpdatedWIPComment,
  incomingProposalClap,
} from "../../redux/actions/wipActions";
import {
  incomingUpdatedSubscription,
  incomingUpdatedCompanyLogo,
  incomingPostAccess,
  getPostAccess,
  incomingCompanyDescription,
  incomingCompanyDashboardBackground,
  updateSecuritySettings,
  incomingLoginSettings,
  incomingMeetingSettings,
} from "../../redux/actions/adminActions";
import Echo from "laravel-echo";

class SocketListeners extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reconnected: null,
      disconnectedTimestamp: null,
      reconnectedTimestamp: null,
      slug: props.slug ? props.slug : localStorage.getItem("slug"),
      userId: props.userId ? props.userId : props.user.id,
      useSharedDriff: props.slug !== undefined,
    };

    this.onlineUsers = React.createRef(null);
    this.publishChannelId = React.createRef(null);
  }

  refetchPostComments = () => {
    Object.keys(this.props.postComments).forEach((post_id) => {
      this.props.refetchPostComments({ post_id: post_id });
    });
  };

  refetch = () => {
    if (this.props.sharedSlug) return;
    this.props.getUnreadNotificationCounterEntries({}, (err, res) => {
      if (err) return;
      if (res) {
        const generalPost = res.data.find((d) => d.entity_type === "GENERAL_POST");
        if (generalPost && generalPost.count > 0) {
          this.props.refetchPosts({ skip: 0, limit: generalPost.count, filters: ["green_dot"] });
        }
      }
    });
    //this.props.getPostAccess();
    if (this.props.lastReceivedMessage && this.props.lastReceivedMessage.id) {
      this.props.refetchMessages({ message_id: this.props.lastReceivedMessage.id }, (err, res) => {
        if (err) return;

        if (this.props.lastReceivedMessage && this.props.lastReceivedMessage.id) {
          const channel_ids = res.data.latest_channels.map((c) => c.id).filter((id) => id !== this.props.lastReceivedMessage.channel_id);
          this.props.refetchOtherMessages(
            {
              message_id: this.props.lastReceivedMessage.id,
              channel_ids: channel_ids,
            },
            (err, res) => {
              if (err) return;
              let channelsWithMessage = res.data.filter((c) => c.count_message > 0);
              channelsWithMessage.forEach((c) => {
                this.props.getChannelDetail({ id: c.channel_id });
              });
            }
          );
        }
      });
    }
  };

  // refetchOtherMessages = () => {
  //   if (this.props.lastReceivedMessage && this.props.lastReceivedMessage.id && Object.values(this.props.channels).length) {
  //     let channels = Object.values(this.props.channels);
  //     this.props.refetchOtherMessages(
  //       {
  //         message_id: this.props.lastReceivedMessage.id,
  //         channel_ids: channels
  //           .filter((c) => {
  //             return typeof c.id === "number" && c.id !== this.props.lastReceivedMessage.channel_id;
  //           })
  //           .map((c) => c.id),
  //       },
  //       (err, res) => {
  //         if (err) return;
  //         let channelsWithMessage = res.data.filter((c) => c.count_message > 0);
  //         channelsWithMessage.forEach((c) => {
  //           this.props.getChannelDetail({ id: c.channel_id });
  //         });
  //       }
  //     );
  //   }
  // };

  componentDidMount() {
    if (!this.props.sharedSlug) {
      this.props.getOnlineUsers();

      this.props.getLatestReply({}, (err, res) => {
        //console.log(res, "latest");
      });
    }

    window.Echo[this.state.slug].connector.socket.on("connect", () => {
      //console.log("socket connected");
    });
    window.Echo[this.state.slug].connector.socket.on("disconnect", () => {
      //console.log("socket disconnected");
      this.setState({ disconnectedTimestamp: Math.floor(Date.now() / 1000) });
    });
    window.Echo[this.state.slug].connector.socket.on("reconnect", () => {
      //console.log("socket reconnected");
      this.setState({ reconnected: true, reconnectedTimestamp: Math.floor(Date.now() / 1000) });
      this.refetch();
      //this.refetchOtherMessages();
      //this.refetchPosts();
      this.refetchPostComments();
      //this.props.getFavoriteWorkspaceCounters({});
    });
    window.Echo[this.state.slug].connector.socket.on("reconnecting", function () {
      //console.log("socket reconnecting");
    });

    window.Echo[this.state.slug].private(`${localStorage.getItem("slug")}.App.User.Inactive`).listen(".user-inactive", (e) => {
      this.props.incomingDeletedUser(e);
    });

    // new socket
    window.Echo[this.state.slug]
      .private(`${this.state.slug}.Driff.User.${this.state.userId}`)
      .listen(".proposal-version-upload-new-notification", (e) => {
        console.log(e, "new version");
        this.props.incomingNewFileVersion(e.data);
      })
      .listen(".proposal-version-replace-notification", (e) => {
        console.log(e, "replace image");
        this.props.incomingReplacedWIPFile(e.data);
      })
      .listen(".proposal-version-approved-notification", (e) => {
        console.log(e, "approve file");
        this.props.incomingApprovedFileVersion(e);
      })
      .listen(".proposal-version-comment-closed-notification", (e) => {
        console.log(e, "closed file comment");
        this.props.incomingClosedFileComments(e);
      })
      .listen(".proposal-version-comment-notification", (e) => {
        this.props.incomingWIPFileComment(e);
      })
      .listen(".proposal-version-comment-updated", (e) => {
        console.log(e, "updated file comment");
        this.props.incomingUpdatedWIPFileComment(e);
      })
      .listen(".proposal-comment-notification", (e) => {
        this.props.incomingWIPComment(e);
      })
      .listen(".proposal-comment-updated", (e) => {
        this.props.incomingUpdatedWIPComment(e);
      })
      .listen(".proposal-notification", (e) => {
        console.log(e);
        switch (e.SOCKET_TYPE) {
          case "PROPOSAL_CLAP_TOGGLE": {
            this.props.incomingProposalClap(e);
            break;
          }
          case "PROPOSAL_CREATED": {
            this.props.incomingWIP({ ...e, clap_user_ids: [] });
            break;
          }
          default:
            return null;
        }
      })
      .listen(".proposal-subject-notification", (e) => {
        this.props.incomingWIPSubject({ ...e, clap_user_ids: [] });
      })
      .listen(".create-driff-talk-notification", (e) => {
        let timestamp = Math.floor(Date.now() / 1000);
        const chatMessage = {
          message: e.system_message,
          body: e.system_message,
          mention_ids: [],
          user: null,
          original_body: e.system_message,
          is_read: true,
          editable: true,
          files: [],
          is_archive: false,
          is_completed: true,
          is_transferred: false,
          is_deleted: false,
          created_at: { timestamp: timestamp },
          updated_at: { timestamp: timestamp },
          channel_id: e.channel_id,
          reactions: [],
          id: e.chat_id,
          reference_id: null,
          quote: null,
          unfurls: [],
          g_date: this.props.localizeDate(timestamp, "YYYY-MM-DD"),
        };
        if (e.host.id !== this.state.userId) {
          let room_name = null;
          if (e.system_message.startsWith("DRIFF_TALK::")) {
            const data = JSON.parse(e.system_message.replace("DRIFF_TALK::", ""));
            room_name = data.meet_event.room_name;
          }

          this.props.addToModals({
            type: "jitsi_invite",
            channelType: e.type,
            host: e.host,
            title: e.title,
            channel_id: e.channel_id,
            hideJoin: this.props.jitsi !== null,
            room_name: room_name,
            slug: this.state.slug,
          });
        }

        this.props.incomingChatMessage({ ...chatMessage, channel_id: e.channel_id, slug: this.state.slug });
      })
      .listen(".end-driff-talk-notification", (e) => {
        let timestamp = Math.floor(Date.now() / 1000);
        const chatMessage = {
          message: e.system_message,
          body: e.system_message,
          mention_ids: [],
          user: null,
          original_body: e.system_message,
          is_read: true,
          editable: true,
          files: [],
          is_archive: false,
          is_completed: true,
          is_transferred: false,
          is_deleted: false,
          created_at: { timestamp: timestamp },
          updated_at: { timestamp: timestamp },
          channel_id: e.channel_id,
          reactions: [],
          id: e.chat_id,
          reference_id: null,
          quote: null,
          unfurls: [],
          g_date: this.props.localizeDate(timestamp, "YYYY-MM-DD"),
        };
        this.props.incomingJitsiEnded({ ...e, chat: chatMessage, channel_id: e.channel_id, slug: this.state.slug });
      })
      .listen(".left-driff-talk-notification", (e) => {
        let timestamp = Math.floor(Date.now() / 1000);
        const chatMessage = {
          message: e.system_message,
          body: e.system_message,
          mention_ids: [],
          user: null,
          original_body: e.system_message,
          is_read: true,
          editable: true,
          files: [],
          is_archive: false,
          is_completed: true,
          is_transferred: false,
          is_deleted: false,
          created_at: { timestamp: timestamp },
          updated_at: { timestamp: timestamp },
          channel_id: e.channel_id,
          reactions: [],
          id: e.chat_id,
          reference_id: null,
          quote: null,
          unfurls: [],
          g_date: this.props.localizeDate(timestamp, "YYYY-MM-DD"),
        };
        this.props.incomingChatMessage({ ...chatMessage, channel_id: e.channel_id, slug: this.state.slug });
      })
      .listen(".recording-uploaded-notification", (e) => {
        let timestamp = Math.floor(Date.now() / 1000);
        const chatMessage = {
          message: e.system_message,
          body: e.system_message,
          mention_ids: [],
          user: null,
          original_body: e.system_message,
          is_read: true,
          editable: true,
          files: [],
          is_archive: false,
          is_completed: true,
          is_transferred: false,
          is_deleted: false,
          created_at: { timestamp: timestamp },
          updated_at: { timestamp: timestamp },
          channel_id: e.channel_id,
          reactions: [],
          id: e.chat_id,
          reference_id: null,
          quote: null,
          unfurls: [],
          g_date: this.props.localizeDate(timestamp, "YYYY-MM-DD"),
        };
        this.props.incomingChatMessage({ ...chatMessage, channel_id: e.channel_id, slug: this.state.slug });
      })
      .listen(".create-meeting-notification", (e) => {
        if (this.state.userId !== e.host.id) {
          const meetingSDKELement = document.getElementById("meetingSDKElement");
          const meetingSDKELementFirstChild = meetingSDKELement.firstChild;
          if (meetingSDKELementFirstChild && meetingSDKELementFirstChild.classList.contains("react-draggable")) {
            setTimeout(() => {
              this.props.addToModals({
                ...e,
                type: "zoom_invite",
                hideJoin: true,
              });
              this.props.incomingZoomData({ ...e.zoom_data.data, channel_id: e.channel_id });
            }, 2000);
          } else {
            setTimeout(() => {
              this.props.addToModals({
                ...e,
                type: "zoom_invite",
                hideJoin: false,
              });
              this.props.incomingZoomData({ ...e.zoom_data.data, channel_id: e.channel_id });
            }, 2000);
          }
        }
      })
      .listen(".meeting-ended-notification", (e) => {
        // const data = JSON.parse(e.system_message.replace("ZOOM_MEETING::", ""));
        let timestamp = Math.floor(Date.now() / 1000);
        const chatMessage = {
          message: e.system_message,
          body: e.system_message,
          mention_ids: [],
          user: null,
          original_body: e.system_message,
          is_read: true,
          editable: true,
          files: [],
          is_archive: false,
          is_completed: true,
          is_transferred: false,
          is_deleted: false,
          created_at: { timestamp: timestamp },
          updated_at: { timestamp: timestamp },
          channel_id: e.channel_id,
          reactions: [],
          id: e.chat_id,
          reference_id: null,
          quote: null,
          unfurls: [],
          g_date: this.props.localizeDate(timestamp, "YYYY-MM-DD"),
        };
        this.props.incomingZoomEnded({ ...e, chat: chatMessage, channel_id: e.channel_id });
      })
      .listen(".notification-read", (e) => {
        this.props.incomingReadNotifications({ ...e, slug: this.state.slug, sharedSlug: this.props.sharedSlug });
      })
      .listen(".delete-notification", (e) => {
        const elemId = `notification__${e.notification_id}`;
        if (toast.isActive(elemId)) toast.dismiss(elemId);
        const key = this.props.sharedSlug ? `${e.notification_id}-${this.props.slug}` : e.notification_id;
        this.props.removeNotificationReducer({ id: e.notification_id, key: key });
      })
      .listen(".snooze-notification", (e) => {
        this.props.incomingSnoozedNotification({ ...e, slug: this.state.slug, sharedSlug: this.props.sharedSlug });
      })
      .listen(".snooze-all-notification", (e) => {
        this.props.incomingSnoozedAllNotification({ ...e, slug: this.state.slug, sharedSlug: this.props.sharedSlug });
      })
      .listen(".post-follow", (e) => {
        this.props.incomingFollowPost({ ...e, slug: this.state.slug, sharedSlug: this.props.sharedSlug });
      })
      .listen(".post-unfollow", (e) => {
        this.props.incomingUnfollowPost({ ...e, slug: this.state.slug, sharedSlug: this.props.sharedSlug });
      })
      .listen(".unarchive-post-notification", (e) => {
        e.posts.forEach((p) => {
          this.props.fetchPost({ post_id: p.id }, (err, res) => {
            if (err) return;
            let post = {
              ...res.data,
              claps: [],
              is_unread: 1,
            };
            this.props.incomingPost({ ...post, slug: this.state.slug, sharedSlug: this.props.sharedSlug, userId: this.state.userId });
          });
        });
      })
      .listen(".huddle-notification", (e) => {
        switch (e.SOCKET_TYPE) {
          case "HUDDLE_CREATED": {
            this.props.incomingHuddleBot({
              ...e,
              start_at: e.set_start_at,
              publish_at: e.set_publish_at,
              questions: e.questions.map((q, k) => {
                return {
                  ...q,
                  answer: null,
                  original_answer: null,
                  isFirstQuestion: k === 0,
                  isLastQuestion: e.questions.length === k + 1,
                };
              }),
            });
            break;
          }
          case "HUDDLE_UPDATED": {
            this.props.incomingUpdatedHuddleBot({
              ...e,
              start_at: e.set_start_at,
              publish_at: e.set_publish_at,
              questions: e.questions.map((q, k) => {
                return {
                  ...q,
                  answer: null,
                  original_answer: null,
                  isFirstQuestion: k === 0,
                  isLastQuestion: e.questions.length === k + 1,
                };
              }),
            });
            break;
          }
          case "HUDDLE_DELETED": {
            this.props.incomingDeletedHuddleBot({ id: parseInt(e.id) });
            break;
          }
          case "HUDDLE_ANSWER_UPDATE": {
            this.props.incomingHuddleAnswers({
              ...e,
              channel: {
                id: e.huddle.channel_id,
              },
            });
            break;
          }
          case "USER_ANSWERED": {
            this.props.incomingHuddleAnswers(e);
            this.props.incomingChatMessage({
              ...e.message,
              huddle_log: e.huddle_log,
              slug: this.state.slug,
            });
            // const huddleAnswered = localStorage.getItem("huddle");
            // if (huddleAnswered) {
            //   const { channels, day } = JSON.parse(huddleAnswered);
            //   localStorage.setItem("huddle", JSON.stringify({ channels: [...channels, e.channel.id], day: day }));
            // } else {
            //   const currentDate = new Date();
            //   localStorage.setItem("huddle", JSON.stringify({ channels: [e.channel.id], day: currentDate.getDay() }));
            // }
            break;
          }
          case "HUDDLE_SKIP": {
            this.props.incomingHuddleSkip(e);
            // const huddleAnswered = localStorage.getItem("huddle");

            // if (huddleAnswered) {
            //   const { channels, day } = JSON.parse(huddleAnswered);
            //   localStorage.setItem("huddle", JSON.stringify({ channels: [...channels, e.channel.id], day: day }));
            // } else {
            //   const currentDate = new Date();
            //   localStorage.setItem("huddle", JSON.stringify({ channels: [e.channel.id], day: currentDate.getDay() }));
            // }
            break;
          }
          default:
            return null;
        }
      })
      .listen(".workspace-todo-notification", (e) => {
        if (e.workspace) {
          if (Object.values(this.props.workspaces).some((ws) => ws.is_favourite && e.workspace.id === ws.id)) {
            let payload = {};
            if (this.props.sharedSlug) {
              payload = {
                ...payload,
                sharedPayload: { slug: this.state.slug, token: this.props.sharedWorkspaces[this.state.slug].access_token, is_shared: true },
              };
            }
            //this.props.getFavoriteWorkspaceCounters(payload);
          }
        }
        //this.props.getToDoDetail();
        switch (e.SOCKET_TYPE) {
          case "CREATE_WORKSPACE_TODO": {
            this.props.incomingToDo({ ...e, user: e.user_id, slug: this.state.slug, sharedSlug: this.props.sharedSlug });
            break;
          }
          case "UPDATE_WORKSPACE_TODO": {
            this.props.incomingUpdateToDo({ ...e, slug: this.state.slug, sharedSlug: this.props.sharedSlug });
            break;
          }
          case "DONE_TODO": {
            this.props.incomingDoneToDo({ ...e, slug: this.state.slug, sharedSlug: this.props.sharedSlug });
            break;
          }
          case "DELETE_WORKSPACE_TODO": {
            this.props.incomingRemoveToDo({ ...e, slug: this.state.slug, sharedSlug: this.props.sharedSlug });
            break;
          }
          case "REMIND_WORKSPACE_TODO": {
            //pushBrowserNotification(`${e.author.first_name} shared a post`, e.title, e.author.profile_image_link, null);
            this.props.incomingUpdateToDo({ ...e, slug: this.state.slug, sharedSlug: this.props.sharedSlug });
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
                        if (e.data.workspaces[0].workspace) {
                          link = `/hub/posts/${e.data.workspaces[0].workspace.id}/${replaceChar(e.data.workspaces[0].workspace.name)}/${e.data.workspaces[0].topic.id}/${replaceChar(e.data.workspaces[0].topic.name)}/post/${
                            e.data.post.id
                          }/${replaceChar(e.data.post.title)}`;
                        } else {
                          link = `/hub/posts/${e.data.workspaces[0].topic.id}/${replaceChar(e.data.workspaces[0].topic.name)}/post/${e.data.post.id}/${replaceChar(e.data.post.title)}`;
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
                };
                pushBrowserNotification(`You asked to be reminded about ${e.title}`, e.title, this.props.user.profile_image_link, redirect);
              }
            }
            this.props.incomingReminderNotification({ ...e, slug: this.state.slug, sharedSlug: this.props.sharedSlug });
            break;
          }
          default:
            return null;
        }
      })
      .listen(".todo-notification", (e) => {
        let payload = {};
        if (this.props.sharedSlug) {
          payload = {
            ...payload,
            sharedPayload: { slug: this.state.slug, token: this.props.sharedWorkspaces[this.state.slug].access_token, is_shared: true },
          };
        }
        //this.props.getFavoriteWorkspaceCounters(payload);
        //this.props.getToDoDetail();
        switch (e.SOCKET_TYPE) {
          case "CREATE_TODO": {
            this.props.incomingToDo({ ...e, user: e.user_id, slug: this.state.slug, sharedSlug: this.props.sharedSlug });
            break;
          }
          case "UPDATE_TODO": {
            this.props.incomingUpdateToDo({ ...e, slug: this.state.slug, sharedSlug: this.props.sharedSlug });
            break;
          }
          case "DONE_TODO": {
            this.props.incomingDoneToDo({ ...e, slug: this.state.slug, sharedSlug: this.props.sharedSlug });
            break;
          }
          case "DELETE_TODO": {
            this.props.incomingRemoveToDo({ ...e, slug: this.state.slug, sharedSlug: this.props.sharedSlug });
            break;
          }
          case "REMIND_TODO": {
            //pushBrowserNotification(`${e.author.first_name} shared a post`, e.title, e.author.profile_image_link, null);
            this.props.incomingUpdateToDo({ ...e, slug: this.state.slug, sharedSlug: this.props.sharedSlug });
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
                        if (e.data.workspaces[0].workspace) {
                          link = `/hub/posts/${e.data.workspaces[0].workspace.id}/${replaceChar(e.data.workspaces[0].workspace.name)}/${e.data.workspaces[0].topic.id}/${replaceChar(e.data.workspaces[0].topic.name)}/post/${
                            e.data.post.id
                          }/${replaceChar(e.data.post.title)}`;
                        } else {
                          link = `/hub/posts/${e.data.workspaces[0].topic.id}/${replaceChar(e.data.workspaces[0].topic.name)}/post/${e.data.post.id}/${replaceChar(e.data.post.title)}`;
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
                };
                pushBrowserNotification(`You asked to be reminded about ${e.title}`, e.title, this.props.user.profile_image_link, redirect);
              }
            }
            this.props.incomingReminderNotification({ ...e, slug: this.state.slug, sharedSlug: this.props.sharedSlug });
            break;
          }
          default:
            return null;
        }
      })
      .listen(".workspace-role-notification", (e) => {
        this.props.incomingWorkspaceRole({ ...e, slug: this.state.slug, sharedSlug: this.props.sharedSlug });
      })
      .listen(".google-attachment-notification", (e) => {
        switch (e.SOCKET_TYPE) {
          case "GOOGLE_ATTACHMENT_CREATE": {
            if (e.attachment_type === "GOOGLE_DRIVE_FILE") {
              this.props.incomingGoogleFile({ ...e, slug: this.state.slug, sharedSlug: this.props.sharedSlug });
            } else if (e.attachment_type === "GOOGLE_DRIVE_FOLDER") {
              this.props.incomingGoogleFolder({ ...e, slug: this.state.slug, sharedSlug: this.props.sharedSlug });
            }
            break;
          }
          default:
            return null;
        }
      })
      .listen(".workspace-folder-notification", (e) => {
        switch (e.SOCKET_TYPE) {
          case "FOLDER_CREATE": {
            this.props.incomingFolder({ ...e, slug: this.state.slug, sharedSlug: this.props.sharedSlug });
            break;
          }
          case "FOLDER_UPDATE": {
            this.props.incomingFolder({ ...e, slug: this.state.slug, sharedSlug: this.props.sharedSlug });
            break;
          }
          case "FOLDER_DELETE": {
            this.props.incomingDeletedFolder({ ...e, slug: this.state.slug, sharedSlug: this.props.sharedSlug });
            if (this.props.match.url === "/hub/files") {
              if (this.props.location.pathname.includes(e.folder.id) && this.props.location.pathname.includes(e.topic_id)) {
                let pathname = this.props.location.pathname.split("/folder/")[0];
                this.props.history.push(pathname);
              }
            }
            break;
          }
          case "FOLDER_RESTORE": {
            this.props.incomingRestoreFolder({ ...e, slug: this.state.slug, sharedSlug: this.props.sharedSlug });
            break;
          }
          case "FOLDER_FORCE_DELETE": {
            this.props.incomingRemovedFolder({ ...e, slug: this.state.slug, sharedSlug: this.props.sharedSlug });
            break;
          }
          default:
            return null;
        }
      })
      .listen(".workspace-file-notification", (e) => {
        switch (e.SOCKET_TYPE) {
          case "FILE_RESTORE": {
            this.props.incomingRestoreFile({ ...e, slug: this.state.slug, sharedSlug: this.props.sharedSlug });
            break;
          }
          case "FILE_UPDATE": {
            this.props.incomingFile({ ...e, slug: this.state.slug, sharedSlug: this.props.sharedSlug });
            break;
          }
          case "FILE_MOVE": {
            this.props.incomingMovedFile({ ...e, slug: this.state.slug, sharedSlug: this.props.sharedSlug });
            break;
          }
          case "FILE_TRASH": {
            this.props.incomingDeletedFile({ ...e, slug: this.state.slug, sharedSlug: this.props.sharedSlug });
            break;
          }
          case "FILE_EMPTY": {
            this.props.incomingEmptyTrash({ ...e, slug: this.state.slug, sharedSlug: this.props.sharedSlug });
            break;
          }
          case "FILE_DELETE": {
            this.props.incomingRemovedFile({ ...e, slug: this.state.slug, sharedSlug: this.props.sharedSlug });
            break;
          }
          case "FILE_BULK_TRASH": {
            this.props.incomingDeletedFiles({ ...e, slug: this.state.slug, sharedSlug: this.props.sharedSlug });
            break;
          }
          default:
            return null;
        }
      })
      .listen(".workspace-timeline-notification", (e) => {
        this.props.incomingTimeline(e);
      })
      .listen(".upload-bulk-private-workspace-files", (e) => {
        this.props.incomingFiles({ ...e, slug: this.state.slug, sharedSlug: this.props.sharedSlug });
        e.channel_messages &&
          e.channel_messages.forEach((m) => {
            m.system_message.channel_id = m.channel.id;
            m.system_message.files = [];
            m.system_message.editable = false;
            m.system_message.unfurls = [];
            m.system_message.reactions = [];
            m.system_message.is_deleted = false;
            m.system_message.todo_reminder = null;
            m.system_message.is_read = false;
            m.system_message.is_completed = false;
            m.system_message.user = null;
            // m.system_message.new_post = true;
            m.system_message.topic = m.topic;
            m.system_message.shared_with_client = true;
            m.system_message.slug = this.state.slug;
            this.props.incomingPostNotificationMessage(m.system_message);
          });
      })
      .listen(".favourite-notification", (e) => {
        switch (e.SOCKET_TYPE) {
          case "FAVOURITE_ITEM": {
            this.props.incomingFavouriteItem({ ...e, slug: this.state.slug, sharedSlug: this.props.sharedSlug });
            break;
          }
          default: {
            return null;
          }
        }
      })
      .listen(".unread-post", (e) => {
        this.props.incomingReadUnreadReducer({ ...e, slug: this.state.slug, sharedSlug: this.props.sharedSlug });
      })
      .listen(".post-notification", (e) => {
        // let payload = {};
        // if (this.props.sharedSlug) {
        //   payload = {
        //     ...payload,
        //     sharedPayload: { slug: this.state.slug, token: this.props.sharedWorkspaces[this.state.slug].access_token, is_shared: true },
        //   };
        // }
        //this.props.getFavoriteWorkspaceCounters(payload);
        switch (e.SOCKET_TYPE) {
          case "CLOSED_POST": {
            this.props.incomingClosePost({ ...e, slug: this.state.slug, sharedSlug: this.props.sharedSlug, userId: this.state.userId });
            break;
          }
          case "POST_APPROVED": {
            this.props.incomingPostApproval({ ...e, slug: this.state.slug, sharedSlug: this.props.sharedSlug, userId: this.state.userId });
            break;
          }
          case "POST_REQUIRED": {
            this.props.incomingPostRequired({ ...e, slug: this.state.slug, sharedSlug: this.props.sharedSlug, userId: this.state.userId });
            break;
          }
          case "POST_COMMENT_APPROVED": {
            this.props.getNotifications({ skip: 0, limit: 5 });
            this.props.incomingCommentApproval({
              ...e,
              userId: this.state.userId,
              slug: this.state.slug,
              sharedSlug: this.props.sharedSlug,
              users_approval: e.users_approval.map((u) => {
                if (u.id === e.user_approved.id) {
                  return {
                    ...u,
                    ...e.user_approved,
                  };
                } else {
                  return u;
                }
              }),
            });
            break;
          }
          case "READ_SELECTED_UNREAD_POST": {
            this.props.incomingReadSelectedPosts({ ...e, slug: this.state.slug, sharedSlug: this.props.sharedSlug });
            break;
          }
          case "ARCHIVED_SELECTED_POST": {
            this.props.incomingArchivedSelectedPosts({ ...e, slug: this.state.slug, sharedSlug: this.props.sharedSlug });
            break;
          }
          case "ADD_RECIPIENTS": {
            if (this.props.sharedSlug) return;
            this.props.fetchPost({ post_id: e.post_id }, (err, res) => {
              if (err) return;
              let post = {
                ...res.data,
                claps: [],
                slug: this.state.slug,
                sharedSlug: this.props.sharedSlug,
                userId: this.state.userId,
              };
              this.props.incomingPost(post);
            });
            break;
          }
          case "POST_CREATE": {
            let post = { ...e, claps: [], mention_ids: e.code_data && e.code_data.mention_ids ? e.code_data.mention_ids : [], slug: this.state.slug, sharedSlug: this.props.sharedSlug, userId: this.state.userId };
            const isApprover = post.users_approval.some((ua) => ua.id === this.state.userId);
            const hasActiveWorkspace = post.workspaces.length > 0 && post.workspaces.some((ws) => this.props.workspaces[ws.topic_id] && this.props.workspaces[ws.topic_id].is_active);
            const hasMentioned = post.mention_ids.some((id) => this.state.userId === id);
            const mustRead = post.must_read_users && post.must_read_users.some((u) => this.state.userId === u.id && !u.must_read);
            const mustReply = post.must_reply_users && post.must_reply_users.some((u) => this.state.userId === u.id && !u.must_reply);
            const showPost = hasActiveWorkspace || hasMentioned || mustRead || mustReply || post.workspaces.length === 0;
            post = { ...post, show_post: showPost, post_approval_label: isApprover ? "NEED_ACTION" : null };
            this.props.updatePostCategoryCount(post);
            if (this.state.userId !== post.author.id) {
              if (isSafari) {
                if (this.props.notificationsOn) {
                  // chech the topic recipients if active
                  if (showPost) pushBrowserNotification(`${post.author.first_name} shared a post`, post.title, post.author.profile_image_link, null);
                }
              }
            }
            if (this.state.userId !== post.author.id) {
              if (this.props.sharedSlug) {
                this.props.incomingWorkspacePost(post);
              } else {
                if (post.show_post) {
                  this.props.updateUnreadCounter({ general_post: 1 });
                  this.props.incomingPost(post);
                } else {
                  this.props.incomingWorkspacePost(post);
                }
              }
            } else {
              this.props.incomingPost(post);
            }

            post.channel_messages &&
              post.channel_messages.forEach((m) => {
                const message = {
                  ...m.system_message,
                  files: [],
                  editable: false,
                  unfurls: [],
                  reactions: [],
                  is_deleted: false,
                  todo_reminder: null,
                  is_read: false,
                  is_completed: false,
                  user: null,
                  new_post: true,
                  topic: m.topic,
                  shared_with_client: e.shared_with_client,
                  slug: this.state.slug,
                };

                this.props.incomingPostNotificationMessage(message);
              });
            break;
          }
          case "POST_UPDATE": {
            this.props.incomingUpdatedPost({ ...e, slug: this.state.slug, sharedSlug: this.props.sharedSlug, userId: this.state.userId });
            if (e.channel_messages && e.post_participant_data) {
              if (!e.post_participant_data.from_company && !e.post_participant_data.all_participant_ids.some((p) => p === this.state.userId)) {
                //user is not participant of post
                this.props.deletePostNotification(e.channel_messages);
                this.props.incomingDeletedPost({ ...e, slug: this.state.slug, sharedSlug: this.props.sharedSlug });
              } else if (!e.post_participant_data.from_company && e.post_participant_data.all_participant_ids.some((p) => p === this.state.userId)) {
                // from private to public post
                e.claps = [];
                this.props.incomingPost({ ...e, slug: this.state.slug, sharedSlug: this.props.sharedSlug, userId: this.state.userId });
                e.channel_messages &&
                  e.channel_messages.forEach((m) => {
                    m.system_message.files = [];
                    m.system_message.editable = false;
                    m.system_message.unfurls = [];
                    m.system_message.reactions = [];
                    m.system_message.is_deleted = false;
                    m.system_message.todo_reminder = null;
                    m.system_message.is_read = true;
                    m.system_message.is_completed = false;
                    m.system_message.user = null;
                    m.system_message.new_post = false;
                    m.system_message.topic = m.topic;
                    m.system_message.shared_with_client = e.shared_with_client;
                    m.system_message.slug = this.state.slug;
                    this.props.incomingPostNotificationMessage(m.system_message);
                  });
              } else if (e.post_participant_data.from_company) {
                let companyChannel = Object.values(this.props.channels).filter((c) => c.type === "COMPANY");
                if (companyChannel.length) {
                  let companyId = companyChannel[0].id;
                  let postNotifMessages = [...e.channel_messages];
                  postNotifMessages = postNotifMessages.filter((m) => {
                    if (m.channel.id !== companyId) {
                      return true;
                    } else {
                      return false;
                    }
                  });
                  this.props.deletePostNotification(postNotifMessages);
                }
              }
            }
            break;
          }
          case "POST_DELETE": {
            this.props.incomingDeletedPost({ ...e, slug: this.state.slug, sharedSlug: this.props.sharedSlug });
            if (e.notification_ids) {
              const ids = Array.from(e.notification_ids);
              ids.forEach((id) => {
                const elemId = "notification__" + id;
                toast.isActive(elemId) && toast.dismiss(elemId);
              });
            }
            break;
          }
          case "POST_COMMENT_UPDATE": {
            this.props.incomingComment({ ...e, slug: this.state.slug, sharedSlug: this.props.sharedSlug, addToNotification: false, userId: this.state.userId });
            break;
          }
          case "POST_CLAP_TOGGLE": {
            if (this.state.userId !== e.author.id) {
              this.props.incomingPostClap({ ...e, slug: this.state.slug, sharedSlug: this.props.sharedSlug, userId: this.state.userId });
              if (this.state.userId === e.post_user_id && e.clap_count === 1) {
                toast(`${e.author.name} ${this.props.dictionary.likedYourPost}`, { position: toast.POSITION.BOTTOM_LEFT });
              }
            }
            break;
          }
          case "COMMENT_IMPORTANT": {
            this.props.incomingImportantComment({ ...e, slug: this.state.slug, sharedSlug: this.props.sharedSlug });
            break;
          }
          default:
            return null;
        }
      })
      .listen(".post-comment-notification", (e) => {
        switch (e.SOCKET_TYPE) {
          case "POST_COMMENT_CREATE": {
            if (e.workspaces && e.workspaces.length >= 1) {
              if (e.author.id !== this.state.userId) {
                this.props.setGeneralChat({
                  count: 1,
                  entity_type: "WORKSPACE_POST",
                });
              }
            }
            if (e.author.id !== this.state.userId) {
              const workspacesMuted = [];
              const hasMentioned = e.code_data && e.code_data.mention_ids && e.code_data.mention_ids.some((id) => this.state.userId === id);
              e.workspaces.forEach((ws) => {
                if (this.props.workspaces[ws.topic_id] && !this.props.workspaces[ws.topic_id].is_active) {
                  workspacesMuted.push(ws.topic_id);
                }
              });
              let postKey = this.props.sharedSlug ? e.post_code : e.post_id;
              // check if posts exists, if not then fetch post
              if (!this.props.sharedSlug) {
                if (!this.props.posts[postKey]) {
                  this.props.fetchPost({ post_id: e.post_id }, (err, res) => {
                    if (err) return;
                    let post = {
                      ...res.data,
                      claps: [],
                      slug: this.state.slug,
                      sharedSlug: this.props.sharedSlug,
                      //is_unread: 1,
                      userId: this.state.userId,
                    };
                    if (hasMentioned || workspacesMuted.length !== e.workspaces.length || e.workspaces.length === 0) {
                      this.props.incomingPost(post);
                    } else {
                      this.props.incomingWorkspacePost(post);
                    }
                  });
                } else {
                  const post = this.props.posts[postKey];
                  if (post) {
                    if (post.is_unread === 0) {
                      this.props.updateUnreadCounter({ general_post: 1 });
                    }
                  }
                }
              } else {
                //from shared
                // to review
                // if (this.props.sharedWorkspaces[this.state.slug]) {
                //   const sharedPayload = { slug: this.state.slug, token: this.props.sharedWorkspaces[this.state.slug].access_token, is_shared: true };
                //   if (!this.props.posts[postKey]) {
                //     this.props.fetchPost({ post_id: e.post_id, sharedPayload: sharedPayload }, (err, res) => {
                //       if (err) return;
                //       let post = {
                //         ...res.data,
                //         claps: [],
                //         slug: this.state.slug,
                //         sharedSlug: this.props.sharedSlug,
                //         //is_unread: 1,
                //       };
                //       if (hasMentioned || workspacesMuted.length !== e.workspaces.length || e.workspaces.length === 0) {
                //         this.props.incomingPost(post);
                //       } else {
                //         this.props.incomingWorkspacePost(post);
                //       }
                //     });
                //   } else {
                //     const post = this.props.posts[postKey];
                //     if (post) {
                //       if (post.is_unread === 0) {
                //         this.props.updateUnreadCounter({ general_post: 1 });
                //       }
                //     }
                //   }
                // }
              }

              if (isSafari) {
                if (this.props.notificationsOn) {
                  let link = "";
                  if (e.workspaces.length) {
                    if (e.workspaces[0].workspace_id) {
                      link = `/hub/posts/${e.workspaces[0].workspace_id}/${replaceChar(e.workspaces[0].workspace_name)}/${e.workspaces[0].topic_id}/${replaceChar(e.workspaces[0].topic_name)}/post/${e.post_id}/${replaceChar(e.post_title)}`;
                    } else {
                      link = `/hub/posts/${e.workspaces[0].topic_id}/${replaceChar(e.workspaces[0].topic_name)}/post/${e.post_id}/${replaceChar(e.post_title)}`;
                    }
                  } else {
                    link = `/posts/${e.post_id}/${replaceChar(e.post_title)}`;
                  }
                  const redirect = () => this.props.history.push(link, { focusOnMessage: e.id });
                  if (link !== this.props.location.pathname || this.props.isIdle || !this.props.isBrowserActive || !document.hasFocus()) {
                    pushBrowserNotification(`${e.author.first_name} replied in a post`, stripHtml(e.body), e.author.profile_image_link, redirect);
                  }
                }
              }

              e.workspaces.forEach((ws) => {
                if (this.props.sharedSlug) {
                  // update
                  let payload = {
                    topic_id: ws.topic_id,
                    sharedPayload: { slug: this.state.slug, token: this.props.sharedWorkspaces[this.state.slug].access_token, is_shared: true },
                    slug: this.state.slug,
                    sharedSlug: true,
                  };
                  if (this.props.sharedWorkspaces[this.state.slug]) {
                    this.props.getUnreadWorkspacePostEntries(payload, (err, res) => {
                      if (err) return;
                      this.props.updateWorkspacePostCount({
                        topic_id: ws.topic_id,
                        count: res.data.result,
                        slug: this.state.slug,
                        sharedSlug: true,
                      });
                    });
                  }
                } else {
                  this.props.getUnreadWorkspacePostEntries({ topic_id: ws.topic_id }, (err, res) => {
                    if (err) return;
                    this.props.updateWorkspacePostCount({
                      topic_id: ws.topic_id,
                      count: res.data.result,
                      slug: this.state.slug,
                      sharedSlug: this.props.sharedSlug,
                    });
                  });
                }
              });
              if (hasMentioned || e.workspaces.length === 0) {
                this.props.incomingComment({ ...e, slug: this.state.slug, sharedSlug: this.props.sharedSlug, addToNotification: true, userId: this.state.userId });
              } else {
                const comment = { ...e, allMuted: workspacesMuted.length === e.workspaces.length };
                this.props.incomingComment({ ...comment, slug: this.state.slug, sharedSlug: this.props.sharedSlug, addToNotification: true, userId: this.state.userId });
              }
            } else {
              this.props.incomingComment({ ...e, slug: this.state.slug, sharedSlug: this.props.sharedSlug, addToNotification: false, userId: this.state.userId });
            }
            break;
          }
          case "POST_COMMENT_DELETE": {
            //need post code
            this.props.incomingDeletedComment({ ...e, slug: this.state.slug, sharedSlug: this.props.sharedSlug });
            break;
          }
          case "POST_COMMENT_UPDATE": {
            this.props.incomingComment({ ...e, slug: this.state.slug, sharedSlug: this.props.sharedSlug, addToNotification: false, userId: this.state.userId });
            break;
          }
          case "POST_COMMENT_CLAP_TOGGLE": {
            if (this.state.userId !== e.author.id) {
              this.props.incomingCommentClap({ ...e, slug: this.state.slug, sharedSlug: this.props.sharedSlug });
              if (this.state.userId === e.comment_user_id && e.clap_count === 1) {
                toast(`${e.author.name} ${this.props.dictionary.likedYourComment}`, { position: toast.POSITION.BOTTOM_LEFT });
              }
            }
            break;
          }

          default:
            return null;
        }
      })
      .listen(".chat-notification", (e) => {
        const { user, selectedChannel, isIdle, isBrowserActive } = this.props;

        switch (e.SOCKET_TYPE) {
          case "CHAT_CREATE": {
            if (e.is_huddle && this.publishChannelId.current !== e.channel_id) {
              this.props.toaster.success(`${this.props.dictionary.huddlePublished} - ${e.channel_name}`, { toastId: e.channel_id });
              this.props.clearUnpublishedAnswer(e);
              setTimeout(() => {
                this.publishChannelId.current = null;
              }, 5000);
            }
            let message = { ...e };
            if (e.is_active) {
              if (message.user === null || (message.user.id !== user.id && !message.is_muted)) {
                this.props.soundPlay();
              }
            } else if (!e.is_active && e.code_data && e.code_data.mention_ids && e.code_data.mention_ids.some((id) => id === this.state.userId)) {
              this.props.soundPlay();
            }

            if (message.user === null || this.state.userId !== message.user.id) {
              delete message.reference_id;
              message.g_date = this.props.localizeDate(e.created_at.timestamp, "YYYY-MM-DD");

              if (!isIdle && isBrowserActive && document.hasFocus() && this.props.isLastChatVisible && this.props.selectedChannel && this.props.selectedChannel.id === message.channel_id) {
                message.is_read = true;
              }
            }
            this.props.incomingChatMessage({ ...message, translated_body: null, slug: this.state.slug });
            delete e.SOCKET_TYPE;
            delete e.socket;
            if (e.user && e.user.id !== this.state.userId) {
              if (!e.is_muted) {
                if (this.props.notificationsOn && isSafari && e.is_active) {
                  if (!(this.props.location.pathname.includes("/chat/") && selectedChannel.code === e.channel_code) || isIdle || !isBrowserActive || !document.hasFocus()) {
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
                if (message.user && message.user.id !== this.state.userId && e.is_muted === false) {
                  notificationCounterEntryPayload = {
                    count: 1,
                    entity_type: "CHAT_MESSAGE",
                  };
                }
              }
              this.props.setGeneralChat(notificationCounterEntryPayload);
            } else {
              if (message.user && message.user.id !== this.state.userId) {
                this.props.setGeneralChat({
                  count: 1,
                  entity_type: "WORKSPACE_CHAT_MESSAGE",
                });
                if (Object.values(this.props.workspaces).some((ws) => ws.is_favourite && e.workspace_id === ws.id)) {
                  let payload = {};
                  if (this.props.sharedSlug) {
                    payload = {
                      ...payload,
                      sharedPayload: { slug: this.state.slug, token: this.props.sharedWorkspaces[this.state.slug].access_token, is_shared: true },
                    };
                  }
                  //this.props.getFavoriteWorkspaceCounters(payload);
                }
              }
            }

            //check if channel exist
            if (this.props.channels[e.channel_code]) return;
            if (!this.props.channels[e.channel_id] && e.is_active) {
              //check if channel is active and channel is not loaded yet
              this.props.getChannel({ code: e.channel_code });
            } else if (!this.props.channels[e.channel_id] && !e.is_active && e.code_data && e.code_data.mention_ids && e.code_data.mention_ids.some((id) => id === this.state.userId)) {
              //check if channel is not loaded yet and is not active and if user is mentioned
              this.props.getChannel({ code: e.channel_code });
            }

            break;
          }
          case "CHAT_UPDATE": {
            this.props.incomingUpdatedChatMessage({ ...e, translated_body: null, slug: this.state.slug });
            break;
          }
          case "CHAT_DELETE": {
            //@change response and add the delete file reducer
            this.props.incomingDeletedChatMessage(e);
            break;
          }
          case "TOGGLE_IMPORTANT": {
            this.props.incomingImportantChat({ ...e, slug: this.state.slug });
            break;
          }
          default:
            return null;
        }
      })
      .listen(".post-list-notification", (e) => {
        let payload = {};
        if (this.props.sharedSlug) {
          payload = {
            ...payload,
            sharedPayload: { slug: this.state.slug, token: this.props.sharedWorkspaces[this.state.slug].access_token, is_shared: true },
          };
        }
        this.props.getPostList(payload, (err, res) => {
          if (err) return;
          let post = {
            link_id: e.link_id,
            post_id: e.post_id,
            slug: this.state.slug,
            sharedSlug: this.props.sharedSlug,
          };
          switch (e.SOCKET_TYPE) {
            case "POST_LIST_CONNECTED": {
              this.props.incomingPostListConnect(post);
              break;
            }
            case "POST_LIST_DISCONNECTED": {
              this.props.incomingPostListDisconnect(post);
              break;
            }
            default:
              return null;
          }
        });
      });

    window.Echo[this.state.slug]
      .private(`${this.state.slug}.App.Broadcast`)
      .listen(".shared-user-notification", (e) => {
        console.log(e, "accepted user");
        this.props.incomingAcceptedSharedUser(e);
      })
      .listen(".update-meeting-option-notification", (e) => {
        this.props.incomingMeetingSettings(e);
      })
      .listen(".update-login-option-notification", (e) => {
        delete e.SOCKET_TYPE;
        delete e.socket;
        this.props.incomingLoginSettings(e);
      })
      .listen(".update-security-option-notification", (e) => {
        this.props.updateSecuritySettings({
          password_policy: e.password_policy,
          invite_internal: e.invite_internal,
          invite_guest: e.invite_guest,
        });
      })
      .listen(".upload-company-background", (e) => {
        this.props.incomingCompanyDashboardBackground(e.files.image_link);
      })
      .listen(".post-access-notification", (e) => {
        this.props.incomingPostAccess(e);
      })
      .listen(".create-team", (e) => {
        this.props.incomingTeam({ ...e, fromSharedWs: this.props.sharedSlug, slug: this.state.slug });
      })
      .listen(".update-team", (e) => {
        this.props.incomingUpdatedTeam({ ...e, fromSharedWs: this.props.sharedSlug, slug: this.state.slug });
      })
      .listen(".remove-team", (e) => {
        Array.from(Object.values(this.props.workspaces)).map((ws) => {
          if (ws.members.some((m) => m.members && m.id === e.id && m.members.some((mem) => mem.id === this.state.userId))) {
            //check if user is still a member of the workspace

            if (!ws.members.some((m) => (m.type === "internal" || m.type === "external") && this.state.userId === m.id)) {
              //user is not part of workspace members
              const teamMembers = ws.members
                .filter((m) => m.members && m.id !== e.id)
                .map((m) => m.member_ids)
                .flat();
              if (!teamMembers.some((id) => id === this.state.userId)) {
                //user is not part of any teams
                //check if user is not part of workspace member
                if (ws.is_lock) {
                  let channels = [ws.channel && ws.channel.id ? ws.channel.id : 0, ws.team_channel && ws.team_channel.id ? ws.team_channel.id : 0];
                  if (channels.some((id) => this.props.selectedChannel && id === this.props.selectedChannel.id) && this.props.match.url.startsWith("/chat")) {
                    this.props.history.push("/chat");
                  }
                  this.props.removeWorkspaceChannel({ channels: channels });
                } else {
                  //remove channel members
                  const removedTeamMembers = ws.members
                    .filter((m) => m.members && m.id === e.id)
                    .map((m) => m.member_ids)
                    .flat();
                  let channels = [ws.channel && ws.channel.id ? ws.channel.id : 0, ws.team_channel && ws.team_channel.id ? ws.team_channel.id : 0];
                  this.props.removeWorkspaceChannelMembers({ channels: channels, remove_member_ids: removedTeamMembers });
                }
              }
            }
            return ws;
          } else {
            return ws;
          }
        });
        this.props.incomingDeletedTeam(e);
      })
      .listen(".add-team-member", (e) => {
        this.props.incomingTeamMember(e);
      })
      .listen(".remove-team-member", (e) => {
        //remove member ids
        //get all workspace with user as part of the removed members
        Array.from(Object.values(this.props.workspaces)).map((ws) => {
          if (ws.members.some((m) => m.members && m.id === e.id && m.members.some((mem) => mem.id === this.state.userId))) {
            //if user is no longer member of workspace or team and workspace is private
            if (!ws.members.some((m) => (m.type === "internal" || m.type === "external") && this.state.userId === m.id) && ws.is_lock === 1) {
              //remove channel
              let channels = [ws.channel && ws.channel.id ? ws.channel.id : 0, ws.team_channel && ws.team_channel.id ? ws.team_channel.id : 0];
              if (channels.some((id) => this.props.selectedChannel && id === this.props.selectedChannel.id) && this.props.match.url.startsWith("/chat")) {
                this.props.history.push("/chat");
              }
              this.props.removeWorkspaceChannel({ channels: channels });
            } else if (!ws.members.some((m) => (m.type === "internal" || m.type === "external") && this.state.userId === m.id)) {
              //remove channel members
              let channels = [ws.channel && ws.channel.id ? ws.channel.id : 0, ws.team_channel && ws.team_channel.id ? ws.team_channel.id : 0];
              this.props.removeWorkspaceChannelMembers({ channels: channels, remove_member_ids: e.remove_member_ids });
            }
            return ws;
          } else {
            return ws;
          }
        });
        this.props.incomingRemovedTeamMember(e);
      })
      .listen(".create-drive-link", (e) => {
        this.props.incomingDriveLink({ ...e, slug: this.state.slug, sharedSlug: this.props.sharedSlug });
      })
      .listen(".remove-drive-link", (e) => {
        this.props.incomingDeletedDriveLink({ ...e, slug: this.state.slug, sharedSlug: this.props.sharedSlug });
      })
      .listen(".update-drive-link", (e) => {
        this.props.incomingUpdatedDriveLink({ ...e, slug: this.state.slug, sharedSlug: this.props.sharedSlug });
      })
      .listen(".upload-company-logo", (e) => {
        this.props.incomingUpdatedCompanyLogo(e);
      })
      .listen(".reset-company-logo", (e) => {
        this.props.incomingUpdatedCompanyLogo({ files: { view_link: "" } });
      })
      .listen(".team-checkout-complete", (e) => {
        this.props.incomingUpdatedSubscription(e);
      })
      .listen(".team-subscription-cancelled", (e) => {
        console.log(e, "cancelled subs");
        this.props.incomingUpdatedSubscription(e);
      })
      .listen(".team-subscription-will-end", (e) => {
        console.log(e, "trial will end");
      })
      .listen(".reset-password-notification", (e) => {
        this.props.incomingAcceptedInternal(e);
      })
      .listen(".remove-file-notification", (e) => {
        switch (e.SOCKET_TYPE) {
          case "REMOVE_FILE": {
            this.props.incomingRemoveFileAutomatically({ ...e, slug: this.state.slug, sharedSlug: this.props.sharedSlug });
            break;
          }
          case "REMOVE_FILE_ON_DOWNLOAD": {
            this.props.incomingRemoveFileAfterDownload(e.files);
            break;
          }
          default:
            return null;
        }
      })
      .listen(".workspace-team-channel", (e) => {
        this.props.incomingTeamChannel(e);
      })
      .listen(".announcement-notification", (e) => {
        switch (e.SOCKET_TYPE) {
          case "ANNOUNCEMENT_UPDATED": {
            this.props.incomingUpdatedAnnouncement(e);
            break;
          }
          case "ANNOUNCEMENT_CREATED": {
            this.props.incomingCreatedAnnouncement(e);
            break;
          }
          case "ANNOUNCEMENT_DELETED": {
            this.props.incomingDeletedAnnouncement(e);
            break;
          }
          default:
            return null;
        }
      })
      .listen(".users-online-broadcast", (e) => {
        this.props.incomingOnlineUsers(e);
      })
      .listen(".user-updated", (e) => {
        switch (e.SOCKET_TYPE) {
          case "ARCHIVED_ACCOUNT": {
            let payload = {
              channel_ids: [...e.connected_data.user_removed_channel_ids, ...e.connected_data.archived_channel_ids],
              topic_ids: [...e.connected_data.user_removed_topic_ids, ...e.connected_data.archived_topic_ids],
              user: e.user,
              slug: this.state.slug,
              sharedSlug: this.props.sharedSlug,
            };
            this.props.incomingArchivedUser(payload);
            if (e.user.id === this.state.userId) {
              localStorage.removeItem("userAuthToken");
              localStorage.removeItem("token");
              localStorage.removeItem("atoken");
              //localStorage.removeItem("welcomeBanner");
              sessionService.deleteSession().then(() => sessionService.deleteUser());
            }
            break;
          }
          case "RESTORED_ACCOUNT": {
            this.props.incomingUnarchivedUser({ ...e, slug: this.state.slug, sharedSlug: this.props.sharedSlug });
            break;
          }
          case "DEACTIVATE_ACCOUNT": {
            this.props.incomingDeactivatedUser(e);
            if (e.user_id === this.state.userId) {
              localStorage.removeItem("userAuthToken");
              localStorage.removeItem("token");
              localStorage.removeItem("atoken");
              //localStorage.removeItem("welcomeBanner");
              sessionService.deleteSession().then(() => sessionService.deleteUser());
            }
            break;
          }
          case "ACTIVATE_ACCOUNT": {
            this.props.incomingActivatedUser(e);
            break;
          }
          default:
            return null;
        }
      })
      .listen(".updated-version", (e) => {
        const { version, requirement } = e;
        const socketVersion = parseFloat(version.substr(2));
        const latestVersion = parseFloat(driffData.version.substr(2));

        if (!(isIPAddress(window.location.hostname) || window.location.hostname === "localhost") && socketVersion > latestVersion) {
          this.props.setNewDriffData({ requirement: requirement, showNewDriffBar: true });
          localStorage.setItem("site_ver", version);
        }
      })
      .listen(".user-role-notification", (e) => {
        this.props.incomingUserRole(e);
        if (e.user_id === this.state.userId) {
          this.props.getUser({ id: this.state.userId }, (err, res) => {
            if (err) return;
            sessionService.saveUser({ ...this.props.user, ...res.data });
          });
        }
      })
      .listen(".company-announcement", (e) => {
        this.props.updateCompanyPostAnnouncement(e);
      })
      .listen(".company-request-form-notification", (e) => {
        switch (e.SOCKET_TYPE) {
          case "CREATE_REQUEST_FORM": {
            this.props.incomingInternalUser(e);
            break;
          }
          default:
            return null;
        }
      })
      .listen(".company-notification", (e) => {
        switch (e.SOCKET_TYPE) {
          case "UPDATE_COMPANY_NAME": {
            this.props.incomingUpdateCompanyName(e);
            break;
          }
          default:
            return null;
        }
      })
      .listen(".company-file-notification", (e) => {
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
          case "FILE_DELETE": {
            this.props.incomingCompanyRemovedFile(e);
            break;
          }
          default:
            return null;
        }
      })
      .listen(".company-folder-notification", (e) => {
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
            return null;
        }
      })
      .listen(".delete-workspace", (e) => {
        this.props.incomingDeletedWorkspaceFolder(e);
      })
      .listen(".workspace-role-notification", (e) => {
        this.props.incomingWorkspaceRole({ ...e, slug: this.state.slug, sharedSlug: this.props.sharedSlug });
      })
      .listen(".google-attachment-notification", (e) => {
        switch (e.SOCKET_TYPE) {
          case "ATTACHMENT_CREATE": {
            if (e.attachment_type === "GOOGLE_DRIVE_FILE") {
              this.props.incomingGoogleFile({ ...e, slug: this.state.slug, sharedSlug: this.props.sharedSlug });
            } else if (e.attachment_type === "GOOGLE_DRIVE_FOLDER") {
              this.props.incomingGoogleFolder({ ...e, slug: this.state.slug, sharedSlug: this.props.sharedSlug });
            }
            break;
          }
          case "ATTACHMENT_DELETE": {
            this.props.incomingDeletedGoogleFile({ ...e, slug: this.state.slug, sharedSlug: this.props.sharedSlug });
            break;
          }
          default:
            return null;
        }
      })
      // .listen(".user-activated", (e) => {
      //   console.log(e, "new user");
      // })
      .listen(".external-user-notification", (e) => {
        this.props.incomingExternalUser({ ...e, sharedSlug: this.props.sharedSlug, slug: this.state.slug });
      })
      .listen(".user-notification", (e) => {
        switch (e.SOCKET_TYPE) {
          case "USER_UPDATE": {
            this.props.incomingUpdatedUser({ ...e, fromSharedWs: this.props.sharedSlug, slug: this.state.slug });
            if (e.id === this.state.userId || e.user_id === this.state.userId) {
              this.props.getUser({ id: this.state.userId }, (err, res) => {
                if (err) return;
                sessionService.saveUser({ ...this.props.user, ...res.data });
              });
            }
            break;
          }
          default:
            return null;
        }
      })
      .listen(".post-notification", (e) => {
        switch (e.SOCKET_TYPE) {
          case "POST_DELETE_ATTACHMENT": {
            this.props.incomingDeletedPostFile({ ...e, slug: this.state.slug, sharedSlug: this.props.sharedSlug });
            break;
          }
          case "POST_COMMENT_DELETE_ATTACHMENT": {
            this.props.incomingDeletedPostFile({ ...e, slug: this.state.slug, sharedSlug: this.props.sharedSlug });
            break;
          }
          default:
            return null;
        }
      })
      .listen(".workspace-timeline-notification", (e) => {
        this.props.incomingTimeline(e);
      })
      .listen(".upload-bulk-workspace-files", (e) => {
        this.props.incomingFiles({ ...e, slug: this.state.slug, sharedSlug: this.props.sharedSlug });
        e.channel_messages &&
          e.channel_messages.forEach((m) => {
            m.system_message.channel_id = m.channel.id;
            m.system_message.files = [];
            m.system_message.editable = false;
            m.system_message.unfurls = [];
            m.system_message.reactions = [];
            m.system_message.is_deleted = false;
            m.system_message.todo_reminder = null;
            m.system_message.is_read = false;
            m.system_message.is_completed = false;
            m.system_message.user = null;
            // m.system_message.new_post = true;
            m.system_message.topic = m.topic;
            m.system_message.shared_with_client = true;
            m.system_message.slug = this.state.slug;
            this.props.incomingPostNotificationMessage(m.system_message);
          });
      })
      .listen(".workspace-file-notification", (e) => {
        switch (e.SOCKET_TYPE) {
          case "FILE_RESTORE": {
            this.props.incomingRestoreFile({ ...e, slug: this.state.slug, sharedSlug: this.props.sharedSlug });
            break;
          }
          case "FILE_UPDATE": {
            this.props.incomingFile({ ...e, slug: this.state.slug, sharedSlug: this.props.sharedSlug });
            break;
          }
          case "FILE_MOVE": {
            this.props.incomingMovedFile({ ...e, slug: this.state.slug, sharedSlug: this.props.sharedSlug });
            break;
          }
          case "FILE_TRASH": {
            this.props.incomingDeletedFile({ ...e, slug: this.state.slug, sharedSlug: this.props.sharedSlug });
            break;
          }
          case "FILE_EMPTY": {
            this.props.incomingEmptyTrash({ ...e, slug: this.state.slug, sharedSlug: this.props.sharedSlug });
            break;
          }
          case "FILE_DELETE": {
            this.props.incomingRemovedFile({ ...e, slug: this.state.slug, sharedSlug: this.props.sharedSlug });
            break;
          }
          case "FILE_BULK_TRASH": {
            this.props.incomingDeletedFiles({ ...e, slug: this.state.slug, sharedSlug: this.props.sharedSlug });
            break;
          }
          default:
            return null;
        }
      })
      .listen(".new-workspace", (e) => {
        if (e.type === "WORKSPACE" && !e.members.some((m) => m.id === this.state.userId)) {
          return;
        }
        if (e.topic !== undefined) {
          if (e.workspace !== null) {
            if (!this.props.folders.hasOwnProperty(e.workspace.id)) {
              this.props.getWorkspaceFolder({ folder_id: e.workspace.id }, (err, res) => {
                if (err) return;
                this.props.incomingWorkspace({
                  ...e,
                  channel: {
                    id: e.channel.id ? e.channel.id : 0,
                    code: e.channel.code ? e.channel.code : null,
                  },
                  slug: e.topic.is_shared_wp ? e.topic.slug_owner : this.state.slug,
                  sharedSlug: e.topic.is_shared_wp,
                });
              });
            } else {
              this.props.incomingWorkspace({
                ...e,
                channel: {
                  id: e.channel.id ? e.channel.id : 0,
                  code: e.channel.code ? e.channel.code : null,
                },
                slug: e.topic.is_shared_wp ? e.topic.slug_owner : this.state.slug,
                sharedSlug: e.topic.is_shared_wp,
              });
            }
          } else {
            this.props.incomingWorkspace({
              ...e,
              channel: {
                id: e.channel.id ? e.channel.id : 0,
                code: e.channel.code ? e.channel.code : null,
              },
              slug: e.topic.is_shared_wp ? e.topic.slug_owner : this.state.slug,
              sharedSlug: e.topic.is_shared_wp,
            });
          }

          if (e.channel.code && !e.topic.is_shared_wp) {
            this.props.getChannel({ code: e.channel.code }, (err, res) => {
              if (err) return;
              let channel = {
                ...res.data,
                hasMore: true,
                skip: 0,
                replies: [],
                selected: true,
                isFetching: false,
                slug: this.props.sharedSlug ? this.state.slug : null,
                sharedSlug: this.props.sharedSlug,
              };
              this.props.addToChannels(channel);
            });
          } else if (e.team_channel.code && !e.topic.is_shared_wp) {
            this.props.getChannel({ code: e.team_channel.code }, (err, res) => {
              if (err) return;
              let channel = {
                ...res.data,
                hasMore: true,
                skip: 0,
                replies: [],
                selected: true,
                isFetching: false,
                slug: this.props.sharedSlug ? this.state.slug : null,
                sharedSlug: this.props.sharedSlug,
              };
              this.props.addToChannels(channel);
            });
          }
        } else {
          this.props.incomingWorkspaceFolder({
            ...e.workspace,
            key_id: e.key_id,
            type: e.type,
          });
        }
      })
      .listen(".update-workspace", (e) => {
        if (e.type === "WORKSPACE" && this.props.workspaces[e.id] && this.props.workspaces[e.id].is_shared === false && e.is_shared) {
          this.props.transferChannelMessages({ channel: e.channel, team_channel: e.team_channel, topic_id: e.id });
        }
        this.props.incomingUpdatedWorkspaceFolder({
          ...e,
          is_shared: e.is_shared,
          channel: e.channel ? { ...e.channel } : { id: 0, code: null, icon_link: null },
          slug: this.state.slug,
          sharedSlug: this.props.sharedSlug,
          addNotification: e.type === "WORKSPACE" && this.state.userId !== e.user_id && e.new_member_ids.some((id) => id === this.state.userId),
        });
        if (e.type === "WORKSPACE" && !this.props.sharedSlug) {
          this.props.getAllWorkspaceFolders();
          if (e.new_member_ids.length > 0) {
            const isMember = e.new_member_ids.some((id) => id === this.state.userId);
            if (isMember) {
              if (e.workspace_id !== 0 && !this.props.folders.hasOwnProperty(e.workspace_id)) {
                this.props.getWorkspaceFolder({ folder_id: e.workspace_id }, (err, res) => {
                  if (err) return;
                  if (this.props.user.type === "external") {
                    this.props.getWorkspaceAndSetToFavorites({ topic_id: e.id });
                  } else {
                    this.props.getWorkspace({ topic_id: e.id });
                  }
                });
              } else {
                if (this.props.user.type === "external") {
                  this.props.getWorkspaceAndSetToFavorites({ topic_id: e.id });
                } else {
                  this.props.getWorkspace({ topic_id: e.id });
                }
              }
              // get the folder if the workspace folder does not exists yet
            }
          }
          if (e.remove_member_ids.length > 0 && this.props.match.url !== "/hub/search") {
            if (this.props.user.type === "external" && e.private !== 1 && e.remove_member_ids.some((id) => id === this.state.userId)) {
              this.props.history.push("/hub/search");
            }
          }
        } else if (e.type === "WORKSPACE" && this.props.sharedSlug) {
          //fetch the shared channels
          if (e.channel && e.channel.code) {
            this.props.getChannel({ code: e.channel.code, sharedPayload: { slug: this.state.slug, token: this.props.sharedWorkspaces[this.state.slug].access_token, is_shared: true } }, (err, res) => {
              if (err) return;
              let channel = {
                ...res.data,
                hasMore: true,
                skip: 0,
                replies: [],
                selected: true,
                isFetching: false,
                slug: this.state.slug,
                sharedSlug: true,
              };
              this.props.addToChannels(channel);
            });
          }
          if (e.team_channel && e.team_channel.code) {
            this.props.getChannel({ code: e.team_channel.code, sharedPayload: { slug: this.state.slug, token: this.props.sharedWorkspaces[this.state.slug].access_token, is_shared: true } }, (err, res) => {
              if (err) return;
              let channel = {
                ...res.data,
                hasMore: true,
                skip: 0,
                replies: [],
                selected: true,
                isFetching: false,
                slug: this.state.slug,
                sharedSlug: true,
              };
              this.props.addToChannels(channel);
            });
          }
        }
        if (this.props.activeTopic && this.props.activeTopic.id === e.id && e.type === "WORKSPACE" && this.props.match.url.startsWith("/hub") && this.props.match.url !== "/hub/search") {
          let currentPage = this.props.location.pathname;
          currentPage = currentPage.split("/")[2];
          if (e.workspace_id === 0) {
            //direct workspace
            if (e.original_workspace_id !== 0) {
              //now direct workspace url
              this.props.history.push(`/hub/${currentPage}/${e.id}/${replaceChar(e.name)}`);
            }
          } else {
            //moved workspace to another folder
            if (e.original_workspace_id !== e.workspace_id) {
              this.props.history.push(`/hub/${currentPage}/${e.workspace_id}/${replaceChar(e.current_workspace_folder_name)}/${e.id}/${replaceChar(e.name)}`);
            }
          }
        }
      })
      .listen(".upload-favicon-event", (e) => {
        this.props.incomingFaviconImage(e.files.image_link);
      });
    // old / legacy channel
    window.Echo[this.state.slug]
      .private(`${this.state.slug}.App.User.${this.state.userId}`)
      .listen(".update-workspace-quicklinks", (e) => {
        this.props.incomingUpdatedWorkspaceQuickLinks({ ...e, slug: this.state.slug, sharedSlug: this.props.sharedSlug });
      })
      .listen(".update-company-workspace", (e) => {
        this.props.incomingCompanyDescription(e);
      })
      .listen(".zoom-system-message-notification", (e) => {
        if (!e.hasOwnProperty("system_message")) return;
        if (e.system_message.startsWith("GOOGLE_MEETING")) {
          const data = JSON.parse(e.system_message.replace("GOOGLE_MEETING::", ""));
          let timestamp = Math.floor(Date.now() / 1000);

          const chatMessage = {
            message: e.system_message,
            body: e.system_message,
            mention_ids: [],
            user: null,
            original_body: e.system_message,
            is_read: true,
            editable: true,
            files: [],
            is_archive: false,
            is_completed: true,
            is_transferred: false,
            is_deleted: false,
            created_at: { timestamp: timestamp },
            updated_at: { timestamp: timestamp },
            channel_id: data.channel_id,
            reactions: [],
            id: e.chat_id,
            reference_id: null,
            quote: null,
            unfurls: [],
            g_date: this.props.localizeDate(timestamp, "YYYY-MM-DD"),
          };
          this.props.incomingChatMessage({ ...chatMessage, channel_id: data.channel_id, slug: this.state.slug });
          if (data.author.id !== this.state.userId) {
            this.props.addToModals({
              ...e,
              type: "meet_invite",
              hideJoin: false,
              data: data,
            });
          }
        } else if (e.system_message.startsWith("ZOOM_MEETING")) {
          const data = JSON.parse(e.system_message.replace("ZOOM_MEETING::", ""));
          let timestamp = Math.floor(Date.now() / 1000);
          const chatMessage = {
            message: e.system_message,
            body: e.system_message,
            mention_ids: [],
            user: null,
            original_body: e.system_message,
            is_read: true,
            editable: true,
            files: [],
            is_archive: false,
            is_completed: true,
            is_transferred: false,
            is_deleted: false,
            created_at: { timestamp: timestamp },
            updated_at: { timestamp: timestamp },
            channel_id: data.channel_id,
            reactions: [],
            id: e.chat_id,
            reference_id: null,
            quote: null,
            unfurls: [],
            g_date: this.props.localizeDate(timestamp, "YYYY-MM-DD"),
          };
          this.props.incomingZoomCreate({ ...e, chat: chatMessage, channel_id: data.channel_id });
        }
      })
      .listen(".left-meeting-notification", (e) => {
        let timestamp = Math.floor(Date.now() / 1000);
        const chatMessage = {
          message: e.system_message,
          body: e.system_message,
          mention_ids: [],
          user: null,
          original_body: e.system_message,
          is_read: true,
          editable: true,
          files: [],
          is_archive: false,
          is_completed: true,
          is_transferred: false,
          is_deleted: false,
          created_at: { timestamp: timestamp },
          updated_at: { timestamp: timestamp },
          channel_id: e.channel_id,
          reactions: [],
          id: e.chat_id,
          reference_id: null,
          quote: null,
          unfurls: [],
          g_date: this.props.localizeDate(timestamp, "YYYY-MM-DD"),
        };
        this.props.incomingZoomUserLeft({ ...e, chat: chatMessage });
      })
      .listen(".create-meeting-notification", (e) => {
        if (this.state.userId !== e.host.id) {
          const meetingSDKELement = document.getElementById("meetingSDKElement");
          const meetingSDKELementFirstChild = meetingSDKELement.firstChild;
          if (meetingSDKELementFirstChild && meetingSDKELementFirstChild.classList.contains("react-draggable")) {
            setTimeout(() => {
              this.props.addToModals({
                ...e,
                type: "zoom_invite",
                hideJoin: true,
              });
              this.props.incomingZoomData({ ...e.zoom_data.data, channel_id: e.channel_id });
            }, 2000);
          } else {
            setTimeout(() => {
              this.props.addToModals({
                ...e,
                type: "zoom_invite",
                hideJoin: false,
              });
              this.props.incomingZoomData({ ...e.zoom_data.data, channel_id: e.channel_id });
            }, 2000);
          }
        }
      })
      .listen(".workspace-active", (e) => {
        this.props.incomingWorkpaceNotificationStatus(e);
      })
      .listen(".create-drive-link", (e) => {
        this.props.incomingDriveLink({ ...e, slug: this.state.slug, sharedSlug: this.props.sharedSlug });
      })
      .listen(".remove-drive-link", (e) => {
        this.props.incomingDeletedDriveLink({ ...e, slug: this.state.slug, sharedSlug: this.props.sharedSlug });
      })
      .listen(".update-drive-link", (e) => {
        this.props.incomingUpdatedDriveLink({ ...e, slug: this.state.slug, sharedSlug: this.props.sharedSlug });
      })
      .listen(".favourite-workspace-notification", (e) => {
        this.props.incomingFavouriteWorkspace({ ...e, fromSharedWs: this.props.sharedSlug, slug: this.state.slug });
      })
      // .listen(".post-read-require", (e) => {
      //   this.props.incomingMarkAsRead({ ...e, fromSharedWs: this.props.sharedSlug, slug: this.state.slug });
      // })
      .listen(".new-workspace", (e) => {
        if (e.type === "WORKSPACE" && !e.members.some((m) => m.id === this.state.userId)) {
          return;
        }
        if (e.topic !== undefined) {
          if (e.workspace !== null) {
            if (!this.props.folders.hasOwnProperty(e.workspace.id)) {
              this.props.getWorkspaceFolder({ folder_id: e.workspace.id }, (err, res) => {
                if (err) return;
                this.props.incomingWorkspace({
                  ...e,
                  channel: {
                    id: e.channel.id ? e.channel.id : 0,
                    code: e.channel.code ? e.channel.code : null,
                  },
                  slug: e.topic.is_shared_wp ? e.topic.slug_owner : this.state.slug,
                  sharedSlug: e.topic.is_shared_wp,
                });
              });
            } else {
              this.props.incomingWorkspace({
                ...e,
                channel: {
                  id: e.channel.id ? e.channel.id : 0,
                  code: e.channel.code ? e.channel.code : null,
                },
                slug: e.topic.is_shared_wp ? e.topic.slug_owner : this.state.slug,
                sharedSlug: e.topic.is_shared_wp,
              });
            }
          } else {
            this.props.incomingWorkspace({
              ...e,
              channel: {
                id: e.channel.id ? e.channel.id : 0,
                code: e.channel.code ? e.channel.code : null,
              },
              slug: e.topic.is_shared_wp ? e.topic.slug_owner : this.state.slug,
              sharedSlug: e.topic.is_shared_wp,
            });
          }

          if (e.channel.code && !e.topic.is_shared_wp) {
            this.props.getChannel({ code: e.channel.code }, (err, res) => {
              if (err) return;
              let channel = {
                ...res.data,
                hasMore: true,
                skip: 0,
                replies: [],
                selected: true,
                isFetching: false,
                slug: e.topic.is_shared_wp ? e.topic.slug_owner : null,
                sharedSlug: e.topic.is_shared_wp,
              };
              this.props.addToChannels(channel);
            });
          } else if (e.team_channel.code && !e.topic.is_shared_wp) {
            this.props.getChannel({ code: e.team_channel.code }, (err, res) => {
              if (err) return;
              let channel = {
                ...res.data,
                hasMore: true,
                skip: 0,
                replies: [],
                selected: true,
                isFetching: false,
                slug: e.topic.is_shared_wp ? e.topic.slug_owner : null,
                sharedSlug: e.topic.is_shared_wp,
              };
              this.props.addToChannels(channel);
            });
          }
        } else {
          this.props.incomingWorkspaceFolder({
            ...e.workspace,
            key_id: e.key_id,
            type: e.type,
          });
        }
      })
      .listen(".new-lock-workspace", (e) => {
        if (e.type === "WORKSPACE" && !e.members.some((m) => m.id === this.state.userId)) {
          return;
        }
        if (e.topic !== undefined) {
          if (e.workspace !== null) {
            if (!this.props.folders.hasOwnProperty(e.workspace.id)) {
              this.props.getWorkspaceFolder({ folder_id: e.workspace.id }, (err, res) => {
                if (err) return;
                this.props.incomingWorkspace({
                  ...e,
                  channel: {
                    id: e.channel.id ? e.channel.id : 0,
                    code: e.channel.code ? e.channel.code : null,
                  },
                  slug: e.topic.is_shared_wp ? e.topic.slug_owner : this.state.slug,
                  sharedSlug: e.topic.is_shared_wp,
                });
              });
            } else {
              this.props.incomingWorkspace({
                ...e,
                channel: {
                  id: e.channel.id ? e.channel.id : 0,
                  code: e.channel.code ? e.channel.code : null,
                },
                slug: e.topic.is_shared_wp ? e.topic.slug_owner : this.state.slug,
                sharedSlug: e.topic.is_shared_wp,
              });
            }
          } else {
            this.props.incomingWorkspace({
              ...e,
              channel: {
                id: e.channel.id ? e.channel.id : 0,
                code: e.channel.code ? e.channel.code : null,
              },
              slug: e.topic.is_shared_wp ? e.topic.slug_owner : this.state.slug,
              sharedSlug: e.topic.is_shared_wp,
            });
          }
          if (e.channel.code && !e.topic.is_shared_wp) {
            this.props.getChannel({ code: e.channel.code }, (err, res) => {
              if (err) return;
              let channel = {
                ...res.data,
                hasMore: true,
                skip: 0,
                replies: [],
                selected: true,
                isFetching: false,
                slug: e.topic.is_shared_wp ? e.topic.slug_owner : null,
                sharedSlug: e.topic.is_shared_wp,
              };
              this.props.addToChannels(channel);
            });
          } else if (e.team_channel.code && !e.topic.is_shared_wp) {
            this.props.getChannel({ code: e.team_channel.code }, (err, res) => {
              if (err) return;
              let channel = {
                ...res.data,
                hasMore: true,
                skip: 0,
                replies: [],
                selected: true,
                isFetching: false,
                slug: e.topic.is_shared_wp ? e.topic.slug_owner : null,
                sharedSlug: e.topic.is_shared_wp,
              };
              this.props.addToChannels(channel);
            });
          }
        } else {
          this.props.incomingWorkspaceFolder({
            ...e.workspace,
            key_id: e.key_id,
            type: e.type,
          });
        }
      })
      .listen(".update-lock-workspace", (e) => {
        let members = [];
        if (e.type === "WORKSPACE" && this.props.workspaces[e.id] && this.props.workspaces[e.id].is_shared === false && e.is_shared) {
          this.props.transferChannelMessages({ channel: e.channel, team_channel: e.team_channel, topic_id: e.id });
        }
        if (e.type === "WORKSPACE") {
          members = e.members
            .map((m) => {
              if (m.member_ids) {
                return m.members;
              } else return m;
            })
            .flat();
        }
        this.props.incomingUpdatedWorkspaceFolder({
          ...e,
          is_shared: e.is_shared,
          channel: e.channel ? { ...e.channel } : { id: 0, code: null, icon_link: null },
          slug: this.state.slug,
          sharedSlug: this.props.sharedSlug,
          addNotification: e.type === "WORKSPACE" && this.state.userId !== e.user_id && e.new_member_ids.some((id) => id === this.state.userId),
        });
        //get the updated members
        if (e.type === "WORKSPACE" && !this.props.sharedSlug) {
          this.props.getAllWorkspaceFolders();
          if (e.new_member_ids.length > 0) {
            const isMember = e.new_member_ids.some((id) => id === this.state.userId);
            if (isMember) {
              if (e.workspace_id !== 0 && !this.props.folders.hasOwnProperty(e.workspace_id)) {
                this.props.getWorkspaceFolder({ folder_id: e.workspace_id }, (err, res) => {
                  if (err) return;
                  if (this.props.user.type === "external") {
                    this.props.getWorkspaceAndSetToFavorites({ topic_id: e.id });
                  } else {
                    this.props.getWorkspace({ topic_id: e.id });
                  }
                });
              } else {
                if (this.props.user.type === "external") {
                  this.props.getWorkspaceAndSetToFavorites({ topic_id: e.id });
                } else {
                  this.props.getWorkspace({ topic_id: e.id });
                }
              }
              // get the folder if the workspace folder does not exists yet
            }
          }
          if (e.remove_member_ids.length > 0 && this.props.match.url !== "/hub/search") {
            if (e.remove_member_ids.some((id) => id === this.state.userId) && !members.some((m) => m.id === this.state.userId)) {
              this.props.history.push("/hub/search");
              //redirect to first favorite workspace
              // let favoriteWorkspaces = Object.values(this.props.workspaces).filter((ws) => ws.id !== e.id && ws.is_favourite && ws.channel && ws.channel.code);
              // if (favoriteWorkspaces.length) {
              //   let workspace = favoriteWorkspaces[0];
              //   this.props.setActiveTopic(workspace);
              //   if (workspace.folder_id) {
              //     this.props.history.push(`/hub/chat/${workspace.folder_id}/${replaceChar(workspace.folder_name)}/${workspace.id}/${replaceChar(workspace.name)}`);
              //   } else {
              //     this.props.history.push(`/hub/chat/${workspace.id}/${replaceChar(workspace.name)}`);
              //   }
              //   if (this.props.selectedChannel && e.system_message && this.props.selectedChannel.id === e.system_message.channel_id) {
              //     if (this.props.selectedChannel.code === e.channel.code && this.props.location.pathname === `/chat/${this.props.selectedChannel.code}` && this.props.channels[workspace.channel.id]) {
              //       this.props.setSelectedChannel(this.props.channels[workspace.channel.id]);
              //       this.props.history.push(`/chat/${workspace.channel.code}`);
              //     }
              //   }
              // }
            }
          }
        } else if (e.type === "WORKSPACE" && this.props.sharedSlug) {
          if (e.remove_member_ids.length > 0 && this.props.match.url !== "/hub/search" && e.remove_member_ids.some((id) => id === this.state.userId) && !members.some((m) => m.id === this.state.userId)) {
            if (this.props.match.path === "/chat") {
              if (e.channel && e.channel.code && this.props.location.pathname === `/chat/${e.channel.code}`) {
                this.props.history.push("/hub/search");
              }
              if (e.channel && e.team_channel.code && this.props.location.pathname === `/chat/${e.team_channel.code}`) {
                this.props.history.push("/hub/search");
              }
            }
            //remove the channels
            if (e.channel && e.channel.code) {
              this.props.removeChannel(e.channel);
            }
            if (e.team_channel && e.team_channel.code) {
              this.props.removeChannel(e.team_channel);
            }
            if (this.props.activeTopic && e.id === this.props.activeTopic.id && this.props.activeTopic.sharedSlug && this.props.match.url.startsWith("/shared-hub")) {
              //redirect
              this.props.history.push("/hub/search");
            }
            //remove the workspace
            this.props.removeWorkspace({ ...e, slug: this.state.slug, sharedSlug: this.props.sharedSlug });
          } else {
            //fetch the shared channels
            if (e.channel && e.channel.code) {
              this.props.getChannel({ code: e.channel.code, sharedPayload: { slug: this.state.slug, token: this.props.sharedWorkspaces[this.state.slug].access_token, is_shared: true } }, (err, res) => {
                if (err) return;
                let channel = {
                  ...res.data,
                  hasMore: true,
                  skip: 0,
                  replies: [],
                  selected: true,
                  isFetching: false,
                  slug: this.state.slug,
                  sharedSlug: true,
                };
                this.props.addToChannels(channel);
              });
            }
            if (e.team_channel && e.team_channel.code) {
              this.props.getChannel({ code: e.team_channel.code, sharedPayload: { slug: this.state.slug, token: this.props.sharedWorkspaces[this.state.slug].access_token, is_shared: true } }, (err, res) => {
                if (err) return;
                let channel = {
                  ...res.data,
                  hasMore: true,
                  skip: 0,
                  replies: [],
                  selected: true,
                  isFetching: false,
                  slug: this.state.slug,
                  sharedSlug: true,
                };
                this.props.addToChannels(channel);
              });
            }
          }
        }
        if (this.props.activeTopic && this.props.activeTopic.id === e.id && e.type === "WORKSPACE" && this.props.match.url.startsWith("/hub") && this.props.match.url !== "/hub/search") {
          let currentPage = this.props.location.pathname;
          currentPage = currentPage.split("/")[2];
          if (e.workspace_id === 0) {
            //direct workspace
            if (e.original_workspace_id !== 0) {
              //now direct workspace url
              this.props.history.push(`/hub/${currentPage}/${e.id}/${replaceChar(e.name)}`);
            }
          } else {
            //moved workspace to another folder
            if (e.original_workspace_id !== e.workspace_id) {
              if (e.current_workspace_folder_name) {
                this.props.history.push(`/hub/${currentPage}/${e.workspace_id}/${replaceChar(e.current_workspace_folder_name)}/${e.id}/${replaceChar(e.name)}`);
              } else {
                this.props.history.push(`/hub/${currentPage}/${e.id}/${replaceChar(e.name)}`);
              }
            }
          }
        }
      })
      .listen(".users-online", (e) => {
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
        let payload = {
          post_id: e.post_id,
          viewer: e.user,
          slug: this.state.slug,
          sharedSlug: this.props.sharedSlug,
        };
        this.props.incomingPostViewer(payload);
      })
      .listen(".move-private-topic-workspace", (e) => {
        this.props.incomingMovedTopic(e);
      })
      .listen(".update-channel-name", (e) => {
        let data = {
          ...e,
          slug: this.state.slug,
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
        this.props.setMemberTimestamp({ ...e, userId: this.state.userId, slug: this.state.slug, sharedSlug: this.props.sharedSlug });
      })
      .listen(".new-added-member-chat", (e) => {
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

          let newMembers = Object.values(this.props.users)
            .filter((u) => {
              return data.added_members.some((id) => id === u.id);
            })
            .map((m) => {
              return {
                ...m,
                bot_profile_image_link: null,
                last_visited_at: null,
                active: 1,
                workspace_role: "",
              };
            });

          let payload = {
            users: newMembers,
            channel_id: e.channel_id,
            data: e,
            message: message,
          };

          if (!this.props.channels.hasOwnProperty(e.channel_id) && data.author.id !== this.state.userId) {
            this.props.getChannel({ code: e.channel_code }, (err, res) => {
              if (err) return;
              let channel = {
                ...res.data,
                hasMore: true,
                skip: 0,
                replies: [],
                selected: true,
                is_archived: res.data.is_archived === 1,
                isFetching: false,
                slug: this.props.sharedSlug ? this.state.slug : null,
                sharedSlug: this.props.sharedSlug,
              };
              this.props.addToChannels(channel);
            });
            if (e.workspace_data) {
              if (e.workspace_data.workspace && !this.props.folders.hasOwnProperty(e.workspace_data.workspace.id) && !this.props.sharedSlug) {
                this.props.getWorkspaceFolder({ folder_id: e.workspace_data.workspace.id }, (err, res) => {
                  if (err) return;
                  if (this.props.user.type === "external") {
                    this.props.getWorkspaceAndSetToFavorites({ topic_id: e.workspace_data.topic.id });
                  } else {
                    this.props.getWorkspace({ topic_id: e.workspace_data.topic.id });
                  }
                });
              } else {
                if (this.props.user.type === "external") {
                  this.props.getWorkspaceAndSetToFavorites({ topic_id: e.workspace_data.topic.id });
                } else {
                  this.props.getWorkspace({ topic_id: e.workspace_data.topic.id });
                }
              }
            }
          } else {
            this.props.joinWorkspaceReducer(payload);
          }
        }
      })
      .listen(".archived-chat-channel", (e) => {
        if (e.channel_data.topic_detail) {
          if (e.channel_data.timeline) {
            this.props.incomingTimeline({ timeline_data: e.channel_data.timeline, workspace_data: { topic_id: e.channel_data.topic_detail.id } });
          }
          if (e.channel_data.status === "UNARCHIVED") {
            this.props.incomingUnArchivedWorkspaceChannel({ ...e.channel_data, slug: this.state.slug, sharedSlug: this.props.sharedSlug });
          } else {
            this.props.incomingArchivedWorkspaceChannel({ ...e.channel_data, slug: this.state.slug, sharedSlug: this.props.sharedSlug });
          }
        } else {
          this.props.incomingArchivedChannel({ ...e.channel_data, slug: this.state.slug, sharedSlug: this.props.sharedSlug });
        }
      })
      .listen(".new-chat-channel", (e) => {
        if (e.channel_data.creator_by.id !== this.state.userId) {
          this.props.getChannel({ code: e.channel_data.code }, (err, res) => {
            if (err) return;
            let channel = {
              ...res.data,
              selected: false,
              replies: [],
              skip: 0,
              hasMore: true,
              isFetching: false,
              creator: e.channel_data.creator_by,
              slug: this.props.sharedSlug ? this.state.slug : null,
              sharedSlug: this.props.sharedSlug,
            };
            this.props.addToChannels(channel);
          });
        }
      })
      .listen(".chat-message-react", (e) => {
        this.props.incomingChatMessageReaction({ ...e, user_name: e.name, slug: this.state.slug });
      })
      .listen(".updated-notification-counter", (e) => {
        if (e.entity_group_type === "CHAT") {
          let workspace = Object.values(this.props.workspaces).find((ws) => {
            return ws.is_favourite && (ws.channel.id === parseInt(e.entity_id) || (ws.team_channel && ws.team_channel.id === parseInt(e.entity_id)));
          });
          if (workspace) {
            let payload = {};
            if (this.props.sharedSlug) {
              payload = {
                ...payload,
                sharedPayload: { slug: this.state.slug, token: this.props.sharedWorkspaces[this.state.slug].access_token, is_shared: true },
              };
            }
            //this.props.getFavoriteWorkspaceCounters(payload);
          }
        }
        this.props.setUnreadNotificationCounterEntries(e);
      })
      .listen(".internal-lock-shared-workspace", (e) => {
        // if (e.type === "WORKSPACE" && !e.members.some((m) => m.external_id === this.state.userId)) {
        //   return;
        // }
        // if (e.topic !== undefined) {
        //   if (e.workspace !== null) {
        //     if (!this.props.folders.hasOwnProperty(e.workspace.id)) {
        //       this.props.getWorkspaceFolder({ folder_id: e.workspace.id }, (err, res) => {
        //         if (err) return;
        //         this.props.incomingWorkspace({
        //           ...e,
        //           channel: {
        //             id: e.channel.id ? e.channel.id : 0,
        //             code: e.channel.code ? e.channel.code : null,
        //           },
        //           slug: e.topic.is_shared_wp ? e.topic.slug_owner : this.state.slug,
        //           sharedSlug: e.topic.is_shared_wp,
        //         });
        //       });
        //     } else {
        //       this.props.incomingWorkspace({
        //         ...e,
        //         channel: {
        //           id: e.channel.id ? e.channel.id : 0,
        //           code: e.channel.code ? e.channel.code : null,
        //         },
        //         slug: e.topic.is_shared_wp ? e.topic.slug_owner : this.state.slug,
        //         sharedSlug: e.topic.is_shared_wp,
        //       });
        //     }
        //   } else {
        //     this.props.getSharedWorkspaces({}, (err, res) => {
        //       if (err) return;
        //       sessionService.loadSession().then((current) => {
        //         sessionService.saveSession({ ...current, sharedWorkspaces: res.data });
        //       });
        //       if (this.props.user.sharedWorkspaces) {
        //         //check for new sharedWorkspaces
        //         let newSharedWs = Object.keys(res.data).filter((driff) => {
        //           if (Object.keys(this.props.user.sharedWorkspaces).some((k) => k === driff)) {
        //             return false;
        //           } else {
        //             return true;
        //           }
        //         });
        //         if (newSharedWs.length) {
        //           this.props.incomingWorkspace({
        //             ...e,
        //             channel: {
        //               id: e.channel.id ? e.channel.id : 0,
        //               code: e.channel.code ? e.channel.code : null,
        //             },
        //             slug: e.topic.is_shared_wp ? e.topic.slug_owner : this.state.slug,
        //             sharedSlug: e.topic.is_shared_wp,
        //           });
        //         } else {
        //           sessionService.saveUser({ ...this.props.user, sharedWorkspaces: res.data });
        //         }
        //       } else {
        //         sessionService.saveUser({ ...this.props.user, sharedWorkspaces: res.data });
        //       }
        //     });
        //   }
        //   if (e.channel.code && !e.topic.is_shared_wp) {
        //     this.props.getChannel({ code: e.channel.code }, (err, res) => {
        //       if (err) return;
        //       let channel = {
        //         ...res.data,
        //         hasMore: true,
        //         skip: 0,
        //         replies: [],
        //         selected: true,
        //         isFetching: false,
        //       };
        //       this.props.addToChannels(channel);
        //     });
        //   } else if (e.team_channel.code && !e.topic.is_shared_wp) {
        //     this.props.getChannel({ code: e.team_channel.code }, (err, res) => {
        //       if (err) return;
        //       let channel = {
        //         ...res.data,
        //         hasMore: true,
        //         skip: 0,
        //         replies: [],
        //         selected: true,
        //         isFetching: false,
        //       };
        //       this.props.addToChannels(channel);
        //     });
        //   }
        // } else {
        //   this.props.incomingWorkspaceFolder({
        //     ...e.workspace,
        //     key_id: e.key_id,
        //     type: e.type,
        //   });
        // }
        this.props.getSharedWorkspaces({}, (err, res) => {
          if (err) return;
          let myToken = `Bearer ${res.data[e.topic.slug_owner].access_token}`;
          let accessBroadcastToken = res.data[e.topic.slug_owner].access_broadcast_token;
          let host = process.env.REACT_APP_socketAddress;
          if (!window.io) window.io = require("socket.io-client");
          if (window.Echo && !window.Echo[e.topic.slug_owner]) {
            window.Echo[e.topic.slug_owner] = new Echo({
              broadcaster: "socket.io",
              host: host,
              auth: {
                headers: {
                  Authorization: myToken,
                  "Driff-Broadcast-Token": accessBroadcastToken,
                },
              },
            });
          }
          sessionService.loadSession().then((current) => {
            sessionService.saveSession({ ...current, sharedWorkspaces: res.data });
          });
          this.props.incomingWorkspace({
            ...e,
            channel: {
              id: e.channel.id ? e.channel.id : 0,
              code: e.channel.code ? e.channel.code : null,
            },
            slug: e.topic.slug_owner,
            sharedSlug: true,
          });
          this.props.getSharedChannels({ skip: 0, limit: 15, sharedPayload: { slug: e.topic.slug_owner, token: res.data[e.topic.slug_owner].access_token, is_shared: true } });
          this.props.getNotifications({ skip: 0, limit: 50, sharedPayload: { slug: e.topic.slug_owner, token: res.data[e.topic.slug_owner].access_token, is_shared: true } });
        });
      });
  }

  componentDidUpdate(prevProps, prevState) {
    this.props.useDriff.updateFaviconState(
      Object.keys(this.props.unreadCounter)
        .filter((k) => k !== "chat_reminder_message")
        .reduce((total, k) => {
          total += this.props.unreadCounter[k];
          return total;
        }, 0) !== 0 || this.props.todos.count.overdue !== 0
    );
  }

  render() {
    return null;
  }
}

function mapStateToProps({
  session: { user },
  settings: { userSettings },
  chat: { channels, selectedChannel, isLastChatVisible, lastReceivedMessage, jitsi },
  workspaces: { workspaces, workspacePosts, folders, activeTopic, workspacesLoaded, postComments, sharedWorkspaces },
  global: { unreadCounter, todos, recipients, isIdle, isBrowserActive },
  users: { mentions, users },
  posts: {
    companyPosts: { posts },
  },
}) {
  return {
    user,
    users,
    settings: userSettings,
    channels,
    selectedChannel,
    workspacePosts,
    folders,
    mentions,
    activeTopic,
    workspacesLoaded,
    workspaces,
    isLastChatVisible,
    lastReceivedMessage,
    unreadCounter,
    todos,
    recipients,
    postComments,
    isIdle,
    isBrowserActive,
    posts,
    jitsi,
    sharedWorkspaces,
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
    incomingChatMessage: bindActionCreators(incomingChatMessage, dispatch),
    addFilesToChannelAction: bindActionCreators(addFilesToChannel, dispatch),
    deleteFilesFromChannelAction: bindActionCreators(deleteFilesFromChannel, dispatch),
    generateUnfurl: bindActionCreators(generateUnfurl, dispatch),
    setChannel: bindActionCreators(setChannel, dispatch),
    incomingArchivedChannel: bindActionCreators(incomingArchivedChannel, dispatch),
    incomingChatMessageReaction: bindActionCreators(incomingChatMessageReaction, dispatch),
    incomingUpdatedChatMessage: bindActionCreators(incomingUpdatedChatMessage, dispatch),
    incomingDeletedChatMessage: bindActionCreators(incomingDeletedChatMessage, dispatch),
    incomingUpdatedChannelDetail: bindActionCreators(incomingUpdatedChannelDetail, dispatch),
    getChannelMembers: bindActionCreators(getChannelMembers, dispatch),
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
    incomingRemovedFile: bindActionCreators(incomingRemovedFile, dispatch),
    incomingRemovedFolder: bindActionCreators(incomingRemovedFolder, dispatch),
    getWorkspace: bindActionCreators(getWorkspace, dispatch),
    setSelectedChannel: bindActionCreators(setSelectedChannel, dispatch),
    incomingArchivedWorkspaceChannel: bindActionCreators(incomingArchivedWorkspaceChannel, dispatch),
    incomingUnArchivedWorkspaceChannel: bindActionCreators(incomingUnArchivedWorkspaceChannel, dispatch),
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
    incomingReminderNotification: bindActionCreators(incomingReminderNotification, dispatch),
    getLatestReply: bindActionCreators(getLatestReply, dispatch),
    incomingPostRecipients: bindActionCreators(incomingPostRecipients, dispatch),
    refetchPosts: bindActionCreators(refetchPosts, dispatch),
    refetchPostComments: bindActionCreators(refetchPostComments, dispatch),
    getUnreadNotificationCounterEntries: bindActionCreators(getUnreadNotificationCounterEntries, dispatch),
    incomingImportantComment: bindActionCreators(incomingImportantComment, dispatch),
    incomingImportantChat: bindActionCreators(incomingImportantChat, dispatch),
    incomingReadSelectedPosts: bindActionCreators(incomingReadSelectedPosts, dispatch),
    incomingArchivedSelectedPosts: bindActionCreators(incomingArchivedSelectedPosts, dispatch),
    getUnreadWorkspacePostEntries: bindActionCreators(getUnreadWorkspacePostEntries, dispatch),
    updateWorkspacePostCount: bindActionCreators(updateWorkspacePostCount, dispatch),
    incomingPostApproval: bindActionCreators(incomingPostApproval, dispatch),
    incomingCommentApproval: bindActionCreators(incomingCommentApproval, dispatch),
    incomingArchivedUser: bindActionCreators(incomingArchivedUser, dispatch),
    incomingUnarchivedUser: bindActionCreators(incomingUnarchivedUser, dispatch),
    incomingDeactivatedUser: bindActionCreators(incomingDeactivatedUser, dispatch),
    incomingActivatedUser: bindActionCreators(incomingActivatedUser, dispatch),
    incomingHuddleBot: bindActionCreators(incomingHuddleBot, dispatch),
    incomingUpdatedHuddleBot: bindActionCreators(incomingUpdatedHuddleBot, dispatch),
    incomingDeletedHuddleBot: bindActionCreators(incomingDeletedHuddleBot, dispatch),
    incomingHuddleAnswers: bindActionCreators(incomingHuddleAnswers, dispatch),
    clearUnpublishedAnswer: bindActionCreators(clearUnpublishedAnswer, dispatch),
    incomingClosePost: bindActionCreators(incomingClosePost, dispatch),
    incomingHuddleSkip: bindActionCreators(incomingHuddleSkip, dispatch),
    incomingOnlineUsers: bindActionCreators(incomingOnlineUsers, dispatch),
    incomingUpdatedAnnouncement: bindActionCreators(incomingUpdatedAnnouncement, dispatch),
    incomingCreatedAnnouncement: bindActionCreators(incomingCreatedAnnouncement, dispatch),
    incomingDeletedAnnouncement: bindActionCreators(incomingDeletedAnnouncement, dispatch),
    getPostList: bindActionCreators(getPostList, dispatch),
    incomingPostListConnect: bindActionCreators(incomingPostListConnect, dispatch),
    incomingPostListDisconnect: bindActionCreators(incomingPostListDisconnect, dispatch),
    incomingPostRequired: bindActionCreators(incomingPostRequired, dispatch),
    incomingTeamChannel: bindActionCreators(incomingTeamChannel, dispatch),
    incomingRemoveFileAfterDownload: bindActionCreators(incomingRemoveFileAfterDownload, dispatch),
    incomingRemoveFileAutomatically: bindActionCreators(incomingRemoveFileAutomatically, dispatch),
    incomingFavouriteWorkspace: bindActionCreators(incomingFavouriteWorkspace, dispatch),
    getFavoriteWorkspaceCounters: bindActionCreators(getFavoriteWorkspaceCounters, dispatch),
    getToDoDetail: bindActionCreators(getToDoDetail, dispatch),
    setActiveTopic: bindActionCreators(setActiveTopic, dispatch),
    incomingDeletedUser: bindActionCreators(incomingDeletedUser, dispatch),
    incomingFollowPost: bindActionCreators(incomingFollowPost, dispatch),
    incomingUnfollowPost: bindActionCreators(incomingUnfollowPost, dispatch),
    incomingAcceptedInternal: bindActionCreators(incomingAcceptedInternal, dispatch),
    incomingZoomData: bindActionCreators(incomingZoomData, dispatch),
    transferChannelMessages: bindActionCreators(transferChannelMessages, dispatch),
    getNotifications: bindActionCreators(getNotifications, dispatch),
    incomingSnoozedNotification: bindActionCreators(incomingSnoozedNotification, dispatch),
    incomingSnoozedAllNotification: bindActionCreators(incomingSnoozedAllNotification, dispatch),
    removeNotificationReducer: bindActionCreators(removeNotificationReducer, dispatch),
    setNewDriffData: bindActionCreators(setNewDriffData, dispatch),
    incomingReadNotifications: bindActionCreators(incomingReadNotifications, dispatch),
    incomingUpdatedSubscription: bindActionCreators(incomingUpdatedSubscription, dispatch),
    incomingUpdatedCompanyLogo: bindActionCreators(incomingUpdatedCompanyLogo, dispatch),
    getWorkspaceAndSetToFavorites: bindActionCreators(getWorkspaceAndSetToFavorites, dispatch),
    incomingDriveLink: bindActionCreators(incomingDriveLink, dispatch),
    incomingDeletedDriveLink: bindActionCreators(incomingDeletedDriveLink, dispatch),
    incomingUpdatedDriveLink: bindActionCreators(incomingUpdatedDriveLink, dispatch),
    incomingTeam: bindActionCreators(incomingTeam, dispatch),
    incomingUpdatedTeam: bindActionCreators(incomingUpdatedTeam, dispatch),
    incomingDeletedTeam: bindActionCreators(incomingDeletedTeam, dispatch),
    incomingTeamMember: bindActionCreators(incomingTeamMember, dispatch),
    incomingRemovedTeamMember: bindActionCreators(incomingRemovedTeamMember, dispatch),
    getAllWorkspaceFolders: bindActionCreators(getAllWorkspaceFolders, dispatch),
    removeWorkspaceChannel: bindActionCreators(removeWorkspaceChannel, dispatch),
    removeWorkspaceChannelMembers: bindActionCreators(removeWorkspaceChannelMembers, dispatch),
    incomingWorkpaceNotificationStatus: bindActionCreators(incomingWorkpaceNotificationStatus, dispatch),
    incomingZoomCreate: bindActionCreators(incomingZoomCreate, dispatch),
    incomingZoomUserLeft: bindActionCreators(incomingZoomUserLeft, dispatch),
    incomingZoomEnded: bindActionCreators(incomingZoomEnded, dispatch),
    incomingWIP: bindActionCreators(incomingWIP, dispatch),
    incomingWIPSubject: bindActionCreators(incomingWIPSubject, dispatch),
    incomingWIPComment: bindActionCreators(incomingWIPComment, dispatch),
    incomingWIPFileComment: bindActionCreators(incomingWIPFileComment, dispatch),
    incomingReplacedWIPFile: bindActionCreators(incomingReplacedWIPFile, dispatch),
    incomingNewFileVersion: bindActionCreators(incomingNewFileVersion, dispatch),
    incomingUpdatedWIPFileComment: bindActionCreators(incomingUpdatedWIPFileComment, dispatch),
    incomingClosedFileComments: bindActionCreators(incomingClosedFileComments, dispatch),
    incomingApprovedFileVersion: bindActionCreators(incomingApprovedFileVersion, dispatch),
    incomingUpdatedWIPComment: bindActionCreators(incomingUpdatedWIPComment, dispatch),
    incomingProposalClap: bindActionCreators(incomingProposalClap, dispatch),
    incomingPostAccess: bindActionCreators(incomingPostAccess, dispatch),
    getPostAccess: bindActionCreators(getPostAccess, dispatch),
    updateUnreadCounter: bindActionCreators(updateUnreadCounter, dispatch),
    updateSecuritySettings: bindActionCreators(updateSecuritySettings, dispatch),
    incomingCompanyDescription: bindActionCreators(incomingCompanyDescription, dispatch),
    incomingCompanyDashboardBackground: bindActionCreators(incomingCompanyDashboardBackground, dispatch),
    updatePostCategoryCount: bindActionCreators(updatePostCategoryCount, dispatch),
    incomingLoginSettings: bindActionCreators(incomingLoginSettings, dispatch),
    incomingWorkspacePost: bindActionCreators(incomingWorkspacePost, dispatch),
    incomingUpdatedWorkspaceQuickLinks: bindActionCreators(incomingUpdatedWorkspaceQuickLinks, dispatch),
    incomingMeetingSettings: bindActionCreators(incomingMeetingSettings, dispatch),
    incomingJitsiEnded: bindActionCreators(incomingJitsiEnded, dispatch),
    incomingFaviconImage: bindActionCreators(incomingFaviconImage, dispatch),
    incomingAcceptedSharedUser: bindActionCreators(incomingAcceptedSharedUser, dispatch),
    getSharedWorkspaces: bindActionCreators(getSharedWorkspaces, dispatch),
    getWorkspaces: bindActionCreators(getWorkspaces, dispatch),
    getSharedChannels: bindActionCreators(getSharedChannels, dispatch),
    removeChannel: bindActionCreators(removeChannel, dispatch),
    removeWorkspace: bindActionCreators(removeWorkspace, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SocketListeners));
