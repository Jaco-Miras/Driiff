import React from "react";

const FileSearchItem = (props) => {

    const { file, redirect } = props;
    const handleRedirect = () => {
        redirect.toFiles(file);
    };
    return (
        <li className="list-group-item p-l-0 p-r-0">
            <label onClick={handleRedirect}>{file.name}</label>
        </li>
    );
};

export default FileSearchItem;