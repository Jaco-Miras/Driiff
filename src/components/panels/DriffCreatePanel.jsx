import React, { useCallback, useEffect, useRef, useState, lazy, Suspense } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { FormInput, InputFeedback, PasswordInput } from "../forms";
import { EmailRegex } from "../../helpers/stringFormatter";
import { FormGroup, Input, InputGroup, InputGroupAddon, InputGroupText, Label } from "reactstrap";
import useDriffActions from "../hooks/useDriffActions";
import { addToModals } from "../../redux/actions/globalActions";
import { useDispatch } from "react-redux";
//import ReactConfetti from "react-confetti";
import { isIPAddress } from "../../helpers/commonFunctions";
import { TodoCheckBox } from "../forms";
import ReCAPTCHA from "react-google-recaptcha";
//import { acceptSharedUserInvite } from "../../redux/actions/userAction";
import { Loading } from "../common";
import { renderToString } from "react-dom/server";
const ReactConfetti = lazy(() => import("../lazy/ReactConfetti"));

const Wrapper = styled.form`
  .btn {
    .badge {
      position: relative;
      right: auto;
      top: 0px;
      left: 0.5rem;
    }
  }
  a {
    color: ${(props) => props.theme.colors.primary}!important;
    cursor: pointer;
    :hover {
      text-decoration: underline !important;
    }
  }
`;

const StyledFormGroup = styled(FormGroup)`
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

const CheckBoxWrapper = styled.div`
  display: flex;
  align-items: center;
  .custom-checkbox {
    height: 1rem;
  }
  a {
    color: ${(props) => props.theme.colors.primary};
  }
`;

const StyledWelcomeNote = styled.div`
  font-size: 12px;
