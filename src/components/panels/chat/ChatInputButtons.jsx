import React, { useState } from "react";
import styled from "styled-components";
import Tooltip from "react-tooltip-lite";
import { useDispatch, useSelector } from "react-redux";
import { SvgIconFeather } from "../../common";
import { setEditChatMessage, clearQuote } from "../../../redux/actions/chatActions";

const IconWrapper = styled.div`
  width: 40px;
  display: flex;
  align-items: center;
  padding: 13px 10px;
  align-self: flex-end;
  @media (max-width: 414px) {
    width: 30px;
    padding: 13px 2px;
  }
`;
const Wrapper = styled.div`
  min-width: ${(props) => (props.editMode && !props.clientChat ? "160px" : props.editMode && props.clientChat ? "120px" : !props.editMode && props.clientChat ? "80px" : "120px")};
  display: flex;
  .feather {
    width: 18px;
    height: 18px;
  }
  .chat-buttons {
    display: none;
  }
  @media (max-width: 414px) {
    min-width: ${(props) =>
      props.clientChat && props.showButtons && props.editMode
        ? "120px"
        : props.clientChat && props.showButtons && !props.editMode
        ? "90px"
        : props.showButtons && props.editMode
        ? "150px"
        : props.showButtons
        ? "120px"
        : props.editMode
        ? "60px"
        : "30px"};
    .btn-meet,
    .btn-smile,
    .btn-paperclip {
      display: ${(props) => (props.showButtons ? "block" : "none")};
    }
    .chat-buttons {
      display: block;
    }
  }
`;

const ChatInputButtons = (props) => {
  const { channel, showEmojiPicker, handleShowEmojiPicker, handleGoogleMeet, onShowFileDialog, editChatMessage, quote, dictionary } = props;
  const dispatch = useDispatch();
  const workspaces = useSelector((state) => state.workspaces.workspaces);
  const [showButtons, setShowButtons] = useState(false);
  const handleEditReplyClose = () => {
    if (quote) dispatch(clearQuote(quote));
    if (editChatMessage !== null) {
      dispatch(setEditChatMessage(null));
    }
  };
  const handleShowButtons = () => {
    setShowButtons((prevState) => !prevState);
  };
  const toggleTooltip = () => {
    let tooltips = document.querySelectorAll("span.react-tooltip-lite");
    tooltips.forEach((tooltip) => {
      tooltip.parentElement.classList.toggle("tooltip-active");
    });
  };

  const isClientChat = channel && workspaces[channel.entity_id] && workspaces[channel.entity_id].is_shared && workspaces[channel.entity_id].channel.id === channel.id;

  return (
    <Wrapper editMode={editChatMessage !== null} showButtons={showButtons} clientChat={isClientChat}>
      {editChatMessage && (
        <IconWrapper>
          <Tooltip arrowSize={5} distance={10} onToggle={toggleTooltip} content={dictionary.closeEdit}>
            <SvgIconFeather className="close-button" icon="x" onClick={handleEditReplyClose} />
          </Tooltip>
        </IconWrapper>
      )}
      <IconWrapper className="btn-smile">
        <Tooltip arrowSize={5} distance={10} onToggle={toggleTooltip} content="Emoji">
          <SvgIconFeather className={`${showEmojiPicker ? "active" : ""}`} onClick={handleShowEmojiPicker} icon="smile" />
        </Tooltip>
      </IconWrapper>
      <IconWrapper className="btn-meet">
        <Tooltip arrowSize={5} distance={10} onToggle={toggleTooltip} content="Zoom">
          <SvgIconFeather onClick={handleGoogleMeet} icon="meet" />
        </Tooltip>
      </IconWrapper>
      <IconWrapper className="btn-paperclip">
        <Tooltip arrowSize={5} distance={10} onToggle={toggleTooltip} content={dictionary.attachFiles}>
          <SvgIconFeather onClick={onShowFileDialog} icon="paperclip" />
        </Tooltip>
      </IconWrapper>
      <IconWrapper className={"chat-buttons"}>
        <SvgIconFeather onClick={handleShowButtons} icon={showButtons ? "x" : "more-vertical"} />
      </IconWrapper>
    </Wrapper>
  );
};

export default React.memo(ChatInputButtons);
