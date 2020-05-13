import React, {useEffect, useState} from "react";
import {Redirect, Route, Switch, useLocation, withRouter} from "react-router-dom";
import styled from "styled-components";
import {Icon} from "../components/common";
import {LoginPanel, RegisterPanel, ResetPasswordPanel} from "../components/panels";

const Wrapper = styled.div`
`;

const GuestLayout = () => {

    const location = useLocation();
    const [title, setTitle] = useState("Sign in");

    useEffect(() => {
        document.querySelector("body").classList.add("form-membership");
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
                setTitle("Sign in");
        }
    }, [location]);

    return (
        <Wrapper className="form-wrapper">
            <div id="logo">
                <Icon type={`driff-logo`} width={`110px`} height={`80px`} bgColor={`#7a1b8c`} />
            </div>

            <h5>{title}</h5>

            <Switch>
                <Route path={"/login"} component={LoginPanel}/>
                <Route path={"/reset-password"} component={ResetPasswordPanel}/>
                <Route path={"/register"} component={RegisterPanel}/>
                <Redirect
                    from="*"
                    to={{
                        pathname: "/login",
                        state: {from: location},
                    }}
                />
            </Switch>
        </Wrapper>
    );
};

export default withRouter(GuestLayout);