`;

const DriffCreatePanel = (props) => {
  const { dictionary, setRegisteredDriff } = props;
  const history = useHistory();
  const dispatch = useDispatch();
  const driffActions = useDriffActions();
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [loginLink, setLoginLink] = useState("/login");
  const [agreed, setAgreed] = useState(false);
  const [captcha, setCaptcha] = useState(null);

  const { REACT_APP_localDNSName, REACT_APP_apiProtocol } = process.env;

  const refs = {
    company_name: useRef(null),
    slug: useRef(null),
  };

  const [form, setForm] = useState({});
  const [creatingDriff, setCreatingDriff] = useState(false);

  const [formResponse, setFormResponse] = useState({
    valid: {},
    message: {},
  });

  const [isSharedInvite, setIsSharedInvite] = useState(false);

  const handleInputChange = useCallback(
    (e) => {
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
    },
    [setForm]
  );

  const _validate = () => {
    let valid = {};
    let message = {};

    if (typeof form.company_name === "undefined" || form.company_name === "") {
      valid.company_name = false;
      message.company_name = dictionary.companyRequired;
    } else {
      valid.company_name = true;
    }

    if (typeof form.slug === "undefined" || form.slug === "") {
      valid.slug = false;
      message.slug = dictionary.driffRequired;
    }

    if (typeof form.email === "undefined" || form.email === "") {
      valid.email = false;
      message.email = dictionary.emailRequired;
    } else if (!EmailRegex.test(form.email)) {
      valid.email = false;
      message.email = dictionary.invalidEmail;
    } else {
      valid.email = true;
    }

    if (typeof form.user_name === "undefined" || form.user_name === "") {
      valid.user_name = false;
      message.user_name = dictionary.yourNameRequired;
    } else {
      valid.user_name = true;
    }

    if (typeof form.password === "undefined" || form.password === "") {
      valid.password = false;
      message.password = dictionary.passwordRequired;
    } else if (typeof form.password !== "undefined" && form.password !== "") {
      const specialChar = /[ -/:-@[-`{-~]/;
      const hasNum = /\d/;
      if (specialChar.test(form.password) && hasNum.test(form.password) && form.password.length >= 6) {
        valid.password = true;
      } else {
        message.password = dictionary.invalidPassword;
        valid.password = false;
      }
    } else {
      valid.password = true;
    }
    if (typeof form.passwordConfirm === "undefined" || form.passwordConfimr === "") {
      valid.passwordConfirm = false;
      message.passwordConfirm = dictionary.passwordRequired;
    } else if (typeof form.passwordConfirm !== "undefined" && form.passwordConfirm !== "") {
      const specialChar = /[ -/:-@[-`{-~]/;
      const hasNum = /\d/;
      if (specialChar.test(form.passwordConfirm) && hasNum.test(form.passwordConfirm) && form.passwordConfirm.length >= 6) {
        if (form.password === form.passwordConfirm) {
          valid.passwordConfirm = true;
        } else {
          message.password = dictionary.passwordNotMatch;
          message.passwordConfirm = dictionary.passwordNotMatch;
          valid.passwordConfirm = false;
          valid.password = false;
        }
      } else {
        message.passwordConfirm = dictionary.invalidPassword;
        valid.passwordConfirm = false;
      }
    } else {
      valid.passwordConfirm = true;
    }

    setFormResponse({
      valid: valid,
      message: message,
    });

    return !Object.values(valid).some((v) => v === false);
  };

  const handleSetUserInvitation = (e, callback = () => {}, options) => {
    setForm((prevState) => ({
      ...prevState,
      invitations: e,
    }));
    callback();
    options.closeModal();
  };

  const handleShowUserInvitation = (e) => {
    e.preventDefault();
    if (loading) return;

    let payload = {
      type: "driff_invite_users",
      invitations: typeof form.invitations !== "undefined" ? form.invitations : [],
      onPrimaryAction: handleSetUserInvitation,
      fromRegister: true,
      submitText: dictionary.submitText,
      cancelText: dictionary.cancelText,
    };

    dispatch(addToModals(payload));
  };

  // const handleDriff = (e) => {
  //   e.preventDefault();
  //   history.push("/login");
  // };

  const handleRegister = (e) => {
    e.preventDefault();

    if (loading) return;
    if (_validate()) {
      setLoading(true);
      driffActions.check(form.slug, (err, res) => {
        if (res.data.status) {
          setLoading(false);
          setFormResponse({
            valid: {
              slug: false,
            },
            message: {
              slug: dictionary.driffTaken,
            },
          });
        } else {
          let extraPayload = {};
          if (history.location.state && history.location.state.sharedWs) {
            extraPayload = {
              state_code: form.state_code,
              driff_from: form.from_slug,
            };
          }
          setCreatingDriff(true);
          props.hideBanner();
          driffActions.create({ ...form, token: captcha, ...extraPayload }, (err, res) => {
            setCreatingDriff(false);
            setLoading(false);
            if (res) {
              setRegistered(true);

              if (isIPAddress(window.location.hostname) || window.location.hostname === "localhost") {
                driffActions.storeName(form.slug, true);
                setRegisteredDriff(form.slug);
              } else {
                setLoginLink(`${REACT_APP_apiProtocol}${form.slug}.${REACT_APP_localDNSName}/login`);
              }
            }
          });
        }
      });
    }
  };

  useEffect(() => {
    if (history.location.state && history.location.state.sharedWs) {
      setIsSharedInvite(true);
      const email = history.location.state.sharedWs.responseData.user.email;
      setForm({
        ...form,
        email: history.location.state.sharedWs.responseData.user.email,
        company_name: history.location.state.sharedWs.responseData.user.company,
        user_name: history.location.state.sharedWs.responseData.user.first_name + " " + history.location.state.sharedWs.responseData.user.last_name,
        state_code: history.location.state.sharedWs.code,
        from_slug: history.location.state.sharedWs.slug,
        slug: email.substring(email.lastIndexOf("@") + 1).split(".")[0],
      });
    }
    if (refs.company_name.current) refs.company_name.current.focus();

    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let e = document.querySelector("h5.title");
    if (e) {
      if (creatingDriff) {
        e.innerHTML = renderToString(<Loading text={dictionary.generatingDriff} />);
      } else if (registered) {
        e.innerHTML = dictionary.thankYou;
      } else {
        e.innerHTML = dictionary.driffRegistration;
      }
    }
  }, [registered, creatingDriff]);

  const toggleCheck = () => {
    setAgreed(!agreed);
  };

  const onCaptchaChange = (value) => {
    setCaptcha(value);
  };

  return (
    <Wrapper>
      {registered ? (
        <>
          Your Driff{" "}
          <b>
            <a href={loginLink}>
              {form.slug}.{REACT_APP_localDNSName}
            </a>
          </b>{" "}
          is ready.
          <hr />
          <a href={loginLink} className={"btn btn-outline-light btn-sm"}>
            {dictionary.signIn}
          </a>
          <Suspense fallback={<></>}>
            <ReactConfetti recycle={false} />
          </Suspense>
        </>
      ) : creatingDriff ? (
        <StyledWelcomeNote>{dictionary.generateDriffMessage}</StyledWelcomeNote>
      ) : (
        <div className="text-left">
          <StyledWelcomeNote className="text-center">{dictionary.welcomNote1}</StyledWelcomeNote>
          <StyledWelcomeNote className="mb-3 text-center">{dictionary.welcomNote2}</StyledWelcomeNote>
          <StyledWelcomeNote className="mb-3 text-center">{dictionary.setUpTrial}</StyledWelcomeNote>
          <StyledWelcomeNote className="mb-3 text-center">{dictionary.noCreditCard}</StyledWelcomeNote>
          <Label for="company_name">{dictionary.companyName}</Label>
          <FormInput
            //ref={refs.company_name}
            onChange={handleInputChange}
            id="company_name"
            name="company_name"
            value={form.company_name ? form.company_name : ""}
            isValid={formResponse.valid.company_name}
            feedback={formResponse.message.company_name}
            innerRef={refs.company_name}
            readOnly={loading}
            autoFocus
          />
          <StyledFormGroup>
            <InputGroup className="driff-name">
              <Input
                ref={refs.slug}
                onChange={handleInputChange}
                value={form.slug ? form.slug : ""}
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
          </StyledFormGroup>
          <Label for="email">{dictionary.yourEmail}</Label>
          <FormInput onChange={handleInputChange} value={form.email ? form.email : ""} name="email" isValid={formResponse.valid.email} feedback={formResponse.message.email} type="email" readOnly={loading || isSharedInvite} />
          <Label for="user_name">{dictionary.yourName}</Label>
          <FormInput onChange={handleInputChange} name="user_name" value={form.user_name ? form.user_name : ""} isValid={formResponse.valid.user_name} feedback={formResponse.message.user_name} innerRef={refs.user_name} readOnly={loading} />
          <Label for="password">{dictionary.password}</Label>
          <PasswordInput onChange={handleInputChange} id="password" name="password" value={form.password} isValid={formResponse.valid.password} feedback={formResponse.message.password} readOnly={loading} placeholder="" />
          <Label for="passwordConfirm">{dictionary.passwordConfirm}</Label>
          <PasswordInput
            onChange={handleInputChange}
            id="passwordConfirm"
            name="passwordConfirm"
            value={form.passwordConfirm}
            isValid={formResponse.valid.passwordConfirm}
            feedback={formResponse.message.passwordConfirm}
            readOnly={loading}
            placeholder=""
          />
          <div className="d-flex justify-content-center">
            <button className={"btn btn-outline-light btn-sm mb-4 t"} onClick={handleShowUserInvitation}>
              {typeof form.invitations !== "undefined" ? (
                <>
                  {dictionary.invitedUsers}{" "}
                  <div className={"mr-2 d-sm-inline d-none"}>
                    <div className={"badge badge-info text-white"}>{form.invitations.length}</div>
                  </div>
                </>
              ) : (
                <>+ {dictionary.inviteUser}</>
              )}
            </button>
          </div>
          <CheckBoxWrapper className="mb-4 text-center">
            <TodoCheckBox name="agree" checked={agreed} onClick={toggleCheck}></TodoCheckBox>
            <span>
              {dictionary.acceptPolicy}{" "}
              <a href="https://getdriff.com/privacy-policy/" target="_blank" rel="noopener noreferrer">
                privacy policy
              </a>{" "}
              {dictionary.and}{" "}
              <a href="https://getdriff.com/terms-of-use-of-driff/" target="_blank" rel="noopener noreferrer">
                terms of use
              </a>{" "}
            </span>
          </CheckBoxWrapper>
          {agreed ? (
            <div className="d-flex align-items-center mb-3 justify-content-center">
              <ReCAPTCHA sitekey={"6Ld8FD8eAAAAAHCZgZslDOsoyKV7OUHRhiG78QSa"} onChange={onCaptchaChange} />
            </div>
          ) : null}
          <button className="btn btn-primary btn-block" onClick={handleRegister} disabled={!agreed || !captcha}>
            {loading && <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true" />} {dictionary.register}
          </button>
          {/* <hr />
          <a onClick={handleDriff}>{dictionary.login}</a> */}
          {/* <button className="btn btn-outline-light btn-sm" onClick={handleDriff}>
            {dictionary.login}
          </button> */}
        </div>
      )}
    </Wrapper>
  );
};

export default React.memo(DriffCreatePanel);
