import React from "react";
import styled from "styled-components";
import {stripHtml} from "../../../helpers/stringFormatter";
import {SvgIconFeather} from "../../common";
import {useIsMember} from "../../hooks";

const Wrapper = styled.li`
    position: relative;
    > div {
        margin-bottom: 5px;
    }
    :hover {
        button {
            display: block;
        }
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

const JoinButton = styled.button`
    position: absolute;
    top: 55px;
    right: 10px;
    display: none;
`;

const WorkspaceSearchResult = (props) => {

    const { item, redirect, workspaces } = props;
    const { topic, workspace } = item;
    const isMember = useIsMember(item.members.map((m) => m.id));
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
    const handleJoinWorkspace = (e) => {
        e.stopPropagation();
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
            {
                !isMember &&
                <JoinButton onClick={handleJoinWorkspace} className="btn btn-primary join-button">
                    <SvgIconFeather icon="user-plus" />
                    Join
                </JoinButton>
            }
        </Wrapper>
    );
};

export default WorkspaceSearchResult;