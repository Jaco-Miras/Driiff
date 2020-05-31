import React from "react";
import styled from "styled-components";
import {useLoadChannels, useSortChannels} from "../../hooks";
import ChannelList from "./ChannelList";

const ChannelsSidebarContainer = styled.div`
`;
const Channels = styled.ul`
    padding-right: 24px;
`;
const ChatHeader = styled.h4`
`;

const ChannelsSidebar = props => {
    const {className, search} = props;

    useLoadChannels();
    const [sortedChannels] = useSortChannels(search);

    return (
        <ChannelsSidebarContainer className={`chat-lists ${className}`}>
            <Channels className={`list-group list-group-flush`}>
                {
                    sortedChannels.map((channel, k, arr) => {
                        let chatHeader = "";
                        if (k !== 0 && arr[k - 1].is_pinned === 1 && channel.is_pinned === 0) {
                            chatHeader = "Recent";
                        } else if (k === 0 && channel.is_pinned === 1) {
                            chatHeader = "Pinned";
                        } else if (k === 0 && channel.is_pinned === 0) {
                            chatHeader = "Recent";
                        }

                        if (k !== 0 && arr[k - 1].is_hidden === 0 && channel.is_hidden === 1) {
                            chatHeader = "Hidden";
                        } else if (k === 0 && channel.is_hidden === 1) {
                            chatHeader = "Hidden";
                        }

                        if (k !== 0 && arr[k - 1].add_user === 0 && channel.add_user === 1) {
                            chatHeader = "Start New";
                        } else if (k === 0 && channel.add_user === 1) {
                            chatHeader = "Start New";
                        }

                        if (k !== 0 && arr[k - 1].add_open_topic === 0 && channel.add_open_topic === 1) {
                            chatHeader = "View Open Topics";
                        } else if (k === 0 && channel.add_open_topic === 1) {
                            chatHeader = "View Open Topics";
                        }

                        if (k !== 0 && arr[k - 1].is_archived === 0 && channel.is_archived === 1) {
                            chatHeader = "Archived";
                        } else if (k === 0 && channel.is_archived === 1) {
                            chatHeader = "Archived";
                        }
                        return (
                            <React.Fragment key={channel.id}>
                                {search !== "" && chatHeader !== "" && <ChatHeader>{chatHeader}</ChatHeader>}
                                <ChannelList channel={channel}/>
                            </React.Fragment>
                        );
                    })
                }
            </Channels>
        </ChannelsSidebarContainer>
    );
};

export default ChannelsSidebar;