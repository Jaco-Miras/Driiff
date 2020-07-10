import dispatchActionToReducer, { SimpleDispatchActionToReducer } from "../actionDispatcher";
import {
  deleteFile as deleteFileService,
  deleteFolder as deleteFolderService,
  deletePostFile as deletePostFileService,
  deleteWorkspaceFile as deleteWorkspaceFileService,
  deleteTrash as deleteTrashService,
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
  moveFile as moveFileService,
  patchWorkspaceFileViewed as patchWorkspaceFileViewedService,
  postFolder as postFolderService,
  putFolder as putFolderService,
  putFile as putFileService,
  postFavorite as postFavoriteService,
  postWorkspaceFiles as postWorkspaceFilesService,
  restoreWorkspaceFile as restoreWorkspaceFileService,
  uploadWorkspaceFile as uploadWorkspaceFileService,
  uploadWorkspaceFiles as uploadWorkspaceFilesService,
} from "../services";

export function getFiles(payload, callback) {
  return dispatchActionToReducer(getFilesService(payload), "GET_FILES_START", "GET_FILES_SUCCESS", "GET_FILES_FAIL", callback);
}

export function getChannelFiles(payload, callback) {
  return dispatchActionToReducer(getChannelFilesService(payload), "GET_CHANNEL_FILES_START", "GET_CHANNEL_FILES_SUCCESS", "GET_CHANNEL_FILES_FAILURE", callback);
}

export function addFilesToChannel(payload, callback) {
  return SimpleDispatchActionToReducer("ADD_CHANNEL_FILES", payload, callback);
}

export function deleteFilesFromChannel(payload, callback) {
  return SimpleDispatchActionToReducer("DELETE_CHANNEL_FILES", payload, callback);
}

export function setViewFiles(payload, callback) {
  return SimpleDispatchActionToReducer("SET_VIEW_FILES", payload, callback);
}

export function setPendingUploadFilesToWorkspace(payload, callback) {
  return SimpleDispatchActionToReducer("PREPARE_WORKSPACE_FILES_UPLOAD", payload, callback);
}

export function setProgressUploadFilesToWorkspace(payload, callback) {
  return SimpleDispatchActionToReducer("PROCESS_WORKSPACE_FILES_UPLOAD", payload, callback);
}

export function postWorkspaceFiles(payload, callback) {
  return dispatchActionToReducer(postWorkspaceFilesService(payload), "UPLOADING_WORKSPACE_FILES_START", "UPLOADING_WORKSPACE_FILES_SUCCESS", "UPLOADING_WORKSPACE_FILES_FAILURE", callback);
}

export function getWorkspacePrimaryFiles(payload, callback) {
  return dispatchActionToReducer(getWorkspacePrimaryFilesService(payload), "GET_WORKSPACE_PRIMARY_FILES_START", "GET_WORKSPACE_PRIMARY_FILES_SUCCESS", "GET_WORKSPACE_PRIMARY_FILES_FAIL", callback);
}

export function getWorkspaceFiles(payload, callback) {
  return dispatchActionToReducer(getWorkspaceFilesService(payload), "GET_WORKSPACE_FILES_START", "GET_WORKSPACE_FILES_SUCCESS", "GET_WORKSPACE_FILES_FAIL", callback);
}

export function getWorkspaceTrashFiles(payload, callback) {
  return dispatchActionToReducer(getWorkspaceTrashFilesService(payload), "GET_WORKSPACE_TRASH_FILES_START", "GET_WORKSPACE_TRASH_FILES_SUCCESS", "GET_WORKSPACE_TRASH_FILES_FAIL", callback);
}

export function getWorkspaceFavoriteFiles(payload, callback) {
  return dispatchActionToReducer(getWorkspaceFavoriteFilesService(payload), "GET_WORKSPACE_FAVORITE_FILES_START", "GET_WORKSPACE_FAVORITE_FILES_SUCCESS", "GET_WORKSPACE_FAVORITE_FILES_FAIL", callback);
}

export function getWorkspaceRecentlyEditedFiles(payload, callback) {
  return dispatchActionToReducer(getWorkspaceRecentlyEditedFilesService(payload), "GET_WORKSPACE_RECENT_EDIT_FILES_START", "GET_WORKSPACE_RECENT_EDIT_FILES_SUCCESS", "GET_WORKSPACE_RECENT_EDIT_FILES_FAIL", callback);
}

export function getWorkspacePopularFiles(payload, callback) {
  return dispatchActionToReducer(getWorkspacePopularFilesService(payload), "GET_WORKSPACE_POPULAR_FILES_START", "GET_WORKSPACE_POPULAR_FILES_SUCCESS", "GET_WORKSPACE_POPULAR_FILES_FAIL", callback);
}

export function getWorkspaceFolders(payload, callback) {
  return dispatchActionToReducer(getWorkspaceFoldersService(payload), "GET_WORKSPACE_FOLDER_START", "GET_WORKSPACE_FOLDER_SUCCESS", "GET_WORKSPACE_FOLDER_FAIL", callback);
}

