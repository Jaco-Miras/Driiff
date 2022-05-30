import { objToUrlParams } from "../../helpers/commonFunctions";
import { apiCall } from "./index";

export function getFiles(payload) {
  const { sort } = payload;
  let url = "/v1/files";
  if (payload.sort) {
    url += `?sort=${sort}`;
  } else {
    url += "?sort=desc";
  }

  return apiCall({
    method: "GET",
    url: url,
  });
}

export function getChannelFiles(payload) {
  let url = `/v2/post-message-files?channel_id=${payload.channel_id}&skip=${payload.skip}&limit=${payload.limit}`;
  return apiCall({
    method: "GET",
    url: url,
  });
}

export function postWorkspaceFiles(payload) {
  let url = `/v2/workspace-bulk-files?topic_id=${payload.topic_id}&is_primary=${payload.is_primary}`;
  return apiCall({
    method: "POST",
    url: url,
    data: payload.files,
  });
}

export function getWorkspaceFiles(payload) {
  return apiCall({
    method: "GET",
    url: `/v2/workspace-files?${objToUrlParams(payload)}`,
  });
}

export function getWorkspaceTrashFiles(payload) {
  return apiCall({
    method: "GET",
    url: `/v2/workspace-trash-files?${objToUrlParams(payload)}`,
  });
}

export function getWorkspaceFavoriteFiles(payload) {
  return apiCall({
    method: "GET",
    url: `/v2/workspace-favorite-files?${objToUrlParams(payload)}`,
  });
}

export function getWorkspaceRecentlyEditedFiles(payload) {
  return apiCall({
    method: "GET",
    url: `/v2/workspace-recent-edited-files?${objToUrlParams(payload)}`,
  });
}

export function getWorkspacePopularFiles(payload) {
  return apiCall({
    method: "GET",
    url: `/v2/workspace-popular-files?${objToUrlParams(payload)}`,
  });
}

export function getWorkspacePrimaryFiles(payload) {
  return apiCall({
    method: "GET",
    url: `/v2/workspace-primary-files?${objToUrlParams(payload)}`,
  });
}

export function getWorkspaceFolders(payload) {
  return apiCall({
    method: "GET",
    url: `/v2/workspace-folders?${objToUrlParams(payload)}`,
  });
}

export function getWorkspaceFoldersBreadcrumb(payload) {
  return apiCall({
    method: "GET",
    url: `/v2/workspace-folder-breadcrumbs?${objToUrlParams(payload)}`,
  });
}

export function getWorkspaceFilesDetail(payload) {
  return apiCall({
    method: "GET",
    url: `/v2/workspace-files-detail?${objToUrlParams(payload)}`,
  });
}

export function patchWorkspaceFileViewed(payload) {
  return apiCall({
    method: "PATCH",
    url: `/v2/workspace-file-viewed?${objToUrlParams(payload)}`,
  });
}

/**
 * @param {Object} payload
 * @param {number} payload.topic_id
 * @returns {Promise<*>}
 */
export function uploadWorkspaceFile(payload) {
  let url = `/v2/workspace-files?topic_id=${payload.topic_id}`;
  return apiCall({
    method: "POST",
    url: url,
    data: payload,
  });
}

/**
 * @param {Object} payload
 * @param {number} payload.link_id
 * @param {string} payload.link_type
 * @param {number} payload.file_id
 * @returns {Promise<*>}
 */
export function restoreWorkspaceFile(payload) {
  let url = "/v2/workspace-restore-file";
  return apiCall({
    method: "PUT",
    url: url,
    data: payload,
  });
}

/**
 * @param {Object} payload
 * @param {number} payload.link_id
 * @param {string} payload.link_type
 * @param {number} payload.file_id
 * @returns {Promise<*>}
 */
export function deleteWorkspaceFile(payload) {
  let url = "/v2/workspace-delete-files";
  return apiCall({
    method: "DELETE",
    url: url,
    data: payload,
  });
}

