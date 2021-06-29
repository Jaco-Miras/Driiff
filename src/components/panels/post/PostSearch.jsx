import React, { useState } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { addPostSearchResult } from "../../../redux/actions/workspaceActions";
import { fetchPosts } from "../../../redux/actions/postActions";
import { SvgIconFeather } from "../../common";
import { debounce } from "lodash";

const Wrapper = styled.div`
  .btn-cross {
    position: absolute;
    top: 0;
    right: 45px;
    border: 0;
    background: transparent;
    padding: 0;
    height: 100%;
    width: 36px;
    border-radius: 4px;
    z-index: 9;
    svg {
      width: 16px;
      color: #495057;
    }
  }
`;

const PostSearch = (props) => {
  const { search, placeholder } = props;
  const dispatch = useDispatch();
  const params = useParams();
  const [searchValue, setSearchValue] = useState(search === null ? "" : search);

  let topic_id = parseInt(params.workspaceId);

  const handleInputChange = (e) => {
    setSearchValue(e.target.value);
    handleSearch(e.target.value.trim());
  };

  const handleClearSearchPosts = () => {
    setSearchValue("");
    dispatch(
      addPostSearchResult({
        topic_id: topic_id,
        search: "",
        search_result: [],
      })
    );
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleSearch = debounce((value) => {
    dispatch(
      addPostSearchResult({
        topic_id: topic_id,
        search: value,
        search_result: [],
      })
    );
    if (value === "") return;
    dispatch(
      fetchPosts(
        {
          topic_id: topic_id,
          search: value,
        },
        (err, res) => {
          if (err) return;
          dispatch(
            addPostSearchResult({
              topic_id: topic_id,
              search: value,
              search_result: res.data.posts,
            })
          );
        }
      )
    );
  }, 500);

  return (
    <Wrapper className="input-group">
      <input type="text" className="form-control" placeholder={placeholder} value={searchValue} aria-describedby="button-addon1" onKeyDown={handleEnter} onChange={handleInputChange} />
      <div className="input-group-append">
        {searchValue.trim() !== "" && (
          <button onClick={handleClearSearchPosts} className="btn-cross" type="button">
            <SvgIconFeather icon="x" />
          </button>
        )}
        <button className="btn btn-outline-light" type="button" id="button-addon1" onClick={handleSearch}>
          <i className="ti-search" />
        </button>
      </div>
    </Wrapper>
  );
};

export default React.memo(PostSearch);
