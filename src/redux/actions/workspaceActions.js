import dispatchActionToReducer, {SimpleDispatchActionToReducer} from "../actionDispatcher";
import {
    createWorkspace as createWorkspaceService,
    createWorkspacePost as createWorkspaceService,
    deleteWorkspace as deleteWorkspaceService,
    deleteWorkspaceFile as deleteWorkspaceService,
    getPostStatusCount as getPostStatusCountService,
    getWorkspaceDetail as getWorkspaceDetailService,
    getWorkspaceFileDetails as getWorkspaceFileDetailsService,
    getWorkspaceFiles as getWorkspaceFilesService,
    getWorkspacePostsService as getWorkspacePostDetailService,
    getWorkspacePosts as getWorkspacePostsService,
    getWorkspaceTopics as getWorkspaceTopicsService,
    getWorkspaceTrashFiles as getWorkspaceTrashFilesService,
    getWorkspaces as getWorkspacesService,
    moveWorkspaceTopic as moveWorkspaceTopicService,
    restoreWorkspaceFile as restoreWorkspaceFileService,
    updateWorkspace as updateWorkspaceService,
    updateWorkspacePost as updateWorkspacePostService,
    uploadWorkspaceFile as uploadWorkspaceFileService,
} from "../services";

export function getWorkspaces(payload, callback) {
    return dispatchActionToReducer(
        getWorkspacesService(payload),
        "GET_WORKSPACES_START",
        "GET_WORKSPACES_SUCCESS",
        "GET_WORKSPACES_FAIL",
        callback,
    );
}

export function createWorkspace(payload, callback) {
    return dispatchActionToReducer(
        createWorkspaceService(payload),
        "CREATE_WORKSPACE_START",
        "CREATE_WORKSPACE_SUCCESS",
        "CREATE_WORKSPACE_FAIL",
        callback,
    );
}

export function getWorkspaceDetail(payload, callback) {
    return dispatchActionToReducer(
        getWorkspaceDetailService(payload),
        "GET_WORKSPACE_DETAIL_START",
        "GET_WORKSPACE_DETAIL_SUCCESS",
        "GET_WORKSPACE_DETAIL_FAIL",
        callback,
    );
}

export function updateWorkspace(payload, callback) {
    return dispatchActionToReducer(
        updateWorkspaceService(payload),
        "UPDATE_WORKSPACE_START",
        "UPDATE_WORKSPACE_SUCCESS",
        "UPDATE_WORKSPACE_FAIL",
        callback,
    );
}

export function deleteWorkspace(payload, callback) {
    return dispatchActionToReducer(
        deleteWorkspaceService(payload),
        "DELETE_WORKSPACE_START",
        "DELETE_WORKSPACE_SUCCESS",
        "DELETE_WORKSPACE_FAIL",
        callback,
    );
}

export function moveWorkspaceTopic(payload, callback) {
    return dispatchActionToReducer(
        moveWorkspaceTopicService(payload),
        "MOVE_WORKSPACE_TOPIC_START",
        "MOVE_WORKSPACE_TOPIC_SUCCESS",
        "MOVE_WORKSPACE_TOPIC_FAIL",
        callback,
    );
}

export function getWorkspaceTopics(payload, callback) {
    return dispatchActionToReducer(
        getWorkspaceTopicsService(payload),
        "GET_WORKSPACE_TOPICS_START",
        "GET_WORKSPACE_TOPICS_SUCCESS",
        "GET_WORKSPACE_TOPICS_FAIL",
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

export function uploadWorkspaceFile(payload, callback) {
    return dispatchActionToReducer(
        uploadWorkspaceFileService(payload),
        "UPLOAD_WORKSPACE_FILE_START",
        "UPLOAD_WORKSPACE_FILE_SUCCESS",
        "UPLOAD_WORKSPACE_FILE_FAIL",
        callback,
    );
}

export function getWorkspaceFileDetails(payload, callback) {
    return dispatchActionToReducer(
        getWorkspaceFileDetailsService(payload),
        "GET_WORKSPACE_FILE_DETAILS_START",
        "GET_WORKSPACE_FILE_DETAILS_SUCCESS",
        "GET_WORKSPACE_FILE_DETAILS_FAIL",
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

export function getWorkspacePosts(payload, callback) {
    return dispatchActionToReducer(
        getWorkspacePostsService(payload),
        "GET_WORKSPACE_POSTS_START",
        "GET_WORKSPACE_POSTS_SUCCESS",
        "GET_WORKSPACE_POSTS_FAIL",
        callback,
    );
}

export function createWorkspacePost(payload, callback) {
    return dispatchActionToReducer(
        createWorkspacePostService(payload),
        "CREATE_WORKSPACE_POST_START",
        "CREATE_WORKSPACE_POST_SUCCESS",
        "CREATE_WORKSPACE_POST_FAIL",
        callback,
    );
}

export function getWorkspacePostDetail(payload, callback) {
    return dispatchActionToReducer(
        getWorkspacePostDetailService(payload),
        "GET_WORKSPACE_POST_DETAIL_START",
        "GET_WORKSPACE_POST_DETAIL_SUCCESS",
        "GET_WORKSPACE_POST_DETAIL_FAIL",
        callback,
    );
}

export function updateWorkspacePost(payload, callback) {
    return dispatchActionToReducer(
        updateWorkspacePostService(payload),
        "UPADATE_WORKSPACE_POST_START",
        "UPADATE_WORKSPACE_POST_SUCCESS",
        "UPADATE_WORKSPACE_POST_FAIL",
        callback,
    );
}

export function updatePostStatus(payload, callback) {
    return dispatchActionToReducer(
        updatePostStatusService(payload),
        "UPADATE_POST_STATUS_START",
        "UPADATE_POST_STATUS_SUCCESS",
        "UPADATE_POST_STATUS_FAIL",
        callback,
    );
}

export function getPostStatusCount(payload, callback) {
    return dispatchActionToReducer(
        getPostStatusCountService(payload),
        "GET_POST_STATUS_COUNT_START",
        "GET_POST_STATUS_COUNT_SUCCESS",
        "GET_POST_STATUS_COUNT_FAIL",
        callback,
    );
}
