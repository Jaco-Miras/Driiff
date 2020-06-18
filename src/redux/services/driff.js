import {getAPIUrl} from "../../helpers/slugHelper";
import {apiNoTokenCall} from "./service";

/**
 * This function will call on the API to process driff registration
 *
 * @param {Object} data
 * @param {string} data.company_name
 * @param {string} data.password
 * @param {string} data.email
 * @param {string} data.slug
 * @param {string} data.user_name
 * @param {array} data.invitations
 * @param {number} data.free_account
 * @param {number} data.topic_id
 * @param {string} data.topic_name
 * @param {string} data.slug_from
 * @param {string} data.invited_by
 * @param {number} data.invited_by_id
 * @returns {Promise<*>}
 */
export function postRegisterDriff(data) {
    return apiNoTokenCall({
        method: "POST",
        url: `/register`,
        register: true,
        data: data,
    });
}

/**
 * This function will call on the API to determine if driff exists
 *
 * @param {string} driffName
 * @returns {Promise<*>}
 */
export function patchCheckDriff(driffName) {
    return apiNoTokenCall({
        method: "PATCH",
        actualUrl: `${getAPIUrl({noSlug: true})}/check-slug/?slug=${driffName}`,

    });
}