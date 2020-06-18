import React from "react";

const PostBadge = props => {

    const {post} = props;

    if (post.is_must_read !== 0 || post.is_must_reply !== 0 || post.is_read_only !== 0) {
        return (
            <div className="mr-3 d-sm-inline d-none">
                <div className={`badge 
                    ${post.is_must_read === 1 ?
                      "badge-danger" :
                      post.is_must_reply === 1 ?
                      "badge-warning" :
                      post.is_read_only === 1 ?
                      "badge-info" :
                      "badge-primary"}
                `}>
                    {
                        post.is_must_read === 1 ? "Must read" : post.is_must_reply === 1 ? "Reply required" : "No replies"
                    }
                </div>
            </div>
        );
    } else {
        return null;
    }

};

export default React.memo(PostBadge);