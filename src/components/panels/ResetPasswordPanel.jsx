import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { EmailRegex } from "../../helpers/stringFormatter";
import { toggleLoading } from "../../redux/actions/globalActions";
import { checkDriffUserEmail, resetPassword } from "../../redux/actions/userAction";
import { getDriffName } from "../hooks/useDriff";

const Wrapper = styled.form`
  ${(props) =>
    props.error !== "" &&
    `&:before {        
        content: "${props.error}";
        display: block;
        color: red;
        margin-top: -20px;
        text-align: left;
        margin-left: 0;
        margin-bottom: 0.5rem;
    }`}

  ${(props) =>
    props.success !== "" &&
    `&:before {        
        content: "${props.success}";
        display: block;
        color: #59a869;
        margin-top: -20px;
        text-align: left;
        margin-left: 0;
        margin-bottom: 0.5rem;
    }`}
`;

const ResetPasswordPanel = () => {
  const dispatch = useDispatch();

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
    setFormMessage({ error: "", success: "" });

    let valid = true;

    if (form.email === "") {
      valid = false;
      setError({ ...error, email: "Email is required." });
    } else if (!EmailRegex.test(form.email)) {
      valid = false;
      setError({ ...error, email: "Invalid email format." });
    } else {
      /* @todo: backend not working */
      dispatch(
        checkDriffUserEmail(
          {
            driff: getDriffName(),
            email: form.email,
          },
          (err, res) => {
            console.log(err);
            console.log(res);
          }
        )
      );
    }

    return valid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!_validateForm(e)) {
      return false;
    }

    dispatch(toggleLoading(true));

    dispatch(
      resetPassword(form, (err, res) => {
        dispatch(toggleLoading(false));
        if (err) {
          setFormMessage({
            ...formMessage,
            error: "Invalid email.",
          });
        }
        if (res) {
          setFormMessage({
            ...formMessage,
            success: `Password reset link sent to ${form.email}. Please check.`,
          });
        }
      })
    );
  };

  return (
    <Wrapper error={formMessage.error} success={formMessage.success}>
      <div className="form-group">
        <input onChange={handleInputChange} name="email" type="email" className="form-control" placeholder="Email" required="" autoFocus />
      </div>
      <button className="btn btn-primary btn-block" onClick={handleSubmit}>
        Submit
      </button>
      <hr />
      <p className="text-muted">Take a different action.</p>
      <Link className={"btn btn-sm btn-outline-light mr-1-1"} to="/register">
        Register now!
      </Link>
      or
      <Link className={"btn btn-sm btn-outline-light ml-1"} to="/login">
        Login!
      </Link>
    </Wrapper>
  );
};

export default React.memo(ResetPasswordPanel);
