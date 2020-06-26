import React from "react";
import {isMobile} from "react-device-detect";
import {useDispatch} from "react-redux";
import styled from "styled-components";
import {putMarkReadChannel, setAllMessagesAsRead} from "../../../redux/actions/chatActions";

const ChatMarkAsReadDiv = styled.div`
    cursor: pointer;
    outline: none;
    padding: 10px;
    transition: all 0.3s ease;
    order: ${isMobile ? "2" : null};
    flex: ${isMobile ? "1 1 50%" : null};
    border-right: ${isMobile ? "1px solid #7a1b8b" : null};
    text-align: center;
    :hover {
        background-color: #7a1b8b;
    }
    > svg {
        width: 1rem;
    }
`;

const ChatMarkAsRead = props => {
    const {
        channel,
    } = props;

    const dispatch = useDispatch();

    const handleMarkMessageAsRead = (e) => {

        dispatch(putMarkReadChannel({channel_id: channel.id}));
        dispatch(setAllMessagesAsRead({channel_id: channel.id}));
    };

    return (
        <ChatMarkAsReadDiv
            className={`mark-read`}
            onClick={handleMarkMessageAsRead}
        >
            Mark as read
        </ChatMarkAsReadDiv>
    );
};

export default React.memo(ChatMarkAsRead);