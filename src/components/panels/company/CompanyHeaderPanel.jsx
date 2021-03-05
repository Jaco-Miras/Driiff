import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import { SvgIconFeather } from "../../common";
import { HeaderProfileNavigation } from "../common";
import { CompanyPageHeaderPanel } from "../company";
import { useTranslation } from "../../hooks";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  width: 100%;

  &.page-notifications,
  &.page-profile,
  &.page-settings,
  &.page-system,
  &.page-todos {
    .navbar-left {
      .navbar-nav {
        .navbar-wrap {
          .navbar-top {
            height: 100%;
          }
        }
      }
    }
  }
  .navbar-left {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    padding-right: 15px;
    .navbar-nav {
      height: 100%;
      .navbar-wrap {
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .navbar-top {
          margin-top: 4px;
          display: flex;
          align-items: center;
          height: 40px;
        }
        .navbar-bottom {
          @media all and (max-width: 700px) {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            padding: 0 16px;
          }
        }
      }
      @media all and (max-width: 700px) {
        margin-left: 0;
        display: flex;
        justify-content: space-between;
      }
    }
  }
  svg.feather-menu {
    color: #7a1b8b !important;
  }
  svg.feather-home {
    color: rgb(80, 80, 80);

    .dark & {
      color: #fff;
    }
  }
  .dash {
  }
  @media all and (max-width: 700px) {
    align-items: start;
  }
`;

const CompanyName = styled.h2`
  letter-spacing: 0;
  margin-bottom: 0;
  color: rgb(80, 80, 80);
  font-weight: 500;
  font-size: 20px;
  margin-right: 2px;

  .dark & {
    color: #fff;
  }

  svg {
    color: #64625c;
  }

  @media all and (max-width: 620px) {
    font-size: 16px;
  }
`;

const CompanyHeaderPanel = () => {
  const match = useRouteMatch();

  const {
    driff,
    user: {
      GENERAL_SETTINGS: { dark_mode },
    },
  } = useSelector((state) => state.settings);
  const unreadCounter = useSelector((state) => state.global.unreadCounter);
  const { _t } = useTranslation();

  const dictionary = {
    pageTitleDashboard: _t("PAGE_TITLE.DASHBOARD", "Dashboard"),
    pageTitlePosts: _t("PAGE_TITLE.POSTS", "Posts"),
    pageTitleChat: _t("PAGE_TITLE.CHAT", "Chat"),
    pageTitleFiles: _t("PAGE_TITLE.FILES", "Files"),
    pageTitleNotifications: _t("PAGE_TITLE.NOTIFICATIONS", "Notifications"),
    pageTitlePeople: _t("PAGE_TITLE.PEOPLE", "People"),
    pageTitleProfile: _t("PAGE_TITLE.PROFILE", "Profile"),
    pageTitleSearch: _t("PAGE_TITLE.SEARCH", "Search"),
    pageTitleSettings: _t("PAGE_TITLE.SETTINGS", "Settings"),
    pageTitleTodos: _t("PAGE_TITLE.TODOS", "Reminders"),
    pageTitleSystemPeople: _t("PAGE_TITLE.SYSTEM_PEOPLE", "All people"),
    generalSearch: _t("GENERAL.SEARCH", "Search"),
    generalNotifications: _t("GENERAL.NOTIFICATIONS", "Notifications"),
    generalSwitchTheme: _t("SETTINGS.SWITCH_TO_THEME_MODE", "Switch to ::mode::", {
      mode: dark_mode === "0" ? _t("SETTINGS.DARK_MODE", "dark mode") : _t("SETTINGS.LIGHT_MODE", "light mode"),
    }),
  };

  const dispatch = useDispatch();

  const [pageName, setPageName] = useState(dictionary.pageTitleDashboard);

  const handleMenuOpenMobile = (e) => {
    e.preventDefault();
    document.body.classList.add("navigation-show");
  };

  const renderMainTitle = () => {
    switch (match.params.page) {
      case "notifications": {
        return (
          <>
            <SvgIconFeather className="mr-2" icon="bell" />
            <CompanyName>{dictionary.pageTitleNotifications}</CompanyName>
          </>
        );
      }
      case "profile": {
        return (
          <>
            <SvgIconFeather className="mr-2" icon="user" />
            <CompanyName>{dictionary.pageTitleProfile}</CompanyName>
          </>
        );
      }
      case "settings": {
        return (
          <>
            <SvgIconFeather className="mr-2" icon="settings" />
            <CompanyName>{dictionary.pageTitleSettings}</CompanyName>
          </>
        );
      }
      case "todos": {
        return (
          <>
            <SvgIconFeather className="mr-2" icon="check" />
            <CompanyName>{dictionary.pageTitleTodos}</CompanyName>
          </>
        );
      }
      case "system": {
        return (
          <>
            <SvgIconFeather className="mr-2" icon="user" />
            <CompanyName>{dictionary.pageTitleSystemPeople}</CompanyName>
          </>
        );
      }
      default: {
        return (
          <>
            <SvgIconFeather className="mr-2" icon="home" /> <CompanyName>{driff.company_name}</CompanyName>
          </>
        );
      }
    }
  };

  useEffect(() => {
    const body = document.body;

    if (["people", "workspace", "notifications"].includes(match.params.page)) {
      body.classList.remove("stretch-layout");
    } else {
      body.classList.add("stretch-layout");
    }

    switch (match.params.page) {
      case "posts": {
        setPageName(dictionary.pageTitlePosts);
        break;
      }
      case "chat": {
        setPageName(dictionary.pageTitleChat);
        break;
      }
      case "files": {
        setPageName(dictionary.pageTitleFiles);
        break;
      }
      case "notifications": {
        setPageName(dictionary.pageTitleNotifications);
        break;
      }
      case "people": {
        setPageName(dictionary.pageTitlePeople);
        break;
      }
      case "profile": {
        setPageName(dictionary.pageTitleProfile);
        break;
      }
      case "search": {
        setPageName(dictionary.pageTitleSearch);
        break;
      }
      case "settings": {
        setPageName(dictionary.pageTitleSettings);
        break;
      }
      case "todos": {
        setPageName(dictionary.pageTitleTodos);
        break;
      }
      default: {
        setPageName(dictionary.pageTitleDashboard);
      }
    }

    if (unreadCounter.chat_message >= 1 || unreadCounter.unread_channel > 0) {
      document.title = `${pageName} ‹ * ${driff.company_name} @ Driff`;
    } else {
      document.title = `${pageName} ‹ ${driff.company_name} @ Driff`;
    }
  }, [match.params.page, dispatch, pageName]);

  return (
    <Wrapper className={`page-${match.params.page}`}>
      <div className="navbar-left">
        <div className="navbar-nav">
          <div className="navbar-wrap">
            <div className="navbar-top">
              <li className="nav-item navigation-toggler mobile-toggler">
                <a href="/" className="nav-link" title="Show navigation" onClick={handleMenuOpenMobile}>
                  <SvgIconFeather icon="menu" />
                </a>
              </li>
              <li className="nav-item nav-item-folder d-inline-flex justify-content-start align-items-center">{renderMainTitle()}</li>
            </div>
            {!["todos", "system", "notifications", "profile", "settings"].includes(match.params.page) && (
              <div className="navbar-bottom">
                <div className="navbar-main">
                  <CompanyPageHeaderPanel dictionary={dictionary} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div>
        <HeaderProfileNavigation dictionary={dictionary} />
      </div>
    </Wrapper>
  );
};

export default React.memo(CompanyHeaderPanel);
