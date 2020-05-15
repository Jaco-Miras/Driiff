import React from "react";
import {Redirect, Route, Switch} from "react-router-dom";
import DashboardLayout from "./DashboardLayout";
import GuestLayout from "./GuestLayout";

export const AppRoute = ({authenticated, children, ...props}) => {

    return (
        authenticated ?
            <>
                <Switch>
                    <Route
                        {...props}
                        component={GuestLayout}
                        path="/logout">
                        {children}
                    </Route>
                    <Route
                        {...props}
                        component={DashboardLayout}
                        path={["/dashboard"]}>
                        {children}
                    </Route>
                    <Redirect
                        from="*"
                        to={{
                            pathname: "/dashboard",
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
                    path={["/register", "/reset-password", "/login", "/authenticate/:token/:returnUrl?"]}>
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