import React, { useRef } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { copyTextToClipboard } from "../../helpers/commonFunctions";
import {
  addCompanyFileSearchResults,
  addFileSearchResults,
  addFolder,
  addRemoveFavorite,
  clearFileSearchResults,
  deleteCompanyDeleteAllTrashFiles,
  deleteCompanyFiles,
  deleteCompanyFolders,
  deleteFile,
  deleteFolder,
  deleteGoogleAttachment,
  deleteTrash,
  favoriteFile,
  getCompanyFavoriteFiles,
  getCompanyFiles,
  getCompanyFilesDetail,
  getCompanyFolderBreadCrumbs,
  getCompanyFolders,
  getCompanyGoogleAttachmentsFile,
  getCompanyGoogleAttachmentsFolder,
  getCompanyPopularFiles,
  getCompanyRecentEditedFiles,
  getCompanyTrashedFiles,
  getClientChatFiles,
  getPrivatePostFiles,
  getTeamChatFiles,
  getClientPostFiles,
  getWorkspaceFavoriteFiles,
  getWorkspaceFiles,
  getWorkspaceFilesDetail,
  getWorkspaceFolders,
  getWorkspaceFoldersBreadcrumb,
  getWorkspaceGoogleFileAttachments,
  getWorkspaceGoogleFolderAttachments,
  getWorkspacePopularFiles,
  getWorkspacePrimaryFiles,
  getWorkspaceRecentlyEditedFiles,
  getWorkspaceTrashFiles,
  incomingFileData,
  incomingFileThumbnailData,
  incomingGifData,
  patchCompanyFileViewed,
  postCompanyFolders,
  postCompanyUploadBulkFiles,
  postCompanyUploadFiles,
  postGoogleAttachments,
  putCompanyFileMove,
  putCompanyFiles,
  putCompanyFolders,
  putCompanyRestoreFile,
  putCompanyRestoreFolder,
  putFile,
  putFolder,
  putWorkspaceRestoreFile,
  putWorkspaceRestoreFolder,
  registerGoogleDriveFile,
  setViewFiles,
  uploadCompanyFilesReducer,
  uploadFilesReducer,
  uploadWorkspaceFiles,
  removeCompanyFilesUploadingBar,
  removeWorkspaceFilesUploadingBar,
} from "../../redux/actions/fileActions";
import { addToModals } from "../../redux/actions/globalActions";
import { useToaster } from "./index";
import { useTranslationActions, useGetSlug } from "../hooks";

