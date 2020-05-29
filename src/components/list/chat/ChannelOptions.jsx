import React, {useEffect, useRef, useState} from "react";
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
import {SvgIconFeather} from "../../common";
import {useOutsideClick, useTooltipOrientation, useTooltipPosition} from "../../hooks";

const MoreButton = styled(SvgIconFeather)`
    ${"" /* background: ${props => (props.show && !props.selected ? "#972c86" : "#fff")}; */}
    opacity: ${props => (props.show && !props.selected ? "1 !important" : "0")};
    border-radius: 50%;
    width: 15px;
    height: 15px;
    cursor: pointer;
`;
const MoreTooltip = styled.div`
  z-index: 5;
  width: 160px;
  height: auto;
  background-color: #ffffff;
  color: #4d4d4d;
  border-radius: 8px;
  position: absolute;
  right: 6px;
  padding: 8px 0px;
  cursor: pointer;
  box-shadow: 0 5px 10px -1px rgba(0,0,0,.15);
  border-top: 1px solid #eeeeee !important;
  ${'' /* &.orientation-top {
    bottom: 45px;

    &:before {
        right 12px;
        bottom: -15px;
        content: "";
        position: absolute;
        border-width: ${props => props.orientation === "bottom" ? "13px" : "unset"};
        border-style: ${props => props.orientation === "bottom" ? "solid" : "unset"};
        border-color: ${props => props.orientation === "bottom" ? "transparent transparent rgba(0, 0, 0, 0.1) transparent" : "unset"};
        border-left: ${props => props.orientation === "top" && "13px solid transparent"};
        border-right: ${props => props.orientation === "top" && "13px solid transparent"};
        border-top: ${props => props.orientation === "top" && "13px solid rgba(0,0,0,0.1)"};

        @media (max-width: 1199.99px) {
            right: auto;
            left: -21px;
            bottom: 11px;
            transform: rotate(90deg);
        }

        @media (max-width: 575.99px) {
            right: -21px;
            left: auto;
            transform: rotate(-90deg);
        }
  } */}

    &:after {
        right 12px;
        bottom: -13px;
        content: "";
        position: absolute;
        border-width: ${props => props.orientation === "bottom" ? "10px" : "unset"};
        border-style: ${props => props.orientation === "bottom" ? "solid" : "unset"};
        border-color: ${props => props.orientation === "bottom" ? "transparent transparent #FAFAFA transparent" : "unset"};
        border-left: ${props => props.orientation === "top" && "13px solid transparent"};
        border-right: ${props => props.orientation === "top" && "13px solid transparent"};
        border-top: ${props => props.orientation === "top" && "13px solid #fafafa"};

        @media (max-width: 1199.99px) {
            left: -19px;
            right: auto;
            bottom: 10px;
            transform: rotate(90deg);
        }

        @media (max-width: 575.99px) {
            right: -19px;
            left: auto;
            transform: rotate(-90deg);
        }
      }

        @media (max-width: 1199.99px) {
          position: fixed;
          bottom: ${props => props.position - 30}px;
          left: 465px;
        }

        @media (max-width: 991.99px) {
            left: 375px;
        }

        @media (max-width: 767.99px) {
            left: 200px;
        }

        @media (max-width: 575.99px) {
            right: 75px;
            left: auto;
        }
    }

    &.orientation-bottom {
        top: 100%;
    }
    > div {
        text-align: left;
        padding: 4px 24px;
        cursor: pointer;
        &:hover {
            background-color: #F0F0F0;
            color: #7A1B8B;
        }
    }
`;
const Icon = styled(SvgIconFeather)`
    &.fill {
        fill: #c3c3c3;
        color: #c3c3c3 !important;
    }
`;

const ChannelOptions = props => {
    const {channel} = props;

    const dispatch = useDispatch();
    const [showMoreOptions, setShowMoreOptions] = useState(false);
    const [tooltipAdjustment, setTooltipAdjustment] = useState(false);
    const tooltipRef = useRef();
    const moreRef = useRef();
    const scrollEl = document.getElementById("chat-channels");
    const orientation = useTooltipOrientation(moreRef, tooltipRef, scrollEl, showMoreOptions);
    const [toolTipPosition] = useTooltipPosition(moreRef, tooltipRef, scrollEl, showMoreOptions);
    const [sharedChannel, setSharedChannel] = useState(false);
    const sharedSlugs = useSelector(state => state.global.slugs);
    const selectedChannel = useSelector(state => state.chat.selectedChannel);

    useEffect(() => {
        if (channel.is_shared) {
            setSharedChannel(true);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (tooltipRef.current) {
            let i = tooltipRef.current.querySelectorAll("div").length;

            if (i > 4) {
                tooltipRef.current.classList.remove("top");
                setTooltipAdjustment(true);
            } else {
                setTooltipAdjustment(false);
            }
        }
    }, [showMoreOptions]);

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
    useOutsideClick(tooltipRef, handleShowMoreOptions, showMoreOptions);


    return <>
        <MoreButton
            icon="more-horizontal"
            className={`more-button-component ${showMoreOptions ? "active" : ""}`}
            show={showMoreOptions}
            ref={moreRef}
            onClick={e => {
                e.stopPropagation();
                handleShowMoreOptions();
            }}
            data-event="touchstart focus mouseover"
            data-event-off="mouseout"
            data-tip="Options"
        />
        {
            showMoreOptions &&
            <MoreTooltip
                ref={tooltipRef}
                className={`more-options-tooltip ${tooltipAdjustment ? "adjust" : ""} orientation-${orientation.vertical}`}
                position={toolTipPosition}
                orientation={orientation.vertical}>
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
            </MoreTooltip>
        }
    </>;
};

export default React.memo(ChannelOptions);

