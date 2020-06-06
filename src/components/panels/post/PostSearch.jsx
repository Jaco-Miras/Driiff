import React, {useState} from "react";
import {useDispatch} from "react-redux";
import {useParams} from "react-router-dom";
import {getWorkspacePosts, addPostSearchResult} from "../../../redux/actions/workspaceActions";

const PostSearch = props => {

    const dispatch = useDispatch();
    const params = useParams();
    const [searchValue, setSearchValue] = useState("");
    let topic_id = parseInt(params.workspaceId);

    const handleInputChange = e => {
        if (e.target.value.trim() === "" && searchValue !== "") handleClearSearchPosts();
        setSearchValue(e.target.value);
    };

    const handleClearSearchPosts = () => {
        dispatch(
            addPostSearchResult({
                topic_id: topic_id,
                search_result: []
            })
        );
    };

    const handleEnter = e => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    const handleSearch = () => {
        dispatch(
            getWorkspacePosts({
                topic_id: topic_id,
                search: searchValue
            }, (err,res) => {
                if (err) return;
                dispatch(
                    addPostSearchResult({
                        topic_id: topic_id,
                        search_result: res.data.posts
                    })
                )
                console.log(res, 'search result')
            })
        );
    };

    return (
        <div className="input-group">
            <input type="text" className="form-control" placeholder="Post search"
                    aria-describedby="button-addon1" onKeyDown={handleEnter} onChange={handleInputChange}/>
            <div className="input-group-append">
                <button className="btn btn-outline-light" type="button"
                        id="button-addon1" onClick={handleSearch}>
                    <i className="ti-search"></i>
                </button>
            </div>
        </div>
    )
};

export default PostSearch;