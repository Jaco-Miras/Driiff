import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import styled from "styled-components";
import {
    markReadChannel,
    markUnreadChannel,
    updateChannel,
    updateChannelReducer,
    updateUnreadChatReplies,
} from "../../../redux/actions/chatActions";
import {addToModals} from "../../../redux/actions/globalActions";
import {MoreOptions} from "../../panels/common";

const Wrapper = styled(MoreOptions)`
    .more-options-tooltip {
        &.orientation-left {
            right: calc(100% - 20px);
        }
        &.orientation-bottom {
            top: 100%;
        }    
        &.orientation-top {
            bottom: 25px;
        }
    }        
`;

const ChannelOptions = props => {
    const {channel} = props;

    const dispatch = useDispatch();
    const [showMoreOptions, setShowMoreOptions] = useState(false);
    const scrollEl = document.getElementById("pills-contact");
    const [sharedChannel, setSharedChannel] = useState(false);
    const sharedSlugs = useSelector(state => state.global.slugs);
    const selectedChannel = useSelector(state => state.chat.selectedChannel);

    useEffect(() => {
        if (channel.is_shared) {
            setSharedChannel(true);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handlePinButton = () => {
        let payload = {
            id: channel.id,
            is_pinned: !channel.is_pinned,
            is_archived: channel.is_archived,
            is_muted: channel.is_muted,
            title: channel.title,
        };

        if (channel.type === "PERSONAL_BOT") {
            payload = {
                ...payload,
                pinned_personal_bot: 1,
            };
        }

        if (sharedChannel && sharedSlugs.length) {
            payload = {
                ...payload,
                is_shared: true,
                token: sharedSlugs.filter(s => s.slug_name === channel.slug_owner)[0].access_token,
                slug: sharedSlugs.filter(s => s.slug_name === channel.slug_owner)[0].slug_name,
            };
        }
        dispatch(updateChannel(payload, (err, res) => {
            if (err) return;
            let updatedChannel = {
                ...channel,
                is_pinned: !channel.is_pinned,
            };
            dispatch(updateChannelReducer(updatedChannel));
        }));
    };

    const handleMuteChat = () => {
        let payload = {
            id: channel.id,
            is_pinned: channel.is_pinned,
            is_archived: channel.is_archived,
            is_muted: !channel.is_muted,
            title: channel.title,
        };
        if (sharedChannel && sharedSlugs.length) {
            payload = {
                ...payload,
                is_shared: true,
                token: sharedSlugs.filter(s => s.slug_name === channel.slug_owner)[0].access_token,
                slug: sharedSlugs.filter(s => s.slug_name === channel.slug_owner)[0].slug_name,
            };
        }
        dispatch(updateChannel(payload, (err, res) => {
            if (err) return;
            let updatedChannel = {
                ...channel,
                is_muted: !channel.is_muted,
            };
            dispatch(updateChannelReducer(updatedChannel));
        }));
    };
    const handleHideChat = () => {
        let payload = {
            id: channel.id,
            is_pinned: channel.is_pinned,
            is_archived: channel.is_archived,
            is_muted: channel.is_muted,
            title: channel.title,
            is_hide: !channel.is_hidden,
        };
        if (sharedChannel && sharedSlugs.length) {
            payload = {
                ...payload,
                is_shared: true,
                token: sharedSlugs.filter(s => s.slug_name === channel.slug_owner)[0].access_token,
                slug: sharedSlugs.filter(s => s.slug_name === channel.slug_owner)[0].slug_name,
            };
        }
        if (channel.total_unread > 0) {
            dispatch(markReadChannel({channel_id: channel.id}));
        }
        dispatch(updateChannel(payload, (err, res) => {
            if (err) return;
            let updatedChannel = {
                ...channel,
                selected: false,
                is_hidden: channel.is_hidden === 0 ? 1 : 0,
                total_unread: 0,
            };
            dispatch(updateChannelReducer(updatedChannel));
            if (selectedChannel.id === channel.id) {
                //dispatch(setSelectedChannel(props.firstChannel));
            }
        }));
    };

    const handleArchiveChat = () => {
        let payload = {
            id: channel.id,
            is_pinned: channel.is_pinned,
            is_archived: channel.is_archived === 0 ? 1 : 0,
            is_muted: channel.is_muted,
            title: channel.title,
        };
        if (sharedChannel && sharedSlugs.length) {
            payload = {
                ...payload,
                is_shared: true,
                token: sharedSlugs.filter(s => s.slug_name === channel.slug_owner)[0].access_token,
                slug: sharedSlugs.filter(s => s.slug_name === channel.slug_owner)[0].slug_name,
            };
        }
        dispatch(
            updateChannel(payload, (err, res) => {
                if (err) return;
                if (channel.is_archived === 1) {
                    dispatch(
                        updateChannelReducer({
                            ...channel,
                            is_archived: 0,
                        }),
                    );
                }
            }),
        );
    };
    const handleShowArchiveConfirmation = () => {

        let payload = {
            type: "confirmation",
            headerText: "Chat archive",
            submitText: "Archive",
            cancelText: "Cancel",
            bodyText: "Are you sure you want to archive this chat?",
            actions: {
                onSubmit: handleArchiveChat,
            },
        };

        if (channel.is_archived === 1) {
            payload = {
                ...payload,
                submitText: "Unarchive",
                bodyText: "Are you sure you want to unarchive this chat?",
            };
        }

        dispatch(
            addToModals(payload),
        );
    };

    const handleMarkAsUnreadSelected = e => {
        e.stopPropagation();
        handleShowMoreOptions();
        let payload = {
            channel_id: channel.id,
        };
        if (sharedChannel && sharedSlugs.length) {
            payload = {
                ...payload,
                is_shared: true,
                token: sharedSlugs.filter(s => s.slug_name === channel.slug_owner)[0].access_token,
                slug: sharedSlugs.filter(s => s.slug_name === channel.slug_owner)[0].slug_name,
            };
        }

        if (channel.total_unread === 0 && channel.is_read === 1) {
            dispatch(markUnreadChannel(payload, (err, res) => {
                if (err) return;
                let updatedChannel = {
                    ...channel,
                    mark_unread: !channel.mark_unread,
                    mark_new_messages_as_read: true,
                    is_read: 0,
                    total_unread: 0,
                    minus_count: channel.total_unread,
                };
                //props.updateChannelAction(updatedChannel);
                dispatch(updateUnreadChatReplies(updatedChannel));
            }));
        } else {
            dispatch(markReadChannel(payload, (err, res) => {
                if (err) return;
                let updatedChannel = {
                    ...channel,
                    mark_new_messages_as_read: false,
                    mark_unread: channel.mark_unread,
                    is_read: 1,
                    total_unread: 0,
                    minus_count: channel.total_unread,
                };
                //props.updateChannelAction(updatedChannel);
                dispatch(updateUnreadChatReplies(updatedChannel));
            }));
        }
    };
    const handleShowMoreOptions = () => {
        setShowMoreOptions(!showMoreOptions);
        props.onShowOptions();
    };

    return <>
        <Wrapper channel={channel} scrollRef={scrollEl}>
            <div onClick={handlePinButton}>
                {channel.is_pinned ? `Unfavorite` : `Favorite`}
            </div>
            <div onClick={e => handleMarkAsUnreadSelected(e)}>
                {(channel.mark_unread || (!channel.mark_unread && channel.total_unread > 0)) ? `Mark as Read` : `Mark as Unread`}
            </div>
            <div onClick={handleMuteChat}>
                {channel.is_muted ? `Unmute` : `Mute`}
            </div>
            {
                channel.type !== "PERSONAL_BOT" &&
                <div onClick={handleHideChat}>
                    {channel.is_hidden === 0 ? `Hide` : "Unhide"}
                </div>
            }
            {
                (channel.type !== "PERSONAL_BOT" || channel.type !== "COMPANY") &&
                <div onClick={handleShowArchiveConfirmation}>
                    {channel.is_archived === 0 ? `Archive` : "Unarchive"}
                </div>
            }
        </Wrapper>
    </>;
};

export default React.memo(ChannelOptions);

