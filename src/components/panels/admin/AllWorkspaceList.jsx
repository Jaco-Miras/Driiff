import React from "react";
import styled from "styled-components";
import AllWorkspaceListDetail from "./AllWorkspaceListDetail";

const Wrapper = styled.li`
  position: relative;
  display: flex;
  align-items: center;
  list-style: none;
  border-right: none;
  border-left: none;
  border-top: none;

  .workspace-icon {
    position: relative;
  }
  .workspace-list-buttons {
    display: none;
  }
  .workspace-title {
    font-size: 1rem;
  }
  .title-labels,
  .labels {
    display: flex;
  }
  .title-labels {
    align-items: center;
    .feather-lock {
      margin: 0 5px;
    }
    .feather-eye {
      width: 0.8rem;
      height: 0.8rem;
    }
  }
`;

const AllWorkspaceList = (props) => {
  const { item, dictionary } = props;

  return (
    <Wrapper className="list-group-item">
      <AllWorkspaceListDetail item={item} dictionary={dictionary} />
    </Wrapper>
  );
};

export default AllWorkspaceList;
