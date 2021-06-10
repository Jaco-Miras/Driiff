import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { SvgIconFeather } from "../../common";

const Wrapper = styled.div`
  overflow: inherit !important;
  .action-right {
    margin: 0 !important;
  }
  .action-left {
    ul {
      margin-bottom: 0;
      display: inherit;

      li {
        position: relative;

        .button-dropdown {
        }
      }
    }
    .app-sidebar-menu-button {
      margin-left: 8px;
    }
  }
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

const AllWorkspaceSearch = (props) => {
  const { actions, dictionary, search } = props;

  const { value, searching, filterBy } = search;
  const [inputValue, setInputValue] = useState("");

  const handleEnter = (e) => {
    if (e.key === "Enter" && !searching) {
      handleSearch();
    }
  };

  const handleSearch = () => {
    actions.updateSearch({
      ...search,
      results: [],
      value: inputValue,
      filterBy: filterBy,
      searching: true,
    });
    actions.search(
      {
        search: inputValue,
        skip: 0,
        limit: 25,
        filter_by: filterBy,
      },
      (err, res) => {
        if (err) {
          actions.updateSearch({
            ...search,
            searching: false,
          });
        } else {
          actions.updateSearch({
            ...search,
            value: inputValue,
            filterBy: filterBy,
            searching: false,
            count: res.data.total_count,
            results: res.data.workspaces,
            maxPage: Math.ceil(res.data.total_count / 25),
            page: 1,
          });
        }
      }
    );
  };

  const handleClearSearch = () => {
    actions.updateSearch({
      results: [],
      searching: true,
      value: "",
      filterBy: "all",
      page: 1,
      maxPage: 1,
      count: 0,
    });
    actions.search(
      {
        search: "",
        skip: 0,
        limit: 25,
        filter_by: "all",
      },
      (err, res) => {
        if (err) {
          actions.updateSearch({
            searching: false,
            value: "",
            filterBy: "all",
          });
        } else {
          actions.updateSearch({
            value: "",
            filterBy: "all",
            searching: false,
            count: res.data.total_count,
            results: res.data.workspaces,
            maxPage: Math.ceil(res.data.total_count / 25),
          });
        }
      }
    );
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
    let timeoutValue = setTimeout(() => {
      actions.updateSearch({
        value: inputValue,
        //results: [],
        hasMore: true,
      });
    }, 500);
    return () => clearTimeout(timeoutValue);
  }, [inputValue]);

  const openMobileModal = () => {
    document.body.classList.toggle("mobile-modal-open");
  };

  return (
    <Wrapper className={"files-header app-action"}>
      <div className="action-left mt-2">
        <span className="app-sidebar-menu-button btn btn-outline-light" onClick={openMobileModal}>
          <SvgIconFeather icon="menu" />
        </span>
      </div>
      <div className="action-right">
        <div className="input-group">
          <input type="text" onChange={handleSearchChange} value={inputValue} onKeyDown={handleEnter} className="form-control" placeholder={dictionary.searchWorkspacePlaceholder} aria-describedby="button-addon1" />
          {inputValue.trim() !== "" && (
            <button onClick={handleClearSearch} className="btn-cross" type="button">
              <SvgIconFeather icon="x" />
            </button>
          )}
          <div className="input-group-append">
            <button className="btn btn-outline-light" type="button" id="button-addon1" onClick={handleSearch}>
              <SvgIconFeather icon="search" />
            </button>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default React.memo(AllWorkspaceSearch);
