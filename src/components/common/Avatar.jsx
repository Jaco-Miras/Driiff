import React, {forwardRef, useState} from "react";
import {useSelector} from "react-redux";
import {useHistory} from "react-router-dom";
import Skeleton from "react-skeleton-loader";
import styled from "styled-components";
import departmentIcon from "../../assets/icon/teams/r/secundary.svg";
import topicIcon from "../../assets/icon/topic/r/secundary.svg";
import defaultIcon from "../../assets/icon/user/avatar/l/no_outline.png";
import botIcon from "../../assets/img/gripp-bot.png";

const Wrapper = styled.div`
    .react-skeleton-load {
        height: 100% !important;
        width: 100% !important;
    }    
`;

const Avatar = forwardRef((props, ref) => {
    const {
        className = "",
        imageLink,
        id,
        name,
        children,
        noLoader = false,
        partialName = null,
        isAnonymous = false,
        type = "USER",
        ...rest
    } = props;

    const history = useHistory();
    const user = useSelector(state => state.session.user);
    const onlineUsers = useSelector(state => state.users.onlineUsers);
    const isOnline = onlineUsers.filter(ou => ou.user_id === user.id).length ? true : false;

    const [isLoaded, setIsLoaded] = useState(false);
    const [showInitials, setShowInitials] = useState(false);

    const handleImageLoad = () => {
        setIsLoaded(true);
    };

    const handleOnClick = (e) => {
        if (props.noClick)
            return;

        if (props.onClick) {
            props.onClick();
        }
        if (type === "USER") {
            if (partialName) history.push(`/profile/${partialName}`);
            else history.push(`/profile/${id}`);
        } else if (type === "TOPIC") {
            history.push(`/topic/${id}/${name.toLowerCase().replace(/\s|\//g, "-")}`);
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

    return <Wrapper
        {...rest}
        className={`avatar avatar-sm ${isOnline && "avatar-state-success"} ${className} ${isLoaded && "ico-avatar-loaded"}`}
        onClick={handleOnClick}>
        {
            !isLoaded && !noLoader && !showInitials &&
            <Skeleton borderRadius="50%" widthRandomness={0}
                      heightRandomness={0}/>
        }
        {
            showInitials ?
                <span>fs{handleInitials(name).substring(0, 2)}</span>
                :
                <img
                    className="rounded-circle"
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                    src={type === "DEPARTMENT" ? departmentIcon : type === "TOPIC" ? topicIcon :
                        imageLink !== null && !isAnonymous ? name === "Gripp Offerte Bot" ? botIcon : imageLink : defaultIcon}
                    alt={name}
                />
        }
        {children}
    </Wrapper>;
});


export default React.memo(Avatar);