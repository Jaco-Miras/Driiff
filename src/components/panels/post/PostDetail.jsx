import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { addToModals } from "../../../redux/actions/globalActions";
import { setParentIdForUpload } from "../../../redux/actions/postActions";
import { FileAttachments, ReminderNote, SvgIconFeather, ToolTip } from "../../common";
import { DropDocument } from "../../dropzone/DropDocument";
import { useCommentActions, useComments } from "../../hooks";
import { PostBody, PostComments, PostDetailFooter } from "./index";
import { replaceChar } from "../../../helpers/stringFormatter";
import { MoreOptions } from "../../panels/common";

const MainHeader = styled.div`
  min-height: 70px;
  > div {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  ul {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 0;
    padding: 0;
    li {
      list-style: none;
      .post-title {
        width: 100%;
      }
    }
  }

  .close {
    .dark & {
      color: #fff;
    }
  }

  .author-name {
    color: #a7abc3;
    font-size: 14px;
  }
`;

const StyledMoreOptions = styled(MoreOptions)`
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  height: 36px;
  width: 40px;
  align-items: center;
  justify-content: center;
  .feather-more-horizontal {
    width: 25px;
    height: 24px;
  }
  .more-options-tooltip {
    left: auto;
    right: 0;
    top: 25px;
    width: 250px;

    svg {
      width: 14px;
    }
  }
`;

const MainBody = styled.div`
  display: flex;
  flex-grow: 1;
  width: 100%;
  flex-flow: column;
`;

const Counters = styled.div`
  width: 100%;
  padding: 0.5rem 1.5rem;
  .seen-indicator,
  .post-reaction {
    cursor: pointer;
  }
  .clap-true {
    color: #f44;
    fill: #f44;
  }
`;

const PostFiles = styled(FileAttachments)`
  li {
    display: inline-block;

    &:not(:last-child) {
      margin-right: 1rem;
    }

    .feather-paperclip {
      margin-right: 0.5rem;
    }
  }
`;

const Icon = styled(SvgIconFeather)`
  width: 16px;

  &.close {
    cursor: pointer;
  }
`;

const MarkAsRead = styled.div`
  cursor: pointer;
`;

