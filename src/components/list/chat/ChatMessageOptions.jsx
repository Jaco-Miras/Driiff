import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addToModals } from "../../../redux/actions/globalActions";
import useChatMessageActions from "../../hooks/useChatMessageActions";
import useUserChannels from "../../hooks/useUserChannels";

import { MoreOptions } from "../../panels/common";

const ChatMessageOptions = (props) => {
  const { isAuthor, replyData, className = "", selectedChannel, dictionary, width = 250 } = props;
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const dispatch = useDispatch();
  const scrollEl = document.getElementById("component-chat-thread");

  const chatMessageActions = useChatMessageActions();
  const { selectUserChannel, loggedUser, users } = useUserChannels();

  useEffect(() => {
    if (replyData.user && replyData.user.type === "BOT" && replyData.body.includes("<div><p>Your") && !replyData.hasOwnProperty("huddle_log")) {
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

  const handleUnskip = () => {
    // const huddleStorage = localStorage.getItem("huddle");
    // //setCurrentTime(currentDate.getTime());
    // if (huddleStorage) {
    //   const { day, channels } = JSON.parse(huddleStorage);
    //   localStorage.setItem("huddle", JSON.stringify({ channels: channels.filter((id) => id !== replyData.channel_id), day: day }));
    //   chatMessageActions.addSkip({ channel_id: replyData.channel_id, id: replyData.id });
    // }
    chatMessageActions.addSkip({ channel_id: replyData.channel_id, id: replyData.id });
  };

  const handleReply = () => {
    if (!redirecting) {
      const callback = (data) => {
        if (data && data.id) {
          chatMessageActions.setQuote({ ...replyData, channel_id: data.id });
        }
        setRedirecting(false);
      };
      setRedirecting(true);
      selectUserChannel(replyData.user, callback);
      setShowMoreOptions(!showMoreOptions);
      //chatMessageActions.setQuote(replyData);
    }
  };
  /* dictionary initiated in ChatContentPanel.jsx */
  const isInternalUser = replyData.user && users[replyData.user.id] && users[replyData.user.id].type === "internal";

  return (
    <MoreOptions width={width} className={className} scrollRef={scrollEl}>
      {!replyData.hasOwnProperty("huddle_log") && <div onClick={() => chatMessageActions.remind(replyData, selectedChannel)}>{dictionary.remindMeAboutThis}</div>}
      {isAuthor && replyData.hasOwnProperty("is_transferred") && !replyData.is_transferred && <div onClick={handleEditReply}>{dictionary.edit}</div>}
      {!replyData.hasOwnProperty("huddle_log") && <div onClick={handleQuoteReply}>{dictionary.quote}</div>}
      {isAuthor && <div onClick={handleRemoveReply}>{dictionary.remove}</div>}
      {!replyData.hasOwnProperty("huddle_log") && <div onClick={handleCopyLink}>{dictionary.copyMessageLink}</div>}
      {!replyData.hasOwnProperty("huddle_log") && <div onClick={handleForwardMessage}>{dictionary.forward}</div>}
      {isAuthor && <div onClick={() => chatMessageActions.markImportant(replyData)}>{replyData.is_important ? dictionary.unMarkImportant : dictionary.markImportant}</div>}
      {replyData.user && replyData.user.code && replyData.user.code.includes("huddle_bot") && replyData.body.includes("<div><p>Your Unpublished") && <div onClick={handleEditHuddle}>Edit huddle</div>}
      {replyData.body.startsWith("HUDDLE_SKIP::") && <div onClick={handleUnskip}>Unskip</div>}
      {replyData.user && replyData.user.type !== "BOT" && replyData.user.id !== loggedUser.id && selectedChannel.type !== "DIRECT" && replyData.user.code && replyData.user.code !== "huddle_bot" && isInternalUser && (
        <div onClick={handleReply}>{dictionary.replyInPrivate}</div>
      )}
    </MoreOptions>
  );
};

export default React.memo(ChatMessageOptions);
