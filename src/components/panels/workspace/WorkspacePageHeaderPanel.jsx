import React from "react";
import styled from "styled-components";
import { NavLink } from "../../common";
import { SettingsLink } from "../../workspace";

const Wrapper = styled.div``;

const Navbar = styled.ul`
  display: block;
  width: 100%;
  margin-left: -30px;

  li {
    display: inline-block;
    width: 15%;
    text-align: center;
    &:last-child {
      display: inline-flex !important;
      justify-content: flex-end;
    }
  }
  .badge {
  }
`;

const MainNavLink = styled(NavLink)`
  padding: 10px 40px;
  border-radius: 8px;
  color: #5d5d5d;
  margin: 0 0.2rem;
  transition: color 200ms ease 0ms;
  display: inline-flex;
  align-items: center;
  &.active {
    transition: none;
    background-color: #7a1b8b;
    color: #fff;
  }
`;

const WorkspacePageHeaderPanel = (props) => {
  const { className = "", workspace } = props;

  let pathname = props.match.url;
  if (props.match.path === "/workspace/:page/:workspaceId/:workspaceName/post/:postId/:postTitle" || props.match.path === "/workspace/:page/:folderId/:folderName/:workspaceId/:workspaceName/post/:postId/:postTitle") {
    pathname = pathname.split("/post/")[0].replace(`/workspace/${props.match.params.page}`, "");
  } else if (
    props.match.path === "/workspace/:page/:workspaceId/:workspaceName/folder/:fileFolderId/:fileFolderName" ||
    props.match.path === "/workspace/:page/:folderId/:folderName/:workspaceId/:workspaceName/folder/:fileFolderId/:fileFolderName"
  ) {
    pathname = pathname.split("/folder/")[0].replace(`/workspace/${props.match.params.page}`, "");
  } else {
    pathname = pathname.replace(`/workspace/${props.match.params.page}`, "");
  }

  return (
    <>
      <Wrapper className={`page-header ${className}`}>
        <div className="container-fluid d-sm-flex justify-content-between">
          <Navbar className="navbar-nav">
            <li className="nav-item">
              <MainNavLink isSub={true} to={`/workspace/chat${pathname}`}>
                Chat
                {workspace !== null && ((workspace.type === "TOPIC" && workspace.unread_chats !== 0) || (workspace.type === "WORKSPACE" && workspace.topic_detail.unread_chats !== 0)) && (
                  <div className="ml-2 badge badge-danger">{workspace.type === "TOPIC" ? workspace.unread_chats : workspace.topic_detail.unread_chats}</div>
                )}
              </MainNavLink>
            </li>
            <li className="nav-item">
              <MainNavLink isSub={true} to={`/workspace/dashboard${pathname}`}>
                Dashboard
              </MainNavLink>
            </li>
            <li className="nav-item">
              <MainNavLink isSub={true} to={`/workspace/posts${pathname}`}>
                Posts
                {workspace !== null && ((workspace.type === "TOPIC" && workspace.unread_posts !== 0) || (workspace.type === "WORKSPACE" && workspace.topic_detail.unread_posts !== 0)) && (
                  <div className="ml-2 badge badge-danger">{workspace.type === "TOPIC" ? workspace.unread_posts : workspace.topic_detail.unread_posts}</div>
                )}
              </MainNavLink>
            </li>
            <li className="nav-item">
              <MainNavLink isSub={true} to={`/workspace/files${pathname}`}>
                Files
              </MainNavLink>
            </li>
            <li className="nav-item">
              <MainNavLink isSub={true} to={`/workspace/people${pathname}`}>
                People
              </MainNavLink>
            </li>
            <SettingsLink />
          </Navbar>
        </div>
      </Wrapper>
    </>
  );
};

export default React.memo(WorkspacePageHeaderPanel);
