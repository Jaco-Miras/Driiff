import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { NavLink } from "../../common";
import { useTranslationActions } from "../../hooks";
//import { getWorkspaceRemindersCount, updateWorkspaceRemindersCount } from "../../../redux/actions/workspaceActions";

const Wrapper = styled.div``;

const Navbar = styled.ul`
  display: flex;
  width: 100%;
  margin-left: -15px;
  li {
    display: inline-block;
    text-align: center;
    margin-right: 1.5rem;
    &:last-child {
      display: inline-flex !important;
      justify-content: flex-end;
    }
    a {
      white-space: nowrap;
    }
  }
  li:first-child {
    margin-left: 15px;
    @media all and (max-width: 700px) {
      margin-left: 0;
    }
  }
`;

const MainNavLink = styled(NavLink)`
  color: #828282;
  transition: color 200ms ease 0ms;
  font-weight: 500;
  border-radius: 0;
  display: flex;
  height: 27px;
  position: relative;
  font-size: 13px;
  white-space: nowrap;
  &.active {
    color: #363636;
    .dark & {
      color: #fff;
    }
    &:after {
      content: "";
      height: 2px;
      width: 100%;
      bottom: 0;
      left: 0;
      background: ${(props) => props.theme.colors.primary};
      position: absolute;
    }
  }
  .badge {
    font-size: 0;
    padding: 0;
    margin: 0;
    position: absolute;
    width: 7px;
    height: 7px;
    background: ${(props) => props.theme.colors.primary};
    top: 0;
    right: -13px;
  }
  @media all and (max-width: 700px) {
    margin: 0;
  }
`;

const WorkspacePageHeaderPanel = (props) => {
  const history = useHistory();
  const { className = "", workspace, user } = props;

  //const dispatch = useDispatch();

  const workspaceReminders = useSelector((state) => state.workspaces.workspaceReminders);
  const params = useParams();

  // const fetchWsCount = () => {
  //   let payload = {
  //     topic_id: params.workspaceId,
  //   };
  //   dispatch(
  //     getWorkspaceRemindersCount(payload, (err, res) => {
  //       if (err) return;
  //       dispatch(updateWorkspaceRemindersCount({ count: res.data, id: payload.topic_id }));
  //     })
  //   );
  // };

  // useEffect(() => {
  //   if (!workspaceReminders.hasOwnProperty(params.workspaceId)) {
  //     fetchWsCount();
  //   }
  // }, [workspaceReminders, params]);

  const isLoaded = typeof workspaceReminders[params.workspaceId] !== "undefined";

  let pathname = props.match.url;
  if (
    props.match.path === "/workspace/:page/:workspaceId/:workspaceName/post/:postId/:postTitle/:postCommentCode?" ||
    props.match.path === "/workspace/:page/:folderId/:folderName/:workspaceId/:workspaceName/post/:postId/:postTitle/:postCommentCode?"
  ) {
    pathname = pathname.split("/post/")[0].replace(`/workspace/${props.match.params.page}`, "");
  } else if (
    props.match.path === "/workspace/:page/:workspaceId/:workspaceName/folder/:fileFolderId/:fileFolderName" ||
    props.match.path === "/workspace/:page/:folderId/:folderName/:workspaceId/:workspaceName/folder/:fileFolderId/:fileFolderName"
  ) {
    pathname = pathname.split("/folder/")[0].replace(`/workspace/${props.match.params.page}`, "");
  } else if (props.match.path === "/workspace/:workspaceId/:workspaceName" && typeof props.match.params.page === "undefined") {
    const split_pathname = pathname.split("/");
    split_pathname.splice(2, 0, "chat");
    history.push(split_pathname.join("/"));
  } else {
    pathname = pathname.replace(`/workspace/${props.match.params.page}`, "");
  }

  const { _t } = useTranslationActions();

  const dictionary = {
    pageTitleDashboard: _t("PAGE_TITLE.DASHBOARD", "Dashboard"),
    pageTitlePosts: _t("PAGE_TITLE.POSTS", "Posts"),
    pageTitleChat: _t("PAGE_TITLE.CHAT", "Chat"),
    pageTitleFiles: _t("PAGE_TITLE.FILES", "Files"),
    pageTitlePeople: _t("PAGE_TITLE.PEOPLE", "People"),
    pageTitleClientChat: _t("PAGE_TITLE.CLIENT_CHAT", "Client chat"),
    pageTitleTeamChat: _t("PAGE_TITLE.TEAM_CHAT", "Team chat"),
    pageTitleReminders: _t("PAGE_TITLE.REMINDERS", "Reminders"),
    pageTitleMeetings: _t("PAGE_TITLE.MEETINGS", "Meetings"),
  };

  return (
    <>
      <Wrapper className={`${className}`}>
        <Navbar className="navbar-nav">
          <li className="nav-item">
            <MainNavLink isSub={true} to={`/workspace/dashboard${pathname}`}>
              {dictionary.pageTitleDashboard}
            </MainNavLink>
          </li>
          {((workspace && user.type === "internal" && workspace.is_shared) || (workspace && user.type === "internal" && workspace.team_channel.code && workspace.is_shared)) && (
            <li className="nav-item">
              <MainNavLink isSub={true} to={`/workspace/team-chat${pathname}`}>
                {dictionary.pageTitleTeamChat}
                {workspace !== null && workspace?.team_unread_chats > 0 && <div className="ml-2 badge badge-pill badge-danger">{workspace.team_unread_chats}</div>}
              </MainNavLink>
            </li>
          )}
          <li className="nav-item">
            <MainNavLink isSub={true} to={`/workspace/chat${pathname}`}>
              {workspace && workspace.is_shared && user.type === "internal" ? dictionary.pageTitleClientChat : dictionary.pageTitleChat}
              {workspace !== null && workspace.unread_chats > 0 && <div className="ml-2 badge badge-pill badge-danger">{workspace.unread_chats}</div>}
            </MainNavLink>
          </li>
          <li className="nav-item">
            <MainNavLink isSub={true} to={`/workspace/posts${pathname}`}>
              {dictionary.pageTitlePosts}
              {workspace !== null && workspace.unread_posts > 0 && <div className="ml-2 badge badge-pill badge-danger">{workspace.unread_posts}</div>}
            </MainNavLink>
          </li>
          <li className="nav-item">
            <MainNavLink isSub={true} to={`/workspace/reminders${pathname}`}>
              {dictionary.pageTitleReminders}
              {isLoaded && workspaceReminders[params.workspaceId].count.todo_with_date > 0 && <div className="ml-2 badge badge-pill badge-danger">{workspaceReminders[params.workspaceId].count.todo_with_date}</div>}
            </MainNavLink>
          </li>
          <li className="nav-item">
            <MainNavLink isSub={true} to={`/workspace/meetings${pathname}`}>
              {dictionary.pageTitleMeetings}
            </MainNavLink>
          </li>
          <li className="nav-item">
            <MainNavLink isSub={true} to={`/workspace/files${pathname}`}>
              {dictionary.pageTitleFiles}
            </MainNavLink>
          </li>
          <li className="nav-item">
            <MainNavLink isSub={true} to={`/workspace/people${pathname}`}>
              {dictionary.pageTitlePeople}
            </MainNavLink>
          </li>
        </Navbar>
      </Wrapper>
    </>
  );
};

export default React.memo(WorkspacePageHeaderPanel);
