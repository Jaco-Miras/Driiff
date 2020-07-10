import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import {addToWorkspacePosts} from "../../redux/actions/postActions";
import {usePostActions} from "./index";

const usePosts = () => {

    const actions = usePostActions();
    const dispatch = useDispatch();
    const params = useParams();
    const wsPosts = useSelector(state => state.workspaces.workspacePosts);
    const recentPosts = useSelector(state => state.posts.recentPosts);
    const user = useSelector(state => state.session.user);
    const [fetchingPost, setFetchingPost] = useState(false);

    useEffect(() => {
        if (params.workspaceId !== undefined) {
            //actions.getRecentPosts(params.workspaceId);
            if (!wsPosts.hasOwnProperty(params.workspaceId) && !fetchingPost) {
                setFetchingPost(true);
                let cb = (err, res) => {
                    setFetchingPost(false);
                    if (err) return;
                    let files = res.data.posts.map(p => p.files);
                    if (files.length) {
                        files = files.flat();
                    }
                    actions.getTagsCount(parseInt(params.workspaceId));
                    dispatch(
                        addToWorkspacePosts({
                            topic_id: parseInt(params.workspaceId),
                            posts: res.data.posts,
                            files
                        }),
                    );
                };
                let payload = {
                    topic_id: parseInt(params.workspaceId)
                };
                actions.getPosts(payload, cb);
                let filterCb = (err,res) => {
                    setFetchingPost(false);
                    if (err) return;
                    let files = res.data.posts.map(p => p.files);
                    if (files.length) {
                        files = files.flat();
                    }
                    dispatch(
                        addToWorkspacePosts({
                            topic_id: parseInt(params.workspaceId),
                            posts: res.data.posts,
                            filter: res.data.posts,
                            files
                        }),
                    );
                };
                actions.getPosts({
                    filters: ["post", "archived"],
                    topic_id: parseInt(params.workspaceId)
                }, filterCb);
            }
        }
    }, [params]);

    let rPosts = null;

    if (Object.keys(recentPosts).length && recentPosts.hasOwnProperty(params.workspaceId)) {
        rPosts = recentPosts[params.workspaceId].posts;
    }

    if (Object.keys(wsPosts).length && wsPosts.hasOwnProperty(params.workspaceId)) {
        let filter = wsPosts[params.workspaceId].filter;
        let sort = wsPosts[params.workspaceId].sort;
        let tag = wsPosts[params.workspaceId].tag;
        let posts = wsPosts[params.workspaceId].posts;
        let search = wsPosts[params.workspaceId].search;
        let searchResults = wsPosts[params.workspaceId].searchResults;
        let count = wsPosts[params.workspaceId].count;
        let post = null;
        
        let counters = {
            all: Object.values(posts).length,
            my_posts: Object.values(posts).filter(p => p.author && p.author.id === user.id).length,
            starred: Object.values(posts).filter(p => p.is_favourite).length,
            archived: Object.values(posts).filter(p => p.is_archived).length,
            drafts: Object.values(posts).filter(p => p.type === "draft_post").length
        };
        
        if (posts.hasOwnProperty(params.postId)) {
            post = {...posts[params.postId]};
        }
        if (filter || tag) {
            let filteredPosts = Object.values(posts).filter(p => {
                if (tag) {
                    if (tag === "is_must_reply") {
                        return p.is_must_reply === 1;
                    } else if (tag === "is_must_read") {
                        return p.is_must_read === 1;
                    } else if (tag === "is_read_only") {
                        return p.is_read_only === 1;
                    } else {
                        return true;
                    }
                } else {
                    return true;
                }
                
            }).filter(p => {
                if (filter) {
                    if (filter === "my_posts") {
                        if (p.hasOwnProperty("author")) return p.author.id === user.id;
                        else return false;
                    } else if (filter === "draft") {
                        return (p.hasOwnProperty("draft_type"));
                    } else if (filter === "star") {
                        return p.is_favourite;
                    } else if (filter === "archive") {
                        return p.is_archived === 1;
                    } else if (filter === "all") {
                        if (tag) {
                            return true;
                        } else {
                            return !p.is_archived;
                        }
                    }
                } else {
                    return true;
                }
            }).sort((a, b) => {
                if (sort === "favorite") {
                    return a.is_favourite === b.is_favourite ? 0 : a.is_favourite ? -1 : 1;
                } else if (sort === "unread") {
                    return a.is_updated === b.is_updated ? 0 : a.is_updated ? 1 : -1;
                } else {
                    return b.created_at.timestamp > a.created_at.timestamp ? 1 : -1;
                }
            });
            if (searchResults.length) {
                filteredPosts = filteredPosts.filter(p => {
                    return searchResults.some(s => {
                        return p.id === s.id;
                    });
                });
            }
            return {
                actions,
                posts: filteredPosts, 
                filter, 
                tag, 
                sort, 
                post, 
                search, 
                user, 
                recentPosts: rPosts, 
                count,
                counters
            };
        } else {
            let filteredPosts = Object.values(wsPosts[params.workspaceId].posts);
            if (searchResults.length) {
                filteredPosts = filteredPosts.filter(p => {
                    return searchResults.some(s => {
                        return p.id === s.id;
                    });
                });
            }
            filteredPosts = filteredPosts.filter(p => {
                return !(p.hasOwnProperty("draft_type")) && p.is_archived === 0;
            }).sort((a, b) => {
                if (sort === "favorite") {
                    return a.is_favourite === b.is_favourite ? 0 : a.is_favourite ? -1 : 1;
                } else if (sort === "unread") {
                    return a.is_updated === b.is_updated ? 0 : a.is_updated ? 1 : -1;
                } else {
                    return b.created_at.timestamp > a.created_at.timestamp ? 1 : -1;
                }
            });
            return {
                actions,
                posts: filteredPosts,
                filter: null,
                tag: null,
                sort: null,
                post: post,
                search,
                user,
                recentPosts: rPosts,
                count,
                counters
            };
        }
    } else {
        return {
            actions,
            posts: null,
            filter: null,
            tag: null,
            sort: null,
            post: null,
            search: null,
            user,
            recentPosts: rPosts,
            count: {
                is_must_reply: 0,
                is_must_read: 0,
                is_read_only: 0,
            },
            counters: {
                all: 0,
                my_posts: 0,
                starred: 0,
                archived: 0,
                drafts: 0
            }
        };
    }
};

export default usePosts;