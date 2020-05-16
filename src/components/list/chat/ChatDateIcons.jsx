import React from "react";
import styled from "styled-components";
import {localizeChatChannelDate} from "../../../helpers/momentFormatJS";
//import BadgeIcon from "../../common/BadgeIcon";
import SvgImage from "../../common/SvgImage";

const DateIconsContainer = styled.div`
  text-align: right;
  color: #676767;
  display: ${props => props.optionsVisible ? "none" : "inline-flex"};
  flex-flow: column;
  max-width: 65px;
  min-width: 65px;
  p {
    margin: 0;
    white-space: nowrap;
    font-size: 0.7em;
    color: #676767;
  }
`;
const MuteIcon = styled(SvgImage)`
    filter: brightness(0) saturate(100%) invert(43%) sepia(19%) saturate(0%) hue-rotate(214deg) brightness(87%) contrast(86%);      
    position: relative;
    top: -3px;
    right: 5px;
`;
const PinIcon = styled(SvgImage)`
    filter: brightness(0) saturate(100%) invert(43%) sepia(19%) saturate(0%) hue-rotate(214deg) brightness(60%) contrast(86%);    
    position: relative;
    top: -3px;
    right: 5px;      
`;

const Badge = styled.span`
    color: #fff;
    &.unread {
        color: #7a1b8b;
    }
`;

const ChatDateIcons = props => {
    const {channel, optionsVisible} = props;
    const handleNotificationBadges = () => {
        if (channel.is_read === 0) {
            return <Badge className={`badge badge-primary badge-pill ml-auto unread`}>0</Badge>;
            //return (<span className={`badge-container unread`} value={""}><BadgeIcon/></span>);
        } else {
            if (channel.total_unread > 0) {
                return <Badge className="badge badge-primary badge-pill ml-auto">{channel.total_unread}</Badge>;
                //return (<span className={`badge-container`}><BadgeIcon value={channel.total_unread}/></span>);
            } else {
                return null;
            }
        }
    };
    return (
        <DateIconsContainer className="chat-timestamp" optionsVisible={optionsVisible}>
            <p>
                {channel.last_reply
                    ? localizeChatChannelDate(channel.last_reply.created_at.timestamp)
                    : null
                }
            </p>
            <div>
                {
                    !!channel.is_muted &&
                    <MuteIcon icon={`mute`}/>
                }
                {
                    !!channel.is_pinned &&
                    <PinIcon icon={`pin`} rotate={45}/>
                }
                {handleNotificationBadges()}
            </div>
        </DateIconsContainer>
    );
};

export default ChatDateIcons;