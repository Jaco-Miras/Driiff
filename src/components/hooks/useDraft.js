import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToChannelDraft, getChannelDrafts } from "../../redux/actions/chatActions";
import { deleteDraft, saveDraft, updateDraft } from "../../redux/actions/globalActions";
import usePreviousValue from "./usePreviousValue";

const useDraft = (callback, type, text, textOnly, draftId) => {
  const dispatch = useDispatch();
  const channelDraftsLoaded = useSelector((state) => state.chat.channelDraftsLoaded);
  const selectedChannel = useSelector((state) => state.chat.selectedChannel);
  const channelDrafts = useSelector((state) => state.chat.channelDrafts);
  const previousChannel = usePreviousValue(selectedChannel);

  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  });

  const handleLoadDraft = () => {
    if (selectedChannel && Object.keys(channelDrafts).length > 0 && channelDrafts.hasOwnProperty(selectedChannel.id)) {
      let draft = { ...channelDrafts[selectedChannel.id] };
      savedCallback.current(draft);
    } else {
      savedCallback.current(null);
    }
  };

  const handleSaveDraft = (id) => {
    if (textOnly.trim() === "") {
      if (draftId) {
        dispatch(
          deleteDraft({
            type: "channel",
            draft_id: draftId,
          })
        );
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
    };
    if (type === "channel") {
      payload = {
        ...payload,
        text: text,
        channel_id: id,
      };
    }
    if (draftId) {
      payload = {
        ...payload,
        draft_id: draftId,
      };
      dispatch(updateDraft(payload));
      dispatch(addToChannelDraft(payload));
    } else {
      dispatch(saveDraft(payload));
    }
  };

  useEffect(() => {
    if (Object.keys(channelDrafts).length === 0 && !channelDraftsLoaded) {
      dispatch(getChannelDrafts());
    }
    handleLoadDraft();
    return () => handleSaveDraft();
  }, []);

  useEffect(() => {
    if (previousChannel !== null && selectedChannel !== null) {
      if (previousChannel && previousChannel.id !== selectedChannel.id) {
        handleSaveDraft(previousChannel.id);
        handleLoadDraft();
      }
    }
    if (previousChannel === null && selectedChannel !== null) {
      handleLoadDraft();
    }
  }, [selectedChannel, previousChannel, handleLoadDraft, handleSaveDraft]);
};

export default useDraft;
