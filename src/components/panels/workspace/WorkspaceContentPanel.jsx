import React, { Suspense, lazy } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
import styled from "styled-components";
import { addToModals } from "../../../redux/actions/globalActions";
import { SvgEmptyState } from "../../common";
import { useIsMember, useTranslationActions, useUsers } from "../../hooks";
//import MaintenancePanel from "../main/MaintenancePanel";
import WsDashboardPanel from "../dashboard/WsDashboardPanel";
const WorkspaceChatPanel = lazy(() => import("../workspace/WorkspaceChatPanel"));
//const WorkspaceDashboardPanel = lazy(() => import("../workspace/WorkspaceDashboardPanel"));
const WorkspaceFilesPanel = lazy(() => import("../workspace/WorkspaceFilesPanel"));
const WorkspacePeoplePanel = lazy(() => import("../workspace/WorkspacePeoplePanel"));
const WorkspacePostsPanel = lazy(() => import("../workspace/WorkspacePostsPanel"));
const WorkspaceRemindersPanel = lazy(() => import("../workspace/WorkspaceRemindersPanel"));
const WorkspaceSettingsPanel = lazy(() => import("../workspace/WorkspaceSettingsPanel"));
const WorkspaceWorkInProgressPanel = lazy(() => import("../workspace/WorkspaceWorkInProgressPanel"));
const AllWorkspace = lazy(() => import("./AllWorkspace"));
const MeetingPanel = lazy(() => import("../meeting/MeetingPanel"));

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

  //useShowDashboardModal();

  const { loggedUser } = useUsers();
  //const actions = useWorkspaceActions();
  const { workspaces, workspacesLoaded, favoriteWorkspacesLoaded, activeTopic: workspace, workspaceTimeline } = useSelector((state) => state.workspaces);
  // let timeline = null;
  // if (Object.keys(workspaceTimeline).length && workspace && workspaceTimeline[workspace.id]) {
  //   timeline = workspaceTimeline[workspace.id];
  // }
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
                  <Route render={(props) => <AllWorkspace isExternal={isExternal} {...props} />} path={["/hub/search", "/shared-hub/search"]} />
                  {/* <Route render={(props) => <WorkspaceSearchPanel isExternal={isExternal} {...props} />} path={["/hub/search"]} /> */}
                  <Route
                    render={() => <WsDashboardPanel {...props} />}
                    path={[
                      "/hub/dashboard/:folderId/:folderName/:workspaceId/:workspaceName",
                      "/hub/dashboard/:workspaceId/:workspaceName",
                      "/hub/dashboard",
                      "/shared-hub/dashboard/:folderId/:folderName/:workspaceId/:workspaceName",
                      "/shared-hub/dashboard/:workspaceId/:workspaceName",
                      "/shared-hub/dashboard",
                    ]}
                  />
                  <Route
                    exact={true}
                    render={() => <WorkspacePostsPanel {...props} workspace={workspace} isMember={isMember} />}
                    path={[
                      "/hub/posts/:folderId/:folderName/:workspaceId/:workspaceName/post/:postId/:postTitle",
                      "/hub/posts/:folderId/:folderName/:workspaceId/:workspaceName",
                      "/hub/posts/:workspaceId/:workspaceName/post/:postId/:postTitle/:postCommentCode?",
                      "/hub/posts/:workspaceId/:workspaceName",
                      "/hub/posts",
                      "/shared-hub/posts/:folderId/:folderName/:workspaceId/:workspaceName/post/:postId/:postTitle",
                      "/shared-hub/posts/:folderId/:folderName/:workspaceId/:workspaceName",
                      "/shared-hub/posts/:workspaceId/:workspaceName/post/:postId/:postTitle/:postCommentCode?",
                      "/shared-hub/posts/:workspaceId/:workspaceName",
                      "/shared-hub/posts",
                    ]}
                  />
                  <Route
                    exact={true}
                    render={() => <WorkspaceChatPanel {...props} workspace={workspace} />}
                    path={[
                      "/hub/chat/:folderId/:folderName/:workspaceId/:workspaceName",
                      "/hub/chat/:workspaceId/:workspaceName",
                      "/hub/chat",
                      "/shared-hub/chat/:folderId/:folderName/:workspaceId/:workspaceName",
                      "/shared-hub/chat/:workspaceId/:workspaceName",
                      "/shared-hub/chat",
                    ]}
                  />
                  {!isExternal && (
                    <Route
                      exact={true}
                      render={() => <WorkspaceChatPanel {...props} workspace={workspace} />}
                      path={[
                        "/hub/chat/:folderId/:folderName/:workspaceId/:workspaceName",
                        "/hub/chat/:workspaceId/:workspaceName",
                        "/hub/team-chat/:folderId/:folderName/:workspaceId/:workspaceName",
                        "/hub/team-chat/:workspaceId/:workspaceName",
                        "/hub/chat",
                        "/shared-hub/chat/:folderId/:folderName/:workspaceId/:workspaceName",
                        "/shared-hub/chat/:workspaceId/:workspaceName",
                        "/shared-hub/team-chat/:folderId/:folderName/:workspaceId/:workspaceName",
                        "/shared-hub/team-chat/:workspaceId/:workspaceName",
                        "/shared-hub/chat",
                      ]}
                    />
                  )}
                  <Route
                    exact={true}
                    {...props}
                    render={(props) => <WorkspaceFilesPanel {...props} workspace={workspace} isMember={isMember} />}
                    path={[
                      "/hub/files/:folderId/:folderName/:workspaceId/:workspaceName/folder/:fileFolderId/:fileFolderName",
                      "/hub/files/:workspaceId/:workspaceName/folder/:fileFolderId/:fileFolderName",
                      "/hub/files/:folderId/:folderName/:workspaceId/:workspaceName",
                      "/hub/files/:workspaceId/:workspaceName",
                      "/hub/files",
                      "/shared-hub/files/:folderId/:folderName/:workspaceId/:workspaceName/folder/:fileFolderId/:fileFolderName",
                      "/shared-hub/files/:workspaceId/:workspaceName/folder/:fileFolderId/:fileFolderName",
                      "/shared-hub/files/:folderId/:folderName/:workspaceId/:workspaceName",
                      "/shared-hub/files/:workspaceId/:workspaceName",
                      "/shared-hub/files",
                    ]}
                  />
                  <Route
                    render={() => <WorkspacePeoplePanel {...props} workspace={workspace} isMember={isMember} />}
                    path={[
                      "/hub/people/:folderId/:folderName/:workspaceId/:workspaceName",
                      "/hub/people/:workspaceId/:workspaceName",
                      "/hub/people",
                      "/shared-hub/people/:folderId/:folderName/:workspaceId/:workspaceName",
                      "/shared-hub/people/:workspaceId/:workspaceName",
                      "/shared-hub/people",
                    ]}
                  />
                  <Route
                    render={() => <WorkspaceRemindersPanel {...props} workspace={workspace} isMember={isMember} />}
                    path={[
                      "/hub/reminders/:folderId/:folderName/:workspaceId/:workspaceName",
                      "/hub/reminders/:workspaceId/:workspaceName",
                      "/hub/reminders",
                      "/shared-hub/reminders/:folderId/:folderName/:workspaceId/:workspaceName",
                      "/shared-hub/reminders/:workspaceId/:workspaceName",
                      "/shared-hub/reminders",
                    ]}
                  />
                  <Route
                    {...props}
                    component={WorkspaceSettingsPanel}
                    path={[
                      "/hub/settings/:folderId/:folderName/:workspaceId/:workspaceName",
                      "/hub/settings/:workspaceId/:workspaceName",
                      "/hub/settings",
                      "/shared-hub/settings/:folderId/:folderName/:workspaceId/:workspaceName",
                      "/shared-hub/settings/:workspaceId/:workspaceName",
                      "/shared-hub/settings",
                    ]}
                  />
                  <Route
                    exact={true}
                    render={() => <WorkspaceWorkInProgressPanel {...props} workspace={workspace} isMember={isMember} />}
                    path={[
                      "/hub/wip/:folderId/:folderName/:workspaceId/:workspaceName/wip/:wipId/:wipTitle/file/:wipFileId/:wipFileVersion",
                      "/hub/wip/:folderId/:folderName/:workspaceId/:workspaceName/wip/:wipId/:wipTitle",
                      "/hub/wip/:folderId/:folderName/:workspaceId/:workspaceName",
                      "/hub/wip/:workspaceId/:workspaceName/wip/:wipId/:wipTitle/file/:wipFileId/:wipFileVersion",
                      "/hub/wip/:workspaceId/:workspaceName/wip/:wipId/:wipTitle",
                      "/hub/wip/:workspaceId/:workspaceName",
                      "/hub/wip",
                    ]}
                  />
                  <Route render={() => <MeetingPanel {...props} isWorkspace={true} />} path={["/hub/meetings/:folderId/:folderName/:workspaceId/:workspaceName", "/hub/meetings/:workspaceId/:workspaceName", "/hub/meetings"]} />
                  <Route {...props} component={WorkspaceSettingsPanel} path={["/hub/settings/:folderId/:folderName/:workspaceId/:workspaceName", "/hub/settings/:workspaceId/:workspaceName", "/hub/settings"]} />
                  <Redirect
                    from="*"
                    to={{
                      pathname: "/hub/search",
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
