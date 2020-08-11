import React, {useEffect, useRef, useState} from "react";
import styled from "styled-components";
import {useToaster, useUserActions} from "../hooks";
import {useHistory} from "react-router-dom";
import {FormInput, PasswordInput} from "../forms";
import {EmailRegex} from "../../helpers/stringFormatter";
import {$_GET} from "../../helpers/commonFunctions";

const Wrapper = styled.form`
`;

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

  const {dictionary} = props;
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
    last_name: "",
    email: "",
    password: "",
  });

  const [formResponse, setFormResponse] = useState({
    valid: {},
    message: {},
  });

  const handleInputChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const _validateForm = () => {
    let valid = true;
    let errorData = {email: "", password: "", form: ""};

    if (form.email === "") {
      valid = false;
      errorData = {...errorData, email: dictionary.emailRequired};
    } else if (!EmailRegex.test(form.email)) {
      valid = false;
      errorData = {...errorData, email: dictionary.invalidEmail};
    }

    if (form.first_name === "") {
      valid = false;
      errorData = {...errorData, first_name: dictionary.firstNameRequired};
    }

    if (form.last_name === "") {
      valid = false;
      errorData = {...errorData, last_name: dictionary.lasttNameRequired};
    }

    if (form.password === "") {
      valid = false;
      errorData = {...errorData, password: dictionary.passwordRequired};
    }

    setFormResponse({
      valid: {
        first_name: errorData.first_name === "",
        last_name: errorData.last_name === "",
        email: errorData.email === "",
        password: errorData.password === "",
      },
      message: {
        first_name: errorData.first_name,
        last_name: errorData.last_name,
        email: errorData.email,
        password: errorData.password
      },
    });

    return valid;
  }

  const resetFormResponse = () => {
    setFormResponse({
      valid: {},
      message: {}
    });
  }

  const handleAccept = (e) => {
    e.preventDefault();
    resetFormResponse();

    if (!_validateForm() || loading) {
      return;
    }

    setLoading(true);
    userAction.updateExternalUser(form, (err, res) => {
      setLoading(false);
      if (res) {
        toaster.success(`Login successful!`);
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
        history.push(`/login`);
      }

      if (res) {
        if (res.data.auth_login) {
          toaster.success(`Activation successful!`);

          const returnUrl =
            typeof props.location.state !== "undefined" && typeof props.location.state.from !== "undefined" && props.location.state.from !== "/logout"
              ? props.location.state.from.pathname + props.location.state.from.search
              : "/workspace/chat";
          userAction.storeLoginToken(res.data.auth_login);
          userAction.processBackendLogin(res.data.auth_login, returnUrl);
        } else {
          setForm(prevState => ({
            ...prevState,
            user_id: res.data.user.id,
            topic_id: res.data.topic.id,
            email: res.data.user.email
          }))

          refs.first_name.current.focus();
        }
      }
    })

    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Wrapper>
      <FormGroup className="form-group">
        <FormInput
          innerRef={refs.first_name} onChange={handleInputChange} name="first_name" placeholder={dictionary.firstName}
          isValid={formResponse.valid.first_name} feedback={formResponse.message.first_name}
          required autoFocus
        />
      </FormGroup>
      <FormGroup className="form-group">
        <FormInput
          onChange={handleInputChange} name="middle_name" type="text"
          placeholder={dictionary.middleName}
          isValid={formResponse.valid.middleName} feedback={formResponse.message.middleName}
        />
      </FormGroup>
      <FormGroup className="form-group">
        <FormInput
          onChange={handleInputChange} name="last_name" type="text"
          placeholder={dictionary.lastName}
          isValid={formResponse.valid.lastName} feedback={formResponse.message.lastName}
        />
      </FormGroup>
      <FormGroup className="form-group text-left">
        <FormInput
          onChange={handleInputChange} name="last_name" type="text"
          value={form.email}
          isValid={formResponse.valid.email} feedback={formResponse.message.email}
          readOnly
        />
      </FormGroup>
      <FormGroup className="form-group">
        <PasswordInput
          innerRef={refs.password}
          name="password"
          onChange={handleInputChange}
          placeholder={dictionary.password}
          isValid={formResponse.valid.password}
          feedback={formResponse.message.password}
          required
        />
      </FormGroup>
      <button className="btn btn-primary btn-block mt-2" onClick={handleAccept}>
        {loading && <i className="fa fa-spin fa-spinner mr-2"/>} {dictionary.accept}
      </button>
    </Wrapper>
  );
};

export default React.memo(ExternalRegisterPanel);
