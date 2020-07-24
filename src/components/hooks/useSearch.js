import { useSelector } from "react-redux";

const useSearch = () => {

    const { searching, searchCount, searchResults, searchValue, tabs } = useSelector((state) => state.global);

    return {
        count: searchCount,
        results: Object.values(searchResults),
        value: searchValue,
        searching: searching,
        tabs: tabs
    }
};

export default useSearch;