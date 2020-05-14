import React from "react";
import styled from "styled-components";
import {useSelector} from 'react-redux'
import ChatFooterPanel from "./ChatFooterPanel";
import ChatHeaderPanel from "./ChatHeaderPanel";
import ChatMessagesPanel from "./ChatMessagesPanel";
import ChatMessages from '../../list/chat/ChatMessages';

const Wrapper = styled.div`
`;

const ChatContentPanel = (props) => {

    const {className = ""} = props;
    const selectedChannel = useSelector(state => state.chat.selectedChannel)

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