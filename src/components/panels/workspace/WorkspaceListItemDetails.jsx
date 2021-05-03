import React from "react";
import styled from "styled-components";
import { SvgIconFeather } from "../../common";

const Wrapper = styled.div`
  .workspace-title {
    cursor: pointer;
  }
`;

const Icon = styled(SvgIconFeather)`
  width: 1rem;
  height: 1rem;
  margin-right: 3px;
`;

const WorkspaceListItemDetails = (props) => {
  const { dictionary, isExternal, isMember, item, onRedirect } = props;
  return (
    <Wrapper className="workspace-details">
      <div className="title-labels">
        <span className="workspace-title" onClick={(e) => onRedirect(e, item)}>
          {item.topic.name}
        </span>
        {item.topic.is_locked && <Icon icon="lock" />}
        {item.topic.is_shared && !isExternal && (
          <span className={"badge badge-external ml-1 d-flex align-items-center"}>
            <Icon icon="eye" /> {dictionary.withClient}
          </span>
        )}
      </div>
      <div className="labels">
        {isMember && (
          <span className="text-success">
            <Icon icon="check" />
            {dictionary.labelJoined}
          </span>
        )}
        <span>
          <Icon icon="user" />
          {item.members.length}
        </span>
        <span>
          <Icon icon="folder" />
          {item.workspace ? item.workspace.name : "Workspaces"}
        </span>
      </div>
    </Wrapper>
  );
};

export default WorkspaceListItemDetails;
