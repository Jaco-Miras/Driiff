import dispatchActionToReducer, { SimpleDispatchActionToReducer } from "../actionDispatcher";
import {
  addPostRecipients as addPostRecipientsService,
  archiveAllPosts as archiveAllPostsService,
  commentApprove as commentApproveService,
  deleteComment as deleteCommentService,
  deletePost as deletePostService,
  fetchComments as fetchCommentsService,
  fetchPost as fetchPostService,
  fetchPosts as fetchPostsService,
  fetchRecentPosts as fetchRecentPostsService,
  fetchTagCounter as fetchTagCounterService,
  getCompanyPosts as getCompanyPostsService,
  getPostClapHover as getPostClapHoverService,
  getReplyClapHover as getReplyClapHoverService,
  getUnreadPostComments as getUnreadPostCommentsService,
  getUnreadPostEntries as getUnreadPostEntriesService,
  markAllPostAsRead as markAllPostAsReadService,
  postApprove as postApproveService,
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
  putCommentImportant as putCommentImportantService,
  putCompanyPosts as putCompanyPostsService,
  putPost as putPostService,
  refetchPostComments as refetchPostCommentsService,
  refetchPosts as refetchPostsService,
  getPostRead as getPostReadService,
  postClose as postCloseService,
  getPostList as getPostListService,
  createPostList as createPostListService,
  updatePostList as updatePostListService,
  deletePostList as deletePostListService,
  postListConnect as postListConnectService,
  postListDisconnect as postListDisconnectService,
  postRequired as postRequiredService,
} from "../services";

export function getPostList(payload, callback) {
  return dispatchActionToReducer(getPostListService(payload), "POST_LIST_START", "POST_LIST_SUCCESS", "POST_LIST_FAIL", callback);
}

export function createPostList(payload, callback) {
  return dispatchActionToReducer(createPostListService(payload), "POST_LIST_CREATE_START", "POST_LIST_CREATE_SUCCESS", "POST_LIST_CREATE_FAIL", callback);
}

export function updatePostList(payload, callback) {
  return dispatchActionToReducer(updatePostListService(payload, payload.id), "POST_LIST_UPDATE_START", "POST_LIST_UPDATE_SUCCESS", "POST_LIST_UPDATE_FAIL", callback);
}

export function deletePostList(payload, callback) {
  return dispatchActionToReducer(deletePostListService(payload, payload.id), "POST_LIST_DELETE_START", "POST_LIST_DELETE_SUCCESS", "POST_LIST_DELETE_FAIL", callback);
}

export function postListConnect(payload, callback) {
  return dispatchActionToReducer(postListConnectService(payload), "POST_LIST_CONNECT_START", "POST_LIST_CONNECT_SUCCESS", "POST_LIST_CONNECT_FAIL", callback);
}

export function postListDisconnected(payload, callback) {
  return dispatchActionToReducer(postListDisconnectService(payload), "POST_LIST_DISCONNECT_START", "POST_LIST_DISCONNECT_SUCCESS", "POST_LIST_DISCONNECT_FAIL", callback);
}

export function incomingPostListConnect(payload, callback) {
  return SimpleDispatchActionToReducer("POST_LIST_CONNECT", payload, callback);
}

export function incomingPostListDisconnect(payload, callback) {
  return SimpleDispatchActionToReducer("POST_LIST_DISCONNECT", payload, callback);
}

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

