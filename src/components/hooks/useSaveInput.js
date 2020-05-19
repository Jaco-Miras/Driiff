import { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { saveInputData, clearInputData } from "../../redux/actions/globalActions";

const useSaveInput = (callback, text, textOnly, quillContents) => {

    const savedCallback = useRef(callback);

    useEffect(() => {
        savedCallback.current = callback;
    });

    const dispatch = useDispatch();
    const modals = useSelector(state => state.global.modals);
    const savedInput = useSelector(state => state.global.dataFromInput);

    useEffect(() => {
        if (savedInput !== null) {
            if (savedInput.sent !== undefined && savedInput.sent === true) {
                savedCallback.current();
                dispatch(clearInputData());
            } else if (savedInput.sent !== undefined && savedInput.sent === false) {
                dispatch(clearInputData());
            }
        }
    }, [savedInput]);

    useEffect(() => {
        if (Object.keys(modals).length && modals.hasOwnProperty("file_upload")) {
            let payload = {
                text,
                textOnly,
                quillContents
            }
            dispatch(saveInputData(payload));
        }
    }, [Object.keys(modals).length]);
}

export default useSaveInput;