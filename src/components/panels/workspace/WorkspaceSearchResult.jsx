import React from "react";
import styled from "styled-components";
import { stripHtml } from "../../../helpers/stringFormatter";
import { SvgIconFeather } from "../../common";
import { useIsMember } from "../../hooks";

const Wrapper = styled.li`
  position: relative;
  display: flex;
  align-items: center;
  list-style: none;
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

const FolderIcon = styled(SvgIconFeather)`
  width: 0.8rem;
  height: 0.8rem;
  stroke-width: 3px;
  margin-right: 3px;
  margin-bottom: 0.1rem;
`;

const EyeIcon = styled(SvgIconFeather)`
  width: 12px;
  height: 12px;
  margin-right: 5px;
`;

const WorkspaceSearchResult = (props) => {
  const { dictionary, onJoinWorkspace, onLeaveWorkspace, item, redirect, workspaces } = props;
  const { topic, workspace } = item;
  const workspaceMembers = item.members
    .map((m) => {
      if (m.member_ids) {
        return m.member_ids;
      } else return m.id;
    })
    .flat();
  const isMember = useIsMember([...new Set(workspaceMembers)]);
  const handleRedirect = () => {
    let payload = {
      id: topic.id,
      name: topic.name,
      folder_id: workspace ? workspace.id : null,
      folder_name: workspace ? workspace.name : null,
    };
    if (workspaces.hasOwnProperty(topic.id)) {
      redirect.toWorkspace(payload);
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
          {topic.is_locked && <span className={"badge badge-ultralight ml-1"}>{dictionary.labelPrivate}</span>}
          {topic.is_archive && <span className={"badge badge-ultralight ml-1"}>{dictionary.labelArchived}</span>}
          {!topic.is_archive && !topic.is_locked && <span className={"badge badge-ultralight ml-1"}>{dictionary.labelOpen}</span>}
          {topic.is_shared && (
            <span className={"badge badge-warning ml-1 d-flex align-items-center"} style={{ backgroundColor: "#FFDB92" }}>
              <EyeIcon icon="eye" /> {dictionary.externalAccess}
            </span>
          )}
        </div>
        <ul className="workspace-detail-lists">
          {isMember && (
            <li className="text-success">
              <CheckIcon icon="check" />
              {dictionary.labelJoined}
            </li>
          )}
          <li>
            {item.members.length} {item.members.length === 1 ? dictionary.member : dictionary.members}
          </li>
          <li>
            <FolderIcon icon="folder" />
            {workspace ? workspace.name : "Workspaces"}
          </li>
          <li>{stripHtml(topic.description)}</li>
        </ul>
      </div>
      {!isMember ? (
        <JoinButton onClick={handleJoinWorkspace} className="btn btn-primary join-button">
          <SvgIconFeather icon="user-plus" />
          {dictionary.buttonJoin}
        </JoinButton>
      ) : (
        <JoinButton onClick={handleLeaveWorkspace} className="btn btn-primary join-button">
          {dictionary.buttonLeave}
        </JoinButton>
      )}
    </Wrapper>
  );
};

export default WorkspaceSearchResult;
