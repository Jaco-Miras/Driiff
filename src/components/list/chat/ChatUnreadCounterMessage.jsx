import React from "react";
import {isMobile} from "react-device-detect";
import styled from "styled-components";
import {useCountUnreadReplies} from "../../hooks";

const ChatUnreadCounterMessageDiv = styled.div`
    padding: 10px 20px;
    order: ${isMobile ? "1" : null};
    flex: 1;
    border-bottom: ${isMobile ? "1px solid #017180" : null};
    text-align: center;
`;

const ChatUnreadCounterMessage = props => {

    const count = useCountUnreadReplies();

    return (
        <ChatUnreadCounterMessageDiv
            className={"unread-counter-message"}
        >
            You have {count} new message/s
        </ChatUnreadCounterMessageDiv>
    );
};

export default React.memo(ChatUnreadCounterMessage);