import dispatchActionToReducer, { SimpleDispatchActionToReducer } from "../actionDispatcher";
import { getLoginSettings as getLoginSettingsService, putLoginSettings as putLoginSettingsService, putQuickLinks as putQuickLinksService, postQuickLinks as postQuickLinksService } from "../services";

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
