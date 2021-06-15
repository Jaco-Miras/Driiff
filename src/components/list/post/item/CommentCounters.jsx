import React from "react";
import styled from "styled-components";
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
  const { comment, dictionary, disableOptions, likers, post, handleReaction, handleShowInput } = props;

  const userReadPost = () => {
    let filter_post_read = [];
    if (post.post_reads) {
      return post.post_reads.filter((u) => u.last_read_timestamp >= comment.updated_at.timestamp);
    }
    return filter_post_read;
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
                  <Avatar className="mr-2" key={u.id} name={u.name} imageLink={u.profile_image_thumbnail_link ? u.profile_image_thumbnail_link : u.profile_image_link} id={u.id} /> <span className="name">{u.name}</span>
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
        <div className="user-reads-container">
          <span className="no-readers">
            <Icon className="ml-2 mr-2 seen-indicator" icon="eye" />
            {userReadPost().length}
          </span>
          <Viewers users={userReadPost()} />
        </div>
      }
    </Wrapper>
  );
};

export default CommentCounters;
