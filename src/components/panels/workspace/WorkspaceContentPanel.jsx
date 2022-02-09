import React, { Suspense, lazy } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
import styled from "styled-components";
import { addToModals } from "../../../redux/actions/globalActions";
import { SvgEmptyState } from "../../common";
import { useIsMember, useTranslationActions, useUsers, useWorkspaceActions, useShowDashboardModal } from "../../hooks";
import MaintenancePanel from "../main/MaintenancePanel";
const WorkspaceChatPanel = lazy(() => import("../workspace/WorkspaceChatPanel"));
const WorkspaceDashboardPanel = lazy(() => import("../workspace/WorkspaceDashboardPanel"));
const WorkspaceFilesPanel = lazy(() => import("../workspace/WorkspaceFilesPanel"));
const WorkspacePeoplePanel = lazy(() => import("../workspace/WorkspacePeoplePanel"));
const WorkspacePostsPanel = lazy(() => import("../workspace/WorkspacePostsPanel"));
const WorkspaceRemindersPanel = lazy(() => import("../workspace/WorkspaceRemindersPanel"));
const WorkspaceSettingsPanel = lazy(() => import("../workspace/WorkspaceSettingsPanel"));
const AllWorkspace = lazy(() => import("./AllWorkspace"));

const Wrapper = styled.div`
  position: relative;
  //padding-bottom: 0 !important;
  // overflow: hidden;
  overflow: auto;

  .spinner-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 45vw;

    .spinner-border {
      color: ${(props) => props.theme.colors.primary};
    }
  }
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
  const { _t } = useTranslationActions();

  const dictionary = {
    createWorkspace: _t("WORKSPACE.CREATE_WORKSPACE", "Create workspace"),
    sidebarTextCreateWorkspace: _t("WORKSPACE.TEXT_CREATE_WORKSPACE", "Create workspace"),
  };

  const dispatch = useDispatch();

  useShowDashboardModal();

  const { loggedUser } = useUsers();
  const actions = useWorkspaceActions();
  const { workspaces, workspacesLoaded, favoriteWorkspacesLoaded, activeTopic: workspace, workspaceTimeline } = useSelector((state) => state.workspaces);
  let timeline = null;
  if (Object.keys(workspaceTimeline).length && workspace && workspaceTimeline[workspace.id]) {
    timeline = workspaceTimeline[workspace.id];
  }
  const workspaceMembers = workspace
    ? workspace.members
        .map((m) => {
          if (m.member_ids) {
            return m.member_ids;
          } else return m.id;
        })
        .flat()
    : [];

  const isMember = useIsMember(workspace && workspace.member_ids.length ? [...new Set(workspaceMembers)] : []);

  const handleShowWorkspaceModal = () => {
    let payload = {
      type: "workspace_create_edit",
      mode: "add",
    };

    dispatch(addToModals(payload));
  };

  return (
    <Wrapper className={`main-content ${className}`}>
      {!workspacesLoaded && !favoriteWorkspacesLoaded ? (
        <div className="spinner-container">
          <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true" />
        </div>
      ) : (
        <>
          {Object.keys(workspaces).length >= 1 ? (
            <>
              <Suspense fallback={<div></div>}>
                <Switch>
                  <Route render={(props) => <AllWorkspace isExternal={isExternal} {...props} />} path={["/workspace/search"]} />
                  {/* <Route render={(props) => <WorkspaceSearchPanel isExternal={isExternal} {...props} />} path={["/workspace/search"]} /> */}
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
                  <Route
                    exact={true}
                    render={() => <WorkspaceChatPanel {...props} workspace={workspace} />}
                    path={["/workspace/chat/:folderId/:folderName/:workspaceId/:workspaceName", "/workspace/chat/:workspaceId/:workspaceName", "/workspace/chat"]}
                  />
                  {!isExternal && (
                    <Route
                      exact={true}
                      render={() => <WorkspaceChatPanel {...props} workspace={workspace} />}
                      path={[
                        "/workspace/chat/:folderId/:folderName/:workspaceId/:workspaceName",
                        "/workspace/chat/:workspaceId/:workspaceName",
                        "/workspace/team-chat/:folderId/:folderName/:workspaceId/:workspaceName",
                        "/workspace/team-chat/:workspaceId/:workspaceName",
                        "/workspace/chat",
                      ]}
                    />
                  )}
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
                  <Route
                    render={() => <WorkspaceRemindersPanel {...props} workspace={workspace} isMember={isMember} />}
                    path={["/workspace/reminders/:folderId/:folderName/:workspaceId/:workspaceName", "/workspace/reminders/:workspaceId/:workspaceName", "/workspace/reminders"]}
                  />
                  <Route {...props} component={WorkspaceSettingsPanel} path={["/workspace/settings/:folderId/:folderName/:workspaceId/:workspaceName", "/workspace/settings/:workspaceId/:workspaceName", "/workspace/settings"]} />
                  <Redirect
                    from="*"
                    to={{
                      pathname: "/workspace/chat",
                      state: { from: props.location },
                    }}
                  />
                </Switch>
              </Suspense>
            </>
          ) : (
            <EmptyState>
              <div>
                <SvgEmptyState height={275} icon={1} />
                {loggedUser.type !== "external" && (
                  <>
                    <h5>{dictionary.sidebarTextCreateWorkspace}</h5>
                    <button className="btn btn-primary" onClick={handleShowWorkspaceModal}>
                      {dictionary.createWorkspace}
                    </button>
                  </>
                )}
              </div>
            </EmptyState>
          )}
        </>
      )}
    </Wrapper>
  );
};

export default React.memo(WorkspaceContentPanel);
