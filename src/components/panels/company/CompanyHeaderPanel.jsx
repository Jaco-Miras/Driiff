import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useRouteMatch} from "react-router-dom";
import styled from "styled-components";
import {SvgIconFeather} from "../../common";
import {HeaderProfileNavigation} from "../common";
import {CompanyPageHeaderPanel} from "../company";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  width: 100%;    
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
  @media all and (max-width: 700px) {
    align-items: start;
  }
`;

const CompanyName = styled.h2`
  letter-spacing: 0;
  margin-bottom: 0;
  color: #000000;
  font-weight: normal;
  font-size: 20px;
  svg {
    color: #64625c;
  }
  @media all and (max-width: 620px) {
    font-size: 16px;
  }
`;

const CompanyHeaderPanel = () => {
  // const dispatch = useDispatch();
  const match = useRouteMatch();

  const unreadCounter = useSelector((state) => state.global.unreadCounter);
  // const { driffSettings } = useSettings();

  const dispatch = useDispatch();
  const [pageName, setPageName] = useState("Dashboard");
  const driff = useSelector((state) => state.settings.driff);

  const handleMenuOpenMobile = (e) => {
    e.preventDefault();
    document.body.classList.add("navigation-show");
  };

  useEffect(() => {
    const body = document.body;

    if (["people", "workspace", "post", "posts", "notifications", "settings"].includes(match.params.page)) {
      body.classList.remove("stretch-layout");
    } else {
      body.classList.add("stretch-layout");
    }

    let page = "";
    switch (match.params.page) {
      case "posts": {
        page = "Posts";
        setPageName(page);
        break;
      }
      case "chat": {
        page = "Chat";
        setPageName(page);
        break;
      }
      case "files": {
        page = "Files";
        setPageName(page);
        break;
      }
      case "notifications": {
        page = "Notifications";
        setPageName(page);
        break;
      }
      case "people": {
        page = "People";
        setPageName(page);
        break;
      }
      case "profile": {
        page = "Profile";
        setPageName(page);
        break;
      }
      case "search": {
        page = "Search";
        setPageName(page);
        break;
      }
      case "settings": {
        page = "Settings";
        setPageName(page);
        break;
      }
      case "todos": {
        page = "To-dos & Reminders";
        setPageName(page);
        break;
      }
      default: {
        page = "Dashboard";
        setPageName(page);
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
                  <SvgIconFeather icon="menu"/>
                </a>
              </li>
              <li className="nav-item nav-item-folder">
                <CompanyName className="current-title">{pageName}</CompanyName>
              </li>
            </div>
            {
              match.params.page !== "todos" &&
              <div className="navbar-bottom">
                <div className="navbar-main">
                  <CompanyPageHeaderPanel/>
                </div>
              </div>
            }
          </div>
        </div>
      </div>

      <div>
        <HeaderProfileNavigation/>
      </div>
    </Wrapper>
  );
};

export default React.memo(CompanyHeaderPanel);
