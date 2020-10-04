import React from "react";
import styled from "styled-components";
import { SvgIconFeather } from "../../common";
import { useTimeFormat } from "../../hooks";

const Wrapper = styled.div`
  ${"" /* display: ${(props) => (props.optionsVisible ? "none" : "initial")}; */}
  display: initial;
  .chat-timestamp_text {
    margin: 1px 0 3px 0;
  }
`;
const ActionContainer = styled.div`
  position: relative;
  top: 4px;
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

const ChatDateIcons = (props) => {
  const { channel } = props;
  const { channelPreviewDate } = useTimeFormat();

  return (
    <Wrapper className="chat-timestamp">
      <span className={"small text-muted chat-timestamp_text"}
            dangerouslySetInnerHTML={{ __html: channel.last_reply ? channelPreviewDate(channel.last_reply.created_at.timestamp) : "" }}/>
      {(!channel.is_read || channel.total_unread > 0) && (
        <Badge
          className={`badge badge-primary badge-pill ml-auto ${!channel.is_read && channel.total_unread === 0 ? "unread" : ""}`}>{channel.total_unread > 0 ? channel.total_unread : !channel.is_read ? "0" : null}</Badge>
      )}
      <ActionContainer>
        {channel.is_pinned && <Icon icon="star"/>}
        {channel.is_muted && <Icon icon="volume-x" className={`${channel.is_pinned && "mr-1"}`}/>}
      </ActionContainer>
    </Wrapper>
  );
};

export default React.memo(ChatDateIcons);
