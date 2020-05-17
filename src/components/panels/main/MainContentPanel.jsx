import React from "react";
import {Route, Switch} from "react-router-dom";
import styled from "styled-components";
import {
    CompanyChatPanel,
    CompanyDashboardPanel,
    CompanyFilesPanel,
    CompanyPeoplePanel,
    CompanyPostsPanel,
    CompanySettingsPanel,
} from "../company";
import {
    WorkspaceChatPanel,
    WorkspaceDashboardPanel,
    WorkspaceFilesPanel,
    WorkspacePageHeaderPanel,
    WorkspacePeoplePanel,
    WorkspacePostsPanel,
    WorkspaceSettingsPanel,
} from "../workspace";
import {MainFooterPanel} from "./index";

const Wrapper = styled.div`
`;

const MainContentPanel = (props) => {

    const {className = ""} = props;

    return (
        <Wrapper className={`main-content ${className}`}>
            <Switch>
                <Route
                    {...props}
                    component={WorkspacePageHeaderPanel}
                    path={["/workspace/dashboard", "/workspace/posts", "/workspace/chat", "/workspace/files",
                        "/workspace/people", "/workspace/settings"]}/>
            </Switch>
            <Switch>
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
                    path={["/chat"]}/>
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
                <Route
                    {...props}
                    component={WorkspaceDashboardPanel}
                    path={["/workspace/dashboard"]}/>
                <Route
                    {...props}
                    component={WorkspacePostsPanel}
                    path={["/workspace/posts"]}/>
                <Route
                    {...props}
                    component={WorkspaceChatPanel}
                    path={["/workspace/chat"]}/>
                <Route
                    {...props}
                    component={WorkspaceFilesPanel}
                    path={["/workspace/files"]}/>
                <Route
                    {...props}
                    component={WorkspacePeoplePanel}
                    path={["/workspace/people"]}/>
                <Route
                    {...props}
                    component={WorkspaceSettingsPanel}
                    path={["/workspace/settings"]}/>
            </Switch>
            <MainFooterPanel/>
        </Wrapper>
    );
};

export default React.memo(MainContentPanel);