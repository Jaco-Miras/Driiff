import {convertArrayToObject} from "../../helpers/arrayHelper";

const INITIAL_STATE = {
  user: null,
  companyPosts: {
    limit: 25,
    prev_skip: 0,
    next_skip: 0,
    total_take: 0,
    has_more: true,
    posts: {},
    filter: "all",
    sort: "recent",
    tag: null,
    count: {},
    search: null,
    searchResults: []
  },
  posts: {},
  drafts: [],
  totalPostsCount: 0,
  unreadPostsCount: 0,
  editPostComment: null,
  commentQuotes: {},
  parentId: null,
  recentPosts: {},
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
        parentId: action.data,
      };
    }
    case "GET_COMPANY_POSTS_SUCCESS": {
      let newPosts = {};
      action.data.posts.forEach(p => {
        if (state.companyPosts.posts[p.id]) {
          newPosts[p.id] = {
            ...state.companyPosts.posts[p.id],
            p
          };
        } else {
          newPosts[p.id] = p;
        }
      })

      return {
        ...state,
        companyPosts: {
          ...state.companyPosts,
          prev_skip: action.data.prev_skip,
          next_skip: action.data.next_skip,
          total_take: action.data.total_take,
          has_more: action.data.total_take === (action.data.next_skip - action.data.prev_skip),
          posts: {
            ...state.companyPosts.posts,
            ...newPosts
          }
        }
      }
    }
    case "INCOMING_POST": {
      return {
        ...state,
        companyPosts: {
          ...state.companyPosts,
          posts: {
            ...state.companyPosts.posts,
            [action.data.id]: action.data
          }
        }
      }
    }
    case "INCOMING_UPDATED_POST": {
      return {
        ...state,
        companyPosts: {
          ...state.companyPosts,
          posts: {
            ...state.companyPosts.posts,
            [action.data.id]: action.data
          }
        }
      }
    }
    case "ADD_COMPANY_POST_SEARCH_RESULT": {
      let boom = {
        ...state,
        companyPosts: {
          ...state.companyPosts,
          search: action.data.search,
          searchResults: action.data.search_result,
        }
      };
      console.log(boom.companyPosts)
      return {
        ...state,
        companyPosts: {
          ...state.companyPosts,
          search: action.data.search,
          searchResults: action.data.search_result,
        }
      }
    }
    case "UPDATE_COMPANY_POST_FILTER_SORT": {
      console.log(action.data);
      return {
        ...state,
        companyPosts: {
          ...state.companyPosts,
          filter: action.data.filter,
          sort: action.data.sort ? action.data.sort : state.companyPosts.sort,
          tag: action.data.tag,
        },
      };
    }
    case "STAR_POST_REDUCER": {
      return {
        ...state,
        companyPosts: {
          ...state.companyPosts,
          posts: {
            ...state.companyPosts.posts,
            [action.data.post_id]: {
              ...state.companyPosts.posts[action.data.post_id],
              is_favourite: !state.companyPosts.posts[action.data.post_id].is_favourite
            }
          }
        }
      };
    }
    case "FETCH_RECENT_POSTS_SUCCESS": {
      return {
        ...state,
        recentPosts: {
          [action.data.topic_id]: {
            folderId: action.data.workspace_id,
            posts: convertArrayToObject(action.data.posts, "id"),
          },
        },
      };
    }
    case "MARK_POST_REDUCER": {
      if (isNaN(action.data.topic_id)) {
        return {
          ...state,
          companyPosts: {
            ...state.companyPosts,
            [action.data.post_id]: {
              ...state.companyPosts[action.data.post_id],
              is_mark_done: !state.companyPosts[action.data.post_id]
            }
          }
        }
      } else {
        return {
          ...state,
          recentPosts: {
            [action.data.topic_id]: {
              ...state.recentPosts[action.data.topic_id],
              posts: {
                ...state.recentPosts[action.data.topic_id].posts,
                [action.data.post_id]: {
                  ...state.recentPosts[action.data.topic_id].posts[action.data.post_id],
                  is_mark_done: !state.recentPosts[action.data.topic_id].posts[action.data.post_id].is_mark_done,
                },
              },
            },
          },
        };
      }
    }
    case "ADD_TO_WORKSPACE_POSTS": {
      let convertedPosts = convertArrayToObject(action.data.posts, "id");
      let postDrafts = [];
      if (state.drafts.length) {
        state.drafts.forEach((d) => {
          if (d.data.type === "draft_post" && action.data.topic_id === d.data.topic_id) {
            postDrafts.push({...d.data, ...d.data.form, draft_id: d.id});
          }
        });
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
      };
    }
    case "GET_DRAFTS_SUCCESS": {
      return {
        ...state,
        drafts: action.data,
      };
    }
    case "INCOMING_POST_VIEWER": {
      if (state.posts.hasOwnProperty[action.data.post_id]) {
        let updatedPosts = {...state.posts};
        updatedPosts[action.data.post_id].view_user_ids = [...updatedPosts[action.data.post_id].view_user_ids, action.data.viewer.id];
        return {
          ...state,
          posts: updatedPosts,
        };
      } else {
        return state;
      }
    }
    case "ARCHIVE_POST_REDUCER": {
      if (!isNaN(action.data.topic_id)) {
        let updatedPosts = {...state.posts};
        updatedPosts[action.data.post_id].is_archived = action.data.is_archived;
        return {
          ...state,
          posts: updatedPosts,
        };
      } else {
        return {
          ...state,
          companyPosts: {
            ...state.companyPosts,
            posts: {
              ...state.companyPosts.posts,
              [action.data.post_id]: {
                ...state.companyPosts.posts[action.data.post_id],
                is_archived: action.data.is_archived
              }
            }
          },
        };
      }
    }
    // case "MARK_READ_UNREAD_REDUCER": {
    //     let newPosts = {...state.posts};
    //     newPosts[action.data.post_id].is_unread = action.data.unread;
    //     if (action.data.unread === 0) {
    //         newPosts[action.data.post_id].unread_count = action.data.unread;
    //     }
    //     return {
    //         ...state,
    //         posts: newPosts
    //     }
    // }
    // case "MARK_READ_UNREAD_REDUCER": {
    //     let newPosts = {...state.posts};
    //     newPosts[action.data.post_id].is_read_requirement = true;
    //     return {
    //         ...state,
    //         posts: newPosts
    //     }
    // }
    default:
      return state;
  }
};
