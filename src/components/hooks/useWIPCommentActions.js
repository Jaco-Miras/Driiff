import { useDispatch } from "react-redux";
import {
  postWIPComment,
  addWIPComment,
  putWIPComment,
  setEditComment,
  setWIPCommentQuote,
  clearWIPCommentQuote,
  deleteWIPComment,
  putWIPCommentImportant,
  postWIPCommentClap,
  addWIPCommentReact,
  removeWIPCommentReact,
} from "../../redux/actions/wipActions";
import { addToModals } from "../../redux/actions/globalActions";

const useWIPCommentActions = () => {
  const dispatch = useDispatch();

  const submitComment = (payload, callback = () => {}) => {
    dispatch(postWIPComment(payload, callback));
  };

  const addComment = (payload, callback = () => {}) => {
    dispatch(addWIPComment(payload, callback));
  };

  const updateComment = (payload, callback = () => {}) => {
    dispatch(putWIPComment(payload, callback));
  };

  const editComment = (payload, callback = () => {}) => {
    dispatch(setEditComment(payload, callback));
  };

  const addQuote = (payload, callback = () => {}) => {
    dispatch(setWIPCommentQuote(payload, callback));
  };

  const clearQuote = (payload, callback = () => {}) => {
    dispatch(clearWIPCommentQuote(payload, callback));
  };

  const removeComment = (comment) => {
    const onConfirm = () => {
      if (Object.keys(comment.replies).length > 0) {
        let obj = {
          proposal_id: comment.proposal_id,
          id: comment.id,
          user_id: comment.author.id,
          body: "<i>The comment has been removed by the author.</i>",
          proposal_attachment_ids: [],
          attachment_ids: [],
          mention_ids: [],
          personalized_for_id: null,
          parent_id: comment.parent_id,
        };
        dispatch(putWIPComment(obj));
      } else {
        dispatch(deleteWIPComment({ id: comment.id }));
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

  const important = (comment) => {
    // dispatch(
    //   putWIPCommentImportant({
    //     message_id: comment.id,
    //     is_important: comment.is_important ? 0 : 1,
    //   })
    // );
  };

  const like = (payload = {}, callback) => {
    dispatch(addWIPCommentReact(payload, callback));
  };

  const unlike = (payload = {}, callback) => {
    dispatch(removeWIPCommentReact(payload, callback));
  };

  const react = (payload) => {
    dispatch(
      postWIPCommentClap(payload, (err, res) => {
        if (err) {
          if (payload.counter === 1) unlike(payload);
          else like(payload);
        }
      })
    );
  };

  return {
    submitComment,
    addComment,
    editComment,
    updateComment,
    addQuote,
    clearQuote,
    removeComment,
    important,
    react,
    like,
    unlike,
  };
};

export default useWIPCommentActions;
