import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteDraft, saveDraft, updateDraft } from "../../redux/actions/globalActions";
import { removeCommentDraft } from "../../redux/actions/postActions";

const useCommentDraft = (callback, type, text, textOnly, draftId, commentId, postId, parentId, setDraftId) => {
  const dispatch = useDispatch();
  const commentDrafts = useSelector((state) => state.posts.commentDrafts);
  const [triggerSave, setTriggerSave] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);

  const updateCountRef = useRef(0);
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
      return;
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
    setSavingDraft(true);
    if (draftIdRef.current) {
      payload = {
        ...payload,
        draft_id: draftIdRef.current,
      };
      dispatch(
        updateDraft(payload, (err, res) => {
          setSavingDraft(false);
          if (err) return;
          if (res) {
            setDraftSaved(true);
            setTimeout(() => {
              setDraftSaved(false);
            }, 2000);
          }
        })
      );
      //dispatch(addToChannelDraft(payload));
    } else {
      dispatch(
        saveDraft(payload, (err, res) => {
          setSavingDraft(false);
          if (err) return;
          if (res.data) {
            setDraftId(res.data.id);
            setDraftSaved(true);
            setTimeout(() => {
              setDraftSaved(false);
            }, 2000);
          }
        })
      );
    }
  };

  useEffect(() => {
    handleLoadDraft();
    return () => handleSaveDraft();
  }, []);

  useEffect(() => {
    let timeoutValue = setTimeout(() => {
      setTriggerSave((prevState) => !prevState);
      updateCountRef.current = updateCountRef.current + 1;
    }, 2000);
    return () => clearTimeout(timeoutValue);
  }, [textOnly]);

  useEffect(() => {
    if (updateCountRef.current > 1) handleSaveDraft();
  }, [triggerSave]);

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
    savingDraft,
    draftSaved,
  };
};

export default useCommentDraft;
