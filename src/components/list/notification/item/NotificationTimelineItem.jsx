import React from "react";
import styled from "styled-components";
import { replaceChar, stripHtml } from "../../../../helpers/stringFormatter";
import { Avatar, SvgIconFeather } from "../../../common";
import { useTimeFormat } from "../../../hooks";
import NotificationBadge from "./NotificationBadge";

const Icon = styled(SvgIconFeather)`
  width: 12px;
`;
const Wrapper = styled.div`
  cursor: pointer;
  padding: 1.5em 1.5em 0em 1.5em !important;
  background: ${(props) => (props.isRead ? "transparent" : props.darkMode === "1" ? "#2a2f31" : "#F9F9F9")};

  border-bottom: ${(props) => (props.darkMode === "1" ? "1px solid #9b9b9b1a" : "1px solid #ebebeb;")};
  .avatar {
    margin-right: 1rem;
  }
  p {
    margin: 0;
  }
  h6 {
    color: ${(props) => (props.darkMode === "1" ? "#afb8bd" : "#000000")};
    font-family: Inter;
    font-size: 12px;
    letter-spacing: 0;
    line-height: 15px;
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
  .badge-danger {
    background-color: #ff4445;
  }
  .badge-success {
    background-color: #00c851;
  }
  :before {
    display: none !important;
  }
`;

