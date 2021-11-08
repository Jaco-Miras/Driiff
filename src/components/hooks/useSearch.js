import { useSelector } from "react-redux";

const useSearch = () => {
  const searching = useSelector((state) => state.global.searching);
  const searchCount = useSelector((state) => state.global.searchCount);
  const searchResults = useSelector((state) => state.global.searchResults);
  const searchValue = useSelector((state) => state.global.searchValue);
  const tabs = useSelector((state) => state.global.tabs);
  return {
    count: searchCount,
    results: Object.values(searchResults),
    value: searchValue,
    searching: searching,
    tabs: tabs,
  };
};

export default useSearch;
