import React, { useRef, useState } from "react";
import styled from "styled-components";
import { useOutsideClick } from "../hooks";

const Wrapper = styled.div`
  position: relative;

  .dropdown-toggle {
    color: #212529 !important;

    .dark & {
      color: #c7c7c7 !important;
    }

    &:after {
      margin-left: 10px;
    }

    &.show {
      //background: ${({ theme }) => theme.colors.primary}!important;
      border-color: ${({ theme }) => theme.colors.primary}!important;
      box-shadow: 0 0 0 0.2rem rgba(175, 184, 189, 0.4);
    }
    &:focus {
      box-shadow: 0 0 0 0.2rem rgba(175, 184, 189, 0.4);
    }
  }
  .dropdown-item {
    cursor: pointer;
    :hover {
      color: ${({ theme }) => theme.colors.primary};
    }
  }
`;

const ButtonDropdown = (props) => {
  const { className = "", value = null, dropdown } = props;

  const wrapperRef = useRef();

  const [show, setShow] = useState(false);

  const toggle = () => {
    setShow(!show);
  };

  useOutsideClick(wrapperRef, toggle, show);

  const dropDownItem = dropdown.items.find((i) => i.value === value);

  return (
    <Wrapper className={`button-dropdown ${className}`} ref={wrapperRef}>
      <span className={`btn btn-outline-light dropdown-toggle d-flex justify-content-between ${show ? "show" : ""} ${value !== null ? "active" : ""}`} data-toggle="dropdown" onClick={toggle}>
        {dropdown.label} {dropDownItem ? dropDownItem.label : ""}
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
