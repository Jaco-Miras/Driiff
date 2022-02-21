import React, { useEffect } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useTranslationActions } from "../../hooks";
import AllWorkspacesPagination from "./AllWorkspacesPagination";
import AllWorkspaceList from "./AllWorkspaceList";
import { getAllWorkspaces } from "../../../redux/actions/adminActions";
import { Loader } from "../../common";

const Wrapper = styled.div`
  display: flex;
  flex-flow: column;
  height: 100%;
  padding: 1rem;
  > div {
    margin-bottom: 1rem;
  }
`;

const Lists = styled.ul`
  padding: 0;
  margin: 0;
  list-style: none;
  flex-grow: 1;
  li {
    padding: 15px;
  }
  li:nth-child(2) {
    border-top: none;
  }
  &.active-workspaces {
    border-radius 6px 6px 0 0;
  }
  &.archived-workspaces {
    .dark & {
      border: 1px solid;
      border-top: 0;
      border-color: hsla(0,0%,60.8%,.1);
      border-radius: 0 0 6px 6px;
      background: #252a2d;
    }
  }
  &.archived-workspaces li {
    background-color: #fafafa;
    opacity: .7;
    .dark & {
      background-color: #252a2d;
    }
  }
  &.archived-workspaces li:last-child {
    border-radius 0 0 6px 6px;
    border-bottom: none;
  }
`;

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
`;

const WorkspacesBody = () => {
  const { _t } = useTranslationActions();

  const dispatch = useDispatch();
  const dictionary = {
    withClient: _t("ALL_WORKSPACE.WITH_CLIENT", "With client"),
  };
  const allWorkspacesLoaded = useSelector((state) => state.admin.allWorkspacesLoaded);
  const allWorkspaces = useSelector((state) => state.admin.allWorkspaces);
  const allWorkspacesPage = useSelector((state) => state.admin.allWorkspacesPage);
  useEffect(() => {
    if (!allWorkspacesLoaded) {
      const payload = {
        page: 1,
        limit: 25,
      };
      dispatch(getAllWorkspaces(payload));
    }
  }, []);
  return (
    <Wrapper>
      <h4>All workspaces</h4>

      {!allWorkspacesLoaded && (
        <LoaderContainer className={"initial-load"}>
          <Loader />
        </LoaderContainer>
      )}
      {allWorkspacesLoaded && (
        <Lists className="active-workspaces">
          {allWorkspaces[allWorkspacesPage] &&
            Object.values(allWorkspaces[allWorkspacesPage]).map((ws) => {
              return <AllWorkspaceList key={ws.id} dictionary={dictionary} item={ws} />;
            })}
        </Lists>
      )}

      <AllWorkspacesPagination />
    </Wrapper>
  );
};

export default WorkspacesBody;
