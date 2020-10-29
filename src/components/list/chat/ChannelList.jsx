import React from "react";
import styled from "styled-components";
import useChannelActions from "../../hooks/useChannelActions";
import ChannelIcon from "./ChannelIcon";
import ChannelTitle from "./ChannelTitle";
import ChatDateIcons from "./ChatDateIcons";
import ReplyPreview from "./ReplyPreview";
import { Badge } from "../../common";
import { useSelector } from "react-redux";
import { useTimeFormat } from "../../hooks";

const Wrapper = styled.li`
  cursor: pointer;
  position: relative;
  transition: all 0.15s linear;
  min-height: 64px;
  max-height: 64px;
  .channel-title-preview {
    padding-right: ${props => props.paddingAdjustment}px;
  }
  .more-options {
    position: relative;
    display: none;
    opacity: 0;
    z-index: -1;
    background: transparent;
    border: 1px solid transparent;
    svg {    
      transition: transform 0.5s;
    }
    &.more-options-active {
      svg {        
        transform: rotate(990deg);        
      }
    }
  }
  &:hover {  
    .channel-title-preview {
      padding-right: ${props => parseInt(props.paddingAdjustment) + 22}px;
    }
    .more-options {
      display: inline-flex;
      opacity: 1;
      z-index: 1;
      &.active {
        color: #4d4d4d !important;
      }
    }
    h6 {
      color: #7a1b8b;
    }
  }
  h6 {
    ${(props) => props.selected && "color: #7A1B8B"};
  }
  &:after {
    ${(props) => props.selected && "content: ''"};
    width: 3px;
    height: 100%;
    background: #7a1b8b;
    display: block;
    position: absolute;
    top: 0;
    animation: fadeIn 0.15s linear;
    left: -24px;
    @media (max-width: 991.99px) {
      left: -15px;
    }
  }

  .chat-timestamp {
    position: absolute;
    right: 0;
    display: flex;
    flex-direction: column;
    white-space: nowrap;
    transition: opacity 0.3s ease;
    top: 0;
    justify-content: center;
    height: 100%;
    svg {
      margin-left: 4px;
      &.feather-star {
        fill: #ffc107;
        color: #ffc107;
      }
      &.feather-chevron-down {
        margin-left: 0;
      }
    }    
  }
  .feather-more-horizontal {
    width: 25px;
    height: 25px;
    position: relative;
    right: 0;
    padding: 3px;
    top: 1px;
  }
`;

const ChannelTitlePreview = styled.div``;

const Timestamp = styled.div`
  position: relative;
`;

const ChannelList = (props) => {

  const {className = "", search = "", channel, selectedChannel, channelDrafts, dictionary} = props;

  const channelActions = useChannelActions();
  const { channelPreviewDate } = useTimeFormat();
  const { virtualization } = useSelector((state) => state.settings.user.CHAT_SETTINGS);

  const handleSelectChannel = () => {
    document.body.classList.add("m-chat-channel-closed");

    if (selectedChannel !== null) {
      let scrollComponent = document.getElementById("component-chat-thread");
      if (virtualization) {
        scrollComponent = document.querySelector(".chat-scroll-container");
        if (scrollComponent) {
          channelActions.saveHistoricalPosition(selectedChannel.id, scrollComponent);
        }
      } else {
        if (scrollComponent) {
          channelActions.saveHistoricalPosition(selectedChannel.id, scrollComponent);
        }
      }
    }

    channelActions.select({ ...channel, selected: true });
    // history.push(`/chat/${channel.code}`);
  };

  let timeAdjustment = channel.last_reply ? channelPreviewDate(channel.last_reply.created_at.timestamp).length * 8 : 0;
  let iconAdjustment = (channel.is_pinned ? 18 : 0) + (channel.is_muted ? 18 : 0) + ((channel.add_user === false && (!channel.is_read || channel.total_unread > 0)) ? 18 : 0) + 18;
  const paddingAdjustment = timeAdjustment > iconAdjustment ? timeAdjustment : iconAdjustment;

  return (
    <Wrapper paddingAdjustment={paddingAdjustment}
             className={`list-group-item d-flex align-items-center link-1 pl-1 pr-1 pl-lg-0 pr-lg-0 pb-2 pt-2 ${className}`}
             selected={selectedChannel !== null && channel.id === selectedChannel.id} onClick={handleSelectChannel}>
      <ChannelIcon channel={channel}/>
      <ChannelTitlePreview className={"flex-grow-1 channel-title-preview"}>
        <ChannelTitle channel={channel} search={search}/>
        <ReplyPreview channel={channel} drafts={channelDrafts} dictionary={dictionary}/>
        {!!channel.is_archived && (
          <>
            <Badge badgeClassName="bg-warning-bright" label="Archived"/>
          </>
        )}
        {channel.is_hidden && (
          <>
            <Badge label="Hidden"/>
          </>
        )}
      </ChannelTitlePreview>
      <Timestamp className="text-right ml-auto">
        <ChatDateIcons className={"chat-date-icons"} selectedChannel={selectedChannel} channel={channel}/>
      </Timestamp>
    </Wrapper>
  );
};

export default ChannelList;
