import React from 'react';
import styled from 'styled-components';

const ChannelTitleContainer = styled.div`
    font-weight: 600;
    display: block;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
`

const ChannelTitle = props => {
    return (
        <ChannelTitleContainer>
            {props.channel.title}
        </ChannelTitleContainer>
    )
}

export default ChannelTitle