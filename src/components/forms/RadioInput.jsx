import PropTypes from "prop-types";
import React, { forwardRef, useState } from "react";
import styled from "styled-components";

const RadioInputContainer = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  cursor: pointer;
  font-size: 1rem;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  text-align: left;

  input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    width: 100%;
    left: 0px;
    height: 100%;
    z-index: 1;
    top: 6px;
  }

  .checkmark {
    height: 16px;
    width: 16px;
    background-color: #fff;
    border-radius: 50%;
    border: 1px solid #adb5bd;
    position: relative;
    margin-right: 14px;
    transition: all 200ms ease;
  }

  &:hover {
    input ~ .checkmark {
      background-color: #972c86;
      border-color: #972c86;
      box-shadow: 0 0 0 0.2rem rgba(170, 102, 204, 0.3);
    }

    input:checked ~ .checkmark {
      background-color: #972c86;
      border-color: #972c86;
    }

    input ~ .checkmark:after {
      background-color: #fff;
    }
  }

  input:checked ~ .checkmark {
    background-color: #fff;
  }

  .checkmark:after {
    content: "";
    position: absolute;
    display: none;
  }

  input:checked ~ .checkmark:after {
    display: block;
  }

  .checkmark:after {
    left: 3px;
    top: 3px;
    width: 8px;
    height: 8px;
    background-color: #972c86;
    border-radius: 50%;
    transition: all 200ms ease;
  }
`;

const RadioInput = forwardRef((props, ref) => {
  const { className = "", checked = false, onClick, name, value, readOnly = null, children, ...otherProps } = props;

  const [radioElement, setRadioElement] = useState("");

  const handleOnClick = (e) => {
    radioElement.click();

    if (onClick) {
      onClick(radioElement);
    }
  };

  return (
    <RadioInputContainer ref={ref} className={`component-radio-input ${className}`} onClick={(e) => handleOnClick(e)}>
      {readOnly ? <input readOnly checked={checked} name={name} value={value} ref={setRadioElement} type="radio" {...otherProps} /> : <input name={name} value={value} ref={setRadioElement} type="radio" {...otherProps} />}
      <span className={"checkmark"} />
      {children}
    </RadioInputContainer>
  );
});

const { string, func, number, oneOfType } = PropTypes;

RadioInput.propTypes = {
  className: string,
  onClick: func,
  value: oneOfType([number, string]),
};

export default RadioInput;
