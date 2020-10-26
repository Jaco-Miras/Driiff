import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { Avatar, SvgIconFeather } from "../../../common";
import { MoreOptions } from "../../common";
import { CompanyPostBadge } from "./index";
import quillHelper from "../../../../helpers/quillHelper";
import { MemberLists } from "../../../list/members";

const Wrapper = styled.li`
  &:first-of-type {
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }
  &:last-of-type {
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
  }
  .custom-checkbox {
    padding-left: 12px;
  }

  .app-list-title {
    color: #363636;
    font-weight: 500;
    padding-left: 2.5rem;

    &.has-unread {
      font-weight: 500;
    }

    &.text-success {
      text-decoration: line-through;
    }
  }

  &:hover {
    .more-options {
      display: flex;
    }
  }

  .more-options {
    padding: 0 4px;
    svg {
      width: 16px;
    }
  }
  .feather {
    &:hover {
      color: #7a1b8b;
    }
  }
  .post-partialBody {
    color: #b8b8b8;
    font-weight: 400;
  }

  .post-read-title {
    color: #363636;
  }
  .author-avatar {
    position: absolute;
    left: 1rem;
    top: 0;
    bottom: 0;
    margin: auto;
    img {
      width: 2rem;
      height: 2rem;
    }
  }
`;

const Icon = styled(SvgIconFeather)`
  width: 16px;
`;

const ArchiveBtn = styled.a`
  padding: 5px;
`;

const CompanyPostItemPanel = (props) => {

  const { className = "", post, postActions, dictionary, disableOptions } = props;

  const user = useSelector((state) => state.session.user);
  const flipper = useSelector((state) => state.workspaces.flipper);

  const { starPost, markPost, openPost, archivePost, markAsRead, markAsUnread, sharePost, followPost, remind, showModal } = postActions;

  const handleMarkDone = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (disableOptions) return;
    markPost(post);
  };

  const handleStarPost = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (disableOptions) return;
    starPost(post);
  };

  const handleArchivePost = (e) => {
    e.preventDefault();
    e.stopPropagation();
    archivePost(post);
  };

  const noAuthorResponsibles = post.users_responsible.filter(u => u.id !== post.author.id);

  return (
    <Wrapper data-toggle={flipper ? "1" : "0"} className={`list-group-item post-item-panel ${className}`}
             onClick={() => openPost(post, "/posts")}>
      {/* <div className="custom-control custom-checkbox custom-checkbox-success">
        <CheckBox name="test" checked={post.is_mark_done} onClick={handleMarkDone} disabled={disableOptions}/>
      </div> */}
      {/* <div>
        <Icon className="mr-2" icon="star" onClick={handleStarPost}
              stroke={post.is_favourite ? "#ffc107" : "currentcolor"} fill={post.is_favourite ? "#ffc107" : "none"}/>
      </div>  */}
      <div className="flex-grow-1 min-width-0">
        <div className="d-flex align-items-center justify-content-between">
          <div
            className={`app-list-title text-truncate ${post.unread_count > 0 || post.is_unread === 1 ? "text-primary has-unread" : ""}`}>
            <Avatar className="author-avatar mr-2" id={post.author.id} name={post.author.name}
                    imageLink={post.author.profile_image_link}/>
            <span>{post.title}</span>
            <div className='text-truncate post-partialBody'>
              <span dangerouslySetInnerHTML={{ __html: quillHelper.parseEmoji(post.partial_body) }}/>
            </div>
          </div>
          <div className="pl-3 d-flex align-items-center">
            {post.unread_count !== 0 &&
            <div className="ml-2 mr-2 badge badge-primary badge-pill">{post.unread_count}</div>}
            <CompanyPostBadge post={post} dictionary={dictionary}/>
            {noAuthorResponsibles && noAuthorResponsibles.length > 0 &&
            <MemberLists members={noAuthorResponsibles} classNames="mr-2"/>}
            {!disableOptions &&
            <ArchiveBtn onClick={handleArchivePost} className="btn button-darkmode btn-outline-light ml-2" data-toggle="tooltip"
                        title="" data-original-title="Archive post">
              <Icon icon="archive"/>
            </ArchiveBtn>}
          </div>
        </div>
      </div>
      {post.type !== "draft_post" && !disableOptions && (
        <MoreOptions className="ml-2" item={post} width={220} moreButton={"more-horizontal"}>
          {
            post.todo_reminder === null &&
            <div onClick={() => remind(post)}>{dictionary.remindMeAboutThis}</div>
          }
          {post.author && post.author.id === user.id &&
          <div onClick={() => showModal("edit_company", post)}>{dictionary.editPost}</div>}
          {
            post.is_unread === 0 ?
              <div onClick={() => markAsUnread(post, true)}>{dictionary.markAsUnread}</div> :
              <div onClick={() => markAsRead(post, true)}>{dictionary.markAsRead}</div>
          }
          <div onClick={() => sharePost(post)}>{dictionary.share}</div>
          {post.author && post.author.id !== user.id &&
          <div onClick={() => followPost(post)}>{post.is_followed ? dictionary.unFollow : dictionary.follow}</div>}
          <div onClick={handleStarPost}>{post.is_favourite ? dictionary.unStar : dictionary.star}</div>
        </MoreOptions>
      )}
    </Wrapper>
  );
};

export default React.memo(CompanyPostItemPanel);
