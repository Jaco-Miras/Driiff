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
                    path={["/workspace/dashboard", "/workspace/internal/:wsfolder/:wsfid/:wsname/:wsid/dashboard", 
                    "/workspace/internal/:wsname/:wsid/dashboard",
                    "/workspace/external/:wsfolder/:wsfid/:wsname/:wsid/dashboard",
                    "/workspace/external/:wsname/:wsid/dashboard"]}/>
                <Route
                    {...props}
                    component={WorkspacePostsPanel}
                    path={["/workspace/posts", "/workspace/internal/:wsfolder/:wsfid/:wsname/:wsid/posts", 
                    "/workspace/internal/:wsname/:wsid/posts",
                    "/workspace/external/:wsfolder/:wsfid/:wsname/:wsid/posts",
                    "/workspace/external/:wsname/:wsid/posts"]}/>
                <Route
                    {...props}
                    component={WorkspaceChatPanel}
                    path={["/workspace/chat", "/workspace/internal/:wsfolder/:wsfid/:wsname/:wsid/chat", 
                    "/workspace/internal/:wsname/:wsid/chat",
                    "/workspace/external/:wsfolder/:wsfid/:wsname/:wsid/chat",
                    "/workspace/external/:wsname/:wsid/chat"]}/>
                <Route
                    {...props}
                    component={WorkspaceFilesPanel}
                    path={["/workspace/files", "/workspace/internal/:wsfolder/:wsfid/:wsname/:wsid/files", 
                    "/workspace/internal/:wsname/:wsid/files",
                    "/workspace/external/:wsfolder/:wsfid/:wsname/:wsid/files",
                    "/workspace/external/:wsname/:wsid/files"]}/>
                <Route
                    {...props}
                    component={WorkspacePeoplePanel}
                    path={["/workspace/people", "/workspace/internal/:wsfolder/:wsfid/:wsname/:wsid/people", 
                    "/workspace/internal/:wsname/:wsid/people",
                    "/workspace/external/:wsfolder/:wsfid/:wsname/:wsid/people",
                    "/workspace/external/:wsname/:wsid/people"]}/>
                <Route
                    {...props}
                    component={WorkspaceSettingsPanel}
                    path={["/workspace/settings", "/workspace/internal/:wsfolder/:wsfid/:wsname/:wsid/settings", 
                    "/workspace/internal/:wsname/:wsid/settings",
                    "/workspace/external/:wsfolder/:wsfid/:wsname/:wsid/settings",
                    "/workspace/external/:wsname/:wsid/settings"]}/>
            </Switch>
            <MainFooterPanel/>
        </Wrapper>
    );
};

export default React.memo(MainContentPanel);