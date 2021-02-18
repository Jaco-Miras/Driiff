import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearInputData, saveInputData } from "../../redux/actions/globalActions";

const useSaveInput = (callback, text, textOnly, quillContents, approvers = []) => {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  });

  const dispatch = useDispatch();
  const modals = useSelector((state) => state.global.modals);
  const savedInput = useSelector((state) => state.global.dataFromInput);

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
    //@to do need to revisit this function
    if (Object.keys(modals).length && modals.hasOwnProperty("file_upload") && !savedInput) {
      let payload = {
        text,
        textOnly,
        quillContents,
        approvers,
      };
      if (textOnly.trim() !== "" || approvers.length) dispatch(saveInputData(payload));
    }
  }, [Object.keys(modals).length, textOnly, approvers, savedInput]);
};

export default useSaveInput;
