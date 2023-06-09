import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useGetSlug } from "../../hooks";

const PostBadge = (props) => {
  const { className = "", isBadgePill = false, post, dictionary, user, cbGetWidth = () => {} } = props;

  const sharedWs = useSelector((state) => state.workspaces.sharedWorkspaces);
  const refs = {
    container: useRef(null),
  };

  useEffect(() => {
    if (refs.container.current) {
      cbGetWidth(refs.container.current.clientWidth);
    }
  }, [post]);

  const { slug } = useGetSlug();
  const userId = post.slug && post.slug !== slug && sharedWs[post.slug] ? sharedWs[post.slug].user_auth.id : user.id;

  const isApprover = post.users_approval.some((ua) => ua.id === userId && ua.is_approved === false);
  const usersApproval = post.users_approval;
  const usersPending = usersApproval.filter((u) => u.ip_address === null);

  const renderApprovalLabel = (status) => {
    switch (status) {
      case "ACCEPTED": {
        return dictionary.accepted;
      }
      case "NEED_ACTION": {
        if (isApprover) return dictionary.actionNeeded;
        else return null;
      }
      case "REQUEST_UPDATE": {
        if (post.author.id === userId) return dictionary.changeRequested;
        return null;
      }
      case "SPLIT": {
        return "Split";
      }
      case "REQUEST_APPROVAL": {
        if (post.author.id === userId && usersPending.length === usersApproval.length) return dictionary.requestForApproval;
        return null;
      }
      default:
        return null;
    }
  };

  return (
    <div ref={refs.container} className="post-badge">
      {(post.is_must_read || post.is_must_reply || post.is_read_only || post.type === "draft_post" || post.is_archived !== 0 || post.is_personal === true) && (
        <>
          {!post.recipients.every((r) => r.type === "USER") && post.recipients.some((r) => r.type === "USER") && (
            <div className={`${className} mr-3 d-sm-inline`}>
              <div className={`badge badge-light text-white ${isBadgePill ? "badge-pill" : ""}`}>{dictionary.private}</div>
            </div>
          )}
          {post.is_archived === 1 && (
            <div className={`${className} mr-3 d-sm-inline`}>
              <div className={`badge badge-light text-white ${isBadgePill ? "badge-pill" : ""}`}>{dictionary.archived}</div>
            </div>
          )}
          {post.type === "draft_post" && (
            <div className={`${className} mr-3 d-sm-inline`}>
              <div className={`badge badge-light text-white ${isBadgePill ? "badge-pill" : ""}`}>{dictionary.draft}</div>
            </div>
          )}
          {!post.is_close && ((post.author.id === userId && post.is_must_read) || (post.must_read_users && post.must_read_users.some((u) => u.id === userId && !u.must_read))) && (
            <div className={`${className} mr-3 d-sm-inline ${post.author.id === userId ? "opacity-2" : ""}`}>
              <div className={`badge badge-danger ${isBadgePill ? "badge-pill" : ""}`}>{dictionary.mustRead}</div>
            </div>
          )}
          {!post.is_close && ((post.author.id === userId && post.is_must_reply) || (post.must_reply_users && post.must_reply_users.some((u) => u.id === userId && !u.must_reply))) && (
            <div className={`${className} mr-3 d-sm-inline ${post.author.id === userId ? "opacity-2" : ""}`}>
              <div className={`badge badge-warning ${isBadgePill ? "badge-pill" : ""}`}>{dictionary.replyRequired}</div>
            </div>
          )}
          {post.is_read_only && (
            <div className={`${className} mr-3 d-sm-inline`}>
              <div className={`badge badge-info ${isBadgePill ? "badge-pill" : ""}`}>{dictionary.noReplies}</div>
            </div>
          )}
        </>
      )}
      {post.post_approval_label && !post.is_close && (
        <div className={`${className} mr-3 d-sm-inline`}>
          <div className={`badge ${post.post_approval_label === "ACCEPTED" ? "badge-success" : "badge-primary"} ${isBadgePill ? "badge-pill" : ""}`}>{renderApprovalLabel(post.post_approval_label)}</div>
        </div>
      )}
      {post.is_close && (
        <div className={`${className} mr-3 d-sm-inline`}>
          <div className={`badge badge-closed ${isBadgePill ? "badge-pill" : ""}`}>{dictionary.repliesClosed}</div>
        </div>
      )}
    </div>
  );
};

export default React.memo(PostBadge);
