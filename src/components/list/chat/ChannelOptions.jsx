import React, { useState } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { addToModals } from "../../../redux/actions/globalActions";
import useChannelActions from "../../hooks/useChannelActions";
import { MoreOptions } from "../../panels/common";

const Wrapper = styled(MoreOptions)`
  .more-options-tooltip {
    &.orientation-left {
      right: calc(100% - 20px);
    }
    &.orientation-bottom {
      top: 100%;
    }
    &.orientation-top {
      bottom: 20px;
    }
  }
`;

const ChannelOptions = (props) => {
  const { selectedChannel, channel } = props;

  const dispatch = useDispatch();

  const channelActions = useChannelActions();

  const [showMoreOptions, setShowMoreOptions] = useState(false);

  const scrollEl = document.getElementById("pills-contact");

  const handlePinButton = () => {
    if (channel.is_pinned) {
      channelActions.unPin(channel);
    } else {
      channelActions.pin(channel);
    }
  };

  const handleMuteChat = () => {
    if (channel.is_muted) {
      channelActions.unMute(channel);
    } else {
      channelActions.mute(channel);
    }
  };
  const handleHideChat = () => {
    if (channel.is_hidden) {
      channelActions.unHide(channel);
    } else {
      channelActions.hide(channel);
    }

    if (channel.total_unread > 0) {
      channelActions.markAsRead(channel);
    }

    if (selectedChannel.id === channel.id) {
      /**
       * @todo find a fallback channel
       */
      //channelActions.select();
    }
  };

  const handleArchiveChat = () => {
    if (channel.is_archived === 1) {
      channelActions.unArchive(channel);
    } else {
      channelActions.archive(channel);
    }
  };

  const handleShowArchiveConfirmation = () => {
    let payload = {
      type: "confirmation",
      headerText: "Chat archive",
      submitText: "Archive",
      cancelText: "Cancel",
      bodyText: "Are you sure you want to archive this chat?",
      actions: {
        onSubmit: handleArchiveChat,
      },
    };

    if (channel.is_archived === 1) {
      payload = {
        ...payload,
        headerText: "Chat Un-archive",
        submitText: "Unarchive",
        bodyText: "Are you sure you want to un-archive this chat?",
      };
    }

    dispatch(addToModals(payload));
  };

  const handleMarkAsUnreadSelected = (e) => {
    e.stopPropagation();

    if (channel.total_unread === 0 && channel.is_read === 1) {
      channelActions.markAsUnRead(channel);
    } else {
      channelActions.markAsRead(channel);
    }

    handleShowMoreOptions();
  };
  const handleShowMoreOptions = () => {
    setShowMoreOptions(!showMoreOptions);
    props.onShowOptions();
  };

  return (
    <>
      <Wrapper channel={channel} scrollRef={scrollEl}>
        <div onClick={handlePinButton}>{channel.is_pinned ? "Unfavorite" : "Favorite"}</div>
        <div onClick={(e) => handleMarkAsUnreadSelected(e)}>{channel.total_unread === 0 && channel.is_read === 1 ? "Mark as unread" : "Mark as read"}</div>
        <div onClick={handleMuteChat}>{channel.is_muted ? "Unmute" : "Mute"}</div>
        {channel.type !== "PERSONAL_BOT" && <div onClick={handleHideChat}>{channel.is_hidden === 0 ? "Hide" : "Unhide"}</div>}
        {(channel.type !== "PERSONAL_BOT" || channel.type !== "COMPANY") && <div onClick={handleShowArchiveConfirmation}>{channel.is_archived === 0 ? "Archive" : "Unarchive"}</div>}
      </Wrapper>
    </>
  );
};

export default React.memo(ChannelOptions);
