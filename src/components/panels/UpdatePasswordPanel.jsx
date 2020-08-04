import React, {useRef, useState} from "react";
import {useDispatch} from "react-redux";
import {Link, useHistory, useRouteMatch} from "react-router-dom";
import styled from "styled-components";
import {usePageLoader, useToaster, useUserActions} from "../hooks";
import {FormInput, PasswordInput} from "../forms";

const Wrapper = styled.form``;

const UpdatePasswordPanel = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const match = useRouteMatch("/resetpassword/:token/:email");
  const userActions = useUserActions();
  const toaster = useToaster();
  const pageLoader = usePageLoader();

  const ref = {
    password: useRef(),
  };

  const [form, setForm] = useState({
    token: match.params.token,
    email: match.params.email,
    password: "",
  });

  const [error, setError] = useState({
    password: "",
  });

  const [formMessage, setFormMessage] = useState({
    error: "",
    success: "",
  });

  const handleInputChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value.trim(),
    });
  };

  const _validateForm = () => {
    setFormMessage({error: "", success: ""});

    let valid = true;
    let errorData = {password: "", form: ""};

    if (form.password === "") {
      valid = false;
      errorData = {...errorData, password: "Password is required."};
    }

    setError(errorData);

    if (valid !== true) {
      if (errorData.password !== "") {
        ref.password.current.focus();
      }
    }

    return valid;
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();

    if (!_validateForm(e)) {
      return false;
    }

    pageLoader.show();
    userActions.updatePassword(form, (err, res) => {
      if (err) {
        setTimeout(() => {
          history.push("/reset-password");
        }, 5000);
        pageLoader.hide();
      }
    });
  };

  const handleGoogleLogIn = (e) => {
    e.preventDefault();

    userActions.googleLogin();
  };

  return (
    <Wrapper>
      <FormInput
        onChange={handleInputChange} name="email" type="email" placeholder="Email" value={form.email}
        readOnly/>
      <PasswordInput ref={ref.password} onChange={handleInputChange}/>
      <button className="btn btn-primary btn-block" onClick={handleUpdatePassword}>
        Update password
      </button>
      <hr/>
      <p className="text-muted">Login with your social media account.</p>
      <ul className="list-inline">
        <li className="list-inline-item">
          <span nClick={handleGoogleLogIn} className="btn btn-floating btn-google">
            <i className="fa fa-google"/>
          </span>
        </li>
      </ul>
      <hr/>
      <p className="text-muted">Don't have an account?</p>
      <Link className={"btn btn-outline-light btn-sm"} to="/register">
        Register now!
      </Link>
    </Wrapper>
  );
};

export default React.memo(UpdatePasswordPanel);
