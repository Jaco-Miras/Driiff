import React from "react";
import styled from "styled-components";
import {useSelector} from "react-redux";
import {useSortChannels} from "../../hooks";
import ChannelList from "./ChannelList";

const ChannelsSidebarContainer = styled.div``;
const Channels = styled.ul`
  padding-left: 24px;
  padding-right: 24px;
  list-style: none;
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
`;
const ChatHeader = styled.h4`
  font-weight: 300;
  padding-bottom: 16px;
  margin: 24px 0 6px 0;
  border-bottom: 1px solid #ebebeb;
`;

const ChannelsSidebar = (props) => {
  const { className = "", search, channels, selectedChannel, workspace, dictionary } = props;

  const [sortedChannels] = useSortChannels(channels, search, {}, workspace);
  const channelDrafts = useSelector((state) => state.chat.channelDrafts);

  return (
    <ChannelsSidebarContainer className={`chat-lists ${className}`}>
      <Channels className={"list-group list-group-flush"}>
        {sortedChannels.map((channel, k, arr) => {
          let chatHeader = "";

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
            }
          }

          return (
            <React.Fragment key={channel.id}>
              {search !== "" && chatHeader !== "" && <ChatHeader>{chatHeader}</ChatHeader>}
              <ChannelList channel={channel} selectedChannel={selectedChannel} channelDrafts={channelDrafts}
                           dictionary={dictionary} search={search}/>
            </React.Fragment>
          );
        })}
        {workspace === true && sortedChannels.length === 0 ? (
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

export default ChannelsSidebar;
