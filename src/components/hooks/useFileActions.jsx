import React, { useCallback, useRef } from "react";
import { useDispatch } from "react-redux";
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
} from "../../redux/actions/fileActions";
import { addToModals } from "../../redux/actions/globalActions";
import { useToaster } from "./index";
import { useTranslation } from "../hooks";

const useFileActions = (params = null) => {
  const dispatch = useDispatch();

  const toaster = useToaster();

  const fileName = useRef("");

  const { _t } = useTranslation();

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
      } else if (mimeType.includes("excel") || mimeType.includes("spreadsheet") || mimeType.includes("csv") || mimeType.includes("numbers") || mimeType.includes("xml")) {
        return <i className="fa fa-file-excel-o text-success" />;
      } else if (mimeType.includes("powerpoint") || mimeType.includes("presentation")) {
        return <i className="fa fa-file-powerpoint-o text-secondary" />;
      } else if (mimeType.includes("word") || mimeType.includes("document")) {
        return <i className="fa fa-file-word-o text-info" />;
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
  };

  const fetchCompanyFiles = useCallback(
    (payload, callback) => {
      dispatch(getCompanyFiles(payload, callback));
    },
    [dispatch]
  );

  const fetchCompanyFavoriteFiles = useCallback(
    (payload, callback) => {
      dispatch(getCompanyFavoriteFiles(payload, callback));
    },
    [dispatch]
  );

  const fetchCompanyFilesDetail = useCallback(
    (payload, callback) => {
      dispatch(getCompanyFilesDetail(payload, callback));
    },
    [dispatch]
  );

  const fetchCompanyFolderBreadCrumbs = useCallback(
    (payload, callback) => {
      dispatch(getCompanyFolderBreadCrumbs(payload, callback));
    },
    [dispatch]
  );

  const fetchCompanyFolders = useCallback(
    (payload, callback) => {
      dispatch(getCompanyFolders(payload, callback));
    },
    [dispatch]
  );

  const fetchCompanyPopularFiles = useCallback(
    (payload, callback) => {
      dispatch(getCompanyPopularFiles(payload, callback));
    },
    [dispatch]
  );

  const fetchCompanyRecentEditedFiles = useCallback(
    (payload, callback) => {
      dispatch(getCompanyRecentEditedFiles(payload, callback));
    },
    [dispatch]
  );

  const fetchCompanyTrashedFiles = useCallback(
    (payload, callback) => {
      dispatch(getCompanyTrashedFiles(payload, callback));
    },
    [dispatch]
  );

  const createCompanyFolders = useCallback(
    (payload, callback) => {
      dispatch(postCompanyFolders(payload, callback));
    },
    [dispatch]
  );

  const uploadCompanyFiles = useCallback(
    (payload, callback) => {
      dispatch(postCompanyUploadFiles(payload, callback));
    },
    [dispatch]
  );

  const uploadCompanyBulkFiles = useCallback(
    (payload, callback) => {
      dispatch(postCompanyUploadBulkFiles(payload, callback));
    },
    [dispatch]
  );

  const viewCompanyFile = useCallback(
    (payload, callback) => {
      dispatch(patchCompanyFileViewed(payload, callback));
    },
    [dispatch]
  );

  const updateCompanyFiles = useCallback(
    (payload, callback) => {
      dispatch(putCompanyFiles(payload, callback));
    },
    [dispatch]
  );

  const updateCompanyFolders = useCallback(
    (payload, callback) => {
      dispatch(putCompanyFolders(payload, callback));
    },
    [dispatch]
  );

  const deleteCompanyFolder = useCallback(
    (payload, callback) => {
      dispatch(deleteCompanyFolders(payload, callback));
    },
    [dispatch]
  );

  const getFiles = useCallback(
    (payload, callback) => {
      dispatch(getWorkspaceFiles(payload, callback));
    },
    [dispatch]
  );

  const getPrimaryFiles = useCallback(
    (id, callback) => {
      dispatch(getWorkspacePrimaryFiles({ topic_id: id }, callback));
    },
    [dispatch]
  );

  const getGoogleDriveFiles = useCallback(
    (id, callback) => {
      dispatch(
        getWorkspaceGoogleFileAttachments(
          {
            workspace_id: id,
          },
          callback
        )
      );
    },
    [dispatch]
  );

  const getGoogleDriveFolders = useCallback(
    (id, callback) => {
      dispatch(
        getWorkspaceGoogleFolderAttachments(
          {
            workspace_id: id,
          },
          callback
        )
      );
    },
    [dispatch]
  );

  const getCompanyGoogleDriveFolders = useCallback(
    (id, callback) => {
      dispatch(getCompanyGoogleAttachmentsFolder({}, callback));
    },
    [dispatch]
  );

  const getCompanyGoogleDriveFiles = useCallback(
    (id, callback) => {
      dispatch(
        getCompanyGoogleAttachmentsFile(
          {
            workspace_id: id,
          },
          callback
        )
      );
    },
    [dispatch]
  );

  const getFilesDetail = useCallback(
    (id, callback) => {
      dispatch(getWorkspaceFilesDetail({ topic_id: id }, callback));
    },
    [dispatch]
  );

  const getPopularFiles = useCallback(
    (id, callback) => {
      dispatch(getWorkspacePopularFiles({ topic_id: id }, callback));
    },
    [dispatch]
  );

  const getEditedFiles = useCallback(
    (id, callback) => {
      dispatch(getWorkspaceRecentlyEditedFiles({ topic_id: id }, callback));
    },
    [dispatch]
  );

  const getTrashFiles = useCallback(
    (id, callback) => {
      dispatch(getWorkspaceTrashFiles({ topic_id: id }, callback));
    },
    [dispatch]
  );

  const createFolder = useCallback(
    (payload, callback) => {
      dispatch(addFolder(payload, callback));
    },
    [dispatch]
  );

  const getFolders = useCallback(
    (payload, callback) => {
      dispatch(getWorkspaceFolders(payload, callback));
    },
    [dispatch]
  );

  const getFoldersBreadcrumb = useCallback(
    (payload, callback) => {
      dispatch(getWorkspaceFoldersBreadcrumb(payload, callback));
    },
    [dispatch]
  );

  const updateFolder = useCallback(
    (payload, callback) => {
      dispatch(putFolder(payload, callback));
    },
    [dispatch]
  );

  const uploadFiles = useCallback(
    (payload, callback) => {
      dispatch(uploadWorkspaceFiles(payload, callback));
    },
    [dispatch]
  );

  const uploadWorkspaceGoogleDriveFile = useCallback(
    (workspaceId, payload, callback) => {
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
    },
    [dispatch]
  );

  const uploadCompanyGoogleDriveFile = useCallback(
    (payload, callback) => {
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
    },
    [dispatch]
  );

  const removeFolder = useCallback(
    (folder, topic_id, callback) => {
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
    },
    [dispatch]
  );

  const removeCompanyFolder = useCallback(
    (folder, callback) => {
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
    },
    [dispatch]
  );

  const removeFile = useCallback(
    (file, force_delete = false) => {
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
        dispatch(
          deleteFile(payload, (err, res) => {
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
    },
    [dispatch, params]
  );

  const removeCompanyFile = useCallback(
    (
      file,
      callback = () => {},
      options = {
        force_delete: false,
      }
    ) => {
      const handleDeleteFile = () => {
        let payload = {
          file_id: file.id,
          link_id: file.link_id,
          link_type: file.link_type,
        };
        if (options.force_delete) {
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
    },
    [dispatch, params]
  );

  const renameFile = useCallback(
    (file, callback) => {
      const handleUpdateFileName = () => {
        dispatch(
          putFile(
            {
              id: file.id,
              name: fileName.current,
              topic_id: params.workspaceId,
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
          )
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
    },
    [dispatch]
  );

  const renameCompanyFile = useCallback(
    (file, callback) => {
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
    },
    [dispatch]
  );

  const favorite = useCallback(
    (file, callback) => {
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
      dispatch(
        favoriteFile(
          {
            type_id: file.id,
            type: "file",
          },
          cb
        )
      );
    },
    [dispatch, params]
  );

  const getFavoriteFiles = useCallback(
    (id, callback) => {
      dispatch(getWorkspaceFavoriteFiles({ topic_id: id }, callback));
    },
    [dispatch]
  );

  const viewFiles = useCallback(
    (file, callback) => {
      if (file.hasOwnProperty("payload_id")) {
        let a = document.createElement("a");
        a.href = file.download_link.replace("/preview", "/view");
        a.target = "_blank";
        a.click();
      } else {
        let payload = {
          workspace_id: params.workspaceId,
          file_id: file.id,
        };
        dispatch(setViewFiles(payload, callback));
      }
    },
    [dispatch, params]
  );

  const viewCompanyFiles = useCallback(
    (file, callback) => {
      if (file.hasOwnProperty("payload_id")) {
        let a = document.createElement("a");
        a.href = file.download_link.replace("/preview", "/view");
        a.target = "_blank";
        a.click();
      } else {
        let payload = {
          file_id: file.id,
        };
        dispatch(setViewFiles(payload, callback));
      }
    },
    [dispatch, params]
  );

  const search = useCallback(
    (searchValue) => {
      let payload = {
        topic_id: params.workspaceId,
        search: searchValue,
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
    },
    [dispatch, params]
  );

  const searchCompany = useCallback(
    (searchValue) => {
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
    },
    [dispatch, params]
  );

  const clearSearch = useCallback(() => {
    let payload = {
      topic_id: params.workspaceId,
    };

    dispatch(clearFileSearchResults(payload));
  }, [dispatch, params]);

  const copyLink = useCallback((link) => {
    copyTextToClipboard(toaster, link);
  }, []);

  const removeTrashFiles = useCallback(() => {
    const handleDeleteTrash = () => {
      dispatch(
        deleteTrash({
          topic_id: params.workspaceId,
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
  }, [dispatch, params]);

  const removeAllCompanyTrashFiles = useCallback(() => {
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
  }, [dispatch, params]);

  const moveFile = useCallback(
    (file) => {
      let payload = {
        type: "move_files",
        file: file,
        topic_id: params.workspaceId,
        folder_id: null,
      };

      if (params.hasOwnProperty("fileFolderId")) {
        payload = {
          ...payload,
          folder_id: params.fileFolderId,
        };
      }

      dispatch(addToModals(payload));
    },
    [dispatch, params]
  );

  const moveCompanyFile = useCallback(
    (file) => {
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
    },
    [dispatch, params]
  );

  const download = useCallback(
    (file) => {
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
    },
    [dispatch, params]
  );

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

  const uploadingFiles = useCallback(
    (payload) => {
      dispatch(uploadFilesReducer(payload));
    },
    [dispatch]
  );

  const uploadingCompanyFiles = useCallback(
    (payload) => {
      dispatch(uploadCompanyFilesReducer(payload));
    },
    [dispatch]
  );

  const unlinkGoogleAttachment = useCallback(
    (file) => {
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
        dispatch(
          deleteGoogleAttachment(payload, (err, res) => {
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
    },
    [dispatch]
  );

  const unlinkGoogleFolder = useCallback(
    (folder) => {
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
    },
    [dispatch]
  );

  const addGoogleDriveFile = useCallback(
    (payload) => {
      dispatch(registerGoogleDriveFile(payload));
    },
    [dispatch]
  );

  const restoreWorkspaceFile = useCallback(
    (payload, callback = () => {}) => {
      dispatch(
        putWorkspaceRestoreFile(
          {
            ...payload,
            topic_id: params.workspaceId,
          },
          callback
        )
      );
    },
    [dispatch]
  );

  const restoreCompanyFile = useCallback(
    (
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
    },
    [dispatch]
  );

  const restoreWorkspaceFolder = useCallback(
    (payload, callback = () => {}) => {
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
    },
    [dispatch]
  );

  const restoreCompanyFolder = useCallback(
    (payload, callback = () => {}) => {
      dispatch(
        putCompanyRestoreFolder(
          {
            ...payload,
            folder_id: payload.id,
          },
          callback
        )
      );
    },
    [dispatch]
  );

  const setGifSrc = useCallback((payload, callback = () => {}) => {
    dispatch(incomingGifData(payload, callback));
  }, []);

  const setFileSrc = useCallback((payload, callback = () => {}) => {
    dispatch(incomingFileData(payload, callback));
  }, []);

  const setFileThumbnailSrc = useCallback((payload, callback = () => {}) => {
    dispatch(incomingFileThumbnailData(payload, callback));
  }, []);

  const fetchTeamChatFiles = useCallback(
    (payload, callback) => {
      dispatch(getTeamChatFiles(payload, callback));
    },
    [dispatch]
  );

  const fetchClientChatFiles = useCallback(
    (payload, callback) => {
      dispatch(getClientChatFiles(payload, callback));
    },
    [dispatch]
  );

  const fetchClientPostFiles = useCallback(
    (payload, callback) => {
      dispatch(getClientPostFiles(payload, callback));
    },
    [dispatch]
  );

  const fetchPrivatePostFiles = useCallback(
    (payload, callback) => {
      dispatch(getPrivatePostFiles(payload, callback));
    },
    [dispatch]
  );

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
  };
};

export default useFileActions;
