import React, { useCallback, useEffect, useRef, useState, lazy, Suspense } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { FormInput, InputFeedback, PasswordInput } from "../forms";
import { EmailRegex } from "../../helpers/stringFormatter";
import { FormGroup, Input, InputGroup, InputGroupAddon, InputGroupText } from "reactstrap";
import useDriffActions from "../hooks/useDriffActions";
import { addToModals } from "../../redux/actions/globalActions";
import { useDispatch } from "react-redux";
//import ReactConfetti from "react-confetti";
import { isIPAddress } from "../../helpers/commonFunctions";
import { TodoCheckBox } from "../forms";
import ReCAPTCHA from "react-google-recaptcha";
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

  const [formResponse, setFormResponse] = useState({
    valid: {},
    message: {},
  });

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
    };

    dispatch(addToModals(payload));
  };

  const handleDriff = (e) => {
    e.preventDefault();
    history.push("/login");
  };

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
          driffActions.create({ ...form, token: captcha }, (err, res) => {
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
    if (refs.company_name.current) refs.company_name.current.focus();

    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let e = document.querySelector("h5.title");
    if (e) {
      if (registered) {
        e.innerHTML = dictionary.thankYou;
      } else {
        e.innerHTML = dictionary.driffRegistration;
      }
    }
  }, [registered]);

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
      ) : (
        <>
          <FormInput
            //ref={refs.company_name}
            onChange={handleInputChange}
            name="company_name"
            isValid={formResponse.valid.company_name}
            feedback={formResponse.message.company_name}
            placeholder={dictionary.companyName}
            innerRef={refs.company_name}
            readOnly={loading}
            autoFocus
          />
          <StyledFormGroup>
            <InputGroup className="driff-name">
              <Input
                ref={refs.slug}
                onChange={handleInputChange}
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
          <FormInput onChange={handleInputChange} name="email" isValid={formResponse.valid.email} feedback={formResponse.message.email} placeholder={dictionary.yourEmail} type="email" readOnly={loading} />
          <FormInput onChange={handleInputChange} name="user_name" isValid={formResponse.valid.user_name} feedback={formResponse.message.user_name} placeholder={dictionary.yourName} innerRef={refs.user_name} readOnly={loading} />
          <PasswordInput onChange={handleInputChange} isValid={formResponse.valid.password} feedback={formResponse.message.password} readOnly={loading} placeholder={dictionary.password} />

          <button className={"btn btn-outline-light btn-sm mb-4"} onClick={handleShowUserInvitation}>
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
          <CheckBoxWrapper className="mb-4">
            <TodoCheckBox name="agree" checked={agreed} onClick={toggleCheck}></TodoCheckBox>
            <span>
              When creating this Driff you accept our{" "}
              <a href="https://getdriff.com/privacy-policy/" target="_blank" rel="noopener noreferrer">
                privacy policy
              </a>{" "}
              and{" "}
              <a href="https://getdriff.com/terms-of-use-of-driff/" target="_blank" rel="noopener noreferrer">
                terms of use
              </a>{" "}
            </span>
          </CheckBoxWrapper>
          <div className="d-flex align-items-center mb-3 justify-content-center">
            <ReCAPTCHA sitekey={"6Ld8FD8eAAAAAHCZgZslDOsoyKV7OUHRhiG78QSa"} onChange={onCaptchaChange} />
          </div>
          <button className="btn btn-primary btn-block" onClick={handleRegister} disabled={!agreed || !captcha}>
            {loading && <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true" />} {dictionary.register}
          </button>
          <hr />
          <a onClick={handleDriff}>{dictionary.login}</a>
          {/* <button className="btn btn-outline-light btn-sm" onClick={handleDriff}>
            {dictionary.login}
          </button> */}
        </>
      )}
    </Wrapper>
  );
};

export default React.memo(DriffCreatePanel);
