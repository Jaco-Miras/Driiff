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
                    path={["/workspace/dashboard", "/workspace/posts", "/workspace/chat", "/workspace/people", "/workspace/files", "/workspace/settings"]}/>
            </Switch>
        </Wrapper>
    );
};

export default React.memo(MainHeaderPanel);