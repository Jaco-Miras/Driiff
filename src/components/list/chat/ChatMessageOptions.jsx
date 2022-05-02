import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addToModals } from "../../../redux/actions/globalActions";
import useUserChannels from "../../hooks/useUserChannels";

import { MoreOptions } from "../../panels/common";

const ChatMessageOptions = (props) => {
  const { isAuthor, replyData, className = "", selectedChannel, dictionary, width = 250, teamChannelId = null, isExternalUser, scrollComponent, chatMessageActions, showDownloadAll = false, downloadFiles = [] } = props;
  //const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const dispatch = useDispatch();
  //onst scrollEl = document.getElementById("component-chat-thread");

  const { selectUserChannel, loggedUser, users, channels, history, match } = useUserChannels();

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

  function convertFavis(content) {
    return content.replace(/(<a [^>]*(href="([^>^\"]*)")[^>]*>)((?:.(?!\<\/a\>))*.)(<\/a>)/g, function (fullText, beforeLink, anchorContent, href, lnkUrl, linkText, endAnchor) {
      return href;
    });
  }

  const handleEditReply = () => {
    let newReplyData = replyData;
    let body = newReplyData.body;
    var div = document.createElement("div");
    div.innerHTML = body;
    var elements = div.getElementsByClassName("fancied");
    while (elements[0]) elements[0].parentNode.removeChild(elements[0]);
    var repl = div.innerHTML;

    newReplyData.body = convertFavis(repl);
    chatMessageActions.setEdit(newReplyData);
  };

  const handleQuoteReply = () => {
    chatMessageActions.setQuote(replyData);
  };

  const handleCopyLink = () => {
    chatMessageActions.clipboardLink(selectedChannel, replyData);
    //setShowMoreOptions(!showMoreOptions);
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
      //setShowMoreOptions(!showMoreOptions);
      //chatMessageActions.setQuote(replyData);
    }
  };

  const handleDiscussInTeam = () => {
    if (!redirecting) {
      const callback = (data) => {
        if (data && data.id) {
          chatMessageActions.setQuote({ ...replyData, channel_id: teamChannelId.id });
          //need history push
          let pathname = match.url;
          if (match.path === "/chat/:code") {
            history.push(`/chat/${teamChannelId.code}`);
          } else if (match.path.startsWith("/workspace/chat")) {
            history.push(pathname.replace("/workspace/chat", "/workspace/team-chat"));
          }
        }
        setRedirecting(false);
      };
      setRedirecting(true);
      if (channels[teamChannelId]) {
        chatMessageActions.channelActions.select(channels[teamChannelId.id], callback);
      } else {
        //fetch the channel
        chatMessageActions.channelActions.fetchByCode(teamChannelId.code, (err, res) => {
          if (err) return;
          callback(res.data);
          chatMessageActions.channelActions.select({ ...res.data, selected: true, hasMore: false, isFetching: false, skip: 0, replies: [] });
        });
      }
      //setShowMoreOptions(!showMoreOptions);
      //chatMessageActions.setQuote(replyData);
    }
  };

  const handleRemind = () => {
    chatMessageActions.remind(replyData, selectedChannel);
  };

  const handleImportant = () => {
    chatMessageActions.markImportant(replyData);
  };

  function download_files(files) {
    function download_next(i) {
      if (i >= files.length) {
        return;
      }
      var a = document.createElement("a");
      a.href = files[i].download_link;
      a.target = "_blank";
      // Use a.download if available, it prevents plugins from opening.
      if ("download" in a) {
        a.download = files[i].filename;
      }
      // Add a to the doc for click to work.
      (document.body || document.documentElement).appendChild(a);
      if (a.click) {
        a.click(); // The click method is supported by most browsers.
      }
      // Delete the temporary link.
      a.parentNode.removeChild(a);
      // Download the next file with a small timeout. The timeout is necessary
      // for IE, which will otherwise only download the first file.
      setTimeout(function () {
        download_next(i + 1);
      }, 1200);
    }
    // Initiate the first download.
    download_next(0);
  }

  const handleDownloadAll = (e) => {
    download_files(downloadFiles);
  };

  /* dictionary initiated in ChatContentPanel.jsx */
  const isInternalUser = replyData.user && users[replyData.user.id] && users[replyData.user.id].type === "internal";
  const hasDeletedFile = replyData.files.some((f) => f.file_type === "trashed");

  return (
    <MoreOptions width={width} className={className} scrollRef={scrollComponent}>
      {!replyData.hasOwnProperty("huddle_log") && <div onClick={handleRemind}>{dictionary.remindMeAboutThis}</div>}
      {isAuthor && replyData.hasOwnProperty("is_transferred") && !replyData.is_transferred && !replyData.body.startsWith("ZOOM_MESSAGE::{") && <div onClick={handleEditReply}>{dictionary.edit}</div>}
      {!replyData.hasOwnProperty("huddle_log") && <div onClick={handleQuoteReply}>{dictionary.quote}</div>}
      {isAuthor && <div onClick={handleRemoveReply}>{dictionary.remove}</div>}
      {!replyData.hasOwnProperty("huddle_log") && <div onClick={handleCopyLink}>{dictionary.copyMessageLink}</div>}
      {!replyData.hasOwnProperty("huddle_log") && !hasDeletedFile && <div onClick={handleForwardMessage}>{dictionary.forward}</div>}
      {isAuthor && <div onClick={handleImportant}>{replyData.is_important ? dictionary.unMarkImportant : dictionary.markImportant}</div>}
      {replyData.user && replyData.user.code && replyData.user.code.includes("huddle_bot") && replyData.body.includes("<div><p>Your Unpublished") && <div onClick={handleEditHuddle}>{dictionary.editHuddle}</div>}
      {replyData.body.startsWith("HUDDLE_SKIP::") && <div onClick={handleUnskip}>Unskip</div>}
      {replyData.user &&
        replyData.user.type !== "BOT" &&
        loggedUser.type === "internal" &&
        replyData.user.id !== loggedUser.id &&
        selectedChannel.type !== "DIRECT" &&
        replyData.user.code &&
        replyData.user.code !== "huddle_bot" &&
        isInternalUser && <div onClick={handleReply}>{dictionary.replyInPrivate}</div>}
      {teamChannelId && !isExternalUser && <div onClick={handleDiscussInTeam}>{dictionary.discussOnTeamChat}</div>}
      {showDownloadAll && <div onClick={handleDownloadAll}>{dictionary.downloadAll}</div>}
    </MoreOptions>
  );
};

export default React.memo(ChatMessageOptions);
