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
  border-radius: 8px;
  color: #828282;
  margin: 0 1rem;
  transition: color 200ms ease 0ms;
  font-weight: 500;
  border-radius: 0;
  display: flex;
  height: 60px;
  position: relative;
  font-size: 14px;
  align-items: center;
  &.active {
    ${"" /* border-bottom: 2px solid #000000; */}
    color: #000000;
    &:after {
      content: "";
      height: 2px;
      width: 100%;
      bottom: 0;
      left: 0;
      background: #000000;
      position: absolute;
    }
  }
  .badge {
    background: green;
    font-size: 0;
    padding: 0;
    margin: 0;
    position: absolute;
    width: 6px;
    height: 6px;
    background: #f44c;
    top: 20px;
    right: -12px;
    right: -8px;
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
              <MainNavLink isSub={true} to={`/workspace/dashboard${pathname}`}>
                Dashboard
              </MainNavLink>
            </li>
            <li className="nav-item">
              <MainNavLink isSub={true} to={`/workspace/chat${pathname}`}>
                Chat
                {workspace !== null && ((workspace.type === "TOPIC" && workspace.unread_chats !== 0) || (workspace.type === "WORKSPACE" && workspace.topic_detail.unread_chats !== 0)) && (
                  <div className="ml-2 badge badge-danger">{workspace.type === "TOPIC" ? workspace.unread_chats : workspace.topic_detail.unread_chats}</div>
                )}
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
