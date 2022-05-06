import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import SearchForm from "../../forms/SearchForm";
import { ChatSideBarContentPanel } from "./index";
import { useLoadChannel, useSettings, useTranslationActions, useChannelActions } from "../../hooks";
import { MoreOptions } from "../common";
import { addToModals } from "../../../redux/actions/globalActions";
import { SvgIconFeather } from "../../common";
import { useParams } from "react-router-dom";
import { isMobile } from "react-device-detect";

const Wrapper = styled.div`
  z-index: 2;
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
            background-color: ${(props) => props.theme.colors.primary};
            color: #ffffff;
            border-color: ${(props) => props.theme.colors.primary};
          }
        }
      }
    }
    @media (max-width: 480px) {
      border: 0;
    }
  }
  &:after {
    content: "";
    width: 1px;
    height: calc(100% - 24px);
    display: block;
    background: #dee2e6;
    position: absolute;
    top: 0;
    right: 0;
    z-index: 6;
    background: rgb(222, 226, 230);
    .dark & {
      background: #333539;
    }
    @media (max-width: 991.99px) {
      display: none;
    }
  }
  .chat-sidebar-options-container {
    height: 38px;
  }
`;

const Search = styled(SearchForm)`
  flex-grow: 1;
  margin: 0 0.5rem 0 0 !important;

  .form-control {
    border-radius: 8px !important;
    padding-left: 40px;
    transition: padding-left 0.4s cubic-bezier(0.275, 0.42, 0, 1);
    &:focus {
      padding-left: 12px;
    }
  }
  .not-empty .form-control {
    padding-left: 12px;
  }
  .not-empty .input-group-append {
    display: none;
  }
  .btn-cross {
    right: 0 !important;
  }
  .input-group-append {
    position: absolute;
    top: 2px;
    left: 0;
    button {
      border: 0 !important;
      padding: 10px 14px !important;
      color: #aaaaaa;
      pointer-events: none;
    }
  }

  @media (max-width: 480px) {
    margin: 0 0 0.75rem !important;
  }
  &::placeholder {
    color: #aaaaaa;
  }
`;

const StyledMoreOptions = styled(MoreOptions)`
  border: 1px solid #fff;
  border-radius: 8px;
  height: 36px;
  width: 40px;
  align-items: center;
  justify-content: center;
  &:hover {
    cursor: pointer;
    color: ${(props) => props.theme.colors.primary};
    border: ${(props) => `1px solid ${props.theme.colors.primary}`} !important;
  }
  .dark & {
    border: 1px solid #25282c;
    background: #25282c;
  }
  .feather-more-horizontal {
    width: 25px;
    height: 36px;
  }
  .more-options-tooltip {
    left: auto;
    right: 0;
    top: 25px;
    width: 250px;

    svg {
      width: 14px;
    }
  }

  @media (max-width: 480px) {
    margin: 0 0 0.75rem !important;
  }
`;

