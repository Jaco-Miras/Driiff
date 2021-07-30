import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
//import { getChannelFiles } from "../../redux/actions/fileActions";
//import usePreviousValue from "./usePreviousValue"
import { isMobile } from "react-device-detect";

const useQuillInput = (callback, quillRef) => {
  //const dispatch = useDispatch();
  //const selectedChannel = useSelector((state) => state.chat.selectedChannel);
  const savedCallback = useRef(callback);
  //const previousChannel = usePreviousValue(selectedChannel);
  const channelId = useSelector((state) => state.chat.selectedChannelId);

  useEffect(() => {
    savedCallback.current = callback;
  });

  const handleClearInput = () => {
    savedCallback.current();
  };

  useEffect(() => {
    handleClearInput();
    if (!isMobile) quillRef.current.focus();
  }, [channelId]);

  // useEffect(() => {
  //   if (previousChannel !== null && selectedChannel !== null) {
  //     if (previousChannel && previousChannel.id !== selectedChannel.id) {
  //       handleClearInput();
  //       quillRef.current.focus();
  //       //handleGetChannelFiles();
  //     }
  //   }
  //   // if (!previousChannel && selectedChannel !== null) {
  //   //   //handleGetChannelFiles();
  //   // }
  // }, [selectedChannel, previousChannel]);
};

export default useQuillInput;
