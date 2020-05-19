import React from "react";
import {useDispatch, useSelector} from "react-redux";
import styled from "styled-components";
import {setChannelHistoricalPosition, setSelectedChannel} from "../../../redux/actions/chatActions";
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

const Contacts = styled.ul`
    li {
        cursor: pointer;
        cursor: hand;
    }
`;

const ChatContactsList = props => {
    const {className = "", search} = props;
    const dispatch = useDispatch();
    const selectedChannel = useSelector(state => state.chat.selectedChannel);

    useLoadChannels();
    const [sortedChannels] = useSortChannels(search, {showHidden: true, type: "DIRECT"});

    const handleSelectChannel = (channel) => {
        if (selectedChannel.id !== channel.id) {
            const scrollComponent = document.getElementById("component-chat-thread");
            if (scrollComponent) {
                dispatch(setChannelHistoricalPosition({
                    channel_id: selectedChannel.id,
                    scrollPosition: scrollComponent.scrollHeight - scrollComponent.scrollTop,
                }));
            }

            dispatch(
                setSelectedChannel({...channel, selected: true}),
            );
            //props.history.push(`/chat/${updatedChannel.code}`);
        }
    };

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
                            <li className="list-group-item d-flex align-items-center pl-0 pr-0 pb-3 pt-3"
                                key={channel.code}
                                onClick={e => {
                                    handleSelectChannel(channel);
                                }}>
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
                            </li>
                        );
                    })
                }
            </Contacts>
        </Wrapper>
    );
};
export default ChatContactsList;

