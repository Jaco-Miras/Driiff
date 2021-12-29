import React from "react";
import styled from "styled-components";
import { Avatar, SvgIconFeather } from "../../common";

const Wrapper = styled.div`
  > span {
    font-size: 11px;
    background-color: #cccccc;
    color: #fff;
    display: inline-block;
    padding: 5px;
    border-radius: 100%;
    width: 30px;
    height: 30px;
    text-align: center;
  }
  > svg {
    padding: 6px;
    background-color: #eeeeee;
    border-radius: 50%;
  }
`;

const StyledAvatar = styled(Avatar)``;
const Icon = styled(SvgIconFeather)`
  color: ${(props) => props.theme.colors.primary} !important;
  height: 30px;
  width: 30px;
`;
const handleInitials = (title) => {
  var result = "";
  var tokens = title.split(" ");
  for (var i = 0; i < tokens.length; i++) {
    result += tokens[i].substring(0, 1).toUpperCase();
  }
  return result;
};

const WorkspaceChannelIcon = (props) => {
  const { className = "", channel } = props;

  return (
    <Wrapper className={`pr-3 ${className}`} type={channel.type}>
      {channel.profile && channel.members.length >= 1 && channel.type === "DIRECT" && (
        <StyledAvatar imageLink={channel.profile.profile_image_link} userId={channel.profile.id} id={channel.profile.id} name={channel.profile.name} partialName={channel.profile.partial_name} type={"USER"} noDefaultClick={false} />
      )}
      {channel.type === "GROUP" && <Icon icon="users" />}
      {channel.type === "COMPANY" && <Icon icon="users" />}
      {channel.type === "POST" && <Icon icon="users" />}
      {channel.type === "PERSONAL_BOT" && <Icon icon="user" />}
      {channel.members.length > 2 && channel.type === "DIRECT" && <span>{handleInitials(channel.title).substring(0, 3)}</span>}
    </Wrapper>
  );
};

export default React.memo(WorkspaceChannelIcon);
