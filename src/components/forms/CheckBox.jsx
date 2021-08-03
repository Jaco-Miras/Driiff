import React, { forwardRef } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  cursor: pointer;

  label {
    cursor: pointer;
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
      <input ref={ref} name={name} data-name={name} type="checkbox" className="custom-control-input" checked={checked} readOnly {...otherProps} />
      <label data-name={name} className="custom-control-label">
        {children}
      </label>
    </Wrapper>
  );
});

export default CheckBox;
