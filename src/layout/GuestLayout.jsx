import React, {useEffect, useState} from "react";
import {Route, Switch, useLocation, withRouter} from "react-router-dom";
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
import {useTranslation} from "../components/hooks";

const Wrapper = styled.div``;

const GuestLayout = (props) => {

  useUserLogin(props);

  const location = useLocation();
  const [title, setTitle] = useState("Sign in");

  useEffect(() => {
    document.querySelector("body").classList.add("form-membership");

    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    switch (location.pathname) {
      case "/magic-link":
        setTitle("Magic link");
        break;
      case "/driff-register":
        setTitle("Driff registration");
        break;
      case "/request-form":
        setTitle("Accept invitation");
        break;
      case "/reset-password":
        setTitle("Reset password");
        break;
      case "/register":
        setTitle("Create account");
        break;
      default:
        if (location.pathname.indexOf("/authenticate/") === 0) setTitle("Authentication");
        else if (location.pathname.indexOf("/resetpassword/") === 0) setTitle("Update Password");
        else setTitle("Sign in");
    }
  }, [location]);

  const {_t} = useTranslation();

  const dictionary = {
    rememberMe: _t("LOGIN.REMEMBER_ME", "Remember me"),
    resetPassword: _t("LOGIN.RESET_PASSWORD", "Reset password"),
    signIn: _t("LOGIN.SIGN_IN", "Sign in"),
    loginSocialMedia: _t("LOGIN.SOCIAL_MEDIA_LOGIN", "Login with your social media account."),
    noAccount: _t("LOGIN.NO_ACCOUNT", "Don't have an account?"),
    registerNow: _t("LOGIN.REGISTER_NOW", "Register now!"),
    submit: _t("RESET_PASSWORD.SUBMIT", "Submit"),
    login: _t("RESET_PASSWORD.LOGIN", "Login!"),
    takeADifferentAction: _t("RESET_PASSWORD.TAKE_A_DIFFERENT_ACTION", "Take a different action."),
    updatePassword: _t("UPDATE_PASSWORD.UPDATE_PASSWORD", "Update password"),
    register: _t("REGISTER.REGISTER", "Register"),
    haveAccount: _t("REGISTER.HAVE_ACCOUNT", "Already have an account?"),
    password: _t("REGISTER.PASSWORD", "Password"),
    fistName: _t("REGISTER.FIRST_NAME", "First name"),
    middleName: _t("REGISTER.MIDDLE_NAME", "Middle name"),
    lastName: _t("REGISTER.LAST_NAME", "Last name"),
    accept: _t("REGISTER.ACCEPT", "Accept"),
    inviteUser: _t("DRIFF.INVITE", "Invite user"),
    companyName: _t("DRIFF.COMPANY_NAME", "Company name"),
    yourEmail: _t("DRIFF.YOUR_EMAIL", "Your email"),
    yourName: _t("DRIFF.YOUR_NAME", "Your name"),
    sendLink: _t("MAGIC_LINK.SEND_LINK", "Send link"),
    emailRequired: _t("FEEDBACK.EMAIL_REQUIRED",  "Email is required."),
    passwordRequired: _t("FEEDBACK.PASSWORD_REQUIRED",  "Password is required."),
    invalidEmail: _t("FEEDBACK.INVALID_EMAIL", "Invalid email format"),
    firstNameRequired: _t("FEEDBACK.FIRST_NAME_REQUIRED", "First name is required."),
    lastNameRequired: _t("FEEDBACK.LAST_NAME_REQUIRED", "Last name is required."),
    companyRequired: _t("FEEDBACK.COMPANY_REQUIRED", "Company name is required."),
    driffRequired: _t("FEEDBACK.DRIFF_REQUIRED", "Driff is required."),
    driffTaken: _t("FEEDBACK.DRIFF_TAKEN", "Driff is already taken"),
    emailNotFound: _t("FEEDBACK.EMAIL_NOT_FOUND", "Email not found."),
    notAllowedForExternal: _t("FEEDBACK.NOT_ALLOWED_FOR_EXTERNAL", "Not allowed for external users."),
  };

  return (
    <Wrapper className="form-wrapper fadeIn">
      <div id="logo">
        <SvgIcon icon={"driff-logo"} width="110" height="80"/>
      </div>

      <h5>{title}</h5>

      <Switch>
        <Route path={"/login"} render={() => <LoginPanel dictionary={dictionary} {...props}/>}/>
        <Route path={"/magic-link"} render={() => <MagicLinkPanel dictionary={dictionary} {...props}/>}/>
        <Route path={"/resetpassword/:token/:email"} render={() => <UpdatePasswordPanel dictionary={dictionary} {...props}/>} exact/>
        <Route path={"/reset-password"} render={() => <ResetPasswordPanel dictionary={dictionary} {...props}/>}/>
        <Route path={"/register"} render={() => <RegisterPanel dictionary={dictionary} {...props}/>}/>
        <Route path={"/request-form"} render={() => <ExternalRegisterPanel dictionary={dictionary} {...props}/>}/>
        <Route path={"/driff-register"} render={() => <DriffCreatePanel dictionary={dictionary} {...props}/>}/>
      </Switch>
    </Wrapper>
  );
};

export default withRouter(GuestLayout);
