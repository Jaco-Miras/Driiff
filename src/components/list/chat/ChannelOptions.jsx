import React, { useState } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { addToModals } from "../../../redux/actions/globalActions";
import useChannelActions from "../../hooks/useChannelActions";
import { MoreOptions } from "../../panels/common";
import { useTranslationActions, useToaster } from "../../hooks";
import { putWorkspaceNotification } from "../../../redux/actions/workspaceActions";

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
  const { selectedChannel, channel, moreButton = "more-horizontal", onSelectOptions = null } = props;

  const dispatch = useDispatch();

  const channelActions = useChannelActions();

  const scrollEl = document.getElementById("pills-home");

  const { _t } = useTranslationActions();

  const toaster = useToaster();
  const [bellClicked, setBellClicked] = useState(false);

  const dictionary = {
    mute: _t("CHAT.MUTE", "Mute this channel"),
    unmute: _t("CHAT.UNMUTE", "Unmute this channel"),
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
    headerArchive: _t("HEADER.ARCHIVE", "Chat archive"),
    headerUnarchive: _t("HEADER.UNARCHIVE", "Un-archive channel"),
    muteWS: _t("CHAT.MUTE_WS", "Mute this workspace"),
    unmuteWS: _t("CHAT.UNMUTE_WS", "Unmute this workspace"),
    toasterBellNotificationOff: _t("TOASTER.WORKSPACE_BELL_NOTIFICATION_OFF", "All notifications are off except for mention and post actions"),
    toasterBellNotificationOn: _t("TOASTER.WORKSPACE_BELL_NOTIFICATION_ON", "All notifications for this workspace is ON"),
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

    if (selectedChannel && selectedChannel.id === channel.id) {
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

  const handleMuteWSChannel = () => {
    if (bellClicked) return;
    const payload = {
      id: channel.entity_id,
      is_active: !channel.is_active,
    };
    setBellClicked(true);
    dispatch(
      putWorkspaceNotification(payload, (err, res) => {
        setBellClicked(false);
        if (err) {
          return;
        }
        if (payload.is_active) {
          toaster.success(dictionary.toasterBellNotificationOn);
        } else {
          toaster.success(dictionary.toasterBellNotificationOff);
        }
      })
    );
  };

  return (
    <>
      <Wrapper channel={channel} scrollRef={scrollEl} moreButton={moreButton} onClick={onSelectOptions}>
        <div onClick={handlePinButton}>{channel.is_pinned ? dictionary.unfavorite : dictionary.favorite}</div>
        <div onClick={(e) => handleMarkAsUnreadSelected(e)}>{channel.total_unread === 0 && channel.is_read === true ? dictionary.markAsUnread : dictionary.markAsRead}</div>
        {channel.type === "TOPIC" && <div onClick={handleMuteWSChannel}>{channel.is_active ? dictionary.muteWS : dictionary.unmuteWS}</div>}
        {channel.type !== "TOPIC" && <div onClick={handleMuteChat}>{channel.is_muted ? dictionary.unmute : dictionary.mute}</div>}
        {channel.type !== "PERSONAL_BOT" && <div onClick={handleHideChat}>{!channel.is_hidden ? dictionary.hide : dictionary.unhide}</div>}
        {["PERSONAL_BOT", "COMPANY", "TOPIC"].includes(channel.type) === false && <div onClick={handleShowArchiveConfirmation}>{!channel.is_archived ? dictionary.archive : dictionary.unarchive}</div>}
      </Wrapper>
    </>
  );
};

export default ChannelOptions;
