import dispatchActionToReducer, {SimpleDispatchActionToReducer} from "../actionDispatcher";
import {
    getNotifications as getNotificationsService,
    patchNotification as patchNotificationService,
    readAllNotification as readAllNotificationService,
    unreadNotification as unreadNotificationService,
} from "../services";

export function getNotifications(payload, callback) {
    return dispatchActionToReducer(
        getNotificationsService(payload),
        "GET_NOTIFICATIONS_START",
        "GET_NOTIFICATIONS_SUCCESS",
        "GET_NOTIFICATIONS_FAIL",
        callback,
    );
}

export function patchNotification(payload, callback) {
    return dispatchActionToReducer(
        patchNotificationService(payload),
        "PATCH_NOTIFICATION_START",
        "PATCH_NOTIFICATION_SUCCESS",
        "PATCH_NOTIFICATION_FAIL",
        callback,
    );
}

export function unreadNotification(payload, callback) {
    return dispatchActionToReducer(
        unreadNotificationService(payload),
        "UNREAD_NOTIFICATION_START",
        "UNREAD_NOTIFICATION_SUCCESS",
        "UNREAD_NOTIFICATION_FAIL",
        callback,
    );
}

export function readAllNotification(payload, callback) {
    return dispatchActionToReducer(
        readAllNotificationService(payload),
        "READ_ALL_NOTIFICATION_START",
        "READ_ALL_NOTIFICATION_SUCCESS",
        "READ_ALL_NOTIFICATION_FAIL",
        callback,
    );
}

export function readAllNotificationReducer(payload, callback) {
    return SimpleDispatchActionToReducer(
        "READ_ALL_NOTIFICATION_REDUCER",
        payload,
        callback,
    );
}

export function readNotificationReducer(payload, callback) {
    return SimpleDispatchActionToReducer(
        "READ_NOTIFICATION_REDUCER",
        payload,
        callback,
    );
}

export function unreadNotificationReducer(payload, callback) {
    return SimpleDispatchActionToReducer(
        "UNREAD_NOTIFICATION_REDUCER",
        payload,
        callback,
    );
}