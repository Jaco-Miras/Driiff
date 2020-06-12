import dispatchActionToReducer, {SimpleDispatchActionToReducer} from "../actionDispatcher";
import {
    deleteWorkspaceFile as deleteWorkspaceFileService,
    getChannelFiles as getChannelFilesService,
    getFiles as getFilesService,
    getWorkspaceFavoriteFiles as getWorkspaceFavoriteFilesService,
    getWorkspaceFiles as getWorkspaceFilesService,
    getWorkspaceFilesDetail as getWorkspaceFilesDetailService,
    getWorkspaceFolders as getWorkspaceFoldersService,
    getWorkspacePopularFiles as getWorkspacePopularFilesService,
    getWorkspacePrimaryFiles as getWorkspacePrimaryFilesService,
    getWorkspaceRecentlyEditedFiles as getWorkspaceRecentlyEditedFilesService,
    getWorkspaceTrashFiles as getWorkspaceTrashFilesService,
    patchWorkspaceFileViewed as patchWorkspaceFileViewedService,
    postWorkspaceFiles as postWorkspaceFilesService,
    restoreWorkspaceFile as restoreWorkspaceFileService,
    uploadWorkspaceFile as uploadWorkspaceFileService,
} from "../services";

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

export function setPendingUploadFilesToWorkspace(payload, callback) {
    return SimpleDispatchActionToReducer(
        "PREPARE_WORKSPACE_FILES_UPLOAD",
        payload,
        callback,
    );
}

export function setProgressUploadFilesToWorkspace(payload, callback) {
    return SimpleDispatchActionToReducer(
        "PROCESS_WORKSPACE_FILES_UPLOAD",
        payload,
        callback,
    );
}

export function postWorkspaceFiles(payload, callback) {
    return dispatchActionToReducer(
        postWorkspaceFilesService(payload),
        "UPLOADING_WORKSPACE_FILES_START",
        "UPLOADING_WORKSPACE_FILES_SUCCESS",
        "UPLOADING_WORKSPACE_FILES_FAILURE",
        callback,
    );
}

export function getWorkspacePrimaryFiles(payload, callback) {
    return dispatchActionToReducer(
        getWorkspacePrimaryFilesService(payload),
        "GET_WORKSPACE_PRIMARY_FILES_START",
        "GET_WORKSPACE_PRIMARY_FILES_SUCCESS",
        "GET_WORKSPACE_PRIMARY_FILES_FAIL",
        callback,
    );
}

export function getWorkspaceFiles(payload, callback) {
    return dispatchActionToReducer(
        getWorkspaceFilesService(payload),
        "GET_WORKSPACE_FILES_START",
        "GET_WORKSPACE_FILES_SUCCESS",
        "GET_WORKSPACE_FILES_FAIL",
        callback,
    );
}

export function getWorkspaceTrashFiles(payload, callback) {
    return dispatchActionToReducer(
        getWorkspaceTrashFilesService(payload),
        "GET_WORKSPACE_TRASH_FILES_START",
        "GET_WORKSPACE_TRASH_FILES_SUCCESS",
        "GET_WORKSPACE_TRASH_FILES_FAIL",
        callback,
    );
}

export function getWorkspaceFavoriteFiles(payload, callback) {
    return dispatchActionToReducer(
        getWorkspaceFavoriteFilesService(payload),
        "GET_WORKSPACE_FAVORITE_FILES_START",
        "GET_WORKSPACE_FAVORITE_FILES_SUCCESS",
        "GET_WORKSPACE_FAVORITE_FILES_FAIL",
        callback,
    );
}

export function getWorkspaceRecentlyEditedFiles(payload, callback) {
    return dispatchActionToReducer(
        getWorkspaceRecentlyEditedFilesService(payload),
        "GET_WORKSPACE_RECENT_EDIT_FILES_START",
        "GET_WORKSPACE_RECENT_EDIT_FILES_SUCCESS",
        "GET_WORKSPACE_RECENT_EDIT_FILES_FAIL",
        callback,
    );
}

export function getWorkspacePopularFiles(payload, callback) {
    return dispatchActionToReducer(
        getWorkspacePopularFilesService(payload),
        "GET_WORKSPACE_POPULAR_FILES_START",
        "GET_WORKSPACE_POPULAR_FILES_SUCCESS",
        "GET_WORKSPACE_POPULAR_FILES_FAIL",
        callback,
    );
}

export function getWorkspaceFolders(payload, callback) {
    return dispatchActionToReducer(
        getWorkspaceFoldersService(payload),
        "GET_WORKSPACE_FOLDER_START",
        "GET_WORKSPACE_FOLDER_SUCCESS",
        "GET_WORKSPACE_FOLDER_FAIL",
        callback,
    );
}

export function getWorkspaceFilesDetail(payload, callback) {
    return dispatchActionToReducer(
        getWorkspaceFilesDetailService(payload),
        "GET_WORKSPACE_FILE_DETAILS_START",
        "GET_WORKSPACE_FILE_DETAILS_SUCCESS",
        "GET_WORKSPACE_FILE_DETAILS_FAIL",
        callback,
    );
}

export function patchWorkspaceFileViewed(payload, callback) {
    return dispatchActionToReducer(
        patchWorkspaceFileViewedService(payload),
        "VIEW_WORKSPACE_FILE_START",
        "VIEW_WORKSPACE_FILE_SUCCESS",
        "VIEW_WORKSPACE_FILE_FAILURE",
        callback,
    );
}

export function uploadWorkspaceFile(payload, callback) {
    return dispatchActionToReducer(
        uploadWorkspaceFileService(payload),
        "UPLOAD_WORKSPACE_FILE_START",
        "UPLOAD_WORKSPACE_FILE_SUCCESS",
        "UPLOAD_WORKSPACE_FILE_FAIL",
        callback,
    );
}

export function deleteWorkspaceFile(payload, callback) {
    return dispatchActionToReducer(
        deleteWorkspaceFileService(payload),
        "DELETE_WORKSPACE_FILE_START",
        "DELETE_WORKSPACE_FILE_SUCCESS",
        "DELETE_WORKSPACE_FILE_FAIL",
        callback,
    );
}

export function restoreWorkspaceFile(payload, callback) {
    return dispatchActionToReducer(
        restoreWorkspaceFileService(payload),
        "RESTORE_WORKSPACE_FILE_START",
        "RESTORE_WORKSPACE_FILE_SUCCESS",
        "RESTORE_WORKSPACE_FILE_FAIL",
        callback,
    );
}