import React from "react";
import {useSelector} from "react-redux";
import styled from "styled-components";
import ChatMessages from "../../list/chat/ChatMessages";
import ChatFooterPanel from "./ChatFooterPanel";
import ChatHeaderPanel from "./ChatHeaderPanel";

const Wrapper = styled.div`
`;

const ChatContentPanel = (props) => {

    const {className = ""} = props;
    const selectedChannel = useSelector(state => state.chat.selectedChannel);

    return (
        <Wrapper className={`chat-content ${className}`}>
            <ChatHeaderPanel/>
            {selectedChannel !== null && <ChatMessages/>}
            {/* <ChatMessagesPanel/> */}
            <ChatFooterPanel/>
        </Wrapper>
    );
};

export default React.memo(ChatContentPanel);