import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { isValidPhoneNumber } from "react-phone-number-input";
import { FormInput, PasswordInput, EmailPhoneInput } from "../forms";
import { useUserActions } from "../hooks";
import { EmailRegex } from "../../helpers/stringFormatter";
import { useSelector } from "react-redux";

const Wrapper = styled.form``;

const RegisterPanel = (props) => {
  const { dictionary, countryCode } = props;
  console.log(countryCode);
  const refs = {
    first_name: useRef(),
  };

  const userActions = useUserActions();

  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [registerMode, setRegisterMode] = useState("email");
  const allowedDomains = useSelector((state) => state.settings.driff.domains);

  const [formResponse, setFormResponse] = useState({
    valid: {},
    message: {},
  });

  const handleInputChange = useCallback(
    (e) => {
      e.persist();
      setForm((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.value,
      }));

      setFormResponse((prevState) => ({
        ...prevState,
        valid: {
          ...prevState.valid,
          [e.target.name]: undefined,
        },
        message: {
          ...prevState.message,
          [e.target.name]: undefined,
        },
      }));
    },
    [setForm]
  );

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

  const _validate = () => {
    let valid = {};
    let message = {};
    const lettersRegExp = /[a-zA-Z]/g;

    if (typeof form.first_name === "undefined" || form.first_name === "") {
      valid.first_name = false;
      message.first_name = dictionary.firstNameRequired;
    } else {
      valid.first_name = true;
    }

    if (typeof form.last_name === "undefined" || form.last_name === "") {
      valid.last_name = false;
      message.last_name = dictionary.lastNameRequired;
    } else {
      valid.last_name = true;
    }

    if (form.email === "") {
      valid.email = false;
      message.email = dictionary.emailRequired;
    } else if (form.email === undefined) {
      valid.email = false;
      message.email = dictionary.phoneNumberRequired;
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
      const email = form.email;
      const domain = email.split("@");
      if (allowedDomains.length > 0 && !allowedDomains.includes(domain[1])) {
        valid.email = false;
        message.email = dictionary.invalidDomain;
      } else {
        valid.email = true;
      }
    }

    // if (typeof form.email === "undefined" || form.email === "") {
    //   valid.email = false;
    //   message.email = dictionary.emailRequired;
    // } else if (!EmailRegex.test(form.email)) {
    //   valid.email = false;
    //   message.email = dictionary.invalidEmail;
    // } else {
    //   const email = form.email;
    //   const domain = email.split("@");
    //   if (allowedDomains.length > 0 && !allowedDomains.includes(domain[1])) {
    //     valid.email = false;
    //     message.email = dictionary.invalidDomain;
    //   } else {
    //     valid.email = true;
    //   }
    // }

    if (typeof form.password === "undefined" || form.password === "") {
      valid.password = false;
      message.password = dictionary.passwordRequired;
    } else if (typeof form.password !== "undefined" && form.password !== "") {
      const specialChar = /[ -/:-@[-`{-~]/;
      const hasNum = /\d/;
      if (specialChar.test(form.password) && hasNum.test(form.password) && form.password.length >= 6) {
        valid.password = true;
      } else {
        message.password = dictionary.invalidPassword;
        valid.password = false;
      }
    } else {
      valid.password = true;
    }

    setFormResponse({
      valid: valid,
      message: message,
    });

    return !Object.values(valid).some((v) => v === false);
  };

  const handleRegister = (e) => {
    e.preventDefault();

    if (_validate() && !loading) {
      setLoading(true);
      userActions.register(form, (err, res) => {
        setLoading(false);

        if (err.field) {
          let valid = {};
          let message = {};
          Object.keys(err.field).forEach((key) => {
            valid[key] = false;
            message[key] = err.field[key];
          });
          setFormResponse({
            valid: valid,
            message: message,
          });
        }
      });
    }
  };

  useEffect(() => {
    refs.first_name.current.focus();

    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    handleEmailNumberChange(registerMode === "email" ? "" : undefined);
  }, [registerMode]);

  return (
    <Wrapper>
      <FormInput onChange={handleInputChange} name="first_name" isValid={formResponse.valid.first_name} feedback={formResponse.message.first_name} placeholder={dictionary.firstName} innerRef={refs.first_name} autoFocus />
      <FormInput onChange={handleInputChange} name="middle_name" isValid={formResponse.valid.middle_name} feedback={formResponse.message.middle_name} placeholder={dictionary.middleName} />
      <FormInput onChange={handleInputChange} name="last_name" isValid={formResponse.valid.last_name} feedback={formResponse.message.last_name} placeholder={dictionary.lastName} />
      {/* <FormInput onChange={handleInputChange} name="email" isValid={formResponse.valid.email} feedback={formResponse.message.email} placeholder={dictionary.email} /> */}
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
      />
      <PasswordInput onChange={handleInputChange} isValid={formResponse.valid.password} feedback={formResponse.message.password} placeholder={dictionary.password} />
      <button className="btn btn-primary btn-block" onClick={handleRegister}>
        {loading && <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true" />} {dictionary.register}
      </button>
      <hr />
      <p className="text-muted">{dictionary.haveAccount}</p>
      <Link className={"btn btn-outline-light btn-sm"} to="/login">
        {dictionary.signIn}
      </Link>
    </Wrapper>
  );
};

export default React.memo(RegisterPanel);
