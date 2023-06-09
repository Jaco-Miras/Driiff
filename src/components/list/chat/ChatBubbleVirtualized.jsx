import { hexToCSSFilter } from "hex-to-css-filter";
import React, { useEffect, useRef } from "react";
import "react-gif-player/src/GifPlayer.scss";
//import { useInView } from "react-intersection-observer";
import { useHistory } from "react-router-dom";
//import Skeleton from "react-skeleton-loader";
import styled from "styled-components";
import { BlobGifPlayer, SvgIconFeather } from "../../common";
import { useChatReply, useGoogleApis } from "../../hooks";
import MessageFiles from "./Files/MessageFiles";
//import Unfurl from "./Unfurl/Unfurl";
import useChatTranslate from "../../hooks/useChatTranslate";
import useChatFancyLink from "../../hooks/useChatFancyLink";

const ChatBubbleContainer = styled.div`
  position: relative;
  display: inline-flex;
  flex-flow: column;
  padding: ${(props) => (props.hasFiles ? "3px" : "6px 9px 8px 9px")};
  border-radius: 6px;
  background: ${(props) => (props.isAuthor ? "#7A1B8B" : "#F0F0F0")};
  text-align: left;
  width: 100%;
  color: ${(props) => (props.isAuthor ? "#ffffff" : "#000000")};
  font-size: 0.835rem;
  overflow: visible;
  min-height: ${(props) => (props.hasGif ? "150px" : "33px")};

  &:after {
    border: 10px solid #0000;
    position: absolute;
    top: 6px;
    z-index: 1;
    ${(props) => (props.isAuthor ? "right: -16px" : "left: -15px")};
    border-left-color: ${(props) => (props.isAuthor ? "#7A1B8B" : "#0000")};
    border-right-color: ${(props) => (!props.isAuthor ? "#F0F0F0" : "#0000")};
    height: 5px;
  }

  a:not([href]):not([tabindex]) {
    color: ${(props) => (props.isAuthor ? "#ffffff" : "#8C3B9B")};

    &:hover {
      color: ${(props) => (props.isAuthor ? "#fff" : "#0056b3")};
    }
  }

  video {
    width: 100%;
  }
  p.reply-author {
    color: ${(props) => (props.isAuthor ? "#ffffff" : "#AAB0C8")};
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
    padding: 20px 10px;
    text-align: ${(props) => (props.isAuthor ? "right" : "left")};
  }
  .reply-content img {
    max-width: 100%;
    max-height: 300px;
  }
  span.reply-date {
    color: ${(props) => ((props.showAvatar && props.hideBg === false) || props.hasRemoveOnDlFiles ? "#a7abc3" : "#0000")};
    font-style: italic;
    font-size: 11px;
    position: absolute;
    top: 0;
    ${(props) => (props.isAuthor ? "right: 100%" : "left: 100%")};
    display: flex;
    height: 100%;
    text-align: ${(props) => (props.isAuthor ? "right" : "left")};
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
  span.image-uploading {
    display: none;
  }
  .chat-file-notification {
    b:hover {
      text-decoration: underline;
      cursor: pointer;
    }
  }
  .message-files div:first-child {
    align-items: ${(props) => (props.isAuthor ? "flex-end" : "flex-start")};
  }
`;

