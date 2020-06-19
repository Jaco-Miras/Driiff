import React from "react";
import styled from "styled-components";
import {localizeChatTimestamp} from "../../../../helpers/momentFormatJS";
import {CheckBox} from "../../../forms";

const Wrapper = styled.li`
    cursor: pointer;
    cursor: hand;
        
    .done {
        text-decoration: line-through;
        color: #00c851;
    }
    .avatar {
        cursor: pointer;
        cursor: hand;
    }
    .user-name {
        cursor: pointer;
        cursor: hand;
    }
    .feather-message-circle {
        cursor: pointer;
        cursor: hand;
    }
`;

const RecentPostListItem = (props) => {

    const {
        className = "",
        post,
        postActions,
        onOpenPost
    } = props;

    const toggleCheck = (e) => {
        e.stopPropagation();
        postActions.markPost(post);
    };

    const handleOpenPost = e => {
        onOpenPost(post)
    };

    return (
        <Wrapper className={`recent-post-list-item list-group-item d-flex align-items-center p-l-r-0 ${className}`}
                 onClick={handleOpenPost}>
            <div className="custom-control custom-checkbox custom-checkbox-success mr-2">
                <CheckBox name="mark_done" checked={post.is_mark_done} onClick={toggleCheck}/>
            </div>
            <div className="flex-grow-1 min-width-0" onClick={handleOpenPost}>
                <div className="mb-1 d-flex align-items-center justify-content-between">
                    <div
                        className={`app-list-title ${post.is_mark_done ? "done" : ""} text-truncate`}>{post.title}</div>
                    <div
                        className={`pl-3 d-flex align-items-center ${post.is_mark_done ? "done" : ""}`}>
                        {localizeChatTimestamp(post.created_at.timestamp)}
                    </div>
                </div>
            </div>
        </Wrapper>
    );
};

export default React.memo(RecentPostListItem);