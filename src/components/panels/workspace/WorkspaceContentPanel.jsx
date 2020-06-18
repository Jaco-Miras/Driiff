import React from "react";
import {useDispatch} from "react-redux";
import {Redirect, Route, Switch} from "react-router-dom";
import styled from "styled-components";
import {addToModals} from "../../../redux/actions/globalActions";
import {SvgEmptyState} from "../../common";
import {useWorkspace} from "../../hooks";
import {
    WorkspaceChatPanel,
    WorkspaceDashboardPanel,
    WorkspaceFilesPanel,
    WorkspacePageHeaderPanel,
    WorkspacePeoplePanel,
    WorkspacePostsPanel,
    WorkspaceSettingsPanel,
} from "../workspace";

const Wrapper = styled.div`
    position: relative;
    padding-bottom: 0 !important;
    text-align: center;
`;

const EmptyState = styled.div`
    svg {
        display: block;
        margin: 0 auto 2rem;
        
        circle {
            fill: transparent;
        }
    }
    button {
        text-transform: uppercase;
    }
`;

const WorkspaceContentPanel = (props) => {

    const {className = ""} = props;
    const {workspaces, workspacesLoaded, workspace} = useWorkspace();
    const dispatch = useDispatch();

    const handleShowWorkspaceModal = () => {
        let payload = {
            type: "workspace_create_edit",
            mode: "create",
        };

        dispatch(
            addToModals(payload),
        );
    };

    if (!workspacesLoaded)
        return <></>;

    return (
        <Wrapper className={`main-content h-100 ${className}`}>
            {
                Object.keys(workspaces).length >= 1 ?
                <>
                    <Route
                        {...props}
                        exact={true}
                        render={(props) => <WorkspacePageHeaderPanel {...props} workspace={workspace}/>}
                        path={[
                            "/workspace/:page/:folderId/:folderName/:workspaceId/:workspaceName/folder/:fileFolderId/:fileFolderName",
                            "/workspace/:page/:workspaceId/:workspaceName/folder/:fileFolderId/:fileFolderName",
                            "/workspace/:page/:folderId/:folderName/:workspaceId/:workspaceName/post/:postId/:postTitle",
                            "/workspace/:page/:folderId/:folderName/:workspaceId/:workspaceName",
                            "/workspace/:page/:workspaceId/:workspaceName/post/:postId/:postTitle",
                            "/workspace/:page/:workspaceId/:workspaceName",
                            "/workspace/:page",
                        ]}/>
                    <Switch>
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
                </>
                                                    :
                <EmptyState>
                    <SvgEmptyState height={275} icon={1}/>
                    <h5>Start by creating a project.</h5>
                    <button className="btn btn-primary" onClick={handleShowWorkspaceModal}>Create</button>
                </EmptyState>
            }
        </Wrapper>
    );
};

export default React.memo(WorkspaceContentPanel);