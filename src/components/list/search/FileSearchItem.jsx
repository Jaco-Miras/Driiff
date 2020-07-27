import React from "react";

const FileSearchItem = (props) => {

    const { file } = props;

    return (
        <li className="list-group-item p-l-0 p-r-0">
            <label>{file.data.name}</label>
        </li>
    );
};

export default FileSearchItem;