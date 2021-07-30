import React, { useRef, useState, lazy, Suspense, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { addToModals } from "../../../redux/actions/globalActions";
import { DropDocument } from "../../dropzone/DropDocument";
import { useCountUnreadReplies, useFocusInput, useTimeFormat, useTranslationActions } from "../../hooks";
import useChatMessageActions from "../../hooks/useChatMessageActions";
import { ChatFooterPanel, ChatHeaderPanel, ChatSearchPanel } from "./index";
import { useIdleTimer } from "react-idle-timer";

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

  const { virtualization, translate } = useSelector((state) => state.settings.user.CHAT_SETTINGS);

  const { chat_language, translated_channels, language } = useSelector((state) => state.settings.user.GENERAL_SETTINGS);

  const selectedChannel = useSelector((state) => state.chat.selectedChannel);

  const teamChannelId = useSelector((state) => state.workspaces.isOnClientChat);
  //const bottomRef = useRef();
  const [showDropZone, setshowDropZone] = useState(false);
  //const [bottomRefVisible, setBottomRefVisible] = useState(false);
  const unreadCount = useCountUnreadReplies();

  const refs = {
    dropZoneRef: useRef(),
  };

  const [chatListRef, setChatListRef] = useState([]);
  const [showSearchPanel, setShowSearchPanel] = useState(false);
  const [pP, setPP] = useState(selectedChannel !== null ? selectedChannel.id : 0);

  useEffect(() => {
    selectedChannel !== null && pP !== selectedChannel.id && setShowSearchPanel(false);
  }, [selectedChannel]);

  const scrollComponent = React.createRef();
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
    editHuddle: _t("MESSAGE.EDIT_HUDDLE", "Edit huddle"),
    discussOnTeamChat: _t("MESSAGE.DISCUSS_ON_TEAM_CHAT", "Discuss on team chat"),
  };

  //useFocusInput(document.querySelector(".chat-footer .ql-editor"));

  const handleSearchChatPanel = () => {
    setShowSearchPanel(!showSearchPanel);
  };
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
        virtualization ? (
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
              scrollComponent={scrollComponent}
            />
          </Suspense>
        )
      ) : (
        <ChatMessagesPlaceholder />
      )}
      <ChatFooterPanel onShowFileDialog={handleOpenFileDialog} dropAction={dropAction} />
      <ChatSearchPanel showSearchPanel={showSearchPanel} handleSearchChatPanel={handleSearchChatPanel} scrollComponent={scrollComponent} pP={pP} selectedChannel={selectedChannel} />
    </Wrapper>
  );
};

export default ChatContentPanel;
