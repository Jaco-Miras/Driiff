import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import styled from "styled-components";
import {toggleLoading} from "../../../redux/actions/globalActions";
import {Avatar, SvgIconFeather} from "../../common";
import Flag from "../../common/Flag";
import {_t, setLocale} from "../../hooks/useTranslation";
import {NotificationDropDown} from "../dropdown";
import UserProfileDropDown from "../dropdown/UserProfileDropdown";

const Wrapper = styled.ul`
    > li {
        position: relative;
        
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
    const user = useSelector(state => state.session.user);
    const language = useSelector(state => state.settings.user.LANGUAGE);

    const languageOptions = {
        "en": _t("LANGUAGE.ENGLISH", "English"),
        "nl": _t("LANGUAGE.DUTCH", "Dutch"),
    };

    const setThemeButton = (e) => {
        hideActiveDropDown(e);

        const body = document.body;
        body.classList.toggle("dark");
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
        setLocale(e.target.dataset.lang, dispatch, () => {
            dispatch(
                toggleLoading(),
            );
        });
    };

    return (
        <Wrapper className={`header-profile-navigation navbar-nav${className}`}>
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
                <a href="/" className="nav-link" data-toggle="dropdown" title={user.name} onClick={toggleDropdown}>
                    <Avatar name={user.name} imageLink={user.profile_image_link} noClick={true}/>
                </a>
                <UserProfileDropDown/>
            </li>
        </Wrapper>
    );
};

export default React.memo(HomeProfileNavigation);