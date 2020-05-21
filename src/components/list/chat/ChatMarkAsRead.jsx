import React from "react";
import {isMobile} from "react-device-detect";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { markAllMessagesAsRead, markReadChannel } from "../../../redux/actions/chatActions";
//import {SvgIconFeather} from "../../common";

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
       
        dispatch(markAllMessagesAsRead({channel_id: channel.id}));
        dispatch(markReadChannel({channel_id: channel.id}));
    };

    return (
        <ChatMarkAsReadDiv
            className={`mark-read`}
            onClick={handleMarkMessageAsRead}
        >
            Mark as read
            {/* Mark as Read <SvgIconFeather icon="x"/> */}
        </ChatMarkAsReadDiv>
    );
};

export default React.memo(ChatMarkAsRead);