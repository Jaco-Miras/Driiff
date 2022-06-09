import React, { useCallback, useRef, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import styled from "styled-components";
import { isValidPhoneNumber } from "react-phone-number-input";
import { $_GET, getThisDeviceInfo } from "../../helpers/commonFunctions";
import { EmailRegex } from "../../helpers/stringFormatter";
import { toggleLoading } from "../../redux/actions/globalActions";
import { CheckBox, PasswordInput, EmailPhoneInput } from "../forms";
import { useSettings, useUserActions, useToaster, useGetSlug } from "../hooks";
import GoogleIcon from "../../assets/icons/btn_google_signin_light_normal_web.png";
import { acceptSharedUserInvite } from "../../redux/actions/userAction";

const { REACT_APP_apiProtocol, REACT_APP_localDNSName } = process.env;

const Wrapper = styled.form`
  margin: 50px auto;
  max-width: 430px;

  .btn-magic-link {
    background-color: #fff;
    color: rgb(0, 0, 0, 60%);
    box-shadow: 0 1px 2px 0px rgb(0 0 0 / 30%);
    padding: 0.7rem;
    border-radius: 4px;
    cursor: pointer;
  }
  .google-signin {
    cursor: pointer;
  }
`;

const LoginPanel = (props) => {
  const { dictionary, countryCode } = props;
  const history = useHistory();
  const dispatch = useDispatch();
  const { driffSettings } = useSettings();
  //const subscriptions = useSelector((state) => state.admin.subscriptions);
  const { slug } = useGetSlug();
  const userActions = useUserActions();
  const toaster = useToaster();
  const refs = {
    email: useRef(),
    password: useRef(),
  };

  const [form, setForm] = useState({
    email: "",
    password: "",
    remember_me: true,
  });

  const [stateCode, setStateCode] = useState(null);
  const [inviteSlug, setInviteSlug] = useState(null);

  const [formResponse, setFormResponse] = useState({
    valid: {},
    message: {},
  });

  const [registerMode, setRegisterMode] = useState(driffSettings.login_mode);

  const toggleCheck = useCallback(
    (e) => {
      e.persist();
      setForm((prevState) => ({
        ...prevState,
        [e.target.dataset.name]: !prevState[e.target.dataset.name],
      }));
    },
    [setForm]
  );

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

  const _validate = () => {
    let valid = {};
    let message = {};
    const lettersRegExp = /[a-zA-Z]/g;

    if (form.email === "") {
      valid.email = false;
      message.email = dictionary.emailRequired;
    } else if (form.email === undefined) {
      valid.email = false;
      message.email = dictionary.phoneNumberRequired;
    } else if (form.email.charAt(0) === "+" && !lettersRegExp.test(form.email)) {
      if (!isValidPhoneNumber(form.email)) {
        valid.email = false;
        message.email = dictionary.invalidPhoneNumber;
      } else {
        valid.email = true;
      }
    } else if (!EmailRegex.test(form.email)) {
      valid.email = false;
      message.email = dictionary.invalidEmail;
    } else {
      valid.email = true;
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

  const handleMagicLinkClick = () => {
    history.push("/magic-link");
  };

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
          setFormResponse((prevState) => ({
            ...prevState,
            valid: {
              email: false,
              password: false,
            },
          }));
          //refs.email.current.focus();
        }

        if (res) {
          if (res.data.message && res.data.message === "need_verify_via_email") {
            //toaster.success(`Login successful! A code was sent to your email for further verification.`);
            // let cb = {
            //   key: new Date().getTime(),
            //   type: "modal",
            //   modal: "modal_login_verification",
            //   title: "Two-step verification",
            //   children: "",
            //   dataSet: res.data,
            //   callback: {
            //     handleVerify: this.loginCodeVerify,
            //     handleResend: this.loginCodeResend,
            //   },
            // };
            //openModalAction(cb);
          } else {
            if (driffSettings.settings.password_login === false && res.data.user_auth.type === "internal" && driffSettings.settings.google_login) {
              dispatch(toggleLoading(false));
              toaster.info("Please login via your Google account.", { autoClose: false });
            } else {
              const returnUrl =
                typeof props.location.state !== "undefined" && typeof props.location.state.from !== "undefined" && props.location.state.from !== "/logout"
                  ? props.location.state.from.pathname + props.location.state.from.search
                  : "/dashboard";
              if (stateCode && inviteSlug) {
                let payload = {
                  url: `https://${inviteSlug}.driff.network/api/v2/shared-workspace-invite-accept`,
                  state_code: stateCode,
                  slug: slug,
                  as_guest: false,
                };
                dispatch(
                  acceptSharedUserInvite(payload, (err, res) => {
                    if (err) return;
                  })
                );
              }
              userActions.login(res.data, returnUrl);
            }

            //stripe code
            // if (subscriptions && subscriptions.status === "canceled") {
            //   if (res.data.user_auth.role && (res.data.user_auth.role.name === "owner" || res.data.user_auth.role.name === "admin")) {
            //     userActions.login(res.data, "/admin-settings/subscription/subscribe");
            //   } else {
            //     dispatch(toggleLoading(false));
            //     toaster.info("Driff trial subscription has ended. Please contact your administrator.", { autoClose: false });
            //   }
            // } else if (driffSettings.settings.password_login === false && res.data.user_auth.type === "internal") {
            //   dispatch(toggleLoading(false));
            //   toaster.info("Please login via your Google account.", { autoClose: false });
            // } else {
            //   const returnUrl =
            //     typeof props.location.state !== "undefined" && typeof props.location.state.from !== "undefined" && props.location.state.from !== "/logout" ? props.location.state.from.pathname + props.location.state.from.search : "/chat";
            //   userActions.login(res.data, returnUrl);
            // }
          }
        }
      });
    } else {
      if (!formResponse.valid.email) {
        //refs.email.current.focus();
      } else if (!formResponse.valid.password) {
        refs.password.current.focus();
      }
    }
  };

  const handleEmailNumberChange = (value) => {
    setForm((prevState) => ({
      ...prevState,
      email: value,
    }));

    setFormResponse((prevState) => ({
      ...prevState,
      valid: {
        ...prevState.valid,
        email: undefined,
      },
      message: {
        ...prevState.message,
        email: undefined,
      },
    }));
  };

  useEffect(() => {
    if ($_GET("state_code") && $_GET("invite_slug")) {
      const state_code = $_GET("state_code");
      const invite_slug = $_GET("invite_slug");
      setStateCode($_GET("state_code"));
      setInviteSlug($_GET("invite_slug"));
      localStorage.setItem("stateCode", state_code);
      localStorage.setItem("inviteSlug", invite_slug);
      history.replace({ state: { state_code: $_GET("state_code"), invite_slug: $_GET("invite_slug") } });
    }
  }, []);

  useEffect(() => {
    handleEmailNumberChange(registerMode === "email" ? "" : undefined);
  }, [registerMode]);

  useEffect(() => {
    if (driffSettings.login_mode === "mobile") setRegisterMode("number");
    else setRegisterMode("email");
  }, [driffSettings.login_mode]);

  if ($_GET("code") && $_GET("state")) {
    return <Wrapper className="fadeIn"></Wrapper>;
  }

  return (
    <Wrapper className="fadeIn">
      <>
        <EmailPhoneInput
          onChange={handleEmailNumberChange}
          name="email_phone"
          isValid={formResponse.valid.email}
          feedback={formResponse.message.email}
          placeholder={dictionary.emailOnly}
          registerMode={registerMode}
          setRegisterMode={setRegisterMode}
          value={form.email}
          defaultCountry={countryCode}
          autoFocus={true}
          innerRef={refs.email}
        />
        {/* <FormInput onChange={handleInputChange} name="email" isValid={formResponse.valid.email} feedback={formResponse.message.email} placeholder={dictionary.email} innerRef={refs.email} type="email" autoFocus /> */}
        <PasswordInput ref={refs.password} onChange={handleInputChange} isValid={formResponse.valid.password} feedback={formResponse.message.password} placeholder={dictionary.password} />
        <div className="form-group d-flex justify-content-between">
          <CheckBox name="remember_me" checked={form.remember_me} onClick={toggleCheck}>
            {dictionary.rememberMe}
          </CheckBox>
          <Link to="/reset-password">{dictionary.resetPassword}</Link>
        </div>
        <button className="btn btn-primary btn-block" onClick={handleSignIn}>
          {dictionary.signIn}
        </button>
      </>

      {(driffSettings.settings.google_login || driffSettings.settings.magic_link) && (
        <>
          <hr />
          <p className="text-muted">{dictionary.loginSocialMedia}</p>
          <ul className="list-inline">
            {driffSettings.settings.magic_link && (
              <li>
                <span onClick={handleMagicLinkClick} className="btn-magic-link">
                  <i className="fa fa-magic" /> Magic Link
                </span>
              </li>
            )}
            {driffSettings.settings.google_login && (
              <li className="list-inline-item">
                <img className="google-signin" src={GoogleIcon} alt="Google signin" onClick={userActions.googleLogin} />
                {/* <span onClick={userActions.googleLogin} className="btn btn-floating btn-google">
                  <i className="fa fa-google" />
                </span> */}
              </li>
            )}
          </ul>
        </>
      )}
      {driffSettings.settings.sign_up && (
        <>
          <hr />
          <p className="text-muted">{dictionary.noAccount}</p>
          <Link className={"btn btn-outline-light btn-sm"} to="/register">
            {dictionary.registerNow}
          </Link>
        </>
      )}
      <hr />
      <a className={"btn btn-outline-light btn-sm"} href={`${REACT_APP_apiProtocol}${REACT_APP_localDNSName}`}>
        {dictionary.logDifferent}
      </a>
    </Wrapper>
  );
};

export default React.memo(LoginPanel);
