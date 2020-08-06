import React, {useCallback, useEffect, useRef, useState} from "react";
import {Link} from "react-router-dom";
import styled from "styled-components";
import {FormInput, PasswordInput} from "../forms";
import {useUserActions} from "../hooks";
import {EmailRegex} from "../../helpers/stringFormatter";

const Wrapper = styled.form``;

const FormGroup = styled.div`
    .form-control {
        margin-bottom: 0 !important;
    }
    .invalid-feedback {
        text-align: left;
    }
    .input-group-text {
      height: 36px;
    }
`;

const RegisterPanel = (props) => {

  const { dictionary } = props;
  const refs = {
    firstname: useRef(),
  };

  const userActions = useUserActions();

  const [form, setForm] = useState({});

  const [formResponse, setFormResponse] = useState({
    valid: {},
    message: {},
  });

  const handleInputChange = useCallback((e) => {
    e.persist();
    setForm(prevState => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  }, [setForm]);

  const _validate = () => {
    let valid = {};
    let message = {};

    if (typeof form.firstname === "undefined" || form.firstname === "") {
      valid.firstname = false;
      message.firstname = dictionary.firstNameRequired;
    } else {
      valid.firstname = true;
    }

    if (typeof form.lastname === "undefined" || form.lastname === "") {
      valid.lastname = false;
      message.lastname = dictionary.lastNameRequired;
    } else {
      valid.lastname = true;
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
      message: message
    });

    return !Object.values(valid).some(v => v === false);
  }

  const handleRegister = useCallback((e) => {
    e.preventDefault();

    if (_validate()) {
      userActions.register(form);
    }
  }, [form]);

  useEffect(() => {
    refs.firstname.current.focus();

    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Wrapper>
      <FormInput onChange={handleInputChange} name="firstname" isValid={formResponse.valid.firstname}
                 feedback={formResponse.message.lastname} placeholder={dictionary.firstName} innerRef={refs.firstname} autoFocus/>
      <FormInput onChange={handleInputChange} name="middlename" isValid={formResponse.valid.middlename}
                 feedback={formResponse.message.middlename} placeholder={dictionary.middleName}/>
      <FormInput onChange={handleInputChange} name="lastname" isValid={formResponse.valid.lastname}
                 feedback={formResponse.message.lastname} placeholder={dictionary.lastName}/>
      <FormInput onChange={handleInputChange} name="email" isValid={formResponse.valid.email}
                 feedback={formResponse.message.email} placeholder="Email" type="email"/>
      <PasswordInput onChange={handleInputChange} isValid={formResponse.valid.password}
                     feedback={formResponse.message.password}/>
      <button className="btn btn-primary btn-block" onClick={handleRegister}>
        {dictionary.register}
      </button>
      <hr/>
      <p className="text-muted">{dictionary.haveAccount}</p>
      <Link className={"btn btn-outline-light btn-sm"} to="/login">
        {dictionary.signIn}
      </Link>
    </Wrapper>
  );
};

export default React.memo(RegisterPanel);
