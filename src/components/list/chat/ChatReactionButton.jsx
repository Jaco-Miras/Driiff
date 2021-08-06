import React, { useRef, useState } from "react";
import styled from "styled-components";
import { PickerEmoji, SvgIconFeather } from "../../common";
import { useOutsideClick, useTooltipOrientation } from "../../hooks";
//import useChatMessageActions from "../../hooks/useChatMessageActions";

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
  .feather-smile {
    @media (max-width: 620px) {
      //display: none;
    }
    ${(props) => props.active && "filter: brightness(0) saturate(100%) invert(23%) sepia(21%) saturate(6038%) hue-rotate(284deg) brightness(93%) contrast(91%);"};

    &:hover {
      filter: brightness(0) saturate(100%) invert(23%) sepia(21%) saturate(6038%) hue-rotate(284deg) brightness(93%) contrast(91%);
    }
  }
  .chat-reaction-picker {
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
        bottom: 120px;
      }
      &.orientation-bottom {
        top: auto;
        bottom: 120px;
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
    @media (max-width: 1280px) {
      .emoji-mart {
        max-height: 280px;
        overflow: auto;
      }
    }
  }
`;

const ChatReactionButton = (props) => {
  const { reply, scrollComponent, chatMessageActions } = props;
  let timeout = null;

  // const chatMessageAction = useChatMessageActions();
  //const scrollEl = document.getElementById("component-chat-thread");
  const refs = {
    container: useRef(null),
    picker: useRef(null),
  };

  const [showEmojiPicker, setShowEmojiPicker] = useState(null);

  const handleShowEmojiPicker = () => setShowEmojiPicker(!showEmojiPicker);

  const handleSelectEmoji = (e) => {
    handleShowEmojiPicker();
    chatMessageActions.react(reply.id, e.id);
  };

  const handlePickerMouseEnter = () => {
    clearTimeout(timeout);
  };

  const handlePickerMouseLeave = () => {
    timeout = setTimeout(() => {
      setShowEmojiPicker(false);
    }, 1000);
  };

  const { orientation } = useTooltipOrientation(refs.container, refs.picker, scrollComponent, showEmojiPicker);

  // useEffect(() => {
  //   if (showEmojiSwitcher !== null) {
  //     setShowEmojiPicker(true);
  //   }
  // }, [showEmojiSwitcher]);

  const hideEmojiPicker = () => setShowEmojiPicker(false);
  useOutsideClick(refs.container, hideEmojiPicker, true);

  return (
    <ChatReactionButtonContainer className="emoji-button-div" ref={refs.container} active={showEmojiPicker}>
      <SvgIconFeather icon="smile" onClick={handleShowEmojiPicker} />
      {showEmojiPicker && (
        <PickerEmoji ref={refs.picker} onMouseEnter={handlePickerMouseEnter} onMouseLeave={handlePickerMouseLeave} className={"chat-reaction-picker"} orientation={orientation} onSelectEmoji={handleSelectEmoji} show={showEmojiPicker} />
      )}
    </ChatReactionButtonContainer>
  );
};

export default React.memo(ChatReactionButton);
