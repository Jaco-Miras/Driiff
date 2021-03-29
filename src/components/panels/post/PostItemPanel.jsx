import React, { useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { Avatar, SvgIconFeather } from "../../common";
import { MoreOptions } from "../common";
import { PostBadge } from "./index";
import quillHelper from "../../../helpers/quillHelper";
import { useTimeFormat, useTouchActions, useWindowSize } from "../../hooks";
import { TodoCheckBox } from "../../forms";
import { renderToString } from "react-dom/server";

const Wrapper = styled.li`
  .feather-eye-off {
    position: relative;
    top: -1px;
    margin-right: 0.25rem;
    width: 12px;
  }
  &.has-unread {
    background-color: #f7f7f7 !important;

    .dark & {
      background-color: #2b2e31 !important;
    }
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
    //padding-left: 2.5rem;
    overflow: inherit;
    //width: calc(100% - ${(props) => props.appListWidthDiff}px);

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
    color: #b8b8b8 !important;
    font-weight: 400;
  }

  .post-read-title {
    color: #363636;
  }
  .author-avatar {
    // position: absolute;
    // left: -1.25rem;
    // top: 1.3rem;
    img {
      width: 2.5rem;
      height: 2.5rem;
    }
    @media (max-width: 991.99px) {
      // position: absolute;
      // left: -1rem;
      // top: 1.3rem;
      img {
        width: 2rem;
        height: 2rem;
      }
    }
  }

  .ellipsis-hover {
    position: relative;
    cursor: pointer;

    &:hover {
      .recipient-names {
        opacity: 1;
        max-height: 300px;
      }
    }
  }
`;

const Icon = styled(SvgIconFeather)`
  width: 16px;
`;

const ByIcon = styled(SvgIconFeather)`
  width: 16px;
  stroke: lightgrey;
`;

const ArchiveBtn = styled.a`
  padding: 5px;
`;

const AuthorRecipients = styled.div`
  display: flex;
  align-items: center;
  font-weight: 400;
  padding-bottom: 3px;

  .recipients {
    color: #8b8b8b;
    font-size: 10px;
  }

  .ellipsis-hover {
    position: relative;

    &:hover {
      .recipient-names {
        opacity: 1;
        max-height: 300px;
      }
    }
  }
  .recipient-names {
    transition: all 0.5s ease;
    position: absolute;
    top: 20px;
    left: -2px;
    width: 200px;
    border-radius: 8px;
    overflow-y: auto;
    border: 1px solid #fff;
    box-shadow: 0 5px 10px -1px rgba(0, 0, 0, 0.15);
    background: #fff;
    max-height: 0;
    opacity: 0;
    z-index: 1;

    &:hover {
      max-height: 300px;
      opacity: 1;
    }

    .dark & {
      border: 1px solid #25282c;
      background: #25282c;
    }

    > span {
      display: block;
      width: 100%;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      padding: 0.25rem 0.5rem;
      border-radius: unset;
    }
  }
  .client-shared {
    background: #fb3;
    color: #212529;
    margin-right: 5px;
    .feather {
      margin-right: 5px;
    }
  }
  .client-not-shared {
    background: #33b5e5;
    color: #212529;
    margin-right: 5px;
    .feather {
      margin-right: 5px;
    }
  }
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

const LockIcon = styled(SvgIconFeather)`
  width: 12px;
  margin: 0;
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
    hasUnread,
    postActions: { starPost, openPost, archivePost, markAsRead, markAsUnread, sharePost, followPost, remind, showModal, close, disconnectPostList, updatePostListConnect },
  } = props;

  const user = useSelector((state) => state.session.user);
  const flipper = useSelector((state) => state.workspaces.flipper);

  const winSize = useWindowSize();
  const { fromNow } = useTimeFormat();

  const [postBadgeWidth, setPostBadgeWidth] = useState(0);
  const postRecipients = useSelector((state) =>
    state.global.recipients
      .filter((r) => post.recipient_ids && post.recipient_ids.includes(r.id))
      .sort((a, b) => {
        if (a.type !== b.type) {
          if (a.type === "TOPIC") return -1;
          if (b.type === "TOPIC") return 1;
        }
        return a.name.localeCompare(b.name);
      })
  );

  const renderUserResponsibleNames = () => {
    const hasExternalWorkspace = postRecipients.some((r) => r.type === "TOPIC" && r.is_shared);
    const hasMe = postRecipients.some((r) => r.type_id === user.id);
    const recipientSize = winSize.width > 576 ? (hasExternalWorkspace && !isExternalUser ? 3 : hasMe ? 4 : 5) : hasMe || (hasExternalWorkspace && !isExternalUser) ? 0 : 1;
    let recipient_names = "";
    const otherPostRecipients = postRecipients.filter((r) => !(r.type === "USER" && r.type_id === user.id));
    if (post.shared_with_client && hasExternalWorkspace && !isExternalUser) {
      recipient_names += `<span class="receiver client-shared">${renderToString(<LockIcon icon="eye" />)} The client can see this post</span>`;
    } else if (!post.shared_with_client && hasExternalWorkspace && !isExternalUser) {
      recipient_names += `<span class="receiver client-not-shared">${renderToString(<LockIcon icon="eye-off" />)} This post is private to our team</span>`;
    }
    if (otherPostRecipients.length) {
      recipient_names += otherPostRecipients
        .filter((r, i) => i < recipientSize)
        .map((r) => {
          if (["DEPARTMENT", "TOPIC"].includes(r.type))
            return `<span class="receiver">${r.name} ${r.type === "TOPIC" && r.private === 1 ? renderToString(<LockIcon icon="lock" />) : ""} ${r.type === "TOPIC" && r.is_shared ? renderToString(<LockIcon icon="eye" />) : ""}</span>`;
          else return `<span class="receiver">${r.name}</span>`;
        })
        .join(", ");
    }

    if (hasMe) {
      if (otherPostRecipients.length >= 1) {
        recipient_names += `<span class="receiver">${dictionary.me}</span>`;
      } else {
        recipient_names += `<span class="receiver">${dictionary.me}</span>`;
      }
    }

    let otherRecipientNames = "";
    if (otherPostRecipients.length + (hasMe ? 1 : 0) > recipientSize) {
      otherRecipientNames += otherPostRecipients
        .filter((r, i) => i >= recipientSize)
        .map((r) => {
          if (["DEPARTMENT", "TOPIC"].includes(r.type))
            return `<span class="receiver">${r.name} ${r.type === "TOPIC" && r.private === 1 ? renderToString(<LockIcon icon="lock" />) : ""} ${r.type === "TOPIC" && r.is_shared ? renderToString(<LockIcon icon="eye" />) : ""}</span>`;
          else return `<span class="receiver">${r.name}</span>`;
        })
        .join("");

      otherRecipientNames = `<span class="ellipsis-hover">... <span class="recipient-names">${otherRecipientNames}</span></span>`;
    }

    return `${recipient_names} ${otherRecipientNames}`;
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

  let touchActions = false;
  const handleTouchStart = (e) => {
    touchActions = false;
  };
  const handleTouchEnd = (e) => {
    e.preventDefault();
    if (!touchActions) openPost(post);
  };

  //const [showOptions, setShowOptions] = useState(false);
  const handleSwipeLeft = (e) => {
    touchActions = true;
    //setShowOptions(true);
  };
  const handleSwipeRight = (e) => {
    touchActions = true;
    //setShowOptions(false);
  };

  const { touchStart, touchMove, touchEnd } = useTouchActions({
    handleTouchStart,
    handleTouchEnd,
    handleSwipeLeft,
    handleSwipeRight,
  });

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

  return (
    <Wrapper
      data-toggle={flipper ? "1" : "0"}
      appListWidthDiff={postBadgeWidth + 50}
      className={`list-group-item post-item-panel ${hasUnread ? "has-unread" : ""} ${className} pl-3`}
      onTouchStart={touchStart}
      onTouchMove={touchMove}
      onTouchEnd={touchEnd}
      onClick={() => openPost(post)}
    >
      <CheckBox name="test" checked={checked} onClick={() => toggleCheckbox(post.id)} />
      <Author className="d-flex ml-2 mr-2">
        <ByIcon icon="corner-up-right" />
        <Avatar
          title={`FROM: ${post.author.name}`}
          className="author-avatar mr-2"
          id={post.author.id}
          name={post.author.name}
          imageLink={post.author.profile_image_thumbnail_link ? post.author.profile_image_thumbnail_link : post.author.profile_image_link}
        />
      </Author>
      <div className="d-flex align-items-center justify-content-between flex-grow-1 min-width-0 mr-1">
        <div className={`app-list-title text-truncate ${hasUnread ? "has-unread" : ""}`}>
          <AuthorRecipients>{postRecipients.length >= 1 && <span className="recipients" dangerouslySetInnerHTML={{ __html: renderUserResponsibleNames() }} />}</AuthorRecipients>
          <div className="text-truncate">
            {post.author.id !== user.id && !post.is_followed && <Icon icon="eye-off" />}
            {post.title}
          </div>
          <div className="text-truncate post-partialBody">
            <span dangerouslySetInnerHTML={{ __html: quillHelper.parseEmoji(post.partial_body) }} />
          </div>
          <PostReplyCounter>
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
          <ArchiveBtn onClick={handleArchivePost} className="btn button-darkmode btn-outline-light ml-2" data-toggle="tooltip" title="" data-original-title="Archive post">
            <Icon icon="archive" />
          </ArchiveBtn>
        )}
        {post.type !== "draft_post" && !disableOptions && (
          <MoreOptions className={"d-flex ml-2"} item={post} width={220} moreButton={"more-horizontal"}>
            {post.todo_reminder === null && <div onClick={() => remind(post)}>{dictionary.remindMeAboutThis}</div>}
            {post.author && post.author.id === user.id && <div onClick={() => showModal("edit", post)}>{dictionary.editPost}</div>}
            {post.is_unread === 0 ? <div onClick={() => markAsUnread(post, true)}>{dictionary.markAsUnread}</div> : <div onClick={() => markAsRead(post, true)}>{dictionary.markAsRead}</div>}
            <div onClick={() => sharePost(post)}>{dictionary.share}</div>
            {post.author && post.author.id !== user.id && <div onClick={() => followPost(post)}>{post.is_followed ? dictionary.unFollow : dictionary.follow}</div>}
            <div onClick={handleStarPost}>{post.is_favourite ? dictionary.unStar : dictionary.star}</div>
            {((post.author && post.author.id === user.id) || (post.author.type === "external" && user.type === "internal")) && <div onClick={() => close(post)}>{post.is_close ? dictionary.openThisPost : dictionary.closeThisPost}</div>}
            {post.post_list_connect && <div onClick={() => handleAddToListModal()}>{post.post_list_connect.length === 1 ? dictionary.removeToList : dictionary.addToList}</div>}
          </MoreOptions>
        )}
      </div>
    </Wrapper>
  );
};

export default React.memo(PostItemPanel);
