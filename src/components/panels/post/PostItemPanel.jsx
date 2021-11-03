import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { Avatar, SvgIconFeather } from "../../common";
import { MoreOptions } from "../common";
import { PostBadge, PostRecipients } from "./index";
import { useTimeFormat } from "../../hooks";
import { TodoCheckBox } from "../../forms";

const Wrapper = styled.li`
  flex-flow: column;
  @media (max-width: 414px) {
    padding-bottom: 30px !important;
    .post-badge {
      position: absolute;
      bottom: 5px;
      flex-flow: row wrap;
      display: flex;
    }
  }
  .post-recipients {
    margin-bottom: 0.5rem;
  }
  .post-recipients.has-external {
    margin-left: -25px;
  }
  .feather-eye-off {
    position: relative;
    top: -1px;
    margin-right: 0.25rem;
    width: 12px;
  }
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
    color: #343a40;
    font-weight: normal;
    width: 100%;
    overflow: inherit;

    &.has-unread {
      font-weight: bold;

      .post-partialBody {
        color: #343a40;
        font-weight: normal;

        .dark & {
          color: #c7c7c7;
        }
      }
    }

    &.text-success {
      text-decoration: line-through;
    }

    .time-stamp {
      margin-left: 1rem;
      font-weight: 400;
      font-size: 11px;
    }
  }

  .hover-btns {
    display: none;
    margin-right: 0.5rem;
  }

  &:hover {
    .more-options,
    .hover-btns {
      display: inline-block;
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
    color: #b8b8b8 !important;
    font-weight: 400;
  }

  .post-read-title {
    color: #363636;
  }
  .author-avatar {
    img {
      width: 2.5rem;
      height: 2.5rem;
    }
    @media (max-width: 991.99px) {
      img {
        width: 2rem;
        height: 2rem;
      }
    }
  }

  // .ellipsis-hover {
  //   position: relative;
  //   cursor: pointer;

  //   &:hover {
  //     .recipient-names {
  //       opacity: 1;
  //       max-height: 300px;
  //     }
  //   }
  // }
`;

const Icon = styled(SvgIconFeather)`
  width: 16px;
`;

const PostReplyCounter = styled.div`
  display: flex;
  align-items: center;
  margin-top: 5px;
  font-weight: 400;
  font-size: 11px;
`;

const Author = styled.div`
  position: relative;
  .feather-corner-up-right {
    position: absolute;
    top: -23px;
    right: 17px;
  }
`;

const CheckBox = styled(TodoCheckBox)`
  &.custom-checkbox {
    padding: 0;
  }
  label {
    margin: 0;
  }
`;

const PostContent = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
`;

const HoverButtons = styled.div`
  display: inline-block;
  > svg {
    width: 0.9rem;
    height: 0.9rem;
  }
  .feather-pencil {
    margin-right: 5px;
  }
