import React from "react";
import {useSelector} from "react-redux";
import {Redirect, Route, Switch} from "react-router-dom";
import {useSettings, useTranslation} from "../components/hooks";
import {TestChat} from "../components/test";
import TestFiles from "../components/test/TestFiles";
import GuestLayout from "./GuestLayout";
import MainLayout from "./MainLayout";

export const AppRoute = ({children, ...props}) => {

    useTranslation();
    useSettings();

    // const push = usePushNotification();
    const session = useSelector(state => state.session);
    const i18nLoaded = useSelector(state => state.global.i18nLoaded);
    const authenticated = session.authenticated;

    //if (!session.checked || !i18nLoaded || push.loading)
    if (!session.checked || !i18nLoaded)
        return null;

    return (
        authenticated ?
        <>
            <Switch>
                <Route
                    {...props}
                    component={TestFiles}
                    path={["/test/files/workspace/:workspaceId"]}>
                    {children}
                </Route>
                <Route
                    {...props}
                    component={TestChat}
                    path={["/test/chat"]}>
                    {children}
                </Route>
                <Route
                    {...props}
                    component={MainLayout}
                    path={["/profile", "/dashboard", "/posts", "/chat", "/files", "/people", "/settings", "/logout", "/logged-out"]}>
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