import React from "react";

const CompanyPostBadge = (props) => {

  const { className = "", isBadgePill = false, post, dictionary } = props;

  return (
    <>
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
          {post.is_must_read && (
            <div className={`${className} mr-3 d-sm-inline d-none`}>
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
    </>
  );
};

export default React.memo(CompanyPostBadge);
