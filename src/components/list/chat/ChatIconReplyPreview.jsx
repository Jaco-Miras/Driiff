import React, { useEffect, useRef, useState } from "react";
import { renderToString } from "react-dom/server";
import { useSelector } from "react-redux";
import styled from "styled-components";
import quillHelper from "../../../helpers/quillHelper";
import { stripHtml, stripImgTag } from "../../../helpers/stringFormatter";
import { SvgIcon, SvgIconFeather } from "../../common";
import ChannelOptions from "./ChannelOptions";

const Wrapper = styled.span`
  //display: flex;
  display: table;
  table-layout: fixed;
  width: 100%;
  font-weight: ${(props) => (props.hasUnRead ? "bold" : "normal")};
`;
const LastReplyContent = styled.span`
  display: flex;
`;
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
  line-height: 2;
  width: calc(100% - ${(props) => props.iconWidth}px);
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
  top: -2px;
  right: 0;
  width: 15px;
  height: 15px;
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

  const [iconWidth, setIconWidth] = useState(0);
  const refs = {
    icons: useRef(null),
  };

  let showPreviewIcon = false;
  let previewText = "";
  let lastReplyBody = "";
  if (channel.last_reply && settings.preview_message) {



    if (channel.last_reply.is_deleted) {
      lastReplyBody = "<span class=\"is-deleted\">" + dictionary.messageRemoved + "</span>";
    } else {

      let lastReplyBodyHtml = (channel.is_translate && channel.last_reply.translated_body) ? channel.last_reply.translated_body : channel.last_reply.body;

      var div = document.createElement('div');
      div.innerHTML = lastReplyBodyHtml;
      var elements = div.getElementsByClassName('OriginalHtml');
      while (elements[0])
        elements[0].parentNode.removeChild(elements[0])

      lastReplyBody = div.innerHTML;
      //strip gif to prevent refetching of gif
      lastReplyBody = quillHelper.parseEmoji(stripImgTag(lastReplyBody));
      lastReplyBody = renderToString(<LastReplyContent className="last-reply-content" dangerouslySetInnerHTML={{ __html: lastReplyBody }} />);

      //strip html tags and replace it with space
      try {
        lastReplyBody = lastReplyBody.replace(/<?(data-value)="[^"]*"/g, " ").replace(/(<([^>]+)>)/gi, " ");
      } catch (e) {
        lastReplyBody = stripHtml(lastReplyBody);
      }
      //lastReplyBody = stripHtml(lastReplyBody);
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
      if (channel.last_reply.body.includes("POST_CREATE::")) {
        let parsedData = channel.last_reply.body.replace("POST_CREATE::", "");
        if (parsedData.trim() !== "") {
          let item = JSON.parse(channel.last_reply.body.replace("POST_CREATE::", ""));
          previewText = `${item.author.first_name} has created the post ${item.post.title}`;
        }
      }
      if (channel.last_reply.body.includes("ZAP_SUBMIT::")) {
        previewText = "System message update...";
      }
      if (channel.last_reply.user && channel.last_reply.user.id === user.id) {
        if (!noText && showPreviewIcon) {
          previewText = previewText + "Photo";
        }
        previewText = renderToString(<LastReplyName className="last-reply-name">{dictionary.you}:</LastReplyName>) + " " + previewText;
      } else {
        previewText = renderToString(<LastReplyName className="last-reply-name">{(channel.last_reply.user.first_name) ?? channel.last_reply.user.name}:</LastReplyName>) + " " + previewText;
      }

      previewText = previewText.replace("NEW_ACCOUNT_ACTIVATED", "New account activated");
      previewText = previewText.replace("ACCOUNT_DEACTIVATED", "Account deactivated");

      //system message
    } else {
      previewText = "System message update...";

      if (channel.last_reply.body.includes("POST_CREATE::")) {
        // console.log(channel.last_reply.body, channel.last_reply);
        let parsedData = channel.last_reply.body.replace("POST_CREATE::", "");
        if (parsedData.trim() !== "") {
          let item = JSON.parse(channel.last_reply.body.replace("POST_CREATE::", ""));
          previewText = `${item.author.first_name} has created the post ${item.post.title}`;
        }
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

  useEffect(() => {
    if (refs.icons.current) {
      setIconWidth(refs.icons.current.clientWidth);
    }
  }, [refs.icons, channel]);

  const hasUnRead = channel.add_user === false && (!channel.is_read || channel.total_unread > 0);

  return (
    <Wrapper hasUnRead={channel.total_unread > 0} className={"d-flex justify-content-between align-items-center small text-muted "}>
      <LastReplyBody
        iconWidth={iconWidth}
        isUnread={channel.total_unread > 0}
        className={"last-reply-body"}
        dangerouslySetInnerHTML={{
          __html: previewText,
        }}
      />
      <div ref={refs.icons} className="chat-timestamp d-inline-flex justify-content-center align-items-end flex-row-reverse">
        <ChannelOptions className="ml-1" moreButton="chevron-down" selectedChannel={selectedChannel} channel={channel} />
        {channel.total_unread === 0 && channel.is_read === false ? (
          <>
            <Badge className={"badge badge-primary badge-pill ml-1"}>&nbsp;</Badge>
          </>
        ) : (
          <>
            {hasUnRead && <Badge className={`badge badge-primary badge-pill ml-1 ${!channel.is_read && channel.total_unread === 0 ? "unread" : ""}`}>{channel.total_unread > 0 ? channel.total_unread : !channel.is_read ? "0" : null}</Badge>}
          </>
        )}
        {channel.is_muted && <Icon icon="volume-x" className={`${channel.is_pinned && "mr-1"}`} />}
      </div>
    </Wrapper>
  );
};

export default React.memo(ReplyPreview);
