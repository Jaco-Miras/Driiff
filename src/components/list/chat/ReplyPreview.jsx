import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import {renderToString} from "react-dom/server";
import SvgImage from "../../common/SvgImage";
import quillHelper from "../../../helpers/quillHelper";
import {_t} from "../../../helpers/stringFormatter";

const PreviewTextContainer = styled.div`
`
const LastReplyContent = styled.span`
    color: #676767;
    font-size: 1rem;
    align-items: center;
    font-weight: 400;
    display: inline-block;  
`;
const DraftContent = styled.span`
    display: block;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
`;
const LastReplyName = styled.span`
    display: inline-block;
    font-weight: 400;
    font-size: 1rem;    
    color: #676767;
    margin-right: 2px;
`;
const LastReplyBody = styled.div`
    display: inherit;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    color: #676767;
    font-size: 1rem;
    font-weight: ${props => props.isUnread ? "bold" : "normal"};

    span{
        font-weight: inherit;
    }

    span.is-deleted {
        font-style: italic;
        color: #9d9d9d;
    }
    
    .mention {
        background-color: transparent;
    }    
    
      img {
        height: 1rem;
        display: inline-block;
        
        &.anchor-blot {
            display: none;
        }
      }
      .image-video-icon,
      .reply-icon {
        filter: brightness(0) saturate(100%) invert(41%) sepia(0%) saturate(1%) hue-rotate(245deg) brightness(93%) contrast(83%);
        min-width: 1rem;
        min-height: 1rem;
        margin: 0 4px;
        position: relative;
        //top: 4px;
        
        .active & {
            filter: brightness(0) saturate(100%) invert(41%) sepia(0%) saturate(1%) hue-rotate(245deg) brightness(93%) contrast(83%);
        }
    
        &:hover {
          filter: ${props => (props.selected ? "brightness(0) invert(1)" : "none")};
        }
      }
      
      .image-video-icon {
        top: 4px;
      }
`;

const ReplyPreview = props => {
    const {channel} = props
    //const settings  = useSelector(state => state.user.settings)
    const user  = useSelector(state => state.session.user)
    const channelDrafts  = useSelector(state => state.chat.channelDrafts)
    const [previewText, setPreviewText] = useState("")

    useEffect(() => {
        let showPreviewIcon = false;
        let previewText = "";
        let lastReplyBody = "";
        //if (channel.last_reply && settings.CHAT_SETTINGS.preview_message) {
        if (channel.last_reply) {
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
                        <SvgImage className={`image-video-icon`} icon={`image-video`}/>,
                    ) + previewText;
            }

            if (channel.last_reply.user) {
                if (channel.last_reply.user && channel.last_reply.user.id === user.id) {
                    previewText =
                        renderToString(<SvgImage className={`reply-icon`} icon={`reply`}/>) + previewText;
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
    }, [channel.last_reply, channel.replies, channel.id, user.id, channelDrafts]);
    return (
        <PreviewTextContainer>
            <LastReplyBody
                isUnread={channel.total_unread > 0}
                className={`last-reply-body`}
                dangerouslySetInnerHTML={{
                    __html: previewText,
                }}
            />
        </PreviewTextContainer>
    )
}

export default ReplyPreview