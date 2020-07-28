import dispatchActionToReducer, {SimpleDispatchActionToReducer} from "../actionDispatcher";
import {
  globalSearch as globalSearchService,
} from "../services";

export function saveSearchInput(payload, callback) {
    return SimpleDispatchActionToReducer("SAVE_SEARCH_INPUT", payload, callback);
}

export function globalSearch(payload, callback) {
    return dispatchActionToReducer(
        globalSearchService(payload), 
        "SEARCH_START", 
        "SEARCH_SUCCESS", 
        "SEARCH_FAIL", 
        callback
    );
}

export function updateTab(payload, callback) {
    return SimpleDispatchActionToReducer("UPDATE_TAB", payload, callback);
}