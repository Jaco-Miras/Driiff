import React from "react";
import styled from "styled-components";
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
    }
`;

const FolderListItem = (props) => {

    const {className = "", folder, actions, isMember} = props;

    return (
        <Wrapper className={`file-list-item ${className}`}>
            <div className="card  app-file-list">
                <div className="app-file-icon">
                    <i className="fa fa-folder-o text-instagram cursor-pointer"/>
                    <FolderOptions folder={folder} actions={actions} isMember={isMember}/>
                </div>
                <div className="p-2 small">
                    <div>{folder.search}</div>
                </div>
            </div>
        </Wrapper>
    );
};

export default React.memo(FolderListItem);