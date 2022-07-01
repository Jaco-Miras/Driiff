import React from "react";
import { useSelector } from "react-redux";

const NotificationBadge = (props) => {
  const { notification, dictionary, user, fromSnooze = false } = props;

  const notifications = useSelector((state) => state.notifications.notifications);
  const sharedWs = useSelector((state) => state.workspaces.sharedWorkspaces);

  const getMustReadText = (data) => {
    const userId = notification.sharedSlug && sharedWs[notification.slug] ? sharedWs[notification.slug].user_auth.id : user.id;
    console.log(data.must_read_users, userId);
    if (data.must_read && data.must_read_users && data.must_read_users.some((u) => u.id === userId && !u.must_read)) return dictionary.mustRead;
    return null;
  };

  const getMustReplyText = (data) => {
    const userId = notification.sharedSlug && sharedWs[notification.slug] ? sharedWs[notification.slug].user_auth.id : user.id;
    if (data.must_reply && data.must_reply_users && data.must_reply_users.some((u) => u.id === userId && !u.must_reply)) return dictionary.replyRequired;
    return null;
  };

  const hasCommentRejectApproval = () => {
    return Object.values(notifications)
      .filter((n) => n.id !== notification.id)
      .some((n) => n.type === "PST_CMT_REJCT_APPRVL" && n.data.post_id === notification.data.post_id && n.id > notification.id);
  };
  /*
  POST_REQST_APPROVAL only visible to users who are selected in the approval
  POST_REQST_APPROVAL badge to be removed if the user has requested change or accepted the proposal
   */

  return (
    <>
      {notification.type === "POST_CREATE" && notification.data && notification.data.is_close === 0 ? (
        fromSnooze ? (
          <p className={"d-flex"}>
            <span className={"badge badge-danger text-white mr-1"}>{getMustReadText(notification.data)}</span>
            <span className={"badge badge-warning mr-1"}>{getMustReplyText(notification.data)}</span>
          </p>
        ) : (
          <p>
            <span className={"badge badge-danger text-white"}>{getMustReadText(notification.data)}</span>
            <span className={"badge badge-warning ml-1"}>{getMustReplyText(notification.data)}</span>
          </p>
        )
      ) : notification.type === "POST_REQST_APPROVAL" &&
        notification.data &&
        notification.data.is_close === 0 &&
        notification.data.users_approval &&
        notification.data.users_approval.find((u) => u.ip_address === null && user.id === u.id) ? (
        <span className={"badge badge-primary text-white"}>{dictionary.actionNeeded}</span>
      ) : (notification.type === "POST_ACCEPT_APPROVAL" || notification.type === "PST_CMT_ACCPT_APPRVL") && notification.data && notification.data.is_close === 0 ? (
        <span className={"badge badge-success text-white"}>{dictionary.accepted}</span>
      ) : notification.type === "POST_REJECT_APPROVAL" &&
        notification.data &&
        notification.data.is_close === 0 &&
        !hasCommentRejectApproval() &&
        notification.data.post_approval_label &&
        notification.data.post_approval_label === "REQUEST_UPDATE" ? (
        <span className={"badge badge-primary text-white"}>{dictionary.changeRequested}</span>
      ) : notification.type === "PST_CMT_REJCT_APPRVL" &&
        notification.data &&
        notification.data.is_close === 0 &&
        !hasCommentRejectApproval() &&
        notification.data.post_approval_label &&
        notification.data.post_approval_label === "REQUEST_UPDATE" ? (
        <span className={"badge badge-primary text-white"}>{dictionary.changeRequested}</span>
      ) : notification.type === "POST_COMMENT" &&
        notification.data &&
        notification.data.is_close === 0 &&
        notification.data.comment_body &&
        !notification.data.comment_body.startsWith("COMMENT_APPROVAL::") &&
        notification.data.post_approval_label &&
        notification.data.post_approval_label === "NEED_ACTION" &&
        notification.data.users_approval &&
        notification.data.users_approval.some((u) => user.id === u.id && !u.is_approved && u.ip_address === null) ? (
        <span></span>
      ) : null}
    </>
  );
};

export default NotificationBadge;
