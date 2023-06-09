import React, { useRef, useState, useEffect, Suspense, lazy } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { addToModals } from "../../../redux/actions/globalActions";
import { DropDocument } from "../../dropzone/DropDocument";
import { useCountUnreadReplies, useTimeFormat, useTranslationActions } from "../../hooks";
import useChatMessageActions from "../../hooks/useChatMessageActions";
import { ChatFooterPanel, ChatHeaderPanel, ChatSearchPanel } from "./index";
import { useIdleTimer } from "react-idle-timer";
import { $_GET } from "../../../helpers/commonFunctions";

const ChatMessages = lazy(() => import("../../list/chat/ChatMessages"));
const VirtuosoContainer = lazy(() => import("../../list/chat/VirtuosoContainer"));

const Wrapper = styled.div`
  width: 100%;
  z-index: 2;
  position: relative;
  @media (max-width: 992px) {
    z-index: 1;
  } ;
`;

const ChatMessagesPlaceholder = styled.div`
  flex: 1;
`;

const ChatContentPanel = (props) => {
  const { className = "", isWorkspace = false } = props;

  const { isIdle } = useIdleTimer({ timeout: 1000 * 60 });

  const dispatch = useDispatch();
  const chatMessageActions = useChatMessageActions();
  const timeFormat = useTimeFormat();

  const user = useSelector((state) => state.session.user);

  const { virtualization, translate } = useSelector((state) => state.settings.user.CHAT_SETTINGS);

  const { chat_language, translated_channels, language } = useSelector((state) => state.settings.user.GENERAL_SETTINGS);

  const selectedChannel = useSelector((state) => state.chat.selectedChannel);

  const teamChannelId = useSelector((state) => state.workspaces.isOnClientChat);
  const jitsi = useSelector((state) => state.chat.jitsi);
  //const bottomRef = useRef();
  const [showDropZone, setshowDropZone] = useState(false);
  //const [bottomRefVisible, setBottomRefVisible] = useState(false);
  const unreadCount = useCountUnreadReplies();

  const refs = {
    dropZoneRef: useRef(),
  };

  const [showSearchPanel, setShowSearchPanel] = useState(false);
  const [pP, setPP] = useState(selectedChannel ? selectedChannel.id : 0);

  const handleOpenFileDialog = () => {
    if (refs.dropZoneRef.current) {
      refs.dropZoneRef.current.open();
    }
  };

  const handleHideDropzone = () => {
    setshowDropZone(false);
  };

  const handleshowDropZone = (e) => {
    if (e.dataTransfer.types) {
      for (var i = 0; i < e.dataTransfer.types.length; i++) {
        if (e.dataTransfer.types[i] === "Files") {
          setshowDropZone(true);
          return;
        }
      }
    }
  };

  const dropAction = (acceptedFiles) => {
    let attachedFiles = [];
    acceptedFiles.forEach((file) => {
      var bodyFormData = new FormData();
      bodyFormData.append("file", file);
      let shortFileId = require("shortid").generate();
      if (file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/gif" || file.type === "image/webp") {
        attachedFiles.push({
          ...file,
          type: "IMAGE",
          id: shortFileId,
          status: false,
          src: URL.createObjectURL(file),
          bodyFormData: bodyFormData,
          name: file.name ? file.name : file.path,
        });
      } else if (file.type === "video/mp4") {
        attachedFiles.push({
          ...file,
          type: "VIDEO",
          id: shortFileId,
          status: false,
          src: URL.createObjectURL(file),
          bodyFormData: bodyFormData,
          name: file.name ? file.name : file.path,
        });
      } else {
        attachedFiles.push({
          ...file,
          type: "DOC",
          id: shortFileId,
          status: false,
          src: "#",
          bodyFormData: bodyFormData,
          name: file.name ? file.name : file.path,
        });
      }
    });
    handleHideDropzone();

    let modal = {
      type: "file_upload",
      droppedFiles: attachedFiles,
      mode: "chat",
      members: selectedChannel ? selectedChannel.members : [],
      team_channel: selectedChannel.team && selectedChannel.type === "TOPIC" ? selectedChannel.id : null,
      sharedSlug: selectedChannel && selectedChannel.slug ? selectedChannel.slug : null,
    };

    dispatch(addToModals(modal));
  };

  const { _t } = useTranslationActions();

  const dictionary = {
    //remindMeAboutThis: _t("TODO.REMIND_ME_ABOUT_THIS", "Remind me about this"),
    remindMeAboutThis: _t("TODO.REMIND_ABOUT_THIS", "Remind about this"),
    quote: _t("CHAT.QUOTE", "Quote"),
    copyMessageLink: _t("CHAT.COPY_MESSAGE_LINK", "Copy message link"),
    forward: _t("CHAT.FORWARD", "Forward"),
    edit: _t("CHAT.EDIT", "Edit"),
    remove: _t("CHAT.REMOVE", "Remove"),
    removeChat: _t("MODAL.REMOVE_CHAT", "Remove chat"),
    cancel: _t("MODAL.CANCEL", "Cancel"),
    removeThisChat: _t("MODAL.REMOVE_THIS_CHAT", "Are you sure you want to remove this chat?"),
    update: _t("SYSTEM.UPDATE", "Update"),
    accountActivated: _t("SYSTEM.ACCOUNT_ACTIVATED", "account is activated"),
    accountDeactivated: _t("SYSTEM.ACCOUNT_DEACTIVATED", "account is deactivated"),
    removed: _t("SYSTEM.REMOVED", "removed"),
    andRemoved: _t("SYSTEM.AND_REMOVED", "and removed"),
    you: _t("SYSTEM.YOU", "You"),
    youAnd: _t("SYSTEM.YOU_AND", "You and"),
    joined: _t("SYSTEM.JOINED", "joined"),
    andJoined: _t("SYSTEM.AND_JOINED", "and joined"),
    left: _t("SYSTEM.LEFT", "left"),
    andLeft: _t("SYSTEM.AND_LEFT", "and left"),
    createdThePost: _t("SYSTEM.CREATED_THE_POST", "created the post"),
    openPost: _t("SYSTEM.OPEN_POST", "Open post"),
    someone: _t("SYSTEM.SOMEONE", "Someone"),
    added: _t("SYSTEM.ADDED", "added"),
    andAdded: _t("SYSTEM.AND_ADDED", "and added"),
    renameThisWorkspace: _t("SYSTEM.RENAME_THIS_WORKSPACE", "renamed this workspace to"),
    renameThisChat: _t("SYSTEM.RENAME_THIS_CHAT", "renamed this chat to"),
    forwardedMessage: _t("CHAT.FORWARDED_MESSAGE", "Forwarded message"),
    chatRemoved: _t("CHAT.BODY_REMOVED", "The chat message has been removed"),
    workspace: _t("CHAT.WORKSPACE", "Workspace"),
    hasLeftChat: _t("SYSTEM.HAS_LEFT_CHAT", "has left the chat"),
    hasLeftWorkspace: _t("SYSTEM.HAS_LEFT_WORKSPACE", "has left the workspace"),
    andHasLeftChat: _t("SYSTEM.AND_HAS_LEFT_CHAT", "and has left the chat"),
    andHasLeftWorkspace: _t("SYSTEM.AND_HAS_LEFT_WORKSPACE", "and has left the workspace"),
    youLeftChat: _t("SYSTEM.YOU_LEFT_CHAT", "You left the chat"),
    youLeftWorkspace: _t("SYSTEM.YOU_LEFT_WORKSPACE", "You left the workspace"),
    leftTheWorkspace: _t("SYSTEM.LEFT_THE_WORKSPACE", "left the workspace"),
    leftTheChat: _t("SYSTEM.LEFT_THE_CHAT", "left the chat"),
    markImportant: _t("CHAT.MARK_IMPORTANT", "Mark as important"),
    unMarkImportant: _t("CHAT.UNMARK_IMPORTANT", "Unmark as important"),
    teamFeedback: _t("HUDDLE.HUDDLE_TEAM_FEEDBACK", "Huddle team feedback"),
    replyInPrivate: _t("CHAT.REPLY_IN_PRIVATE", "Reply in private"),
    removeOnDownload: _t("CHAT.REMOVE_ON_DOWNLOAD", "Remove on download"),
    withClient: _t("PAGE.WITH_CLIENT", "With client"),
    sharedClient: _t("PAGE.SHARED_CLIENT", "Shared"),
    teamChat: _t("PAGE.TEAM_CHAT", "Team Chat"),
    clientChat: _t("PAGE.CLIENT_CHAT", "Client Chat"),
    mute: _t("CHAT.MUTE", "Mute"),
    unmute: _t("CHAT.UNMUTE", "Unmute"),
    hide: _t("CHAT.HIDE", "Hide"),
    unhide: _t("CHAT.UNHIDE", "Unhide"),
    favorite: _t("FAVORITE", "Favorite"),
    unfavorite: _t("UNFAVORITE", "Unfavorite"),
    markAsUnread: _t("POST.MARK_AS_UNREAD", "Mark as unread"),
    markAsRead: _t("POST.MARK_AS_READ", "Mark as read"),
    unarchive: _t("CHAT.UNARCHIVE", "Un-archive"),
    archive: _t("CHAT.ARCHIVE", "Archive"),
    chatUnarchiveConfirmation: _t("CHAT.UNARCHIVE_CONFIRMATION", "Are you sure you want to un-archive this channel?"),
    chatArchiveConfirmation: _t("CHAT.ARCHIVE_CONFIRMATION", "Are you sure you want to archive this channel?"),
    headerArchive: _t("HEADER.ARCHIVE", "Chat archive"),
    headerUnarchive: _t("HEADER.UNARCHIVE", "Un-archive channel"),
    clickHereToJoin: _t("CHAT.CLICK_HERE_TO_JOIN", "Click here to join"),
    fileAutomaticallyRemoved: _t("FILE.AUTOMATICALLY_REMOVED_LABEL", "File automatically removed by owner request"),
    connectPreview: _t("GOOGLE_DRIVE.CONNECT_TO_PREVIEW", "Connect to preview"),
    restrictedLink: _t("GOOGLE_DRIVE.RESTRICTED_LINK", "Restricted link, try another account"),
    editHuddle: _t("CHAT.EDIT_HUDDLE", "Edit huddle"),
    discussOnTeamChat: _t("CHAT.DISCUSS_ON_TEAM_CHAT", "Discuss on team chat"),
    team: _t("TEAM", "Team"),
    errorSendingChat: _t("CHAT.ERROR_SENDING", "Error sending chat"),
    resend: _t("CHAT.FAIL_OPTIONS_RESEND", "Resend"),
    delete: _t("CHAT.FAIL_OPTIONS_DELETE", "Delete"),
    messageFailed: _t("CHAT.FAILED", "Message failed"),
    downloadAll: _t("CHAT.DOWNLOAD_ALL", "Download all"),
    notificationsOn: _t("TOOLTIP.NOTIFICATIONS_ON", "Notifications on"),
    notificationsOff: _t("TOOLTIP.NOTIFICATIONS_OFF", "Notifications off"),
    toasterBellNotificationOff: _t("TOASTER.WORKSPACE_BELL_NOTIFICATION_OFF", "All notifications are off except for mention and post actions"),
    toasterBellNotificationOn: _t("TOASTER.WORKSPACE_BELL_NOTIFICATION_ON", "All notifications for this workspace is ON"),
    googleMeet: _t("CONFIRMATION.GOOGLE_MEET", "Google meet"),
    yes: _t("YES", "Yes"),
    no: _t("NO", "No"),
    googleMeetConfirmation: _t("CONFIRMATION.GOOGLE_MEET_BODY", "Are you sure you want to start a meeting in this channel?"),
    personalNotes: _t("CHANNEL.PERSONAL_NOTES", "Personal Notes"),
    repliedViaEmail: _t("CHAT.REPLIED_VIA_EMAIL", "Replied via email"),
    personalNoteHeaderText: _t("PERSONAL_NOTE_HEADER_TEXT", "This space is just for you"),
    personalNoteDescription: _t("PERSONAL_NOTE_HEADER_DESCRIPTION", "Message yourself? Why not! Think of this as a scratchpad - a place for jotting down a note or drawing up a to-do list."),
    welcomNote1: _t("DRIFF.WELCOME_NOTE_1", "The time saving collaboration platform for agencies "),
    welcomNote2: _t("DRIFF.WELCOME_NOTE_2", "Talk less, do more and get things done"),
    setUpTrial: _t("DRIFF.SET_UP_TRIAL", "Set up your own Driff and get a free trial period of 30 days."),
    noCreditCard: _t("DRIFF.NO_CREDIT_CARD", "No credit card needed"),
    submitText: _t("INVITE.SUBMIT_TEXT", "Submit"),
    cancelText: _t("INVITE.CANCEL_TEXT", "Cancel"),
    generatingDriff: _t("GENERATING_DRIFF", "We are generating your Driff."),
    generateDriffMessage: _t("GENERATE_DRIFF_MESSAGE", "You may continue working your other tasks but please don’t close this tab. We will send you an email once we have your Driff ready."),
    sharedIconTooltip: _t("TOOLTIP.SHARED_ICON", "This is an account from a different driff"),
  };

  //useFocusInput(document.querySelector(".chat-footer .ql-editor"));

  const handleSearchChatPanel = () => {
    setShowSearchPanel(!showSearchPanel);
  };

  useEffect(() => {
    selectedChannel !== null && setPP(selectedChannel.id);
    if (selectedChannel !== null && pP !== selectedChannel.id && pP > 0) {
      setShowSearchPanel(false);
    }
  }, [pP, selectedChannel]);

  useEffect(() => {
    if (selectedChannel && $_GET("meeting") && !jitsi) {
      let modalPayload = {
        type: "jitsi_schedule_meeting",
      };

      dispatch(addToModals(modalPayload));
    }
  }, [selectedChannel, jitsi]);

  return (
    <Wrapper className={`chat-content ${className}`} onDragOver={handleshowDropZone}>
      <DropDocument
        hide={!showDropZone}
        ref={refs.dropZoneRef}
        onDragLeave={handleHideDropzone}
        onDrop={({ acceptedFiles }) => {
          dropAction(acceptedFiles);
        }}
        onCancel={handleHideDropzone}
      />
      {!isWorkspace && <ChatHeaderPanel dictionary={dictionary} channel={selectedChannel} handleSearchChatPanel={handleSearchChatPanel} />}
      {selectedChannel !== null ? (
        virtualization && ["anthea@makedevelopment.com", "nilo@makedevelopment.com", "johnpaul@makedevelopment.com", "sander@zuid.com"].includes(user.email) ? (
          <Suspense fallback={<ChatMessagesPlaceholder />}>
            <VirtuosoContainer dictionary={dictionary} />
          </Suspense>
        ) : (
          <Suspense fallback={<ChatMessagesPlaceholder />}>
            <ChatMessages
              chatMessageActions={chatMessageActions}
              timeFormat={timeFormat}
              dictionary={dictionary}
              unreadCount={unreadCount}
              teamChannelId={teamChannelId}
              isIdle={isIdle}
              translate={translate}
              language={language}
              translated_channels={translated_channels}
              chat_language={chat_language}
            />
          </Suspense>
        )
      ) : (
        <ChatMessagesPlaceholder />
      )}
      <ChatFooterPanel onShowFileDialog={handleOpenFileDialog} dropAction={dropAction} />
      {selectedChannel !== null && showSearchPanel && (
        <ChatSearchPanel chatMessageActions={chatMessageActions} showSearchPanel={showSearchPanel} setShowSearchPanel={setShowSearchPanel} handleSearchChatPanel={handleSearchChatPanel} selectedChannel={selectedChannel} user={user} />
      )}
    </Wrapper>
  );
};

export default ChatContentPanel;
