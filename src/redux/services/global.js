import {getTranslationAPIUrl} from "../../helpers/slugHelper";
import {apiCall, apiNoTokenCall} from "./index";
import {objToUrlParams} from "../../helpers/commonFunctions";

export function getConnectedSlugs(payload) {
  let url = "/v2/connected-slugs";
  return apiCall({
    method: "GET",
    url: url,
    data: payload,
  });
}

export function getAllRecipients(payload) {
  return apiCall({
    method: "GET",
    url: "/v1/recipients?is_shared_topic=1",
    data: payload,
  });
}

export function generateUnfurl(payload) {
  let url = "/v2/post-message-unfurl";
  if (payload.type === "task") {
    url = "/v2/task-comment-unfurl";
  }
  return apiCall({
    method: "POST",
    url: url,
    data: payload,
  });
}

export function saveDraft(payload) {
  return apiCall({
    method: "POST",
    url: `/v1/drafts?draft_type=${payload.type}`,
    data: payload,
  });
}

export function updateDraft(payload) {
  return apiCall({
    method: "PUT",
    url: `/v1/drafts/${payload.draft_id}?draft_type=${payload.type}`,
    data: payload,
  });
}

export function deleteDraft(payload) {
  return apiCall({
    method: "DELETE",
    url: `/v1/drafts/${payload.draft_id}?draft_type=${payload.type}`,
  });
}

export function uploadDocument(payload) {
  let url = `/v1/files?file_type=${payload.file_type}`;
  if (payload.folder_id) {
    url += `&folder_id=${payload.folder_id}`;
  }
  return apiCall({
    method: "POST",
    url: url,
    data: payload.file,
  });
}

export function getTranslationObject(payload) {
  return apiNoTokenCall({
    method: "GET",
    actualUrl: payload.url,
  });
}

/**
 * @param Array payload
 * @returns {Promise<*>}
 */
export function postGenerateTranslationRaw(payload) {
  return apiNoTokenCall({
    method: "POST",
    actualUrl: `${getTranslationAPIUrl()}/generate-translation-raw`,
    data: {
      raws: payload,
    },
  });
}

export function subscribePushNotifications(payload) {
  let url = "/v2/push-api-notification";
  return apiCall({
    method: "POST",
    url: url,
    data: payload,
  });
}

export function getPushNotification(payload) {
  let url = `/v2/push-api-notification?subscription_id=${payload.sub_id}`;
  return apiCall({
    method: "GET",
    url: url,
    data: payload,
  });
}

export function getUnreadNotificationCounterEntries(payload) {
  let url = "/v2/notification-counter-entries";
  return apiCall({
    method: "GET",
    url: url,
    data: payload,
  });
}

export function getDrafts(payload) {
  return apiCall({
    method: "GET",
    url: "/v1/drafts",
  });
}

export function deleteUnfurl(payload) {
  let url = "";
  if (payload.type === "task") {
      url = `/v2/task-comment-unfurl/${payload.unfurl_id}`;
  } else {
      url = `/v2/post-message-unfurl/${payload.unfurl_id}`;
  }
  return apiCall({
      method: "DELETE",
      url: url,
  });
}

export function getQuickLinks(payload) {
  return apiCall({
    method: "GET",
    url: "/v2/quick-link",
  });
}

export function deletePushSubscription(payload) {
  return apiCall({
    method: "DELETE",
    url: `/v2/push-api-notification?delete_all_subscription=${payload.user_id}`,
  });
}

export function postToDo(payload) {
  let url = `/v2/to-do`;
  return apiCall({
    method: "POST",
    url: url,
    data: payload,
  });
}

export function putToDo(payload) {
  let url = `/v2/to-do/${payload.id}`;
  return apiCall({
    method: "PUT",
    url: url,
    data: payload,
  });
}

export function getToDo(payload) {
  let url = `/v2/to-do?${objToUrlParams(payload)}`;
  return apiCall({
    method: "GET",
    url: url,
    data: payload,
  });
}

export function putDoneToDo(payload) {
  let url = `/v2/done-to-do?${objToUrlParams(payload)}`;
  return apiCall({
    method: "PUT",
    url: url,
    data: payload,
  });
}

export function delRemoveToDo(payload) {
  let url = `/v2/remove-to-do?${objToUrlParams(payload)}`;
  return apiCall({
    method: "DEL",
    url: url,
    data: payload,
  });
}
