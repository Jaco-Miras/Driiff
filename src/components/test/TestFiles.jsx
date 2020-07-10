import React from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { $_GET } from "../../helpers/commonFunctions";
import useWorkspaceFileActions from "../hooks/useWorkspaceFileActions";

const Wrapper = styled.div``;

const TestChat = (props) => {
  const params = useParams();

  const { className = "" } = props;

  const workspaceFileActions = useWorkspaceFileActions();

  let filter = {};
  if ($_GET("search")) {
    filter.search = $_GET("search");
  }
  if ($_GET("skip")) {
    filter.skip = $_GET("skip");
  }
  if ($_GET("limit")) {
    filter.limit = $_GET("limit");
  }

  workspaceFileActions.fetchStats(params.workspaceId);
  workspaceFileActions.fetch(params.workspaceId, filter);
  workspaceFileActions.fetchPopular(params.workspaceId, filter);
  workspaceFileActions.fetchImportant(params.workspaceId, filter);
  workspaceFileActions.fetchRecentlyEdited(params.workspaceId, filter);
  workspaceFileActions.fetchRemoved(params.workspaceId, filter);
  workspaceFileActions.fetchFolders(params.workspaceId, filter);

  return <Wrapper className={`${className}`}></Wrapper>;
};

export default React.memo(TestChat);
