import dispatchActionToReducer, { SimpleDispatchActionToReducer } from "../actionDispatcher";
import {
  deleteCompanyDeleteAllTrashFiles as deleteCompanyDeleteAllTrashFilesService,
  deleteCompanyFiles as deleteCompanyFilesService,
  deleteCompanyFolders as deleteCompanyFoldersService,
  deleteFile as deleteFileService,
  deleteFolder as deleteFolderService,
  deleteGoogleAttachment as deleteGoogleAttachmentService,
  deletePostFile as deletePostFileService,
  deleteTrash as deleteTrashService,
  deleteWorkspaceFile as deleteWorkspaceFileService,
  deleteWorkspaceFiles as deleteWorkspaceFilesService,
  getChannelFiles as getChannelFilesService,
  getCompanyFavoriteFiles as getCompanyFavoriteFilesService,
  getCompanyFiles as getCompanyFilesService,
  getCompanyFilesDetail as getCompanyFilesDetailService,
  getCompanyFolderBreadCrumbs as getCompanyFolderBreadCrumbsService,
  getCompanyFolders as getCompanyFoldersService,
  getCompanyGoogleAttachmentsFile as getCompanyGoogleAttachmentsFileService,
  getCompanyGoogleAttachmentsFolder as getCompanyGoogleAttachmentsFolderService,
  getCompanyPopularFiles as getCompanyPopularFilesService,
  getCompanyRecentEditedFiles as getCompanyRecentEditedFilesService,
  getCompanyTrashedFiles as getCompanyTrashedFilesService,
  getFiles as getFilesService,
  getWorkspaceFavoriteFiles as getWorkspaceFavoriteFilesService,
  getWorkspaceFiles as getWorkspaceFilesService,
  getWorkspaceFilesDetail as getWorkspaceFilesDetailService,
  getWorkspaceFolders as getWorkspaceFoldersService,
  getWorkspaceFoldersBreadcrumb as getWorkspaceFoldersBreadcrumbService,
  getWorkspaceGoogleFileAttachments as getWorkspaceGoogleFileAttachmentsService,
  getWorkspaceGoogleFolderAttachments as getWorkspaceGoogleFolderAttachmentsService,
  getWorkspacePopularFiles as getWorkspacePopularFilesService,
  getWorkspacePrimaryFiles as getWorkspacePrimaryFilesService,
  getWorkspaceRecentlyEditedFiles as getWorkspaceRecentlyEditedFilesService,
  getWorkspaceTrashFiles as getWorkspaceTrashFilesService,
  moveFile as moveFileService,
  patchCompanyFileViewed as patchCompanyFileViewedService,
  patchWorkspaceFileViewed as patchWorkspaceFileViewedService,
  postCompanyFolders as postCompanyFoldersService,
  postCompanyUploadBulkFiles as postCompanyUploadBulkFilesService,
  postCompanyUploadFiles as postCompanyUploadFilesService,
  postFavorite as postFavoriteService,
  postFolder as postFolderService,
  postGoogleDriveFolder as postGoogleDriveFolderService,
  postGoogleDriveFile as postGoogleDriveFileService,
  postGoogleAttachments as postGoogleAttachmentsService,
  postWorkspaceFiles as postWorkspaceFilesService,
  putCompanyFileMove as putCompanyFileMoveService,
  putCompanyFiles as putCompanyFilesService,
  putCompanyFolders as putCompanyFoldersService,
  putCompanyRestoreFile as putCompanyRestoreFileService,
  putCompanyRestoreFolder as putCompanyRestoreFolderService,
  putFile as putFileService,
  putFolder as putFolderService,
  putWorkspaceRestoreFile as putWorkspaceRestoreFileService,
  putWorkspaceRestoreFolder as putWorkspaceRestoreFolderService,
  removeFileDownload as removeFileDownloadService,
  restoreWorkspaceFile as restoreWorkspaceFileService,
  uploadWorkspaceFile as uploadWorkspaceFileService,
  uploadWorkspaceFiles as uploadWorkspaceFilesService,
  postDriveLink as postDriveLinkService,
  getDriveLinks as getDriveLinksService,
  putDriveLink as putDriveLinkService,
  deleteDriveLink as deleteDriveLinkService,
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

export function getWorkspaceFoldersBreadcrumb(payload, callback) {
  return dispatchActionToReducer(getWorkspaceFoldersBreadcrumbService(payload), "GET_WORKSPACE_FOLDERS_BREADCRUMB_START", "GET_WORKSPACE_FOLDERS_BREADCRUMB_SUCCESS", "GET_WORKSPACE_FOLDERS_BREADCRUMB_FAIL", callback);
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

export function addGoogleDriveFolder(payload, callback) {
  return dispatchActionToReducer(postGoogleDriveFolderService(payload), "ADD_GOOGLE_DRIVE_FOLDER_START", "ADD_GOOGLE_DRIVE_FOLDER_SUCCESS", "ADD_GOOGLE_DRIVE_FOLDER_FAIL", callback);
}

export function addGoogleDriveFile(payload, callback) {
  return dispatchActionToReducer(postGoogleDriveFileService(payload), "ADD_GOOGLE_DRIVE_FILE_START", "ADD_GOOGLE_DRIVE_FILE_SUCCESS", "ADD_GOOGLE_DRIVE_FILE_FAIL", callback);
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

export function incomingRestoreFile(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_RESTORE_FILE", payload, callback);
}

export function incomingRestoreFolder(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_RESTORE_FOLDER", payload, callback);
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

export function uploadFilesReducer(payload, callback) {
  return SimpleDispatchActionToReducer("UPLOAD_FILES_REDUCER", payload, callback);
}

export function deleteWorkspaceFiles(payload, callback) {
  return dispatchActionToReducer(deleteWorkspaceFilesService(payload), "DELETE_WORKSPACE_FILES_START", "DELETE_WORKSPACE_FILES_SUCCESS", "DELETE_WORKSPACE_FILES_FAIL", callback);
}

export function incomingDeletedFiles(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_DELETED_FILES", payload, callback);
}

export function postGoogleAttachments(payload, callback) {
  return dispatchActionToReducer(postGoogleAttachmentsService(payload), "POST_GOOGLE_ATTACHMENTS_START", "POST_GOOGLE_ATTACHMENTS_SUCCESS", "POST_GOOGLE_ATTACHMENTS_FAIL", callback);
}

export function getWorkspaceGoogleFileAttachments(payload, callback) {
  return dispatchActionToReducer(getWorkspaceGoogleFileAttachmentsService(payload), "GET_WORKSPACE_GOOGLE_FILE_ATTACHMENTS_START", "GET_WORKSPACE_GOOGLE_FILE_ATTACHMENTS_SUCCESS", "GET_WORKSPACE_GOOGLE_FILE_ATTACHMENTS_FAIL", callback);
}

export function getWorkspaceGoogleFolderAttachments(payload, callback) {
  return dispatchActionToReducer(
    getWorkspaceGoogleFolderAttachmentsService(payload),
    "GET_WORKSPACE_GOOGLE_FOLDER_ATTACHMENTS_START",
    "GET_WORKSPACE_GOOGLE_FOLDER_ATTACHMENTS_SUCCESS",
    "GET_WORKSPACE_GOOGLE_FOLDER_ATTACHMENTS_FAIL",
    callback
  );
}

export function incomingGoogleFile(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_GOOGLE_FILE", payload, callback);
}

export function incomingGoogleFolder(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_GOOGLE_FOLDER", payload, callback);
}

export function deleteGoogleAttachment(payload, callback) {
  return dispatchActionToReducer(deleteGoogleAttachmentService(payload), "DELETE_GOOGLE_ATTACHMENTS_START", "DELETE_GOOGLE_ATTACHMENTS_SUCCESS", "DELETE_GOOGLE_ATTACHMENTS_FAIL", callback);
}

export function incomingDeletedGoogleFile(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_DELETED_GOOGLE_FILE", payload, callback);
}

export function registerGoogleDriveFile(payload, callback) {
  return SimpleDispatchActionToReducer("ADD_GOOGLE_DRIVE_FILE", payload, callback);
}

export function getCompanyFiles(payload, callback) {
  return dispatchActionToReducer(getCompanyFilesService(payload), "GET_COMPANY_FILES_START", "GET_COMPANY_FILES_SUCCESS", "GET_COMPANY_FILES_FAIL", callback);
}

export function getCompanyFavoriteFiles(payload, callback) {
  return dispatchActionToReducer(getCompanyFavoriteFilesService(payload), "GET_COMPANY_FAVORITE_FILES_START", "GET_COMPANY_FAVORITE_FILES_SUCCESS", "GET_COMPANY_FAVORITE_FILES_FAIL", callback);
}

export function getCompanyFilesDetail(payload, callback) {
  return dispatchActionToReducer(getCompanyFilesDetailService(payload), "GET_COMPANY_FILES_DETAIL_START", "GET_COMPANY_FILES_DETAIL_SUCCESS", "GET_COMPANY_FILES_DETAIL_FAIL", callback);
}

export function getCompanyFolderBreadCrumbs(payload, callback) {
  return dispatchActionToReducer(getCompanyFolderBreadCrumbsService(payload), "GET_COMPANY_FOLDER_BREAD_CRUMBS_START", "GET_COMPANY_FOLDER_BREAD_CRUMBS_SUCCESS", "GET_COMPANY_FOLDER_BREAD_CRUMBS_FAIL", callback);
}

export function getCompanyFolders(payload, callback) {
  return dispatchActionToReducer(getCompanyFoldersService(payload), "GET_COMPANY_FOLDERS_START", "GET_COMPANY_FOLDERS_SUCCESS", "GET_COMPANY_FOLDERS_FAIL", callback);
}

export function getCompanyPopularFiles(payload, callback) {
  return dispatchActionToReducer(getCompanyPopularFilesService(payload), "GET_COMPANY_POPULAR_FILES_START", "GET_COMPANY_POPULAR_FILES_SUCCESS", "GET_COMPANY_POPULAR_FILES_FAIL", callback);
}

export function getCompanyRecentEditedFiles(payload, callback) {
  return dispatchActionToReducer(getCompanyRecentEditedFilesService(payload), "GET_COMPANY_RECENT_EDITED_FILES_START", "GET_COMPANY_RECENT_EDITED_FILES_SUCCESS", "GET_COMPANY_RECENT_EDITED_FILES_FAIL", callback);
}

export function getCompanyTrashedFiles(payload, callback) {
  return dispatchActionToReducer(getCompanyTrashedFilesService(payload), "GET_COMPANY_TRASHED_FILES_START", "GET_COMPANY_TRASHED_FILES_SUCCESS", "GET_COMPANY_TRASHED_FILES_FAIL", callback);
}

export function postCompanyFolders(payload, callback) {
  return dispatchActionToReducer(postCompanyFoldersService(payload), "POST_COMPANY_FOLDERS_START", "POST_COMPANY_FOLDERS_SUCCESS", "POST_COMPANY_FOLDERS_FAIL", callback);
}

export function postCompanyUploadFiles(payload, callback) {
  return dispatchActionToReducer(postCompanyUploadFilesService(payload), "POST_COMPANY_UPLOAD_FILES_START", "POST_COMPANY_UPLOAD_FILES_SUCCESS", "POST_COMPANY_UPLOAD_FILES_FAIL", callback);
}

export function postCompanyUploadBulkFiles(payload, callback) {
  return dispatchActionToReducer(postCompanyUploadBulkFilesService(payload), "POST_COMPANY_UPLOAD_BULK_FILES_START", "POST_COMPANY_UPLOAD_BULK_FILES_SUCCESS", "POST_COMPANY_UPLOAD_UPLOAD_BULK_FILES_FAIL", callback);
}

export function patchCompanyFileViewed(payload, callback) {
  return dispatchActionToReducer(patchCompanyFileViewedService(payload), "PATCH_COMPANY_FILE_VIEWED_START", "PATCH_COMPANY_FILE_VIEWED_SUCCESS", "PATCH_COMPANY_FILE_VIEWED_FAIL", callback);
}

export function putCompanyFiles(payload, callback) {
  return dispatchActionToReducer(putCompanyFilesService(payload), "PUT_COMPANY_FILES_START", "PUT_COMPANY_FILES_SUCCESS", "PUT_COMPANY_FILES_FAIL", callback);
}

export function putCompanyFolders(payload, callback) {
  return dispatchActionToReducer(putCompanyFoldersService(payload), "PUT_COMPANY_FOLDERS_START", "PUT_COMPANY_FOLDERS_SUCCESS", "PUT_COMPANY_FOLDERS_FAIL", callback);
}

export function deleteCompanyFiles(payload, callback) {
  return dispatchActionToReducer(deleteCompanyFilesService(payload), "DELETE_COMPANY_FILES_START", "DELETE_COMPANY_FILES_SUCCESS", "DELETE_COMPANY_FILES_FAIL", callback);
}

export function deleteCompanyFolders(payload, callback) {
  return dispatchActionToReducer(deleteCompanyFoldersService(payload), "DELETE_COMPANY_FOLDERS_START", "DELETE_COMPANY_FOLDERS_SUCCESS", "DELETE_COMPANY_FOLDERS_FAIL", callback);
}

export function deleteCompanyDeleteAllTrashFiles(payload, callback) {
  return dispatchActionToReducer(deleteCompanyDeleteAllTrashFilesService(payload), "DELETED_COMPANY_DELETE_START", "DELETED_COMPANY_DELETE_SUCCESS", "DELETED_COMPANY_DELETE_FAIL", callback);
}

export function uploadCompanyFilesReducer(payload, callback) {
  return SimpleDispatchActionToReducer("UPLOAD_COMPANY_FILES_REDUCER", payload, callback);
}

export function addCompanyFileSearchResults(payload, callback) {
  return SimpleDispatchActionToReducer("ADD_COMPANY_FILE_SEARCH_RESULTS", payload, callback);
}

export function incomingCompanyFolder(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_COMPANY_FOLDER", payload, callback);
}

export function incomingCompanyUpdatedFolder(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_COMPANY_UPDATED_FOLDER", payload, callback);
}

export function incomingCompanyDeletedFolder(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_COMPANY_DELETED_FOLDER", payload, callback);
}

export function incomingCompanyFile(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_COMPANY_FILE", payload, callback);
}

export function incomingCompanyFiles(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_COMPANY_FILES", payload, callback);
}

export function incomingCompanyDeletedFile(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_DELETED_FILE", payload, callback);
}

export function incomingCompanyMovedFile(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_COMPANY_MOVED_FILE", payload, callback);
}

export function incomingCompanyEmptyTrash(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_COMPANY_EMPTY_TRASH", payload, callback);
}

export function incomingRemovedCompanyFile(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_REMOVED_COMPANY_FILE", payload, callback);
}

export function incomingCompanyMoveFile(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_COMPANY_MOVE_FILE", payload, callback);
}

export function incomingCompanyRestoreFile(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_COMPANY_RESTORE_FILE", payload, callback);
}

export function incomingCompanyRestoreFolder(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_COMPANY_RESTORE_FOLDER", payload, callback);
}

export function incomingRemovedCompanyFolder(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_REMOVED_COMPANY_FOLDER", payload, callback);
}

export function incomingCompanyDeletedFiles(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_COMPANY_DELETED_FILES", payload, callback);
}

export function incomingCompanyUpdatedFile(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_COMPANY_UPDATED_FILE", payload, callback);
}

export function putWorkspaceRestoreFile(payload, callback) {
  return dispatchActionToReducer(putWorkspaceRestoreFileService(payload), "PUT_WORKSPACE_RESTORE_FILE_START", "PUT_WORKSPACE_RESTORE_FILE_SUCCESS", "PUT_WORKSPACE_RESTORE_FILE_FAIL", callback);
}

export function putCompanyRestoreFile(payload, callback) {
  return dispatchActionToReducer(putCompanyRestoreFileService(payload), "PUT_COMPANY_RESTORE_FILE_START", "PUT_COMPANY_RESTORE_FILE_SUCCESS", "PUT_COMPANY_RESTORE_FILE_FAIL", callback);
}

export function putWorkspaceRestoreFolder(payload, callback) {
  return dispatchActionToReducer(putWorkspaceRestoreFolderService(payload), "PUT_WORKSPACE_RESTORE_FOLDER_START", "PUT_WORKSPACE_RESTORE_FOLDER_SUCCESS", "PUT_WORKSPACE_RESTORE_FOLDER_FAIL", callback);
}

export function putCompanyRestoreFolder(payload, callback) {
  return dispatchActionToReducer(putCompanyRestoreFolderService(payload), "PUT_COMPANY_RESTORE_FOLDER_START", "PUT_COMPANY_RESTORE_FOLDER_SUCCESS", "PUT_COMPANY_RESTORE_FOLDER_FAIL", callback);
}

export function putCompanyFileMove(payload, callback) {
  return dispatchActionToReducer(putCompanyFileMoveService(payload), "PUT_COMPANY_FILE_MOVE_START", "PUT_COMPANY_FILE_MOVE_SUCCESS", "PUT_COMPANY_FILE_MOVE_FAIL", callback);
}

export function getCompanyGoogleAttachmentsFolder(payload, callback) {
  return dispatchActionToReducer(getCompanyGoogleAttachmentsFolderService(payload), "GET_COMPANY_GOOGLE_ATTACHMENTS_FOLDER_START", "GET_COMPANY_GOOGLE_ATTACHMENTS_FOLDER_SUCCESS", "GET_COMPANY_GOOGLE_ATTACHMENTS_FOLDER_FAIL", callback);
}

export function getCompanyGoogleAttachmentsFile(payload, callback) {
  return dispatchActionToReducer(getCompanyGoogleAttachmentsFileService(payload), "GET_COMPANY_GOOGLE_ATTACHMENTS_FILE_START", "GET_COMPANY_GOOGLE_ATTACHMENTS_FILE_SUCCESS", "GET_COMPANY_GOOGLE_ATTACHMENTS_FILE_FAIL", callback);
}

export function incomingGifData(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_GIF_DATA", payload, callback);
}

export function incomingFileData(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_FILE_DATA", payload, callback);
}

export function incomingFileThumbnailData(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_FILE_THUMBNAIL_DATA", payload, callback);
}

export function getTeamChatFiles(payload, callback) {
  return dispatchActionToReducer(getWorkspaceFilesService(payload), "GET_TEAM_CHAT_FILES_START", "GET_TEAM_CHAT_FILES_SUCCESS", "GET_TEAM_CHAT_FILES_FAIL", callback);
}

export function getClientChatFiles(payload, callback) {
  return dispatchActionToReducer(getWorkspaceFilesService(payload), "GET_CLIENT_CHAT_FILES_START", "GET_CLIENT_CHAT_FILES_SUCCESS", "GET_CLIENT_CHAT_FILES_FAIL", callback);
}

export function getClientPostFiles(payload, callback) {
  return dispatchActionToReducer(getWorkspaceFilesService(payload), "GET_CLIENT_POST_FILES_START", "GET_CLIENT_POST_FILES_SUCCESS", "GET_CLIENT_POST_FILES_FAIL", callback);
}

export function getPrivatePostFiles(payload, callback) {
  return dispatchActionToReducer(getWorkspaceFilesService(payload), "GET_PRIVATE_POST_FILES_START", "GET_PRIVATE_POST_FILES_SUCCESS", "GET_PRIVATE_POST_FILES_FAIL", callback);
}

export function removeFileDownload(payload, callback) {
  return dispatchActionToReducer(removeFileDownloadService(payload), "REMOVE_FILE_DOWNLOAD_START", "REMOVE_FILE_DOWNLOAD_SUCCESS", "REMOVE_FILE_DOWNLOAD_FAIL", callback);
}

export function incomingRemoveFileAfterDownload(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_REMOVED_FILE_AFTER_DOWNLOAD", payload, callback);
}

export function incomingRemoveFileAutomatically(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_REMOVED_FILE_AUTOMATICALLY", payload, callback);
}

export function getTopicDriveLinks(payload, callback) {
  return dispatchActionToReducer(getDriveLinksService(payload), "GET_TOPIC_DRIVE_LINKS_START", "GET_TOPIC_DRIVE_LINKS_SUCCESS", "GET_TOPIC_DRIVE_LINKS_FAIL", callback);
}

export function getDriveLinks(payload, callback) {
  return dispatchActionToReducer(getDriveLinksService(payload), "GET_DRIVE_LINKS_START", "GET_DRIVE_LINKS_SUCCESS", "GET_DRIVE_LINKS_FAIL", callback);
}

export function postDriveLink(payload, callback) {
  return dispatchActionToReducer(postDriveLinkService(payload), "POST_DRIVE_LINK_START", "POST_DRIVE_LINK_SUCCESS", "POST_DRIVE_LINK_FAIL", callback);
}

export function putDriveLink(payload, callback) {
  return dispatchActionToReducer(putDriveLinkService(payload), "PUT_DRIVE_LINK_START", "PUT_DRIVE_LINK_SUCCESS", "PUT_DRIVE_LINK_FAIL", callback);
}

export function deleteDriveLink(payload, callback) {
  return dispatchActionToReducer(deleteDriveLinkService(payload), "DELETE_DRIVE_LINK_START", "DELETE_DRIVE_LINK_SUCCESS", "DELETE_DRIVE_LINK_FAIL", callback);
}

export function incomingDriveLink(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_DRIVE_LINK", payload, callback);
}

export function incomingUpdatedDriveLink(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_UPDATED_DRIVE_LINK", payload, callback);
}

export function incomingDeletedDriveLink(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_DELETED_DRIVE_LINK", payload, callback);
}

export function removeCompanyFilesUploadingBar(payload, callback) {
  return SimpleDispatchActionToReducer("REMOVE_COMPANY_FILES_UPLOADING_BAR", payload, callback);
}

export function removeWorkspaceFilesUploadingBar(payload, callback) {
  return SimpleDispatchActionToReducer("REMOVE_WORKSPACE_FILES_UPLOADING_BAR", payload, callback);
}
