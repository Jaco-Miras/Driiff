import React from "react";
import styled from "styled-components";
import useFileActions from "../../../hooks/useFileActions";
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

    const {className = "", file, scrollRef} = props;

    const fileHandler = useFileActions();

    return (
        <Wrapper className={`file-list-item ${className}`}>
            <div className="card app-file-list">
                <div className="app-file-icon">
                    {fileHandler.getFileIcon(file.mime_type)}
                    <FileOptions scrollRef={scrollRef}/>
                </div>
                <div className="p-2 small">
                    <div>{file.search}</div>
                    <div className="text-muted">{file.size}</div>
                </div>
            </div>
        </Wrapper>
    );
};

export default React.memo(FileListItem);