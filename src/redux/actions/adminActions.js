import dispatchActionToReducer, { SimpleDispatchActionToReducer } from "../actionDispatcher";
import {
  getLoginSettings as getLoginSettingsService,
  putLoginSettings as putLoginSettingsService,
  putQuickLinks as putQuickLinksService,
  postQuickLinks as postQuickLinksService,
  getUserBot as getUserBotService,
  deleteUserBot as deleteUserBotService,
  putUserBot as putUserBotService,
  postUserBot as postUserBotService,
  getGrippBot as getGrippBotService,
  putGrippBot as putGrippBotService,
  postUploadUserBotIcon as postUploadUserBotIconService,
} from "../services";

export function getLoginSettings(payload, callback) {
  return dispatchActionToReducer(getLoginSettingsService(payload), "GET_LOGIN_SETTINGS_START", "GET_LOGIN_SETTINGS_SUCCESS", "GET_LOGIN_SETTINGS_FAILURE", callback);
}

export function putLoginSettings(payload, callback) {
  return dispatchActionToReducer(putLoginSettingsService(payload), "PUT_LOGIN_SETTINGS_START", "PUT_LOGIN_SETTINGS_SUCCESS", "PUT_LOGIN_SETTINGS_FAILURE", callback);
}

export function setFilter(payload, callback) {
  return SimpleDispatchActionToReducer("SET_ADMIN_FILTER", payload, callback);
}

export function putQuickLinks(payload, callback) {
  return dispatchActionToReducer(putQuickLinksService(payload), "PUT_QUICK_LINKS_START", "PUT_QUICK_LINKS_SUCCESS", "PUT_QUICK_LINKS_FAILURE", callback);
}

export function postQuickLinks(payload, callback) {
  return dispatchActionToReducer(postQuickLinksService(payload), "CREATE_QUICK_LINKS_START", "CREATE_QUICK_LINKS_SUCCESS", "CREATE_QUICK_LINKS_FAILURE", callback);
}

export function getUserBot(payload, callback) {
  return dispatchActionToReducer(getUserBotService(payload), "GET_USER_BOT_START", "GET_USER_BOT_SUCCESS", "GET_USER_BOT_FAILURE", callback);
}

export function deleteUserBot(payload, callback) {
  return dispatchActionToReducer(deleteUserBotService(payload), "DELETE_USER_BOT_START", "DELETE_USER_BOT_SUCCESS", "DELETE_USER_BOT_FAILURE", callback);
}

export function putUserBot(payload, callback) {
  return dispatchActionToReducer(putUserBotService(payload), "UPDATE_USER_BOT_START", "UPDATE_USER_BOT_SUCCESS", "UPDATE_USER_BOT_FAILURE", callback);
}

export function postUserBot(payload, callback) {
  return dispatchActionToReducer(postUserBotService(payload), "CREATE_USER_BOT_START", "CREATE_USER_BOT_SUCCESS", "CREATE_USER_BOT_FAILURE", callback);
}

export function getGrippBot(payload, callback) {
  return dispatchActionToReducer(getGrippBotService(payload), "GET_GRIPP_BOT_START", "GET_GRIPP_BOT_SUCCESS", "GET_GRIPP_BOT_FAILURE", callback);
}

export function putGrippBot(payload, callback) {
  return dispatchActionToReducer(putGrippBotService(payload), "UPDATE_GRIPP_BOT_START", "UPDATE_GRIPP_BOT_SUCCESS", "UPDATE_GRIPP_BOT_FAILURE", callback);
}

export function postUploadUserBotIcon(payload, callback) {
  return dispatchActionToReducer(postUploadUserBotIconService(payload), "POST_UPLOAD_USER_BOT_ICON_START", "POST_UPLOAD_USER_BOT_ICON_SUCCESS", "POST_UPLOAD_USER_BOT_ICON_FAILURE", callback);
}
