import React from "react";
import styled from "styled-components";
import AdminPanelSidebar from "./AdminPanelSidebar";
import AdminPanelBody from "./AdminPanelBody";
//import { Route, Switch, Redirect } from "react-router-dom";

const Wrapper = styled.div`
  overflow: hidden auto;
  .app-block {
    overflow: inherit;
    .app-content {
      height: auto;
    }
  }
`;

const AdminPanel = (props) => {
  return (
    <Wrapper className={"container-fluid h-100 fadeIn"}>
      <div className="row app-block">
        <AdminPanelSidebar />
        <div className="col-lg-9 app-content mb-4">
          <div className="app-content-overlay" />
          <AdminPanelBody />
          {/* <Switch>
            <Route {...props} component={AdminPanelBody} path={["/admin-settings/settings"]} />
            <Redirect
              from="*"
              to={{
                pathname: "/admin-settings/settings",
              }}
            />
          </Switch> */}
        </div>
      </div>
    </Wrapper>
  );
};

export default AdminPanel;
