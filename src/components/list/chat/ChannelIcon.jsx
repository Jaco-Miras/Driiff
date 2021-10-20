import React from "react";
import styled from "styled-components";
import { Avatar, SvgIconFeather } from "../../common";
import { useSelector } from "react-redux";

//import companyChatIcon from "../../../assets/icon/company_chat.svg";

const Wrapper = styled.div`
  position: relative;
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
    &.feather-eye,
    &.feather-eye-off {
      padding: 0;
      background-color: #fff;
      border: 2px solid #fff;
      color: #7a1b8b;
      .dark & {
        background-color: #191c20;
        color: #fff;
        border: 2px solid #191c20;
      }
    }
  }
  .chat-header-icon-left & {
    span {
      width: 28px;
      height: 28px;
    }
  }
`;

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

const EyeIcon = styled(SvgIconFeather)`
  position: absolute;
  top: -2px;
  right: 15px;
  background-color: unset;
  width: 1rem;
  height: 1rem;
  padding: 0;
  z-index: 1;
`;

// const CompanyIcon = styled.div`
//   height: 2.7rem;
//   width: 2.7rem;
//   background: #eff1f6;
//   border-radius: 50%;
//   img {
//     height: 100%;
//     width: 100%;
//   }
// `;
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

// const handleInitials = (title) => {
//   var result = "";
//   var tokens = title.split(" ");
//   for (var i = 0; i < tokens.length; i++) {
//     result += tokens[i].substring(0, 1).toUpperCase();
//   }
//   return result;
// };

const ChannelIcon = (props) => {
  const { className = "", channel, children = null, onSelectChannel = null, showSlider = true } = props;
  const workspaces = useSelector((state) => state.workspaces.workspaces);
  const channelTitle = channel && channel.title ? channel.title.toLowerCase() : "";
  return (
    <Wrapper className={`pr-3 ${className}`} iconColor={iconColor(channelTitle)} onClick={onSelectChannel}>
      {channel && channel.profile && channel.members.length >= 1 && channel.type === "DIRECT" && (
        <Avatar
          imageLink={channel.profile.profile_image_thumbnail_link ? channel.profile.profile_image_thumbnail_link : channel.profile.profile_image_link}
          userId={channel.profile.id}
          id={channel.profile.id}
          name={channel.profile.name}
          partialName={channel.profile.partial_name}
          type="USER"
          showSlider={showSlider}
          onClick={onSelectChannel}
        />
      )}
      {channel && (channel.type === "DIRECT_TEAM" || channel.type === "TEAM") && <Avatar imageLink={channel.icon_link} name={channel.title} type="TEAM" showSlider={false} onClick={onSelectChannel} />}
      {channel &&
        channel.type === "GROUP" &&
        (channel.icon_link ? (
          <Avatar forceThumbnail={false} type={channel.type} imageLink={channel.icon_link} id={`ws_${channel.id}`} name={channel.title} noDefaultClick={false} showSlider={showSlider} onClick={onSelectChannel} />
        ) : (
          <Icon icon="users" alt={channel.title} />
        ))}
      {/* {channel.type === "COMPANY" && (
        <CompanyIcon className="avatar avatar-md">
          <img src={companyChatIcon} alt={channel.title} />
        </CompanyIcon>
      )} */}
      {channel && channel.type === "COMPANY" && <Icon icon="home" alt={channel.title} />}
      {channel && channel.type === "POST" && <Icon icon="users" alt={channel.title} />}
      {channel && channel.type === "PERSONAL_BOT" && <Icon icon="user" alt={channel.title} />}
      {channel && channel.type === "TOPIC" && (
        <Avatar forceThumbnail={false} type={channel.type} imageLink={channel.icon_link} id={`ws_${channel.id}`} name={channel.title} noDefaultClick={false} showSlider={showSlider} onClick={onSelectChannel} />
      )}
      {channel && channel.team && channel.type === "TOPIC" && workspaces.hasOwnProperty(channel.entity_id) && workspaces[channel.entity_id].is_shared && <EyeIcon icon="eye-off" />}
      {channel && !channel.team && channel.type === "TOPIC" && workspaces.hasOwnProperty(channel.entity_id) && workspaces[channel.entity_id].is_shared && <EyeIcon icon="eye" />}
      {children}
    </Wrapper>
  );
};

export default ChannelIcon;
