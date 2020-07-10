import React, { useCallback, useRef, useState } from "react";
import styled from "styled-components";
import { useOutsideClick } from "../hooks";

const Wrapper = styled.div`
  position: relative;

  .dropdown-toggle {
    color: #212529 !important;
    &:after {
      margin-left: 10px;
    }

    &.show {
      background: #afb8bd;
      border-color: #afb8bd;
      box-shadow: 0 0 0 0.2rem rgba(175, 184, 189, 0.4);
    }
    &:focus {
      box-shadow: 0 0 0 0.2rem rgba(175, 184, 189, 0.4);
    }
  }
  .dropdown-item {
    cursor: pointer;
    cursor: hand;
  }
`;

const ButtonDropdown = (props) => {
  const { className = "", value = null, dropdown } = props;

  const wrapperRef = useRef();

  const [show, setShow] = useState(false);

  const toggle = useCallback(() => {
    setShow(!show);
  }, [show]);

  useOutsideClick(wrapperRef, toggle, show);

  return (
    <Wrapper className={`button-dropdown ${className}`} ref={wrapperRef}>
      <span className={`btn btn-outline-light dropdown-toggle d-flex justify-content-between ${show ? "show" : ""} ${value !== null ? "active" : ""}`} data-toggle="dropdown" onClick={toggle}>
        {dropdown.label}
      </span>
      <div className={`dropdown-menu ${show ? "show" : ""}`}>
        {dropdown.items.map((item) => {
          return (
            <span
              className={`dropdown-item d-flex justify-content-between ${value === item.value ? "active" : ""}`}
              key={item.value}
              data-value={item.value}
              onClick={(e) => {
                item.onClick(e);
                toggle();
              }}
            >
              {item.label}
            </span>
          );
        })}
      </div>
    </Wrapper>
  );
};

export default React.memo(ButtonDropdown);
