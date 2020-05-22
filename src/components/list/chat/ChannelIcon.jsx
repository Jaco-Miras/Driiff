import React from "react";
import styled from "styled-components";
import postIcon from "../../../assets/icon/conversations/l/active.svg";
import teamIcon from "../../../assets/icon/departments/department.svg";
import botIcon from "../../../assets/icon/person/l/active.svg";
import topicIcon from "../../../assets/icon/topic_icon/people_group/l/active.svg";
import {Avatar, SvgIconFeather} from "../../common";

const Wrapper = styled.div`
    :before{
        content: '';
        mask-image: ${props => props.type === "PERSONAL_BOT" ? `url(${botIcon})`
    : props.type === "COMPANY" ? `url(${teamIcon})`
        : props.type === "POST" ? `url(${postIcon})`
            : `url(${topicIcon})`};
        background: linear-gradient(105deg, #972c86, #794997);
        mask-repeat: no-repeat;
        mask-size: 90%;
        mask-position:center;
        width: 32px;
        height: 32px;
        display: ${props => ["DIRECT", "GROUP"].includes(props.type) ? "none" : "inline-block"};
    }
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
`;

const StyledAvatar = styled(Avatar)`  
`;
const Icon = styled(SvgIconFeather)`
    color: #7a1b8b !important;
    height: 30px;
    width: 30px;
`;
const handleInitials = title => {
    var result = "";
    var tokens = title.split(" ");
    for (var i = 0; i < tokens.length; i++) {
        result += tokens[i].substring(0, 1).toUpperCase();
    }
    return result;
};

const ChannelIcon = props => {
    const {className = "", channel} = props;

    return (
        <Wrapper
            className={`pr-3 ${className}`}
            type={channel.type}
        >
            {
                channel.profile && channel.members.length >= 2 && channel.type === "DIRECT" &&
                <StyledAvatar
                    type={channel.type}
                    imageLink={channel.profile.profile_image_link}
                    userId={channel.profile.id}
                    name={channel.profile.name}
                    noClick={true}
                />
            }
            {
                channel.type === "GROUP" &&
                <Icon icon="users"/>
            }
            {
                channel.members.length > 2 && channel.type === "DIRECT" &&
                <span>{handleInitials(channel.title).substring(0, 3)}</span>
            }
        </Wrapper>
    );
};

export default ChannelIcon;