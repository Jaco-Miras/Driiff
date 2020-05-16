import React, {useRef, useState} from "react";
import {useDispatch} from "react-redux";
import styled from "styled-components";
import {chatReaction} from "../../../redux/actions/chatActions";
import EmojiButton from "../../common/EmojiButton";
import PickerEmoji from "../../common/PickerEmoji";
import {useTooltipHorizontalOrientation, useTooltipOrientation} from "../../hooks/useTooltipOrientation";

const ChatReactionButtonContainer = styled.div`
    border-radius:50%;    
    width: 26px;
    height: 26px;
    padding: 0;
    cursor: pointer;
    position: relative;
`;
const StyledEmojiButton = styled(EmojiButton)`
    :hover {
        filter: brightness(0) saturate(100%) invert(23%) sepia(21%) saturate(6038%) hue-rotate(284deg) brightness(93%) contrast(91%);
    }
    ${props => props.active ?
    "filter: brightness(0) saturate(100%) invert(23%) sepia(21%) saturate(6038%) hue-rotate(284deg) brightness(93%) contrast(91%)"
    : ""};
`;
const StyledPickerEmoji = styled(PickerEmoji)`
    bottom: ${props => props.orientation === "top" ? "35px" : null};
    top: ${props => props.orientation === "bottom" ? "35px" : null};
    left: ${props => props.hOrientation === "left" ? "unset" : "0"};
    right: ${props => props.hOrientation === "left" ? "5px" : "unset"};
`;

const ChatReactionButton = props => {
    const {isAuthor, reply, scrollRef = null} = props;

    const dispatch = useDispatch();
    const pickerRef = useRef();
    const chatOptionsRef = useRef();
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const handleShowEmojiPicker = () => setShowEmojiPicker(!showEmojiPicker);

    const handleSelectEmoji = (e) => {
        handleShowEmojiPicker();
        let payload = {
            message_id: reply.id,
            react_type: e.id,
        };
        dispatch(
            chatReaction(payload),
        );
    };

    const handlePickerMouseLeave = () => {
        setTimeout(() => {
            setShowEmojiPicker(false);
        }, 1000);
    };

    const [orientation] = useTooltipOrientation(chatOptionsRef, pickerRef, scrollRef, showEmojiPicker, 0);
    const [hOrientation] = useTooltipHorizontalOrientation(chatOptionsRef, pickerRef, null, showEmojiPicker);

    return (
        <ChatReactionButtonContainer
            ref={chatOptionsRef}
        >
            <StyledEmojiButton
                active={showEmojiPicker}
                onEmojiBtnClick={handleShowEmojiPicker}
            />
            {
                showEmojiPicker &&
                <StyledPickerEmoji
                    onMouseLeave={handlePickerMouseLeave}
                    isAuthor={isAuthor}
                    className={"chat-reaction-picker"}
                    ref={pickerRef}
                    orientation={orientation}
                    hOrientation={hOrientation}
                    onSelectEmoji={handleSelectEmoji}
                    handleShowEmojiPicker={handleShowEmojiPicker}
                />
            }
        </ChatReactionButtonContainer>
    );
};

export default ChatReactionButton;