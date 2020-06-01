import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useRouteMatch} from "react-router-dom";
import styled from "styled-components";
import {updateChannel} from "../../../redux/actions/chatActions";
import {addToModals} from "../../../redux/actions/globalActions";
import {SvgIconFeather} from "../../common";
import ChatMembers from "../../list/chat/ChatMembers";
import ChatTitleTyping from "../../list/chat/ChatTitleTyping";

const Wrapper = styled.div`
    position: relative;
    z-index: 2;
`;


const IconButton = styled(SvgIconFeather)`
    border: 1px solid #afb8bd;
    border-radius: 8px;
    padding: 0px 12px;
    height: 30px;
    width: 40px;
    cursor: pointer;
    cursor: hand;
    transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
    &:hover {
        background: #afb8bd;
        color: #ffffff;
    }
`;

const ChatHeaderPanel = (props) => {

    const {className = ""} = props;

    const dispatch = useDispatch();
    const routeMatch = useRouteMatch();
    const chatChannel = useSelector(state => state.chat.selectedChannel);
    const sharedSlugs = useSelector(state => state.global.slugs);
    const [page, setPage] = useState("chat");

    const handleArchiveChat = () => {
        let payload = {
            id: chatChannel.id,
            is_pinned: chatChannel.is_pinned,
            is_archived: chatChannel.is_archived === 0 ? 1 : 0,
            is_muted: chatChannel.is_muted,
            title: chatChannel.title,
        };
        if (chatChannel.is_shared && sharedSlugs.length) {
            payload = {
                ...payload,
                is_shared: true,
                token: sharedSlugs.filter(s => s.slug_name === chatChannel.slug_owner)[0].access_token,
                slug: sharedSlugs.filter(s => s.slug_name === chatChannel.slug_owner)[0].slug_name,
            };
        }
        dispatch(
            updateChannel(payload),
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

        dispatch(
            addToModals(payload),
        );
    };

    const handleShowChatEditModal = () => {

        let payload = {
            type: "chat_create_edit",
            mode: "edit",
        };

        dispatch(
            addToModals(payload),
        );
    };

    useEffect(() => {
        setPage(routeMatch.path.split("/").filter(p => {
            return p.length !== 0;
        })[0]);
    }, [routeMatch.path, setPage]);

    if (chatChannel === null)
        return null;

    return (
        <Wrapper className={`chat-header border-bottom ${className}`}>
            <div className="d-flex align-items-center">
                {
                    page === "chat" &&
                    <>
                        <ChatMembers/>
                        <ChatTitleTyping/>
                    </>
                }
                {
                    page === "workspace" &&
                    <>
                        <ChatMembers page={"workspace"}/>
                        <ChatTitleTyping page={"workspace"}/>
                    </>
                }
                <div className="ml-auto">
                    {
                        page === "workspace" &&
                        <ChatMembers/>
                    }
                    <ul className="nav align-items-center">
                        {
                            (["DIRECT", "PERSONAL_BOT", "COMPANY", "TOPIC"].includes(chatChannel.type) === false) &&
                            <>
                                <li className="mr-4 d-sm-inline d-none">
                                    <IconButton icon={`edit-3`} onClick={handleShowChatEditModal}/>
                                </li>
                            </>
                        }
                        {
                            (["PERSONAL_BOT", "COMPANY", "TOPIC"].includes(chatChannel.type) === false) &&
                            <>
                                <li className="mr-4 d-sm-inline d-none">
                                    <IconButton icon={`trash`} onClick={handleShowArchiveConfirmation}/>
                                </li>
                            </>
                        }
                        <li className="ml-4 mobile-chat-close-btn">
                            <IconButton icon={`x`}/>
                        </li>
                    </ul>
                </div>
            </div>
        </Wrapper>
    );
};

export default React.memo(ChatHeaderPanel);