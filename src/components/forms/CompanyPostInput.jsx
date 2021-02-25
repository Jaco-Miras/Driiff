import React, { useEffect, useRef, useState, forwardRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
// import {localizeDate} from "../../helpers/momentFormatJS";
//import { addQuote } from "../../redux/actions/chatActions";
import { SvgIconFeather } from "../common";
import BodyMention from "../common/BodyMention";
import { useCommentQuote, useQuillInput, useQuillModules, useSaveInput } from "../hooks";
import QuillEditor from "./QuillEditor";
import { setEditComment, setParentIdForUpload, addPostRecipients, addUserToPostRecipients } from "../../redux/actions/postActions";

const Wrapper = styled.div`
  &.chat-input-wrapper:focus-within {
    border: none;
  }
`;

const StyledQuillEditor = styled(QuillEditor)`
  &.chat-input {
    // border: 1px solid #afb8bd;
    // border-radius: 5px;
    max-height: 180px;
    position: static;
    overflow: auto;
    &::-webkit-scrollbar {
      display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;

    &:focus {
      border: none;
    }
  }
  .ql-container {
    position: static;
  }
  .ql-toolbar {
    display: none;
  }
  .ql-editor {
    padding: 11px 9px;
    ${(props) => props.editMode && "> div {width:calc(100% - 15px);}"} .mention {
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
          background: #7a1b8b;
          color: #fff;
          cursor: pointer;
          span.all-pic > img {
            filter: brightness(0) saturate(100%) invert(1);
          }
        }
      }
    }
  }
`;

const CloseButton = styled(SvgIconFeather)`
  position: absolute;
  top: 0;
  right: 0;
  margin: 0;
  margin: 4px;
  height: calc(100% - 8px);
  background: white;
  border: 1px solid white;
  border-radius: 4px;
  min-width: 40px;
  width: 40px;
  padding: 9px;
  cursor: pointer;
  right: 40px;
  z-index: 9;
  color: #cacaca;
  transition: color 0.15s ease-in-out;
  &:hover {
    color: #7a1b8b;
  }
`;

/***  Commented out code are to be visited/refactored ***/
const CompanyPostInput = forwardRef((props, ref) => {
  const {
    selectedEmoji,
    onClearEmoji,
    selectedGif,
    onClearGif,
    dropAction,
    sent,
    handleClearSent,
    post,
    parentId,
    commentActions,
    userMention,
    handleClearUserMention,
    commentId,
    members,
    onActive,
    onClosePicker,
    prioMentionIds,
    approvers,
    onClearApprovers,
    onSubmitCallback,
    mainInput,
  } = props;
  const dispatch = useDispatch();
  const reactQuillRef = useRef();
  //const selectedChannel = useSelector((state) => state.chat.selectedChannel);
  //const slugs = useSelector(state => state.global.slugs);
  const user = useSelector((state) => state.session.user);
  const editPostComment = useSelector((state) => state.posts.editPostComment);
  const users = useSelector((state) => state.users.users);
  const recipients = useSelector((state) => state.global.recipients);
  //const sendButtonClicked = useSelector(state => state.chat.sendButtonClicked);
  const externalUsers = useSelector((state) => state.users.externalUsers);
  const workspaces = useSelector((state) => state.workspaces.workspaces);

  const activeExternalUsers = externalUsers.filter((u) => u.active === 1);

  const [text, setText] = useState("");
  const [textOnly, setTextOnly] = useState("");
  const [quillContents, setQuillContents] = useState([]);
  const [mentionedUserIds, setMentionedUserIds] = useState([]);
  const [ignoredMentionedUserIds, setIgnoredMentionedUserIds] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editMessage, setEditMessage] = useState(null);
  const [inlineImages, setInlineImages] = useState([]);

  const [quote] = useCommentQuote(editPostComment && post && editPostComment.post_id === post.id && editPostComment.quote ? editPostComment.quote.id : commentId);

  const hasCompanyAsRecipient = post.recipients.filter((r) => r.type === "DEPARTMENT").length > 0;
  const excludeExternals = post.recipients.filter((r) => r.type !== "TOPIC").length > 0;

  // let prioMentionIds = post.recipients.filter((r) => r.type !== "DEPARTMENT")
  //                       .map((r) => {
  //                         if (r.type === "USER") {
  //                           return [r.type_id]
  //                         } else {
  //                           return r.participant_ids
  //                         }
  //                       }).flat();

  const handleSubmit = () => {
    let timestamp = Math.floor(Date.now() / 1000);
    let mention_ids = [];
    let haveGif = false;
    let reference_id = require("shortid").generate();
    let allIds = post.users_responsible.map((m) => m.id);

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
      post_id: post.id,
      body: text,
      mention_ids: excludeExternals ? mention_ids.filter((id) => !activeExternalUsers.some((ex) => ex.id === id)) : mention_ids,
      file_ids: inlineImages.map((i) => i.id),
      post_file_ids: [],
      reference_id: reference_id,
      personalized_for_id: null,
      parent_id: parentId,
      code_data: {
        push_title: `${user.name} replied in ${post.title}`,
        post_id: post.id,
        post_title: post.title,
      },
      approval_user_ids: approvers.find((a) => a.value === "all") ? approvers.find((a) => a.value === "all").all_ids : approvers.map((a) => a.value).filter((id) => post.author.id !== id),
    };

    if (quote) {
      payload.quote = {
        id: quote.id,
        body: quote.body,
        user_id: quote.author ? quote.author.id : quote.user_id,
        user: quote.author ? quote.author : quote.user,
        files: quote.files,
      };
    } else {
      payload.quote = null;
    }

    if (!editMode) {
      let commentObj = {
        author: user,
        body: text,
        clap_count: 0,
        code: timestamp,
        created_at: { timestamp: timestamp },
        files: [],
        id: reference_id,
        is_archive: false,
        is_editable: true,
        is_edited: 0,
        is_favourite: false,
        mention_ids: mention_ids,
        original_body: text,
        parent_id: parentId,
        personalized_for_id: null,
        post_id: post.id,
        quote: quote,
        reference_id: reference_id,
        ref_quote: quote,
        replies: {},
        total_replies: 0,
        todo_reminder: null,
        total_unread_replies: 0,
        updated_at: { timestamp: timestamp },
        unfurls: [],
        user_clap_count: 0,
        clap_user_ids: [],
        users_approval: [],
      };

      commentActions.add(commentObj);
    }

    if (editMode) {
      payload = {
        ...payload,
        id: editMessage.id,
        parent_id: editMessage.parent_id,
        reference_id: null,
      };
      if (editPostComment) {
        if (editPostComment.users_approval.find((u) => u.ip_address !== null && u.is_approved)) {
          delete payload.approval_user_ids;
        }
      }
      commentActions.edit(payload);
      setEditMode(false);
      setEditMessage(null);
    } else {
      if (props.isApprover) {
        payload.has_rejected = 1;
      }
      commentActions.create(payload, onSubmitCallback);
    }

    if (quote) {
      commentActions.clearQuote(commentId);
    }
    // if (draftId) {
    //     dispatch(deleteDraft({type: "channel", draft_id: draftId}));
    //     dispatch(clearChannelDraft({channel_id: selectedChannel.id}));
    // }
    onClearApprovers();
    handleClearQuillInput();
    onClosePicker();
    //if (onSubmitCallback) onSubmitCallback();
  };

  const handleClearQuillInput = () => {
    setTextOnly("");
    setText("");
    setQuillContents([]);
    setInlineImages([]);
    if (reactQuillRef.current) {
      reactQuillRef.current.getEditor().setContents([]);
    }
    if (editPostComment !== null) {
      dispatch(setEditComment(null));
    }
  };

  const handleQuillChange = (content, delta, source, editor) => {
    const textOnly = editor.getText(content);
    if (textOnly.trim() === "" && userMention) {
      handleClearUserMention();
    }

    if (textOnly.trim() === "" && editMode) {
      setEditMode(false);
      setEditMessage(null);
      //edit message in redux
      if (editPostComment !== null) {
        dispatch(setEditComment(null));
      }
    }

    setText(content);
    setTextOnly(textOnly);
    setQuillContents(editor.getContents());

    let hasMention = false;
    let hasImage = false;

    if (editor.getContents().ops && editor.getContents().ops.length) {
      hasMention = editor.getContents().ops.filter((m) => m.insert.mention).length;
      hasImage = editor.getContents().ops.filter((m) => m.insert.image).length;
      handleMentionUser(
        editor
          .getContents()
          .ops.filter((m) => m.insert.mention)
          .map((i) => i.insert.mention.id)
      );
    }
    textOnly.trim() === "" && !hasMention && !hasImage ? onActive(false) : onActive(true);
  };

  const handleMentionUser = (mention_ids) => {
    mention_ids = mention_ids.map((id) => parseInt(id)).filter((id) => !isNaN(id));
    if (mention_ids.length) {
      //check for recipients/type
      const ignoredWorkspaceIds = post.recipients.filter((w) => (w.type === "TOPIC" ? w : false)).map((w) => w.id);
      let ignoreIds = [user.id, ...ignoredMentionedUserIds, ...prioMentionIds, ...members.map((m) => m.id), ...ignoredWorkspaceIds];
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
      commentActions.addQuote(reply.quote);
    }
  };

  useEffect(() => {
    if (userMention) {
      reactQuillRef.current.getEditor().clipboard.dangerouslyPasteHTML(0, userMention);
    }
  }, [userMention]);

  useEffect(() => {
    if (reactQuillRef.current) {
      reactQuillRef.current.focus();
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
        dispatch(setParentIdForUpload(parentId));
      }
    };

    document.addEventListener("paste", handlePaste, false);

    return () => document.removeEventListener("paste", handlePaste, false);
  }, []);

  //to be converted into hooks
  // useEffect(() => {
  //     if (selectedChannel && selectedChannel.replies.length) {
  //         document.addEventListener("keydown", handleEditOnArrowUp, false);
  //     }
  //     return () => document.removeEventListener("keydown", handleEditOnArrowUp, false);
  // }, [selectedChannel]);

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
    if (editPostComment && !editMode && editMessage === null && mainInput && editPostComment.post_id === post.id) {
      handleSetEditMessageStates(editPostComment);
    }
  }, [editPostComment]);

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
    if (sent) {
      handleSubmit();
      handleClearSent();
    }
  }, [sent]);

  // const loadDraftCallback = (draft) => {
  //     if (draft === null) {
  //         setDraftId(null);
  //     } else {
  //         reactQuillRef.current.getEditor().clipboard.dangerouslyPasteHTML(0, draft.text);
  //         setDraftId(draft.draft_id);
  //         setText(draft.text);
  //     }
  // };

  const handleAddMentionedUsers = (users) => {
    const userIds = users.map((u) => u.id);
    const types = ["USER", "WORKSPACE", "TOPIC"];
    const userRecipients = recipients.filter((r) => types.includes(r.type));

    const newRecipients = userRecipients.filter((r) => {
      return userIds.some((id) => id === r.type_id);
    });
    let payload = {
      post_id: post.id,
      recipient_ids: newRecipients.map((u) => u.id),
      recipients: newRecipients,
    };

    console.log(users, payload);
    dispatch(
      addPostRecipients(payload, (err, res) => {
        if (err) return;
        dispatch(addUserToPostRecipients(payload));
      })
    );
    const ingoredExternalIds = excludeExternals ? activeExternalUsers.map((m) => m.id) : [];
    setIgnoredMentionedUserIds([...ignoredMentionedUserIds, ...users.map((u) => u.id), ...ingoredExternalIds]);

    setMentionedUserIds([]);
  };

  const handleIgnoreMentionedUsers = (users) => {
    setIgnoredMentionedUserIds(users.map((u) => u.id));
    setMentionedUserIds([]);
  };

  const handleEditReplyClose = () => {
    setEditMode(false);
    setEditMessage(null);
    handleClearQuillInput();
    onClearApprovers();
  };

  useSaveInput(handleClearQuillInput, text, textOnly, quillContents);
  useQuillInput(handleClearQuillInput, reactQuillRef);
  // useDraft(loadDraftCallback, "channel", text, textOnly, draftId);

  const { modules } = useQuillModules({
    mode: "post_comment",
    callback: handleSubmit,
    mentionOrientation: "top",
    quillRef: reactQuillRef,
    members: Object.values(users).filter((u) => {
      if ((u.type === "external" && prioMentionIds.some((id) => id === u.id)) || u.type === "internal") {
        return true;
      } else {
        return false;
      }
    }),
    workspaces: workspaces ? workspaces : [],
    disableMention: false,
    setInlineImages,
    prioMentionIds: [...new Set(prioMentionIds)],
    post,
  });

  return (
    <Wrapper className="chat-input-wrapper" ref={ref}>
      {mentionedUserIds.length > 0 && !hasCompanyAsRecipient && <BodyMention onAddUsers={handleAddMentionedUsers} onDoNothing={handleIgnoreMentionedUsers} userIds={mentionedUserIds} basedOnId={false} />}
      <StyledQuillEditor className={"chat-input"} modules={modules} ref={reactQuillRef} onChange={handleQuillChange} editMode={editMode} />
      {editMode && <CloseButton icon="x" onClick={handleEditReplyClose} />}
    </Wrapper>
  );
});

export default CompanyPostInput;
