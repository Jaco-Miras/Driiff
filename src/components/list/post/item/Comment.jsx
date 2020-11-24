import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { Avatar, FileAttachments, ReminderNote, SvgIconFeather } from "../../../common";
import { MoreOptions } from "../../../panels/common";
import { PostDetailFooter } from "../../../panels/post/index";
import { Quote, SubComments } from "./index";
import { useGoogleApis, useTimeFormat } from "../../../hooks";
import quillHelper from "../../../../helpers/quillHelper";
import { CompanyPostDetailFooter } from "../../../panels/post/company";
import { useDispatch, useSelector } from "react-redux";
import { setViewFiles } from "../../../../redux/actions/fileActions";

const Wrapper = styled.li`
  margin-bottom: 1rem;
  overflow: initial;

  .mention {
    font-weight: bold;
    color: #7a1b8b;
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
    border-left: 4px solid #972c86;

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
    left: 22px;
    z-index: 1;
    bottom: 0;
    border-radius: 8px;
    opacity: 0;
    max-height: 0;
    transition: all 0.5s ease;
    overflow-y: auto;
    background: #fff;
    border: 1px solid #fff;
    box-shadow: 0 5px 10px -1px rgba(0,0,0,0.15);
  
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
  .comment-reaction {
    cursor: pointer;
  }
  .clap-true {
    color: #f44;
    fill: #f44;
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
  img {
    max-width: 50%;
    @media (max-width: 991.99px) {
      max-width: 100%;
    }
  }
`;

const CommentInput = styled(PostDetailFooter)``;

const CompanyCommentInput = styled(CompanyPostDetailFooter)``;

const Reply = styled.span`
  cursor: pointer;
`;

const Icon = styled(SvgIconFeather)`
  width: 16px;
`;

