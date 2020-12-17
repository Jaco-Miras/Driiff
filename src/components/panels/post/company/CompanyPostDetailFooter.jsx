import React, { useEffect, useCallback, useRef, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import Tooltip from "react-tooltip-lite";
import { CommonPicker, SvgIconFeather } from "../../../common";
import { CommentQuote } from "../../../list/post/item";
import { CompanyPostInput, FolderSelect, CheckBox } from "../../../forms";
import { useTranslation, usePostActions } from "../../../hooks";

const Wrapper = styled.div`
  position: relative;
  > div > svg:first-child {
    margin-left: 0 !important;
  }
  flex: unset;

  .feather-paperclip {
    border: 1px solid #e1e1e1;
    height: 100%;
    cursor: pointer;
    width: 48px;
    border-radius: 8px;
    transition: background-color 0.15s ease-in-out;
    padding: 12px;
    &:hover {
      background-color: #e1e1e1;
    }
  }
`;

const ChatInputContainer = styled.div`
  position: relative;
  border: 1px solid #e1e1e1;
  box-shadow: 0 3px 10px #7a1b8b12;
  border-radius: 8px;
  padding-right: 120px;
  margin-right: 8px;
  min-height: 48px;
  .feather-send,
  .feather-smile,
  .feather-image {
    position: absolute;
    bottom: 0;
    right: 0;
    margin: 4px;
    height: calc(100% - 8px);
    max-height: 38px;
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
  .feather-image {
    right: 80px;
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
  .feather-send {
    background: ${(props) => props.backgroundSend};
    fill: ${(props) => props.fillSend};
    &:hover {
      cursor: ${(props) => props.cursor};
    }
  }
`;

const IconButton = styled(SvgIconFeather)``;

const Dflex = styled.div`
  // width: 100%;
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
  svg.feather-send {
    margin-left: 8px;
  }
  svg.feather-paperclip {
    margin-left: 0;
    margin-right: 0;
  }
  @media all and (max-width: 620px) {
    .emojiButton {
      display: none;
    }
    div:nth-child(4) {
      order: 1;
      margin-right: 8px;
    }
    div:nth-child(2) {
      order: 3;
    }
    svg:nth-child(3) {
      order: 3;
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
`;

const PickerContainer = styled(CommonPicker)`
  right: 130px;
  bottom: 75px;

  .common-picker-btn {
    text-align: right;
  }
`;

const FileNames = styled.div`
  padding: 5px 45px;
`;

const ApproveCheckBox = styled(CheckBox)`
  position: absolute;
  right: 120px;
  bottom: 0;
  height: 35px;
`;

const ApproverSelectWrapper = styled.div`
  padding-right: 55px;
  display: flex;
  // justify-content: flex-end;
  padding-bottom: 10px;
  margin-left: auto;
  > div.react-select-container {
    width: 300px;
  }
`;

const CompanyPostDetailFooter = (props) => {
  const { className = "", onShowFileDialog, dropAction, post, parentId = null, commentActions, userMention = null, handleClearUserMention = null, commentId = null, innerRef = null } = props;

  const postActions = usePostActions();
  const ref = {
    picker: useRef(),
    postInput: useRef(null),
  };
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [selectedGif, setSelectedGif] = useState(null);
  const [sent, setSent] = useState(false);
  const [active, setActive] = useState(false);
  const [cursor, setCursor] = useState("default");
  const [backgroundSend, setBackgroundSend] = useState(null);
  const [fillSend, setFillSend] = useState("#cacaca");
  const [showApprover, setShowApprover] = useState(false);
  const [approvers, setApprovers] = useState([]);
  const [approving, setApproving] = useState({ approve: false, change: false });

  const user = useSelector((state) => state.session.user);
  const users = useSelector((state) => state.users.users);
  const editPostComment = useSelector((state) => state.posts.editPostComment);

  const handleSend = useCallback(() => {
    setSent(true);
  }, [setSent]);

  const handleClearSent = useCallback(() => {
    setSent(false);
  }, [setSent]);

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

  const onActive = (active) => {
    setActive(active);
    let sendButtonValues;
    active ? (sendButtonValues = ["#7a1b8b", "pointer", "#fff"]) : (sendButtonValues = ["", "default", "#cacaca"]);
    setBackgroundSend(sendButtonValues[0]);
    setCursor(sendButtonValues[1]);
    setFillSend(sendButtonValues[2]);
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

  const { _t } = useTranslation();

  const dictionary = {
    noReplyAllowed: _t("FOOTER.NO_REPLY_ALLOWED", "No reply allowed"),
    attachFiles: _t("TOOLTIP.ATTACH_FILES", "Attach files"),
    lockedLabel: _t("CHAT.INFO_PRIVATE_WORKSPACE", "You are in a private workspace."),
    requestChange: _t("POST.REQUEST_CHANGE", "Request for change"),
    accept: _t("POST.ACCEPT", "Accept"),
  };

  const handleQuillImage = () => {
    if (ref.postInput) {
      const imgBtn = ref.postInput.current.parentNode.querySelector("button.ql-image");
      if (imgBtn) imgBtn.click();
    }
  };

  const toggleApprover = () => {
    setShowApprover((prevState) => !prevState);
  };

  const privateWsOnly = post.recipients.filter((r) => {
    return r.type === "TOPIC" && r.private === 1;
  });
  const prioMentionIds = post.recipients
    .filter((r) => r.type !== "DEPARTMENT")
    .map((r) => {
      if (r.type === "USER") {
        return [r.type_id];
      } else {
        return r.participant_ids;
      }
    })
    .flat();
  //const isMember = useIsMember(topic && topic.members.length ? topic.members.map((m) => m.id) : []);
  const userOptions = Object.values(users)
    .filter((u) => prioMentionIds.some((id) => id === u.id) && u.id !== user.id)
    .map((u) => {
      return {
        ...u,
        icon: "user-avatar",
        value: u.id,
        label: u.name ? u.name : u.email,
        type: "USER",
      };
    });
  const handleSelectApprover = (e) => {
    if (e === null) {
      setApprovers([]);
    } else {
      setApprovers(e);
    }
  };

  const handleClearApprovers = () => {
    setShowApprover(false);
    setApprovers([]);
  };

  useEffect(() => {
    if (editPostComment) {
      // const hasApproval =
      //   editPostComment.users_approval.length > 0 && editPostComment.users_approval.filter((u) => u.ip_address === null).length === editPostComment.users_approval.length && editPostComment.users_approval.some((u) => u.id === user.id);
      const hasRequestedChange = editPostComment.users_approval.filter((u) => u.ip_address !== null && !u.is_approved).length;
      if (editPostComment.users_approval.length > 0) {
        setShowApprover(true);
        setApprovers(
          editPostComment.users_approval.map((u) => {
            return {
              ...u,
              icon: "user-avatar",
              value: u.id,
              label: u.name,
              type: "USER",
              ip_address: hasRequestedChange ? null : u.ip_address,
              is_approved: hasRequestedChange ? false : u.is_approved,
            };
          })
        );
      }
    }
  }, [editPostComment]);

  //const showApproveCheckbox = post.users_approval.length === 0;

  const handleApprove = () => {
    postActions.showModal("confirmation", post);
  };

  const handleRequestChange = () => {
    setApproving({
      ...approving,
      change: true,
    });
    setShowApprover(true);
    setApprovers([
      {
        ...post.author,
        icon: "user-avatar",
        value: post.author.id,
        label: post.author.name,
        type: "USER",
        ip_address: null,
        is_approved: null,
      },
    ]);
  };

  const hasPendingAproval = post.users_approval.length > 0 && post.users_approval.filter((u) => u.ip_address === null).length === post.users_approval.length;
  const isApprover = post.users_approval.some((ua) => ua.id === user.id);
  const userApproved = post.users_approval.find((u) => u.ip_address !== null && u.is_approved);

  const requestForChangeCallback = () => {
    if (hasPendingAproval && isApprover && showApprover) {
      postActions.approve({
        post_id: post.id,
        approved: 0,
      });
    }
  };

  return (
    <Wrapper className={`company-post-detail-footer card-body ${className}`}>
      {
        <Dflex className="d-flex pr-2 pl-2">
          <CommentQuote commentActions={commentActions} commentId={commentId} />
        </Dflex>
      }
      <Dflex className="d-flex alig-items-center">
        {privateWsOnly.length === post.recipients.length && <div className={"locked-label mb-2"}>{dictionary.lockedLabel}</div>}
        {showApprover && (
          <ApproverSelectWrapper>
            <FolderSelect options={userOptions} value={approvers} onChange={handleSelectApprover} isMulti={true} isClearable={true} menuPlacement="top" />
          </ApproverSelectWrapper>
        )}
      </Dflex>
      {(!isApprover || approving.change || userApproved) && (
        <Dflex className="d-flex align-items-end">
          {post.is_read_only ? (
            <NoReply className="d-flex align-items-center">
              <div className="alert alert-warning">{dictionary.noReplyAllowed}</div>
            </NoReply>
          ) : (
            <React.Fragment>
              <ChatInputContainer ref={innerRef} className="flex-grow-1 chat-input-footer" backgroundSend={backgroundSend} cursor={cursor} fillSend={fillSend}>
                <CompanyPostInput
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
                  members={post.users_responsible}
                  onActive={onActive}
                  onClosePicker={onClosePicker}
                  ref={ref.postInput}
                  prioMentionIds={prioMentionIds}
                  approvers={showApprover ? approvers : []}
                  onClearApprovers={handleClearApprovers}
                  onSubmitCallback={requestForChangeCallback}
                />
                <ApproveCheckBox name="approve" checked={showApprover} onClick={toggleApprover}></ApproveCheckBox>
                <IconButton icon="image" onClick={handleQuillImage} />
                <IconButton className={`${showEmojiPicker ? "active" : ""}`} onClick={handleShowEmojiPicker} icon="smile" />
                <IconButton onClick={handleSend} icon="send" />
              </ChatInputContainer>
              <Tooltip arrowSize={5} distance={10} onToggle={toggleTooltip} content={dictionary.attachFiles}>
                <IconButton onClick={() => onShowFileDialog(parentId)} icon="paperclip" />
              </Tooltip>
            </React.Fragment>
          )}
          {showEmojiPicker === true && <PickerContainer handleShowEmojiPicker={handleShowEmojiPicker} onSelectEmoji={onSelectEmoji} onSelectGif={onSelectGif} orientation={"top"} ref={ref.picker} />}
        </Dflex>
      )}
      {editPostComment && editPostComment.files.length > 0 && <FileNames>{editPostComment.files.map((f) => f.name).join(", ")}</FileNames>}
      {hasPendingAproval && isApprover && !approving.change && (
        <Dflex>
          <div className="d-flex align-items-center justify-content-center mt-3">
            <button className="btn btn-outline-primary mr-3" onClick={handleRequestChange}>
              {dictionary.requestChange} {approving.change && <span className="spinner-border spinner-border-sm ml-2" role="status" aria-hidden="true" />}
            </button>
            <button className="btn btn-primary" onClick={handleApprove}>
              {dictionary.accept} {approving.approve && <span className="spinner-border spinner-border-sm ml-2" role="status" aria-hidden="true" />}
            </button>
          </div>
        </Dflex>
      )}
    </Wrapper>
  );
};

export default React.memo(CompanyPostDetailFooter);
