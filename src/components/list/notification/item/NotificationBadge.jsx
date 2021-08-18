import React from "react";
import { useSelector } from "react-redux";

const NotificationBadge = (props) => {
  const { notification, dictionary, user, fromSnooze = false } = props;

  const notifications = useSelector((state) => state.notifications.notifications);

  const getMustReadText = (data) => {
    if (data.must_read && data.must_read_users && data.must_read_users.some((u) => u.id === user.id && !u.must_read)) return dictionary.mustRead;
    return null;
  };

  const getMustReplyText = (data) => {
    if (data.must_reply && data.must_reply_users && data.must_reply_users.some((u) => u.id === user.id && !u.must_reply)) return dictionary.needsReply;
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
      {notification.type === "POST_CREATE" ? (
        fromSnooze ? (
          <p className={"d-flex"} style={{ position: "absolute" }}>
            <span className={"badge badge-danger text-white mr-1"}>{getMustReadText(notification.data)}</span>
            <span className={"badge badge-warning text-white  mr-1"}>{getMustReplyText(notification.data)}</span>
          </p>
        ) : (
          <p>
            <span className={"badge badge-danger text-white"}>{getMustReadText(notification.data)}</span>
            <span className={"badge badge-warning text-white"}>{getMustReplyText(notification.data)}</span>
          </p>
        )
      ) : notification.type === "POST_REQST_APPROVAL" ? (
        notification.data.users_approval && notification.data.users_approval.find((u) => u.ip_address === null && user.id === u.id) ? (
          <span className={"badge badge-primary text-white"}>{dictionary.actionNeeded}</span>
        ) : null
      ) : notification.type === "POST_ACCEPT_APPROVAL" || notification.type === "PST_CMT_ACCPT_APPRVL" ? (
        <span className={"badge badge-success text-white"}>{dictionary.accepted}</span>
      ) : notification.type === "POST_REJECT_APPROVAL" && !hasCommentRejectApproval() && notification.data.post_approval_label && notification.data.post_approval_label === "REQUEST_UPDATE" ? (
        <span className={"badge badge-primary text-white"}>{dictionary.changeRequested}</span>
      ) : notification.type === "PST_CMT_REJCT_APPRVL" && !hasCommentRejectApproval() && notification.data.post_approval_label && notification.data.post_approval_label === "REQUEST_UPDATE" ? (
        <span className={"badge badge-primary text-white"}>{dictionary.changeRequested}</span>
      ) : notification.type === "POST_COMMENT" && notification.data.post_approval_label && notification.data.post_approval_label === "NEED_ACTION" ? (
        <span className={"badge badge-primary text-white"}>{dictionary.actionNeeded}</span>
      ) : null}
    </>
  );
};

export default NotificationBadge;
