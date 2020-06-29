import dispatchActionToReducer, {SimpleDispatchActionToReducer} from "../actionDispatcher";
import {
    getDriffSettings as getDriffSettingsService,
    getUserSettings as getUserSettingsService,
    updateUserSettings as updateUserSettingsService,
} from "../services";

export function getDriffSettings(payload, callback) {
    return dispatchActionToReducer(
        getDriffSettingsService(payload),
        "GET_DRIFF_SETTINGS_START",
        "GET_DRIFF_SETTINGS_SUCCESS",
        "GET_DRIFF_SETTINGS_FAIL",
        callback,
    );
}

export function getUserSettings(payload, callback) {
    return dispatchActionToReducer(
        getUserSettingsService(payload),
        "GET_USER_SETTINGS_START",
        "GET_USER_SETTINGS_SUCCESS",
        "GET_USER_SETTINGS_FAIL",
        callback,
    );
}

export function updateUserSettings(payload, callback) {
    return dispatchActionToReducer(
        updateUserSettingsService(payload),
        "UPDATE_SETTINGS_START",
        "UPDATE_SETTINGS_SUCCESS",
        "UPDATE_SETTINGS_FAILURE",
        callback,
    );
}

export function setUserSettings(payload, callback) {
    return SimpleDispatchActionToReducer(
        "UPDATE_USER_SETTINGS",
        payload,
        callback,
    );
}

export function setUserChatSetting(payload, callback) {
    return SimpleDispatchActionToReducer(
        "UPDATE_USER_CHAT_SETTING",
        payload,
        callback,
    );
}

export function setUserGeneralSetting(payload, callback) {
    return SimpleDispatchActionToReducer(
        "UPDATE_USER_GENERAL_SETTING",
        payload,
        callback,
    );
}