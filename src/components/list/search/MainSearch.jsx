import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { SvgIconFeather } from "../../common";
import { useTranslationActions } from "../../hooks";

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

const MainSearch = (props) => {
  const { actions, clearTab, value } = props;
  const [inputValue, setInputValue] = useState(value);

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleSearch = () => {
    if (inputValue.trim() !== "") {
      clearTab();
      actions.search({
        search: inputValue,
        skip: 0,
        limit: 10,
      });
      actions.saveSearchValue({
        value: inputValue,
      });
    }
  };

  const emptySearch = () => {
    setInputValue("");
    clearTab();
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
    if (e.target.value.trim() === "" && value !== "") {
      clearTab();
      actions.saveSearchValue({
        value: "",
      });
    }
    setInputValue(e.target.value);
  };

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    return () => {
      actions.saveSearchValue({
        value: "",
      });
    };
  }, []);

  const { _t } = useTranslationActions();

  const dictionary = {
    searchGlobalPlaceholder: _t("PLACEHOLDER.SEARCH_GLOBAL", "Search for anything in this Driff"),
    whatDoYouWantToFind: _t("SEARCH.WHAT_DO_YOU_WANT_TO_FIND", "What do you want to find?"),
  };

  return (
    <Wrapper className="card p-t-b-40" data-backround-image="assets/media/image/image1.jpg">
      <div className="container">
        <div className="row d-flex justify-content-center">
          <div>
            <h2 className="mb-4 text-center">{dictionary.whatDoYouWantToFind}</h2>
            <div className="input-group">
              <input onChange={handleSearchChange} onKeyDown={handleEnter} type="text" className="form-control" placeholder={dictionary.searchGlobalPlaceholder} aria-describedby="button-addon1" autoFocus value={inputValue} />
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
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default MainSearch;
