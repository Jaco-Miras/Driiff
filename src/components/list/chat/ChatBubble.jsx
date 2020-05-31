import {hexToCSSFilter} from "hex-to-css-filter";
import React, {forwardRef, useEffect, useRef, useState} from "react";
import {renderToString} from "react-dom/server";
import GifPlayer from "react-gif-player";
import "react-gif-player/src/GifPlayer.scss";
import {useInView} from "react-intersection-observer";
import {useDispatch, useSelector} from "react-redux";
import {useHistory} from "react-router-dom";
import Skeleton from "react-skeleton-loader";
import styled from "styled-components";
import {todayOrYesterdayDate} from "../../../helpers/momentFormatJS";
import quillHelper from "../../../helpers/quillHelper";
import {getEmojiRegexPattern, stripGif} from "../../../helpers/stringFormatter";
import {
    markReminderComplete,
    setSelectedChannel,
    updateChatMessage,
    updateChatMessageReminderComplete,
} from "../../../redux/actions/chatActions";
import {ImageTextLink, SvgIconFeather, SvgImage} from "../../common";
import {_t} from "../../hooks";
import MessageFiles from "./Files/MessageFiles";
import Unfurl from "./Unfurl/Unfurl";

const ChatBubbleContainer = styled.div`
    position: relative;
    display: inline-flex;
    flex-flow: column;
    //flex-flow: ${props => props.isAuthor ? "row-reverse" : "row"};
    padding: 7px 15px;
    border-radius: 8px;
    background: ${props => (props.isAuthor ? props.theme.self.chat_bubble_background_color : props.theme.others.chat_bubble_background_color)};
    text-align: left;
    width: 100%;
    color: ${props => (props.isAuthor ? props.theme.self.chat_bubble_text_color : props.theme.others.chat_bubble_text_color)};
    font-size: .835rem;
    overflow: visible;
    ${props => props.hideBg === true && `
        background: none;
    `}
    &:focus {
        -webkit-box-shadow: 0 0 0 1px ${props => (props.isAuthor ? props.theme.self.chat_bubble_focus_border_color : props.theme.others.chat_bubble_focus_border_color)};
        -moz-box-shadow: 0 0 0 1px ${props => (props.isAuthor ? props.theme.self.chat_bubble_focus_border_color : props.theme.others.chat_bubble_focus_border_color)};
        box-shadow: 0 0 0 1px ${props => (props.isAuthor ? props.theme.self.chat_bubble_focus_border_color : props.theme.others.chat_bubble_focus_border_color)};
    }

    a:not([href]):not([tabindex]) {
        color: ${props => (props.isAuthor ? props.theme.self.chat_bubble_link_color : props.theme.others.chat_bubble_link_color)};

        &:hover {
            color: ${props => (props.isAuthor ? props.theme.self.chat_bubble_hover_color : props.theme.others.chat_bubble_hover_color)};
        }
    }

    video{
        width: 100%;
    }
    p.reply-author {
        color: ${props => props.isAuthor ? "#ffffff" : props.theme.others.chat_bubble_name_text_color};
        font-weight: 400;
        font-size: 12px;
        font-style: italic;
        margin: 0;
        display: block;
        position: absolute;
        top: -24px;
        left: 0;
        white-space: nowrap;
        ${props => props.isForwardedMessage === true && "top: -40px;"}
    }
    span.emoticon-body {
        font-size: 2.5rem;
    }
    .reply-content img{
        max-width: 100%;
        max-height: 300px;
    }
    // img {
    //     max-width: 100%;
    //     max-height: 300px;
    // }


    span.reply-date{
        color: #a7abc3;
        font-style: italic;
        font-size: 11px;
        position: absolute;
        top: 0;
        ${props => props.isAuthor ? "right: 100%" : "left: 100%"};
        display: flex;
        height: 100%;
        align-items: center;
        white-space: nowrap;
    }
    // * {
    //     word-break: break-all;
    // }
    ol {
      text-align: left;
      position: relative;
      padding-inline-start: 15px;
    }
    ul {
      li {
          text-align: left;
          position: relative;
          margin-left: 10px;

          :before {
            content: '';
            position: absolute;
            left: 2em;
            top: 10px;
            bottom: 0;
            width: 5px;
            height: 5px;
            display: block;
            background: #000;
            border-radius: 50%;
          }
        }
    }
    span.is-deleted {
        font-style: italic;
        color: ${props => props.isAuthor ? "#ffffffe6" : "#AAB0C8"};
    }
    .mention {
        ${"" /* // background-image: linear-gradient(105deg,#46598d, #4f99a6);
 &[data-value="All"] {
 background-image: linear-gradient(105deg,#972c86,#794997);
 }
 &.is-author {
 background-image: linear-gradient(105deg,#972c86,#794997);
 } */}
        font-weight: ${props => props.isAuthor ? "none" : "bold"};
        color: ${props => props.isAuthor ? "#ffffff" : "#7A1B8B"};
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
    }
    a.call-button{
        display: block;
    }
    .call-user{
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
  background: ${props => (props.isAuthor ? props.theme.self.chat_bubble_quote_background_color : props.theme.others.chat_bubble_quote_background_color)};
  ${"" /* background: #8C3B9B; */}
  border-radius: 8px 8px 0 0;
  margin: -7px -15px 10px -15px;
  text-align: left;
  padding: 10px 10px 10px 20px;
  ${"" /* overflow: hidden; */}
  position: relative;
  cursor: pointer;
  cursor: hand;
  max-width: ${props => props.hasFiles ? "210px" : "auto"};
  ${"" /* color: rgba(255,255,255, 0.8); */}
  &:before {
    height: 70%;
    width: 5px;
    background: ${props => (props.isAuthor ? props.theme.self.chat_bubble_quote_background_color : props.theme.others.chat_bubble_quote_background_color)};
    background: #ffffffe6;
    position: absolute;
    ${props => ((!props.isEmoticonOnly) && "content: ''")};

    display: inline-block;
    float: left;
    left: 5px;
    opacity: 0.8;
  }
  &:after {
    ${props => ((!props.isEmoticonOnly) && "content: ''")};
    border: 10px solid transparent;
    ${props => props.isAuthor ? "border-left-color: " + props.theme.self.chat_bubble_quote_background_color : "border-right-color: " + props.theme.others.chat_bubble_quote_background_color};
    position: absolute;
    top: ${props => ((props.showAvatar && !props.isAuthor) ? "6px" : "8px")};;

    z-index: 1;
    ${props => !props.isAuthor ? "left: -19px" : "right: -20px"};
}

`;
const QuoteAuthor = styled.div`
  font-weight: 600;
  ${"" /* color: ${props => (props.isAuthor ? props.theme.self.chat_bubble_quote_text_color : props.theme.others.chat_bubble_quote_text_color )}; */}
  ${"" /* color: red; */}

  ${"" /* color: ${props => (props.isAuthor ? 'red' : 'blue' )}; */}

`;
const QuoteContent = styled.div`
color: ${props => (props.isAuthor ? props.theme.self.chat_bubble_quote_text_color : props.theme.others.chat_bubble_quote_text_color)};
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
    word-wrap: break-word;

    a {
        color: ${props => (props.isAuthor ? "#ffffffe6" : "#8C3B9B")};
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
                filter: brightness(0) saturate(100%) ${props => (props.isAuthor ? hexToCSSFilter(props.theme.self.chat_bubble_link_color).filter : hexToCSSFilter(props.theme.others.chat_bubble_link_color).filter)};
            }

            &:hover {
                color: #972C86;

                img.component-svg-image {
                    filter: brightness(0) saturate(100%) ${props => (props.isAuthor ? hexToCSSFilter(props.theme.self.chat_bubble_hover_color).filter : hexToCSSFilter(props.theme.others.chat_bubble_hover_color).filter)};
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

    ${props => props.hasMessage &&
    `
    `}
`;
const ReplyContent = styled.span`
    max-width: ${props => props.hasFiles ? "200px" : "auto"};
    ul {
        list-style-type: none;
    }

    a,
    a:not([href]):not([tabindex]) {
        cursor: pointer;
        color: ${props => (props.isAuthor ? props.theme.self.chat_bubble_link_color : props.theme.others.chat_bubble_link_color)};
        color: ${props => (!props.isAuthor ? "#7a1b8b" : "#ffffff99")};
        text-decoration: underline;
        &:focus,
        &:hover {
            ${"" /* color: ${props => (props.isAuthor ? props.theme.self.chat_bubble_hover_color : props.theme.others.chat_bubble_hover_color)}; */}
            color: ${props => (!props.isAuthor ? "#7a1b8b" : "#ffffff")};
        }
        &.btn {
            border: 1px solid ${props => (props.isAuthor ? props.theme.self.chat_bubble_link_color : props.theme.others.chat_bubble_link_color)};

            &:focus,
            &:hover {
                border: 1px solid ${props => (props.isAuthor ? props.theme.self.chat_bubble_hover_color : props.theme.others.chat_bubble_hover_color)};
            }

            &.btn-action {
                margin-top: 0.5rem;
                border-radius: 8px;
            }

            &.btn-complete {
                color: ${props => (props.isAuthor ? props.theme.self.chat_bubble_hover_color : props.theme.others.chat_bubble_hover_color)};
                border: 1px solid ${props => (props.isAuthor ? props.theme.self.chat_bubble_hover_color : props.theme.others.chat_bubble_hover_color)};
            }
        }
    }

    span.completed {
        text-decoration:line-through;
    }
`;
const ChatContentClap = styled.div`
    //margin-top: 10px;
  display: flex;
  flex-flow: ${props => props.isAuthor ? "row" : "row-reverse"};

  .chat-content {
      width: 100%;
      padding-left: 0;
  }

  .chat-clap{
    float: ${props => props.isAuthor ? "left" : "right"};
  }
`;
const ChatContent = styled.div`
    ${props => (!props.isEmoticonOnly && `
    &:before {
        ${props => (props.showAvatar && "content: '';")};
        border: 10px solid transparent;
        border-right-color: transparent;
        border-right-color: #f0f0f0;
        position: absolute;
        top: 8px;
        left: -20px;
        z-index: 1;
        ${props => (props.isAuthor === true && `
            left: auto;
            right: -20px;
            border-left-color: #7A1B8B;
            border-right-color: transparent;
        `)};
        width: 20px;
        height: 20px;
    }
    `)}

    .reply-author {
        // padding: ${props => props.isAuthor ? "0 10px 0 40px" : "0 40px 0 10px"};
        ${props => props.isAuthor ? "margin-left: 30px" : "margin-right: 30px"};
    }
    .reply-content {
        clear: both;
        width: 100%;
        display: block;
        // ${props => props.isAuthor ? "margin-left: 30px" : "margin-right: 30px"};

        p {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: pre-wrap;
            word-wrap: break-word;

            a {
                color: ${props => (props.isAuthor ? "#ff4444" : "#ff4444")};
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
        height: 250px;

        .gifPlayer {
            padding: px;
            max-height: 250px;
        }

        .play_button {
            padding: 12px 10px;
        }
    }
`;

