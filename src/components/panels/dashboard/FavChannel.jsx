import React from "react";
import styled from "styled-components";
import ChannelIcon from "../../list/chat/ChannelIcon";
import ChatTitleDate from "../../list/chat/ChatTitleDate";
import ChatIconReplyPreview from "../../list/chat/ChatIconReplyPreview";
import { Badge } from "../../common";

const Wrapper = styled.li`
  display: flex;
  flex-flow: row;
  cursor: pointer;
  position: relative;
  transition: all 0.15s linear;
  min-height: 64px;
  max-height: 64px;
  ${(props) =>
    props.selected &&
    `
    background: #F0F0F050;
    padding: 0 25px !important;
    margin: 0 -25px;
  `}

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

  h6 {
    ${(props) => props.selected && `color: ${props.theme.colors.primary};`}
  }
  &:after {
    ${(props) => props.selected && "content: '';"};
    width: 3px;
    height: 100%;
    background: ${(props) => props.theme.colors.primary};
    display: block;
    position: absolute;
    top: 0;
    animation: fadeIn 0.15s linear;
    left: 1px;
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
  .avatar .profile-slider {
    display: flex;
    min-width: 300px;
    max-width: 370px;
    flex-flow: column;
    .information-wrapper {
      margin: 0;
    }
    .info-details {
      margin-left: 2rem;
      overflow: auto;
    }
  }
  &:focus {
    background: #f1f2f7;
  }
  .dark & {
    :focus {
      background: #25282c;
    }
  }
`;

const FavChannel = (props) => {
  const { className = "", channel, selectedChannel, channelDrafts, dictionary, onSelectChannel } = props;

  const handleSelectChannel = () => {
    onSelectChannel(channel);
  };

  return (
    <Wrapper className={`d-flex align-items-center link-1 pl-1 pr-1 pl-lg-0 pr-lg-0 pb-2 pt-2 ${className}`} selected={selectedChannel !== null && channel.id === selectedChannel.id} onClick={handleSelectChannel}>
      <ChannelIcon channel={channel} onSelectChannel={handleSelectChannel} />
      <div className="channel-info">
        <div className="channel-title-preview">
          <ChatTitleDate className={"chat-date-icons"} selectedChannel={selectedChannel} channel={channel} dictionary={dictionary} />
        </div>
        <ChatIconReplyPreview channel={channel} drafts={channelDrafts} dictionary={dictionary} selectedChannel={selectedChannel} />
        <div className="d-flex">
          {channel.is_hidden && (
            <>
              <Badge label="Hidden" />
            </>
          )}
        </div>
      </div>
    </Wrapper>
  );
};

export default React.memo(FavChannel);
