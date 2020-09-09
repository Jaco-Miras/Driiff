import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { SvgIconFeather } from "../../common";

const Wrapper = styled.div`
    .input-group {
        width: 90%;
    }
`;

const CloseIcon = styled(SvgIconFeather)`
  stroke-width: 2px;
`;

const WorkspaceSearch = (props) => {

  const { actions, search } = props;
  const { value, searching} = search;
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
    }, (err, res) => {
      if (err) {
        actions.updateSearch({
            ...search,
            searching: false,
        });
      } else {
          actions.updateSearch({
              ...search,
              value: inputValue,
              searching: false,
              count: res.data.total_count,
              results: res.data.workspaces,
              maxPage: Math.ceil(res.data.total_count / 25),
              page: 1
          });
      }
    });
    actions.updateSearch({
        ...search,
        value: inputValue,
        searching: true,
    });
  };

  const handleClearSearch = () => {
    actions.updateSearch({
      results: [],
      searching: true,
      value: "",
      page: 1,
      maxPage: 1,
      count: 0,
    });
    actions.search({
      search: "",
      skip: 0,
      limit: 25,
    }, 
    (err,res) => {
        if (err) {
            actions.updateSearch({
                ...search,
                searching: false,
                value: ""
            });
        } else {
            actions.updateSearch({
                ...search,
                value: "",
                searching: false,
                count: res.data.total_count,
                results: res.data.workspaces,
                maxPage: Math.ceil(res.data.total_count / 25),
            });
        }
    });
    setInputValue("");
  };

  const handleSearchChange = (e) => {
    if (e.target.value.trim() === "" && value !== "") {
      handleClearSearch();
    } else {
      setInputValue(e.target.value);
    }
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
                {
                  inputValue.trim() !== "" &&
                  <button className="btn btn-outline-light" type="button" onClick={handleClearSearch}>
                    <CloseIcon icon="x"/>
                  </button>
                }
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
