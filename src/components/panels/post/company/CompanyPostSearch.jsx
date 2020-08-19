import React, {useState} from "react";
import {useDispatch} from "react-redux";
import {useParams} from "react-router-dom";
import {addPostSearchResult} from "../../../../redux/actions/workspaceActions";
import {fetchPosts} from "../../../../redux/actions/postActions";

const CompanyPostSearch = (props) => {
  const {search, placeholder} = props;
  const dispatch = useDispatch();
  const params = useParams();
  const [searchValue, setSearchValue] = useState(search === null ? "" : search);

  let topic_id = parseInt(params.workspaceId);

  const handleInputChange = (e) => {
    if (e.target.value.trim() === "" && searchValue !== "") handleClearSearchPosts();
    setSearchValue(e.target.value);
  };

  const handleClearSearchPosts = () => {
    dispatch(
      addPostSearchResult({
        topic_id: topic_id,
        search: null,
        search_result: [],
      })
    );
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleSearch = () => {
    dispatch(
      fetchPosts(
        {
          topic_id: topic_id,
          search: searchValue,
        },
        (err, res) => {
          if (err) return;
          dispatch(
            addPostSearchResult({
              topic_id: topic_id,
              search: searchValue,
              search_result: res.data.posts,
            })
          );
        }
      )
    );
  };

  return (
    <div className="input-group">
      <input type="text" className="form-control" placeholder={placeholder} value={searchValue}
             aria-describedby="button-addon1" onKeyDown={handleEnter} onChange={handleInputChange}/>
      <div className="input-group-append">
        <button className="btn btn-outline-light" type="button" id="button-addon1" onClick={handleSearch}>
          <i className="ti-search"/>
        </button>
      </div>
    </div>
  );
};

export default React.memo(CompanyPostSearch);
