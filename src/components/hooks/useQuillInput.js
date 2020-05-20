import {useEffect, useRef} from "react";
import {useSelector} from "react-redux";
import usePreviousValue from "./usePreviousValue";

const useQuillInput = (callback, quillRef) => {

    const selectedChannel = useSelector(state => state.chat.selectedChannel);
    const savedCallback = useRef(callback);
    const previousChannel = usePreviousValue(selectedChannel);

    useEffect(() => {
        savedCallback.current = callback;
    });

    const handleClearInput = () => {
        savedCallback.current();
    };

    useEffect(() => {
        // temporarily remove due to issues
        // const handleReplyBoxKeyDown = (e) => {
        //     let f = document.querySelector(":focus");
        //     if (f === null) {
        //         if (quillRef.current) quillRef.current.focus();
        //     }
        // };
        // document.addEventListener("keydown", handleReplyBoxKeyDown, true);

        // return () => document.removeEventListener("keydown", handleReplyBoxKeyDown, true);
    }, []);

    useEffect(() => {
        if (previousChannel !== null && selectedChannel !== null) {
            if (previousChannel && previousChannel.id !== selectedChannel.id) {
                handleClearInput();
            }
        }
    }, [selectedChannel, previousChannel]);

};

export default useQuillInput;