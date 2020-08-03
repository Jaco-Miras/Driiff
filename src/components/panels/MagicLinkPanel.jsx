import React, {useCallback, useRef, useState} from "react";
import {Link} from "react-router-dom";
import styled from "styled-components";
import {EmailRegex} from "../../helpers/stringFormatter";
import {CheckBox, FormInput} from "../forms";
import {usePageLoader, useUserActions} from "../hooks";

const Wrapper = styled.form`
  margin: 50px auto;
  max-width: 430px;
  
  .btn-magic-link {
    background-color: #7a1b8b;
    color: #fff;
  }  
`;

const MagicLinkPanel = (props) => {

  const pageLoader = usePageLoader();
  const userActions = useUserActions();

  const refs = {
    email: useRef(null),
  };

  const [form, setForm] = useState({
    email: "",
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

    setFormResponse(prevState => ({
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
  }, [setForm, setFormResponse]);

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

    setFormResponse({
      valid: valid,
      message: message
    });

    return (!Object.values(valid).some(v => v === false));
  }

  const handleSendMagicLink = (e) => {
    e.preventDefault();

    if (_validate() && !pageLoader.isActive) {
      pageLoader.show();
      userActions.checkEmail(form.email, (err, res) => {
        if (res && res.data.status) {
          userActions.sendMagicLink(form.email, (err, res) => {
            pageLoader.hide();
            if (err) {
              setFormResponse({
                valid: {
                  email: false
                },
                message: {
                  email: `Not allowed for external users.`
                }
              });
            }
          });
        } else {
          setFormResponse({
            valid: {
              email: false
            },
            message: {
              email: `Email not found.`
            }
          });
          pageLoader.hide();
        }
      })
    }
  };

  return (
    <Wrapper className="fadeIn">
      <FormInput
        onChange={handleInputChange} name="email" isValid={formResponse.valid.email}
        feedback={formResponse.message.email} placeholder="Email" innerRef={refs.email} type="email"
        autoFocus/>
      <div className="form-group d-flex justify-content-between">
        <CheckBox name="remember_me" checked={form.remember_me} onClick={toggleCheck}>
          Remember me
        </CheckBox>
      </div>
      <button className="btn btn-primary btn-block" onClick={handleSendMagicLink}>
        Send link
      </button>
      <hr/>
      <p className="text-muted">Login with your social media account.</p>
      <ul className="list-inline">
        <li className="list-inline-item">
          <span onClick={userActions.googleLogin} className="btn btn-floating btn-google">
            <i className="fa fa-google"/>
          </span>
        </li>
      </ul>
      <hr/>
      <p className="text-muted">Take a different action.</p>
      <Link className={"btn btn-outline-light btn-sm"} to="/register">
        Register now!
      </Link> or <Link className={"btn btn-outline-light btn-sm"} to="/login">
      Login!
    </Link>
    </Wrapper>
  );
};

export default React.memo(MagicLinkPanel);
