import { apiCall } from "./service";
//import { objToUrlParams } from "../../helpers/commonFunctions";

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
