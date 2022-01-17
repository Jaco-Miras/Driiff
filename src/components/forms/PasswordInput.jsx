import React, { forwardRef, useState } from "react";
import styled from "styled-components";
import { Input, InputGroup, InputGroupAddon, InputGroupText } from "reactstrap";
import { SvgIconFeather } from "../common";
import { InputFeedback } from "./index";

const Wrapper = styled.div`
  .form-control {
    margin-bottom: 0 !important;
  }

  .input-group-text {
    height: 36px;
    border-width: 1px;
    border-style: solid;
    border-color: ${(props) => (props.isValid === null ? "#e9ecef" : props.isValid ? "#28a745" : "#dc3545")};
    border-left: none;
    border-radius: 0 6px 6px 0 !important;
    background-color: ${(props) => props.theme.colors.third};
  }

  .invalid-feedback {
    text-align: left;
  }
`;

const PasswordInput = forwardRef((props, ref) => {
  const { className = "", name = "password", placeholder = "Password", onChange, defaultValue = "", isValid = null, feedback = null, ...otherProps } = props;

  const [passwordVisibility, setPasswordVisibility] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisibility((prevState) => !prevState);
  };

  return (
    <Wrapper className={`form-group ${className}`} isValid={isValid}>
      <InputGroup>
        <Input
          innerRef={ref}
          name={name}
          onChange={onChange}
          placeholder={placeholder}
          defaultValue={defaultValue}
          type={passwordVisibility ? "text" : "password"}
          valid={isValid}
          invalid={isValid === null ? isValid : !isValid}
          {...otherProps}
          required
        />
        <InputGroupAddon className="btn-toggle" addonType="append">
          <InputGroupText className="btn" onClick={togglePasswordVisibility}>
            <SvgIconFeather icon={passwordVisibility ? "eye-off" : "eye"} />
          </InputGroupText>
        </InputGroupAddon>
        <InputFeedback valid={isValid}>{feedback}</InputFeedback>
      </InputGroup>
    </Wrapper>
  );
});

export default React.memo(PasswordInput);
