import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { useTranslationActions, useGetSlug, useUserActions, useToaster } from "../hooks";
import { useHistory } from "react-router-dom";
import { FormInput, InputFeedback } from "../forms";
import { $_GET } from "../../helpers/commonFunctions";
import { getSharedUserInfo } from "../../redux/actions/userAction";
import { Input, InputGroup, InputGroupAddon, InputGroupText } from "reactstrap";
import { patchCheckDriff } from "../../redux/actions/driffActions";
import { acceptSharedUserInvite } from "../../redux/actions/userAction";
import { replaceChar } from "../../helpers/stringFormatter";

const Wrapper = styled.form`
  p {
    margin-bottom: 0.25rem;
  }
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

const SharedWorkspaceInvite = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const userAction = useUserActions();
  const toaster = useToaster();
  const [loading, setLoading] = useState(false);
  const [loginGuestLoading, setLoginGuestLoading] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const [errorResponse, setErrorResponse] = useState(null);
  const { slug } = useGetSlug();
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
    confirmPassword: "",
    company_name: "",
    responsible_user_id: null,
    slug: "",
  });
  const [showDriffInput, setShowDriffInput] = useState(false);
  const [driffInput, setDriffInput] = useState("");
  const [checkingSlug, setCheckingSlug] = useState(false);

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
    password: _t("REGISTER.PASSWORD", "Set Your Password"),
    invalidPassword: _t("FEEDBACK.INVALID_PASSSWORD", "The password must be at least 6 characters and contain at least one number, and one special character."),
    confirmPassword: _t("REGISTER.REPEAT_PASSWORD", "Repeat Your Password"),
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
    confirmPasswordRequired: _t("FEEDBACK.CONFIRM_PASSWORD_REQUIRED", "Confirm Password must be the same with Password."),
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
    invalidCode: _t("INVALID_INVITE_CODE", "Invite code is invalid."),
    codeAlreadyAccepted: _t("CODE_ALREADY_ACCEPTED", "Invite code already used."),
    connectWithMyDriff: _t("INVITE.CONNECT_WITH_MY_DRIFF", "Connect with my Driff"),
    createYourOwnDriff: _t("INVITE.CREATE_YOUR_OWN_DRIFF", "Create your own Driff"),
    backToLogin: _t("INVITE.BACK_TO_LOGIN_PAGE", "Go back to login page"),
    loginToDriff: _t("INVITE.LOGIN_TO_DRIFF", "Login to Driff"),
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

  const handleDriffInputChange = (e) => {
    setFormResponse((prevState) => ({
      ...prevState,
      valid: {
        ...prevState.valid,
        slug: undefined,
      },
      message: {
        ...prevState.message,
        slug: undefined,
      },
    }));
    setDriffInput(e.target.value);
  };

  const handleCreateDriff = () => {
    history.push("/driff-register", {
      sharedWs: {
        code: form.state_code,
        responseData: responseData,
        slug: slug,
      },
    });
    localStorage.removeItem("slug");
  };

  const handleShowDriffInput = () => {
    setShowDriffInput(true);
  };
  const handleAccept = (e) => {
    e.preventDefault();
    let driffName = driffInput.trim();
    if (checkingSlug) return;
    setCheckingSlug(true);
    dispatch(
      patchCheckDriff(driffName, (err, res) => {
        setCheckingSlug(false);
        if (err) {
          setFormResponse((prevState) => ({
            ...prevState,
            valid: {
              ...prevState.valid,
              slug: false,
            },
            message: {
              ...prevState.message,
              slug: "Invalid slug",
            },
          }));
          return;
        }
        if (res) {
          localStorage.removeItem(slug);
          window.location.href = `${process.env.REACT_APP_apiProtocol}${driffName}.${process.env.REACT_APP_localDNSName}/login?state_code=${form.state_code}&invite_slug=${slug}`;
          //   let payload = {
          //     url: `https://${slug}.driff.network/api/v2/shared-workspace-invite-accept`,
          //     state_code: form.state_code,
          //     slug: driff,
          //   };
          //   dispatch(
          //     acceptSharedUserInvite(payload, (err, res) => {
          //       if (err) return;
          //       history.replace({ state: {} });
          //     })
          //   );
        }
      })
    );
  };

  const handleLoginAsGuest = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setLoginGuestLoading(true);
    if (loginGuestLoading) return;
    let payload = {
      url: `https://${slug}.driff.network/api/v2/shared-workspace-invite-accept`,
      state_code: form.state_code,
      slug: slug,
      as_guest: true,
    };
    dispatch(
      acceptSharedUserInvite(payload, (err, res) => {
        if (err) return;
        let redirectLink = "/dashboard";
        if (res.data.data.current_workspace) {
          redirectLink = `/shared-hub/dashboard/${res.data.data.current_workspace.id}/${replaceChar(res.data.data.current_workspace.name)}/${res.data.data.current_topic.id}/${replaceChar(res.data.data.current_topic.name)}`;
        } else {
          redirectLink = `/shared-hub/dashboard/${res.data.data.current_topic.id}/${replaceChar(res.data.data.current_topic.name)}`;
        }
        userAction.login(res.data.user_auth, redirectLink);
      })
    );
  };

  useEffect(() => {
    dispatch(
      getSharedUserInfo({ state_code: $_GET("state_code") }, (err, res) => {
        if (err) {
          if (err && err.response) {
            setErrorResponse(err.response.data);
            if (err.response.data.errors) {
              toaster.error(err.response.data.errors.error_message[0]);
            }
          }
        }
        if (res) {
          setResponseData(res.data);
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
            state_code: $_GET("state_code"),
          }));
          setLocale(res.data.user.language, setLanguageLoaded(true));
          setTimeout(() => {
            setLanguageLoaded(false);
          }, 1000);
          localStorage.setItem("i18n_lang", res.data.user.language);
          refs.first_name.current.focus();
        }
      })
    );
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGoBackToLogin = (e) => {
    e.preventDefault();
    e.stopPropagation();
    history.push("/login");
  };
  const { REACT_APP_localDNSName } = process.env;

  return (
    <Wrapper>
      {errorResponse && errorResponse.errors && (
        <div>
          <div>{errorResponse.errors.error_message.includes("INVALID_CODE") ? dictionary.invalidCode : errorResponse.errors.error_message.includes("INVITATION_ALREADY_ACCEPTED") ? dictionary.codeAlreadyAccepted : null}</div>
        </div>
      )}
      {responseData && (
        <div>
          <div>
            <p>{responseData.invited_by.name} invited you to join</p>
            <p>
              <b>{responseData.topic.name}</b>
            </p>
          </div>
        </div>
      )}
      {showDriffInput && (
        <>
          <FormGroup>
            <InputGroup className="driff-name">
              <Input
                ref={refs.slug}
                onChange={handleDriffInputChange}
                name="slug"
                type="text"
                placeholder="Driff"
                autoCapitalize="none"
                valid={formResponse.valid.slug}
                invalid={typeof formResponse.valid.slug !== "undefined" ? !formResponse.valid.slug : formResponse.valid.slug}
                readOnly={loading}
                required
                autoFocus
              />
              <InputGroupAddon addonType="append">
                <InputGroupText>.{REACT_APP_localDNSName}</InputGroupText>
              </InputGroupAddon>
              <InputFeedback valid={formResponse.valid.slug}>{formResponse.message.slug}</InputFeedback>
            </InputGroup>
          </FormGroup>
          <button className="btn btn-primary btn-block mt-2" onClick={handleAccept}>
            {loading && <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true" />} {dictionary.loginToDriff}
          </button>
        </>
      )}
      {!showDriffInput && (
        <>
          {responseData && (
            <>
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
                  readOnly
                />
              </FormGroup>
              <FormGroup className="form-group">
                <FormInput
                  onChange={handleInputChange}
                  value={form.middle_name}
                  name="middle_name"
                  type="text"
                  placeholder={dictionary.middleName}
                  isValid={formResponse.valid.middle_name}
                  feedback={formResponse.message.middle_name}
                  readOnly
                />
              </FormGroup>
              <FormGroup className="form-group">
                <FormInput onChange={handleInputChange} value={form.last_name} name="last_name" type="text" placeholder={dictionary.lastName} isValid={formResponse.valid.last_name} feedback={formResponse.message.last_name} readOnly />
              </FormGroup>
              <FormGroup className="form-group">
                <FormInput onChange={handleInputChange} value={form.company_name} name="company_name" placeholder={dictionary.companyName} readOnly />
              </FormGroup>
              <FormGroup className="form-group text-left">
                <FormInput onChange={handleInputChange} name="email" type="text" value={form.email} isValid={formResponse.valid.email} feedback={formResponse.message.email} readOnly />
              </FormGroup>
            </>
          )}

          {errorResponse && (
            <button className="btn btn-primary btn-block mt-2 mb-2" onClick={handleGoBackToLogin}>
              {dictionary.backToLogin}
            </button>
          )}
          {responseData && (
            <>
              <button className="btn btn-primary btn-block mt-2 mb-2" onClick={handleCreateDriff}>
                {loading && <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true" />} {dictionary.createYourOwnDriff}
              </button>

              <div>Or</div>

              <button className="btn btn-primary btn-block mt-2 mb-2" onClick={handleShowDriffInput}>
                {loading && <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true" />} {dictionary.connectWithMyDriff}
              </button>

              {/* <div>Or</div>

              <button className="btn btn-primary btn-block mt-2 mb-2" onClick={handleLoginAsGuest}>
                {loginGuestLoading && <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true" />} Login as guest
              </button> */}
            </>
          )}
        </>
      )}
    </Wrapper>
  );
};

export default React.memo(SharedWorkspaceInvite);
