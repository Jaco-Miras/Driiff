import React, {useCallback} from "react";
import {useDispatch} from "react-redux";
import {
    addFolder,
    deleteFolder,
    getWorkspaceFiles, 
    getWorkspaceFilesDetail,
    getWorkspaceFolders,
    getWorkspacePopularFiles,
    getWorkspaceRecentlyEditedFiles, 
    putFolder,
    uploadWorkspaceFiles
} from "../../redux/actions/fileActions";
import {
    addToModals
} from "../../redux/actions/globalActions";

const useFileActions = () => {

    const dispatch = useDispatch();
    const getFileIcon = (mimeType = "") => {

        console.log(mimeType);
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

    return {
        createFolder,
        getFileIcon,
        getFiles,
        getFilesDetail,
        getFolders,
        getPopularFiles,
        getEditedFiles,
        removeFolder,
        updateFolder,
        uploadFiles
    };
};

export default useFileActions;