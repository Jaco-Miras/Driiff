import React from "react";
import styled from "styled-components";
import {useSelector} from "react-redux";
import {useSortChannels} from "../../hooks";
import ChannelList from "./ChannelList";

const ChannelsSidebarContainer = styled.div``;
const Channels = styled.ul`
  padding-right: 24px;
  h4:first-of-type {
    margin-top: 12px !important;
  }
`;
const ChatHeader = styled.h4`
  font-weight: 300;
  padding-bottom: 16px;
  margin: 24px 0 6px 0;
  border-bottom: 1px solid #ebebeb;
`;

const ChannelsSidebar = (props) => {
  const {className, search, channels, selectedChannel, workspace, dictionary} = props;

  const [sortedChannels] = useSortChannels(channels, search, {}, workspace);
  const channelDrafts = useSelector((state) => state.chat.channelDrafts);

  return (
    <ChannelsSidebarContainer className={`chat-lists ${className}`}>
      <Channels className={"list-group list-group-flush"}>
        {sortedChannels
          .map((channel, k, arr) => {
            let chatHeader = "";

            if (k !== 0) {
              let a = arr[k - 1];
              let b = channel;

              if (a.type === "DIRECT" && b.type === "DIRECT") {
                if (!a.add_user && b.add_user) {
                  chatHeader = dictionary.startNew;
                } else if (a.add_user && !b.add_user) {
                  chatHeader = dictionary.contacts;
                }
              } else if (!a.add_user && b.add_user) {
                chatHeader = dictionary.startNew;
              } else if (a.type !== "DIRECT" && b.type === "DIRECT") {
                chatHeader = dictionary.contacts;
              } else if (!a.is_pinned && b.is_pinned) {
                chatHeader = dictionary.pinned;
              } else if ((a.type === "DIRECT" || a.is_pinned) && !b.is_pinned) {
                chatHeader = dictionary.recent;
              } else if (!a.is_hidden && b.is_hidden) {
                chatHeader = dictionary.hidden;
              } else if (!a.add_open_topic && b.add_open_topic) {
                chatHeader = dictionary.viewOpenWorkspace;
              } else if (!a.is_archived && b.is_archived) {
                chatHeader = dictionary.archived;
              }
            } else {
              if (channel.type === "PERSONAL_BOT") {
                chatHeader = dictionary.personalBot;
              } else if (channel.add_user) {
                chatHeader = dictionary.startNew;
              } else if (channel.type === "DIRECT") {
                chatHeader = dictionary.contacts;
              } else if (channel.is_pinned) {
                chatHeader = dictionary.pinned;
              } else if (channel.is_hidden) {
                chatHeader = dictionary.hidden;
              } else if (channel.add_open_topic) {
                chatHeader = dictionary.viewOpenWorkspace;
              } else if (channel.is_archived) {
                chatHeader = dictionary.archived;
              } else {
                chatHeader = dictionary.recent;
              }
            }

            return (
              <React.Fragment key={channel.id}>
                {search !== "" && chatHeader !== "" && <ChatHeader>{chatHeader}</ChatHeader>}
                <ChannelList channel={channel} selectedChannel={selectedChannel} isWorkspace={workspace}
                             channelDrafts={channelDrafts} dictionary={dictionary}/>
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
