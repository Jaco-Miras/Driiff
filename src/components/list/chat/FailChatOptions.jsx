import React from "react";
import { useDispatch } from "react-redux";
import { removeChatMessage, postChatMessage } from "../../../redux/actions/chatActions";
import { MoreOptions } from "../../panels/common";
import { useToaster } from "../../hooks";

const FailChatOptions = (props) => {
  const { replyData, className = "", selectedChannel, dictionary, width = 250, scrollComponent } = props;
  const dispatch = useDispatch();
  const toaster = useToaster();
  const handleResend = () => {
    dispatch(
      postChatMessage(replyData.payload, (err, res) => {
        if (err) {
          toaster.error(dictionary.errorSendingChat);
        }
      })
    );
  };

  const handleRemove = () => {
    dispatch(removeChatMessage({ id: replyData.id, channel_id: selectedChannel.id }));
  };

  return (
    <MoreOptions width={width} className={className} scrollRef={scrollComponent}>
      <div onClick={handleResend}>{dictionary.resend}</div>
      <div onClick={handleRemove}>{dictionary.delete}</div>
    </MoreOptions>
  );
};

export default React.memo(FailChatOptions);
