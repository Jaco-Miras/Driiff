import React, { useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { useSearchActions, useTranslationActions, useOutsideClick } from "../../hooks";
import { SvgIconFeather } from "../../common";
//import { ChatSearchItem, ChannelSearchItem, CommentSearchItem, FileSearchItem, PeopleSearchItem, PostSearchItem, WorkspaceSearchItem } from "../../list/search";

const Wrapper = styled.div`
  @media (min-width: 400px) {
    min-width: 360px;
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

// const PopUpResultsContainer = styled.div`
//     padding: 5px;
//     overflow: auto;
// `;

const SearchDropdown = (props) => {
  const { hideSearch } = props;
  const dropdownRef = useRef();
  const actions = useSearchActions();
  // const { value } = useSearch();
  const history = useHistory();
  const [inputValue, setInputValue] = useState("");

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleSearch = () => {
    if (inputValue.trim() !== "") {
      dropdownRef.current.classList.remove("show");
      actions.search({
        search: inputValue,
        skip: 0,
        limit: 10,
      });
      actions.saveSearchValue({
        value: inputValue,
      });
      document.querySelector(".overlay").classList.remove("show");
      setInputValue("");
      history.push("/search");
    }
  };

  const emptySearch = () => {
    setInputValue("");
    actions.search({
      search: "",
      skip: 0,
      limit: 10,
    });
    actions.saveSearchValue({
      value: "",
    });
  };

  const handleSearchChange = (e) => {
    if (e.target.value.trim() === "") {
      actions.saveSearchValue({
        value: "",
      });
    }
    setInputValue(e.target.value);
  };

  const { _t } = useTranslationActions();

  const dictionary = {
    searchGlobalPopupPlaceholder: _t("PLACEHOLDER.SEARCH_GLOBAL_POPUP", "Search for anything in this Driff"),
  };

  useOutsideClick(dropdownRef, hideSearch, true);

  return (
    <Wrapper className="dropdown-menu p-2 dropdown-menu-right show" ref={dropdownRef}>
      <div className="input-group">
        <input
          onChange={handleSearchChange}
          onKeyDown={handleEnter}
          value={inputValue}
          type="text"
          className="form-control dropdown-search-input"
          placeholder={dictionary.searchGlobalPopupPlaceholder}
          aria-describedby="button-addon1"
          autoFocus
        />
        {inputValue.trim() !== "" && (
          <button onClick={emptySearch} className="btn-cross" type="button">
            <SvgIconFeather icon="x" />
          </button>
        )}
        <div className="input-group-append">
          <button className="btn btn-outline-light" type="button" onClick={handleSearch}>
            <SvgIconFeather icon="search" />
          </button>
        </div>
      </div>
      {/* <PopUpResultsContainer>
                <ul className="list-group list-group-flush">
                    {
                        Object.values(results).map((r) => {
                            switch (r.type) {
                                case "CHAT":
                                    return <ChatSearchItem key={r.id} data={r.data}/>
                                case "CHANNEL":
                                    return <ChannelSearchItem key={r.id} data={r.data}/>
                                case "COMMENT":
                                    return <CommentSearchItem key={r.id} comment={r}/>
                                case "DOCUMENT":
                                    return <FileSearchItem key={r.id} file={r}/>
                                case "PEOPLE":
                                    return <PeopleSearchItem key={r.id} user={r.data}/>
                                case "POST":
                                    return <PostSearchItem key={r.id} post={r}/>
                                case "WORKSPACE":
                                    return <WorkspaceSearchItem key={r.id} data={r.data}/>
                                default:
                                    return null;
                            }
                        })
                    }
                </ul>
            </PopUpResultsContainer> */}
    </Wrapper>
  );
};

export default SearchDropdown;
