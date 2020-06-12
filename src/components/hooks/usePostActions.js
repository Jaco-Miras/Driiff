import {useCallback} from "react";
import {useDispatch} from "react-redux";
import {useLocation, useHistory, useParams} from "react-router-dom";
import toaster from "toasted-notes";
import {addToModals} from "../../redux/actions/globalActions";
import {copyTextToClipboard} from "../../helpers/commonFunctions";
import {getBaseUrl} from "../../helpers/slugHelper";
import {replaceChar} from "../../helpers/stringFormatter";
import {
    postFavorite, postArchive, postFollow, postMarkDone, 
    postToggleRead, removePost, postUnfollow, deletePost,
    starPostReducer, markPostReducer, putPost, postCreate
} from "../../redux/actions/postActions";

const usePostActions = () => {

    const dispatch = useDispatch();
    const location = useLocation();
    const history = useHistory();
    const params = useParams();

    const starPost = useCallback((post) => {
        if (post.type === "draft_post") return;
        let topic_id = parseInt(params.workspaceId);
        dispatch(
            postFavorite({type: "post", type_id: post.id}, (err,res) => {
                if (err) return;
                dispatch(
                    starPostReducer({
                        post_id: post.id,
                        topic_id
                    })
                )
            })
        )
    }, [dispatch]);

    const markPost = useCallback((post) => {
        if (post.type === "draft_post") return;
        let topic_id = parseInt(params.workspaceId);
        dispatch(
            postMarkDone({post_id: post.id}, (err,res) => {
                if (err) return;
                dispatch(
                    markPostReducer({
                        post_id: post.id,
                        topic_id
                    })
                )
            })
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
            console.log(location.pathname, `/post/${post.id}/${replaceChar(post.title)}`)
            history.push(location.pathname+`/post/${post.id}/${replaceChar(post.title)}`)
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

    const trash = useCallback((post) => {
        const onConfirm = () => {
            dispatch(
                deletePost({
                    id: post.id,
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
            headerText: "Delete post?",
            submitText: "Delete",
            cancelText: "Cancel",
            bodyText: "Are you sure you want to delete this post?",
            actions: {
                onSubmit: onConfirm,
            },
        };

        dispatch(
            addToModals(payload),
        );
    }, [dispatch]);

    const showModal = useCallback((mode = "create", post = null) => {
        let payload = {
            type: "workspace_post_create_edit",
            mode: mode,
        };
        if (mode === "edit") {
            payload = {
                ...payload,
                item: {
                    post: post
                },
                action: {
                    update: update
                }
            }
        } else {
            payload = {
                ...payload,
                item: {
                    post: post
                },
                action: {
                    create: create
                }
            }
        }

        dispatch(
            addToModals(payload),
        );
    }, [dispatch]);

    const create = useCallback((payload) => {
        dispatch(
            postCreate(payload)
        );
    }, [dispatch]);

    const update = useCallback((payload) => {
        dispatch(
            putPost(payload)
        );
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
        followPost,
        trash,
        showModal,
        update
    }
};

export default usePostActions;