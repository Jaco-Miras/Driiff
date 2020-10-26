import { convertArrayToObject } from "../../helpers/arrayHelper";

const INITIAL_STATE = {
  user: {},
  companyPosts: {
    flipper: true,
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
            ...action.data.posts.reduce((res, obj) => {
              if (state.companyPosts.posts[obj.id]) {
                res[obj.id] = {
                  clap_user_ids: [],
                  ...state.companyPosts.posts[obj.id],
                  ...obj
                };
              } else {
                res[obj.id] = {
                  clap_user_ids: [],
                  ...obj
                };
              }

              return res;
            }, {})
          }
        }
      };
    }
    case "GET_POST_CLAP_HOVER_SUCCESS": {
      const user_ids = action.data.claps.map(c => c.user_id);
      return {
        ...state,
        ...(typeof state.companyPosts.posts[action.data.post_id] !== "undefined" && {
          companyPosts: {
            ...state.companyPosts,
            posts: {
              ...state.companyPosts.posts,
              [action.data.post_id]: {
                ...state.companyPosts.posts[action.data.post_id],
                clap_user_ids: [...state.companyPosts.posts[action.data.post_id].clap_user_ids.filter(id => !user_ids.includes(id)), ...user_ids]
              }
            }
          }
        })
      };
    }
    case "INCOMING_MARK_AS_READ": {
      return {
        ...state,
        ...(typeof state.companyPosts.posts[action.data.result.post_id] !== "undefined" && {
          companyPosts: {
            ...state.companyPosts,
            posts: {
              ...state.companyPosts.posts,
              [action.data.result.post_id]: {
                ...state.companyPosts.posts[action.data.result.post_id],
                user_reads: [
                  ...state.companyPosts.posts[action.data.result.post_id].user_reads,
                  ...action.data.result.user_reads
                ],
              }
            }
          }
        })
      };
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
    case "INCOMING_TO_DO":
    case "INCOMING_UPDATE_TO_DO":
    case "INCOMING_DONE_TO_DO":
    case "INCOMING_REMOVE_TO_DO": {
      let posts = state.companyPosts.posts;
      if (action.data.link_type === "POST" && action.data.data && typeof posts[action.data.data.post.id] !== "undefined") {
        posts[action.data.data.post.id] = {
          ...posts[action.data.data.post.id],
          todo_reminder: action.type === "INCOMING_REMOVE_TO_DO" ? null : {
            id: action.data.id,
            remind_at: action.data.remind_at,
            status: action.data.status
          }
        }
      }

      return {
        ...state,
        companyPosts: {
          ...state.companyPosts,
          posts: posts
        }
      }
    }
    case "INCOMING_UPDATED_POST": {
      let posts = {...state.companyPosts.posts};
      if (action.data.is_personal && !action.data.post_participant_data.all_participant_ids.some((id) => id === state.user.id)) {
        delete posts[action.data.id];
      } else {
        if (posts.hasOwnProperty(action.data.id)) {
          posts[action.data.id] = {...action.data, clap_user_ids: posts[action.data.id].clap_user_ids}
        } else {
          posts[action.data.id] = {...action.data, clap_user_ids: []}
        }
      }
      return {
        ...state,
        companyPosts: {
          ...state.companyPosts,
          posts: posts
        }
      }
    }
    case "ADD_COMPANY_POST_SEARCH_RESULT": {
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
    case "INCOMING_POST_CLAP": {
      return {
        ...state,
        ...(typeof state.companyPosts.posts[action.data.post_id] !== "undefined" && {
          companyPosts: {
            ...state.companyPosts,
            posts: {
              ...state.companyPosts.posts,
              [action.data.post_id]: {
                ...state.companyPosts.posts[action.data.post_id],
                ...(action.data.clap_count === 1 ? {
                  clap_count: state.companyPosts.posts[action.data.post_id].clap_count + 1,
                  clap_user_ids: [...state.companyPosts.posts[action.data.post_id].clap_user_ids.filter(id => id !== action.data.author.id), action.data.author.id],
                  user_clap_count: action.data.author.id === state.user.id ? 1 : state.companyPosts.posts[action.data.post_id].user_clap_count,
                } : {
                  clap_count: state.companyPosts.posts[action.data.post_id].clap_count - 1,
                  clap_user_ids: state.companyPosts.posts[action.data.post_id].clap_user_ids.filter(id => id !== action.data.author.id),
                  user_clap_count: action.data.author.id === state.user.id ? 0 : state.companyPosts.posts[action.data.post_id].user_clap_count,
                })
              }
            }
          },
        })
      };
    }
    case "STAR_POST_REDUCER": {
      if (typeof state.companyPosts.posts[action.data.post_id] === "undefined")
        return state;

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
    case "INCOMING_FAVOURITE_ITEM": {
      return {
        ...state,
        ...(state.companyPosts.posts.hasOwnProperty(action.data.type_id) && {
          companyPosts: {
            ...state.companyPosts,
            posts: {
              ...state.companyPosts.posts,
              [action.data.type_id]: {
                ...state.companyPosts.posts[action.data.type_id],
                is_favourite: action.data.is_favourite,
              }
            }
          },
        }),
      };
    }
    case "INCOMING_POST_MARK_DONE": {
      return {
        ...state,
        ...(state.companyPosts.posts.hasOwnProperty(action.data.post_id) && {
          companyPosts: {
            ...state.companyPosts,
            posts: {
              ...state.companyPosts.posts,
              [action.data.post_id]: {
                ...state.companyPosts.posts[action.data.post_id],
                is_mark_done: action.data.is_done,
              }
            }
          },
        }),
        recentPosts: {
          ...state.recentPosts,
          ...Object.keys(state.recentPosts)
            .filter(wsId => state.recentPosts[wsId].posts.hasOwnProperty(action.data.post_id))
            .map(wsId => {
              return {
                [wsId]: {
                  ...state.recentPosts[wsId],
                  posts: {
                    ...state.recentPosts[wsId].posts,
                    [action.data.post_id]: {
                      ...state.recentPosts[wsId].posts[action.data.post_id],
                      is_mark_done: action.data.is_done
                    }
                  }
                }
              };
            })
            .reduce((obj, workspace) => {
              return { ...obj, ...workspace };
            }, {}),
        },
      };
    }
    case "ADD_TO_WORKSPACE_POSTS": {
      let convertedPosts = convertArrayToObject(action.data.posts, "id");
      let postDrafts = [];
      if (state.drafts.length) {
        state.drafts.forEach((d) => {
          if (d.data.type === "draft_post" && action.data.topic_id === d.data.topic_id) {
            postDrafts.push({ ...d.data, ...d.data.form, draft_id: d.id });
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
      return {
        ...state,
        ...(state.companyPosts.posts.hasOwnProperty(action.data.post_id) && {
          companyPosts: {
            ...state.companyPosts,
            posts: {
              ...state.companyPosts.posts,
              [action.data.post_id]: {
                ...state.companyPosts.posts[action.data.post_id],
                view_user_ids: [...state.companyPosts.posts[action.data.post_id].view_user_ids, action.data.viewer.id],
                is_unread: 0
              }
            }
          }
        })
      };
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
    case "INCOMING_READ_UNREAD_REDUCER": {
      return {
        ...state,
        ...(state.companyPosts.posts.hasOwnProperty(action.data.post_id) && {
          companyPosts: {
            ...state.companyPosts,
            flipper: !state.flipper,
            posts: {
              ...state.companyPosts.posts,
              [action.data.post_id]: {
                ...state.companyPosts.posts[action.data.post_id],
                view_user_ids: action.data.unread === 0 ?
                  [...state.companyPosts.posts[action.data.post_id].view_user_ids, action.data.user_id] :
                  state.companyPosts.posts[action.data.post_id].view_user_ids.filter(id => id !== action.data.user_id),
                is_unread: action.data.unread,
                unread_count: action.data.unread === 0 ? 0 : state.companyPosts.posts[action.data.post_id].unread_count
              }
            }
          },
        })
      };
    }
    case "INCOMING_COMMENT": {
      let companyPosts = {...state.companyPosts}
      if (action.data.SOCKET_TYPE === "POST_COMMENT_CREATE" && state.companyPosts.posts.hasOwnProperty(action.data.post_id)) {
        if (companyPosts.posts[action.data.post_id].is_archived === 1) {
          companyPosts.posts[action.data.post_id].is_archived = 0;
        }
        if (!companyPosts.posts[action.data.post_id].users_responsible.some((u) => u.id === action.data.author.id)) {
          companyPosts.posts[action.data.post_id].users_responsible = [...companyPosts.posts[action.data.post_id].users_responsible, action.data.author]
        }
      }
      
      return {
        ...state,
        companyPosts: companyPosts
      };
    }
    case "GET_UNREAD_POST_ENTRIES_SUCCESS": {
      return {
        ...state,
        companyPosts: {
          ...state.companyPosts,
          unreadPosts: action.data.result
        }
      }
    }
    case "INCOMING_DELETED_POST": {
      let companyPosts = {...state.companyPosts};
      delete companyPosts.posts[action.data.id];
      return {
        ...state,
        companyPosts: companyPosts
      };
    }
    default:
      return state;
  }
};
