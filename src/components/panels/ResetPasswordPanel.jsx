import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { isValidPhoneNumber } from "react-phone-number-input";
import { EmailRegex } from "../../helpers/stringFormatter";
import { useUserActions } from "../hooks";
import { EmailPhoneInput } from "../forms";

const Wrapper = styled.form``;

const ResetPasswordPanel = (props) => {
  const { dictionary, countryCode } = props;

  const userActions = useUserActions();
  const [loading, setLoading] = useState(false);

  const refs = {
    email: useRef(null),
  };

  const [form, setForm] = useState({
    email: "",
  });

  const [formResponse, setFormResponse] = useState({
    valid: {},
    message: {},
  });

  const [registerMode, setRegisterMode] = useState("email");

  const _validateForm = (e) => {
    let valid = {};
    let message = {};
    const lettersRegExp = /[a-zA-Z]/g;

    if (form.email === "") {
      valid.email = false;
      message.email = dictionary.emailRequired;
    } else if (form.email.charAt(0) === "+" && !lettersRegExp.test(form.email)) {
      if (!isValidPhoneNumber(form.email)) {
        valid.email = false;
        message.email = dictionary.invalidPhoneNumber;
      } else {
        valid.email = true;
      }
    } else if (!EmailRegex.test(form.email)) {
      valid.email = false;
      message.email = dictionary.invalidEmail;
    } else {
      valid.email = true;
    }

    setFormResponse({
      valid: valid,
      message: message,
    });

    return !Object.values(valid).some((v) => v === false);
  };

  const handleInputChange = useCallback(
    (e) => {
      e.persist();
      setForm((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.value.trim(),
      }));
    },
    [setForm]
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!_validateForm(e) || loading) {
      return false;
    }

    setLoading(true);

    userActions.requestPasswordReset(form.email, (err, res) => {
      if (err) {
        setFormResponse({
          valid: { email: false },
          message: { email: dictionary.emailNotFound },
        });
      }
      setLoading(false);
    });
  };

  const handleEmailNumberChange = (value) => {
    setForm((prevState) => ({
      ...prevState,
      email: value,
    }));

    setFormResponse((prevState) => ({
      ...prevState,
      valid: {
        ...prevState.valid,
        email: undefined,
      },
      message: {
        ...prevState.message,
        email: undefined,
      },
    }));
  };

  useEffect(() => {
    handleEmailNumberChange(registerMode === "email" ? "" : undefined);
  }, [registerMode]);

  useEffect(() => {
    refs.email.current.focus();
  }, []);

  return (
    <Wrapper>
      <EmailPhoneInput
        onChange={handleEmailNumberChange}
        name="email_phone"
        isValid={formResponse.valid.email}
        feedback={formResponse.message.email}
        placeholder={dictionary.emailOnly}
        registerMode={registerMode}
        setRegisterMode={setRegisterMode}
        value={form.email}
        defaultCountry={countryCode}
        autoFocus={true}
        innerRef={refs.email}
      />
      {/* <div className="form-group">
        <FormInput innerRef={refs.email} isValid={formResponse.valid.email} feedback={formResponse.message.email} onChange={handleInputChange} name="email" type="email" placeholder={dictionary.email} required autoFocus />
      </div> */}
      <button className="btn btn-primary btn-block" onClick={handleSubmit}>
        {loading && <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true" />} {dictionary.submit}
      </button>
      <hr />
      <p className="text-muted">{dictionary.takeADifferentAction}</p>
      <Link className={"btn btn-sm btn-outline-light mr-1-1"} to="/register">
        {dictionary.registerNow}
      </Link>{" "}
      {dictionary.or}{" "}
      <Link className={"btn btn-sm btn-outline-light ml-1"} to="/login">
        {dictionary.login}
      </Link>
    </Wrapper>
  );
};

export default React.memo(ResetPasswordPanel);
