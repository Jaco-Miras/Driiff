import React from "react";
import styled from "styled-components";
import {NavLink} from "../../common";

const Wrapper = styled.div``;

const Navbar = styled.ul`
  display: flex;
  width: 100%;
  margin-left: -15px;
  li {
    display: inline-block;
    text-align: center;
    &:last-child {
      display: inline-flex !important;
      justify-content: flex-end;
    }
  }
`;

const MainNavLink = styled(NavLink)`
  color: #828282;
  margin: 0 1rem;
  transition: color 200ms ease 0ms;
  font-weight: 500;
  border-radius: 0;
  display: flex;
  height: 27px;
  position: relative;
  font-size: 13px;
  &.active {
    color: #363636;
    &:after {
      content: "";
      height: 2px;
      width: 100%;
      bottom: 0;
      left: 0;
      background: #7a1b8b;
      position: absolute;
    }
  }
  .badge {
    font-size: 0;
    padding: 0;
    margin: 0;
    position: absolute;
    width: 6px;
    height: 6px;
    background: #28a745;
    top: 0;
    right: -13px;
  }
  @media all and (max-width: 700px) {
    margin: 0;
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
      <Wrapper className={`${className}`}>
        <Navbar className="navbar-nav">
          <li className="nav-item">
            <MainNavLink isSub={true} to={`/workspace/dashboard${pathname}`}>
              Dashboard
            </MainNavLink>
          </li>
          <li className="nav-item">
            <MainNavLink isSub={true} to={`/workspace/chat${pathname}`}>
              Chat
              {workspace !== null && workspace.unread_chats > 0 && <div className="ml-2 badge badge-pill badge-danger">{workspace.unread_chats}</div>}
            </MainNavLink>
          </li>
          <li className="nav-item">
            <MainNavLink isSub={true} to={`/workspace/posts${pathname}`}>
              Posts
              {workspace !== null && workspace.unread_posts > 0 && <div className="ml-2 badge badge-pill badge-danger">{workspace.unread_posts}</div>}
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
        </Navbar>
      </Wrapper>
    </>
  );
};

export default React.memo(WorkspacePageHeaderPanel);
