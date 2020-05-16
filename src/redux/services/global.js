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

export function generateUnfurl(payload) {
    let url = `/v2/post-message-unfurl`;
    if (payload.type === "task") {
        url = `/v2/task-comment-unfurl`;
    }
    return apiCall({
        method: "POST",
        url: url,
        data: payload,
    });
}