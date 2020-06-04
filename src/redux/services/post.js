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