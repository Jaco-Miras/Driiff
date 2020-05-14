import dispatchActionToReducer, {SimpleDispatchActionToReducer} from "../actionDispatcher";
import {getUserSettings as getUserSettingsService} from "../services";

export function getUserSettings(payload, callback) {
    return dispatchActionToReducer(
        getUserSettingsService(payload),
        "GET_USER_SETTINGS_START",
        "GET_USER_SETTINGS_SUCCESS",
        "GET_USER_SETTINGS_FAIL",
        callback,
    );
}

export function setNavMode(payload, callback) {
    return SimpleDispatchActionToReducer(
        "SET_NAV_MODE",
        payload,
        callback,
    );
}