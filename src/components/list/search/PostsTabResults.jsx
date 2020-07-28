import React from "react";
import { PostSearchItem } from "./index";

const PostsTabResults = (props) => {

    const { page, posts } = props;
    return (
        <ul className="list-group list-group-flush">
            {
                Object.values(posts).slice(page > 1 ? (page*10)-10 : 0, page*10).map((p) => {
                    return <PostSearchItem key={p.id} post={p}/>
                })
            }
        </ul>
    );
};

export default PostsTabResults;