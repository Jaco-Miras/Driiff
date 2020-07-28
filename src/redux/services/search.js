import { objToUrlParams } from "../../helpers/commonFunctions";
import { apiCall } from "./index";

export function globalSearch(payload) {
  return apiCall({
    method: "GET",
    url: `/v2/global-search?${objToUrlParams(payload)}`,
    // url: `/v2/global-search`,
    // data: payload
  });
}
