import dispatchActionToReducer, { SimpleDispatchActionToReducer } from "../actionDispatcher";
import {
  createReleaseAnnouncement as createReleaseAnnouncementService,
  deleteDraft as deleteDraftService,
  deletePushSubscription as deletePushSubscriptionService,
  deleteReleaseAnnouncement as deleteReleaseAnnouncementService,
  deleteUnfurl as deleteUnfurlService,
  delRemoveToDo as delRemoveToDoService,
  generateUnfurl as generateUnfurlService,
  getAllRecipients as getAllRecipientsService,
  getConnectedSlugs as getConnectedSlugsService,
  getDrafts as getDraftsService,
  getLatestReply as getLatestReplyService,
  getPushNotification as getPushNotificationService,
  getQuickLinks as getQuickLinksService,
  getReleaseAnnouncements as getReleaseAnnouncementsService,
  getToDo as getToDoService,
  getToDoDetail as getToDoDetailService,
  getTranslationObject as getTranslationObjectService,
  getUnreadNotificationCounterEntries as getUnreadNotificationCounterEntriesService,
  postGenerateTranslationRaw as postGenerateTranslationRawService,
  postToDo as postToDoService,
  putDoneToDo as putDoneToDoService,
  putToDo as putToDoService,
  refetchMessages as refetchMessagesService,
  refetchOtherMessages as refetchOtherMessagesService,
  saveDraft as saveDraftService,
  subscribePushNotifications as subscribePushNotificationsService,
  updateDraft as updateDraftService,
  updateReleaseAnnouncement as updateReleaseAnnouncementService,
  uploadDocument as uploadDocumentService,
  uploadBulkDocument as uploadBulkDocumentService,
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

export function deleteDraftReducer(payload, callback) {
  return SimpleDispatchActionToReducer("DELETE_DRAFT", payload, callback);
}

export function uploadDocument(payload, callback) {
  return dispatchActionToReducer(uploadDocumentService(payload), "UPLOAD_DOCUMENT_START", "UPLOAD_DOCUMENT_SUCCESS", "UPLOAD_DOCUMENT_FAIL", callback);
}

export function uploadBulkDocument(payload, callback) {
  return dispatchActionToReducer(uploadBulkDocumentService(payload), "UPLOAD_BULK_DOCUMENT_START", "UPLOAD_BULK_DOCUMENT_SUCCESS", "UPLOAD_BULK_DOCUMENT_FAIL", callback);
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

export function postGenerateTranslationRaw(payload, callback) {
  return dispatchActionToReducer(postGenerateTranslationRawService(payload), "POST_GENERATE_TRANSLATION_RAW_START", "POST_GENERATE_TRANSLATION_RAW_SUCCESS", "POST_GENERATE_TRANSLATION_RAW_FAIL", callback);
}

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

export function deleteUnfurl(payload, callback) {
  return dispatchActionToReducer(deleteUnfurlService(payload), "DELETE_UNFURL_START", "DELETE_UNFURL_SUCCESS", "DELETE_UNFURL_FAIL", callback);
}

export function getQuickLinks(payload, callback) {
  return dispatchActionToReducer(getQuickLinksService(payload), "GET_QUICK_LINKS_START", "GET_QUICK_LINKS_SUCCESS", "GET_QUICK_LINKS_FAIL", callback);
}

export function deletePushSubscription(payload, callback) {
  return dispatchActionToReducer(deletePushSubscriptionService(payload), "DELETE_PUSH_SUBSCRIPTION_START", "DELETE_PUSH_SUBSCRIPTION_SUCCESS", "DELETE_PUSH_SUBSCRIPTION_FAILURE", callback);
}

export function postToDo(payload, callback) {
  return dispatchActionToReducer(postToDoService(payload), "POST_TO_DO_START", "POST_TO_DO_SUCCESS", "POST_TO_DO_FAILURE", callback);
}

export function putToDo(payload, callback) {
  return dispatchActionToReducer(putToDoService(payload), "PUT_TO_DO_START", "PUT_TO_DO_SUCCESS", "PUT_TO_DO_FAILURE", callback);
}

export function getToDo(payload, callback) {
  return dispatchActionToReducer(getToDoService(payload), "GET_TO_DO_START", "GET_TO_DO_SUCCESS", "GET_TO_DO_FAILURE", callback);
}

export function getToDoDetail(payload, callback) {
  return dispatchActionToReducer(getToDoDetailService(payload), "GET_TO_DO_DETAIL_START", "GET_TO_DO_DETAIL_SUCCESS", "GET_TO_DO_DETAIL_FAILURE", callback);
}

export function putDoneToDo(payload, callback) {
  return dispatchActionToReducer(putDoneToDoService(payload), "PUT_DONE_TO_DO_START", "PUT_DONE_TO_DO_SUCCESS", "PUT_DONE_TO_DO_FAILURE", callback);
}

export function delRemoveToDo(payload, callback) {
  return dispatchActionToReducer(delRemoveToDoService(payload), "DEL_REMOVE_TO_DO_START", "DEL_REMOVE_TO_DO_SUCCESS", "DEL_REMOVE_TO_DO_FAILURE", callback);
}

export function incomingToDo(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_TO_DO", payload, callback);
}

export function incomingUpdateToDo(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_UPDATE_TO_DO", payload, callback);
}

export function incomingDoneToDo(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_DONE_TO_DO", payload, callback);
}

export function incomingRemoveToDo(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_REMOVE_TO_DO", payload, callback);
}

export function incomingFavouriteItem(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_FAVOURITE_ITEM", payload, callback);
}

export function refetchMessages(payload, callback) {
  return dispatchActionToReducer(refetchMessagesService(payload), "REFETCH_MESSAGES_START", "REFETCH_MESSAGES_SUCCESS", "REFETCH_MESSAGES_FAIL", callback);
}

export function refetchOtherMessages(payload, callback) {
  return dispatchActionToReducer(refetchOtherMessagesService(payload), "REFETCH_OTHER_MESSAGES_START", "REFETCH_OTHER_MESSAGES_SUCCESS", "REFETCH_OTHER_MESSAGES_FAIL", callback);
}

export function getLatestReply(payload, callback) {
  return dispatchActionToReducer(getLatestReplyService(payload), "GET_LATEST_REPLY_START", "GET_LATEST_REPLY_SUCCESS", "GET_LATEST_REPLY_FAIL", callback);
}

export function getReleaseAnnouncements(payload, callback) {
  return dispatchActionToReducer(getReleaseAnnouncementsService(payload), "GET_RELEASE_ANNOUNCEMENTS_START", "GET_RELEASE_ANNOUNCEMENTS_SUCCESS", "GET_RELEASE_ANNOUNCEMENTS_FAIL", callback);
}

export function createReleaseAnnouncement(payload, callback) {
  return dispatchActionToReducer(createReleaseAnnouncementService(payload), "CREATE_RELEASE_ANNOUNCEMENTS_START", "CREATE_RELEASE_ANNOUNCEMENTS_SUCCESS", "CREATE_RELEASE_ANNOUNCEMENTS_FAIL", callback);
}

export function deleteReleaseAnnouncement(payload, callback) {
  return dispatchActionToReducer(deleteReleaseAnnouncementService(payload), "DELETE_RELEASE_ANNOUNCEMENTS_START", "DELETE_RELEASE_ANNOUNCEMENTS_SUCCESS", "DELETE_RELEASE_ANNOUNCEMENTS_FAIL", callback);
}

export function updateReleaseAnnouncement(payload, callback) {
  return dispatchActionToReducer(updateReleaseAnnouncementService(payload), "UPDATE_RELEASE_ANNOUNCEMENTS_START", "UPDATE_RELEASE_ANNOUNCEMENTS_SUCCESS", "UPDATE_RELEASE_ANNOUNCEMENTS_FAIL", callback);
}

export function incomingUpdatedAnnouncement(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_UPDATED_ANNOUNCEMENT", payload, callback);
}

export function incomingCreatedAnnouncement(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_CREATED_ANNOUNCEMENT", payload, callback);
}
export function incomingDeletedAnnouncement(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_DELETED_ANNOUNCEMENT", payload, callback);
}
export function setProfileSlider(payload, callback) {
  return SimpleDispatchActionToReducer("SET_PROFILE_SLIDER", payload, callback);
}
export function setIdleStatus(payload, callback) {
  return SimpleDispatchActionToReducer("SET_IDLE_STATUS", payload, callback);
}

export function getDoneToDo(payload, callback) {
  return dispatchActionToReducer(getToDoService(payload), "GET_DONE_TO_DO_START", "GET_DONE_TO_DO_SUCCESS", "GET_DONE_TO_DO_FAILURE", callback);
}

export function getOverdueToDo(payload, callback) {
  return dispatchActionToReducer(getToDoService(payload), "GET_OVERDUE_TO_DO_START", "GET_OVERDUE_TO_DO_SUCCESS", "GET_OVERDUE_TO_DO_FAILURE", callback);
}

export function getTodayToDo(payload, callback) {
  return dispatchActionToReducer(getToDoService(payload), "GET_TODAY_TO_DO_START", "GET_TODAY_TO_DO_SUCCESS", "GET_TODAY_TO_DO_FAILURE", callback);
}

export function snoozeTodo(payload, callback) {
  return SimpleDispatchActionToReducer("REMINDER_SNOOZE", payload, callback);
}

export function snoozeTodoAll(payload, callback) {
  return SimpleDispatchActionToReducer("REMINDER_SNOOZE_ALL", payload, callback);
}

export function incomingZoomData(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_ZOOM_DATA", payload, callback);
}

export function clearZoomData(payload, callback) {
  return SimpleDispatchActionToReducer("CLEAR_ZOOM_DATA", payload, callback);
}

export function removeReminderNotification(payload, callback) {
  return SimpleDispatchActionToReducer("REMOVE_REMINDER_NOTIFICATION", payload, callback);
}

export function setNewDriffData(payload, callback) {
  return SimpleDispatchActionToReducer("SHOW_NEW_DRIFF_BAR", payload, callback);
}

export function setDontShowIds(payload, callback) {
  return SimpleDispatchActionToReducer("SET_DONT_SHOW_IDS", payload, callback);
}

export function incomingZoomUserLeft(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_ZOOM_USER_LEFT", payload, callback);
}

export function incomingZoomCreate(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_ZOOM_CREATE", payload, callback);
}

export function incomingZoomEnded(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_ZOOM_ENDED", payload, callback);
}

export function updateUnreadCounter(payload, callback) {
  return SimpleDispatchActionToReducer("UPDATE_UNREAD_COUNTER", payload, callback);
}

export function setMeetingFilter(payload, callback) {
  return SimpleDispatchActionToReducer("SET_MEETING_FILTER", payload, callback);
}

export function setMeetingSearch(payload, callback) {
  return SimpleDispatchActionToReducer("SET_MEETING_SEARCH", payload, callback);
}

export function reactQuillState(payload, callback) {
  return SimpleDispatchActionToReducer("QUILL_FOCUS", payload, callback);
}
