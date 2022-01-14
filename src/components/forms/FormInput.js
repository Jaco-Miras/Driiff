import React from "react";
import styled from "styled-components";
import { Input, InputGroup } from "reactstrap";
import { InputFeedback } from "./index";

const Wrapper = styled.div`
  .form-control {
    margin-bottom: 0 !important;
    border-radius: 6px !important;
  }

  .invalid-feedback {
    text-align: left;
  }
`;

const FormInput = (props) => {
  const { className = "", type = "text", name, onChange, defaultValue = "", isValid = null, feedback = null, ...otherProps } = props;

  return (
    <Wrapper className={`form-group ${className}`} isValid={isValid}>
      <InputGroup>
        <Input name={name} onChange={onChange} defaultValue={defaultValue} type={type} valid={isValid} invalid={isValid === null ? isValid : !isValid} {...otherProps} />
        <InputFeedback valid={isValid}>{feedback}</InputFeedback>
      </InputGroup>
    </Wrapper>
  );
};

export default React.memo(FormInput);
