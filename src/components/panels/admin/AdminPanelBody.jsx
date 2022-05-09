import React from "react";
import styled from "styled-components";
import { Route, Switch, Redirect } from "react-router-dom";
import LoginSettingsBody from "./LoginSettingsBody";
import QuickLinksBody from "./QuickLinksBody";
import HuddleBotsBody from "./HuddleBotsBody";
import AutomationBody from "./AutomationBody";
import SupportBody from "./SupportBody";
import SubscriptionBody from "./SubscriptionBody";
import StylingSettingsBody from "./StylingSettingsBody";
import SecuritySettingsBody from "./SecuritySettingsBody";
import WorkspaceBody from "./WorkspacesBody";
import DriffBody from "./DriffBody";
import ImpersonationSettingsBody from "./ImpersonationSettingsBody";

const Wrapper = styled.div`
  overflow: visible !important;
  height: 100%;
`;

const AdminPanelBody = (props) => {
  return (
    <Wrapper className={"card"}>
      <Switch>
        <Route {...props} component={WorkspaceBody} path={["/admin-settings/workspaces"]} />
        <Route {...props} component={AutomationBody} path={["/admin-settings/automation", "/admin-settings/automation/:subpage"]} />
        <Route {...props} component={LoginSettingsBody} path={["/admin-settings/settings"]} />
        <Route {...props} component={QuickLinksBody} path={["/admin-settings/quick-links"]} />
        <Route {...props} component={HuddleBotsBody} path={["/admin-settings/bots"]} />
        <Route {...props} component={SubscriptionBody} path={["/admin-settings/subscription"]} />
        <Route {...props} component={SupportBody} path={["/admin-settings/support"]} />
        <Route {...props} component={StylingSettingsBody} path={["/admin-settings/company"]} />
        {/* <Route {...props} component={PageSettingsBody} path={["/admin-settings/page-settings"]} /> */}
        <Route {...props} component={ImpersonationSettingsBody} path={["/admin-settings/impersonation"]} />
        <Route {...props} component={SecuritySettingsBody} path={["/admin-settings/security"]} />
        <Route {...props} component={DriffBody} path={["/admin-settings/driff"]} />
        <Redirect
          from="*"
          to={{
            pathname: "/admin-settings/settings",
          }}
        />
      </Switch>
    </Wrapper>
  );
};

export default AdminPanelBody;
