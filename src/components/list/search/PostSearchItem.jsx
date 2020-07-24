import React from "react";

const PostSearchItem = (props) => {

    const { post } = props;

    return (
        <li className="list-group-item p-l-0 p-r-0">
            <h5>{post.data.post.title}</h5>
            <p className="text-muted">post body here</p>
            <div className="text-muted font-size-13">
            <ul className="list-inline">
                <li className="list-inline-item">
                <span className="badge badge-secondary">Label here</span>
                </li>
                <li className="list-inline-item">Date here</li>
            </ul>
            </div>
        </li>
    );
};

export default PostSearchItem;