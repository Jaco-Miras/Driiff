import React from "react";
import styled from "styled-components";
import { SvgIconFeather } from "../../common";
import ChannelOptions from "./ChannelOptions";

const Wrapper = styled.div`
  display: initial;
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
    color: ${(props) => props.theme.colors.primary} !important;
    display: none;
  }
`;

const ChatDateIcons = (props) => {
  const { selectedChannel, channel } = props;

  return (
    <Wrapper className="chat-timestamp">
      <div className="d-flex align-items-center flex-row-reverse">
        <ChannelOptions className="ml-1" moreButton="chevron-down" selectedChannel={selectedChannel} channel={channel} />
        {channel.add_user === false && (!channel.is_read || channel.total_unread > 0) && (
          <Badge className={`badge badge-primary badge-pill ml-1 ${!channel.is_read && channel.total_unread === 0 ? "unread" : ""}`}>{channel.total_unread > 0 ? channel.total_unread : !channel.is_read ? "0" : null}</Badge>
        )}
        <ActionContainer>
          {channel.is_pinned && <Icon icon="star" />}
          {channel.is_muted && <Icon icon="volume-x" className={`${channel.is_pinned && "mr-1"}`} />}
        </ActionContainer>
      </div>
    </Wrapper>
  );
};

export default React.memo(ChatDateIcons);
