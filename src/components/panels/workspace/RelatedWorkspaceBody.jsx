import React, { useEffect } from "react";
import styled from "styled-components";
import { Loader } from "../../common";
import { useToaster, useTranslationActions, useWorkspaceSearchActions, useRelatedWorkspace } from "../../hooks";
import WorkspaceListItem from "./WorkspaceListItem";

const Wrapper = styled.div`
  overflow: visible !important;
`;

const Lists = styled.ul`
  padding: 0;
  margin: 0;
  list-style: none;
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

const CenterHorizontal = styled.div`
  display: flex;
  justify-content: center;
`;

const RelatedWorkspaceBody = ({ userId }) => {
  const actions = useWorkspaceSearchActions();
  const { _t } = useTranslationActions();
  const toaster = useToaster();

  const { renderConnectedUserLabel, renderLoadMoreButton, loading, error, hasMore, relatedWorkspaces, clearWorkspace } = useRelatedWorkspace(userId);

  const dictionary = {
    notJoined: _t("ALL_WORKSPACE.NOT_JOINED", "Not joined"),
    withClient: _t("ALL_WORKSPACE.WITH_CLIENT", "With client"),
    searchWorkspacePlaceholder: _t("PLACEHOLDER.SEARCH_WORKSPACE_TITLE", "Search workspace"),
    filters: _t("PLACEHOLDER.SEARCH_WORKSPACE_FILTER", "Filters", "Filters"),
    private: _t("WORKSPACE.PRIVATE", "Private"),
    archived: _t("WORKSPACE.ARCHIVED", "Archived"),
    new: _t("WORKSPACE.NEW", "New"),
    active: _t("ALL_WORKSPACE.ACTIVE", "Active"),
    labelOpen: _t("LABEL.OPEN", "Open"),
    labelJoined: _t("LABEL.JOINED", "Joined"),
    buttonJoin: _t("BUTTON.JOIN", "Join"),
    buttonLeave: _t("BUTTON.LEAVE", "Leave"),
    externalAccess: _t("WORKSPACE_SEARCH.EXTERNAL_ACCESS", "External access"),
    addNewWorkspace: _t("SIDEBAR.ADD_NEW_WORKSPACES", "Add new workspace"),
    favourites: _t("WORKSPACE.FAVOURITES", "Favourites"),
    all: _t("ALL_WORKSPACE.ALL", "All"),
    workspaceSortOptionsAlpha: _t("WORKSPACE_SORT_OPTIONS.ALPHA", "Sort by Alphabetical Order (A-Z)"),
    workspaceSortOptionsDate: _t("WORKSPACE_SORT_OPTIONS.DATE", "Sort by Date (New to Old)"),
    folders: _t("ALL_WORKSPACE.FOLDERS", "Folders"),
    newFolder: _t("TOOLTIP.NEW_FOLDER", "New folder"),
    errorMessage: _t("WORKSPACE_BODY.ERROR_MESSAGE", "Error fetching related workspaces"),
  };

  useEffect(() => {
    if (error) {
      toaster.error(dictionary.errorMessage);
    }
  }, [error]);

  useEffect(() => {
    return clearWorkspace;
  }, []);

  return (
    <>
      <Wrapper className={"card"}>
        {!loading && !error && renderConnectedUserLabel()}
        <Lists className="active-workspaces">
          {relatedWorkspaces.map((result) => {
            return <WorkspaceListItem actions={actions} key={result.topic.id} dictionary={dictionary} item={result} />;
          })}
        </Lists>
      </Wrapper>
      {loading && (
        <CenterHorizontal>
          <Loader />
        </CenterHorizontal>
      )}
      {hasMore && <CenterHorizontal>{renderLoadMoreButton()}</CenterHorizontal>}
    </>
  );
};

export default RelatedWorkspaceBody;
