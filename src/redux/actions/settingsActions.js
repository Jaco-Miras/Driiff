import dispatchActionToReducer, { SimpleDispatchActionToReducer } from "../actionDispatcher";
import {
  getDriffCompSettings as getDriffCompSettingsService,
  getDriffSettings as getDriffSettingsService,
  getUserSettings as getUserSettingsService,
  putCompanyUpdateName as putCompanyUpdateNameService,
  updateUserSettings as updateUserSettingsService,
  uploadDriffLogo as uploadDriffLogoService,
} from "../services";

export function getDriffCompSettings(payload, callback) {
  return dispatchActionToReducer(getDriffCompSettingsService(payload), "GET_DRIFF_COMP_SETTINGS_START", "GET_DRIFF_COMP_SETTINGS_SUCCESS", "GET_DRIFF_COMP_SETTINGS_FAIL", callback);
}

export function getDriffSettings(payload, callback) {
  return dispatchActionToReducer(getDriffSettingsService(payload), "GET_DRIFF_SETTINGS_START", "GET_DRIFF_SETTINGS_SUCCESS", "GET_DRIFF_SETTINGS_FAIL", callback);
}

export function getUserSettings(payload, callback) {
  return dispatchActionToReducer(getUserSettingsService(payload), "GET_USER_SETTINGS_START", "GET_USER_SETTINGS_SUCCESS", "GET_USER_SETTINGS_FAIL", callback);
}

export function updateUserSettings(payload, callback) {
  return dispatchActionToReducer(updateUserSettingsService(payload), "UPDATE_SETTINGS_START", "UPDATE_SETTINGS_SUCCESS", "UPDATE_SETTINGS_FAILURE", callback);
}

export function setUserSettings(payload, callback) {
  return SimpleDispatchActionToReducer("UPDATE_USER_SETTINGS", payload, callback);
}

export function setUserChatSetting(payload, callback) {
  return SimpleDispatchActionToReducer("UPDATE_USER_CHAT_SETTING", payload, callback);
}

export function setUserWorkspaceSetting(payload, callback) {
  return SimpleDispatchActionToReducer("UPDATE_WORKSPACE_SETTING", payload, callback);
}

export function setUserGeneralSetting(payload, callback) {
  return SimpleDispatchActionToReducer("UPDATE_USER_GENERAL_SETTING", payload, callback);
}

export function putCompanyUpdateName(payload, callback) {
  return dispatchActionToReducer(putCompanyUpdateNameService(payload), "PUT_COMPANY_UPDATE_NAME_START", "PUT_COMPANY_UPDATE_NAME_SUCCESS", "PUT_COMPANY_UPDATE_NAME_FAIL", callback);
}

export function incomingUpdateCompanyName(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_UPDATE_COMPANY_NAME", payload, callback);
}

export function updateReadAnnouncement(payload, callback) {
  return SimpleDispatchActionToReducer("UPDATE_READ_ANNOUNCEMENT", payload, callback);
}

export function updateCompanyPostAnnouncement(payload, callback) {
  return SimpleDispatchActionToReducer("UPDATE_COMPANY_POST_ANNOUNCEMENT", payload, callback);
}

export function uploadDriffLogo(payload, callback) {
  return dispatchActionToReducer(uploadDriffLogoService(payload), "UPLOAD_DRIFF_LOGO_START", "UPLOAD_DRIFF_LOGO_SUCCESS", "UPLOAD_DRIFF_LOGO_FAILURE", callback);
}

export function updateCustomTranslationSettings(payload, callback) {
  return SimpleDispatchActionToReducer("UPDATE_CUSTOM_TRANSLATION_SETTINGS", payload, callback);
}

export function updateThemeColors(payload, callback) {
  return SimpleDispatchActionToReducer("UPDATE_THEME_COLORS", payload, callback);
}
export function incomingFaviconImage(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_FAVICON_IMAGE", payload, callback);
}
export function notificationReplyInEmail(payload, callback) {
  return SimpleDispatchActionToReducer("NOTIFICATION_REPLY_IN_EMAIL", payload, callback);
}
