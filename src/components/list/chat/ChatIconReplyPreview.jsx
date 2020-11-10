import React from "react";
import { renderToString } from "react-dom/server";
import { useSelector } from "react-redux";
import styled from "styled-components";
import quillHelper from "../../../helpers/quillHelper";
import { stripHtml, stripGif, stripImgTag } from "../../../helpers/stringFormatter";
import { SvgIcon } from "../../common";
import { SvgIconFeather } from "../../common";
import ChannelOptions from "./ChannelOptions";

const Wrapper = styled.span`
  display: table;
  table-layout: fixed;
  width: 100%;
`;
const LastReplyContent = styled.span``;
const DraftContent = styled.span``;
const LastReplyName = styled.span``;
const LastReplyBody = styled.div`
  min-width: 200px;
  max-height: 40px;
  min-height: 24px;
  display: table-cell;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  svg {
    margin-right: 4px;
    display: inline;
  }
`;
const TextIcon = styled(SvgIcon)`
  max-width: 12px;
`;
const Icon = styled(SvgIconFeather)`
  position: relative;
  top: -3px;
  right: 0;
  width: 15px;
  height: 15px;
`;
const ActionContainer = styled.div`
  position: relative;
  top: 2px;
  display: flex;
  flex-direction: row-reverse;
`;
const Badge = styled.span`
  color: #fff !important;
  min-height: 18px;
  width: 24px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 0;
  &.unread {
    color: #7a1b8b !important;
    display: none;
  }
`;

const ReplyPreview = (props) => {
  const { channel, drafts, dictionary, selectedChannel } = props;
  const settings = useSelector((state) => state.settings.user.CHAT_SETTINGS);
  const user = useSelector((state) => state.session.user);
  //const channelDrafts = useSelector((state) => state.chat.channelDrafts);

  let showPreviewIcon = false;
  let previewText = "";
  let lastReplyBody = "";
  if (channel.last_reply && settings.preview_message) {
    if (channel.last_reply.is_deleted) {
      lastReplyBody = "<span class=\"is-deleted\">" + dictionary.messageRemoved + "</span>";
    } else {
      //strip gif to prevent refetching of gif
      lastReplyBody = quillHelper.parseEmoji(stripImgTag(channel.last_reply.body));
      lastReplyBody = renderToString(<LastReplyContent className="last-reply-content" dangerouslySetInnerHTML={{ __html: lastReplyBody }} />);

      //strip html tags and replace it with space
      //lastReplyBody = lastReplyBody.replace(/(<([^>]+)>)/gi, " ");
      lastReplyBody = stripHtml(lastReplyBody)
    }

    if (channel.last_reply.body === "" || (channel.last_reply.files && channel.last_reply.files.length) || (channel.replies.length && channel.replies[channel.replies.length - 1].files.length) || channel.last_reply.body.match(/<img/)) {
      showPreviewIcon = true;
    }

    previewText += lastReplyBody;
    const noText = previewText.replace(/\s/g, "");

    if (showPreviewIcon) {
      previewText = renderToString(<TextIcon icon={"image-video"} />) + previewText;
    }

    if (channel.last_reply.user) {
      if (channel.last_reply.user && channel.last_reply.user.id === user.id) {
        if (!noText && showPreviewIcon) {
          previewText = previewText + "Photo";
        }
        previewText = renderToString(<LastReplyName
          className="last-reply-name">{dictionary.you}:</LastReplyName>) + " " + previewText;
      } else {
        previewText = renderToString(<LastReplyName className="last-reply-name">{channel.last_reply.user.first_name}:</LastReplyName>) + " " + previewText;
      }

      previewText = previewText.replace("NEW_ACCOUNT_ACTIVATED", "New account activated");
      previewText = previewText.replace("ACCOUNT_DEACTIVATED", "Account deactivated");

      //system message
    } else {
      previewText = "System message update...";
      if (channel.last_reply.body.includes("POST_CREATE::")) {
        let item = JSON.parse(channel.last_reply.body.replace("POST_CREATE::", ""));
        previewText = `${item.author.first_name} has created the post ${item.post.title}`;
      }
    }

    if (typeof drafts[channel.id] !== "undefined") {
      if (drafts[channel.id].text && drafts[channel.id].text !== "<div><br></div>") {
        previewText = `DRAFT:&nbsp;${renderToString(<DraftContent dangerouslySetInnerHTML={{ __html: drafts[channel.id].text.replace(/(<([^>]+)>)/gi, " ") }} />)}`;
      } else if (drafts[channel.id].reply_quote) {
        previewText = `QUOTE:&nbsp;${drafts[channel.id].reply_quote.body}&nbsp;~${drafts[channel.id].reply_quote.user.name}`;
      }
    }
  }

  return (
    <Wrapper className={"small text-muted "}>
      <LastReplyBody
        isUnread={channel.total_unread > 0}
        className={"last-reply-body"}
        dangerouslySetInnerHTML={{
          __html: previewText,
        }}
      />
      <div className="chat-timestamp">
        <div className="d-flex align-items-center flex-row-reverse">
          <ChannelOptions className="ml-1" moreButton="chevron-down" selectedChannel={selectedChannel} channel={channel}/>
          {
            channel.add_user === false && (!channel.is_read || channel.total_unread > 0) && (
              <Badge
                className={`badge badge-primary badge-pill ml-1 ${!channel.is_read && channel.total_unread === 0 ? "unread" : ""}`}>{channel.total_unread > 0 ? channel.total_unread : !channel.is_read ? "0" : null}</Badge>
            )
          }
          <ActionContainer>
            {channel.is_pinned && <Icon icon="star"/>}
            {channel.is_muted && <Icon icon="volume-x" className={`${channel.is_pinned && "mr-1"}`}/>}
          </ActionContainer>
        </div>
      </div>
    </Wrapper>
  );
};

export default React.memo(ReplyPreview);
