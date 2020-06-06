import {apiCall} from "./index";

/**
 * @param {Object} payload
 * @param {number} payload.type_id
 * @param {string} payload.type
 * @returns {Promise<*>}
 */
export function favoritePost(payload) {
    let url = `/v1/favourites`;
    return apiCall({
        method: "POST",
        url: url,
        data: payload,
    });
}

/**
 * @param {Object} payload
 * @param {number} payload.post_id
 * @returns {Promise<*>}
 */
export function postMarkDone(payload) {
    let url = `/v1/mark-done`;

    return apiCall({
        method: "PATCH",
        url: url,
        data: payload,
        is_shared: payload.is_shared ? true : false,
    });
}

/**
 * @param {Object} payload
 * @param {number} payload.post_id
 * @param {number} payload.is_archived
 * @returns {Promise<*>}
 */
export function postArchive(payload) {
    let url = `/v2/post-toggle-archived`;

    return apiCall({
        method: "POST",
        url: url,
        data: payload,
        is_shared: payload.is_shared ? true : false,
    });
}

/**
 * @param {Object} payload
 * @param {number} payload.post_id
 * @param {number} payload.unread
 * @returns {Promise<*>}
 */
export function postToggleRead(payload) {
    let url = `/v2/post-toggle-unread`;

    return apiCall({
        method: "POST",
        url: url,
        data: payload,
        is_shared: payload.is_shared ? true : false,
    });
}

/**
 * @param {Object} payload
 * @param {number} payload.post_id
 * @returns {Promise<*>}
 */
export function followPost(payload) {
    return apiCall({
        method: "PATCH",
        url: `/v1/follows?post_id=${payload.post_id}`,
        data: payload,
        is_shared: payload.is_shared ? true : false,
    });
}

/**
 * @param {Object} payload
 * @param {number} payload.post_id
 * @returns {Promise<*>}
 */
export function unFollowPost(payload) {
    return apiCall({
        method: "DELETE",
        url: `/v1/follows?post_id=${payload.post_id}`,
        data: payload,
        is_shared: payload.is_shared ? true : false,
    });
}