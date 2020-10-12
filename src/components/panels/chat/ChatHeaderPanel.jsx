import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import { addToModals } from "../../../redux/actions/globalActions";
import { SvgIconFeather } from "../../common";
import useChannelActions from "../../hooks/useChannelActions";
import { MemberLists } from "../../list/members";
import ChannelIcon from "../../list/chat/ChannelIcon";
import { MoreOptions } from "../../panels/common";

const Wrapper = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .chat-header-left {
    display: flex;
    align-items: center;
    @media (min-width: 767.98px) {
      width: 33.333333%;
    }
    .chat-header-icon {
      @media (max-width: 991.99px) {
        display: none;
      }
    }
  }
  .chat-header-title {
    font-size: 15px;
    font-weight: 500;
    margin: 0;
    width: 33.333333%;
    text-align: center;
  }
  .chat-header-right {
    @media (min-width: 767.98px) {
      width: 33.333333%;
    }
    li .more-options-tooltip > div {
      display: flex;
      align-items: center;
      svg {
        margin-right: 4px;
      }
    }
  }
`;

const Icon = styled(SvgIconFeather)``;

const BackButton = styled.div`
  @media (min-width: 991.99px) {
    display: none;
  }
  color: #7a1b8b;
  cursor: pointer;
  transition: color 0.15s ease-in-out;
  display: flex;
  align-items: center;
  margin-right: 12px;
  span {
    line-height: 0;
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
  margin-top: 5px;
  border: 1px solid #e1e1e1;
  border-radius: 8px;
  height: 36px;
  width: 40px;
  align-items: center;
  justify-content: center;
  .feather-more-horizontal {
    width: 25px;
    height: 36px;
  }
  .more-options-tooltip {
    left: auto;
    right: 0;
    top: 25px;
    width: 250px;

    svg {
      width: 14px;
    }
  }
`;

const ChatHeaderPanel = (props) => {
  /**
   * @todo refactor
   */
  const { className = "", channel, dictionary } = props;
  const { unreadCounter } = useSelector((state) => state.global);

  const dispatch = useDispatch();
  const routeMatch = useRouteMatch();
  const history = useHistory();

  const channelActions = useChannelActions();

  const [page, setPage] = useState("chat");
  const chatChannel = useSelector((state) => state.chat.selectedChannel);

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

  const handleWorkspaceLinkClick = (e) => {
    e.preventDefault();
    history.push(e.target.dataset.href);
  };

  useEffect(() => {
    setPage(
      routeMatch.path.split("/").filter((p) => {
        return p.length !== 0;
      })[0]
    );
  }, [routeMatch.path, setPage]);

  if (channel === null) return null;

  return (
    <Wrapper className={`chat-header border-bottom ${className}`}>
      <div className="chat-header-left">
        <BackButton className="chat-back-button" onClick={goBackChannelSelect}>
          <BackButtonChevron icon={"chevron-left"}/>
          <span>{unreadCounter.chat_message + unreadCounter.workspace_chat_message}</span>
        </BackButton>
        <ChannelIcon className="chat-header-icon" channel={channel}/>
      </div>
      <h2 className="chat-header-title">
        {
          chatChannel.type === "TOPIC" ?
            <>{dictionary.workspace} > <a onClick={handleWorkspaceLinkClick}
                                          data-href={`/workspace/chat/${chatChannel.entity_id}/${chatChannel.title.toLowerCase().replaceAll(" ", "-")}`}
                                          href={`/workspace/chat/${chatChannel.entity_id}/${chatChannel.title.toLowerCase().replaceAll(" ", "-")}`}>{chatChannel.title}</a></> :
            chatChannel.title
        }
      </h2>
      <div className="chat-header-right">
        <ul className="nav align-items-center justify-content-end">
          {["DIRECT", "PERSONAL_BOT"].includes(channel.type) === false && (
            <li>
              <MemberLists members={channel.members}/>
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

export default React.memo(ChatHeaderPanel);
