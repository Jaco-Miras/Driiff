import React, { useEffect, useState, Suspense, lazy } from "react";
import { Route, Switch, useHistory, useLocation, withRouter } from "react-router-dom";
import styled from "styled-components";
import { useUserLogin } from "../components/hooks/useUserLogin";
import { useSettings, useTranslationActions } from "../components/hooks";
import useDriffActions from "../components/hooks/useDriffActions";
import { $_GET } from "../helpers/commonFunctions";
import LoginLogo from "../components/panels/main/LoginLogo";
import SharedWorkspaceInvite from "../components/panels/SharedWorkspaceInvite";
import introImage from "../assets/media/image/intro-image.png";
const DriffCreatePanel = lazy(() => import("../components/panels/DriffCreatePanel"));
const ExternalRegisterPanel = lazy(() => import("../components/panels/ExternalRegisterPanel"));
const LoginPanel = lazy(() => import("../components/panels/LoginPanel"));
const MagicLinkPanel = lazy(() => import("../components/panels/MagicLinkPanel"));
const RegisterPanel = lazy(() => import("../components/panels/RegisterPanel"));
const ResetPasswordPanel = lazy(() => import("../components/panels/ResetPasswordPanel"));
const UpdatePasswordPanel = lazy(() => import("../components/panels/UpdatePasswordPanel"));
const ForceLogoutPanel = lazy(() => import("../components/panels/ForceLogoutPanel"));

const Wrapper = styled.div`
  @keyframes blink {
    /**
   * At the start of the animation the dot
   * has an opacity of .2
   */
    0% {
      opacity: 0.2;
    }
    /**
   * At 20% the dot is fully visible and
   * then fades out slowly
   */
    20% {
      opacity: 1;
    }
    /**
   * Until it reaches an opacity of .2 and
   * the animation can start again
   */
    100% {
      opacity: 0.2;
    }
  }

  .loading span {
    font-size: 2.5rem;
    /**
   * Use the blink animation, which is defined above
   */
    animation-name: blink;
    /**
   * The animation should take 1.4 seconds
   */
    animation-duration: 1.4s;
    /**
   * It will repeat itself forever
   */
    animation-iteration-count: infinite;
    /**
   * This makes sure that the starting style (opacity: .2)
   * of the animation is applied before the animation starts.
   * Otherwise we would see a short flash or would have
   * to set the default styling of the dots to the same
   * as the animation. Same applies for the ending styles.
   */
    animation-fill-mode: both;
  }

  .loading span:nth-child(2) {
    /**
   * Starts the animation of the third dot
   * with a delay of .2s, otherwise all dots
   * would animate at the same time
   */
    animation-delay: 0.2s;
  }

  .loading span:nth-child(3) {
    /**
   * Starts the animation of the third dot
   * with a delay of .4s, otherwise all dots
   * would animate at the same time
   */
    animation-delay: 0.4s;
  }
  ${(props) =>
    props.isOnDriffRegister &&
    `
  h5 {
    margin-bottom: .5rem !important;
  }`}
`;

const CenterContainer = styled.div`
  display: flex;
  justify-content: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const StyledLink = styled.a`
  color: ${(props) => props.theme.colors.primary}!important;
  cursor: pointer;
  :hover {
    text-decoration: underline !important;
  }
`;

const StyledWelcomeNote = styled.div`
  font-size: 12px;
`;
const SideImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #29323f;
  justify-content: flex-end;
  border-radius: 12px 0 0 12px;
  box-shadow: 0 3px 10px rgb(62 85 120 / 5%);
`;
const SideImage = styled.div`
  background-image: url(${introImage});
  background-repeat: no-repeat;
  height: 90%;
  width: 430px;
  background-size: contain;
  background-color: #29323f;
  background-position: center;
  border-radius: 12px 0 0 12px;
`;

