import React from "react";
import styled from "styled-components";
import { updateWorkspaceSearch } from "../../../redux/actions/workspaceActions";
import { useDispatch } from "react-redux";

const Wrapper = styled.li`
  cursor: pointer;
  &.list-group-item.active {
    border-color: #eeebee;
    background-color: #fafafa !important;
    .dark & {
      background-color: #111417 !important;
    }
  }
`;

const FilterFolder = (props) => {
  const { folder, filterByFolder } = props;

  const dispatch = useDispatch();

  const handleFilterByFolder = () => {
    dispatch(updateWorkspaceSearch({ filterByFolder: folder, filterBy: "" }));
  };

  return (
    <Wrapper className={`list-group-item d-flex align-items-center ${filterByFolder && filterByFolder.id === folder.id && "active"}`} onClick={handleFilterByFolder}>
      <span className="text-primary fa fa-circle mr-2" />
      {folder.name}
      <span className="small ml-auto">{folder.workspaces.length > 0 && folder.workspaces.length}</span>
    </Wrapper>
  );
};

export default React.memo(FilterFolder);
