import dispatchActionToReducer, {SimpleDispatchActionToReducer} from "../actionDispatcher";
import {
    deleteDraft as deleteDraftService,
    generateUnfurl as generateUnfurlService,
    getAllRecipients as getAllRecipientsService,
    getConnectedSlugs as getConnectedSlugsService,
    saveDraft as saveDraftService,
    updateDraft as updateDraftService,
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

export function addToModals(payload, callback) {
    return SimpleDispatchActionToReducer(
        "ADD_TO_MODALS",
        payload,
        callback,
    );
}

export function clearModal(payload, callback) {
    return SimpleDispatchActionToReducer(
        "CLEAR_MODAL",
        payload,
        callback,
    );
}

export function saveDraft(payload, callback) {
    return dispatchActionToReducer(
        saveDraftService(payload),
        "SAVE_DRAFT_START",
        "SAVE_DRAFT_SUCCESS",
        "SAVE_DRAFT_FAILURE",
        callback,
    );
}

export function updateDraft(payload, callback) {
    return dispatchActionToReducer(
        updateDraftService(payload),
        "UPDATE_DRAFT_START",
        "UPDATE_DRAFT_SUCCESS",
        "UPDATE_DRAFT_FAILURE",
        callback,
    );
}

export function deleteDraft(payload, callback) {
    return dispatchActionToReducer(
        deleteDraftService(payload),
        "DELETE_DRAFT_START",
        "DELETE_DRAFT_SUCCESS",
        "DELETE_DRAFT_FAILURE",
        callback,
    );
}