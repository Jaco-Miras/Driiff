import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { addToModals } from "../../../redux/actions/globalActions";
import { SvgIconFeather } from "../../common";
import useChannelActions from "../../hooks/useChannelActions";
import { MemberLists } from "../../list/members";
import ChannelIcon from "../../list/chat/ChannelIcon";
import { MoreOptions } from "../../panels/common";
import { useSettings, useWorkspaceActions } from "../../hooks";
import { replaceChar } from "../../../helpers/stringFormatter";

const Wrapper = styled.div`
  position: relative;
  z-index: 3;
  display: flex;
  align-items: center;

  .chat-header-left {
    display: flex;
  }

  .chat-header-title {
    font-size: 15px;
    font-weight: 500;
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
  }
  .chat-header-right {
    margin-left: auto;
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
`;

const Icon = styled(SvgIconFeather)``;

const EyeIcon = styled(SvgIconFeather)`
  width: 0.9rem;
  height: 0.9rem;
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
  border-radius: 8px;
  width: 40px;
  align-items: center;
  justify-content: center;

  .dark & {
    border: 1px solid #25282c;
    background: #25282c;
  }
  .feather-more-horizontal {
    width: 25px;
    height: 36px;
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
    margin: 0 0 0.75rem !important;
  }
`;

const StyledBadge = styled.div`
  display: inline-flex;
  align-items: center;
`;

const ChatHeaderBadgeContainer = styled.div`
  display: flex;
  align-items: center;
`;

const ChatHeaderPanel = (props) => {
  /**
   * @todo refactor
   */
  const { className = "", channel, dictionary } = props;

  const dispatch = useDispatch();
  const history = useHistory();
  const channelActions = useChannelActions();
  const chatChannel = useSelector((state) => state.chat.selectedChannel);
  const workspaces = useSelector((state) => state.workspaces.workspaces);
  const unreadCounter = useSelector((state) => state.global.unreadCounter);

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
    workspaceAction.selectWorkspace(workspaces[chatChannel.entity_id]);
    workspaceAction.redirectTo(workspaces[chatChannel.entity_id]);
  };

  const handleRedirectToProfile = (e, profile) => {
    e.preventDefault();
    history.push(`/profile/${profile.id}/${replaceChar(profile.name)}`);
  };

  const getChannelTitle = () => {
    switch (chatChannel.type) {
      case "TOPIC": {
        if (chatChannel.workspace_folder) {
          return (
            <>
              {chatChannel.workspace_folder.name}&nbsp;{">"}&nbsp;
              <a onClick={handleWorkspaceLinkClick} data-href={channelActions.getChannelLink(chatChannel)} href={channelActions.getChannelLink(chatChannel)}>
                {chatChannel.title}
              </a>
            </>
          );
        } else {
          return (
            <>
              <span className="dictionary-label">
                {dictionary.workspace}&nbsp;{">"}&nbsp;
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
      default: {
        return chatChannel.title;
      }
    }
  };

  if (channel === null) return null;

  return (
    <Wrapper className={`chat-header border-bottom ${className}`}>
      <div className="chat-header-left">
        <BackButton className="chat-back-button" onClick={goBackChannelSelect}>
          <BackButtonChevron icon={"chevron-left"} />
          {unreadCounter.chat_message > 0 && <span>{unreadCounter.chat_message.toString()}</span>}
        </BackButton>
        <ChannelIcon className="chat-header-icon" channel={channel} />
      </div>
      <div className="chat-header-title">{getChannelTitle()}</div>
      <ChatHeaderBadgeContainer className="chat-header-badge">
        {channel.type === "TOPIC" && !channel.is_archived && workspaces.hasOwnProperty(channel.entity_id) && workspaces[channel.entity_id].is_lock === 1 && workspaces[channel.entity_id].active === 1 && (
          <Icon className={"ml-1"} icon={"lock"} strokeWidth="2" width={12} />
        )}
        {channel.type === "TOPIC" &&
          !channel.is_archived &&
          workspaces.hasOwnProperty(channel.entity_id) &&
          workspaces[channel.entity_id].is_shared &&
          workspaces[channel.entity_id].active === 1 &&
          (channel.team ? (
            <Icon className={"ml-1"} icon={"eye"} strokeWidth="3" width={12} />
          ) : (
            <StyledBadge className={"badge badge-external ml-1"}>
              <EyeIcon icon="eye" className={"mr-1"} />
              {dictionary.withClient}
            </StyledBadge>
          ))}
      </ChatHeaderBadgeContainer>
      <div className="chat-header-right">
        <ul className="nav align-items-center justify-content-end">
          {["DIRECT", "PERSONAL_BOT"].includes(channel.type) === false && (
            <li>
              <MemberLists members={channel.members.filter((m) => m.has_accepted)} />
            </li>
          )}
          {(["PERSONAL_BOT", "COMPANY", "TOPIC"].includes(channel.type) === false || (["DIRECT", "PERSONAL_BOT", "COMPANY", "TOPIC"].includes(channel.type) === false && !channel.is_archived)) && (
            <li className="ml-2 d-sm-inline d-none">
              <StyledMoreOptions role="tabList">
                {["PERSONAL_BOT", "COMPANY", "TOPIC"].includes(channel.type) === false && (
                  <div onClick={handleShowArchiveConfirmation}>
                    <Icon icon={channel.is_archived ? "rotate-ccw" : "trash-2"} />
                    {channel.is_archived ? "Restore" : "Archive"}
                  </div>
                )}
                {["DIRECT", "PERSONAL_BOT", "COMPANY", "TOPIC"].includes(channel.type) === false && !channel.is_archived && (
                  <div onClick={handleShowChatEditModal}>
                    <Icon icon={"edit-3"} />
                    {dictionary.edit}
                  </div>
                )}
              </StyledMoreOptions>
            </li>
          )}
        </ul>
      </div>
    </Wrapper>
  );
};

export default ChatHeaderPanel;
