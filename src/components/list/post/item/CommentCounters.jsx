import React, { useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { Avatar, SvgIconFeather } from "../../../common";
import Viewers from "./Viewers";

const Wrapper = styled.div`
  .profile-slider {
    left: 0 !important;
    right: unset !important;
    bottom: 30px !important;
    top: unset !important;
  }
  /* slide enter */
  .slide-enter,
  .slide-appear {
    opacity: 0;
    transform: scale(0.97) translateY(50px);
    z-index: 1;
  }
  .slide-enter.slide-enter-active,
  .slide-appear.slide-appear-active {
    opacity: 1;
    transform: scale(1) translateY(0);
    transition: opacity 300ms linear 100ms, transform 300ms ease-in-out 100ms;
  }

  /* slide exit */
  .slide-exit {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
  .slide-exit.slide-exit-active {
    opacity: 0;
    transform: scale(0.97) translateY(50px);
    transition: opacity 150ms linear, transform 150ms ease-out;
  }
  .slide-exit-done {
    opacity: 0;
  }
`;

const Icon = styled(SvgIconFeather)`
  width: 16px;
`;
const Reply = styled.span`
  cursor: pointer;
`;

const CommentCounters = (props) => {
  const { comment, dictionary, disableOptions, post, handleReaction, handleShowInput } = props;

  const mainUsers = useSelector((state) => state.users.users);
  const sharedUsers = useSelector((state) => state.sharedUsers);
  let users = post.slug && sharedUsers[post.slug] ? sharedUsers[post.slug].users : mainUsers;
  const likers = Object.values(users).filter((u) => comment.claps.some((c) => c.user_id === u.id));

  const [showViewer, setShowViewer] = useState(false);

  const userReadPost = () => {
    if (post.post_reads) {
      return post.post_reads.filter((u) => {
        if (!comment.shared_with_client) {
          return u.type === "internal" && u.last_read_timestamp >= comment.updated_at.timestamp;
        } else {
          return u.last_read_timestamp >= comment.updated_at.timestamp;
        }
      });
    } else {
      return [];
    }
  };

  return (
    <Wrapper className="d-flex align-items-center justify-content-start">
      <div className="clap-count-wrapper">
        <Icon className={comment.user_clap_count ? "mr-2 comment-reaction clap-true" : "mr-2 comment-reaction clap-false"} icon="thumbs-up" onClick={handleReaction} />
        {comment.clap_count}
        {likers.length !== 0 && (
          <span className="hover read-users-container">
            {likers.map((u) => {
              return (
                <span key={u.id}>
                  <Avatar className="mr-2" key={u.id} name={u.name} imageLink={u.profile_image_link} id={u.id} /> <span className="name">{u.name}</span>
                </span>
              );
            })}
          </span>
        )}
      </div>
      {!post.is_read_only && !disableOptions && !post.is_close && (
        <Reply className="ml-3" onClick={handleShowInput}>
          {dictionary.comment}
        </Reply>
      )}
      {
        <div
          role="button"
          className="user-reads-container"
          onClick={() => {
            setShowViewer((prev) => !prev);
          }}
        >
          <span className="no-readers" style={{ cursor: "pointer" }}>
            <Icon className="ml-2 mr-2 seen-indicator" icon="eye" />
            {userReadPost().length}
          </span>
          <Viewers users={userReadPost()} close={() => setShowViewer(false)} show={showViewer} />
        </div>
      }
    </Wrapper>
  );
};

export default CommentCounters;
