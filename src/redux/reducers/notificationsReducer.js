import { convertArrayToObject } from "../../helpers/arrayHelper";

const INITIAL_STATE = {
  user: null,
  notifications: {},
  unreadCount: 0,
  hasSubscribed: true,
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
      return {
        ...state,
        notifications: updatedNotifications,
        unreadCount: state.unreadCount - 1,
      };
    }
    case "UNREAD_NOTIFICATION_REDUCER": {
      let updatedNotifications = { ...state.notifications };
      updatedNotifications[action.data.id].is_read = 0;
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
              created_at: action.data.user_approved.updated_at,
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
    default:
      return state;
  }
};
