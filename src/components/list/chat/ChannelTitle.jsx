import React from "react";
import styled from "styled-components";

const ChannelTitleContainer = styled.h6`
  color: #363636;;
  ${(props) => props.channel.total_unread && "color: #7a1b8b"};
`;

const ChannelTitle = (props) => {
  const { channel, className = "" } = props;

  return (
    <ChannelTitleContainer className={`mb-1 ${className}`} channel={channel}>
      {channel.title}
    </ChannelTitleContainer>
  );
};

export default React.memo(ChannelTitle);
