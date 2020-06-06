import React, {useCallback} from "react";
import {useDispatch, useSelector} from "react-redux";
import styled from "styled-components";
import {addToModals} from "../../../redux/actions/globalActions";
import {favoritePost, postArchive, postMarkDone, removePost} from "../../../redux/actions/postActions";
import {AvatarGroup, SvgIconFeather} from "../../common";
import {CheckBox} from "../../forms";
import {MoreOptions} from "../common";
import {PostBadge} from "./index";

const Wrapper = styled.li`
`;

const PostItemPanel = (props) => {

    const dispatch = useDispatch();
    const topic = useSelector(state => state.workspaces.activeTopic);
    const {className = "", post} = props;

    const handleFavoritePost = () => {
        dispatch(
            favoritePost({type: "post", type_id: post.id}),
        );
    };

    const handleMarkPost = () => {
        dispatch(
            postMarkDone({post_id: post.id}),
        );
    };

    const handleArchivePost = () => {
        const onConfirm = () => {
            dispatch(
                postArchive({
                    post_id: post.id,
                    is_archived: post.is_archived === 1 ? 0 : 1,
                }, (err) => {
                    if (err) return;
                    dispatch(
                        removePost({
                            post_id: post.id,
                            topic_id: topic.id,
                        }),
                    );
                }),
            );
        };

        let payload = {
            type: "confirmation",
            headerText: "Archive post?",
            submitText: "Archive",
            cancelText: "Cancel",
            bodyText: "Are you sure you want to archive this post?",
            actions: {
                onSubmit: onConfirm,
            },
        };

        dispatch(
            addToModals(payload),
        );
    };

    const handleMarkAsRead = useCallback(() => {
        console.log(post);
    }, [post]);

    const handleMarkAsUnread = useCallback(() => {
        console.log(post);
    }, [post]);

    const handleShare = useCallback(() => {
        console.log(post);
    }, [post]);

    const handleSnooze = useCallback(() => {
        console.log(post);
    }, [post]);

    return (
        <Wrapper className={`list-group-item post-item-list ${className}`}>
            <div className="custom-control custom-checkbox custom-checkbox-success mr-2">
                <CheckBox name="test" checked={post.is_mark_done} onClick={handleMarkPost}/>
            </div>
            <div>
                <SvgIconFeather icon="star" onClick={handleFavoritePost}/>
            </div>
            <div className="flex-grow-1 min-width-0">
                <div className="mb-1 d-flex align-items-center justify-content-between">
                    <div className="app-list-title text-truncate">{post.title}</div>
                    <div className="pl-3 d-flex align-items-center">
                        <PostBadge post={post}/>
                        {
                            post.users_responsible.length > 0 &&
                            <AvatarGroup users={post.users_responsible}/>
                        }
                        <MoreOptions item={post} width={170} moreButton={`vertical`}>
                            <div onClick={handleMarkAsRead}>Mark as read</div>
                            <div onClick={handleMarkAsUnread}>Mark as unread</div>
                            <div onClick={handleShare}>Share</div>
                            <div onClick={handleSnooze}>Snooze</div>
                        </MoreOptions>
                        <SvgIconFeather icon="trash-2" onClick={handleArchivePost}/>
                    </div>
                </div>
            </div>
        </Wrapper>
    );
};

export default React.memo(PostItemPanel);