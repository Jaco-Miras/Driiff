import React, {useState} from "react";
import {useDispatch} from "react-redux";
import {addToModals} from "../../../redux/actions/globalActions";
import useChatMessageActions from "../../hooks/useChatMessageActions";

import {MoreOptions} from "../../panels/common";

const ChatMessageOptions = props => {

    const {isAuthor, replyData, className = "", selectedChannel} = props;
    const [showMoreOptions, setShowMoreOptions] = useState(false);
    const dispatch = useDispatch();
    const scrollEl = document.getElementById("infinite-scroll-chat-replies");

    const chatMessageActions = useChatMessageActions();

    const handleDeleteReply = () => {
        chatMessageActions.remove(replyData.id);
    };

    const handleRemoveReply = () => {
        let payload = {
            type: "confirmation",
            headerText: "Delete chat",
            submitText: "Delete",
            cancelText: "Cancel",
            bodyText: "Are you sure you want to delete this chat?",
            actions: {
                onSubmit: handleDeleteReply,
            },
        };

        dispatch(
            addToModals(payload),
        );
    };

    const handleEditReply = () => {
        chatMessageActions.setEdit(replyData);
    };

    const handleQuoteReply = () => {
        chatMessageActions.setQuote(replyData);
    };

    const handleSetReminder = () => {
        let payload = {
            type: "reminder",
            message: replyData,
        };

        dispatch(
            addToModals(payload),
        );
    };

    const handleCopyLink = e => {
        e.stopPropagation();
        chatMessageActions.clipboardLink(selectedChannel, replyData);
        setShowMoreOptions(!showMoreOptions);
    };

    const handleForwardMessage = () => {
        let payload = {
            type: "forward",
            channel: selectedChannel,
            message: replyData,
        };

        dispatch(
            addToModals(payload),
        );
    };

    return (
        <MoreOptions className={className} scrollRef={scrollEl}>
            <div onClick={handleSetReminder}>Remind me about this</div>
            {
                isAuthor && replyData.hasOwnProperty("is_transferred") && !replyData.is_transferred &&
                <div onClick={handleEditReply}>Edit</div>
            }
            <div onClick={handleQuoteReply}>Quote</div>
            {
                isAuthor &&
                <div onClick={handleRemoveReply}>Remove</div>
            }
            <div onClick={handleCopyLink}>Copy message link</div>
            <div onClick={handleForwardMessage}>Forward</div>
        </MoreOptions>
    );
};

export default React.memo(ChatMessageOptions);