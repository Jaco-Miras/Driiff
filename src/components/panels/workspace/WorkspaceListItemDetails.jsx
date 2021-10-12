import React from "react";
import styled from "styled-components";
import { SvgIconFeather } from "../../common";

const Wrapper = styled.div`
  .workspace-title {
    cursor: pointer;
  }
  .labels span {
    display: flex;
    align-items: center;
  }
  .mobile-icon {
    display: none;
  }
  @media (max-width: 414px) {
    .badge {
      display: none;
    }
    .mobile-icon {
      display: block;
    }
  }
`;

const Icon = styled(SvgIconFeather)`
  width: 1rem;
  height: 1rem;
  margin-right: 3px;
`;
const JoinedSpan = styled.span`
  span.text-success {
    margin-right: 0;
  }
`;

const CheckIcon = styled(SvgIconFeather)`
  width: 0.8rem;
  height: 0.8rem;
  color: #fff;
  stroke-width: 3;
  padding: 2px;
`;

const CheckIconContainer = styled.span`
  background: #00c851;
  border-radius: 50%;
  margin-right: 3px;
`;

const WorkspaceListItemDetails = (props) => {
  const { dictionary, isExternal, isMember, item, onRedirect, members } = props;
  return (
    <Wrapper className="workspace-details">
      <div className="title-labels">
        <span className="workspace-title" onClick={(e) => onRedirect(e, item)}>
          {item.topic.name}
        </span>
        {item.topic.is_locked && <Icon icon="lock" />}
        {item.topic.is_shared && !isExternal && (
          <>
            <span className={"badge badge-external ml-1 align-items-center"}>
              <Icon icon="eye" /> {dictionary.withClient}
            </span>
            <Icon icon="eye" className="mobile-icon" />
          </>
        )}
      </div>
      <div className="labels">
        {isMember && (
          <JoinedSpan className="mr-2">
            <CheckIconContainer>
              <CheckIcon icon="check" />
            </CheckIconContainer>
            <span className="text-success">{dictionary.labelJoined}</span>
          </JoinedSpan>
        )}
        <span className="mr-2">
          <Icon icon="user" />
          {members.length}
        </span>
        {item.workspace && (
          <span className="mr-2">
            <Icon icon="folder" />
            {item.workspace.name}
          </span>
        )}
      </div>
    </Wrapper>
  );
};

export default WorkspaceListItemDetails;
