import React, { useEffect, useRef, useState } from "react";
import { useHistory, withRouter } from "react-router-dom";
import { Form, FormGroup, Input, InputGroup, InputGroupAddon, InputGroupText } from "reactstrap";
import styled from "styled-components";
import { isIPAddress } from "../../helpers/commonFunctions";
import { SvgIcon } from "../common";
import { InputFeedback } from "../forms";
import { useDriffActions, useTranslationActions } from "../hooks";

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
  const { className = "", setRegisteredDriff } = props;
  const { REACT_APP_localDNSName } = process.env;
  const driffActions = useDriffActions();
  const history = useHistory();
  const [loading, setLoading] = useState(false);

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

  const handleInputChange = (e) => {
    e.persist();
    setForm((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value.trim(),
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
  };

  const _validate = () => {
    let valid = {};
    let message = {};

    if (form.name === "") {
      valid.name = false;
      message.name = "Driff is required.";
    }

    setFormResponse({
      valid: valid,
      message: message,
    });

    return !Object.values(valid).some((v) => v === false);
  };

  const handleContinue = (e) => {
    e.preventDefault();

    if (loading || !_validate()) return null;

    setLoading(true);
    driffActions.check(form.name, (err, res) => {
      setLoading(false);
      if (err || !res.data.status) {
        setFormResponse({
          valid: {
            name: false,
          },
          message: {
            name: (
              <>
                Driff <b>{form.name}</b> does not exist.
              </>
            ),
          },
        });
        refs.name.current.focus();
      }

      if (res && res.data.status) {
        setFormResponse({
          valid: {
            name: true,
          },
          message: {},
        });

        if (isIPAddress(window.location.hostname) || window.location.hostname === "localhost") {
          driffActions.storeName(form.name, true);
          setRegisteredDriff(form.name);
          history.push("/login");
        } else {
          window.location.href = `${process.env.REACT_APP_apiProtocol}${form.name}.${process.env.REACT_APP_localDNSName}`;
        }
      }
    });
  };

  const handleRegisterClick = () => {
    history.push("/driff-register");
  };

  useEffect(() => {
    document.body.classList.add("form-membership");
    refs.name.current.focus();
  }, []);

  const { _t } = useTranslationActions();

  const dictionary = {
    continue: _t("REGISTER.CONTINUE", "Continue"),
    registerNewDriff: _t("REGISTER.REGISTER_NEW_DRIFF", "Register new driff"),
    yourDriff: _t("REGISTER.YOUR_DRIFF", "Your driff"),
  };

  return (
    <Wrapper className={`driff-register-panel fadeIn form-wrapper ${className}`}>
      <div id="logo">
        <SvgIcon icon={"driff-logo"} width="110" height="80" />
      </div>
      <h5>{dictionary.yourDriff}</h5>
      <Form>
        <FormGroup>
          <InputGroup className="driff-name">
            <Input
              ref={refs.name}
              onChange={handleInputChange}
              name="name"
              type="text"
              className="form-control"
              placeholder="driff"
              autoCapitalize="none"
              valid={formResponse.valid.name}
              invalid={typeof formResponse.valid.name !== "undefined" ? !formResponse.valid.name : formResponse.valid.name}
              required
              autoFocus
            />
            <InputGroupAddon addonType="append">
              <InputGroupText>.{REACT_APP_localDNSName}</InputGroupText>
            </InputGroupAddon>
            <InputFeedback valid={formResponse.valid.name}>{formResponse.message.name}</InputFeedback>
          </InputGroup>
        </FormGroup>
        <button className="btn btn-primary btn-block" onClick={handleContinue}>
          {loading && <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true" />} {dictionary.continue}
        </button>
        <hr />
        <button className="btn btn-outline-light btn-sm" onClick={handleRegisterClick}>
          {dictionary.registerNewDriff}
        </button>
      </Form>
    </Wrapper>
  );
};

export default withRouter(DriffRegisterPanel);
