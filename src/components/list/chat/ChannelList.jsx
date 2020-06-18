import React, {useState} from "react";
import {useHistory} from "react-router-dom";
import styled from "styled-components";
import useChannelActions from "../../hooks/useChannelActions";
import ChannelIcon from "./ChannelIcon";
import ChannelOptions from "./ChannelOptions";
import ChannelTitle from "./ChannelTitle";
import ChatDateIcons from "./ChatDateIcons";
import ReplyPreview from "./ReplyPreview";

const Wrapper = styled.span`
    cursor: pointer;
    cursor: hand;
    position: relative;
    ${props => props.selected && "padding-left: 14px !important"};

    .more-options {
        position: relative;
        opacity: 0;
        z-index: -1;
    }

    &:hover {
        .more-options {
            opacity: 1;
            z-index: 1;
            &.active {
                color: #4d4d4d !important;
            }
        }
        .chat-timestamp {
            opacity: 0;
            visibility: hidden;
        }
        h6 {
            color: #7A1B8B;
        }
    }
    h6 {
        ${props => props.selected && "color: #7A1B8B"};
    }
    &:after {
        ${props => props.selected && "content: ''"};
        width: 3px;
        height: 100%;
        background: #7A1B8B;
        display: block;
        position: absolute;
        left: 0;
        top: 0;
    }


    .chat-timestamp {
        position: absolute;
        right: 0px;
        white-space: nowrap;
        transition: opacity 0.3s ease;
        svg {
            margin-left: 4px;
            fill: #ffc107;
            color: #ffc107;
        }
        .badge {
            position: absolute;
            right: calc(100% + 14px)
        }
    }
    .feather-more-horizontal {
        width: 25px;
        height: 25px;
        position: relative;
        right: 0;
        ${"" /* border: 1px solid #dee2e6; */}
        fill: currentColor;
        padding: 3px;
        top: 2px;
    }
`;

const ChannelTitlePreview = styled.div`
    padding-right: 60px;
`;

const Timestamp = styled.div`
    position: relative;
`;

const ChannelList = props => {

    const channelActions = useChannelActions();

    const history = useHistory();

    const {className = "", channel, selectedChannel} = props;

    const [optionsVisible, setOptionsVisible] = useState(false);

    const toggleOptions = () => {
        setOptionsVisible(!optionsVisible);
    };

    const handleSelectChannel = () => {

        if (selectedChannel !== null) {
            const scrollComponent = document.getElementById("component-chat-thread");
            if (scrollComponent) {
                channelActions.saveHistoricalPosition(selectedChannel.id, scrollComponent);
            }
        }

        channelActions.select({...channel, selected: true});
        history.push(`/chat/${channel.code}`);
    };

    return (
        <Wrapper
            className={`list-group-item d-flex align-items-center link-1 pl-0 pr-0 pb-3 pt-3 ${className}`}
            optionsVisible={optionsVisible} selected={channel.selected} onClick={handleSelectChannel}>
            <ChannelIcon channel={channel}/>
            <ChannelTitlePreview className={`flex-grow-1`}>
                <ChannelTitle channel={channel}/>
                <ReplyPreview channel={channel}/>
            </ChannelTitlePreview>
            <Timestamp className="text-right ml-auto">
                <ChatDateIcons
                    className={"chat-date-icons"}
                    channel={channel}
                    optionsVisible={optionsVisible}/>
                <ChannelOptions
                    selectedChannel={selectedChannel}
                    channel={channel}
                    onShowOptions={toggleOptions}/>
            </Timestamp>
        </Wrapper>
    );
};

export default ChannelList;