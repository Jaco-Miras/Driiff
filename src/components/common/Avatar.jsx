import React, {useState} from "react";
import {useSelector} from "react-redux";
import {useHistory} from "react-router-dom";
import Skeleton from "react-skeleton-loader";
import Tooltip from "react-tooltip-lite";
import styled from "styled-components";
import departmentIcon from "../../assets/icon/teams/r/secundary.svg";
import defaultIcon from "../../assets/icon/user/avatar/l/no_outline.png";
import botIcon from "../../assets/img/gripp-bot.png";
import {replaceChar} from "../../helpers/stringFormatter";
import {SvgIconFeather} from "./SvgIcon";

const Wrapper = styled.div`
    position: relative;
    cursor: pointer;

    .react-skeleton-load {
        display: flex;
        margin: auto;
        text-align: center;
        width: 100% !important;
        height: 100% !important;
        object-fit: cover;
        align-items: center;
        justify-content: center;
    }
`;

const Image = styled.img`
    display: ${props => props.show ? "inherit" : "none"};
`;

const Initials = styled.span`
    background-color: #fff;
    display: flex;
    margin: auto;
    height: 20px;
    text-align: center;
    width: 100%;
    height: 100%;
    object-fit: cover;
    align-items: center;
    justify-content: center;
`;

const Avatar = (props) => {
    const {
        className = "",
        imageLink,
        id,
        name = "",
        children,
        partialName = null,
        isAnonymous = false,
        type = "USER",
        userId,
        onClick = null,
        noDefaultClick = false,
        ...rest
    } = props;

    const history = useHistory();
    const onlineUsers = useSelector(state => state.users.onlineUsers);
    const isOnline = onlineUsers.some(ou => ou.user_id === userId);

    const [isLoaded, setIsLoaded] = useState(false);
    const [showInitials, setShowInitials] = useState(false);

    const toggleTooltip = () => {
        let tooltips = document.querySelectorAll("span.react-tooltip-lite");
        tooltips.forEach((tooltip) => {
            tooltip.parentElement.classList.toggle("tooltip-active");
        });
    };

    const handleImageLoad = () => {
        setIsLoaded(true);
    };

    const handleOnClick = (e) => {
        e.stopPropagation();
        e.preventDefault();

        if (onClick)
            onClick(e);

        if (props.noDefaultClick)
            return;

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

    // const hasWhiteSpace = (s) => {
    //     return /\s/g.test(s);
    // };

    const handleInitials = title => {

        if (typeof title === "undefined") return "";

        var result = "";
        var tokens = title.split(" ");
        for (var i = 0; i < tokens.length; i++) {
            result += tokens[i].substring(0, 1).toUpperCase();
        }
        return result.substring(0, 2);

        // var result = "";
        // if (hasWhiteSpace(title)) {
        //     var tokens = title.split(" ");
        //     for (var i = 0; i < tokens.length; i++) {
        //         result += tokens[i].substring(0, 1).toUpperCase();
        //     }
        //     return result.substring(0, 2);
        // } else {
        //     result = title.charAt(0);
        //     return result
        // }
    };

    return <Wrapper
        {...rest}
        className={`avatar avatar-sm ${isOnline ? "avatar-state-success" : ""} ${isLoaded ? "ico-avatar-loaded" : ""} ${showInitials ? "border" : ""} ${className}`}
        onClick={handleOnClick}>
        {
            isLoaded === false &&
            <Skeleton
                borderRadius="50%" widthRandomness={0}
                heightRandomness={0}/>
        }
        <Tooltip arrowSize={5} distance={10} onToggle={toggleTooltip} content={name}>
            {
                showInitials ?
                <Initials className="rounded-circle">{handleInitials(name)}</Initials>
                             :
                <>
                    {
                        type === "GROUP" ?
                        <SvgIconFeather icon="users"/>
                                         :
                        <Image
                            show={isLoaded}
                            className="rounded-circle"
                            onLoad={handleImageLoad}
                            onError={handleImageError}
                            src={type === "DEPARTMENT" ? departmentIcon : imageLink !== null && !isAnonymous ? name === "Gripp Offerte Bot" ? botIcon : imageLink : defaultIcon}
                            alt={name}
                        />
                    }
                </>
            }
        </Tooltip>
        {children}
    </Wrapper>;
};


export default React.memo(Avatar);