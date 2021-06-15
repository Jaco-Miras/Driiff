import { useDispatch } from "react-redux";
import { globalSearch, saveSearchInput, updateTab } from "../../redux/actions/searchActions";

const useSearchActions = () => {
  const dispatch = useDispatch();

  const search = (payload, callback) => {
    dispatch(globalSearch(payload, callback));
  };

  const saveSearchValue = (payload, callback) => {
    dispatch(saveSearchInput(payload, callback));
  };

  const updateTabPage = (payload, callback) => {
    dispatch(updateTab(payload, callback));
  };

  return {
    search,
    saveSearchValue,
    updateTabPage,
  };
};

export default useSearchActions;
