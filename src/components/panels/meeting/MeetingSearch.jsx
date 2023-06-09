import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { SvgIconFeather } from "../../common";
import { setMeetingSearch } from "../../../redux/actions/globalActions";
import { useTranslationActions } from "../../hooks";

const Wrapper = styled.div`
  overflow: inherit !important;
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

const MeetingSearch = (props) => {
  const { className = "" } = props;
  const dispatch = useDispatch();
  const [searchInput, setSearchInput] = useState("");
  const { _t } = useTranslationActions();
  const dictionary = {
    searchMeetingPlaceholder: _t("SEARCH_MEETING_PLACEHOLDER", "Seach meetings"),
  };

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  const clearSearch = () => {
    setSearchInput("");
    dispatch(setMeetingSearch(""));
  };

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      if (searchInput === "") return;
      dispatch(setMeetingSearch(searchInput));
    }, 1000);
    return () => {
      clearTimeout(timeOutId);
      dispatch(setMeetingSearch(""));
    };
  }, [searchInput]);

  const openMobileModal = () => {
    document.body.classList.toggle("mobile-modal-open");
  };

  return (
    <Wrapper className={`todos-header app-action ${className}`}>
      <div className="action-left">
        <span className="app-sidebar-menu-button btn btn-outline-light" onClick={openMobileModal}>
          <SvgIconFeather icon="menu" />
        </span>
      </div>
      <div className="action-right">
        <div className="input-group">
          <input type="text" onChange={handleSearchChange} value={searchInput} className="form-control" placeholder={dictionary.searchMeetingPlaceholder} aria-describedby="button-addon1" />
          {searchInput.trim() !== "" && (
            <button onClick={clearSearch} className="btn-cross" type="button">
              <SvgIconFeather icon="x" />
            </button>
          )}
          <div className="input-group-append">
            <button className="btn btn-outline-light" type="button" id="button-addon1">
              <SvgIconFeather icon="search" />
            </button>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default React.memo(MeetingSearch);
