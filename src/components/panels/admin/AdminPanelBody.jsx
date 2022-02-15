import React from "react";
import styled from "styled-components";
import { Route, Switch, Redirect } from "react-router-dom";
import LoginSettingsBody from "./LoginSettingsBody";
import QuickLinksBody from "./QuickLinksBody";
import HuddleBotsBody from "./HuddleBotsBody";
import AutomationBody from "./AutomationBody";
//import ContactBody from "./ContactBody";
import SupportBody from "./SupportBody";
import StylingSettingsBody from "./StylingSettingsBody";
//import SubscriptionBody from "./SubscriptionBody";
import SubscriptionBodyPlaceholder from "./SubscriptionBodyPlaceholder";
//import PageSettingsBody from "./PageSettingsBody";
import SecuritySettingsBody from "./SecuritySettingsBody";

const Wrapper = styled.div`
  overflow: visible !important;
  height: 100%;
`;

const AdminPanelBody = (props) => {
  return (
    <Wrapper className={"card"}>
      <Switch>
        <Route {...props} component={AutomationBody} path={["/admin-settings/automation", "/admin-settings/automation/:subpage"]} />
        <Route {...props} component={LoginSettingsBody} path={["/admin-settings/settings"]} />
        <Route {...props} component={QuickLinksBody} path={["/admin-settings/quick-links"]} />
        <Route {...props} component={HuddleBotsBody} path={["/admin-settings/bots"]} />
        <Route {...props} component={SubscriptionBodyPlaceholder} path={["/admin-settings/subscription"]} />
        {/* <Route {...props} component={ContactBody} path={["/admin-settings/contact"]} /> */}
        <Route {...props} component={SupportBody} path={["/admin-settings/support"]} />
        <Route {...props} component={StylingSettingsBody} path={["/admin-settings/company-settings"]} />
        {/* <Route {...props} component={PageSettingsBody} path={["/admin-settings/page-settings"]} /> */}
        <Route {...props} component={SecuritySettingsBody} path={["/admin-settings/security-settings"]} />
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
