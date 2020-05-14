import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import useLoadChannels from '../../hooks/useLoadChannels';
import ChannelList from './ChannelList'

const ChannelsSidebarContainer = styled.div`
    height: 100%;
    displ
`
const Channels = styled.ul`
    padding: 0;
    margin: 0;
    list-style: none;
    height: 100%;
    overflow: auto;
`

const ChannelsSidebar = props => {
    const { className } = props;
    const channels  = useSelector(state => state.chat.channels)

    useLoadChannels()

    return (
        <ChannelsSidebarContainer className={`chat-lists ${className}`}>
            <Channels className={`list-group list-group-flush`}>
                {
                    Object.values(channels).map(channel => {
                        return <ChannelList channel={channel}/>
                    })
                }
            </Channels>
        </ChannelsSidebarContainer>
    )
}

export default ChannelsSidebar