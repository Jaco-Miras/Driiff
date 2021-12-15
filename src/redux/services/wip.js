// import {getAPIUrl} from "../../helpers/slugHelper";
import { apiCall } from "./service";
//import { objToUrlParams } from "../../helpers/commonFunctions";

/**
 * @param {Object} payload
 * @param {number} payload.group_id
 * @param {string} payload.name
 * @returns {Promise<*>}
 */
export function postSubject(payload) {
  let url = "/v2/proposal/category";
  return apiCall({
    method: "POST",
    url: url,
    data: payload,
  });
}

/**
 * @param {Object} payload
 * @param {number} payload.group_id
 * @param {string} payload.title
 * @param {string} payload.description
 * @param {array} payload.approver_ids
 * @param {string} payload.deadline
 * @param {string} payload.priority
 * @param {number} payload.subject
 * @param {array} payload.file_ids
 * @param {array} payload.file_links
 * @param {array} payload.mention_ids
 * @returns {Promise<*>}
 */
export function postWIP(payload) {
  let url = "/v2/proposal";
  return apiCall({
    method: "POST",
    url: url,
    data: payload,
  });
}

/**
 * @param {Object} payload
 * @param {number} payload.group_id
 * @returns {Promise<*>}
 */
export function getSubjects(payload) {
  let url = `/v2/proposal/category?group_id=${payload.group_id}`;
  return apiCall({
    method: "GET",
    url: url,
  });
}

/**
 * @param {Object} payload
 * @param {number} payload.topic_id
 * @returns {Promise<*>}
 */
export function getWIPs(payload) {
  let url = `/v2/proposal?topic_id=${payload.topic_id}`;
  return apiCall({
    method: "GET",
    url: url,
  });
}

/**
 * @param {Object} payload
 * @param {number} payload.wip_id
 * @returns {Promise<*>}
 */
export function getWIPDetail(payload) {
  let url = `/v2/proposal/detail/${payload.wip_id}`;
  return apiCall({
    method: "GET",
    url: url,
  });
}
