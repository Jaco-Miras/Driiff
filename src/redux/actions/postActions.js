import dispatchActionToReducer, {SimpleDispatchActionToReducer} from "../actionDispatcher";
import {
    favoritePost as favoritePostService,
    postMarkDone as postMarkDoneService,
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
