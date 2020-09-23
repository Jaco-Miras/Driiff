import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import { addToModals } from "../../../redux/actions/globalActions";
import { SvgIconFeather } from "../../common";
import useChannelActions from "../../hooks/useChannelActions";
import ChatMembers from "../../list/chat/ChatMembers";
import ChatTitleTyping from "../../list/chat/ChatTitleTyping";
import { MemberLists } from "../../list/members";
import ChannelIcon from "../../list/chat/ChannelIcon";

const Wrapper = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .chat-header-title {
    font-size: 15px;
    font-weight: 500;
    margin: 0;
  }
`;

const IconButton = styled(SvgIconFeather)`
  border: 1px solid #afb8bd;
  border-radius: 8px;
  padding: 0px 12px;
  height: 30px;
  width: 40px;
  cursor: pointer;
  cursor: hand;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  &:hover {
    background: #afb8bd;
    color: #ffffff;
  }
`;

const Icon = styled(SvgIconFeather)`
  color: #ffffff !important;
  height: 32px;
  width: 32px;
`;

const ChatHeaderPanel = (props) => {
  /**
   * @todo refactor
   */
  const { className = "", channel } = props;

  const dispatch = useDispatch();
  const routeMatch = useRouteMatch();

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
      <div className="chat-header-icon-left">
        <ChannelIcon channel={channel} />
      </div>
      <h2 className="chat-header-title">{chatChannel.title}</h2>
      <div className="chat-header-right">
        <ul className="nav align-items-center">
          <li>
            <MemberLists members={channel.members} />
          </li>
          {["DIRECT", "PERSONAL_BOT", "COMPANY", "TOPIC"].includes(channel.type) === false && !channel.is_archived && (
            <>
              <li className="ml-2 d-sm-inline d-none">
                <IconButton icon={"edit-3"} onClick={handleShowChatEditModal} />
              </li>
            </>
          )}
          {["PERSONAL_BOT", "COMPANY", "TOPIC"].includes(channel.type) === false && (
            <>
              <li className="ml-2 d-sm-inline d-none" title={channel.is_archived ? "Restore" : "Archive"}>
                <IconButton icon={channel.is_archived ? "rotate-ccw" : "trash-2"} onClick={handleShowArchiveConfirmation} />
              </li>
            </>
          )}
          <li className="ml-2 mobile-chat-close-btn" onClick={goBackChannelSelect}>
            <IconButton icon={"arrow-left"} />
          </li>
        </ul>
      </div>
    </Wrapper>
  );
};

export default React.memo(ChatHeaderPanel);
