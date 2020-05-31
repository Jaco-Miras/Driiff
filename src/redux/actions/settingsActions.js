import dispatchActionToReducer, {SimpleDispatchActionToReducer} from "../actionDispatcher";
import {getUserSettings as getUserSettingsService, updateUserSettings as updateUserSettingsService} from "../services";

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