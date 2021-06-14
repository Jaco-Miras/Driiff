import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Avatar, SvgIconFeather, ToolTip } from "../../common";
import { useNotifications, useOutsideClick, useSettings, useUsers } from "../../hooks";
import { SearchDropDown } from "../dropdown";
import UserProfileDropDown from "../dropdown/UserProfileDropdown";
import { useHistory, useLocation } from "react-router-dom";

const Wrapper = styled.ul`
  padding-left: 5px;
  @media (max-width: 1200px) {
    display: flex !important;
    left: auto;
    right: 0;
    top: 0;
    height: 45px;
  }
  > li {
    position: relative;
    .nav-link {
      max-height: 45px;
      padding: 10px 10px !important;
      &.profile-button {
        position: relative;
        padding: 0 !important;
        margin-left: 10px;
        .avatar-overlay {
          position: absolute;
          width: 45px;
          height: 45px;
          z-index: 1;
        }
        .avatar {
          position: relative;
          z-index: 0;
        }
        @media all and (max-width: 700px) {
          margin-left: 4px;
        }
      }
      @media (max-width: 620px) {
        svg {
          stroke: #363636;
          width: 16px !important;
          height: 16px !important;
        }
        &:not(.profile-button) {
          margin: 0 4px;
          &:first-of-type {
            margin-right: 0;
          }
        }
      }
      @media all and (max-width: 920px) {
        &.dark-mode-switch {
          display: none !important;
        }
      }
      @media all and (max-width: 700px) {
        padding: 10px 4px !important;
      }
    }
    .user-profile-dropdown {
      position: absolute;
      right: 0;
      left: auto;
      top: -10px;
    }
    .avatar-top-bar {
      height: 2rem;
      width: 2rem;
    }
    .notif-bell {
      position: relative;
    }
    .notif-bell.active div {
      filter: progid: DXImageTransform.Microsoft.BasicImage(rotation=0.25);
      -webkit-transform: rotate(25deg);
      -moz-transform: rotate(25deg);
      -ms-transform: rotate(25deg);
      -o-transform: rotate(25deg);
      transform: rotate(25deg);
      display: inline-block;
    }
  }
`;

const NotificationBadge = styled.span`
  position: absolute;
  top: 1px;
  padding: 3px 5px;
  right: 0;
  z-index: 1;
  min-width: 20px;
  &.double {
    right: -3px;
  }
  &.triple {
    right: -8px;
  }
  @media (max-width: 414px) {
    padding: 2px 3px;
    font-size: 8px;
    top: 5px;
    &.single {
      padding: 2px 0;
      border-radius: 100%;
      min-width: 14px;
    }
  }
`;

const HomeProfileNavigation = (props) => {
  const { className = "", dictionary } = props;

  const {
    users,
    loggedUser,
    actions: { fetchById },
  } = useUsers();
  const { unreadNotifications } = useNotifications();
  const {
    generalSettings: { dark_mode },
    setGeneralSetting,
  } = useSettings();

  const [currentPopUp, setCurrentPopUp] = useState(null);
  const [form, setForm] = useState({});
  const [dropDown, setDropDown] = useState({});

  const refs = {
    container: useRef(null),
  };

  const setThemeButton = (e) => {
    e.preventDefault();
    setDropDown({});
    setGeneralSetting({
      dark_mode: dark_mode === "0" ? "1" : "0",
    });
  };

  const toggleDropdown = (e) => {
    e.preventDefault();

    const name = e.currentTarget.dataset.toggle;
    setDropDown((prevState) => ({
      ...prevState,
      ...(prevState.name !== name && { name: name }),
      value: prevState.name === name ? !prevState.value : true,
    }));
  };

  useEffect(() => {
    const body = document.body;
    if (dark_mode === "0") {
      body.classList.remove("dark");
    } else {
      body.classList.add("dark");
    }
  }, [dark_mode]);

  const hidePopUp = () => {
    const shownDropDown = refs.container.current.querySelector("ul .dropdown-menu.show");
    if (shownDropDown) {
      shownDropDown.classList.remove("show");
      setCurrentPopUp(null);
    }
    document.querySelector(".overlay").classList.remove("show");
  };

  useEffect(() => {
    setForm(loggedUser);
  }, [loggedUser.profile_image_link]);

  useEffect(() => {
    const selectedUser = users[loggedUser.id] ? users[loggedUser.id] : {};
    if (selectedUser.hasOwnProperty("loaded")) {
      setForm(selectedUser);
    } else {
      fetchById(loggedUser.id);
    }
  }, []);

  const history = useHistory();
  const gotoNotifications = (e) => {
    e.preventDefault();
    history.push("/notifications");
  };

  const location = useLocation();

  useOutsideClick(currentPopUp, hidePopUp, currentPopUp !== null);

  return (
    <Wrapper ref={refs.container} className={`header-profile-navigation navbar-nav ${className}`}>
      <li className="nav-item dropdown">
        <a href="/" className="nav-link" data-toggle="search" onClick={toggleDropdown}>
          <ToolTip content={dictionary.generalSearch}>
            <SvgIconFeather icon="search" />
          </ToolTip>
        </a>
        {dropDown.name === "search" && dropDown.value && <SearchDropDown />}
      </li>
      <li className="nav-item dropdown">
        <a href="/" className={`nav-link notif-bell ${location.pathname.split("/")[1] === "notifications" && "active"}`} data-toggle="notification" onClick={gotoNotifications}>
          {unreadNotifications > 0 && (
            <NotificationBadge className={`badge badge-danger badge-pill ${unreadNotifications > 99 ? "triple" : unreadNotifications > 9 ? "double" : "single"}`}>{unreadNotifications > 99 ? "99+" : unreadNotifications}</NotificationBadge>
          )}
          <ToolTip content={dictionary.generalNotifications}>
            <SvgIconFeather icon="bell" />
          </ToolTip>
        </a>
      </li>
      <li className="nav-item">
        <a href="/" className={"nav-link dark-mode-switch"} onClick={setThemeButton}>
          <ToolTip content={dictionary.generalSwitchTheme}>
            <SvgIconFeather icon="sun" />
            <SvgIconFeather icon="moon" />
          </ToolTip>
        </a>
      </li>
      <li className="nav-item dropdown">
        <a href="/" className="nav-link profile-button" data-toggle="profile" onClick={toggleDropdown}>
          <ToolTip content={loggedUser.name}>
            <div className="avatar-overlay" />
            <Avatar name={form.name} id={form.id} type="USER" className="avatar-top-bar" imageLink={form.profile_image_thumbnail_link ? form.profile_image_thumbnail_link : form.profile_image_link} noDefaultClick={true} />
          </ToolTip>
        </a>
        {dropDown.name === "profile" && dropDown.value && <UserProfileDropDown user={loggedUser} />}
      </li>
    </Wrapper>
  );
};

export default React.memo(HomeProfileNavigation);
