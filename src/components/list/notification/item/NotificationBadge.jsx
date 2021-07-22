import React from "react";

const NotificationBadge = (props) => {
  const { notification, dictionary, user } = props;

  const getMustReadText = (data) => {
    if ((data.must_read && data.required_users && data.required_users.some((u) => u.id === user.id && !u.must_read)) || (data.must_read_users && data.must_read_users.some((u) => u.id === user.id && !u.must_read)))
      return dictionary.mustRead;
    return null;
  };

  const getMustReplyText = (data) => {
    if ((data.must_reply && data.required_users && data.required_users.some((u) => u.id === user.id && !u.must_reply)) || (data.must_reply_users && data.must_reply_users.some((u) => u.id === user.id && !u.must_reply)))
      return dictionary.needsReply;
    return null;
  };
  /*
  POST_REQST_APPROVAL only visible to users who are selected in the approval
  POST_REQST_APPROVAL badge to be removed if the user has requested change or accepted the proposal
   */
  return (
    <>
      {notification.type === "POST_CREATE" ? (
        <p>
          {" "}
          <span className={"badge badge-danger text-white"}>{getMustReadText(notification.data)}</span>
          <span className={"badge badge-success text-white"}>{getMustReplyText(notification.data)}</span>
        </p>
      ) : notification.type === "POST_REQST_APPROVAL" ? (
        <span className={"badge badge-primary text-white"}>{dictionary.acstionNeeded}</span>
      ) : notification.type === "POST_ACCEPT_APPROVAL" ? (
        <span className={"badge badge-success text-white"}>{dictionary.accepted}</span>
      ) : notification.type === "POST_REJECT_APPROVAL" ? (
        <span className={"badge badge-primary text-white"}>{dictionary.changeRequested}</span>
      ) : null}
    </>
  );
};

export default NotificationBadge;
