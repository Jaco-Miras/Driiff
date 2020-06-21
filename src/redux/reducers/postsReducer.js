import {convertArrayToObject} from "../../helpers/arrayHelper";

const INITIAL_STATE = {
    user: null,
    posts: {},
    drafts: [],
    totalPostsCount: 0,
    unreadPostsCount: 0,
    editPostComment: null,
    commentQuotes: {},
    parentId: null,
    recentPosts: {}
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case "ADD_USER_TO_REDUCERS": {
            return {
                ...state,
                user: action.data,
            };
        }
        case "SET_EDIT_POST_COMMENT": {
            return {
                ...state,
                editPostComment: action.data,
            };
        }
        case "ADD_COMMENT_QUOTE": {
            let updatedQuotes = {...state.commentQuotes};
            if (Object.keys(state.commentQuotes).length > 0 && state.commentQuotes.hasOwnProperty(action.data.id)) {
                updatedQuotes = {...state.commentQuotes};
                delete updatedQuotes[action.data.id];
                updatedQuotes = {
                    ...updatedQuotes,
                    [action.data.id]: action.data,
                };
            } else {
                updatedQuotes = {
                    ...state.commentQuotes,
                    [action.data.id]: action.data,
                };
            }
            return {
                ...state,
                commentQuotes: updatedQuotes,
            };
        }
        case "CLEAR_COMMENT_QUOTE": {
            let updatedQuotes = {...state.commentQuotes};
            delete updatedQuotes[action.data];

            return {
                ...state,
                commentQuotes: updatedQuotes,
            };
        }
        case "SET_PARENT_ID": {
            return {
                ...state,
                parentId: action.data
            }
        }
        case "FETCH_RECENT_POSTS_SUCCESS": {
            return {
                ...state,
                recentPosts: {
                    [action.data.topic_id]: {
                        folderId: action.data.workspace_id,
                        posts: convertArrayToObject(action.data.posts, "id")
                    }
                }
            }
        }
        case "MARK_POST_REDUCER": {
            return {
                ...state,
                recentPosts: {
                    [action.data.topic_id]: {
                        ...state.recentPosts[action.data.topic_id],
                        posts: {
                            ...state.recentPosts[action.data.topic_id].posts,
                            [action.data.post_id]: {
                                ...state.recentPosts[action.data.topic_id].posts[action.data.post_id],
                                is_mark_done: !state.recentPosts[action.data.topic_id].posts[action.data.post_id].is_mark_done
                            }
                        }
                    }
                }
            }
        }
        case "ADD_TO_WORKSPACE_POSTS": {
            let convertedPosts = convertArrayToObject(action.data.posts, "id");
            let postDrafts = [];
            if (state.drafts.length) {
                state.drafts.forEach(d => {
                    if (d.data.type === "draft_post" && action.data.topic_id === d.data.topic_id) {
                        postDrafts.push({...d.data,...d.data.form, draft_id: d.id})
                    }
                })
            }
            if (postDrafts.length) {
                postDrafts = convertArrayToObject(postDrafts, "id");
            }
            return {
                ...state,
                posts: {
                    ...state.posts,
                    ...convertedPosts,
                    ...postDrafts,
                },
            }
        }
        case "GET_DRAFTS_SUCCESS": {
            return {
                ...state,
                drafts: action.data
            }
        }
        case "INCOMING_POST_VIEWER": {
            if (state.posts.hasOwnProperty[action.data.post_id]) {
                let updatedPosts = {...state.posts};
                updatedPosts[action.data.post_id].view_user_ids = [...updatedPosts[action.data.post_id].view_user_ids, action.data.viewer.id]
                return {
                    ...state,
                    posts: updatedPosts
                }
            } else {
                return state
            }
        }
        default:
            return state;
    }
} 