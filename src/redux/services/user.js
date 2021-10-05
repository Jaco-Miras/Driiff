import { objToUrlParams } from "../../helpers/commonFunctions";
import { getAPIUrl } from "../../helpers/slugHelper";
import { apiCall, apiNoTokenCall } from "./service";

/**
 * This function will call on the API to process the data whether it will be for two-step-authentication or not
 *
 *
 * @param {Object} payload
 * @param {string} payload.email
 * @param {string} payload.password
 * @param {string} payload.serial
 * @param {string} payload.device
 * @param {string} payload.browser
 * @param {string} payload.slug_from
 * @param {number} payload.topic_id
 * @param {string} payload.invited_by
 * @returns {Promise<*>}
 */
export function login(payload) {
  return apiNoTokenCall({
    method: "POST",
    url: "/login",
    data: payload,
  });
}

/**
 * @param {Object} payload
 */
export function logout(payload = {}) {
  return apiCall({
    method: "POST",
    url: "/logout",
  });
}

/**
 * This function will call on the API to process the data whether it will be for two-step-authentication or not
 *
 *
 * @param {Object} payload
 * @param {string} payload.email
 * @param {string} payload.first_name
 * @param {string} payload.last_name
 * @param {string} payload.slug_from
 * @param {number} payload.topic_id
 * @param {string} payload.invited_by
 * @returns {Promise<*>}
 */
export function requestExternalUser(payload) {
  return apiNoTokenCall({
    method: "POST",
    url: "/v2/request-external-user",
    data: payload,
  });
}

/**
 *
 * @param {Object} payload
 * @param {string} payload.id
 * @returns {Promise<*>}
 */
export function getUser(payload) {
  return apiCall({
    method: "GET",
    url: `/users/${payload.id}`,
  });
}

/**
 *
 * @param {Object} payload
 * @param {string} payload.id
 * @returns {Promise<*>}
 */
export function putUser(payload) {
  let url = `/users/${payload.id}`;

  return apiCall({
    method: "PUT",
    url: url,
    data: payload,
  });
}

/**
 *
 * @param {Object} payload
 * @param {string} payload.type
 * @returns {Promise<*>}
 */
export function updateUserType(payload) {
  let url = `/users/${payload.id}/user-type`;

  return apiCall({
    method: "PUT",
    url: url,
    data: payload,
  });
}

/**
 *
 * @param {Object} payload
 * @param {string} payload.company_name
 * @param {string} payload.password
 * @param {string} payload.email
 * @param {string} payload.slug
 * @returns {Promise<*>}
 */
export function registerUser(payload) {
  return apiNoTokenCall({
    method: "POST",
    url: "/register",
    data: payload,
    register: true,
  });
}

export function registerUserToWorkspace(payload) {
  return apiNoTokenCall({
    method: "POST",
    url: "/register",
    data: payload,
  });
}

/**
 *
 * @param {Object} payload
 * @param {string} payload.code
 * @returns {Promise<*>}
 */
export function verifyUserEmailCode(payload) {
  return apiNoTokenCall({
    method: "POST",
    url: "/verify-code",
    data: payload,
    register: false,
    mockServer: false,
    responseType: "json",
  });
}

/**
 *
 * @param {Object} payload
 * @param {string} payload.email
 * @returns {Promise<*>}
 */
export function resendUserEmailCode(payload) {
  return apiNoTokenCall({
    method: "POST",
    url: "/resend-code",
    data: payload,
    register: false,
    mockServer: false,
    responseType: "json",
  });
}

export function trustDevice(payload = {}) {
  return apiCall({
    method: "POST",
    url: "/v1/trusted",
    data: payload,
  });
}

export function getMentions() {
  return apiCall({
    method: "GET",
    url: "/v2/mention/users",
  });
}

export function getRecipients() {
  return apiCall({
    method: "GET",
    url: "/recipients/v1",
  });
}

export function getImage(imageLink) {
  imageLink = imageLink.split("/api")[1];

  return apiCall({
    method: "GET",
    responseType: "arraybuffer",
    url: imageLink,
  });
}

export function getUserFiles(uid) {
  return apiCall({
    method: "GET",
    url: `/users/${uid}/files`,
  });
}

/**
 *
 * @param {Object} payload
 * @param {string} payload.email
 * @returns {Promise<*>}
 */
export function resetPassword(payload) {
  return apiNoTokenCall({
    method: "POST",
    url: "/password/email",
    data: payload,
  });
}

