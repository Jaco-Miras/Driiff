import React, {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import styled from "styled-components";
import {toggleLoading} from "../../../redux/actions/globalActions";
import {Avatar, SvgIconFeather} from "../../common";
import Flag from "../../common/Flag";
import {useOutsideClick, useSettings, useTranslation} from "../../hooks";
import {NotificationDropDown} from "../dropdown";
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
                    z-index:1;
                }
                .avatar {
                    position: relative;
                    z-index:0;
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
`;

const HomeProfileNavigation = (props) => {

    const {className = ""} = props;

    const dispatch = useDispatch();

    const {generalSettings: {dark_mode, language}, setGeneralSetting} = useSettings();
    const {_t, setLocale} = useTranslation();

    const user = useSelector(state => state.session.user);
    const [currentPopUp, setCurrentPopUp] = useState(null);

    const refs = {
        container: useRef(null),
    };

    const languageOptions = {
        "en": _t("LANGUAGE.ENGLISH", "English"),
        "nl": _t("LANGUAGE.DUTCH", "Dutch"),
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
    };

    const handleSelectLanguage = (e) => {
        e.preventDefault();
        e.currentTarget.closest(".nav-item")
            .querySelector(".dropdown-menu")
            .classList.toggle("show");

        dispatch(
            toggleLoading(),
        );
        setLocale(e.target.dataset.lang, () => {
            dispatch(
                toggleLoading(),
            );
        });
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
    };

    useOutsideClick(currentPopUp, hidePopUp, currentPopUp !== null);

    return (
        <Wrapper
            ref={refs.container}
            className={`header-profile-navigation navbar-nav ${className}`}>
            <li className="nav-item dropdown">
                <a href="/" className="nav-link dropdown-toggle" data-toggle="dropdown" onClick={toggleDropdown}>
                    <Flag countryAbbr={language} className="mr-2" width="18"/>
                    {languageOptions[language]} {_t("SAMPLE", "sample")}
                </a>
                <div className="dropdown-menu">
                    <a href="/" className="dropdown-item" onClick={handleSelectLanguage} data-lang="en">
                        <Flag countryAbbr="uk" className="mr-2" width="18"/>
                        {languageOptions.en}
                    </a>
                    <a href="/" className="dropdown-item" onClick={handleSelectLanguage} data-lang="nl">
                        <Flag countryAbbr="nl" className="mr-2" width="18"/>
                        {languageOptions.nl}
                    </a>
                </div>
            </li>
            <li className="nav-item">
                <ThemeSwitch title="Light or Dark mode" onClick={setThemeButton}>
                    <SvgIconFeather icon="moon"/>
                </ThemeSwitch>
            </li>
            <li className="nav-item dropdown">
                <a href="/" className="nav-link nav-link-notify" title="Notifications" data-toggle="dropdown"
                   onClick={toggleDropdown}>
                    <SvgIconFeather icon="bell"/>
                </a>
                <NotificationDropDown/>
            </li>
            <li className="nav-item dropdown">

                <a href="/" className="nav-link profile-button" data-toggle="dropdown" title={user.name}
                   onClick={toggleDropdown}>
                    <div className="avatar-overlay"/>
                    <Avatar name={user.name} imageLink={user.profile_image_link} noDefaultClick={true}/>
                </a>
                <UserProfileDropDown user={user}/>
            </li>
        </Wrapper>
    );
};

export default React.memo(HomeProfileNavigation);