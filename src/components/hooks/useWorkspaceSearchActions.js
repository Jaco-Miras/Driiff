import { useCallback } from "react";
import { useDispatch } from "react-redux";
import {
    getAllWorkspace,
    joinWorkspace,
    updateWorkspaceSearch,
} from "../../redux/actions/workspaceActions";

const useWorkspaceSearchActions = () => {

    const dispatch = useDispatch();
    
    const search = useCallback(
        (payload, callback) => {
          dispatch(
              getAllWorkspace(payload, callback)
            );
        }, [dispatch]
    );
    
    const updateSearch = useCallback(
        (payload, callback) => {
          dispatch(
              updateWorkspaceSearch(payload, callback)
            );
        }, [dispatch]
    );

    const join = useCallback(
        (payload, callback) => {
          dispatch(
            joinWorkspace(payload, callback)
          );
        },
    [dispatch]);

    return {
        join,
        search,
        updateSearch
    }
};

export default useWorkspaceSearchActions;