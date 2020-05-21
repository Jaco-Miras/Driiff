import React from "react";
import styled from "styled-components";
import {localizeChatChannelDate} from "../../../helpers/momentFormatJS";
import {SvgIcon} from "../../common";

const Wrapper = styled.div`
    display: ${props => props.optionsVisible ? "none" : "initial"};
`;
const ActionContainer = styled.div`
    position: relative;
    top: 4px;
`;
const MuteIcon = styled(SvgIcon)`
    filter: brightness(0) saturate(100%) invert(43%) sepia(19%) saturate(0%) hue-rotate(214deg) brightness(87%) contrast(86%);      
    position: relative;
    top: -3px;
    right: 5px;
    width: 15px;
    height: 15px;
`;
const PinIcon = styled(SvgIcon)`
    filter: brightness(0) saturate(100%) invert(43%) sepia(19%) saturate(0%) hue-rotate(214deg) brightness(60%) contrast(86%);    
    position: relative;
    top: -3px;
    right: 5px;
    width: 15px;
    height: 15px;      
`;

const Badge = styled.span`
    color: #fff !important;
        
    &.unread {
        color: #7a1b8b !important;
    }    
`;

const ChatDateIcons = props => {
    const {channel, optionsVisible} = props;
    const handleNotificationBadges = () => {
        if (channel.is_read === 0) {
            return <Badge className={`badge badge-primary badge-pill ml-auto unread`}>0</Badge>;
        } else {
            if (channel.total_unread > 0) {
                return <Badge className="badge badge-primary badge-pill ml-auto">{channel.total_unread}</Badge>;
            } else {
                return null;
            }
        }
    };
    return (
        <Wrapper className="chat-timestamp" optionsVisible={optionsVisible}>
            {handleNotificationBadges()}
            <span className={`small text-muted`}>
                {
                    channel.last_reply
                        ? localizeChatChannelDate(channel.last_reply.created_at.timestamp)
                        : ""
                }
            </span>
            <ActionContainer>
                {
                    !!channel.is_muted &&
                    <MuteIcon icon={`mute`}/>
                }
                {
                    !!channel.is_pinned &&
                    <PinIcon icon={`pin`} rotate={45}/>
                }
            </ActionContainer>
        </Wrapper>
    );
};

export default ChatDateIcons;