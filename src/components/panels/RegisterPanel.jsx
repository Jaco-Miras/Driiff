import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { FormInput, PasswordInput } from "../forms";
import { useUserActions } from "../hooks";
import { EmailRegex } from "../../helpers/stringFormatter";

const Wrapper = styled.form``;

const RegisterPanel = (props) => {
  const { dictionary } = props;
  const refs = {
    first_name: useRef(),
  };

  const userActions = useUserActions();

  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);

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

  const _validate = () => {
    let valid = {};
    let message = {};

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

    if (typeof form.email === "undefined" || form.email === "") {
      valid.email = false;
      message.email = dictionary.emailRequired;
    } else if (!EmailRegex.test(form.email)) {
      valid.email = false;
      message.email = dictionary.invalidEmail;
    } else {
      valid.email = true;
    }

    if (typeof form.password === "undefined" || form.password === "") {
      valid.password = false;
      message.password = dictionary.passwordRequired;
    } else {
      valid.password = true;
    }

    setFormResponse({
      valid: valid,
      message: message,
    });

    return !Object.values(valid).some((v) => v === false);
  };

  const handleRegister = useCallback(
    (e) => {
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
    },
    [form]
  );

  useEffect(() => {
    refs.first_name.current.focus();

    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Wrapper>
      <FormInput onChange={handleInputChange} name="first_name" isValid={formResponse.valid.first_name} feedback={formResponse.message.first_name} placeholder={dictionary.firstName} innerRef={refs.first_name} autoFocus />
      <FormInput onChange={handleInputChange} name="middle_name" isValid={formResponse.valid.middle_name} feedback={formResponse.message.middle_name} placeholder={dictionary.middleName} />
      <FormInput onChange={handleInputChange} name="last_name" isValid={formResponse.valid.last_name} feedback={formResponse.message.last_name} placeholder={dictionary.lastName} />
      <FormInput onChange={handleInputChange} name="email" isValid={formResponse.valid.email} feedback={formResponse.message.email} placeholder={dictionary.email} type="email" />
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
