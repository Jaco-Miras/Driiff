import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { addComment, fetchComments, setEditComment, postComment, putComment, addCommentQuote, clearCommentQuote, postCommentClap, deleteComment } from "../../redux/actions/postActions";
import { addToModals } from "../../redux/actions/globalActions";

const useCommentActions = (props) => {
  const dispatch = useDispatch();

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
    (payload) => {
      dispatch(postComment(payload));
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

  return {
    add,
    addQuote,
    clap,
    clearQuote,
    create,
    edit,
    fetchPostComments,
    setToEdit,
    remove,
  };
};

export default useCommentActions;
