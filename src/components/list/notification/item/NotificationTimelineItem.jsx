import React, { useCallback } from "react";
import styled from "styled-components";
import { replaceChar, stripHtml } from "../../../../helpers/stringFormatter";
import { Avatar } from "../../../common";
import { useTimeFormat } from "../../../hooks";

const Wrapper = styled.div`
  .avatar {
    margin-right: 1rem;
  }
  p {
    margin: 0;
  }

  h6 {
    .text-link {
      color: #828282;
      cursor: hand;
      cursor: pointer;

      &:hover {
        color: #000;
      }
    }
  }

  .notification-body-wrapper {
    .border-left-active {
      border-left: 5px solid #822492 !important;
    }
    i {
      left: 40px;
      position: relative;
    }
    &:hover {
      i {
        opacity: 1;
        visibility: visible;
      }
    }
    i {
      opacity: 0;
      visibility: hidden;
    }
  }
`;

export const NotificationTimelineItem = (props) => {
  const { notification, actions, history, redirect, user, _t } = props;
  const { fromNow } = useTimeFormat();

  const handleRedirect = (e) => {
    e.preventDefault();
    if (notification.is_read === 0) {
      actions.read({ id: notification.id });
    }
    if (notification.type === "NEW_TODO") {
      redirect.toTodos();
    } else {
      let post = { id: notification.data.post_id, title: notification.data.title };
      let workspace = null;
      let focusOnMessage = null;
      if (notification.data.workspaces && notification.data.workspaces.length) {
        workspace = notification.data.workspaces[0];
        workspace = {
          id: workspace.topic_id,
          name: workspace.topic_name,
          folder_id: workspace.workspace_id ? workspace.workspace_id : null,
          folder_name: workspace.workspace_name ? workspace.workspace_name : null,
        };
      }
      if (notification.type === "POST_COMMENT" || notification.type === "POST_MENTION") {
        if (notification.data.comment_id) {
          focusOnMessage = { focusOnMessage: notification.data.comment_id };
        }
      }
      redirect.toPost({ workspace, post }, focusOnMessage);
    }
  };

  const handleReadUnread = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (notification.is_read === 0) {
      actions.read({ id: notification.id });
    } else {
      actions.unread({ id: notification.id });
    }
  };

  /*const handleRemove = (e) => {
      e.preventDefault();
      e.stopPropagation();
      actions.remove({ id: notification.id });
    };*/

  const handleAuthorNameClick = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      history.push(`/profile/${notification.author.id}/${replaceChar(notification.author.name)}`);
    },
    [notification.author]
  );

  //const { _t } = useTranslation();

  const dictionary = {
    notificationNewPost: _t("NOTIFICATION.NEW_POST", `shared a <span class="${notification.is_read ? "text-link" : "text-primary font-weight-bold text-link"}">post</span>`),
    notificationComment: _t("NOTIFICATION.COMMENT", `made a <span class="${notification.is_read ? "text-link" : "text-primary font-weight-bold text-link"}">comment</span> in <span class="text-link">${notification.data.title}`),
    notificationMention: _t("NOTIFICATION.MENTION", `<span class="${notification.is_read ? "text-link" : "text-primary font-weight-bold text-link"}">mentioned</span> you in`),
    hasAcceptedProposal: _t("POST.HAS_ACCEPTED_PROPOSAL", "has accepted the proposal."),
    hasRequestedChange: _t("POST.HAS_REQUESTED_CHANGE", "has requested a change."),
    sentProposal: _t("POST.SENT_PROPOSAL", "sent a proposal."),
    notificationClosedPost: _t("NOTIFICATION.CLOSED_POST", `closed the <span class="${notification.is_read ? "text-link" : "text-primary font-weight-bold text-link"}">post</span>`),
  };

  const renderTitle = useCallback(() => {
    switch (notification.type) {
      case "POST_CREATE": {
        return (
          <>
            <span onClick={handleAuthorNameClick} className="author-name text-link">
              {notification.author.name}{" "}
            </span>
            <span dangerouslySetInnerHTML={{ __html: dictionary.notificationNewPost }} />
          </>
        );
      }
      case "POST_COMMENT": {
        return (
          <>
            <span onClick={handleAuthorNameClick} className="author-name text-link">
              {notification.author.name}{" "}
            </span>
            <span dangerouslySetInnerHTML={{ __html: dictionary.notificationComment }} />
          </>
        );
      }
      case "POST_MENTION": {
        return (
          <>
            <span onClick={handleAuthorNameClick} className="author-name text-link">
              {notification.author.name}
            </span>{" "}
            <span dangerouslySetInnerHTML={{ __html: dictionary.notificationMention }} />
            <span className="text-link" onClick={handleRedirect}>
              {" "}
              {notification.data.title}
            </span>
          </>
        );
      }
      case "NEW_TODO": {
        return (
          <>
            <span>{_t("NOTIFICATION.REMINDER", "You asked to be reminded about ::title::", { title: notification.data.title })}</span>
          </>
        );
      }
      case "POST_ACCEPT_APPROVAL": {
        return (
          <>
            <span>
              {notification.author.name} {dictionary.hasAcceptedProposal}
            </span>
          </>
        );
      }
      case "POST_REJECT_APPROVAL": {
        return (
          <>
            <span>
              {notification.author.name} {dictionary.hasRequestedChange}
            </span>
          </>
        );
      }
      case "POST_REQST_APPROVAL": {
        return (
          <>
            <span>
              {notification.author.name} {dictionary.sentProposal}
            </span>
          </>
        );
      }
      case "CLOSED_POST": {
        return (
          <>
            <span onClick={handleAuthorNameClick} className="author-name text-link">
              {notification.author.name}{" "}
            </span>
            <span dangerouslySetInnerHTML={{ __html: dictionary.notificationClosedPost }} />
          </>
        );
      }
      default:
        return null;
    }
  }, [notification]);

  return (
    <Wrapper className="timeline-item">
      <div>
        {notification.author ? (
          <Avatar id={notification.author.id} name={notification.author.name} imageLink={notification.author.profile_image_thumbnail_link ? notification.author.profile_image_thumbnail_link : notification.author.profile_image_link} />
        ) : (
          <Avatar id={user.id} name={user.name} imageLink={user.profile_image_thumbnail_link ? user.profile_image_thumbnail_link : user.profile_image_link} />
        )}
      </div>
      <div>
        <div onClick={handleRedirect}>
          <h6 className="d-flex justify-content-between mb-4">
            <span>{renderTitle()}</span>
            <span className="text-muted font-weight-normal">{fromNow(notification.created_at.timestamp)}</span>
          </h6>
          <span className="notification-body-wrapper">
            <div className={`notification-body mb-3 border p-3 border-radius-1 d-flex justify-content-between align-items-center mr-4 ${notification.is_read === 0 ? "border-left-active" : ""}`}>
              <div>
                {notification.type === "NEW_TODO" ? (
                  <>{stripHtml(notification.data.description)}</>
                ) : notification.type === "POST_CREATE" ||
                  notification.type === "POST_REQST_APPROVAL" ||
                  notification.type === "POST_ACCEPT_APPROVAL" ||
                  notification.type === "POST_REJECT_APPROVAL" ||
                  notification.type === "CLOSED_POST" ? (
                  <>{notification.data && notification.data.title}</>
                ) : (
                  <>{stripHtml(notification.data.comment_body)}</>
                )}
              </div>
              <div>
                {notification.is_read === 0 ? (
                  <i title="Mark as read" data-toggle="tooltip" onClick={handleReadUnread} className="cursor-pointer fa fa-circle-o font-size-11" />
                ) : (
                  <i title="Mark as unread" data-toggle="tooltip" onClick={handleReadUnread} className="cursor-pointer fa fa-check font-size-11" />
                )}
              </div>
            </div>
          </span>
        </div>
      </div>
    </Wrapper>
  );
};

export default NotificationTimelineItem;
