import {apiCall} from "./index";

export function getUserSettings(payload) {
    return apiCall({
        method: "GET",
        url: `/v2/user-settings`,
    });
}