import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import Tooltip from "react-tooltip-lite";
import { joinWorkspace } from "../../../redux/actions/workspaceActions";
import { CommonPicker, SvgIconFeather } from "../../common";
import { useToaster, useTranslationActions } from "../../hooks";
import { addToModals } from "../../../redux/actions/globalActions";
import { putChannel } from "../../../redux/actions/chatActions";
import WIPDetailInput from "./WIPDetailInput";
import WIPDetailInputButtons from "./WIPDetailInputButtons";
import WIPCommentQuote from "./WIPCommentQuote";

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

const ChatInputContainer = styled.div`
  position: relative;
  border: 1px solid #e1e1e1;
  box-shadow: 0 3px 10px #7a1b8b12;
  border-radius: 8px;
  margin-right: 8px;
  min-height: 48px;
  display: flex;
  .feather-approver,
  .feather-image,
  .feather-paperclip,
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
`;

const IconButton = styled(SvgIconFeather)``;

const Dflex = styled.div`
  .feather-send {
    background: ${(props) => props.backgroundSend} !important;
    fill: ${(props) => props.fillSend};
    &:hover {
      cursor: ${(props) => props.cursor};
    }
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
        border-radius: 8px;
        font-size: 16px;
        font-weight: 600;
      }
    }
  }
  @media all and (max-width: 620px) {
    .emojiButton {
      display: none;
    }
    svg.feather-send {
      margin-right: 0;
    }
  }
`;

const NoReply = styled.div`
  width: 100%;
  .alert {
    width: 100%;
    margin-bottom: 0;
    text-align: center;
  }
  .request-approval {
    color: #7a1b8b;
  }
`;

const ClosedLabel = styled.div`
  width: 100%;

  .alert {
    width: 100%;
    margin-bottom: 0;
    display: flex;
    justify-content: space-between;

    span:last-child {
      cursor: pointer;
    }
  }
`;

const PickerContainer = styled(CommonPicker)`
  right: 130px;
  bottom: 120px;

  @media (max-width: 414px) {
    right: 5px;
    bottom: 150px;
  }

  .common-picker-btn {
    text-align: right;
  }
`;

const FileNames = styled.div`
  padding: 5px 45px;
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

const Icon = styled(SvgIconFeather)`
  margin-right: 6px;
  width: 20px;
