import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import usePreviousValue from "./usePreviousValue";

const useQuillInput = (callback) => {

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
        if (previousChannel !== null && selectedChannel !== null) {
            if (previousChannel.id !== selectedChannel.id) {
                handleClearInput();
            }
        }
    }, [selectedChannel, previousChannel]);

};

export default useQuillInput;