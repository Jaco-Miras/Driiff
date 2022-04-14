import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { SvgIconFeather, Loader } from "../../common";
import axios from "axios";

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
  .loading {
    width: 1rem;
    height: 1rem;
  }
`;

const AllWorkspaceSearch = (props) => {
  const { actions, dictionary, search } = props;

  const { value, searching, filterBy, query } = search;
  const [inputValue, setInputValue] = useState("");
  const cancelToken = useRef(null);

  const handleEnter = (e) => {
    if (e.key === "Enter" && !searching) {
      handleSearch(inputValue);
    }
  };

  const handleSearch = (input) => {
    if (input.trim() !== query.value.trim()) {
      //Check if there are any previous pending requests
      if (cancelToken.current) {
        cancelToken.current.cancel("Operation canceled due to new request.");
        cancelToken.current = null;
      }

      //Save the cancel token for the current request
      cancelToken.current = axios.CancelToken.source();
      const payload = {
        value: input,
        filterBy: filterBy,
        searching: true,
      };
      actions.updateSearch(payload);
      actions.search(
        {
          search: payload.value,
          skip: 0,
          limit: 25,
          filter_by: payload.filterBy,
          cancelToken: cancelToken.current.token,
        },
        (err, res) => {
          if (err) {
            actions.updateSearch({
              searching: false,
            });
          }
          actions.updateSearch({
            searching: false,
            query: {
              ...query,
              value: payload.value,
              hasMore: res.data.has_more,
              skip: query.skip + res.data.workspaces.length,
            },
          });
        }
      );
    }
  };

  const handleClearSearch = () => {
    actions.updateSearch({
      value: "",
      query: {
        hasMore: false,
        limit: 25,
        skip: 0,
        filterBy: filterBy,
        value: "",
      },
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
    let timeoutValue = setTimeout(() => {
      handleSearch(inputValue);
      // actions.updateSearch({
      //   value: inputValue,
      // });
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
          {searching && (
            <button className="btn-cross" type="button">
              <Loader />
            </button>
          )}
          {!searching && inputValue.trim() !== "" && (
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
