import React, { useEffect, useRef, useState } from "react";
import { renderToString } from "react-dom/server";
import { useSelector } from "react-redux";
import styled from "styled-components";
//import quillHelper from "../../../helpers/quillHelper";
import { stripHtml, stripImgTag } from "../../../helpers/stringFormatter";
import { SvgIcon, SvgIconFeather } from "../../common";
import ChannelOptions from "./ChannelOptions";
import { useTranslationActions } from "../../hooks";
import _ from "lodash";

const Wrapper = styled.span`
  //display: flex;
  display: table;
  table-layout: fixed;
  width: 100%;
  font-weight: ${(props) => (props.hasUnRead ? "500" : "normal")};
`;
const LastReplyContent = styled.span`
  display: flex;
`;
const DraftContent = styled.span``;
const LastReplyName = styled.span``;
const LastReplyBody = styled.div`
  color: #363636;
  font-size: 12px;
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
  .dark & {
    color: #c7c7c7;
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
    color: ${(props) => props.theme.colors.primary} !important;
    display: none;
  }
`;

const ChatHeaderBadgeContainer = styled.div`
  display: inline-block;
  align-items: center;
`;

const EyeIcon = styled(SvgIconFeather)`
  width: 0.7rem;
  height: 0.7rem;
`;

const StyledBadge = styled.div`
  display: inline-flex;
  align-items: center;
  height: 18px;
  padding: 5px !important;
  color: #363636;
  font-size: 10px;
  letter-spacing: 0;
  line-height: 12px;
  ${(props) => props.isTeam && "background:#D1EEFF !important;"}
`;

