import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import styled from "styled-components";
import {
    createNewChat,
    deleteAddNewChatChannel,
    setChannelHistoricalPosition,
    setSelectedChannel,
} from "../../../redux/actions/chatActions";
import {SvgIconFeather} from "../../common";
import {useLoadChannels} from "../../hooks";
import ChannelIcon from "./ChannelIcon";

const Wrapper = styled.div`
`;

const NewGroupButton = styled.div`
    cursor: pointer;
    cursor: hand;
    
    span {
        position: relative;
        top: 1px;
    }
`;

const Contacts = styled.ul`
    li {
        cursor: pointer;
        cursor: hand;
    }
`;

const ChatContactsList = props => {

    useLoadChannels();

    const {className = "", search} = props;
    const dispatch = useDispatch();
    const selectedChannel = useSelector(state => state.chat.selectedChannel);
    const channels = useSelector(state => state.chat.channels);
    const user = useSelector(state => state.session.user);
    const [oldChannel, setOldChannel] = useState(null);

    const handleNewGroupChat = () => {

    };

    const handleSelectChannel = (channel) => {
        if (channel.add_user) {
            let old_channel = channel;
            dispatch(
                createNewChat({
                    title: "",
                    type: "person",
                    recipient_ids: [channel.members[0].id],
                }, (err, res) => {
                    if (err)
                        console.log(err);


                    if (res) {
                        let timestamp = Math.round(+new Date() / 1000);
                        let channel = {
                            ...res.data.channel,
                            old_id: old_channel.id,
                            code: res.data.code,
                            selected: true,
                            hasMore: false,
                            skip: 0,
                            replies: [],
                            created_at: {
                                timestamp: timestamp,
                            },
                            last_reply: null,
                            title: old_channel.first_name,
                        };

                        setOldChannel(channel);
                    }
                }),
            );

        } else {
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
            }
        }
    };

    useEffect(() => {
        if (oldChannel !== null) {
            dispatch(
                deleteAddNewChatChannel(oldChannel),
            );
            dispatch(
                setSelectedChannel({...oldChannel, selected: true}, () => {
                    setOldChannel(null);
                }),
            );
        }
    }, [oldChannel, dispatch]);

    let recipients = [];
    const sortedChannels = Object.values(channels)
        .sort((a, b) => {
            return a.created_at > b.created_at;
        })
        .filter(c => {
            if (c.is_archived || c.is_hidden) {
                return false;
            }

            if (["TOPIC", "POST", "GROUP", "COMPANY", "PERSONAL_BOT"].includes(c.type)) {
                return false;
            }

            if (c.members.length === 1 && c.add_user !== 1) {
                return false;
            }

            /**
             * c.members for add_user IS NOT THE USER ID
             */
            if(c.add_user !== 1) {
                const recipient = c.members.filter(m => m.id !== user.id)[0];
                if (recipient.id) {
                    if (recipients.includes(recipient.id)) {
                        return false;
                    } else {
                        recipients.push(recipient.id);
                    }
                }
            }

            if (search !== "") {
                return c.search
                    .toLowerCase()
                    .indexOf(search.toLowerCase()) > -1;
            }

            return true;
        }).filter(c => {
            return true;
        }).sort(
            (a, b) => {
                return a.title.localeCompare(b.title);
            },
        );

    return (
        <Wrapper className={`chat-lists ${className}`}>
            <div className="d-flex align-items-center">
                <p className="small mb-0">{sortedChannels.length} Contacts</p>
                <NewGroupButton className="small mb-0 text-right ml-auto" onClick={handleNewGroupChat}>
                    <SvgIconFeather width={18} height={18} icon="plus"/> <span>New group chat</span>
                </NewGroupButton>
            </div>
            <Contacts className={`list-group list-group-flush`}>
                {
                    sortedChannels.map((channel, k, arr) => {

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

