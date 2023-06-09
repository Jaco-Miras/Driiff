import React, { useEffect, useRef, useState, lazy, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import Tooltip from "react-tooltip-lite";
import { joinWorkspace, updateWorkspacePostFilterSort } from "../../../redux/actions/workspaceActions";
import { CommonPicker, SvgIconFeather } from "../../common";
import PostInput from "../../forms/PostInput";
import { CommentQuote } from "../../list/post/item";
import { useToaster, useTranslationActions, usePostActions, useGetSlug } from "../../hooks";
import { addToModals } from "../../../redux/actions/globalActions";
import { putChannel } from "../../../redux/actions/chatActions";
import { FolderSelect } from "../../forms";
import { replaceChar } from "../../../helpers/stringFormatter";
import PostInputButtons from "./PostInputButtons";

const Reward = lazy(() => import("../../lazy/Reward"));

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
      color: ${(props) => props.theme.colors.primary};
    }
    &:hover {
      color: ${(props) => props.theme.colors.primary};
    }
    transition: background-color 0.15s ease-in-out, color 0.15s ease-in-out;
  }
  .feather-smile {
    background: transparent;
    border-color: transparent;
    transition: color 0.15s ease-in-out;
    color: #cacaca;
    &.active {
      color: ${(props) => props.theme.colors.primary};
    }
    &:hover {
      color: ${(props) => props.theme.colors.primary};
    }
  }
`;

const IconButton = styled(SvgIconFeather)``;

const Dflex = styled.div`
  #btn-disagree {
    &:hover {
      background: ${(props) => props.theme.colors.primary};
      border-color: ${(props) => props.theme.colors.primary};
    }
  }
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
        background: ${(props) => props.theme.colors.primary};
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
    color: ${(props) => props.theme.colors.primary};
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

const ApproverSelectWrapper = styled.div`
  padding-right: 55px;
  display: flex;
  padding-bottom: 10px;
  margin-left: auto;
  flex-direction: column;
  > div.react-select-container {
    width: 300px;
  }
`;

const OverviewNextLink = styled.span`
  display: flex;
  align-items: center;
  margin-right: 30px;
  svg {
    width: 1rem;
    height: 1rem;
  }
  :hover {
    cursor: pointer;
    text-decoration: underline;
  }
`;

