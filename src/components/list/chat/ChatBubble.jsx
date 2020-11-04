import { hexToCSSFilter } from "hex-to-css-filter";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { renderToString } from "react-dom/server";
import GifPlayer from "react-gif-player";
import "react-gif-player/src/GifPlayer.scss";
import { useInView } from "react-intersection-observer";
import { useHistory } from "react-router-dom";
import Skeleton from "react-skeleton-loader";
import styled from "styled-components";
import quillHelper from "../../../helpers/quillHelper";
import { getEmojiRegexPattern, stripGif } from "../../../helpers/stringFormatter";
import { ImageTextLink, SvgIconFeather, SvgImage } from "../../common";
import { useGoogleApis } from "../../hooks";
import MessageFiles from "./Files/MessageFiles";
import Unfurl from "./Unfurl/Unfurl";

const ChatBubbleContainer = styled.div`
  position: relative;
  display: inline-flex;
  flex-flow: column;
  padding: ${(props) => (props.hasFiles ? "3px" : "6px 9px 8px 9px")};
  // padding: 6px 9px 8px 9px;
  border-radius: 6px;
  background: ${(props) => (props.isAuthor ? props.theme.self.chat_bubble_background_color : props.theme.others.chat_bubble_background_color)};
  text-align: left;
  width: 100%;
  color: ${(props) => (props.isAuthor ? props.theme.self.chat_bubble_text_color : props.theme.others.chat_bubble_text_color)};
  font-size: 0.835rem;
  overflow: visible;
  //min-height: 40px;
  min-height: ${(props) => (props.hasGif ? "150px" : "33px")};
  ${(props) =>
    props.hideBg === true &&
    !props.isEmoticonOnly &&
    `
        background: none;
        padding: 0;
    `}

  &:after {
    content: ${(props) => props.showAvatar && props.hideBg === false && "''"};
    border: 10px solid #0000;
    position: absolute;
    top: 10px;
    z-index: 1;
    ${(props) => (props.isAuthor ? "right: -18px" : "left: -15px")};
    border-left-color: ${(props) => (props.isAuthor ? props.theme.self.chat_bubble_background_color : "#0000")};
    border-right-color: ${(props) => (!props.isAuthor ? props.theme.others.chat_bubble_background_color : "#0000")};
    height: 5px;
  }

  a:not([href]):not([tabindex]) {
    color: ${(props) => (props.isAuthor ? props.theme.self.chat_bubble_link_color : props.theme.others.chat_bubble_link_color)};

    &:hover {
      color: ${(props) => (props.isAuthor ? props.theme.self.chat_bubble_hover_color : props.theme.others.chat_bubble_hover_color)};
    }
  }

  video {
    width: 100%;
  }
  p.reply-author {
    color: ${(props) => (props.isAuthor ? "#ffffff" : props.theme.others.chat_bubble_name_text_color)};
    font-weight: 400;
    font-size: 12px;
    font-style: italic;
    margin: 0;
    display: block;
    position: absolute;
    top: -24px;
    left: 0;
    white-space: nowrap;
    ${(props) => props.isForwardedMessage === true && "top: -40px;"}
  }
  span.emoticon-body {
    font-size: 2.5rem;
    padding: 25px 15px;
    text-align: right;
    text-align: ${(props) => (props.isAuthor ? "right" : "left")};
  }
  .reply-content img {
    max-width: 100%;
    max-height: 300px;
  }
  span.reply-date {
    color: ${(props) => (props.showAvatar && props.hideBg === false ? "#a7abc3" : "#0000")};
    font-style: italic;
    font-size: 11px;
    position: absolute;
    top: 0;
    ${(props) => (props.isAuthor ? "right: 100%" : "left: 100%")};
    display: flex;
    height: 100%;
    align-items: center;
    white-space: nowrap;
  }
  ol {
    text-align: left;
    position: relative;
    padding-inline-start: 0;
    li {
      margin-left: 0;
    }
  }
  ul {
    li {
      text-align: left;
      position: relative;
      margin-left: 0;
    }
  }
  span.is-deleted {
    font-style: italic;
    color: ${(props) => (props.isAuthor ? "#ffffffe6" : "#AAB0C8")};
  }
  .mention {
    font-weight: ${(props) => (props.isAuthor ? "none" : "bold")};
    color: ${(props) => (props.isAuthor ? "#ffffff" : "#7A1B8B")};
    text-decoration: none;
    &[data-value="All"],
    &.is-author {
      box-shadow: none;
      padding: 0 4px;
      border-radius: 8px;
      text-decoration: underline;
      display: inline-block;
      width: auto;
      height: auto;
    }
    a {
      color: ${(props) => (props.isAuthor ? "#ffffff" : "#7A1B8B")} !important;
      text-decoration: none;
    }
  }
  a.call-button {
    display: block;
  }
  .call-user {
    min-width: 30px;
    min-height: 30px;
    height: 30px;
    width: 30px;
    border-radius: 50%;
    margin-right: 5px;
    display: inline-block;
    background-size: contain;
  }
`;

