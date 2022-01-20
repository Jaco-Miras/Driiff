import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { Avatar, SvgIconFeather } from "../../common";
import { MoreOptions } from "../common";
import { useTimeFormat, useWIPActions } from "../../hooks";
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
  .subject-version {
    span {
      border-radius: 6px;
      padding: 3px 5px;
      background-color: hsla(0, 0%, 82.4%, 0.2);
      font-size: 11px;
      margin-right: 3px;
      display: inline-block;
      -webkit-box-align: center;
      align-items: center;
    }
  }
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

const WIPCounts = styled.div`
  .count {
    display: inline-flex;
    align-items: center;
    font-size: 12px;
    color: #8b8b8b;
    svg {
      color: #fff;
      width: 12px;
      height: 12px;
      stroke-width: 3;
    }
  }
  .checked-circle {
    border-radius: 50%;
    background-color: #00c851;
    width: 18px;
    height: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .refresh-circle {
    border-radius: 50%;
    background-color: #505050;
    width: 18px;
    height: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .edit-circle {
    border-radius: 50%;
    background-color: #fb3;
    width: 18px;
    height: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const WIPItem = (props) => {
  const { className = "", item, dictionary, disableOptions, toggleCheckbox, checked } = props;

  const user = useSelector((state) => state.session.user);
  const { fromNow } = useTimeFormat();

  const wipActions = useWIPActions();

  const [postBadgeWidth, setPostBadgeWidth] = useState(0);

  const [archivedClicked, setArchivedClicked] = useState(false);

  const componentIsMounted = useRef(true);

  useEffect(() => {
    return () => {
      componentIsMounted.current = false;
    };
  }, []);

  const handleArchivePost = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // if (archivedClicked) return;
    // setArchivedClicked(true);
    // archivePost(post, () => {
    //   if (componentIsMounted.current) setArchivedClicked(false);
    // });
  };

  const handleEditPost = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // showModal("edit", post);
  };

  const handleOpenWIP = () => {
    wipActions.openWIP(item);
  };

  const isUnread = item.is_unread === 1;

  return (
    <Wrapper appListWidthDiff={postBadgeWidth + 50} className={`list-group-item post-item-panel ${isUnread ? "has-unread" : ""} ${className} pl-3`} onClick={handleOpenWIP}>
      <div className="subject-version">
        <span>{item.subject.name}</span>
        <span>Version 1</span>
      </div>
      <PostContent>
        <CheckBox name="test" checked={checked} onClick={() => toggleCheckbox(item.id)} disabled={false} />
        <Author className="d-flex ml-2 mr-2">
          <Avatar title={user.name} className="author-avatar mr-2" id={item.author.id} name={item.author.name} imageLink={item.author.profile_image_link} />
        </Author>
        <div className="d-flex align-items-center justify-content-between flex-grow-1 min-width-0 mr-1">
          <div className={`app-list-title text-truncate ${isUnread ? "has-unread" : ""}`}>
            <div className="text-truncate d-flex">
              <span className="text-truncate">{item.title}</span>
              <HoverButtons className="hover-btns ml-1">
                {item.type !== "draft_post" && !disableOptions && item.author.id === user.id && <Icon icon="pencil" onClick={handleEditPost} />}
                {!disableOptions && <Icon icon="clock" onClick={handleArchivePost} />}
              </HoverButtons>
            </div>
            <PostReplyCounter>
              {item.author.id !== user.id && item.unread_count === 0 && !item.view_user_ids.some((id) => id === user.id) && <div className="mr-2 badge badge-secondary text-white text-9">New</div>}
              {item.unread_count !== 0 && <div className="mr-2 badge badge-secondary text-white text-9">{item.unread_count} new</div>}
              {/* <div className="text-muted">{item.reply_count === 0 ? "no comment" : item.reply_count === 1 ? "1 comment" : dictionary.comments.replace("::comment_count::", item.reply_count)}</div> */}
              <span className="time-stamp text-muted">
                <span>{fromNow(item.updated_at.timestamp)}</span>
              </span>
            </PostReplyCounter>
          </div>
        </div>
        <WIPCounts className="WIP-counts">
          <span className="count approved-count mr-2">
            <span className="checked-circle mr-1">
              <SvgIconFeather icon="check" />
            </span>
            {item.files.filter((file) => file.file_versions.every((f) => f.status === "done")).length}
            {"/"}
            {item.files.length}
          </span>
          <span className="count todo-count mr-2">
            <span className="edit-circle mr-1">
              <SvgIconFeather icon="pencil" />
            </span>
            {item.files.filter((file) => file.file_versions.every((f) => f.status === "todo")).length}
            {"/"}
            {item.files.length}
          </span>
          <span className="count todo-count mr-2">
            <span className="refresh-circle mr-1">
              <SvgIconFeather icon="refresh-cw" />
            </span>
            {item.files.filter((file) => file.file_versions.every((f) => f.status === "pending")).length}
            {"/"}
            {item.files.length}
          </span>
        </WIPCounts>
        <div className="d-flex">
          <MoreOptions className={"d-flex ml-2"} width={220} moreButton={"more-horizontal"}></MoreOptions>
        </div>
      </PostContent>
    </Wrapper>
  );
};

export default React.memo(WIPItem);
