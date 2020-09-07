import { useCallback } from "react";
import { useDispatch } from "react-redux";
import {
    getAllWorkspace,
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

    return {
        search,
        updateSearch
    }
};

export default useWorkspaceSearchActions;