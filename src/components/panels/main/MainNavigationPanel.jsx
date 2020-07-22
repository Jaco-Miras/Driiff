import React from "react";
import { Route } from "react-router-dom";
import styled from "styled-components";
import { WorkspaceNavigationMenuBodyPanel } from "../workspace";
import { MainNavigationTabPanel } from "./index";

const Wrapper = styled.div``;

const MainNavigationPanel = (props) => {
  const { className = "" } = props;

  return (
    <Wrapper className={`navigation ${className}`}>
      <Route render={() => <MainNavigationTabPanel {...props}/>} path={["/:page"]} />
      <Route
        exact={true}
        {...props}
        component={WorkspaceNavigationMenuBodyPanel}
        path={[
          "/workspace/:page/:folderId/:folderName/:workspaceId/:workspaceName/folder/:fileFolderId/:fileFolderName",
          "/workspace/:page/:workspaceId/:workspaceName/folder/:fileFolderId/:fileFolderName",
          "/workspace/:page/:folderId/:folderName/:workspaceId/:workspaceName/post/:postId/:postTitle",
          "/workspace/:page/:folderId/:folderName/:workspaceId/:workspaceName",
          "/workspace/:page/:workspaceId/:workspaceName/post/:postId/:postTitle",
          "/workspace/:page/:workspaceId/:workspaceName",
          "/workspace/:page",
        ]}
      />
    </Wrapper>
  );
};

export default React.memo(MainNavigationPanel);
