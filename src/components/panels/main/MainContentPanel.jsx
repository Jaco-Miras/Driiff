import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { CompanyChatPanel, CompanyDashboardPanel, CompanyFilesPanel, CompanyPeoplePanel, CompanyPostsPanel, CompanySettingsPanel } from "../company";
import { UserNotificationPanel, UserProfilePanel, UserSearchPanel } from "../user";
import { SystemPeoplePanel } from "../system";
import { TodosPanel } from "../todos";
import { HuddlePanel } from "../bot";
import RedirectPanel from "../redirect/RedirectPanel";
import { ReleasesPanel } from "../news";

const Wrapper = styled.div`
  padding-bottom: ${(props) => (props.isOnWorkspace ? "0 !important" : "calc(1.875rem * 2)")};
`;

const MainContentPanel = (props) => {
  const { className = "", isExternal } = props;

  const loggedUser = useSelector((state) => state.session.user);

  const isOwner = loggedUser.role && loggedUser.role.name === "owner";

  return (
    <Wrapper className={`main-content ${className}`} isOnWorkspace={props.match.params.page === "workspace"}>
      <Switch>
        <Route {...props} component={UserProfilePanel} path={["/profile/:id/:name/:mode", "/profile/:id/:name", "/profile", "/profile/:id"]} exact={true} />
        <Route {...props} component={UserNotificationPanel} path={["/notifications"]} />
        <Route {...props} component={UserSearchPanel} path={["/search"]} />
        {!isExternal && <Route {...props} component={CompanyDashboardPanel} path={["/dashboard"]} />}
        {!isExternal && <Route {...props} component={CompanyPostsPanel} path={["/posts/:postId/:postTitle/:postCommentCode?", "/posts"]} />}
        {!isExternal && <Route {...props} component={CompanyChatPanel} path={["/chat/:code/:messageId", "/chat/:code", "/chat"]} />}
        <Route {...props} render={(props) => <CompanyFilesPanel {...props} />} path={["/files/folder/:folderId/:folderName", "/files"]} />
        {!isExternal && <Route {...props} component={CompanyPeoplePanel} path={["/people"]} />}
        {!isExternal && <Route {...props} component={SystemPeoplePanel} path={["/system/people"]} />}
        <Route {...props} component={CompanySettingsPanel} path={["/settings"]} />
        <Route {...props} component={TodosPanel} path={["/todos"]} />
        {isOwner && <Route {...props} component={HuddlePanel} path={["/bot"]} />}
        <Route {...props} component={RedirectPanel} path={["/magic-link/:token"]} />
        <Route {...props} component={ReleasesPanel} path={["/releases"]} />
        <Redirect
          from="*"
          to={{
            pathname: isExternal ? "/workspace/chat" : "/chat",
            state: { from: props.location },
          }}
        />
      </Switch>
      {/* <MainFooterPanel /> */}
    </Wrapper>
  );
};

export default React.memo(MainContentPanel);