const Comment = (props) => {
  const { className = "", comment, post, type = "main", user, commentActions, parentId, onShowFileDialog, dropAction, parentShowInput = null, workspace, isMember, dictionary, disableOptions, isCompanyPost = false } = props;

  const dispatch = useDispatch();

  const refs = {
    input: useRef(null),
    body: useRef(null),
    main: useRef(null),
    content: useRef(null)
  };

  const history = useHistory();
  const googleApis = useGoogleApis();

  const users = useSelector((state) => state.users.users);
  //const recipients = useSelector((state) => state.global.recipients.filter((r) => r.type === "USER"));

  const [showInput, setShowInput] = useState(null);
  const [userMention, setUserMention] = useState(null);
  const [showGifPlayer, setShowGifPlayer] = useState(null);
  // const [react, setReact] = useState({
  //   user_clap_count: comment.user_clap_count,
  //   clap_count: comment.clap_count,
  // });

  // const [usersReacted, setUsersReacted] = useState(recipients.filter(r => comment.clap_user_ids.includes(r.type_id)));

  const likers =  Object.values(users).filter((u) => comment.clap_user_ids.some((id) => id === u.id))

  const handleShowInput = useCallback(
    (commentId = null) => {
      console.log(commentId);
      if (parentShowInput) {
        parentShowInput(commentId);
      } else {
        setShowInput(typeof commentId !== "number" ? comment.id : commentId);
      }
      inputFocus();
    },
    [setShowInput]
  );

  const handleMentionUser = () => {
    setUserMention(`<p class="mention-data"><span class="mention" data-index="0" data-denotation-char="@" data-id="${comment.author.id}" data-value="${comment.author.name}">
        <span contenteditable="false"><span class="ql-mention-denotation-char">@</span>${comment.author.name}</span></span></p> `);
    setShowInput(true);
  };

  const handleClearUserMention = useCallback(() => {
    setUserMention(null);
  }, []);

  const handleQuote = () => {
    if (parentShowInput) {
      parentShowInput(comment.id);
    } else {
      setShowInput(comment.id);
      inputFocus();
    }
    commentActions.addQuote(comment);
  };

  const inputFocus = useCallback(() => {
    if (showInput !== null && refs.input.current !== null) {
      refs.input.current.querySelector(".ql-editor").scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "start",
      });
      refs.input.current.querySelector(".ql-editor").focus();
    }
  }, [showInput, refs.input.current]);

  const handleReaction = () => {
    if (disableOptions) return;

    // setReact((prevState) => ({
    //   user_clap_count: !!prevState.user_clap_count ? 0 : 1,
    //   clap_count: !!prevState.user_clap_count ? prevState.clap_count - 1 : prevState.clap_count + 1,
    // }));

    // setUsersReacted(prevState => prevState.some(r => r.type_id === user.id) ?
    //   prevState.filter(r => r.type_id !== user.id) :
    //   prevState.concat(recipients.find(r => r.type_id === user.id)));

    let payload = {
      id: comment.id,
      reaction: "clap",
      counter: comment.user_clap_count === 0 ? 1 : 0,
      post_id: post.id,
      parent_id: type === "main" ? null : parentId
    };
    commentActions.clap(payload, (err, res) => {
      if (err) {
        if (payload.counter === 1) commentActions.unlike(payload)
        else commentActions.like(payload)
      }
    });
    if (comment.user_clap_count === 0) {
      commentActions.like(payload)
    } else {
      commentActions.unlike(payload)
    }
  };

  const { fromNow } = useTimeFormat();

  const handleInlineImageClick = (e) => {
    let file = comment.files.find((f) => f.thumbnail_link === e.srcElement.currentSrc)
    if (file) {
      dispatch(
        setViewFiles({
          file_id: file.id,
          files: comment.files,
        })
      )
    }
  }

  useEffect(() => {
    if (refs.content.current) {
      const googleLinks = refs.content.current.querySelectorAll(`[data-google-link-retrieve="0"]`);
      googleLinks.forEach((gl) => {
        googleApis.init(gl);
      });
      const images = refs.content.current.querySelectorAll("img");
      images.forEach((img) => {
        if (!img.classList.contains("has-listener")) {
          img.addEventListener("click", handleInlineImageClick, false);
          img.classList.add("has-listener");
        }
      })
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
    if (typeof comment.fetchedReact === "undefined") commentActions.fetchPostReplyHover(comment.id);
    // commentActions.fetchPostReplyHover(comment.id, (err, res) => {
    //   const clap_user_ids = res.data.claps.map(c => c.user_id);
    //   setUsersReacted(recipients.filter(r => clap_user_ids.includes(r.type_id)));
    // });

    return () => {
      history.push(history.location.pathname, null);
    };
  }, []);

  // useEffect(() => {
  //   setUsersReacted(recipients.filter(r => comment.clap_user_ids.includes(r.type_id)));
  // }, [comment.clap_user_ids]);

  return (
    <>
      <Wrapper ref={refs.main} className={`comment card border fadeBottom ${className} animated`} userId={user.id}>
        {comment.todo_reminder !== null && <ReminderNote todoReminder={comment.todo_reminder} type="POST_COMMENT"/>}
        {comment.quote && <Quote quote={comment.quote} dictionary={dictionary}/>}
        <CommentWrapper ref={refs.body} className="card-body" type={type}>
          <CommentHeader className="d-flex">
            <div className="d-flex justify-content-center align-items-center">
              <Avatar className="mr-2" id={comment.author.id} name={comment.author.name}
                      imageLink={comment.author.profile_image_thumbnail_link ? comment.author.profile_image_thumbnail_link : comment.author.profile_image_link}/>
              <span>{comment.author.first_name}</span>
              <span className="text-muted ml-1">{fromNow(comment.created_at.timestamp)}</span>
            </div>
            {!post.is_read_only && !disableOptions && (
              <MoreOptions scrollRef={refs.body.current} moreButton={"more-horizontal"}>
                {comment.todo_reminder === null &&
                <div onClick={() => commentActions.remind(comment, post)}>{dictionary.remindMeAboutThis}</div>}
                {user.id === comment.author.id &&
                <div onClick={() => commentActions.setToEdit(comment)}>{dictionary.editReply}</div>}
                <div onClick={handleQuote}>{dictionary.quote}</div>
                {user.id !== comment.author.id && <div onClick={handleMentionUser}>{dictionary.mentionUser}</div>}
                {user.id === comment.author.id &&
                <div onClick={() => commentActions.remove(comment)}>{dictionary.removeReply}</div>}
              </MoreOptions>
            )}
          </CommentHeader>
          <CommentBody ref={refs.content} className="mt-2 mb-3" dangerouslySetInnerHTML={{ __html: quillHelper.parseEmoji(comment.body) }} />
          {comment.files.length >= 1 && (
            <>
              <hr />
              <h6>{dictionary.files}</h6>
              <FileAttachments attachedFiles={comment.files} type="workspace" comment={comment} />
            </>
          )}
          <div className="d-flex align-items-center justify-content-start">
            <div className="clap-count-wrapper">
              <Icon
                className={comment.user_clap_count ? "mr-2 comment-reaction clap-true" : "mr-2 comment-reaction clap-false"}
                icon="thumbs-up" onClick={handleReaction}/>
              {comment.clap_count}
              {
                likers.length !== 0 && <span className="hover read-users-container">
              {
                likers.map(u => {
                  return <span key={u.id}>
                    <Avatar className="mr-2" key={u.id} name={u.name}
                            imageLink={u.profile_image_thumbnail_link ? u.profile_image_thumbnail_link : u.profile_image_link}
                            id={u.id}/> <span className="name">{u.name}</span>
                  </span>;
                })
              }
            </span>
              }
            </div>
            {!post.is_read_only && !disableOptions && (
              <Reply className="ml-3" onClick={handleShowInput}>
                {dictionary.comment}
              </Reply>
            )}
          </div>
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
        />
      )}
      {showInput !== null && (
        <InputWrapper className="card">
          {
            isCompanyPost ? 
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
            />
            :
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
            />
          }
        </InputWrapper>
      )}
    </>
  );
};

export default React.memo(Comment);
