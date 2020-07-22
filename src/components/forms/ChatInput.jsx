import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { addChatMessage, addQuote, clearChannelDraft, clearQuote, onClickSendButton, postChannelMembers, postChatMessage, putChatMessage, setEditChatMessage } from "../../redux/actions/chatActions";
import { deleteDraft } from "../../redux/actions/globalActions";
import { SvgIconFeather } from "../common";
import BodyMention from "../common/BodyMention";
import { useDraft, useQuillInput, useQuillModules, useSaveInput, useSelectQuote, useTimeFormat } from "../hooks";
import QuillEditor from "./QuillEditor";

const Wrapper = styled.div`
  border: 1px solid #dee2e6;
  border-radius: 8px;
`;

const StyledQuillEditor = styled(QuillEditor)`
  &.chat-input {
    // border: 1px solid #afb8bd;
    // border-radius: 5px;
    max-height: 130px;
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
    padding: 5px 9px;
    .mention {
      color: #7a1b8b;
    }
    &:focus {
      box-shadow: none;
      border-color: rgba(122, 27, 139, 0.8);
    }
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
    z-index: 2;

    .ql-mention-list {
      padding: 0;

      .ql-mention-list-item {
        display: flex;
        align-items: center;
        padding-top: 1rem;
        padding-bottom: 1rem;
        padding-left: 1rem;

        &.selected {
          background: #7a1b8b;
          color: #fff;
          cursor: pointer;
        }
      }
    }
  }
`;

const CloseButton = styled(SvgIconFeather)`
  position: absolute;
  top: 8px;
  right: 5px;
  cursor: pointer;
  cursor: hand;
  color: #000;
`;

