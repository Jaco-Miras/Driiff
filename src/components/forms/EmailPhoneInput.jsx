import React from "react";
import styled from "styled-components";
import PhoneInput from "react-phone-number-input";
import { Input, InputGroup, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
//import { InputFeedback } from "./index";

const Wrapper = styled.div`
  .form-control {
    margin-bottom: 0 !important;
    border-radius: 6px 0 0 6px !important;
  }

  .invalid-feedback {
    text-align: left;
  }
  .dropdown-toggle {
    border-radius: 0 6px 6px 0;
  }
  .PhoneInput {
    flex: 1;
  }
  .PhoneInput input {
    padding: 0.375rem 0.75rem;
    border-radius: 6px 0 0 6px;
  }
`;

const InvalidPhoneLabel = styled.label`
  width: 100%;
  margin-top: 0.25rem;
  font-size: 80%;
  color: #dc3545;
  text-align: left;
`;

const EmailPhoneInput = (props) => {
  const { className = "", type = "text", name, onChange, defaultValue = "", isValid = null, feedback = null, registerMode, setRegisterMode, value, ...otherProps } = props;

  const handleDropdownSelect = (mode) => setRegisterMode(mode);

  const handleNumberChange = (e) => {
    onChange(e);
  };

  const handleEmailChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <Wrapper className={`form-group ${className}`} isValid={isValid}>
      <InputGroup>
        {registerMode === "number" && <PhoneInput international placeholder="Enter phone number" value={value} onChange={handleNumberChange} />}
        {registerMode === "email" && <Input name={name} onChange={handleEmailChange} defaultValue={defaultValue} type={type} valid={isValid} invalid={isValid === null ? isValid : !isValid} {...otherProps} />}
        <UncontrolledButtonDropdown>
          <DropdownToggle caret>{registerMode === "email" ? "Email" : "Phone"}</DropdownToggle>
          <DropdownMenu>
            <DropdownItem onClick={() => handleDropdownSelect("email")}>Email</DropdownItem>
            <DropdownItem onClick={() => handleDropdownSelect("number")}>Phone</DropdownItem>
          </DropdownMenu>
        </UncontrolledButtonDropdown>
        {!isValid && <InvalidPhoneLabel>{feedback}</InvalidPhoneLabel>}
        {/* <InputFeedback valid={isValid}>{feedback}</InputFeedback> */}
      </InputGroup>
    </Wrapper>
  );
};

export default React.memo(EmailPhoneInput);
