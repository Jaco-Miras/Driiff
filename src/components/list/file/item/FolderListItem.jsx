import React from "react";
import {useRouteMatch} from "react-router-dom";
import styled from "styled-components";
import {replaceChar} from "../../../../helpers/stringFormatter";
import {ToolTip} from "../../../common";
import {FolderOptions} from "../../../panels/files";

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

const FolderListItem = (props) => {

    const {className = "", folder, actions, isMember, history} = props;

    const {path, url} = useRouteMatch();

    const handleRedirect = e => {
        e.preventDefault();

        if (path === "/workspace/files/:workspaceId/:workspaceName/folder/:fileFolderId/:fileFolderName" ||
            path === "/workspace/files/:folderId/:folderName/:workspaceId/:workspaceName/folder/:fileFolderId/:fileFolderName") {
            let pathname = url.split("/folder/")[0];
            history.push(pathname + `/folder/${folder.id}/${replaceChar(folder.search)}`);
        } else {
            history.push(history.location.pathname + `/folder/${folder.id}/${replaceChar(folder.search)}`);
        }
    };

    return (
        <Wrapper className={`file-list-item cursor-pointer ${className}`} onClick={handleRedirect}>
            <div className="card  app-file-list">
                <div className="app-file-icon">
                    <i className="fa fa-folder-o text-instagram"/>
                    <FolderOptions folder={folder} actions={actions} isMember={isMember}/>
                </div>
                <div className="p-2 small">
                    <ToolTip content={folder.search}>
                        <div className="file-name">{folder.search}</div>
                    </ToolTip>
                </div>
            </div>
        </Wrapper>
    );
};

export default React.memo(FolderListItem);