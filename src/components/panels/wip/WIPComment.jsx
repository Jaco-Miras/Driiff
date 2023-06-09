import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { Avatar, FileAttachments, ReminderNote } from "../../common";
import { PostVideos } from "../post";
import { Quote } from "../../list/post/item";
import { useTimeFormat, useFiles, useWIPCommentActions } from "../../hooks";
import quillHelper from "../../../helpers/quillHelper";
import { useDispatch, useSelector } from "react-redux";
import { setViewFiles } from "../../../redux/actions/fileActions";
import { sessionService } from "redux-react-session";
import WIPDetailFooter from "./WIPDetailFooter";
import WIPCommentCounters from "./WIPCommentCounters";
import WIPSubComments from "./WIPSubComments";
import WIPCommentOptions from "./WIPCommentOptions";

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
    color: #7a1b8b;
    fill: #7a1b8b;
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

const WIPComment = (props) => {
  const { className = "", comment, wip, type = "main", parentId, onShowFileDialog, dropAction, parentShowInput = null, workspace, isMember, dictionary, disableOptions } = props;

  const dispatch = useDispatch();
  const history = useHistory();

  const refs = {
    input: useRef(null),
    body: useRef(null),
    main: useRef(null),
    content: useRef(null),
  };

  const commentActions = useWIPCommentActions();
  const {
    fileBlobs,
    actions: { setFileSrc },
  } = useFiles();

  const user = useSelector((state) => state.session.user);

  const [showInput, setShowInput] = useState(null);
  const [userMention, setUserMention] = useState(null);
  //const [showGifPlayer, setShowGifPlayer] = useState(null);

  const handleShowInput = (commentId = null) => {
    if (parentShowInput) {
      parentShowInput(commentId);
    } else {
      setShowInput(typeof commentId !== "number" ? comment.id : commentId);
    }
    inputFocus();
  };

  const handleMention = () => {
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
      const images = refs.content.current.querySelectorAll("img");
      images.forEach((img) => {
        const imgSrc = img.getAttribute("src");
        if (!img.classList.contains("has-listener")) {
          img.addEventListener("click", handleInlineImageClick, false);
          img.classList.add("has-listener");
          const imgFile = comment.files.find((f) => imgSrc.includes(f.code));
          if (imgFile && fileBlobs[imgFile.id]) {
            img.setAttribute("src", fileBlobs[imgFile.id]);
            img.setAttribute("data-id", imgFile.id);
          }
        } else {
          const imgFile = comment.files.find((f) => imgSrc.includes(f.code));
          if (imgFile && fileBlobs[imgFile.id]) {
            img.setAttribute("src", fileBlobs[imgFile.id]);
            img.setAttribute("data-id", imgFile.id);
          }
        }
      });
    }
    const imageFiles = comment.files.filter((f) => f.type.toLowerCase().includes("image"));

    if (imageFiles.length) {
      imageFiles.forEach((file) => {
        if (!fileBlobs[file.id] && comment.body.includes(file.code)) {
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
                });
                // commentActions.updateCommentImages({
                //   post_id: post.id,
                //   id: comment.id,
                //   parent_id: type === "main" ? null : parentId,
                //   file: {
                //     ...file,
                //     blobUrl: imgObj,
                //   },
                // });
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
    // if (comment.body.match(/\.(gif)/g) !== null) {
    //   setShowGifPlayer(true);
    // }
    return () => {
      history.push(history.location.pathname, null);
    };
  }, []);

  const filesWithoutInline = comment.files.filter((f) => !comment.body.includes(f.code));

  return (
    <>
      <Wrapper ref={refs.main} isImportant={comment.is_important} className={`comment card border fadeBottom ${className} animated ${comment.is_important && "important"}`} userId={user.id}>
        {comment.todo_reminder !== null && <ReminderNote todoReminder={comment.todo_reminder} type="POST_COMMENT" />}
        {comment.quote && <Quote quote={comment.quote} dictionary={dictionary} />}
        <CommentWrapper ref={refs.body} className="card-body" type={type}>
          <CommentHeader className="d-flex">
            <div className="d-flex justify-content-center align-items-center">
              <Avatar
                className="mr-2"
                id={comment.author.id}
                name={comment.author.name}
                imageLink={comment.author.profile_image_thumbnail_link ? comment.author.profile_image_thumbnail_link : comment.author.profile_image_link}
                showSlider={true}
              />
              <span>{comment.author.first_name}</span>
              <span className="text-muted ml-1">{fromNow(comment.created_at.timestamp)}</span>
              {wip.last_visited_at && comment.updated_at.timestamp > wip.last_visited_at.timestamp && user.id !== comment.author.id && <div className="ml-2 badge badge-secondary text-white text-9">{dictionary.new}</div>}
            </div>
            {!disableOptions && <WIPCommentOptions commentActions={commentActions} onMentionUser={handleMention} onQuote={handleQuote} dictionary={dictionary} scrollRef={refs.body.current} comment={comment} user={user} />}
          </CommentHeader>
          {comment.files.length > 0 && <PostVideos files={comment.files} />}
          <CommentBody ref={refs.content} className="mt-2 mb-3 ql-editor" dangerouslySetInnerHTML={{ __html: quillHelper.parseEmoji(comment.body) }} />
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
          <WIPCommentCounters comment={comment} dictionary={dictionary} disableOptions={disableOptions} wip={wip} handleShowInput={handleShowInput} />
        </CommentWrapper>
      </Wrapper>

      {type === "main" && Object.values(comment.replies).length > 0 && (
        <WIPSubComments
          parentShowInput={handleShowInput}
          comments={comment.replies}
          wip={wip}
          user={user}
          commentActions={commentActions}
          parentId={type === "main" ? comment.id : parentId}
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
          <WIPDetailFooter wip={wip} parentId={type === "main" ? comment.id : parentId} onShowFileDialog={onShowFileDialog} commentId={showInput} userMention={userMention} handleClearUserMention={handleClearUserMention} />
        </InputWrapper>
      )}
    </>
  );
};

export default React.memo(WIPComment);
