import React from "react";
import Tooltip from "react-tooltip-lite";
import styled from "styled-components";
import {Avatar} from "../../../common";
import {useTimeFormat} from "../../../hooks";

const Wrapper = styled.li`
  cursor: pointer;

  .notification-container {
    max-width: calc(100% - 60px);
  }
  .notification-title {
    overflow: hidden;
    display: block !important;
    text-overflow: ellipsis;
    width: calc(100% - 10px);
    white-space: nowrap;
    line-height: 1.1;
  }
  .list-group-item {
    border: none;
  }

  .avatar {
    margin-right: 1rem;
  }
  p {
    margin: 0;
  }
`;

export const NotificationListItem = (props) => {
  const { notification, actions, redirect, removeOverlay, _t, user } = props;
  const { fromNow } = useTimeFormat();
  const handleRedirect = (e) => {
    e.preventDefault();
    removeOverlay();
    if (notification.is_read === 0) {
      actions.read({ id: notification.id });
    }
    if (notification.type === "NEW_TODO") {
      redirect.toTodos();
    } else {
      let post = { id: notification.data.post_id, title: notification.data.title};
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
          focusOnMessage = {focusOnMessage: notification.data.comment_id};
        }
      }
      redirect.toPost({ workspace, post}, focusOnMessage);
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

  // const { _t } = useTranslation();

  const dictionary = {
    post: _t("NOTIFICATION.POST_POPUP", `Shared a post`),
    comment: _t("NOTIFICATION.COMMENT_POPUP", `Made a comment in ::title::`, {title: notification.data.title}),
    mention: _t("NOTIFICATION.MENTION_POPUP", `Mentioned you in ::title::`, {title: notification.data.title}),
    reminder: _t("NOTIFICATION.REMINDER_POPUP", `You asked to be reminded about ::title::`, {title: notification.data.title})
  };

  const notifDisplay = () => {
    switch (notification.type) {
      case "POST_CREATE": {
        return (
            <div className="notification-container flex-grow-1" onClick={handleRedirect}>
              <span>{notification.author.name}</span>
              <p className="notification-title text-link">{dictionary.post}</p>
              <span className="text-muted small">{fromNow(notification.created_at.timestamp)}</span>
            </div>
        );
      }
      case "POST_COMMENT": {
        return (
            <div className="notification-container flex-grow-1" onClick={handleRedirect}>
              <span>{notification.author.name}</span>
              <p className="notification-title text-link">{dictionary.comment}</p>
              <span className="text-muted small">{fromNow(notification.created_at.timestamp)}</span>
            </div>
        );
      }
      case "POST_MENTION": {
        return (
            <div className="notification-container flex-grow-1" onClick={handleRedirect}>
              <span>{notification.author.name}</span>
              <p className="notification-title text-link">{dictionary.mention}</p>
              <span className="text-muted small">{fromNow(notification.created_at.timestamp)}</span>
            </div>
        );
      }
      case "NEW_TODO": {
        return (
          <div className="notification-container flex-grow-1" onClick={handleRedirect}>
            <span>{user.name}</span>
            <p className="notification-title text-link">{dictionary.reminder}</p>
            <span className="text-muted small">{fromNow(notification.created_at.timestamp)}</span>
          </div>
      );
      }
      default:
        return null;
    }
  };

  const toggleTooltip = () => {
    let tooltips = document.querySelectorAll("span.react-tooltip-lite");

    tooltips.forEach((tooltip) => {
      tooltip.parentElement.classList.toggle("tooltip-active");
    });
  };

  return (
    <Wrapper>
      <span className="list-group-item d-flex hide-show-toggler">
        <div>
          {
            notification.author !== null &&
            <Avatar id={notification.author.id} name={notification.author.name}
                    imageLink={notification.author.profile_image_link}/>
          }
          {
            notification.type === "NEW_TODO" && 
            <Avatar id={user.id} name={user.name}
                    imageLink={user.profile_image_link}/>
          }
        </div>
        {notifDisplay()}
        <div style={{ minWidth: "10px" }}>
          {notification.is_read === 0 ? (
            <Tooltip arrowSize={5} distance={10} onToggle={toggleTooltip} content="Mark as read">
              <i onClick={handleReadUnread} className="hide-show-toggler-item fa fa-circle-o font-size-11" />
            </Tooltip>
          ) : (
            <Tooltip arrowSize={5} distance={10} onToggle={toggleTooltip} content="Mark as unread">
              <i onClick={handleReadUnread} className="hide-show-toggler-item fa fa-check font-size-11" />
            </Tooltip>
          )}
        </div>
      </span>
    </Wrapper>
  );
};

export default NotificationListItem;
