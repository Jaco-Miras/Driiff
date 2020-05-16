import React from "react";
import styled from "styled-components";
import postIcon from "../../../assets/icon/conversations/l/active.svg";
import teamIcon from "../../../assets/icon/departments/department.svg";
import botIcon from "../../../assets/icon/person/l/active.svg";
import topicIcon from "../../../assets/icon/topic_icon/people_group/l/active.svg";
import Avatar from "../../common/Avatar";

const ChannelIconContainer = styled.div`
    border-radius: 50%;
    min-width: 40px;
    width: 40px;
    height: 40px;
    margin-right: 10px;
    background: #fff;
    color: #972c86;
    border: 1px solid #ddd;
    display: flex;
    align-items: center;
    justify-content: center;
    :before{
        content: '';
        mask-image: ${props => props.type === "PERSONAL_BOT" ? `url(${botIcon})`
    : props.type === "COMPANY" ? `url(${teamIcon})`
        : props.type === "POST" ? `url(${postIcon})`
            : `url(${topicIcon})`};
        background: linear-gradient(105deg, #972c86, #794997);
        mask-repeat: no-repeat;
        mask-size: 100%;
        mask-position:center;
        width: 20px;
        height: 20px;
        display: ${props => props.type === "DIRECT" ? "none" : "inline-block"};
    }
    > span {
        font-size: .8rem;
    }
`;

const StyledAvatar = styled(Avatar)`
  border: 1px solid #ddd;
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
    const {channel, className} = props;
    return (
        <ChannelIconContainer className={`channel-icon ${className}`}
                              type={channel.type}
        >
            {
                channel.profile && channel.members.length <= 2 && channel.type === "DIRECT" &&
                <StyledAvatar
                    imageLink={channel.profile.profile_image_link}
                    id={channel.profile.id}
                    name={channel.profile.name}
                    noClick={true}
                />
            }
            {
                channel.members.length > 2 && channel.type === "DIRECT" &&
                <span>{handleInitials(channel.title).substring(0, 3)}</span>
            }
        </ChannelIconContainer>
    );
};

export default ChannelIcon;