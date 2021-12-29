import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { addToModals } from "../../../redux/actions/globalActions";
import { SvgIconFeather } from "../../common";
import useChannelActions from "../../hooks/useChannelActions";
import ChannelIcon from "../../list/chat/ChannelIcon";
import { MoreOptions } from "../../panels/common";
import { useSettings, useWorkspaceActions, useToaster } from "../../hooks";
import { replaceChar } from "../../../helpers/stringFormatter";
import useChatMessageActions from "../../hooks/useChatMessageActions";
import { ChatTranslateActionsMenu, ChatHeaderMembers } from "./index";
import { isMobile } from "react-device-detect";
import Tooltip from "react-tooltip-lite";
import { putWorkspaceNotification } from "../../../redux/actions/workspaceActions";

const Wrapper = styled.div`
  position: relative;
  z-index: 3;
  display: flex;
  align-items: center;
  height: 60px;
  padding-bottom: 1em;

  .chat-header-left {
    display: flex;
  }

  .chat-header-title {
    height: 17px;
    color: #000000;
    font-family: Inter;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0;
    line-height: 17px;
    text-align: center;
    display: flex;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;

    a {
      color: #000 !important;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;

      .dark & {
        color: #ffffff !important;
      }
    }
    .dark & {
      color: #ffffff !important;
    }
  }
  .chat-header-right {
    @media (max-width: 414px) {
      .nav {
        display: flex;
      }
    }
    margin-left: auto;
    ul {
      flex-flow: row;
    }
    li .more-options-tooltip {
      top: 115%;
    }
    li .more-options-tooltip > div {
      display: flex;
      align-items: center;
      svg {
        margin-right: 4px;
      }
    }
  }
  .dictionary-label {
    @media (max-width: 991.99px) {
      display: none;
    }
  }
  .component-user-list-pop-up-container .profile-slider {
    right: 255px !important;
  }
  .channel-title-wrapper {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
  }
  .chat-header-folder {
    flex: 1 1 100%;
    // height: 12px;
    color: #8b8b8b;
    font-family: Arial;
    font-size: 12px;
    // letter-spacing: 0;
    // line-height: 12px;
    display: flex;
    align-items: center;
  }
  @media (max-width: 414px) {
    .chat-header-folder {
      display: none;
    }
  }
  .plus-recipient-component {
    width: 2.7rem;
    height: 2.7rem;
  }
  .feather-pencil {
    width: 1rem;
    height: 1rem;
    margin-left: 5px;
    cursor: pointer;
  }
`;

const Icon = styled(SvgIconFeather)``;
// const IconFolder = styled(SvgIconFeather)`
//   width: 12px;
//   height: 12px;
// `;

const EyeIcon = styled(SvgIconFeather)`
  width: 0.7rem;
  height: 0.7rem;
`;

const BackButton = styled.div`
  @media (min-width: 992px) {
    display: none;
  }
  color: #7a1b8b;
  cursor: pointer;
  transition: color 0.15s ease-in-out;
  margin-right: 12px;
  margin-top: 8px;
  display: flex;
  span {
    line-height: 1.7;
  }
  &:hover {
    color: #7a1b8bcc;
  }
`;

const BackButtonChevron = styled(SvgIconFeather)`
  color: #7a1b8b;
  height: 24px;
  width: 24px;
  transition: color 0.15s ease-in-out;
  &:hover {
    color: #7a1b8bcc;
  }
`;

const StyledMoreOptions = styled(MoreOptions)`
  border: 1px solid #fff;
  border-radius: 4px;

  align-items: center;
  justify-content: center;
  &:hover {
    cursor: pointer;
    border: 1px solid #972c86 !important;
  }
  .dark & {
    border: 1px solid #25282c !important;
    background: #25282c;
  }
  .feather-more-horizontal {
    width: 25px;
    font-size: 10px;
  }
  .more-options-tooltip {
    left: auto;
    right: 0;
    top: -25px;
    width: 250px;

    svg {
      width: 14px;
    }
  }

  @media (max-width: 480px) {
    .more-options-tooltip {
      top: 20px;
      right: -45px;
    }
  }
`;

