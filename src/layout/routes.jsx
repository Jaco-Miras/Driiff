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
                        path={["/dashboard", "/posts", "/chat", "/chat/:cid", "/chat/:cid/:mid", "/files", "/people", "/settings", "/logout", "/logged-out"]}>
                        {children}
                    </Route>
                    <Route
                        {...props}
                        component={MainLayout}
                        path={["/workspace/dashboard", "/workspace/posts", "/workspace/chat", "/workspace/people", "/workspace/files", "/workspace/settings",
                        "/workspace/internal/:wsfolder/:wsfid/:wsname/:wsid/dashboard", "/workspace/internal/:wsfolder/:wsfid/:wsname/:wsid/posts", 
                        "/workspace/internal/:wsfolder/:wsfid/:wsname/:wsid/chat", "/workspace/internal/:wsfolder/:wsfid/:wsname/:wsid/files",
                        "/workspace/internal/:wsfolder/:wsfid/:wsname/:wsid/people", "/workspace/internal/:wsfolder/:wsfid/:wsname/:wsid/settings",
                        "/workspace/internal/:wsname/:wsid/dashboard", "/workspace/internal/:wsname/:wsid/posts", 
                        "/workspace/internal/:wsname/:wsid/chat", "/workspace/internal/:wsname/:wsid/files",
                        "/workspace/internal/:wsname/:wsid/people", "/workspace/internal/:wsname/:wsid/settings",
                        "/workspace/external/:wsfolder/:wsfid/:wsname/:wsid/dashboard", "/workspace/external/:wsfolder/:wsfid/:wsname/:wsid/posts", 
                        "/workspace/external/:wsfolder/:wsfid/:wsname/:wsid/chat", "/workspace/external/:wsfolder/:wsfid/:wsname/:wsid/files",
                        "/workspace/external/:wsfolder/:wsfid/:wsname/:wsid/people", "/workspace/external/:wsfolder/:wsfid/:wsname/:wsid/settings",
                        "/workspace/external/:wsname/:wsid/dashboard", "/workspace/external/:wsname/:wsid/posts", 
                        "/workspace/external/:wsname/:wsid/chat", "/workspace/external/:wsname/:wsid/files",
                        "/workspace/external/:wsname/:wsid/people", "/workspace/external/:wsname/:wsid/settings",]
                        }>
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