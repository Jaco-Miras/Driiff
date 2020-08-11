import React, {useCallback, useEffect, useRef, useState} from "react";
import {Link, useHistory} from "react-router-dom";
import styled from "styled-components";
import {FormInput, InputFeedback, PasswordInput} from "../forms";
import {EmailRegex} from "../../helpers/stringFormatter";
import {FormGroup, Input, InputGroup, InputGroupAddon, InputGroupText} from "reactstrap";
import useDriffActions from "../hooks/useDriffActions";
import {addToModals} from "../../redux/actions/globalActions";
import {useDispatch} from "react-redux";
import {Badge} from "../common";
import ReactConfetti from "react-confetti";
import {isIPAddress} from "../../helpers/commonFunctions";

const Wrapper = styled.form``;

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

const DriffCreatePanel = (props) => {

  const {dictionary, setRegisteredDriff} = props;
  const history = useHistory();
  const dispatch = useDispatch();
  const driffActions = useDriffActions();
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [loginLink, setLoginLink] = useState("/login");

  const {REACT_APP_localDNSName, REACT_APP_apiProtocol} = process.env;

  const refs = {
    company_name: useRef(null),
    slug: useRef(null),
  };

  const [form, setForm] = useState({});

  const [formResponse, setFormResponse] = useState({
    valid: {},
    message: {},
  });

  const handleInputChange = useCallback((e) => {
    e.persist();
    setForm(prevState => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));

    setFormResponse(prevState => ({
      ...prevState,
      valid: {
        ...prevState.valid,
        [e.target.name]: undefined
      },
      message: {
        ...prevState.message,
        [e.target.name]: undefined
      },
    }));
  }, [setForm]);

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
    } else {
      valid.password = true;
    }

    setFormResponse({
      valid: valid,
      message: message
    });

    return !Object.values(valid).some(v => v === false);
  }

  const handleSetUserInvitation = (e) => {
    setForm(prevState => ({
      ...prevState,
      invitations: e,
    }));
  }

  const handleShowUserInvitation = (e) => {
    e.preventDefault();

    let payload = {
      type: "driff_invite_users",
      invitations: typeof form.invitations !== "undefined" ? form.invitations : [],
      onPrimaryAction: handleSetUserInvitation
    };

    dispatch(addToModals(payload));
  };

  const handleDriff = useCallback((e) => {
    e.persist();
    history.push("/login");
  }, []);

  const handleRegister = useCallback((e) => {
    e.preventDefault();

    if (_validate() && !loading) {
      setLoading(true)
      driffActions.check(form.slug, (err, res) => {
        setLoading(false);
        if (res.data.status) {
          setFormResponse({
            valid: {
              slug: false,
            },
            message: {
              slug: dictionary.driffTaken
            }
          });
        } else {
          driffActions.create(form, (err, res) => {
            if (res) {
              setRegistered(true);

              if (isIPAddress(window.location.hostname) || window.location.hostname === "localhost") {
                driffActions.storeName(form.slug, true);
                setRegisteredDriff(form.slug);
              } else {
                setLoginLink(`${process.env.REACT_APP_apiProtocol}${form.name}.${process.env.REACT_APP_localDNSName}/login`);
              }
            }
          });
        }
      })
    }

  }, [form]);

  useEffect(() => {
    if (refs.company_name.current)
      refs.company_name.current.focus();

    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let e = document.querySelector('h5.title');
    if (e) {
      if (registered) {
        e.innerHTML = dictionary.thankYou;
      } else {
        e.innerHTML = dictionary.driffRegistration;
      }
    }
  }, [registered])

  return (
    <Wrapper>
      {
        registered ? <>

            Your driff <b><a
            href={`${REACT_APP_apiProtocol}${form.slug}.${REACT_APP_localDNSName}`}>{form.slug}.{REACT_APP_localDNSName}</a></b> is
            ready.

            <hr/>

            <Link className={"btn btn-outline-light btn-sm"} to={loginLink}>
              {dictionary.signIn}
            </Link>
            <ReactConfetti recycle={false}/>
          </> :
          <>
            <FormInput
              ref={refs.company_name}
              onChange={handleInputChange} name="company_name" isValid={formResponse.valid.company_name}
              feedback={formResponse.message.company_name} placeholder={dictionary.companyName}
              innerRef={refs.company_name}
              autoFocus/>
            <StyledFormGroup>
              <InputGroup className="driff-name">
                <Input
                  ref={refs.slug} onChange={handleInputChange} name="slug" type="text"
                  placeholder="driff" autocapitalize="none"
                  valid={formResponse.valid.slug}
                  invalid={typeof formResponse.valid.slug !== "undefined" ? !formResponse.valid.slug : formResponse.valid.slug}
                  required autoFocus/>
                <InputGroupAddon addonType="append">
                  <InputGroupText>.{REACT_APP_localDNSName}</InputGroupText>
                </InputGroupAddon>
                <InputFeedback valid={formResponse.valid.slug}>{formResponse.message.slug}</InputFeedback>
              </InputGroup>
            </StyledFormGroup>
            <FormInput
              onChange={handleInputChange} name="email" isValid={formResponse.valid.email}
              feedback={formResponse.message.email} placeholder={dictionary.yourEmail} type="email"/>
            <FormInput
              onChange={handleInputChange} name="user_name" isValid={formResponse.valid.user_name}
              feedback={formResponse.message.user_name} placeholder={dictionary.yourName} innerRef={refs.user_name}/>
            <PasswordInput onChange={handleInputChange} isValid={formResponse.valid.password}
                           feedback={formResponse.message.password}/>

            <button className={"btn btn-outline-light btn-sm mb-4"} onClick={handleShowUserInvitation}>

              {
                typeof form.invitations !== "undefined" ?
                  <>Invited users <Badge color="danger" label={form.invitations.length}/></>
                  :
                  <>+ {dictionary.inviteUser}</>
              }
            </button>

            <button className="btn btn-primary btn-block" onClick={handleRegister}>
              {loading && <i className="fa fa-spin fa-spinner mr-2"/>} {dictionary.register}
            </button>
            <hr/>
            <button className="btn btn-outline-light btn-sm" onClick={handleDriff}>
              {dictionary.login}
            </button>
          </>
      }
    </Wrapper>
  );
};

export default React.memo(DriffCreatePanel);
