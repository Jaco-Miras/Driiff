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

const AllWorkspaceListDetail = (props) => {
  const { dictionary, item } = props;
  return (
    <Wrapper className="workspace-details">
      <div className="title-labels">
        <span className="workspace-title">{item.name}</span>
        {item.private === 1 && <Icon icon="lock" />}
        {item.workspace && (
          <span className="ml-1 d-flex align-items-center">
            <Icon icon="folder" />
            {item.workspace.name}
          </span>
        )}
        <span className="ml-1 d-flex align-items-center">
          <Icon icon="user" />
          {Object.values(item.members).length}
        </span>

        {item.is_shared && (
          <>
            <span className={"badge badge-external ml-1 align-items-center"}>
              <Icon icon="eye" /> {dictionary.withClient}
            </span>
            <Icon icon="eye" className="mobile-icon" />
          </>
        )}
      </div>
      {/* <div className="labels">
        <span className="mr-2">
          <Icon icon="user" />
          {Object.values(item.members).length}
        </span>
        {item.workspace && (
          <span className="mr-2">
            <Icon icon="folder" />
            {item.workspace.name}
          </span>
        )}
      </div> */}
    </Wrapper>
  );
};

export default AllWorkspaceListDetail;
