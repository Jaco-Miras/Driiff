import {objToUrlParams} from "../../helpers/commonFunctions";
import {apiCall} from "./index";

export function getFiles(payload) {
    const {sort} = payload;
    let url = `/v1/files`;
    if (payload.sort) {
        url += `?sort=${sort}`;
    } else {
        url += `?sort=desc`;
    }

    return apiCall({
        method: "GET",
        url: url,
    });
}

export function getChannelFiles(payload) {
    let url = `/v2/post-message-files?channel_id=${payload.channel_id}&skip=${payload.skip}&limit=${payload.limit}`;
    return apiCall({
        method: "GET",
        url: url,
    });
}

export function postWorkspaceFiles(payload) {
    let url = `/v2/workspace-bulk-files?topic_id=${payload.topic_id}&is_primary=${payload.is_primary}`;
    return apiCall({
        method: "POST",
        url: url,
        data: payload.files,
    });
}

export function getWorkspaceFiles(payload) {
    return apiCall({
        method: "GET",
        url: `/v2/workspace-files?${objToUrlParams(payload)}`,
    });
}

export function getWorkspaceTrashFiles(payload) {
    return apiCall({
        method: "GET",
        url: `/v2/workspace-trash-files?${objToUrlParams(payload)}`,
    });
}

export function getWorkspaceFavoriteFiles(payload) {
    return apiCall({
        method: "GET",
        url: `/v2/workspace-files-favorite?${objToUrlParams(payload)}`,
    });
}

export function getWorkspaceRecentlyEditedFiles(payload) {
    return apiCall({
        method: "GET",
        url: `/v2/workspace-recent-edited-files?${objToUrlParams(payload)}`,
    });
}

export function getWorkspacePopularFiles(payload) {
    return apiCall({
        method: "GET",
        url: `/v2/workspace-popular-files?${objToUrlParams(payload)}`,
    });
}

export function getWorkspacePrimaryFiles(payload) {
    return apiCall({
        method: "GET",
        url: `/v2/workspace-primary-files?${objToUrlParams(payload)}`,
    });
}

export function getWorkspaceFolders(payload) {
    return apiCall({
        method: "GET",
        url: `/v2/workspace-folders?${objToUrlParams(payload)}`,
    });
}

export function getWorkspaceFilesDetail(payload) {
    return apiCall({
        method: "GET",
        url: `/api/v2/workspace-files-detail?${objToUrlParams(payload)}`,
    });
}

export function patchWorkspaceFileViewed(payload) {
    return apiCall({
        method: "PATCH",
        url: `/api/v2/workspace-file-viewed?${objToUrlParams(payload)}`,
    });
}

/**
 * @param {Object} payload
 * @param {number} payload.topic_id
 * @returns {Promise<*>}
 */
export function uploadWorkspaceFile(payload) {
    let url = `/v2/workspace-files?topic_id=${payload.topic_id}`;
    return apiCall({
        method: "POST",
        url: url,
        data: payload,
    });
}

/**
 * @param {Object} payload
 * @param {number} payload.link_id
 * @param {string} payload.link_type
 * @param {number} payload.file_id
 * @returns {Promise<*>}
 */
export function restoreWorkspaceFile(payload) {
    let url = `/v2/workspace-restore-file`;
    return apiCall({
        method: "PUT",
        url: url,
        data: payload,
    });
}

/**
 * @param {Object} payload
 * @param {number} payload.link_id
 * @param {string} payload.link_type
 * @param {number} payload.file_id
 * @returns {Promise<*>}
 */
export function deleteWorkspaceFile(payload) {
    let url = `/v2/workspace-delete-file`;
    return apiCall({
        method: "DELETE",
        url: url,
        data: payload,
    });
}