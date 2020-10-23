import React from "react";
import {useDispatch} from "react-redux";
import {Redirect, Route, Switch} from "react-router-dom";
import styled from "styled-components";
import {addToModals} from "../../../redux/actions/globalActions";
import {SvgEmptyState} from "../../common";
import {useIsMember, useTranslation, useUsers, useWorkspace} from "../../hooks";
import {
  WorkspaceChatPanel,
  WorkspaceDashboardPanel,
  WorkspaceFilesPanel,
  WorkspacePeoplePanel,
  WorkspacePostsPanel,
  WorkspaceSearchPanel,
  WorkspaceSettingsPanel
} from "../workspace";

const Wrapper = styled.div`
  position: relative;
  padding-bottom: 0 !important;
  overflow: hidden;
`;

const EmptyState = styled.div`
  height: 72vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;

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

  const {_t} = useTranslation();

  const dictionary = {
    createWorkspace: _t("WORKSPACE.CREATE_WORKSPACE", "Create workspace"),
    sidebarTextCreateWorkspace: _t("WORKSPACE.TEXT_CREATE_WORKSPACE", "Create workspace"),
  };

  const dispatch = useDispatch();

  useUsers();
  const { actions, timeline, workspaces, workspacesLoaded, workspace } = useWorkspace();
  const isMember = useIsMember(workspace && workspace.member_ids.length ? workspace.member_ids : []);

  const handleShowWorkspaceModal = () => {
    let payload = {
      type: "workspace_create_edit",
      mode: "add",
    };

    dispatch(addToModals(payload));
  };

  return (
    <Wrapper className={`main-content h-100 ${className}`}>
      {!workspacesLoaded ? (
        <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true" />
      ) : (
        <>
          {Object.keys(workspaces).length >= 1 ? (
            <>
              <Switch>
                <Route render={(props) => <WorkspaceSearchPanel isExternal={isExternal} {...props} />} path={["/workspace/search"]} />
                <Route
                  render={() => <WorkspaceDashboardPanel {...props} workspace={workspace} isMember={isMember} actions={actions} workspaceTimeline={timeline} />}
                  path={["/workspace/dashboard/:folderId/:folderName/:workspaceId/:workspaceName", "/workspace/dashboard/:workspaceId/:workspaceName", "/workspace/dashboard"]}
                />
                <Route
                  exact={true}
                  render={() => <WorkspacePostsPanel {...props} workspace={workspace} isMember={isMember} />}
                  path={[
                    "/workspace/posts/:folderId/:folderName/:workspaceId/:workspaceName/post/:postId/:postTitle",
                    "/workspace/posts/:folderId/:folderName/:workspaceId/:workspaceName",
                    "/workspace/posts/:workspaceId/:workspaceName/post/:postId/:postTitle/:postCommentCode?",
                    "/workspace/posts/:workspaceId/:workspaceName",
                    "/workspace/posts",
                  ]}
                />
                <Route render={() => <WorkspaceChatPanel {...props} workspace={workspace} />} path={["/workspace/chat/:folderId/:folderName/:workspaceId/:workspaceName", "/workspace/chat/:workspaceId/:workspaceName", "/workspace/chat"]} />
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
                <Route
                  render={() => <WorkspacePeoplePanel {...props} workspace={workspace} isMember={isMember} />}
                  path={["/workspace/people/:folderId/:folderName/:workspaceId/:workspaceName", "/workspace/people/:workspaceId/:workspaceName", "/workspace/people"]}
                />
                <Route {...props} component={WorkspaceSettingsPanel} path={["/workspace/settings/:folderId/:folderName/:workspaceId/:workspaceName", "/workspace/settings/:workspaceId/:workspaceName", "/workspace/settings"]} />
                <Redirect
                  from="*"
                  to={{
                    pathname: "/workspace",
                    state: { from: props.location },
                  }}
                />
              </Switch>
            </>
          ) : (
            <EmptyState>
              <div>
                <SvgEmptyState height={275} icon={1} />
                <h5>{dictionary.sidebarTextCreateWorkspace}</h5>
                <button className="btn btn-primary" onClick={handleShowWorkspaceModal}>
                  {dictionary.createWorkspace}
                </button>
              </div>
            </EmptyState>
          )}
        </>
      )}
    </Wrapper>
  );
};

export default React.memo(WorkspaceContentPanel);
