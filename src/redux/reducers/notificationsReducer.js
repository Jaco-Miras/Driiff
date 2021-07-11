import { convertArrayToObject } from "../../helpers/arrayHelper";
import { getCurrentTimestamp } from "../../helpers/dateFormatter";

const INITIAL_STATE = {
  user: null,
  notifications: {},
  unreadCount: 0,
  hasSubscribed: true,
  is_snooze: false
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
      results = results.map(obj => ({ ...obj, is_snooze: false }));
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
      let updatedNotifications = { ...state.notifications };
      Object.values(updatedNotifications).forEach((n) => {
        updatedNotifications[n.id].is_read = 1;
        updatedNotifications[n.id].is_snooze = false;
      });
      return {
        ...state,
        notifications: updatedNotifications,
        unreadCount: 0,
      };
    }
    case "READ_NOTIFICATION_REDUCER": {
      let updatedNotifications = { ...state.notifications };
      updatedNotifications[action.data.id].is_read = 1;
      updatedNotifications[action.data.id].is_snooze = false;
      return {
        ...state,
        notifications: updatedNotifications,
        unreadCount: state.unreadCount - 1,
      };
    }
    case "UNREAD_NOTIFICATION_REDUCER": {
      let updatedNotifications = { ...state.notifications };
      updatedNotifications[action.data.id].is_read = 0;
      updatedNotifications[action.data.id].is_snooze = false;
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
      return {
        ...state,
        notifications: {
          ...state.notifications,
          ...(action.data.notification_approval && {
            [action.data.notification_approval.id]: {
              id: action.data.notification_approval.id,
              type: action.data.notification_approval.type,
              is_read: 0,
              is_snooze: false,
              created_at: action.data.created_at ? action.data.created_at : action.data.user_approved.updated_at,
              author: action.data.user_approved,
              data: {
                post_id: action.data.post.id,
                type: "POST",
                must_read: false,
                must_reply: false,
                personalized_for_id: null,
                title: action.data.post.title,
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
    }
    case "INCOMING_POST": {
      let notificationApproval = {};
      if (action.data.notification && action.data.author.id !== state.user.id) {
        let postNotification = {
          id: action.data.notification.id,
          type: "POST_CREATE",
          is_read: 0,
          is_snooze: false,
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
          },
        };
        if (action.data.notification_approval) {
          notificationApproval = {
            id: action.data.notification_approval.id,
            type: action.data.notification_approval.type,
            is_read: 0,
            is_snooze: false,
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
            },
          };
        }
        return {
          ...state,
          notifications: {
            ...state.notifications,
            [postNotification.id]: postNotification,
            ...(action.data.notification_approval && {
              [notificationApproval.id]: notificationApproval,
            }),
          },
        };
      } else {
        return state;
      }
    }
    case "INCOMING_COMMENT": {
      if (action.data.notification === null || action.data.author.id === state.user.id) return state;

      let postNotification = {
        id: action.data.notification.id,
        type: action.data.notification.type,
        is_read: 0,
        is_snooze: false,
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
        },
      };

      return {
        ...state,
        notifications: { ...state.notifications, [postNotification.id]: postNotification },
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
            type: "WORKSPACE_ADD_MEMBER",
          },
        },
      };
    }
    case "NOTIFICATION_SNOOZE_ALL": {
      let notifications = { ...state.notifications };
      return {
        ...state,
        is_snooze: action.data.is_snooze,
      }
    }
    case "NOTIFICATION_SNOOZE": {
      let notifications = { ...state.notifications };
      notifications[action.data.id].is_snooze = action.data.is_snooze;
      return {
        ...state,
        notifications: notifications
      };
    }
    default:
      return state;
  }
};
