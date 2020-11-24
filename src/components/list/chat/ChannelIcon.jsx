import React from "react";
import styled from "styled-components";
import { Avatar, SvgIconFeather } from "../../common";

const Wrapper = styled.div`
  line-height: 0;
  > span {
    font-size: 13px;
    background-color: ${(props) => (props.iconColor ? props.iconColor : "#fff")};
    color: #fff;
    display: inline-flex;
    padding: 5px;
    border-radius: 100%;
    width: 2.7rem;
    height: 2.7rem;
    text-align: center;
    align-items: center;
    justify-content: center;
  }
  > svg {
    padding: 6px;
    background-color: ${(props) => (props.iconColor ? props.iconColor : props.iconColor)};
    border-radius: 50%;
    &.dark {
      background-color: ${(props) => (props.iconColor ? props.iconColor : props.iconColor)};
    }
  }
  .chat-header-icon-left & {
    span {
      width: 28px;
      height: 28px;
    }
  }
`;

const StyledAvatar = styled(Avatar)``;

const Icon = styled(SvgIconFeather)`
  color: #ffffff !important;
  height: 2.7rem;
  width: 2.7rem;
  &.feather-home {
    background: #7a1b8b;
    padding: 6px 0;
  }
  .chat-header-icon-left & {
    height: 28px;
    width: 28px;
  }
`;

const iconColor = (input) => {
  const name = input.replace(/\s/g, "");
  if (typeof name === "undefined") return "";
  let h = "";
  let s = 50;
  let l = 40;

  var hash = 0;
  for (var i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  h = hash % 360;

  return `hsla(${h}, ${s}%, ${l}%, 0.8)`;
};

const handleInitials = (title) => {
  var result = "";
  var tokens = title.split(" ");
  for (var i = 0; i < tokens.length; i++) {
    result += tokens[i].substring(0, 1).toUpperCase();
  }
  return result;
};

const ChannelIcon = (props) => {
  const { className = "", channel } = props;
  const channelTitle = channel.title ? channel.title.toLowerCase() : "";
  return (
    <Wrapper className={`pr-3 ${className}`} type={channel.type} iconColor={iconColor(channelTitle)}>
      {channel.profile && channel.members.length >= 1 && channel.type === "DIRECT" && (
        <StyledAvatar
          type={channel.type}
          imageLink={channel.profile.profile_image_thumbnail_link ? channel.profile.profile_image_thumbnail_link : channel.profile.profile_image_link}
          userId={channel.profile.id}
          id={channel.profile.id}
          name={channel.profile.name}
          partialName={channel.profile.partial_name}
          type="USER"
          //noDefaultClick={false}
        />
      )}
      {channel.type === "GROUP" && <Icon icon="users" alt={channel.title} />}
      {channel.type === "COMPANY" && <Icon icon="home" alt={channel.title} />}
      {channel.type === "POST" && <Icon icon="users" alt={channel.title} />}
      {channel.type === "PERSONAL_BOT" && <Icon icon="user" alt={channel.title} />}
      {(channel.members && channel.members.length > 2 && channel.type === "DIRECT") || (channel.type === "TOPIC" && <span>{handleInitials(channel.title).substring(0, 3)}</span>)}
    </Wrapper>
  );
};

export default ChannelIcon;
