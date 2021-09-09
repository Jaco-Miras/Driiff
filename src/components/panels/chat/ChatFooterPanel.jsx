import React, { useCallback, useRef, useState, lazy, Suspense } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Tooltip from "react-tooltip-lite";
import styled from "styled-components";
import { onClickSendButton, putChannel, addChatMessage, postChatMessage, createZoomMeeting } from "../../../redux/actions/chatActions";
import { joinWorkspace } from "../../../redux/actions/workspaceActions";
import { SvgIconFeather } from "../../common";
import ChatInput from "../../forms/ChatInput";
import { useIsMember, useTimeFormat, useToaster, useTranslationActions, useSelectQuote } from "../../hooks";
import ChatQuote from "../../list/chat/ChatQuote";
import { addToModals } from "../../../redux/actions/globalActions";
import TypingIndicator from "../../list/chat/TypingIndicator";
import LockedLabel from "./LockedLabel";
import { replaceChar } from "../../../helpers/stringFormatter";
import { ChatInputButtons } from "./index";

const CommonPicker = lazy(() => import("../../common/CommonPicker"));

const Wrapper = styled.div`
  position: relative;
  z-index: 3;
  padding-top: 0 !important;
  .feather-send {
    border: 1px solid #e1e1e1;
    height: 100%;
    cursor: pointer;
    width: 48px;
    border-radius: 8px;
    transition: background-color 0.15s ease-in-out;
    padding: 12px;
    margin-right: 1rem;
    @media (max-width: 480px) {
      margin-right: 0;
    }
  }
  .chat-input-wrapper {
    display: flex;
    flex-grow: 1;
    flex-flow: column;
    .quill {
      width: 100%;
    }
  }
`;

const ArchivedDiv = styled.div`
  width: 100%;
  text-align: center;
  padding: 15px 10px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  h4 {
    margin: 0 10px;
  }
`;

const ChatInputContainer = styled.div`
  position: relative;
  border: 1px solid #e1e1e1;
  box-shadow: 0 3px 10px #7a1b8b12;
  border-radius: 8px;
  margin-right: 8px;
  min-height: 48px;
  display: flex;
  flex-flow: column;
  .feather-paperclip,
  .feather-meet,
  .feather-smile {
    border-radius: 4px;
    cursor: pointer;
    &.active {
      color: #7a1b8b;
    }
    &:hover {
      color: #7a1b8b;
    }
    transition: background-color 0.15s ease-in-out, color 0.15s ease-in-out;
  }
  .feather-smile {
    background: transparent;
    border-color: transparent;
    transition: color 0.15s ease-in-out;
    color: #cacaca;
    &.active {
      color: #7a1b8b;
    }
    &:hover {
      color: #7a1b8b;
    }
  }
  .feather-meet {
    background: transparent;
    border-color: transparent;
    transition: color 0.15s ease-in-out;
    color: #cacaca;
    &.active {
      color: #7a1b8b;
    }
    &:hover {
      color: #7a1b8b;
    }
  }
`;

const Icon = styled(SvgIconFeather)`
  width: 20px;
`;

const Dflex = styled.div`
  .feather-send {
    ${(props) => props.activeSend && "background: #7a1b8b !important;"}
    fill: ${(props) => (props.activeSend ? "#fff" : "#cacaca")};
    &:hover {
      cursor: ${(props) => (props.activeSend ? "cursor" : "default")};
    }
  }
  .workspace-chat & {
    width: 100%;
    margin: 0 auto;
  }
  &.channel-viewing {
    display: flex;
    flex-wrap: wrap;
    background-color: #f8f8f8;
    text-align: center;
    align-items: center;
    justify-content: center;
    padding: 20px 0;
    > div {
      flex: 0 1 100%;
    }
    .channel-name {
      color: #64625c;
      font-size: 17px;
      font-weight: 600;
    }
    .channel-create {
      letter-spacing: 0;
      color: #b8b8b8;
      font-weight: normal;
      font-size: 19px;
      text-transform: lowercase;
      margin-bottom: 16px;
    }
    .channel-action {
      button {
        background: #7a1b8b;
        color: #fff;
        border: none;
        padding: 8px 15px;
        border-radius: 6px;
        font-size: 16px;
        font-weight: 600;
      }
    }
  }
`;

