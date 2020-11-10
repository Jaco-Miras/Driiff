import React from "react";
import styled from "styled-components";
import { SvgIconFeather } from "../../common";
import { useTimeFormat } from "../../hooks";
import ChannelOptions from "./ChannelOptions";

const Wrapper = styled.div`  
  display: flex;
  .chat-timestamp_text {
    margin: 1px 0 3px 0;
  }
`;
const ActionContainer = styled.div`
  position: relative;
  top: 2px;
  display: flex;
  flex-direction: row-reverse;
`;
const Icon = styled(SvgIconFeather)`
  position: relative;
  top: -3px;
  right: 0;
  width: 15px;
  height: 15px;
`;

const Badge = styled.span`
  color: #fff !important;
  min-height: 18px;
  width: 24px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 0;
  &.unread {
    color: #7a1b8b !important;
    display: none;
  }
`;

const ChannelTitleContainer = styled.h6`
  color: #363636;;
  ${(props) => props.channel.total_unread && "color: #7a1b8b"};
  flex-grow: 1;
`;

const ChatTitleDate = (props) => {
  const { channelPreviewDate } = useTimeFormat();

  const {className = "", search = "", channel} = props;

  const getHighlightedSearchTitle = (title) => {
    if (search === "") {
      return title;
    } else {
      const parts = title.split(new RegExp(`(${search})`, 'gi'));
      return <span>{parts.map(part => part.toLowerCase() === search.toLowerCase() ? <b>{part}</b> : part)}</span>;
    }
  }

  return (
    <Wrapper>
      <ChannelTitleContainer className={`mb-1 ${className}`} channel={channel}>
        {getHighlightedSearchTitle(channel.title)}
      </ChannelTitleContainer>
      <span className={"small text-muted chat-timestamp_text"}
            dangerouslySetInnerHTML={{ __html: channel.last_reply ? channelPreviewDate(channel.last_reply.created_at.timestamp) : "" }}/>
    </Wrapper>
  );
};

export default React.memo(ChatTitleDate);
