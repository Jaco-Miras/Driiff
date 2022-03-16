import React, { useCallback, useRef, useState, lazy, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import Tooltip from "react-tooltip-lite";
import styled from "styled-components";
import { onClickSendButton, putChannel, createZoomMeeting, generateZoomSignature, createGoogleMeet } from "../../../redux/actions/chatActions";
import { joinWorkspace } from "../../../redux/actions/workspaceActions";
import { SvgIconFeather } from "../../common";
import ChatInput from "../../forms/ChatInput";
import { useIsMember, useTimeFormat, useToaster, useTranslationActions, useSelectQuote, useZoomActions } from "../../hooks";
import ChatQuote from "../../list/chat/ChatQuote";
import { addToModals } from "../../../redux/actions/globalActions";
import TypingIndicator from "../../list/chat/TypingIndicator";
import LockedLabel from "./LockedLabel";
import { ChatInputButtons } from "./index";

const CommonPicker = lazy(() => import("../../common/CommonPicker"));

const Wrapper = styled.div`
  position: relative;
  z-index: 3;
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
      color: ${({ theme }) => theme.colors.primary};
    }
    &:hover {
      color: ${({ theme }) => theme.colors.primary};
    }
    transition: background-color 0.15s ease-in-out, color 0.15s ease-in-out;
  }
  .feather-smile {
    background: transparent;
    border-color: transparent;
    transition: color 0.15s ease-in-out;
    //color: #cacaca;
    &.active {
      color: ${({ theme }) => theme.colors.primary};
    }
    &:hover {
      color: ${({ theme }) => theme.colors.primary};
    }
  }
`;

const Icon = styled(SvgIconFeather)`
  width: 20px;
`;

const Dflex = styled.div`
  .feather-send {
    ${(props) => props.activeSend && `background: ${props.theme.colors.primary} !important;`}
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
        background: ${(props) => props.theme.colors.primary};
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

  //const history = useHistory();
  //const zoomActions = useZoomActions();
  const { localizeChatDate } = useTimeFormat();

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
  //const [startingZoom, setStartingZoom] = useState(false);
  const selectedChannel = useSelector((state) => state.chat.selectedChannel);
  const editChatMessage = useSelector((state) => state.chat.editChatMessage);
  const onlineUsers = useSelector((state) => state.users.onlineUsers);
  const user = useSelector((state) => state.session.user);
  const jitsi = useSelector((state) => state.chat.jitsi);
  //const [startingMeet, setStartingMeet] = useState(false);

  //const zoomActions = useZoomActions();
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
    zoomMeeting: _t("CONFIRMATION.ZOOM_MEETING", "Zoom meeting"),
    zoomMeetingConfirmation: _t("CONFIRMATION.ZOOM_MEETING_BODY", "This channel contains ::number:: members and ::online:: are online. Do you want to start this meeting?", {
      number: selectedChannel ? selectedChannel.members.length : "",
      online: selectedChannel ? selectedChannel.members.filter((m) => user.id !== m.id && onlineUsers.some((o) => o.user_id === m.id)).length + 1 : 1,
    }),
    toasterGeneraError: _t("TOASTER.GENERAL_ERROR", "An error has occurred try again!"),
    meetingInProgress: _t("TOASTER.MEETING_IN_PROGRESS", "Meeting for this channel is still in progress. When that's ended you can start a new meeting."),
    jitsiMeet: _t("CONFIRMATION.JITSI_MEET", "Driff talk"),
    jitsiMeetConfirmation: _t("CONFIRMATION.JITSI_MEET_BODY", "Are you sure you want to start a meeting in this channel?"),
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

  const zoomActions = useZoomActions();

  const handleStartZoomMeeting = (callback = () => {}) => {
    //setStartingZoom(true);
    let payload = {
      channel_id: selectedChannel.id,
    };

    dispatch(
      createZoomMeeting(payload, (err, res) => {
        if (err) return;
        if (res.data) {
          let sigPayload = {
            meetingNumber: res.data.zoom_data.data.id,
            role: 1,
          };
          const zoomCreateConfig = {
            password: res.data.zoom_data.data.password,
            meetingNumber: res.data.zoom_data.data.id,
            role: 1,
          };

          dispatch(
            generateZoomSignature(
              {
                ...sigPayload,
                channel_id: selectedChannel.id,
                system_message: `ZOOM_MEETING::${JSON.stringify({
                  author: {
                    id: user.id,
                    name: user.name,
                    first_name: user.first_name,
                    partial_name: user.partial_name,
                    profile_image_link: user.profile_image_thumbnail_link ? user.profile_image_thumbnail_link : user.profile_image_link,
                  },
                  password: res.data.zoom_data.data.password,
                  meetingNumber: res.data.zoom_data.data.id,
                  channel_id: selectedChannel.id,
                })}`,
              },
              (e, r) => {
                if (callback) callback();
                if (e) return;
                if (r) {
                  //zoomActions.createMessage(selectedChannel.id, zoomCreateConfig);
                  zoomActions.startMeeting(r.data.signature, zoomCreateConfig);
                  //setStartingZoom(false);
                }
              }
            )
          );
        }
      })
    );
  };

  const handleZoomMeet = () => {
    const meetingSDKELement = document.getElementById("meetingSDKElement");
    const meetingSDKELementFirstChild = meetingSDKELement.firstChild;
    if (meetingSDKELementFirstChild && meetingSDKELementFirstChild.classList.contains("react-draggable")) {
      let modalPayload = {
        type: "zoom_inprogress",
      };

      dispatch(addToModals(modalPayload));
    } else {
      // let modalPayload = {
      //   type: "confirmation",
      //   cancelText: dictionary.no,
      //   headerText: dictionary.zoomMeeting,
      //   submitText: dictionary.yes,
      //   bodyText: dictionary.zoomMeetingConfirmation,
      //   actions: {
      //     onSubmit: handleStartZoomMeeting,
      //   },
      // };
      let modalPayload = {
        type: "zoom_confirmation",
        actions: {
          onSubmit: handleStartZoomMeeting,
        },
      };

      dispatch(addToModals(modalPayload));
    }
  };

  const handleGoogleMeet = () => {
    const handleStartGoogleMeet = () => {
      const payload = {
        channel_id: selectedChannel.id,
      };
      const cb = (err, res) => {
        if (err) return;
        window.open(res.data.google_meet_data.hangoutLink, "_blank");
      };
      dispatch(createGoogleMeet(payload, cb));
    };

    let modalPayload = {
      type: "confirmation",
      cancelText: dictionary.no,
      headerText: dictionary.googleMeet,
      submitText: dictionary.yes,
      bodyText: dictionary.googleMeetConfirmation,
      actions: {
        onSubmit: handleStartGoogleMeet,
      },
    };

    dispatch(addToModals(modalPayload));
  };

  // const getSlug = () => {
  //   let driff = localStorage.getItem("slug");
  //   if (driff) {
  //     return driff;
  //   } else {
  //     const host = window.location.host.split(".");
  //     if (host.length === 3) {
  //       localStorage.setItem("slug", host[0]);
  //       return host[0];
  //     } else {
  //       return null;
  //     }
  //   }
  // };

  const handleJitsiMeet = () => {
    if (jitsi) return;

    // const handleCreateJitsi = () => {
    //   dispatch(createJitsiMeet({ channel_id: selectedChannel.id, host: true, room_name: getSlug() + "-Meeting_Room-" + selectedChannel.id }));
    // };

    // let modalPayload = {
    //   type: "confirmation",
    //   cancelText: dictionary.no,
    //   headerText: dictionary.jitsiMeet,
    //   submitText: dictionary.yes,
    //   bodyText: dictionary.jitsiMeetConfirmation,
    //   actions: {
    //     onSubmit: handleCreateJitsi,
    //   },
    // };
    let modalPayload = {
      type: "jitsi_confirmation",
    };

    dispatch(addToModals(modalPayload));
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
                    handleZoomMeet={handleZoomMeet}
                    onShowFileDialog={onShowFileDialog}
                    editChatMessage={editChatMessage}
                    quote={quote}
                    onStartGoogleMeet={handleGoogleMeet}
                    onStartJitsi={handleJitsiMeet}
                    // startingMeet={startingMeet}
                  />
                </Dflex>
              </ChatInputContainer>

              <Tooltip arrowSize={5} distance={10} onToggle={toggleTooltip} content="Send">
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
            <button className="btn btn-primary" onClick={handleJoinWorkspace}>
              {dictionary.joinWorkspaceChat}
            </button>
          </div>
        </Dflex>
      )}
    </Wrapper>
  );
};

export default React.memo(ChatFooterPanel);