const QuoteContainer = styled.div`
  background: ${(props) => (props.isAuthor ? props.theme.self.chat_bubble_quote_background_color : props.theme.others.chat_bubble_quote_background_color)};
  border-radius: 8px 8px 0 0;
  margin: -7px -9px 10px -9px;
  text-align: left;
  padding: 10px 10px 10px 20px;
  position: relative;
  cursor: pointer;
  max-width: ${(props) => (props.hasFiles ? "210px" : "auto")};
  &:before {
    height: 70%;
    width: 5px;
    background: ${(props) => (props.isAuthor ? props.theme.self.chat_bubble_quote_background_color : props.theme.others.chat_bubble_quote_background_color)};
    background: #ffffffe6;
    position: absolute;
    ${(props) => !props.isEmoticonOnly && "content: ''"};
    display: inline-block;
    float: left;
    left: 5px;
    opacity: 0.8;
    @media all and (max-width: 620px) {
      display: none;
    }
  }
  &:after {
    ${(props) => !props.isEmoticonOnly && "content: ''"};
    border: 10px solid transparent;
    ${(props) => (props.isAuthor ? "border-left-color: " + props.theme.self.chat_bubble_quote_background_color : "border-right-color: " + props.theme.others.chat_bubble_quote_background_color)};
    position: absolute;
    top: ${(props) => (props.showAvatar && !props.isAuthor ? "11px" : "11px")};
    z-index: 12;
    ${(props) => (!props.isAuthor ? "left: -15px" : "right: -15px")};
    height: 5px;
    @media all and (max-width: 620px) {
      display: none;
    }
    &:dark {
      ${(props) => (props.isAuthor ? "border-left-color: red !important;" : "border-right-color: yellow !important;")};
    }
  }
  @media all and (max-width: 620px) {
    margin: -7px -7px 10px -7px;
    padding: 7px;
  }
`;
const QuoteAuthor = styled.div`
  font-weight: 600;
  @media all and (max-width: 620px) {
    font-size: 11px;
    line-height: 1.2;
    font-weight: normal;
  }
`;
const QuoteContent = styled.div`
  color: ${(props) => (props.isAuthor ? props.theme.self.chat_bubble_quote_text_color : props.theme.others.chat_bubble_quote_text_color)};
  max-width: 100%;
  img,
  video {
    display: none;
  }
  .video-quote,
  .image-quote {
    img {
      width: auto;
      display: inline-block;
    }
  }
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: pre-wrap;
  a {
    color: ${(props) => (props.isAuthor ? "#ffffffe6" : "#8C3B9B")};
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;

    @media only screen and (max-width: 1024px) {
      white-space: normal;
      word-break: break-word;

      &:hover {
        word-break: unset;
      }
    }

    &:hover {
      overflow: unset;
      white-space: unset;
      text-overflow: unset;
      word-break: break-word;
    }
  }
`;

const GrippBotIcon = styled(SvgImage)`
  position: relative;
  top: -2px;
  margin-right: -5px;
  left: -3px;
  filter: invert(25%) sepia(36%) saturate(4250%) hue-rotate(165deg) brightness(95%) contrast(101%);

  &:hover {
    filter: invert(25%) sepia(36%) saturate(4250%) hue-rotate(165deg) brightness(95%) contrast(101%);
  }
`;

const ChatMessageFiles = styled(MessageFiles)`
  img {
    cursor: pointer;
    cursor: hand;
  }
  a {
    font-weight: bold;
    cursor: pointer;
    cursor: hand;
  }
  .reply-file-item {
    display: block;
    font-weight: bold;

    &.component-image-text-link {
      img.component-svg-image {
        display: inline-block;
        width: 20px;
        height: 20px;
        margin-right: 5px;
        filter: brightness(0) saturate(100%) ${(props) => (props.isAuthor ? hexToCSSFilter(props.theme.self.chat_bubble_link_color).filter : hexToCSSFilter(props.theme.others.chat_bubble_link_color).filter)};
      }

      &:hover {
        color: #972c86;

        img.component-svg-image {
          filter: brightness(0) saturate(100%) ${(props) => (props.isAuthor ? hexToCSSFilter(props.theme.self.chat_bubble_hover_color).filter : hexToCSSFilter(props.theme.others.chat_bubble_hover_color).filter)};
        }
      }
    }

    &.file-only {
      img {
        width: 52.5px;
        height: 52.5px;
      }
    }
  }

  ${(props) => props.hasMessage && ``}
`;
const ReplyContent = styled.span`
  max-width: ${(props) => (props.hasFiles ? "200px" : "auto")};
  padding: ${(props) => (props.hasFiles ? "7px 4px 5px 6px" : "")};
  ul {
    list-style-type: none;
  }

  a,
  a:not([href]):not([tabindex]) {
    cursor: pointer;
    color: ${(props) => (props.isAuthor ? props.theme.self.chat_bubble_link_color : props.theme.others.chat_bubble_link_color)};
    color: ${(props) => (!props.isAuthor ? "#7a1b8b" : "#ffffff99")};
    text-decoration: underline;

    &.gdrive-link {
      text-decoration: none;

      .link {
        @media (max-width: 1580px) {
          max-width: 20vw;
        }
        @media (max-width: 1480px) {
          max-width: 14vw;
        }
        @media (max-width: 1380px) {
          max-width: 5vw;
        }
        @media (max-width: 992px) {
          max-width: 350px;
        }
        @media (max-width: 822px) {
          max-width: 20vw;
        }
      }
      .preview-text {
        font-weight: bold;
        color: ${(props) => (props.isAuthor ? "#FFF" : "#828282")};
      }
    }

    &:focus,
    &:hover {
      color: ${(props) => (!props.isAuthor ? "#7a1b8b" : "#ffffff")};
    }
    &.btn {
      border: 1px solid ${(props) => (props.isAuthor ? props.theme.self.chat_bubble_link_color : props.theme.others.chat_bubble_link_color)};

      &:focus,
      &:hover {
        border: 1px solid ${(props) => (props.isAuthor ? props.theme.self.chat_bubble_hover_color : props.theme.others.chat_bubble_hover_color)};
      }

      &.btn-action {
        margin-top: 0.5rem;
        border-radius: 8px;
      }

      &.btn-complete {
        color: ${(props) => (props.isAuthor ? props.theme.self.chat_bubble_hover_color : props.theme.others.chat_bubble_hover_color)};
        border: 1px solid ${(props) => (props.isAuthor ? props.theme.self.chat_bubble_hover_color : props.theme.others.chat_bubble_hover_color)};
      }
    }
  }

  span.completed {
    text-decoration: line-through;
  }
`;
const ChatContentClap = styled.div`
  //margin-top: 10px;
  display: flex;
  flex-flow: ${(props) => (props.isAuthor ? "row" : "row-reverse")};

  .chat-content {
    width: 100%;
    padding-left: 0;
  }

  .chat-clap {
    float: ${(props) => (props.isAuthor ? "left" : "right")};
  }
`;
const ChatContent = styled.div`
  ${(props) =>
    !props.isEmoticonOnly &&
    `
    &:before {
        ${(props) => props.showAvatar && "content: ''"};
        border: 10px solid transparent;
        border-right-color: transparent;
        border-right-color: #f0f0f0;
        position: absolute;
        top: 10px;
        left: -15px;
        z-index: 1;
        ${(props) =>
          props.isAuthor === true &&
          `
            left: auto;
            right: -15px;
            border-left-color: #7A1B8B;
            border-right-color: transparent;
        `};
        width: 20px;
        height: 20px;
    }
    `}

  .reply-author {
    // padding: ${(props) => (props.isAuthor ? "0 10px 0 40px" : "0 40px 0 10px")};
    ${(props) => (props.isAuthor ? "margin-left: 30px" : "margin-right: 30px")};
  }
  .reply-content {
    clear: both;
    width: 100%;
    display: block;
    // ${(props) => (props.isAuthor ? "margin-left: 30px" : "margin-right: 30px")};

    p {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: pre-wrap;
      word-wrap: break-word;

      a {
        color: ${(props) => (props.isAuthor ? "#ff4444" : "#ff4444")};
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;

        @media only screen and (max-width: 1024px) {
          white-space: normal;
          word-break: break-word;

          &:hover {
            word-break: unset;
          }
        }

        &:hover {
          overflow: unset;
          white-space: unset;
          text-overflow: unset;
          word-break: break-word;
        }
      }
    }
  }
  .gif_player {
    clear: both;
    position: relative;
    left: 0;
    overflow: hidden;
    //height: 250px;
    min-height: 150px;
    cursor: pointer;
    .gifPlayer {
      border-radius: 8px;
      max-height: 250px;
    }
    .play_button {
      height: 60px;
      width: 60px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
`;

