import React, {useCallback, useRef} from "react";
import {useDispatch} from "react-redux";
import {
    addFileSearchResults,
    addFolder,
    clearFileSearchResults,
    deleteFile,
    deleteFolder,
    favoriteFile,
    getWorkspaceFavoriteFiles,
    getWorkspaceFiles, 
    getWorkspaceFilesDetail,
    getWorkspaceFolders,
    getWorkspacePopularFiles,
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
import { actions } from "react-redux-toastr";

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
        } else if (mimeType.includes("excel") || mimeType.includes("spreadsheet") || mimeType.includes("csv") || mimeType.includes("numbers")) {
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
            headerText: "Delete folder",
            submitText: "Delete",
            cancelText: "Cancel",
            bodyText: "Are you sure you want to delete this folder?",
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
    }, [dispatch]);

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

    const favorite = useCallback((file, callback) => {
        dispatch(
            favoriteFile({
                type_id: file.id,
                type: "file"
            })
        );
    }, [dispatch]);

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
    }, [dispatch]);

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
    }, [dispatch]);

    const clearSearch = useCallback(() => {
        let payload = {
            topic_id: params.workspaceId,
        };
        
        dispatch(
            clearFileSearchResults(payload),
        );
    }, [dispatch]);
    
    return {
        clearSearch,
        createFolder,
        favorite,
        getFavoriteFiles,
        getFileIcon,
        getFiles,
        getFilesDetail,
        getFolders,
        getPopularFiles,
        getEditedFiles,
        getTrashFiles,
        removeFile,
        removeFolder,
        renameFile,
        search,
        updateFolder,
        uploadFiles,
        viewFiles,
    };
};

export default useFileActions;