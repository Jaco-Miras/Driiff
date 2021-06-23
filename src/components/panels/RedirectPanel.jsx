import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import styled from "styled-components";
import { SvgIcon } from "../common";
import { ProgressBar } from "./common";
import { useTranslationActions } from "../hooks";

const Wrapper = styled.div``;

const RedirectPanel = (props) => {
  const { redirectTo } = props;
  const [redirectTime, setRedirectTime] = useState(5);
  const [progressTime, setProgessTime] = useState(0);

  const { _t } = useTranslationActions();
  const dictionary = {
    invalidDriffName: _t("REDIRECT.INVALID_DRIFF_NAME", "Invalid driff name detected"),
    redirectedTo: _t("REDIRECT.REDIRECT_TO", "You will automatically get redirected to"),
    in: _t("REDIRECT.IN", "in"),
  };

  useEffect(() => {
    if (redirectTime === 0) {
      window.location.href = redirectTo();
    }
  }, [redirectTime]);

  useEffect(() => {
    document.body.classList.add("form-membership");
    setInterval(() => {
      setRedirectTime((prevState) => prevState - 1);
    }, 1000);

    setInterval(() => {
      setProgessTime((prevState) => prevState + 1.2);
    }, 50);
  }, []);

  return (
    <Wrapper className="redirect-panel form-wrapper">
      <div id="logo">
        <SvgIcon icon={"driff-logo"} width="110" height="80" />
      </div>

      <h5>{dictionary.invalidDriffName}</h5>
      <p>
        {dictionary.redirectedTo}
        <br />
        <a href={redirectTo()}>{redirectTo()}</a> {dictionary.in} {redirectTime}s.
      </p>
      <ProgressBar amount={progressTime} limit={100} />
    </Wrapper>
  );
};

export default withRouter(RedirectPanel);
