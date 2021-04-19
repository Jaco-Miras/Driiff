import React from "react";
import styled from "styled-components";
import ChannelIcon from "./ChannelIcon";

const Wrapper = styled.div`
  padding: 0 24px;
  ul {
    padding: 0;
    overflow-y: hidden;
    overflow-x: scroll;
    display: flex;
  }
`;

const FavoriteChannels = (props) => {
  const { channels } = props;
  return (
    <Wrapper>
      <ul>
        {channels.map((c) => {
          return <ChannelIcon channel={c} />;
        })}
      </ul>
    </Wrapper>
  );
};

export default FavoriteChannels;
