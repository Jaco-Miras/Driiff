import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useHistory, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import { usePageLoader, useUserActions } from "../hooks";
import { FormInput, PasswordInput } from "../forms";
import GoogleIcon from "../../assets/icons/btn_google_signin_light_normal_web.png";

const Wrapper = styled.form``;

const UpdatePasswordPanel = (props) => {
  const { dictionary } = props;
  const history = useHistory();
  //const dispatch = useDispatch();
  const match = useRouteMatch("/resetpassword/:token/:email");
  const userActions = useUserActions();
  //const toaster = useToaster();
  const pageLoader = usePageLoader();

  const driffSettings = useSelector((state) => state.settings.driff);

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
    valid: null,
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
    setFormMessage({ error: "", success: "" });

    let valid = true;
    let errorData = { password: "", form: "" };

    if (form.password === "") {
      valid = false;
      errorData = { ...errorData, password: dictionary.passwordRequired };
    }

    if (form.password === "") {
      valid = false;
      errorData = { ...errorData, password: dictionary.passwordRequired, valid: false };
    } else if (form.password !== "") {
      const specialChar = /[ -/:-@[-`{-~]/;
      const hasNum = /\d/;
      if (specialChar.test(form.password) && hasNum.test(form.password) && form.password.length >= 6) {
        valid = true;
        errorData = { ...errorData, password: "", valid: true };
      } else {
        valid = false;
        errorData = { ...errorData, password: dictionary.invalidPassword, valid: false };
      }
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
      <FormInput onChange={handleInputChange} name="email" type="email" placeholder="Email" value={form.email} readOnly />
      <PasswordInput placeholder="POGI AKO" ref={ref.password} onChange={handleInputChange} isValid={error.valid} feedback={error.password} />
      <button className="btn btn-primary btn-block" onClick={handleUpdatePassword}>
        {dictionary.updatePassword}
      </button>
      <hr />
      <p className="text-muted">{dictionary.loginSocialMedia}</p>
      <ul className="list-inline">
        {driffSettings.settings.google_login && (
          <li className="list-inline-item">
            <img className="google-signin" src={GoogleIcon} alt="Google signin" onClick={userActions.googleLogin} />
            {/* <span onClick={userActions.googleLogin} className="btn btn-floating btn-google">
                  <i className="fa fa-google" />
                </span> */}
          </li>
        )}
        {/* <li className="list-inline-item">
          <span nClick={handleGoogleLogIn} className="btn btn-floating btn-google">
            <i className="fa fa-google" />
          </span>
        </li> */}
      </ul>
      <hr />
      <p className="text-muted">{dictionary.noAccount}</p>
      {driffSettings.settings.sign_up && (
        <Link className={"btn btn-outline-light btn-sm"} to="/register">
          {dictionary.registerNow}
        </Link>
      )}
    </Wrapper>
  );
};

export default React.memo(UpdatePasswordPanel);
