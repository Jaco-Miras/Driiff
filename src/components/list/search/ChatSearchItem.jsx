import React from "react";
import styled from "styled-components";
import { Avatar } from "../../common";

const Wrapper = styled.li`
  display: flex;
  width: 100%;
  p {
    margin: 0;
  }
`;

const ChatSearchItem = (props) => {
  const { data, redirect } = props;
  const { channel, message } = data;

  const handleRedirect = () => {
    redirect.toChat(channel, message);
  };

  return (
    <Wrapper className="list-group-item p-l-0 p-r-0">
      <div>
        <Avatar id={message.user.id} name={message.user.name} imageLink={message.user.profile_image_link} showSlider={true} />
      </div>
      <div className="ml-2" onClick={handleRedirect}>
        <p>
          {message.user.name} - {channel.title}
        </p>
        <p className="text-muted" dangerouslySetInnerHTML={{ __html: message.body }} />
      </div>
    </Wrapper>
  );
};

export default ChatSearchItem;
