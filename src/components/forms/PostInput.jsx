import React, { useEffect, useRef, useState, forwardRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import PostInputMention from "../common/PostInputMention";
import { useCommentQuote, useQuillModules, useSaveInput, useCommentDraft, useTranslationActions, useEnlargeEmoticons, useGetSlug } from "../hooks";
import QuillEditor from "./QuillEditor";
import { setEditComment, setParentIdForUpload, addPostRecipients, addUserToPostRecipients, removeUserToPostRecipients } from "../../redux/actions/postActions";

const Wrapper = styled.div``;

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
    ${(props) => props.editMode && "> div {width:calc(100% - 15px);}"}
    .mention {
      color: ${(props) => props.theme.colors.primary};
      .dark & {
        color: #fff;
      }
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
`;

const SavingDraftIndicator = styled.span`
  position: absolute;
  top: 105%;
  font-size: 0.8rem;
`;

/***  Commented out code are to be visited/refactored ***/
const PostInput = forwardRef((props, ref) => {
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
    workspace,
    onClosePicker,
    onActive,
    prioMentionIds,
    approvers,
    onClearApprovers,
    onSubmitCallback = () => {},
    mainInput,
    imageLoading = null,
    setImageLoading = null,
    isApprover = false,
  } = props;

  const { slug } = useGetSlug();

  const dispatch = useDispatch();
  const reactQuillRef = useRef();
  const user = useSelector((state) => state.session.user);
  const workspaces = useSelector((state) => state.workspaces.workspaces);
  const editPostComment = useSelector((state) => state.posts.editPostComment);
  const recipients = useSelector((state) => state.global.recipients);
  const users = useSelector((state) => state.users.users);
  const sharedWs = useSelector((state) => state.workspaces.sharedWorkspaces);

  const [text, setText] = useState("");
  const [textOnly, setTextOnly] = useState("");
  const [quillContents, setQuillContents] = useState([]);
  // const [mentionedUserIds, setMentionedUserIds] = useState([]);
  // const [ignoredMentionedUserIds, setIgnoredMentionedUserIds] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editMessage, setEditMessage] = useState(null);
  const [draftId, setDraftId] = useState(null);
  const [inlineImages, setInlineImages] = useState([]);
  const [quote] = useCommentQuote(editPostComment && post && editPostComment.post_id === post.id && editPostComment.quote ? editPostComment.quote.id : commentId);
  const [mentionUsers, setMentionUsers] = useState([]);
  const [mentionUsersPayload, setMentionUsersPayload] = useState({});
  const [quillMentions, setQuillMentions] = useState([]);

  const { _t } = useTranslationActions();

  const { enlargeEmoji } = useEnlargeEmoticons();

  const dictionary = {
    savingDraftLabel: _t("DRAFT.SAVING_DRAFT", "Saving draft..."),
    draftSavedLabel: _t("DRAFT.SAVED", "Draft saved"),
  };

  const loadDraftCallback = (draft) => {
    if (draft) {
      reactQuillRef.current.getEditor().clipboard.dangerouslyPasteHTML(0, draft.data.text);
      setDraftId(draft.id);
      setText(draft.data.text);
    } else {
      setDraftId(null);
    }
  };

  const { removeDraft, savingDraft, draftSaved } = useCommentDraft(loadDraftCallback, "comment", text, textOnly, draftId, commentId, post.id, parentId, setDraftId);

  const hasCompanyAsRecipient = post.recipients.filter((r) => r.type === "DEPARTMENT").length > 0;

  const handleSubmit = () => {
    if (imageLoading) return;
    let timestamp = Math.floor(Date.now() / 1000);
    let mention_ids = [];
    let haveGif = false;
    let reference_id = require("shortid").generate();
    let allIds = post.recipients
      .map((ad) => {
        if (ad.type === "USER") {
          return ad.type_id;
        } else {
          return ad.participant_ids;
        }
      })
      .flat();
    let hasMention = false;

    if (quillContents.ops && quillContents.ops.length > 0) {
      hasMention = quillContents.ops.filter((m) => m.insert.mention).length > 0;
      let mentionIds = quillContents.ops
        .filter((m) => m.insert.mention)
        .filter((m) => {
          if (m.insert.mention.type === "internal" || m.insert.mention.type === "external") return true;
          else return false;
        })
        .map((m) => Number(m.insert.mention.type_id));

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

    if (textOnly.trim() === "" && mention_ids.length === 0 && !haveGif && !hasMention) return;

    let payload = {
      post_id: post.id,
      body: enlargeEmoji(text),
      mention_ids: mention_ids,
      //mention_ids: excludeExternals ? mention_ids.filter((id) => !activeExternalUsers.some((ex) => ex.id === id)) : mention_ids,
      file_ids: inlineImages.map((i) => i.id),
      post_file_ids: [],
      reference_id: reference_id,
      personalized_for_id: null,
      parent_id: parentId,
      code_data: {
        push_title: `${user.name} replied in ${post.title}`,
        post_id: post.id,
        post_title: post.title,
        mention_ids: mention_ids,
      },
      approval_user_ids: approvers.find((a) => a.value === "all") ? approvers.find((a) => a.value === "all").all_ids : approvers.map((a) => a.value).filter((id) => post.author.id !== id),
    };

    if (post.slug !== slug && workspace.sharedSlug) {
      payload = {
        ...payload,
        sharedPayload: { slug: workspace.slug, token: sharedWs[workspace.slug].access_token, is_shared: true },
      };
    }
    if (quote) {
      payload.quote = {
        id: quote.id,
        body: enlargeEmoji(quote.body),
        user_id: quote.author ? quote.author.id : quote.user_id,
        user: quote.author ? quote.author : quote.user,
        files: quote.files,
      };
    } else {
      payload.quote = null;
    }

    if (!editMode) {
      const messageUser = post.slug !== slug && workspace.sharedSlug && sharedWs[workspace.slug] ? sharedWs[workspace.slug].user_auth : user;
      let commentObj = {
        author: messageUser,
        body: enlargeEmoji(text),
        clap_count: 0,
        claps: [],
        code: timestamp,
        created_at: { timestamp: timestamp },
        files: [],
        files_trashed: [],
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
        todo_reminder: null,
        total_replies: 0,
        total_unread_replies: 0,
        updated_at: { timestamp: timestamp },
        unfurls: [],
        user_clap_count: 0,
        users_approval: [],
        post_code: post.slug !== slug ? post.code : null,
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
      if (isApprover && mainInput) {
        payload.has_rejected = 1;
      }
      if (isApprover && !mainInput) {
        payload.has_reject = 1;
      }
      // if (post.must_reply_users && post.must_reply_users.some((u) => u.id === user.id && !u.must_reply)) {
      //   commentActions.markReplyRequirement(post);
      // }
      commentActions.create(payload, onSubmitCallback);
    }

    if (quote) {
      commentActions.clearQuote(commentId);
    }
    if (draftId) {
      removeDraft(draftId);
      setDraftId(null);
    }

    if (mentionUsersPayload.hasOwnProperty("post_id")) {
      dispatch(
        addPostRecipients(mentionUsersPayload, (err, res) => {
          if (err) return;
          dispatch(addUserToPostRecipients(mentionUsersPayload));
        })
      );
    }
    onClearApprovers();
    handleClearQuillInput();
    onClosePicker();
  };

  const handleClearQuillInput = () => {
    setTextOnly("");
    setText("");
    setQuillContents([]);
    setInlineImages([]);
    if (reactQuillRef.current) {
      if (reactQuillRef.current.getEditor()) {
        reactQuillRef.current.getEditor().setContents([]);
      }
    }
    if (editPostComment !== null) {
      dispatch(setEditComment(null));
    }
  };

  const handleQuillChange = (content, delta, source, editor) => {
    const textOnly = editor.getText(content);

    if (textOnly.trim() === "" && userMention) {
      handleClearUserMention();
      setMentionUsersPayload({});
    }

    if (content.replace(/<(.|\n)*?>/g, "").trim().length === 0) {
      setEditMode(false);
      setEditMessage(null);
      setMentionUsersPayload({});
      //edit message in redux
      if (editPostComment !== null) {
        dispatch(setEditComment(null));
      }
    }
    if (textOnly.trim() === "" && draftId) {
      removeDraft(draftId);
      setDraftId(null);
    }

    setText(content);
    setTextOnly(textOnly);
    setQuillContents(editor.getContents());

    let hasMention = false;
    let hasImage = false;
    if (editor.getContents().ops && editor.getContents().ops.length) {
      hasMention = editor.getContents().ops.filter((m) => m.insert.mention).length;
      hasImage = editor.getContents().ops.filter((m) => m.insert.image).length;
      if (hasMention) {
        const qms = editor
          .getContents()
          .ops.filter((m) => {
            if (m.insert.mention && m.insert.mention.type !== "external") return true;
            else return false;
          })
          .map((i) => i.insert.mention);

        setQuillMentions(qms);
        setMentionUsers(qms.map((id) => parseInt(id)).filter((id) => !isNaN(id)));
      }
      if (!hasMention) setQuillMentions([]);
    }
    textOnly.trim() === "" && !hasMention && !hasImage ? onActive(false) : onActive(true);
  };

  const handleRemoveMention = () => {
    let to_remove = [];
    if (post.hasOwnProperty("to_add")) {
      to_remove = post.to_add.filter((id) => !mentionUsers.includes(id));
    }
    let payload = {
      post_id: post.id,
      topic_id: workspace.id,
      remove_recipient_ids: to_remove,
    };
    dispatch(removeUserToPostRecipients(payload));
  };

  const workspaceMembers = workspace
    ? workspace.members
        .map((m) => {
          if (m.member_ids) {
            return m.member_ids;
          } else return m.id;
        })
        .flat()
    : [];

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
    if (editPostComment === null && editMode && editMessage) {
      handleEditReplyClose();
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

  const handleAddMentionsToPost = (mentions) => {
    //const userIds = users.map((u) => u.id);
    const types = ["USER", "WORKSPACE", "TOPIC"];
    const userRecipients = recipients.filter((r) => types.includes(r.type));
    const newRecipients = userRecipients.filter((r) => {
      return mentions.some((m) => m.id === r.id);
    });
    let payload = {
      post_id: post.id,
      topic_id: workspace.id,
      recipient_ids: newRecipients.map((u) => u.id),
      recipients: newRecipients,
    };

    //const postRecipientIds = post.recipients.map((pr) => pr.id);
    setMentionUsersPayload(payload);
    // setIgnoredMentionedUserIds([...postRecipientIds, ...ignoredMentionedUserIds, ...mentions.map((u) => u.id)]);
    // setMentionedUserIds([]);
  };

  // const handleIgnoreMentionedUsers = (users) => {
  //   setIgnoredMentionedUserIds(users.map((u) => u.id));
  //   setMentionedUserIds([]);
  // };

  const handleEditReplyClose = () => {
    setEditMode(false);
    setEditMessage(null);
    handleClearQuillInput();
    onClearApprovers();
  };

  useSaveInput(
    handleClearQuillInput,
    text,
    textOnly,
    quillContents,
    approvers.map((a) => a.value).filter((id) => post.author.id !== id)
  );
  //useQuillInput(handleClearQuillInput, reactQuillRef);

  let prioIds = [...new Set(prioMentionIds)].filter((id) => id !== user.id);
  const { modules } = useQuillModules({
    mode: "post_comment",
    callback: handleSubmit,
    removeMention: handleRemoveMention,
    mentionOrientation: "top",
    quillRef: reactQuillRef,
    members:
      workspace && workspace.sharedSlug
        ? workspace.members
        : user.type === "external"
        ? members.filter((m) => m.id !== user.id)
        : Object.values(users).filter((u) => {
            if (u.id === user.id) {
              return false;
            } else if ((u.type === "external" && prioMentionIds.some((id) => id === u.id)) || (u.type === "internal" && u.role !== null)) {
              return true;
            } else {
              return false;
            }
          }),
    workspaces: workspaces ? workspaces : [],
    disableMention: false,
    setInlineImages,
    setImageLoading,
    prioMentionIds:
      workspace && workspace.sharedSlug
        ? workspace.members.map((m) => m.id)
        : Object.values(users)
            .filter((u) => prioIds.some((id) => id === u.id))
            .map((u) => u.id),
    post,
    sharedSlug: workspace && workspace.sharedSlug ? workspace.slug : null,
  });

  return (
    <Wrapper className="chat-input-wrapper" ref={ref}>
      {quillMentions.length > 0 && !hasCompanyAsRecipient && (
        <PostInputMention
          onAddToPost={handleAddMentionsToPost}
          //onDoNothing={handleIgnoreMentionedUsers}
          //userIds={mentionedUserIds}
          quillMentions={quillMentions}
          postRecipients={post.recipients}
          postAuthor={post.author}
          workspaceMembers={workspaceMembers}
          type="post"
        />
      )}
      <StyledQuillEditor className={"chat-input"} modules={modules} ref={reactQuillRef} onChange={handleQuillChange} editMode={editMode} />
      {(savingDraft || draftSaved) && <SavingDraftIndicator className="text-muted">{draftSaved ? dictionary.draftSavedLabel : dictionary.savingDraftLabel}</SavingDraftIndicator>}
    </Wrapper>
  );
});

export default PostInput;