const QuoteContainer = styled.div`
  background: ${(props) => (props.isAuthor ? "#8C3B9B" : "#E4E4E4")};
  border-radius: 6px;
  margin: 4px -4px 4px -4px;
  text-align: left;
  padding: 10px 10px 10px 20px;
  position: relative;
  cursor: pointer;
  max-width: ${(props) => (props.hasFiles ? "210px" : "auto")};
  &:before {
    height: 70%;
    width: 5px;
    background: ${(props) => (props.isAuthor ? "#8C3B9B" : "#E4E4E4")};
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
  @media all and (max-width: 620px) {
    margin: 7px -7px 10px -7px;
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
  color: ${(props) => (props.isAuthor ? "#ffffffe6" : "#000000")};
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

const ChatMessageFiles = styled(MessageFiles)`
  img {
    cursor: pointer;
  }
  a {
    font-weight: bold;
    cursor: pointer;
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
        filter: brightness(0) saturate(100%) ${(props) => (props.isAuthor ? hexToCSSFilter("#ffffff").filter : hexToCSSFilter("#8C3B9B").filter)};
      }

      &:hover {
        color: ${(props) => props.theme.colors.primary};

        img.component-svg-image {
          filter: brightness(0) saturate(100%) ${(props) => (props.isAuthor ? hexToCSSFilter("#fff").filter : hexToCSSFilter("#0056b3").filter)};
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

  ${(props) => props.hasMessage && ""}
`;
const ReplyContent = styled.span`
  // max-width: ${(props) => (props.hasFiles ? "200px" : "auto")};
  padding: ${(props) => (props.hasFiles ? "0 3px" : "")};
  ul {
    list-style-type: none;
  }

  a,
  a:not([href]):not([tabindex]) {
    cursor: pointer;
    color: ${(props) => (props.isAuthor ? "#ffffff" : "#8C3B9B")};
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
        @media (max-width: 991.99px) {
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
      border: 1px solid ${(props) => (props.isAuthor ? "#ffffff" : "#8C3B9B")};

      &:focus,
      &:hover {
        border: 1px solid ${(props) => (props.isAuthor ? "#fff" : "#0056b3")};
      }

      &.btn-action {
        margin-top: 0.5rem;
        border-radius: 8px;
      }

      &.btn-complete {
        color: ${(props) => (props.isAuthor ? "#fff" : "#0056b3")};
        border: 1px solid ${(props) => (props.isAuthor ? "#fff" : "#0056b3")};
      }
    }
  }

  span.completed {
    text-decoration: line-through;
  }
`;
const ChatContentClap = styled.div`
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
        border-left-color: #f0f0f0;
        position: absolute;
        top: 6px;
        left: -15px;
        z-index: 1;
        ${(props) =>
          props.isAuthor === true &&
          `
            left: auto;
            right: -15px;
            border-left-color: red;
            border-left-color: #7A1B8B;
            border-right-color: transparent;
        `};
        width: 20px;
        height: 20px;
    }
    `}

  .reply-author {
    ${(props) => (props.isAuthor ? "margin-left: 30px" : "margin-right: 30px")};
  }
  .reply-content {
    clear: both;
    width: 100%;
    display: block;
    z-index: 1;

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
  color: #676767;
  display: flex;
  flex-flow: ${(props) => (props.isAuthor ? "row" : "row-reverse")};
  .reply-date {
    margin: ${(props) => (props.isAuthor ? "0 10px 0 0" : "0 0 0 10px")};
    flex-flow: column;
    justify-content: center;
  }
  .reply-date.updated {
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

const ChatNameNotAuthor = styled.span`
  padding: ${(props) => (props.isEmoticonOnly || props.isGifOnly || props.hasFiles === true ? "3px 9px 3px 9px" : "0")};
  font-weight: 500;
  color: #929496;
  &.important {
    font-weight: 600;
    color: #191c20;
  }
  @media (max-width: 620px) {
    display: block;
    font-size: 11px;
    line-height: 1.2;
  }
`;

const ChatBubbleVirtualized = (props) => {
  const { reply, showAvatar, selectedChannel, showGifPlayer, isAuthor, user, chatMessageActions, timeFormat, chatSettings, dictionary, users, translated_channels, chat_language, translate, language } = props;

  const history = useHistory();
  const googleApis = useGoogleApis();

  useChatFancyLink({ message: reply, actions: chatMessageActions });

  useChatTranslate({ message: reply, isAuthor, translate: selectedChannel.is_translate, chat_language, actions: chatMessageActions });

  const { quoteAuthor, quoteBody, replyBody, hasMessage, isGifOnly, isEmoticonOnly } = useChatReply({
    reply,
    dictionary,
    isAuthor,
    user,
    selectedChannel,
    users,
    translate,
    language,
    translated_channels,
    chat_language,
  });

  const hasFiles = reply.files.length > 0;
  const hasRemoveOnDlFiles = reply.files.some((f) => f.remove_on_download);

  const refs = {
    container: useRef(null),
  };

  const contentRef = useRef(null);

  const handleQuoteContentRef = (e) => {
    if (e) {
      const googleLinks = e.querySelectorAll('[data-google-link-retrieve="0"]');
      googleLinks.forEach((gl) => {
        googleApis.init(gl);
      });
    }
  };

  const handleContentRef = (e) => {
    if (e) {
      const googleLinks = e.querySelectorAll('[data-google-link-retrieve="0"]');
      googleLinks.forEach((gl) => {
        googleApis.init(gl);
      });
    }
  };

  const handleChannelMessageLink = (e) => {
    e.preventDefault();
    history.push(e.currentTarget.dataset.href);
    return false;
  };

  useEffect(() => {
    const lnkChannelMessage = refs.container.current.querySelector("a.push");

    // if (contentRef.current) {
    //   const googleLinks = contentRef.current.querySelectorAll('[data-google-link-retrieve="0"]');
    //   googleLinks.forEach((gl) => {
    //     googleApis.init(gl);
    //   });
    // }

    if (lnkChannelMessage) lnkChannelMessage.addEventListener("click", handleChannelMessageLink, true);

    return () => {
      if (lnkChannelMessage) lnkChannelMessage.removeEventListener("click", handleChannelMessageLink, true);
    };
  }, []);

  const handleQuoteClick = (e) => {
    if (reply.quote) {
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

  const isExternalUser = reply.user && users[reply.user.id] && users[reply.user.id].type === "external" && !isAuthor;

  return (
    <ChatBubbleContainer
      ref={refs.container}
      tabIndex={reply.id}
      hasFiles={hasFiles}
      className={`chat-bubble ql-editor ${reply.is_important && "important"} ${isExternalUser && "external-chat"}`}
      showAvatar={showAvatar}
      isAuthor={isAuthor}
      hideBg={isEmoticonOnly || isGifOnly || (hasFiles && !hasMessage)}
      theme={chatSettings.chat_message_theme}
      hasGif={showGifPlayer}
      hasRemoveOnDlFiles={hasRemoveOnDlFiles}
    >
      {
        <>
          {reply.is_transferred && (
            <ForwardedSpan className="small" isAuthor={isAuthor}>
              <SvgIconFeather icon="corner-up-right" />
              {dictionary.repliedViaEmail}
            </ForwardedSpan>
          )}
          <ChatContentClap className="chat-content-clap" isAuthor={isAuthor}>
            <ChatContent showAvatar={showAvatar} isAuthor={isAuthor} isEmoticonOnly={isEmoticonOnly} className={"chat-content animated slower"} ref={contentRef}>
              {!isAuthor && showAvatar && (
                <>
                  <ChatNameNotAuthor isEmoticonOnly={isEmoticonOnly} hasFiles={hasFiles} isGifOnly={isGifOnly} className={`chat-name-not-author-mobile ${reply.is_important && "important"}`}>
                    {reply.user.type === "BOT" && reply.user.code && reply.user.code.includes("huddle") ? dictionary.teamFeedback : reply.user.name}
                  </ChatNameNotAuthor>
                </>
              )}

              {reply.quote && reply.quote.body && !reply.is_deleted && (reply.quote.user_id !== undefined || reply.quote.user !== undefined) && (
                <QuoteContainer
                  className={"quote-container"}
                  showAvatar={showAvatar}
                  isEmoticonOnly={isEmoticonOnly}
                  hasFiles={hasFiles}
                  theme={chatSettings.chat_message_theme}
                  onClick={handleQuoteClick}
                  //onTouchEnd={handleQuoteClick}
                  isAuthor={isAuthor}
                >
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
              {hasMessage && (
                <span>
                  <ReplyContent
                    ref={handleContentRef}
                    hasFiles={hasFiles}
                    theme={chatSettings.chat_message_theme}
                    isAuthor={isAuthor}
                    className={`reply-content ${isEmoticonOnly ? "emoticon-body" : ""} ${reply.is_deleted ? "is-deleted" : ""}`}
                    dangerouslySetInnerHTML={{ __html: replyBody }}
                  />
                </span>
              )}
              {reply.files.length > 0 && !reply.is_deleted && (
                <ChatMessageFiles
                  dictionary={dictionary}
                  hasMessage={hasMessage}
                  isAuthor={isAuthor}
                  theme={chatSettings.chat_message_theme}
                  files={reply.files}
                  reply={reply}
                  type="chat"
                  topic_id={selectedChannel.type === "TOPIC" ? selectedChannel.entity_id : null}
                />
              )}
              {showGifPlayer && <BlobGifPlayer body={reply.body} autoplay={true} />}
            </ChatContent>
          </ChatContentClap>
          <ChatTimeStamp className="chat-timestamp" isAuthor={isAuthor}>
            <span className="reply-date created">
              <span>{timeFormat.todayOrYesterdayDate(reply.created_at.timestamp)}</span>
              {hasRemoveOnDlFiles && <span>{dictionary.removeOnDownload}</span>}
            </span>
          </ChatTimeStamp>
        </>
      }
    </ChatBubbleContainer>
  );
};

export default React.memo(ChatBubbleVirtualized);