export const NotificationTimelineItem = (props) => {
  const { notification, actions, history, redirect, user, _t, darkMode } = props;

  const { fromNow } = useTimeFormat();

  const handleRedirect = (e) => {
    e.preventDefault();
    if (notification.is_read === 0) {
      actions.read({ id: notification.id });
    }
    if (notification.type === "NEW_TODO") {
      redirect.toTodos();
    } else if (notification.type === "WORKSPACE_ADD_MEMBER") {
      let payload = {
        id: notification.data.id,
        name: notification.data.title,
        folder_id: notification.data.workspace_folder_id !== 0 ? notification.data.workspace_folder_id : null,
        folder_name: notification.data.workspace_folder_name !== "" ? notification.data.workspace_folder_name : null,
      };
      redirect.toWorkspace(payload);
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

  const handleAuthorNameClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (notification.author) {
      history.push(`/profile/${notification.author.id}/${replaceChar(notification.author.name)}`);
    }
  };

  const dictionary = {
    notificationNewPost: _t("NOTIFICATION.SHARED_A_POST", "shared a post"),
    notificationComment: _t("NOTIFICATION.MADE_A_COMMENT", "made a comment"),
    notificationMention: _t("NOTIFICATION.MENTIONED_YOU_IN", "mentioned you in"),
    hasAcceptedProposal: _t("POST.HAS_ACCEPTED_PROPOSAL", "has accepted the proposal."),
    hasRequestedChange: _t("POST.HAS_REQUESTED_CHANGE", "has requested a change."),
    sentProposal: _t("POST.SENT_PROPOSAL", "sent a proposal."),
    notificationClosedPost: _t("NOTIFICATION.CLOSED_THE_POST", "closed the post"),
    addedYouInWorkspace: _t("NOTIFICATION.WORKSPACE_ADDED_MEMBER", "added you in a workspace"),
    reminder: _t("NOTIFICATION.REMINDER_ICON", "Reminder"),
    mustRead: _t("NOTIFICATION.MUST_READ", "Must read"),
    needsReply: _t("NOTIFICATION.NEEDS_REPLY", "Needs reply"),
    markAsRead: _t("NOTIFICATION.MARK_AS_READ", "Mark as read"),
    markAsUnread: _t("NOTIFICATION.MARK_AS_UNREAD", "Mark as unread"),
    actionNeeded: _t("POST.ACTION_NEEDED", "Action needed"),
    changeRequested: _t("POST.CHANGE_REQUESTED", "Change requested"),
    accepted: _t("POST.ACCEPTED", "Accepted"),
    replyRequired: _t("POST.REPLY_REQUIRED", "Reply required"),
  };

  const renderTitle = () => {
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
      case "PST_CMT_REJCT_APPRVL": {
        return (
          <>
            <span>
              {notification.author.name} {dictionary.hasRequestedChange}
            </span>
          </>
        );
      }
      case "PST_CMT_ACCPT_APPRVL": {
        return (
          <>
            <span>
              {notification.author.name} {dictionary.hasAcceptedProposal}
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
      case "WORKSPACE_ADD_MEMBER": {
        return (
          <>
            <span onClick={handleAuthorNameClick} className="author-name text-link">
              {notification.author ? notification.author.name : null}{" "}
            </span>
            <span>{dictionary.addedYouInWorkspace}</span>
          </>
        );
      }
      default:
        return null;
    }
  };

  return (
    <Wrapper className="timeline-item timeline-item-no-line" isRead={notification.is_read} darkMode={darkMode}>
      <div>
        {notification.author ? (
          <Avatar
            id={notification.author.id}
            name={notification.author.name}
            imageLink={notification.author.profile_image_thumbnail_link ? notification.author.profile_image_thumbnail_link : notification.author.profile_image_link}
            showSlider={true}
          />
        ) : (
          <Avatar id={user.id} name={user.name} imageLink={user.profile_image_thumbnail_link ? user.profile_image_thumbnail_link : user.profile_image_link} showSlider={true} />
        )}
      </div>
      <div>
        <div onClick={handleRedirect}>
          <h6 className="d-flex justify-content-between mb-4">
            <div>
              <span style={{ fontWeight: "bold" }}>
                {renderTitle()}:{" "}
                {notification.type === "NEW_TODO" ? (
                  <>{stripHtml(notification.data.description)}</>
                ) : notification.type === "POST_CREATE" ||
                  notification.type === "POST_REQST_APPROVAL" ||
                  notification.type === "POST_ACCEPT_APPROVAL" ||
                  notification.type === "POST_REJECT_APPROVAL" ||
                  notification.type === "CLOSED_POST" ||
                  notification.type === "WORKSPACE_ADD_MEMBER" ? (
                  <span style={{ fontWeight: "normal" }}>{notification.data && notification.data.title}</span>
                ) : (
                  <span style={{ fontWeight: "normal" }}>
                    {notification.data.comment_body && notification.data.comment_body.startsWith("COMMENT_APPROVAL")
                      ? JSON.parse(notification.data.comment_body.replace("COMMENT_APPROVAL::", "")).message
                      : stripHtml(notification.data.comment_body)}
                  </span>
                )}
              </span>
              <p style={{ fontWeight: "normal", color: "#8B8B8B" }}>
                {notification.type === "NEW_TODO" && (
                  <>
                    <Icon icon="calendar" /> {dictionary.reminder}{" "}
                  </>
                )}
                {notification.data.workspaces && notification.data.workspaces.length > 0 && notification.data.workspaces[0].workspace_name && (
                  <>
                    <Icon icon="folder" />
                    <span style={{ verticalAlign: "middle" }}> {notification.data.workspaces[0].workspace_name} </span>{" "}
                  </>
                )}
                {notification.data.workspaces && notification.data.workspaces.length > 0 && notification.data.workspaces[0].topic_name && (
                  <>
                    <Icon icon="compass" />
                    <span style={{ verticalAlign: "middle" }}> {notification.data.workspaces[0].topic_name} </span>{" "}
                  </>
                )}
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <span className="text-muted font-weight-normal">{fromNow(notification.created_at.timestamp)}</span>
              <p style={{ textAlign: "right", lineHeight: "1" }}>
                {notification.is_read === 0 ? (
                  <span title={dictionary.markAsRead} data-toggle="tooltip" onClick={handleReadUnread} className="cursor-pointer">
                    ...
                  </span>
                ) : (
                  <span title={dictionary.markAsUnread} data-toggle="tooltip" onClick={handleReadUnread} className="cursor-pointer">
                    ...
                  </span>
                )}
              </p>
              <NotificationBadge notification={notification} dictionary={dictionary} user={user} />
            </div>
          </h6>
        </div>
      </div>
    </Wrapper>
  );
};

export default NotificationTimelineItem;
