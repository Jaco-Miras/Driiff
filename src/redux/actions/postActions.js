import dispatchActionToReducer, { SimpleDispatchActionToReducer } from "../actionDispatcher";
import {
  deleteComment as deleteCommentService,
  deletePost as deletePostService,
  fetchComments as fetchCommentsService,
  fetchPost as fetchPostService,
  fetchPosts as fetchPostsService,
  fetchRecentPosts as fetchRecentPostsService,
  fetchTagCounter as fetchTagCounterService,
  getCompanyPosts as getCompanyPostsService,
  postArchive as postArchiveService,
  postClap as postClapService,
  postComment as postCommentService,
  postCommentClap as postCommentClapService,
  postCompanyPosts as postCompanyPostsService,
  postCreate as postCreateService,
  postFavorite as postFavoriteService,
  postFollow as postFollowService,
  postMarkDone as postMarkDoneService,
  postMarkRead as postMarkReadService,
  postSnooze as postSnoozeService,
  postToggleRead as postToggleReadService,
  postUnfollow as postUnfollowService,
  postVisit as postVisitService,
  putComment as putCommentService,
  putCompanyPosts as putCompanyPostsService,
  putPost as putPostService,
} from "../services";

export function postFavorite(payload, callback) {
  return dispatchActionToReducer(postFavoriteService(payload), "POST_FAVORITE_START", "POST_FAVORITE_SUCCESS", "POST_FAVORRITE_FAIL", callback);
}

export function postMarkDone(payload, callback) {
  return dispatchActionToReducer(postMarkDoneService(payload), "POST_MARK_DONE_START", "POST_MARK_DONE_SUCCESS", "POST_MARK_DONE_FAIL", callback);
}

export function postArchive(payload, callback) {
  return dispatchActionToReducer(postArchiveService(payload), "POST_ARCHIVE_START", "POST_ARCHIVE_SUCCESS", "POST_ARCHIVE_FAIL", callback);
}

export function removePost(payload, callback) {
  return SimpleDispatchActionToReducer("REMOVE_POST", payload, callback);
}

export function postToggleRead(payload, callback) {
  return dispatchActionToReducer(postToggleReadService(payload), "POST_TOGGLE_READ_START", "POST_TOGGLE_READ_SUCCESS", "POST_TOGGLE_READ_FAIL", callback);
}

export function postFollow(payload, callback) {
  return dispatchActionToReducer(postFollowService(payload), "POST_FOLLOW_START", "POST_FOLOW_SUCCESS", "POST_FOLOW_FAIL", callback);
}

export function postUnfollow(payload, callback) {
  return dispatchActionToReducer(postUnfollowService(payload), "POST_UNFOLLOW_START", "POST_UNFOLOW_SUCCESS", "POST_UNFOLOW_FAIL", callback);
}

export function postSnooze(payload, callback) {
  return dispatchActionToReducer(postSnoozeService(payload), "POST_SNOOZE_START", "POST_SNOOZE_SUCCESS", "POST_SNOOZE_FAIL", callback);
}

export function postCreate(payload, callback) {
  return dispatchActionToReducer(postCreateService(payload), "POST_CREATE_START", "POST_CREATE_SUCCESS", "POST_CREATE_FAIL", callback);
}

export function postCompanyPosts(payload, callback) {
  return dispatchActionToReducer(postCompanyPostsService(payload), "POST_COMPANY_POSTS_START", "POST_COMPANY_POSTS_SUCCESS", "POST_COMPANY_POSTS_FAIL", callback);
}

export function putCompanyPosts(payload, callback) {
  return dispatchActionToReducer(putCompanyPostsService(payload), "PUT_COMPANY_POSTS_START", "PUT_COMPANY_POSTS_SUCCESS", "PUT_COMPANY_POSTS_FAIL", callback);
}

export function postComment(payload, callback) {
  return dispatchActionToReducer(postCommentService(payload), "POST_COMMENT_START", "POST_COMMENT_SUCCESS", "POST_COMMENT_FAIL", callback);
}

export function fetchComments(payload, callback) {
  return dispatchActionToReducer(fetchCommentsService(payload), "FETCH_COMMENTS_START", "FETCH_COMMENTS_SUCCESS", "FETCH_COMMENTS_FAIL", callback);
}

export function setEditComment(payload, callback) {
  return SimpleDispatchActionToReducer("SET_EDIT_POST_COMMENT", payload, callback);
}

export function putComment(payload, callback) {
  return dispatchActionToReducer(putCommentService(payload), "UPDATE_COMMENT_START", "UPDATE_COMMENT_SUCCESS", "UPDATE_COMMENT_FAIL", callback);
}

export function addComment(payload, callback) {
  return SimpleDispatchActionToReducer("ADD_COMMENT", payload, callback);
}

export function addCommentQuote(payload, callback) {
  return SimpleDispatchActionToReducer("ADD_COMMENT_QUOTE", payload, callback);
}

