import dispatchActionToReducer, { SimpleDispatchActionToReducer } from "../actionDispatcher";
import {
  deleteNotification as deleteNotificationService,
  deleteAllNotification as deleteAllNotificationService,
  getNotifications as getNotificationsService,
  patchNotification as patchNotificationService,
  readAllNotification as readAllNotificationService,
  unreadNotification as unreadNotificationService,
  getAllSnoozedNotification as getAllSnoozedNotificationService,
  snoozeAllNotification as snoozeAllNotificationService,
  snoozeNotification as snoozeNotificationService,
} from "../services";

export function getNotifications(payload, callback) {
  return dispatchActionToReducer(getNotificationsService(payload), "GET_NOTIFICATIONS_START", "GET_NOTIFICATIONS_SUCCESS", "GET_NOTIFICATIONS_FAIL", callback);
}

export function patchNotification(payload, callback) {
  return dispatchActionToReducer(patchNotificationService(payload), "PATCH_NOTIFICATION_START", "PATCH_NOTIFICATION_SUCCESS", "PATCH_NOTIFICATION_FAIL", callback);
}

export function unreadNotification(payload, callback) {
  return dispatchActionToReducer(unreadNotificationService(payload), "UNREAD_NOTIFICATION_START", "UNREAD_NOTIFICATION_SUCCESS", "UNREAD_NOTIFICATION_FAIL", callback);
}

export function readAllNotification(payload, callback) {
  return dispatchActionToReducer(readAllNotificationService(payload), "READ_ALL_NOTIFICATION_START", "READ_ALL_NOTIFICATION_SUCCESS", "READ_ALL_NOTIFICATION_FAIL", callback);
}

export function readAllNotificationReducer(payload, callback) {
  return SimpleDispatchActionToReducer("READ_ALL_NOTIFICATION_REDUCER", payload, callback);
}

export function readNotificationReducer(payload, callback) {
  return SimpleDispatchActionToReducer("READ_NOTIFICATION_REDUCER", payload, callback);
}

export function unreadNotificationReducer(payload, callback) {
  return SimpleDispatchActionToReducer("UNREAD_NOTIFICATION_REDUCER", payload, callback);
}

export function deleteNotification(payload, callback) {
  return dispatchActionToReducer(deleteNotificationService(payload), "DELETE_NOTIFICATION_START", "DELETE_NOTIFICATION_SUCCESS", "DELETE_NOTIFICATION_FAIL", callback);
}

export function deleteAllNotification(payload, callback) {
  return dispatchActionToReducer(deleteAllNotificationService(payload), "DELETE_ALL_NOTIFICATION_START", "DELETE_ALL_NOTIFICATION_SUCCESS", "DELETE_ALL_NOTIFICATION_FAIL", callback);
}

export function removeNotificationReducer(payload, callback) {
  return SimpleDispatchActionToReducer("REMOVE_NOTIFICATION_REDUCER", payload, callback);
}

export function removeAllNotificationReducer(payload, callback) {
  return SimpleDispatchActionToReducer("REMOVE_ALL_NOTIFICATION_REDUCER", payload, callback);
}

export function setPushNotification(payload, callback) {
  return SimpleDispatchActionToReducer("SET_PUSH_NOTIFICATION", payload, callback);
}

export function incomingReminderNotification(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_REMINDER_NOTIFICATION", payload, callback);
}

export function snoozeNotificationReducer(payload, callback) {
  return SimpleDispatchActionToReducer("NOTIFICATION_SNOOZE", payload, callback);
}

export function snoozeNotificationAll(payload, callback) {
  return SimpleDispatchActionToReducer("NOTIFICATION_SNOOZE_ALL", payload, callback);
}

export function getAllSnoozedNotification(payload, callback) {
  return dispatchActionToReducer(getAllSnoozedNotificationService(payload), "GET_ALL_SNOOZED_NOTIFICATION_START", "GET_ALL_SNOOZED_NOTIFICATION_SUCCESS", "GET_ALL_SNOOZED_NOTIFICATION_FAIL", callback);
}

export function snoozeAllNotification(payload, callback) {
  return dispatchActionToReducer(snoozeAllNotificationService(payload), "SNOOZE_ALL_NOTIFICATION_START", "SNOOZE_ALL_NOTIFICATION_SUCCESS", "SNOOZE_ALL_NOTIFICATION_FAIL", callback);
}

export function snoozeNotification(payload, callback) {
  return dispatchActionToReducer(snoozeNotificationService(payload), "SNOOZE_NOTIFICATION_START", "SNOOZE_NOTIFICATION_SUCCESS", "SNOOZE_NOTIFICATION_FAIL", callback);
}

export function incomingSnoozedNotification(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_SNOOZED_NOTIFICATION", payload, callback);
}

export function incomingSnoozedAllNotification(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_SNOOZED_ALL_NOTIFICATION", payload, callback);
}
