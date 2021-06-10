import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
//import { getChannelFiles } from "../../redux/actions/fileActions";
import usePreviousValue from "./usePreviousValue";

const useQuillInput = (callback, quillRef) => {
  //const dispatch = useDispatch();
  const selectedChannel = useSelector((state) => state.chat.selectedChannel);
  const savedCallback = useRef(callback);
  const previousChannel = usePreviousValue(selectedChannel);
  //const channelFiles = useSelector((state) => state.files.channelFiles);

  useEffect(() => {
    savedCallback.current = callback;
  });

  const handleClearInput = () => {
    savedCallback.current();
  };

  // const handleGetChannelFiles = () => {
  //   if (channelFiles.hasOwnProperty(selectedChannel.id) === false) {
  //     let payload = {
  //       channel_id: selectedChannel.id,
  //       skip: 0,
  //       limit: 100,
  //     };
  //     dispatch(getChannelFiles(payload));
  //   }
  // };

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
        quillRef.current.focus();
        //handleGetChannelFiles();
      }
    }
    // if (!previousChannel && selectedChannel !== null) {
    //   //handleGetChannelFiles();
    // }
  }, [selectedChannel, previousChannel]);
};

export default useQuillInput;
