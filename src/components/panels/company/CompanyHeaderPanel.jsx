import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {useRouteMatch} from "react-router-dom";
import styled from "styled-components";
import {NavLink, SvgIconFeather} from "../../common";
import useSettings from "../../hooks/useSettings";
import {HeaderProfileNavigation} from "../common";

const NavBarLeft = styled.div`
  width: 100%;
  border-right: 1px solid #ebebeb;
  height: 100%;
  display: flex;
  align-items: center;
  margin-right: 14px;
  padding-right: 14px;
  .nav-link {
    padding: 0px !important;
    background: transparent !important;
    svg {
      color: #7A1B8B;
      width: 24px !important;
      height: 24px !important;
    }
  }
`;

const NavBar = styled.ul`
  display: flex;
  width: 100%;
  align-items: center;
  li {
    justify-content: center;
    align-items: center;
  }
`;

const CompanyName = styled.h2`
  letter-spacing: 0;
  margin-bottom: 0;
  color: #000000;
  font-weight: normal;
  font-size: 19px;
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

  // const unreadCounter = useSelector((state) => state.global.unreadCounter);
  // const { driffSettings } = useSettings();

  const [pageName, setPageName] = useState("Dashboard");

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
      default: {
        page = "Dashboard";
        setPageName(page);
      }
    }
    document.title = `Driff - ${page}`;
  }, [match.params]);

  return (
    <>
      <NavBarLeft>
        <NavBar className="navbar-nav">
            <li className="nav-item navigation-toggler mobile-toggler">
              <a href="/" className="nav-link" title="Show navigation" onClick={handleMenuOpenMobile}>
                  <SvgIconFeather icon="menu" />
              </a>
            </li>
            <li className="nav-item nav-item-folder">
                <CompanyName>{pageName}</CompanyName>
            </li>
        </NavBar>
      </NavBarLeft>
      <div>
        <HeaderProfileNavigation />
      </div>
    </>
  );
};

export default React.memo(CompanyHeaderPanel);
