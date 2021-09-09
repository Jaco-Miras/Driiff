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
// {
//   "bot_name": "Chopper D. Oged",
//   "new_ch_ids": [225, 123],
//   "remove_ch_ids": []
// }
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
