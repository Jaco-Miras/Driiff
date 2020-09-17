import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import Skeleton from "react-skeleton-loader";
import Tooltip from "react-tooltip-lite";
import styled from "styled-components";
import botIcon from "../../assets/img/gripp-bot.png";
import { replaceChar } from "../../helpers/stringFormatter";
import { SvgIconFeather } from "./SvgIcon";

const Wrapper = styled.div`
  position: relative;
  cursor: pointer;
  line-height: 0;
  .react-skeleton-load {
    display: flex;
    margin: auto;
    text-align: center;
    width: 100% !important;
    height: 100% !important;
    object-fit: cover;
    align-items: center;
    justify-content: center;
    position: absolute;
  }
  .pixel-avatar {
    padding-top: 5px;
  }
`;

const Image = styled.img`
  display: ${(props) => (props.show ? "inherit" : "none")};
  ${(props) => props.avatarColor && `background-color: ${props.avatarColor};`};
`;

const Avatar = (props) => {
  const { className = "", imageLink, id, name = "", children, partialName = null, type = "USER", userId, onClick = null, noDefaultClick = false, hasAccepted = null, isBot = false, ...rest } = props;

  const history = useHistory();
  const onlineUsers = useSelector((state) => state.users.onlineUsers);
  const isOnline = onlineUsers.some((ou) => ou.user_id === userId);

  const [isLoaded, setIsLoaded] = useState(false);
  const [showInitials, setShowInitials] = useState(false);

  const toggleTooltip = () => {
    let tooltips = document.querySelectorAll("span.react-tooltip-lite");
    tooltips.forEach((tooltip) => {
      tooltip.parentElement.classList.toggle("tooltip-active");
    });
  };

  const avatarColor = (input) => {
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

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  useEffect(() => {
    if (imageLink == null && name) {
      setIsLoaded(true);
    }
  }, []);

  const handleOnClick = (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (onClick) onClick(e);

    if (props.noDefaultClick) return;

    if (type === "USER") {
      history.push(`/profile/${id}/${replaceChar(name)}`);
    } else if (type === "TOPIC") {
      history.push(`/topic/${id}/${replaceChar(name)}`);
    }
  };

  const handleImageError = () => {
    setIsLoaded(true);
    setShowInitials(true);
  };

  const handleInitials = (title) => {
    if (typeof title === "undefined") return "";

    var result = "";
    var tokens = title.split(" ");
    for (var i = 0; i < tokens.length; i++) {
      result += tokens[i].substring(0, 1).toUpperCase();
    }
    return result.substring(0, 2);
  };

  const setAvatarsPlaceholder = (name) => {
    return `https://avatars.dicebear.com/api/human/${name.replace(/\s/g, "")}.svg?mood[]=happy&mood[]=surprised`;
  };

  return (
    <Wrapper {...rest} className={`avatar avatar-sm ${isOnline ? "avatar-state-success" : ""} ${isLoaded ? "ico-avatar-loaded" : ""} ${className}`} onClick={handleOnClick}>
      {isLoaded === false && <Skeleton borderRadius="50%" widthRandomness={0} heightRandomness={0} />}
      <Tooltip arrowSize={5} distance={10} onToggle={toggleTooltip} content={name}>
        {isBot ? (
          <Image show={isLoaded} className="rounded-circle" onLoad={handleImageLoad} onError={handleImageError} src={botIcon} alt={name} />
        ) : imageLink == null ? (
          <Image show={true} className="rounded-circle pixel-avatar" onLoad={handleImageLoad} onError={handleImageError} src={setAvatarsPlaceholder(name)} avatarColor={avatarColor(name)} alt={name} />
        ) : hasAccepted === false ? (
          <Image show={true} className="rounded-circle pixel-avatar" onLoad={handleImageLoad} onError={handleImageError} src={setAvatarsPlaceholder(name)} avatarColor={avatarColor(name)} alt={name} />
        ) : type === "GROUP" ? (
          <SvgIconFeather icon="users" />
        ) : name === "Gripp Offerte Bot" ? (
          <Image show={isLoaded} className="rounded-circle" onLoad={handleImageLoad} onError={handleImageError} src={botIcon} alt={name} />
        ) : showInitials === false ? (
          <Image show={isLoaded} className="rounded-circle" onLoad={handleImageLoad} onError={handleImageError} src={imageLink} alt={name} />
        ) : (
          <Image show={true} className="rounded-circle pixel-avatar" onLoad={handleImageLoad} onError={handleImageError} src={setAvatarsPlaceholder(name)} avatarColor={avatarColor(name)} alt={name} />
        )}
      </Tooltip>
      {children}
    </Wrapper>
  );
};

export default React.memo(Avatar);
