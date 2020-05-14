import {apiCall} from "./index";

export function getConnectedSlugs(payload) {
    let url = `/v2/connected-slugs`;
    return apiCall({
        method: "GET",
        url: url,
        data: payload,
    });
}

export function getAllRecipients(payload) {
    return apiCall({
        method: "GET",
        url: `/v1/recipients?is_shared_topic=1`,
    });
}