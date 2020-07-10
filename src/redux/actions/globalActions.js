import dispatchActionToReducer, { SimpleDispatchActionToReducer } from "../actionDispatcher";
import {
  deleteDraft as deleteDraftService,
  generateUnfurl as generateUnfurlService,
  getAllRecipients as getAllRecipientsService,
  getConnectedSlugs as getConnectedSlugsService,
  getDrafts as getDraftsService,
  getPushNotification as getPushNotificationService,
  getTranslationObject as getTranslationObjectService,
  saveDraft as saveDraftService,
  subscribePushNotifications as subscribePushNotificationsService,
  updateDraft as updateDraftService,
  uploadDocument as uploadDocumentService,
  getUnreadNotificationCounterEntries as getUnreadNotificationCounterEntriesService,
} from "../services";

export function setBrowserTabStatus(payload, callback) {
  return SimpleDispatchActionToReducer("SET_BROWSER_TAB_STATUS", payload, callback);
}

export function getConnectedSlugs(payload, callback) {
  return dispatchActionToReducer(getConnectedSlugsService(payload), "GET_CONNECTED_SLUGS_START", "GET_CONNECTED_SLUGS_SUCCESS", "GET_CONNECTED_SLUGS_FAIL", callback);
}

export function getAllRecipients(payload, callback) {
  return dispatchActionToReducer(getAllRecipientsService(payload), "GET_ALL_RECIPIENTS_START", "GET_ALL_RECIPIENTS_SUCCESS", "GET_ALL_RECIPIENTS_FAIL", callback);
}

export function setNavMode(payload, callback) {
  return SimpleDispatchActionToReducer("SET_NAV_MODE", payload, callback);
}

export function toggleLoading(payload, callback) {
  return SimpleDispatchActionToReducer("TOGGLE_LOADING", payload, callback);
}

export function generateUnfurl(payload, callback) {
  return dispatchActionToReducer(generateUnfurlService(payload), "GENERATE_UNFURL_START", "GENERATE_UNFURL_SUCCESS", "GENERATE_UNFURL_FAILURE", callback);
}

export function generateUnfurlReducer(payload, callback) {
  return SimpleDispatchActionToReducer("GENERATE_UNFURL_REDUCER", payload, callback);
}

export function addToModals(payload, callback) {
  return SimpleDispatchActionToReducer("ADD_TO_MODALS", payload, callback);
}

export function clearModal(payload, callback) {
  return SimpleDispatchActionToReducer("CLEAR_MODAL", payload, callback);
}

export function saveDraft(payload, callback) {
  return dispatchActionToReducer(saveDraftService(payload), "SAVE_DRAFT_START", "SAVE_DRAFT_SUCCESS", "SAVE_DRAFT_FAILURE", callback);
}

export function updateDraft(payload, callback) {
  return dispatchActionToReducer(updateDraftService(payload), "UPDATE_DRAFT_START", "UPDATE_DRAFT_SUCCESS", "UPDATE_DRAFT_FAILURE", callback);
}

export function deleteDraft(payload, callback) {
  return dispatchActionToReducer(deleteDraftService(payload), "DELETE_DRAFT_START", "DELETE_DRAFT_SUCCESS", "DELETE_DRAFT_FAILURE", callback);
}

export function uploadDocument(payload, callback) {
  return dispatchActionToReducer(uploadDocumentService(payload), "UPLOAD_DOCUMENT_START", "UPLOAD_DOCUMENT_SUCCESS", "UPLOAD_DOCUMENT_FAIL", callback);
}

export function saveInputData(payload, callback) {
  return SimpleDispatchActionToReducer("SAVE_INPUT_DATA", payload, callback);
}

export function clearInputData(payload, callback) {
  return SimpleDispatchActionToReducer("CLEAR_INPUT_DATA", payload, callback);
}

export function addUserToReducers(payload, callback) {
  return SimpleDispatchActionToReducer("ADD_USER_TO_REDUCERS", payload, callback);
}

export function addTranslationObject(payload, callback) {
  return SimpleDispatchActionToReducer("GET_TRANSLATION_OBJECT_SUCCESS", payload, callback);
}

export function getTranslationObject(payload, callback) {
  return dispatchActionToReducer(getTranslationObjectService(payload), "GET_TRANSLATION_OBJECT_START", "GET_TRANSLATION_OBJECT_SUCCESS", "GET_TRANSLATION_OBJECT_FAIL", callback);
}

export function postTranslationObject() {}

export const getPushNotification = (payload, callback) => {
  return dispatchActionToReducer(getPushNotificationService(payload), "GET_PUSH_NOTIFICATION_START", "GET_PUSH_NOTIFICATION_SUCCESS", "GET_PUSH_NOTIFICATION_FAILURE", callback);
};

export const subscribePushNotifications = (payload, callback) => {
  return dispatchActionToReducer(subscribePushNotificationsService(payload), "SUBSCRIBE_PUSH_NOTIFICATIONS_START", "SUBSCRIBE_PUSH_NOTIFICATIONS_SUCCESS", "SUBSCRIBE_PUSH_NOTIFICATIONS_FAILURE", callback);
};
export function getUnreadNotificationCounterEntries(payload, callback) {
  return dispatchActionToReducer(getUnreadNotificationCounterEntriesService(payload), "GET_UNREAD_NOTIFICATION_COUNTER_START", "GET_UNREAD_NOTIFICATION_COUNTER_SUCCESS", "GET_UNREAD_NOTIFICATION_COUNTER_FAIL", callback);
}

export function setGeneralChat(payload, callback) {
  return SimpleDispatchActionToReducer("UPDATE_GENERAL_CHAT_NOTIFICATION", payload, callback);
}

export function setUnreadNotificationCounterEntries(payload, callback) {
  return SimpleDispatchActionToReducer("UPDATE_UNREAD_LIST_COUNTER", payload, callback);
}

export function getDrafts(payload, callback) {
  return dispatchActionToReducer(getDraftsService(payload), "GET_DRAFTS_START", "GET_DRAFTS_SUCCESS", "GET_DRAFTS_FAIL", callback);
}
