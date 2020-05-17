import React, {useEffect, useState} from "react";
import {Route, Switch, useLocation, withRouter} from "react-router-dom";
import styled from "styled-components";
import {SvgIcon} from "../components/common";
import {useUserLogin} from "../components/hooks";
import {LoginPanel, RegisterPanel, ResetPasswordPanel} from "../components/panels";

const Wrapper = styled.div`
`;

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
            case "/reset-password":
                setTitle("Reset Password");
                break;
            case "/register":
                setTitle("Create account");
                break;
            default:
                if (location.pathname.indexOf("authenticate") !== -1)
                    setTitle("Authentication");
                else
                    setTitle("Sign in");
        }
    }, [location]);

    return (
        <Wrapper className="form-wrapper">
            <div id="logo">
                <SvgIcon icon={`driff-logo`} width="110" height="80"/>
            </div>

            <h5>{title}</h5>

            <Switch>
                <Route path={"/login"} component={LoginPanel}/>
                <Route path={"/reset-password"} component={ResetPasswordPanel}/>
                <Route path={"/register"} component={RegisterPanel}/>
            </Switch>
        </Wrapper>
    );
};

export default withRouter(GuestLayout);