const ChatTimeStamp = styled.div`
  // position: absolute;
  // left: ${(props) => (props.isAuthor ? "5px" : "unset")};
  // right: ${(props) => (props.isAuthor ? "unset" : "5px")};
  color: #676767;
  display: flex;
  flex-flow: ${(props) => (props.isAuthor ? "row" : "row-reverse")};
  .reply-date {
    margin: ${(props) => (props.isAuthor ? "0 10px 0 0" : "0 0 0 10px")};
  }
  .reply-date.updated {
    // -webkit-transition: all 0.2s ease-in-out;
    // -o-transition: all 0.2s ease-in-out;
    // transition: all 0.2s ease-in-out;
    > span:last-child {
      display: none;
    }
  }
  .reply-date.updated:hover {
    > span:first-child {
      display: none;
    }
    > span:last-child {
      display: block;
    }
  }
`;

const StyledImageTextLink = styled(ImageTextLink)`
  display: block;
  svg,
  polyline,
  circle,
  g {
    stroke: ${(props) => (props.isAuthor ? "#ffffffe6" : "#8C3B9B")};
  }
`;

const ForwardedSpan = styled.span`
  color: #aab0c8;
  font-style: italic;
  display: flex;
  align-items: center;
  font-size: 12px;
  position: absolute;
  top: calc(50% - 25px);
  margin: 0 10px;
  ${(props) => (props.isAuthor ? "right: 100%;" : "left: 100%;")};
  height: 25px;
  white-space: nowrap;

  svg {
    width: 15px;
    height: 15px;
    position: relative;
    top: 2px;
    margin-right: 5px;
  }
`;

