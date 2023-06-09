import { apiCall } from "./index";

/**
 * @param {Object} payload
 * @param {number} payload.skip
 * @param {number} payload.limit
 * @returns {Promise<*>}
 */

export function getNotifications(payload) {
  let sharedPayload;
  if (payload.sharedPayload) {
    sharedPayload = payload.sharedPayload;
    delete payload.sharedPayload;
  }
  let url = `/v2/notification-counter?skip=${payload.skip}&limit=${payload.limit}`;
  return apiCall({
    method: "GET",
    url: url,
    data: payload,
    sharedPayload: sharedPayload,
  });
}

/**
 * @param {Object} payload
 * @param {number} payload.id
 * @returns {Promise<*>}
 */

export function patchNotification(payload) {
  let sharedPayload;
  if (payload.sharedPayload) {
    sharedPayload = payload.sharedPayload;
    delete payload.sharedPayload;
  }
  let url = `/v2/notification-counter/${payload.id}`;
  return apiCall({
    method: "PATCH",
    url: url,
    data: payload,
    sharedPayload: sharedPayload,
  });
}

/**
 * @param {Object} payload
 * @param {number} payload.id
 * @returns {Promise<*>}
 */
export function unreadNotification(payload) {
  let sharedPayload;
  if (payload.sharedPayload) {
    sharedPayload = payload.sharedPayload;
    delete payload.sharedPayload;
  }
  let url = `/v2/unread-notification-counter?notification_id=${payload.id}`;
  return apiCall({
    method: "PUT",
    url: url,
    data: payload,
    sharedPayload: sharedPayload,
  });
}

export function readAllNotification(payload) {
  let sharedPayload;
  if (payload.sharedPayload) {
    sharedPayload = payload.sharedPayload;
    delete payload.sharedPayload;
  }
  return apiCall({
    method: "PUT",
    url: "/v2/notification-counter-all-read",
    data: payload,
    sharedPayload: sharedPayload,
  });
}

export function deleteAllNotification(payload) {
  let sharedPayload;
  if (payload.sharedPayload) {
    sharedPayload = payload.sharedPayload;
    delete payload.sharedPayload;
  }
  return apiCall({
    method: "DELETE",
    url: "/v2/notification-counter-all-delete",
    sharedPayload: sharedPayload,
  });
}

/**
 * @param {Object} payload
 * @param {number} payload.id
 * @returns {Promise<*>}
 */
export function deleteNotification(payload) {
  let sharedPayload;
  if (payload.sharedPayload) {
    sharedPayload = payload.sharedPayload;
    delete payload.sharedPayload;
  }
  return apiCall({
    method: "DELETE",
    url: `/v2/notification-counter/${payload.id}`,
    sharedPayload: sharedPayload,
  });
}

export function getAllSnoozedNotification(payload) {
  let sharedPayload;
  if (payload.sharedPayload) {
    sharedPayload = payload.sharedPayload;
    delete payload.sharedPayload;
  }
  return apiCall({
    method: "GET",
    url: "/v2/snooze-notification",
    data: payload,
    sharedPayload: sharedPayload,
  });
}

export function snoozeAllNotification(payload) {
  let sharedPayload;
  if (payload.sharedPayload) {
    sharedPayload = payload.sharedPayload;
    delete payload.sharedPayload;
  }
  return apiCall({
    method: "POST",
    url: "/v2/snooze-notification",
    data: payload,
    sharedPayload: sharedPayload,
  });
}

export function snoozeNotification(payload) {
  let sharedPayload;
  if (payload.sharedPayload) {
    sharedPayload = payload.sharedPayload;
    delete payload.sharedPayload;
  }
  return apiCall({
    method: "PUT",
    url: `/v2/snooze-notification/${payload.notification_id}`,
    data: payload,
    sharedPayload: sharedPayload,
  });
}
