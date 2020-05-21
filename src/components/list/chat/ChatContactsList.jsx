import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import styled from "styled-components";
import {
    createNewChat,
    renameChannelKey,
    setChannelHistoricalPosition,
    setSelectedChannel,
    updateChannel,
} from "../../../redux/actions/chatActions";
import {addToModals} from "../../../redux/actions/globalActions";
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
    const sharedSlugs = useSelector(state => state.global.slugs);
    const channels = useSelector(state => state.chat.channels);
    const user = useSelector(state => state.session.user);

    const handleCreateChannel = (channel) => {
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
                    dispatch(
                        renameChannelKey(channel),
                    );
                }
            }),
        );
    };

    const handleUnarchiveUser = (channel) => {
        let payload = {
            id: channel.id,
            is_pinned: channel.is_pinned,
            is_archived: 0,
            is_muted: channel.is_muted,
            title: channel.title,
        };

        if (channel.is_shared && sharedSlugs.length) {
            payload = {
                ...payload,
                is_shared: true,
                token: sharedSlugs.filter(s => s.slug_name === channel.slug_owner)[0].access_token,
                slug: sharedSlugs.filter(s => s.slug_name === channel.slug_owner)[0].slug_name,
            };
        }
        dispatch(
            updateChannel(payload, () => {
                dispatch(
                    setSelectedChannel({...channel, is_archived: 0}),
                );
            }),
        );
    };

    const handleOpenGropupChatModal = () => {
        let payload = {
            type: "chat_create_edit",
            mode: "new",
        };

        dispatch(
            addToModals(payload),
        );
    };

    const handleSelectChannel = (channel) => {

        //if contact doesn't have a chat channel yet
        if (channel.add_user) {
            handleCreateChannel(channel);

            //if unarchived archived chat
        } else if (channel.is_archived === 1) {
            handleUnarchiveUser(channel);

        } else {
            dispatch(
                setSelectedChannel({...channel, selected: true}),
            );
        }
    };

    useEffect(() => {
        const scrollComponent = document.getElementById("component-chat-thread");
        if (scrollComponent) {
            dispatch(setChannelHistoricalPosition({
                channel_id: selectedChannel.id,
                scrollPosition: scrollComponent.scrollHeight - scrollComponent.scrollTop,
            }));
        }

        //disabled because selectedChannel may be null
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, selectedChannel]);

    let recipients = [];
    const sortedChannels = Object.values(channels)
        .sort((a, b) => {
            return a.created_at > b.created_at;
        })
        .filter(channel => {
            if (["TOPIC", "POST", "GROUP", "COMPANY", "PERSONAL_BOT"].includes(channel.type)) {
                return false;
            }

            if (channel.members.length === 1 && channel.add_user !== 1) {
                return false;
            }

            /**
             * c.members for add_user IS NOT THE USER ID
             */
            if (channel.add_user !== 1) {
                const recipient = channel.members.filter(m => m.id !== user.id)[0];
                if (recipient.id) {
                    if (recipients.includes(recipient.id)) {
                        return false;
                    } else {
                        recipients.push(recipient.id);
                    }
                }
            }

            if (search !== "") {
                return channel.search
                    .toLowerCase()
                    .indexOf(search.toLowerCase()) > -1;
            }

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
                <NewGroupButton className="small mb-0 text-right ml-auto" onClick={handleOpenGropupChatModal}>
                    <SvgIconFeather width={18} height={18} icon="plus"/>
                    <span>New group chat</span>
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