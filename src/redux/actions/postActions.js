import dispatchActionToReducer, {SimpleDispatchActionToReducer} from "../actionDispatcher";
import {
    deletePost as deletePostService,
    fetchComments as fetchCommentsService,
    postArchive as postArchiveService,
    postCreate as postCreateService,
    postComment as postCommentService,
    postFavorite as postFavoriteService,
    postFollow as postFollowService,
    postMarkDone as postMarkDoneService,
    postSnooze as postSnoozeService,
    postToggleRead as postToggleReadService,
    postUnfollow as postUnfollowService,
    putComment as putCommentService,
} from "../services";

export function postFavorite(payload, callback) {
    return dispatchActionToReducer(
        postFavoriteService(payload),
        "POST_FAVORITE_START",
        "POST_FAVORITE_SUCCESS",
        "POST_FAVORRITE_FAIL",
        callback,
    );
}

export function postMarkDone(payload, callback) {
    return dispatchActionToReducer(
        postMarkDoneService(payload),
        "POST_MARK_DONE_START",
        "POST_MARK_DONE_SUCCESS",
        "POST_MARK_DONE_FAIL",
        callback,
    );
}

export function postArchive(payload, callback) {
    return dispatchActionToReducer(
        postArchiveService(payload),
        "POST_ARCHIVE_START",
        "POST_ARCHIVE_SUCCESS",
        "POST_ARCHIVE_FAIL",
        callback,
    );
}

export function removePost(payload, callback) {
    return SimpleDispatchActionToReducer(
        "REMOVE_POST",
        payload,
        callback,
    );
}

export function postToggleRead(payload, callback) {
    return dispatchActionToReducer(
        postToggleReadService(payload),
        "POST_TOGGLE_READ_START",
        "POST_TOGGLE_READ_SUCCESS",
        "POST_TOGGLE_READ_FAIL",
        callback,
    );
}

export function postFollow(payload, callback) {
    return dispatchActionToReducer(
        postFollowService(payload),
        "POST_FOLLOW_START",
        "POST_FOLOW_SUCCESS",
        "POST_FOLOW_FAIL",
        callback,
    );
}

export function postUnfollow(payload, callback) {
    return dispatchActionToReducer(
        postUnfollowService(payload),
        "POST_UNFOLLOW_START",
        "POST_UNFOLOW_SUCCESS",
        "POST_UNFOLOW_FAIL",
        callback,
    );
}

export function postSnooze(payload, callback) {
    return dispatchActionToReducer(
        postSnoozeService(payload),
        "POST_SNOOZE_START",
        "POST_SNOOZE_SUCCESS",
        "POST_SNOOZE_FAIL",
        callback,
    );
}

export function postCreate(payload, callback) {
    return dispatchActionToReducer(
        postCreateService(payload),
        "POST_CREATE_START",
        "POST_CREATE_SUCCESS",
        "POST_CREATE_FAIL",
        callback,
    );
}

export function postComment(payload, callback) {
    return dispatchActionToReducer(
        postCommentService(payload),
        "POST_COMMENT_START",
        "POST_COMMENT_SUCCESS",
        "POST_COMMENT_FAIL",
        callback,
    );
}

export function fetchComments(payload, callback) {
    return dispatchActionToReducer(
        fetchCommentsService(payload),
        "FETCH_COMMENTS_START",
        "FETCH_COMMENTS_SUCCESS",
        "FETCH_COMMENTS_FAIL",
        callback,
    );
}

export function setEditComment(payload, callback) {
    return SimpleDispatchActionToReducer(
        "SET_EDIT_POST_COMMENT",
        payload,
        callback,
    );
}

export function putComment(payload, callback) {
    return dispatchActionToReducer(
        putCommentService(payload),
        "UPDATE_COMMENT_START",
        "UPDATE_COMMENT_SUCCESS",
        "UPDATE_COMMENT_FAIL",
        callback,
    );
}

export function addComment(payload, callback) {
    return SimpleDispatchActionToReducer(
        "ADD_COMMENT",
        payload,
        callback,
    );
}

export function addCommentQuote(payload, callback) {
    return SimpleDispatchActionToReducer(
        "ADD_COMMENT_QUOTE",
        payload,
        callback,
    );
}

export function clearCommentQuote(payload, callback) {
    return SimpleDispatchActionToReducer(
        "CLEAR_COMMENT_QUOTE",
        payload,
        callback,
    );
}

export function deletePost(payload, callback) {
    return dispatchActionToReducer(
        deletePostService(payload),
        "DELETE_POST_START",
        "DELETE_POST_SUCCESS",
        "DELETE_POST_FAIL",
        callback,
    );
}