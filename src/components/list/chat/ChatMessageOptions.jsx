import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addToModals } from "../../../redux/actions/globalActions";
import useChatMessageActions from "../../hooks/useChatMessageActions";

import { MoreOptions } from "../../panels/common";

const ChatMessageOptions = (props) => {
  const { isAuthor, replyData, className = "", selectedChannel, dictionary, width = 250 } = props;
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const dispatch = useDispatch();
  const scrollEl = document.getElementById("component-chat-thread");

  const chatMessageActions = useChatMessageActions();

  useEffect(() => {
    if (replyData.user && replyData.user.type === "BOT" && replyData.body.includes("<div><p>Your huddle answer -") && !replyData.hasOwnProperty("huddle_log")) {
      chatMessageActions.channelActions.fetchUnpublishedAnswers({ channel_id: replyData.channel_id });
    }
  }, []);

  const handleDeleteReply = () => {
    chatMessageActions.remove(replyData.id);
  };

  const handleRemoveReply = () => {
    let payload = {
      type: "confirmation",
      headerText: dictionary.removeChat,
      submitText: dictionary.remove,
      cancelText: dictionary.cancel,
      bodyText: dictionary.removeThisChat,
      actions: {
        onSubmit: handleDeleteReply,
      },
    };

    dispatch(addToModals(payload));
  };

  const handleEditReply = () => {
    chatMessageActions.setEdit(replyData);
  };

  const handleQuoteReply = () => {
    chatMessageActions.setQuote(replyData);
  };

  const handleCopyLink = (e) => {
    e.stopPropagation();
    chatMessageActions.clipboardLink(selectedChannel, replyData);
    setShowMoreOptions(!showMoreOptions);
  };

  const handleForwardMessage = () => {
    let payload = {
      type: "forward",
      channel: selectedChannel,
      message: replyData,
    };

    dispatch(addToModals(payload));
  };

  const handleEditHuddle = () => {
    chatMessageActions.setHuddleAnswers({ id: replyData.id, channel_id: replyData.channel_id, huddle_log: replyData.huddle_log });
  };
  /* dictionary initiated in ChatContentPanel.jsx */
  return (
    <MoreOptions width={width} className={className} scrollRef={scrollEl}>
      {!replyData.hasOwnProperty("huddle_log") && <div onClick={() => chatMessageActions.remind(replyData, selectedChannel)}>{dictionary.remindMeAboutThis}</div>}
      {isAuthor && replyData.hasOwnProperty("is_transferred") && !replyData.is_transferred && <div onClick={handleEditReply}>{dictionary.edit}</div>}
      {!replyData.hasOwnProperty("huddle_log") && <div onClick={handleQuoteReply}>{dictionary.quote}</div>}
      {isAuthor && <div onClick={handleRemoveReply}>{dictionary.remove}</div>}
      {!replyData.hasOwnProperty("huddle_log") && <div onClick={handleCopyLink}>{dictionary.copyMessageLink}</div>}
      {!replyData.hasOwnProperty("huddle_log") && <div onClick={handleForwardMessage}>{dictionary.forward}</div>}
      {isAuthor && <div onClick={() => chatMessageActions.markImportant(replyData)}>{replyData.is_important ? dictionary.unMarkImportant : dictionary.markImportant}</div>}
      {replyData.user && replyData.user.type === "BOT" && replyData.body.includes("<div><p>Your huddle answer -") && replyData.hasOwnProperty("huddle_log") && <div onClick={handleEditHuddle}>Edit huddle</div>}
    </MoreOptions>
  );
};

export default React.memo(ChatMessageOptions);
