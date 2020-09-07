import React from "react";
import styled from "styled-components";
import {stripHtml} from "../../../helpers/stringFormatter";

const Wrapper = styled.li`
    > div {
        margin-bottom: 5px;
    }
`;

const DescriptionWrapper = styled.div`
    display: flex;
`;

const Description = styled.div`
    width: 100%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden; 
`;

const WorkspaceSearchResult = (props) => {

    const { item, redirect, workspaces } = props;
    const { topic, workspace } = item;
    const handleRedirect = () => {
        let payload = {
            id: topic.id,
            name: topic.name,
            folder_id: workspace ? workspace.id : null,
            folder_name: workspace ? workspace.name : null
        }
        if (workspaces.hasOwnProperty(topic.id)) {
            redirect.toWorkspace(payload)
        } else {
            redirect.fetchWorkspaceAndRedirect(payload);
        }
    };
    return (
        <Wrapper className="list-group-item p-l-0 p-r-0" onClick={handleRedirect}>
            <div>
                <h5>{topic.name}</h5>
            </div>
            <div>
                Status: 
                { topic.is_locked && <span className={`badge badge-light text-white ml-1`}>Locked</span> }
                { topic.is_archive && <span className={`badge badge-light text-white ml-1`}>Archived</span> }
                { !topic.is_archive && !topic.is_locked && <span className={`badge badge-light text-white ml-1`}>Open</span> }
            </div>
            <div>Members: {item.members.length}</div>
            <div>
                Folder: {workspace ? workspace.name : "Workspaces"}
            </div>
            <DescriptionWrapper>
                <Description>Description: {stripHtml(topic.description)}</Description>
            </DescriptionWrapper>
        </Wrapper>
    );
};

export default WorkspaceSearchResult;