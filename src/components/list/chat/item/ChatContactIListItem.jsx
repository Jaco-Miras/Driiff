import React from "react";
import styled from "styled-components";
import {SvgIconFeather} from "../../../common";
import ChannelIcon from "../ChannelIcon";

const Wrapper = styled.li`
`;

const ChatContactListItem = (props) => {

    const {
        className = "",
        channel = null,
        onChannelClick = null,
        ...rest
    } = props;


    const handleClick = (e) => {
        e.preventDefault();
        if (onChannelClick)
            onChannelClick(channel);
    };

    return (
        <Wrapper
            className={`chat-contact-list-item list-group-item d-flex align-items-center pl-0 pr-0 pb-3 pt-3 ${className}`}
            onClick={handleClick}
            {...rest}>
            <div className="pr-3">
                <ChannelIcon channel={channel}/>
            </div>
            <div>
                <h6 className="mb-1">{channel.title}</h6>
                <div className="small text-muted"/>
            </div>
            <div className="text-right ml-auto">
                <SvgIconFeather icon="message-circle"/>
            </div>
        </Wrapper>
    );
};

export default React.memo(ChatContactListItem);