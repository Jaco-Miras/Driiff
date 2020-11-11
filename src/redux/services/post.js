import { apiCall } from "./index";
import { objToUrlParams } from "../../helpers/commonFunctions";

/**
 * @param {Object} payload
 * @param {number} payload.type_id
 * @param {string} payload.type
 * @returns {Promise<*>}
 */
export function postFavorite(payload) {
  let url = "/v1/favourites";
  return apiCall({
    method: "POST",
    url: url,
    data: payload,
  });
}

/**
 * @param {Object} payload
 * @param {number} payload.post_id
 * @returns {Promise<*>}
 */
export function postMarkDone(payload) {
  let url = "/v1/mark-done";

  return apiCall({
    method: "PATCH",
    url: url,
    data: payload,
    is_shared: payload.is_shared ? true : false,
  });
}

/**
 * @param {Object} payload
 * @param {number} payload.post_id
 * @param {number} payload.is_archived
 * @returns {Promise<*>}
 */
export function postArchive(payload) {
  let url = "/v2/post-toggle-archived";

  return apiCall({
    method: "POST",
    url: url,
    data: payload,
    is_shared: payload.is_shared ? true : false,
  });
}

/**
 * @param {Object} payload
 * @param {number} payload.post_id
 * @param {number} payload.unread
 * @returns {Promise<*>}
 */
export function postToggleRead(payload) {
  let url = "/v2/post-toggle-unread";

  return apiCall({
    method: "POST",
    url: url,
    data: payload,
    is_shared: payload.is_shared ? true : false,
  });
}

/**
 * @param {Object} payload
 * @param {number} payload.post_id
 * @returns {Promise<*>}
 */
export function postFollow(payload) {
  return apiCall({
    method: "PATCH",
    url: `/v1/follows?post_id=${payload.post_id}`,
    data: payload,
    is_shared: payload.is_shared ? true : false,
  });
}

/**
 * @param {Object} payload
 * @param {number} payload.post_id
 * @returns {Promise<*>}
 */
export function postUnfollow(payload) {
  return apiCall({
    method: "DELETE",
    url: `/v1/follows?post_id=${payload.post_id}`,
    data: payload,
    is_shared: payload.is_shared ? true : false,
  });
}

/**
 * @param {Object} payload
 * @param {number} payload.post_id
 * @param {LoDashImplicitStringWrapper} payload.set_time
 * @returns {Promise<*>}
 */
