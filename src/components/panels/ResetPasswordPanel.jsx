import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { EmailRegex } from "../../helpers/stringFormatter";
import { useUserActions } from "../hooks";
import { FormInput } from "../forms";

const Wrapper = styled.form``;

const ResetPasswordPanel = (props) => {
  const { dictionary } = props;

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

  const _validateForm = (e) => {
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

  useEffect(() => {
    refs.email.current.focus();
  }, []);

  return (
    <Wrapper>
      <div className="form-group">
        <FormInput innerRef={refs.email} isValid={formResponse.valid.email} feedback={formResponse.message.email} onChange={handleInputChange} name="email" type="email" placeholder={dictionary.email} required autoFocus />
      </div>
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
