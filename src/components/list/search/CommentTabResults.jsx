import React from "react";
import { CommentSearchItem } from "./index";

const CommentTabResults = (props) => {

    const { comments, page, redirect } = props;
    return (
        <ul className="list-group list-group-flush">
            {
                Object.values(comments).slice(page > 1 ? (page*10)-10 : 0, page*10).map((c) => {
                    return <CommentSearchItem key={c.id} comment={c} redirect={redirect}/>
                })
            }
        </ul>
    );
};

export default CommentTabResults;