import React, { useState } from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { SvgIconFeather, Loader } from "../../common";
import { useSearchActions, useSearch } from "../../hooks";

const Wrapper = styled.div``;

const SearchCard = (props) => {
  const history = useHistory();
  const { searching, value } = useSearch();
  const actions = useSearchActions();
  const [inputValue, setInputValue] = useState("");

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleSearch = () => {
    if (inputValue.trim() !== "") {
      actions.search({
        search: inputValue,
        skip: 0,
        limit: 10,
      });
      actions.saveSearchValue({
        value: inputValue,
      });
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
    if (e.target.value.trim() === "" && value !== "") {
      actions.saveSearchValue({
        value: "",
      });
    }
    setInputValue(e.target.value);
  };

  return (
    <Wrapper className="input-group">
      <input type="text" className="form-control" placeholder={"Search"} aria-describedby="button-addon1" onKeyDown={handleEnter} onChange={handleSearchChange} />
      {searching && (
        <button className="btn-cross" type="button">
          <Loader />
        </button>
      )}
      {!searching && value.trim() !== "" && (
        <button onClick={emptySearch} className="btn-cross" type="button">
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

export default SearchCard;
