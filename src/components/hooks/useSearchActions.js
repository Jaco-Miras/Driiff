import { useCallback } from "react";
import { useDispatch } from "react-redux";
import {
    globalSearch,
    saveSearchInput,
    updateTab,
} from "../../redux/actions/searchActions";

const useSearchActions = () => {

    const dispatch = useDispatch();
    
    const search = useCallback(
        (payload, callback) => {
          dispatch(
              globalSearch(payload, callback)
            );
        }, [dispatch]
    );

    const saveSearchValue = useCallback(
        (payload, callback) => {
          dispatch(
              saveSearchInput(payload, callback)
            );
        }, [dispatch]
    );
    
    const updateTabPage = useCallback(
        (payload, callback) => {
          dispatch(
              updateTab(payload, callback)
            );
        }, [dispatch]
    );

    return {
        search,
        saveSearchValue,
        updateTabPage
    }
};

export default useSearchActions;