/**
 *
 * @param {Object} payload
 * @param {string} payload.token
 * @param {string} payload.email
 * @param {string} payload.password
 * @returns {Promise<*>}
 */
export function postPasswordReset(payload) {
  let url = "/password/reset";

  return apiNoTokenCall({
    method: "POST",
    url: url,
    data: payload,
  });
}

export function forgotSlug(email) {
  let url = `/forgot/slug?email=${email}`;

  return apiNoTokenCall({
    method: "POST",
    url: url,
    register: true,
  });
}

/**
 *
 * @param {Object} payload
 * @param {string} payload.email
 * @returns {Promise<*>}
 */
export function forgotEmail(payload) {
  let url = "/check-user";

  return apiNoTokenCall({
    method: "POST",
    url: url,
    data: payload,
  });
}

/**
 *
 * @param {Object} payload
 * @param {string} payload.driff
 * @param {string} payload.email
 * @returns {Promise<*>}
 */
export function checkDriffUserEmail(payload) {
  const { REACT_APP_apiProtocol, REACT_APP_apiBaseUrl } = process.env;
  let url = `${REACT_APP_apiProtocol}${payload.driff}.${REACT_APP_apiBaseUrl}/check-email`;

  return apiNoTokenCall({
    method: "PATCH",
    actualUrl: url,
    data: payload,
  });
}

export function postRequest(payload) {
  return apiNoTokenCall({
    method: "POST",
    url: "/requests",
    data: payload,
  });
}

export function createSharedRequest(payload) {
  return apiCall({
    method: "POST",
    url: "/v2/create-shared-request",
    data: payload,
  });
}

export function searchRequest(payload) {
  const { email } = payload;
  let url = `/requests/search?email=${email}`;

  return apiNoTokenCall({
    method: "POST",
    url,
  });
}

export function getRequests(payload) {
  let url = "/requests";
  return apiCall({
    method: "GET",
    url,
    data: payload,
  });
}

export function acceptRequest(payload) {
  const { id } = payload;
  let url = `/requests/${id}`;
  return apiCall({
    method: "PUT",
    url,
    data: payload,
  });
}

export function deleteRequest(payload) {
  const { id } = payload;
  let url = `/requests/${id}`;
  return apiCall({
    method: "DELETE",
    url,
  });
}

export function updateProfileImage(payload) {
  const { file, user_id } = payload;
  let url = `/users/${user_id}/upload-profile-image`;
  return apiCall({
    method: "POST",
    url: url,
    data: file,
  });
}

export function updateCoverImage(payload) {
  const { file, user_id } = payload;
  let url = `/users/${user_id}/upload-cover-image`;
  return apiCall({
    method: "POST",
    url: url,
    data: file,
  });
}

export function getOwnProfile(payload = {}) {
  return apiCall({
    method: "GET",
    url: "/profile",
    data: payload,
  });
}

export function getDefaultBanners(payload) {
  let url = "/response/default/banners";
  return apiCall({
    method: "GET",
    url: url,
    data: payload,
  });
}

export function getSharedFiles(payload) {
  return apiCall({
    method: "GET",
    url: `/users/${payload.id}/shared`,
  });
}

// export function archiveUser(payload) {
//   return apiCall({
//     method: "DELETE",
//     url: `/users/${payload.id}`,
//   });
// }

// export function unarchiveUser(payload) {
//   return apiCall({
//     method: "PUT",
//     url: `/users/${payload.id}/un-archive`,
//   });
// }

export function updateSettings(payload) {
  return apiCall({
    method: "PUT",
    url: "/v2/user-settings",
    data: payload,
  });
}

/**
 * @param {Object} payload
 * @param {string} payload.driff
 * @returns {Promise<* | void>}
 */
export function googleLogin(payload) {
  return apiNoTokenCall({
    method: "GET",
    actualUrl: `${getAPIUrl({ noSlug: true })}/auth/google?${objToUrlParams(payload)}`,
  });
}

/**
 * @param {Object} payload
 * @returns {Promise<* | void>}
 */
export function authenticateGoogleLogin(payload) {
  return apiNoTokenCall({
    method: "POST",
    actualUrl: `${getAPIUrl({ noSlug: true })}/auth/google/user`,
    data: payload,
  });
}

export function getOnlineUsers(payload) {
  return apiCall({
    method: "GET",
    url: "/v2/users-online",
    data: payload,
  });
}