export function clearCommentQuote(payload, callback) {
  return SimpleDispatchActionToReducer("CLEAR_COMMENT_QUOTE", payload, callback);
}

export function deletePost(payload, callback) {
  return dispatchActionToReducer(deletePostService(payload), "DELETE_POST_START", "DELETE_POST_SUCCESS", "DELETE_POST_FAIL", callback);
}

export function setParentIdForUpload(payload, callback) {
  return SimpleDispatchActionToReducer("SET_PARENT_ID", payload, callback);
}

export function starPostReducer(payload, callback) {
  return SimpleDispatchActionToReducer("STAR_POST_REDUCER", payload, callback);
}

export function incomingPostMarkDone(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_POST_MARK_DONE", payload, callback);
}

export function putPost(payload, callback) {
  return dispatchActionToReducer(putPostService(payload), "UPADATE_POST_START", "UPADATE_POST_SUCCESS", "UPADATE_POST_FAIL", callback);
}

export function incomingPost(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_POST", payload, callback);
}

export function incomingUpdatedPost(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_UPDATED_POST", payload, callback);
}

export function incomingDeletedPost(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_DELETED_POST", payload, callback);
}

export function incomingComment(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_COMMENT", payload, callback);
}

export function postClap(payload, callback) {
  return dispatchActionToReducer(postClapService(payload), "POST_CLAP_START", "POST_CLAP_SUCCESS", "POST_CLAP_FAIL", callback);
}

export function postCommentClap(payload, callback) {
  return dispatchActionToReducer(postCommentClapService(payload), "POST_COMMENT_CLAP_START", "POST_COMMENT_CLAP_SUCCESS", "POST_COMMENT_CLAP_FAIL", callback);
}

export function incomingPostClap(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_POST_CLAP", payload, callback);
}

export function incomingCommentClap(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_COMMENT_CLAP", payload, callback);
}

export function fetchRecentPosts(payload, callback) {
  return dispatchActionToReducer(fetchRecentPostsService(payload), "FETCH_RECENT_POSTS_START", "FETCH_RECENT_POSTS_SUCCESS", "FETCH_RECENT_POSTS_FAIL", callback);
}

export function fetchTagCounter(payload, callback) {
  return dispatchActionToReducer(fetchTagCounterService(payload), "FETCH_TAG_COUNTER_START", "FETCH_TAG_COUNTER_SUCCESS", "FETCH_TAG_COUNTER_FAIL", callback);
}

export function getCompanyPosts(payload, callback) {
  return dispatchActionToReducer(getCompanyPostsService(payload), "GET_COMPANY_POSTS_START", "GET_COMPANY_POSTS_SUCCESS", "GET_COMPANY_POSTS_FAIL", callback);
}

export function addCompanyPostSearchResult(payload, callback) {
  return SimpleDispatchActionToReducer("ADD_COMPANY_POST_SEARCH_RESULT", payload, callback);
}

export function updateCompanyPostFilterSort(payload, callback) {
  return SimpleDispatchActionToReducer("UPDATE_COMPANY_POST_FILTER_SORT", payload, callback);
}

export function fetchPosts(payload, callback) {
  return dispatchActionToReducer(fetchPostsService(payload), "GET_WORKSPACE_POSTS_START", "GET_WORKSPACE_POSTS_SUCCESS", "GET_WORKSPACE_POSTS_FAIL", callback);
}

export function addToWorkspacePosts(payload, callback) {
  return SimpleDispatchActionToReducer("ADD_TO_WORKSPACE_POSTS", payload, callback);
}

export function postVisit(payload, callback) {
  return dispatchActionToReducer(postVisitService(payload), "POST_VISIT_START", "POST_VISIT_SUCCESS", "POST_VISIT_FAIL", callback);
}

export function incomingPostViewer(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_POST_VIEWER", payload, callback);
}

export function archiveReducer(payload, callback) {
    return SimpleDispatchActionToReducer("ARCHIVE_POST_REDUCER", payload, callback);
}

export function incomingReadUnreadReducer(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_READ_UNREAD_REDUCER", payload, callback);
}

export function postMarkRead(payload, callback) {
  return dispatchActionToReducer(postMarkReadService(payload), "POST_VISIT_START", "POST_VISIT_SUCCESS", "POST_VISIT_FAIL", callback);
}

export function mustReadReducer(payload, callback) {
  return SimpleDispatchActionToReducer("MUST_READ_REDUCER", payload, callback);
}

export function deleteComment(payload, callback) {
  return dispatchActionToReducer(deleteCommentService(payload), "DELETE_COMMENT_START", "DELETE_COMMENT_SUCCESS", "DELETE_COMMENT_FAIL", callback);
}

export function incomingDeletedComment(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_DELETED_COMMENT", payload, callback);
}

export function fetchPost(payload, callback) {
  return dispatchActionToReducer(fetchPostService(payload), "GET_POST_START", "GET_POST_SUCCESS", "GET_POST_FAIL", callback);
}
