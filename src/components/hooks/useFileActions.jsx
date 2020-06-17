import React, {useCallback} from "react";
import {useDispatch} from "react-redux";
import {
    addFolder,
    getWorkspaceFiles,
    getWorkspaceFilesDetail,
    getWorkspaceFolders,
    getWorkspacePopularFiles,
    getWorkspaceRecentlyEditedFiles,
} from "../../redux/actions/fileActions";

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

    const getFiles = useCallback((id, callback) => {
        dispatch(
            getWorkspaceFiles({topic_id: id}, callback),
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

    return {
        createFolder,
        getFileIcon,
        getFiles,
        getFilesDetail,
        getFolders,
        getPopularFiles,
        getEditedFiles,
    };
};

export default useFileActions;