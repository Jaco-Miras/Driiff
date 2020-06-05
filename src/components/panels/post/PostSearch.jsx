import React, {useState} from "react";
import {useDispatch} from "react-redux";
import {useParams} from "react-router-dom";
import {getWorkspacePosts} from "../../../redux/actions/workspaceActions";

const PostSearch = props => {

    const dispatch = useDispatch();
    const params = useParams();
    const [searchValue, setSearchValue] = useState("");

    const handleInputChange = e => {
        setSearchValue(e.target.value);
    };

    const handleEnter = e => {
        if (e.key === "Enter") {
            handleSearch();
        }
    }
    const handleSearch = () => {
        dispatch(
            getWorkspacePosts({
                topic_id: parseInt(params.workspaceId),
                search: searchValue
            }, (err,res) => {
                console.log(res, 'search result')
            })
        )
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