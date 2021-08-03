import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  position: relative;
  min-height: 1rem;
  input {
    cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  }
  .cci {
    z-index: 1;
    position: absolute;
    width: 16px;
    height: 16px;
    opacity: 0;
  }
  .ccl {
    cursor: pointer;
    display: flex;
    justify-content: flex-start;
    align-items: center;

    span {
      display: inline-block;
      vertical-align: middle;
      transform: translate3d(0, 0, 0);
    }
    span:first-child {
      position: relative;
      width: 16px;
      height: 16px;
      border-radius: 3px;
      transform: scale(1);
      vertical-align: middle;
      border: 1px solid #9098a9;
      transition: all 0.2s ease;

      svg {
        position: absolute;
        // top: 3px;
        // left: 2px;
        fill: none;
        stroke: #ffffff;
        stroke-width: 2;
        stroke-linecap: round;
        stroke-linejoin: round;
        stroke-dasharray: 16px;
        stroke-dashoffset: 16px;
        transition: all 0.3s ease;
        transition-delay: 0.1s;
        transform: translate3d(0, 0, 0);
        width: 8px;
        height: 9px;
        top: 3px;
        left: 3px;
        stroke-width: 3;
      }
    }
  }
  .cci.cci-active + .ccl {
    span:first-child {
      background: #506eec;
      border-color: #506eec;
      animation: wave 0.4s ease;

      svg {
        stroke-dashoffset: 0;
      }
    }
  }
`;

const TodoCheckBox = (props) => {
  const { className = "", type = "", checked = false, name, onClick, children, disabled = false, ...otherProps } = props;
  const [isChecked, setIsChecked] = useState(checked);

  let classType = "";
  if (type !== "") {
    classType = `custom-checkbox-${type} `;
  }

  const refs = {
    checkbox: useRef(null),
  };

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsChecked((prevState) => !prevState);
    setTimeout(() => {
      onClick(e);
    }, 300);
  };

  useEffect(() => {
    if (isChecked !== checked) {
      setIsChecked((prevState) => !prevState);
    }
  }, [checked, isChecked]);

  return (
    <Wrapper data-name={name} className={`custom-control custom-checkbox ${classType}${className}`} onClick={handleClick} disabled={disabled}>
      <input ref={refs.checkbox} name={name} data-name={name} type="checkbox" className={`cci ${isChecked ? "cci-active" : ""}`} checked={isChecked} readOnly {...otherProps} disabled={disabled} />
      <label data-name={name} className="ccl">
        <span>
          <svg width="12px" height="10px" viewBox="0 0 12 10">
            <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
          </svg>
        </span>
        <span>{children}</span>
      </label>
    </Wrapper>
  );
};

export default TodoCheckBox;
