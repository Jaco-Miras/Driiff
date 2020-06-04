import dispatchActionToReducer, {SimpleDispatchActionToReducer} from "../actionDispatcher";
import {
    favoritePost as favoritePostService
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