export function setPostToggleFollow(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_POST_TOGGLE_FOLLOW", payload, callback);
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

export function deleteComment(payload, callback) {
  return dispatchActionToReducer(deleteCommentService(payload), "DELETE_COMMENT_START", "DELETE_COMMENT_SUCCESS", "DELETE_COMMENT_FAIL", callback);
}

export function incomingDeletedComment(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_DELETED_COMMENT", payload, callback);
}

export function fetchPost(payload, callback) {
  return dispatchActionToReducer(fetchPostService(payload), "GET_POST_START", "GET_POST_SUCCESS", "GET_POST_FAIL", callback);
}

export function incomingMarkAsRead(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_MARK_AS_READ", payload, callback);
}

export function getPostClapHover(payload, callback) {
  return dispatchActionToReducer(getPostClapHoverService(payload), "GET_POST_CLAP_HOVER_START", "GET_POST_CLAP_HOVER_SUCCESS", "GET_POST_CLAP_HOVER_FAIL", callback);
}

export function getReplyClapHover(payload, callback) {
  return dispatchActionToReducer(getReplyClapHoverService(payload), "GET_REPLY_CLAP_HOVER_START", "GET_REPLY_CLAP_HOVER_SUCCESS", "GET_REPLY_CLAP_HOVER_FAIL", callback);
}

export function getUnreadPostEntries(payload, callback) {
  return dispatchActionToReducer(getUnreadPostEntriesService(payload), "GET_UNREAD_POST_ENTRIES_START", "GET_UNREAD_POST_ENTRIES_SUCCESS", "GET_UNREAD_POST_ENTRIES_FAIL", callback);
}

export function markAllPostAsRead(payload, callback) {
  return dispatchActionToReducer(markAllPostAsReadService(payload), "MARK_ALL_POSTS_AS_READ_START", "MARK_ALL_POSTS_AS_READ_SUCCESS", "MARK_ALL_POSTS_AS_READ_FAIL", callback);
}

export function archiveAllPosts(payload, callback) {
  return dispatchActionToReducer(archiveAllPostsService(payload), "ARCHIVE_ALL_POSTS_START", "ARCHIVE_ALL_POSTS_SUCCESS", "ARCHIVE_ALL_POSTS_FAIL", callback);
}

export function readAllCallback(payload, callback) {
  return SimpleDispatchActionToReducer("READ_ALL_POSTS", payload, callback);
}

export function archiveAllCallback(payload, callback) {
  return SimpleDispatchActionToReducer("ARCHIVE_ALL_POSTS", payload, callback);
}

export function addPostRecipients(payload, callback) {
  return dispatchActionToReducer(addPostRecipientsService(payload), "ADD_POST_RECIPIENTS_START", "ADD_POST_RECIPIENTS_SUCCESS", "ADD_POST_RECIPIENTS_FAIL", callback);
}

export function addUserToPostRecipients(payload, callback) {
  return SimpleDispatchActionToReducer("ADD_USER_TO_POST_RECIPIENTS", payload, callback);
}

export function removeUserToPostRecipients(payload, callback) {
  return SimpleDispatchActionToReducer("REMOVE_USER_TO_POST_RECIPIENTS", payload, callback);
}

export function incomingPostRecipients(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_POST_RECIPIENTS", payload, callback);
}

export function refetchPosts(payload, callback) {
  return dispatchActionToReducer(getCompanyPostsService(payload), "REFETCH_POSTS_START", "REFETCH_POSTS_SUCCESS", "REFETCH_POSTS_FAIL", callback);
}

export function refetchPostComments(payload, callback) {
  return dispatchActionToReducer(refetchPostCommentsService(payload), "REFETCH_POST_COMMENTS_START", "REFETCH_POST_COMMENTS_SUCCESS", "REFETCH_POST_COMMENTS_FAIL", callback);
}

export function getUnreadPostComments(payload, callback) {
  return dispatchActionToReducer(getUnreadPostCommentsService(payload), "GET_UNREAD_POST_COMMENTS_START", "GET_UNREAD_POST_COMMENTS_SUCCESS", "GET_UNREAD_POST_COMMENTS_FAIL", callback);
}

export function addPostReact(payload, callback) {
  return SimpleDispatchActionToReducer("ADD_POST_REACT", payload, callback);
}

export function removePostReact(payload, callback) {
  return SimpleDispatchActionToReducer("REMOVE_POST_REACT", payload, callback);
}

export function addCommentReact(payload, callback) {
  return SimpleDispatchActionToReducer("ADD_COMMENT_REACT", payload, callback);
}

export function removeCommentReact(payload, callback) {
  return SimpleDispatchActionToReducer("REMOVE_COMMENT_REACT", payload, callback);
}

export function fetchDetail(payload, callback) {
  return dispatchActionToReducer(fetchPostService(payload), "GET_POST_DETAIL_START", "GET_POST_DETAIL_SUCCESS", "GET_POST_DETAIL_FAIL", callback);
}

export function searchCompanyPosts(payload, callback) {
  return dispatchActionToReducer(getCompanyPostsService(payload), "SEARCH_COMPANY_POSTS_START", "SEARCH_COMPANY_POSTS_SUCCESS", "SEARCH_COMPANY_POSTS_FAIL", callback);
}

export function updatePostFiles(payload, callback) {
  return SimpleDispatchActionToReducer("UPDATE_POST_FILES", payload, callback);
}

export function updateCommentFiles(payload, callback) {
  return SimpleDispatchActionToReducer("UPDATE_COMMENT_FILES", payload, callback);
}

export function putCommentImportant(payload, callback) {
  return dispatchActionToReducer(putCommentImportantService(payload), "PUT_COMMENT_START", "PUT_COMMENT_SUCCESS", "PUT_COMMENT_FAIL", callback);
}

export function incomingImportantComment(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_IMPORTANT_COMMENT", payload, callback);
}

export function incomingReadSelectedPosts(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_READ_SELECTED_POSTS", payload, callback);
}

export function incomingArchivedSelectedPosts(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_ARCHIVED_SELECTED_POSTS", payload, callback);
}

export function postApprove(payload, callback) {
  return dispatchActionToReducer(postApproveService(payload), "POST_APPROVE_START", "POST_APPROVE_SUCCESS", "POST_APPROVE_FAIL", callback);
}

export function incomingPostApproval(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_POST_APPROVAL", payload, callback);
}

export function commentApprove(payload, callback) {
  return dispatchActionToReducer(commentApproveService(payload), "COMMENT_APPROVE_START", "COMMENT_APPROVE_SUCCESS", "COMMENT_APPROVE_FAIL", callback);
}

export function incomingCommentApproval(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_COMMENT_APPROVAL", payload, callback);
}

export function getPostRead(payload, callback) {
  return dispatchActionToReducer(getPostReadService(payload), "GET_POSTREAD_START", "GET_POSTREAD_SUCCESS", "GET_POSTREAD_FAIL", callback);
}

export function setPostRead(payload, callback) {
  return SimpleDispatchActionToReducer("SET_POSTREAD", payload, callback);
}

export function setChangeRequestedComment(payload, callback) {
  return SimpleDispatchActionToReducer("SET_CHANGE_REQUESTED_COMMENT", payload, callback);
}

export function clearApprovingState(payload, callback) {
  return SimpleDispatchActionToReducer("CLEAR_COMMENT_APPROVING_STATE", payload, callback);
}

export function postClose(payload, callback) {
  return dispatchActionToReducer(postCloseService(payload), "POST_CLOSE_START", "POST_CLOSE_SUCCESS", "POST_CLOSE_FAIL", callback);
}

export function incomingClosePost(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_CLOSE_POST", payload, callback);
}

export function getUnreadCompanyPosts(payload, callback) {
  return dispatchActionToReducer(getCompanyPostsService(payload), "GET_UNREAD_COMPANY_POSTS_START", "GET_UNREAD_COMPANY_POSTS_SUCCESS", "GET_UNREAD_COMPANY_POSTS_FAIL", callback);
}

export function getUnarchivePost(payload, callback) {
  return dispatchActionToReducer(fetchPostService(payload), "GET_UNARCHIVE_POST_DETAIL_START", "GET_UNARCHIVE_POST_DETAIL_SUCCESS", "GET_UNARCHIVE_POST_DETAIL_FAIL", callback);
}

export function postRequired(payload, callback) {
  return dispatchActionToReducer(postRequiredService(payload), "POST_REQUIRED_START", "POST_REQUIRED_SUCCESS", "POST_REQUIRED_FAIL", callback);
}

export function incomingPostRequired(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_POST_REQUIRED", payload, callback);
}

export function removeDraftPost(payload, callback) {
  return SimpleDispatchActionToReducer("REMOVE_DRAFT_POST", payload, callback);
}

export function removeCommentDraft(payload, callback) {
  return SimpleDispatchActionToReducer("REMOVE_COMMENT_DRAFT", payload, callback);
}

export function getReadCompanyPosts(payload, callback) {
  return dispatchActionToReducer(getCompanyPostsService(payload), "GET_READ_COMPANY_POSTS_START", "GET_READ_COMPANY_POSTS_SUCCESS", "GET_READ_COMPANY_POSTS_FAIL", callback);
}

export function getArchivedCompanyPosts(payload, callback) {
  return dispatchActionToReducer(getCompanyPostsService(payload), "GET_ARCHIVED_OMPANY_POSTS_START", "GET_ARCHIVED_COMPANY_POSTS_SUCCESS", "GET_ARCHIVED_COMPANY_POSTS_FAIL", callback);
}

export function getMyCompanyPosts(payload, callback) {
  return dispatchActionToReducer(getCompanyPostsService(payload), "GET_MY_COMPANY_POSTS_START", "GET_MY_COMPANY_POSTS_SUCCESS", "GET_MY_COMPANY_POSTS_FAIL", callback);
}

export function getStarCompanyPosts(payload, callback) {
  return dispatchActionToReducer(getCompanyPostsService(payload), "GET_STAR_COMPANY_POSTS_START", "GET_STAR_COMPANY_POSTS_SUCCESS", "GET_STAR_COMPANY_POSTS_FAIL", callback);
}

export function incomingFollowPost(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_FOLLOW_POST", payload, callback);
}

export function incomingUnfollowPost(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_UNFOLLOW_POST", payload, callback);
}

export function refetchUnreadCompanyPosts(payload, callback) {
  return dispatchActionToReducer(getCompanyPostsService(payload), "REFETCH_UNREAD_COMPANY_POSTS_START", "REFETCH_UNREAD_COMPANY_POSTS_SUCCESS", "REFETCH_UNREAD_COMPANY_POSTS_FAIL", callback);
}
