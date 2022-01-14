import React from "react";
import styled from "styled-components";
import PhoneInput from "react-phone-number-input";
import { Input, InputGroup, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Button } from "reactstrap";
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
  button.btn.btn-secondary {
    background-color: ${(props) => props.theme.colors.third}!important;
    background: ${(props) => props.theme.colors.third}!important;
    color: ${(props) => props.theme.colors.primary};
    border-color: transparent !important;
    border-radius: 0 6px 6px 0;
  }
  button.btn.btn-secondary:not(:disabled):not(.disabled):focus {
    box-shadow: none !important;
  }
  .dropdown-menu.show button {
    color: ${(props) => props.theme.colors.primary};
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
  const { className = "", type = "text", name, onChange, defaultValue = "", defaultCountry = null, isValid = null, feedback = null, registerMode, setRegisterMode, value, autoFocus = false, ...otherProps } = props;

  // const handleDropdownSelect = (mode) => setRegisterMode(mode);

  const handleSelectRegisterMode = () => {
    if (registerMode === "email") {
      setRegisterMode("number");
    } else {
      setRegisterMode("email");
    }
  };

  const handleNumberChange = (e) => {
    onChange(e);
  };

  const handleEmailChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <Wrapper className={`form-group ${className}`} isValid={isValid}>
      <InputGroup>
        {registerMode === "number" && <PhoneInput international placeholder="Enter phone number" value={value} onChange={handleNumberChange} defaultCountry={defaultCountry} defaultValue={defaultValue} />}
        {registerMode === "email" && <Input name={name} onChange={handleEmailChange} defaultValue={defaultValue} type={type} valid={isValid} invalid={isValid === null ? isValid : !isValid} autoFocus={autoFocus} {...otherProps} />}
        <Button onClick={handleSelectRegisterMode}>{registerMode === "email" ? "Email" : "Phone"}</Button>
        {/* <UncontrolledButtonDropdown>
          <DropdownToggle caret>{registerMode === "email" ? "Email" : "Phone"}</DropdownToggle>
          <DropdownMenu>
            <DropdownItem onClick={() => handleDropdownSelect("email")}>Email</DropdownItem>
            <DropdownItem onClick={() => handleDropdownSelect("number")}>Phone</DropdownItem>
          </DropdownMenu>
        </UncontrolledButtonDropdown> */}
        {isValid === false && <InvalidPhoneLabel>{feedback}</InvalidPhoneLabel>}
        {/* <InputFeedback valid={isValid}>{feedback}</InputFeedback> */}
      </InputGroup>
    </Wrapper>
  );
};

export default React.memo(EmailPhoneInput);
