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