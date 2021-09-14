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
