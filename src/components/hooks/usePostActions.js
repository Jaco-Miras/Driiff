import {useCallback} from "react";
import {useDispatch} from "react-redux";
import {useLocation, useHistory, useParams} from "react-router-dom";
import toaster from "toasted-notes";
import {postFavorite, postArchive, postFollow, postMarkDone, postToggleRead, removePost, postUnfollow} from "../../redux/actions/postActions";
import {addToModals} from "../../redux/actions/globalActions";
import {copyTextToClipboard} from "../../helpers/commonFunctions";
import {getBaseUrl} from "../../helpers/slugHelper";

const usePostActions = () => {

    const dispatch = useDispatch();
    const location = useLocation();
    const history = useHistory();
    const params = useParams();

    const starPost = useCallback((post) => {
        if (post.type === "draft_post") return;
        dispatch(
            postFavorite({type: "post", type_id: post.id})
        )
    }, [dispatch]);

    const markPost = useCallback((post) => {
        if (post.type === "draft_post") return;
        dispatch(
            postMarkDone({post_id: post.id})
        )
    }, []);

    const openPost = useCallback((post) => {
        if (post.type === "draft_post") {
            let payload = {
                type: "workspace_post_create_edit",
                mode: "create",
                item: {
                    draft: post
                },
            };

            dispatch(
                addToModals(payload),
            );
        } else {
            //redirect to post detail page
            console.log(location.pathname)
            history.push(location.pathname+`/post/${post.id}/${post.title}`)
        }
    }, [dispatch, location]);

    const archivePost = useCallback((post) => {
        if (post.type === "draft_post") {
            const onConfirm = () => {
                dispatch(
                    removePost({
                        post_id: post.id,
                        topic_id: parseInt(params.workspaceId)
                    })
                )
            };

            let payload = {
                type: "confirmation",
                headerText: "Delete post draft?",
                submitText: "Delete",
                cancelText: "Cancel",
                bodyText: "Are you sure you want to delete this post draft?",
                actions: {
                    onSubmit: onConfirm,
                },
            };

            dispatch(
                addToModals(payload),
            );
        } else {
            const onConfirm = () => {
                dispatch(
                    postArchive({
                        post_id: post.id,
                        is_archived: post.is_archived === 1 ? 0 : 1,
                    }, (err, res) => {
                        if (err) return;
                        dispatch(
                            removePost({
                                post_id: post.id,
                                topic_id: parseInt(params.workspaceId)
                            })
                        )
                        if (params.hasOwnProperty("postId")) {
                            history.goBack();
                        }
                    })
                )
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
        }
    }, [dispatch, params]);

    const markAsRead = useCallback((post) => {
        dispatch(
            postToggleRead({
                post_id: post.id,
                unread: 0
            })
        )
    }, [dispatch]);

    const markAsUnread = useCallback((post) => {
        dispatch(
            postToggleRead({
                post_id: post.id,
                unread: 1
            })
        )
    }, [dispatch]);

    const sharePost = useCallback((post) => {
        let link = `${getBaseUrl()}${location.pathname}/post/${post.id}`;
        copyTextToClipboard(link);
    }, [dispatch]);

    const snoozePost = useCallback((post) => {
        let payload = {
            type: "snooze_post",
            post: post
        };

        dispatch(
            addToModals(payload)
        );
    }, [dispatch]);

    const followPost = useCallback((post) => {
        if (post.is_followed) {
            //When: The user is following/recipient of the post - and not the creator.
            dispatch(
                postUnfollow({post_id: post.id}, (err,res) => {
                    if (err) return;
                    let notification = `You’ve stopped to follow ${post.title}`;
                    toaster.notify(notification, {position: "bottom-left"});
                })
            );
        } else {
            //When: The user not following the post and the post is in an open topic.
            dispatch(
                postFollow({post_id: post.id}, (err,res) => {
                    if (err) return;
                    let notification = `You’ve started to follow ${post.title}`;
                    toaster.notify(notification, {position: "bottom-left"});
                })
            );
        }
    }, [dispatch]);

    return {
        starPost,
        markPost,
        openPost,
        archivePost,
        markAsRead,
        markAsUnread,
        sharePost,
        snoozePost,
        followPost
    }
};

export default usePostActions;