import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import {
  addCommentReact,
  addComment,
  addCommentQuote,
  clearCommentQuote,
  commentApprove,
  deleteComment,
  fetchComments,
  getReplyClapHover,
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
} from "../../redux/actions/postActions";
import { addToModals } from "../../redux/actions/globalActions";
import { useToaster, useTodoActions, useTranslation } from "./index";

const useCommentActions = () => {
  const dispatch = useDispatch();
  const todoActions = useTodoActions();
  const toaster = useToaster();
  const { _t } = useTranslation();

  const dictionary = {
    reminderAlreadyExists: _t("TOASTER.REMINDER_EXISTS", "Reminder already exists"),
    toasterGeneraError: _t("TOASTER.GENERAL_ERROR", "An error has occurred try again!"),
    toasterCreateTodo: _t("TOASTER.TODO_CREATE_SUCCESS", "You will be reminded about this comment under <b>Reminders</b>."),
  };

  const fetchPostComments = useCallback(
    (payload, callback) => {
      dispatch(fetchComments(payload, callback));
    },
    [dispatch]
  );

  const setToEdit = useCallback(
    (comment) => {
      dispatch(setEditComment(comment));
    },
    [dispatch]
  );

  const add = useCallback(
    (payload) => {
      dispatch(addComment(payload));
    },
    [dispatch]
  );

  const create = useCallback(
    (payload, callback = () => {}) => {
      dispatch(postComment(payload, callback));
    },
    [dispatch]
  );

  const edit = useCallback(
    (payload) => {
      dispatch(putComment(payload));
    },
    [dispatch]
  );

  const addQuote = useCallback(
    (comment) => {
      dispatch(addCommentQuote(comment));
    },
    [dispatch]
  );

  const clearQuote = useCallback(
    (comment) => {
      dispatch(clearCommentQuote(comment));
    },
    [dispatch]
  );

  const clap = useCallback(
    (payload) => {
      dispatch(postCommentClap(payload));
    },
    [dispatch]
  );

  const remove = useCallback(
    (comment) => {
      console.log(comment);
      const onConfirm = () => {
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
          };
          dispatch(putComment(obj));
        } else {
          dispatch(deleteComment({ comment_id: comment.id }));
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
    },
    [dispatch]
  );

  const remind = useCallback(
    (postComment, post, callback = () => {}) => {
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
      };

      dispatch(addToModals(payload));
    },
    [dispatch]
  );

  const fetchPostReplyHover = (messageId, callback = () => {}) => {
    dispatch(
      getReplyClapHover(
        {
          message_id: messageId,
        },
        callback
      )
    );
  };

  const like = useCallback(
    (payload = {}, callback) => {
      dispatch(addCommentReact(payload, callback));
    },
    [dispatch]
  );

  const unlike = useCallback(
    (payload = {}, callback) => {
      dispatch(removeCommentReact(payload, callback));
    },
    [dispatch]
  );

  const updateCommentImages = useCallback(
    (payload = {}) => {
      dispatch(updateCommentFiles(payload));
    },
    [dispatch]
  );

  const important = useCallback(
    (comment) => {
      dispatch(
        putCommentImportant({
          message_id: comment.id,
          is_important: comment.is_important ? 0 : 1,
        })
      );
    },
    [dispatch]
  );

  const approve = useCallback(
    (payload = {}, callback) => {
      dispatch(commentApprove(payload, callback));
    },
    [dispatch]
  );

  const fetchPostRead = useCallback(
    (postId, callback) => {
      dispatch(
        getPostRead(
          {
            post_id: postId,
          },
          callback
        )
      );
    },
    [dispatch]
  );

  const setPostReadComments = useCallback(
    (payload, callback) => {
      dispatch(setPostRead(payload, callback));
    },
    [dispatch]
  );

  const clearApprovingStatus = useCallback(
    (payload, callback) => {
      dispatch(clearApprovingState(payload, callback));
    },
    [dispatch]
  );

  const setRequestForChangeComment = useCallback(
    (payload, callback) => {
      dispatch(setChangeRequestedComment(payload, callback));
    },
    [dispatch]
  );

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
    fetchPostReplyHover,
    like,
    unlike,
    updateCommentImages,
    important,
    fetchPostRead,
    setPostReadComments,
    clearApprovingStatus,
    setRequestForChangeComment,
  };
};

export default useCommentActions;
