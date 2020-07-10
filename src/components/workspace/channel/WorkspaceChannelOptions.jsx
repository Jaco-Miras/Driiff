import React, { useState } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { addToModals } from "../../../redux/actions/globalActions";
import { useWorkspaceActions } from "../../hooks";
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

const WorkspaceChannelOptions = (props) => {
  const { workspace } = props;

  const dispatch = useDispatch();

  const workspaceActions = useWorkspaceActions();

  const [showMoreOptions, setShowMoreOptions] = useState(false);

  const scrollEl = document.getElementById("pills-contact");

  const handlePinButton = () => {
    if (workspace.is_pinned) {
      workspaceActions.unPin(workspace);
    } else {
      workspaceActions.pin(workspace);
    }
  };

  const handleMuteChat = () => {
    if (workspace.is_muted) {
      workspaceActions.unMute(workspace);
    } else {
      workspaceActions.mute(workspace);
    }
  };
  const handleHideChat = () => {
    if (workspace.is_hidden) {
      workspaceActions.unHide(workspace);
    } else {
      workspaceActions.hide(workspace);
    }

    if (workspace.total_unread > 0) {
      workspaceActions.markAsRead(workspace);
    }
  };

  const handleArchiveChat = () => {
    if (workspace.is_archived === 1) {
      workspaceActions.unArchive(workspace);
    } else {
      workspaceActions.archive(workspace);
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

    if (workspace.is_archived === 1) {
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

    if (workspace.total_unread === 0 && workspace.is_read === 1) {
      workspaceActions.markAsUnRead(workspace);
    } else {
      workspaceActions.markAsRead(workspace);
    }

    handleShowMoreOptions();
  };
  const handleShowMoreOptions = () => {
    setShowMoreOptions(!showMoreOptions);
    props.onShowOptions();
  };

  return (
    <>
      <Wrapper channel={workspace} scrollRef={scrollEl}>
        <div onClick={handlePinButton}>{workspace.is_pinned ? "Unfavorite" : "Favorite"}</div>
        <div onClick={(e) => handleMarkAsUnreadSelected(e)}>{workspace.total_unread === 0 && workspace.is_read === 1 ? "Mark as unread" : "Mark as read"}</div>
        <div onClick={handleMuteChat}>{workspace.is_muted ? "Unmute" : "Mute"}</div>
        {workspace.type !== "PERSONAL_BOT" && <div onClick={handleHideChat}>{workspace.is_hidden === 0 ? "Hide" : "Unhide"}</div>}
        {(workspace.type !== "PERSONAL_BOT" || workspace.type !== "COMPANY") && <div onClick={handleShowArchiveConfirmation}>{workspace.is_archived === 0 ? "Archive" : "Unarchive"}</div>}
      </Wrapper>
    </>
  );
};

export default React.memo(WorkspaceChannelOptions);
