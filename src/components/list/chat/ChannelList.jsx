import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {withRouter} from "react-router-dom";
import styled from "styled-components";
import {setChannelHistoricalPosition, setSelectedChannel} from "../../../redux/actions/chatActions";
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

    &:hover {
        .more-button-component {
            opacity: 1;
            z-index: 1;
            &.active {
                color: #4d4d4d !important;
            }
        }
        .chat-timestamp {
            opacity: 0;
            display: none;
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
        svg {
            margin-left: 4px;
        }
        .badge {
            position: absolute;
            left: calc(-100% - 4px);
        }
    }
    .feather-more-horizontal {
        width: 25px;
        height: 25px;
        position: relative;
        right: 0;
        ${'' /* border: 1px solid #dee2e6; */}
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
    const {className = "", channel} = props;
    const [optionsVisible, setOptionsVisible] = useState(false);
    const dispatch = useDispatch();
    const selectedChannel = useSelector(state => state.chat.selectedChannel);

    const toggleOptions = () => {
        setOptionsVisible(!optionsVisible);
    };

    const handleSelectChannel = () => {

        if (selectedChannel.id !== channel.id) {
            const scrollComponent = document.getElementById("component-chat-thread");
            if (scrollComponent) {
                dispatch(setChannelHistoricalPosition({
                    channel_id: selectedChannel.id,
                    scrollPosition: scrollComponent.scrollHeight - scrollComponent.scrollTop,
                }));
            }

            dispatch(
                setSelectedChannel({...channel, selected: true}),
            );
            props.history.push(`/chat/${channel.code}`);
        }
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
                <ChatDateIcons className={"chat-date-icons"} channel={channel} optionsVisible={optionsVisible}/>
                <ChannelOptions channel={channel} onShowOptions={toggleOptions}/>
            </Timestamp>
        </Wrapper>
    );
};

export default withRouter(ChannelList);
