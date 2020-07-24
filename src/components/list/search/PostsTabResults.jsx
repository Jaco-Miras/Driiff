import React from "react";
import { PostSearchItem } from "./index";

const PostsTabResults = (props) => {

    const { posts } = props;

    return (
        <ul className="list-group list-group-flush">
            {
                Object.values(posts).map((p) => {
                    return <PostSearchItem key={p.id} post={p}/>
                })
            }
        </ul>
    );
};

export default PostsTabResults;