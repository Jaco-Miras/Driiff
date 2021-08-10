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
          "/workspace/:page/:folderId/:folderName/:workspaceId/:workspaceName",
          "/workspace/:page/:workspaceId/:workspaceName/post/:postId/:postTitle/:postCommentCode?",
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
          "/system/people",
          "/magic-link/:token",
          "/zoom/:channelId",
          "/zoom",
          "/:page",
        ]}
      />
    </Wrapper>
  );
};

export default React.memo(MainNavigationPanel);
