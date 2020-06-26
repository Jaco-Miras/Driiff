import React from "react";
import {Redirect, Route, Switch} from "react-router-dom";
import styled from "styled-components";
import {
    CompanyChatPanel,
    CompanyDashboardPanel,
    CompanyFilesPanel,
    CompanyPeoplePanel,
    CompanyPostsPanel,
    CompanySettingsPanel,
} from "../company";
import {UserProfilePanel} from "../user";
import {MainFooterPanel} from "./index";

const Wrapper = styled.div`
    padding-bottom: ${props => props.isOnWorkspace ? "0 !important" : "calc(1.875rem * 2)"};
`;

const MainContentPanel = (props) => {

    const {className = ""} = props;

    return (
        <Wrapper className={`main-content ${className}`} isOnWorkspace={props.match.params.page === "workspace"}>
            <Switch>
                <Route
                    {...props}
                    component={UserProfilePanel}
                    path={[
                        "/profile/:id/:name",
                        "/profile",
                    ]}/>
                <Route
                    {...props}
                    component={CompanyDashboardPanel}
                    path={["/dashboard"]}/>
                <Route
                    {...props}
                    component={CompanyPostsPanel}
                    path={["/posts"]}/>
                <Route
                    {...props}
                    component={CompanyChatPanel}
                    path={["/chat/:code?"]}/>
                <Route
                    {...props}
                    component={CompanyFilesPanel}
                    path={["/files"]}/>
                <Route
                    {...props}
                    component={CompanyPeoplePanel}
                    path={["/people"]}/>
                <Route
                    {...props}
                    component={CompanySettingsPanel}
                    path={["/settings"]}/>
                <Redirect
                    from="*"
                    to={{
                        pathname: "/workspace/dashboard",
                        state: {from: props.location},
                    }}/>
            </Switch>
            <MainFooterPanel/>
        </Wrapper>
    );
};

export default React.memo(MainContentPanel);