import {convertArrayToObject} from "../../helpers/arrayHelper";

const INITIAL_STATE = {
    user: null,
    notifications: {},
    unreadCount: 0
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
                unreadCount: state.unreadCount + action.data.notifications.filter(n => n.is_read === 0).length
            }
        }
        case "READ_ALL_NOTIFICATION_REDUCER": {
            let updatedNotifications = {...state.notifications};
            Object.values(updatedNotifications).forEach(n => {
                updatedNotifications[n.id].is_read = 1
            })
            return {
                ...state,
                notifications: updatedNotifications
            }
        }
        case "READ_NOTIFICATION_REDUCER": {
            let updatedNotifications = {...state.notifications};
            updatedNotifications[action.data.id].is_read = 1;
            return {
                ...state,
                notifications: updatedNotifications,
                unreadCount: state.unreadCount - 1
            }
        }
        case "UNREAD_NOTIFICATION_REDUCER": {
            let updatedNotifications = {...state.notifications};
            updatedNotifications[action.data.id].is_read = 0;
            return {
                ...state,
                notifications: updatedNotifications
            }
        }
        case "REMOVE_NOTIFICATION_REDUCER": {
            let updatedNotifications = {...state.notifications};
            delete updatedNotifications[action.data.id]
            return {
                ...state,
                notifications: updatedNotifications
            }
        }
        case "REMOVE_ALL_NOTIFICATION_REDUCER": {
            return {
                ...state,
                notifications: {}
            }
        }
        default:
            return state;
    }
} 