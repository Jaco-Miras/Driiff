import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import Skeleton from "react-skeleton-loader";
import Tooltip from "react-tooltip-lite";
import styled from "styled-components";
import botIcon from "../../assets/img/gripp-bot.png";
import driffIcon from "../../assets/img/driff_logo.svg";
import { replaceChar } from "../../helpers/stringFormatter";
import ProfileSlider from "./ProfileSlider";

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
`;

const Image = styled.img`
  display: ${(props) => (props.show ? "inherit" : "none")};
`;

const Initials = styled.span`
  color: #fff !important;
  background: ${(props) => (props.avatarColor ? props.avatarColor : "white")};
  font-size: 11px;
  line-height: 0;
  display: flex;
  margin: auto;
  text-align: center;
  width: 100%;
  height: 100%;
  object-fit: cover;
  align-items: center;
  justify-content: center;
`;

const Avatar = (props) => {
  let {
    className = "",
    imageLink,
    id,
    name = "",
    children,
    partialName = null,
    type = "USER",
    userId,
    onClick = null,
    noDefaultClick = false,
    hasAccepted = null,
    isBot = false,
    isHuddleBot = false,
    forceThumbnail = true,
    fromSlider = false,
    showSlider = false,
    ...rest
  } = props;

  const history = useHistory();
  const onlineUsers = useSelector((state) => state.users.onlineUsers);
  const isOnline = onlineUsers.some((ou) => ou.user_id === userId);

  const [isLoaded, setIsLoaded] = useState(false);
  const [showInitials, setShowInitials] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const toggleTooltip = () => {
    if (fromSlider) return;
    let tooltips = document.querySelectorAll("span.react-tooltip-lite");
    tooltips.forEach((tooltip) => {
      tooltip.parentElement.classList.toggle("tooltip-active");
    });
  };

  const avatarColor = (name) => {
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

    if (noDefaultClick) return;

    if (showSlider) {
      setShowPopup((prevState) => !prevState);
    } else {
      if (type === "USER") {
        history.push(`/profile/${id}/${replaceChar(name)}`);
      } else if (type === "TOPIC") {
        history.push(`/topic/${id}/${replaceChar(name)}`);
      }
    }
  };

  const handleShowPopup = () => {
    setShowPopup((prevState) => !prevState);
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

  if (forceThumbnail && imageLink && !imageLink.includes("thumbnail")) {
    imageLink += "&need_thumbnail=1";
  }

  return (
    <Wrapper {...rest} className={`avatar avatar-md ${isOnline ? "avatar-state-success" : ""} ${isLoaded ? "ico-avatar-loaded" : ""} ${className}`} onClick={handleOnClick}>
      {isLoaded === false && <Skeleton borderRadius="50%" widthRandomness={0} heightRandomness={0} />}
      <Tooltip arrowSize={5} distance={10} onToggle={toggleTooltip} content={rest.title ? rest.title : name}>
        {isBot ? (
          <Image show={isLoaded} className="rounded-circle" onLoad={handleImageLoad} onError={handleImageError} src={isHuddleBot ? driffIcon : botIcon} alt={name} />
        ) : imageLink == null ? (
          <Initials className="rounded-circle" avatarColor={avatarColor(name)}>
            {handleInitials(name)}
          </Initials>
        ) : name === "Gripp Offerte Bot" ? (
          <Image show={isLoaded} className="rounded-circle" onLoad={handleImageLoad} onError={handleImageError} src={botIcon} alt={name} />
        ) : showInitials === false ? (
          <Image show={isLoaded} className="rounded-circle" onLoad={handleImageLoad} onError={handleImageError} src={imageLink} alt={name} />
        ) : (
          <Initials className="rounded-circle" avatarColor={avatarColor(name)}>
            {handleInitials(name)}
          </Initials>
        )}
      </Tooltip>
      {showSlider && !fromSlider && !isBot && showPopup && <ProfileSlider {...props} onShowPopup={handleShowPopup} />}

      {children}
    </Wrapper>
  );
};

export default React.memo(Avatar);
