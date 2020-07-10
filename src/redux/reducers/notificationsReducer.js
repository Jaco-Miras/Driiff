import { convertArrayToObject } from "../../helpers/arrayHelper";

const INITIAL_STATE = {
  user: null,
  notifications: {},
  unreadCount: 0,
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
      return {
        ...state,
        notifications: {
          ...state.notifications,
          ...convertArrayToObject(action.data.notifications, "id"),
        },
        unreadCount: state.unreadCount + action.data.notifications.filter((n) => n.is_read === 0).length,
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
    case "INCOMING_POST": {
      if (action.data.author.id !== state.user.id) {
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
        return {
          ...state,
          notifications: { ...state.notifications, [postNotification.id]: postNotification },
        };
      } else {
        return state;
      }
    }
    case "INCOMING_COMMENT": {
      if (action.data.author.id !== state.user.id) {
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
    default:
      return state;
  }
};
