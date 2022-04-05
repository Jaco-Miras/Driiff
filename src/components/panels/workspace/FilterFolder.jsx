import React from "react";
import styled from "styled-components";
import { updateWorkspaceSearch } from "../../../redux/actions/workspaceActions";
import { useDispatch, useSelector } from "react-redux";
import { SvgIconFeather } from "../../common";
import { addToModals } from "../../../redux/actions/globalActions";

const Wrapper = styled.li`
  cursor: pointer;
  &.list-group-item.active {
    border-color: #eeebee;
    background-color: #fafafa !important;
    .dark & {
      background-color: #111417 !important;
    }
  }
  .feather {
    width: 0;
    height: 0;
    transition: 0.3s ease;
    display: inline-block;
  }
  :hover {
    .feather {
      width: 1rem;
      height: 1rem;
    }
  }
`;

const FilterFolder = (props) => {
  const { folder, filterByFolder } = props;

  const dispatch = useDispatch();
  const folders = useSelector((state) => state.workspaces.folders);

  const handleFilterByFolder = () => {
    dispatch(updateWorkspaceSearch({ filterByFolder: folder, filterBy: "" }));
  };

  const handleEditFolder = () => {
    if (folders[folder.id]) {
      let payload = {
        mode: "edit",
        item: folders[folder.id],
        type: "workspace_folder",
      };
      dispatch(addToModals(payload));
    } else {
      //show no access
      let payload = {
        type: "no_access_folder",
      };
      dispatch(addToModals(payload));
    }
  };

  return (
    <Wrapper className={`list-group-item d-flex align-items-center ${filterByFolder && filterByFolder.id === folder.id && "active"}`} onClick={handleFilterByFolder}>
      <span className="text-primary fa fa-circle mr-2" />
      {folder.name}
      <span className="ml-auto">
        <span className="small">{folder.workspaces.length > 0 && folder.workspaces.length}</span>
        <SvgIconFeather className="cursor-pointer ml-2" icon="pencil" onClick={handleEditFolder} />
      </span>
    </Wrapper>
  );
};

export default React.memo(FilterFolder);
