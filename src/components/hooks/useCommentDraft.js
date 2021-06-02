import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteDraft, saveDraft, updateDraft } from "../../redux/actions/globalActions";
import { removeCommentDraft } from "../../redux/actions/postActions";

const useCommentDraft = (callback, type, text, textOnly, draftId, commentId, postId, parentId) => {
  const dispatch = useDispatch();
  const commentDrafts = useSelector((state) => state.posts.commentDrafts);

  const savedCallback = useRef(callback);
  const textRef = useRef(null);
  const textOnlyRef = useRef(null);
  const draftIdRef = useRef(null);

  useEffect(() => {
    savedCallback.current = callback;
    textOnlyRef.current = textOnly;
    textRef.current = text;
    draftIdRef.current = draftId;
  });

  console.log(commentDrafts, commentId, postId, parentId);

  const handleLoadDraft = () => {
    if (draftId) {
      const draft = commentDrafts.find((d) => d.id === draftId);
      savedCallback.current(draft);
    } else if (parentId) {
      const draft = commentDrafts.find((d) => d.data.parent_id === parentId);
      savedCallback.current(draft);
    } else if (postId && !parentId) {
      const draft = commentDrafts.find((d) => d.data.post_id === postId && !d.data.parent_id);
      savedCallback.current(draft);
    } else {
      savedCallback.current(null);
    }
  };

  const removeDraft = (id) => {
    console.log("delete draft");
    dispatch(
      deleteDraft({ type: "comment", draft_id: id }, (err, res) => {
        if (err) return;
        dispatch(removeCommentDraft({ id: id }));
      })
    );
  };

  const handleSaveDraft = () => {
    if (textOnlyRef.current && textOnlyRef.current.trim() === "") {
      if (draftIdRef.current) {
        removeDraft(draftIdRef.current);
      } else {
        return;
      }
    }

    let payload = {
      draft_type: type,
      type: type,
      created_at: {
        timestamp: Math.floor(Date.now() / 1000),
      },
      text: textRef.current,
      comment_id: commentId,
      parent_id: parentId,
      post_id: postId,
    };
    if (draftIdRef.current) {
      payload = {
        ...payload,
        draft_id: draftIdRef.current,
      };
      dispatch(updateDraft(payload));
      //dispatch(addToChannelDraft(payload));
    } else {
      dispatch(saveDraft(payload));
    }
  };

  useEffect(() => {
    handleLoadDraft();
    return () => handleSaveDraft();
  }, []);

  // useEffect(() => {
  //   if (commentDrafts.length) {
  //     commentDrafts.forEach((c) => {
  //       dispatch(
  //         deleteDraft({
  //           type: "comment",
  //           draft_id: c.id,
  //         })
  //       );
  //     });
  //   }
  // }, [commentDrafts.length]);

  return {
    removeDraft,
  };
};

export default useCommentDraft;
