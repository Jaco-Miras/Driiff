import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { Avatar, SvgIconFeather } from "../../common";
import { PostCheckBox } from "../../forms";
import { useTimeFormat, useGetSlug } from "../../hooks";
import { MoreOptions } from "../common";
import { PostBadge, PostRecipients } from "./index";
import PostApprovalLabels from "./PostApprovalLabels";
//import Tooltip from "react-tooltip-lite";

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
      color: ${(props) => props.theme.colors.primary};
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

const CheckBox = styled(PostCheckBox)`
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

const CheckBoxContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;

  > div {
    box-shadow: ${({ focus }) => (focus ? "0 0 3pt 3pt cornflowerblue" : "")};
    border-radius: 4px;
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
    postActions: { starPost, openPost, archivePost, markAsRead, markAsUnread, sharePost, followPost, remind, showModal, close, disconnectPostList, updatePostListConnect },
  } = props;

  const user = useSelector((state) => state.session.user);
  const flipper = useSelector((state) => state.workspaces.flipper);
  const sharedWs = useSelector((state) => state.workspaces.sharedWorkspaces);
  const workspace = useSelector((state) => state.workspaces.activeTopic);
  const { fromNow } = useTimeFormat();
  const { slug } = useGetSlug();
  const userId = workspace && workspace.sharedSlug && sharedWs[workspace.slug] ? sharedWs[workspace.slug].user_auth.id : user ? user.id : 0;

  const [postBadgeWidth, setPostBadgeWidth] = useState(0);

  const [archivedClicked, setArchivedClicked] = useState(false);
  const [checkboxFocus, setCheckboxFocus] = useState(false);

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
        sharedPayload: workspace && workspace.sharedSlug ? { slug: workspace.slug, token: sharedWs[workspace.slug].access_token, is_shared: true } : null,
      };
      disconnectPostList(payload, (err, res) => {
        if (err) return;
        res.data["topic_id"] = workspace && workspace.id ? workspace.id : null;
        updatePostListConnect({ ...res.data, slug: workspace.slug, sharedSlug: workspace.sharedSlug });
      });
    }
  };

  const disableCheckbox = () => {
    const hasPendingApproval = post.users_approval.length > 0 && post.users_approval.some((u) => u.ip_address === null && u.id === userId);
    if (post.is_must_read && post.author.id !== userId) {
      if (post.must_read_users && post.must_read_users.some((u) => u.id === userId && !u.must_read)) {
        return true;
      }
    } else if (post.is_must_reply && post.author.id !== userId) {
      if (post.must_reply_users && post.must_reply_users.some((u) => u.id === userId && !u.must_reply)) {
        return true;
      }
    } else if (hasPendingApproval) {
      return true;
    } else {
      return false;
    }
  };

  const isUnread = post.is_archived !== 1 && post.is_unread === 1 && post.is_followed;

  const handleCheckboxClick = (e) => {
    toggleCheckbox(post);
  };

  const handleClosePost = () => {
    let sharedPayload = null;
    if (slug !== post.slug && workspace && workspace.sharedSlug) {
      sharedPayload = { slug: workspace.slug, token: sharedWs[workspace.slug].access_token, is_shared: true };
    }
    let payload = {
      post_id: post.id,
      is_close: post.is_close ? 0 : 1,
      sharedPayload: sharedPayload,
    };
    close(payload);
  };

  // const toggleTooltip = () => {
  //   let tooltips = document.querySelectorAll("span.react-tooltip-lite");
  //   tooltips.forEach((tooltip) => {
  //     tooltip.parentElement.classList.toggle("tooltip-active");
  //   });
  // };
  return (
    <Wrapper data-toggle={flipper ? "1" : "0"} appListWidthDiff={postBadgeWidth + 50} className={`list-group-item post-item-panel ${isUnread ? "has-unread" : ""} ${className} pl-3`}>
      <PostRecipients post={post} user={user} dictionary={dictionary} isExternalUser={isExternalUser} classNames="text-truncate" />
      <div className="d-flex">
        <CheckBoxContainer
          onClick={handleCheckboxClick}
          focus={checkboxFocus}
          onMouseOver={() => {
            setCheckboxFocus(true);
          }}
          onMouseLeave={() => setCheckboxFocus(false)}
        >
          <div>
            <CheckBox name="test" checked={checked} onClick={handleCheckboxClick} disabled={disableCheckbox()} />
          </div>
        </CheckBoxContainer>
        <PostContent onClick={() => openPost(post)}>
          <Author className="d-flex ml-2 mr-2">
            <Avatar title={`FROM: ${post.author.name}`} className="author-avatar mr-2" id={post.author.id} name={post.author.name} imageLink={post.author.profile_image_link} />
          </Author>
          <div className="d-flex align-items-center justify-content-between flex-grow-1 min-width-0 mr-1">
            <div className={`app-list-title text-truncate ${isUnread ? "has-unread" : ""}`}>
              <div className="text-truncate d-flex">
                <span className="text-truncate">
                  {post.author.id !== userId && !post.is_followed && <Icon icon="eye-off" />}
                  {post.title}
                </span>
                <HoverButtons className="hover-btns ml-1">
                  {post.type !== "draft_post" && !disableOptions && post.author.id === userId && (
                    // <Tooltip arrowSize={5} distance={10} onToggle={toggleTooltip} content={dictionary.editPost}>
                    <Icon icon="pencil" onClick={handleEditPost} />
                    // </Tooltip>
                  )}
                  {!disableOptions && !disableCheckbox() && (
                    // <Tooltip arrowSize={5} distance={10} onToggle={toggleTooltip} content={dictionary.archived}>
                    <Icon icon="clock" onClick={handleArchivePost} />
                    // </Tooltip>
                  )}
                </HoverButtons>
              </div>
              <PostReplyCounter>
                {isUnread && (
                  <>
                    {post.author.id !== user.id && post.unread_count === 0 && !post.view_user_ids.some((id) => id === user.id) && <div className="mr-2 badge badge-secondary text-white text-9">{dictionary.new}</div>}
                    {post.unread_count !== 0 && <div className="mr-2 badge badge-secondary text-white text-9">{post.unread_count} new</div>}
                  </>
                )}

                <div className="text-muted">{post.reply_count === 0 ? dictionary.noComment : post.reply_count === 1 ? dictionary.oneComment : dictionary.comments.replace("::comment_count::", post.reply_count)}</div>
                <span className="time-stamp text-muted">
                  <span>{fromNow(post.updated_at.timestamp)}</span>
                </span>
              </PostReplyCounter>
            </div>
          </div>
          {post.users_approval.length > 0 && post.author.id === userId && <PostApprovalLabels post={post} />}
          <PostBadge post={post} dictionary={dictionary} user={user} cbGetWidth={setPostBadgeWidth} />
          <div className="d-flex">
            {post.type !== "draft_post" && !disableOptions && (
              <MoreOptions className={"d-flex ml-2"} item={post} width={220} moreButton={"more-horizontal"}>
                {post.todo_reminder === null && <div onClick={() => remind(post)}>{dictionary.remindMeAboutThis}</div>}
                {post.author && post.author.id === userId && <div onClick={() => showModal("edit", post)}>{dictionary.editPost}</div>}
                {post.is_unread === 0 ? <div onClick={() => markAsUnread(post, true)}>{dictionary.markAsUnread}</div> : disableCheckbox() ? null : <div onClick={() => markAsRead(post, true)}>{dictionary.markAsRead}</div>}
                <div onClick={() => sharePost(post)}>{dictionary.share}</div>
                {post.author && post.author.id !== userId && <div onClick={() => followPost(post)}>{post.is_followed ? dictionary.unFollow : dictionary.follow}</div>}
                <div onClick={handleStarPost}>{post.is_favourite ? dictionary.unStar : dictionary.star}</div>
                <div onClick={handleClosePost}>{post.is_close ? dictionary.openThisPost : dictionary.closeThisPost}</div>
                {post.post_list_connect && <div onClick={() => handleAddToListModal()}>{post.post_list_connect.length === 1 ? dictionary.removeToList : dictionary.addToList}</div>}
              </MoreOptions>
            )}
          </div>
        </PostContent>
      </div>
    </Wrapper>
  );
};

export default React.memo(PostItemPanel);
