import React from "react";
import { useDispatch } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
import styled from "styled-components";
import { addToModals } from "../../../redux/actions/globalActions";
import { SvgEmptyState } from "../../common";
import { useIsMember, useWorkspace, useUsers } from "../../hooks";
import { WorkspaceChatPanel, WorkspaceDashboardPanel, WorkspaceFilesPanel, WorkspacePageHeaderPanel, WorkspacePeoplePanel, WorkspacePostsPanel, WorkspaceSettingsPanel } from "../workspace";

const Wrapper = styled.div`
  position: relative;
  padding-bottom: 0 !important;
`;

const EmptyState = styled.div`
  height: 72vh;
  display: flex;
  align-items: center;
  justify-content: center;
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
  const { className = "", isExternal } = props;

  const dispatch = useDispatch();

  useUsers();
  const { actions, timeline, workspaces, workspacesLoaded, workspace } = useWorkspace();
  const isMember = useIsMember(workspace && workspace.member_ids.length ? workspace.member_ids : []);

  const handleShowWorkspaceModal = () => {
    let payload = {
      type: "workspace_create_edit",
      mode: "edit",
    };

    dispatch(addToModals(payload));
  };

  if (!workspacesLoaded) return <></>;

  return (
    <Wrapper className={`main-content h-100 ${className}`}>
      {Object.keys(workspaces).length >= 1 ? (
        <>
          <Route
            {...props}
            exact={true}
            render={(props) => <WorkspacePageHeaderPanel {...props} workspace={workspace} isMember={isMember} />}
            path={[
              "/workspace/:page/:folderId/:folderName/:workspaceId/:workspaceName/folder/:fileFolderId/:fileFolderName",
              "/workspace/:page/:workspaceId/:workspaceName/folder/:fileFolderId/:fileFolderName",
              "/workspace/:page/:folderId/:folderName/:workspaceId/:workspaceName/post/:postId/:postTitle",
              "/workspace/:page/:folderId/:folderName/:workspaceId/:workspaceName",
              "/workspace/:page/:workspaceId/:workspaceName/post/:postId/:postTitle",
              "/workspace/:page/:workspaceId/:workspaceName",
              "/workspace/:page",
            ]}
          />
          <Switch>
            <Route
              render={() => <WorkspaceDashboardPanel {...props} workspace={workspace} isMember={isMember} actions={actions} timeline={timeline}/>}
              path={["/workspace/dashboard/:folderId/:folderName/:workspaceId/:workspaceName", "/workspace/dashboard/:workspaceId/:workspaceName", "/workspace/dashboard"]}
            />
            <Route
              exact={true}
              render={() => <WorkspacePostsPanel {...props} workspace={workspace} isMember={isMember}/>}
              path={[
                "/workspace/posts/:folderId/:folderName/:workspaceId/:workspaceName/post/:postId/:postTitle",
                "/workspace/posts/:folderId/:folderName/:workspaceId/:workspaceName",
                "/workspace/posts/:workspaceId/:workspaceName/post/:postId/:postTitle",
                "/workspace/posts/:workspaceId/:workspaceName",
                "/workspace/posts",
              ]}
            />
            <Route render={() => <WorkspaceChatPanel {...props} workspace={workspace}/>} 
              path={["/workspace/chat/:folderId/:folderName/:workspaceId/:workspaceName", "/workspace/chat/:workspaceId/:workspaceName", "/workspace/chat"]} />
            <Route
              exact={true}
              {...props}
              render={(props) => <WorkspaceFilesPanel {...props} workspace={workspace} isMember={isMember} />}
              path={[
                "/workspace/files/:folderId/:folderName/:workspaceId/:workspaceName/folder/:fileFolderId/:fileFolderName",
                "/workspace/files/:workspaceId/:workspaceName/folder/:fileFolderId/:fileFolderName",
                "/workspace/files/:folderId/:folderName/:workspaceId/:workspaceName",
                "/workspace/files/:workspaceId/:workspaceName",
                "/workspace/files",
              ]}
            />
            <Route {...props} component={WorkspacePeoplePanel} path={["/workspace/people/:folderId/:folderName/:workspaceId/:workspaceName", "/workspace/people/:workspaceId/:workspaceName", "/workspace/people"]} />
            <Route {...props} component={WorkspaceSettingsPanel} path={["/workspace/settings/:folderId/:folderName/:workspaceId/:workspaceName", "/workspace/settings/:workspaceId/:workspaceName", "/workspace/settings"]} />
            <Redirect
              from="*"
              to={{
                pathname: "/workspace/chat",
                state: { from: props.location },
              }}
            />
          </Switch>
        </>
      ) : (
        <EmptyState>
          <div>
            <SvgEmptyState height={275} icon={1} />
            <h5>Start by creating a project.</h5>
            <button className="btn btn-primary" onClick={handleShowWorkspaceModal}>
              Create project
            </button>
          </div>
        </EmptyState>
      )}
    </Wrapper>
  );
};

export default React.memo(WorkspaceContentPanel);
