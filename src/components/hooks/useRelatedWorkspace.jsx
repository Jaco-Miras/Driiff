import React, { useState, useEffect, useMemo } from "react";
import useUsers from "./useUsers";
import useTranslationActions from "./useTranslationActions";
import { useDispatch, useSelector } from "react-redux";
import { getRelatedWorkspace, clearRelatedWorkspace } from "../../redux/actions/workspaceActions";

const LIMIT = 25;
const SKIP = 25;

const useRelatedWorkspace = (userId) => {
  const { users } = useUsers();
  const [skip, setSkip] = useState(0);
  const [connectedUserLabel, setConnectedUserLabel] = useState("");
  const [relatedWorkspaces, setRelatedWorkspaces] = useState([]);
  const dispatch = useDispatch();
  const { _t } = useTranslationActions();

  const dictionary = {
    workspaceYouShareWith: _t("WORKSPACE_BODY.WORKSPACE_YOUR_SHARE_WITH", "Workspaces you share with"),
    noSharedWorkspace: _t("WORKSPACE_BODY.NO_SHARED_WORKSPACE", "You have no shared workspace with"),
    loadMoreText: _t("WORKSPACE_BODY.LOAD_MORE", "Load More"),
  };

  const { loading, error, data, hasMore } = useSelector((state) => state.workspaces.relatedworkspace);

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
    setRelatedWorkspaces(data);
  }, [data]);

  useEffect(() => {
    if (userId) {
      dispatch(getRelatedWorkspace({ userId, skip, limit: LIMIT }));
    }
  }, [userId, skip]);

  const loadMore = () => {
    setSkip((prev) => prev + SKIP);
  };

  const clearWorkspace = () => {
    dispatch(clearRelatedWorkspace());
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

  const renderLoadMoreButton = () => {
    return (
      <button className="btn btn-primary" onClick={loadMore} disabled={loading}>
        {dictionary.loadMoreText}
      </button>
    );
  };

  return {
    renderConnectedUserLabel,
    renderLoadMoreButton,
    clearWorkspace,
    loading,
    error,
    hasMore,
    relatedWorkspaces,
  };
};

export default useRelatedWorkspace;
