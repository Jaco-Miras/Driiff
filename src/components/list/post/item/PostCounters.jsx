import React from "react";
import styled from "styled-components";
import { Avatar, SvgIconFeather } from "../../../common";
import Viewers from "./Viewers";
import { useTranslationActions } from "../../../hooks";
import { useSelector } from "react-redux";

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
    color: ${(props) => props.theme.colors.primary};
    fill: ${(props) => props.theme.colors.primary};
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
    span {
      align-items: center;
    }
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
  const { dictionary, post, viewerIds, viewers, handleReaction } = props;
  const user = useSelector((state) => state.session.user);
  const users = useSelector((state) => state.users.users);
  const { _t } = useTranslationActions();
  const readByUsers = post && post.is_must_read && post.must_read_users.length > 0 ? post.must_read_users.filter((u) => u.must_read) : [];
  const hasRead = readByUsers.some((u) => u.id === user.id);
  const likers = Object.values(users).filter((u) => post.claps.some((c) => c.user_id === u.id));
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
                  <Avatar className="mr-2" key={u.id} name={u.name} imageLink={u.profile_image_link} id={u.id} /> <span className="name">{u.name}</span>
                </span>
              );
            })}
          </span>
        )}
      </div>
      <div className="readers-container ml-auto text-muted">
        {post.is_must_read && readByUsers.length > 0 && Object.values(users).length > 1 && (
          <div className="user-reads-container read-by">
            {hasRead && (
              <span className="mr-2">
                <Icon className="mr-2" icon="check" /> {dictionary.alreadyReadThis}
              </span>
            )}
            <span className="no-readers">
              {_t("POST.READY_BY_NUMBER_OF_USERS", "Read by ::user_count:: users", {
                user_count: readByUsers.length,
              })}
            </span>
            <span className="hover read-users-container">
              {readByUsers.map((u) => {
                return (
                  <span key={u.id}>
                    <Avatar className="mr-2" key={u.id} name={u.name} imageLink={users[u.id].profile_image_thumbnail_link} id={u.id} /> <span className="name">{u.name}</span>
                  </span>
                );
              })}
            </span>
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
                    <Avatar className="mr-2" key={u.id} name={u.name} imageLink={u.profile_image_link} id={u.id} /> <span className="name">{u.name}</span>
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
