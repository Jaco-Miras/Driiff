import { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { saveDraft, updateDraft, deleteDraftReducer, deleteDraft } from "../../redux/actions/globalActions";

const usePostDraft = (props) => {
  const { draftId, initTimestamp, isExternalUser, item, form, is_personal, params, responsible_ids, user, topicId, toaster, setDraftId, savingDraft, setSavingDraft } = props;

  const updateCountRef = useRef(0);
  const [triggerUpdate, setTriggerUpdate] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);
  const dispatch = useDispatch();
  const hasExternal = form.selectedAddressTo.some((r) => {
    return (r.type === "TOPIC" || r.type === "WORKSPACE") && r.is_shared;
  });

  const handleSaveDraft = (noToaster = false) => {
    if (savingDraft) return;
    if (!(form.title === "" && (form.body === "" || form.body === "<div><br></div>") && !form.selectedAddressTo.length)) {
      let timestamp = Math.floor(Date.now() / 1000);
      let payload = {
        type: "draft_post",
        form: {
          ...form,
          personal: is_personal,
          users_responsible: responsible_ids,
        },
        timestamp: timestamp,
        id: timestamp,
        created_at: { timestamp: timestamp },
        updated_at: { timestamp: timestamp },
        title: form.title,
        partial_body: form.body,
        clap_user_ids: [],
        author: user,
        user_reads: [],
        is_archived: 0,
        is_must_read: form.must_read,
        is_must_reply: form.reply_required,
        is_read_only: form.no_reply,
        unread_count: 0,
        reply_count: 0,
        recipients: form.selectedAddressTo,
        recipient_ids: form.selectedAddressTo.map((r) => r.id),
        users_approval: [],
        shared_with_client: (form.shared_with_client && hasExternal) || isExternalUser ? true : false,
        required_users: [],
        topic_id: topicId,
      };
      setSavingDraft(true);
      if (draftId) {
        payload = {
          ...payload,
          draft_id: draftId,
          id: item.hasOwnProperty("draft") ? item.draft.post_id : initTimestamp,
          post_id: item.hasOwnProperty("draft") ? item.draft.post_id : initTimestamp,
        };
        dispatch(
          updateDraft(payload, (err, res) => {
            setSavingDraft(false);
            if (err) return;
            setDraftSaved(true);
            setTimeout(() => {
              setDraftSaved(false);
            }, 2000);
            if (!noToaster) toaster.success("Your post is still available as a draft");
          })
        );
      } else {
        dispatch(
          saveDraft(payload, (err, res) => {
            setSavingDraft(false);
            if (err) return;
            setDraftId(res.data.id);
            setDraftSaved(true);
            setTimeout(() => {
              setDraftSaved(false);
            }, 2000);
            if (!noToaster) toaster.success("Your post is still available as a draft");
          })
        );
      }
    }
  };

  const handleDeleteDraft = (showDeleteToaster = false) => {
    if (draftId) {
      dispatch(
        deleteDraft(
          {
            type: "draft_post",
            draft_id: draftId,
          },
          (err, res) => {
            if (params) {
              dispatch(
                deleteDraftReducer(
                  {
                    topic_id: topicId,
                    draft_type: "draft_post",
                    draft_id: draftId,
                    id: item.hasOwnProperty("draft") ? item.draft.post_id : initTimestamp,
                    post_id: item.hasOwnProperty("draft") ? item.draft.post_id : initTimestamp,
                  },
                  (err, res) => {
                    if (showDeleteToaster) toaster.success("Draft successfully removed.");
                  }
                )
              );
            } else {
              dispatch(
                deleteDraftReducer(
                  {
                    draft_type: "draft_post",
                    draft_id: draftId,
                    id: item.hasOwnProperty("draft") ? item.draft.post_id : initTimestamp,
                    post_id: item.hasOwnProperty("draft") ? item.draft.post_id : initTimestamp,
                  },
                  (err, res) => {
                    if (showDeleteToaster) toaster.success("Draft successfully removed.");
                  }
                )
              );
            }
          }
        )
      );
    }
  };

  // useEffect(() => {
  //   return () => handleSaveDraft();
  // }, []);

  useEffect(() => {
    let timeoutValue = setTimeout(() => {
      setTriggerUpdate((prevState) => !prevState);
      updateCountRef.current = updateCountRef.current + 1;
    }, 1000);
    return () => clearTimeout(timeoutValue);
  }, [form]);

  useEffect(() => {
    if (updateCountRef.current > 1) handleSaveDraft(true);
  }, [triggerUpdate]);

  return {
    handleSaveDraft,
    handleDeleteDraft,
    draftSaved,
  };
};

export default usePostDraft;
