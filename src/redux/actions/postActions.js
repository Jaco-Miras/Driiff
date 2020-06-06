import dispatchActionToReducer, {SimpleDispatchActionToReducer} from "../actionDispatcher";
import {
    favoritePost as favoritePostService,
    followPost as followPostService,
    postArchive as postArchiveService,
    postMarkDone as postMarkDoneService,
    postToggleRead as postToggleReadService,
    unFollowPost as unFollowPostService,
} from "../services";

export function favoritePost(payload, callback) {
    return dispatchActionToReducer(
        favoritePostService(payload),
        "FAVORITE_POST_START",
        "FAVORITE_POST_SUCCESS",
        "FAVORITE_POST_FAIL",
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

export function followPost(payload, callback) {
    return dispatchActionToReducer(
        followPostService(payload),
        "POST_FOLLOW_START",
        "POST_FOLOW_SUCCESS",
        "POST_FOLOW_FAIL",
        callback,
    );
}

export function unFollowPost(payload, callback) {
    return dispatchActionToReducer(
        unFollowPostService(payload),
        "POST_UNFOLLOW_START",
        "POST_UNFOLOW_SUCCESS",
        "POST_UNFOLOW_FAIL",
        callback,
    );
}