import React from "react";
import styled from "styled-components";
import {SvgIconFeather} from "../../common";

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

const TodosHeader = (props) => {
  const {className = "", isMember, onSearch, onEnter, dictionary, disableOptions, onClickEmpty, value} = props;


  return (
    <Wrapper className={`todos-header app-action ${className}`}>
      <div className="action-left">
        <ul className="list-inline">
          {isMember === true && !disableOptions && (
            <li className="list-inline-item mb-0">

            </li>
          )}
        </ul>
        <span className="app-sidebar-menu-button btn btn-outline-light">
          <SvgIconFeather icon="menu"/>
        </span>
      </div>
      <div className="action-right">
        <div className="input-group">
          <input type="text" onKeyDown={onEnter} value={value} className="form-control"
                 placeholder={dictionary.searchInputPlaceholder} aria-describedby="button-addon1"/>
          {value.trim() !== "" && (
            <button onClick={onClickEmpty} className="btn-cross" type="button">
              <SvgIconFeather icon="x"/>
            </button>
          )}
          <div className="input-group-append">
            <button className="btn btn-outline-light" type="button" id="button-addon1" onClick={onSearch}>
              <SvgIconFeather icon="search"/>
            </button>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default React.memo(TodosHeader);
