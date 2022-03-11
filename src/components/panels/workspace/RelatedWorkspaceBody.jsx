import React, { useEffect, useState, useMemo } from "react";
import styled from "styled-components";
import WorkspaceListItem from "./WorkspaceListItem";
import { useWorkspaceSearchActions, useTranslationActions, useQueryParams, useUsers, useToaster } from "../../hooks";
import { useDispatch, useSelector } from "react-redux";
import { getRelatedWorkspace, clearRelatedWorkspace } from "../../../redux/actions/workspaceActions";
import { Loader } from "../../common";

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

const LIMIT = 25;
const SKIP = 25;

const RelatedWorkspaceBody = ({ userId }) => {
  const actions = useWorkspaceSearchActions();
  const { _t } = useTranslationActions();
  const toaster = useToaster();
  const { users } = useUsers();

  const [skip, setSkip] = useState(0);
  const [connectedUserLabel, setConnectedUserLabel] = useState("");

  const dispatch = useDispatch();

  const { loading, error, data, hasMore } = useSelector((state) => state.workspaces.relatedworkspace);

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
    workspaceYouShareWith: _t("WORKSPACE_BODY.WORKSPACE_YOUR_SHARE_WITH", "Workspaces you share with"),
    noSharedWorkspace: _t("WORKSPACE_BODY.NO_SHARED_WORKSPACE", "You have no shared workspace with"),
    loadMoreText: _t("WORKSPACE_BODY.LOAD_MORE", "Load More"),
    errorMessage: _t("WORKSPACE_BODY.ERROR_MESSAGE", "Error fetching related workspaces"),
  };

  const connectedUser = useMemo(() => {
    if (userId) {
      return users[userId];
    }
    return null;
  }, [userId, users]);

  useEffect(() => {
    if (userId) {
      dispatch(getRelatedWorkspace({ userId, skip, limit: LIMIT }));
    }
  }, [userId, skip]);

  useEffect(() => {
    if (data.length > 0) {
      setConnectedUserLabel(dictionary.workspaceYouShareWith);
    } else {
      setConnectedUserLabel(dictionary.noSharedWorkspace);
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      toaster.error(dictionary.errorMessage);
    }
  }, [error]);
  useEffect(() => {
    return () => {
      dispatch(clearRelatedWorkspace());
    };
  }, []);

  const loadMore = () => {
    setSkip((prev) => prev + SKIP);
  };

  const renderConnectedUserLabel = () => {
    if (connectedUser) {
      return (
        <p className="mx-3 my-2">
          {connectedUserLabel}: {connectedUser.name}
        </p>
      );
    }
  };

  return (
    <>
      <Wrapper className={"card"}>
        {!loading && !error && renderConnectedUserLabel()}
        <Lists className="active-workspaces">
          {data.map((result) => {
            return <WorkspaceListItem actions={actions} key={result.topic.id} dictionary={dictionary} item={result} />;
          })}
        </Lists>
      </Wrapper>
      {loading && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Loader />
        </div>
      )}
      {hasMore && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button className="btn btn-primary" onClick={loadMore} disabled={loading}>
            {dictionary.loadMoreText}
          </button>
        </div>
      )}
    </>
  );
};

export default RelatedWorkspaceBody;
