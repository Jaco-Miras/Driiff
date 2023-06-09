import React, { useEffect, useRef, useState, lazy, Suspense } from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { Avatar, FileAttachments, ReminderNote, SvgIconFeather } from "../../../common";
import { MoreOptions } from "../../../panels/common";
import { PostDetailFooter, PostVideos, PostChangeAccept } from "../../../panels/post/index";
import { Quote, SubComments } from "./index";
import { useGoogleApis, useTimeFormat, useFiles, useGetSlug } from "../../../hooks";
import quillHelper from "../../../../helpers/quillHelper";
import { CompanyPostDetailFooter } from "../../../panels/post/company";
import { useDispatch, useSelector } from "react-redux";
import { setViewFiles } from "../../../../redux/actions/fileActions";
import CommentCounters from "./CommentCounters";
import { sessionService } from "redux-react-session";

const Reward = lazy(() => import("../../../lazy/Reward"));

const Wrapper = styled.li`
  margin-bottom: 1rem;
  overflow: initial;

  &.important {
    background: #6a5acd !important;
    color: #fff;
    .text-muted {
      color: #fffafa !important;
    }
  }

  .mention {
    font-weight: bold;
    color: ${(props) => props.theme.colors.primary};
    &[data-value="All"],
    &[data-id="${(props) => props.userId}"] {
      font-weight: normal;
      box-shadow: none;
      padding: 0 4px;
      border-radius: 8px;
      text-decoration: underline;
      display: inline-block;
      width: auto;
      height: auto;
    }
  }

  .quote {
    margin: 0 auto 0.5rem;
    width: 95%;
    position: relative;
    padding: 0 1rem;
    color: #868686;
    border-left: 4px solid ${(props) => props.theme.colors.primary};

    // &:before {
    //   border: 10px solid #0000;
    //   border-right-color: #36393d;
    // }

    // &.border-side {
    //   border-left: 5px solid #822492;
    //   border-radius: 0 !important;
    // }

    > * {
      margin-bottom: 0;
    }
  }

  .quote-author {
    margin-top: 1rem;
    margin-left: 2.5%;
    margin-bottom: 0.5rem;
  }

  .files {
    margin-bottom: 1rem;

    li {
      display: inline-block;

      &:not(:last-child) {
        margin-right: 1rem;
      }

      .feather-paperclip {
        margin-right: 0.5rem;
      }
    }
  }

  .clap-count-wrapper {
    position: relative;

    &:hover {
      .read-users-container {
        opacity: 1;
        max-height: 300px;
      }
    }

    .read-users-container {
      position: absolute;
      left: 0;
      z-index: 1;
      bottom: 20px;
      border-radius: 8px;
      opacity: 0;
      max-height: 0;
      transition: all 0.5s ease;
      overflow-y: auto;
      background: #fff;
      border: 1px solid #fff;
      box-shadow: 0 5px 10px -1px rgba(0, 0, 0, 0.15);

      &:hover {
        max-height: 300px;
        opacity: 1;
      }

      .dark & {
        border: 1px solid #25282c;
        background: #25282c;
      }

      > span {
        padding: 0.25rem 0.5rem 0.25rem 0.25rem;
        display: flex;
        justify-content: flex-start;
        align-items: start;

        .avatar {
          min-width: 1.5rem;
          max-width: 1.5rem;
          width: 1.5rem;
          height: 1.5rem;
        }
        .name {
          display: block;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
      }
    }
  }
`;

const InputWrapper = styled.li`
  overflow: initial;
  z-index: 10;
`;

const CommentWrapper = styled.div`
  img {
    border-radius: 6px;
    max-height: 250px;
  }
  .comment-reaction {
    cursor: pointer;
  }
  .clap-true {
    color: ${(props) => props.theme.colors.primary};
    fill: ${(props) => props.theme.colors.primary};
  }
`;

