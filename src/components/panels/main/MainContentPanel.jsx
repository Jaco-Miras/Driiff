import React, { Suspense, lazy } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import styled from "styled-components";
import { useSelector } from "react-redux";
import RedirectPanel from "../redirect/RedirectPanel";
//import MaintenancePanel from "./MaintenancePanel";
import DashboardPanel from "../dashboard/DashboardPanel";
const CompanyChatPanel = lazy(() => import("../company/CompanyChatPanel"));
//const CompanyDashboardPanel = lazy(() => import("../company/CompanyDashboardPanel"));
const CompanyFilesPanel = lazy(() => import("../company/CompanyFilesPanel"));
const CompanyPeoplePanel = lazy(() => import("../company/CompanyPeoplePanel"));
const CompanyPostsPanel = lazy(() => import("../company/CompanyPostsPanel"));
const CompanySettingsPanel = lazy(() => import("../company/CompanySettingsPanel"));
const TodosPanel = lazy(() => import("../todos/TodosPanel"));
const SystemPeoplePanel = lazy(() => import("../system/SystemPeoplePanel"));
const ReleasesPanel = lazy(() => import("../news/ReleasesPanel"));
const UserNotificationPanel = lazy(() => import("../user/UserNotificationPanel"));
const UserProfilePanel = lazy(() => import("../user/UserProfilePanel"));
const UserSearchPanel = lazy(() => import("../user/UserSearchPanel"));
const AdminPanel = lazy(() => import("../../panels/admin/AdminPanel"));
const MeetingPanel = lazy(() => import("../meeting/MeetingPanel"));

const Wrapper = styled.div`
  padding-bottom: ${(props) => (props.isOnWorkspace ? "0 !important" : "calc(1.875rem * 2)")};
`;

const MainContentPanel = (props) => {
  const { className = "", isExternal } = props;

  const loggedUser = useSelector((state) => state.session.user);

  const isAdmin = loggedUser.role && loggedUser.role.id <= 1;

  return (
    <Wrapper className={`main-content ${className}`} isOnWorkspace={props.match.params.page === "workspace"}>
      <Suspense fallback={<div></div>}>
        <Switch>
          <Route {...props} component={UserProfilePanel} path={["/profile/:id/:name/:mode", "/profile/:id/:name", "/profile", "/profile/:id"]} exact={true} />
          <Route {...props} component={UserNotificationPanel} path={["/notifications"]} />
          <Route {...props} component={UserSearchPanel} path={["/search"]} />
          {!isExternal && <Route {...props} component={DashboardPanel} path={["/dashboard"]} />}
          {!isExternal && <Route {...props} component={CompanyPostsPanel} path={["/posts/:postId/:postTitle/:postCommentCode?", "/posts"]} />}
          {!isExternal && <Route {...props} component={CompanyChatPanel} path={["/chat/:code/:messageId", "/chat/:code", "/chat"]} />}
          <Route {...props} render={(props) => <CompanyFilesPanel {...props} />} path={["/files/folder/:folderId/:folderName", "/files"]} />
          {!isExternal && <Route {...props} component={CompanyPeoplePanel} path={["/people"]} />}
          {!isExternal && (
            <Route
              {...props}
              component={SystemPeoplePanel}
              path={[
                "/system/people/all/online",
                "/system/people/all",
                "/system/people/inactive",
                "/system/people/invited",
                "/system/people/guest",
                "/system/people/teams",
                "/system/people/organization",
                "/system/people/teams/:teamId/:teamName",
              ]}
            />
          )}
          <Route {...props} component={CompanySettingsPanel} path={["/settings"]} />
          <Route {...props} component={TodosPanel} path={["/todos"]} />
          <Route {...props} component={MeetingPanel} path={["/meetings"]} />
          {/* {isOwner && <Route {...props} component={HuddlePanel} path={["/bot"]} />} */}
          <Route {...props} component={RedirectPanel} path={["/magic-link/:token"]} />
          <Route {...props} component={ReleasesPanel} path={["/releases"]} />
         {/*  <Route {...props} component={VideoContainer} path={["/video-meeting"]} /> */}
          {/* {!isExternal && <Route {...props} component={ZoomPanel} path={["/zoom/:channelId", "/zoom"]} />} */}
          {isAdmin && <Route {...props} component={AdminPanel} path={["/admin-settings", "/admin-settings/:page", "/admin-settings/:page/:subpage"]} />}
          <Redirect
            from="*"
            to={{
              pathname: isExternal ? "/workspace/chat" : "/dashboard",
              state: { from: props.location },
            }}
          />
        </Switch>
      </Suspense>
      {/* <MainFooterPanel /> */}
    </Wrapper>
  );
};

export default React.memo(MainContentPanel);
