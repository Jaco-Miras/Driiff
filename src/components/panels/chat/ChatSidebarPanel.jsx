import React, {useCallback, useEffect, useRef, useState} from "react";
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

    const {className = "", activeTabPill = "pills-home", channels, userChannels, selectedChannel} = props;

    const [search, setSearch] = useState("");
    const [tabPill, setTabPill] = useState(activeTabPill);

    const refs = {
        navTab: useRef(),
    };

    const onSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const handleTabChange = useCallback((e) => {
        setTabPill(e.target.getAttribute("aria-controls"));
        refs.navTab.current.querySelector(".nav-link.active").classList.remove("active");
        e.target.classList.add("active");
    }, [setTabPill]);

    useEffect(() => {
        refs.navTab.current.querySelector(".nav-link.active").classList.remove("active");

        let e = refs.navTab.current.querySelector(`.nav-link[aria-controls="${activeTabPill}"]`);
        if (e) {
            e.classList.add("active");
            setTabPill(e.getAttribute("aria-controls"));
        } else {
            console.log(`[aria-controls="${activeTabPill}"]`);
        }
    }, [activeTabPill]);

    return (
        <Wrapper className={`chat-sidebar ${className}`}>
            <div className="chat-sidebar-header">
                <Search onChange={onSearchChange} placeholder="Chat search"/>
                <ul ref={refs.navTab} className="nav nav-tabs" role="tabList">
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
                    <li className="nav-item">
                        <span className="nav-link" id="pills-workspace-tab" data-toggle="pill"
                              onClick={handleTabChange} role="tab" aria-controls="pills-workspace-internal"
                              aria-selected="false">Workspace chats</span>
                    </li>
                    {/* <li className="nav-item">
                        <span className="nav-link" id="pills-workspace-tab" data-toggle="pill"
                              onClick={handleTabChange} role="tab" aria-controls="pills-workspace-external"
                              aria-selected="false">Workspace - External</span>
                    </li> */}
                </ul>
            </div>
            <ChatSideBarContentPanel
                pill={tabPill} search={search}
                channels={channels}
                userChannels={userChannels}
                selectedChannel={selectedChannel}/>
        </Wrapper>
    );
};

export default React.memo(ChatSidebarPanel);