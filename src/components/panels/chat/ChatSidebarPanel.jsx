import React, {useRef, useState} from "react";
import {useSelector} from "react-redux";
import styled from "styled-components";
import SearchForm from "../../forms/SearchForm";
import {ChatSideBarContentPanel} from "./index";


const Wrapper = styled.div`
    .nav-tabs {
        .nav-item {
            cursor: pointer;
            cursor: hand;
        }
    }
`;

const Search = styled(SearchForm)`
    margin: 0 0 1.5rem !important;
`;

const ChatSidebarPanel = (props) => {

    const {className = ""} = props;

    const settings = useSelector(state => state.settings.userSettings);
    const [search, setSearch] = useState("");
    const [tabPill, setTabPill] = useState("pills-home");
    const ref = {
        navTab: useRef(),
    };

    const onSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const handleSearch = (e) => {
    };

    const handleTabChange = (e) => {
        setTabPill(e.target.getAttribute("aria-controls"));
        ref.navTab.current.querySelector(".nav-link.active").classList.remove("active");
        e.target.classList.add("active");
    };

    return (
        <Wrapper className={`chat-sidebar ${className}`}>
            <div className="chat-sidebar-header">
                <Search onChange={onSearchChange} onClick={handleSearch} placeholder="Chat search"/>
                <ul ref={ref.navTab} className="nav nav-tabs" role="tablist">
                    <li className="nav-item">
                        <span className="nav-link active" id="pills-home-tab" data-toggle="pill"
                              onClick={handleTabChange} role="tab" aria-controls="pills-home"
                              aria-selected="true">Chats</span>
                    </li>
                    <li className="nav-item">
                        <span className="nav-link" id="pills-contact-tab" data-toggle="pill"
                              onClick={handleTabChange} role="tab" aria-controls="pills-contact"
                              aria-selected="false">Contacts</span>
                    </li>
                </ul>
            </div>
            <ChatSideBarContentPanel pill={tabPill} isLoaded={settings.isLoaded} search={search}/>
        </Wrapper>
    );
};

export default React.memo(ChatSidebarPanel);