import React from "react";
import {Route, Switch} from "react-router-dom";
import DashboardLayout from "./DashboardLayout";
import GuestLayout from "./GuestLayout";

export const AppRoute = ({authenticated, children, ...rest}) => {

    return (
        authenticated ?
            <Switch>
                <Route
                    {...rest}
                    component={DashboardLayout}
                    path="*">
                    {children}
                </Route>
            </Switch>
            :
            <Switch>
                <Route
                    {...rest}
                    component={GuestLayout}
                    path="*">
                    {children}
                </Route>
            </Switch>
    );
};