const useFileActions = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const history = useHistory();
  const { slug } = useGetSlug();
  const toaster = useToaster();

  const fileName = useRef("");

  const workspace = useSelector((state) => state.workspaces.activeTopic);
  const sharedWs = useSelector((state) => state.workspaces.sharedWorkspaces);
  let sharedPayload = null;
  if (params.workspaceId && history.location.pathname.startsWith("/shared-hub") && workspace && sharedWs[workspace.slug]) {
    sharedPayload = { slug: workspace.slug, token: sharedWs[workspace.slug].access_token, is_shared: true };
  }

  const { _t } = useTranslationActions();

  const getFileIcon = (mimeType = "") => {
    if (mimeType) {
      if (mimeType === "trashed") {
        return <i class="fa fa-exclamation-triangle text-danger"></i>;
      } else if (mimeType.includes("image")) {
        return <i className="fa fa-file-image-o text-instagram" />;
      } else if (mimeType.includes("audio")) {
        return <i className="fa fa-file-audio-o text-dark" />;
      } else if (mimeType.includes("video")) {
        return <i className="fa fa-file-video-o text-google" />;
      } else if (mimeType.includes("pdf")) {
        return <i className="fa fa-file-pdf-o text-danger" />;
      } else if (mimeType.includes("zip") || mimeType.includes("archive") || mimeType.includes("x-rar")) {
        return <i className="fa fa-file-zip-o text-primary" />;
      } else if (mimeType.includes("word") || mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        return <i className="fa fa-file-word-o text-info" />;
      } else if (
        mimeType.includes("excel") ||
        mimeType.includes("spreadsheet") ||
        mimeType.includes("csv") ||
        mimeType.includes("numbers") ||
        //mimeType.includes("xml") ||
        mimeType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ) {
        return <i className="fa fa-file-excel-o text-success" />;
      } else if (mimeType.includes("powerpoint") || mimeType.includes("presentation")) {
        return <i className="fa fa-file-powerpoint-o text-secondary" />;
      } else if (mimeType.includes("script")) {
        return <i className="fa fa-file-code-o" />;
      } else return <i className="fa fa-file-text-o text-warning" />;
    } else {
      return <i className="fa fa-file-text-o text-warning" />;
    }
  };

  const dictionary = {
    buttonCancel: _t("BUTTON.CANCEL", "Cancel"),
    buttonRemove: _t("BUTTON.REMOVE", "Remove"),
    removeHeaderFolder: _t("FILES.REMOVE_HEADER", "Remove folder for everyone?"),
    removeBodyFolder: _t("FILES.REMOVE_BODY", "This folder will be moved to the recycle bin and will be permanently removed after thirty (30) days."),
    removeConfirmation: _t("FILES.REMOVE_HEADER", "This folder will be removed permanently."),
    rootFolder: _t("OPTIONS.ROOT_FOLDER", "Root folder"),
  };

  const fetchCompanyFiles = (payload, callback) => {
    dispatch(getCompanyFiles(payload, callback));
  };

  const fetchCompanyFavoriteFiles = (payload, callback) => {
    dispatch(getCompanyFavoriteFiles(payload, callback));
  };

  const fetchCompanyFilesDetail = (payload, callback) => {
    dispatch(getCompanyFilesDetail(payload, callback));
  };

  const fetchCompanyFolderBreadCrumbs = (payload, callback) => {
    dispatch(getCompanyFolderBreadCrumbs(payload, callback));
  };

  const fetchCompanyFolders = (payload, callback) => {
    dispatch(getCompanyFolders(payload, callback));
  };

  const fetchCompanyPopularFiles = (payload, callback) => {
    dispatch(getCompanyPopularFiles(payload, callback));
  };

  const fetchCompanyRecentEditedFiles = (payload, callback) => {
    dispatch(getCompanyRecentEditedFiles(payload, callback));
  };

  const fetchCompanyTrashedFiles = (payload, callback) => {
    dispatch(getCompanyTrashedFiles(payload, callback));
  };

  const createCompanyFolders = (payload, callback) => {
    dispatch(postCompanyFolders(payload, callback));
  };

  const uploadCompanyFiles = (payload, callback) => {
    dispatch(postCompanyUploadFiles(payload, callback));
  };

  const deleteCompanyFilesUpload = (payload) => {
    dispatch(removeCompanyFilesUploadingBar(payload));
  };

  const uploadCompanyBulkFiles = (payload, ids) => {
    dispatch(
      postCompanyUploadBulkFiles(payload, (err, res) => {
        deleteCompanyFilesUpload({ fileIds: ids });
      })
    );
  };

  const viewCompanyFile = (payload, callback) => {
    dispatch(patchCompanyFileViewed(payload, callback));
  };

  const updateCompanyFiles = (payload, callback) => {
    dispatch(putCompanyFiles(payload, callback));
  };

  const updateCompanyFolders = (payload, callback) => {
    dispatch(putCompanyFolders(payload, callback));
  };

  const deleteCompanyFolder = (payload, callback) => {
    dispatch(deleteCompanyFolders(payload, callback));
  };

  const getFiles = (payload, callback) => {
    dispatch(getWorkspaceFiles(payload, callback));
  };

  const getPrimaryFiles = (id, callback) => {
    dispatch(getWorkspacePrimaryFiles({ topic_id: id }, callback));
  };

  const getGoogleDriveFiles = (payload, callback) => {
    dispatch(
      getWorkspaceGoogleFileAttachments(
        {
          ...payload,
          workspace_id: payload.topic_id,
        },
        callback
      )
    );
  };

  const getGoogleDriveFolders = (payload, callback) => {
    dispatch(
      getWorkspaceGoogleFolderAttachments(
        {
          ...payload,
          workspace_id: payload.topic_id,
        },
        callback
      )
    );
  };

  const getCompanyGoogleDriveFolders = (id, callback) => {
    dispatch(getCompanyGoogleAttachmentsFolder({}, callback));
  };

  const getCompanyGoogleDriveFiles = (id, callback) => {
    dispatch(
      getCompanyGoogleAttachmentsFile(
        {
          workspace_id: id,
        },
        callback
      )
    );
  };

  const getFilesDetail = (payload, callback) => {
    dispatch(getWorkspaceFilesDetail(payload, callback));
  };

  const getPopularFiles = (payload, callback) => {
    dispatch(getWorkspacePopularFiles(payload, callback));
  };

  const getEditedFiles = (payload, callback) => {
    dispatch(getWorkspaceRecentlyEditedFiles(payload, callback));
  };

  const getTrashFiles = (payload, callback) => {
    dispatch(getWorkspaceTrashFiles(payload, callback));
  };

  const createFolder = (payload, callback) => {
    dispatch(addFolder(payload, callback));
  };

  const getFolders = (payload, callback) => {
    dispatch(getWorkspaceFolders(payload, callback));
  };

  const getFoldersBreadcrumb = (payload, callback) => {
    dispatch(getWorkspaceFoldersBreadcrumb(payload, callback));
  };

  const updateFolder = (payload, callback) => {
    dispatch(putFolder(payload, callback));
  };

  const uploadFiles = (payload, callback) => {
    if (sharedPayload) {
      payload = {
        ...payload,
        sharedPayload: sharedPayload,
      };
    }
    dispatch(uploadWorkspaceFiles(payload, callback));
  };

  const uploadWorkspaceGoogleDriveFile = (workspaceId, payload, callback) => {
    dispatch(
      postGoogleAttachments(
        {
          link_id: workspaceId,
          link_type: "topic",
          attachment_type: payload.type === "folder" ? "FOLDER" : "FILE",
          payload: payload,
        },
        callback
      )
    );
  };

  const uploadCompanyGoogleDriveFile = (payload, callback) => {
    dispatch(
      postGoogleAttachments(
        {
          link_type: "company_drive",
          attachment_type: payload.type === "folder" ? "FOLDER" : "FILE",
          payload: payload,
        },
        callback
      )
    );
  };

  const removeFolder = (folder, topic_id, callback) => {
    const handleDeleteFolder = () => {
      let payload = {
        id: folder.id,
        topic_id: topic_id,
      };
      if (folder.is_archived) {
        payload = {
          ...payload,
          force_delete: 1,
        };
      }
      dispatch(deleteFolder(payload, callback));
    };
    let modal = {
      type: "confirmation",
      headerText: dictionary.removeHeaderFolder,
      submitText: dictionary.buttonRemove,
      cancelText: dictionary.buttonCancel,
      bodyText: dictionary.removeBodyFolder,
      actions: {
        onSubmit: handleDeleteFolder,
      },
    };
    if (folder.is_archived) {
      modal = {
        ...modal,
        bodyText: dictionary.removeConfirmation,
      };
    }

    dispatch(addToModals(modal));
  };

  const removeCompanyFolder = (folder, callback) => {
    const handleDeleteFolder = () => {
      let payload = {
        id: folder.id,
      };
      if (folder.is_archived) {
        payload = {
          ...payload,
          force_delete: 1,
        };
      }
      dispatch(deleteCompanyFolders(payload, callback));
    };
    let modal = {
      type: "confirmation",
      headerText: "Remove folder for everyone?",
      submitText: "Remove",
      cancelText: "Cancel",
      bodyText: "This folder will be moved to the recycle bin and will be permanently removed after thirty (30) days.",
      actions: {
        onSubmit: handleDeleteFolder,
      },
    };
    if (folder.is_archived) {
      modal = {
        ...modal,
        bodyText: "This folder will be removed permanently.",
      };
    }

    dispatch(addToModals(modal));
  };

  const removeFile = (file, force_delete = false) => {
    const handleDeleteFile = () => {
      let payload = {
        file_id: file.id,
        link_id: file.link_id,
        link_type: file.link_type,
        topic_id: params.workspaceId,
      };
      if (force_delete) {
        payload = {
          ...payload,
          force_delete: 1,
        };
      }
      if (sharedPayload) {
        payload = {
          ...payload,
          sharedPayload: sharedPayload,
        };
      }
      dispatch(
        deleteFile(payload, (err, res) => {
          if (err) return;
          toaster.info(`You have removed ${file.search}.`);
        })
      );
    };
    let payload = {
      type: "confirmation",
      headerText: "Remove file",
      submitText: "Remove",
      cancelText: "Cancel",
      bodyText: "This file will be moved to the recycle bin and will be permanently removed after thirty (30) days.",
      actions: {
        onSubmit: handleDeleteFile,
      },
    };

    dispatch(addToModals(payload));
  };

  const removeCompanyFile = (file, callback = () => {}, forceDelete = false) => {
    const handleDeleteFile = () => {
      let payload = {
        file_id: file.id,
        link_id: file.link_id,
        link_type: file.link_type,
      };
      if (forceDelete) {
        payload = {
          ...payload,
          force_delete: 1,
        };
      }

      dispatch(
        deleteCompanyFiles(payload, (err, res) => {
          toaster.info(`You have removed ${file.search}.`);
          callback(err, res);
        })
      );
    };
    let payload = {
      type: "confirmation",
      headerText: "Remove file",
      submitText: "Remove",
      cancelText: "Cancel",
      bodyText: "This file will be moved to the recycle bin and will be permanently removed after thirty (30) days.",
      actions: {
        onSubmit: handleDeleteFile,
      },
    };

    dispatch(addToModals(payload));
  };

  const renameFile = (file, callback) => {
    const handleUpdateFileName = () => {
      let payload = {
        id: file.id,
        name: fileName.current,
        topic_id: params.workspaceId,
      };
      if (sharedPayload) {
        payload = {
          ...payload,
          sharedPayload: sharedPayload,
        };
      }
      dispatch(
        putFile(payload, (err, res) => {
          callback(err, res);
          if (err) {
            toaster.error(
              <span>
                System failed to rename the <b>{file.search}</b> to {fileName.current}.
              </span>
            );
            return;
          }

          if (res) {
            toaster.success(
              <span>
                You renamed <b>{file.search}</b> to {fileName.current}.
              </span>
            );
          }
        })
      );
    };

    const handleFileNameClose = () => {
      fileName.current = "";
    };

    const handleFileNameChange = (e) => {
      fileName.current = e.target.value.trim();
    };

    let filename = file.search.split(".").slice(0, -1).join(".");
    if (filename === "") {
      filename = file.search;
    }
    //let extension = f.search.split(".").slice(1, 2).join(".");

    fileName.current = filename;
    let payload = {
      type: "single_input",
      preInputLabel: "Renaming the file will update the filename for everyone.",
      label: "Filename",
      defaultValue: filename,
      title: "Rename file",
      labelPrimaryAction: "Rename file",
      onPrimaryAction: handleUpdateFileName,
      onChange: handleFileNameChange,
      onClose: handleFileNameClose,
    };

    dispatch(addToModals(payload));
  };

  const renameCompanyFile = (file, callback) => {
    const handleUpdateFileName = () => {
      let name = fileName.current;
      let oname = file.search.split(".");
      if (oname.length >= 2) {
        name = `${name}.${oname.pop()}`;
      }
      updateCompanyFiles(
        {
          id: file.id,
          name: name,
        },
        (err, res) => {
          if (err) {
            toaster.error(
              <span>
                System failed to rename the <b>{file.search}</b> to {fileName.current}.
              </span>
            );
          }

          if (res) {
            toaster.success(
              <span>
                You renamed <b>{file.search}</b> to {fileName.current}.
              </span>
            );
          }

          callback(err, res);
        }
      );
    };

    const handleFileNameClose = () => {
      fileName.current = "";
    };

    const handleFileNameChange = (e) => {
      fileName.current = e.target.value.trim();
    };

    let filename = file.search.split(".").slice(0, -1).join(".");
    if (filename === "") {
      filename = file.search;
    }
    //let extension = f.search.split(".").slice(1, 2).join(".");

    fileName.current = filename;
    let payload = {
      type: "single_input",
      defaultValue: filename,
      title: "Update filename",
      preInputLabel: "Renaming the file will update the filename for everyone.",
      label: "Filename",
      labelPrimaryAction: "Rename file",
      onPrimaryAction: handleUpdateFileName,
      onChange: handleFileNameChange,
      onClose: handleFileNameClose,
    };

    dispatch(addToModals(payload));
  };

  const favorite = (file, callback) => {
    const cb = (err, res) => {
      if (err) {
        toaster.error(
          <div>
            System failed to mark the file <b>{file.search}</b> {!file.is_favorite ? "as favorite" : "unfavorite"}
          </div>
        );

        return;
      }

      if (res) {
        let payload = {
          file_id: file.id,
          topic_id: params.workspaceId,
          is_favorite: !file.is_favorite,
          slug: workspace.slug,
        };
        if (params.hasOwnProperty("fileFolderId")) {
          payload = {
            ...payload,
            folder_id: params.fileFolderId,
          };
        }

        dispatch(
          addRemoveFavorite(payload, () => {
            toaster.success(
              <>
                You have marked <b>{file.search}</b> {file.is_favorite ? "as favorite" : "unfavorite"}
              </>
            );
          })
        );
      }
    };
    let payload = {
      type_id: file.id,
      type: "file",
    };
    if (sharedPayload) {
      payload = {
        ...payload,
        sharedPayload: sharedPayload,
      };
    }
    dispatch(favoriteFile(payload, cb));
  };

  const getFavoriteFiles = (payload, callback) => {
    dispatch(getWorkspaceFavoriteFiles(payload, callback));
  };

  const viewFiles = (file, callback) => {
    if (file.hasOwnProperty("payload_id")) {
      let a = document.createElement("a");
      a.href = file.download_link.replace("/preview", "/view");
      a.target = "_blank";
      a.click();
    } else {
      let payload = {
        workspace_id: params.workspaceId,
        file_id: file.id,
        sharedSlug: workspace ? workspace.sharedSlug : false,
        slug: workspace ? workspace.slug : slug,
      };
      dispatch(setViewFiles(payload, callback));
    }
  };

  const viewCompanyFiles = (file, files = [], callback) => {
    if (file.hasOwnProperty("payload_id")) {
      let a = document.createElement("a");
      a.href = file.download_link.replace("/preview", "/view");
      a.target = "_blank";
      a.click();
    } else {
      let payload = {
        file_id: file.id,
        files: Object.values(files),
      };
      dispatch(setViewFiles(payload, callback));
    }
  };

  const search = (searchValue) => {
    let payload = {
      topic_id: params.workspaceId,
      search: searchValue,
      slug: workspace.slug,
    };
    const cb = (err, res) => {
      if (err) return;
      dispatch(
        addFileSearchResults({
          ...payload,
          search_results: res.data.files,
        })
      );
    };
    dispatch(getWorkspaceFiles(payload, cb));
  };

  const searchCompany = (searchValue) => {
    let payload = {
      search: searchValue,
    };
    const cb = (err, res) => {
      if (err) return;
      dispatch(
        addCompanyFileSearchResults({
          ...payload,
          search_results: res.data.files,
        })
      );
    };
    fetchCompanyFiles(payload, cb);
  };

  const clearSearch = () => {
    let payload = {
      topic_id: params.workspaceId,
      slug: workspace.slug,
    };

    dispatch(clearFileSearchResults(payload));
  };

  const copyLink = (link) => {
    copyTextToClipboard(toaster, link);
  };

  const removeTrashFiles = () => {
    const handleDeleteTrash = () => {
      dispatch(
        deleteTrash({
          topic_id: params.workspaceId,
          sharedPayload: sharedPayload,
        })
      );
    };
    let payload = {
      type: "confirmation",
      headerText: "Empty trash",
      submitText: "Empty",
      cancelText: "Cancel",
      bodyText: "Are you sure you want to empty the trash?",
      actions: {
        onSubmit: handleDeleteTrash,
      },
    };

    dispatch(addToModals(payload));
  };

  const removeAllCompanyTrashFiles = () => {
    const handleDeleteTrash = () => {
      dispatch(deleteCompanyDeleteAllTrashFiles({}));
    };
    let payload = {
      type: "confirmation",
      headerText: "Empty trash",
      submitText: "Empty",
      cancelText: "Cancel",
      bodyText: "Are you sure you want to empty the trash?",
      actions: {
        onSubmit: handleDeleteTrash,
      },
    };

    dispatch(addToModals(payload));
  };

  const moveFile = (file) => {
    let payload = {
      type: "move_files",
      file: file,
      topic_id: params.workspaceId,
      folder_id: null,
      params: params,
    };

    if (params.hasOwnProperty("fileFolderId")) {
      payload = {
        ...payload,
        folder_id: params.fileFolderId,
      };
    }

    dispatch(addToModals(payload));
  };

  const moveCompanyFile = (file) => {
    const handleMoveFile = (payload, callback = () => {}, options = {}) => {
      dispatch(
        putCompanyFileMove(payload, (err, res) => {
          if (err) {
            toaster.error(
              <div>
                Failed to move <b>{file.search}</b> to folder <strong>{options.selectedFolder}</strong>
              </div>
            );
          }
          if (res) {
            toaster.success(
              <div>
                <strong>{file.search}</strong> has been moved to folder <strong>{options.selectedFolder}</strong>
              </div>
            );
          }
          callback(err, res);
        })
      );
    };

    let payload = {
      type: "move_company_files",
      dictionary: {
        headerText: "Move files",
        submitText: "Move",
        cancelText: "Cancel",
        bodyText: file.search,
        rootFolder: dictionary.rootFolder,
      },
      file: file,
      folder_id: null,
      actions: {
        onSubmit: handleMoveFile,
      },
    };

    if (params.hasOwnProperty("folderId")) {
      payload = {
        ...payload,
        folder_id: params.folderId,
      };
    }

    dispatch(addToModals(payload));
  };

  const download = (file) => {
    const handleDownloadFile = () => {
      if (file.hasOwnProperty("payload_id")) {
        let a = document.createElement("a");
        a.href = `https://drive.google.com/u/0/uc?export=download&id=${file.payload_id}`;
        a.target = "_blank";
        a.click();
      } else {
        let a = document.createElement("a");
        a.href = file.download_link;
        a.target = "_blank";
        a.click();
      }
    };
    let payload = {
      type: "confirmation",
      headerText: "Download file",
      submitText: "Download",
      cancelText: "Cancel",
      bodyText: `Download ${file.search}?`,
      actions: {
        onSubmit: handleDownloadFile,
      },
    };

    dispatch(addToModals(payload));
  };

  const getFileSizeUnit = (size) => {
    if (size) {
      if (size < 1e6) {
        return {
          size: size / 1000,
          unit: "KB",
        };
      } else if (size < 1e9) {
        return {
          size: size / 1e6,
          unit: "MB",
        };
      } else if (size < 1e12) {
        return {
          size: size / 1e9,
          unit: "GB",
        };
      }
    } else {
      return {
        size: 0,
        unit: "KB",
      };
    }
  };

  const uploadingFiles = (payload) => {
    dispatch(uploadFilesReducer(payload));
  };

  const uploadingCompanyFiles = (payload) => {
    dispatch(uploadCompanyFilesReducer(payload));
  };

  const unlinkGoogleAttachment = (file) => {
    const handleDeleteFile = () => {
      let payload = {
        link_id: file.link_id,
        link_type: "topic_drive",
        attachment_type: file.attachment_type,
        attachment_id: file.id,
        payload: {
          id: file.payload_id,
          name: file.search,
          mime_type: file.mime_type,
        },
      };
      if (sharedPayload) {
        payload = {
          ...payload,
          sharedPayload: sharedPayload,
        };
      }
      dispatch(
        deleteGoogleAttachment(payload, (err, res) => {
          if (err) return;
          toaster.info(`You have removed ${file.search}.`);
        })
      );
    };
    let payload = {
      type: "confirmation",
      headerText: "Remove Google attachment",
      submitText: "Remove",
      cancelText: "Cancel",
      bodyText: "Are you sure you want to remove this file?",
      actions: {
        onSubmit: handleDeleteFile,
      },
    };

    dispatch(addToModals(payload));
  };

  const unlinkGoogleFolder = (folder) => {
    const handleDeleteFolder = () => {
      let payload = {
        link_id: folder.link_id,
        link_type: "topic_drive",
        attachment_type: folder.attachment_type,
        attachment_id: folder.id,
        payload: {
          id: folder.payload_id,
          name: folder.search,
          mime_type: folder.mime_type,
        },
      };
      dispatch(
        deleteGoogleAttachment(payload, (err, res) => {
          toaster.info(`You have removed ${folder.search}.`);
        })
      );
    };
    let payload = {
      type: "confirmation",
      headerText: "Remove Google folder",
      cancelText: "Cancel",
      submitText: "Remove",
      bodyText: "Are you sure you want to remove this folder?",
      actions: {
        onSubmit: handleDeleteFolder,
      },
    };

    dispatch(addToModals(payload));
  };

  const addGoogleDriveFile = (payload) => {
    dispatch(registerGoogleDriveFile(payload));
  };

  const restoreWorkspaceFile = (payload, callback = () => {}) => {
    if (sharedPayload) {
      payload = {
        ...payload,
        sharedPayload: sharedPayload,
      };
    }
    dispatch(
      putWorkspaceRestoreFile(
        {
          ...payload,
          topic_id: params.workspaceId,
        },
        callback
      )
    );
  };

  const restoreCompanyFile = (
    payload,
    callback = () => {},
    options = {
      notification: true,
    }
  ) => {
    dispatch(
      putCompanyRestoreFile(payload, (err, res) => {
        if (res) {
          if (options.notification) toaster.success(`Item ${payload.search} is restored.`);
        }
        callback(err, res);
      })
    );
  };

  const restoreWorkspaceFolder = (payload, callback = () => {}) => {
    dispatch(
      putWorkspaceRestoreFolder(
        {
          ...payload,
          topic_id: params.workspaceId,
          folder_id: payload.id,
        },
        callback
      )
    );
  };

  const restoreCompanyFolder = (payload, callback = () => {}) => {
    dispatch(
      putCompanyRestoreFolder(
        {
          ...payload,
          folder_id: payload.id,
        },
        callback
      )
    );
  };

  const setGifSrc = (payload, callback = () => {}) => {
    dispatch(incomingGifData(payload, callback));
  };

  const setFileSrc = (payload, callback = () => {}) => {
    dispatch(incomingFileData(payload, callback));
  };

  const setFileThumbnailSrc = (payload, callback = () => {}) => {
    dispatch(incomingFileThumbnailData(payload, callback));
  };

  const fetchTeamChatFiles = (payload, callback) => {
    dispatch(getTeamChatFiles(payload, callback));
  };

  const fetchClientChatFiles = (payload, callback) => {
    dispatch(getClientChatFiles(payload, callback));
  };

  const fetchClientPostFiles = (payload, callback) => {
    dispatch(getClientPostFiles(payload, callback));
  };

  const fetchPrivatePostFiles = (payload, callback) => {
    dispatch(getPrivatePostFiles(payload, callback));
  };

  const deleteWorkspaceFilesUpload = (payload) => {
    dispatch(removeWorkspaceFilesUploadingBar(payload));
  };
  const postCompanyUploadBulkFilesDispatch = (payload, callback = () => {}) => {
    dispatch(postCompanyUploadBulkFiles(payload, callback));
  };

  return {
    addGoogleDriveFile,
    clearSearch,
    copyLink,
    createFolder,
    download,
    favorite,
    getFavoriteFiles,
    getFileIcon,
    getFiles,
    getFilesDetail,
    getFolders,
    getFoldersBreadcrumb,
    getPopularFiles,
    getEditedFiles,
    getTrashFiles,
    moveFile,
    removeFile,
    removeFolder,
    removeTrashFiles,
    renameFile,
    search,
    updateFolder,
    uploadFiles,
    viewFiles,
    viewCompanyFiles,
    getFileSizeUnit,
    getPrimaryFiles,
    getGoogleDriveFiles,
    getGoogleDriveFolders,
    unlinkGoogleAttachment,
    unlinkGoogleFolder,
    uploadWorkspaceGoogleDriveFile,
    uploadCompanyGoogleDriveFile,
    uploadingFiles,
    fetchCompanyFiles,
    fetchCompanyFavoriteFiles,
    fetchCompanyFilesDetail,
    fetchCompanyFolderBreadCrumbs,
    fetchCompanyFolders,
    fetchCompanyPopularFiles,
    fetchCompanyRecentEditedFiles,
    fetchCompanyTrashedFiles,
    createCompanyFolders,
    renameCompanyFile,
    moveCompanyFile,
    uploadingCompanyFiles,
    uploadCompanyFiles,
    uploadCompanyBulkFiles,
    viewCompanyFile,
    updateCompanyFiles,
    updateCompanyFolders,
    removeCompanyFile,
    removeAllCompanyTrashFiles,
    removeCompanyFolder,
    deleteCompanyFolder,
    searchCompany,
    restoreWorkspaceFile,
    restoreCompanyFile,
    restoreWorkspaceFolder,
    restoreCompanyFolder,
    getCompanyGoogleDriveFolders,
    getCompanyGoogleDriveFiles,
    setGifSrc,
    setFileSrc,
    setFileThumbnailSrc,
    fetchTeamChatFiles,
    fetchClientChatFiles,
    fetchClientPostFiles,
    fetchPrivatePostFiles,
    deleteCompanyFilesUpload,
    deleteWorkspaceFilesUpload,
    postCompanyUploadBulkFilesDispatch,
  };
};

export default useFileActions;