const PostDetailFooter = (props) => {
  const {
    className = "",
    onShowFileDialog,
    dropAction,
    post,
    posts,
    filter,
    parentId = null,
    commentActions,
    userMention = null,
    handleClearUserMention = null,
    commentId = null,
    innerRef = null,
    workspace,
    isMember,
    disableOptions,
    mainInput,
  } = props;
  const { slug } = useGetSlug();
  const history = useHistory();
  const postActions = usePostActions();
  const dispatch = useDispatch();
  const ref = {
    picker: useRef(),
    postInput: useRef(null),
  };
  const rewardRef = useRef();
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
  const [imageLoading, setImageLoading] = useState(null);

  //const topic = useSelector((state) => state.workspaces.activeTopic);
  const user = useSelector((state) => state.session.user);
  const editPostComment = useSelector((state) => state.posts.editPostComment);
  const changeRequestedComment = useSelector((state) => state.posts.changeRequestedComment);
  const users = useSelector((state) => state.users.users);
  const sharedWs = useSelector((state) => state.workspaces.sharedWorkspaces);

  const userId = workspace && workspace.sharedSlug && sharedWs[workspace.slug] ? sharedWs[workspace.slug].user_auth.id : user.id;
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
    if (ref.postInput) {
      const imgBtn = ref.postInput.current.parentNode.querySelector("button.ql-image");
      if (imgBtn) imgBtn.click();
    }
  };

  const toggleApprover = () => {
    setShowApprover((prevState) => !prevState);
    setApproving({
      ...approving,
      change: false,
    });
  };

  // const privateWsOnly = post.recipients.filter((r) => {
  //   return r.type === "TOPIC" && r.private === 1;
  // });
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
  let approverOptions = [
    ...Object.values(users)
      .filter((u) => {
        return prioMentionIds.some((id) => id === u.id) && u.id !== userId && post && post.author.id !== u.id;
      })
      .map((u) => {
        return {
          ...u,
          icon: "user-avatar",
          value: u.id,
          label: u.name ? u.name : u.email,
          type: "USER",
        };
      }),
    {
      id: require("shortid").generate(),
      value: "all",
      label: "All users",
      icon: "users",
      all_ids: prioMentionIds.filter((id) => users[id] && users[id].active && id !== userId),
    },
  ];

  if (workspace && workspace.sharedSlug) {
    approverOptions = [
      ...workspace.members
        .filter((u) => {
          return prioMentionIds.some((id) => id === u.id) && u.id !== userId && post && post.author.id !== u.id;
        })
        .map((u) => {
          return {
            ...u,
            icon: "user-avatar",
            value: u.id,
            label: u.name ? u.name : u.email,
            type: "USER",
          };
        }),
      {
        id: require("shortid").generate(),
        value: "all",
        label: "All users",
        icon: "users",
        all_ids: prioMentionIds.filter((id) => users[id] && users[id].active && id !== userId),
      },
    ];
  }

  if (approvers.length && approvers.find((a) => a.value === "all")) {
    approverOptions = approverOptions.filter((a) => a.value === "all");
  }

  const handleSelectApprover = (e) => {
    if (e === null || !e.length) {
      if (changeRequestedComment) {
        commentActions.clearApprovingStatus(changeRequestedComment.id);
      }
      if (props.handleCancelChange) {
        props.handleCancelChange();
      }
      if (approving.change) {
        setApproving({
          ...approving,
          change: false,
        });
        setShowApprover(false);
      }
    }
    if (e === null) {
      setApprovers([]);
    } else {
      if (e.find((a) => a.value === "all")) {
        setApprovers(e.filter((a) => a.value === "all"));
      } else {
        setApprovers(e);
      }
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

  const handleApprove = () => {
    postActions.showModal("confirmation", post, null, rewardRef);
  };

  const handleRequestChange = () => {
    if (post.users_approval.length === 1) {
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
    } else {
      let sharedPayload = null;
      if (post.sharedSlug && workspace && workspace.sharedSlug) {
        sharedPayload = { slug: workspace.slug, token: sharedWs[workspace.slug].access_token, is_shared: true };
      }
      setApproving({
        ...approving,
        change: true,
      });
      postActions.approve(
        {
          post_id: post.id,
          approved: 0,
          sharedPayload: sharedPayload,
        },
        (err, res) => {
          setApproving({
            ...approving,
            change: false,
          });
          if (err) return;
          const isLastUserToAnswer = post.users_approval.filter((u) => u.ip_address === null).length === 1;
          const allUsersDisagreed = post.users_approval.filter((u) => u.ip_address !== null && !u.is_approved).length === post.users_approval.length - 1;
          if (isLastUserToAnswer && allUsersDisagreed) {
            postActions.generateSystemMessage(
              post,
              [],
              post.users_approval.map((ua) => ua.id)
            );
          }
        }
      );
    }
  };

  const goBackToInbox = () => {
    let payload = {
      topic_id: workspace.id,
      filter: "inbox",
      tag: null,
      slug: workspace.slug,
      isSharedSlug: workspace.sharedSlug,
    };
    const wsType = workspace.sharedSlug ? "shared-hub" : "hub";
    const path =
      workspace.folder_name && workspace.folder_id
        ? `/${wsType}/posts/${workspace.folder_id}/${replaceChar(workspace.folder_name)}/${workspace.id}/${replaceChar(workspace.name)}`
        : `/${wsType}/posts/${workspace.id}/${replaceChar(workspace.name)}`;
    dispatch(updateWorkspacePostFilterSort(payload));
    history.push(path);
  };

  const handleNextPost = () => {
    // const nextPost = posts.reduce((accumulator, { id }, index) => {
    //   if (id === post.id) {
    //     accumulator = posts[index + 1];
    //   }
    //   return accumulator;
    // }, null);
    const wsType = workspace.sharedSlug ? "shared-hub" : "hub";
    postActions.archivePost(post, () => {
      const nextUnreadPosts = posts.find((p) => p.is_archived !== 1 && p.is_unread === 1);
      if (!nextUnreadPosts) {
        goBackToInbox();
      } else {
        const path =
          workspace.folder_name && workspace.folder_id
            ? `/${wsType}/posts/${workspace.folder_id}/${replaceChar(workspace.folder_name)}/${workspace.id}/${replaceChar(workspace.name)}`
            : `/${wsType}/posts/${workspace.id}/${replaceChar(workspace.name)}`;
        postActions.openPost(nextUnreadPosts, path);
      }
    });
  };

  const hasPendingAproval = post.users_approval.length > 0 && post.users_approval.filter((u) => u.ip_address === null).length === post.users_approval.length;
  const isApprover = post.users_approval.some((ua) => ua.id === userId);
  //const userApproved = post.users_approval.find((u) => u.ip_address !== null && u.is_approved);
  const approverNames = post.users_approval.map((u) => u.name);
  const isMultipleApprovers = post.users_approval.length > 1;
  const hasAnswered = post.users_approval.some((ua) => ua.id === userId && ua.ip_address !== null);
  //const isLastUserToAnswer = post.users_approval.length > 0 && post.users_approval.length - post.users_approval.filter((u) => u.ip_address === null).length === 1;

  const requestForChangeCallback = (err, res) => {
    if (err) return;
    if (post.must_reply_users && post.must_reply_users.some((u) => u.id === userId && !u.must_reply)) {
      //postActions.markReplyRequirement(post);
      //check if post is also set as must read
      let triggerRead = true;
      if (post.is_must_read && post.author.id !== userId) {
        if (post.must_read_users && post.must_read_users.some((u) => u.id === userId && !u.must_read)) {
          triggerRead = false;
        }
      }
      const hasUserPendingApproval = post.users_approval.length > 0 && post.users_approval.some((u) => u.ip_address === null && u.id === userId);
      if (triggerRead && !hasUserPendingApproval) postActions.markAsRead(post);
    }
    if (post.users_approval.length === 1) {
      if (hasPendingAproval && isApprover && showApprover) {
        postActions.approve(
          {
            post_id: post.id,
            approved: 0,
          },
          (err, res) => {
            setApproving({
              ...approving,
              change: false,
            });
          }
        );
      }
    }
    if (changeRequestedComment) {
      commentActions.approve({
        post_id: post.id,
        approved: 0,
        comment_id: changeRequestedComment.id,
        transfer_comment_id: res.data.id,
      });
    }
  };

  useEffect(() => {
    if (changeRequestedComment && commentId && commentId === changeRequestedComment.id) {
      setShowApprover(true);
      setApprovers([
        {
          ...changeRequestedComment.author,
          icon: "user-avatar",
          value: changeRequestedComment.author.id,
          label: changeRequestedComment.author.name,
          type: "USER",
          ip_address: null,
          is_approved: null,
        },
      ]);
    } else {
      setShowApprover(false);
      setApprovers([]);
    }
  }, [changeRequestedComment]);

  const hasPrivateRecipient = post.recipients.find((r) => {
    return r.type === "TOPIC" && r.private === 1;
  });

  const hasUserRecipient = post.recipients.find((r) => r.type === "USER");

  const hasPublicRecipient = post.recipients.find((r) => {
    return r.type === "TOPIC" && r.private === 0;
  });

  const handleReopen = () => {
    let sharedPayload = null;
    if (post.sharedSlug && workspace && workspace.sharedSlug) {
      sharedPayload = { slug: workspace.slug, token: sharedWs[workspace.slug].access_token, is_shared: true };
    }
    let payload = {
      post_id: post.id,
      is_close: post.is_close ? 0 : 1,
      sharedPayload: sharedPayload,
    };
    postActions.close(payload);
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
          <CommentQuote
            commentActions={commentActions}
            commentId={editPostComment && post && editPostComment.post_id === post.id && editPostComment.quote ? editPostComment.quote.id : commentId}
            editPostComment={editPostComment}
            mainInput={mainInput}
          />
        </Dflex>
      }
      <Dflex className="d-flex alig-items-center">
        {/* {isMember && !disableOptions && privateWsOnly.length === post.recipients.length && <div className={"locked-label mb-2"}>{dictionary.lockedLabel}</div>} */}
        {hasPrivateRecipient && hasUserRecipient && <div className={"locked-label mb-2"}>{dictionary.sharedWithAdditionalPeople}</div>}
        {hasPrivateRecipient && hasPublicRecipient && <div className={"locked-label mb-2"}>{dictionary.sharedWithPublicWs}</div>}
        {showApprover && (
          <ApproverSelectWrapper>
            {approving.change && isApprover && <label>{dictionary.requestChangeTo}</label>}
            {!isApprover && <label>{dictionary.addressedTo}</label>}
            <FolderSelect options={approverOptions} value={approvers} onChange={handleSelectApprover} isMulti={true} isClearable={true} menuPlacement="top" />
          </ApproverSelectWrapper>
        )}
      </Dflex>
      {hasPendingAproval && !isApprover && (
        <NoReply className="d-flex align-items-center mb-2">
          <div className="alert alert-primary" style={{ color: "#7a1b8b" }}>
            {dictionary.requestApprovalFrom} {approverNames.join(", ")}
          </div>
        </NoReply>
      )}
      {post.is_close && mainInput && (
        <ClosedLabel className="d-flex align-items-center">
          <div className="alert alert-warning">
            <span>{dictionary.userClosedPost}</span>
            <span onClick={handleReopen}>{dictionary.reopen}</span>
          </div>
        </ClosedLabel>
      )}
      {post.is_read_only && mainInput && (
        <Dflex className="d-flex align-items-end">
          <NoReply className="d-flex align-items-center">
            <div className="alert alert-warning">{dictionary.noReplyAllowed}</div>
          </NoReply>
        </Dflex>
      )}
      {((isMember && !disableOptions) || approving.change || hasAnswered) && !post.is_close && !post.is_read_only && (
        <>
          <Dflex className="d-flex align-items-end" backgroundSend={backgroundSend} cursor={cursor} fillSend={fillSend}>
            <ChatInputContainer ref={innerRef} className="flex-grow-1 chat-input-footer">
              <PostInput
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
              <PostInputButtons
                parentId={parentId}
                handleQuillImage={handleQuillImage}
                handleShowEmojiPicker={handleShowEmojiPicker}
                onShowFileDialog={onShowFileDialog}
                showApprover={showApprover}
                toggleApprover={toggleApprover}
                editPostComment={editPostComment}
                mainInput={mainInput}
                hasPostAccess={prioMentionIds.some((id) => id === userId)}
              />
            </ChatInputContainer>

            <Tooltip arrowSize={5} distance={10} onToggle={toggleTooltip} content="Send">
              <IconButton onClick={handleSend} icon="send" />
            </Tooltip>

            {showEmojiPicker === true && <PickerContainer handleShowEmojiPicker={handleShowEmojiPicker} onSelectEmoji={onSelectEmoji} onSelectGif={onSelectGif} orientation={"top"} ref={ref.picker} />}
          </Dflex>
          {editPostComment && editPostComment.files.length > 0 && <FileNames>{editPostComment.files.map((f) => f.name).join(", ")}</FileNames>}
        </>
      )}
      {((hasPendingAproval && isApprover && !approving.change) || (isMultipleApprovers && isApprover && !hasAnswered)) && (
        <Dflex>
          <div className="d-flex align-items-center justify-content-center mt-3">
            <button id="btn-disagree" className="btn btn-outline-primary mr-3" onClick={handleRequestChange}>
              {dictionary.disagree} {approving.change && <span className="spinner-border spinner-border-sm ml-2" role="status" aria-hidden="true" />}
            </button>
            <Suspense fallback={<></>}>
              <Reward
                ref={rewardRef}
                type="confetti"
                config={{
                  elementCount: 65,
                  elementSize: 10,
                  spread: 140,
                  lifetime: 360,
                }}
              >
                <button className="btn btn-primary" onClick={handleApprove}>
                  {dictionary.agree} {approving.approve && <span className="spinner-border spinner-border-sm ml-2" role="status" aria-hidden="true" />}
                </button>
              </Reward>
            </Suspense>
          </div>
        </Dflex>
      )}
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
      {filter && filter === "inbox" && post && post.is_archived === 0 && (
        <Dflex>
          <div className="d-flex align-items-center justify-content-center mt-3">
            <OverviewNextLink onClick={goBackToInbox}>
              <SvgIconFeather className="mr-2" icon="corner-up-left" /> {dictionary.overview}
            </OverviewNextLink>
            <OverviewNextLink onClick={handleNextPost}>
              {dictionary.archivePostOpenNext} <SvgIconFeather className="ml-2" icon="corner-up-right" />
            </OverviewNextLink>
          </div>
        </Dflex>
      )}
    </Wrapper>
  );
};

export default React.memo(PostDetailFooter);
