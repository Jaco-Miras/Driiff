import React, {useEffect, useRef, useState} from "react";
import styled from "styled-components";
import {Avatar, SvgIconFeather} from "../../common";
//import Flag from "../../common/Flag";
import {useNotifications, useOutsideClick, useSettings, useUsers} from "../../hooks";
import {NotificationDropDown, SearchDropDown} from "../dropdown";
import UserProfileDropDown from "../dropdown/UserProfileDropdown";

const Wrapper = styled.ul`
  @media (max-width: 1200px) {
    display: flex !important;
    left: auto !important;
    right: 0 !important;
    top: 0 !important;
    height: 70px;
  }

  > li {
    position: relative;
    .nav-link {
      &.profile-button {
        position: relative;

        .avatar-overlay {
          position: absolute;
          width: 100%;
          height: 100%;
          z-index: 1;
        }
        .avatar {
          position: relative;
          z-index: 0;
        }
      }
      @media (max-width: 620px) {
        svg {
          stroke: #363636;
          width: 16px !important;
          height: 16px !important;
        }
        &:not(.profile-button) {
          ${'' /* background: red; */}
          margin: 0 4px;
          &:first-of-type {
            margin-right: 0;
          }
        }
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

const ThemeSwitch = styled.span`
  color: #828282;
  padding: 10px 0px;
  cursor: pointer;
  &:hover {
    color: #000000;
  }
  svg {
    width: 18px;
  }
  @media all and (max-width: 920px) {
    display: none;
  }
`;

const HomeProfileNavigation = (props) => {

  const {className = ""} = props;

  const {users, loggedUser, actions: {fetchById}} = useUsers();
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
    document.querySelector(".overlay").classList.add('show');

    if (e.currentTarget.title === 'Search') {
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
    document.querySelector(".overlay").classList.remove('show');
  };

  useEffect(() => {
    setForm(loggedUser);
  }, [loggedUser.profile_image_link])

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
        <a href="#" className="nav-link" title="Search" data-toggle="dropdown" onClick={toggleDropdown}>
          <SvgIconFeather icon="search"/>
        </a>
        <SearchDropDown/>
      </li>
      <li className="nav-item">
        <ThemeSwitch title="Light or Dark mode" onClick={setThemeButton}>
          <SvgIconFeather icon="moon"/>
        </ThemeSwitch>
      </li>
      <li className="nav-item dropdown">
        <a href="/"
           className={`nav-link ${Object.values(notifications).filter((n) => n.is_read === 0).length > 0 ? "nav-link-notify" : ""}`}
           title="Notifications" data-toggle="dropdown" onClick={toggleDropdown}>
          <SvgIconFeather icon="bell"/>
        </a>
        <NotificationDropDown/>
      </li>
      <li className="nav-item dropdown">
        <a href="/" className="nav-link profile-button" data-toggle="dropdown" title={form.name}
           onClick={toggleDropdown}>
          <div className="avatar-overlay"/>
          <Avatar name={form.name} imageLink={form.profile_image_link} noDefaultClick={true}/>
        </a>
        <UserProfileDropDown user={loggedUser}/>
      </li>
    </Wrapper>
  );
};

export default React.memo(HomeProfileNavigation);
