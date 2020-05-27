import React from "react";
import {Route, Switch} from "react-router-dom";
import styled from "styled-components";
import {CompanyHeaderPanel} from "../company";
import {WorkspaceHeaderPanel} from "../workspace";

const Wrapper = styled.div`
`;

const MainHeaderPanel = (props) => {

    const {className = ""} = props;

    return (
        <Wrapper className={`header ${className}`}>
            <Switch>
                <Route
                    {...props}
                    component={CompanyHeaderPanel}
                    path={["/dashboard", "/posts", "/chat", "/people", "/files", "/settings"]}/>
                <Route
                    {...props}
                    component={WorkspaceHeaderPanel}
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
                    "/workspace/external/:wsname/:wsid/people", "/workspace/external/:wsname/:wsid/settings"]}/>
            </Switch>
        </Wrapper>
    );
};

export default React.memo(MainHeaderPanel);