import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { SvgIconFeather } from "../../common";

const Wrapper = styled.div`
    .input-group {
        width: 90%;
    }
`;

const WorkspaceSearch = (props) => {

  const { actions, search } = props;
  const { value, searching, results } = search;
  const [inputValue, setInputValue] = useState(value);

  const handleEnter = (e) => {
    if (e.key === "Enter" && !searching) {
      handleSearch();
    }
  };

  const handleSearch = () => {
    actions.search({
        search: inputValue,
        skip: 0,
        limit: 25,
    });
    actions.updateSearch({
        ...search,
        value: inputValue,
        searching: true,
        results: value === inputValue ? results : []
    });
  };

  const handleSearchChange = (e) => {
    if (e.target.value.trim() === "" && value !== "") {
      actions.updateSearch({
        results: [],
        searching: false,
        value: "",
        page: 1,
        maxPage: 1,
        count: 0,
      });
    }
    setInputValue(e.target.value)
  };

  useEffect(() => {
    setInputValue(value)
  }, [value]);

  return (
    <Wrapper className="card p-t-b-40" data-backround-image="assets/media/image/image1.jpg">
      <div className="container">
        <div className="row d-flex justify-content-center">
            <h2 className="mb-4 text-center">Search workspace</h2>
            <div className="input-group">
              <input onChange={handleSearchChange} onKeyDown={handleEnter} type="text" className="form-control" placeholder="Search..." aria-describedby="button-addon1" autoFocus value={inputValue} />
              <div className="input-group-append">
                <button className="btn btn-outline-light" type="button" onClick={handleSearch}>
                  <SvgIconFeather icon="search" />
                </button>
              </div>
            </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default WorkspaceSearch;
