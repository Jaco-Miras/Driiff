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
    search: "",
    searchResults: [],
    unreadPosts: 0,
  },
  archived: {
    skip: 0,
    has_more: true,
    limit: 25,
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
      let updatedQuotes = { ...state.commentQuotes };
      if (Object.keys(state.commentQuotes).length > 0 && state.commentQuotes.hasOwnProperty(action.data.id)) {
        updatedQuotes = { ...state.commentQuotes };
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
      let updatedQuotes = { ...state.commentQuotes };
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
      let isArchived = action.data.posts.filter((p) => p.is_archived === 1).length > 0;
      return {
        ...state,
        archived: {
          ...state.archived,
          ...(isArchived && {
            limit: 25,
            skip: action.data.next_skip,
            has_more: action.data.total_take === state.archived.limit,
          }),
        },
        companyPosts: {
          ...state.companyPosts,
          ...(!isArchived && {
            prev_skip: action.data.prev_skip,
            next_skip: action.data.next_skip,
            total_take: action.data.total_take,
            has_more: action.data.total_take === state.companyPosts.limit,
          }),
          posts: {
            ...state.companyPosts.posts,
            ...action.data.posts.reduce((res, obj) => {
              if (state.companyPosts.posts[obj.id]) {
                res[obj.id] = {
                  clap_user_ids: [],
                  ...state.companyPosts.posts[obj.id],
                  ...obj,
                };
              } else {
                res[obj.id] = {
                  clap_user_ids: [],
                  ...obj,
                };
              }

              return res;
            }, {}),
          },
        },
      };
    }
    case "SEARCH_COMPANY_POSTS_SUCCESS": {
      return {
        ...state,
        companyPosts: {
          ...state.companyPosts,
          posts: {
            ...state.companyPosts.posts,
            ...action.data.posts.reduce((res, obj) => {
              if (state.companyPosts.posts[obj.id]) {
                res[obj.id] = {
                  clap_user_ids: [],
                  ...state.companyPosts.posts[obj.id],
                  ...obj,
                };
              } else {
                res[obj.id] = {
                  clap_user_ids: [],
                  ...obj,
                };
              }

              return res;
            }, {}),
          },
        },
      };
    }
    case "ADD_POST_REACT": {
      return {
        ...state,
        ...(typeof state.companyPosts.posts[action.data.post_id] !== "undefined" && {
          companyPosts: {
            ...state.companyPosts,
            posts: {
              ...state.companyPosts.posts,
              [action.data.post_id]: {
                ...state.companyPosts.posts[action.data.post_id],
                clap_user_ids: [...state.companyPosts.posts[action.data.post_id].clap_user_ids, state.user.id],
                clap_count: state.companyPosts.posts[action.data.post_id].clap_count + 1,
                user_clap_count: 1,
              },
            },
          },
        }),
      };
    }
    case "REMOVE_POST_REACT": {
      return {
        ...state,
        ...(typeof state.companyPosts.posts[action.data.post_id] !== "undefined" && {
          companyPosts: {
            ...state.companyPosts,
            posts: {
              ...state.companyPosts.posts,
              [action.data.post_id]: {
                ...state.companyPosts.posts[action.data.post_id],
                clap_user_ids: state.companyPosts.posts[action.data.post_id].clap_user_ids.filter((id) => id !== state.user.id),
                clap_count: state.companyPosts.posts[action.data.post_id].clap_count - 1,
                user_clap_count: 0,
              },
            },
          },
        }),
      };
    }
    case "GET_POST_CLAP_HOVER_SUCCESS": {
      const user_ids = action.data.claps.map((c) => c.user_id);
      return {
        ...state,
        ...(typeof state.companyPosts.posts[action.data.post_id] !== "undefined" && {
          companyPosts: {
            ...state.companyPosts,
            posts: {
              ...state.companyPosts.posts,
              [action.data.post_id]: {
                ...state.companyPosts.posts[action.data.post_id],
                clap_user_ids: [...user_ids],
                fetchedReact: true,
              },
            },
          },
        }),
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
                user_reads: action.data.result.user_reads,
              },
            },
          },
        }),
      };
    }
    case "INCOMING_POST": {
      return {
        ...state,
        companyPosts: {
          ...state.companyPosts,
          posts: {
            ...state.companyPosts.posts,
            [action.data.id]: action.data,
          },
        },
      };
    }
    case "INCOMING_TO_DO":
    case "INCOMING_UPDATE_TO_DO":
    case "INCOMING_DONE_TO_DO":
    case "INCOMING_REMOVE_TO_DO": {
      let posts = state.companyPosts.posts;
      if (action.data.link_type === "POST" && action.data.data && typeof posts[action.data.data.post.id] !== "undefined") {
        posts[action.data.data.post.id] = {
          ...posts[action.data.data.post.id],
          todo_reminder:
            action.type === "INCOMING_REMOVE_TO_DO"
              ? null
              : {
                  id: action.data.id,
                  remind_at: action.data.remind_at,
                  status: action.data.status,
                },
        };
      }

      return {
        ...state,
        companyPosts: {
          ...state.companyPosts,
          posts: posts,
        },
      };
    }
    case "INCOMING_UPDATED_POST": {
      let posts = { ...state.companyPosts.posts };
      if (action.data.is_personal && !action.data.post_participant_data.all_participant_ids.some((id) => id === state.user.id)) {
        delete posts[action.data.id];
      } else {
        if (posts.hasOwnProperty(action.data.id)) {
          posts[action.data.id] = { ...action.data, clap_user_ids: posts[action.data.id].clap_user_ids };
        } else {
          posts[action.data.id] = { ...action.data, clap_user_ids: [] };
        }
      }
      return {
        ...state,
        companyPosts: {
          ...state.companyPosts,
          posts: posts,
        },
      };
    }
    case "ADD_COMPANY_POST_SEARCH_RESULT": {
      return {
        ...state,
        companyPosts: {
          ...state.companyPosts,
          search: action.data.search,
          searchResults: action.data.search_result,
          filter: "all",
        },
      };
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
                ...(action.data.clap_count === 1
                  ? {
                      clap_count: state.companyPosts.posts[action.data.post_id].clap_count + 1,
                      clap_user_ids: [...state.companyPosts.posts[action.data.post_id].clap_user_ids.filter((id) => id !== action.data.author.id), action.data.author.id],
                      user_clap_count: action.data.author.id === state.user.id ? 1 : state.companyPosts.posts[action.data.post_id].user_clap_count,
                    }
                  : {
                      clap_count: state.companyPosts.posts[action.data.post_id].clap_count - 1,
                      clap_user_ids: state.companyPosts.posts[action.data.post_id].clap_user_ids.filter((id) => id !== action.data.author.id),
                      user_clap_count: action.data.author.id === state.user.id ? 0 : state.companyPosts.posts[action.data.post_id].user_clap_count,
                    }),
              },
            },
          },
        }),
      };
    }
    case "STAR_POST_REDUCER": {
      if (typeof state.companyPosts.posts[action.data.post_id] === "undefined") return state;

      return {
        ...state,
        companyPosts: {
          ...state.companyPosts,
          posts: {
            ...state.companyPosts.posts,
            [action.data.post_id]: {
              ...state.companyPosts.posts[action.data.post_id],
              is_favourite: !state.companyPosts.posts[action.data.post_id].is_favourite,
            },
          },
        },
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
              },
            },
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
              },
            },
          },
        }),
        recentPosts: {
          ...state.recentPosts,
          ...Object.keys(state.recentPosts)
            .filter((wsId) => state.recentPosts[wsId].posts.hasOwnProperty(action.data.post_id))
            .map((wsId) => {
              return {
                [wsId]: {
                  ...state.recentPosts[wsId],
                  posts: {
                    ...state.recentPosts[wsId].posts,
                    [action.data.post_id]: {
                      ...state.recentPosts[wsId].posts[action.data.post_id],
                      is_mark_done: action.data.is_done,
                    },
                  },
                },
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
        postDrafts = convertArrayToObject(postDrafts, "post_id");
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
      let drafts = action.data.map((d) => {
        if (d.data.type === "draft_post") {
          return Object.assign({}, d, {
            ...d.data,
            post_id: d.data.id,
            draft_id: d.id,
            updated_at: d.data.created_at,
          });
        } else {
          return d;
        }
      });
      let postDrafts = [];
      if (drafts.length) {
        postDrafts = convertArrayToObject(drafts, "post_id");
      }
      return {
        ...state,
        drafts: drafts,
        companyPosts: {
          ...state.companyPosts,
          posts: {
            ...state.companyPosts.posts,
            ...postDrafts,
          },
        },
      };
    }
    case "DELETE_DRAFT": {
      if (action.data.draft_type === "draft_post") {
        const drafts = [...state.drafts.filter((d) => d.draft_id !== action.data.draft_id)];
        const companyPosts = { ...state.companyPosts };
        delete companyPosts.posts[action.data.post_id];
        return {
          ...state,
          drafts: drafts,
          companyPosts: companyPosts,
        };
      } else {
        return state;
      }
    }
    case "SAVE_DRAFT_SUCCESS": {
      if (action.data.data.draft_type === "draft_post") {
        const draft = {
          ...action.data,
          ...action.data.data,
          id: action.data.data.id,
          post_id: action.data.data.id,
          draft_id: action.data.id,
        };
        return {
          ...state,
          drafts: [...state.drafts, draft],
          companyPosts: {
            ...state.companyPosts,
            posts: {
              ...state.companyPosts.posts,
              [draft.id]: draft,
            },
          },
        };
      } else {
        return state;
      }
    }
    case "UPDATE_DRAFT_SUCCESS": {
      if (action.data.data.type === "draft_post") {
        const companyPosts = { ...state.companyPosts };
        companyPosts.posts[action.data.data.id] = {
          ...companyPosts.posts[action.data.data.post_id],
          ...action.data.data,
          id: action.data.data.post_id,
          post_id: action.data.data.post_id,
          draft_id: action.data.id,
        };
        return {
          ...state,
          companyPosts: companyPosts,
        };
      } else {
        return state;
      }
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
                is_unread: 0,
              },
            },
          },
        }),
      };
    }
    case "ARCHIVE_POST_REDUCER": {
      if (!isNaN(action.data.topic_id)) {
        let updatedPosts = { ...state.posts };
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
                is_archived: action.data.is_archived,
              },
            },
          },
        };
      }
    }
    case "INCOMING_POST_TOGGLE_FOLLOW": {
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
                is_followed: action.data.is_followed,
              },
            },
          },
        }),
      };
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
                view_user_ids:
                  action.data.unread === 0 ? [...state.companyPosts.posts[action.data.post_id].view_user_ids, action.data.user_id] : state.companyPosts.posts[action.data.post_id].view_user_ids.filter((id) => id !== action.data.user_id),
                is_unread: action.data.unread,
                unread_count: action.data.unread === 0 ? 0 : state.companyPosts.posts[action.data.post_id].unread_count,
              },
            },
          },
        }),
      };
    }
    case "INCOMING_COMMENT": {
      let companyPosts = { ...state.companyPosts };
      const hasPendingApproval =
        action.data.users_approval.length > 0 && action.data.users_approval.filter((u) => u.ip_address === null).length === action.data.users_approval.length && action.data.users_approval.some((u) => u.id === state.user.id);
      if (action.data.SOCKET_TYPE === "POST_COMMENT_CREATE" && state.companyPosts.posts.hasOwnProperty(action.data.post_id)) {
        if (companyPosts.posts[action.data.post_id].is_archived === 1) {
          companyPosts.posts[action.data.post_id].is_archived = 0;
        }
        if (!companyPosts.posts[action.data.post_id].users_responsible.some((u) => u.id === action.data.author.id)) {
          companyPosts.posts[action.data.post_id].users_responsible = [...companyPosts.posts[action.data.post_id].users_responsible, action.data.author];
        }
        if (action.data.author.id !== state.user.id) {
          companyPosts.posts[action.data.post_id].unread_count = companyPosts.posts[action.data.post_id].unread_count + 1;
          companyPosts.posts[action.data.post_id].unread_reply_ids = [...new Set([...companyPosts.posts[action.data.post_id].unread_reply_ids, action.data.id])];
        }
        companyPosts.posts[action.data.post_id].updated_at = action.data.updated_at;
        companyPosts.posts[action.data.post_id].reply_count = companyPosts.posts[action.data.post_id].reply_count + 1;
        if (action.data.author.id === state.user.id) companyPosts.posts[action.data.post_id].has_replied = true;
        if (hasPendingApproval && action.data.users_approval.some((ua) => ua.id === state.user.id)) {
          companyPosts.posts[action.data.post_id].need_approval = true;
        }
      }

      return {
        ...state,
        companyPosts: companyPosts,
      };
    }
    case "GET_UNREAD_POST_ENTRIES_SUCCESS": {
      return {
        ...state,
        companyPosts: {
          ...state.companyPosts,
          unreadPosts: action.data.result,
        },
      };
    }
    case "INCOMING_DELETED_POST": {
      let companyPosts = { ...state.companyPosts };
      delete companyPosts.posts[action.data.id];
      return {
        ...state,
        companyPosts: companyPosts,
      };
    }
    case "READ_ALL_POSTS": {
      if (action.data.topic_id) return state;
      let companyPosts = { ...state.companyPosts };
      if (Object.keys(companyPosts.posts).length) {
        Object.values(companyPosts.posts).forEach((p) => {
          companyPosts.posts[p.id].is_read = true;
          companyPosts.posts[p.id].is_updated = true;
          companyPosts.posts[p.id].unread_count = 0;
          companyPosts.posts[p.id].is_unread = 0;
          companyPosts.posts[p.id].unread_reply_ids = [];
        });
      }
      return {
        ...state,
        companyPosts: companyPosts,
      };
    }
    case "ARCHIVE_ALL_POSTS": {
      if (action.data.topic_id) return state;
      let companyPosts = { ...state.companyPosts };
      if (Object.keys(companyPosts.posts).length) {
        Object.values(companyPosts.posts).forEach((p) => {
          companyPosts.posts[p.id].is_archived = 1;
          companyPosts.posts[p.id].unread_count = 0;
          companyPosts.posts[p.id].unread_reply_ids = [];
        });
      }
      return {
        ...state,
        companyPosts: companyPosts,
      };
    }
    case "ADD_USER_TO_POST_RECIPIENTS": {
      let companyPosts = { ...state.companyPosts };
      if (companyPosts.posts.hasOwnProperty(action.data.post_id)) {
        companyPosts.posts[action.data.post_id].recipients = [...companyPosts.posts[action.data.post_id].recipients, ...action.data.recipients];
        companyPosts.posts[action.data.post_id].recipient_ids = [...companyPosts.posts[action.data.post_id].recipient_ids, ...action.data.recipient_ids];
      }
      return {
        ...state,
        companyPosts: companyPosts,
      };
    }
    case "REFETCH_POSTS_SUCCESS": {
      return {
        ...state,
        companyPosts: {
          ...state.companyPosts,
          posts: {
            ...state.companyPosts.posts,
            ...action.data.posts.reduce((res, obj) => {
              if (state.companyPosts.posts[obj.id]) {
                res[obj.id] = {
                  clap_user_ids: [],
                  ...state.companyPosts.posts[obj.id],
                  ...obj,
                };
              } else {
                res[obj.id] = {
                  clap_user_ids: [],
                  ...obj,
                };
              }
              return res;
            }, {}),
          },
        },
      };
    }
    case "GET_POST_DETAIL_SUCCESS": {
      return {
        ...state,
        companyPosts: {
          ...state.companyPosts,
          posts: {
            ...state.companyPosts.posts,
            [action.data.id]: { ...action.data, clap_user_ids: [] },
          },
        },
      };
    }
    case "UPDATE_POST_FILES": {
      return {
        ...state,
        companyPosts: {
          ...state.companyPosts,
          posts: {
            ...state.companyPosts.posts,
            ...(typeof state.companyPosts.posts[action.data.post_id] !== "undefined" && {
              [action.data.post_id]: {
                ...state.companyPosts.posts[action.data.post_id],
                files: state.companyPosts.posts[action.data.post_id].files.map((f) => {
                  if (f.id === action.data.file.id) {
                    return action.data.file;
                  } else {
                    return f;
                  }
                }),
              },
            }),
          },
        },
      };
    }
    case "INCOMING_READ_SELECTED_POSTS": {
      return {
        ...state,
        companyPosts: {
          ...state.companyPosts,
          posts: {
            ...state.companyPosts.posts,
            ...action.data.post_ids.reduce((res, id) => {
              if (state.companyPosts.posts[id]) {
                res[id] = {
                  ...state.companyPosts.posts[id],
                  is_read: true,
                  unread_count: 0,
                  is_unread: 0,
                  unread_reply_ids: [],
                };
              }

              return res;
            }, {}),
          },
        },
      };
    }
    case "INCOMING_ARCHIVED_SELECTED_POSTS": {
      return {
        ...state,
        companyPosts: {
          ...state.companyPosts,
          posts: {
            ...state.companyPosts.posts,
            ...action.data.post_ids.reduce((res, id) => {
              if (state.companyPosts.posts[id]) {
                res[id] = {
                  ...state.companyPosts.posts[id],
                  is_archived: 1,
                  unread_count: 0,
                  is_unread: 0,
                  unread_reply_ids: [],
                };
              }
              return res;
            }, {}),
          },
        },
      };
    }
    case "INCOMING_POST_APPROVAL": {
      return {
        ...state,
        companyPosts: {
          ...state.companyPosts,
          posts: {
            ...state.companyPosts.posts,
            ...(typeof state.companyPosts.posts[action.data.post.id] !== "undefined" && {
              [action.data.post.id]: {
                ...state.companyPosts.posts[action.data.post.id],
                need_approval: false,
                users_approval: state.companyPosts.posts[action.data.post.id].users_approval.map((u) => {
                  if (u.id === action.data.user_approved.id) {
                    return {
                      ...u,
                      ...action.data.user_approved,
                    };
                  } else {
                    return u;
                  }
                }),
              },
            }),
          },
        },
      };
    }
    case "INCOMING_COMMENT_APPROVAL": {
      return {
        ...state,
        companyPosts: {
          ...state.companyPosts,
          posts: {
            ...state.companyPosts.posts,
            ...(typeof state.companyPosts.posts[action.data.post_id] !== "undefined" && {
              [action.data.post_id]: {
                ...state.companyPosts.posts[action.data.post_id],
                need_approval: false,
              },
            }),
          },
        },
      };
    }
    default:
      return state;
  }
};
