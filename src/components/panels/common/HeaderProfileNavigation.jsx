import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Avatar, SvgIconFeather, ToolTip } from "../../common";
import { useNotifications, useOutsideClick, useSettings, useUsers } from "../../hooks";
import { SearchDropDown } from "../dropdown";
import UserProfileDropDown from "../dropdown/UserProfileDropdown";
import { useHistory, useLocation } from "react-router-dom";
import { sessionService } from "redux-react-session";
import { useSelector } from "react-redux";

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
    svg {
      stoke: #8b8b8b;
    }
    .nav-link {
      max-height: 45px;
      padding: 10px 10px !important;
      &.profile-button {
        position: relative;
        padding: 0 !important;
        margin-left: 10px;
        cursor: pointer;
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
  .online-wrapper {
    cursor: pointer;
    position: relative;
  }
  .nowrap {
    white-space: nowrap;
    font-size: 0.8rem;
  }
  .online-dot {
    :before {
      content: "";
      position: absolute;
      display: block;
      width: 1rem;
      height: 1rem;
      border-radius: 50%;
      top: 3px;
      left: -20px;
      border: 3px solid #fff;
      background-color: green;
      color: #00c851;
      width: 1rem;
      height: 1rem;
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
    driffSettings,
    userSettings,
  } = useSettings();
  //const onlineUsers = useSelector((state) => state.users.onlineUsers);
  //const uniqueOnlineUsers = [...new Set(onlineUsers.map((ou) => ou.user_id))];

  const [currentPopUp, setCurrentPopUp] = useState(null);
  const [form, setForm] = useState(loggedUser);
  const [dropDown, setDropDown] = useState({});
  const [showUserProfileDropdown, setShowUserProfileDropdown] = useState(false);

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
      fetchById(loggedUser.id, (err, res) => {
        if (err) return;
        setForm(res.data);
        sessionService.saveUser({ ...loggedUser, ...res.data });
        // if (loggedUser.role && loggedUser.role.id !== res.data.role.id) {
        //   sessionService.saveUser({ ...loggedUser, ...res.data });
        // }
      });
    }
  }, []);

  // useEffect(() => {
  //   const selectedUser = users[loggedUser.id] ? users[loggedUser.id] : null;
  //   if (selectedUser) {
  //     setForm(selectedUser);
  //   }
  // }, [users, loggedUser]);

  const history = useHistory();
  const gotoNotifications = (e) => {
    e.preventDefault();
    history.push("/notifications");
  };

  const toggleShowProfileDropdown = () => {
    setShowUserProfileDropdown((prevState) => !prevState);
  };

  const location = useLocation();

  useOutsideClick(currentPopUp, hidePopUp, currentPopUp !== null);

  // const handleGiftClick = (e) => {
  //   e.preventDefault();
  //   window.open("https://support.getdriff.com/hc/en-us/sections/4409918501905-Software-updates", "_blank");
  //   // history.push("/releases");
  // };

  const hideSearch = () => {
    const name = "search";
    setDropDown((prevState) => ({
      ...prevState,
      ...(prevState.name !== name && { name: name }),
      value: prevState.name === name ? !prevState.value : true,
    }));
  };

  const renderGifIcon = () => {
    return null;
    // if (loggedUser.type === "external") return null;
    // return (
    //   <li className="nav-item dropdown">
    //     <a href="/" className={"nav-link"} onClick={handleGiftClick}>
    //       <SvgIconFeather icon="gift" />
    //     </a>
    //   </li>
    // );
  };

  return (
    <Wrapper ref={refs.container} className={`header-profile-navigation navbar-nav ${className}`}>
      {/* {loggedUser.role.id === 1 && (
        <span className="online-wrapper" onClick={() => history.push("/system/people/all/online")}>
          <span className="online-dot"></span>
          <span className="nowrap">
            {uniqueOnlineUsers.length} {dictionary.accounts}
          </span>
        </span>
      )} */}
      {((driffSettings.READ_RELEASE_UPDATES && userSettings.READ_RELEASE_UPDATES && driffSettings.READ_RELEASE_UPDATES.timestamp > userSettings.READ_RELEASE_UPDATES.timestamp) || userSettings?.READ_RELEASE_UPDATES === null) &&
        renderGifIcon()}
      <li className="nav-item dropdown">
        <a href="/" className="nav-link" data-toggle="search" onClick={toggleDropdown}>
          <ToolTip content={dictionary.generalSearch}>
            <SvgIconFeather icon="search" />
          </ToolTip>
        </a>
        {dropDown.name === "search" && dropDown.value && <SearchDropDown hideSearch={hideSearch} />}
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
      <li className="nav-item dropdown" onClick={toggleShowProfileDropdown}>
        <span className="nav-link profile-button">
          <ToolTip content={loggedUser.name}>
            <div className="avatar-overlay" />
            <Avatar name={form.name} id={form.id} type="USER" className="avatar-top-bar" imageLink={form.profile_image_link} noDefaultClick={true} />
          </ToolTip>
        </span>
        {showUserProfileDropdown && <UserProfileDropDown user={form} closeDropdown={toggleShowProfileDropdown} />}
      </li>
    </Wrapper>
  );
};

export default React.memo(HomeProfileNavigation);
