import React, {useRef} from "react";
import styled from "styled-components";
import {useSelector} from "react-redux";
import {AvatarGroup, SvgIconFeather} from "../../common";
import {CheckBox} from "../../forms";
import {MoreOptions} from "../common";
import {PostBadge} from "./index";

const Wrapper = styled.li`
    .feather-more-vertical {
        width: auto;
    }
`;

const PostItemPanel = (props) => {

    const user = useSelector(state => state.session.user);
    const {className = "", post, postActions} = props;
    
    const {starPost,
        markPost,
        openPost,
        archivePost,
        markAsRead,
        markAsUnread,
        sharePost,
        snoozePost,
        followPost
    } = postActions;

    return (
        <Wrapper className={`list-group-item post-item-list ${className}`}>
            <div className="custom-control custom-checkbox custom-checkbox-success mr-2">
                <CheckBox name="test" checked={post.is_mark_done} onClick={() => markPost(post)}/>
            </div>
            <div>
                <SvgIconFeather icon="star" onClick={() => starPost(post)}/>
            </div>
            <div className="flex-grow-1 min-width-0">
                <div className="mb-1 d-flex align-items-center justify-content-between">
                    <div className="app-list-title text-truncate" onClick={() => openPost(post)}>{post.title}</div>
                    <div className="pl-3 d-flex align-items-center">
                        <PostBadge post={post}/>
                        {
                            post.users_responsible.length > 0 &&
                            <AvatarGroup users={post.users_responsible}/>
                        }
                        {
                            post.type !== "draft_post" &&
                            <MoreOptions item={post} width={170} moreButton={`vertical`}>
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
                        <SvgIconFeather icon="trash-2" onClick={() => archivePost(post)}/>
                    </div>
                </div>
            </div>
        </Wrapper>
    );
};

export default React.memo(PostItemPanel);