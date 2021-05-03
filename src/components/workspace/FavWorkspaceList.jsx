import React from "react";
import styled from "styled-components";
import { WorkspaceIcon } from "./index";
import { SvgIconFeather } from "../common";

const Wrapper = styled.div`
  padding: 5px;
  display: flex;
  margin-bottom: 10px;
  cursor: pointer;
  .feather-star {
    top: -2px;
    right: -2px;
  }
  .feather-folder {
    margin-right: 5px;
    width: 0.7rem;
    height: 0.7rem;
  }
  .workspace-folder-name {
    font-size: 0.7rem;
  }
`;

const WorkspaceTitleFolder = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Icon = styled(SvgIconFeather)`
  min-width: 0.8rem;
  min-height: 0.8rem;
  width: 0.8rem;
  height: 0.8rem;
`;

const WorkspaceTitle = styled.div`
  display: flex;
  align-items: center;
  color: #cbd4db;
  .feather {
    margin-left: 5px;
  }
`;

const WorkspaceFolder = styled.div`
  display: flex;
  align-items: center;
  color: #8b8b8b;
`;

const FavWorkspaceList = (props) => {
  const { isExternal, onSelectWorkspace, workspace } = props;
  const handleSelectWorkspace = () => {
    onSelectWorkspace(workspace);
  };
  return (
    <Wrapper onClick={handleSelectWorkspace}>
      <WorkspaceIcon avatarClassName="avatar-sm" workspace={workspace} />
      <WorkspaceTitleFolder>
        <WorkspaceTitle>
          <span className="text-truncate">{workspace.name}</span>
          {workspace.is_lock === 1 && <Icon icon="lock" />}
          {workspace.is_shared && !isExternal && <Icon icon="eye" />}
        </WorkspaceTitle>
        <WorkspaceFolder className="workspace-folder-name">
          <Icon icon="folder" />
          <span className="text-truncate">{workspace.folder_name ? workspace.folder_name : "Workspaces"}</span>
        </WorkspaceFolder>
      </WorkspaceTitleFolder>
    </Wrapper>
  );
};

export default FavWorkspaceList;
