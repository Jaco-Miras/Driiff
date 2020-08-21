import React from "react";
import {Redirect, Route, Switch} from "react-router-dom";
import styled from "styled-components";
import {
  CompanyChatPanel,
  CompanyDashboardPanel,
  CompanyFilesPanel,
  CompanyPageHeaderPanel,
  CompanyPeoplePanel,
  CompanyPostsPanel,
  CompanySettingsPanel
} from "../company";
import {UserNotificationPanel, UserProfilePanel, UserSearchPanel} from "../user";

const Wrapper = styled.div`
  padding-bottom: ${(props) => (props.isOnWorkspace ? "0 !important" : "calc(1.875rem * 2)")};
`;

const MainContentPanel = (props) => {
  const {className = "", isExternal, match} = props;

  return (
    <Wrapper className={`main-content ${className}`} isOnWorkspace={props.match.params.page === "workspace"}>

      {
        ["/dashboard", "/posts", "/chat", "/files", "/people"].includes(match.url) && <CompanyPageHeaderPanel />
      }

      <Switch>
        <Route {...props} component={UserProfilePanel} path={["/profile/:id/:name/:mode", "/profile/:id/:name", "/profile"]} />
        <Route {...props} component={UserNotificationPanel} path={["/notifications"]} />
        <Route {...props} component={UserSearchPanel} path={["/search"]} />
        {!isExternal && <Route {...props} component={CompanyDashboardPanel} path={["/dashboard"]}/>}
        {!isExternal &&
        <Route {...props} component={CompanyPostsPanel} path={["/posts/:postId/:postTitle", "/posts"]}/>}
        {!isExternal &&
        <Route {...props} component={CompanyChatPanel} path={["/chat/:code/:messageId", "/chat/:code?"]}/>}
        {!isExternal && <Route {...props} component={CompanyFilesPanel} path={["/files"]}/>}
        { !isExternal && <Route {...props} component={CompanyPeoplePanel} path={["/people"]} /> }
        <Route {...props} component={CompanySettingsPanel} path={["/settings"]} />
        <Redirect
          from="*"
          to={{
            pathname: "/workspace/chat",
            state: { from: props.location },
          }}
        />
      </Switch>
      {/* <MainFooterPanel /> */}
    </Wrapper>
  );
};

export default React.memo(MainContentPanel);
