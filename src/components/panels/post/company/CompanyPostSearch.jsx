import React, { useState } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { addCompanyPostSearchResult, getCompanyPosts } from "../../../../redux/actions/postActions";
import { SvgIconFeather } from "../../../common";

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

const CompanyPostSearch = (props) => {
  const { search, placeholder } = props;
  const dispatch = useDispatch();
  const [searchValue, setSearchValue] = useState(search === null ? "" : search);

  const handleInputChange = (e) => {
    if (e.target.value.trim() === "" && searchValue !== "") handleClearSearchPosts();
    setSearchValue(e.target.value);
  };

  const handleClearSearchPosts = () => {
    setSearchValue("");
    dispatch(
      addCompanyPostSearchResult({
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
      getCompanyPosts(
        {
          search: searchValue,
        },
        (err, res) => {
          if (err) return;
          dispatch(
            addCompanyPostSearchResult({
              search: searchValue,
              search_result: res.data.posts,
            })
          );
        }
      )
    );
  };

  return (
    <Wrapper className="input-group">
      <input type="text" className="form-control" placeholder={placeholder} value={searchValue} aria-describedby="button-addon1" onKeyDown={handleEnter} onChange={handleInputChange} />
      {searchValue.trim() !== "" && (
        <button onClick={handleClearSearchPosts} className="btn-cross" type="button">
          <SvgIconFeather icon="x" />
        </button>
      )}
      <div className="input-group-append">
        <button className="btn btn-outline-light" type="button" id="button-addon1" onClick={handleSearch}>
          <i className="ti-search" />
        </button>
      </div>
    </Wrapper>
  );
};

export default React.memo(CompanyPostSearch);
