import { convertArrayToObject } from "../../helpers/arrayHelper";
import { getCurrentTimestamp, convertUTCDateToLocalDate } from "../../helpers/dateFormatter";

const INITIAL_STATE = {
  user: null,
  notifications: {},
  unreadCount: 0,
  hasSubscribed: true,
  is_snooze: false,
  snooze_time: getCurrentTimestamp(),
  snoozedNotifications: [],
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
      let results = action.data.notifications.map((obj) => {
        let key = `${obj.id}-${action.slug}`;
        const snoozedNotif = state.snoozedNotifications.find((sn) => sn.key === key && sn.type && sn.type === "POST_SNOOZE");
        return {
          ...obj,
          is_snooze: snoozedNotif ? !!snoozedNotif.is_snooze : state.notifications[key] ? state.notifications[key].is_snooze : false,
          snooze_time: snoozedNotif ? snoozedNotif.snooze_time : state.notifications[key] ? state.notifications[key].snooze_time : null,
          key: `${obj.id}-${action.slug}`,
          slug: action.slug,
          sharedSlug: action.isSharedSlug,
        };
      });
      return {
        ...state,
        notifications: {
          ...state.notifications,
          ...convertArrayToObject(results, "key"),
        },
        unreadCount: state.unreadCount + results.filter((n) => n.is_read === 0).length,
      };
    }
    case "READ_ALL_NOTIFICATION_REDUCER": {
      return {
        ...state,
        notifications: Object.keys(state.notifications).reduce((acc, notifKey) => {
          const notif = state.notifications[notifKey];
          if (notif.type === "POST_MENTION") {
            acc[notifKey] = { ...notif, is_read: 1, is_snooze: false, snooze_time: getCurrentTimestamp() };
          } else {
            acc[notifKey] = { ...notif, is_read: 1 };
          }
          return acc;
        }, {}),
        unreadCount: 0,
      };
    }
    case "READ_NOTIFICATION_REDUCER": {
      let updatedNotifications = { ...state.notifications };
      updatedNotifications[action.data.key].is_read = 1;
      if (updatedNotifications[action.data.key].type === "POST_MENTION") {
        updatedNotifications[action.data.key].is_snooze = false;
        updatedNotifications[action.data.key].snooze_time = getCurrentTimestamp();
      }
      return {
        ...state,
        notifications: updatedNotifications,
        unreadCount: state.unreadCount - 1,
      };
    }
    case "UNREAD_NOTIFICATION_REDUCER": {
      let updatedNotifications = { ...state.notifications };
      updatedNotifications[action.data.key].is_read = 0;
      if (updatedNotifications[action.data.key].type === "POST_MENTION") {
        updatedNotifications[action.data.key].is_snooze = false;
        updatedNotifications[action.data.key].snooze_time = getCurrentTimestamp();
      }
      return {
        ...state,
        notifications: updatedNotifications,
        unreadCount: state.unreadCount + 1,
      };
    }
    case "REMOVE_NOTIFICATION_REDUCER": {
      let updatedNotifications = { ...state.notifications };
      delete updatedNotifications[action.data.key];
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
      if (action.data.user_approved && state.user && action.data.userId !== action.data.user_approved.id) {
        return {
          ...state,
          notifications: {
            ...Object.values(state.notifications).reduce((acc, notif) => {
              if ((notif.type === "POST_REQST_APPROVAL" || notif.type === "POST_REJECT_APPROVAL") && action.data.post.id === notif.data.post_id && action.data.slug === notif.slug) {
                acc[notif.key] = {
                  ...notif,
                  data: {
                    ...notif.data,
                    users_approval: action.data.users_approval,
                  },
                };
              } else {
                acc[notif.key] = { ...notif };
              }
              return acc;
            }, {}),
            ...(action.data.notification_approval && {
              [`${action.data.notification_approval.id}-${action.data.slug}`]: {
                key: `${action.data.notification_approval.id}-${action.data.slug}`,
                id: action.data.notification_approval.id,
                type: action.data.notification_approval.type,
                is_read: 0,
                is_snooze: false,
                snooze_time: null,
                created_at: action.data.created_at ? action.data.created_at : action.data.user_approved.updated_at,
                author: action.data.user_approved,
                sharedSlug: action.data.sharedSlug,
                slug: action.data.slug,
                data: {
                  post_id: action.data.post.id,
                  type: "POST",
                  must_read: false,
                  must_reply: false,
                  personalized_for_id: null,
                  title: action.data.post.title,
                  users_approval: action.data.users_approval,
                  //post_approval_label: "",
                  post_author: action.data.post_author ? action.data.post_author : null,
                  post_approval_label:
                    action.data.notification_approval.type === "POST_REJECT_APPROVAL" && action.data.users_approval.length === 1 && state.user && action.data.post_author && action.data.post_author.id === action.data.userId
                      ? "REQUEST_UPDATE"
                      : "",
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
      } else if (action.data.user_approved && state.user && action.data.userId === action.data.user_approved.id) {
        return {
          ...state,
          notifications: {
            ...Object.values(state.notifications).reduce((acc, notif) => {
              if ((notif.type === "POST_REQST_APPROVAL" || notif.type === "POST_REJECT_APPROVAL") && action.data.post.id === notif.data.post_id) {
                acc[notif.key] = {
                  ...notif,
                  sharedSlug: action.data.sharedSlug,
                  slug: action.data.slug,
                  data: {
                    ...notif.data,
                    post_approval_label: "",
                    users_approval: action.data.users_approval,
                  },
                };
              } else {
                acc[notif.key] = { ...notif };
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
            if (
              notif.type === "POST_COMMENT" &&
              action.data.post.id === notif.data.post_id &&
              action.data.user_approved.id === action.data.userId &&
              action.data.users_approval.some((u) => u.ip_address !== null && u.id === action.data.userId) &&
              action.data.slug === notif.slug
            ) {
              acc[notif.key] = {
                ...notif,
                sharedSlug: action.data.sharedSlug,
                slug: action.data.slug,
                data: {
                  ...notif.data,
                  users_approval: action.data.users_approval,
                  post_approval_label: "",
                },
              };
            } else {
              acc[notif.key] = notif;
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
            action.data.show_post &&
            action.data.author.id !== action.data.userId && {
              [`${action.data.notification.id}-${action.data.slug}`]: {
                key: `${action.data.notification.id}-${action.data.slug}`,
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
                  is_close: 0,
                },
                sharedSlug: action.data.sharedSlug,
                slug: action.data.slug,
              },
            }),
          ...(action.data.notification_approval &&
            action.data.author.id !== action.data.userId && {
              [`${action.data.notification_approval.id}-${action.data.slug}`]: {
                key: `${action.data.notification_approval.id}-${action.data.slug}`,
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
                  is_close: 0,
                },
                sharedSlug: action.data.sharedSlug,
                slug: action.data.slug,
              },
            }),
        },
      };
    }
    case "INCOMING_COMMENT": {
      const isNewComment = action.data.SOCKET_TYPE === "POST_COMMENT_CREATE";
      return {
        ...state,
        notifications: {
          ...state.notifications,
          ...(action.data.addToNotification &&
            isNewComment &&
            action.data.notification && {
              [`${action.data.notification.id}-${action.data.slug}`]: {
                key: `${action.data.notification.id}-${action.data.slug}`,
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
                sharedSlug: action.data.sharedSlug,
                slug: action.data.slug,
              },
            }),
          ...Object.values(state.notifications).reduce((acc, notif) => {
            if (
              (notif.type === "POST_REJECT_APPROVAL" || notif.type === "PST_CMT_REJCT_APPRVL") &&
              action.data.post_id === notif.data.post_id &&
              action.data.users_approval &&
              notif.slug === action.data.slug &&
              action.data.users_approval.every((u) => u.ip_address === null)
            ) {
              acc[notif.key] = {
                ...notif,
                data: {
                  ...notif.data,
                  users_approval: action.data.users_approval,
                  post_approval_label: "",
                },
              };
            } else {
              acc[notif.key] = notif;
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
          sharedSlug: action.data.sharedSlug,
          slug: action.data.slug,
          key: `${action.data.notification.id}-${action.data.slug}`,
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
          notifications: { ...state.notifications, [`${reminderNotification.id}-${reminderNotification.slug}`]: reminderNotification },
        };
      } else {
        return state;
      }
    }
    case "INCOMING_CLOSE_POST": {
      return {
        ...state,
        notifications: {
          ...Object.values(state.notifications).reduce((acc, n) => {
            if (["POST_CREATE", "POST_COMMENT", "POST_MENTION", "POST_REQST_APPROVAL", "POST_REJECT_APPROVAL", "PST_CMT_REJCT_APPRVL"].includes(n.type)) {
              if (n.data && n.data.post_id === action.data.post.id && n.slug === action.data.slug) {
                acc[n.key] = { ...n, data: { ...n.data, is_close: action.data.is_close ? 1 : 0 } };
              } else {
                acc[n.key] = n;
              }
            } else {
              acc[n.key] = n;
            }
            return acc;
          }, {}),
          ...(action.data.notification && {
            [`${action.data.notification.id}-${action.data.slug}`]: {
              ...action.data.notification,
              key: `${action.data.notification.id}-${action.data.slug}`,
              sharedSlug: action.data.sharedSlug,
              slug: action.data.slug,
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
            },
          }),
        },
      };
    }
    case "INCOMING_UPDATED_WORKSPACE_FOLDER": {
      if (action.data.addNotification) {
        let author = action.data.members.find((m) => m.id === action.data.user_id);
        return {
          ...state,
          notifications: {
            ...state.notifications,
            ...(action.data.notification_id.length && {
              [`${action.data.notification_id[0]}-${action.data.slug_owner}`]: {
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
                slug: action.data.slug_owner,
                sharedSlug: action.data.is_shared_wp,
                key: `${action.data.notification_id[0]}-${action.data.slug_owner}`,
              },
            }),
          },
        };
      } else {
        return state;
      }
    }
    case "INCOMING_WORKSPACE": {
      if (state.user && state.user.id === action.data.team_channel.user_id) return state;
      let author = action.data.members.find((m) => m.id === action.data.team_channel.user_id);

      return {
        ...state,
        notifications: {
          ...state.notifications,
          ...(action.data.notification_id.length && {
            [`${action.data.notification_id[0]}-${action.data.slug}`]: {
              key: `${action.data.notification_id[0]}-${action.data.slug}`,
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
              sharedSlug: action.data.sharedSlug,
              slug: action.data.slug,
            },
          }),
        },
      };
    }
    case "INCOMING_POST_REQUIRED": {
      return {
        ...state,
        notifications: Object.values(state.notifications).reduce((acc, notif) => {
          if (notif.type === "POST_CREATE" && action.data.post.id === notif.data.post_id && notif.slug === action.data.slug) {
            acc[notif.key] = {
              ...notif,
              sharedSlug: action.data.sharedSlug,
              slug: action.data.slug,
              data: {
                ...notif.data,
                required_users: action.data.required_users,
                must_read_users: action.data.must_read_users,
                must_reply_users: action.data.must_reply_users,
              },
            };
          } else {
            acc[notif.key] = { ...notif };
          }
          return acc;
        }, {}),
      };
    }
    case "NOTIFICATION_SNOOZE_ALL": {
      let notifications = { ...state.notifications };
      Object.values(notifications).forEach((n) => {
        notifications[n.key].is_snooze = action.data.is_snooze;
        notifications[n.key].snooze_time = action.data.snooze_time;
      });
      return {
        ...state,
        notifications: notifications,
      };
    }
    case "NOTIFICATION_SNOOZE": {
      let notifications = { ...state.notifications };
      if (state.notifications[action.data.key]) {
        notifications[action.data.key].is_snooze = action.data.is_snooze;
        notifications[action.data.key].snooze_time = action.data.snooze_time;
      }
      return {
        ...state,
        notifications: notifications,
      };
    }
    case "INCOMING_UPDATED_POST": {
      return {
        ...state,
        notifications: Object.values(state.notifications).reduce((acc, notif) => {
          if (notif.type === "POST_CREATE" && action.data.id === notif.data.post_id && action.data.users_approval.length && notif.slug === action.data.slug) {
            acc[notif.key] = { ...notif, type: "POST_REQST_APPROVAL", data: { ...notif.data, users_approval: action.data.users_approval } };
          } else if (notif.type === "POST_CREATE" && action.data.id === notif.data.post_id && notif.slug === action.data.slug) {
            acc[notif.key] = {
              ...notif,
              data: { ...notif.data, must_read: action.data.is_must_read ? 1 : 0, must_read_users: action.data.must_read_users, must_reply: action.data.is_must_reply ? 1 : 0, must_reply_users: action.data.must_reply_users },
            };
          } else {
            acc[notif.key] = notif;
          }
          return acc;
        }, {}),
      };
    }
    case "INCOMING_DELETED_POST": {
      return {
        ...state,
        notifications: Object.values(state.notifications)
          .filter((notif) => {
            if (notif.type.includes("POST")) {
              return notif.data && notif.data.post_id !== action.data.post_id && notif.slug === action.data.slug;
            } else {
              return true;
            }
          })
          .reduce((acc, notif) => {
            acc[notif.key] = notif;
            return acc;
          }, {}),
      };
    }
    case "GET_ALL_SNOOZED_NOTIFICATION_SUCCESS": {
      const regex = /\s|\/|-|:/g;
      return {
        ...state,
        snoozedNotifications: [
          ...state.snoozedNotifications,
          ...action.data.snoozed_notifications
            .filter((sn) => sn.type && sn.type === "POST_SNOOZE")
            .map((sn) => {
              const timeString = sn.snooze_time.replace(regex, ",");
              const timeSplit = timeString.split(",");
              const utcDate = new Date(parseInt(timeSplit[0]), parseInt(timeSplit[1]) - 1, parseInt(timeSplit[2]), parseInt(timeSplit[3]), parseInt(timeSplit[4]), parseInt(timeSplit[5]));
              const date = convertUTCDateToLocalDate(utcDate);
              return {
                ...sn,
                key: `${sn.notification_id}-${action.slug}`,
                slug: action.slug,
                sharedSlug: action.isSharedSlug,
                is_snooze: !!sn.is_snooze,
                snooze_time: Math.round(date / 1000),
              };
            }),
        ],
      };
    }
    case "INCOMING_SNOOZED_ALL_NOTIFICATION":
    case "SNOOZE_ALL_NOTIFICATION_SUCCESS": {
      return {
        ...state,
        snoozedNotifications: [
          ...state.snoozedNotifications,
          ...action.data.data.map((sn) => {
            return {
              ...sn,
              slug: action.slug ? action.slug : action.data.slug,
              sharedSlug: action.isSharedSlug ? action.isSharedSlug : action.data.sharedSlug,
              is_snooze: sn.is_snooze,
              snooze_time: getCurrentTimestamp(),
            };
          }),
        ],
        notifications: Object.values(state.notifications).reduce((acc, n) => {
          const notif = action.data.data.find((d) => d.notification_id === n.id && d.type === "POST_SNOOZE");
          if (notif) {
            acc[n.key] = { ...n, is_snooze: notif.is_snooze, snooze_time: getCurrentTimestamp() };
          } else {
            acc[n.key] = n;
          }
          return acc;
        }, {}),
      };
    }
    case "SNOOZE_NOTIFICATION_SUCCESS":
    case "INCOMING_SNOOZED_NOTIFICATION": {
      if (action.data.type === "POST_SNOOZE") {
        return {
          ...state,
          notifications: Object.values(state.notifications).reduce((acc, n) => {
            if (n.id === action.data.notification_id) {
              acc[n.key] = { ...n, is_snooze: action.data.is_snooze, snooze_time: getCurrentTimestamp() };
            } else {
              acc[n.key] = n;
            }
            return acc;
          }, {}),
          snoozedNotifications: state.snoozedNotifications.map((sn) => {
            if (sn.notification_id === action.data.notification_id) {
              return { ...sn, is_snooze: action.data.is_snooze, snooze_time: getCurrentTimestamp(), slug: action.slug ? action.slug : action.data.slug, sharedSlug: action.isSharedSlug ? action.isSharedSlug : action.data.sharedSlug };
            } else return sn;
          }),
        };
      } else {
        return state;
      }
    }
    case "READ_POST_NOTIFICATION_SUCCESS": {
      if (action.data.notification_id.length) {
        const notificationIds = action.data.notification_id.map((n) => n.id);
        return {
          ...state,
          notifications: Object.values(state.notifications).reduce((acc, n) => {
            if (notificationIds.some((id) => id === n.id) && action.slug === n.slug) {
              acc[n.key] = { ...n, is_read: 1 };
            } else {
              acc[n.key] = n;
            }
            return acc;
          }, {}),
        };
      } else {
        return state;
      }
    }
    case "INCOMING_READ_NOTIFICATIONS": {
      if (action.data.notification_id.length) {
        const notificationIds = action.data.notification_id.map((n) => n.id);
        return {
          ...state,
          notifications: Object.values(state.notifications).reduce((acc, n) => {
            if (notificationIds.some((id) => id === n.id) && action.data.slug === n.slug) {
              acc[n.key] = { ...n, is_read: 1 };
            } else {
              acc[n.key] = n;
            }
            return acc;
          }, {}),
        };
      } else {
        return state;
      }
    }
    case "INCOMING_WORKSPACE_POST": {
      return {
        ...state,
        notifications: {
          ...state.notifications,
          ...(action.data.notification &&
            action.data.sharedSlug && {
              [`${action.data.notification.id}-${action.data.slug}`]: {
                key: `${action.data.notification.id}-${action.data.slug}`,
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
                  is_close: 0,
                },
                sharedSlug: action.data.sharedSlug,
                slug: action.data.slug,
              },
            }),
          ...(action.data.notification_approval &&
            action.data.author.id !== action.data.userId && {
              [`${action.data.notification_approval.id}-${action.data.slug}`]: {
                key: `${action.data.notification_approval.id}-${action.data.slug}`,
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
                  is_close: 0,
                },
                sharedSlug: action.data.sharedSlug,
                slug: action.data.slug,
              },
            }),
        },
      };
    }
    default:
      return state;
  }
};
