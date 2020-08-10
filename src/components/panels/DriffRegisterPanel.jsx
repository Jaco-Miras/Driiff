import React, {useCallback, useEffect, useRef, useState} from "react";
import {useHistory, withRouter} from "react-router-dom";
import {Form, FormGroup, Input, InputGroup, InputGroupAddon, InputGroupText} from "reactstrap";
import styled from "styled-components";
import {isIPAddress} from "../../helpers/commonFunctions";
import {SvgIcon} from "../common";
import {InputFeedback} from "../forms";
import {usePageLoader} from "../hooks";
import useDriffActions from "../hooks/useDriffActions";

const Wrapper = styled.div`
  margin: 50px auto;
  max-width: 430px;
  .input-group {
    input {
      margin-bottom: 0 !important;
    }
    
    &.driff-name {
      .input-group-text {
        border-radius: 0 6px 6px 0;
      }
      .invalid-feedback {
          text-align: left;
      }
    }
  }
`;

const DriffRegisterPanel = (props) => {
  const {className = "", setRegisteredDriff} = props;
  const {REACT_APP_localDNSName} = process.env;
  const pageLoader = usePageLoader();
  const driffActions = useDriffActions();
  const history = useHistory();

  const [formResponse, setFormResponse] = useState({
    valid: {},
    message: {},
  });

  const refs = {
    name: useRef(null),
  };

  const [form, setForm] = useState({
    name: "",
  });

  const handleInputChange = useCallback((e) => {
    e.persist();
    setForm(prevState => ({
      ...prevState,
      [e.target.name]: e.target.value.trim(),
    }));
  }, [setForm]);

  const _validate = () => {
    let valid = {};
    let message = {};

    if (form.name === "") {
      valid.name = false;
      message.name = `Driff is required.`;
    }

    setFormResponse({
      valid: valid,
      message: message
    });

    return (!Object.values(valid).some(v => v === false));
  }

  const handleContinue = (e) => {
    e.preventDefault();

    if (pageLoader.isActive || !_validate())
      return null;

    pageLoader.show();
    driffActions.check(form.name, (err, res) => {
      pageLoader.hide();

      if (err || !res.data.status) {
        setFormResponse({
          valid: {
            name: false
          },
          message: {
            name: `Driff does not exists.`
          }
        })
      }

      if (res && res.data.status) {
        setFormResponse({
          valid: {
            name: true
          },
          message: {}
        })

        if (isIPAddress(window.location.hostname) || window.location.hostname === "localhost") {
          driffActions.storeName(form.name, true);
          setRegisteredDriff(form.name);
        } else {
          window.location.href = `${process.env.REACT_APP_apiProtocol}${form.name}.${process.env.REACT_APP_localDNSName}`;
        }
      }
    });
  };

  const handleRegisterClick = (e) => {
    history.push('/driff-register')
  }

  useEffect(() => {
    document.body.classList.add("form-membership");
    refs.name.current.focus();

  }, []);

  return (
    <Wrapper className={`driff-register-panel fadeIn form-wrapper ${className}`}>
      <div id="logo">
        <SvgIcon icon={"driff-logo"} width="110" height="80"/>
      </div>
      <h5>Your driff</h5>
      <Form>
        <FormGroup>
          <InputGroup className="driff-name">
            <Input
              ref={refs.name} onChange={handleInputChange} name="name" type="text" className="form-control"
              placeholder="driff" autocapitalize="none"
              valid={formResponse.valid.name}
              invalid={typeof formResponse.valid.name !== "undefined" ? !formResponse.valid.name : formResponse.valid.name}
              required autoFocus/>
            <InputGroupAddon addonType="append">
              <InputGroupText>.{REACT_APP_localDNSName}</InputGroupText>
            </InputGroupAddon>
            <InputFeedback valid={formResponse.valid.name}>{formResponse.message.name}</InputFeedback>
          </InputGroup>
        </FormGroup>
        <button className="btn btn-primary btn-block" onClick={handleContinue}>
          Continue
        </button>
        <hr/>
        <button className="btn btn-outline-light btn-sm" onClick={handleRegisterClick}>
          Register new driff
        </button>
      </Form>
    </Wrapper>
  );
};

export default withRouter(DriffRegisterPanel);