const ChatNameNotAuthorMobile = styled.span`
  display: none;
  @media (max-width: 620px) {
    display: block;
    font-size: 11px;
    line-height: 1.2;
  }
`;
const THRESHOLD = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9];
const ChatBubble = (props) => {
  const { reply, showAvatar, selectedChannel, showGifPlayer, isAuthor, addMessageRef, user, recipients, isLastChat, chatMessageActions, timeFormat, isBot, chatSettings, isLastChatVisible, dictionary, isBrowserActive } = props;

  const history = useHistory();

  const initialBodyParse = () => {
    let replyBody = reply.body;
    if (reply.is_deleted) {
      //replyBody = _t(reply.body, "The chat message has been deleted");
      replyBody = dictionary.chatRemoved;
    } else {
      if (reply.created_at.timestamp !== reply.updated_at.timestamp) {
        replyBody = `${replyBody}<span class='edited-message'>(edited)</span>`;
      }
    }
    if (replyBody.includes("ACCOUNT_DEACTIVATED")) {
      let newReplyBody = replyBody.replace("ACCOUNT_DEACTIVATED ", "");
      if (newReplyBody[newReplyBody.length - 1] === "s") {
        replyBody = `${dictionary.update}: ${newReplyBody}' ${dictionary.accountDeactivated}.`;
      } else {
        replyBody = `${dictionary.update}: ${newReplyBody}'s ${dictionary.accountDeactivated}.`;
      }
    } else if (replyBody.includes("NEW_ACCOUNT_ACTIVATED")) {
      let newReplyBody = replyBody.replace("NEW_ACCOUNT_ACTIVATED ", "");

      if (newReplyBody[newReplyBody.length - 1] === "s") {
        replyBody = `${dictionary.update}: ${newReplyBody}' ${dictionary.accountActivated}.`;
      } else {
        replyBody = `${dictionary.update}: ${newReplyBody}'s ${dictionary.accountActivated}.`;
      }
    }
    return quillHelper.parseEmoji(replyBody);
  };

  const initialQuoteParse = () => {
    let replyBody = reply.body;
    if (reply.is_deleted) {
      //replyBody = _t(reply.body, "The chat message has been deleted");
      replyBody = dictionary.chatRemoved;
    } else {
      if (reply.created_at.timestamp !== reply.updated_at.timestamp) {
        replyBody = `${replyBody}<span class='edited-message'>(edited)</span>`;
      }
    }

    let replyQuoteBody = "";
    let replyQuoteAuthor = "";
    if (reply.quote) {
      let div = document.createElement("div");
      div.innerHTML = reply.quote.body;
      let images = div.getElementsByTagName("img");
      for (let i = 0; i < images.length; i++) {
        replyQuoteBody += renderToString(
          <StyledImageTextLink className={"image-quote"} target={"_blank"} href={images[0].getAttribute("src")} icon={"image-video"} isAuthor={isAuthor}>
            Photo
          </StyledImageTextLink>
        );
      }

      let videos = div.getElementsByTagName("video");
      for (let i = 0; i < videos.length; i++) {
        replyQuoteBody += renderToString(
          <StyledImageTextLink className={"video-quote"} target={"_blank"} href={videos[0].getAttribute("player-source")} icon={"image-video"} isAuthor={isAuthor}>
            Video
          </StyledImageTextLink>
        );
      }
      if (reply.quote.files) {
        reply.quote.files.forEach((file) => {
          if (file.type === "image") {
            replyQuoteBody += renderToString(
              <StyledImageTextLink className={"image-quote"} target={"_blank"} href={file.view_link} icon={"image-video"} isAuthor={isAuthor}>
                Photo
              </StyledImageTextLink>
            );
          } else if (file.type === "video") {
            replyQuoteBody += renderToString(
              <StyledImageTextLink className={"video-quote"} target={"_blank"} href={file.view_link} icon={"image-video"} isAuthor={isAuthor}>
                Video
              </StyledImageTextLink>
            );
          } else {
            replyQuoteBody += renderToString(
              <StyledImageTextLink
                //className={`video-quote`}
                target={"_blank"}
                href={file.view_link}
                icon={"documents"}
                isAuthor={isAuthor}
              >
                {file.filename ? `${file.filename} ` : `${file.name} `}
              </StyledImageTextLink>
            );
          }
        });
      }

      replyQuoteBody += quillHelper.parseEmoji(reply.quote.body);
      if (reply.quote.user) {
        if (user.id !== reply.quote.user.id) {
          replyQuoteAuthor = reply.quote.user.name;
        } else {
          replyQuoteAuthor = "You";
        }
      }
    }

    if (replyBody.includes("ACCOUNT_DEACTIVATED")) {
      let newReplyBody = replyBody.replace("ACCOUNT_DEACTIVATED ", "");
      if (newReplyBody[newReplyBody.length - 1] === "s") {
        replyBody = `${dictionary.update}: ${newReplyBody}' ${dictionary.accountDeactivated}.`;
      } else {
        replyBody = `${dictionary.update}: ${newReplyBody}'s ${dictionary.accountDeactivated}.`;
      }
    } else if (replyBody.includes("NEW_ACCOUNT_ACTIVATED")) {
      let newReplyBody = replyBody.replace("NEW_ACCOUNT_ACTIVATED ", "");

      if (newReplyBody[newReplyBody.length - 1] === "s") {
        replyBody = `${dictionary.update}: ${newReplyBody}' ${dictionary.accountActivated}.`;
      } else {
        replyBody = `${dictionary.update}: ${newReplyBody}'s ${dictionary.accountActivated}.`;
      }
    }

    if (replyQuoteBody.includes("ACCOUNT_DEACTIVATED")) {
      let newReplyBody = replyQuoteBody.replace("ACCOUNT_DEACTIVATED ", "");
      if (newReplyBody[newReplyBody.length - 1] === "s") {
        replyQuoteBody = `${dictionary.update}: ${newReplyBody}' ${dictionary.accountDeactivated}.`;
      } else {
        replyQuoteBody = `${dictionary.update}: ${newReplyBody}'s ${dictionary.accountDeactivated}.`;
      }
    } else if (replyQuoteBody.includes("NEW_ACCOUNT_ACTIVATED")) {
      let newReplyBody = replyQuoteBody.replace("NEW_ACCOUNT_ACTIVATED ", "");

      if (newReplyBody[newReplyBody.length - 1] === "s") {
        replyQuoteBody = `${dictionary.update}: ${newReplyBody}' ${dictionary.accountActivated}.`;
      } else {
        replyQuoteBody = `${dictionary.update}: ${newReplyBody}'s ${dictionary.accountActivated}.`;
      }
    } else if (replyQuoteBody.includes("CHANNEL_UPDATE::")) {
      const data = JSON.parse(reply.quote.body.replace("CHANNEL_UPDATE::", ""));

      let author = recipients.find((r) => r.type_id === data.author.id);
      if (author) {
        if (data.author.id === user.id) {
          author.name = dictionary.you;
        }
      } else {
        author = {
          name: dictionary.someone,
        };
      }

      let newBody = "";
      if (data.title !== "") {
        newBody = (
          <>
            <SvgIconFeather width={16} icon="edit-3" /> {author.name} {selectedChannel.type === "TOPIC" ? dictionary.renameThisWorkspace : dictionary.renameThisChat} <b>#{data.title}</b>
            <br />
          </>
        );
      }

      if (data.added_members.length >= 1) {
        const am = recipients.filter((r) => {
          return r.type === "USER" && data.added_members.includes(r.type_id) && r.type_id !== user.id
        }).map((r) => r.name);

        if (data.added_members.includes(user.id) && data.author.id === user.id) {
          if (newBody === "") {
            newBody = (
              <>
                <b>{author.name}</b> {dictionary.joined}{" "}
              </>
            );
          } else {
            newBody = (
              <>
                {newBody} {dictionary.andJoined}
              </>
            );
          }

          if (am.length !== 0) {
            newBody = (
              <>
                {newBody} {dictionary.andAdded} <b>{am.join(", ")}</b>
                <br />
              </>
            );
          }
        } else {
          if (newBody === "") {
            newBody = (
              <>
                {author.name} {dictionary.added}{" "}
              </>
            );
          } else {
            newBody = (
              <>
                {newBody} {dictionary.andAdded}
              </>
            );
          }

          if (data.added_members.includes(user.id)) {
            if (am.length !== 0) {
              newBody = (
                <>
                  {newBody} <b>{dictionary.youAnd} </b>
                </>
              );
            } else {
              newBody = (
                <>
                  {newBody} <b>{dictionary.you}</b>
                </>
              );
            }
          }

          if (am.length !== 0) {
            newBody = (
              <>
                {newBody} <b>{am.join(", ")}</b>
                <br />
              </>
            );
          }
        }
      }

      if (data.removed_members.length === 1) {
        if (data.author && data.author.id === data.removed_members[0]) {
          if (newBody === "") {
            if (data.author.id === user.id && data.removed_members[0] === user.id) {
              newBody = (
                <>
                  {selectedChannel.type === "TOPIC" ? dictionary.youLeftWorkspace : dictionary.youLeftChat}{" "}
                </>
              );
            } else {
              newBody = (
                <>
                  <b>{data.author.name}</b> {selectedChannel.type === "TOPIC" ? dictionary.hasLeftWorkspace : dictionary.hasLeftChat}{" "}
                </>
              );
            }
          } else {
            newBody = <>{newBody} {selectedChannel.type === "TOPIC" ? dictionary.andHasLeftWorkspace : dictionary.andHasLeftChat}</>;
          }
        } else {
          if (newBody === "") {
            newBody = (
              <>
                <b>{data.author.name}</b> {selectedChannel.type === "TOPIC" ? dictionary.hasLeftWorkspace : dictionary.hasLeftChat}{" "}
              </>
            );
          } else {
            newBody = <>{newBody} {selectedChannel.type === "TOPIC" ? dictionary.andHasLeftWorkspace : dictionary.andHasLeftChat}</>;
          }
        }
      } else if (data.removed_members.length > 1) {
        const rm = recipients.filter((r) => {
          return r.type === "USER" && data.removed_members.includes(r.type_id) && r.type_id !== user.id
        }).map((r) => r.name);

        if (data.removed_members.includes(user.id) && data.author.id === user.id) {
          if (newBody === "") {
            newBody = (
              <>
                <b>{author.name}</b> {dictionary.left}{" "}
              </>
            );
          } else {
            newBody = (
              <>
                {newBody} {dictionary.andLeft}
              </>
            );
          }

          if (rm.length !== 0) {
            newBody = (
              <>
                {newBody} {dictionary.andRemoved} <b>{rm.join(", ")}</b>
                <br />
              </>
            );
          }
        } else {
          if (newBody === "") {
            newBody = (
              <>
                {author.name} {dictionary.removed}{" "}
              </>
            );
          } else {
            newBody = (
              <>
                {newBody} {dictionary.andRemoved}
              </>
            );
          }

          if (data.removed_members.includes(user.id)) {
            if (rm.length !== 0) {
              newBody = (
                <>
                  {newBody} <b>{dictionary.youAnd} </b>
                </>
              );
            } else {
              newBody = (
                <>
                  {newBody} <b>{dictionary.you}</b>
                </>
              );
            }
          }

          if (rm.length !== 0) {
            newBody = (
              <>
                {newBody} <b>{rm.join(", ")}</b>
                <br />
              </>
            );
          }
        }
      }
      replyQuoteBody = renderToString(newBody);
    } else if (replyQuoteBody.includes("POST_CREATE::")) {
      let item = JSON.parse(reply.quote.body.replace("POST_CREATE::", ""));
      let description = item.post.description;
      replyQuoteBody = renderToString(
        <>
          <b>{item.author.first_name}</b> {dictionary.createdThePost} <b>"{item.post.title}"</b>
          <span className="card card-body" style={{ margin: 0, padding: "10px" }} dangerouslySetInnerHTML={{ __html: description }} />
        </>
      );
    }
    return quillHelper.parseEmoji(replyQuoteBody);
  };

  const [mounted, setMounted] = useState(false);
  const [gifOnly, setGifOnly] = useState(false);
  const [body, setBody] = useState(initialBodyParse());
  const [quoteBody, setQuoteBody] = useState(initialQuoteParse());
  const [quoteAuthor, setQuoteAuthor] = useState("");
  const [loadRef, loadInView] = useInView({
    threshold: 1,
  });
  //const { chatSettings } = useSettings();
  const refComponent = useRef();

  const [lastChatRef, inView, entry] = useInView({
    threshold: THRESHOLD,
    skip: !isLastChat,
  });

  useEffect(() => {
    if (isBrowserActive) {
      if (isLastChat && entry) {
        if (entry.boundingClientRect.height - entry.intersectionRect.height >= 16) {
          if (isLastChatVisible) chatMessageActions.setLastMessageVisiblility({ status: false });
        } else {
          if (!isLastChatVisible) chatMessageActions.setLastMessageVisiblility({ status: true });
        }
      }
    } else {
      chatMessageActions.setLastMessageVisiblility({ status: false });
    }
  }, [isLastChat, entry, isLastChatVisible, inView, isBrowserActive]);

  useEffect(() => {
    if (addMessageRef && loadInView) {
      props.loadReplies();
    }
  }, [addMessageRef, loadInView]);

  const handleMarkComplete = () => {
    chatMessageActions.markComplete(reply.id);
  };

  const handleRemoveReply = () => {
    let newBody = reply.original_body.replace("You asked me to remind you ", "OK! I’ve removed the reminder ");

    const channelName = newBody.replace(newBody.substr(0, newBody.search(" in ") + 4, newBody), "");
    newBody = newBody.replace(` in ${channelName}`, ` in <a class="push" data-href="/chat/${reply.quote.channel_code}">#${channelName}</a>`);

    const link = `/chat/${reply.quote.channel_code}/${reply.quote.code}`;
    newBody = newBody.replace("this message", `<a class="push" href="${link}">this message</a>`);

    chatMessageActions.edit({
      body: newBody,
      message_id: reply.id,
      reply_id: reply.id,
    });
  };

  const handleChannelMessageLink = (e) => {
    e.preventDefault();
    history.push(e.currentTarget.dataset.href);
    return false;
  };

  const fetchImgURL = (e) => {
    if (e.match(/<img/) != null) {
      let regexImg = /<img.*?src="(.*?)"/;
      let src = regexImg.exec(e);

      if (src === null) {
        return e;
      } else {
        // console.log("src: " + src[1])
        return src[1];
      }
    } else {
      let regexLink = /<a.*?href="(.*?)"/;
      let href = regexLink.exec(e);

      if (href === null) {
        return e;
      } else {
        // console.log("href: " + href[1])
        return href[1];
      }
    }
  };

  const fetchGifCount = (e) => {
    let temporalDivElement = document.createElement("p");

    temporalDivElement.innerHTML = e;

    let image = temporalDivElement.querySelectorAll('img[src$=".gif"], a[href$=".gif"]');
    let nodeArr = [];

    if (image !== null) {
      Array.prototype.forEach.call(image, function (node) {
        nodeArr.push(node);
      });

      return nodeArr;
    } else {
      return e;
    }
  };

  const handleQuoteClick = () => {
    if (reply.quote.channel_id) {
    } else {
      let el = document.querySelector(`.chat-list-item-${reply.quote.id}`);
      if (el) {
        el.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "center",
        });
      }
    }
  };

  useEffect(() => {
    setMounted(true);
    const btnComplete = refComponent.current.querySelector(".btn-action.btn-complete");
    if (btnComplete) btnComplete.addEventListener("click", handleMarkComplete, true);

    const btnDelete = refComponent.current.querySelector(".btn-action.btn-delete");
    if (btnDelete) btnDelete.addEventListener("click", handleRemoveReply, true);

    const lnkChannelMessage = refComponent.current.querySelector("a.push");
    if (lnkChannelMessage) lnkChannelMessage.addEventListener("click", handleChannelMessageLink, true);

    return () => {
      if (btnComplete) btnComplete.removeEventListener("click", handleMarkComplete, true);

      if (btnDelete) btnDelete.removeEventListener("click", handleRemoveReply, true);

      if (lnkChannelMessage) lnkChannelMessage.removeEventListener("click", handleChannelMessageLink, true);
    };
  }, []);

  const parseBody = useCallback(() => {
    let replyBody = reply.body;
    if (reply.is_deleted) {
      //replyBody = _t(reply.body, "The chat message has been deleted");
      replyBody = dictionary.chatRemoved;
    } else {
      if (reply.created_at.timestamp !== reply.updated_at.timestamp) {
        replyBody = `${replyBody}<span class='edited-message'>(edited)</span>`;
      }
    }

    let replyQuoteBody = "";
    let replyQuoteAuthor = "";
    if (reply.quote) {
      let div = document.createElement("div");
      div.innerHTML = reply.quote.body;
      let images = div.getElementsByTagName("img");
      for (let i = 0; i < images.length; i++) {
        replyQuoteBody += renderToString(
          <StyledImageTextLink className={"image-quote"} target={"_blank"} href={images[0].getAttribute("src")} icon={"image-video"} isAuthor={isAuthor}>
            Photo
          </StyledImageTextLink>
        );
      }

      let videos = div.getElementsByTagName("video");
      for (let i = 0; i < videos.length; i++) {
        replyQuoteBody += renderToString(
          <StyledImageTextLink className={"video-quote"} target={"_blank"} href={videos[0].getAttribute("player-source")} icon={"image-video"} isAuthor={isAuthor}>
            Video
          </StyledImageTextLink>
        );
      }
      if (reply.quote.files) {
        reply.quote.files.forEach((file) => {
          if (file.type === "image") {
            replyQuoteBody += renderToString(
              <StyledImageTextLink className={"image-quote"} target={"_blank"} href={file.thumbnail_link}
                                   icon={"image-video"} isAuthor={isAuthor}>
                Photo
              </StyledImageTextLink>
            );
          } else if (file.type === "video") {
            replyQuoteBody += renderToString(
              <StyledImageTextLink className={"video-quote"} target={"_blank"} href={file.view_link} icon={"image-video"} isAuthor={isAuthor}>
                Video
              </StyledImageTextLink>
            );
          } else {
            replyQuoteBody += renderToString(
              <StyledImageTextLink
                //className={`video-quote`}
                target={"_blank"}
                href={file.view_link}
                icon={"documents"}
                isAuthor={isAuthor}
              >
                {file.filename ? `${file.filename} ` : `${file.name} `}
              </StyledImageTextLink>
            );
          }
        });
      }

      replyQuoteBody += quillHelper.parseEmoji(reply.quote.body);
      if (reply.quote.user) {
        if (user.id !== reply.quote.user.id) {
          replyQuoteAuthor = reply.quote.user.name;
        } else {
          replyQuoteAuthor = "You";
        }
      }
    }

    if (replyBody.includes("ACCOUNT_DEACTIVATED")) {
      let newReplyBody = replyBody.replace("ACCOUNT_DEACTIVATED ", "");
      if (newReplyBody[newReplyBody.length - 1] === "s") {
        replyBody = `${dictionary.update}: ${newReplyBody}' ${dictionary.accountDeactivated}.`;
      } else {
        replyBody = `${dictionary.update}: ${newReplyBody}'s ${dictionary.accountDeactivated}.`;
      }
    } else if (replyBody.includes("NEW_ACCOUNT_ACTIVATED")) {
      let newReplyBody = replyBody.replace("NEW_ACCOUNT_ACTIVATED ", "");

      if (newReplyBody[newReplyBody.length - 1] === "s") {
        replyBody = `${dictionary.update}: ${newReplyBody}' ${dictionary.accountActivated}.`;
      } else {
        replyBody = `${dictionary.update}: ${newReplyBody}'s ${dictionary.accountActivated}.`;
      }
    }

    if (replyQuoteBody.includes("ACCOUNT_DEACTIVATED")) {
      let newReplyBody = replyQuoteBody.replace("ACCOUNT_DEACTIVATED ", "");
      if (newReplyBody[newReplyBody.length - 1] === "s") {
        replyQuoteBody = `${dictionary.update}: ${newReplyBody}' ${dictionary.accountDeactivated}.`;
      } else {
        replyQuoteBody = `${dictionary.update}: ${newReplyBody}'s ${dictionary.accountDeactivated}.`;
      }
    } else if (replyQuoteBody.includes("NEW_ACCOUNT_ACTIVATED")) {
      let newReplyBody = replyQuoteBody.replace("NEW_ACCOUNT_ACTIVATED ", "");

      if (newReplyBody[newReplyBody.length - 1] === "s") {
        replyQuoteBody = `${dictionary.update}: ${newReplyBody}' ${dictionary.accountActivated}.`;
      } else {
        replyQuoteBody = `${dictionary.update}: ${newReplyBody}'s ${dictionary.accountActivated}.`;
      }
    } else if (replyQuoteBody.includes("CHANNEL_UPDATE::")) {
      const data = JSON.parse(reply.quote.body.replace("CHANNEL_UPDATE::", ""));

      let author = recipients.find((r) => r.type_id === data.author.id);
      if (author) {
        if (data.author.id === user.id) {
          author.name = dictionary.you;
        }
      } else {
        author = {
          name: dictionary.someone,
        };
      }

      let newBody = "";
      if (data.title !== "") {
        newBody = (
          <>
            <SvgIconFeather width={16} icon="edit-3" /> {author.name} {selectedChannel.type === "TOPIC" ? dictionary.renameThisWorkspace : dictionary.renameThisChat} <b>#{data.title}</b>
            <br />
          </>
        );
      }

      if (data.added_members.length >= 1) {
        const am = recipients.filter((r) => {
          return r.type === "USER" && data.added_members.includes(r.type_id) && r.type_id !== user.id
        }).map((r) => r.name);

        if (data.added_members.includes(user.id) && data.author.id === user.id) {
          if (newBody === "") {
            newBody = (
              <>
                <b>{author.name}</b> {dictionary.joined}{" "}
              </>
            );
          } else {
            newBody = (
              <>
                {newBody} {dictionary.andJoined}
              </>
            );
          }

          if (am.length !== 0) {
            newBody = (
              <>
                {newBody} {dictionary.andAdded} <b>{am.join(", ")}</b>
                <br />
              </>
            );
          }
        } else {
          if (newBody === "") {
            newBody = (
              <>
                {author.name} {dictionary.added}{" "}
              </>
            );
          } else {
            newBody = (
              <>
                {newBody} {dictionary.andAdded}
              </>
            );
          }

          if (data.added_members.includes(user.id)) {
            if (am.length !== 0) {
              newBody = (
                <>
                  {newBody} <b>{dictionary.youAnd} </b>
                </>
              );
            } else {
              newBody = (
                <>
                  {newBody} <b>{dictionary.you}</b>
                </>
              );
            }
          }

          if (am.length !== 0) {
            newBody = (
              <>
                {newBody} <b>{am.join(", ")}</b>
                <br />
              </>
            );
          }
        }
      }

      if (data.removed_members.length === 1) {
        if (data.author && data.author.id === data.removed_members[0]) {
          if (newBody === "") {
            if (data.author.id === user.id && data.removed_members[0] === user.id) {
              newBody = (
                <>
                  {selectedChannel.type === "TOPIC" ? dictionary.youLeftWorkspace : dictionary.youLeftChat}{" "}
                </>
              );
            } else {
              newBody = (
                <>
                  <b>{data.author.name}</b> {selectedChannel.type === "TOPIC" ? dictionary.hasLeftWorkspace : dictionary.hasLeftChat}{" "}
                </>
              );
            }
          } else {
            newBody = <>{newBody} {selectedChannel.type === "TOPIC" ? dictionary.andHasLeftWorkspace : dictionary.andHasLeftChat}</>;
          }
        } else {
          if (newBody === "") {
            newBody = (
              <>
                <b>{data.author.name}</b> {selectedChannel.type === "TOPIC" ? dictionary.hasLeftWorkspace : dictionary.hasLeftChat}{" "}
              </>
            );
          } else {
            newBody = <>{newBody} {selectedChannel.type === "TOPIC" ? dictionary.andHasLeftWorkspace : dictionary.andHasLeftChat}</>;
          }
        }
      } else if (data.removed_members.length > 1) {
        const rm = recipients.filter((r) => {
          return r.type === "USER" && data.removed_members.includes(r.type_id) && r.type_id !== user.id
        }).map((r) => r.name);

        if (data.removed_members.includes(user.id) && data.author.id === user.id) {
          if (newBody === "") {
            newBody = (
              <>
                <b>{author.name}</b> {dictionary.left}{" "}
              </>
            );
          } else {
            newBody = (
              <>
                {newBody} {dictionary.andLeft}
              </>
            );
          }

          if (rm.length !== 0) {
            newBody = (
              <>
                {newBody} {dictionary.andRemoved} <b>{rm.join(", ")}</b>
                <br />
              </>
            );
          }
        } else {
          if (newBody === "") {
            newBody = (
              <>
                {author.name} {dictionary.removed}{" "}
              </>
            );
          } else {
            newBody = (
              <>
                {newBody} {dictionary.andRemoved}
              </>
            );
          }

          if (data.removed_members.includes(user.id)) {
            if (rm.length !== 0) {
              newBody = (
                <>
                  {newBody} <b>{dictionary.youAnd} </b>
                </>
              );
            } else {
              newBody = (
                <>
                  {newBody} <b>{dictionary.you}</b>
                </>
              );
            }
          }

          if (rm.length !== 0) {
            newBody = (
              <>
                {newBody} <b>{rm.join(", ")}</b>
                <br />
              </>
            );
          }
        }
      }
      replyQuoteBody = renderToString(newBody);
    } else if (replyQuoteBody.includes("POST_CREATE::")) {
      let item = JSON.parse(reply.quote.body.replace("POST_CREATE::", ""));
      let description = item.post.description;
      replyQuoteBody = renderToString(
        <>
          <b>{item.author.first_name}</b> {dictionary.createdThePost} <b>"{item.post.title}"</b>
          <span className="card card-body" style={{ margin: 0, padding: "10px" }} dangerouslySetInnerHTML={{ __html: description }} />
        </>
      );
    }
    setQuoteBody(replyQuoteBody);
    setBody(quillHelper.parseEmoji(replyBody));
    setQuoteAuthor(replyQuoteAuthor);
  }, [reply]);

  useEffect(() => {
    parseBody();
  }, [reply.body, reply.is_deleted]);

  const hasFiles = reply.files.length > 0;
  const hasMessage = reply.body !== "<span></span>";
  const googleApis = useGoogleApis();

  const handleQuoteContentRef = (e) => {
    if (e) {
      const googleLinks = e.querySelectorAll(`[data-google-link-retrieve="0"]`);
      googleLinks.forEach((gl) => {
        let e = gl;
        let linkText = e.querySelector(".link");
        if (linkText) {
          linkText.innerHTML = e.dataset.hrefLink;
        }
        e.dataset.googleLinkRetrieve = 1;
        googleApis.getFile(e, e.dataset.googleFileId);
      });
      if (showGifPlayer) {
        let hasText = false;
        Array.from(e.children).forEach((el) => {
          if (el.innerHTML !== "") {
            hasText = true;
          }
        });
        setGifOnly(!hasText);
      }
    }
  };

  const handleContentRef = (e) => {
    if (e) {
      const googleLinks = e.querySelectorAll(`[data-google-link-retrieve="0"]`);
      googleLinks.forEach((gl) => {
        let e = gl;
        let linkText = e.querySelector(".link");
        if (linkText) {
          linkText.innerHTML = e.dataset.hrefLink;
        }
        e.dataset.googleLinkRetrieve = 1;
        googleApis.getFile(e, e.dataset.googleFileId);
      });
      if (showGifPlayer) {
        let hasText = false;
        Array.from(e.children).forEach((el) => {
          if (el.innerHTML !== "") {
            hasText = true;
          }
        });
        setGifOnly(!hasText);
      }
    }
  };

  //const bodyContent = quillHelper.parseEmoji(body);
  let isEmoticonOnly = false;
  let div = document.createElement("div");
  div.innerHTML = body;


  const stripBodyTag = (div.textContent || div.innerText || "");
  if (stripBodyTag.length <= 3 && stripBodyTag.match(getEmojiRegexPattern())) {
    isEmoticonOnly = true;
  }

  return (
    <ChatBubbleContainer
      ref={refComponent}
      tabIndex={reply.id}
      hasFiles={hasFiles}
      className={"chat-bubble ql-editor"}
      showAvatar={showAvatar}
      isAuthor={isAuthor}
      hideBg={isEmoticonOnly || gifOnly || (hasFiles && body === "<div></div>") || (hasFiles && body === "")}
      theme={chatSettings.chat_message_theme}
      hasGif={showGifPlayer}
    >
      {
        <>
          {reply.is_transferred && (
            <ForwardedSpan className="small" isAuthor={isAuthor}>
              <SvgIconFeather icon="corner-up-right" />
              {dictionary.forwardedMessage}
            </ForwardedSpan>
          )}
          <ChatContentClap ref={addMessageRef ? loadRef : null} className="chat-content-clap" isAuthor={isAuthor}>
            <ChatContent showAvatar={showAvatar} isAuthor={isAuthor} isEmoticonOnly={isEmoticonOnly} className={`chat-content animated slower`}>
              {reply.quote && reply.quote.body && !reply.is_deleted && (reply.quote.user_id !== undefined || reply.quote.user !== undefined) && (
                <QuoteContainer className={"quote-container"} showAvatar={showAvatar} isEmoticonOnly={isEmoticonOnly} hasFiles={hasFiles} theme={chatSettings.chat_message_theme} onClick={handleQuoteClick} isAuthor={isAuthor}>
                  {reply.quote.user_id === user.id ? (
                    <QuoteAuthor theme={chatSettings.chat_message_theme} isAuthor={true}>
                      {"You"}
                    </QuoteAuthor>
                  ) : (
                    <QuoteAuthor theme={chatSettings.chat_message_theme} isAuthor={reply.quote.user_id === user.id}>
                      {quoteAuthor}
                    </QuoteAuthor>
                  )}
                  <QuoteContent ref={handleQuoteContentRef} className={"quote-content"} theme={chatSettings.chat_message_theme} isAuthor={isAuthor} dangerouslySetInnerHTML={{ __html: quoteBody }}></QuoteContent>
                </QuoteContainer>
              )}
              {
                // !isAuthor && showAvatar && (
                //   <>
                //     {isBot === true && <GrippBotIcon icon={"gripp-bot"} />}
                //     {/* @todo reply.message_from.name and reply.user.name issue
                //                    <p className={"reply-author"}>{reply.message_from.name.replace("  ", " ")}</p>*/}
                //   </>
                // )
              }
              {reply.files.length > 0 && !reply.is_deleted && <ChatMessageFiles hasMessage={hasMessage} isAuthor={isAuthor} theme={chatSettings.chat_message_theme} files={reply.files} reply={reply} type="chat" />}

              {!isAuthor && showAvatar && (
                <>
                  <ChatNameNotAuthorMobile className="chat-name-not-author-mobile">{reply.user.name}</ChatNameNotAuthorMobile>
                </>
              )}
              {body !== "<span></span>" && (
                <span ref={isLastChat ? lastChatRef : null}>
                  <ReplyContent
                    ref={handleContentRef}
                    hasFiles={hasFiles}
                    theme={chatSettings.chat_message_theme}
                    isAuthor={isAuthor}
                    className={`reply-content ${isEmoticonOnly ? "emoticon-body" : ""} ${reply.is_deleted ? "is-deleted" : ""}`}
                    dangerouslySetInnerHTML={showGifPlayer ? { __html: stripGif(body) } : { __html: body }}
                  />
                </span>
              )}

              {showGifPlayer &&
                fetchGifCount(body).map((gifLink, index) => {
                  let gifString = gifLink.outerHTML;

                  return <GifPlayer key={index} className={"gifPlayer"} gif={fetchImgURL(gifString)} autoplay={true} />;
                })}
              {(reply.unfurls && reply.unfurls.length && !reply.is_deleted && !showGifPlayer && !isBot) === true && (
                <Unfurl unfurlData={reply.unfurls} isAuthor={isAuthor} removeUnfurl={chatMessageActions.removeUnfurl} channelId={selectedChannel.id} messageId={reply.id} type={"chat"} />
              )}
              {reply.unfurl_loading !== undefined && reply.unfurl_loading && <Skeleton color="#dedede" borderRadius="10px" width="100%" height="150px" widthRandomness={0} heightRandomness={0} />}
            </ChatContent>
          </ChatContentClap>
          <ChatTimeStamp className="chat-timestamp" isAuthor={isAuthor}>
            <span className="reply-date created">{timeFormat.todayOrYesterdayDate(reply.created_at.timestamp)}</span>
          </ChatTimeStamp>
        </>
      }
      {props.children}
    </ChatBubbleContainer>
  );
};

export default React.memo(ChatBubble);
