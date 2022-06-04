// import {getAPIUrl} from "../../helpers/slugHelper";
import { apiCall } from "./service";
import { objToUrlParams } from "../../helpers/commonFunctions";

/**
 * @param {Object} payload
 * @param {number} payload.is_external
 * @returns {Promise<*>}
 */
export function getWorkspaces(payload) {
  let url;
  let sharedPayload;
  if (payload.sharedPayload) {
    sharedPayload = payload.sharedPayload;
    delete payload.sharedPayload;
  }
  if (payload.order_by === "channel_date_updated") {
    payload = {
      ...payload,
      order_by: "updated_at",
    };
  }

  url = `/v2/workspace?${objToUrlParams(payload)}`;
  return apiCall({
    method: "GET",
    url: url,
    data: payload,
    sharedPayload: sharedPayload,
  });
}

/**
 * @param {Object} payload
 * @param {string} payload.name
 * @param {string} payload.description
 * @param {number} payload.is_external
 * @param {array} payload.member_ids
 * @returns {Promise<*>}
 */
export function createWorkspace(payload) {
  let url = "/v2/workspace";
  return apiCall({
    method: "POST",
    url: url,
    data: payload,
  });
}

/**
 * @param {Object} payload
 * @param {string} payload.name
 * @param {number} payload.is_external
 * @param {number} payload.workspace_id
 * @returns {Promise<*>}
 */
export function updateWorkspace(payload) {
  let sharedPayload;
  if (payload.sharedPayload) {
    sharedPayload = payload.sharedPayload;
    delete payload.sharedPayload;
  }
  let url = `/v2/workspace/${payload.topic_id}`;
  return apiCall({
    method: "PUT",
    url: url,
    data: payload,
    sharedPayload: sharedPayload,
  });
}

/**
 * @param {Object} payload
 * @param {number} payload.workspace_id
 * @returns {Promise<*>}
 */
export function deleteWorkspace(payload) {
  let url = `/v2/workspace/${payload.workspace_id}`;
  return apiCall({
    method: "DELETE",
    url: url,
    data: payload,
  });
}

/**
 * @param {Object} payload
 * @param {number} payload.workspace_id
 * @param {number} payload.topic_id
 * @returns {Promise<*>}
 */
export function moveWorkspaceTopic(payload) {
  let url = "/v2/move-topic-workspace";
  return apiCall({
    method: "PUT",
    url: url,
    data: payload,
  });
}

/**
 * @param {Object} payload
 * @param {number} payload.is_external
 * @param {string} payload.search
 * @returns {Promise<*>}
 */
export function getWorkspaceTopics(payload) {
  let url = `/v2/workspace-topics?is_external=${payload.is_external}`;
  if (payload.search !== undefined) {
    url += `&search=${payload.search}`;
  }
  return apiCall({
    method: "GET",
    url: url,
    data: payload,
  });
}

/**
 * @param {Object} payload
 * @param {number} payload.post_id
 * @returns {Promise<*>}
 */
export function getWorkspacePostDetail(payload) {
  let url = `/v1/posts/${payload.post_id}`;
  return apiCall({
    method: "GET",
    url: url,
    data: payload,
  });
}

/**
 * @param {Object} payload
 * @param {number} payload.post_id
 * @param {string} payload.title
 * @param {string} payload.body
 * @param {string} payload.status
 * @param {array} payload.recipient_ids
 * @param {array} payload.workspace_ids
 * @param {string} payload.type
 * @param {number} payload.personal
 * @returns {Promise<*>}
 */
export function createWorkspacePost(payload) {
  let url = "/v1/posts";
  return apiCall({
    method: "POST",
    url: url,
    data: payload,
  });
}

/**
 * @param {Object} payload
 * @param {number} payload.post_id
 * @param {string} payload.status
 * @returns {Promise<*>}
 */
export function updatePostStatus(payload) {
  let url = "/v2/posts/status";
  return apiCall({
    method: "PUT",
    url: url,
    data: payload,
  });
}

/**
 * @param {Object} payload
 * @param {number} payload.topic_id
 * @returns {Promise<*>}
 */
export function fetchDetail(payload) {
  let url = `/v2/workspace-dashboard-detail?topic_id=${payload.topic_id}`;
  return apiCall({
    method: "GET",
    url: url,
    data: payload,
  });
}

/**
 * @param {Object} payload
 * @param {number} payload.topic_id
 * @returns {Promise<*>}
 */
