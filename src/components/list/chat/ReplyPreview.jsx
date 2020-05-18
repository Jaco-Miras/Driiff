import React, {useEffect, useState} from "react";
import {renderToString} from "react-dom/server";
import {useSelector} from "react-redux";
import styled from "styled-components";
import quillHelper from "../../../helpers/quillHelper";
import {_t} from "../../../helpers/stringFormatter";
import {SvgIcon} from "../../common";

const Wrapper = styled.span`
`;
const LastReplyContent = styled.span`      
`;
const DraftContent = styled.span`
`;
const LastReplyName = styled.span`
`;
const LastReplyBody = styled.div`
`;
const TextIcon = styled(SvgIcon)`
    filter: brightness(0) saturate(100%) invert(79%) sepia(14%) saturate(364%) hue-rotate(194deg) brightness(86%) contrast(88%);
    width: 11px;
    height: 11px;
    
    &.icon-image-video {
        margin-left: 0.2rem;
    }
`;

const ReplyPreview = props => {
    const {channel} = props;
    const settings = useSelector(state => state.settings.userSettings);
    const user = useSelector(state => state.session.user);
    const channelDrafts = useSelector(state => state.chat.channelDrafts);
    const [previewText, setPreviewText] = useState("");

    useEffect(() => {
        let showPreviewIcon = false;
        let previewText = "";
        let lastReplyBody = "";
        if (channel.last_reply && settings.CHAT_SETTINGS.preview_message) {
            if (channel.last_reply.is_deleted) {
                lastReplyBody = _t(
                    channel.last_reply.body,
                    "The chat message has been deleted",
                );
                lastReplyBody = "<span class=\"is-deleted\">" + lastReplyBody + "</span>";
            } else {
                lastReplyBody = quillHelper.parseEmoji(channel.last_reply.body);
                lastReplyBody = renderToString(<LastReplyContent
                    className="last-reply-content"
                    dangerouslySetInnerHTML={{__html: lastReplyBody}}/>);

                //strip html tags and replace it with space
                lastReplyBody = lastReplyBody.replace(/(<([^>]+)>)/ig, " ");
            }

            if (channel.last_reply.body === "" ||
                (channel.last_reply.files && channel.last_reply.files.length) ||
                (channel.replies.length && channel.replies[channel.replies.length - 1].files.length) ||
                channel.last_reply.body.match(/<img/)) {
                showPreviewIcon = true;
            }

            previewText += lastReplyBody;

            if (showPreviewIcon) {
                previewText =
                    renderToString(
                        <TextIcon icon={`image-video`}/>,
                    ) + previewText;
            }

            if (channel.last_reply.user) {
                if (channel.last_reply.user && channel.last_reply.user.id === user.id) {
                    previewText =
                        renderToString(<TextIcon icon={`reply`}/>) + previewText;
                } else {
                    previewText =
                        renderToString(
                            <LastReplyName className="last-reply-name">
                                {channel.last_reply.user.first_name}:
                            </LastReplyName>,
                        ) + previewText;
                }

                previewText = previewText.replace("NEW_ACCOUNT_ACTIVATED", "New account activated");
                previewText = previewText.replace("ACCOUNT_DEACTIVATED", "Account deactivated");

                //system message
            } else {
                previewText = `System message update...`;
            }

            if (typeof channelDrafts[channel.id] !== "undefined") {
                if (channelDrafts[channel.id].text && channelDrafts[channel.id].text !== "<div><br></div>") {
                    previewText = `DRAFT:&nbsp;${renderToString(<DraftContent
                        dangerouslySetInnerHTML={{__html: channelDrafts[channel.id].text.replace(/(<([^>]+)>)/ig, " ")}}/>)}`;
                } else if (channelDrafts[channel.id].reply_quote) {
                    previewText = `QUOTE:&nbsp;${channelDrafts[channel.id].reply_quote.body}&nbsp;~${channelDrafts[channel.id].reply_quote.user.name}`;
                }
            }
        }

        setPreviewText(previewText);
    }, [channel.last_reply, channel.replies, channel.id, user.id, channelDrafts, settings.CHAT_SETTINGS.preview_message]);
    return (
        <Wrapper className={`small text-muted`}>
            <LastReplyBody
                isUnread={channel.total_unread > 0}
                className={`last-reply-body`}
                dangerouslySetInnerHTML={{
                    __html: previewText,
                }}
            />
        </Wrapper>
    );
};

export default ReplyPreview;