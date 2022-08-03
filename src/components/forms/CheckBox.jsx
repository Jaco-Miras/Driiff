import React, { forwardRef } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  cursor: ${(props) => (props.isDisabled ? "not-allowed" : "pointer")};
  label {
    cursor: ${(props) => (props.isDisabled ? "not-allowed" : "pointer")};
  }
  &.custom-checkbox .custom-control-input:checked ~ .custom-control-label::before {
    background-color: ${({ theme }) => theme.colors.primary};
    border-color: ${({ theme }) => theme.colors.primary};
  }
  &.custom-checkbox .custom-control-input:focus ~ .custom-control-label::before {
    box-shadow: 0 0 0 0.2rem ${({ theme }) => theme.colors.secondary};
  }
`;

const CheckBox = forwardRef((props, ref) => {
  const { className = "", type = "", checked = false, name, onClick, children, ...otherProps } = props;

  let classType = "";
  if (type !== "") {
    classType = `custom-checkbox-${type} `;
  }

  return (
    <Wrapper data-name={name} className={`custom-control custom-checkbox ${classType}${className}`} onClick={onClick} isDisabled={props.disabled && props.disabled === true}>
      <input ref={ref} name={name} data-name={name} type="checkbox" className="custom-control-input" checked={checked} readOnly {...otherProps} />
      <label data-name={name} className="custom-control-label">
        {children}
      </label>
    </Wrapper>
  );
});

export default CheckBox;
