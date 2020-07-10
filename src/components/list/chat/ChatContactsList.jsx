import React, {useCallback, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useHistory} from "react-router-dom";
import styled from "styled-components";
import {setChannelHistoricalPosition} from "../../../redux/actions/chatActions";
import {addToModals} from "../../../redux/actions/globalActions";
import {SvgIconFeather} from "../../common";
import useChannelActions from "../../hooks/useChannelActions";
import {ChatContactIListItem} from "./item";

const Wrapper = styled.div`
    .channel-number-new-group-wrapper {
        padding-right: 24px;
    }
`;

const NewGroupButton = styled.div`
    cursor: pointer;
    color: #BEBEBE;
    transition: color 0.3s;
    span {
        position: relative;
        top: 1px;
        color: #BEBEBE;
        transition: color 0.3s;
    }
    svg {
        margin-right: 8px;
    }
    &:hover {
        color: #7A1B8B;
        span {
            color: #7A1B8B
        }
    }
`;

const Contacts = styled.ul`
    padding-right: 24px;
    li {
        cursor: pointer;
        cursor: hand;
    }
`;

const ChatContactsList = props => {

    const {className = "", channels, selectedChannel, userChannels, search} = props;

    const dispatch = useDispatch();
    const history = useHistory();

    const channelAction = useChannelActions();

    const user = useSelector(state => state.session.user);

    const handleChannelClick = useCallback((channel) => {
        channelAction.select(channel, (channel) => {
            history.push(`/chat/${channel.code}`);
        });
    }, [history, channelAction]);

    const handleOpenGroupChatModal = () => {
        let payload = {
            type: "chat_create_edit",
            mode: "new",
        };

        dispatch(
            addToModals(payload),
        );
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
            const recipient = channel.members.find(m => m.id !== user.id);
            if (typeof recipient !== "undefined") {
                if (recipients.includes(recipient.id)) {
                    return false;
                } else {
                    recipients.push(recipient.id);
                }
            } else {
                return false;
            }

            if (!Object.values(userChannels).includes(channel.id)) {
                return false;
            }


            if (search !== "") {
                return channel.title
                    .toLowerCase()
                    .indexOf(search.toLowerCase()) > -1;
            }

            return true;
        })
        .sort((a, b) => {
            return a.title.localeCompare(b.title);
        });

    return (
        <Wrapper className={`chat-lists ${className}`}>
            <div className="d-flex align-items-center channel-number-new-group-wrapper">
                <p className="small mb-0">{sortedChannels.length} Contacts</p>
                <NewGroupButton className="small mb-0 text-right ml-auto" onClick={handleOpenGroupChatModal}>
                    <SvgIconFeather width={14} height={14} icon="plus"/>
                    <span>New group chat</span>
                </NewGroupButton>
            </div>
            <Contacts className={"list-group list-group-flush"}>
                {
                    sortedChannels.map((channel) => {
                        return (
                            <ChatContactIListItem
                                key={channel.id}
                                onChannelClick={handleChannelClick}
                                channel={channel}/>
                        );
                    })
                }
            </Contacts>
        </Wrapper>
    );
};

export default React.memo(ChatContactsList);