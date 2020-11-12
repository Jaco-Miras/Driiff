import React from "react";
import styled from "styled-components";
import { useTimeFormat } from "../../hooks";

const Wrapper = styled.div`  
  max-width: 100%;
  .chat-timestamp_text {
    margin: 1px 0 3px 0;
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
    <Wrapper className="d-flex justify-content-between align-items-center">
      <ChannelTitleContainer className={`mb-1 ${className}`} channel={channel}>
        {getHighlightedSearchTitle(channel.title)}
      </ChannelTitleContainer>
      <span className={"small text-muted chat-timestamp_text"}
            dangerouslySetInnerHTML={{ __html: channel.last_reply ? channelPreviewDate(channel.last_reply.created_at.timestamp) : "" }}/>
    </Wrapper>
  );
};

export default React.memo(ChatTitleDate);
