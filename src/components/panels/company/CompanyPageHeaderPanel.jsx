import React from "react";
import styled from "styled-components";
import { NavLink } from "../../common";
import { useSelector } from "react-redux";

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
      background: #7a1b8b;
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
    background: #7a1b8b;
    top: 0;
    right: -13px;
  }
  @media all and (max-width: 700px) {
    margin: 0;
  }
`;

const CompanyPageHeaderPanel = (props) => {
  const { className = "", dictionary } = props;

  const unreadCounter = useSelector((state) => state.global.unreadCounter);
  const lastVisitedChannel = useSelector((state) => state.chat.lastVisitedChannel);
  const user = useSelector((state) => state.session.user);
  const todosCount = useSelector((state) => state.global.todos.count);
  //const { driff: driffSettings, user: userSettings } = useSelector((state) => state.settings);

  //const chatUnreadCounter = unreadCounter.chat_message + unreadCounter.unread_channel + unreadCounter.workspace_chat_message;

  return (
    <>
      <Wrapper className={`${className}`}>
        <Navbar className="navbar-nav">
          <li className="nav-item">
            <MainNavLink to="/dashboard">{dictionary.pageTitleDashboard}</MainNavLink>
          </li>
          <li className="nav-item">
            <MainNavLink to={lastVisitedChannel !== null && lastVisitedChannel.hasOwnProperty("code") ? `/chat/${lastVisitedChannel.code}` : "/chat"}>
              {dictionary.pageTitleChat} <div className="ml-2 badge badge-pill badge badge-danger">{unreadCounter.chat_message > 0 ? unreadCounter.chat_message : null}</div>
            </MainNavLink>
          </li>
          <li className="nav-item">
            <MainNavLink to="/posts">
              {dictionary.pageTitlePosts} <div className="ml-2 badge badge-pill badge badge-danger">{unreadCounter.general_post > 0 ? unreadCounter.general_post : null}</div>
            </MainNavLink>
          </li>
          <li className="nav-item">
            <MainNavLink to="/todos">
              {dictionary.pageTitleTodos} <div className="ml-2 badge badge-pill badge badge-danger">{todosCount.todo_with_date > 0 ? todosCount.todo_with_date : null}</div>
            </MainNavLink>
          </li>
          <li className="nav-item">
            <MainNavLink to="/files">{dictionary.pageTitleFiles}</MainNavLink>
          </li>
          <li className="nav-item">
            <MainNavLink to="/people">{dictionary.pageTitlePeople}</MainNavLink>
          </li>
          {user.role && ["owner", "admin"].includes(user.role.name) && (
            <li className="nav-item">
              <MainNavLink to="/admin-settings">{dictionary.adminSettings}</MainNavLink>
            </li>
          )}
          {/* <li className="nav-item">
            <MainNavLink to="/releases">
              Releases{" "}
              <div className="ml-2 badge badge-pill badge badge-danger">
                {driffSettings.READ_RELEASE_UPDATES && userSettings.READ_RELEASE_UPDATES && driffSettings.READ_RELEASE_UPDATES.timestamp > userSettings.READ_RELEASE_UPDATES.timestamp ? 1 : null}
              </div>
            </MainNavLink>
          </li> */}
        </Navbar>
      </Wrapper>
    </>
  );
};

export default React.memo(CompanyPageHeaderPanel);
