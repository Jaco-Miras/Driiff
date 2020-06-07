import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {copyTextToClipboard} from "../../../helpers/commonFunctions";
import {getBaseUrl} from "../../../helpers/slugHelper";
import {addQuote, deleteChatMessage, setEditChatMessage} from "../../../redux/actions/chatActions";
import {addToModals} from "../../../redux/actions/globalActions";

import {MoreOptions} from "../../panels/common";

const ChatMessageOptions = props => {
    const {isAuthor, replyData, className = "", selectedChannel} = props;
    const [showMoreOptions, setShowMoreOptions] = useState(false);
    const dispatch = useDispatch();
    const slugs = useSelector(state => state.global.slugs);
    const scrollEl = document.getElementById("infinite-scroll-chat-replies");

    const handleDeleteReply = () => {
        dispatch(
            deleteChatMessage({
                message_id: replyData.id,
                topic_id: selectedChannel.is_shared ? selectedChannel.entity_id : null,
                is_shared: !!selectedChannel.is_shared,
                slug: selectedChannel.slug_owner,
                token: slugs.length && slugs.filter(s => s.slug_name === selectedChannel.slug_owner).length ?
                       slugs.length && slugs.filter(s => s.slug_name === selectedChannel.slug_owner)[0].access_token : null,
            }),
        );
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
        dispatch(setEditChatMessage(replyData));
        if (replyData.quote) {
            let quote = {
                ...replyData.quote,
                channel_id: replyData.channel_id,
            };
            dispatch(
                addQuote(quote),
            );
        }
    };
    const handleQuoteReply = () => {
        dispatch(
            addQuote(replyData),
        );
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
        let link = `${getBaseUrl()}/chat/${selectedChannel.code}/${replyData.code}`;
        copyTextToClipboard(link);
        setShowMoreOptions(!showMoreOptions);
    };

    const handleForwardMessage = () => {
        let payload = {
            type: "forward",
            message: replyData,
        };

        dispatch(
            addToModals(payload),
        );
    };

    return (
        <>
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
        </>
    );
};

export default React.memo(ChatMessageOptions);