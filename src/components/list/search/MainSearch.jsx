import React, { useState } from "react";
//import styled from "styled-components";
import { SvgIconFeather } from "../../common";

const MainSearch = (props) => {

  const { actions, value } = props;
  const [inputValue, setInputValue] = useState(value);

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
        limit: 100,
      });
      actions.saveSearchValue({
        value: inputValue
      });
    }
  };

  const handleSearchChange = (e) => {
    if (e.target.value.trim() === "" && value !== "") {
      actions.saveSearchValue({
        value: ""
      });
    }
    setInputValue(e.target.value)
  };

  return (
    <div className="card p-t-b-40" data-backround-image="assets/media/image/image1.jpg">
      <div className="container">
        <div className="row d-flex justify-content-center">
          <div className="col-md-6">
            <h2 className="mb-4 text-center">What do you want to find?</h2>
            <div className="input-group">
              <input onChange={handleSearchChange} onKeyDown={handleEnter} type="text" className="form-control" placeholder="Search..." aria-describedby="button-addon1" autoFocus />
              <div className="input-group-append">
                <button className="btn btn-outline-light" type="button" onClick={handleSearch}>
                  <SvgIconFeather icon="search" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainSearch;
