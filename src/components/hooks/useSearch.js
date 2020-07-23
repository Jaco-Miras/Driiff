import { useSelector } from "react-redux";

const useSearch = () => {

    const { searchCount, searchResults, searchValue } = useSelector((state) => state.global);

    if (Object.values(searchResults).length && searchValue !== "") {
        return {
            count: searchCount,
            results: Object.values(searchResults),
            value: searchValue,
        }
    } else if (Object.values(searchResults).length === 0 && searchValue !== "") {
        return {
            count: searchCount,
            results: [],
            value: searchValue,
        }
    } else {
        return {
            count: 0,
            results: [],
            value: "",
        }
    }
};

export default useSearch;