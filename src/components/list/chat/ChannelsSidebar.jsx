import React from "react";
import styled from "styled-components";
import useLoadChannels from "../../hooks/useLoadChannels";
import useSortChannels from "../../hooks/useSortChannels";
import ChannelList from "./ChannelList";

const ChannelsSidebarContainer = styled.div`
    height: 100%;
    displ
`;
const Channels = styled.ul`
    padding: 0;
    margin: 0;
    list-style: none;
    height: 100%;
    overflow: auto;
`;

const ChannelsSidebar = props => {
    const {className, search} = props;

    useLoadChannels();
    const [sortedChannels] = useSortChannels(search);

    return (
        <ChannelsSidebarContainer className={`chat-lists ${className}`}>
            <Channels className={`list-group list-group-flush`}>
                {
                    sortedChannels.map(channel => {
                        return <ChannelList key={channel.id} channel={channel}/>;
                    })
                }
            </Channels>
        </ChannelsSidebarContainer>
    );
};

export default ChannelsSidebar;