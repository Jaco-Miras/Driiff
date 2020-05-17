import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
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
    
    &:hover {
        .more-button-component {
            opacity: 1;
            z-index: 1;
            
            &.active {
                color: #fff !important;
                background-color: #972c86;
            }
        }        
        .chat-timestamp {
            opacity: 0;
            display: none;
        }
    }
    .chat-timestamp {
        position: absolute;
        right: 20px;
    }
    .feather-more-horizontal {
        width: 25px;
        height: 25px;
        position: relative;
        right: 28px;
        border: 1px solid #dee2e6;
        padding: 3px;
        top: 5px;
    }    
`;

const ChannelTitlePreview = styled.div`
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
        //this.props.handleShowNewChatWindow(false);
        //this.handleBlurSearchInput(e);

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
            //props.history.push(`/chat/${updatedChannel.code}`);
        }
    };

    return (
        <Wrapper
            className={`list-group-item active d-flex pl-0 pr-0 pb-3 pt-3 ${className}`}
            optionsVisible={optionsVisible} selected={channel.selected} onClick={handleSelectChannel}>
            <ChannelIcon channel={channel}/>
            <ChannelTitlePreview className={`flex-grow- 1`}>
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

export default ChannelList;
