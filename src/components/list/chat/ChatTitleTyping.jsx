import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { useIsUserTyping } from "../../hooks";

const ChatTitleTypingContainer = styled.div`
    h6 {
        margin: 0;
    }
`;

const Typing = styled.div`
    opacity: ${props => props.isTyping ? "1" : 0};
`;

const ChatTitleTyping = props => {

    const chatChannel = useSelector(state => state.chat.selectedChannel);
    const usersTyping = useIsUserTyping();

    return (
        <ChatTitleTypingContainer>
            <h6 className="mb-1">{chatChannel.title}</h6>
            <Typing isTyping={usersTyping.length} className="m-0 small text-success">typing...</Typing>
        </ChatTitleTypingContainer>
    )
};

export default ChatTitleTyping;