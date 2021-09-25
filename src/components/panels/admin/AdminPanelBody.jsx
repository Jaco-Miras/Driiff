import React from "react";
import styled from "styled-components";
import { Route, Switch, Redirect } from "react-router-dom";
import LoginSettingsBody from "./LoginSettingsBody";
import QuickLinksBody from "./QuickLinksBody";
import HuddleBotsBody from "./HuddleBotsBody";
import AutomationBody from "./AutomationBody";
import ContactBody from "./ContactBody";
import SupportBody from "./SupportBody";
import SubscriptionBody from "./SubscriptionBody";
//import SubscriptionBodyPlaceholder from "./SubscriptionBodyPlaceholder";

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
        <Route {...props} component={SubscriptionBody} path={["/admin-settings/subscription"]} />
        <Route {...props} component={ContactBody} path={["/admin-settings/contact"]} />
        <Route {...props} component={SupportBody} path={["/admin-settings/support"]} />
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
