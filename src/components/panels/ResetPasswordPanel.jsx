import React, {useState} from "react";
import {Link} from "react-router-dom";
import styled from "styled-components";
import {EmailRegex} from "../../helpers/stringFormatter";
import {useUserActions} from "../hooks";

const Wrapper = styled.form``;

const ResetPasswordPanel = (props) => {

  const { dictionary } = props;
  const userActions = useUserActions();

  const [form, setForm] = useState({
    email: "",
  });

  const [error, setError] = useState({
    email: "",
  });

  const [formMessage, setFormMessage] = useState({
    error: "",
    success: "",
  });

  const handleInputChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const _validateForm = (e) => {
    setFormMessage({error: "", success: ""});

    let valid = true;

    if (form.email === "") {
      valid = false;
      setError({...error, email: dictionary.emailRequired});
    } else if (!EmailRegex.test(form.email)) {
      valid = false;
      setError({...error, email: dictionary.invalidEmail});
    }

    return valid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!_validateForm(e)) {
      return false;
    }

    userActions.requestPasswordReset(form.email);
  };

  return (
    <Wrapper>
      <div className="form-group">
        <input onChange={handleInputChange} name="email" type="email" className="form-control" placeholder="Email"
               required="" autoFocus/>
      </div>
      <button className="btn btn-primary btn-block" onClick={handleSubmit}>
        {dictionary.submit}
      </button>
      <hr/>
      <p className="text-muted">{dictionary.takeADifferentAction}</p>
      <Link className={"btn btn-sm btn-outline-light mr-1-1"} to="/register">
        {dictionary.registerNow}
      </Link> or <Link className={"btn btn-sm btn-outline-light ml-1"} to="/login">
        {dictionary.login}
    </Link>
    </Wrapper>
  );
};

export default React.memo(ResetPasswordPanel);
