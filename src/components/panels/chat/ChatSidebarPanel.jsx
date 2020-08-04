import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import SearchForm from "../../forms/SearchForm";
import { ChatSideBarContentPanel } from "./index";
import { usePreviousValue } from "../../hooks";

const Wrapper = styled.div`
  .nav-tabs {
    .nav-item {
      cursor: pointer;
      @media (max-width: 480px) {
        width: 100% !important;
        border: 0 !important;
        .nav-link {
          border: 1px solid #ebebeb;
          border-radius: 0.5rem;
          background-color: #fafafa;
          margin-bottom: 4px;
          &.active {
            background-color: #7a1b8b;
            color: #ffffff;
            border-color: #7a1b8b;
          }
        }
      }
    }
    @media (max-width: 480px) {
      border: 0;
    }

  }
`;

const Search = styled(SearchForm)`
  margin: 0 0 1.5rem !important;

  .form-control {
    border-radius: 8px !important;
    padding-left: 40px;
    transition: padding-left 0.4s cubic-bezier(0.275, 0.42, 0, 1);
    &:focus {
      padding-left: 12px;
    }
  }
  .input-group-append {
    position: absolute;
    top: 2px;
    left: 0;
    button {
      border: 0 !important;
      padding: 10px 14px !important;
      color: #AAAAAA;
      pointer-events: none;
    }
  }

  @media (max-width: 480px) {
    margin: 0 0 0.75rem !important;
  }
  &:placeholder {
    color: #AAAAAA;
  }
`;

const ChatSidebarPanel = (props) => {
  const { className = "", activeTabPill = "pills-home", channels, userChannels, selectedChannel } = props;

  const [search, setSearch] = useState("");
  const [tabPill, setTabPill] = useState(activeTabPill);
  const previousChannel = usePreviousValue(selectedChannel);

  const refs = {
    navTab: useRef(),
  };

  const onSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleTabChange = useCallback(
    (e) => {
      setTabPill(e.target.getAttribute("aria-controls"));
      refs.navTab.current.querySelector(".nav-link.active").classList.remove("active");
      e.target.classList.add("active");
    },
    [setTabPill]
  );

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

  useEffect(() => {
    if (previousChannel === null && selectedChannel !== null) {
      if (selectedChannel.type === "TOPIC") {
        setTabPill("pills-workspace-internal");
        refs.navTab.current.querySelector(".nav-link.active").classList.remove("active");

        let e = refs.navTab.current.querySelector(".nav-link[aria-controls=\"pills-workspace-internal\"]");
        if (e) {
          e.classList.add("active");
        }
      }
    }
  }, [selectedChannel, previousChannel, setTabPill]);

  return (
    <Wrapper className={`chat-sidebar ${className}`}>
      <div className="chat-sidebar-header">
        <Search onChange={onSearchChange} className="chat-search" placeholder="Search contacts or chats" />
        <ul ref={refs.navTab} className="nav nav-pills" role="tabList">
          <li className="nav-item">
            <span className="nav-link active" id="pills-home-tab" data-toggle="pill" onClick={handleTabChange} role="tab" aria-controls="pills-home" aria-selected="true">
              Chats
            </span>
          </li>
          <li className="nav-item">
            <span className="nav-link" id="pills-contact-tab" data-toggle="pill" onClick={handleTabChange} role="tab" aria-controls="pills-contact" aria-selected="false">
              Contacts
            </span>
          </li>
          <li className="nav-item">
            <span className="nav-link" id="pills-workspace-tab" data-toggle="pill" onClick={handleTabChange} role="tab" aria-controls="pills-workspace-internal" aria-selected="false">
              Workspace chats
            </span>
          </li>
          {/* <li className="nav-item">
                        <span className="nav-link" id="pills-workspace-tab" data-toggle="pill"
                              onClick={handleTabChange} role="tab" aria-controls="pills-workspace-external"
                              aria-selected="false">Workspace - External</span>
                    </li> */}
        </ul>
      </div>
      <ChatSideBarContentPanel pill={tabPill} search={search} channels={channels} userChannels={userChannels} selectedChannel={selectedChannel} />
    </Wrapper>
  );
};

export default React.memo(ChatSidebarPanel);