const StyledBadge = styled.div`
  display: inline-flex;
  align-items: center;
  ${(props) => props.isTeam && "background:#D1EEFF !important;"}
  margin-left:5px;
  height: 18px;
  padding: 5px !important;
  color: #363636;
  font-size: 10px;
  letter-spacing: 0;
  line-height: 12px;
`;

const ChatHeaderBadgeContainer = styled.div`
  display: flex;
  align-items: center;
`;

const StarIcon = styled(SvgIconFeather)`
  height: 1rem !important;
  width: 1rem !important;
  min-width: 1rem;
  margin-left: 5px;
  cursor: pointer;
  ${(props) =>
    props.isFav &&
    `
    color: rgb(255, 193, 7)!important;
    fill: rgb(255, 193, 7);
    :hover {
      color: rgb(255, 193, 7);
    }`}
`;

const SearchIcon = styled(SvgIconFeather)`
  height: 14px !important;
  width: 14px !important;
  min-width: 14px;
  margin-left: 5px;
  cursor: pointer;
`;

const StyledTooltip = styled(Tooltip)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ChatIconsOptionsContainer = styled.div`
  display: flex;
  align-items: center;
`;

const toggleTooltip = () => {
  let tooltips = document.querySelectorAll("span.react-tooltip-lite");
  tooltips.forEach((tooltip) => {
    tooltip.parentElement.classList.toggle("tooltip-active");
  });
};

