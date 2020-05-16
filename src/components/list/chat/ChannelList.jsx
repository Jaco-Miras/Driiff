import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import styled from "styled-components";
import {setChannelHistoricalPosition, setSelectedChannel} from "../../../redux/actions/chatActions";
import ChannelIcon from "./ChannelIcon";
import ChannelOptions from "./ChannelOptions";
import ChannelTitle from "./ChannelTitle";
import ChatDateIcons from "./ChatDateIcons";
import ReplyPreview from "./ReplyPreview";

const ChannelListContainer = styled.li`
    padding: 10px 5px;
    border-bottom: 1px solid #dedede;
    display: flex;
    align-items: center;
    background: ${props => props.selected ? "rgba(241, 230, 239)" : "#fff"};    
    &:hover {
        /* uncomment for background on hover
        background: #f1e6ef;
        color: #000;
        border-radius: 0;
        
        @media (max-width: 575.99px) {
            background: #fff;
        }
    
        p {
          color: #000;
          a {
            color: #000;
          }
        }*/
        cursor: pointer;
        cursor: hand;
        
        .more-button-component {
          opacity: 1;
          z-index: 7;
          
          &.active {
            &:before {
              background-color: #fff;
            }
            background-color: #972c86;
          }
        }
        
        .chat-timestamp {
          opacity: 0;
        }
      }
    .more-button-component {
        opacity: 0;
        position: absolute;
        right: 30px;
    }
`;
const ChannelTitlePreview = styled.div`
    flex: 1;
    max-width: calc(100% - 120px);
`;

const ChannelList = props => {
    const {channel} = props;
    const [optionsVisible, setOptionsVisible] = useState(false);
    const dispatch = useDispatch();
    const selectedChannel = useSelector(state => state.chat.selectedChannel);

    const onShowOptions = () => {
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
        <ChannelListContainer optionsVisible={optionsVisible} selected={channel.selected} onClick={handleSelectChannel}>
            <ChannelIcon channel={channel}/>
            <ChannelTitlePreview>
                <ChannelTitle channel={channel}/>
                <ReplyPreview channel={channel}/>
            </ChannelTitlePreview>
            <ChatDateIcons className={"chat-date-icons"} channel={channel} optionsVisible={optionsVisible}/>
            <ChannelOptions channel={channel} onShowOptions={onShowOptions}/>
        </ChannelListContainer>
    );
};

export default ChannelList;
