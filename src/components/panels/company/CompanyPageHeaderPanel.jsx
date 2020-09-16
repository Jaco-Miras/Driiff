import React from "react";
import styled from "styled-components";
import { NavLink } from "../../common";
import { useSelector } from "react-redux";

const Wrapper = styled.div``;

const Navbar = styled.ul`
  display: block;
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
  border-radius: 8px;
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
    background: green;
    font-size: 0;
    padding: 0;
    margin: 0;
    position: absolute;
    width: 6px;
    height: 6px;
    background: #28a745;
    top: 0px;
    right: -13px;
  }
  @media all and (max-width: 700px) {
    margin: 0;
  }
`;

const CompanyPageHeaderPanel = (props) => {
  const { className = "" } = props;
  const unreadCounter = useSelector((state) => state.global.unreadCounter);
  const lastVisitedChannel = useSelector((state) => state.chat.lastVisitedChannel);

  return (
    <>
      <Wrapper className={`${className}`}>
        <Navbar className="navbar-nav">
          <li className="nav-item">
            <MainNavLink to="/dashboard">Dashboard</MainNavLink>
          </li>
          <li className="nav-item">
            <MainNavLink to={lastVisitedChannel !== null && lastVisitedChannel.hasOwnProperty("code") ? `/chat/${lastVisitedChannel.code}` : "/chat"}>
              Chat{" "}
              <div className="ml-2 badge badge-pill badge badge-danger">
                {unreadCounter.chat_message + unreadCounter.chat_reminder_message > 0 ? unreadCounter.chat_message + unreadCounter.chat_reminder_message : unreadCounter.unread_channel > 0 ? unreadCounter.unread_channel : null}
              </div>
            </MainNavLink>
          </li>
          <li className="nav-item">
            <MainNavLink to="/posts">Posts</MainNavLink>
          </li>
          <li className="nav-item">
            <MainNavLink to="/files">Files</MainNavLink>
          </li>
          <li className="nav-item">
            <MainNavLink to="/people">People</MainNavLink>
          </li>
        </Navbar>
      </Wrapper>
    </>
  );
};

export default React.memo(CompanyPageHeaderPanel);
