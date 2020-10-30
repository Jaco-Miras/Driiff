import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { addToModals } from "../../../redux/actions/globalActions";
import { setParentIdForUpload } from "../../../redux/actions/postActions";
import { Avatar, FileAttachments, ReminderNote, SvgIconFeather } from "../../common";
import { DropDocument } from "../../dropzone/DropDocument";
import { useCommentActions, useComments } from "../../hooks";
import { PostBody, PostComments, PostDetailFooter } from "./index";
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

const MainBody = styled.div`
  display: flex;
  flex-grow: 1;
  width: 100%;
  flex-flow: column;
  
   .clap-count-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    
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
  
  .user-reads-container {
    position: relative;
    display: inline-flex;
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
    top: 25px;
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

const PostDetail = (props) => {
  const { post, postActions, user, onGoBack, workspace, isMember, dictionary, disableOptions, readByUsers } = props;
  const { markAsRead, markAsUnread, sharePost, followPost, remind } = postActions;

  const dispatch = useDispatch();
  const commentActions = useCommentActions();

  const recipients = useSelector((state) => state.global.recipients.filter((r) => r.type === "USER"));
  const [showDropZone, setShowDropZone] = useState(false);

  const comments = useComments(post, commentActions, workspace);

  const hasRead = readByUsers.some(u => u.id === user.id);

  const [react, setReact] = useState({
    user_clap_count: post.user_clap_count,
    clap_count: post.clap_count,
  });

  const [usersReacted, setUsersReacted] = useState(recipients.filter(r => post.clap_user_ids.includes(r.type_id)));

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

    let modal = {
      type: "file_upload",
      droppedFiles: attachedFiles,
      mode: "post",
      post: post,
      members: workspace ? workspace.members : [],
    };

    dispatch(addToModals(modal));
  };

  const markRead = () => {
    postActions.markReadRequirement(post);
  };

  const handleReaction = () => {
    setReact((prevState) => ({
      user_clap_count: !!prevState.user_clap_count ? 0 : 1,
      clap_count: !!prevState.user_clap_count ? prevState.clap_count - 1 : prevState.clap_count + 1,
    }));

    setUsersReacted(prevState => prevState.some(r => r.type_id === user.id) ?
      prevState.filter(r => r.type_id !== user.id) :
      prevState.concat(recipients.find(r => r.type_id === user.id)));

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

    postActions.fetchPostClapHover(post.id, (err, res) => {
      const clap_user_ids = res.data.claps.map(c => c.user_id);
      setUsersReacted(recipients.filter(r => clap_user_ids.includes(r.type_id)));
    });
  }, []);

  useEffect(() => {
    setReact({
      user_clap_count: post.user_clap_count,
      clap_count: post.clap_count,
    });
  }, [post]);

  useEffect(() => {
    setUsersReacted(recipients.filter(r => post.clap_user_ids.includes(r.type_id)));
  }, [post.clap_user_ids]);

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
            </li>
          </ul>
        </div>
        <div>
          {post.author.id !== user.id && post.is_must_read && (!hasRead) && (
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
          onDrop={({ acceptedFiles }) => {
            dropAction(acceptedFiles);
          }}
          onCancel={handleHideDropzone}
        />
        <PostBody
          post={post}
          user={user}
          postActions={postActions}
          isAuthor={post.author.id === user.id}
          dictionary={dictionary}
          disableOptions={disableOptions}/>
        <hr className="m-0"/>
        <Counters className="d-flex align-items-center">
          <div className="clap-count-wrapper">
            <Icon className={react.user_clap_count ? "mr-2 post-reaction clap-true" : "mr-2 post-reaction clap-false"}
                  icon="heart" onClick={handleReaction}/>
            {usersReacted.length}
            {
              usersReacted.length !== 0 && <span className="hover read-users-container">
              {
                usersReacted.map(u => {
                  return <span key={u.id}>
                    <Avatar className="mr-2" key={u.id} name={u.name} imageLink={u.profile_image_link}
                            id={u.id}/> <span className="name">{u.name}</span>
                  </span>;
                })
              }
            </span>
            }
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
