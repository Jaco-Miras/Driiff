import PropTypes from "prop-types";
import React, {forwardRef, useState} from "react";
import {withRouter} from "react-router-dom";
import Skeleton from "react-skeleton-loader";
import styled from "styled-components";
import departmentIcon from "../../assets/icon/teams/r/secundary.svg";
import topicIcon from "../../assets/icon/topic/r/secundary.svg";
import botIcon from "../../assets/img/gripp-bot.png";
import defaultIcon from "../../assets/icon/user/avatar/l/no_outline.png";
import {useSelector} from 'react-redux';

const AvatarContainerDiv = styled.div`
    position: relative;
    min-width: ${props => props.size};
    min-height: ${props => props.size};    
    border-radius: 50%;    
    background: ${props => props.type !== "USER" ? "#fff" : props.showInitials ? "#dedede" : ""};
    margin-right: ${props => props.marginRight}px;
    z-index: ${props => props.underZindex};
    //pointer-events: ${props => props.noClick ? "none" : "auto"};
    // border: ${props => props.lastActive && props.showBorder ? "2px solid #972c86" : !props.lastActive && props.showBorder ? "2px solid #007180" : "none"};
    // border: ${props => props.noBorder ? "none" : props.isOnline && props.showBorder ? "2px solid #007180" : !props.isOnline && props.showBorder ? "1px solid #ddd" : "none"};
    //border: ${props => props.isOnline && props.showBorder ? "2px solid #007180" : !props.isOnline && props.showBorder ? "1px solid #ddd" : "none"};
    border: 1px solid #dddddd;    
    cursor: pointer;
            
    img{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        padding: 0;
        border-radius: inherit;
        display: ${props => props.isLoading ? "block" : "none"};
        object-fit: cover;
    }
    ${props => props.showInitials ?
    `display: flex;
        align-items:center;
        justify-content: center;
        ` :
    ``}
    
    .react-skeleton-load {    
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto;
    }
`;

const Placeholder = styled(Skeleton)`
`;

const Indicator = styled.span`
    width: 40%;
    height: 40%;
    position: absolute;
    display: block;
    bottom: -3px;
    right: -3px;
    border-radius: 100%;
    
    .inside-circle {
        display: none;
        background-color: #fff;
        border-radius: 25px;
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        top: 0;
        width: 55%;
        height: 55%;
        margin: auto;        
    }
    
    &.online-indicator-yes {
        background-color: #34a853;
        border: 1.5px solid #fff;
    }
    
    &.online-indicator-no {
        display: none;
    }
`;

const Avatar = forwardRef((props, ref) => {
    const {
        className = "",
        profileImageLink,
        id,
        size = "m",
        name,
        marginRight = 0,
        underZindex = 1,
        noClick = false,
        children,
        noLoader = false,
        lastActive,
        showBorder,
        partialName = null,
        isAnonymous = false,
        chat = false,
        type = "USER",
        onAvatarClick = null,
        ...otherProps
    } = props;
    const onlineUsers = useSelector(state => state.users.onlineUsers)
    const user = useSelector(state => state.session.user)
    const noBorder = id === user.id && !chat;
    const [isLoaded, setIsLoaded] = useState(false);
    const [showInitials, setShowInitials] = useState(false);
    const handleImageLoad = () => {
        setIsLoaded(true);
    };
    
    const isOnline = onlineUsers.filter(ou => ou.user_id === user.id).length ? true : false;
    const getSize = (size) => {
        switch (size) {
            case "xss":
                return "20px";
            case "xs":
                return "30px";
            case "s":
                return "40px";
            case "m":
                return "46px";
            case "l":
                return "60px";
            case "xl":
                return "80px";
            default:
                if (size) {
                    return size;
                } else {
                    return "30px";
                }
        }
    };

    let widthHeight = getSize(size);

    const handleOnClick = (e) => {
        if (onAvatarClick && !noClick) {
            onAvatarClick(id, name);
            return;
        }
        if (!noClick) {
            e.stopPropagation();
            if (type === "USER") {
                if (partialName) props.history.push(`/profile/${partialName}`);
                else props.history.push(`/profile/${id}`);
            } else if (type === "TOPIC") {
                props.history.push(`/topic/${id}/${name.toLowerCase().replace(/\s|\//g, "-")}`);
            }
        }
    };

    const handleImageError = e => {
        setShowInitials(true);
    };
    const handleInitials = title => {
        var result = "";
        var tokens = title.split(" ");
        for (var i = 0; i < tokens.length; i++) {
            result += tokens[i].substring(0, 1).toUpperCase();
        }
        return result;
    };

    return <AvatarContainerDiv
        className={`ico ico-avatar ${className} ${isLoaded && "ico-avatar-loaded"}`}
        size={widthHeight}
        isLoading={isLoaded}
        isOnline={isOnline}
        showBorder={type === "USER" ? true : false}
        onClick={handleOnClick}
        marginRight={marginRight}
        underZindex={underZindex}
        chat={chat}
        type={type}
        noBorder={noBorder}
        showInitials={showInitials}
        {...otherProps}>
        {
            !isLoaded && !noLoader && !showInitials &&
            <Placeholder
                height={widthHeight} width={widthHeight} borderRadius="50%" widthRandomness={0}
                heightRandomness={0}/>
        }
        {
            showInitials ?
                <span>{handleInitials(name).substring(0, 2)}</span>
                :
                <img
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                    src={type === "DEPARTMENT" ? departmentIcon : type === "TOPIC" ? topicIcon :
                        profileImageLink !== null && !isAnonymous ? name === "Gripp Offerte Bot" ? botIcon : profileImageLink : defaultIcon}
                    alt={name}
                />
        }

        {children}
        <Indicator
            className={`${isOnline ? "online-indicator-yes" : "online-indicator-no"}`}>
            <span className={`inside-circle`}/>
        </Indicator>
    </AvatarContainerDiv>;
});


export default withRouter(React.memo(Avatar));

Avatar.propTypes = {
    className: PropTypes.string,
    profileImageLink: PropTypes.string,
    name: PropTypes.string.isRequired,
    size: PropTypes.string,
    marginRight: PropTypes.number,
    underZindex: PropTypes.number,
    noClick: PropTypes.bool,
};