`;

const PostItemPanel = (props) => {
  const {
    className = "",
    isExternalUser,
    post,
    dictionary,
    disableOptions,
    toggleCheckbox,
    checked,
    workspace,
    postActions: { starPost, openPost, archivePost, markAsRead, markAsUnread, sharePost, followPost, remind, showModal, close, disconnectPostList, updatePostListConnect },
  } = props;

  const user = useSelector((state) => state.session.user);
  const flipper = useSelector((state) => state.workspaces.flipper);
  const { fromNow } = useTimeFormat();

  const [postBadgeWidth, setPostBadgeWidth] = useState(0);

  const [archivedClicked, setArchivedClicked] = useState(false);

  const componentIsMounted = useRef(true);

  useEffect(() => {
    return () => {
      componentIsMounted.current = false;
    };
  }, []);

  const handleStarPost = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (disableOptions) return;
    starPost(post);
  };

  const handleArchivePost = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (archivedClicked) return;
    setArchivedClicked(true);
    archivePost(post, () => {
      if (componentIsMounted.current) setArchivedClicked(false);
    });
  };

  const handleEditPost = (e) => {
    e.preventDefault();
    e.stopPropagation();
    showModal("edit", post);
  };

  const handleAddToListModal = () => {
    if (post.post_list_connect.length !== 1) {
      showModal("add_to_list", post);
    } else {
      const payload = {
        link_id: post.post_list_connect[0].id,
        post_id: post.id,
      };
      disconnectPostList(payload, (err, res) => {
        if (err) return;
        res.data["topic_id"] = workspace && workspace.id ? workspace.id : null;
        updatePostListConnect(res.data);
      });
    }
  };

  const disableCheckbox = () => {
    const hasPendingApproval = post.users_approval.length > 0 && post.users_approval.some((u) => u.ip_address === null && u.id === user.id);
    if (post.is_must_read && post.author.id !== user.id) {
      if (post.must_read_users && post.must_read_users.some((u) => u.id === user.id && !u.must_read)) {
        return true;
      }
    } else if (post.is_must_reply && post.author.id !== user.id) {
      if (post.must_reply_users && post.must_reply_users.some((u) => u.id === user.id && !u.must_reply)) {
        return true;
      }
    } else if (hasPendingApproval) {
      return true;
    } else {
      return false;
    }
  };

  const isUnread = post.is_unread === 1;

  return (
    <Wrapper data-toggle={flipper ? "1" : "0"} appListWidthDiff={postBadgeWidth + 50} className={`list-group-item post-item-panel ${isUnread ? "has-unread" : ""} ${className} pl-3`} onClick={() => openPost(post)}>
      <PostRecipients post={post} user={user} dictionary={dictionary} isExternalUser={isExternalUser} classNames="text-truncate" />
      <PostContent>
        <CheckBox name="test" checked={checked} onClick={() => toggleCheckbox(post.id)} disabled={disableCheckbox()} />
        <Author className="d-flex ml-2 mr-2">
          <Avatar
            title={`FROM: ${post.author.name}`}
            className="author-avatar mr-2"
            id={post.author.id}
            name={post.author.name}
            imageLink={post.author.profile_image_thumbnail_link ? post.author.profile_image_thumbnail_link : post.author.profile_image_link}
          />
        </Author>
        <div className="d-flex align-items-center justify-content-between flex-grow-1 min-width-0 mr-1">
          <div className={`app-list-title text-truncate ${isUnread ? "has-unread" : ""}`}>
            <div className="text-truncate d-flex">
              <span className="text-truncate">
                {post.author.id !== user.id && !post.is_followed && <Icon icon="eye-off" />}
                {post.title}
              </span>
              <HoverButtons className="hover-btns ml-1">
                {post.type !== "draft_post" && !disableOptions && post.author.id === user.id && <Icon icon="pencil" onClick={handleEditPost} />}
                {!disableOptions && !disableCheckbox() && <Icon icon="archive" onClick={handleArchivePost} />}
              </HoverButtons>
            </div>
            <PostReplyCounter>
              {post.author.id !== user.id && post.unread_count === 0 && !post.view_user_ids.some((id) => id === user.id) && <div className="mr-2 badge badge-secondary text-white text-9">{dictionary.new}</div>}
              {post.unread_count !== 0 && <div className="mr-2 badge badge-secondary text-white text-9">{post.unread_count} new</div>}
              <div className="text-muted">{post.reply_count === 0 ? dictionary.noComment : post.reply_count === 1 ? dictionary.oneComment : dictionary.comments.replace("::comment_count::", post.reply_count)}</div>
              <span className="time-stamp text-muted">
                <span>{fromNow(post.updated_at.timestamp)}</span>
              </span>
            </PostReplyCounter>
          </div>
        </div>
        <PostBadge post={post} dictionary={dictionary} user={user} cbGetWidth={setPostBadgeWidth} />
        <div className="d-flex">
          {post.type !== "draft_post" && !disableOptions && (
            <MoreOptions className={"d-flex ml-2"} item={post} width={220} moreButton={"more-horizontal"}>
              {post.todo_reminder === null && <div onClick={() => remind(post)}>{dictionary.remindMeAboutThis}</div>}
              {post.author && post.author.id === user.id && <div onClick={() => showModal("edit", post)}>{dictionary.editPost}</div>}
              {post.is_unread === 0 ? <div onClick={() => markAsUnread(post, true)}>{dictionary.markAsUnread}</div> : disableCheckbox() ? null : <div onClick={() => markAsRead(post, true)}>{dictionary.markAsRead}</div>}
              <div onClick={() => sharePost(post)}>{dictionary.share}</div>
              {post.author && post.author.id !== user.id && <div onClick={() => followPost(post)}>{post.is_followed ? dictionary.unFollow : dictionary.follow}</div>}
              <div onClick={handleStarPost}>{post.is_favourite ? dictionary.unStar : dictionary.star}</div>
              <div onClick={() => close(post)}>{post.is_close ? dictionary.openThisPost : dictionary.closeThisPost}</div>
              {post.post_list_connect && <div onClick={() => handleAddToListModal()}>{post.post_list_connect.length === 1 ? dictionary.removeToList : dictionary.addToList}</div>}
            </MoreOptions>
          )}
        </div>
      </PostContent>
    </Wrapper>
  );
};

export default React.memo(PostItemPanel);
