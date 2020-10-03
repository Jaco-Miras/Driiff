import React, {useEffect, useState} from "react";
import {withRouter} from "react-router-dom";
import styled from "styled-components";
import {SvgIcon} from "../common";
import {ProgressBar} from "./common";

const Wrapper = styled.div``;

const RedirectPanel = (props) => {
  const {redirectTo} = props;
  const [redirectTime, setRedirectTime] = useState(5);
  const [progressTime, setProgessTime] = useState(0);

  useEffect(() => {
    if (redirectTime === 0) {
      window.location.href = redirectTo();
    }
  }, [redirectTime]);

  useEffect(() => {
    document.body.classList.add("form-membership");
    setInterval(() => {
      setRedirectTime(prevState => prevState - 1);
    }, 1000);

    setInterval(() => {
      setProgessTime(prevState => prevState + 1.2);
    }, 50);
  }, []);

  return (
    <Wrapper className="redirect-panel form-wrapper">
      <div id="logo">
        <SvgIcon icon={"driff-logo"} width="110" height="80"/>
      </div>

      <h5>Invalid Driff name detected.</h5>
      <p>
        You will automatically get
        <br/>
        redirected to <a href={redirectTo()}>{redirectTo()}</a> in {redirectTime}s.
      </p>
      <ProgressBar amount={progressTime} limit={100}/>
    </Wrapper>
  );
};

export default withRouter(RedirectPanel);
