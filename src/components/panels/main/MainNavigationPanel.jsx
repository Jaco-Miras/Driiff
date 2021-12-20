import React from "react";
import { Route } from "react-router-dom";
import styled from "styled-components";
import { MainNavigationTabPanel } from "./index";

const Wrapper = styled.div``;

const MainNavigationPanel = (props) => {
  const { className = "", showNotificationBar } = props;

  return (
    <Wrapper className={`navigation ${className} ${showNotificationBar && "notification-bar"}`}>
      <Route
        exact={true}
        render={() => <MainNavigationTabPanel {...props} />}
        path={[
          "/workspace/:page/:folderId/:folderName/:workspaceId/:workspaceName/folder/:fileFolderId/:fileFolderName",
          "/workspace/:page/:workspaceId/:workspaceName/folder/:fileFolderId/:fileFolderName",
          "/workspace/:page/:folderId/:folderName/:workspaceId/:workspaceName/post/:postId/:postTitle/:postCommentCode?",
          "/workspace/:page/:folderId/:folderName/:workspaceId/:workspaceName/wip/:wipId/:wipTitle/file/:wipFileId/:wipFileVersion",
          "/workspace/:page/:folderId/:folderName/:workspaceId/:workspaceName/wip/:wipId/:wipTitle",
          "/workspace/:page/:folderId/:folderName/:workspaceId/:workspaceName",
          "/workspace/:page/:workspaceId/:workspaceName/post/:postId/:postTitle/:postCommentCode?",
          "/workspace/:page/:workspaceId/:workspaceName/wip/:wipId/:wipTitle/file/:wipFileId/:wipFileVersion",
          "/workspace/:page/:workspaceId/:workspaceName/wip/:wipId/:wipTitle",
          "/workspace/:page/:workspaceId/:workspaceName",
          "/workspace/:workspaceId/:workspaceName",
          "/workspace/:page",
          "/profile/:id/:name/:mode",
          "/profile/:id/:name",
          "/profile/:id",
          "/profile",
          "/chat/:code/:messageId",
          "/chat/:code",
          "/posts/:postId/:postTitle/:postCommentCode?",
          "/files/folder/:folderId/:folderName",
          "/system/people/teams/:teamId/:teamName",
          "/system/people/organization",
          "/system/people/teams",
          "/system/people",
          "/magic-link/:token",
          // "/zoom/:channelId",
          // "/zoom",
          "/admin-settings/:page/:subpage",
          "/admin-settings/:page",
          "/:page",
        ]}
      />
    </Wrapper>
  );
};

export default React.memo(MainNavigationPanel);
