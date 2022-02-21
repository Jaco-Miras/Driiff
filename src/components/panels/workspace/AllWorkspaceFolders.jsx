import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import FilterFolder from "./FilterFolder";
import { getAllWorkspaceFolders } from "../../../redux/actions/workspaceActions";

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
  const dispatch = useDispatch();
  const folders = useSelector((state) => state.workspaces.allFolders);
  const allFoldersLoaded = useSelector((state) => state.workspaces.allFoldersLoaded);
  const filterByFolder = useSelector((state) => state.workspaces.search.filterByFolder);
  useEffect(() => {
    if (!allFoldersLoaded) {
      dispatch(getAllWorkspaceFolders());
    }
  }, []);
  return (
    <Wrapper className={`list-group list-group-flush ${className}`}>
      {Object.values(folders)
        .sort((a, b) => {
          if (a.workspaces.length === b.workspaces.length) {
            return a.name.localeCompare(b.name);
          } else {
            return b.workspaces.length - a.workspaces.length;
          }
        })
        .map((f) => {
          return <FilterFolder folder={f} filterByFolder={filterByFolder} key={f.id} />;
        })}
    </Wrapper>
  );
};

export default React.memo(AllWorkspaceFolders);
