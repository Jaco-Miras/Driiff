import React from "react";
import styled from "styled-components";
import { WorkspaceIcon } from "./index";
import { SvgIconFeather } from "../common";
import { useSettings } from "../hooks";

const FONT_COLOR_DARK_MODE = "#CBD4DB";

const Wrapper = styled.div`
  display: flex;
  padding-top: 5px;
  margin-bottom: 15px;
  cursor: pointer;
  .feather {
    color: ${({ theme, dark_mode }) => (dark_mode === "1" ? FONT_COLOR_DARK_MODE : theme.colors.sidebarTextColor)};
  }
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
  align-self: center;
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
  const { isExternal, onSelectWorkspace, workspace, isCompanyWs, companyName } = props;
  const {
    generalSettings: { dark_mode },
  } = useSettings();

  const handleSelectWorkspace = () => {
    onSelectWorkspace(workspace);
  };
  return (
    <Wrapper dark_mode={dark_mode} onClick={handleSelectWorkspace}>
      <WorkspaceIcon avatarClassName="avatar-sm" workspace={workspace} isCompanyWs={isCompanyWs} companyName={companyName} />
      <WorkspaceTitleFolder className="workspace-title-folder">
        <WorkspaceTitle>
          <span className="text-truncate">{isCompanyWs && companyName ? companyName : workspace.name}</span>
          {workspace.is_lock === 1 && <Icon icon="lock" />}
          {workspace.is_shared && !isExternal && <Icon icon="eye" />}
        </WorkspaceTitle>
        {workspace.folder_name && (
          <WorkspaceFolder className="workspace-folder-name">
            <Icon icon="folder" />
            <span className="text-truncate">{workspace.folder_name}</span>
          </WorkspaceFolder>
        )}
      </WorkspaceTitleFolder>
    </Wrapper>
  );
};

export default FavWorkspaceList;
