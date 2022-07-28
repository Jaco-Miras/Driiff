import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import {
  addCommentReact,
  addComment,
  addCommentQuote,
  clearCommentQuote,
  commentApprove,
  deleteComment,
  fetchComments,
  postComment,
  postCommentClap,
  putComment,
  putCommentImportant,
  removeCommentReact,
  setEditComment,
  updateCommentFiles,
  getPostRead,
  setPostRead,
  clearApprovingState,
  setChangeRequestedComment,
  fetchPost,
  fetchCommentsOnVisit,
  postRequired,
} from "../../redux/actions/postActions";
import { addToModals } from "../../redux/actions/globalActions";
import { useToaster, useTodoActions, useTranslationActions } from "./index";

const useCommentActions = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const history = useHistory();
  const todoActions = useTodoActions();
  const workspace = useSelector((state) => state.workspaces.activeTopic);
  const sharedWs = useSelector((state) => state.workspaces.sharedWorkspaces);
  let sharedPayload = null;
  if (params.workspaceId && history.location.pathname.startsWith("/shared-hub") && workspace) {
    sharedPayload = { slug: workspace.slug, token: sharedWs[workspace.slug].access_token, is_shared: true };
  }
  const toaster = useToaster();
  const { _t } = useTranslationActions();

  const dictionary = {
    reminderAlreadyExists: _t("TOASTER.REMINDER_EXISTS", "Reminder already exists"),
    toasterGeneraError: _t("TOASTER.GENERAL_ERROR", "An error has occurred try again!"),
    toasterCreateTodo: _t("TOASTER.TODO_CREATE_SUCCESS", "You will be reminded about this comment under <b>Reminders</b>."),
  };

  const fetchPostComments = (payload, callback) => {
    dispatch(fetchComments(payload, callback));
  };

  const setToEdit = (comment) => {
    dispatch(setEditComment(comment));
  };

  const add = (payload) => {
    dispatch(addComment(payload));
  };

  const create = (payload, callback = () => {}) => {
    dispatch(postComment(payload, callback));
  };

  const edit = (payload) => {
    dispatch(putComment(payload));
  };

  const addQuote = (comment) => {
    dispatch(addCommentQuote(comment));
  };

  const clearQuote = (comment) => {
    dispatch(clearCommentQuote(comment));
  };

  const clap = (payload) => {
    dispatch(postCommentClap(payload));
  };

  const remove = (comment, workspace) => {
    const onConfirm = () => {
      let sharedPayload = null;
      if (workspace && workspace.sharedSlug && sharedWs[workspace.slug]) {
        sharedPayload = { slug: workspace.slug, token: sharedWs[workspace.slug].access_token, is_shared: true };
      }
      if (Object.keys(comment.replies).length > 0) {
        let obj = {
          post_id: comment.post_id,
          id: comment.id,
          user_id: comment.author.id,
          body: "<i>The comment has been removed by the author.</i>",
          post_file_ids: [],
          file_ids: [],
          mention_ids: [],
          personalized_for_id: null,
          parent_id: comment.parent_id,
          sharedPayload: sharedPayload,
        };
        dispatch(putComment(obj));
      } else {
        dispatch(deleteComment({ comment_id: comment.id, sharedPayload: sharedPayload }));
      }
    };

    let payload = {
      type: "confirmation",
      headerText: "Remove post comment?",
      submitText: "Remove",
      cancelText: "Cancel",
      bodyText: "Are you sure you want to remove this comment?",
      actions: {
        onSubmit: onConfirm,
      },
    };

    dispatch(addToModals(payload));
  };

  const remind = (postComment, post, callback = () => {}) => {
    const onConfirm = (payload, modalCallback = () => {}) => {
      todoActions.createForPostComment(postComment.id, payload, (err, res) => {
        if (err) {
          if (err.response && err.response.data && err.response.data.errors) {
            if (err.response.data.errors.error_message.length && err.response.data.errors.error_message.find((e) => e === "ALREADY_CREATED_TODO")) {
              toaster.error(dictionary.reminderAlreadyExists);
            } else {
              toaster.error(dictionary.toasterGeneraError);
            }
          } else {
            toaster.error(dictionary.toasterGeneraError);
          }
        }
        if (res) {
          toaster.success(<span dangerouslySetInnerHTML={{ __html: dictionary.toasterCreateTodo }} />);
        }
        modalCallback(err, res);
        callback(err, res);
      });
    };
    let payload = {
      type: "todo_reminder",
      parentItem: post,
      item: postComment,
      itemType: "POST_COMMENT",
      actions: {
        onSubmit: onConfirm,
      },
      params: params,
    };

    dispatch(addToModals(payload));
  };

  const like = (payload = {}, callback) => {
    dispatch(addCommentReact(payload, callback));
  };

  const unlike = (payload = {}, callback) => {
    dispatch(removeCommentReact(payload, callback));
  };

  const updateCommentImages = (payload = {}) => {
    dispatch(updateCommentFiles(payload));
  };

  const important = (comment, workspace) => {
    let sharedPayload = null;
    if (workspace && workspace.sharedSlug && sharedWs[workspace.slug]) {
      sharedPayload = { slug: workspace.slug, token: sharedWs[workspace.slug].access_token, is_shared: true };
    }
    dispatch(
      putCommentImportant({
        message_id: comment.id,
        is_important: comment.is_important ? 0 : 1,
        sharedPayload: sharedPayload,
      })
    );
  };

  const approve = (payload = {}, callback) => {
    dispatch(commentApprove(payload, callback));
  };

  const fetchPostRead = (postId, callback) => {
    dispatch(
      getPostRead(
        {
          post_id: postId,
        },
        callback
      )
    );
  };

  const setPostReadComments = (payload, callback) => {
    dispatch(setPostRead(payload, callback));
  };

  const clearApprovingStatus = (payload, callback) => {
    dispatch(clearApprovingState(payload, callback));
  };

  const setRequestForChangeComment = (payload, callback) => {
    dispatch(setChangeRequestedComment(payload, callback));
  };
  // need update
  const fetchPostAndComments = (post, callback) => {
    let payload = {
      post_id: post.id,
      sharedPayload: sharedPayload,
    };
    if (post.slug && post.sharedSlug && sharedWs[post.slug]) {
      sharedPayload = { slug: post.slug, token: sharedWs[post.slug].access_token, is_shared: true };
      payload = {
        ...payload,
        sharedPayload: sharedPayload,
      };
    }
    dispatch(
      fetchPost(payload, (err, res) => {
        if (err) return;
        if (res) {
          let url = `/v1/messages?post_id=${post.id}&skip=${0}&limit=${res.data.reply_count}`;
          let payload = {
            url,
          };
          dispatch(fetchCommentsOnVisit(payload));
        }
      })
    );
  };

  const markReplyRequirement = (post) => {
    let payload = {
      post_id: post.id,
      must_read: 0,
      must_reply: 1,
      is_approved: 0,
    };

    dispatch(postRequired(payload));
  };

  return {
    add,
    addQuote,
    approve,
    clap,
    clearQuote,
    create,
    edit,
    fetchPostComments,
    setToEdit,
    remove,
    remind,
    like,
    unlike,
    updateCommentImages,
    important,
    fetchPostRead,
    setPostReadComments,
    clearApprovingStatus,
    setRequestForChangeComment,
    fetchPostAndComments,
    markReplyRequirement,
  };
};

export default useCommentActions;
