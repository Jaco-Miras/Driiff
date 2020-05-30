import React from "react";
import styled from "styled-components";
import ChatJumpTo from "./ChatJumpTo";
import ChatMarkAsRead from "./ChatMarkAsRead";
import ChatUnreadCounterMessage from "./ChatUnreadCounterMessage";

const ChatUnreadFloatBarWrapper = styled.div`
    font-weight: 600;
    font-size: 0.75em;
    position: absolute;
    top: 11%;
    left: 0;
    right: 0;
    z-index: 9999;
    width: 80%;
    max-width: 100%;
    margin: 0 auto;
    background-color: rgb(122, 27, 139, .8);
    border-radius: 5px;
    display: flex;
    align-items: center;
    color: #fff;
    overflow: hidden;
    margin: 0 auto;
    > div {
        min-width: 130px;
    }
`;

const ChatUnreadFloatBar = props => {

    return (
        <ChatUnreadFloatBarWrapper className="chat-unread-floatbar">
            <ChatJumpTo/>
            <ChatUnreadCounterMessage/>
            <ChatMarkAsRead/>
        </ChatUnreadFloatBarWrapper>
    );
};

export default ChatUnreadFloatBar;