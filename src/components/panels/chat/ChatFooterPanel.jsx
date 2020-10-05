import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Tooltip from "react-tooltip-lite";
import styled from "styled-components";
import { onClickSendButton, putChannel } from "../../../redux/actions/chatActions";
import { joinWorkspace } from "../../../redux/actions/workspaceActions";
import { CommonPicker, SvgIconFeather } from "../../common";
import ChatInput from "../../forms/ChatInput";
import { useIsMember, useTimeFormat, useToaster, useTranslation } from "../../hooks";
import ChatQuote from "../../list/chat/ChatQuote";
import { addToModals } from "../../../redux/actions/globalActions";
import TypingIndicator from "../../list/chat/TypingIndicator";
import LockedLabel from "./LockedLabel";

const Wrapper = styled.div`
  position: relative;
  z-index: 1;
  .feather-paperclip {
    border: 1px solid #e1e1e1;
    height: 100%;
    cursor: pointer;
    width: 46px;
    border-radius: 8px;
    transition: background-color 0.15s ease-in-out;
    padding: 12px;
    &:hover {
      background-color: #e1e1e1;
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
  padding-right: 80px;
  margin-right: 8px;
  min-height: 48px;
  .feather-send,
  .feather-smile {
    position: absolute;
    bottom: 0;
    right: 0;
    margin: 4px;
    height: calc(100% - 8px);
    max-height: 38px;
    background: #7a1b8b;
    border-radius: 4px;
    min-width: 40px;
    width: 40px;
    padding: 10px;
    cursor: pointer;
    transition: background-color 0.15s ease-in-out, color 0.15s ease-in-out;
  }
  .feather-smile {
    right: 44px;
    margin: 4px 0;
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
  .feather-send:hover {
    background-color: #7a1b8bcc;
  }
`;

const Icon = styled(SvgIconFeather)`
  width: 20px;
  position: absolute;
`;

const IconButton = styled(SvgIconFeather)``;

const Dflex = styled.div`
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
  
  .common-picker-btn {
    text-align: right;
  }
`;

const ChatFooterPanel = (props) => {
  const { className = "", onShowFileDialog, dropAction } = props;
  const { localizeChatDate } = useTimeFormat();

  const dispatch = useDispatch();
  const toaster = useToaster();
  const ref = {
    picker: useRef(),
  };
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [selectedGif, setSelectedGif] = useState(null);

  const selectedChannel = useSelector((state) => state.chat.selectedChannel);
  const user = useSelector((state) => state.session.user);

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
  };

  const onClearEmoji = () => {
    setSelectedEmoji(null);
  };

  const onClearGif = () => {
    setSelectedGif(null);
    //handleSend();
  };

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

  const { _t } = useTranslation();

  const dictionary = {
    unarchiveThisWorkspace: _t("WORKSPACE.WORKSPACE_UNARCHIVE", "Unarchive this workspace"),
    unarchiveWorkspace: _t("HEADER.UNARCHIVE_WORKSPACE", "Unarchive workspace"),
    cancel: _t("BUTTON.CANCEL", "Cancel"),
    unarchiveBodyText: _t("TEXT.UNARCHIVE_CONFIRMATION", "Are you sure you want to unarchive this workspace?"),
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
        <b>{selectedChannel.type === "TOPIC" ? `${selectedChannel.title} workspace is unarchived.` : `${selectedChannel.title} channel is unarchived.`}</b>
      </span>
    );
  };

  const handleShowUnarchiveConfirmation = () => {
    let payload = {
      type: "confirmation",
      cancelText: dictionary.cancel,
      headerText: dictionary.unarchiveWorkspace,
      submitText: dictionary.unarchiveWorkspace,
      bodyText: dictionary.unarchiveBodyText,
      actions: {
        onSubmit: handleUnarchive,
      },
    };

    dispatch(addToModals(payload));
  };

  const onSendCallback = () => {
    setShowEmojiPicker(false);
  };

  const isMember = useIsMember(selectedChannel && selectedChannel.members.length ? selectedChannel.members.map((m) => m.id) : []);

  const toggleTooltip = () => {
    let tooltips = document.querySelectorAll("span.react-tooltip-lite");
    tooltips.forEach((tooltip) => {
      tooltip.parentElement.classList.toggle("tooltip-active");
    });
  };

  return (
    <Wrapper className={`chat-footer ${className}`}>
      <TypingIndicator />
      <LockedLabel channel={selectedChannel} />
      {isMember && (
        <Dflex className="d-flex align-items-end">
          {selectedChannel && selectedChannel.is_archived ? (
            <ArchivedDiv>
              <Icon icon="archive"/>
              <h4>{selectedChannel.type === "TOPIC" ? "This is an archived workspace" : "This is an archived channel"}</h4>
              <button className="btn btn-primary" onClick={handleShowUnarchiveConfirmation}>
                {selectedChannel.type === "TOPIC" ? "Un-archive workspace" : "Un-archive channel"}
              </button>
            </ArchivedDiv>
          ) : (
            <React.Fragment>
              {/* <Tooltip arrowSize={5} distance={10} onToggle={toggleTooltip} content="Emoji" className="emojiButton"></Tooltip> */}
              <ChatInputContainer className="flex-grow-1 chat-input-footer">
                {selectedChannel && !selectedChannel.is_archived && (
                  <Dflex className="d-flex pr-2 pl-2">
                    <ChatQuote/>
                  </Dflex>
                )}

                <ChatInput selectedGif={selectedGif} onSendCallback={onSendCallback} onClearGif={onClearGif}
                           selectedEmoji={selectedEmoji} onClearEmoji={onClearEmoji} dropAction={dropAction}/>
                <IconButton className={`${showEmojiPicker ? "active" : ""}`} onClick={handleShowEmojiPicker}
                            icon="smile"/>
                <IconButton onClick={handleSend} icon="send"/>
              </ChatInputContainer>

              <Tooltip arrowSize={5} distance={10} onToggle={toggleTooltip} content="Attach files">
                <IconButton onClick={onShowFileDialog} icon="paperclip" />
              </Tooltip>
            </React.Fragment>
          )}
          {showEmojiPicker === true && <PickerContainer handleSend={handleSend} handleShowEmojiPicker={handleShowEmojiPicker} onSelectEmoji={onSelectEmoji} onSelectGif={onSelectGif} orientation={"top"} ref={ref.picker} />}
        </Dflex>
      )}
      {isMember === false && selectedChannel !== null && (
        <Dflex className="channel-viewing">
          <div className="channel-name">You are viewing #{selectedChannel.title}</div>
          <div className="channel-create">
            Created by {selectedChannel.creator.name} on {localizeChatDate(selectedChannel.created_at.timestamp)}
          </div>
          <div className="channel-action">
            <button onClick={handleJoinWorkspace}>Join workspace chat</button>
          </div>
        </Dflex>
      )}
    </Wrapper>
  );
};

export default React.memo(ChatFooterPanel);
