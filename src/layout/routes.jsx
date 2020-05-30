import React from "react";
import {Redirect, Route, Switch} from "react-router-dom";
import GuestLayout from "./GuestLayout";
import MainLayout from "./MainLayout";

export const AppRoute = ({authenticated, children, ...props}) => {

    return (
        authenticated ?
        <>
            <Switch>
                <Route
                    {...props}
                    component={MainLayout}
                    path={["/dashboard", "/posts", "/chat", "/files", "/people", "/settings", "/logout", "/logged-out"]}>
                    {children}
                </Route>
                <Route
                    {...props}
                    component={MainLayout}
                    path={["/workspace"]}>
                    {children}
                </Route>
                <Redirect
                    from="*"
                    to={{
                        pathname: "/chat",
                        state: {from: props.location},
                    }}
                />
            </Switch>
        </>
                      :
        <Switch>
            <Route
                {...props}
                component={GuestLayout}
                path={["/register", "/resetpassword/:token/:email", "/reset-password", "/login", "/authenticate/:token/:returnUrl?"]}
                exact>
                {children}
            </Route>
            <Redirect
                from="*"
                to={{
                    pathname: "/login",
                    state: {from: props.location},
                }}
            />
        </Switch>
    );
};