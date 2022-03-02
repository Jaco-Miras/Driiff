import React from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { useSortChannels } from "../../hooks";
import { isMobile } from "react-device-detect";
import { useChannelActions, useTranslationActions } from "../../hooks";
import FavChannel from "./FavChannel";
import { SvgIconFeather, ToolTip } from "../../common";

const Wrapper = styled.div`
  height: 100%;
  > span:first-child {
    display: flex;
    align-items: center;
    //font-weight: 600;
  }
  .feather {
    width: 1rem;
    height: 1rem;
  }
  .feather-star {
    margin-right: 0.5rem;
  }
  .feather-info {
    margin-left: 0.5rem;
  }
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    overflow: auto;
    max-height: calc(100% - 30px);
    ::-webkit-scrollbar {
      -webkit-appearance: none;
      width: 7px;
    }

    ::-webkit-scrollbar-thumb {
      border-radius: 4px;
      background-color: rgba(0, 0, 0, 0.5);
      -webkit-box-shadow: 0 0 1px rgba(255, 255, 255, 0.5);
    }
    li:not(:last-child) {
      border-bottom: 1px solid #f1f2f7;
      .dark & {
        border-bottom: 1px solid rgba(155, 155, 155, 0.1);
      }
    }
    .channel-info {
      max-width: calc(100% - 60px);
      overflow: hidden;
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
  const { _t } = useTranslationActions();
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
  const dictionary = {
    favoriteChannels: _t("FAVORITE_CHANNELS", "Favorite channels"),
    clickOnStarChat: _t("LABEL.CLICK_ON_START_CHAT", "Click on the ⭐ to mark a chat channel as favorite"),
    team: _t("TEAM", "Team"),
    workspace: _t("CHAT.WORKSPACE", "Workspace"),
    withClient: _t("PAGE.WITH_CLIENT", "With client"),
    withTeam: _t("CHANNEL.WITH_TEAM", "Team Chat"),
    messageRemoved: _t("CHAT.MESSAGE_REMOVED", "The chat message has been removed."),
    you: _t("CHAT.PREVIEW_AUTHOR_YOU", "You"),
  };
  return (
    <Wrapper>
      <span>
        <SvgIconFeather icon="star" /> <h5 className="card-title mb-0">{dictionary.favoriteChannels}</h5>{" "}
        <ToolTip content={dictionary.clickOnStarChat}>
          <SvgIconFeather icon="info" />
        </ToolTip>
      </span>
      {favoriteChannels.length === 0 && <div className="mt-3">{dictionary.clickOnStarChat}</div>}
      <ul className="mt-3">
        {favoriteChannels.map((channel) => {
          return <FavChannel key={channel.id} channel={channel} selectedChannel={selectedChannel} channelDrafts={channelDrafts} dictionary={dictionary} onSelectChannel={onSelectChannel} />;
        })}
      </ul>
    </Wrapper>
  );
};

export default FavoriteChannelsCard;
