import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { PickerEmoji, SvgIconFeather } from "../../common";
import { useOutsideClick, useTooltipOrientation } from "../../hooks";
import useChatMessageActions from "../../hooks/useChatMessageActions";

const ChatReactionButtonContainer = styled.div`
  border-radius: 50%;
  width: 26px;
  height: 26px;
  padding: 0;
  cursor: pointer;
  position: relative;
  @media (max-width: 620px) {
    width: 20px;
    height: 20px;
  }
`;
const StyledEmojiButton = styled(SvgIconFeather)`
  @media (max-width: 620px) {
    //display: none;
  }
  ${(props) => props.active && "filter: brightness(0) saturate(100%) invert(23%) sepia(21%) saturate(6038%) hue-rotate(284deg) brightness(93%) contrast(91%);"};

  &:hover {
    filter: brightness(0) saturate(100%) invert(23%) sepia(21%) saturate(6038%) hue-rotate(284deg) brightness(93%) contrast(91%);
  }
`;
const StyledPickerEmoji = styled(PickerEmoji)`
  &.orientation-top {
    bottom: 25px;
  }
  &.orientation-bottom {
    top: calc(100% + 5px);
  }
  &.orientation-left {
    right: calc(100% - 25px);
    left: auto;
  }
  &.orientation-right {
    left: calc(100% - 25px);
    right: auto;
  }

  @media (max-width: 576px) {
    position: fixed;
    justify-content: center;
    display: flex;

    &.orientation-top {
      bottom: 100px;
    }
    &.orientation-bottom {
      top: auto;
      bottom: 100px;
    }
    &.orientation-left {
      right: 0;
      left: 0;
    }
    &.orientation-right {
      left: 0;
      right: 0;
    }
  }

  .emoji-mart-bar {
    display: none;
  }

  li {
    &:before {
      content: "" !important;
      margin: 0 !important;
      display: none !important;
    }

    padding-left: 0 !important;
    text-align: left !important;
    position: relative !important;
    margin-left: 10px !important;
  }
`;

const ChatReactionButton = (props) => {
  const { reply, showEmojiSwitcher = null } = props;
  let timeout = null;

  const chatMessageAction = useChatMessageActions();
  const scrollEl = document.getElementById("component-chat-thread");
  const refs = {
    container: useRef(null),
    picker: useRef(null),
  };

  const [showEmojiPicker, setShowEmojiPicker] = useState(showEmojiSwitcher);

  const handleShowEmojiPicker = () => setShowEmojiPicker(!showEmojiPicker);

  const handleSelectEmoji = (e) => {
    handleShowEmojiPicker();
    chatMessageAction.react(reply.id, e.id);
  };

  const handlePickerMouseEnter = () => {
    clearTimeout(timeout);
  };

  const handlePickerMouseLeave = () => {
    timeout = setTimeout(() => {
      setShowEmojiPicker(false);
    }, 1000);
  };

  const { orientation } = useTooltipOrientation(refs.container, refs.picker, scrollEl, showEmojiPicker);

  useEffect(() => {
    if (showEmojiSwitcher !== null) {
      setShowEmojiPicker(true);
    }
  }, [showEmojiSwitcher]);

  useOutsideClick(
    refs.container,
    () => {
      setShowEmojiPicker(false);
    },
    true
  );

  return (
    <ChatReactionButtonContainer className="emoji-button-div" ref={refs.container}>
      <StyledEmojiButton icon="smile" active={showEmojiPicker} onClick={handleShowEmojiPicker} />
      {showEmojiPicker && (
        <StyledPickerEmoji
          ref={refs.picker}
          onMouseEnter={handlePickerMouseEnter}
          onMouseLeave={handlePickerMouseLeave}
          className={"chat-reaction-picker"}
          orientation={orientation}
          onSelectEmoji={handleSelectEmoji}
          show={showEmojiPicker}
        />
      )}
    </ChatReactionButtonContainer>
  );
};

export default ChatReactionButton;
