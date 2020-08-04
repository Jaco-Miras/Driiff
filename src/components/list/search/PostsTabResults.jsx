import React from "react";
import { PostSearchItem } from "./index";

const PostsTabResults = (props) => {

    const { page, posts, redirect } = props;
    return (
        <ul className="list-group list-group-flush">
            {
                Object.values(posts).slice(page > 1 ? (page*10)-10 : 0, page*10).map((p) => {
                    return <PostSearchItem key={p.id} data={p.data} redirect={redirect}/>
                })
            }
        </ul>
    );
};

export default PostsTabResults;