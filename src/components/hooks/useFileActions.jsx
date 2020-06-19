import React, {useCallback, useRef} from "react";
import {useDispatch} from "react-redux";
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
import {
    addToModals
} from "../../redux/actions/globalActions";
import {copyTextToClipboard} from "../../helpers/commonFunctions";

const useFileActions = (params = null) => {

    const dispatch = useDispatch();
    const fileName = useRef("");
    const getFileIcon = (mimeType = "") => {

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
    };

    const getFiles = useCallback((payload, callback) => {
        dispatch(
            getWorkspaceFiles(payload, callback)
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
            putFolder(payload, callback)
        );
    }, [dispatch]);

    const uploadFiles = useCallback((payload, callback) => {
        dispatch(
            uploadWorkspaceFiles(payload)
        );
    }, [dispatch]);

    const removeFolder = useCallback((folder, topic_id, callback) => {
        const handleDeleteFolder = () => {
            dispatch(
                deleteFolder({
                    id: folder.id,
                    topic_id: topic_id
                }, callback)
            );
        };
        let payload = {
            type: "confirmation",
            headerText: "Remove folder for everyone?",
            submitText: "Remove",
            cancelText: "Cancel",
            bodyText: "This folder will be moved to the recycle bin and will be permanently deleted after thirty days.",
            actions: {
                onSubmit: handleDeleteFolder,
            },
        };

        dispatch(
            addToModals(payload),
        );
    }, [dispatch]);

    const removeFile = useCallback((file, callback) => {
        const handleDeleteFile = () => {
            dispatch(
                deleteFile({
                    file_id: file.id,
                    link_id: file.link_id,
                    link_type: file.link_type,
                    topic_id: params.workspaceId
                }, callback)
            );
        }
        let payload = {
            type: "confirmation",
            headerText: "Delete file",
            submitText: "Delete",
            cancelText: "Cancel",
            bodyText: "Are you sure you want to delete this file?",
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
                    topic_id: params.workspaceId
                })
            )
        };

        const handleFileNameClose = () => {
            fileName.current = "";
        };

        const handleFileNameChange = (e) => {
            fileName.current = e.target.value.trim();
        };
        let filename = file.search.split(".").slice(0, -1).join(".");
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

    const favorite = useCallback((file) => {
        const cb = (err,res) => {
            if (err) return;
            let payload = {
                file_id: file.id,
                topic_id:params.workspaceId,
                is_favorite: !file.is_favorite
            }
            if (params.hasOwnProperty("fileFolderId")) {
                payload = {
                    ...payload,
                    folder_id: params.fileFolderId
                }
            }
            dispatch(
                addRemoveFavorite(payload)
            );
        }
        dispatch(
            favoriteFile({
                type_id: file.id,
                type: "file"
            }, cb)
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
            setViewFiles(payload),
        );
    }, [dispatch, params]);

    const search = useCallback((searchValue) => {
        let payload = {
            topic_id: params.workspaceId,
            search: searchValue
        };
        const cb = (err,res) => {
            if (err) return;
            dispatch(
                addFileSearchResults({
                    ...payload,
                    search_results: res.data.files
                })
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
                    topic_id: params.workspaceId
                })
            );
        };
        let payload = {
            type: "confirmation",
            headerText: "Delete trash",
            submitText: "Delete",
            cancelText: "Cancel",
            bodyText: "Are you sure you want to delete all trash files?",
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
                folder_id: params.fileFolderId
            }
        }

        dispatch(
            addToModals(payload),
        );
    }, [dispatch, params]);

    const download = useCallback((file) => {
        const handleDownloadFile = () => {
            window.open(file.download_link)
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
    };
};

export default useFileActions;