`;

const WIPDetailFooter = (props) => {
  const {
    className = "",
    onShowFileDialog,
    dropAction,
    post,
    posts,
    filter,
    commentId = null,
    parentId = null,
    commentActions,
    userMention = null,
    handleClearUserMention = null,
    innerRef = null,
    workspace,
    isMember,
    disableOptions,
    mainInput,
    wip,
  } = props;
  //console.log(parentId);
  const history = useHistory();
  const dispatch = useDispatch();
  const ref = {
    picker: useRef(),
    postInput: useRef(null),
    inputRef: useRef(null),
  };
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [selectedGif, setSelectedGif] = useState(null);
  const [sent, setSent] = useState(false);
  const [active, setActive] = useState(false);
  const [cursor, setCursor] = useState("default");
  const [backgroundSend, setBackgroundSend] = useState(null);
  const [fillSend, setFillSend] = useState("#cacaca");
  const [imageLoading, setImageLoading] = useState(null);

  //const topic = useSelector((state) => state.workspaces.activeTopic);
  const user = useSelector((state) => state.session.user);
  const editWIPComment = useSelector((state) => state.wip.editWIPComment);
  const users = useSelector((state) => state.users.users);

  const handleSend = () => {
    setSent(true);
  };

  const handleClearSent = () => {
    setSent(false);
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
          channel_id: workspace.channel.id,
          recipient_ids: [user.id],
        },
        (err, res) => {
          if (err) return;
        }
      )
    );
  };

  const toaster = useToaster();
  const { _t } = useTranslationActions();

  const dictionary = {
    unarchiveThisWorkspace: _t("WORKSPACE.WORKSPACE_UNARCHIVE", "Un-archive this workspace"),
    unarchiveWorkspace: _t("HEADER.UNARCHIVE_WORKSPACE", "Un-archive workspace"),
    cancel: _t("BUTTON.CANCEL", "Cancel"),
    unarchiveBodyText: _t("TEXT.UNARCHIVE_CONFIRMATION", "Are you sure you want to un-archive this workspace?"),
    workspaceIsUnarchived: _t("TOASTER.WORKSPACE_IS_UNARCHIVED", "workpace is un-archived"),
    thisIsAnArchivedWorkspace: _t("FOOTER.THIS_IS_AN_ARCHIVED_WORKSPACE", "This is an archived workpace"),
    noReplyAllowed: _t("FOOTER.NO_REPLY_ALLOWED", "No reply allowed"),
    attachFiles: _t("TOOLTIP.ATTACH_FILES", "Attach files"),
    youAreViewing: _t("FOOTER.YOU_ARE_VIEWING", "You are viewing"),
    joinWorkspace: _t("BUTTON.JOIN_WORKSPACE", "Join workspace"),
    lockedLabel: _t("CHAT.INFO_PRIVATE_WORKSPACE", "You are in a private workspace."),
    requestChange: _t("POST.REQUEST_CHANGE", "Request for change"),
    accept: _t("POST.ACCEPT", "Accept"),
    requestApprovalFrom: _t("POST.REQUEST_APPROVAL_FROM", "Request approval from"),
    requestChangeTo: _t("POST.REQUEST_CHANGE_TO", "Request change to"),
    addressedTo: _t("POST.ADDRESSED_TO", "Addressed to"),
    selectApprover: _t("TOOLTIP.SELECT_APPROVER", "Select approver"),
    emoji: _t("TOOLTIP.EMOJI", "Emoji"),
    images: _t("TOOLTIP.IMAGES", "Images"),
    sharedWithAdditionalPeople: _t("POST.INFO_SHARED_WITH_PEOPLE", "Your comment is published in secured workspace(s) & shared with additional people"),
    sharedWithPublicWs: _t("POST.INFO_SHARED_WITH_PUBLIC_WS", "Your comment is published in secured workspace(s) & public workspace(s)"),
    creatorClosedPost: _t("POST.CREATOR_CLOSED_POST", "The creator closed this post for commenting"),
    reopen: _t("POST.REOPEN", "Reopen"),
    agree: _t("POST.AGREE", "Agree"),
    disagree: _t("POST.DISAGREE", "Disagree"),
    overview: _t("POST.OVERVIEW", "Overview"),
    archivePostOpenNext: _t("POST.ARCHIVE_POST_OPEN_NEXT", "Archive Post & open next"),
    userClosedPost: _t("POST.USER_CLOSED_POST", "::username:: has closed this message", { username: post && typeof post.post_close === "object" && post.post_close.initiator ? post.post_close.initiator.name : "" }),
  };

  const handleUnarchive = () => {
    let payload = {
      id: workspace.channel.id,
      is_archived: false,
      is_muted: false,
      is_pinned: false,
      push_unarchived: 1,
    };

    dispatch(putChannel(payload));
    toaster.success(
      <span>
        <b>
          {workspace.name} {dictionary.workspaceIsUnarchived}.
        </b>
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

  const toggleTooltip = () => {
    let tooltips = document.querySelectorAll("span.react-tooltip-lite");
    tooltips.forEach((tooltip) => {
      tooltip.parentElement.classList.toggle("tooltip-active");
    });
  };

  const onClosePicker = () => {
    setShowEmojiPicker(false);
  };

  const onActive = (active) => {
    setActive(active);
    let sendButtonValues;
    active && !imageLoading ? (sendButtonValues = ["#7a1b8b", "pointer", "#fff"]) : (sendButtonValues = ["", "default", "#cacaca"]);
    setBackgroundSend(sendButtonValues[0]);
    setCursor(sendButtonValues[1]);
    setFillSend(sendButtonValues[2]);
  };

  const handleQuillImage = () => {
    if (ref.inputRef) {
      const imgBtn = ref.inputRef.current.parentNode.querySelector("button.ql-image");
      if (imgBtn) imgBtn.click();
    }
  };

  return (
    <Wrapper className={`post-detail-footer card-body ${className}`}>
      {disableOptions && (
        <ArchivedDiv>
          <Icon icon="archive" />
          <h4>{dictionary.thisIsAnArchivedWorkspace}</h4>
          <button className="btn btn-primary" onClick={handleShowUnarchiveConfirmation}>
            {dictionary.unarchiveWorkspace}
          </button>
        </ArchivedDiv>
      )}
      {
        <Dflex className="d-flex pr-2 pl-2">
          <WIPCommentQuote
            commentActions={commentActions}
            commentId={editWIPComment && post && editWIPComment.proposal_id === wip.id && editWIPComment.quote ? editWIPComment.quote.id : commentId}
            editWIPComment={editWIPComment}
            mainInput={mainInput}
          />
        </Dflex>
      }

      <>
        <Dflex className="d-flex align-items-end" backgroundSend={backgroundSend} cursor={cursor} fillSend={fillSend}>
          <ChatInputContainer ref={innerRef} className="flex-grow-1 chat-input-footer">
            <WIPDetailInput
              onActive={onActive}
              wip={wip}
              parentId={parentId}
              commentId={commentId}
              mainInput={mainInput}
              selectedGif={selectedGif}
              onClearGif={onClearGif}
              selectedEmoji={selectedEmoji}
              onClearEmoji={onClearEmoji}
              handleClearSent={handleClearSent}
              sent={sent}
              ref={ref.inputRef}
              imageLoading={imageLoading}
              setImageLoading={setImageLoading}
              userMention={userMention}
              handleClearUserMention={handleClearUserMention}
            />
            <WIPDetailInputButtons
              parentId={parentId}
              handleQuillImage={handleQuillImage}
              handleShowEmojiPicker={handleShowEmojiPicker}
              onShowFileDialog={onShowFileDialog}
              mainInput={mainInput}
              imageLoading={imageLoading}
              setImageLoading={setImageLoading}
            />
            {/* <PostInput
                handleClearSent={handleClearSent}
                sent={sent}
                commentId={commentId}
                userMention={userMention}
                handleClearUserMention={handleClearUserMention}
                commentActions={commentActions}
                parentId={parentId}
                post={post}
                selectedGif={selectedGif}
                onClearGif={onClearGif}
                selectedEmoji={selectedEmoji}
                onClearEmoji={onClearEmoji}
                dropAction={dropAction}
                members={workspace ? workspace.members : []}
                workspace={workspace ? workspace : null}
                onActive={onActive}
                onClosePicker={onClosePicker}
                ref={ref.postInput}
                prioMentionIds={prioMentionIds}
                approvers={showApprover ? approvers : []}
                onClearApprovers={handleClearApprovers}
                onSubmitCallback={requestForChangeCallback}
                isApprover={(approving.change && hasPendingAproval) || (changeRequestedComment && commentId && commentId === changeRequestedComment.id)}
                mainInput={mainInput}
                imageLoading={imageLoading}
                setImageLoading={setImageLoading}
              />
              */}
          </ChatInputContainer>

          <Tooltip arrowSize={5} distance={10} onToggle={toggleTooltip} content="Send">
            <IconButton onClick={handleSend} icon="send" />
          </Tooltip>

          {showEmojiPicker === true && <PickerContainer handleShowEmojiPicker={handleShowEmojiPicker} onSelectEmoji={onSelectEmoji} onSelectGif={onSelectGif} orientation={"top"} ref={ref.picker} />}
        </Dflex>
      </>

      {isMember === false && workspace !== null && !disableOptions && (
        <Dflex className="channel-viewing">
          <div className="channel-name">
            {dictionary.youAreViewing} #{workspace.name}
          </div>
          <div className="channel-action">
            <button onClick={handleJoinWorkspace}>{dictionary.joinWorkspace}</button>
          </div>
        </Dflex>
      )}
    </Wrapper>
  );
};

export default React.memo(WIPDetailFooter);
