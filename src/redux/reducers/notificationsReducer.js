import { convertArrayToObject } from "../../helpers/arrayHelper";
import { getCurrentTimestamp } from "../../helpers/dateFormatter";

const INITIAL_STATE = {
  user: null,
  notifications: {},
  unreadCount: 0,
  hasSubscribed: true,
  is_snooze: false,
  snooze_time: getCurrentTimestamp(),
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "ADD_USER_TO_REDUCERS": {
      return {
        ...state,
        user: action.data,
      };
    }
    case "GET_NOTIFICATIONS_SUCCESS": {
      let results = action.data.notifications;
      results = results.map((obj) => ({ ...obj, is_snooze: state.notifications[obj.id] ? state.notifications[obj.id].is_snooze : false, snooze_time: state.notifications[obj.id] ? state.notifications[obj.id].snooze_time : null }));
      return {
        ...state,
        notifications: {
          ...state.notifications,
          ...convertArrayToObject(results, "id"),
        },
        unreadCount: state.unreadCount + results.filter((n) => n.is_read === 0).length,
      };
    }
    case "READ_ALL_NOTIFICATION_REDUCER": {
      // let updatedNotifications = { ...state.notifications };
      // Object.values(updatedNotifications).forEach((n) => {
      //   updatedNotifications[n.id].is_read = 1;
      //   if (updatedNotifications[n.data.id].type === "POST_MENTION") {
      //     updatedNotifications[n.id].is_snooze = false;
      //     updatedNotifications[n.id].snooze_time = getCurrentTimestamp();
      //   }
      // });
      return {
        ...state,
        notifications: Object.values(state.notifications).reduce((acc, notif) => {
          if (notif.type === "POST_MENTION") {
            acc[notif.id] = { ...notif, is_read: 1, is_snooze: false, snooze_time: getCurrentTimestamp() };
          } else {
            acc[notif.id] = { ...notif, is_read: 1 };
          }
          return acc;
        }, {}),
        unreadCount: 0,
      };
    }
    case "READ_NOTIFICATION_REDUCER": {
      let updatedNotifications = { ...state.notifications };
      updatedNotifications[action.data.id].is_read = 1;
      if (updatedNotifications[action.data.id].type === "POST_MENTION") {
        updatedNotifications[action.data.id].is_snooze = false;
        updatedNotifications[action.data.id].snooze_time = getCurrentTimestamp();
      }
      return {
        ...state,
        notifications: updatedNotifications,
        unreadCount: state.unreadCount - 1,
      };
    }
    case "UNREAD_NOTIFICATION_REDUCER": {
      let updatedNotifications = { ...state.notifications };
      updatedNotifications[action.data.id].is_read = 0;
      if (updatedNotifications[action.data.id].type === "POST_MENTION") {
        updatedNotifications[action.data.id].is_snooze = false;
        updatedNotifications[action.data.id].snooze_time = getCurrentTimestamp();
      }
      return {
        ...state,
        notifications: updatedNotifications,
        unreadCount: state.unreadCount + 1,
      };
    }
    case "REMOVE_NOTIFICATION_REDUCER": {
      let updatedNotifications = { ...state.notifications };
      delete updatedNotifications[action.data.id];
      return {
        ...state,
        notifications: updatedNotifications,
      };
    }
    case "REMOVE_ALL_NOTIFICATION_REDUCER": {
      return {
        ...state,
        notifications: {},
      };
    }
    case "INCOMING_POST_APPROVAL": {
      if (action.data.user_approved && state.user && state.user.id !== action.data.user_approved.id) {
        return {
          ...state,
          notifications: {
            ...Object.values(state.notifications).reduce((acc, notif) => {
              if ((notif.type === "POST_REQST_APPROVAL" || notif.type === "POST_REJECT_APPROVAL") && action.data.post.id === notif.data.post_id) {
                acc[notif.id] = {
                  ...notif,
                  data: {
                    ...notif.data,
                    users_approval: action.data.users_approval,
                  },
                };
              } else {
                acc[notif.id] = { ...notif };
              }
              return acc;
            }, {}),
            ...(action.data.notification_approval && {
              [action.data.notification_approval.id]: {
                id: action.data.notification_approval.id,
                type: action.data.notification_approval.type,
                is_read: 0,
                is_snooze: false,
                snooze_time: null,
                created_at: action.data.created_at ? action.data.created_at : action.data.user_approved.updated_at,
                author: action.data.user_approved,
                data: {
                  post_id: action.data.post.id,
                  type: "POST",
                  must_read: false,
                  must_reply: false,
                  personalized_for_id: null,
                  title: action.data.post.title,
                  users_approval: action.data.users_approval,
                  post_approval_label: action.data.notification_approval.type === "POST_REJECT_APPROVAL" ? "REQUEST_UPDATE" : "", //need post author - should only show to post author
                  workspaces: action.data.workspaces.map((ws) => {
                    return {
                      topic_id: ws.topic.id,
                      topic_name: ws.topic.name,
                      workspace_id: ws.workspace ? ws.workspace.id : null,
                      workspace_name: ws.workspace ? ws.workspace.name : null,
                    };
                  }),
                  comment_body: null,
                },
              },
            }),
          },
        };
      } else if (action.data.user_approved && state.user && state.user.id === action.data.user_approved.id) {
        return {
          ...state,
          notifications: {
            ...Object.values(state.notifications).reduce((acc, notif) => {
              if ((notif.type === "POST_REQST_APPROVAL" || notif.type === "POST_REJECT_APPROVAL") && action.data.post.id === notif.data.post_id) {
                acc[notif.id] = {
                  ...notif,
                  data: {
                    ...notif.data,
                    post_approval_label: "",
                    users_approval: action.data.users_approval,
                  },
                };
              } else {
                acc[notif.id] = { ...notif };
              }
              return acc;
            }, {}),
          },
        };
      } else {
        return state;
      }
    }
    case "INCOMING_COMMENT_APPROVAL": {
      return {
        ...state,
        notifications: {
          ...state.notifications,
          // ...(action.data.notification_approval &&
          //   action.data.user_approved.id !== state.user.id && {
          //     [action.data.notification_approval.id]: {
          //       id: action.data.notification_approval.id,
          //       type: action.data.notification_approval.type,
          //       is_read: 0,
          //       is_snooze: false,
          //       snooze_time: null,
          //       created_at: action.data.created_at,
          //       author: action.data.user_approved,
          //       data: {
          //         post_id: action.data.post.id,
          //         type: "POST",
          //         must_read: false,
          //         must_reply: false,
          //         personalized_for_id: null,
          //         title: action.data.post.title,
          //         users_approval: action.data.users_approval,
          //         post_approval_label: "REQUEST_UPDATE", //should show to user who sent the comment approval
          //         workspaces: action.data.workspaces.map((ws) => {
          //           return {
          //             topic_id: ws.topic.id,
          //             topic_name: ws.topic.name,
          //             workspace_id: ws.workspace ? ws.workspace.id : null,
          //             workspace_name: ws.workspace ? ws.workspace.name : null,
          //           };
          //         }),
          //         comment_body: null,
          //       },
          //     },
          //   }),
          ...Object.values(state.notifications).reduce((acc, notif) => {
            if (notif.type === "POST_COMMENT" && action.data.post.id === notif.data.post_id && action.data.user_approved.id === state.user.id && action.data.users_approval.some((u) => u.ip_address !== null && u.id === state.user.id)) {
              acc[notif.id] = {
                ...notif,
                data: {
                  ...notif.data,
                  users_approval: action.data.users_approval,
                  post_approval_label: "",
                },
              };
            } else {
              acc[notif.id] = notif;
            }
            return acc;
          }, {}),
        },
      };
    }
    case "INCOMING_POST": {
      return {
        ...state,
        notifications: {
          ...state.notifications,
          ...(action.data.notification &&
            action.data.author.id !== state.user.id && {
              [action.data.notification.id]: {
                id: action.data.notification.id,
                type: "POST_CREATE",
                is_read: 0,
                is_snooze: false,
                snooze_time: null,
                created_at: action.data.created_at,
                author: action.data.author,
                data: {
                  post_id: action.data.id,
                  type: action.data.type,
                  must_read: action.data.is_must_read,
                  must_reply: action.data.is_must_reply,
                  personalized_for_id: action.data.personalized_for_id,
                  title: action.data.title,
                  workspaces: action.data.workspaces,
                  comment_body: null,
                  required_users: action.data.required_users,
                  must_read_users: action.data.must_read_users,
                  must_reply_users: action.data.must_reply_users,
                },
              },
            }),
          ...(action.data.notification_approval &&
            action.data.author.id !== state.user.id && {
              [action.data.notification_approval.id]: {
                id: action.data.notification_approval.id,
                type: action.data.notification_approval.type,
                is_read: 0,
                is_snooze: false,
                snooze_time: null,
                created_at: action.data.created_at,
                author: action.data.author,
                data: {
                  post_id: action.data.id,
                  type: action.data.type,
                  must_read: action.data.is_must_read,
                  must_reply: action.data.is_must_reply,
                  personalized_for_id: action.data.personalized_for_id,
                  title: action.data.title,
                  workspaces: action.data.workspaces,
                  comment_body: null,
                  users_approval: action.data.users_approval,
                  required_users: action.data.required_users,
                  must_read_users: action.data.must_read_users,
                  must_reply_users: action.data.must_reply_users,
                },
              },
            }),
        },
      };
    }
    case "INCOMING_COMMENT": {
      return {
        ...state,
        notifications: {
          ...state.notifications,
          ...(action.data.author.id !== state.user.id &&
            action.data.notification && {
              [action.data.notification.id]: {
                id: action.data.notification.id,
                type: action.data.notification.type,
                is_read: 0,
                is_snooze: false,
                snooze_time: null,
                created_at: action.data.created_at,
                author: action.data.author,
                data: {
                  post_id: action.data.post_id,
                  type: "TOPIC_POST",
                  must_read: 0,
                  must_reply: 0,
                  personalized_for_id: action.data.personalized_for_id,
                  title: action.data.post_title,
                  workspaces: action.data.workspaces,
                  comment_body: action.data.body,
                  comment_id: action.data.id,
                  users_approval: action.data.users_approval,
                  post_approval_label: action.data.users_approval.length > 0 && action.data.users_approval.every((u) => u.ip_address === null) ? "NEED_ACTION" : "",
                },
              },
            }),
          ...Object.values(state.notifications).reduce((acc, notif) => {
            if (
              (notif.type === "POST_REJECT_APPROVAL" || notif.type === "PST_CMT_REJCT_APPRVL") &&
              action.data.post_id === notif.data.post_id &&
              action.data.users_approval &&
              action.data.users_approval.every((u) => u.ip_address === null)
            ) {
              acc[notif.id] = {
                ...notif,
                data: {
                  ...notif.data,
                  users_approval: action.data.users_approval,
                  post_approval_label: "",
                },
              };
            } else {
              acc[notif.id] = notif;
            }
            return acc;
          }, {}),
        },
      };
    }
    case "SET_PUSH_NOTIFICATION": {
      return {
        ...state,
        hasSubscribed: action.data,
      };
    }
    case "INCOMING_REMINDER_NOTIFICATION": {
      if (action.data.notification) {
        let reminderNotification = {
          ...action.data.notification,
          is_read: 0,
          is_snooze: false,
          snooze_time: null,
          author: null,
          created_at: action.data.created_at,
          data: {
            id: action.data.id,
            title: action.data.title,
            description: action.data.description,
            created_at: action.data.created_at,
            remind_at: action.data.remind_at,
          },
        };
        return {
          ...state,
          notifications: { ...state.notifications, [reminderNotification.id]: reminderNotification },
        };
      } else {
        return state;
      }
    }
    case "INCOMING_CLOSE_POST": {
      if (action.data.notification) {
        let postNotification = {
          ...action.data.notification,
          is_read: 0,
          is_snooze: false,
          snooze_time: null,
          author: action.data.initiator,
          created_at: { timestamp: Math.round(+new Date() / 1000) },
          data: {
            post_id: action.data.post.id,
            title: action.data.post.title,
            description: "",
            created_at: { timestamp: Math.round(+new Date() / 1000) },
            workspaces: action.data.workspaces.map((ws) => {
              return {
                topic_id: ws.topic.id,
                topic_name: ws.topic.name,
                workspace_id: ws.workspace ? ws.workspace.id : null,
                workspace_name: ws.workspace ? ws.workspace.name : null,
              };
            }),
          },
        };
        return {
          ...state,
          notifications: { ...state.notifications, [postNotification.id]: postNotification },
        };
      } else {
        return state;
      }
    }
    case "INCOMING_UPDATED_WORKSPACE_FOLDER": {
      if (action.data.type === "WORKSPACE" && state.user && state.user.id !== action.data.user_id && action.data.new_member_ids.some((id) => id === state.user.id)) {
        let author = action.data.members.find((m) => m.id === action.data.user_id);
        return {
          ...state,
          notifications: {
            ...state.notifications,
            [action.data.notification_id[0]]: {
              author: author,
              created_at: { timestamp: getCurrentTimestamp() },
              data: {
                description: action.data.description,
                id: action.data.id,
                title: action.data.name,
                workspace_folder_id: action.data.workspace_id,
                workspace_folder_name: action.data.current_workspace_folder_name,
              },
              id: action.data.notification_id[0],
              is_read: 0,
              is_snooze: false,
              snooze_time: null,
              type: "WORKSPACE_ADD_MEMBER",
            },
          },
        };
      } else {
        return state;
      }
    }
    case "INCOMING_WORKSPACE": {
      if (state.user && state.user.id === action.data.channel.user_id) return state;
      let author = action.data.members.find((m) => m.id === action.data.channel.user_id);

      return {
        ...state,
        notifications: {
          ...state.notifications,
          [action.data.notification_id[0]]: {
            author: author,
            created_at: { timestamp: getCurrentTimestamp() },
            data: {
              description: action.data.topic.description,
              id: action.data.topic.id,
              title: action.data.topic.name,
              workspace_folder_id: action.data.workspace ? action.data.workspace.id : 0,
              workspace_folder_name: action.data.workspace ? action.data.workspace.name : "",
            },
            id: action.data.notification_id[0],
            is_read: 0,
            is_snooze: false,
            snooze_time: null,
            type: "WORKSPACE_ADD_MEMBER",
          },
        },
      };
    }
    case "INCOMING_POST_REQUIRED": {
      return {
        ...state,
        notifications: Object.values(state.notifications).reduce((acc, notif) => {
          if (notif.type === "POST_CREATE" && action.data.post.id === notif.data.post_id) {
            acc[notif.id] = {
              ...notif,
              data: {
                ...notif.data,
                required_users: action.data.required_users,
                must_read_users: action.data.must_read_users,
                must_reply_users: action.data.must_reply_users,
              },
            };
          } else {
            acc[notif.id] = { ...notif };
          }
          return acc;
        }, {}),
      };
    }
    case "NOTIFICATION_SNOOZE_ALL": {
      let notifications = { ...state.notifications };
      Object.values(notifications).forEach((n) => {
        notifications[n.id].is_snooze = action.data.is_snooze;
        notifications[n.id].snooze_time = action.data.snooze_time;
      });
      return {
        ...state,
        notifications: notifications,
      };
    }
    case "NOTIFICATION_SNOOZE": {
      let notifications = { ...state.notifications };
      notifications[action.data.id].is_snooze = action.data.is_snooze;
      notifications[action.data.id].snooze_time = action.data.snooze_time;
      return {
        ...state,
        notifications: notifications,
      };
    }
    case "INCOMING_UPDATED_POST": {
      return {
        ...state,
        notifications: Object.values(state.notifications).reduce((acc, notif) => {
          if (notif.type === "POST_CREATE" && action.data.id === notif.data.post_id && action.data.users_approval.length) {
            acc[notif.id] = { ...notif, type: "POST_REQST_APPROVAL", data: { ...notif.data, users_approval: action.data.users_approval } };
          } else if (notif.type === "POST_CREATE" && action.data.id === notif.data.post_id) {
            acc[notif.id] = {
              ...notif,
              data: { ...notif.data, must_read: action.data.is_must_read ? 1 : 0, must_read_users: action.data.must_read_users, must_reply: action.data.is_must_reply ? 1 : 0, must_reply_users: action.data.must_reply_users },
            };
          } else {
            acc[notif.id] = notif;
          }
          return acc;
        }, {})
      }
    }
    case "INCOMING_DELETED_POST": {
      return {
        ...state,
        notifications: Object.values(state.notifications).filter((notif) => {
          if (notif.type.includes("POST")) {
            return notif.data && notif.data.post_id !== action.data.post_id
          } else {
            return true
          }
        }).reduce((acc, notif) => {
          acc[notif.id] = notif;
          return acc;
        }, {}),
      };
    }
    default:
      return state;
  }
};