/***  Commented out code are to be visited/refactored ***/
const ChatInput = (props) => {
  const { selectedEmoji, onClearEmoji, selectedGif, onClearGif, dropAction } = props;
  const dispatch = useDispatch();
  const reactQuillRef = useRef();
  const { localizeDate } = useTimeFormat();
  const selectedChannel = useSelector((state) => state.chat.selectedChannel);
  const slugs = useSelector((state) => state.global.slugs);
  const user = useSelector((state) => state.session.user);
  const editChatMessage = useSelector((state) => state.chat.editChatMessage);
  const sendButtonClicked = useSelector((state) => state.chat.sendButtonClicked);

  const [text, setText] = useState("");
  const [textOnly, setTextOnly] = useState("");
  const [quillContents, setQuillContents] = useState([]);
  //const [mounted, setMounted] = useState(false);
  const [mentionedUserIds, setMentionedUserIds] = useState([]);
  const [ignoredMentionedUserIds, setIgnoredMentionedUserIds] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editMessage, setEditMessage] = useState(null);
  const [draftId, setDraftId] = useState(null);

  const [quote] = useSelectQuote();

  const handleSubmit = () => {
    //let specialCommands = ["/sound-on", "/sound-off"];
    // if (specialCommands.includes(textOnly.trim())) {
    //     setText("")
    //     setTextOnly("")
    //     reactQuillRef.getEditor().setContents([]);
    //     reactQuillRef.getEditor().setText("");

    //     switch (textOnly.trim()) {
    //         case "/sound-on":
    //         case "/sound-off": {
    //             let payload = {
    //                 disable_sound: textOnly.trim() === "/sound-on" ? "0" : "1",
    //             };
    //             this.props.updateSettingsAction(payload, (err, res) => {
    //                 this.props.updateUserSettingsAction(payload);
    //                 toastr.success("Chat Notification",
    //                     `Successfully turned ${textOnly.trim() === "/sound-on" ? "on" : "off"}`);
    //             });
    //             break;
    //         }
    //         default: {
    //         }
    //     }
    //     return;
    // }

    let timestamp = Math.floor(Date.now() / 1000);
    let mention_ids = [];
    let haveGif = false;
    let reference_id = require("shortid").generate();
    let allIds = selectedChannel.members.map((m) => m.id);

    if (quillContents.ops && quillContents.ops.length > 0) {
      let mentionIds = quillContents.ops
        .filter((id) => {
          return id.insert.mention ? id : null;
        })
        .map((mid) => Number(mid.insert.mention.id));

      mention_ids = [...new Set(mentionIds)];

      if (mention_ids.includes(NaN)) {
        if (allIds.length) {
          mention_ids = [...new Set([...mention_ids.filter((id) => !isNaN(id)), ...allIds])];
        } else {
          //remove the nan in mention ids
          mention_ids = mention_ids.filter((id) => !isNaN(id));
        }
      }
      quillContents.ops.forEach((op) => {
        if (op.insert.image) {
          haveGif = true;
        }
      });
    }

    if (textOnly.trim() === "" && mention_ids.length === 0 && !haveGif) return;

    let payload = {
      channel_id: selectedChannel.id,
      body: text,
      mention_ids: mention_ids,
      file_ids: [],
      reference_id: reference_id,
      reference_title: selectedChannel.type === "DIRECT" && selectedChannel.members.length === 2 ? `${user.first_name} in a direct message` : selectedChannel.title,
      topic_id: selectedChannel.is_shared ? selectedChannel.entity_id : null,
      is_shared: selectedChannel.is_shared ? selectedChannel.entity_id : null,
      token: slugs.length && slugs.filter((s) => s.slug_name === selectedChannel.slug_owner).length ? slugs.filter((s) => s.slug_name === selectedChannel.slug_owner)[0].access_token : null,
      slug: slugs.length && slugs.filter((s) => s.slug_name === selectedChannel.slug_owner).length ? slugs.filter((s) => s.slug_name === selectedChannel.slug_owner)[0].slug_name : null,
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
      message: text,
      body: text,
      mention_ids: mention_ids,
      user: user,
      original_body: text,
      is_read: true,
      editable: 1,
      files: [],
      is_archive: 0,
      is_completed: true,
      is_transferred: false,
      is_deleted: 0,
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

    if (editMode) {
      let payloadEdit = {
        ...payload,
        message_id: editMessage.id,
        reply_id: editMessage.id,
      };
      if (quote) {
        payload.quote = quote;
      }
      dispatch(putChatMessage(payloadEdit));
      setEditMode(false);
      setEditMessage(null);
    } else {
      dispatch(postChatMessage(payload));
    }

    if (quote) {
      dispatch(clearQuote(quote));
    }
    if (draftId) {
      dispatch(deleteDraft({ type: "channel", draft_id: draftId }));
      dispatch(clearChannelDraft({ channel_id: selectedChannel.id }));
    }
    handleClearQuillInput();
  };

  const handleClearQuillInput = () => {
    setTextOnly("");
    setText("");
    setQuillContents([]);
    if (reactQuillRef.current) {
      try {
        reactQuillRef.current.getEditor().setContents([]);
      } catch (e) {
        console.log(e);
      }
    }
    if (editChatMessage !== null) {
      dispatch(setEditChatMessage(null));
    }
  };

  const handleQuillChange = (content, delta, source, editor) => {
    if (selectedChannel === null) return;

    const textOnly = editor.getText(content);

    if (textOnly.trim() === "" && editMode) {
      setEditMode(false);
      setEditMessage(null);
      //edit message in redux
      if (editChatMessage !== null) {
        dispatch(setEditChatMessage(null));
      }
    }

    setText(content);
    setTextOnly(textOnly);
    setQuillContents(editor.getContents());

    if (editor.getContents().ops && editor.getContents().ops.length) {
      handleMentionUser(
        editor
          .getContents()
          .ops.filter((m) => m.insert.mention)
          .map((i) => i.insert.mention.id)
      );
    }

    let channel = null;
    if (selectedChannel.is_shared) {
      if (window[selectedChannel.slug_owner]) {
        channel = window[selectedChannel.slug_owner].private(selectedChannel.slug_owner + `.App.Channel.${selectedChannel.id}`);
        channel.whisper("typing", {
          user: user,
          typing: true,
          channel_id: selectedChannel.id,
        });
      }
    } else {
      channel = window.Echo.private(localStorage.getItem("slug") + `.App.Channel.${selectedChannel.id}`);
      channel.whisper("typing", {
        user: user,
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
      let ignoreIds = [user.id, ...selectedChannel.members.map((m) => m.id), ...ignoredMentionedUserIds];
      let userIds = mention_ids.filter((id) => {
        let userFound = false;
        ignoreIds.forEach((pid) => {
          if (pid === parseInt(id)) {
            userFound = true;
          }
        });
        return !userFound;
      });
      setMentionedUserIds(userIds.length ? userIds.map((id) => parseInt(id)) : []);
    } else {
      setIgnoredMentionedUserIds([]);
      setMentionedUserIds([]);
    }
  };

  const handleSetEditMessageStates = (reply) => {
    reactQuillRef.current.getEditor().clipboard.dangerouslyPasteHTML(0, reply.body);
    setText(reply.body);
    setEditMessage(reply);
    setEditMode(true);
    if (reply.quote) {
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
          let lastReply = selectedChannel.replies
            .sort((a, b) => b.created_at.timestamp - a.created_at.timestamp)
            .filter((r) => {
              if (selectedChannel.is_shared && slugs.length) {
                return slugs.filter((s) => s.slug_name === selectedChannel.slug_owner)[0].external_id && typeof r.id === "number" && r.is_deleted === 0;
              } else {
                return (r.is_deleted === 0 || !r.is_deleted) && r.user && r.user.id === user.id && typeof r.id === "number";
              }
            })[0];

          if (typeof lastReply !== "undefined") {
            handleSetEditMessageStates(lastReply);
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
    };

    document.addEventListener("paste", handlePaste, false);

    return () => document.removeEventListener("paste", handlePaste, false);
  }, []);

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
    if (editChatMessage && !editMode && editMessage === null) {
      handleSetEditMessageStates(editChatMessage);
    }
  }, [editChatMessage]);

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
      reactQuillRef.current.getEditor().clipboard.dangerouslyPasteHTML(0, draft.text);
      setDraftId(draft.draft_id);
      setText(draft.text);
    }
  };

  const handleAddMentionedUsers = (users) => {
    let memberPayload = {
      channel_id: selectedChannel.id,
      recipient_ids: users.map((u) => u.type_id),
    };
    dispatch(
      postChannelMembers(memberPayload, (err, res) => {
        if (err) return;

        if (res) setIgnoredMentionedUserIds([...ignoredMentionedUserIds, ...users.map((u) => u.type_id)]);
      })
    );

    setMentionedUserIds([]);
  };

  const handleIgnoreMentionedUsers = (users) => {
    setIgnoredMentionedUserIds(users.map((u) => u.type_id));
    setMentionedUserIds([]);
  };

  const handleEditReplyClose = () => {
    setEditMode(false);
    setEditMessage(null);
    handleClearQuillInput();
  };

  useSaveInput(handleClearQuillInput, text, textOnly, quillContents);
  useQuillInput(handleClearQuillInput, reactQuillRef);
  useDraft(loadDraftCallback, "channel", text, textOnly, draftId);

  const [modules] = useQuillModules("chat", handleSubmit, "top", reactQuillRef, user.type === "external" ? selectedChannel.members : []);

  return (
    <Wrapper className="chat-input-wrapper">
      {mentionedUserIds.length > 0 && <BodyMention onAddUsers={handleAddMentionedUsers} onDoNothing={handleIgnoreMentionedUsers} userIds={mentionedUserIds} type={"chat"} basedOnId={false} />}
      <StyledQuillEditor className={"chat-input"} modules={modules} ref={reactQuillRef} onChange={handleQuillChange} />
      {editMode && <CloseButton icon="x" onClick={handleEditReplyClose} />}
    </Wrapper>
  );
};

export default ChatInput;
