import {apiCall} from "./index";

export function getUserSettings(payload) {
    return apiCall({
        method: "GET",
        url: `/v2/user-settings`,
    });
}

export function updateUserSettings(payload) {
    return apiCall({
        method: "PUT",
        url: `/v2/user-settings`,
        data: payload,
    });
}