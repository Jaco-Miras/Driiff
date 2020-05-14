import React, {useState} from "react";
import styled from "styled-components";
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
        right: 1rem;
    }
`;
const ChannelTitlePreview = styled.div`
    flex: 1;
    max-width: calc(100% - 105px);
`;

const ChannelList = props => {
    const {channel} = props;
    const [optionsVisible, setOptionsVisible] = useState(false);
    const onShowOptions = () => {
        setOptionsVisible(!optionsVisible);
    };

    return (
        <ChannelListContainer optionsVisible={optionsVisible}>
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