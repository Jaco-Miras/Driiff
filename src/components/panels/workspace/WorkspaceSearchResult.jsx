import React from "react";
import styled from "styled-components";
import {stripHtml} from "../../../helpers/stringFormatter";
import {SvgIconFeather} from "../../common";
import {useIsMember} from "../../hooks";

const Wrapper = styled.li`
    position: relative;
    display: flex;
    align-items: center;
    :hover {
        button {
            display: inline-flex;
        }
    }
`;

const JoinButton = styled.button`
   margin-left: auto;
   display: none;
`;

const CheckIcon = styled(SvgIconFeather)`
    width: 1rem;
    height: 1rem;
    stroke-width: 2px;
`;

const WorkspaceSearchResult = (props) => {

    const { onJoinWorkspace, onLeaveWorkspace, item, redirect, workspaces } = props;
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
        onJoinWorkspace(item);
    };

    const handleLeaveWorkspace = (e) => {
        e.stopPropagation();
        onLeaveWorkspace(item);
    };

    return (
        <Wrapper className="list-group-item p-l-0 p-r-0" onClick={handleRedirect}>
            <div className="workspace-search-detail">
                <div className="workspace-title-status">
                    <h5>{topic.name}</h5>
                    { topic.is_locked && <span className={`badge badge-ultralight ml-1`}>Private</span> }
                    { topic.is_archive && <span className={`badge badge-ultralight ml-1`}>Archived</span> }
                    { !topic.is_archive && !topic.is_locked && <span className={`badge badge-ultralight ml-1`}>Open</span> }
                </div>
                <ul className="workspace-detail-lists">
                    { isMember && <li className="text-success"><CheckIcon icon="check"/>Joined</li> }
                    <li>{item.members.length} {item.members.length === 1 ? "member" : "members"}</li>
                    <li>{workspace ? workspace.name : "Workspaces"}</li>
                    <li>{stripHtml(topic.description)}</li>
                </ul>
            </div>
            {
                !isMember ?
                <JoinButton onClick={handleJoinWorkspace} className="btn btn-primary join-button">
                    <SvgIconFeather icon="user-plus" />
                    Join
                </JoinButton>
                :
                <JoinButton onClick={handleLeaveWorkspace} className="btn btn-primary join-button">
                    Leave
                </JoinButton>
            }
        </Wrapper>
    );
};

export default WorkspaceSearchResult;