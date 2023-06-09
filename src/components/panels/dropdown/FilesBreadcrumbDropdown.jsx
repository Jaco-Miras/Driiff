import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useFileActions } from "../../hooks";
import { MoreOptions } from "../../panels/common";
import { useRouteMatch } from "react-router-dom";
import { replaceChar } from "../../../helpers/stringFormatter";

const Wrapper = styled.div`
    display: flex;
    align-items: center;
    max-width: 24px;
    .more-options-tooltip {
        &.orientation-top, &.orientation-bottom, &.orientation-left, &.orientation-right {
            left: 0;
            top: 26px;
        }
    }
`;

const UserProfileDropdown = (props) => {
    const { className = "", history, parentFolder, workspaceID } = props;
    const fileActions = useFileActions();

    const [folders, setFolders] = useState([]);
    const { url } = useRouteMatch();

    useEffect(() => {
        if(parentFolder) {
            fileActions.getFoldersBreadcrumb({ folder_id: parentFolder.id, topic_id: workspaceID  }, (err, res) => {
                if(res) {
                    setFolders(res.data.folders)
                }
            });
        }
    }, [parentFolder]);

    const backToFolder = (folder) => {
        let pathname = url.split("/folder/")[0];
        history.push(pathname + `/folder/${folder.id}/${replaceChar(folder.search)}`);
    };

    return (
        <Wrapper className={` ${className}`}>
            <MoreOptions width={140}>
                {folders.map((folder) => {
                    return <div onClick={() => backToFolder(folder)} className={`dropdown-item d-flex justify-content-between`}>{ folder.search }</div>;
                })}
            </MoreOptions>
        </Wrapper>
    );
};

export default React.memo(UserProfileDropdown);
