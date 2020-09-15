import React from "react";
import styled from "styled-components";
import { Avatar, SvgIconFeather } from "../../common";

const Wrapper = styled.div`
  > span {
    font-size: 11px;
    background-color: ${(props) => (props.iconColor ? props.iconColor : "#fff")};
    color: #fff;
    display: inline-flex;
    padding: 5px;
    border-radius: 100%;
    width: 30px;
    height: 30px;
    text-align: center;
    align-items: center;
    justify-content: center;
  }
  > svg {
    padding: 6px;
    background-color: #eeeeee;
    border-radius: 50%;
    &:dark {
      background-color: ${(props) => (props.iconColor ? props.iconColor : props.iconColor)};
    }
  }
`;

const StyledAvatar = styled(Avatar)`
  ${"" /* background-color: ${(props) => (props.iconColor ? props.iconColor : "#fff")}; */}
`;

const Icon = styled(SvgIconFeather)`
  color: #7a1b8b !important;
  height: 30px;
  width: 30px;
`;

const iconColor = (name) => {
  if (typeof name === "undefined") return "";
  let h = "";
  let s = 50;
  let l = 40;

  var hash = 0;
  for (var i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  h = hash % 360;
  return `hsl(${h}, ${s}%, ${l}%)`;
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
  return (
    <Wrapper className={`pr-3 ${className}`} type={channel.type} iconColor={iconColor(channel.title)}>
      {channel.profile && channel.members.length >= 1 && channel.type === "DIRECT" && (
        <StyledAvatar
          type={channel.type}
          imageLink={channel.profile.profile_image_link}
          userId={channel.profile.id}
          id={channel.profile.id}
          name={channel.profile.name}
          partialName={channel.profile.partial_name}
          type={"USER"}
          noDefaultClick={false}
        />
      )}
      {channel.type === "GROUP" && <Icon icon="users" />}
      {channel.type === "COMPANY" && <Icon icon="users" />}
      {channel.type === "POST" && <Icon icon="users" />}
      {channel.type === "PERSONAL_BOT" && <Icon icon="user" />}
      {(channel.members.length > 2 && channel.type === "DIRECT") || (channel.type === "TOPIC" && <span>{handleInitials(channel.title).substring(0, 3)}</span>)}
    </Wrapper>
  );
};

export default ChannelIcon;