export function getWorkspaceFilesDetail(payload, callback) {
  return dispatchActionToReducer(getWorkspaceFilesDetailService(payload), "GET_WORKSPACE_FILE_DETAILS_START", "GET_WORKSPACE_FILE_DETAILS_SUCCESS", "GET_WORKSPACE_FILE_DETAILS_FAIL", callback);
}

export function patchWorkspaceFileViewed(payload, callback) {
  return dispatchActionToReducer(patchWorkspaceFileViewedService(payload), "VIEW_WORKSPACE_FILE_START", "VIEW_WORKSPACE_FILE_SUCCESS", "VIEW_WORKSPACE_FILE_FAILURE", callback);
}

export function uploadWorkspaceFile(payload, callback) {
  return dispatchActionToReducer(uploadWorkspaceFileService(payload), "UPLOAD_WORKSPACE_FILE_START", "UPLOAD_WORKSPACE_FILE_SUCCESS", "UPLOAD_WORKSPACE_FILE_FAIL", callback);
}

export function deleteWorkspaceFile(payload, callback) {
  return dispatchActionToReducer(deleteWorkspaceFileService(payload), "DELETE_WORKSPACE_FILE_START", "DELETE_WORKSPACE_FILE_SUCCESS", "DELETE_WORKSPACE_FILE_FAIL", callback);
}

export function restoreWorkspaceFile(payload, callback) {
  return dispatchActionToReducer(restoreWorkspaceFileService(payload), "RESTORE_WORKSPACE_FILE_START", "RESTORE_WORKSPACE_FILE_SUCCESS", "RESTORE_WORKSPACE_FILE_FAIL", callback);
}

export function addFolder(payload, callback) {
  return dispatchActionToReducer(postFolderService(payload), "ADD_FOLDER_START", "ADD_FOLDER_SUCCESS", "ADD_FOLDER_FAIL", callback);
}

export function putFolder(payload, callback) {
  return dispatchActionToReducer(putFolderService(payload), "UPDATE_FOLDER_START", "UPDATE_FOLDER_SUCCESS", "UPDATE_FOLDER_FAIL", callback);
}

export function uploadWorkspaceFiles(payload, callback) {
  return dispatchActionToReducer(uploadWorkspaceFilesService(payload), "UPLOAD_WORKSPACE_FILES_START", "UPLOAD_WORKSPACE_FILES_SUCCESS", "UPLOAD_WORKSPACE_FILES_FAIL", callback);
}

export function incomingFolder(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_FOLDER", payload, callback);
}

export function deleteFolder(payload, callback) {
  return dispatchActionToReducer(deleteFolderService(payload), "DELETE_FOLDER_START", "DELETE_FOLDER_SUCCESS", "DELETE_FOLDER_FAIL", callback);
}

export function incomingDeletedFolder(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_DELETED_FOLDER", payload, callback);
}

export function favoriteFile(payload, callback) {
  return dispatchActionToReducer(postFavoriteService(payload), "FAVORITE_FILE_START", "FAVORITE_FILE_SUCCESS", "FAVORITE_FILE_FAIL", callback);
}

export function deleteFile(payload, callback) {
  return dispatchActionToReducer(deleteFileService(payload), "DELETE_FILE_START", "DELETE_FILE_SUCCESS", "DELETE_FILE_FAIL", callback);
}

export function putFile(payload, callback) {
  return dispatchActionToReducer(putFileService(payload), "UPDATE_FILENAME_START", "UPDATE_FILENAME_SUCCESS", "UPDATE_FILENAME_FAIL", callback);
}

export function incomingFile(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_FILE", payload, callback);
}

export function addFileSearchResults(payload, callback) {
  return SimpleDispatchActionToReducer("ADD_FILE_SEARCH_RESULTS", payload, callback);
}

export function clearFileSearchResults(payload, callback) {
  return SimpleDispatchActionToReducer("CLEAR_FILE_SEARCH_RESULTS", payload, callback);
}

export function incomingDeletedFile(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_DELETED_FILE", payload, callback);
}

export function incomingFiles(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_FILES", payload, callback);
}

export function addRemoveFavorite(payload, callback) {
  return SimpleDispatchActionToReducer("ADD_REMOVE_FAVORITE", payload, callback);
}

export function deleteTrash(payload, callback) {
  return dispatchActionToReducer(deleteTrashService(payload), "DELETE_TRASH_START", "DELETE_TRASH_SUCCESS", "DELETE_TRASH_FAIL", callback);
}

export function moveFile(payload, callback) {
  return dispatchActionToReducer(moveFileService(payload), "MOVE_FILE_START", "MOVE_FILE_SUCCESS", "MOVE_FILE_FAIL", callback);
}

export function incomingMovedFile(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_MOVED_FILE", payload, callback);
}

export function incomingEmptyTrash(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_EMPTY_TRASH", payload, callback);
}

export function deletePostFile(payload, callback) {
  return dispatchActionToReducer(deletePostFileService(payload), "DELETE_POST_FILE_START", "DELETE_POST_FILE_SUCCESS", "DELETE_POST_FILE_FAIL", callback);
}

export function incomingDeletedPostFile(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_DELETED_POST_FILE", payload, callback);
}

export function incomingRemovedFile(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_REMOVED_FILE", payload, callback);
}

export function incomingRemovedFolder(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_REMOVED_FOLDER", payload, callback);
}
