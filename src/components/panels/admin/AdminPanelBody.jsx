import React from "react";
import styled from "styled-components";
import { Route, Switch, Redirect } from "react-router-dom";
import LoginSettingsBody from "./LoginSettingsBody";
import QuickLinksBody from "./QuickLinksBody";
import HuddleBotsBody from "./HuddleBotsBody";

const Wrapper = styled.div`
  overflow: visible !important;
  height: 100%;
`;

const AdminPanelBody = (props) => {
  //const params = useParams();
  // console.log(params);
  return (
    <Wrapper className={"card"}>
      <Switch>
        <Route {...props} component={LoginSettingsBody} path={["/admin-settings/settings"]} />
        <Route {...props} component={QuickLinksBody} path={["/admin-settings/quick-links"]} />
        <Route {...props} component={HuddleBotsBody} path={["/admin-settings/bots"]} />
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
