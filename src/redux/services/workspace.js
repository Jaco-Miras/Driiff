// import {objToUrlParams} from "../../helpers/commonFunctions";
// import {getAPIUrl} from "../../helpers/slugHelper";
import {apiCall} from "./service";

/**
 * @param {Object} payload
 * @param {number} payload.is_external
 * @returns {Promise<*>}
 */
export function getWorkspaces(payload) {
    let url = `/v2/workspace?is_external=${payload.is_external}`;
    return apiCall({
        method: "GET",
        url: url,
        data: payload,
    });
}

/**
 * @param {Object} payload
 * @param {string} payload.name
 * @param {string} payload.description
 * @param {number} payload.is_external
 * @param {array} payload.member_ids
 * @returns {Promise<*>}
 */
export function createWorkspace(payload) {
    let url = `/v2/workspace`;
    return apiCall({
        method: "POST",
        url: url,
        data: payload,
    });
}

/**
 * @param {Object} payload
 * @param {string} payload.name
 * @param {number} payload.is_external
 * @param {number} payload.workspace_id
 * @returns {Promise<*>}
 */
export function updateWorkspace(payload) {
    let url = `/v2/workspace/${payload.topic_id}`;
    return apiCall({
        method: "PUT",
        url: url,
        data: payload,
    });
}

/**
 * @param {Object} payload
 * @param {number} payload.workspace_id
 * @returns {Promise<*>}
 */
export function deleteWorkspace(payload) {
    let url = `/v2/workspace/${payload.workspace_id}`;
    return apiCall({
        method: "DELETE",
        url: url,
        data: payload,
    });
}

/**
 * @param {Object} payload
 * @param {number} payload.workspace_id
 * @param {number} payload.topic_id
 * @returns {Promise<*>}
 */
export function moveWorkspaceTopic(payload) {
    let url = `/v2/move-topic-workspace`;
    return apiCall({
        method: "PUT",
        url: url,
        data: payload,
    });
}

/**
 * @param {Object} payload
 * @param {number} payload.is_external
 * @param {string} payload.search
 * @returns {Promise<*>}
 */
export function getWorkspaceTopics(payload) {
    let url = `/v2/workspace-topics?is_external=${payload.is_external}`;
    if (payload.search !== undefined) {
        url += `&search=${payload.search}`;
    }
    return apiCall({
        method: "GET",
        url: url,
        data: payload,
    });
}

/**
 * @param {Object} payload
 * @param {number} payload.topic_id
 * @param {string} payload.search
 * @returns {Promise<*>}
 */
export function getWorkspacePosts(payload) {
    let url = `/v1/posts?topic_id=${payload.topic_id}`;
    if (payload.search !== undefined) {
        url += `&search=${payload.search}`;
    }
    return apiCall({
        method: "GET",
        url: url,
        data: payload,
    });
}

/**
 * @param {Object} payload
 * @param {number} payload.post_id
 * @returns {Promise<*>}
 */
export function getWorkspacePostDetail(payload) {
    let url = `/v1/posts/${payload.post_id}`;
    return apiCall({
        method: "GET",
        url: url,
        data: payload,
    });
}

/**
 * @param {Object} payload
 * @param {number} payload.post_id
 * @param {string} payload.title
 * @param {string} payload.body
 * @param {string} payload.status
 * @param {array} payload.recipient_ids
 * @param {array} payload.workspace_ids
 * @param {string} payload.type
 * @param {number} payload.personal
 * @returns {Promise<*>}
 */
export function createWorkspacePost(payload) {
    let url = `/v1/posts`;
    return apiCall({
        method: "POST",
        url: url,
        data: payload,
    });
}

/**
 * @param {Object} payload
 * @param {number} payload.post_id
 * @param {string} payload.status
 * @returns {Promise<*>}
 */
export function updatePostStatus(payload) {
    let url = `/v2/posts/status`;
    return apiCall({
        method: "PUT",
        url: url,
        data: payload,
    });
}

/**
 * @param {Object} payload
 * @param {number} payload.topic_id
 * @returns {Promise<*>}
 */
export function fetchDetail(payload) {
    let url = `/v2/workspace-dashboard-detail?topic_id=${payload.topic_id}`;
    return apiCall({
        method: "GET",
        url: url,
        data: payload,
    });
}

/**
 * @param {Object} payload
 * @param {number} payload.topic_id
 * @returns {Promise<*>}
 */
export function getPostStatusCount(payload) {
    let url = `/v2/post-tags-entries?topic_id=${payload.topic_id}`;
    return apiCall({
        method: "GET",
        url: url,
        data: payload,
    });
}

/**
 * @param {Object} payload
 * @param {number} payload.group_id
 * @param {number} payload.user_id
 * @returns {Promise<*>}
 */
export function joinWorkspace(payload) {
    let url = `/v1/members`;
    return apiCall({
        method: "POST",
        url: url,
        data: payload,
    });
}

/**
 * @param {Object} payload
 * @param {number} payload.topic_id
 * @returns {Promise<*>}
 */
export function fetchPrimaryFiles(payload) {
    let url = `/v2/workspace-primary-files?topic_id=${payload.topic_id}`;
    return apiCall({
        method: "GET",
        url: url,
        data: payload,
    });
}

/**
 * @param {Object} payload
 * @param {number} payload.topic_id
 * @returns {Promise<*>}
 */
export function fetchMembers(payload) {
    let url = `/v2/workspace-dashboard-members?topic_id=${payload.topic_id}`;
    return apiCall({
        method: "GET",
        url: url,
        data: payload,
    });
}



/**
 * @param {Object} payload
 * @param {number} payload.topic_id
 * @returns {Promise<*>}
 */
export function fetchTimeline(payload) {
    let url = `/v2/workspace-dashboard-timeline?topic_id=${payload.topic_id}`;
    return apiCall({
        method: "GET",
        url: url,
        data: payload,
    });
}