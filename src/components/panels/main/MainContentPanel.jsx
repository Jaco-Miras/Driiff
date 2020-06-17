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
    padding-bottom: ${props => props.isOnWorkspace ? "calc(1.875rem * 4)!important" : "calc(1.875rem * 2)"};
`;

const MainContentPanel = (props) => {

    const {className = ""} = props;

    return (
        <Wrapper className={`main-content ${className}`} isOnWorkspace={props.match.params.page === "workspace"}>
            <Switch>
                <Route
                    exact={true}
                    {...props}
                    component={WorkspacePageHeaderPanel}
                    path={[
                        "/workspace/:page/:folderId/:folderName/:workspaceId/:workspaceName/folder/:fileFolderId/:fileFolderName",
                        "/workspace/:page/:workspaceId/:workspaceName/folder/:fileFolderId/:fileFolderName",
                        "/workspace/:page/:folderId/:folderName/:workspaceId/:workspaceName/post/:postId/:postTitle",
                        "/workspace/:page/:folderId/:folderName/:workspaceId/:workspaceName",
                        "/workspace/:page/:workspaceId/:workspaceName/post/:postId/:postTitle",
                        "/workspace/:page/:workspaceId/:workspaceName",
                        "/workspace/:page",
                    ]}/>
            </Switch>
            <Switch>
                <Route
                    {...props}
                    component={UserProfilePanel}
                    path={[
                        "/profile/:id/:name",
                        "/profile"
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
                <Route
                    {...props}
                    component={WorkspaceDashboardPanel}
                    path={[
                        "/workspace/dashboard/:folderId/:folderName/:workspaceId/:workspaceName",
                        "/workspace/dashboard/:workspaceId/:workspaceName",
                        "/workspace/dashboard",
                    ]}/>
                <Route
                    exact={true}
                    {...props}
                    component={WorkspacePostsPanel}
                    path={[
                        "/workspace/posts/:folderId/:folderName/:workspaceId/:workspaceName/post/:postId/:postTitle",
                        "/workspace/posts/:folderId/:folderName/:workspaceId/:workspaceName",
                        "/workspace/posts/:workspaceId/:workspaceName/post/:postId/:postTitle",
                        "/workspace/posts/:workspaceId/:workspaceName",
                        "/workspace/posts",
                    ]}/>
                <Route
                    {...props}
                    component={WorkspaceChatPanel}
                    path={[
                        "/workspace/chat/:folderId/:folderName/:workspaceId/:workspaceName",
                        "/workspace/chat/:workspaceId/:workspaceName",
                        "/workspace/chat",
                    ]}/>
                <Route
                    exact={true}
                    {...props}
                    component={WorkspaceFilesPanel}
                    path={[
                        "/workspace/files/:folderId/:folderName/:workspaceId/:workspaceName/folder/:fileFolderId/:fileFolderName",
                        "/workspace/files/:workspaceId/:workspaceName/folder/:fileFolderId/:fileFolderName",
                        "/workspace/files/:folderId/:folderName/:workspaceId/:workspaceName",
                        "/workspace/files/:workspaceId/:workspaceName",
                        "/workspace/files",
                    ]}/>
                <Route
                    {...props}
                    component={WorkspacePeoplePanel}
                    path={[
                        "/workspace/people/:folderId/:folderName/:workspaceId/:workspaceName",
                        "/workspace/people/:workspaceId/:workspaceName",
                        "/workspace/people",
                    ]}/>
                <Route
                    {...props}
                    component={WorkspaceSettingsPanel}
                    path={[
                        "/workspace/settings/:folderId/:folderName/:workspaceId/:workspaceName",
                        "/workspace/settings/:workspaceId/:workspaceName",
                        "/workspace/settings",
                    ]}/>
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