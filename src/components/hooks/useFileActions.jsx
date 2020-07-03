import React, {useCallback, useRef} from "react";
import {useDispatch} from "react-redux";
import {copyTextToClipboard} from "../../helpers/commonFunctions";
import {
    addFileSearchResults,
    addFolder,
    addRemoveFavorite,
    clearFileSearchResults,
    deleteFile,
    deleteFolder,
    deleteTrash,
    favoriteFile,
    getWorkspaceFavoriteFiles,
    getWorkspaceFiles,
    getWorkspaceFilesDetail,
    getWorkspaceFolders,
    getWorkspacePopularFiles,
    getWorkspacePrimaryFiles,
    getWorkspaceRecentlyEditedFiles,
    getWorkspaceTrashFiles,
    putFile,
    putFolder,
    setViewFiles,
    uploadWorkspaceFiles,
} from "../../redux/actions/fileActions";
import {addToModals} from "../../redux/actions/globalActions";
import {useToaster} from "./index";

const useFileActions = (params = null) => {

    const dispatch = useDispatch();

    const toaster = useToaster();

    const fileName = useRef("");


    const getFileIcon = (mimeType = "") => {
        if (mimeType) {
            if (mimeType.includes("image")) {
                return <i className="fa fa-file-image-o text-instagram"/>;
            } else if (mimeType.includes("audio")) {
                return <i className="fa fa-file-audio-o text-dark"/>;
            } else if (mimeType.includes("video")) {
                return <i className="fa fa-file-video-o text-google"/>;
            } else if (mimeType.includes("pdf")) {
                return <i className="fa fa-file-pdf-o text-danger"/>;
            } else if (mimeType.includes("zip") || mimeType.includes("archive") || mimeType.includes("x-rar")) {
                return <i className="fa fa-file-zip-o text-primary"/>;
            } else if (mimeType.includes("excel") || mimeType.includes("spreadsheet") || mimeType.includes("csv") || mimeType.includes("numbers") || mimeType.includes("xml")) {
                return <i className="fa fa-file-excel-o text-success"/>;
            } else if (mimeType.includes("powerpoint") || mimeType.includes("presentation")) {
                return <i className="fa fa-file-powerpoint-o text-secondary"/>;
            } else if (mimeType.includes("word") || mimeType.includes("document")) {
                return <i className="fa fa-file-word-o text-info"/>;
            } else if (mimeType.includes("script")) {
                return <i className="fa fa-file-code-o"/>;
            } else
                return <i className="fa fa-file-text-o text-warning"/>;
        } else {
            return <i className="fa fa-file-text-o text-warning"/>;
        }

    };

    const getFiles = useCallback((payload, callback) => {
        dispatch(
            getWorkspaceFiles(payload, callback),
        );
    }, [dispatch]);

    const getPrimaryFiles = useCallback((id, callback) => {
        dispatch(
            getWorkspacePrimaryFiles({topic_id: id}, callback),
        );
    }, [dispatch]);

    const getFilesDetail = useCallback((id, callback) => {
        dispatch(
            getWorkspaceFilesDetail({topic_id: id}, callback),
        );
    }, [dispatch]);

    const getPopularFiles = useCallback((id, callback) => {
        dispatch(
            getWorkspacePopularFiles({topic_id: id}, callback),
        );
    }, [dispatch]);

    const getEditedFiles = useCallback((id, callback) => {
        dispatch(
            getWorkspaceRecentlyEditedFiles({topic_id: id}, callback),
        );
    }, [dispatch]);

    const getTrashFiles = useCallback((id, callback) => {
        dispatch(
            getWorkspaceTrashFiles({topic_id: id}, callback),
        );
    }, [dispatch]);

    const createFolder = useCallback((payload, callback) => {
        dispatch(
            addFolder(payload, callback),
        );
    }, [dispatch]);

    const getFolders = useCallback((payload, callback) => {
        dispatch(
            getWorkspaceFolders(payload, callback),
        );
    }, [dispatch]);

    const updateFolder = useCallback((payload, callback) => {
        dispatch(
            putFolder(payload, callback),
        );
    }, [dispatch]);

    const uploadFiles = useCallback((payload, callback) => {
        dispatch(
            uploadWorkspaceFiles(payload, callback),
        );
    }, [dispatch]);

    const removeFolder = useCallback((folder, topic_id, callback) => {
        const handleDeleteFolder = () => {
            let payload = {
                id: folder.id,
                topic_id: topic_id,
            }
            if (folder.is_archived) {
                payload = {
                    ...payload,
                    force_delete: 1
                }
            }
            dispatch(
                deleteFolder(payload, callback),
            );
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
            }
        }

        dispatch(
            addToModals(modal),
        );
    }, [dispatch]);

    const removeFile = useCallback((file, force_delete = false) => {
        const handleDeleteFile = () => {
            let payload = {
                file_id: file.id,
                link_id: file.link_id,
                link_type: file.link_type,
                topic_id: params.workspaceId,
            }
            if (force_delete) {
                payload = {
                    ...payload,
                    force_delete: 1
                }
            }
            dispatch(
                deleteFile(payload, (err, res) => {
                    toaster.notify(`You have removed ${file.search}.`);
                }),
            );
        };
        let payload = {
            type: "confirmation",
            headerText: "Remove file",
            submitText: "Remove",
            cancelText: "Cancel",
            bodyText: "Are you sure you want to remove this file?",
            actions: {
                onSubmit: handleDeleteFile,
            },
        };

        dispatch(
            addToModals(payload),
        );
    }, [dispatch, params]);

    const renameFile = useCallback((file, callback) => {
        const handleUpdateFileName = () => {
            dispatch(
                putFile({
                    id: file.id,
                    name: fileName.current,
                    topic_id: params.workspaceId,
                }, (err, res) => {
                    if (err) {
                        toaster.error(
                            <span>System failed to rename the <b>{file.search}</b> to {fileName.current}.</span>);
                    }

                    if (res) {
                        toaster.success(<span>You renamed <b>{file.search}</b> to {fileName.current}.</span>);
                    }

                    callback(err, res);
                }),
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
            labelPrimaryAction: "Update",
            onPrimaryAction: handleUpdateFileName,
            onChange: handleFileNameChange,
            onClose: handleFileNameClose,
        };

        dispatch(
            addToModals(payload),
        );

    }, [dispatch]);

    const favorite = useCallback((file, callback) => {
        const cb = (err, res) => {
            if (err) {
                toaster.error(<div>System failed to mark the
                    file <b>{file.search}</b> {!file.is_favorite ? "as favorite" : "unfavorite"}</div>);

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
                        toaster.success(<>You have
                            marked <b>{file.search}</b> {!file.is_favorite ? "as favorite" : "unfavorite"}</>);
                    }),
                );
            }
        };
        dispatch(
            favoriteFile({
                type_id: file.id,
                type: "file",
            }, cb),
        );
    }, [dispatch, params]);

    const getFavoriteFiles = useCallback((id, callback) => {
        dispatch(
            getWorkspaceFavoriteFiles({topic_id: id}, callback),
        );
    }, [dispatch]);

    const viewFiles = useCallback((file, callback) => {
        let payload = {
            workspace_id: params.workspaceId,
            file_id: file.id,
        };
        dispatch(
            setViewFiles(payload, callback),
        );
    }, [dispatch, params]);

    const search = useCallback((searchValue) => {
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
                }),
            );
        };
        dispatch(
            getWorkspaceFiles(payload, cb),
        );
    }, [dispatch, params]);

    const clearSearch = useCallback(() => {
        let payload = {
            topic_id: params.workspaceId,
        };

        dispatch(
            clearFileSearchResults(payload),
        );
    }, [dispatch, params]);

    const copyLink = useCallback(link => {
        copyTextToClipboard(link);
    }, []);

    const removeTrashFiles = useCallback(() => {
        const handleDeleteTrash = () => {
            dispatch(
                deleteTrash({
                    topic_id: params.workspaceId,
                }),
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

        dispatch(
            addToModals(payload),
        );
    }, [dispatch, params]);

    const moveFile = useCallback((file) => {

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

        dispatch(
            addToModals(payload),
        );
    }, [dispatch, params]);

    const download = useCallback((file) => {
        const handleDownloadFile = () => {
            window.open(file.download_link);
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

        dispatch(
            addToModals(payload),
        );
    }, [dispatch, params]);

    const getFileSizeUnit = (size) => {
        if (size) {
            if (size < 1e+6) {
                return {
                    size: size / 1000,
                    unit: "KB",
                };
            } else if (size < 1e+9) {
                return {
                    size: size / 1e+6,
                    unit: "MB",
                };
            } else if (size < 1e+12) {
                return {
                    size: size / 1e+9,
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

    return {
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
        getFileSizeUnit,
        getPrimaryFiles,
    };
};

export default useFileActions;