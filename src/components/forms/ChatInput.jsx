import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import {
  addChatMessage,
  addQuote,
  addToChannels,
  clearChannelDraft,
  clearQuote,
  onClickSendButton,
  postChannelMembers,
  postChatMessage,
  putChatMessage,
  setEditChatMessage,
  setSelectedChannel,
  incomingUpdatedChatMessage,
} from "../../redux/actions/chatActions";
import { deleteDraft } from "../../redux/actions/globalActions";
import { SvgIconFeather } from "../common";
import BodyMention from "../common/BodyMention";
import { useChannelActions, useDraft, useQuillInput, useQuillModules, useSaveInput, useSelectQuote, useTimeFormat, useHuddle, useToaster } from "../hooks";
import QuillEditor from "./QuillEditor";
import _ from "lodash";
import { useHistory } from "react-router-dom";
import { HuddleQuestion } from "../panels/bot";

const StyledQuillEditor = styled(QuillEditor)`
  &.chat-input {
    // border: 1px solid #afb8bd;
    // border-radius: 5px;
    max-height: 180px;
    @media (min-width: 768px) {
      max-height: 370px;
    }
    position: static;
    overflow: auto;
    &::-webkit-scrollbar {
      display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .ql-container {
    position: static;
  }
  .ql-toolbar {
    display: none;
  }
  .ql-editor {
    padding: 11px 9px;
    ${(props) => props.showFileIcon && "padding-left: 30px"};
    ${(props) => props.editMode && "> div {width:calc(100% - 15px);}"}
    &:focus {
      box-shadow: none;
      border-color: rgba(122, 27, 139, 0.8);
    }
  }
  .ql-editor.ql-blank::before {
    ${(props) => props.showFileIcon && "left: 25px"};
  }
  .ql-container {
    border: none;
  }
  .ql-mention-list-container-top,
  .ql-mention-list-container {
    width: 300px !important;
    max-height: 170px;
    background: rgb(255, 255, 255);
    border-radius: 8px;
    box-shadow: rgba(26, 26, 26, 0.4) 0px 2px 3px 0px, rgba(0, 0, 0, 0.1) 0px 1px 3px 0px;
    overflow-x: hidden;
    overflow-y: auto;
    z-index: 1000;

    .dark & {
      background: #25282c;
      color: #c7c7c7;
    }

    .ql-mention-list {
      padding: 0;

      .ql-mention-list-item {
        display: flex;
        align-items: center;
        padding-top: 1rem;
        padding-bottom: 1rem;
        padding-left: 1rem;

        &.selected {
          background: ${(props) => props.theme.colors.primary};
          color: #fff;
          cursor: pointer;
          span.all-pic > img {
            filter: brightness(0) saturate(100%) invert(1);
          }
        }
      }
    }
  }
  .ql-snow a {
    color: ${(props) => props.theme.colors.primary};
  }
`;

const FileIcon = styled(SvgIconFeather)`
  position: absolute;
  top: 0;
  left: 0;
  margin: 4px;
  height: calc(100% - 8px);
  background: white;
  border: 1px solid white;
  border-radius: 4px;
  width: 20px;
  // padding: 9px;
  cursor: pointer;
  z-index: 9;
  color: #cacaca;
  transition: color 0.15s ease-in-out;

  &:hover {
    color: ${(props) => props.theme.colors.primary};
  }
`;
const getSlug = () => {
  let driff = localStorage.getItem("slug");
  if (driff) {
    return driff;
  } else {
    const host = window.location.host.split(".");
    if (host.length === 3) {
      localStorage.setItem("slug", host[0]);
      return host[0];
    } else {
      return null;
    }
  }
};

