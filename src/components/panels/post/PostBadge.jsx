import React from "react";

const PostBadge = props => {

    const {className = "", isBadgePill = false, post} = props;

    if (post.is_must_read !== 0 || post.is_must_reply !== 0 || post.is_read_only !== 0 || post.type === "draft_post") {
        return (
            <>
                {
                    post.type === "draft_post" &&
                    <div className={`${className} mr-3 d-sm-inline d-none`}>
                        <div className={`badge badge-light text-white ${isBadgePill ? "badge-pill" : ""}`}>
                            Draft
                        </div>
                    </div>
                }
                {
                    post.is_must_read === 1 &&
                    <div className={`${className} mr-3 d-sm-inline d-none`}>
                        <div className={`badge badge-danger ${isBadgePill ? "badge-pill" : ""}`}>
                            Must read
                        </div>
                    </div>
                }
                {
                    post.is_must_reply === 1 &&
                    <div className={`${className} mr-3 d-sm-inline d-none`}>
                        <div className={`badge badge-warning ${isBadgePill ? "badge-pill" : ""}`}>
                            Reply required
                        </div>
                    </div>
                }
                {
                    post.is_read_only === 1 &&
                    <div className={`${className} mr-3 d-sm-inline d-none`}>
                        <div className={`badge badge-info ${isBadgePill ? "badge-pill" : ""}`}>
                            No replies
                        </div>
                    </div>
                }
            </>
        );
    } else {
        return <></>;
    }

};

export default React.memo(PostBadge);