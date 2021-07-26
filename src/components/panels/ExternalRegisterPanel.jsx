import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useToaster, useUserActions, useTranslationActions } from "../hooks";
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

  const [languageLoaded, setLanguageLoaded] = useState(false);

  const { _t, setLocale } = useTranslationActions();

  const dictionary = {
    magicLink: _t("LOGIN.MAGIC_LINK", "Magic link"),
    rememberMe: _t("LOGIN.REMEMBER_ME", "Remember me"),
    resetPassword: _t("LOGIN.RESET_PASSWORD", "Reset password"),
    signIn: _t("LOGIN.SIGN_IN", "Sign in"),
    loginSocialMedia: _t("LOGIN.SOCIAL_MEDIA_LOGIN", "Login with your social media account."),
    noAccount: _t("LOGIN.NO_ACCOUNT", "Don't have an account?"),
    registerNow: _t("LOGIN.REGISTER_NOW", "Register now!"),
    logDifferent: _t("LOGIN.LOG_INTO_DIFFERENT_DRIFF", "Log into different Driff"),
    registerNewDriff: _t("DOMAIN.REGISTER_NEW_DRIFF", "Register new Driff"),
    submit: _t("RESET_PASSWORD.SUBMIT", "Submit"),
    login: _t("RESET_PASSWORD.LOGIN", "Login!"),
    takeADifferentAction: _t("RESET_PASSWORD.TAKE_A_DIFFERENT_ACTION", "Take a different action."),
    updatePassword: _t("UPDATE_PASSWORD.UPDATE_PASSWORD", "Update password"),
    register: _t("REGISTER.REGISTER", "Register"),
    haveAccount: _t("REGISTER.HAVE_ACCOUNT", "Already have an account?"),
    password: _t("REGISTER.PASSWORD", "Password"),
    firstName: _t("REGISTER.FIRST_NAME", "First name"),
    middleName: _t("REGISTER.MIDDLE_NAME", "Middle name"),
    lastName: _t("REGISTER.LAST_NAME", "Last name"),
    accept: _t("REGISTER.ACCEPT", "Accept"),
    driffRegistration: _t("DRIFF.DRIFF_REGISTRATION", "Driff registration."),
    inviteUser: _t("DRIFF.INVITE", "Invite user"),
    companyName: _t("DRIFF.COMPANY_NAME", "Company name"),
    yourEmail: _t("DRIFF.YOUR_EMAIL", "Your email"),
    yourName: _t("DRIFF.YOUR_NAME", "Your name"),
    sendLink: _t("MAGIC_LINK.SEND_LINK", "Send link"),
    emailRequired: _t("FEEDBACK.EMAIL_REQUIRED", "Email is required."),
    passwordRequired: _t("FEEDBACK.PASSWORD_REQUIRED", "Password is required."),
    invalidEmail: _t("FEEDBACK.INVALID_EMAIL", "Invalid email format"),
    yourNameRequired: _t("FEEDBACK.YOUR_NAME_REQUIRED", "Your name is required."),
    firstNameRequired: _t("FEEDBACK.FIRST_NAME_REQUIRED", "First name is required."),
    lastNameRequired: _t("FEEDBACK.LAST_NAME_REQUIRED", "Last name is required."),
    companyRequired: _t("FEEDBACK.COMPANY_REQUIRED", "Company name is required."),
    driffRequired: _t("FEEDBACK.DRIFF_REQUIRED", "Driff is required."),
    driffTaken: _t("FEEDBACK.DRIFF_TAKEN", "Driff is already taken"),
    emailNotFound: _t("FEEDBACK.EMAIL_NOT_FOUND", "Email not found."),
    notAllowedForExternal: _t("FEEDBACK.NOT_ALLOWED_FOR_EXTERNAL", "Not allowed for external users."),
    thankYou: _t("FEEDBACK.THANK_YOU", "Thank you!"),
    or: _t("RESET_PASSWORD.OR", "or"),
    createAccount: _t("LOGIN.CREATE_ACCOUNT", "Create account"),
    authentication: _t("LOGIN.AUTHENTICATION", "Authentication"),
    email: _t("LOGIN.EMAIL", "Email"),
    invitedUsers: _t("DRIFF.INVITED_USERS", "Invited users"),
    acceptInvite: _t("REGISTER.ACCEPT_INVITE", "Accept your invitation to"),
  };

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
          setLocale(res.data.user.language, setLanguageLoaded(true));
          setTimeout(() => {
            setLanguageLoaded(false);
          }, 1000);
          localStorage.setItem("i18n_lang", res.data.user.language);

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
