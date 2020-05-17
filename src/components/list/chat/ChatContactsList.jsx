import React from "react";
import styled from "styled-components";
import {SvgIconFeather} from "../../common";
import {useLoadChannels, useSortChannels} from "../../hooks";
import ChannelIcon from "./ChannelIcon";

const ChatHeader = styled.h4`
    margin: 1rem 0 0;
    padding: 0.5rem 0 0.5rem 15px;
    background: #972C86; 
    font-weight: 600;    
    color: #fff;
    font-size: 1rem;
`;

const Wrapper = styled.div`
`;

const Contacts = styled.div`
`;

const ChatContactsList = props => {
    const {className = "", search} = props;

    useLoadChannels();
    const [sortedChannels] = useSortChannels(search, {showHidden: true, type: "DIRECT"});

    return (
        <Wrapper className={`chat-lists ${className}`}>
            <p className="small mb-0">{sortedChannels.length} Contacts</p>
            <Contacts className={`list-group list-group-flush`}>
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
                            <React.Fragment key={channel.code}>
                                {search !== "" && chatHeader !== "" && <ChatHeader>{chatHeader}</ChatHeader>}
                                {/*<ChannelList channel={channel}/>*/}
                                <div className="pr-3">
                                    <ChannelIcon channel={channel}/>
                                </div>
                                <div>
                                    <h6 className="mb-1">{channel.title}</h6>
                                    <div className="small text-muted"></div>
                                </div>
                                <div className="text-right ml-auto">
                                    <SvgIconFeather icon="message-circle"/>
                                </div>
                            </React.Fragment>
                        );
                    })
                }
            </Contacts>
        </Wrapper>
    );
};
export default ChatContactsList;