const CommentHeader = styled.div`
  .more-options {
    margin-left: auto;
    width: 28px;
    height: 28px;
    padding: 6px 0 0 5px;
    svg {
      width: 1rem;
      height: 1rem;
    }
  }
`;
const CommentBody = styled.div`
  &.ql-editor {
    padding: 0;
  }
  img {
    max-width: 50%;
    @media (max-width: 991.99px) {
      max-width: 100%;
    }
  }
  ul {
    li {
      list-style: initial;
    }
  }
`;

const CommentFilesTrashedContainer = styled.div`
  h6 {
    margin: 0;
  }
  .text-muted {
    font-size: 0.75rem;
  }
  .file-attachments {
    margin-top: 1rem;
  }
`;

const CommentInput = styled(PostDetailFooter)``;

const CompanyCommentInput = styled(CompanyPostDetailFooter)``;

const Comment = (props) => {
  const {
    className = "",
    comment,
    post,
    type = "main",
    user,
    commentActions,
    parentId,
    onShowFileDialog,
    dropAction,
    parentShowInput = null,
    workspace,
    isMember,
    dictionary,
    disableOptions,
    isCompanyPost = false,
    postActions,
    userId = null,
  } = props;

  const dispatch = useDispatch();

  const refs = {
    input: useRef(null),
    body: useRef(null),
    main: useRef(null),
    content: useRef(null),
  };
  const rewardRef = useRef();

  const {
    fileBlobs,
    actions: { setFileSrc },
  } = useFiles();
  const history = useHistory();
  const googleApis = useGoogleApis();
  const { slug } = useGetSlug();

  const clearApprovingState = useSelector((state) => state.posts.clearApprovingState);
  const sharedWs = useSelector((state) => state.workspaces.sharedWorkspaces);

  const [showInput, setShowInput] = useState(null);
  const [userMention, setUserMention] = useState(null);
  const [showGifPlayer, setShowGifPlayer] = useState(null);
  const [approving, setApproving] = useState({ approve: false, change: false });
  const uid = userId ? userId : user.id;
  let sharedPost = post.slug && slug !== post.slug && sharedWs[post.slug];

  const handleShowInput = (commentId = null) => {
    if (parentShowInput) {
      parentShowInput(commentId);
    } else {
      setShowInput(typeof commentId !== "number" ? comment.id : commentId);
    }
    inputFocus();
  };

  const handleMentionUser = () => {
    setUserMention(`<p class="mention-data"><span class="mention" data-index="0" data-denotation-char="@" data-id="${comment.author.id}" data-value="${comment.author.name}">
        <span contenteditable="false"><span class="ql-mention-denotation-char">@</span>${comment.author.name}</span></span></p> `);
    setShowInput(true);
  };

  const handleClearUserMention = () => {
    setUserMention(null);
  };

  const handleQuote = () => {
    if (parentShowInput) {
      parentShowInput(comment.id);
    } else {
      setShowInput(comment.id);
      inputFocus();
    }
    commentActions.addQuote(comment);
  };

  const inputFocus = () => {
    if (showInput !== null && refs.input.current !== null) {
      refs.input.current.querySelector(".ql-editor").scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "start",
      });
      refs.input.current.querySelector(".ql-editor").focus();
    }
  };

  const handleReaction = () => {
    if (disableOptions) return;
    let payload = {
      id: comment.id,
      reaction: "clap",
      counter: comment.user_clap_count === 0 ? 1 : 0,
      post_id: post.id,
      parent_id: type === "main" ? null : parentId,
      post_code: sharedPost ? post.code : null,
      user_id: user.id,
    };
    if (sharedPost) {
      const sharedPayload = { slug: post.slug, token: sharedWs[post.slug].access_token, is_shared: true };
      payload = {
        ...payload,
        sharedPayload: sharedPayload,
        user_id: sharedWs[post.slug].user_auth.id,
      };
    }
    commentActions.clap(payload, (err, res) => {
      if (err) {
        if (payload.counter === 1) commentActions.unlike(payload);
        else commentActions.like(payload);
      }
    });
    if (comment.user_clap_count === 0) {
      commentActions.like(payload);
    } else {
      commentActions.unlike(payload);
    }
  };

  const { fromNow } = useTimeFormat();

  const handleInlineImageClick = (e) => {
    let id = null;
    if (e.target.dataset.id) id = e.target.dataset.id;

    if (id) {
      dispatch(
        setViewFiles({
          file_id: parseInt(id),
          files: comment.files,
        })
      );
    }
  };

  useEffect(() => {
    if (refs.content.current) {
      const googleLinks = refs.content.current.querySelectorAll('[data-google-link-retrieve="0"]');
      googleLinks.forEach((gl) => {
        googleApis.init(gl);
      });
      const images = refs.content.current.querySelectorAll("img");
      images.forEach((img) => {
        const imgSrc = img.getAttribute("src");
        if (!img.classList.contains("has-listener")) {
          img.addEventListener("click", handleInlineImageClick, false);
          img.classList.add("has-listener");
          const imgFile = comment.files.find((f) => imgSrc.includes(f.code));
          let key = null;
          if (imgFile) {
            key = `${imgFile.id}-${slug}`;
            if (sharedPost) {
              key = `${imgFile.id}-${post.slug}`;
            }
          }

          if (imgFile && fileBlobs[key]) {
            img.setAttribute("src", fileBlobs[key]);
            img.setAttribute("data-id", imgFile.id);
          }
        } else {
          const imgFile = comment.files.find((f) => imgSrc.includes(f.code));
          let key = null;
          if (imgFile) {
            key = `${imgFile.id}-${slug}`;
            if (sharedPost) {
              key = `${imgFile.id}-${post.slug}`;
            }
          }

          if (imgFile && fileBlobs[key]) {
            img.setAttribute("src", fileBlobs[key]);
            img.setAttribute("data-id", imgFile.id);
          }
        }
      });
    }
    const imageFiles = comment.files.filter((f) => f.type.toLowerCase().includes("image"));

    if (imageFiles.length) {
      imageFiles.forEach((file) => {
        let key = `${file.id}-${slug}`;
        if (sharedPost) {
          key = `${file.id}-${post.slug}`;
        }
        if (!fileBlobs[key] && comment.body.includes(file.code)) {
          //setIsLoaded(false);
          sessionService.loadSession().then((current) => {
            let myToken = current.token;
            fetch(file.view_link, {
              method: "GET",
              keepalive: true,
              headers: {
                Authorization: myToken,
                "Access-Control-Allow-Origin": "*",
                Connection: "keep-alive",
                crossorigin: true,
              },
            })
              .then(function (response) {
                return response.blob();
              })
              .then(function (data) {
                const imgObj = URL.createObjectURL(data);
                setFileSrc({
                  id: file.id,
                  src: imgObj,
                  key: key,
                });
                commentActions.updateCommentImages({
                  post_id: post.id,
                  id: comment.id,
                  parent_id: type === "main" ? null : parentId,
                  file: {
                    ...file,
                    blobUrl: imgObj,
                  },
                  post_code: workspace && workspace.sharedSlug ? post.code : null,
                });
              })
              .catch((error) => {
                console.log(error, "error fetching image");
              });
          });
        }
      });
    }
  }, [comment.body, refs.content, comment.files]);

  useEffect(() => {
    inputFocus();
  }, [inputFocus]);

  useEffect(() => {
    if (typeof history.location.state === "object") {
      if (history.location.state && history.location.state.focusOnMessage === comment.id && refs.body.current) {
        refs.body.current.scrollIntoView();
        refs.main.current.classList.add("bounceIn");
        history.push(history.location.pathname, null);
      }
    }
  }, [history.location.state]);

  useEffect(() => {
    if (comment.body.match(/\.(gif)/g) !== null) {
      setShowGifPlayer(true);
    }
    return () => {
      history.push(history.location.pathname, null);
    };
  }, []);

  // const handleApprove = () => {
  //   setApproving({
  //     ...approving,
  //     approve: true,
  //   });
  //   if (!approving.approve) {
  //     commentActions.approve(
  //       {
  //         post_id: post.id,
  //         approved: 1,
  //         comment_id: comment.id,
  //       },
  //       () => {
  //         setApproving({
  //           ...approving,
  //           approve: false,
  //         });
  //       }
  //     );
  //   }
  // };

  const handleRequestChange = () => {
    if (comment.users_approval.length > 1) {
      setApproving({
        ...approving,
        change: true,
      });
      if (!approving.approve) {
        commentActions.approve(
          {
            post_id: post.id,
            approved: 0,
            comment_id: comment.id,
          },
          (err, res) => {
            setApproving({
              ...approving,
              change: false,
            });
            if (err) return;
            const isLastUserToAnswer = comment.users_approval.filter((u) => u.ip_address === null).length === 1;
            const allUsersDisagreed = comment.users_approval.filter((u) => u.ip_address !== null && !u.is_approved).length === comment.users_approval.length - 1;
            if (isLastUserToAnswer && allUsersDisagreed) {
              postActions.generateSystemMessage(
                post,
                [],
                comment.users_approval.map((ua) => ua.id)
              );
            }
          }
        );
      }
    } else {
      handleShowInput(comment.id);
      setApproving({
        ...approving,
        change: true,
      });
      commentActions.setRequestForChangeComment(comment);
    }
  };

  const handleCancelChange = () => {
    setShowInput(null);
    setApproving({
      ...approving,
      change: false,
    });
  };

  const handleApprove = () => {
    setApproving({
      ...approving,
      approve: true,
    });
    postActions.showModal("confirmation", post, comment, rewardRef, () => {
      setApproving({
        ...approving,
        approve: false,
      });
    });
  };

  useEffect(() => {
    if (clearApprovingState && clearApprovingState === comment.id) {
      setApproving({
        ...approving,
        change: false,
      });
      commentActions.clearApprovingStatus(null);
    }
  }, [clearApprovingState]);

  const filesWithoutInline = comment.files.filter((f) => !comment.body.includes(f.code));

  return (
    <>
      <Wrapper ref={refs.main} isImportant={comment.is_important} className={`comment card border fadeBottom ${className} animated ${comment.is_important && "important"}`} userId={uid}>
        {comment.todo_reminder !== null && <ReminderNote todoReminder={comment.todo_reminder} type="POST_COMMENT" />}
        {comment.quote && <Quote quote={comment.quote} dictionary={dictionary} />}
        <CommentWrapper ref={refs.body} className="card-body" type={type}>
          <CommentHeader className="d-flex">
            <div className="d-flex justify-content-center align-items-center">
              <Avatar className="mr-2" id={comment.author.id} name={comment.author.name} imageLink={comment.author.profile_image_link} showSlider={true} sharedUser={sharedPost ? comment.author : null} />
              <span>{comment.author.first_name}</span>
              {comment.is_from_email ? (
                <>
                  <span className="text-muted mx-1">{dictionary.repliedViaEmail}</span>
                  <SvgIconFeather height={16} width={16} icon="mail" />
                  <span className="text-muted ml-1">{fromNow(comment.created_at.timestamp)}</span>
                </>
              ) : (
                <span className="text-muted ml-1">{fromNow(comment.created_at.timestamp)}</span>
              )}
              {post.last_visited_at && comment.updated_at.timestamp > post.last_visited_at.timestamp && uid !== comment.author.id && <div className="ml-2 badge badge-secondary text-white text-9">{dictionary.new}</div>}
            </div>
            {!post.is_read_only && !disableOptions && (
              <MoreOptions scrollRef={refs.body.current} moreButton={"more-horizontal"}>
                {comment.todo_reminder === null && <div onClick={() => commentActions.remind(comment, post)}>{dictionary.remindMeAboutThis}</div>}
                {uid === comment.author.id && <div onClick={() => commentActions.setToEdit(comment)}>{dictionary.editReply}</div>}
                <div onClick={handleQuote}>{dictionary.quote}</div>
                {uid !== comment.author.id && <div onClick={handleMentionUser}>{dictionary.mentionUser}</div>}
                {uid === comment.author.id && <div onClick={() => commentActions.remove(comment, post)}>{dictionary.removeReply}</div>}
                {uid === comment.author.id && <div onClick={() => commentActions.important(comment, post)}>{comment.is_important ? dictionary.unMarkImportant : dictionary.markImportant}</div>}
              </MoreOptions>
            )}
          </CommentHeader>
          {!comment.shared_with_client && post.shared_with_client && (
            <span>
              <i>{dictionary.internalComment}</i>
            </span>
          )}
          {comment.files.length > 0 && <PostVideos files={comment.files} />}
          <CommentBody ref={refs.content} className="mt-2 mb-3 ql-editor" dangerouslySetInnerHTML={{ __html: comment.body.startsWith("COMMENT_APPROVAL::") ? "<span></span>" : quillHelper.parseEmoji(comment.body) }} />
          {comment.users_approval.length > 0 && !approving.change && (
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
                <PostChangeAccept
                  approving={approving}
                  fromNow={fromNow}
                  usersApproval={comment.users_approval}
                  user={user}
                  userId={userId}
                  handleApprove={handleApprove}
                  handleRequestChange={handleRequestChange}
                  post={post}
                  isMultipleApprovers={comment.users_approval.length > 1}
                  isBotMessage={comment.body.startsWith("COMMENT_APPROVAL::")}
                />
              </Reward>
            </Suspense>
          )}
          {filesWithoutInline.length >= 1 && (
            <>
              <hr />
              <h6>{dictionary.files}</h6>
              <FileAttachments attachedFiles={filesWithoutInline} type="comment" comment={comment} />
            </>
          )}
          {comment.files_trashed && comment.files_trashed.length >= 1 && (
            <>
              <CommentFilesTrashedContainer>
                <h6 className="font-size-11 text-uppercase">{dictionary.files}</h6>
                <span className="text-muted">{dictionary.filesAutomaticallyRemoved}</span>
                <FileAttachments attachedFiles={comment.files_trashed} type="comment" comment={comment} />
              </CommentFilesTrashedContainer>
            </>
          )}
          <CommentCounters comment={comment} dictionary={dictionary} disableOptions={disableOptions} post={post} handleReaction={handleReaction} handleShowInput={handleShowInput} />
        </CommentWrapper>
      </Wrapper>
      {type === "main" && Object.values(comment.replies).length > 0 && (
        <SubComments
          parentShowInput={handleShowInput}
          comments={comment.replies}
          post={post}
          user={user}
          commentActions={commentActions}
          parentId={type === "main" ? comment.id : null}
          onShowFileDialog={onShowFileDialog}
          dropAction={dropAction}
          workspace={workspace}
          isMember={isMember}
          dictionary={dictionary}
          disableOptions={disableOptions}
          isCompanyPost={isCompanyPost}
          postActions={postActions}
          userId={userId}
        />
      )}
      {showInput !== null && (
        <InputWrapper className="card">
          {isCompanyPost ? (
            <CompanyCommentInput
              innerRef={refs.input}
              user={user}
              commentId={showInput}
              post={post}
              parentId={type === "main" ? comment.id : parentId}
              commentActions={commentActions}
              userMention={userMention}
              handleClearUserMention={handleClearUserMention}
              onShowFileDialog={onShowFileDialog}
              dropAction={dropAction}
              workspace={workspace}
              isMember={isMember}
              disableOptions={disableOptions}
              handleCancelChange={handleCancelChange}
              mainInput={false}
            />
          ) : (
            <CommentInput
              innerRef={refs.input}
              user={user}
              commentId={showInput}
              post={post}
              parentId={type === "main" ? comment.id : parentId}
              commentActions={commentActions}
              userMention={userMention}
              handleClearUserMention={handleClearUserMention}
              onShowFileDialog={onShowFileDialog}
              dropAction={dropAction}
              workspace={workspace}
              isMember={isMember}
              disableOptions={disableOptions}
              handleCancelChange={handleCancelChange}
              mainInput={false}
            />
          )}
        </InputWrapper>
      )}
    </>
  );
};

export default React.memo(Comment);
