import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { addToModals } from "../../../../redux/actions/globalActions";
import { setParentIdForUpload } from "../../../../redux/actions/postActions";
import { FileAttachments, ReminderNote, SvgIconFeather } from "../../../common";
import { DropDocument } from "../../../dropzone/DropDocument";
import { useCommentActions, useComments } from "../../../hooks";
import { CompanyPostBody, CompanyPostComments, CompanyPostDetailFooter } from "./index";
import { MoreOptions } from "../../common";
import { PostCounters } from "../../../list/post/item";

const MainHeader = styled.div`
  .feather-eye-off {
    position: relative;
    top: -1px;
    margin-right: 0.25rem;
    width: 12px;
  }
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

  .company-post-detail-header {
    display: flex;
    justify-content: space-between;
    width: 100%;
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

const MainBody = styled.div`
  display: flex;
  flex-grow: 1;
  width: 100%;
  flex-flow: column;

  .receiver {
    border-radius: 6px;
    padding: 3px 5px;
    background-color: rgba(210, 210, 210, 0.2);
    font-size: 11px;
    margin-right: 3px;
    cursor: pointer;
  }

  a {
    color: #7a1b8b;
    text-decoration: underline;

    .dark & {
      color: #7a1b8b !important;
    }
  }

  .clap-count-wrapper {
    position: relative;
    display: flex;
    align-items: center;

    &:hover {
      .not-read-users-container,
      .read-users-container {
        opacity: 1;
        max-height: 300px;
      }
    }

    .not-read-users-container,
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
      border: 1px solid #fff;
      box-shadow: 0 5px 10px -1px rgba(0, 0, 0, 0.15);
      background: #fff;

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

  .user-reads-container {
    position: relative;
    display: inline-flex;
    margin-right: 0.5rem;

    .not-read-users-container,
    .read-users-container {
      transition: all 0.5s ease;
      position: absolute;
      right: 0;
      bottom: 30px;
      border: 1px solid #dee2e6;
      border-radius: 6px;
      background-color: #fff;
      overflow: auto;
      opacity: 0;
      max-height: 0;

      &:hover {
        opacity: 1;
        max-height: 165px;
      }

      .dark & {
        background-color: #25282c;
        border: 1px solid #25282c;
      }

      > span {
        padding: 0.5rem;
        display: flex;
        justify-content: flex-start;
        align-items: center;

        .avatar {
          img {
            min-width: 2.3rem;
          }
        }

        .name {
          width: 100%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          display: block;
        }
      }
    }
  }

  .user-reads-container {
    span.not-readers:hover ~ span.not-read-users-container,
    span.no-readers:hover ~ span.read-users-container {
      opacity: 1;
      max-height: 165px;
    }
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
    top: 28px;
    width: 250px;

    svg {
      width: 14px;
    }
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

const CompanyPostDetail = (props) => {
  const { post, posts, filter, postActions, user, onGoBack, dictionary, readByUsers = [] } = props;
  const { markAsRead, markAsUnread, sharePost, followPost, remind, close } = postActions;

  const dispatch = useDispatch();
  const commentActions = useCommentActions();

  const users = useSelector((state) => state.users.users);
  const [showDropZone, setShowDropZone] = useState(false);

  const { comments } = useComments(post);

  const hasRead = readByUsers.some((u) => u.id === user.id);

  const viewerIds = [...new Set(post.view_user_ids)];

  const viewers = Object.values(users).filter((u) => viewerIds.some((id) => id === u.id));

  const likers = Object.values(users).filter((u) => post.clap_user_ids.some((id) => id === u.id));

  const handleClosePost = () => {
    onGoBack();
  };

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
    setShowDropZone(false);
  };

  const handleshowDropZone = () => {
    setShowDropZone(true);
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
    const hasExternalWorkspace = post.recipients.some((r) => r.type === "TOPIC" && r.is_shared);
    const isExternalUser = user.type === "external";
    const externalWorkspace = post.recipients.find((r) => r.type === "TOPIC" && r.is_shared);
    let modal = {
      type: "file_upload",
      droppedFiles: attachedFiles,
      mode: "post",
      post: post,
      team_channel: !post.shared_with_client && hasExternalWorkspace && !isExternalUser ? externalWorkspace.id : null,
    };

    dispatch(addToModals(modal));
  };

  const markRead = () => {
    postActions.markReadRequirement(post);
  };

  const handleReaction = () => {
    let payload = {
      post_id: post.id,
      id: null,
      clap: post.user_clap_count === 0 ? 1 : 0,
      personalized_for_id: null,
    };
    postActions.clap(payload, (err, res) => {
      if (err) {
        if (payload.clap === 1) postActions.unlike(payload);
        else postActions.like(payload);
      }
    });
    if (post.user_clap_count === 0) {
      postActions.like(payload);
    } else {
      postActions.unlike(payload);
    }
  };

  const isMember = post.users_responsible.some((u) => u.id === user.id);

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

    if (typeof post.fetchedReact === "undefined") postActions.fetchPostClapHover(post.id);

    postActions.getUnreadNotificationEntries({ add_unread_comment: 1 });
    // postActions.getUnreadPostsCount();
  }, []);

  // const privateWsOnly = post.recipients.filter((r) => {
  //   return r.type === "TOPIC" && r.private === 1;
  // });

  //const hasNotReadUsers = post.required_users.filter((u) => !u.must_read);

  return (
    <>
      {post.todo_reminder !== null && <ReminderNote todoReminder={post.todo_reminder} type="POST" />}
      <MainHeader className="card-header d-flex justify-content-between">
        <div className="d-flex flex-column align-items-start">
          <div className="d-flex">
            <div className="align-self-start">
              <Icon className="close mr-2" icon="arrow-left" onClick={handleClosePost} />
            </div>
            <div>
              <h5 ref={refs.title} className="post-title mb-0">
                <span>
                  {post.author.id !== user.id && !post.is_followed && <Icon icon="eye-off" />}
                  {post.title}
                </span>
              </h5>
            </div>
          </div>
          {/* {privateWsOnly.length === post.recipients.length && (
            <div className="ml-4">
              <span>
                {dictionary.messageInSecureWs} <Icon icon="lock" />
              </span>
            </div>
          )} */}
        </div>

        <div>
          {post.author.id === user.id && (
            <ul>
              <li>
                <span data-toggle="modal" data-target="#editTaskModal">
                  <a onClick={() => postActions.showModal("edit_company", post)} className="btn btn-outline-light ml-2" title="" data-toggle="tooltip" data-original-title="Edit Task">
                    <Icon icon="edit-3" />
                  </a>
                </span>
              </li>
              <li>
                <a onClick={() => postActions.trash(post)} className="btn btn-outline-light ml-2" data-toggle="tooltip" title="" data-original-title="Delete Task">
                  <Icon icon="trash" />
                </a>
              </li>
            </ul>
          )}
          <div>
            <StyledMoreOptions className="ml-2" item={post} width={220} moreButton={"more-horizontal"}>
              {post.todo_reminder === null && <div onClick={() => remind(post)}>{dictionary.remindMeAboutThis}</div>}
              {post.is_unread === 0 ? <div onClick={() => markAsUnread(post, true)}>{dictionary.markAsUnread}</div> : <div onClick={() => markAsRead(post, true)}>{dictionary.markAsRead}</div>}
              <div onClick={() => sharePost(post)}>{dictionary.share}</div>
              {post.author.id !== user.id && <div onClick={() => followPost(post)}>{post.is_followed ? dictionary.unFollow : dictionary.follow}</div>}
              {((post.author && post.author.id === user.id) || (post.author.type === "external" && user.type === "internal")) && <div onClick={() => close(post)}>{post.is_close ? dictionary.openThisPost : dictionary.closeThisPost}</div>}
              {/* <div onClick={handleSnooze}>Snooze this post</div> */}
            </StyledMoreOptions>
          </div>
        </div>
      </MainHeader>
      <MainBody onDragOver={handleshowDropZone}>
        <DropDocument
          hide={!showDropZone}
          ref={refs.dropZoneRef}
          onDragLeave={handleHideDropzone}
          onDrop={({ acceptedFiles }) => {
            dropAction(acceptedFiles);
          }}
          onCancel={handleHideDropzone}
        />
        <CompanyPostBody post={post} user={user} postActions={postActions} isAuthor={post.author.id === user.id} dictionary={dictionary} />
        <div className="d-flex justify-content-center align-items-center mb-3">
          {post.author.id !== user.id && post.is_must_read && !hasRead && post && post.required_users && post.required_users.some((u) => u.id === user.id && !u.must_read) && (
            <MarkAsRead className="d-sm-inline d-none">
              <button className="btn btn-primary btn-block" onClick={markRead}>
                {dictionary.markAsRead}
              </button>
            </MarkAsRead>
          )}
        </div>
        <hr className="m-0" />
        <PostCounters dictionary={dictionary} hasRead={hasRead} likers={likers} post={post} readByUsers={readByUsers} viewerIds={viewerIds} viewers={viewers} handleReaction={handleReaction} />
        {post.files.length > 0 && (
          <>
            <div className="card-body">
              <h6 className="mb-3 font-size-11 text-uppercase">{dictionary.files}</h6>
              <PostFiles attachedFiles={post.files} type="company" post={post} />
            </div>
            <hr className="m-0" />
          </>
        )}
        {comments && Object.keys(comments).length > 0 && (
          <>
            <CompanyPostComments comments={comments} post={post} user={user} commentActions={commentActions} onShowFileDialog={handleOpenFileDialog} dropAction={dropAction} dictionary={dictionary} postActions={postActions} />
            <hr className="m-0" />
          </>
        )}
        <CompanyPostDetailFooter
          isMember={isMember}
          post={post}
          posts={posts}
          filter={filter}
          commentActions={commentActions}
          postActions={postActions}
          overview={handleClosePost}
          onShowFileDialog={handleOpenFileDialog}
          dropAction={dropAction}
          mainInput={true}
        />
      </MainBody>
    </>
  );
};

export default CompanyPostDetail;
