import React from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { useSortChannels } from "../../hooks";
import { isMobile } from "react-device-detect";
import { useChannelActions } from "../../hooks";
import FavChannel from "./FavChannel";

const Wrapper = styled.div`
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    li:not(:last-child) {
      border-bottom: 1px solid #f1f2f7;
    }
  }
`;

const FavoriteChannelsCard = (props) => {
  const history = useHistory();
  const channels = useSelector((state) => state.chat.channels);
  const virtualization = useSelector((state) => state.settings.user.CHAT_SETTINGS.virtualization);
  const { favoriteChannels } = useSortChannels(Object.values(channels), "", {}, null);
  const selectedChannel = useSelector((state) => state.chat.selectedChannel);
  const channelDrafts = useSelector((state) => state.chat.channelDrafts);
  const actions = useChannelActions();

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
  const dictionary = {};
  return (
    <Wrapper>
      <span>
        <strong>Favorite channels</strong>
      </span>
      <ul>
        {favoriteChannels.slice(0, 5).map((channel) => {
          return <FavChannel key={channel.id} channel={channel} selectedChannel={selectedChannel} channelDrafts={channelDrafts} dictionary={dictionary} onSelectChannel={onSelectChannel} />;
        })}
      </ul>
    </Wrapper>
  );
};

export default FavoriteChannelsCard;
