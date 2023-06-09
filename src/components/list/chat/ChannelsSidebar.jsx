import React, { useState, useRef } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { useSortChannels, useChannelActions } from "../../hooks";
import ChannelList from "./ChannelList";
import { CustomInput } from "reactstrap";
import FavoriteChannels from "./FavoriteChannels";
import { useHistory } from "react-router-dom";
import { isMobile } from "react-device-detect";

const ChannelsSidebarContainer = styled.div`
  display: flex;
  width: 100%;
  flex-flow: column;
  height: inherit;
`;
const Channels = styled.ul`
  padding-left: 24px;
  padding-right: 24px;
  list-style: none;
  height: inherit;
  h4:first-of-type {
    margin-top: 12px !important;
  }
  .avatar {
    border: 0 !important;
  }
  @media (max-width: 991.99px) {
    padding-left: 15px;
    padding-right: 15px;
  }
  overflow-x: hidden;
  overflow-y: scroll;
`;

const ChatHeaderContainer = styled.div`
  border-bottom: 1px solid #ebebeb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 12px;
`;

const ChatHeader = styled.h4`
  font-weight: 300;
  margin: 24px 0 6px 0;
`;

const ChannelsSidebar = (props) => {
  const { className = "", search, workspace, dictionary } = props;

  const firstResult = useRef(null);
  const channels = useSelector((state) => state.chat.channels);
  const selectedChannel = useSelector((state) => state.chat.selectedChannel);
  const searchChannel = useSelector((state) => state.chat.search);
  // const searchingChannels = useSelector((state) => state.chat.searchingChannels);
  // const chatSidebarSearch = useSelector((state) => state.chat.chatSidebarSearch);
  const [fetchingChannels, setFetchingChannels] = useState(false);
  const actions = useChannelActions();
  const { favoriteChannels, sortedChannels, searchArchivedChannels, filterUnreadChannels } = useSortChannels(Object.values(channels), search, {}, workspace);
  const virtualization = useSelector((state) => state.settings.user.CHAT_SETTINGS.virtualization);
  const history = useHistory();
  const channelDrafts = useSelector((state) => state.chat.channelDrafts);
  const { skip, fetching, hasMore } = useSelector((state) => state.chat.fetch);
  const initialLoad = useSelector((state) => state.chat.initialLoad);
  const handleLoadMore = () => {
    if (search !== "") {
      let cb = () => setFetchingChannels(false);
      if (!fetching && searchChannel.hasMore && !fetchingChannels && initialLoad) {
        setFetchingChannels(true);
        actions.loadMore({ skip: searchChannel.skip, search: search }, cb);
      }
    } else {
      let cb = () => setFetchingChannels(false);
      if (!fetching && hasMore && !fetchingChannels && initialLoad) {
        setFetchingChannels(true);
        actions.loadMore({ skip: skip }, cb);
      }
    }
  };
  const handleShowArchiveToggle = () => {
    actions.searchArchivedChannels(!searchArchivedChannels);
  };

  const onSelectChannel = (channel) => {
    document.body.classList.add("m-chat-channel-closed");
    const snoozeContainer = document.getElementById("toastS");
    if (snoozeContainer && isMobile) snoozeContainer.classList.add("d-none");

    if (selectedChannel !== null && !virtualization) {
      let scrollComponent = document.getElementById("component-chat-thread");
      if (scrollComponent) {
        actions.saveHistoricalPosition(selectedChannel.id, scrollComponent);
      }
    }
    actions.select({ ...channel, selected: true });
    if (channel.hasOwnProperty("add_user") && channel.add_user === true) {
      return;
    } else {
      history.push(`/chat/${channel.code}`);
    }
  };

  const handleClearSearch = () => {
    actions.setSidebarSearch({
      value: "",
      searching: false,
    });
  };

  return (
    <ChannelsSidebarContainer className={`chat-lists ${className}`}>
      <FavoriteChannels channels={favoriteChannels} onSelectChannel={onSelectChannel} />
      <Channels className={"list-group list-group-flush channels"}>
        {/* {searchingChannels && (
          <ChatHeaderContainer>
            <ChatHeader>{`Searching ${chatSidebarSearch}...`} </ChatHeader>
            <CustomInput className="cursor-pointer text-muted" checked={searchArchivedChannels} type="switch" id="show_archive" name="show archive" onChange={handleShowArchiveToggle} label={<span>{dictionary.showArchived}</span>} />
          </ChatHeaderContainer>
        )} */}

        {sortedChannels.map((channel, k, arr) => {
          let chatHeader = "";
          let showArchiveButton = false;

          if (k !== 0) {
            let a = arr[k - 1];
            let b = channel;

            /*if (a.type === "PERSONAL_BOT" && b.type !== "PERSONAL_BOT") {
              chatHeader = dictionary.chats;
            } else if (!(a.add_user || a.add_open_topic) && (b.add_user || b.add_open_topic)) {
              chatHeader = dictionary.contacts;
            }*/

            if (a.type === "PERSONAL_BOT" && b.type !== "PERSONAL_BOT") {
              if (b.is_relevant) chatHeader = dictionary.chats;
              else chatHeader = dictionary.chats;
            } else if (a.is_relevant && !b.is_relevant) {
              if (!(a.add_user || a.add_open_topic) && (b.add_user || b.add_open_topic)) {
                chatHeader = dictionary.contacts;
              } else {
                //chatHeader = dictionary.chats;
              }
            } else if (!a.is_relevant && !b.is_relevant && !(a.add_user || a.add_open_topic) && (b.add_user || b.add_open_topic)) {
              chatHeader = dictionary.contacts;
            }
          } else {
            /*if (channel.type === "PERSONAL_BOT") {
              chatHeader = dictionary.personalBot;
            } else if (channel.add_user || channel.add_open_topic) {
              chatHeader = dictionary.contacts;
            } else {
              chatHeader = dictionary.chats;
            }*/
            if (channel.type === "PERSONAL_BOT") {
              chatHeader = dictionary.personalBot;
            } else if (channel.is_relevant && channel.add_user) {
              chatHeader = dictionary.chats;
            } else if (channel.add_user || channel.add_open_topic) {
              chatHeader = dictionary.contacts;
            } else {
              chatHeader = dictionary.chats;
              showArchiveButton = true;
            }
          }

          return (
            <React.Fragment key={channel.code}>
              {search !== "" && chatHeader !== "" && (
                <ChatHeaderContainer>
                  {/* <ChatHeader>{searchingChannels ? `Searching ${chatSidebarSearch}...` : chatHeader} </ChatHeader> */}
                  <ChatHeader>{chatHeader} </ChatHeader>
                  {showArchiveButton && (
                    <CustomInput className="cursor-pointer text-muted" checked={searchArchivedChannels} type="switch" id="show_archive" name="show archive" onChange={handleShowArchiveToggle} label={<span>{dictionary.showArchived}</span>} />
                  )}
                </ChatHeaderContainer>
              )}
              <ChannelList
                index={k}
                className={k === 0 ? "first-channel channel-list" : "channel-list"}
                firstRef={k === 0 ? firstResult : null}
                tabIndex={k + 1}
                channel={channel}
                selectedChannel={selectedChannel}
                channelDrafts={channelDrafts}
                dictionary={dictionary}
                search={search}
                addLoadRef={!isNaN(channel.id) && k > sortedChannels.filter((c) => !isNaN(c.id)).length - 5}
                onLoadMore={handleLoadMore}
                onSelectChannel={onSelectChannel}
                onClearSearch={handleClearSearch}
              />
            </React.Fragment>
          );
        })}
        {(workspace === true && sortedChannels.length === 0) || (filterUnreadChannels && sortedChannels.length === 0) ? (
          <li>
            <h4>{dictionary.nothingToSeeHere}</h4>
          </li>
        ) : (
          sortedChannels.length === 0 &&
          search !== "" && (
            <li>
              <h4>{dictionary.noMatchingChats}</h4>
            </li>
          )
        )}
      </Channels>
    </ChannelsSidebarContainer>
  );
};

export default React.memo(ChannelsSidebar);
