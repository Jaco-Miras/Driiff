import React from "react";
import { Route } from "react-router-dom";
import styled, { useTheme } from "styled-components";
import { MainNavigationTabPanel } from "./index";
import { useSettings } from "../../hooks";

const FONT_COLOR_DARK_MODE = "#CBD4DB";

const Wrapper = styled.div`
  .navigation-menu-tab {
    background-color: ${(props) => props.theme.colors.primary};
    ul li a {
      color: ${({ theme, dark_mode }) => (dark_mode === "1" ? FONT_COLOR_DARK_MODE : theme.colors.sidebarTextColor)};
    }
  }
`;

const MainNavigationPanel = (props) => {
  const { className = "", showNotificationBar } = props;
  const {
    generalSettings: { dark_mode },
  } = useSettings();
  const theme = useTheme();
  return (
    <Wrapper dark_mode={dark_mode} theme={theme} className={`navigation ${className} ${showNotificationBar && "notification-bar"}`} id={"main-sidebar"}>
      <Route
        exact={true}
        render={() => <MainNavigationTabPanel {...props} />}
        path={[
          "/hub/:page/:folderId/:folderName/:workspaceId/:workspaceName/folder/:fileFolderId/:fileFolderName",
          "/hub/:page/:workspaceId/:workspaceName/folder/:fileFolderId/:fileFolderName",
          "/hub/:page/:folderId/:folderName/:workspaceId/:workspaceName/post/:postId/:postTitle/:postCommentCode?",
          "/hub/:page/:folderId/:folderName/:workspaceId/:workspaceName/wip/:wipId/:wipTitle/file/:wipFileId/:wipFileVersion",
          "/hub/:page/:folderId/:folderName/:workspaceId/:workspaceName/wip/:wipId/:wipTitle",
          "/hub/:page/:folderId/:folderName/:workspaceId/:workspaceName",
          "/hub/:page/:workspaceId/:workspaceName/post/:postId/:postTitle/:postCommentCode?",
          "/hub/:page/:workspaceId/:workspaceName/wip/:wipId/:wipTitle/file/:wipFileId/:wipFileVersion",
          "/hub/:page/:workspaceId/:workspaceName/wip/:wipId/:wipTitle",
          "/hub/:page/:workspaceId/:workspaceName",
          "/hub/:workspaceId/:workspaceName",
          "/hub/:page",
          "/shared-hub/:page/:folderId/:folderName/:workspaceId/:workspaceName/folder/:fileFolderId/:fileFolderName",
          "/shared-hub/:page/:workspaceId/:workspaceName/folder/:fileFolderId/:fileFolderName",
          "/shared-hub/:page/:folderId/:folderName/:workspaceId/:workspaceName/post/:postId/:postTitle/:postCommentCode?",
          "/shared-hub/:page/:folderId/:folderName/:workspaceId/:workspaceName",
          "/shared-hub/:page/:workspaceId/:workspaceName/post/:postId/:postTitle/:postCommentCode?",
          "/shared-hub/:page/:workspaceId/:workspaceName",
          "/shared-hub/:workspaceId/:workspaceName",
          "/shared-hub/:page",
          "/profile/:id/:name/:mode",
          "/profile/:id/:name",
          "/profile/:id",
          "/profile",
          "/chat/:code/:messageId",
          "/chat/:code",
          "/posts/:postId/:postTitle/:postCommentCode?",
          "/files/folder/:folderId/:folderName",
          "/system/people/all/online",
          "/system/people/teams/:teamId/:teamName",
          "/system/people/organization",
          "/system/people/teams",
          "/system/people/guest",
          "/system/people/invited",
          "/system/people/inactive",
          "/system/people/all",
          "/magic-link/:token",
          "/admin-settings/:page/:subpage",
          "/admin-settings/:page",
          "/:page",
        ]}
      />
    </Wrapper>
  );
};

export default React.memo(MainNavigationPanel);
