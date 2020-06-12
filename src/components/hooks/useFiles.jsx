import React from "react";

const useFiles = () => {

    const getFileIcon = (mimeType = "") => {
        if (mimeType.includes("image")) {
            return <i className="fa fa-file-image-o text-instagram"/>;
        } else if (mimeType.includes("audio")) {
            return <i className="fa fa-file-audio-o text-dark"/>;
        } else if (mimeType.includes("video")) {
            return <i className="fa fa-file-video-o text-google"/>;
        } else if (mimeType.includes("pdf")) {
            return <i className="fa fa-file-pdf-o text-danger"/>;
        } else if (mimeType.includes("zip")) {
            return <i className="fa fa-file-zip-o text-primary"/>;
        } else if (mimeType.includes("excel") || mimeType.includes("spreedsheet")) {
            return <i className="fa fa-file-excel-o text-success"/>;
        } else if (mimeType.includes("powerpoint") || mimeType.includes("presentation")) {
            return <i className="fa fa-file-powerpoint-o text-secondary"/>;
        } else if (mimeType.includes("word")) {
            return <i className="fa fa-file-word-o text-info"/>;
        } else if (mimeType.includes("script")) {
            return <i className="fa fa-file-code-o"/>;
        } else
            return <i className="fa fa-file-text-o text-warning"/>;
    };

    return {
        getFileIcon,
    };
};

export default useFiles;