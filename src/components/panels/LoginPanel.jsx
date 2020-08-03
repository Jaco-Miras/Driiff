import React, {useCallback, useRef, useState} from "react";
import {useDispatch} from "react-redux";
import {Link, useHistory} from "react-router-dom";
import styled from "styled-components";
import {$_GET, getThisDeviceInfo} from "../../helpers/commonFunctions";
import {EmailRegex} from "../../helpers/stringFormatter";
import {toggleLoading} from "../../redux/actions/globalActions";
import {CheckBox, FormInput, PasswordInput} from "../forms";
import {useUserActions} from "../hooks";

const Wrapper = styled.form`
  margin: 50px auto;
  max-width: 430px;
  
  .btn-magic-link {
    background-color: #7a1b8b;
    color: #fff;
  }  
`;

const LoginPanel = (props) => {

  const history = useHistory();
  const dispatch = useDispatch();

  const userActions = useUserActions();

  const refs = {
    email: useRef(),
    password: useRef(),
  };

  const [form, setForm] = useState({
    email: "",
    password: "",
    remember_me: true,
  });

  const [formResponse, setFormResponse] = useState({
    valid: {},
    message: {},
  });

  const toggleCheck = useCallback((e) => {
    e.persist();
    setForm(prevState => ({
      ...prevState,
      [e.target.dataset.name]: !prevState[e.target.dataset.name],
    }));
  }, [setForm]);

  const handleInputChange = useCallback((e) => {
    e.persist();
    setForm(prevState => ({
      ...prevState,
      [e.target.name]: e.target.value.trim(),
    }));
  }, [setForm]);

  const _validate = () => {
    let valid = {};
    let message = {};

    if (form.email === "") {
      valid.email = false;
      message.email = "Email is required.";
    } else if (!EmailRegex.test(form.email)) {
      valid.email = false;
      message.email = "Invalid email format.";
    } else {
      valid.email = true;
    }

    if (form.password === "") {
      valid.password = false;
      message.password = "Password is required.";
    } else {
      valid.password = true;
    }

    setFormResponse({
      valid: valid,
      message: message
    });

    return (!Object.values(valid).some(v => v === false));
  }

  const handleMagicLinkClick = useCallback(() => {
    history.push("/magic-link");
  }, []);

  const handleSignIn = (e) => {
    e.preventDefault();

    if (_validate()) {
      const device = getThisDeviceInfo();
      let payload = {
        ...form,
        serial: device.serial,
        device: device.device,
        browser: device.browser,
      };

      let acceptedParams = ["first_name", "slug", "free_account", "topic_id", "topic_name", "slug_from", "invited_by", "invited_by_id"];

      for (let i = 0; i < acceptedParams.length; i++) {
        let name = acceptedParams[i];
        let value = $_GET(name) ? $_GET(name) : "";

        if (value) {
          payload = {
            ...payload,
            [name]: value,
          };
        }
      }

      dispatch(toggleLoading(true));

      userActions.checkCredentials(payload, (err, res) => {
        if (err) {
          dispatch(toggleLoading(false));
          setFormResponse(prevState => ({
            ...prevState,
            valid: {
              email: false,
              password: false,
            },
          }));
          refs.email.current.focus();
        }

        if (res) {
          if (res.data.message && res.data.message === "need_verify_via_email") {
            //toaster.success(`Login successful! A code was sent to your email for further verification.`);

            let cb = {
              key: new Date().getTime(),
              type: "modal",
              modal: "modal_login_verification",
              title: "Two-step verification",
              children: "",
              dataSet: res.data,
              callback: {
                handleVerify: this.loginCodeVerify,
                handleResend: this.loginCodeResend,
              },
            };
            console.log(cb);
            //openModalAction(cb);
          } else {
            const returnUrl =
              typeof props.location.state !== "undefined" && typeof props.location.state.from !== "undefined" && props.location.state.from !== "/logout"
                ? props.location.state.from.pathname + props.location.state.from.search
                : "/workspace/chat";
            userActions.login(res.data, returnUrl);
          }
        }
      })
    } else {
      if (!formResponse.valid.email) {
        refs.email.current.focus();
      } else if (!formResponse.valid.password) {
        refs.password.current.focus();
      }
    }
  };

  return (
    <Wrapper className="fadeIn">
      <FormInput
        onChange={handleInputChange} name="email" isValid={formResponse.valid.email}
        feedback={formResponse.message.email} placeholder="Email" innerRef={refs.email} type="email"
        autoFocus/>
      <PasswordInput
        ref={refs.password} onChange={handleInputChange} isValid={formResponse.valid.password}
        feedback={formResponse.message.password}/>
      <div className="form-group d-flex justify-content-between">
        <CheckBox name="remember_me" checked={form.remember_me} onClick={toggleCheck}>
          Remember me
        </CheckBox>
        <Link to="/reset-password">Reset password</Link>
      </div>
      <button className="btn btn-primary btn-block" onClick={handleSignIn}>
        Sign in
      </button>
      <hr/>
      <p className="text-muted">Login with your social media account.</p>
      <ul className="list-inline">
        <li className="list-inline-item">
          <span onClick={handleMagicLinkClick} className="btn btn-floating btn-magic-link">
            <i className="fa fa-magic"/>
          </span>
        </li>
        <li className="list-inline-item">
          <span onClick={userActions.googleLogin} className="btn btn-floating btn-google">
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

export default React.memo(LoginPanel);