const GuestLayout = (props) => {
  useUserLogin(props);

  const history = useHistory();
  const location = useLocation();
  const { driffSettings } = useSettings();
  const driffActions = useDriffActions();
  const { _t } = useTranslationActions();

  const { setRegisteredDriff } = props;

  const dictionary = {
    passwordLoginDisableLabel: _t("LOGIN.PASSWORD_LOGIN_DISABLED_LABEL", "Password Login is disabled"),
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
    updatePassword: _t("UPDATE_PASSWORD.UPDATE_PASSWORD", "Set password"),
    register: _t("REGISTER.REGISTER", "Register"),
    confirmPassword: _t("REGISTER.REPEAT_PASSWORD", "Confirm Password must be the same with your password."),
    haveAccount: _t("REGISTER.HAVE_ACCOUNT", "Already have an account?"),
    password: _t("REGISTER.PASSWORD", "Password"),
    passwordConfirm: _t("REGISTER.PASSWORD_CONFIRM", "Password Confirm"),
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
    passwordNotMatch: _t("FEEDBACK.PASSWORD_NOT_MATCH", "Passwords does not match."),
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
    emailOnly: _t("LOGIN.EMAIL", "Email"),
    email: _t("LOGIN.EMAIL_PHONE", "Email / Phone number"),
    invitedUsers: _t("DRIFF.INVITED_USERS", "Invited users"),
    acceptInvite: _t("REGISTER.ACCEPT_INVITE", "Accept your invitation to"),
    invalidDomain: _t("FEEDBACK.INVALID_DOMAIN", "Invalid domain"),
    invalidPassword: _t("FEEDBACK.INVALID_PASSSWORD", "The password must be at least 6 characters and contain at least one number, and one special character."),
    invalidPhoneNumber: _t("FEEDBACK.INVALID_PHONE_NUMBER", "Invalid phone number"),
    phoneNumberRequired: _t("FEEDBACK.PHONE_NUMBER_REQUIRED", "Phone number required"),
    welcomNote1: _t("DRIFF.WELCOME_NOTE_1", "Game-changing online collaboration platform for ambitious agencies."),
    welcomNote2: _t("DRIFF.WELCOME_NOTE_2", "Talk less, do more and get things done"),
    setUpTrial: _t("DRIFF.SET_UP_TRIAL", "Set up your own Driff and get a free trial period of 30 days."),
    noCreditCard: _t("DRIFF.NO_CREDIT_CARD", "No credit card needed"),
    submitText: _t("INVITE.SUBMIT_TEXT", "Submit"),
    cancelText: _t("INVITE.CANCEL_TEXT", "Cancel"),
    generatingDriff: _t("GENERATING_DRIFF", "We are generating your Driff."),
    generateDriffMessage: _t("GENERATE_DRIFF_MESSAGE", "You may continue working your other tasks but please don’t close this tab. We will send you an email once we have your Driff ready."),
  };

  const [title, setTitle] = useState(dictionary.signIn);
  const [countryCode, setCountryCode] = useState(null);

  const loginClick = (e) => {
    e.preventDefault();
    history.push("/login");
  };

  useEffect(() => {
    fetch("https://ipapi.co/json/")
      .then((res) => res.json())
      .then((response) => {
        setCountryCode(response.country);
      })
      .catch((data, status) => {
        //console.log("Request failed");
      });
    document.querySelector("body").classList.add("form-membership");

    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    switch (location.pathname) {
      case "/magic-link":
        if (driffSettings.settings.magic_link) {
          setTitle(dictionary.magicLink);
        } else {
          history.push("/login");
        }
        break;
      case "/driff-register":
        setTitle(dictionary.driffRegistration);
        break;
      case "/request-form":
        setTitle(`${dictionary.acceptInvite} ${driffActions.getName()}`);
        break;
      case "/reset-password":
        if (driffSettings.settings.password_login) {
          setTitle(dictionary.resetPassword);
        } else {
          history.push("/login");
        }
        break;
      case "/register":
        if (driffSettings.settings.sign_up) {
          setTitle(dictionary.createAccount);
        } else {
          history.push("/login");
        }
        break;
      default:
        if (location.pathname.indexOf("/authenticate/") === 0 || ($_GET("code"), $_GET("state"))) setTitle(dictionary.authentication);
        else if (location.pathname.indexOf("/resetpassword/") === 0) setTitle(dictionary.updatePassword);
        else setTitle(dictionary.signIn);
    }
  }, [location]);

  return (
    <>
      <CenterContainer>
        {location.pathname === "/shared-hub-invite" && (
          <SideImageContainer>
            <SideImage />
          </SideImageContainer>
        )}
        <Wrapper className="form-wrapper fadeIn" isOnDriffRegister={location.pathname === "/driff-register"} style={location.pathname === "/shared-hub-invite" ? { borderRadius: "0 12px 12px 0" } : {}}>
          <LoginLogo />
          {/* <div id="logo">
        <SvgIcon icon={"driff-logo2"} width="110" height="80" />
      </div> */}
          {driffSettings.settings.maintenance_mode ? (
            <>
              <h5 className="title">Maintenance Mode</h5>
            </>
          ) : (
            <>
              <h5 className={`title ${$_GET("code") && $_GET("state") && "loading"}`}>
                {title}
                {$_GET("code") && $_GET("state") && (
                  <>
                    <span>.</span>
                    <span>.</span>
                    <span>.</span>
                  </>
                )}
              </h5>
              <Suspense fallback={<div></div>}>
                <Switch>
                  <Route path={"/login"} render={() => <LoginPanel dictionary={dictionary} countryCode={countryCode} {...props} />} />
                  <Route path={"/magic-link"} render={() => <MagicLinkPanel dictionary={dictionary} countryCode={countryCode} {...props} />} />
                  <Route path={"/resetpassword/:token/:email"} render={() => <UpdatePasswordPanel dictionary={dictionary} {...props} />} exact />
                  <Route path={"/reset-password"} render={() => <ResetPasswordPanel dictionary={dictionary} countryCode={countryCode} {...props} />} />
                  <Route path={"/register"} render={() => <RegisterPanel dictionary={dictionary} countryCode={countryCode} {...props} />} />
                  <Route path={"/request-form"} render={() => <ExternalRegisterPanel dictionary={dictionary} {...props} />} />
                  <Route path={"/driff-register"} render={() => <DriffCreatePanel dictionary={dictionary} setRegisteredDriff={setRegisteredDriff} {...props} />} />
                  <Route path={"/shared-hub-invite"} render={() => <SharedWorkspaceInvite dictionary={dictionary} {...props} />} />
                  <Route path={"/force-logout"} render={() => <ForceLogoutPanel />} />
                </Switch>
              </Suspense>
            </>
          )}
          {location.pathname !== "/driff-register" && (
            <div style={{ display: "flex", justifyContent: "center", marginTop: "24px" }}>
              <StyledLink href="#" onClick={loginClick}>
                {dictionary.login}
              </StyledLink>
            </div>
          )}
        </Wrapper>
      </CenterContainer>
    </>
  );
};

export default withRouter(GuestLayout);
