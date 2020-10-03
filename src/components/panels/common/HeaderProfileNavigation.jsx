import React, {useEffect, useRef, useState} from "react";
import styled from "styled-components";
import {Avatar, SvgIconFeather, ToolTip} from "../../common";
import {useNotifications, useOutsideClick, useSettings, useUsers} from "../../hooks";
import {NotificationDropDown, SearchDropDown} from "../dropdown";
import UserProfileDropDown from "../dropdown/UserProfileDropdown";

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
  }
`;

const HomeProfileNavigation = (props) => {
  const {className = "", dictionary} = props;

  const {
    users,
    loggedUser,
    actions: {fetchById},
  } = useUsers();
  const {notifications} = useNotifications();
  const {
    generalSettings: {dark_mode},
    setGeneralSetting,
  } = useSettings();

  const [currentPopUp, setCurrentPopUp] = useState(null);
  const [form, setForm] = useState({});

  const refs = {
    container: useRef(null),
  };

  const setThemeButton = (e) => {
    e.preventDefault();
    hideActiveDropDown(e);
    setGeneralSetting({
      dark_mode: dark_mode === "0" ? "1" : "0",
    });
  };

  const hideActiveDropDown = (e) => {
    const shownDropDown = e.currentTarget.closest("ul").querySelector(".dropdown-menu.show");
    const targetDropDown = e.currentTarget.parentElement.querySelector(".dropdown-menu");

    if (shownDropDown && shownDropDown !== targetDropDown) {
      shownDropDown.classList.remove("show");
    }
  };

  const toggleDropdown = (e) => {
    e.preventDefault();
    hideActiveDropDown(e);

    const targetDropDown = e.currentTarget.parentElement.querySelector(".dropdown-menu");
    setCurrentPopUp({
      current: targetDropDown,
    });
    if (targetDropDown) {
      targetDropDown.classList.toggle("show");
    }
    document.querySelector(".overlay").classList.add("show");

    if (e.currentTarget.title === "Search") {
      document.querySelector(".dropdown-menu-right .dropdown-search-input").focus();
    }
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

  useOutsideClick(currentPopUp, hidePopUp, currentPopUp !== null);

  return (
    <Wrapper ref={refs.container} className={`header-profile-navigation navbar-nav ${className}`}>
      <li className="nav-item dropdown">
        <a href="/" className="nav-link" data-toggle="dropdown" onClick={toggleDropdown}>
          <ToolTip content={dictionary.generalSearch}>
            <SvgIconFeather icon="search"/>
          </ToolTip>
        </a>
        <SearchDropDown/>
      </li>
      <li className="nav-item dropdown">
        <a href="/"
           className={`nav-link ${Object.values(notifications).filter((n) => n.is_read === 0).length > 0 ? "nav-link-notify" : ""}`}
           data-toggle="dropdown" onClick={toggleDropdown}>
          <ToolTip content={dictionary.generalNotifications}>
            <SvgIconFeather icon="bell"/>
          </ToolTip>
        </a>
        <NotificationDropDown/>
      </li>
      <li className="nav-item">
        <a href="/" className={`nav-link dark-mode-switch`} onClick={setThemeButton}>
          <ToolTip content={dictionary.generalSwitchTheme}>
            <SvgIconFeather icon="sun"/>
            <SvgIconFeather icon="moon"/>
          </ToolTip>
        </a>
      </li>
      <li className="nav-item dropdown">
        <a href="/" className="nav-link profile-button" data-toggle="dropdown"
           onClick={toggleDropdown}><ToolTip content={loggedUser.name}>
          <div className="avatar-overlay"/>
          <Avatar name={form.name} imageLink={form.profile_image_link} noDefaultClick={true}/>
        </ToolTip>
        </a>
        <UserProfileDropDown user={loggedUser}/>
      </li>
    </Wrapper>
  );
};

export default React.memo(HomeProfileNavigation);
