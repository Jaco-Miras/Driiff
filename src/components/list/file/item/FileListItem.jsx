import React, {useCallback} from "react";
import styled from "styled-components";
import {SvgIconFeather, ToolTip} from "../../../common";
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
        
        .file-name {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
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

    const {className = "", file, actions, isMember, forceDelete = false} = props;

    const fileSizeUnit = actions.getFileSizeUnit(file.hasOwnProperty("size") && typeof file.size === "number" ? file.size : 0);

    const handleFileView = useCallback(() => {
        actions.viewFiles(file);
    }, [file]);

    return (
        <Wrapper className={`file-list-item cursor-pointer ${className}`} onClick={handleFileView}>
            <div className="card  app-file-list">
                <div className="app-file-icon">
                    {
                        file.is_favorite === true &&
                        <Star icon="star"/>
                    }
                    {actions.getFileIcon(file.mime_type)}
                    <FileOptions file={file} actions={actions} isMember={isMember} forceDelete={forceDelete}/>
                </div>
                <div className="p-2 small">
                    <ToolTip content={file.name ? file.name : file.search}>
                        <div className="file-name">{file.name ? file.name : file.search}</div>
                    </ToolTip>
                    <div
                        className="text-muted">{(fileSizeUnit.size).toString().match(/^-?\d+(?:\.\d{0,2})?/)[0]}{fileSizeUnit.unit}</div>
                </div>
            </div>
        </Wrapper>
    );
};

export default React.memo(FileListItem);