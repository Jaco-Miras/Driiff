import React, {useEffect, useState} from "react";
import {Route, Switch, useHistory, useLocation, withRouter} from "react-router-dom";
import styled from "styled-components";
import {SvgIcon} from "../components/common";
import {
  DriffCreatePanel,
  ExternalRegisterPanel,
  LoginPanel,
  MagicLinkPanel,
  RegisterPanel,
  ResetPasswordPanel,
  UpdatePasswordPanel
} from "../components/panels";
import {useUserLogin} from "../components/hooks/useUserLogin";
import {useSettings, useTranslation} from "../components/hooks";
import useDriffActions from "../components/hooks/useDriffActions";

const Wrapper = styled.div``;

const GuestLayout = (props) => {

  useUserLogin(props);

  const history = useHistory();
  const location = useLocation();
  const {driffSettings} = useSettings();
  const driffActions = useDriffActions();
  const {_t} = useTranslation();

  const {setRegisteredDriff} = props;

  const dictionary = {
    magicLink: _t("LOGIN.MAGIC_LINK", "Magic link"),
    rememberMe: _t("LOGIN.REMEMBER_ME", "Remember me"),
    resetPassword: _t("LOGIN.RESET_PASSWORD", "Reset password"),
    signIn: _t("LOGIN.SIGN_IN", "Sign in"),
    loginSocialMedia: _t("LOGIN.SOCIAL_MEDIA_LOGIN", "Login with your social media account."),
    noAccount: _t("LOGIN.NO_ACCOUNT", "Don't have an account?"),
    registerNow: _t("LOGIN.REGISTER_NOW", "Register now!"),
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

  const [title, setTitle] = useState(dictionary.signIn);

  useEffect(() => {
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
        if (location.pathname.indexOf("/authenticate/") === 0) setTitle(dictionary.authentication);
        else if (location.pathname.indexOf("/resetpassword/") === 0) setTitle(dictionary.updatePassword);
        else setTitle(dictionary.signIn);
    }
  }, [location]);

  return (
    <Wrapper className="form-wrapper fadeIn">
      <div id="logo">
        <SvgIcon icon={"driff-logo"} width="110" height="80"/>
      </div>
      {
        driffSettings.settings.maintenance_mode ?
          <>
            <h5 className="title">Maintenance Mode</h5>
          </>
          :
          <>
            <h5 className="title">{title}</h5>

            <Switch>
              <Route path={"/login"} render={() => <LoginPanel dictionary={dictionary} {...props}/>}/>
              <Route path={"/magic-link"} render={() => <MagicLinkPanel dictionary={dictionary} {...props}/>}/>
              <Route path={"/resetpassword/:token/:email"}
                     render={() => <UpdatePasswordPanel dictionary={dictionary} {...props}/>} exact/>
              <Route path={"/reset-password"} render={() => <ResetPasswordPanel dictionary={dictionary} {...props}/>}/>
              <Route path={"/register"} render={() => <RegisterPanel dictionary={dictionary} {...props}/>}/>
              <Route path={"/request-form"} render={() => <ExternalRegisterPanel dictionary={dictionary} {...props}/>}/>
              <Route path={"/driff-register"} render={() => <DriffCreatePanel dictionary={dictionary}
                                                                              setRegisteredDriff={setRegisteredDriff} {...props}/>}/>
            </Switch>
          </>
      }
    </Wrapper>
  );
};

export default withRouter(GuestLayout);
