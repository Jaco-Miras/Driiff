import React, { useRef } from "react";
//import {useHistory} from "react-router-dom";
import styled from "styled-components";
import useChannelActions from "../../hooks/useChannelActions";
import ChannelIcon from "./ChannelIcon";
import ChannelOptions from "./ChannelOptions";
import ChannelTitle from "./ChannelTitle";
import ChatDateIcons from "./ChatDateIcons";
import ReplyPreview from "./ReplyPreview";
import { Badge } from "../../common";
import { useSelector } from "react-redux";

const Wrapper = styled.li`
  cursor: pointer;
  position: relative;
  transition: all 0.15s linear;
  min-height: 64px;
  max-height: 64px;
  .more-options {
    position: relative;
    opacity: 0;
    z-index: -1;
  }
  &:focus,
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

const ChannelTitlePreview = styled.div`
  padding-right: 48px;
`;

const Timestamp = styled.div`
  position: relative;
`;

const ChannelList = (props) => {

  const { className = "", search = "", channel, selectedChannel, channelDrafts, dictionary } = props;

  const channelActions = useChannelActions();

  const { virtualization } = useSelector((state) => state.settings.user.CHAT_SETTINGS);

  const refs = {
    container: useRef(null)
  };

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

  let timerStart = 0;
  let xDown = null;
  let yDown = null;
  const handleTouchStartChannel = (e) => {
    timerStart = e.timeStamp;
    xDown = e.touches[0].clientX;
    yDown = e.touches[0].clientY;
  };

  const handleTouchEndChannel = (e) => {
    if ((e.timeStamp - timerStart) <= 125) {
      if (!(e.target && e.target.classList.contains("feather"))) {
        handleSelectChannel();
        setTimeout(() => {
          document.activeElement.blur();
        }, 300);
      }
    }
  };

  const handleTouchMoveChannel = (e) => {
    let xUp = e.touches[0].clientX;
    let yUp = e.touches[0].clientY;

    let xDiff = xDown - xUp;
    let yDiff = yDown - yUp;

    if (Math.abs(xDiff) > Math.abs(yDiff)) {/*most significant*/
      /* left swipe */
      if (xDiff > 0) {
        refs.container.current.focus();
      }
    }

    xDown = null;
    yDown = null;
  };

  return (
    <Wrapper ref={refs.container}
             className={`list-group-item d-flex align-items-center link-1 pl-1 pr-1 pl-lg-0 pr-lg-0 pb-2 pt-2 ${className}`}
             selected={selectedChannel !== null && channel.id === selectedChannel.id}
             onClick={handleSelectChannel} onTouchStart={handleTouchStartChannel} onTouchEnd={handleTouchEndChannel}
             onTouchMove={handleTouchMoveChannel}>
      <ChannelIcon channel={channel}/>
      <ChannelTitlePreview className={"flex-grow-1"}>
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
        <ChatDateIcons className={"chat-date-icons"} channel={channel} isRead={channel.is_read} />
        <ChannelOptions selectedChannel={selectedChannel} channel={channel} />
      </Timestamp>
    </Wrapper>
  );
};

export default ChannelList;
