import React from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { addToModals } from "../../../redux/actions/globalActions";
import useChannelActions from "../../hooks/useChannelActions";
import { MoreOptions } from "../../panels/common";
import { useTranslation } from "../../hooks";

const Wrapper = styled(MoreOptions)`
  position: relative;
  height: 18px;
  width: 25px;
  > svg {
    position: absolute;
    top: -1px;
    height: 20px;
    width: 20px;
    left: 1.5px;
  }
`;

const ChannelOptions = (props) => {
  const { selectedChannel, channel, moreButton = "more-horizontal" } = props;

  const dispatch = useDispatch();

  const channelActions = useChannelActions();

  const scrollEl = document.getElementById("pills-home");

  const { _t } = useTranslation();

  const dictionary = {
    mute: _t("CHAT.MUTE", "Mute"),
    unmute: _t("CHAT.UNMUTE", "Unmute"),
    hide: _t("CHAT.HIDE", "Hide"),
    unhide: _t("CHAT.UNHIDE", "Unhide"),
    favorite: _t("FAVORITE", "Favorite"),
    unfavorite: _t("UNFAVORITE", "Unfavorite"),
    markAsUnread: _t("POST.MARK_AS_UNREAD", "Mark as unread"),
    markAsRead: _t("POST.MARK_AS_READ", "Mark as read"),
    unarchive: _t("CHAT.UNARCHIVE", "Un-archive"),
    archive: _t("CHAT.ARCHIVE", "Archive"),
    chatUnarchiveConfirmation: _t("CHAT.UNARCHIVE_CONFIRMATION", "Are you sure you want to un-archive this channel?"),
    chatArchiveConfirmation: _t("CHAT.ARCHIVE_CONFIRMATION", "Are you sure you want to archive this channel?"),
    cancel: _t("BUTTON.CANCEL", "Cancel"),
    headerArchive: _t("HEADER.ARCHIVE", "Chat Archive"),
    headerUnarchive: _t("HEADER.UNARCHIVE", "Channel un-archive"),
  };

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
    if (channel.is_archived) {
      channelActions.unArchive(channel);
    } else {
      channelActions.archive(channel);
    }
  };

  const handleShowArchiveConfirmation = () => {
    let payload = {
      type: "confirmation",
      headerText: dictionary.headerArchive,
      submitText: dictionary.archive,
      cancelText: dictionary.cancel,
      bodyText: dictionary.chatArchiveConfirmation,
      actions: {
        onSubmit: handleArchiveChat,
      },
    };

    if (channel.is_archived) {
      payload = {
        ...payload,
        headerText: dictionary.headerUnarchive,
        submitText: dictionary.unarchive,
        bodyText: dictionary.chatUnarchiveConfirmation,
      };
    }

    dispatch(addToModals(payload));
  };

  const handleMarkAsUnreadSelected = (e) => {
    e.stopPropagation();

    if (channel.total_unread === 0 && channel.is_read) {
      channelActions.markAsUnRead(channel);
    } else {
      channelActions.markAsRead(channel);
    }
  };

  return (
    <>
      <Wrapper channel={channel} scrollRef={scrollEl} moreButton={moreButton}>
        <div onClick={handlePinButton}>{channel.is_pinned ? dictionary.unfavorite : dictionary.favorite}</div>
        <div
          onClick={(e) => handleMarkAsUnreadSelected(e)}>{channel.total_unread === 0 && channel.is_read ? dictionary.markAsUnread : dictionary.markAsRead}</div>
        <div onClick={handleMuteChat}>{channel.is_muted ? dictionary.unmute : dictionary.mute}</div>
        {channel.type !== "PERSONAL_BOT" &&
        <div onClick={handleHideChat}>{!channel.is_hidden ? dictionary.hide : dictionary.unhide}</div>}
        {(channel.type !== "PERSONAL_BOT" || channel.type !== "COMPANY") && <div
          onClick={handleShowArchiveConfirmation}>{!channel.is_archived ? dictionary.archive : dictionary.unarchive}</div>}
      </Wrapper>
    </>
  );
};

export default React.memo(ChannelOptions);
