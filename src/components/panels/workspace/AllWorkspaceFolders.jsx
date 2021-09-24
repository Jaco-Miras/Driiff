import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import FilterFolder from "./FilterFolder";

const Wrapper = styled.div`
  a {
    cursor: pointer;
  }
  .list-group-item:last-child {
    border-bottom-width: thin !important;
  }
`;
const AllWorkspaceFolders = (props) => {
  const { className = "" } = props;

  const folders = useSelector((state) => state.workspaces.search.folders);
  const filterByFolder = useSelector((state) => state.workspaces.search.filterByFolder);

  return (
    <Wrapper className={`list-group list-group-flush ${className}`}>
      {Object.values(folders).map((f) => {
        return <FilterFolder folder={f} filterByFolder={filterByFolder} key={f.id} />;
      })}
    </Wrapper>
  );
};

export default React.memo(AllWorkspaceFolders);
