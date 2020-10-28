import React, { forwardRef } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  position: relative;
  cursor: pointer;
  
  .cci {
    z-index: 1;
    position: absolute;
    width: 18px;
    height: 18px;
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
      width: 18px;
      height: 18px;
      border-radius: 3px;
      transform: scale(1);
      vertical-align: middle;
      border: 1px solid #9098A9;
      transition: all 0.2s ease;
      
      svg {
          position: absolute;
          top: 3px;
          left: 2px;
          fill: none;
          stroke: #FFFFFF;
          stroke-width: 2;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-dasharray: 16px;
          stroke-dashoffset: 16px;
          transition: all 0.3s ease;
          transition-delay: 0.1s;
          transform: translate3d(0, 0, 0);
      }
    }
  }
  .cci:checked + .ccl {
    span:first-child {
      background: #506EEC;
      border-color: #506EEC;
      animation: wave 0.4s ease;
      
      svg {
        stroke-dashoffset: 0;
      }  
    }
  }  
`;

const CheckBox = forwardRef((props, ref) => {
  const { className = "", type = "", checked = false, name, onClick, children, ...otherProps } = props;

  let classType = "";
  if (type !== "") {
    classType = `custom-checkbox-${type} `;
  }

  return (
    <Wrapper data-name={name} className={`custom-control custom-checkbox ${classType}${className}`} onClick={onClick}>
      <input ref={ref} name={name} data-name={name} type="checkbox" className="cci" checked={checked}
             readOnly {...otherProps} />
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
});

export default React.memo(CheckBox);
