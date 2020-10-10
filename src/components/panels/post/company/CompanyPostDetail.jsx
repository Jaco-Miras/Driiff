import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { addToModals } from "../../../../redux/actions/globalActions";
import { setParentIdForUpload } from "../../../../redux/actions/postActions";
import { FileAttachments, ReminderNote, SvgIconFeather, ToolTip } from "../../../common";
import { DropDocument } from "../../../dropzone/DropDocument";
import { useCommentActions, useComments } from "../../../hooks";
import { CompanyPostBody, CompanyPostComments, CompanyPostDetailFooter } from "./index";
import { replaceChar } from "../../../../helpers/stringFormatter";
import { MoreOptions } from "../../common";
import Avatar from "../../../common/Avatar";

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
  
  .user-reads-container {
    position: relative;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    margin-right: 0.5rem;
    
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
        background-color: #191c20;  
      }
      
      > span {
        padding: 0.5rem;
        display: flex;
        justify-content: center;
        align-items: center;
      
        .avatar {
          img {
            min-width: 28px;
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

const CompanyPostDetail = (props) => {

  const dispatch = useDispatch();
  const history = useHistory();
  const commentActions = useCommentActions();

  const { post, postActions, user, onGoBack, dictionary, readByUsers = [] } = props;
  const { markAsRead, markAsUnread, sharePost, followPost, remind } = postActions;

  const comments = useComments(post, commentActions);

  const hasRead = readByUsers.some(u => u.id === user.id);

  const [showDropZone, setshowDropZone] = useState(false);
  const [react, setReact] = useState({
    user_clap_count: post.user_clap_count,
    clap_count: post.clap_count,
  });

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

  const handleAuthorClick = () => {
    history.push(`/profile/${post.author.id}/${replaceChar(post.author.name)}`);
  };

  //const isMember = post.users_responsible.some((u) => u.id === user.id);
  const isMember = true;

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
          {post.author.id !== user.id && post.is_must_read && (
            <MarkAsRead className="d-sm-inline d-none">
              <button className="btn btn-primary btn-block" onClick={() => markAsRead(post)}>
                {dictionary.markAsRead}
              </button>
            </MarkAsRead>
          )}
          {post.author.id === user.id && (
            <ul>
              <li>
                <span data-toggle="modal" data-target="#editTaskModal">
                  <a onClick={() => postActions.showModal("edit_company", post)} className="btn btn-outline-light ml-2"
                     title="" data-toggle="tooltip" data-original-title="Edit Task">
                    <Icon icon="edit-3"/>
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
              {
                post.todo_reminder === null &&
                <div onClick={() => remind(post)}>{dictionary.remindMeAboutThis}</div>
              }
              {
                post.is_unread === 0 ?
                  <div onClick={() => markAsUnread(post, true)}>{dictionary.markAsUnread}</div> :
                  <div onClick={() => markAsRead(post, true)}>{dictionary.markAsRead}</div>
              }
              <div onClick={() => sharePost(post)}>{dictionary.share}</div>
              {post.author.id !== user.id &&
              <div onClick={() => followPost(post)}>{post.is_followed ? dictionary.unFollow : dictionary.follow}</div>}
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
        <CompanyPostBody post={post} postActions={postActions} isAuthor={post.author.id === user.id}
                         dictionary={dictionary}/>
        <hr className="m-0"/>
        <Counters className="d-flex align-items-center">
          <div>
            <Icon className={react.user_clap_count ? "mr-2 post-reaction clap-true" : "mr-2 post-reaction clap-false"}
                  icon="heart" onClick={handleReaction}/>
            {react.clap_count}
          </div>
          <div className="readers-container ml-auto text-muted">
            {
              readByUsers.length > 0 &&
              <div className="user-reads-container">
                {hasRead &&
                <span className="mr-2"><Icon className="mr-2" icon="check"/> {dictionary.alreadyReadThis}</span>}
                <span className="no-readers">{dictionary.readByNumberofUsers}</span>
                <span className="hover read-users-container">
                  {
                    readByUsers.map(u => {
                      return <span key={u.id}>
                        <Avatar className="mr-2" key={u.id} name={u.name} imageLink={u.profile_image_link}
                                id={u.id}/> <span className="name">{u.name}</span>
                      </span>;
                    })
                  }
                </span>
              </div>
            }
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
              <PostFiles attachedFiles={post.files} type="company" post={post} />
            </div>
            <hr className="m-0" />
          </>
        )}
        {comments && Object.keys(comments).length > 0 && (
          <>
            <CompanyPostComments comments={comments} post={post} user={user} commentActions={commentActions} onShowFileDialog={handleOpenFileDialog} dropAction={dropAction} dictionary={dictionary} />
            <hr className="m-0" />
          </>
        )}
        <CompanyPostDetailFooter isMember={isMember} post={post} commentActions={commentActions} onShowFileDialog={handleOpenFileDialog} dropAction={dropAction} />
      </MainBody>
    </>
  );
};

export default React.memo(CompanyPostDetail);