const ChatHeaderPanel = (props) => {
  /**
   * @todo refactor
   */
  const { className = "", channel, dictionary, handleSearchChatPanel, isAuthorizedUser } = props;

  const dispatch = useDispatch();
  const history = useHistory();
  const channelActions = useChannelActions();
  const chatChannel = useSelector((state) => state.chat.selectedChannel);
  const workspaces = useSelector((state) => state.workspaces.workspaces);
  const unreadCounter = useSelector((state) => state.global.unreadCounter);

  const { translated_channels } = useSelector((state) => state.settings.user.GENERAL_SETTINGS);
  const chatMessageActions = useChatMessageActions();

  const toaster = useToaster();
  const [bellClicked, setBellClicked] = useState(false);

  const handleArchiveChat = () => {
    channelActions.archive(channel);
  };

  const handleShowArchiveConfirmation = () => {
    if (channel.is_archived) {
      channelActions.unArchive(channel);
      return;
    }

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

    dispatch(addToModals(payload));
  };

  const handleShowChatEditModal = () => {
    let payload = {
      type: "chat_create_edit",
      mode: "edit",
    };

    dispatch(addToModals(payload));
  };

  const goBackChannelSelect = () => {
    document.body.classList.remove("m-chat-channel-closed");
    const snoozeContainer = document.getElementById("toastS");
    if (snoozeContainer && isMobile) snoozeContainer.classList.remove("d-none");
  };
  const workspaceAction = useWorkspaceActions();

  const {
    generalSettings: { workspace_open_folder },
    setGeneralSetting,
  } = useSettings();

  const handleWorkspaceLinkClick = (e) => {
    e.preventDefault();

    if (chatChannel.workspace_folder) {
      setGeneralSetting({
        workspace_open_folder: {
          ...workspace_open_folder,
          [chatChannel.workspace_folder.id]: chatChannel.workspace_folder.id,
        },
      });
    }

    document.body.classList.remove("navigation-show");
    if (workspaces[chatChannel.entity_id]) {
      workspaceAction.selectWorkspace(workspaces[chatChannel.entity_id]);
      workspaceAction.redirectTo(workspaces[chatChannel.entity_id]);
    }
  };

  const handleRedirectToProfile = (e, profile) => {
    e.preventDefault();
    history.push(`/profile/${profile.id}/${replaceChar(profile.name)}`);
  };

  const handleRedirectToTeam = (e) => {
    e.preventDefault();
    history.push(`/system/people/teams/${chatChannel.entity_id}/${chatChannel.title}`);
  };

  const getChannelTitle = () => {
    switch (chatChannel.type) {
      case "TOPIC": {
        if (chatChannel.workspace_folder) {
          return (
            <>
              {/*chatChannel.workspace_folder.name  &nbsp;*/}
              {/* ">" &nbsp; */}
              <a onClick={handleWorkspaceLinkClick} data-href={channelActions.getChannelLink(chatChannel)} href={channelActions.getChannelLink(chatChannel)}>
                {chatChannel.title}
              </a>
            </>
          );
        } else {
          return (
            <>
              <span className="dictionary-label">
                {/* dictionary.workspace &nbsp;*/}
                {/* ">" &nbsp; */}
              </span>
              <a onClick={handleWorkspaceLinkClick} data-href={channelActions.getChannelLink(chatChannel)} href={channelActions.getChannelLink(chatChannel)}>
                {chatChannel.title}
              </a>
            </>
          );
        }
      }
      case "DIRECT": {
        return (
          <>
            <a onClick={(e) => handleRedirectToProfile(e, chatChannel.profile)} data-href={`/profile/${chatChannel.profile.id}/${chatChannel.profile.name}`} href={`/profile/${chatChannel.profile.id}/${chatChannel.profile.name}`}>
              {chatChannel.profile ? chatChannel.profile.name : chatChannel.title}
            </a>
          </>
        );
      }
      case "DIRECT_TEAM": {
        return (
          <>
            <a onClick={handleRedirectToTeam} data-href={`/system/people/teams/${chatChannel.entity_id}/${chatChannel.title}`} href={`/system/people/teams/${chatChannel.entity_id}/${chatChannel.title}`}>
              {dictionary.team} {chatChannel.title}
            </a>
          </>
        );
      }
      case "TEAM": {
        return (
          <>
            <a onClick={handleRedirectToTeam} data-href={`/system/people/teams/${chatChannel.entity_id}/${chatChannel.title}`} href={`/system/people/teams/${chatChannel.entity_id}/${chatChannel.title}`}>
              {dictionary.team} {chatChannel.title}
            </a>
          </>
        );
      }
      default: {
        return chatChannel.title;
      }
    }
  };

  const getChannelFolder = () => {
    switch (chatChannel.type) {
      case "TOPIC": {
        if (chatChannel.workspace_folder) {
          return (
            <>
              <i className="fa fa-folder-o mr-1" /> {chatChannel.workspace_folder.name}
              {/* <IconFolder icon="folder" className="mr-1" /> {chatChannel.workspace_folder.name} */}
            </>
          );
        } else {
          return (
            <>
              <span className="dictionary-label">{dictionary.workspace}</span>
            </>
          );
        }
      }
      default: {
        return "";
      }
    }
  };

  const handleFavoriteChannel = () => {
    if (channel.is_pinned) channelActions.unPin(channel);
    else channelActions.pin(channel);
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

  const handleMarkAsUnreadSelected = (e) => {
    e.stopPropagation();

    if (channel.total_unread === 0 && channel.is_read) {
      channelActions.markAsUnRead(channel);
    } else {
      channelActions.markAsRead(channel);
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
  };

  const handleWorkspaceNotification = () => {
    if (bellClicked) return;
    const payload = {
      id: channel.entity_id,
      is_active: !channel.is_active,
    };
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

  if (channel === null) return null;

  if (translated_channels.length > 0 && translated_channels.includes(chatChannel.id) && !chatChannel.is_translate) chatMessageActions.saveChannelTranslateState({ ...chatChannel, is_translate: true });

  return (
    <Wrapper className={`chat-header border-bottom ${className}`}>
      <div className="chat-header-left">
        <BackButton className="chat-back-button" onClick={goBackChannelSelect}>
          <BackButtonChevron icon={"chevron-left"} />
          {unreadCounter.chat_message > 0 && <span>{unreadCounter.chat_message.toString()}</span>}
        </BackButton>
        <ChannelIcon className="chat-header-icon" channel={channel} width="33px" />
      </div>
      <div className="channel-title-wrapper">
        <div className="chat-header-title">{getChannelTitle()}</div>
        <ChatHeaderBadgeContainer className="chat-header-badge">
          {channel.type === "TOPIC" && !channel.is_archived && workspaces.hasOwnProperty(channel.entity_id) && workspaces[channel.entity_id].is_lock === 1 && workspaces[channel.entity_id].active === 1 && (
            <Icon className={"ml-1"} icon={"lock"} strokeWidth="2" width={12} />
          )}
          {channel.type === "TOPIC" && !channel.is_archived && workspaces.hasOwnProperty(channel.entity_id) && workspaces[channel.entity_id].is_shared && workspaces[channel.entity_id].active === 1 && (
            <StyledBadge className={"badge badge-external mr-1"} isTeam={channel.team ? true : false}>
              <EyeIcon icon={channel.team ? "eye-off" : "eye"} className={"mr-1"} />
              {channel.team ? dictionary.teamChat : dictionary.clientChat}
            </StyledBadge>
          )}
        </ChatHeaderBadgeContainer>
        <ChatIconsOptionsContainer>
          {channel.type === "TOPIC" && channel.hasOwnProperty("is_active") && (
            <StyledTooltip arrowSize={5} distance={10} onToggle={toggleTooltip} content={channel.is_active ? dictionary.notificationsOn : dictionary.notificationsOff}>
              <Icon className="ml-1" width="16" height="16" icon={channel.is_active ? "bell" : "bell-off"} onClick={handleWorkspaceNotification} />
            </StyledTooltip>
          )}
          <StyledTooltip arrowSize={5} distance={10} onToggle={toggleTooltip} content={dictionary.favorite}>
            <StarIcon icon="star" isFav={channel.is_pinned} onClick={handleFavoriteChannel} />
          </StyledTooltip>
          {channel.type === "GROUP" && !channel.is_archived && <SvgIconFeather icon="pencil" onClick={handleShowChatEditModal} />}
          {isAuthorizedUser && <SearchIcon icon="search" onClick={handleSearchChatPanel} />}

          <div>
            <ul className="nav align-items-center justify-content-end">
              <li className="ml-2" style={{ height: "21px" }}>
                <StyledMoreOptions role="tabList" strokeWidth="1" fill="black" svgHeight="17" width="17">
                  {["PERSONAL_BOT", "COMPANY", "TOPIC"].includes(channel.type) === false && <div onClick={handleShowArchiveConfirmation}>{!channel.is_archived ? dictionary.archive : dictionary.unarchive}</div>}
                  {channel.type === "GROUP" && !channel.is_archived && <div onClick={handleShowChatEditModal}>{dictionary.edit}</div>}
                  <div onClick={handlePinButton}>{channel.is_pinned ? dictionary.unfavorite : dictionary.favorite}</div>
                  <div onClick={(e) => handleMarkAsUnreadSelected(e)}>{channel.total_unread === 0 && channel.is_read === true ? dictionary.markAsUnread : dictionary.markAsRead}</div>
                  <div onClick={handleMuteChat}>{channel.is_muted ? dictionary.unmute : dictionary.mute}</div>
                  {channel.type !== "PERSONAL_BOT" && <div onClick={handleHideChat}>{!channel.is_hidden ? dictionary.hide : dictionary.unhide}</div>}
                  {<ChatTranslateActionsMenu selectedChannel={chatChannel} translated_channels={translated_channels} chatMessageActions={chatMessageActions} />}
                </StyledMoreOptions>
              </li>
            </ul>
          </div>
        </ChatIconsOptionsContainer>

        <div className="chat-header-folder">{getChannelFolder()}</div>
      </div>
      <ChatHeaderMembers channel={channel} />
    </Wrapper>
  );
};

export default ChatHeaderPanel;
