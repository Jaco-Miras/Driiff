import dispatchActionToReducer, {SimpleDispatchActionToReducer} from "../actionDispatcher";
import {
    getAllRecipients as getAllRecipientsService, 
    getConnectedSlugs as getConnectedSlugsService,
    generateUnfurl as generateUnfurlService,
} from "../services";

export function setBrowserTabStatus(payload, callback) {
    return SimpleDispatchActionToReducer(
        "SET_BROWSER_TAB_STATUS",
        payload,
        callback,
    );
}

export function getConnectedSlugs(payload, callback) {
    return dispatchActionToReducer(
        getConnectedSlugsService(payload),
        "GET_CONNECTED_SLUGS_START",
        "GET_CONNECTED_SLUGS_SUCCESS",
        "GET_CONNECTED_SLUGS_FAIL",
        callback,
    );
}

export function getAllRecipients(payload, callback) {
    return dispatchActionToReducer(
        getAllRecipientsService(payload),
        "GET_ALL_RECIPIENTS_START",
        "GET_ALL_RECIPIENTS_SUCCESS",
        "GET_ALL_RECIPIENTS_FAIL",
        callback,
    );
}

export function setNavMode(payload, callback) {
    return SimpleDispatchActionToReducer(
        "SET_NAV_MODE",
        payload,
        callback,
    );
}

export function toggleLoading(payload, callback) {
    console.log(payload)
    return SimpleDispatchActionToReducer(
        "TOGGLE_LOADING",
        payload,
        callback,
    );
}

export function generateUnfurl(payload, callback) {
    return dispatchActionToReducer(
        generateUnfurlService(payload),
        "GENERATE_UNFURL_START",
        "GENERATE_UNFURL_SUCCESS",
        "GENERATE_UNFURL_FAILURE",
        callback,
    );
}

export function generateUnfurlReducer(payload, callback) {
    return SimpleDispatchActionToReducer(
        "GENERATE_UNFURL_REDUCER",
        payload,
        callback,
    );
}