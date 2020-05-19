import {useEffect, useRef} from "react";
import {useDispatch, useSelector} from "react-redux";
import {addToChannelDraft, getChannelDrafts} from "../../redux/actions/chatActions";
import {saveDraft, updateDraft} from "../../redux/actions/globalActions";
import usePreviousValue from "./usePreviousValue";

const useDraft = (callback, type, text, textOnly, draftId) => {

    const dispatch = useDispatch();
    const selectedChannel = useSelector(state => state.chat.selectedChannel);
    const drafts = useSelector(state => state.chat.channelDrafts);
    const previousChannel = usePreviousValue(selectedChannel);

    const savedCallback = useRef(callback);

    useEffect(() => {
        savedCallback.current = callback;
    });

    const handleLoadDraft = () => {
        if (Object.keys(drafts).length > 0 && drafts.hasOwnProperty(selectedChannel.id)) {
            let draft = {...drafts[selectedChannel.id]};
            savedCallback.current(draft);
        } else {
            savedCallback.current(null);
        }
    };

    const handleSaveDraft = (id) => {

        if (textOnly.trim() === "") return;

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
            console.log(payload);
            dispatch(updateDraft(payload));
        } else {
            dispatch(saveDraft(payload));
        }

        dispatch(addToChannelDraft(payload));
    };

    // useEffect(() => {
    //     savedCallback.current = callback;
    // });

    // const handleClearInput = () => {
    //     savedCallback.current();
    // };
    useEffect(() => {
        dispatch(getChannelDrafts());
        return () => handleSaveDraft();
    }, []);

    useEffect(() => {
        if (previousChannel !== null && selectedChannel !== null) {
            if (previousChannel.id !== selectedChannel.id) {
                handleSaveDraft(previousChannel.id);
                handleLoadDraft();
            }
        }
        if (previousChannel === null && selectedChannel !== null) {
            handleLoadDraft();
        }
    }, [selectedChannel, previousChannel]);

};

export default useDraft;