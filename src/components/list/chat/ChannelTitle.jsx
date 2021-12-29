import React from "react";
import styled from "styled-components";

const ChannelTitleContainer = styled.h6`
  color: #363636;
  ${(props) => props.channel.total_unread && `color: ${props.theme.colors.primary}`};
`;

const ChannelTitle = (props) => {
  const { className = "", search = "", channel } = props;

  const getHighlightedSearchTitle = (title) => {
    if (search === "") {
      return title;
    } else {
      const parts = title.split(new RegExp(`(${search})`, "gi"));
      return <span>{parts.map((part) => (part.toLowerCase() === search.toLowerCase() ? <b>{part}</b> : part))}</span>;
    }
  };

  return (
    <ChannelTitleContainer className={`mb-1 ${className}`} channel={channel}>
      {getHighlightedSearchTitle(channel.title)}
    </ChannelTitleContainer>
  );
};

export default React.memo(ChannelTitle);
