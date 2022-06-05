import { apiCall } from "./service";

export function getLoginSettings(payload) {
  return apiCall({
    method: "GET",
    url: "/v2/login-option-settings",
  });
}

export function putLoginSettings(payload) {
  return apiCall({
    method: "PUT",
    url: "/v2/login-option-settings",
    data: payload,
  });
}

export function getGoogleAuthSettings(payload) {
  return apiCall({
    method: "POST",
    url: "/v2/google-drive-settings/auth",
    data: payload
  });
}

export function postRevokeGoogleToken() {
  return apiCall({
    method: "POST",
    url: "/google-drive/revoke-token"    
  });
}

export function getGoogleAuth(payload) {
  return apiCall({
    method: "POST",
    url: "/gdrive-auth",
    data: payload
  });
}

export function putQuickLinks(payload) {
  return apiCall({
    method: "PUT",
    url: "/v2/quick-link",
    data: payload,
  });
}

export function postQuickLinks(payload) {
  return apiCall({
    method: "POST",
    url: "/v2/quick-link",
    data: payload,
  });
}

export function getUserBot(payload) {
  return apiCall({
    method: "GET",
    url: "/v2/user-bot-settings",
  });
}

export function deleteUserBot(payload) {
  return apiCall({
    method: "DELETE",
    url: `/v2/user-bot-settings/${payload.id}`,
    data: payload,
  });
}

export function putUserBot(payload) {
  return apiCall({
    method: "PUT",
    url: `/v2/user-bot-settings/${payload.id}`,
    data: payload,
  });
}

export function postUserBot(payload) {
  return apiCall({
    method: "POST",
    url: "/v2/user-bot-settings",
    data: payload,
  });
}

export function getGrippBot(payload) {
  return apiCall({
    method: "GET",
    url: "/v2/gripp-bot-settings",
  });
}

// {
//   "bot_name": "test name edited",
//   "new_ch_ids": [345],
//   "remove_ch_ids": []
// }
export function putGrippBot(payload) {
  return apiCall({
    method: "PUT",
    url: `/v2/gripp-bot-settings/${payload.id}`,
    data: payload,
  });
}

export function postUploadUserBotIcon(payload) {
  const { id } = payload;
  return apiCall({
    method: "POST",
    url: `/v2/user-bot-settings/upload-bot-image/${id}`,
    hasFile: true,
    data: payload,
  });
}

export function getGrippDetails(payload) {
  return apiCall({
    method: "GET",
    url: "/v2/gripp/details",
  });
}

export function getGrippUsers(payload) {
  return apiCall({
    method: "GET",
    url: "/v2/gripp/sync/users",
  });
}

export function postSyncGrippUsers(payload) {
  return apiCall({
    method: "POST",
    url: "/v2/gripp/sync/users",
    data: payload,
  });
}

export function resetGrippUsersImage(payload) {
  return apiCall({
    method: "POST",
    url: "/v2/gripp/reset",
    data: payload,
  });
}

export function createCheckoutSession(payload) {
  return apiCall({
    method: "POST",
    url: "/stripe/checkout",
    data: payload,
  });
}

export function getStripePricing(payload) {
  return apiCall({
    method: "GET",
    url: "/stripe/pricing",
  });
}

export function getStripeProducts(payload) {
  return apiCall({
    method: "GET",
    url: "/stripe/products",
  });
}

export function cancelStripeSubscription(payload) {
  return apiCall({
    method: "PUT",
    url: "/stripe/cancel-subscriptions",
  });
}

export function resetCompanyLogo(payload) {
  return apiCall({
    method: "PUT",
    url: "/v1/file-logo-reset",
  });
}

export function putPostAccess(payload) {
  return apiCall({
    method: "PUT",
    url: "/v2/post-access-users",
    data: payload,
  });
}

export function getPostAccess(payload) {
  return apiCall({
    method: "GET",
    url: "/v2/post-access-users",
  });
}

export function getNotificationSettings(payload) {
  return apiCall({
    method: "GET",
    url: "/v2/notification-settings",
  });
}

export function putNotificationSettings(payload) {
  return apiCall({
    method: "PUT",
    url: "/v2/notification-settings",
    data: payload,
  });
}

export function getSecuritySettings(payload) {
  return apiCall({
    method: "GET",
    url: "/v2/security-settings",
  });
}

export function putSecuritySettings(payload) {
  return apiCall({
    method: "PUT",
    url: "/v2/security-settings",
    data: payload,
  });
}

export function sendRequestPassword(payload) {
  return apiCall({
    method: "POST",
    url: "/v2/security-settings/send-refresh-password",
    data: payload,
  });
}

export function uploadDashboardBg(payload) {
  let url = "/v2/company-settings/file-background";
  return apiCall({
    method: "POST",
    url: url,
    data: payload,
    hasFile: true,
  });
}

export function putCompanyDescription(payload) {
  return apiCall({
    method: "PUT",
    url: `/v2/workspace/company/${payload.id}`,
    data: payload,
  });
}

export function getAllWorkspaces(payload) {
  return apiCall({
    method: "GET",
    url: `/v2/all-workspaces?page=${payload.page}&limit=${payload.limit}`,
    data: payload,
  });
}

export function getMeetingSettings(payload) {
  return apiCall({
    method: "GET",
    url: "/v2/meeting-settings",
    data: payload,
  });
}

export function putMeetingSettings(payload) {
  return apiCall({
    method: "PUT",
    url: "/v2/meeting-settings",
    data: payload,
  });
}