const PickerContainer = styled(CommonPicker)`
  right: 100px;
  bottom: 80px;

  @media (max-width: 414px) {
    right: -10px;
  }

  .common-picker-btn {
    text-align: right;
  }
`;

const ChatFooterPanel = (props) => {
  const { className = "", onShowFileDialog, dropAction } = props;

  const history = useHistory();
  const { localizeChatDate, localizeDate } = useTimeFormat();

  const dispatch = useDispatch();
  const toaster = useToaster();
  const ref = {
    picker: useRef(),
  };
  //useCountRenders("chat footer");
  const [activeSend, setActiveSend] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [selectedGif, setSelectedGif] = useState(null);
  const selectedChannel = useSelector((state) => state.chat.selectedChannel);
  const editChatMessage = useSelector((state) => state.chat.editChatMessage);
  const user = useSelector((state) => state.session.user);

  const [quote] = useSelectQuote();

  const handleSend = () => {
    dispatch(onClickSendButton(true));
  };

  const handleShowEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const onSelectEmoji = (e) => {
    setSelectedEmoji(e);
  };

  const onSelectGif = (e) => {
    setSelectedGif(e);
    handleShowEmojiPicker();
  };

  const onClearEmoji = useCallback(() => {
    setSelectedEmoji(null);
  }, []);

  const onActive = useCallback((active) => {
    setActiveSend(active);
  }, []);

  const onClearGif = useCallback(() => {
    setSelectedGif(null);
    //handleSend();
  }, []);

  const handleJoinWorkspace = () => {
    dispatch(
      joinWorkspace(
        {
          channel_id: selectedChannel.id,
          recipient_ids: [user.id],
        },
        (err, res) => {
          if (err) return;
          toaster.success(
            <>
              You have joined <b>#{selectedChannel.title}</b>
            </>
          );
        }
      )
    );
  };

  const { _t } = useTranslationActions();

  const dictionary = {
    unarchiveThisWorkspace: _t("WORKSPACE.WORKSPACE_UNARCHIVE", "Un-archive this workspace"),
    unarchiveWorkspace: _t("HEADER.UNARCHIVE_WORKSPACE", "Un-archive workspace"),
    cancel: _t("BUTTON.CANCEL", "Cancel"),
    unarchiveBodyText: _t("TEXT.UNARCHIVE_CONFIRMATION", "Are you sure you want to un-archive this workspace?"),
    chatUnarchiveConfirmation: _t("CHAT.UNARCHIVE_CONFIRMATION", "Are you sure you want to un-archive this channel?"),
    headerUnarchive: _t("HEADER.UNARCHIVE", "Un-archive channel"),
    youAreViewing: _t("CHAT.LABEL", "You are viewing"),
    joinWorkspaceChat: _t("CHAT.JOIN_WORKSPACE_CHAT", "Join workspace chat"),
    googleMeet: _t("CONFIRMATION.GOOGLE_MEET", "Google meet"),
    yes: _t("YES", "Yes"),
    no: _t("NO", "No"),
    googleMeetConfirmation: _t("CONFIRMATION.GOOGLE_MEET_BODY", "Are you sure you want to start a meeting in this channel?"),
    send: _t("TOOLTIP.SEND", "Send"),
    attachFiles: _t("TOOLTIP.ATTACH_FILES", "Attach files"),
    closeEdit: _t("TOOLTIP.CLOSE_EDIT", "Close edit"),
    //startedGoogleMeet: _t("GOOGLE.STARTED_GOOGLE_MEET", "")
  };

  const handleUnarchive = () => {
    let payload = {
      id: selectedChannel.id,
      is_archived: false,
      is_muted: false,
      is_pinned: false,
      push_unarchived: 1,
    };

    dispatch(putChannel(payload));
    toaster.success(
      <span>
        <b>{selectedChannel.type === "TOPIC" ? `${selectedChannel.title} workspace is un-archived.` : `${selectedChannel.title} channel is un-archived.`}</b>
      </span>
    );
  };

  const handleShowUnarchiveConfirmation = () => {
    let payload = {
      type: "confirmation",
      cancelText: dictionary.cancel,
      headerText: selectedChannel.type === "TOPIC" ? dictionary.unarchiveWorkspace : dictionary.headerUnarchive,
      submitText: selectedChannel.type === "TOPIC" ? dictionary.unarchiveWorkspace : dictionary.headerUnarchive,
      bodyText: selectedChannel.type === "TOPIC" ? dictionary.unarchiveBodyText : dictionary.chatUnarchiveConfirmation,
      actions: {
        onSubmit: handleUnarchive,
      },
    };

    dispatch(addToModals(payload));
  };

  const onSendCallback = useCallback(() => {
    setShowEmojiPicker(false);
  }, []);

  const isMember = useIsMember(selectedChannel && selectedChannel.members && selectedChannel.members.length ? selectedChannel.members.map((m) => m.id) : []);

  const toggleTooltip = () => {
    let tooltips = document.querySelectorAll("span.react-tooltip-lite");
    tooltips.forEach((tooltip) => {
      tooltip.parentElement.classList.toggle("tooltip-active");
    });
  };
  const handleStartGoogleMeet = () => {
    let timestamp = Math.floor(Date.now() / 1000);
    let reference_id = require("shortid").generate();
    let normalizedTitle = selectedChannel.title
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9_-]/g, "-");
    let messageBody = `<div>I started a Google meet: <a href="https://meet.google.com/lookup/${replaceChar(
      normalizedTitle
    )}" rel="noopener noreferrer" target="_blank"><strong>Click here to join</strong></a></div><br/><div><i>Notice this meeting only works if you and the participant are using the same Google WorkSpace domain. If you both use a different domain, share the Google link generated by Google.</i></div>`;
    let payload = {
      channel_id: selectedChannel.id,
      body: messageBody,
      mention_ids: [],
      file_ids: [],
      reference_id: reference_id,
      reference_title: `${user.first_name} started a Google meeting`,
      quote: null,
    };
    let obj = {
      message: messageBody,
      body: messageBody,
      mention_ids: [],
      user: user,
      original_body: `${user.first_name} started a Google meet. Click here to join`,
      is_read: true,
      editable: true,
      files: [],
      is_archive: false,
      is_completed: true,
      is_transferred: false,
      is_deleted: false,
      created_at: { timestamp: timestamp },
      updated_at: { timestamp: timestamp },
      channel_id: selectedChannel.id,
      reactions: [],
      id: reference_id,
      reference_id: reference_id,
      quote: null,
      unfurls: [],
      g_date: localizeDate(timestamp, "YYYY-MM-DD"),
    };
    dispatch(addChatMessage(obj));
    dispatch(postChatMessage(payload));
  };

  const handleGoogleMeet = () => {
    let payload = {
      meetingNumber: "",
      role: "1",
      password: "",
      host: true,
    };
    localStorage.setItem("zoomConfig", JSON.stringify(payload));
    window.open(`https://demo24.drevv.com/zoom/${selectedChannel.id}`, "_blank");
    // dispatch(
    //   createZoomMeeting({ channel_id: selectedChannel.id }, (err, res) => {
    //     if (err) return;
    //     if (res) {
    //       console.log(res.data);
    //       let payload = {
    //         meetingNumber: res.data.zoom_data.data.id,
    //         role: "1",
    //         password: res.data.zoom_data.data.password,
    //         host: true,
    //       };
    //       localStorage.setItem("zoomConfig", JSON.stringify(payload));
    //       setTimeout(() => {
    //         window.open(`https://demo24.drevv.com/zoom/${selectedChannel.id}`, "_blank");
    //       }, 500);
    //     }
    //   })
    // );
    //history.push(`/zoom/${selectedChannel.id}?join=1`);
    // let modalPayload = {
    //   type: "confirmation",
    //   cancelText: dictionary.no,
    //   headerText: dictionary.googleMeet,
    //   submitText: dictionary.yes,
    //   bodyText: dictionary.googleMeetConfirmation,
    //   actions: {
    //     onSubmit: handleStartGoogleMeet,
    //   },
    // };

    // dispatch(addToModals(modalPayload));
  };

  return (
    <Wrapper className={`chat-footer ${className}`}>
      {selectedChannel && <TypingIndicator />}
      <LockedLabel channel={selectedChannel} />
      {isMember && (
        <Dflex className="d-flex align-items-end chat-input-cointainer-footer" activeSend={activeSend}>
          {selectedChannel && selectedChannel.is_archived ? (
            <ArchivedDiv>
              <Icon icon="archive" />
              <h4>{selectedChannel.type === "TOPIC" ? "This is an archived workspace" : "This is an archived channel"}</h4>
              <button className="btn btn-primary" onClick={handleShowUnarchiveConfirmation}>
                {selectedChannel.type === "TOPIC" ? "Un-archive workspace" : "Un-archive channel"}
              </button>
            </ArchivedDiv>
          ) : (
            <React.Fragment>
              <ChatInputContainer className="flex-grow-1 chat-input-footer">
                {selectedChannel && !selectedChannel.is_archived && quote && (
                  <Dflex className="d-flex pr-2 pl-2">
                    <ChatQuote />
                  </Dflex>
                )}
                <Dflex className="d-flex flex-grow-1">
                  <ChatInput
                    onActive={onActive}
                    selectedGif={selectedGif}
                    onSendCallback={onSendCallback}
                    onClearGif={onClearGif}
                    selectedEmoji={selectedEmoji}
                    onClearEmoji={onClearEmoji}
                    dropAction={dropAction}
                    //test
                  />
                  <ChatInputButtons
                    channel={selectedChannel}
                    showEmojiPicker={showEmojiPicker}
                    handleShowEmojiPicker={handleShowEmojiPicker}
                    handleGoogleMeet={handleGoogleMeet}
                    onShowFileDialog={onShowFileDialog}
                    editChatMessage={editChatMessage}
                    quote={quote}
                    dictionary={dictionary}
                  />
                </Dflex>
              </ChatInputContainer>

              <Tooltip arrowSize={5} distance={10} onToggle={toggleTooltip} content={dictionary.send}>
                <SvgIconFeather onClick={handleSend} icon="send" />
              </Tooltip>
            </React.Fragment>
          )}
          {showEmojiPicker === true && (
            <Suspense fallback={<></>}>
              <PickerContainer handleSend={handleSend} handleShowEmojiPicker={handleShowEmojiPicker} onSelectEmoji={onSelectEmoji} onSelectGif={onSelectGif} orientation={"top"} ref={ref.picker} />
            </Suspense>
          )}
        </Dflex>
      )}
      {isMember && editChatMessage && (
        <Dflex className="d-flex align-items-end">
          <div className="p-5">{editChatMessage.files.map((f) => f.filename).join(", ")}</div>
        </Dflex>
      )}
      {isMember === false && selectedChannel !== null && user.type === "internal" && (
        <Dflex className="channel-viewing">
          <div className="channel-name">
            {dictionary.youAreViewing} #{selectedChannel.title}
          </div>
          <div className="channel-create">
            Created by {selectedChannel.creator && selectedChannel.creator.name} on {localizeChatDate(selectedChannel.created_at && selectedChannel.created_at.timestamp)}
          </div>
          <div className="channel-action">
            <button onClick={handleJoinWorkspace}>{dictionary.joinWorkspaceChat}</button>
          </div>
        </Dflex>
      )}
    </Wrapper>
  );
};

export default React.memo(ChatFooterPanel);