const PostDetail = (props) => {
  const { post, postActions, user, onGoBack, workspace, isMember, dictionary, disableOptions } = props;
  const { markAsRead, markAsUnread, sharePost, followPost, remind } = postActions;
  const dispatch = useDispatch();
  const history = useHistory();

  const [showDropZone, setshowDropZone] = useState(false);
  const [react, setReact] = useState({
    user_clap_count: post.user_clap_count,
    clap_count: post.clap_count,
  });

  const handleClosePost = () => {
    onGoBack();
  };
  const commentActions = useCommentActions();
  const comments = useComments(post, commentActions, workspace);

  const refs = {
    dropZoneRef: useRef(null),
  };

  const handleOpenFileDialog = (parentId) => {
    dispatch(setParentIdForUpload(parentId));
    if (refs.dropZoneRef.current) {
      refs.dropZoneRef.current.open();
    }
  };

  const handleHideDropzone = () => {
    setshowDropZone(false);
  };

  const handleshowDropZone = () => {
    setshowDropZone(true);
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
      mode: "post",
      post: post,
      members: workspace ? workspace.members : [],
    };

    dispatch(addToModals(modal));
  };

  const handleReaction = () => {
    setReact((prevState) => ({
      user_clap_count: !!prevState.user_clap_count ? 0 : 1,
      clap_count: !!prevState.user_clap_count ? prevState.clap_count - 1 : prevState.clap_count + 1,
    }));

    let payload = {
      post_id: post.id,
      id: null,
      clap: post.user_clap_count === 0 ? 1 : 0,
      personalized_for_id: null,
    };
    postActions.clap(payload);
  };

  useEffect(() => {
    const viewed = post.view_user_ids.some((id) => id === user.id);
    if (!viewed) {
      postActions.visit({
        post_id: post.id,
        personalized_for_id: null,
      });
    }
    if (post.is_unread === 1 || post.unread_count > 0 || !post.is_updated) {
      postActions.markAsRead(post);
    }
  }, []);

  const markRead = () => {
    postActions.markReadRequirement(post);
  };

  const handleAuthorClick = () => {
    history.push(`/profile/${post.author.id}/${replaceChar(post.author.name)}`);
  };

  return (
    <>
      {
        post.todo_reminder !== null &&
        <ReminderNote todoReminder={post.todo_reminder} type="POST"/>
      }
      <MainHeader className="card-header d-flex justify-content-between">
        <div>
          <ul>
            <li>
              <Icon className="close mr-2" icon="arrow-left" onClick={handleClosePost}/>
            </li>
            <li>
              <h5 ref={refs.title} className="post-title mb-0">
                <span>{post.title}</span>
              </h5>
              <div className="author-name">
                <ToolTip content={post.author.name}>
                  {dictionary.by}{" "}
                  <span onClick={handleAuthorClick} className="cursor-pointer">
                    {post.author.first_name}
                  </span>
                </ToolTip>
              </div>
            </li>
          </ul>
        </div>
        <div>
          {post.author.id !== user.id && !post.is_read_requirement && (
            <MarkAsRead className="d-sm-inline d-none">
              <button className="btn btn-primary btn-block" onClick={markRead} disabled={disableOptions}>
                {dictionary.markAsRead}
              </button>
            </MarkAsRead>
          )}
          {post.author.id === user.id && !disableOptions && (
            <ul>
              <li>
                <span data-toggle="modal" data-target="#editTaskModal">
                  <a onClick={() => postActions.showModal("edit", post)} className="btn btn-outline-light ml-2" title=""
                     data-toggle="tooltip" data-original-title="Edit Task">
                    <Icon icon="edit-3"/>
                  </a>
                </span>
              </li>
              <li>
                <a onClick={() => postActions.trash(post)} className="btn btn-outline-light ml-2" data-toggle="tooltip"
                   title="" data-original-title="Delete Task">
                  <Icon icon="trash"/>
                </a>
              </li>
              <li>
                <StyledMoreOptions className="ml-2" item={post} width={220} moreButton={"more-horizontal"}>
                  <div onClick={() => remind(post)}>{dictionary.remindMeAboutThis}</div>
                  {
                    post.is_unread === 0 ?
                      <div onClick={() => markAsUnread(post, true)}>{dictionary.markAsUnread}</div> :
                      <div onClick={() => markAsRead(post, true)}>{dictionary.markAsRead}</div>
                  }
                  <div onClick={() => sharePost(post)}>{dictionary.share}</div>
                  {post.author.id !== user.id && <div
                    onClick={() => followPost(post)}>{post.is_followed ? dictionary.unFollow : dictionary.follow}</div>}
                </StyledMoreOptions>
              </li>
            </ul>
          )}
          {post.author.id !== user.id && (
            <div>
              <StyledMoreOptions className="ml-2" item={post} width={170} moreButton={"more-horizontal"}>
                {
                  post.todo_reminder === null &&
                  <div onClick={() => remind(post)}>{dictionary.remindMeAboutThis}</div>
                }
                <div onClick={() => markAsRead(post, true)}>{dictionary.markAsRead}</div>
                <div onClick={() => markAsUnread(post, true)}>{dictionary.markAsUnread}</div>
                <div onClick={() => sharePost(post)}>{dictionary.share}</div>
                {post.author.id !== user.id && <div
                  onClick={() => followPost(post)}>{post.is_followed ? dictionary.unFollow : dictionary.follow}</div>}
              </StyledMoreOptions>
            </div>
          )}
        </div>
      </MainHeader>
      <MainBody onDragOver={handleshowDropZone}>
        <DropDocument
          hide={!showDropZone}
          ref={refs.dropZoneRef}
          onDragLeave={handleHideDropzone}
          onDrop={({acceptedFiles}) => {
            dropAction(acceptedFiles);
          }}
          onCancel={handleHideDropzone}
        />
        <PostBody post={post} postActions={postActions} isAuthor={post.author.id === user.id} dictionary={dictionary}
                  disableOptions={disableOptions}/>
        <hr className="m-0"/>
        <Counters className="d-flex align-items-center">
          <div>
            <Icon className={react.user_clap_count ? "mr-2 post-reaction clap-true" : "mr-2 post-reaction clap-false"}
                  icon="heart" onClick={handleReaction}/>
            {react.clap_count}
          </div>
          <div className="ml-auto text-muted">
            <Icon className="mr-2" icon="message-square"/>
            {post.reply_count}
            <Icon className="ml-2 mr-2 seen-indicator" icon="eye"/>
            {post.view_user_ids.length}
          </div>
        </Counters>
        {post.files.length > 0 && (
          <>
            <div className="card-body">
              <h6 className="mb-3 font-size-11 text-uppercase">{dictionary.files}</h6>
              <PostFiles attachedFiles={post.files} type="workspace" post={post}/>
            </div>
            <hr className="m-0"/>
          </>
        )}
        {comments && Object.keys(comments).length > 0 && (
          <>
            <PostComments
              comments={comments}
              post={post}
              user={user}
              commentActions={commentActions}
              onShowFileDialog={handleOpenFileDialog}
              dropAction={dropAction}
              workspace={workspace}
              isMember={isMember}
              dictionary={dictionary}
              disableOptions={disableOptions}
            />
            <hr className="m-0"/>
          </>
        )}
        <PostDetailFooter post={post} commentActions={commentActions} onShowFileDialog={handleOpenFileDialog}
                          dropAction={dropAction} workspace={workspace} isMember={isMember}
                          disableOptions={disableOptions}/>
      </MainBody>
    </>
  );
};

export default React.memo(PostDetail);
