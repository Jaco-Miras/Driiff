import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useToaster, useUserActions } from "../hooks";
import { useHistory } from "react-router-dom";
import { FormInput, PasswordInput } from "../forms";
import { EmailRegex } from "../../helpers/stringFormatter";
import { $_GET } from "../../helpers/commonFunctions";

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

const ExternalRegisterPanel = (props) => {
  const { dictionary } = props;
  const history = useHistory();
  const userAction = useUserActions();
  const toaster = useToaster();
  const [loading, setLoading] = useState(false);

  const refs = {
    first_name: useRef(),
  };

  const [form, setForm] = useState({
    user_id: 0,
    topic_id: 0,
    first_name: "",
    middle_name: "",
    last_name: "",
    email: "",
    password: "",
    company_name: "",
    responsible_user_id: null,
  });

  const [formResponse, setFormResponse] = useState({
    valid: {},
    message: {},
  });

  const handleInputChange = useCallback((e) => {
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
  }, []);

  const _validateForm = () => {
    let valid = {};
    let message = {};

    if (form.email === "") {
      valid.email = false;
      message.email = dictionary.emailRequired;
    } else if (!EmailRegex.test(form.email)) {
      valid.email = false;
      message.email = dictionary.invalidEmail;
    } else {
      valid.email = true;
    }

    if (form.first_name === "") {
      valid.first_name = false;
      message.first_name = dictionary.firstNameRequired;
    } else {
      valid.first_name = true;
    }

    if (form.middle_name !== "") {
      valid.middle_name = true;
    }

    if (form.last_name === "") {
      valid.last_name = false;
      message.last_name = dictionary.lastNameRequired;
    } else {
      valid.last_name = true;
    }

    if (form.password === "") {
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

  const handleAccept = (e) => {
    e.preventDefault();

    if (!_validateForm() || loading) {
      return;
    }

    setLoading(true);
    userAction.updateExternalUser(form, (err, res) => {
      setLoading(false);
      if (res) {
        toaster.success("Login successful!");
        localStorage.setItem("fromRegister", true);
        const returnUrl =
          typeof props.location.state !== "undefined" && typeof props.location.state.from !== "undefined" && props.location.state.from !== "/logout"
            ? props.location.state.from.pathname + props.location.state.from.search
            : "/workspace/chat";
        userAction.login(res.data.auth_login, returnUrl);
      }
    });
  };

  useEffect(() => {
    userAction.fetchStateCode($_GET("state_code"), (err, res) => {
      if (err) {
        history.push("/login");
      }

      if (res) {
        if (res.data.auth_login) {
          toaster.success("Activation successful!");

          const returnUrl =
            typeof props.location.state !== "undefined" && typeof props.location.state.from !== "undefined" && props.location.state.from !== "/logout"
              ? props.location.state.from.pathname + props.location.state.from.search
              : "/workspace/chat";
          userAction.storeLoginToken(res.data.auth_login);
          userAction.processBackendLogin(res.data.auth_login, returnUrl);
        } else {
          setForm((prevState) => ({
            ...prevState,
            user_id: res.data.user.id,
            topic_id: res.data.topic.id,
            email: res.data.user.email,
            responsible_user_id: res.data.responsible_user_id,
            last_name: res.data.user.last_name,
            first_name: res.data.user.first_name,
            middle_name: res.data.user.middle_name,
            company_name: res.data.user.company ? res.data.user.company : "",
          }));

          refs.first_name.current.focus();
        }
      }
    });

    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Wrapper>
      <FormGroup className="form-group">
        <FormInput
          innerRef={refs.first_name}
          value={form.first_name}
          onChange={handleInputChange}
          name="first_name"
          placeholder={dictionary.firstName}
          isValid={formResponse.valid.first_name}
          feedback={formResponse.message.first_name}
          required
          autoFocus
        />
      </FormGroup>
      <FormGroup className="form-group">
        <FormInput onChange={handleInputChange} value={form.middle_name} name="middle_name" type="text" placeholder={dictionary.middleName} isValid={formResponse.valid.middle_name} feedback={formResponse.message.middle_name} />
      </FormGroup>
      <FormGroup className="form-group">
        <FormInput onChange={handleInputChange} value={form.last_name} name="last_name" type="text" placeholder={dictionary.lastName} isValid={formResponse.valid.last_name} feedback={formResponse.message.last_name} />
      </FormGroup>
      <FormGroup className="form-group">
        <FormInput onChange={handleInputChange} value={form.company_name} name="company_name" placeholder={dictionary.companyName} />
      </FormGroup>
      <FormGroup className="form-group text-left">
        <FormInput onChange={handleInputChange} name="email" type="text" value={form.email} isValid={formResponse.valid.email} feedback={formResponse.message.email} readOnly />
      </FormGroup>
      <FormGroup className="form-group">
        <PasswordInput innerRef={refs.password} name="password" onChange={handleInputChange} placeholder={dictionary.password} isValid={formResponse.valid.password} feedback={formResponse.message.password} required />
      </FormGroup>
      <button className="btn btn-primary btn-block mt-2" onClick={handleAccept}>
        {loading && <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true" />} {dictionary.accept}
      </button>
    </Wrapper>
  );
};

export default React.memo(ExternalRegisterPanel);
