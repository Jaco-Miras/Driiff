import React from "react";
import styled from "styled-components";
import { Avatar, SvgIconFeather } from "../../../common";
import Viewers from "./Viewers";

const Counters = styled.div`
  width: 100%;
  padding: 0.5rem 1.5rem;
  flex-wrap: wrap;
  .seen-indicator,
  .post-reaction {
    cursor: pointer;
  }
  img {
    border-radius: 6px;
    max-height: 250px;
  }
  .clap-true {
    color: #7a1b8b;
    fill: #7a1b8b;
  }
  .readers-container {
    @media (max-width: 575.99px) {
      flex: 0 1 100%;
      .clap-count-wrapper {
        display: inline-block;
        margin-right: 0.5rem;
      }
      .user-reads-container {
        .not-read-users-container,
        .read-users-container {
          right: -75px;
        }
        &.read-by {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .not-read-users-container,
          .read-users-container {
            right: -20px;
          }
        }
      }
    }
  }
  .read-users-container {
    .avatar.avatar-md {
      min-height: 2.7rem;
      min-width: 2.7rem;
    }
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

  &.close {
    cursor: pointer;
  }
`;

const PostCounters = (props) => {
  const { dictionary, hasRead, likers, post, readByUsers, viewerIds, viewers, handleReaction } = props;
  return (
    <Counters className="d-flex align-items-center">
      <div className="clap-count-wrapper d-none d-sm-flex">
        <Icon className={post.user_clap_count ? "mr-2 post-reaction clap-true" : "mr-2 post-reaction clap-false"} icon="thumbs-up" onClick={handleReaction} />
        {post.clap_count}
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
      <div className="readers-container ml-auto text-muted">
        {(readByUsers.length > 0 || (post.required_users && post.required_users.length > 0)) && post.is_must_read && (
          <div className="user-reads-container read-by">
            {hasRead && (
              <span className="mr-2">
                <Icon className="mr-2" icon="check" /> {dictionary.alreadyReadThis}
              </span>
            )}
            <span className="no-readers">{dictionary.readByNumberofUsers}</span>
            <span className="hover read-users-container">
              {readByUsers.map((u) => {
                return (
                  <span key={u.id}>
                    <Avatar className="mr-2" key={u.id} name={u.name} imageLink={u.profile_image_thumbnail_link ? u.profile_image_thumbnail_link : u.profile_image_link} id={u.id} /> <span className="name">{u.name}</span>
                  </span>
                );
              })}
            </span>
            {/* {post.required_users && post.required_users.length > 0 && post.is_must_read && <span className="not-readers">&nbsp; {dictionary.ofNumberOfUsers}</span>}
            <span className="hover not-read-users-container">
              {post.required_users &&
                post.required_users.map((u) => {
                  return (
                    <span key={u.id}>
                      <Avatar className="mr-2" key={u.id} name={u.name} imageLink={null} id={u.id} /> <span className="name">{u.name}</span>
                    </span>
                  );
                })}
            </span> */}
          </div>
        )}
        <div className="clap-count-wrapper d-sm-none">
          <Icon className={post.user_clap_count ? "mr-2 post-reaction clap-true" : "mr-2 post-reaction clap-false"} icon="thumbs-up" onClick={handleReaction} />
          {post.clap_count}
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
        <Icon className="mr-2" icon="message-square" />
        {post.reply_count}
        {
          <div className="user-reads-container">
            <span className="no-readers">
              <Icon className="ml-2 mr-2 seen-indicator" icon="eye" />
              {viewerIds.length}
            </span>
            <Viewers users={viewers} />
          </div>
        }
      </div>
    </Counters>
  );
};

export default PostCounters;
