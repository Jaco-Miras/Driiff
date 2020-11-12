import React, { useEffect, useRef } from "react";

const CompanyPostBadge = (props) => {

  const {
    className = "", isBadgePill = false, post, dictionary, user, cbGetWidth = () => {
    }
  } = props;
  const hasRead = post.user_reads.some(u => u.id === user.id);

  const refs = {
    container: useRef(null)
  };

  useEffect(() => {
    if (refs.container.current) {
      cbGetWidth(refs.container.current.clientWidth);
    }
  }, [post]);

  return (
    <div ref={refs.container}>
      {
        (post.is_must_read || post.is_must_reply || post.is_read_only ||
          post.type === "draft_post" || post.is_archived !== 0 || post.is_personal === true) &&
        <>
          {post.is_personal === true && (
            <div className={`${className} mr-3 d-sm-inline d-none`}>
              <div
                className={`badge badge-light text-white ${isBadgePill ? "badge-pill" : ""}`}>{dictionary.private}</div>
            </div>
          )}
          {post.is_archived === 1 && (
            <div className={`${className} mr-3 d-sm-inline d-none`}>
              <div
                className={`badge badge-light text-white ${isBadgePill ? "badge-pill" : ""}`}>{dictionary.archived}</div>
            </div>
          )}
          {post.type === "draft_post" && (
            <div className={`${className} mr-3 d-sm-inline d-none`}>
              <div
                className={`badge badge-light text-white ${isBadgePill ? "badge-pill" : ""}`}>{dictionary.draft}</div>
            </div>
          )}
          {post.is_must_read && (post.author.id === user.id || !hasRead) && (
            <div className={`${className} mr-3 d-sm-inline d-none ${post.author.id === user.id ? "opacity-2" : ""}`}>
              <div className={`badge badge-danger ${isBadgePill ? "badge-pill" : ""}`}>{dictionary.mustRead}</div>
            </div>
          )}
          {post.is_must_reply && (
            <div className={`${className} mr-3 d-sm-inline d-none`}>
              <div className={`badge badge-warning ${isBadgePill ? "badge-pill" : ""}`}>{dictionary.replyRequired}</div>
            </div>
          )}
          {post.is_read_only && (
            <div className={`${className} mr-3 d-sm-inline d-none`}>
              <div className={`badge badge-info ${isBadgePill ? "badge-pill" : ""}`}>{dictionary.noReplies}</div>
            </div>
          )}
        </>
      }
    </div>
  );
};

export default React.memo(CompanyPostBadge);