export function getPostStatusCount(payload) {
  let url = `/v2/post-tags-entries?topic_id=${payload.topic_id}`;
  return apiCall({
    method: "GET",
    url: url,
    data: payload,
  });
}

/**
 * @param {Object} payload
 * @param {number} payload.group_id
 * @param {number} payload.user_id
 * @param {number} payload.channel_id
 * @param {number} payload.recipient_ids
 * @returns {Promise<*>}
 */
export function joinWorkspace(payload) {
  //let url = "/v1/members";
  let url = "/v2/post-channel-members";
  return apiCall({
    method: "POST",
    url: url,
    data: payload,
  });
}

/**
 * @param {Object} payload
 * @param {number} payload.topic_id
 * @returns {Promise<*>}
 */
export function fetchPrimaryFiles(payload) {
  let url = `/v2/workspace-primary-files?topic_id=${payload.topic_id}`;
  return apiCall({
    method: "GET",
    url: url,
    data: payload,
  });
}

/**
 * @param {Object} payload
 * @param {number} payload.topic_id
 * @returns {Promise<*>}
 */
export function fetchMembers(payload) {
  let url = `/v2/workspace-dashboard-members?topic_id=${payload.topic_id}`;
  return apiCall({
    method: "GET",
    url: url,
    data: payload,
  });
}

/**
 * @param {Object} payload
 * @param {number} payload.topic_id
 * @returns {Promise<*>}
 */
export function fetchTimeline(payload) {
  let url = `/v2/workspace-dashboard-timeline?${objToUrlParams(payload)}`;
  return apiCall({
    method: "GET",
    url: url,
    data: payload,
  });
}

/**
 * @param {Object} payload
 * @param {number} payload.topic_id
 * @returns {Promise<*>}
 */
export function fetchWorkspaceTagCounters(payload) {
  let url = `/v2/post-tags-entries?topic_id=${payload.topic_id}`;
  return apiCall({
    method: "GET",
    url: url,
    data: payload,
  });
}

/**
 * @param {Object} payload
 * @param {number} payload.topic_id
 * @returns {Promise<*>}
 */
export function getWorkspace(payload) {
  let url = `/v2/workspace/${payload.topic_id}`;
  return apiCall({
    method: "GET",
    url: url,
    data: payload,
  });
}

/**
 * @param {Object} payload
 * @param {number} payload.topic_id
 * @param {number} payload.user_id
 * @param {string} payload.role
 * @returns {Promise<*>}
 */
export function postWorkspaceRole(payload) {
  let url = "/v2/workspace-role";
  return apiCall({
    method: "POST",
    url: url,
    data: payload,
  });
}

/**
 * @param {Object} payload
 * @param {number} payload.topic_id
 * @param {number} payload.user_id
 * @returns {Promise<*>}
 */
export function deleteWorkspaceRole(payload) {
  let url = "/v2/workspace-role";
  return apiCall({
    method: "DELETE",
    url: url,
    data: payload,
  });
}

/**
 * @param {Object} payload
 * @param {number} payload.topic_id
 * @returns {Promise<*>}
 */
export function deleteWorkspaceFolder(payload) {
  let url = `/v2/workspace/${payload.topic_id}?is_folder=1`;
  return apiCall({
    method: "DELETE",
    url: url,
    data: payload,
  });
}

/**
 * @param {Object} payload
 * @param {number} payload.folder_id
 * @returns {Promise<*>}
 */
export function getWorkspaceFolder(payload) {
  let url = `/v2/workspace/${payload.folder_id}?is_folder=1`;
  return apiCall({
    method: "GET",
    url: url,
    data: payload,
  });
}

export function getAllWorkspace(payload) {
  if (payload.cancelToken) {
    const cancelToken = payload.cancelToken;
    const dataPayload = { ...payload };
    delete dataPayload.cancelToken;
    const url = `/v2/search-workspace?${objToUrlParams(dataPayload)}`;
    return apiCall({
      method: "GET",
      url: url,
      cancelToken: cancelToken,
    });
  } else {
    const url = `/v2/search-workspace?${objToUrlParams(payload)}`;
    return apiCall({
      method: "GET",
      url: url,
    });
  }
}

export function postResendInvite(payload) {
  return apiCall({
    method: "POST",
    url: "/v2/resend-emails",
    data: payload,
  });
}
/**
 * @param {Object} payload
 * @param {string} payload.id
 * @returns {Promise<*>}
 */
export function createWorkspaceTeamChannel(payload) {
  let url = `/v2/workspace/${payload.id}/team-channel`;
  return apiCall({
    method: "POST",
    url: url,
    //data: payload,
  });
}
/**
 * @param {Object} payload
 * @param {number} payload.id
 * @param {number} payload.workspace_id
 * @param {number} payload.is_pinned
 * @returns {Promise<*>}
 */
