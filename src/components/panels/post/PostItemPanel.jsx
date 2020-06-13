import React, {useState} from "react";
import {useSelector} from "react-redux";
import styled from "styled-components";
import {AvatarGroup, SvgIconFeather} from "../../common";
import {CheckBox} from "../../forms";
import {MoreOptions} from "../common";
import {PostBadge} from "./index";

const Wrapper = styled.li`
    .custom-checkbox {
        padding-left: 12px;
    }
    .app-list-title {
        &.text-success {
            text-decoration: line-through;
        }
    }
    
    &:hover {
        .more-options {
            display: flex;
        }
    }
    
    .more-options {
        display: none;
        
        svg {
            width: 16px;
        }
    }
`;

const Icon = styled(SvgIconFeather)`
    width: 16px;
`;

const PostItemPanel = (props) => {

    const user = useSelector(state => state.session.user);
    const {className = "", post, postActions} = props;
    const [done, setDone] = useState(post.is_mark_done);
    const [star, setStar] = useState(post.is_favourite);

    const {
        starPost,
        markPost,
        openPost,
        archivePost,
        markAsRead,
        markAsUnread,
        sharePost,
        snoozePost,
        followPost,
    } = postActions;

    const handleMarkDone = (e) => {
        e.preventDefault();
        e.stopPropagation();
        markPost(post);
        setDone(!done);
    };

    const hanldeStarPost = (e) => {
        e.preventDefault();
        e.stopPropagation();
        starPost(post);
        setStar(!star);
    };

    return (
        <Wrapper className={`list-group-item post-item-panel ${className}`} onClick={() => openPost(post)}>
            <div className="custom-control custom-checkbox custom-checkbox-success">
                <CheckBox name="test" checked={done} onClick={handleMarkDone}/>
            </div>
            <div>
                <Icon
                    className="mr-2"
                    icon="star" onClick={hanldeStarPost}
                    stroke={star ? "#ffc107" : "currentcolor"}
                    fill={star ? "#ffc107" : "none"}/>
            </div>
            <div className="flex-grow-1 min-width-0">
                <div className="d-flex align-items-center justify-content-between">
                    <div className={`app-list-title text-truncate ${done ? "text-success" : ""}`}>{post.title}</div>
                    <div className="pl-3 d-flex align-items-center">
                        <PostBadge post={post}/>
                        {
                            post.users_responsible.length > 0 &&
                            <AvatarGroup users={post.users_responsible}/>
                        }
                        <Icon icon="archive" onClick={() => archivePost(post)}/>
                    </div>
                </div>
            </div>
            {
                post.type !== "draft_post" &&
                <MoreOptions className="ml-2" item={post} width={170} moreButton={`more-vertical`}>
                    <div onClick={() => markAsRead(post)}>Mark as read</div>
                    <div onClick={() => markAsUnread(post)}>Mark as unread</div>
                    <div onClick={() => sharePost(post)}>Share</div>
                    <div onClick={() => snoozePost(post)}>Snooze</div>
                    {
                        post.author.id !== user.id &&
                        <div onClick={() => followPost(post)}>
                            {post.is_followed ? "Unfollow" : "Follow"}
                        </div>
                    }
                </MoreOptions>
            }
        </Wrapper>
    );
};

export default React.memo(PostItemPanel);