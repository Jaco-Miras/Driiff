import React, { useState } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
// import { addWorkInProgressSearchInputResult, searchCompanyPosts } from "../../../../redux/actions/postActions";
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

const WorkInProgressSearchInput = (props) => {
  const { search = "", placeholder = "" } = props;
  const dispatch = useDispatch();
  const [searchValue, setSearchValue] = useState(search);

  const handleSearch = debounce((value) => {
    // dispatch(
    //   addWorkInProgressSearchInputResult({
    //     search: value,
    //     search_result: [],
    //   })
    // );
    // if (value === "") return;
    // dispatch(
    //   searchCompanyPosts(
    //     {
    //       search: value,
    //     },
    //     (err, res) => {
    //       if (err) return;
    //       dispatch(
    //         addWorkInProgressSearchInputResult({
    //           search: value,
    //           search_result: res.data.posts,
    //         })
    //       );
    //     }
    //   )
    // );
  }, 500);

  const handleInputChange = (e) => {
    setSearchValue(e.target.value);
    // dispatch(
    //   addWorkInProgressSearchInputResult({
    //     search: e.target.value,
    //     search_result: [],
    //   })
    // );
    handleSearch(e.target.value.trim());
  };

  const handleClearSearchPosts = () => {
    setSearchValue("");
    // dispatch(
    //   addWorkInProgressSearchInputResult({
    //     search: "",
    //     search_result: [],
    //   })
    // );
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      handleSearch(searchValue);
    }
  };

  return (
    <Wrapper className="input-group">
      <input type="text" className="form-control" placeholder={placeholder} value={searchValue} aria-describedby="button-addon1" onKeyDown={handleEnter} onChange={handleInputChange} />
      {search.trim() !== "" && (
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

export default React.memo(WorkInProgressSearchInput);