const ChatTimeStamp = styled.div`
    // position: absolute;
    // left: ${props => props.isAuthor ? "5px" : "unset"};
    // right: ${props => props.isAuthor ? "unset" : "5px"};
    color: #676767;
  display: flex;
  flex-flow: ${props => props.isAuthor ? "row" : "row-reverse"};
  .reply-date{
    margin: ${props => props.isAuthor ? "0 10px 0 0" : "0 0 0 10px"};
  }
  .reply-date.updated{
    // -webkit-transition: all 0.2s ease-in-out;
    // -o-transition: all 0.2s ease-in-out;
    // transition: all 0.2s ease-in-out;
    >span:last-child{
        display: none;
    }
  }
  .reply-date.updated:hover{
    >span:first-child{
        display: none;
    }
    >span:last-child{
        display: block;
    }
  }
`;

const StyledImageTextLink = styled(ImageTextLink)`
  display: block;
  svg, polyline, circle, g {
      stroke: ${props => (props.isAuthor ? "#ffffffe6" : "#8C3B9B")};
  }
`;

const ForwardedSpan = styled.span`
    color: #AAB0C8;
    font-style: italic;
    display: flex;
    align-items: center;
    font-size: 12px;
    position: absolute;
    top: calc(50% - 25px);
    margin: 0 10px;
    ${props => props.isAuthor ? "right: 100%;" : "left: 100%;"};
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

const ChatBubble = forwardRef((props, ref) => {
    const {
        reply,
        showAvatar,
        selectedChannel,
        showGifPlayer,
        isAuthor,
        addMessageRef,
    } = props;

    const dispatch = useDispatch();
    const history = useHistory();
    const [chatFiles, setChatFiles] = useState([]);
    const [loadRef, loadInView] = useInView({
        threshold: 1,
    });
    const recipients = useSelector(state => state.global.recipients);
    const user = useSelector(state => state.session.user);
    const refComponent = useRef();


    const handleMarkComplete = () => {
        dispatch(
            markReminderComplete({message_id: reply.id}, (err, res) => {
                if (err)
                    console.log(err);

                if (res)
                    dispatch(
                        updateChatMessageReminderComplete({
                            channel_id: reply.channel_id,
                            message_id: reply.id,
                        }),
                    );
            }),
        );
    };

    const handleRemoveReply = () => {
        let newBody = reply.original_body.replace("You asked me to remind you ", "OK! I’ve deleted the reminder ");

        const channelName = newBody.replace(newBody.substr(0, newBody.search(" in ") + 4, newBody), "");
        newBody = newBody.replace(` in ${channelName}`, ` in <a class="push" data-href="/chat/${reply.quote.channel_code}">#${channelName}</a>`);

        const link = `/chat/${reply.quote.channel_code}/${reply.quote.code}`;
        newBody = newBody.replace("this message", `<a class="push" href="${link}">this message</a>`);

        dispatch(
            updateChatMessage({
                body: newBody,
                message_id: reply.id,
                reply_id: reply.id,
            }),
        );
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

        let image = temporalDivElement.querySelectorAll("img[src$=\".gif\"], a[href$=\".gif\"]");
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
            let sc = props.activeChatChannels.filter(ac => ac.id === reply.quote.channel_id)[0];
            if (sc) {
                dispatch(
                    setSelectedChannel(sc),
                );
            }

            setTimeout(() => {
                let el = document.querySelector(`.chat-list-item-${reply.quote.id}`);
                if (el) {
                    el.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                        inline: "center",
                    });
                    let bubble = el.querySelector(".chat-bubble");
                    bubble.focus();
                    //bubble.classList.add('focus');
                }
            }, 3000);
        } else {
            let el = document.querySelector(`.chat-list-item-${reply.quote.id}`);
            if (el) {
                el.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                    inline: "center",
                });
                let bubble = el.querySelector(".chat-bubble");
                bubble.focus();
                //bubble.classList.add('focus');
            }
        }
    };

    useEffect(() => {
        const btnComplete = refComponent.current.querySelector(".btn-action.btn-complete");
        if (btnComplete)
            btnComplete.addEventListener("click", handleMarkComplete, true);

        const btnDelete = refComponent.current.querySelector(".btn-action.btn-delete");
        if (btnDelete)
            btnDelete.addEventListener("click", handleRemoveReply, true);

        const lnkChannelMessage = refComponent.current.querySelector("a.push");
        if (lnkChannelMessage)
            lnkChannelMessage.addEventListener("click", handleChannelMessageLink, true);

        return () => {
            if (btnComplete)
                btnComplete.removeEventListener("click", handleMarkComplete, true);

            if (btnDelete)
                btnDelete.removeEventListener("click", handleRemoveReply, true);

            if (lnkChannelMessage)
                lnkChannelMessage.removeEventListener("click", handleChannelMessageLink, true);
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (addMessageRef && props.handleMessageRefChange) {
            props.handleMessageRefChange(loadInView, null, reply.id);
        }
    }, [addMessageRef, loadInView, props, props.handleMessageRefChange, reply.id]);

    useEffect(() => {
        let chatFiles = [];
        for (const i in selectedChannel.replies) {
            const r = selectedChannel.replies[i];
            if (r.files.length > 0) {
                chatFiles = [
                    ...r.files.filter(f => {
                        return true;
                    }),
                    ...chatFiles,
                ];
            }
        }
        setChatFiles(chatFiles);
    }, [selectedChannel.replies]);


    let isEmoticonOnly = false;
    let replyBody = "";
    if (reply.is_deleted) {
        replyBody = _t(reply.body, "The chat message has been deleted");
    } else {
        replyBody = quillHelper.parseEmoji(reply.body);

        if (reply.created_at.timestamp !== reply.updated_at.timestamp) {
            replyBody = `${replyBody}<span class='edited-message'>(edited)</span>`;
        }

        if (replyBody.length === 13) {
            if (replyBody !== reply.body) {
                isEmoticonOnly = true;
            } else {
                let match = replyBody.match(getEmojiRegexPattern());
                if (match && match.length === 1) {
                    isEmoticonOnly = true;
                }
            }
        }
    }

    let replyQuoteBody = "";
    let replyQuoteAuthor = "You";
    let quoteAuthor;
    if (reply.quote) {
        let div = document.createElement("div");
        div.innerHTML = reply.quote.body;
        let images = div.getElementsByTagName("img");
        for (let i = 0; i < images.length; i++) {
            replyQuoteBody += renderToString(
                <StyledImageTextLink
                    className={`image-quote`}
                    target={`_blank`}
                    href={images[0].getAttribute("src")}
                    icon={`image-video`}
                    isAuthor={isAuthor}
                >
                    Photo
                </StyledImageTextLink>,
            );
        }

        let videos = div.getElementsByTagName("video");
        for (let i = 0; i < videos.length; i++) {
            replyQuoteBody += renderToString(
                <StyledImageTextLink
                    className={`video-quote`}
                    target={`_blank`}
                    href={videos[0].getAttribute("player-source")}
                    icon={`image-video`}
                    isAuthor={isAuthor}
                >
                    Video
                </StyledImageTextLink>,
            );
        }
        if (reply.quote.files) {
            reply.quote.files.forEach(file => {
                if (file.type === "image") {
                    replyQuoteBody += renderToString(
                        <StyledImageTextLink
                            className={`image-quote`}
                            target={`_blank`}
                            href={file.view_link}
                            icon={`image-video`}
                            isAuthor={isAuthor}
                        >
                            Photo
                        </StyledImageTextLink>,
                    );
                } else if (file.type === "video") {
                    replyQuoteBody += renderToString(
                        <StyledImageTextLink
                            className={`video-quote`}
                            target={`_blank`}
                            href={file.view_link}
                            icon={`image-video`}
                            isAuthor={isAuthor}
                        >
                            Video
                        </StyledImageTextLink>,
                    );
                } else {
                    replyQuoteBody += renderToString(
                        <StyledImageTextLink
                            //className={`video-quote`}
                            target={`_blank`}
                            href={file.view_link}
                            icon={`documents`}
                            isAuthor={isAuthor}
                        >
                            {file.filename ? `${file.filename} ` : `${file.name} `}
                        </StyledImageTextLink>,
                    );
                }
            });
        }

        replyQuoteBody += quillHelper.parseEmoji(reply.quote.body);
        if (reply.quote.user) {
            replyQuoteAuthor = reply.quote.user.name;
        } else {
            if (user.id !== reply.quote.user_id) {
                quoteAuthor = recipients.filter(
                    r => r.type === "USER" && r.type_id === reply.quote.user_id,
                )[0];
                if (quoteAuthor) {
                    replyQuoteAuthor = quoteAuthor.name;
                }
            }
        }
    }

    //const searchWords = props.filterSearch.split(" ");
    //const textToHighlight = replyBody;
    let highlightedText = null;
    // if (props.filterSearch !== "") {
    //     const chunks = findAll({
    //         searchWords,
    //         textToHighlight,
    //     });
    //     if (chunks.filter(c => c.highlight).length) {
    //         highlightedText = chunks
    //             .map(chunk => {
    //                 const {end, highlight, start} = chunk;
    //                 const text = replyBody.substr(start, end - start);
    //                 if (highlight) {
    //                     return `<mark>${text}</mark>`;
    //                 } else {
    //                     return text;
    //                 }
    //             })
    //             .join("");
    //     }
    // }

    let botCodes = ["gripp_bot_account", "gripp_bot_invoice", "gripp_bot_offerte",
        "gripp_bot_project", "gripp_bot_account", "driff_webhook_bot"];
    let isBot = botCodes.includes(reply.user.code);

    if (replyBody.includes("ACCOUNT_DEACTIVATED")) {
        let newReplyBody = replyBody.replace("ACCOUNT_DEACTIVATED ", "");
        if (newReplyBody[newReplyBody.length - 1] === "s") {
            replyBody = `Update: ${newReplyBody}' account is deactivated.`;
        } else {
            replyBody = `Update: ${newReplyBody}'s account is deactivated.`;
        }
    } else if (replyBody.includes("NEW_ACCOUNT_ACTIVATED")) {
        let newReplyBody = replyBody.replace("NEW_ACCOUNT_ACTIVATED ", "");

        if (newReplyBody[newReplyBody.length - 1] === "s") {
            replyBody = `Update: ${newReplyBody}' account is activated.`;
        } else {
            replyBody = `Update: ${newReplyBody}'s account is activated.`;
        }
    }

    if (replyQuoteBody.includes("ACCOUNT_DEACTIVATED")) {
        let newReplyBody = replyQuoteBody.replace("ACCOUNT_DEACTIVATED ", "");
        if (newReplyBody[newReplyBody.length - 1] === "s") {
            replyQuoteBody = `Update: ${newReplyBody}' account is deactivated.`;
        } else {
            replyQuoteBody = `Update: ${newReplyBody}'s account is deactivated.`;
        }
    } else if (replyQuoteBody.includes("NEW_ACCOUNT_ACTIVATED")) {
        let newReplyBody = replyQuoteBody.replace("NEW_ACCOUNT_ACTIVATED ", "");

        if (newReplyBody[newReplyBody.length - 1] === "s") {
            replyQuoteBody = `Update: ${newReplyBody}' account is activated.`;
        } else {
            replyQuoteBody = `Update: ${newReplyBody}'s account is activated.`;
        }
    }


    const hasFiles = reply.files.length > 0;
    const hasMessage = reply.body !== "<span></span>";

    return <ChatBubbleContainer
        ref={refComponent}
        tabIndex={reply.id}
        className={`chat-bubble ql-editor`}
        showAvatar={showAvatar}
        isAuthor={isAuthor}
        hideBg={isEmoticonOnly || showGifPlayer || (hasFiles && replyBody === "<span></span>")}
        theme={props.settings.chat_message_theme}>
        {
            <>
                {
                    reply.is_transferred &&
                    <ForwardedSpan className="small" isAuthor={isAuthor}>
                        <SvgIconFeather icon="corner-up-right"/>Forwarded message
                    </ForwardedSpan>
                }
                <ChatContentClap
                    ref={addMessageRef ? loadRef : null}
                    className='chat-content-clap'
                    isAuthor={isAuthor}>
                    <ChatContent showAvatar={showAvatar} isAuthor={isAuthor} isEmoticonOnly={isEmoticonOnly}
                                 className={`chat-content animated slower ${highlightedText ? "is-highlighted" : ""}`}>
                        {
                            reply.quote && reply.quote.body && (reply.is_deleted === 0) &&
                            (reply.quote.user_id !== undefined || reply.quote.user !== undefined) &&
                            <QuoteContainer
                                showAvatar={showAvatar}
                                isEmoticonOnly={isEmoticonOnly}
                                hasFiles={hasFiles}
                                theme={props.settings.chat_message_theme}
                                onClick={handleQuoteClick} isAuthor={isAuthor}>
                                {
                                    reply.quote.user_id === user.id ?
                                    <QuoteAuthor
                                        theme={props.settings.chat_message_theme}
                                        isAuthor={true}>{`You`}</QuoteAuthor> :
                                    <QuoteAuthor
                                        theme={props.settings.chat_message_theme}
                                        isAuthor={reply.quote.user_id === user.id}>{replyQuoteAuthor}</QuoteAuthor>
                                }
                                <QuoteContent
                                    theme={props.settings.chat_message_theme}
                                    isAuthor={isAuthor}
                                    dangerouslySetInnerHTML={{__html: replyQuoteBody.split("</p>")[0]}}
                                ></QuoteContent>
                            </QuoteContainer>
                        }
                        {
                            !isAuthor && showAvatar &&
                            <>
                                {
                                    isBot === true &&
                                    <GrippBotIcon icon={`gripp-bot`}/>
                                }
                                <p className={"reply-author"}>{reply.user.name.replace("  ", " ")}</p>
                            </>

                        }
                        {
                            (reply.files.length > 0) && (!reply.is_deleted) &&
                            <ChatMessageFiles
                                hasMessage={hasMessage}
                                isAuthor={isAuthor}
                                theme={props.settings.chat_message_theme}
                                chatFiles={chatFiles}
                                files={reply.files}
                                reply={reply}
                                type="chat"
                            />
                        }
                        {
                            <ReplyContent
                                hasFiles={hasFiles}
                                theme={props.settings.chat_message_theme}
                                isAuthor={isAuthor}
                                className={`reply-content ${isEmoticonOnly ? "emoticon-body" : ""} ${reply.is_deleted ? "is-deleted" : ""}`}
                                dangerouslySetInnerHTML={showGifPlayer ? {__html: stripGif(replyBody)} : {__html: replyBody}}
                            />
                        }

                        {
                            showGifPlayer && fetchGifCount(replyBody).map((gifLink, index) => {
                                let gifString = gifLink.outerHTML;

                                return <GifPlayer
                                    key={index}
                                    className={`gifPlayer`}
                                    gif={fetchImgURL(gifString)}
                                    autoplay={true}
                                />;
                            })
                        }
                        {
                            (reply.unfurls && reply.unfurls.length && (!reply.is_deleted) && !showGifPlayer && !isBot) === true &&
                            <Unfurl
                                unfurlData={reply.unfurls}
                                isAuthor={isAuthor}
                                deleteUnfurlAction={props.deleteUnfurlAction}
                                removeUnfurl={props.removeUnfurl}
                                channelId={props.channelId}
                                messageId={reply.id}
                                type={"chat"}
                            />
                        }
                        {
                            reply.unfurl_loading !== undefined && reply.unfurl_loading &&
                            <Skeleton color="#dedede" borderRadius="10px" width="100%" height="150px"
                                      widthRandomness={0} heightRandomness={0}/>
                        }
                    </ChatContent>
                </ChatContentClap>
                <ChatTimeStamp className='chat-timestamp'
                               isAuthor={isAuthor}>
                    <span className="reply-date created">
                        {reply.created_at.diff_for_humans ? "sending..." : todayOrYesterdayDate(reply.created_at.timestamp)}
                    </span>
                </ChatTimeStamp>
            </>
        }
        {props.children}
    </ChatBubbleContainer>;
});

export default React.memo(ChatBubble);
