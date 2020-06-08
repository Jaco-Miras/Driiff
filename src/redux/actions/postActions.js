import dispatchActionToReducer, {SimpleDispatchActionToReducer} from "../actionDispatcher";
import {
    postArchive as postArchiveService,
    postCreate as postCreateService,
    postFavorite as postFavoriteService,
    postFollow as postFollowService,
    postMarkDone as postMarkDoneService,
    postSnooze as postSnoozeService,
    postToggleRead as postToggleReadService,
    postUnfollow as postUnfollowService,
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