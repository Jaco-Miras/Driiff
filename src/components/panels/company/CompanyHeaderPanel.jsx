import React, {useEffect} from "react";
import {useSelector} from "react-redux";
import {useRouteMatch} from "react-router-dom";
import styled from "styled-components";
import {NavLink, SvgIconFeather} from "../../common";
import useSettings from "../../hooks/useSettings";
import HomeProfileNavigation from "../common/HeaderProfileNavigation";

const NavBar = styled.ul`
  li {
    justify-content: center;
    align-items: center;

    h2 {
      letter-spacing: -0.5px;
      margin-bottom: 0;
      color: #82828a;
      font-weight: 500;
    }
  }
`;

const CompanyName = styled.h2`
  margin-right: 1rem;
`;

const MainNavLink = styled(NavLink)`
  border-radius: 8px;
  color: #828282;
  margin: 0 1rem;
  transition: color 200ms ease 0ms;
  font-weight: 500;
  border-radius: 0;
  display: flex;
  height: 35px;
  &.active {
    border-bottom: 2px solid #5d5d5d;
    color: #000000;
  }
`;

const Badge = styled.div`
  color: ${(props) => (props.unread ? "#f44" : "#fff")};
  height: 22px;
`;

const CompanyHeaderPanel = () => {
  // const dispatch = useDispatch();
  const match = useRouteMatch();

  const unreadCounter = useSelector((state) => state.global.unreadCounter);
  const { driffSettings } = useSettings();

  const handleMenuOpenMobile = (e) => {
    e.preventDefault();
    document.body.classList.add("navigation-show");
  };

  useEffect(() => {
    const body = document.body;

    if (["people", "workspace", "post", "notifications"].includes(match.params.page)) {
      body.classList.remove("stretch-layout");
    } else {
      body.classList.add("stretch-layout");
    }

    let pageName = "";
    switch (match.params.page) {
      case "posts": {
        pageName = "Posts";
        break;
      }
      case "chat": {
        pageName = "Chat";
        break;
      }
      case "files": {
        pageName = "Files";
        break;
      }
      case "people": {
        pageName = "People";
        break;
      }
      case "settings": {
        pageName = "Settings";
        break;
      }
      default: {
        pageName = "Dashboard";
      }
    }
    document.title = `Driff - ${pageName}`;
  }, [match.params]);

  return (
    <>
      <div>
        <NavBar className="navbar-nav">
          <li className="nav-item navigation-toggler mobile-toggler">
            <a href="/" className="nav-link" title="Show navigation" onClick={handleMenuOpenMobile}>
              <SvgIconFeather icon="menu" />
            </a>
          </li>
          <li className="nav-item">
            <CompanyName>{driffSettings.company_name}</CompanyName>
          </li>
          <li className="nav-item">
            <MainNavLink to="/dashboard">Dashboard</MainNavLink>
          </li>
          <li className="nav-item">
            <MainNavLink to="/posts">Posts</MainNavLink>
          </li>
          <li className="nav-item">
            <MainNavLink to="/chat">
              Chat{" "}
              <Badge className="ml-2 badge badge-pill badge-danger"
                     unread={unreadCounter.chat_message + unreadCounter.chat_reminder_message === 0 && unreadCounter.unread_channel > 0}>
                {unreadCounter.chat_message + unreadCounter.chat_reminder_message > 0 ? unreadCounter.chat_message + unreadCounter.chat_reminder_message : unreadCounter.unread_channel > 0 ? unreadCounter.unread_channel : null}
              </Badge>
            </MainNavLink>
          </li>
          <li className="nav-item">
            <MainNavLink to="/files">Files</MainNavLink>
          </li>
          <li className="nav-item">
            <MainNavLink to="/people">People</MainNavLink>
          </li>
        </NavBar>
      </div>

      <div>
        <HomeProfileNavigation />
      </div>
    </>
  );
};

export default React.memo(CompanyHeaderPanel);
