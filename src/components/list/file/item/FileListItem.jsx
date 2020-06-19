import React from "react";
import styled from "styled-components";
import {FileOptions} from "../../../panels/files";

const Wrapper = styled.div`
    .card {
        overflow: unset;
        
        .file-options {
            position: absolute;
            top: 10px;
            right: 5px;
            width: 16px;
        }
    }
`;

const FileListItem = (props) => {

    const {className = "", file, scrollRef, actions} = props;

    let fileSize = 0;
    let fileSizeUnit = "";

    if (file.size < 1e+6) {
        fileSize = file.size / 1000;
        fileSizeUnit = "KB";
    } else if (file.size < 1e+9) {
        fileSize = file.size / 1e+6;
        fileSizeUnit = "MB";
    } else if (file.size < 1e+12) {
        fileSize = file.size / 1e+9`$ GB`;
        fileSizeUnit = "GB";
    }

    return (
        <Wrapper className={`file-list-item ${className}`}>
            <div className="card app-file-list">
                <div className="app-file-icon">
                    {actions.getFileIcon(file.mime_type)}
                    <FileOptions scrollRef={scrollRef} file={file} actions={actions}/>
                </div>
                <div className="p-2 small">
                    <div>{file.search}</div>
                    <div
                        className="text-muted">{(fileSize).toString().match(/^-?\d+(?:\.\d{0,2})?/)[0]}{fileSizeUnit}</div>
                </div>
            </div>
        </Wrapper>
    );
};

export default React.memo(FileListItem);