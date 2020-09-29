import React, {useCallback, useEffect, useRef, useState} from "react";
import styled from "styled-components";
import {useHistory} from "react-router-dom";
import {Avatar, FileAttachments, ReminderNote, SvgIconFeather} from "../../../common";
import {MoreOptions} from "../../../panels/common";
import {PostDetailFooter} from "../../../panels/post/index";
import {SubComments} from "./index";
import {useGoogleApis, useTimeFormat} from "../../../hooks";
import GifPlayer from "react-gif-player";
import {getGifLinks} from "../../../../helpers/urlContentHelper";
import quillHelper from "../../../../helpers/quillHelper";

const Wrapper = styled.li`
  margin-bottom: 1rem;

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
    border-radius: 6px;
    margin: 0 auto 0.5rem;
    width: 95%;
    position: relative;
    padding: 1rem;

    &.border-side {
      border-left: 5px solid #822492;
    }

    > * {
      margin-bottom: 0;
    }
  }

  .quote-author {
    margin-top: 2rem;
    font-style: italic;
    margin-left: 2.5%;
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
    svg {
      width: 1rem;
      height: 1rem;
    }
  }
`;
const CommentBody = styled.div``;

const CommentInput = styled(PostDetailFooter)``;

const Reply = styled.span`
  cursor: pointer;
`;

const Icon = styled(SvgIconFeather)`
  width: 16px;
`;

const Comment = (props) => {
  const { className = "", comment, post, type = "main", user, commentActions, parentId, onShowFileDialog, dropAction, parentShowInput = null, workspace, isMember, dictionary, disableOptions } = props;

  const refs = {
    input: useRef(null),
    body: useRef(null),
    main: useRef(null),
  };

  const history = useHistory();
  const googleApis = useGoogleApis();

  const [showInput, setShowInput] = useState(null);
  const [userMention, setUserMention] = useState(null);
  const [showGifPlayer, setShowGifPlayer] = useState(null);
  const [react, setReact] = useState({
    user_clap_count: comment.user_clap_count,
    clap_count: comment.clap_count,
  });

  const handleShowInput = useCallback(
    (commentId = null) => {
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

    setReact((prevState) => ({
      user_clap_count: !!prevState.user_clap_count ? 0 : 1,
      clap_count: !!prevState.user_clap_count ? prevState.clap_count - 1 : prevState.clap_count + 1,
    }));

    let payload = {
      id: comment.id,
      reaction: "clap",
      counter: comment.user_clap_count === 0 ? 1 : 0,
    };
    commentActions.clap(payload);
  };

  const { fromNow } = useTimeFormat();

  const handleCommentBodyRef = (e) => {
    if (e) {
      const googleLinks = e.querySelectorAll(`[data-google-link-retrieve="0"]`);
      googleLinks.forEach((gl) => {
        let e = gl;
        e.dataset.googleLinkRetrieve = 1;
        googleApis.getFile(e, e.dataset.googleFileId);
      });
    }
  };

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

  return (
    <>
      <Wrapper ref={refs.main} className={`comment card border fadeBottom ${className} animated`} userId={user.id}>
        {
          comment.todo_reminder !== null &&
          <ReminderNote todoReminder={comment.todo_reminder} type="POST_COMMENT"/>
        }
        {comment.quote && (
          <>
            {comment.quote.user && <div className="quote-author">{comment.quote.user.name}</div>}
            <div className="quote border border-side" dangerouslySetInnerHTML={{__html: comment.quote.body}}/>
          </>
        )}
        <CommentWrapper ref={refs.body} className="card-body" type={type}>
          <CommentHeader className="d-flex">
            <div className="d-flex justify-content-center align-items-center">
              <Avatar className="mr-2" id={comment.author.id} name={comment.author.name}
                      imageLink={comment.author.profile_image_link}/>
              <span>{comment.author.first_name}</span>
              <span className="text-muted ml-1">{fromNow(comment.created_at.timestamp)}</span>
            </div>
            {post.is_read_only !== 1 && !disableOptions && (
              <MoreOptions scrollRef={refs.body.current} moreButton={"more-horizontal"}>
                <div onClick={() => commentActions.remind(comment, post)}>{dictionary.remindMeAboutThis}</div>
                {user.id === comment.author.id && <div onClick={() => commentActions.setToEdit(comment)}>{dictionary.editReply}</div>}
                <div onClick={handleQuote}>{dictionary.quote}</div>
                {user.id !== comment.author.id && <div onClick={handleMentionUser}>{dictionary.mentionUser}</div>}
                {user.id === comment.author.id && <div onClick={() => commentActions.remove(comment)}>{dictionary.removeReply}</div>}
              </MoreOptions>
            )}
          </CommentHeader>
          <CommentBody ref={handleCommentBodyRef} className="mt-2 mb-3" dangerouslySetInnerHTML={{ __html: quillHelper.parseEmoji(comment.body) }} />
          {showGifPlayer &&
            getGifLinks(comment.body).map((gifLink, index) => {
              return <GifPlayer key={index} className={"gifPlayer"} gif={gifLink} autoplay={true} />;
            })}
          {comment.files.length >= 1 && (
            <>
              <hr />
              <h6>{dictionary.files}</h6>
              <FileAttachments attachedFiles={comment.files} type="workspace" comment={comment} />
            </>
          )}
          <div className="d-flex align-items-center justify-content-start">
            <Icon className={react.user_clap_count ? "mr-2 comment-reaction clap-true" : "mr-2 comment-reaction clap-false"} icon="heart" onClick={handleReaction} />
            {react.clap_count > 0 ? react.clap_count : null}
            {post.is_read_only !== 1 && !disableOptions && (
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
        />
      )}
      {showInput !== null && (
        <InputWrapper className="card">
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
        </InputWrapper>
      )}
    </>
  );
};

export default React.memo(Comment);