export function postSnooze(payload) {
  let url = "/v1/snooze-post";
  return apiCall({
    method: "POST",
    url,
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
export function postCreate(payload) {
  let url = "/v1/posts";
  return apiCall({
    method: "POST",
    url: url,
    data: payload,
  });
}

/**
 * @param {Object} payload
 * @param {number} payload.tag_ids
 * @param {string} payload.title
 * @param {string} payload.body
 * @param {string} payload.status
 * @param {array} payload.recipient_ids
 * @param {array} payload.workspace_ids
 * @param {string} payload.type
 * @param {number} payload.personal
 * @returns {Promise<*>}
 */
export function postCompanyPosts(payload) {
  let url = "/v2/company/posts";
  return apiCall({
    method: "POST",
    url: url,
    data: payload,
  });
}

/**
 * @param {Object} payload
 * @param {number} payload.id
 * @param {number} payload.tag_ids
 * @param {string} payload.title
 * @param {string} payload.body
 * @param {string} payload.status
 * @param {array} payload.recipient_ids
 * @param {array} payload.workspace_ids
 * @param {string} payload.type
 * @param {number} payload.personal
 * @returns {Promise<*>}
 */
export function putCompanyPosts(payload) {
  let url = `/v2/company/posts/${payload.id}`;
  return apiCall({
    method: "PUT",
    url: url,
    data: payload,
  });
}

//http://24.driff.local/api/?tag_ids[]=2&type=post&rating=neutral&must_read=1&must_reply=1&read_only=0&personal=1

/**
 * @param {Object} payload
 * @param {number} payload.body
 * @param {array} payload.file_ids
 * @param {array} payload.mention_ids
 * @param {number} payload.post_id
 * @param {number} payload.personalized_for_id
 * @param {number} payload.parent_id
 * @param {number} payload.reference_id
 * @returns {Promise<*>}
 */
export function postComment(payload) {
  let url = "/v1/messages";
  return apiCall({
    method: "POST",
    url: url,
    data: payload,
  });
}

export function fetchComments(payload) {
  return apiCall({
    method: "GET",
    url: payload.url,
  });
}

/**
 * @param {Object} payload
 * @param {number} payload.body
 * @param {array} payload.file_ids
 * @param {array} payload.mention_ids
 * @param {number} payload.post_id
 * @param {number} payload.personalized_for_id
 * @param {number} payload.parent_id
 * @param {number} payload.reference_id
 * @returns {Promise<*>}
 */
export function putComment(payload) {
  let url = `/v1/messages/${payload.id}`;
  return apiCall({
    method: "PUT",
    url: url,
    data: payload,
  });
}

export function deletePost(payload) {
  let url = `/v1/posts/${payload.id}`;
  return apiCall({
    method: "DELETE",
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
export function putPost(payload) {
  let url = `/v1/posts/${payload.id}`;
  return apiCall({
    method: "PUT",
    url: url,
    data: payload,
  });
}

/**
 * @param {Object} payload
 * @param {number} payload.post_id
 * @param {number} payload.clap
 * @param {number} payload.personalized_for_id
 * @param {id} payload.id
 * @returns {Promise<*>}
 */
export function postClap(payload) {
  let url = "/v1/post-clap";
  return apiCall({
    method: "POST",
    url: url,
    data: payload,
  });
}

/**
 * @param {Object} payload
 * @param {number} payload.skip
 * @param {number} payload.limit
 * @param {string} payload.search
 * @param {array}  payload.filters
 * @returns {Promise<*>}
 */
export function getCompanyPosts(payload) {
  const {skip = 0, limit = 25, search = "", filters = []} = payload;
  let url = `/v2/company/posts?&skip=${skip}&limit=${limit}`;
  if (search !== "") {
    url += `&search=${search}`;
  }
  if (!!filters.length) {
    filters.forEach((f, i) => {
      url += `&filter[${i}]=${f}`;
    })
  }
  return apiCall({
    method: "GET",
    url: url,
    data: payload,
  });
}

/**
 * @param {Object} payload
 * @param {number} payload.id
 * @param {string} payload.reaction
 * @param {number} payload.counter
 * @returns {Promise<*>}
 */
export function postCommentClap(payload) {
  let url = `/messages/${payload.id}/reactions`;
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
export function fetchRecentPosts(payload) {
  let url = `/v2/workspace-dashboard-recent-posts?topic_id=${payload.topic_id}`;
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
export function fetchTagCounter(payload) {
  let url = `/v2/post-tags-entries?topic_id=${payload.topic_id}`;
  return apiCall({
    method: "GET",
    url: url,
    data: payload,
  });
}

/**
 * @param {Object} payload
 * @param {number} payload.skip
 * @param {number} payload.limit
 * @param {string} payload.search
 * @param {array}  payload.filters
 * @returns {Promise<*>}
 */

/*export function getCompanyPosts(payload) {
  const {skip = 0, limit = 100, search = "", filters = []} = payload;
  let url = `/v2/company/posts?&skip=${skip}&limit=${limit}`;
  if (search !== "") {
    url += `&search=${search}`;
  }
  if (!!filters.length) {
    filters.forEach((f, i) => {
      url += `&filter[${i}]=${f}`;
    })
  }
  return apiCall({
    method: "GET",
    url: url,
    data: payload,
  });
}*/

/**
 * @param {Object} payload
 * @param {number} payload.topic_id
 * @param {string} payload.search
 * @param {array}  payload.filters
 * @returns {Promise<*>}
 */
export function fetchPosts(payload) {
  let url = `/v1/posts?topic_id=${payload.topic_id}&skip=0&limit=100`;
  if (payload.search !== undefined) {
    url += `&search=${payload.search}`;
  }
  if (payload.filters !== undefined) {
    for (var i = 0; i < payload.filters.length; i++) {
      url += `&filter[${i}]=${payload.filters[i]}`;
    }
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
 * @param {number} payload.personal_for_id
 * @returns {Promise<*>}
 */
export function postVisit(payload) {
  let url = "/v1/post-viewed";
  return apiCall({
    method: "POST",
    url: url,
    data: payload,
  });
}

/**
 * @param {Object} payload
 * @param {number} payload.post_id
 * @param {number} payload.personal_for_id
 * @param {number} payload.mark_as_read
 * @returns {Promise<*>}
 */

export function postMarkRead(payload) {
  let url = "/v1/post-mark-as-read";
  return apiCall({
    method: "POST",
    url: url,
    data: payload,
  });
}

/**
 * @param {Object} payload
 * @param {number} payload.comment_id
 * @returns {Promise<*>}
 */
export function deleteComment(payload) {
  let url = `/v1/messages/${payload.comment_id}`;
  return apiCall({
    method: "DELETE",
    url,
  });
}

/**
 * @param {Object} payload
 * @param {number} payload.post_id
 * @returns {Promise<*>}
 */
export function fetchPost(payload) {
  return apiCall({
    method: "GET",
    url: `/v1/posts/${payload.post_id}`,
    data: payload,
  });
}

/**
 * @param {Object} payload
 * @param {number} payload.post_id
 * @returns {Promise<*>}
 */
export function getPostClapHover(payload) {
  return apiCall({
    method: "GET",
    url: `/v1/post-clap-hover/?${objToUrlParams(payload)}`,
    data: payload,
  });
}

/**
 * @param {Object} payload
 * @param {number} payload.message_id
 * @returns {Promise<*>}
 */
export function getReplyClapHover(payload) {
  return apiCall({
    method: "GET",
    url: `/v1/reply-clap-hover/?${objToUrlParams(payload)}`,
    data: payload,
  });
}

export function getUnreadPostEntries(payload) {
  return apiCall({
    method: "GET",
    url: `/v2/post-unread-entries`,
  });
}

/**
 * @param {Object} payload
 * @param {number} payload.topic_id
 * @returns {Promise<*>}
 */
export function markAllPostAsRead(payload) {
  return apiCall({
    method: "PUT",
    url: `/v2/marked-post-read/all`,
    data: payload,
  });
}

/**
 * @param {Object} payload
 * @param {number} payload.topic_id
 * @returns {Promise<*>}
 */
export function archiveAllPosts(payload) {
  return apiCall({
    method: "PUT",
    url: `/v2/archived-post/all`,
    data: payload,
  });
}