export function getUsers(payload = {}) {
  let url = `/v1/users?${objToUrlParams(payload)}`;
  return apiCall({
    method: "GET",
    url: url,
  });
}

export function postUploadProfileImage(payload) {
  let url = `/users/${payload.id}/upload-profile-image`;
  return apiCall({
    method: "POST",
    url: url,
    hasFile: true,
    data: {
      file: payload.file,
    },
  });
}

export function postExternalUserData(payload = {}) {
  let url = "/v2/external-user-data";
  return apiNoTokenCall({
    method: "POST",
    url: url,
    data: payload,
  });
}

export function putExternalUserUpdate(payload = {}) {
  let url = "/v2/external-user-update";
  return apiNoTokenCall({
    method: "PUT",
    url: url,
    data: payload,
  });
}

export function postMagicLink(payload) {
  return apiNoTokenCall({
    method: "POST",
    url: "/magic-link",
    data: payload,
  });
}

export function putMagicLink(payload) {
  return apiNoTokenCall({
    method: "PUT",
    url: "/magic-link",
    data: payload,
  });
}

/**
 * @param {Object} payload
 * @param {string} payload.email
 * @param {string} payload.first_name
 * @param {string} payload.last_name
 * @returns {Promise<* | void>}
 */
export function postInternalRequestForm(payload) {
  return apiCall({
    method: "POST",
    url: "/v2/internal-request-form",
    data: payload,
  });
}

/**
 * @param {Object} payload
 * @param {number} payload.role_id
 * @param {number} payload.user_id
 * @returns {Promise<* | void>}
 */
export function putUserRole(payload) {
  return apiCall({
    method: "PUT",
    url: "/v2/update-user-role",
    data: payload,
  });
}

export function getRoles(payload) {
  return apiCall({
    method: "GET",
    url: "/v2/roles",
  });
}

export function getExternalUsers(payload = {}) {
  let url = "/v1/users?filter=external";
  return apiCall({
    method: "GET",
    url: url,
  });
}

/**
 * @param {Object} payload
 * @param {number} payload.user_id
 * @returns {Promise<* | void>}
 */
export function archiveUser(payload) {
  return apiCall({
    method: "DELETE",
    url: "/v2/archived-user",
    data: payload,
  });
}

/**
 * @param {Object} payload
 * @param {number} payload.user_id
 * @returns {Promise<* | void>}
 */
export function unarchiveUser(payload) {
  return apiCall({
    method: "PUT",
    url: "/v2/un-archived-user",
    data: payload,
  });
}

/**
 * @param {Object} payload
 * @param {number} payload.user_id
 * @returns {Promise<* | void>}
 */
export function deactivateUser(payload) {
  return apiCall({
    method: "DELETE",
    url: "/v2/deactivate-user",
    data: payload,
  });
}

/**
 * @param {Object} payload
 * @param {number} payload.user_id
 * @returns {Promise<* | void>}
 */
export function activateUser(payload) {
  return apiCall({
    method: "PUT",
    url: "/v2/activate-user",
    data: payload,
  });
}

export function getArchivedUsers(payload = {}) {
  let url = "/v1/users?filter=archive";
  return apiCall({
    method: "GET",
    url: url,
  });
}

export function deleteUser(payload) {
  return apiCall({
    method: "DELETE",
    url: `/users/${payload.user_id}`,
  });
}

export function getUsersWithoutActivity(payload) {
  return apiCall({
    method: "GET",
    url: "/users/inactive",
  });
}

export function resendInvitation(payload) {
  return apiCall({
    method: "POST",
    url: "/v2/resend-email",
    data: payload,
  });
}

export function deleteInvitedUser(payload) {
  return apiCall({
    method: "DELETE",
    url: `/users/invited/remove/${payload.user_id}`,
  });
}

export function getTeams(payload) {
  return apiCall({
    method: "GET",
    url: "/v2/team",
  });
}

export function postTeam(payload) {
  return apiCall({
    method: "POST",
    url: "/v2/team",
    data: payload,
  });
}

export function putTeam(payload) {
  return apiCall({
    method: "PUT",
    url: `/v2/team/${payload.id}`,
    data: payload,
  });
}

export function deleteTeam(payload) {
  return apiCall({
    method: "DELETE",
    url: `/v2/team/${payload.id}`,
    data: payload,
  });
}

export function addTeamMember(payload) {
  return apiCall({
    method: "POST",
    url: "/v2/team/add-member",
    data: payload,
  });
}
