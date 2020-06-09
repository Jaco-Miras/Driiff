import React, {useEffect, useRef, useState} from "react";
import styled from "styled-components";
import {PickerEmoji, SvgIconFeather} from "../../common";
import {useTooltipOrientation} from "../../hooks";
import useChatMessageActions from "../../hooks/useChatMessageActions";

const ChatReactionButtonContainer = styled.div`
    border-radius:50%;    
    width: 26px;
    height: 26px;
    padding: 0;
    cursor: pointer;
    position: relative;
`;
const StyledEmojiButton = styled(SvgIconFeather)`
    ${props => props.active &&
    "filter: brightness(0) saturate(100%) invert(23%) sepia(21%) saturate(6038%) hue-rotate(284deg) brightness(93%) contrast(91%);"};
    
    &:hover {
        filter: brightness(0) saturate(100%) invert(23%) sepia(21%) saturate(6038%) hue-rotate(284deg) brightness(93%) contrast(91%);
    }
`;
const StyledPickerEmoji = styled(PickerEmoji)`
    opacity: ${props => props.display === true ? "1" : "0"};
    bottom: ${props => props.orientation === "top" ? "35px" : null};
    top: ${props => props.orientation === "bottom" ? "35px" : null};
    left: ${props => props.hOrientation === "left" ? "unset" : "0"};
    right: ${props => props.hOrientation === "left" ? "5px" : "unset"};
    
    li {        
        &:before {
            content: "" !important;
            margin:0 !important;
            display: none !important;            
        }
        
        padding-left: 0 !important;
        text-align: left !important;
        position: relative !important;
        margin-left: 10px !important;
    }
`;

const ChatReactionButton = props => {

    const {isAuthor, reply, scrollRef = null} = props;

    const chatMessageAction = useChatMessageActions();


    const pickerRef = useRef();
    const chatOptionsRef = useRef();
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [displayEmojiPicker, setDisplayEmojiPicker] = useState(false);

    const handleShowEmojiPicker = () => setShowEmojiPicker(!showEmojiPicker);

    const handleSelectEmoji = (e) => {
        handleShowEmojiPicker();
        chatMessageAction.react(reply.id, e.id);
    };

    const handlePickerMouseLeave = () => {
        setTimeout(() => {
            setShowEmojiPicker(false);
        }, 1000);
    };

    const orientation = useTooltipOrientation(chatOptionsRef, pickerRef, scrollRef, showEmojiPicker, 0);

    useEffect(() => {
        if (showEmojiPicker) {
            setTimeout(() => {
                setDisplayEmojiPicker(true);
            });
        } else {
            setDisplayEmojiPicker(false);
        }
    }, [showEmojiPicker]);

    return (
        <ChatReactionButtonContainer
            ref={chatOptionsRef}
        >
            <StyledEmojiButton
                icon="smile"
                active={showEmojiPicker}
                onClick={handleShowEmojiPicker}
            />
            {
                showEmojiPicker &&
                <StyledPickerEmoji
                    display={displayEmojiPicker}
                    onMouseLeave={handlePickerMouseLeave}
                    isAuthor={isAuthor}
                    className={"chat-reaction-picker"}
                    ref={pickerRef}
                    orientation={orientation.vertical}
                    hOrientation={orientation.horizontal}
                    onSelectEmoji={handleSelectEmoji}
                    handleShowEmojiPicker={handleShowEmojiPicker}
                />
            }
        </ChatReactionButtonContainer>
    );
};

export default ChatReactionButton;