export function putWorkspaceRestoreFile(payload) {
  let url = "/v2/workspace-restore-file";
  return apiCall({
    method: "PUT",
    url: url,
    data: payload,
  });
}

export function putWorkspaceRestoreFolder(payload) {
  let url = "/v2/workspace-restore-folder";
  return apiCall({
    method: "PUT",
    url: url,
    data: payload,
  });
}

/**
 * @param {Object} payload
 * @param {number} payload.topic_id
 * @param {string} payload.name
 * @returns {Promise<*>}
 */
export function postFolder(payload) {
  let url = "/v2/workspace-folders";
  return apiCall({
    method: "POST",
    url: url,
    data: payload,
  });
}
/**
 * @param {Object} payload
 * @param {number} payload.topic_id
 * @param {string} payload.name
 * @returns {Promise<*>}
 */
export function postGoogleDriveFolder(payload) {
  let url = "/v2/workspace-gdrive/create-folder";
  return apiCall({
    method: "POST",
    url: url,
    data: payload,
  });
}
/**
 * @param {Object} payload
 * @param {number} payload.workspace_id
 * @param {string} payload.title
 * @param {string} payload.doc_type
 * @returns {Promise<*>}
 */
export function postGoogleDriveFile(payload) {
  let url = "/v2/workspace-gdrive/create-file";
  return apiCall({
    method: "POST",
    url: url,
    data: payload,
  });
}

/**
 * @param {Object} payload
 * @param {number} payload.topic_id
 * @param {string} payload.name
 * @returns {Promise<*>}
 */
export function putFolder(payload) {
  let url = `/v2/workspace-folders/${payload.id}`;
  return apiCall({
    method: "PUT",
    url: url,
    data: payload,
  });
}

/**
 * @param {Object} payload
 * @param {number} payload.topic_id
 * @param {number} payload.folder_id
 * @returns {Promise<*>}
 */
export function uploadWorkspaceFiles(payload) {
  let url = `/v2/workspace-bulk-files?topic_id=${payload.topic_id}&is_primary=0`;
  if (payload.folder_id) {
    url += `&folder_id=${payload.folder_id}`;
  }
  return apiCall({
    method: "POST",
    url: url,
    data: payload.files,
  });
}

/**
 * @param {Object} payload
 * @param {number} payload.topic_id
 * @param {string} payload.id
 * @returns {Promise<*>}
 */
export function deleteFolder(payload) {
  let url = `/v2/workspace-folders/${payload.id}?topic_id=${payload.topic_id}`;
  if (payload.force_delete) {
    url += "&force_delete=1";
  }
  return apiCall({
    method: "DELETE",
    url: url,
    data: payload,
  });
}

/**
 * @param {Object} payload
 * @param {number} payload.type_id
 * @param {string} payload.type
 * @returns {Promise<*>}
 */
export function postFavorite(payload) {
  let url = "/v1/favourites";
  return apiCall({
    method: "POST",
    url: url,
    data: payload,
  });
}

/**
 * @param {Object} payload
 * @param {number} payload.link_id
 * @param {number} payload.file_id
 * @param {string} payload.link_type
 * @returns {Promise<*>}
 */
export function deleteFile(payload) {
  let url = `/v2/workspace-files/${payload.file_id}?topic_id=${payload.topic_id}`;
  if (payload.force_delete) {
    url += "&force_delete=1";
  }
  return apiCall({
    method: "DELETE",
    url: url,
    data: payload,
  });
}

/**
 * @param {Object} payload
 * @param {number} payload.id
 * @param {number} payload.topic_id
 * @param {string} payload.name
 * @returns {Promise<*>}
 */
export function putFile(payload) {
  let url = `/v2/workspace-files/${payload.id}`;
  return apiCall({
    method: "PUT",
    url: url,
    data: payload,
  });
}

/**
 * @param {Object} payload
 * @param {number} payload.topic_id
 * @returns {Promise<*>}
 */
