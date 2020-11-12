import React, { useRef } from "react";
import styled from "styled-components";
import useChannelActions from "../../hooks/useChannelActions";
import ChannelIcon from "./ChannelIcon";
// import ChannelTitle from "./ChannelTitle";
import ChatTitleDate from "./ChatTitleDate";
import ChatIconReplyPreview from "./ChatIconReplyPreview";
import { Badge } from "../../common";
import { useSelector } from "react-redux";
import { useTimeFormat } from "../../hooks";
// import ChatIcon from "./ChatIcon";

const Wrapper = styled.li`
  display: flex;
  flex-flow: row;
  cursor: pointer;
  position: relative;
  transition: all 0.15s linear;
  min-height: 64px;
  max-height: 64px;
  // .channel-title-preview {
  //   padding-right: ${props => props.paddingAdjustment}px;
  // }
  .channel-info {
    width: 100%;
    max-width: calc(100% - 55px);
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
  &:focus,
  &:hover {
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
    transition: opacity 0.3s ease;
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

  const { className = "", search = "", channel, selectedChannel, channelDrafts, dictionary, show = false } = props;

  const channelActions = useChannelActions();
  const { channelPreviewDate } = useTimeFormat();
  const { virtualization } = useSelector((state) => state.settings.user.CHAT_SETTINGS);

  const refs = {
    container: useRef(null)
  };

  const handleSelectChannel = () => {
    document.body.classList.add("m-chat-channel-closed");

    if (selectedChannel !== null && !virtualization) {
      let scrollComponent = document.getElementById("component-chat-thread");
      if (scrollComponent) {
        console.log('set historical');
        channelActions.saveHistoricalPosition(selectedChannel.id, scrollComponent);
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
      } else {
        timerStart += 125;
      }
    } else {
      timerStart -= 125;
    }

    xDown = null;
    yDown = null;
  };

  let timeAdjustment = channel.last_reply ? channelPreviewDate(channel.last_reply.created_at.timestamp).length * 8 : 0;
  let iconAdjustment = (channel.is_pinned ? 18 : 0) + (channel.is_muted ? 18 : 0) + ((channel.add_user === false && (!channel.is_read || channel.total_unread > 0)) ? 18 : 0) + 18;
  const paddingAdjustment = timeAdjustment > iconAdjustment ? timeAdjustment : iconAdjustment;

  return (
    <Wrapper ref={refs.container} paddingAdjustment={paddingAdjustment}
             className={`list-group-item d-flex align-items-center link-1 pl-1 pr-1 pl-lg-0 pr-lg-0 pb-2 pt-2 ${className}`}
             selected={selectedChannel !== null && channel.id === selectedChannel.id}
             onClick={handleSelectChannel} onTouchStart={handleTouchStartChannel} onTouchEnd={handleTouchEndChannel}
             onTouchMove={handleTouchMoveChannel}>
      {
        show && <>
          <ChannelIcon channel={channel}/>
          <div className="channel-info">
            <ChannelTitlePreview className="channel-title-preview">
              {/* <ChannelTitle channel={channel} search={search}/> */}
              {/* <Timestamp className="text-right ml-auto"> */}
              <ChatTitleDate className={"chat-date-icons"} selectedChannel={selectedChannel} channel={channel}/>
              {/* </Timestamp> */}
            </ChannelTitlePreview>
            <ChatIconReplyPreview channel={channel} drafts={channelDrafts} dictionary={dictionary}/>
            <div className="d-flex">
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
              {/* <ChatIcon className={"chat-date-icons"} selectedChannel={selectedChannel} channel={channel}/> */}
            </div>
          </div>
        </>
      }
    </Wrapper>
  );
};

export default ChannelList;
