import React, {useState} from "react";
import {useSelector} from "react-redux";
import styled from "styled-components";
import SearchForm from "../../forms/SearchForm";
import {ChatSideBarContentPanel} from "./index";


const Wrapper = styled.div`
`;

const ChatSidebarPanel = (props) => {

    const {className = ""} = props;

    const settings = useSelector(state => state.settings.userSettings);
    const [search, setSearch] = useState("");
    const [tabPill, setTabPill] = useState("pills-home");

    const onSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const handleSearch = (e) => {
    };

    const handleTabChange = (e) => {
        setTabPill(e.target.getAttribute("aria-controls"));
    };

    return (
        <Wrapper className={`chat-sidebar ${className}`}>
            <div className="chat-sidebar-header">
                {/* <div className="d-flex">
                 <div className="pr-3">
                 <div className="avatar avatar-sm">
                 <img src="https://via.placeholder.com/128X128" className="rounded-circle"
                 alt="fpo-placeholder"/>
                 </div>
                 </div>
                 <div>
                 <h6 className="mb-1">Nikos Pedlow</h6>
                 <div className="m-0 small text-muted">Administrator</div>
                 </div>
                 <div className="ml-auto">
                 <div className="dropdown">
                 <a href="/" data-toggle="dropdown">
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                 viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"
                 className="feather feather-settings width-18 height-18"
                 data-toggle="tooltip" title="" data-original-title="Settings">
                 <circle cx="12" cy="12" r="3"></circle>
                 <path
                 d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                 </svg>
                 </a>
                 <div className="dropdown-menu dropdown-menu-right">
                 <a className="dropdown-item" href="/">View Profile</a>
                 <a className="dropdown-item" href="/">Edit Profile</a>
                 <a className="dropdown-item" href="/">Add status</a>
                 <a className="dropdown-item" href="/">Settings</a>
                 </div>
                 </div>
                 </div>
                 </div> */}
                <SearchForm onChange={onSearchChange} onClick={handleSearch}/>
                <ul className="nav nav-tabs" id="pills-tab" role="tablist">
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