export function deleteTrash(payload) {
  let url = `/v2/workspace-delete-all-trash-files?topic_id=${payload.topic_id}`;
  return apiCall({
    method: "DELETE",
    url: url,
    data: payload,
  });
}

/**
 * @param {Object} payload
 * @param {number} payload.file_id
 * @param {number} payload.topic_id
 * @param {number} payload.folder_id
 * @returns {Promise<*>}
 */
export function moveFile(payload) {
  let url = "/v2/workspace-file-move";
  return apiCall({
    method: "PUT",
    url: url,
    data: payload,
  });
}

/**
 * @param {Object} payload
 * @param {number} payload.file_id
 * @param {number} payload.post_id
 * @param {number} payload.message_id
 * @returns {Promise<*>}
 */
export function deletePostFile(payload) {
  //let url = `/v2/post-delete-attachment?post_id=${payload.post_id}&file_id=${payload.file_id}`;
  return apiCall({
    method: "DELETE",
    url: `/v2/post-delete-attachment?${objToUrlParams(payload)}`,
    data: payload,
  });
}

/**
 * @param {Object} payload
 * @param {number} payload.topic_id
 * @param {number} payload.is_primary
 * @param {array} payload.file_ids
 * @returns {Promise<*>}
 */
export function deleteWorkspaceFiles(payload) {
  return apiCall({
    method: "DELETE",
    url: "/v2/workspace-bulk-files",
    data: payload,
  });
}

export function postGoogleAttachments(payload) {
  return apiCall({
    method: "POST",
    url: "/v2/google-attachments",
    data: payload,
  });
}

export function getWorkspaceGoogleFileAttachments(payload) {
  return apiCall({
    method: "GET",
    url: `/v2/workspace-google-attachments?topic_id=${payload.workspace_id}&attachment_type=FILE`,
    data: payload,
  });
}

export function getWorkspaceGoogleFolderAttachments(payload) {
  return apiCall({
    method: "GET",
    url: `/v2/workspace-google-attachments?topic_id=${payload.workspace_id}&attachment_type=FOLDER`,
    data: payload,
  });
}

export function getCompanyGoogleAttachmentsFile(payload) {
  return apiCall({
    method: "GET",
    url: "/v2/company/google-attachments?attachment_type=FILE",
    data: payload,
  });
}

export function getCompanyGoogleAttachmentsFolder(payload) {
  return apiCall({
    method: "GET",
    url: "/v2/company/google-attachments?attachment_type=FOLDER",
    data: payload,
  });
}

/**
 * @param {Object} payload
 * @param {number} attachment_id
 * @param {number} link_id
 * @param {string} link_type
 * @param {string} attachment_type
 * @returns {Promise<*>}
 */
export function deleteGoogleAttachment(payload) {
  return apiCall({
    method: "DELETE",
    url: "/v2/google-attachments",
    data: payload,
  });
}

export function getCompanyFiles(payload) {
  return apiCall({
    method: "GET",
    url: `/v2/company/files?${objToUrlParams(payload)}`,
  });
}

export function getCompanyFavoriteFiles(payload) {
  return apiCall({
    method: "GET",
    url: `/v2/company/favorite-files?${objToUrlParams(payload)}`,
  });
}

export function getCompanyRecentEditedFiles(payload) {
  return apiCall({
    method: "GET",
    url: `/v2/company/recent-edited-files?${objToUrlParams(payload)}`,
  });
}

export function getCompanyPopularFiles(payload) {
  return apiCall({
    method: "GET",
    url: `/v2/company/popular-files?${objToUrlParams(payload)}`,
  });
}

export function getCompanyTrashedFiles(payload) {
  return apiCall({
    method: "GET",
    url: `/v2/company/trashed-files?${objToUrlParams(payload)}`,
  });
}

export function postCompanyUploadFiles(payload) {
  return apiCall({
    method: "POST",
    url: "/v2/company/upload-files",
    data: payload,
    hasFile: true,
  });
}