/***  Commented out code are to be visited/refactored ***/
const ChatInput = (props) => {
  const { selectedEmoji, onClearEmoji, selectedGif, onClearGif, dropAction, onActive } = props;
  const history = useHistory();
  const dispatch = useDispatch();
  const reactQuillRef = useRef();
  const { localizeDate } = useTimeFormat();
  const { setSidebarSearch, create, fetchChannelLastReply } = useChannelActions();

  //useCountRenders("chat input");

  const selectedChannel = useSelector((state) => state.chat.selectedChannel);
  //const slugs = useSelector((state) => state.global.slugs);
  const recipients = useSelector((state) => state.global.recipients);
  const user = useSelector((state) => state.session.user);
  const editChatMessage = useSelector((state) => state.chat.editChatMessage);
  const sendButtonClicked = useSelector((state) => state.chat.sendButtonClicked);
  const externalUsers = useSelector((state) => state.users.externalUsers);
  const users = useSelector((state) => state.users.users);
  const chatSidebarSearch = useSelector((state) => state.chat.chatSidebarSearch);

  const activeExternalUsers = externalUsers.filter((u) => u.active === 1);

  // const [text, setText] = useState("");
  // const [textOnly, setTextOnly] = useState("");
  // const [quillContents, setQuillContents] = useState([]);
  const [slug] = useState(getSlug());
  const [quillData, setQuillData] = useState({
    text: "",
    textOnly: "",
    quillContents: [],
  });
  const [mentionData, setMentionData] = useState({
    mentionedUserIds: [],
    ignoredMentionedUserIds: [],
  });
  // const [mentionedUserIds, setMentionedUserIds] = useState([]);
  // const [ignoredMentionedUserIds, setIgnoredMentionedUserIds] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editMessage, setEditMessage] = useState(null);
  const [draftId, setDraftId] = useState(null);
  const [answerId, setAnswerId] = useState(null);
  const [addMembersPayload, setAddMembersPayload] = useState(null);

  const [quote] = useSelectQuote();

  useEffect(() => {
    if (quote) {
      reactQuillRef.current.focus();
    }
  }, [quote]);

  const toaster = useToaster();

  const { huddle, huddleAnswered, huddleActions, showQuestions, question, isFirstQuestion, editHuddle } = useHuddle({ selectedChannel });

  //const setEditedAnswerId = useRef(null);
  //useCountRenders();

  useEffect(() => {
    if (editHuddle && question && answerId !== question.answer_id && quillData.textOnly !== question.original_answer) {
      reactQuillRef.current.getEditor().clipboard.dangerouslyPasteHTML(0, question.original_answer);
      if (reactQuillRef.current.getEditor().getText() === question.original_answer) {
        setAnswerId(question.answer_id);
        //setTextOnly(question.original_answer);
        setQuillData({
          ...quillData,
          textOnly: question.original_answer,
        });
      }
    }
  }, [editHuddle, question, answerId, quillData.textOnly]);

  const handleSubmit = () => {
    // if quill has inline image upload progress then return submit
    // eslint-disable-next-line quotes
    if (quillData.text.includes('<span class="image-uploading">')) return;
    if (showQuestions) {
      if (question.isLastQuestion) {
        const currentDate = new Date();
        let payload = {
          huddle_id: huddle.id,
          answers: huddle.questions.map((q) => {
            return {
              question_id: q.id,
              question: q.question,
              answer: q.isLastQuestion ? quillData.textOnly : q.answer,
            };
          }),
        };
        const closingMessage = huddle.closing_message ? huddle.closing_message : "Huddle submitted";
        let cb = (err, res) => {
          if (err) {
            toaster.error("Error huddle");
            return;
          }
          if (huddleAnswered) {
            const { channels } = JSON.parse(huddleAnswered);
            localStorage.setItem("huddle", JSON.stringify({ channels: [...channels, selectedChannel.id], day: currentDate.getDay() }));
          } else {
            localStorage.setItem("huddle", JSON.stringify({ channels: [selectedChannel.id], day: currentDate.getDay() }));
          }
          toaster.success(closingMessage);
        };
        if (editHuddle) {
          // clear edit huddle
          let payload = {
            message_id: editHuddle.huddle_log.message_id,
            huddle_log_id: editHuddle.huddle_log.id,
            answers: editHuddle.questions.map((q) => {
              return {
                id: q.answer_id,
                answer: q.isLastQuestion ? reactQuillRef.current.getEditor().getText() : q.answer,
              };
            }),
          };
          let cb = (err, res) => {
            if (err) return;
            huddleActions.clearHuddle();
          };
          huddleActions.updateUnpublishedAnswers(payload, cb);
        } else {
          huddleActions.createAnswer(payload, cb);
        }
      }
      if (editHuddle) {
        if (!question.isLastQuestion) {
          huddleActions.updateAnswer({
            channel_id: selectedChannel.id,
            question_id: question.id,
            answer: reactQuillRef.current.getEditor().getText(),
          });
          setAnswerId(null);
        }
      } else {
        huddleActions.saveAnswer({
          channel_id: selectedChannel.id,
          question_id: question.id,
          answer: quillData.textOnly,
        });
      }
      handleClearQuillInput();
      return;
    }

    let timestamp = Math.floor(Date.now() / 1000);
    let mention_ids = [];
    let haveGif = false;
    let reference_id = require("shortid").generate();
    let allIds = selectedChannel.members.map((m) => m.id);

    if (quillData.quillContents.ops && quillData.quillContents.ops.length > 0) {
      let mentionIds = quillData.quillContents.ops
        .filter((id) => {
          return id.insert.mention ? id : null;
        })
        .map((mid) => Number(mid.insert.mention.user_id));

      mention_ids = [...new Set(mentionIds)];

      if (mention_ids.includes(NaN)) {
        if (allIds.length) {
          mention_ids = [...new Set([...mention_ids.filter((id) => !isNaN(id)), ...allIds])];
        } else {
          //remove the nan in mention ids
          mention_ids = mention_ids.filter((id) => !isNaN(id));
        }
      }
      quillData.quillContents.ops.forEach((op) => {
        if (op.insert.image) {
          haveGif = true;
        }
      });
    }

    if (_.trim(quillData.textOnly) === "" && mention_ids.length === 0 && !haveGif) return;

    let el = document.createElement("div");
    el.innerHTML = quillData.text;
    for (let i = el.childNodes.length - 1; i >= 0; i--) {
      if (_.trim(el.childNodes[i].innerText) === "" && el.childNodes[i].innerHTML === "<br>") {
        el.removeChild(el.childNodes[i]);
      } else {
        el.childNodes[i].innerHTML = _.trim(el.childNodes[i].innerHTML);
        break;
      }
    }

    let payload = {
      channel_id: selectedChannel.id,
      body: el.innerHTML,
      mention_ids: selectedChannel.type !== "TOPIC" ? mention_ids.filter((id) => !activeExternalUsers.some((ex) => ex.id === id)) : mention_ids,
      file_ids: [],
      reference_id: reference_id,
      reference_title: selectedChannel.type === "DIRECT" ? `${user.first_name} in a direct message` : selectedChannel.title,
      topic_id: selectedChannel.is_shared ? selectedChannel.entity_id : null,
      is_shared: selectedChannel.is_shared ? selectedChannel.entity_id : null,
      code_data: { mention_ids: mention_ids },
    };

    if (quote) {
      if (quote.user) {
        payload.quote = {
          id: quote.id,
          body: quote.body,
          user_id: quote.user.id,
          user: quote.user,
          files: quote.files,
        };
      } else {
        payload.quote = {
          id: quote.id,
          body: quote.body,
          user_id: null,
          user: null,
          files: quote.files,
        };
      }
    }

    let obj = {
      message: el.innerHTML,
      body: el.innerHTML,
      mention_ids: mention_ids,
      user: user,
      original_body: quillData.text,
      is_read: true,
      editable: true,
      files: [],
      is_archive: false,
      is_completed: true,
      is_transferred: false,
      is_deleted: false,
      created_at: { timestamp: timestamp },
      updated_at: { timestamp: timestamp },
      channel_id: selectedChannel.id,
      reactions: [],
      id: reference_id,
      reference_id: reference_id,
      quote: quote ? payload.quote : null,
      unfurls: [],
      g_date: localizeDate(timestamp, "YYYY-MM-DD"),
    };

    if (!editMode) {
      dispatch(addChatMessage(obj));
    }

    if (addMembersPayload) {
      if (selectedChannel.type !== "DIRECT") {
        dispatch(postChannelMembers({ channel_id: addMembersPayload.payload.channel_id, recipient_ids: addMembersPayload.payload.recipient_ids }));
      }
      if (selectedChannel.type === "DIRECT") {
        create(
          {
            recipient_ids: addMembersPayload.payload.recipient_ids,
            title: addMembersPayload.payload.title,
          },
          addMembersPayload.callback
        );
      }
      setAddMembersPayload(null);
    }

    if (editMode) {
      let payloadEdit = {
        ...payload,
        message_id: editMessage.id,
        reply_id: editMessage.id,
      };
      if (quote) {
        payload.quote = quote;
      }
      dispatch(
        putChatMessage(payloadEdit, (err, res) => {
          if (err) return;
          dispatch(incomingUpdatedChatMessage({ ...payload, id: payloadEdit.message_id, updated_at: { timestamp: timestamp } }));
        })
      );
      setEditMode(false);
      setEditMessage(null);
      if (editChatMessage !== null) {
        dispatch(setEditChatMessage(null));
      }
    } else {
      dispatch(postChatMessage(payload));
    }

    if (quote) {
      dispatch(clearQuote(quote));
    }
    if (draftId) {
      dispatch(deleteDraft({ type: "channel", draft_id: draftId }));
      dispatch(clearChannelDraft({ channel_id: selectedChannel.id }));
      setDraftId(null);
    }
    handleClearQuillInput();
    props.onSendCallback();
    if (chatSidebarSearch !== "") setSidebarSearch({ value: "" });
  };

  const handleClearQuillInput = () => {
    // setTextOnly("");
    // setText("");
    // setQuillContents([]);
    setQuillData({
      text: "",
      textOnly: "",
      quillContents: [],
    });
    if (reactQuillRef.current) {
      try {
        reactQuillRef.current.getEditor().setContents([]);
      } catch (e) {
        //console.log(e);
      }
    }
    // if (editChatMessage !== null) {
    //   dispatch(setEditChatMessage(null));
    // }
  };

  const handleQuillChange = (content, delta, source, editor) => {
    if (selectedChannel === null) return;

    // const textOnly = editor.getText(content);

    // setText(content);
    // setTextOnly(textOnly);
    // setQuillContents(editor.getContents());

    // textOnly.trim() === "" ? onActive(false) : onActive(true);

    setQuillData({
      text: content,
      textOnly: editor.getText(content),
      quillContents: editor.getContents(),
    });

    if (editor.getContents().ops && editor.getContents().ops.length) {
      handleMentionUser(
        editor
          .getContents()
          .ops.filter((m) => m.insert.mention)
          .map((i) => i.insert.mention.type_id)
      );
    }

    if (slug) {
      window.Echo.private(slug + `.App.Channel.${selectedChannel.id}`).whisper("typing", {
        user: {
          id: user.id,
          name: user.name,
          profile_image_link: user.profile_image_thumbnail_link ? user.profile_image_thumbnail_link : user.profile_image_link,
          email: user.email,
        },
        typing: true,
        channel_id: selectedChannel.id,
      });
    }
  };

  const handleMentionUser = (mention_ids) => {
    mention_ids = mention_ids.map((id) => parseInt(id)).filter((id) => !isNaN(id));
    if (mention_ids.length) {
      //check for recipients/type
      if (selectedChannel.type === "PERSONAL_BOT") return;
      const ingoredExternalIds = selectedChannel.type === "TOPIC" ? activeExternalUsers.map((m) => m.id) : [];
      const membersPayloadIds = addMembersPayload ? addMembersPayload.payload.user_ids : [];
      let ignoreIds = [user.id, ...selectedChannel.members.map((m) => m.id), ...mentionData.ignoredMentionedUserIds, ...ingoredExternalIds, ...membersPayloadIds];
      let userIds = mention_ids.filter((id) => {
        let userFound = false;
        ignoreIds.forEach((pid) => {
          if (pid === parseInt(id)) {
            userFound = true;
          }
        });
        return !userFound;
      });
      //setMentionedUserIds(userIds.length ? userIds.map((id) => parseInt(id)) : []);
      setMentionData({
        mentionedUserIds: userIds.length ? userIds.map((id) => parseInt(id)) : [],
        ignoredMentionedUserIds: [],
      });
    } else {
      if (mentionData.mentionedUserIds.length === 0 && mentionData.ignoredMentionedUserIds.length === 0) return;
      setMentionData({
        mentionedUserIds: [],
        ignoredMentionedUserIds: [],
      });
      // setIgnoredMentionedUserIds([]);
      // setMentionedUserIds([]);
    }
  };

  const handleSetEditMessageStates = (reply) => {
    reactQuillRef.current.getEditor().clipboard.dangerouslyPasteHTML(0, reply.body);
    setQuillData({
      ...quillData,
      text: reply.body,
    });
    //setText(reply.body);
    setEditMessage(reply);
    setEditMode(true);
    if (reply.quote && reply.quote.hasOwnProperty("id")) {
      dispatch(
        addQuote({
          ...reply.quote,
          channel_id: reply.channel_id,
        })
      );
    }
  };

  const handleEditOnArrowUp = (e) => {
    if (e.keyCode === 38) {
      if (e.target.classList.contains("ql-editor")) {
        if (e.target.innerText.trim() === "" && !e.target.contains(document.querySelector(".ql-editor .anchor-blot"))) {
          e.preventDefault();
          let lastReply = [...selectedChannel.replies]
            .sort((a, b) => b.created_at.timestamp - a.created_at.timestamp)
            .filter((r) => {
              return !r.is_deleted && r.user && r.user.id === user.id;
            })[0];

          if (typeof lastReply !== "undefined") {
            dispatch(setEditChatMessage(lastReply));
            if (lastReply.quote && lastReply.quote.hasOwnProperty("id")) {
              let quote = {
                ...lastReply.quote,
                channel_id: lastReply.channel_id,
              };
              dispatch(addQuote(quote));
            }
          } else {
            //contact backend this doesn't work
            fetchChannelLastReply(selectedChannel.id);
          }
        }
      }
    }
  };

  useEffect(() => {
    if (reactQuillRef.current) {
      const width = window.innerWidth;
      if (width > 620) {
        reactQuillRef.current.focus();
      }
    }
  }, []);

  const handlePaste = (e) => {
    let files = [];

    if (e.clipboardData.items.length) {
      for (let i = 0; i < e.clipboardData.items.length; i++) {
        let item = e.clipboardData.items[i];
        if (item.kind === "file") {
          files.push(item.getAsFile(item.type));
        }
      }
    }
    if (files.length) {
      dropAction(files);
    }
    setTimeout(() => {
      const editor = reactQuillRef.current.getEditor();
      reactQuillRef.current.focus();
      const cursorPosition = editor.getSelection().index;
      editor.insertText(cursorPosition, " ");
      editor.setSelection(cursorPosition + 1);
    }, 100);
  };
  const modals = useSelector((state) => state.global.modals);

  useEffect(() => {
    if (!Object.keys(modals).length) {
      document.addEventListener("paste", handlePaste, false);

      return () => document.removeEventListener("paste", handlePaste, false);
    }
  }, [Object.keys(modals).length, handlePaste]);

  //to be converted into hooks
  useEffect(() => {
    if (selectedChannel && selectedChannel.replies.length) {
      document.addEventListener("keydown", handleEditOnArrowUp, false);
    }
    return () => document.removeEventListener("keydown", handleEditOnArrowUp, false);
  }, [selectedChannel]);

  useEffect(() => {
    const escapeHandler = (e) => {
      if (e.keyCode === 27) {
        handleClearQuillInput();
      }
    };
    if (editMode) {
      document.addEventListener("keydown", escapeHandler);
    } else {
      document.removeEventListener("keydown", escapeHandler);
    }
    return () => document.removeEventListener("keydown", escapeHandler);
  }, [editMode]);

  //to be converted into hooks
  useEffect(() => {
    if (selectedEmoji) {
      const editor = reactQuillRef.current.getEditor();
      reactQuillRef.current.focus();
      const cursorPosition = editor.getSelection().index;
      editor.insertText(cursorPosition, selectedEmoji.native);
      editor.setSelection(cursorPosition + 2);
      onClearEmoji();
    }
  }, [selectedEmoji]);

  useEffect(() => {
    if (selectedGif) {
      const editor = reactQuillRef.current.getEditor();
      reactQuillRef.current.focus();
      const cursorPosition = editor.getSelection().index;
      editor.insertEmbed(cursorPosition, "image", selectedGif.images.downsized.url);
      editor.setSelection(cursorPosition + 5);
      onClearGif();
    }
  }, [selectedGif]);

  useEffect(() => {
    if (sendButtonClicked) {
      dispatch(onClickSendButton(false));
      handleSubmit();
    }
  }, [sendButtonClicked]);

  const loadDraftCallback = (draft) => {
    if (draft === null) {
      setDraftId(null);
    } else {
      if (reactQuillRef.current) reactQuillRef.current.getEditor().clipboard.dangerouslyPasteHTML(0, draft.text);
      setDraftId(draft.draft_id);
      //setText(draft.text);
      setQuillData({
        ...quillData,
        text: draft.text,
      });
    }
  };

  const handleAddMentionedUsers = (users) => {
    if (selectedChannel.type === "DIRECT") {
      let placeholderId = require("shortid").generate();
      let timestamp = Math.round(+new Date() / 1000);
      let members = [...selectedChannel.members, ...users];
      //let title = members.map((m) => m.first_name).join(", ");
      let recipient_ids = recipients
        .filter((r) => r.type === "USER")
        .filter((r) => {
          return selectedChannel.members.some((m) => m.id === r.type_id);
        })
        .map((r) => r.id);
      const usersRecipientIds = recipients
        .filter((r) => r.type === "USER")
        .filter((r) => users.some((u) => u.type_id === r.type_id))
        .map((r) => r.id);
      // adding member using mention in direct channel will create a new channel, use recipient id
      const newTitle = members.map((m) => m.first_name).join(", ");
      let payload = {
        recipient_ids: addMembersPayload ? [...addMembersPayload.payload.recipient_ids, ...usersRecipientIds] : [...recipient_ids, ...usersRecipientIds],
        title: newTitle,
        user_ids: addMembersPayload ? [...addMembersPayload.payload.user_ids, ...users.map((u) => u.type_id)] : users.map((u) => u.type_id),
      };

      let channel = {
        id: placeholderId,
        entity_id: 0,
        type: "GROUP",
        title: newTitle,
        code: placeholderId,
        is_archived: false,
        is_pinned: false,
        is_hidden: false,
        is_muted: false,
        total_unread: 0,
        profile: null,
        selected: true,
        inviter: null,
        hasMore: false,
        skip: 0,
        isFetching: false,
        members: members,
        replies: [],
        created_at: {
          timestamp: timestamp,
        },
        updated_at: {
          timestamp: timestamp,
        },
        last_reply: null,
        reference_id: placeholderId,
      };
      let old_channel = channel;
      const createCallback = (err, res) => {
        if (err) return;
        let payload = {
          ...channel,
          id: res.data.channel.id,
          old_id: old_channel.id,
          code: res.data.code,
          members: res.data.channel.members ? res.data.channel.members : channel.members,
          profile: null,
          type: "GROUP",
          last_reply: null,
          replies: [],
          selected: true,
          search: res.data.search,
        };

        dispatch(addToChannels(payload));
        dispatch(setSelectedChannel(payload));
        history.push(`/chat/${res.data.code}`);
      };
      //create(payload, createCallback);
      setAddMembersPayload({ payload: payload, callback: createCallback });
      setMentionData({
        mentionedUserIds: [],
        ignoredMentionedUserIds: [...mentionData.ignoredMentionedUserIds, ...users.map((u) => u.type_id)],
      });
    } else {
      // adding member in channel - use user id
      let membersPayload = {
        channel_id: selectedChannel.id,
        recipient_ids: addMembersPayload ? [...addMembersPayload.payload.recipient_ids, ...users.map((u) => u.type_id)] : users.map((u) => u.type_id),
        user_ids: addMembersPayload ? [...addMembersPayload.payload.user_ids, ...users.map((u) => u.type_id)] : users.map((u) => u.type_id),
      };
      setAddMembersPayload({ payload: membersPayload });
      setMentionData({
        mentionedUserIds: [],
        ignoredMentionedUserIds: [...mentionData.ignoredMentionedUserIds, ...users.map((u) => u.type_id)],
      });
      // dispatch(
      //   postChannelMembers(memberPayload, (err, res) => {
      //     if (err) return;

      //     if (res) {
      //       setMentionData({
      //         mentionedUserIds: [],
      //         ignoredMentionedUserIds: [...mentionData.ignoredMentionedUserIds, ...users.map((u) => u.type_id)],
      //       });
      //       //setIgnoredMentionedUserIds([...ignoredMentionedUserIds, ...users.map((u) => u.id)]);
      //     }
      //   })
      // );
    }
  };

  const handleIgnoreMentionedUsers = (users) => {
    setMentionData({
      mentionedUserIds: [],
      ignoredMentionedUserIds: users.map((u) => u.type_id),
    });
    // setIgnoredMentionedUserIds(users.map((u) => u.type_id));
    // setMentionedUserIds([]);
  };

  const handleEditReplyClose = () => {
    if (quote) dispatch(clearQuote(quote));

    setEditMode(false);
    setEditMessage(null);
    handleClearQuillInput();
    if (editChatMessage !== null) {
      dispatch(setEditChatMessage(null));
    }
  };

  useSaveInput(handleClearQuillInput, quillData.text, quillData.textOnly, quillData.quillContents);
  useQuillInput(handleClearQuillInput, reactQuillRef);
  useDraft(loadDraftCallback, "channel", quillData.text, quillData.textOnly, draftId);
  const { modules } = useQuillModules({
    mode: "chat",
    callback: handleSubmit,
    mentionOrientation: "top",
    quillRef: reactQuillRef,
    members:
      user.type === "external"
        ? selectedChannel.members.filter((m) => m.id !== user.id)
        : Object.values(users).filter((u) => {
            if (u.id === user.id) {
              return false;
            } else if ((u.type === "external" && selectedChannel.members.some((m) => m.id === u.id)) || (u.type === "internal" && u.role !== null)) {
              return true;
            } else {
              return false;
            }
          }),
    prioMentionIds: selectedChannel.members.filter((m) => m.id !== user.id).map((m) => m.id),
  });

  //to be converted into hooks
  useEffect(() => {
    if (editChatMessage && !editMode && editMessage === null) {
      handleSetEditMessageStates(editChatMessage);
    }
    if (editChatMessage === null && editMode && editMessage) {
      handleEditReplyClose();
    }
  }, [editChatMessage]);

  useEffect(() => {
    quillData.textOnly.trim() === "" ? onActive(false) : onActive(true);
  }, [quillData.textOnly]);

  return (
    <div className="chat-input-wrapper">
      {showQuestions && !editMode && draftId === null && <HuddleQuestion question={question} huddle={huddle} isFirstQuestion={isFirstQuestion} />}
      {mentionData.mentionedUserIds.length > 0 && selectedChannel && selectedChannel.type !== "TEAM" && selectedChannel.type !== "DIRECT_TEAM" && (
        <BodyMention
          onAddUsers={handleAddMentionedUsers}
          onDoNothing={handleIgnoreMentionedUsers}
          userIds={mentionData.mentionedUserIds}
          type={selectedChannel.type === "TOPIC" ? "workspace" : "chat"}
          basedOnUserId={true}
          userMentionOnly={true}
        />
      )}
      <StyledQuillEditor className={"chat-input"} modules={modules} ref={reactQuillRef} onChange={handleQuillChange} editMode={editMode} showFileIcon={editMode && editChatMessage && editChatMessage.files.length > 0} />
      {editMode && editChatMessage && editChatMessage.files.length > 0 && <FileIcon className="close-button" icon="file" />}
    </div>
  );
};

export default React.memo(ChatInput);
