import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { getAllWorkspace, joinWorkspace, updateWorkspaceSearch } from "../../redux/actions/workspaceActions";
import { addToModals } from "../../redux/actions/globalActions";

const useWorkspaceSearchActions = () => {
  const dispatch = useDispatch();

  const search = useCallback(
    (payload, callback) => {
      dispatch(getAllWorkspace(payload, callback));
    },
    [dispatch]
  );

  const updateSearch = useCallback(
    (payload, callback) => {
      dispatch(updateWorkspaceSearch(payload, callback));
    },
    [dispatch]
  );

  const join = useCallback(
    (payload, callback) => {
      dispatch(joinWorkspace(payload, callback));
    },
    [dispatch]
  );

  const showWorkspaceModal = () => {
    let payload = {
      type: "workspace_create_edit",
      mode: "create",
    };

    dispatch(addToModals(payload));
  };

  return {
    join,
    search,
    showWorkspaceModal,
    updateSearch,
  };
};

export default useWorkspaceSearchActions;
