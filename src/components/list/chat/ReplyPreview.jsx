import React from "react";
import { renderToString } from "react-dom/server";
import { useSelector } from "react-redux";
import styled from "styled-components";
import quillHelper from "../../../helpers/quillHelper";
import { SvgIcon } from "../../common";

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
  text-overflow: ellipsis;
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

const ReplyPreview = (props) => {
  const { channel, drafts, dictionary } = props;
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
      lastReplyBody = quillHelper.parseEmoji(channel.last_reply.body);
      lastReplyBody = renderToString(<LastReplyContent className="last-reply-content" dangerouslySetInnerHTML={{ __html: lastReplyBody }} />);

      //strip html tags and replace it with space
      lastReplyBody = lastReplyBody.replace(/(<([^>]+)>)/gi, " ");
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
      } else {
        previewText = renderToString(<LastReplyName className="last-reply-name">{channel.last_reply.user.first_name}:</LastReplyName>) + " " + previewText;
      }

      previewText = previewText.replace("NEW_ACCOUNT_ACTIVATED", "New account activated");
      previewText = previewText.replace("ACCOUNT_DEACTIVATED", "Account deactivated");

      //system message
    } else {
      previewText = "System message update...";
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
    </Wrapper>
  );
};

export default React.memo(ReplyPreview);
