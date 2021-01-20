import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import SearchForm from "../../forms/SearchForm";
import { ChatSideBarContentPanel } from "./index";
import { useChannels, useLoadChannel, useSettings, useTranslation } from "../../hooks";
import { MoreOptions } from "../common";
import { addToModals } from "../../../redux/actions/globalActions";
import { SvgIconFeather } from "../../common";

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

let hiddenArchivedLoaded = false;

const ChatSidebarPanel = (props) => {
  const { className = "" } = props;

  const dispatch = useDispatch();
  const { chatSettings, setChatSetting } = useSettings();
  const { actions: channelActions, chatSidebarSearch } = useChannels();
  useLoadChannel();

  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [tabPill, setTabPill] = useState(chatSettings.chat_filter);
  //const previousChannel = usePreviousValue(selectedChannel);

  // let add = (total, num) => total + num;
  // let unreadMessages = 0;
  // let unreadWorkspaceMessages = 0;
  // if (Object.keys(channels).length) {

  //   if (Object.values(channels).filter((c) => { return c.type !== "TOPIC" && typeof c.id === "number" }).length) {
  //     unreadMessages = Object.values(channels).filter((c) => {
  //       return c.type !== "TOPIC" && typeof c.id === "number";
  //     }).map((c) => c.total_unread).reduce(add);
  //   }
  //   if (Object.values(channels).filter((c) => c.type === "TOPIC").length) {
  //     unreadWorkspaceMessages = Object.values(channels).filter((c) => c.type === "TOPIC").map((c) => c.total_unread).reduce(add);
  //   }
  // }

  const refs = {
    container: useRef(null),
    navTab: useRef(null),
  };

  const onSearchChange = (e) => {
    setQuery(e.target.value);
  };

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      channelActions.setSidebarSearch({
        value: query,
      });
      if (query.trim() !== "") channelActions.search({ search: query, skip: 0, limit: 50, type: "DIRECT" });
    }, 300);
    return () => clearTimeout(timeOutId);
  }, [query]);

  const emptySearchInput = () => {
    setSearch("");
    setQuery("");
  };

  const handleResetFilter = () => {
    setTabPill("pills-home");
  };

  const handleTabChange = useCallback(
    (e) => {
      if (tabPill === e.target.getAttribute("aria-controls")) {
        handleResetFilter();
      } else {
        setTabPill(e.target.getAttribute("aria-controls"));
      }
    },
    [setTabPill, tabPill]
  );

  const { _t } = useTranslation();

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

  const onInputFocus = () => {
    console.log("focus input");
    // if (!hiddenArchivedLoaded) {
    //   hiddenArchivedLoaded = true;
    //   channelActions.fetchAll({
    //     skip: 0,
    //     limit: 20,
    //     filter: "hidden",
    //   });

    //   channelActions.fetchAll({
    //     skip: 0,
    //     limit: 20,
    //     filter: "archived",
    //   });
    // }
  };

  return (
    <Wrapper ref={refs.container} className={`chat-sidebar ${className}`}>
      <div className="chat-sidebar-header d-flex justify-content-between align-items-flex-start align-items-center">
        <Search onChange={onSearchChange} onKeyDown={handleSearchKeyDown} value={query} onClickEmpty={emptySearchInput} closeButton="true" className="chat-search" placeholder={dictionary.searchChatPlaceholder} onFocus={onInputFocus} />
        <div className="d-flex justify-content-center align-items-center ml-2" style={{ height: "38px" }}>
          <StyledMoreOptions ref={refs.navTab} role="tabList">
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
