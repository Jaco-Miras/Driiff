import React from "react";
import styled from "styled-components";
import {SvgIconFeather} from "../../../common";
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

const Star = styled(SvgIconFeather)`
    position: absolute;
    top: 10px;
    left: 5px;
    width: 16px;
    fill: #ffc107;
    color: #ffc107;
`;

const FileListItem = (props) => {

    const {className = "", file, actions, isMember} = props;

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
            <div className="card  app-file-list">
                <div className="app-file-icon">
                    {
                        file.is_favorite === true &&
                        <Star icon="star"/>
                    }
                    {actions.getFileIcon(file.mime_type)}
                    <FileOptions file={file} actions={actions} isMember={isMember}/>
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