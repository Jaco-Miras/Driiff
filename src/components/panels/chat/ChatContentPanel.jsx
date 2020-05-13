import React from "react";
import styled from "styled-components";
import ChatFooterPanel from "./ChatFooterPanel";
import ChatHeaderPanel from "./ChatHeaderPanel";
import ChatMessagesPanel from "./ChatMessagesPanel";

const Wrapper = styled.div`
`;

const ChatContentPanel = (props) => {

    const {className = ""} = props;

    return (
        <Wrapper className={`chat-content ${className}`}>
            <ChatHeaderPanel/>
            <ChatMessagesPanel/>
            <ChatFooterPanel/>
        </Wrapper>
    );
};

export default React.memo(ChatContentPanel);