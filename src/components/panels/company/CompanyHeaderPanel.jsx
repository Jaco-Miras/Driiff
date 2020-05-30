import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useRouteMatch} from "react-router-dom";
import styled from "styled-components";
import {Avatar, NavLink, SvgIconFeather} from "../../common";

const NavBar = styled.ul`
    li {
        justify-content: center;
        align-items: center;

        h2 {
            letter-spacing: -0.5px;
            margin-bottom: 0;
            color: #82828A;
            font-weight: 500;
        }

    }
`;

const CompanyName = styled.h2`
    margin-right: 1rem;
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
`;

const MainNavLink = styled(NavLink)`
    padding: 10px 40px;
    border-radius: 8px;
    color: #828282;
    margin: 0 0.2rem;

    &.active {
        background-color: #7a1b8b;
        color: #fff;
    }
`;

const CompanyHeaderPanel = (props) => {

    const dispatch = useDispatch();
    const match = useRouteMatch();
    const user = useSelector(state => state.session.user);


    const setThemeButton = (e) => {
        const body = document.body;
        body.classList.toggle("dark");
    };


    useEffect(() => {
        const body = document.body;
        body.classList.add("navigation-toggle-one");

        if (match.params.page === "people") {
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
    }, [match.params, dispatch]);

    return (
        <>
            <div>
                <NavBar className="navbar-nav">
                    <li className="nav-item navigation-toggler mobile-toggler">
                        <a href="/" className="nav-link" title="Show navigation">
                            <SvgIconFeather icon="menu"/>
                        </a>
                    </li>
                    <li className="nav-item">
                        <CompanyName>ZUID Creatives</CompanyName>
                    </li>
                    <li className="nav-item">
                        <MainNavLink to="/dashboard">Dashboard</MainNavLink>
                    </li>
                    <li className="nav-item">
                        <MainNavLink to="/posts">Posts</MainNavLink>
                    </li>
                    <li className="nav-item">
                        <MainNavLink to="/chat">Chat</MainNavLink>
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
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <a href="/" className="nav-link dropdown-toggle" data-toggle="dropdown">
                            <img className="mr-2"
                                 src={require("../../../assets/media/image/flags/262-united-kingdom.png")} alt="flag"
                                 width="18"/> English
                        </a>
                        <div className="dropdown-menu">
                            <a href="/" className="nav-link dropdown-toggle" data-toggle="dropdown">
                                <img className="mr-2"
                                     src={require("../../../assets/media/image/flags/262-united-kingdom.png")}
                                     alt="flag"
                                     width="18"/> English
                            </a>
                            <a href="/" className="dropdown-item">
                                <img src={require("../../../assets/media/image/flags/195-netherlands.png")}
                                     className="mr-2" alt="flag"
                                     width="18"/>
                                Dutch
                            </a>
                        </div>
                    </li>
                    <li className="nav-item">
                        <ThemeSwitch title="Light or Dark mode" onClick={setThemeButton}>
                            <SvgIconFeather icon="moon"/>
                        </ThemeSwitch>
                    </li>
                    <li className="nav-item dropdown">
                        <a href="/" className="nav-link nav-link-notify" title="Notifications"
                           data-toggle="dropdown">
                            <SvgIconFeather icon="bell"/>
                        </a>
                    </li>
                    <li className="nav-item dropdown">
                        <Avatar name={user.name} imageLink={user.profile_image_link}/>
                        <div className="dropdown-menu dropdown-menu-right dropdown-menu-big">
                            <div id="ascrail2003" className="nicescroll-rails nicescroll-rails-vr"
                                 styles="width: 8px; z-index: 1000; cursor: default; position: absolute; top: 65.8px; left: 292px; height: 299px; display: none;">
                                <div
                                    styles="position: relative; top: 0px; float: right; width: 6px; height: 0px; background-color: rgb(66, 66, 66); border: 1px solid rgb(255, 255, 255); background-clip: padding-box; border-radius: 5px;"
                                    className="nicescroll-cursors"></div>
                            </div>
                            <div id="ascrail2003-hr" className="nicescroll-rails nicescroll-rails-hr"
                                 styles="height: 8px; z-index: 1000; top: 356.8px; left: 0px; position: absolute; cursor: default; display: none;">
                                <div
                                    styles="position: absolute; top: 0px; height: 6px; width: 0px; background-color: rgb(66, 66, 66); border: 1px solid rgb(255, 255, 255); background-clip: padding-box; border-radius: 5px;"
                                    className="nicescroll-cursors"></div>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </>
    );
};

export default React.memo(CompanyHeaderPanel);