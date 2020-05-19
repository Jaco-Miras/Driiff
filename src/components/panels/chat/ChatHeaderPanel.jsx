import React from "react";
import { useSelector, useDispatch} from "react-redux";
import styled from "styled-components";
import { SvgIconFeather } from "../../common";
import { updateChannel } from "../../../redux/actions/chatActions";
import { addToModals } from "../../../redux/actions/globalActions";
import ChatMembers from "../../list/chat/ChatMembers";
import ChatTitleTyping from "../../list/chat/ChatTitleTyping";

const Wrapper = styled.div`
`;


const IconButton = styled(SvgIconFeather)`
    border: 1px solid #afb8bd;
    border-radius: 8px;
    padding: 0px 12px;
    height: 30px;
    width: 40px;
`;

const ChatHeaderPanel = (props) => {

    const {className = ""} = props;

    const dispatch = useDispatch();
    const chatChannel = useSelector(state => state.chat.selectedChannel);
    const sharedSlugs = useSelector(state => state.global.slugs);

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

    if (chatChannel === null)
        return null;

    return (
        <Wrapper className={`chat-header border-bottom ${className}`}>
            <div className="d-flex align-items-center">
                <ChatMembers/>
                {
                    chatChannel !== null && <ChatTitleTyping/>
                }
                <div className="ml-auto">
                    <ul className="nav align-items-center">
                        <li className="mr-4 d-sm-inline d-none">
                            <IconButton icon={`edit-3`}/>
                        </li>
                        <li className="mr-4 d-sm-inline d-none">
                            <IconButton icon={`trash`} onClick={handleShowArchiveConfirmation}/>
                        </li>
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