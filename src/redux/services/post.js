import { apiCall } from "./index";
import { objToUrlParams } from "../../helpers/commonFunctions";

/**
 * @param {Object} payload
 * @param {number} payload.type_id
 * @param {string} payload.type
 * @returns {Promise<*>}
 */
export function postFavorite(payload) {
  let sharedPayload;
  if (payload.sharedPayload) {
    sharedPayload = payload.sharedPayload;
    delete payload.sharedPayload;
  }
  let url = "/v1/favourites";
  return apiCall({
    method: "POST",
    url: url,
    data: payload,
    sharedPayload: sharedPayload,
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
  let sharedPayload;
  if (payload.sharedPayload) {
    sharedPayload = payload.sharedPayload;
    delete payload.sharedPayload;
  }
  let url = "/v2/post-toggle-archived";

  return apiCall({
    method: "POST",
    url: url,
    data: payload,
    sharedPayload: sharedPayload,
  });
}

/**
 * @param {Object} payload
 * @param {number} payload.post_id
 * @param {number} payload.unread
 * @returns {Promise<*>}
 */
export function postToggleRead(payload) {
  // let sharedPayload;
  // // if (payload.sharedPayload) {
  // //   sharedPayload = payload.sharedPayload;
  // //   delete payload.sharedPayload;
  // // }
  let url = "/v2/post-toggle-unread";
  return apiCall({
    method: "POST",
    url: url,
    data: payload,
    sharedPayload: payload.sharedPayload,
  });
}

/**
 * @param {Object} payload
 * @param {number} payload.post_id
 * @returns {Promise<*>}
 */
export function postFollow(payload) {
  let sharedPayload;
  if (payload.sharedPayload) {
    sharedPayload = payload.sharedPayload;
    delete payload.sharedPayload;
  }
  return apiCall({
    method: "PATCH",
    url: `/v1/follows?post_id=${payload.post_id}`,
    data: payload,
    sharedPayload: sharedPayload,
  });
}

/**
 * @param {Object} payload
 * @param {number} payload.post_id
 * @returns {Promise<*>}
 */
export function postUnfollow(payload) {
  let sharedPayload;
  if (payload.sharedPayload) {
    sharedPayload = payload.sharedPayload;
    delete payload.sharedPayload;
  }
  return apiCall({
    method: "DELETE",
    url: `/v1/follows?post_id=${payload.post_id}`,
    data: payload,
    sharedPayload: sharedPayload,
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
  let sharedPayload;
  if (payload.sharedPayload) {
    sharedPayload = payload.sharedPayload;
    delete payload.sharedPayload;
  }
  let url = "/v1/posts";
  return apiCall({
    method: "POST",
    url: url,
    data: payload,
    sharedPayload: sharedPayload,
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
 * @param {number} payload.channel_id
 * @param {number} payload.reference_id
 * @returns {Promise<*>}
 */
export function postComment(payload) {
  let sharedPayload;
  if (payload.sharedPayload) {
    sharedPayload = payload.sharedPayload;
    delete payload.sharedPayload;
  }
  let url = "/v1/messages";
  return apiCall({
    method: "POST",
    url: url,
    data: payload,
    sharedPayload: sharedPayload,
  });
}

export function fetchComments(payload) {
  let sharedPayload;
  if (payload.sharedPayload) {
    sharedPayload = payload.sharedPayload;
    delete payload.sharedPayload;
  }
  return apiCall({
    method: "GET",
    url: payload.url,
    sharedPayload: sharedPayload,
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
  let sharedPayload;
  if (payload.sharedPayload) {
    sharedPayload = payload.sharedPayload;
    delete payload.sharedPayload;
  }
  let url = `/v1/messages/${payload.id}`;
  return apiCall({
    method: "PUT",
    url: url,
    data: payload,
    sharedPayload: sharedPayload,
  });
}

export function deletePost(payload) {
  let sharedPayload;
  if (payload.sharedPayload) {
    sharedPayload = payload.sharedPayload;
    delete payload.sharedPayload;
  }
  let url = `/v1/posts/${payload.id}`;
  return apiCall({
    method: "DELETE",
    url: url,
    data: payload,
    sharedPayload: sharedPayload,
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
  let sharedPayload;
  if (payload.sharedPayload) {
    sharedPayload = payload.sharedPayload;
    delete payload.sharedPayload;
  }
  let url = `/v1/posts/${payload.id}`;
  return apiCall({
    method: "PUT",
    url: url,
    data: payload,
    sharedPayload: sharedPayload,
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
  let sharedPayload;
  if (payload.sharedPayload) {
    sharedPayload = payload.sharedPayload;
    delete payload.sharedPayload;
  }
  let url = "/v1/post-clap";
  return apiCall({
    method: "POST",
    url: url,
    data: payload,
    sharedPayload: sharedPayload,
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
  const { skip = 0, limit = 25, search = "", filters = [] } = payload;
  let url = `/v2/company/posts?&skip=${skip}&limit=${limit}`;
  if (search !== "") {
    url += `&search=${search}`;
  }
  if (filters.length) {
    filters.forEach((f, i) => {
      url += `&filter[${i}]=${f}`;
    });
  }
  url += "&filter_by=all";

  if (payload.cancelToken) {
    return apiCall({
      method: "GET",
      url: url,
      data: payload,
      cancelToken: payload.cancelToken,
    });
  } else {
    return apiCall({
      method: "GET",
      url: url,
      data: payload,
    });
  }
}

/**
 * @param {Object} payload
 * @param {number} payload.id
 * @param {string} payload.reaction
 * @param {number} payload.counter
 * @returns {Promise<*>}
 */
export function postCommentClap(payload) {
  let sharedPayload;
  if (payload.sharedPayload) {
    sharedPayload = payload.sharedPayload;
    delete payload.sharedPayload;
  }
  let url = `/messages/${payload.id}/reactions`;
  return apiCall({
    method: "POST",
    url: url,
    data: payload,
    sharedPayload: sharedPayload,
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
  const { skip = 0, limit = 15 } = payload;
  let sharedPayload;
  if (payload.sharedPayload) {
    sharedPayload = payload.sharedPayload;
    delete payload.sharedPayload;
  }
  let url = `/v1/posts?topic_id=${payload.topic_id}&skip=${skip}&limit=${limit}`;
  if (payload.search !== undefined) {
    url += `&search=${payload.search}`;
  }
  if (payload.filters !== undefined) {
    for (var i = 0; i < payload.filters.length; i++) {
      url += `&filter[${i}]=${payload.filters[i]}`;
    }
  }
  if (payload.cancelToken) {
    return apiCall({
      method: "GET",
      url: url,
      data: payload,
      cancelToken: payload.cancelToken,
      sharedPayload: sharedPayload,
    });
  } else {
    return apiCall({
      method: "GET",
      url: url,
      data: payload,
      sharedPayload: sharedPayload,
    });
  }
}

/**
 * @param {Object} payload
 * @param {number} payload.post_id
 * @param {number} payload.personal_for_id
 * @returns {Promise<*>}
 */
export function postVisit(payload) {
  let sharedPayload;
  if (payload.sharedPayload) {
    sharedPayload = payload.sharedPayload;
    delete payload.sharedPayload;
  }
  let url = "/v1/post-viewed";
  return apiCall({
    method: "POST",
    url: url,
    data: payload,
    sharedPayload: sharedPayload,
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
  let sharedPayload;
  if (payload.sharedPayload) {
    sharedPayload = payload.sharedPayload;
    delete payload.sharedPayload;
  }
  let url = `/v1/messages/${payload.comment_id}`;
  return apiCall({
    method: "DELETE",
    url,
    sharedPayload: sharedPayload,
  });
}

/**
 * @param {Object} payload
 * @param {number} payload.post_id
 * @returns {Promise<*>}
 */
export function fetchPost(payload) {
  let sharedPayload;
  if (payload.sharedPayload) {
    sharedPayload = payload.sharedPayload;
    delete payload.sharedPayload;
  }
  return apiCall({
    method: "GET",
    url: `/v1/posts/${payload.post_id}`,
    data: payload,
    sharedPayload: sharedPayload,
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

export function getUnreadPostEntries(payload) {
  return apiCall({
    method: "GET",
    url: "/v2/post-unread-entries",
  });
}

/**
 * @param {Object} payload
 * @param {number} payload.topic_id
 * @returns {Promise<*>}
 */
export function markAllPostAsRead(payload) {
  let sharedPayload;
  if (payload.sharedPayload) {
    sharedPayload = payload.sharedPayload;
    delete payload.sharedPayload;
  }
  return apiCall({
    method: "PUT",
    url: "/v2/marked-post-read/all",
    data: payload,
    sharedPayload: sharedPayload,
  });
}

/**
 * @param {Object} payload
 * @param {number} payload.topic_id
 * @returns {Promise<*>}
 */
export function archiveAllPosts(payload) {
  let sharedPayload;
  if (payload.sharedPayload) {
    sharedPayload = payload.sharedPayload;
    delete payload.sharedPayload;
  }
  return apiCall({
    method: "PUT",
    url: "/v2/archived-post/all",
    data: payload,
    sharedPayload: sharedPayload,
  });
}

/**
 * @param {Object} payload
 * @param {number} payload.post_id
 * @param {array} payload.recipient_ids
 * @returns {Promise<*>}
 */
export function addPostRecipients(payload) {
  return apiCall({
    method: "POST",
    url: "/v2/add-post-recipients",
    data: payload,
  });
}

/**
 * @param {Object} payload
 * @returns {Promise<*>}
 */
export function refetchPosts() {
  return apiCall({
    method: "POST",
    url: "/v2/re-fetch-module/posts",
  });
}

/**
 * @param {Object} payload
 * @returns {Promise<*>}
 */
export function refetchPostComments(payload) {
  return apiCall({
    method: "POST",
    url: `/v2/re-fetch-module/get-comments?current_post_id=${payload.post_id}`,
  });
}

/**
 * @param {Object} payload
 * @returns {Promise<*>}
 */
export function getUnreadPostComments(payload) {
  return apiCall({
    method: "GET",
    url: "/v2/post-unread-comments-entries",
  });
}

/**
 * @param {Object} payload
 * @param {number} payload.message_id
 * @param {number} payload.is_important
 * @returns {Promise<*>}
 */
export function putCommentImportant(payload) {
  let sharedPayload;
  if (payload.sharedPayload) {
    sharedPayload = payload.sharedPayload;
    delete payload.sharedPayload;
  }
  return apiCall({
    method: "PUT",
    url: "/v2/set-important-comment",
    data: payload,
    sharedPayload: sharedPayload,
  });
}

export function getUnreadWorkspacePostEntries(payload) {
  let sharedPayload;
  if (payload.sharedPayload) {
    sharedPayload = payload.sharedPayload;
    delete payload.sharedPayload;
  }
  return apiCall({
    method: "GET",
    url: `/v2/post-unread-entries?topic_id=${payload.topic_id}`,
    sharedPayload: sharedPayload,
  });
}

export function postApprove(payload) {
  let sharedPayload;
  if (payload.sharedPayload) {
    sharedPayload = payload.sharedPayload;
    delete payload.sharedPayload;
  }
  return apiCall({
    method: "POST",
    url: "/v2/post-approve",
    data: payload,
    sharedPayload: sharedPayload,
  });
}

export function commentApprove(payload) {
  let sharedPayload;
  if (payload.sharedPayload) {
    sharedPayload = payload.sharedPayload;
    delete payload.sharedPayload;
  }
  return apiCall({
    method: "POST",
    url: "/v2/post-comment-approve",
    data: payload,
    sharedPayload: sharedPayload,
  });
}

/**
 * @param {Object} payload
 * @param {number} payload.post_id
 * @returns {Promise<*>}
 */
export function getPostRead(payload) {
  return apiCall({
    method: "GET",
    url: `/v2/get-post-read/?${objToUrlParams(payload)}`,
    data: payload,
  });
}

/**
 * @param {Object} payload
 * @param {number} payload.post_id
 * @returns {Promise<*>}
 */
export function postClose(payload) {
  let sharedPayload;
  if (payload.sharedPayload) {
    sharedPayload = payload.sharedPayload;
    delete payload.sharedPayload;
  }
  return apiCall({
    method: "POST",
    url: "/v2/post-close",
    data: payload,
    sharedPayload: sharedPayload,
  });
}

/**
 * @returns {Promise<*>}
 */
export function getPostList(payload) {
  let sharedPayload;
  if (payload.sharedPayload) {
    sharedPayload = payload.sharedPayload;
    delete payload.sharedPayload;
  }
  return apiCall({
    method: "GET",
    url: "/v2/user-post-list",
    sharedPayload: sharedPayload,
  });
}

/**
 * @param {Object} payload
 * @param {string} payload.name
 * @returns {Promise<*>}
 */
export function createPostList(payload) {
  let sharedPayload;
  if (payload.sharedPayload) {
    sharedPayload = payload.sharedPayload;
    delete payload.sharedPayload;
  }
  return apiCall({
    method: "POST",
    url: "/v2/user-post-list",
    data: payload,
    sharedPayload: sharedPayload,
  });
}

/**
 * @param {Object} payload
 * @param {string} payload.name
 * @returns {Promise<*>}
 */
export function updatePostList(payload, id) {
  let sharedPayload;
  if (payload.sharedPayload) {
    sharedPayload = payload.sharedPayload;
    delete payload.sharedPayload;
  }
  return apiCall({
    method: "PUT",
    url: `/v2/user-post-list/${id}`,
    data: payload,
    sharedPayload: sharedPayload,
  });
}

/**
 * @returns {Promise<*>}
 */
export function deletePostList(payload, id) {
  let sharedPayload;
  if (payload.sharedPayload) {
    sharedPayload = payload.sharedPayload;
    delete payload.sharedPayload;
  }
  return apiCall({
    method: "DELETE",
    url: `/v2/user-post-list/${id}`,
    sharedPayload: sharedPayload,
  });
}

/**
 * @param {Object} payload
 * @param {number} payload.post_id
 * @param {number} payload.link_id
 * @returns {Promise<*>}
 */
export function postListConnect(payload) {
  let sharedPayload;
  if (payload.sharedPayload) {
    sharedPayload = payload.sharedPayload;
    delete payload.sharedPayload;
  }
  return apiCall({
    method: "POST",
    url: "/v2/post-list-connect",
    data: payload,
    sharedPayload: sharedPayload,
  });
}

/**
 * @param {Object} payload
 * @param {number} payload.post_id
 * @param {number} payload.link_id
 * @returns {Promise<*>}
 */
export function postListDisconnect(payload) {
  let sharedPayload;
  if (payload.sharedPayload) {
    sharedPayload = payload.sharedPayload;
    delete payload.sharedPayload;
  }
  return apiCall({
    method: "DELETE",
    url: "/v2/post-list-disconnected",
    data: payload,
    sharedPayload: sharedPayload,
  });
}

/**
 * @param {Object} payload
 * @param {number} payload.post_id
 * @param {number} payload.must_reply
 * @param {number} payload.must_read
 * @returns {Promise<*>}
 */
export function postRequired(payload) {
  let sharedPayload;
  if (payload.sharedPayload) {
    sharedPayload = payload.sharedPayload;
    delete payload.sharedPayload;
  }
  return apiCall({
    method: "POST",
    url: "/v2/post-required",
    data: payload,
    sharedPayload: sharedPayload,
  });
}

export function readNotification(payload) {
  let sharedPayload;
  if (payload.sharedPayload) {
    sharedPayload = payload.sharedPayload;
    delete payload.sharedPayload;
  }
  return apiCall({
    method: "POST",
    url: "/v2/toggle-notification-unread",
    data: payload,
    sharedPayload: sharedPayload,
  });
}

export function checkPostAccess(payload) {
  return apiCall({
    method: "GET",
    url: `/v2/check-post-participant?post_id=${payload.id}`,
    data: payload,
  });
}

export function getPostReadAndClap(payload) {
  let sharedPayload;
  if (payload.sharedPayload) {
    sharedPayload = payload.sharedPayload;
    delete payload.sharedPayload;
  }
  return apiCall({
    method: "GET",
    url: `/v2/get-post-read-and-clap/?post_id=${payload.post_id} `,
    data: payload,
    sharedPayload: sharedPayload,
  });
}

export function getCompanyPostCategoryCounter(payload) {
  return apiCall({
    method: "GET",
    url: "/v2/company/post-category-counter",
    data: payload,
  });
}

export function getCompanyPostsByCategory(payload) {
  let url = `/v2/company/posts?skip=${payload.skip}&limit=${payload.limit}`;
  if (payload.filters !== undefined) {
    for (var i = 0; i < payload.filters.length; i++) {
      url += `&filter[${i}]=${payload.filters[i]}`;
    }
  }
  url += "&filter_by=all";
  return apiCall({
    method: "GET",
    url: url,
    data: payload,
  });
}

export function getWorkspacePostCategoryCounter(payload) {
  let sharedPayload;
  if (payload.sharedPayload) {
    sharedPayload = payload.sharedPayload;
    delete payload.sharedPayload;
  }
  return apiCall({
    method: "GET",
    url: `/v2/post-category-entries?topic_id=${payload.topic_id}`,
    data: payload,
    sharedPayload: sharedPayload,
  });
}

export function getWorkspacePostsByCategory(payload) {
  let sharedPayload;
  if (payload.sharedPayload) {
    sharedPayload = payload.sharedPayload;
    delete payload.sharedPayload;
  }
  let url = `/v1/posts?topic_id=${payload.topic_id}&skip=${payload.skip}&limit=${payload.limit}`;
  if (payload.filters !== undefined) {
    for (var i = 0; i < payload.filters.length; i++) {
      url += `&filter[${i}]=${payload.filters[i]}`;
    }
  }
  return apiCall({
    method: "GET",
    url: url,
    data: payload,
    sharedPayload: sharedPayload,
  });
}
