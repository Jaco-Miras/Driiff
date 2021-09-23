import { apiCall, apiNoTokenCall } from "./index";

export function getDriffCompSettings(payload) {
  return apiNoTokenCall({
    method: "GET",
    url: "/comp-settings",
    data: payload,
  });
}

export function getDriffSettings(payload) {
  return apiCall({
    method: "GET",
    url: "/v1/settings",
    data: payload,
  });
}

export function getUserSettings(payload) {
  return apiCall({
    method: "GET",
    url: "/v2/user-settings",
    data: payload,
  });
}

export function updateUserSettings(payload) {
  return apiCall({
    method: "PUT",
    url: "/v2/user-settings",
    data: payload,
  });
}

export function putCompanyUpdateName(payload) {
  return apiCall({
    method: "PUT",
    url: "/v2/company/update-name",
    data: payload,
  });
}