const ChatSidebarPanel = (props) => {
  const { className = "" } = props;

  const params = useParams();
  const dispatch = useDispatch();
  const searchArchivedChannels = useSelector((state) => state.chat.searchArchivedChannels);
  const { chatSettings, setChatSetting } = useSettings();
  const channelActions = useChannelActions();
  const chatSidebarSearch = useSelector((state) => state.chat.chatSidebarSearch);
  useLoadChannel();
  const searchingChannels = useSelector((state) => state.chat.searchingChannels);

  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [tabPill, setTabPill] = useState(chatSettings.chat_filter);

  const refs = {
    container: useRef(null),
    navTab: useRef(null),
  };

  const searchRef = useRef(null);

  const onSearchChange = (e) => {
    setQuery(e.target.value);
  };

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      channelActions.setSidebarSearch({
        value: query,
        searching: query.trim() !== "",
      });

      setChatSetting({
        filter_channel: false,
      });
      // const firstChannel = document.querySelector(".first-channel");
      // if (firstChannel) {
      //   firstChannel.focus();
      // }
      if (query.trim() !== "") {
        let payload = { search: query, skip: 0, limit: 25 };
        if (searchArchivedChannels) {
          payload = {
            ...payload,
            filter: "archived",
          };
        }
        channelActions.search(payload, (err, res) => {
          if (searchRef.current) searchRef.current.blur();
          if (err) return;
          const firstChannel = document.querySelector(".first-channel");
          if (firstChannel) firstChannel.focus();
        });
      }
    }, 300);
    return () => clearTimeout(timeOutId);
  }, [query, searchArchivedChannels]);

  const emptySearchInput = () => {
    setSearch("");
    setQuery("");
  };

  const handleResetFilter = () => {
    setTabPill("pills-home");
  };

  const handleTabChange = (e) => {
    if (tabPill === e.target.getAttribute("aria-controls")) {
      handleResetFilter();
    } else {
      setTabPill(e.target.getAttribute("aria-controls"));
    }
  };

  const { _t } = useTranslationActions();

  const dictionary = {
    chats: _t("CHAT.CHATS", "Chats"),
    contacts: _t("CHAT.CONTACTS", "Contacts"),
    workspaceChats: _t("CHAT.WORKSPACE_CHATS", "Workspace chats"),
    recentChats: _t("CHAT.RECENT_CHATS", "Recent chats"),
    newGroupChat: _t("CHAT.NEW_GROUP_CHAT", "New group chat"),
    searchChatPlaceholder: _t("CHAT.SEARCH_CHAT_PLACEHOLDER", "Search contacts or chats"),
    recent: _t("CHAT.RECENT", "Recent"),
    favorite: _t("CHAT.FAVORITE", "Favorite"),
    hidden: _t("CHAT.HIDDEN", "Hidden"),
    pinned: _t("CHAT.PINNED", "Pinned"),
    startNew: _t("CHAT.START_NEW", "Start new"),
    viewOpenWorkspace: _t("CHAT.VIEW_OPEN_WORKSPACE", "View open workspace"),
    archived: _t("CHAT.ARCHIVED", "Archived"),
    nothingToSeeHere: _t("CHAT.NOTHING_TO_SEE_HERE", "Nothing to see here!"),
    noMatchingChats: _t("CHAT.NO_MATCHING_CHATS", "No matching chats found"),
    messageRemoved: _t("CHAT.MESSAGE_REMOVED", "The chat message has been removed."),
    personalBot: _t("CHAT.PERSONAL_BOT", "Personal bot"),
    you: _t("CHAT.PREVIEW_AUTHOR_YOU", "You"),
    showArchived: _t("CHAT.SHOW_ARCHIVED", "Show archived"),
    withTeam: _t("CHANNEL.WITH_TEAM", "Team Chat"),
    withClient: _t("CHANNEL.WITH_CLIENT", "Client Chat"),
    team: _t("TEAM", "Team"),
    personalNotes: _t("CHANNEL.PERSONAL_NOTES", "Personal Notes"),
  };

  const handleOpenGroupChatModal = () => {
    let payload = {
      type: "chat_create_edit",
      mode: "new",
    };

    dispatch(addToModals(payload));
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      return false;
    }
    if (e.keyCode === 27) {
      emptySearchInput();
    }
  };

  useEffect(() => {
    if (chatSettings.chat_filter !== tabPill) {
      setChatSetting({
        chat_filter: tabPill,
      });
    }
  }, [chatSettings.chat_filter, tabPill]);

  useEffect(() => {
    if (chatSidebarSearch === "") {
      emptySearchInput();
    } else {
      setSearch(chatSidebarSearch);
    }
  }, [chatSidebarSearch]);

  useEffect(() => {
    if (params.messageId) {
      document.body.classList.add("m-chat-channel-closed");
      const snoozeContainer = document.getElementById("toastS");
      if (snoozeContainer && isMobile) snoozeContainer.classList.add("d-none");
      return () => {
        if (snoozeContainer && isMobile) snoozeContainer.classList.remove("d-none");
      };
    }
  }, []);

  return (
    <Wrapper ref={refs.container} className={`chat-sidebar ${className}`}>
      <div className="chat-sidebar-header d-flex justify-content-between align-items-flex-start align-items-center">
        <Search
          onChange={onSearchChange}
          onKeyDown={handleSearchKeyDown}
          value={query}
          onClickEmpty={emptySearchInput}
          closeButton="true"
          searching={searchingChannels}
          className="chat-search"
          placeholder={dictionary.searchChatPlaceholder}
          ref={searchRef}
        />
        <div className="d-flex justify-content-center align-items-center ml-2 chat-sidebar-options-container">
          <StyledMoreOptions role="tabList">
            <div className={`option-filter ${tabPill === "pills-home" ? "active" : ""}`} onClick={handleTabChange} aria-controls="pills-home" aria-selected="false">
              {dictionary.chats}
            </div>
            <div className={`option-filter ${tabPill === "pills-workspace" ? "active" : ""}`} onClick={handleTabChange} aria-controls="pills-workspace" aria-selected="false">
              {dictionary.workspaceChats}
            </div>
            <div className="d-flex" onClick={handleOpenGroupChatModal}>
              <SvgIconFeather className="mr-2" width={14} height={14} icon="plus" /> {dictionary.newGroupChat}
            </div>
          </StyledMoreOptions>
        </div>
      </div>
      <ChatSideBarContentPanel pill={tabPill} search={search} dictionary={dictionary} resetFilter={handleResetFilter} />
    </Wrapper>
  );
};

export default React.memo(ChatSidebarPanel);
