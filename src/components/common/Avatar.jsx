import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import Skeleton from "react-skeleton-loader";
import Tooltip from "react-tooltip-lite";
import styled from "styled-components";
import botIcon from "../../assets/img/gripp-bot.png";
import driffIcon from "../../assets/img/driff_logo.svg";
import { replaceChar } from "../../helpers/stringFormatter";
import ProfileSlider from "./ProfileSlider";
import { CSSTransition } from "react-transition-group";
import { setProfileSlider } from "../../redux/actions/globalActions";
import { SvgIconFeather } from ".";

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
  /* slide enter */
  .slide-enter,
  .slide-appear {
    opacity: 0;
    transform: scale(0.97) translateY(50px);
    z-index: 1;
  }
  .slide-enter.slide-enter-active,
  .slide-appear.slide-appear-active {
    opacity: 1;
    transform: scale(1) translateY(0);
    transition: opacity 300ms linear 100ms, transform 300ms ease-in-out 100ms;
  }
  // .slide-enter.slide-enter-done {
  //   opacity: 1;
  //   transform: scale(1) translateY(0);
  //   transition: opacity 300ms linear 100ms, transform 300ms ease-in-out 100ms;
  // }

  /* slide exit */
  .slide-exit {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
  .slide-exit.slide-exit-active {
    opacity: 0;
    transform: scale(0.97) translateY(50px);
    transition: opacity 150ms linear, transform 150ms ease-out;
  }
  .slide-exit-done {
    opacity: 0;
  }

  .fade-appear {
    opacity: 0;
  }
  .fade-appear.fade-appear-active {
    opacity: 1;
    transition: opacity 500ms linear;
  }
  .fade-enter {
    opacity: 1;
  }
  // .fade-enter.fade-enter-done {
  //   opacity: 1;
  //   transition: opacity 500ms linear;
  // }
  .fade-exit {
    opacity: 1;
  }
  .fade-exit.fade-exit-active {
    opacity: 0;
    transition: opacity 500ms linear;
  }
  .fade-exit-done {
    opacity: 0;
  }
  &.TEAM > div {
    border: 1px solid #dee2e6;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background-color: #f1f2f7;
  }
`;

const Image = styled.img`
  display: ${(props) => (props.show ? "inherit" : "none")};
  object-fit: cover;
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
    imageLink = null,
    id,
    name = "",
    children,
    type = "USER",
    userId,
    onClick = null,
    noDefaultClick = false,
    isBot = false,
    isHuddleBot = false,
    forceThumbnail = true,
    fromSlider = false,
    showSlider = true,
    tooltipName = null,
    ...rest
  } = props;

  const avatarRef = useRef(null);

  const history = useHistory();
  const dispatch = useDispatch();
  const onlineUsers = useSelector((state) => state.users.onlineUsers);
  const isOnline = onlineUsers.some((ou) => ou.user_id === userId);

  const [isLoaded, setIsLoaded] = useState(false);
  const [showInitials, setShowInitials] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [orientation, setOrientation] = useState(null);
  const [errorBotImage, setErrorBotImage] = useState(false);

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

  const calculateOrientationPosition = () => {
    const { bottom, left } = avatarRef.current.getBoundingClientRect();
    setShowPopup((prevState) => !prevState);
    let vertical = null;
    let horizontal = null;
    if (document.body.clientHeight - bottom < 230) {
      //top
      vertical = "top";
    } else {
      //bottom
      vertical = "bottom";
    }
    if (document.body.clientWidth - left < 530) {
      //left
      horizontal = "left";
    } else {
      //right
      horizontal = "right";
    }
    setOrientation({ vertical, horizontal });
  };

  const handleOnClick = (e) => {
    if (noDefaultClick) return;
    e.stopPropagation();
    e.preventDefault();
    if (onClick) {
      onClick(e);
      return;
    }
    if (showSlider && !fromSlider && !isBot) {
      if (document.body.clientWidth <= 414) {
        //save user data
        dispatch(setProfileSlider({ id: id }));
      } else {
        calculateOrientationPosition();
      }
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
    setOrientation(null);
    if (document.body.clientWidth <= 414) {
      dispatch(setProfileSlider({ id: null }));
    }
  };

  const handleImageError = () => {
    setIsLoaded(true);
    setShowInitials(true);
  };

  const handleBotImageError = () => {
    setIsLoaded(true);
    setErrorBotImage(true);
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
    <Wrapper {...rest} className={`avatar avatar-md ${isOnline ? "avatar-state-success" : ""} ${isLoaded ? "ico-avatar-loaded" : ""} ${className} ${type}`} ref={avatarRef}>
      {isLoaded === false && <Skeleton borderRadius="50%" widthRandomness={0} heightRandomness={0} />}
      <Tooltip arrowSize={5} distance={10} onToggle={toggleTooltip} content={tooltipName ? tooltipName : name}>
        {type === "TEAM" ? (
          <SvgIconFeather icon="users" />
        ) : isBot ? (
          <Image show={isLoaded} className="rounded-circle" onLoad={handleImageLoad} onError={handleBotImageError} src={errorBotImage ? botIcon : imageLink ? imageLink : isHuddleBot ? driffIcon : botIcon} alt={name} />
        ) : imageLink == null ? (
          <Initials className="rounded-circle" avatarColor={avatarColor(name)} onClick={handleOnClick}>
            {handleInitials(name)}
          </Initials>
        ) : name === "Gripp Offerte Bot" ? (
          <Image show={isLoaded} className="rounded-circle" onLoad={handleImageLoad} onError={handleImageError} src={botIcon} alt={name} />
        ) : showInitials === false ? (
          <Image show={isLoaded} className="rounded-circle" onLoad={handleImageLoad} onError={handleImageError} src={imageLink} alt={name} onClick={handleOnClick} />
        ) : (
          <Initials className="rounded-circle" avatarColor={avatarColor(name)} onClick={handleOnClick}>
            {handleInitials(name)}
          </Initials>
        )}
      </Tooltip>
      {showPopup && (
        <CSSTransition appear in={showPopup} timeout={300} classNames="slide">
          <ProfileSlider {...props} onShowPopup={handleShowPopup} showPopup={showPopup} orientation={orientation} />
        </CSSTransition>
      )}
      {children}
    </Wrapper>
  );
};

export default Avatar;
