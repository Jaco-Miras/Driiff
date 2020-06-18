import React, {useEffect, useState} from "react";
import {withRouter} from "react-router-dom";
import styled from "styled-components";
import {SvgIcon} from "../common";
import {ProgressBar} from "./common";

const Wrapper = styled.div`
`;

const RedirectPanel = (props) => {

    const {redirect} = props;
    const [redirectTime, setRedirectTime] = useState(5);
    const [progressTime, setProgessTime] = useState(0);

    useEffect(() => {
        if (redirectTime === 0) {
            window.location.href = redirect();
        }
    }, [redirectTime]);

    useEffect(() => {
        document.body.classList.add("form-membership");
        setInterval(() => {
            setRedirectTime(state => state - 1);
        }, 1000);

        setInterval(() => {
            setProgessTime(state => state + 1.2);
        }, 50);
    }, []);

    return (
        <Wrapper className="redirect-panel form-wrapper">
            <div id="logo">
                <SvgIcon icon={`driff-logo`} width="110" height="80"/>
            </div>

            <h5>Invalid driff name detected.</h5>
            <p>You will automatically get<br/>redirected to <a href={redirect()}>{redirect()}</a> in {redirectTime}s.
            </p>
            <ProgressBar amount={progressTime} limit={100}/>
        </Wrapper>
    );
};

export default withRouter(RedirectPanel);