const ReplyPreview = (props) => {
  const { channel, drafts, dictionary, selectedChannel } = props;
  const { _t } = useTranslationActions();
  const settings = useSelector((state) => state.settings.user.CHAT_SETTINGS);
  const user = useSelector((state) => state.session.user);
  const workspaces = useSelector((state) => state.workspaces.workspaces);
  //const channelDrafts = useSelector((state) => state.chat.channelDrafts);

  const [iconWidth, setIconWidth] = useState(0);
  const refs = {
    icons: useRef(null),
  };

  let showPreviewIcon = false;
  let previewText = "";
  let lastReplyBody = "";

  const chatHeaderBadgeContainer = renderToString(
    <ChatHeaderBadgeContainer className="chat-header-badge">
      {channel.type === "TOPIC" && !channel.is_archived && workspaces.hasOwnProperty(channel.entity_id) && workspaces[channel.entity_id].is_lock === 1 && workspaces[channel.entity_id].active === 1 && (
        <Icon className={"ml-1"} icon={"lock"} strokeWidth="2" width={12} />
      )}
      {channel.type === "TOPIC" && workspaces.hasOwnProperty(channel.entity_id) && workspaces[channel.entity_id].is_shared && (
        <StyledBadge className={"badge badge-external mr-1"} isTeam={channel.team ? true : false}>
          <EyeIcon icon={channel.team ? "eye-off" : "eye"} className={"mr-1"} />
          {channel.team ? dictionary.withTeam : dictionary.withClient}
        </StyledBadge>
      )}
    </ChatHeaderBadgeContainer>
  );

  if (channel.last_reply && settings.preview_message) {
    if (channel.last_reply.is_deleted) {
      lastReplyBody = '<span class="is-deleted">' + dictionary.messageRemoved + "</span>";
    } else {
      let lastReplyBodyHtml = channel.is_translate && channel.last_reply.translated_body ? channel.last_reply.translated_body : channel.last_reply.body;

      var div = document.createElement("div");
      div.innerHTML = lastReplyBodyHtml;
      var elements = div.getElementsByClassName("OriginalHtml");
      while (elements[0]) elements[0].parentNode.removeChild(elements[0]);

      lastReplyBody = div.innerHTML;
      //strip gif to prevent refetching of gif
      lastReplyBody = stripImgTag(channel.last_reply.body);
      //lastReplyBody = quillHelper.parseEmoji(stripImgTag(channel.last_reply.body));
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
      if (channel.last_reply.body.includes("ZOOM_MESSAGE::")) {
        // const splitStr = channel.last_reply.body.split("::");
        // const str = `${splitStr[1]}`;
        // const data = JSON.parse(str);
        // previewText = data.message;
        // previewText += renderToString(previewText);
        previewText = "I started a ZOOM meeting: Click here to join";
      }
      if (channel.last_reply.body.includes("ZAP_SUBMIT::")) {
        previewText = "System message update...";
      }
      let x = "";
      if (channel.last_reply.user && channel.last_reply.user.id === user.id) {
        let fileType = "";
        if (!noText && showPreviewIcon) {
          const lastReply = _.last(channel.replies);
          if (lastReply && lastReply.files.length > 0) {
            switch (_.last(lastReply.files).type) {
              case "image":
                fileType = "Photo";
                break;
              case "video":
                fileType = "Video";
                break;
              default:
                fileType = "File";
            }
          }

          previewText = previewText + fileType;
        }
        previewText = chatHeaderBadgeContainer + renderToString(<LastReplyName className="last-reply-name">{dictionary.you}:</LastReplyName>) + " " + previewText;
      } else {
        previewText = chatHeaderBadgeContainer + renderToString(<LastReplyName className="last-reply-name">{channel.last_reply.user.first_name}:</LastReplyName>) + " " + previewText;
      }

      previewText = previewText.replace("NEW_ACCOUNT_ACTIVATED", "New account activated");
      previewText = previewText.replace("ACCOUNT_DEACTIVATED", "Account deactivated");

      //system message
    } else {
      if (channel.last_reply && channel.last_reply.body.startsWith("GOOGLE_MEETING::")) {
        const data = JSON.parse(channel.last_reply.body.replace("GOOGLE_MEETING::", ""));
        previewText = chatHeaderBadgeContainer + `${_t("GOOGLE_MEET_LAST_REPLY_PREVIEW", "::first_name::: initiated a google meeting", { first_name: data.author.first_name })}`;
      } else if (channel.last_reply && channel.last_reply.body.startsWith("LEFT_MEETING::")) {
        const data = JSON.parse(channel.last_reply.body.replace("LEFT_MEETING::", ""));
        let parseBody = `${_t("LEFT_MEETING_PREVIEW", "::first_name::: has left the call", { first_name: data.participant.name })}`;
        previewText = chatHeaderBadgeContainer + parseBody;
      } else if (channel.last_reply && channel.last_reply.body.startsWith("DRIFF_TALK::")) {
        const data = JSON.parse(channel.last_reply.body.replace("DRIFF_TALK::", ""));
        let parseBody = `${_t("DRIFF_TALK_MEETING_PREVIEW", "::first_name::: initiated a meeting", { first_name: data.author.first_name })}`;
        previewText = chatHeaderBadgeContainer + parseBody;
      } else {
        previewText = chatHeaderBadgeContainer + "System message update...";

        if (channel.last_reply.body.includes("POST_CREATE::")) {
          // console.log(channel.last_reply.body, channel.last_reply);
          let parsedData = channel.last_reply.body.replace("POST_CREATE::", "");
          if (parsedData.trim() !== "") {
            let item = JSON.parse(channel.last_reply.body.replace("POST_CREATE::", ""));
            previewText = chatHeaderBadgeContainer + `${item.author.first_name} has created the post ${item.post.title}`;
          }
        }
      }
    }

    if (typeof drafts[channel.id] !== "undefined") {
      if (drafts[channel.id].text && drafts[channel.id].text !== "<div><br></div>") {
        previewText = chatHeaderBadgeContainer + `DRAFT:&nbsp;${renderToString(<DraftContent dangerouslySetInnerHTML={{ __html: drafts[channel.id].text.replace(/(<([^>]+)>)/gi, " ") }} />)}`;
      } else if (drafts[channel.id].reply_quote) {
        previewText = chatHeaderBadgeContainer + `QUOTE:&nbsp;${drafts[channel.id].reply_quote.body}&nbsp;~${drafts[channel.id].reply_quote.user.name}`;
      }
    }
  } else {
    previewText = chatHeaderBadgeContainer;
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
        {channel.is_active === false && channel.type === "TOPIC" && <Icon icon="bell-off" className={`${channel.is_pinned && "mr-1"}`} />}
      </div>
    </Wrapper>
  );
};

export default ReplyPreview;
