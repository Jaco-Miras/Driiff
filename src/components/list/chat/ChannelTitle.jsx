import React from "react";
import styled from "styled-components";

const ChannelTitleContainer = styled.h6`
    color: #828282;
    ${"" /* ${props => props.channel.is_read && "color: #7a1b8b"}; */}
`;


const ChannelTitle = props => {

    const {className = ""} = props;

    return (
        <ChannelTitleContainer className={`mb-1 ${className}`}>
            {props.channel.title}
        </ChannelTitleContainer>
    );
};

export default ChannelTitle;