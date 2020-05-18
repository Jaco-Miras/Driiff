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

export function saveDraft(payload) {
    return apiCall({
        method: "POST",
        url: `/v1/drafts?draft_type=${payload.type}`,
        data: payload,
    });
}

export function updateDraft(payload) {
    return apiCall({
        method: "PUT",
        url: `/v1/drafts/${payload.draft_id}?draft_type=${payload.type}`,
        data: payload,
    });
}

export function deleteDraft(payload) {
    return apiCall({
        method: "DELETE",
        url: `/v1/drafts/${payload.draft_id}?draft_type=${payload.type}`,
    });
}