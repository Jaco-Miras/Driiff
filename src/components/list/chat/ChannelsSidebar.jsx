import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
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
  const { className, search, channels, selectedChannel, workspace, dictionary } = props;

  const [sortedChannels] = useSortChannels(channels, search, {}, workspace);
  const channelDrafts = useSelector((state) => state.chat.channelDrafts);

  return (
    <ChannelsSidebarContainer className={`chat-lists ${className}`}>
      <Channels className={"list-group list-group-flush"}>
        {sortedChannels.map((channel, k, arr) => {
          let chatHeader = "";
          if (k !== 0 && arr[k - 1].is_pinned && !channel.is_pinned) {
            chatHeader = dictionary.recent;
          } else if (k === 0 && channel.is_pinned) {
            chatHeader = dictionary.favorite;
          } else if (k === 0 && !channel.is_pinned) {
            chatHeader = dictionary.recent;
          }

          if (k !== 0 && !arr[k - 1].is_hidden && channel.is_hidden) {
            chatHeader = dictionary.hidden;
          } else if (k === 0 && channel.is_hidden) {
            chatHeader = dictionary.hidden;
          }

          if (k !== 0 && !arr[k - 1].add_user && channel.add_user) {
            chatHeader = dictionary.startNew;
          } else if (k === 0 && channel.add_user) {
            chatHeader = dictionary.startNew;
          }

          if (k !== 0 && !arr[k - 1].add_open_topic && channel.add_open_topic) {
            chatHeader = dictionary.viewOpenWorkspace;
          } else if (k === 0 && channel.add_open_topic) {
            chatHeader = dictionary.viewOpenWorkspace;
          }

          if (k !== 0 && !arr[k - 1].is_archived && channel.is_archived) {
            chatHeader = dictionary.archived;
          } else if (k === 0 && channel.is_archived) {
            chatHeader = dictionary.archived;
          }
          return (
            <React.Fragment key={channel.id}>
              {search !== "" && chatHeader !== "" && <ChatHeader>{chatHeader}</ChatHeader>}
                <ChannelList channel={channel} selectedChannel={selectedChannel} isWorkspace={workspace} channelDrafts={channelDrafts} dictionary={dictionary}/>
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
