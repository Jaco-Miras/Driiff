import React, { useState } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
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
  min-width: ${(props) => (props.editMode ? "160px" : "120px")};
  display: flex;
  .feather {
    width: 18px;
    height: 18px;
  }
  .chat-buttons {
    display: none;
  }
  @media (max-width: 414px) {
    .feather-meet,
    .feather-smile,
    .feather-paperclip {
      display: ${(props) => (props.showButtons ? "block" : "none")};
    }
    .chat-buttons {
      display: block;
    }
  }
`;

const ChatInputButtons = (props) => {
  const { showEmojiPicker, handleShowEmojiPicker, handleGoogleMeet, onShowFileDialog, editChatMessage, quote } = props;
  const dispatch = useDispatch();
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
  return (
    <Wrapper editMode={editChatMessage !== null} showButtons={showButtons}>
      {editChatMessage && (
        <IconWrapper>
          <SvgIconFeather className="close-button" icon="x" onClick={handleEditReplyClose} />
        </IconWrapper>
      )}
      <IconWrapper>
        <SvgIconFeather className={`${showEmojiPicker ? "active" : ""}`} onClick={handleShowEmojiPicker} icon="smile" />
      </IconWrapper>
      <IconWrapper>
        <SvgIconFeather onClick={handleGoogleMeet} icon="meet" />
      </IconWrapper>
      <IconWrapper>
        <SvgIconFeather onClick={onShowFileDialog} icon="paperclip" />
      </IconWrapper>
      <IconWrapper className={"chat-buttons"}>
        <SvgIconFeather onClick={handleShowButtons} icon={showButtons ? "x" : "more-vertical"} />
      </IconWrapper>
    </Wrapper>
  );
};

export default ChatInputButtons;