export function favouriteWorkspace(payload) {
  let sharedPayload;
  if (payload.sharedPayload) {
    sharedPayload = payload.sharedPayload;
    delete payload.sharedPayload;
  }
  let url = `/v2/workspace/${payload.id}/favourite`;
  return apiCall({
    method: "POST",
    url: url,
    data: payload,
    sharedPayload: sharedPayload,
  });
}

/**
 * @param {Object} payload
 * @returns {Promise<*>}
 */
export function getWorkspaceFilterCount(payload) {
  let url = "/v2/workspace-counter-entries";
  return apiCall({
    method: "GET",
    url: url,
    data: payload,
  });
}

/**
 * @param {Object} payload
 * @returns {Promise<*>}
 */
export function getFavoriteWorkspaceCounters(payload) {
  let sharedPayload;
  if (payload && payload.sharedPayload) {
    sharedPayload = payload.sharedPayload;
    delete payload.sharedPayload;
  }
  let url = "/v2/workspace-favourite-entries";
  return apiCall({
    method: "GET",
    url: url,
    data: payload,
    sharedPayload: sharedPayload,
  });
}

export function getWorkspaceReminders(payload) {
  let sharedPayload;
  if (payload.sharedPayload) {
    sharedPayload = payload.sharedPayload;
    delete payload.sharedPayload;
  }
  let url = `/v2/to-do?${objToUrlParams(payload)}`;
  return apiCall({
    method: "GET",
    url: url,
    data: payload,
    sharedPayload: sharedPayload,
  });
}

export function getWorkspaceRemindersCount(payload) {
  let sharedPayload;
  if (payload.sharedPayload) {
    sharedPayload = payload.sharedPayload;
    delete payload.sharedPayload;
  }
  let url = `/v2/to-do-detail?${objToUrlParams(payload)}`;
  return apiCall({
    method: "GET",
    url: url,
    data: payload,
    sharedPayload: sharedPayload,
  });
}

export function getFavoriteWorkspaces(payload) {
  let url = "/v2/workspace-favourites";
  return apiCall({
    method: "GET",
    url: url,
    data: payload,
  });
}

export function toggleShowAbout(payload) {
  let url = `/v2/workspace-about/${payload.id}`;
  return apiCall({
    method: "PUT",
    url: url,
    data: payload,
  });
}

export function getAllWorkspaceFolders(payload) {
  let url = "/v2/workspace/folders/all";
  return apiCall({
    method: "GET",
    url: url,
    data: payload,
  });
}

export function getExistingFolder(payload) {
  let url = `/v2/workspace/folder/exists?name=${payload.name}`;
  return apiCall({
    method: "GET",
    url: url,
    data: payload,
  });
}

export function putWorkspaceNotification(payload) {
  let sharedPayload;
  if (payload.sharedPayload) {
    sharedPayload = payload.sharedPayload;
    delete payload.sharedPayload;
  }
  let url = `/v2/workspace-active/${payload.id}`;
  return apiCall({
    method: "PUT",
    url: url,
    data: payload,
    sharedPayload: sharedPayload,
  });
}

export function getWorkspaceQuickLinks(payload) {
  let sharedPayload;
  if (payload.sharedPayload) {
    sharedPayload = payload.sharedPayload;
    delete payload.sharedPayload;
  }
  let url = `/v2/workspace/quick-links?topic_id=${payload.workspace_id}`;
  return apiCall({
    method: "GET",
    url: url,
    data: payload,
    sharedPayload: sharedPayload,
  });
}

export function putWorkspaceQuickLinks(payload) {
  let sharedPayload;
  if (payload.sharedPayload) {
    sharedPayload = payload.sharedPayload;
    delete payload.sharedPayload;
  }
  let url = `/v2/workspace/quick-links?topic_id=${payload.workspace_id}`;
  return apiCall({
    method: "PUT",
    url: url,
    data: payload,
    sharedPayload: sharedPayload,
  });
}

export function getRelatedWorkspace(payload) {
  let url = `/v2/workspace-shared/${payload.userId}?skip=${payload.skip}&limit=${payload.limit}`;
  return apiCall({
    method: "GET",
    url: url,
    // data: payload,
  });
}

export function getSharedWorkspaces(payload) {
  let url = "/shared-auth";
  return apiCall({
    method: "GET",
    url: url,
    // data: payload,
  });
}