export function postCompanyUploadBulkFiles(payload) {
  let url = "/v2/company/upload-bulk-files";
  if (payload.folder_id) {
    url += `?folder_id=${payload.folder_id}`;
  }
  return apiCall({
    method: "POST",
    url: url,
    data: payload.files,
  });
}

export function deleteCompanyFiles(payload) {
  let url = `/v2/company/files/${payload.file_id}`;
  if (payload.force_delete) {
    url += "?force_delete=1";
  }
  return apiCall({
    method: "DELETE",
    url: url,
    data: payload,
  });
}

export function putCompanyRestoreFile(payload) {
  return apiCall({
    method: "PUT",
    url: "/v2/company/restore-file",
    data: payload,
  });
}

export function putCompanyRestoreFolder(payload) {
  return apiCall({
    method: "PUT",
    url: "/v2/company/restore-folder",
    data: payload,
  });
}

export function putCompanyFiles(payload) {
  return apiCall({
    method: "PUT",
    url: `/v2/company/files/${payload.id}`,
    data: payload,
  });
}

export function putCompanyFileMove(payload) {
  return apiCall({
    method: "PUT",
    url: `/v2/company/file-move/?${objToUrlParams(payload)}`,
    data: payload,
  });
}

export function putCompanyFolders(payload) {
  return apiCall({
    method: "PUT",
    url: `/v2/company/folders/${payload.id}`,
    data: payload,
  });
}

export function deleteCompanyDeleteAllTrashFiles(payload) {
  return apiCall({
    method: "DELETE",
    url: `/v2/company/delete-all-trash-files?${objToUrlParams(payload)}`,
  });
}

export function patchCompanyFileViewed(payload) {
  return apiCall({
    method: "PATCH",
    url: `/v2/company/file-viewed?${objToUrlParams(payload)}`,
  });
}

export function getCompanyFilesDetail(payload = {}) {
  return apiCall({
    method: "GET",
    url: `/v2/company/files-detail?${objToUrlParams(payload)}`,
  });
}

/**
 *
 * @param payload
 * @param payload.folder_id
 * @returns {Promise<*>}
 */
export function getCompanyFolderBreadCrumbs(payload) {
  return apiCall({
    method: "GET",
    url: `/v2/company/folder-breadcrumbs?${objToUrlParams(payload)}`,
  });
}

export function getCompanyFolders(payload) {
  return apiCall({
    method: "GET",
    url: `/v2/company/folders?${objToUrlParams(payload)}`,
  });
}

export function postCompanyFolders(payload) {
  return apiCall({
    method: "POST",
    url: "/v2/company/folders",
    data: payload,
  });
}

export function deleteCompanyFolders(payload) {
  return apiCall({
    method: "DELETE",
    url: `/v2/company/folders/${payload.id}`,
    data: payload,
  });
}

export function removeFileDownload(payload) {
  return apiCall({
    method: "POST",
    url: `/v1/download-file/${payload.file_id}`,
    data: payload,
  });
}

export function postDriveLink(payload) {
  let url = "/v2/drive/links";
  if (payload.topic_id) {
    url = `/v2/drive/links?topic_id=${payload.topic_id}`;
  }
  return apiCall({
    method: "POST",
    url: url,
    data: payload,
  });
}

export function getDriveLinks(payload) {
  let url = "/v2/drive/links";
  if (payload.topic_id) {
    url = `/v2/drive/links?topic_id=${payload.topic_id}`;
  }
  return apiCall({
    method: "GET",
    url: url,
    data: payload,
  });
}

export function putDriveLink(payload) {
  return apiCall({
    method: "PUT",
    url: `/v2/drive/links/${payload.id}`,
    data: payload,
  });
}

export function deleteDriveLink(payload) {
  return apiCall({
    method: "DELETE",
    url: `/v2/drive/links/${payload.id}`,
    data: payload,
  });
}
