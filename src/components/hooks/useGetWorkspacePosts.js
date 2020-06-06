import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {useSelector, useDispatch} from "react-redux";
import {addToWorkspacePosts, getWorkspacePosts} from "../../redux/actions/workspaceActions";

const useGetWorkspacePosts = () => {

    const dispatch = useDispatch();
    const params = useParams();
    const wsPosts = useSelector(state => state.workspaces.workspacePosts);
    const user = useSelector(state => state.session.user);
    const [fetchingPost, setFetchingPost] = useState(false);

    useEffect(() => {
        if (params.workspaceId !== undefined) {
            if (!wsPosts.hasOwnProperty(params.workspaceId) && !fetchingPost) {
                setFetchingPost(true);
                dispatch(
                    getWorkspacePosts({topic_id: parseInt(params.workspaceId)}, (err,res) => {
                        console.log(res)
                        setFetchingPost(false);
                        if (err) return;
                        dispatch(
                            addToWorkspacePosts({
                                topic_id: parseInt(params.workspaceId),
                                posts: res.data.posts
                            })
                        )
                    })
                );
            }
        }
    }, [params]);

    if (Object.keys(wsPosts).length && wsPosts.hasOwnProperty(params.workspaceId)) {
        let filter = wsPosts[params.workspaceId].filter;
        let sort = wsPosts[params.workspaceId].sort;
        let tag = wsPosts[params.workspaceId].tag;
        let posts = wsPosts[params.workspaceId].posts;
        let searchResults = wsPosts[params.workspaceId].searchResults;
        if (filter || tag) {
            let filteredPosts = Object.values(posts).filter(p => {
                if (filter) {
                    if (filter === "my_posts") {
                        return p.author.id === user.id
                    } else if (filter === "draft") {
                        return true
                    } else if (filter === "star") {
                        return p.is_favourite;
                    } else {
                        return true
                    }
                } else {
                    return true
                }
            }).filter(p => {
                if (tag) {
                    if (tag === "is_must_reply") {
                        return p.is_must_reply === 1;
                    } else if (filter === "is_must_read") {
                        return p.is_must_read === 1;
                    } else if (filter === "is_read_only") {
                        return p.is_read_only === 1;
                    } else {
                        return true
                    }
                } else {
                    return true
                }
            }).sort((a,b) => {
                if (sort === "favorite") {
                    return a.is_favourite === b.is_favourite ? 1 : -1
                } else if (sort === 'unread') {
                    return a.is_updated === b.is_updated ? 1 : -1
                }
            })
            if (searchResults.length) {
                filteredPosts = filteredPosts.filter(p => {
                    return searchResults.some(s => {
                        return p.id === s.id;
                    });
                })
            }
            return {
                posts: filteredPosts, filter, tag, sort
            };
        } else {
            let filteredPosts = Object.values(wsPosts[params.workspaceId].posts)
            if (searchResults.length) {
                filteredPosts = Object.values(wsPosts[params.workspaceId].posts).filter(p => {
                    return searchResults.some(s => {
                        return p.id === s.id;
                    });
                })
            }
            return {
                posts: filteredPosts, 
                filter: null,
                tag: null, 
                sort: null
            };
        }
    } else {
        return {
            posts: null,
            filter: null,
            tag: null,
            sort: null
        };
    }
};

export default useGetWorkspacePosts;