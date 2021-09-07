import { apiCall } from "./index";

/**
 * @param {Object} payload
 * @param {number} payload.skip
 * @param {number} payload.limit
 * @returns {Promise<*>}
 */

export function getNotifications(payload) {
  let url = `/v2/notification-counter?skip=${payload.skip}&limit=${payload.limit}`;
  return apiCall({
    method: "GET",
    url: url,
    data: payload,
  });
}

/**
 * @param {Object} payload
 * @param {number} payload.id
 * @returns {Promise<*>}
 */

export function patchNotification(payload) {
  let url = `/v2/notification-counter/${payload.id}`;
  return apiCall({
    method: "PATCH",
    url: url,
    data: payload,
  });
}

/**
 * @param {Object} payload
 * @param {number} payload.id
 * @returns {Promise<*>}
 */
export function unreadNotification(payload) {
  let url = `/v2/unread-notification-counter?notification_id=${payload.id}`;
  return apiCall({
    method: "PUT",
    url: url,
    data: payload,
  });
}

export function readAllNotification(payload) {
  return apiCall({
    method: "PUT",
    url: "/v2/notification-counter-all-read",
    data: payload,
  });
}

export function deleteAllNotification(payload) {
  return apiCall({
    method: "DELETE",
    url: "/v2/notification-counter-all-delete",
  });
}

/**
 * @param {Object} payload
 * @param {number} payload.id
 * @returns {Promise<*>}
 */
export function deleteNotification(payload) {
  return apiCall({
    method: "DELETE",
    url: `/v2/notification-counter/${payload.id}`,
  });
}

export function getAllSnoozedNotification(payload) {
  return apiCall({
    method: "GET",
    url: "/v2/snooze-notification",
    data: payload,
  });
}

export function snoozeAllNotification(payload) {
  return apiCall({
    method: "POST",
    url: "/v2/snooze-notification",
    data: payload,
  });
}

export function snoozeNotification(payload) {
  return apiCall({
    method: "PUT",
    url: `/v2/snooze-notification/${payload.notification_id}`,
    data: payload,
  });
}
