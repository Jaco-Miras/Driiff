import React, { useState } from "react";
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
  /* dictionary initiated in ChatContentPanel.jsx */
  return (
    <MoreOptions width={width} className={className} scrollRef={scrollEl}>
      <div onClick={() => chatMessageActions.remind(replyData, selectedChannel)}>{dictionary.remindMeAboutThis}</div>
      {isAuthor && replyData.hasOwnProperty("is_transferred") && !replyData.is_transferred &&
      <div onClick={handleEditReply}>{dictionary.edit}</div>}
      <div onClick={handleQuoteReply}>{dictionary.quote}</div>
      {isAuthor && <div onClick={handleRemoveReply}>{dictionary.remove}</div>}
      <div onClick={handleCopyLink}>{dictionary.copyMessageLink}</div>
      <div onClick={handleForwardMessage}>{dictionary.forward}</div>
      {isAuthor && <div onClick={() => chatMessageActions.markImportant(replyData)}>{replyData.is_important ? dictionary.unMarkImportant : dictionary.markImportant}</div>}
    </MoreOptions>
  );
};

export default React.memo(ChatMessageOptions);
