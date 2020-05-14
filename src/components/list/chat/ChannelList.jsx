import React from 'react';
import styled from 'styled-components';
import ChannelIcon from './ChannelIcon';
import ChannelTitle from './ChannelTitle'
import ChannelOptions from './ChannelOptions';
import ReplyPreview from './ReplyPreview';
import ChatDateIcons from './ChatDateIcons';

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
        display: block;
    }
`
const ChannelTitlePreview = styled.div`
    flex: 1;
    max-width: calc(100% - 105px);
`

const ChannelList = props => {
    const {channel} = props;
    
    return (
        <ChannelListContainer>
            <ChannelIcon channel={channel}/>
            <ChannelTitlePreview>
                <ChannelTitle channel={channel}/>
                <ReplyPreview channel={channel}/>
            </ChannelTitlePreview>
            <ChatDateIcons channel={channel}/>
            <ChannelOptions channel={channel}/>
        </ChannelListContainer>
    )
}

export default ChannelList