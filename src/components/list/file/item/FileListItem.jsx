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

    const fileSizeUnit = actions.getFileSizeUnit(file.hasOwnProperty("size") ? file.size : 0);

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
                        className="text-muted">{(fileSizeUnit.size).toString().match(/^-?\d+(?:\.\d{0,2})?/)[0]}{fileSizeUnit.unit}</div>
                </div>
            </div>
        </Wrapper>
    );
};

export default React.memo(FileListItem);