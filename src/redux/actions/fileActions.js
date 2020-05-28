import dispatchActionToReducer, {SimpleDispatchActionToReducer} from "../actionDispatcher";
import {getChannelFiles as getChannelFilesService, getFiles as getFilesService} from "../services";

export function getFiles(payload, callback) {
    return dispatchActionToReducer(
        getFilesService(payload),
        "GET_FILES_START",
        "GET_FILES_SUCCESS",
        "GET_FILES_FAIL",
        callback,
    );
}

export function getChannelFiles(payload, callback) {
    return dispatchActionToReducer(
        getChannelFilesService(payload),
        "GET_CHANNEL_FILES_START",
        "GET_CHANNEL_FILES_SUCCESS",
        "GET_CHANNEL_FILES_FAILURE",
        callback,
    );
}

export function addFilesToChannel(payload, callback) {
    return SimpleDispatchActionToReducer(
        "ADD_CHANNEL_FILES",
        payload,
        callback,
    );
}

export function deleteFilesFromChannel(payload, callback) {
    return SimpleDispatchActionToReducer(
        "DELETE_CHANNEL_FILES",
        payload,
        callback,
    );
}

export function setViewFiles(payload, callback) {
    return SimpleDispatchActionToReducer(
        "SET_VIEW_FILES",
        payload,
        callback,
    );
}