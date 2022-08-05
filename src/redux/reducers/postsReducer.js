import { convertArrayToObject } from "../../helpers/arrayHelper";
import { getCurrentTimestamp } from "../../helpers/dateFormatter";

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
    filter: "inbox",
    sort: "recent",
    tag: null,
    postListTag: null,
    count: {},
    search: "",
    searchResults: [],
    unreadPosts: 0,
  },
  sharedCompanyPosts: {},
  showUnread: true,
  archived: {
    skip: 0,
    has_more: true,
    limit: 25,
  },
  favourites: {
    skip: 0,
    has_more: true,
    limit: 25,
  },
  myPosts: {
    skip: 0,
    has_more: true,
    limit: 25,
  },
  unreadPosts: {
    skip: 0,
    has_more: true,
    limit: 15,
    loaded: false,
  },
  readPosts: {
    skip: 0,
    has_more: true,
    limit: 15,
  },
  inProgress: {
    skip: 0,
    has_more: true,
    limit: 25,
  },
  mustRead: {
    count: 0,
    has_more: true,
    limit: 15,
    skip: 0,
  },
  mustReply: {
    count: 0,
    has_more: true,
    limit: 15,
    skip: 0,
  },
  noReplies: {
    count: 0,
    has_more: true,
    limit: 15,
    skip: 0,
  },
  closedPost: {
    count: 0,
    has_more: true,
    limit: 15,
    skip: 0,
  },
  categoryCountLoaded: false,
  posts: {},
  postsLists: [],
  drafts: [],
  totalPostsCount: 0,
  unreadPostsCount: 0,
  editPostComment: null,
  commentQuotes: {},
  parentId: null,
  recentPosts: {},
  clearApprovingState: null,
  changeRequestedComment: null,
  commentType: null,
  commentDrafts: [],
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
      let updatedQuotes = { ...state.commentQuotes };
      if (Object.keys(state.commentQuotes).length > 0 && state.editPostComment && action.data === null) {
        updatedQuotes = { ...state.commentQuotes };
        delete updatedQuotes[state.editPostComment.id];
      }
      return {
        ...state,
        editPostComment: action.data,
        commentQuotes: updatedQuotes,
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
      return {
        ...state,
        companyPosts: {
          ...state.companyPosts,
          prev_skip: action.data.prev_skip,
          next_skip: action.data.next_skip,
          total_take: action.data.total_take,
          has_more: action.data.total_take === state.companyPosts.limit,
          posts: {
            ...state.companyPosts.posts,
            ...action.data.posts.reduce((res, obj) => {
              if (state.companyPosts.posts[obj.id]) {
                res[obj.id] = {
                  claps: [],
                  ...state.companyPosts.posts[obj.id],
                  ...obj,
                  sharedSlug: false,
                  slug: action.slug,
                };
              } else {
                res[obj.id] = {
                  claps: [],
                  ...obj,
                  sharedSlug: false,
                  slug: action.slug,
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
                  claps: [],
                  ...state.companyPosts.posts[obj.id],
                  ...obj,
                  sharedSlug: false,
                  slug: action.slug,
                };
              } else {
                res[obj.id] = {
                  claps: [],
                  ...obj,
                  sharedSlug: false,
                  slug: action.slug,
                };
              }

              return res;
            }, {}),
          },
        },
      };
    }
    case "ADD_POST_REACT": {
      let key = action.data.post_id;
      if (action.data.post_code) {
        key = action.data.post_code;
      }
      return {
        ...state,
        ...(typeof state.companyPosts.posts[key] !== "undefined" && {
          companyPosts: {
            ...state.companyPosts,
            posts: {
              ...state.companyPosts.posts,
              [key]: {
                ...state.companyPosts.posts[key],
                claps: [...state.companyPosts.posts[key].claps, { user_id: action.data.user_id }],
                clap_count: state.companyPosts.posts[key].clap_count + 1,
                user_clap_count: 1,
              },
            },
          },
        }),
      };
    }
    case "REMOVE_POST_REACT": {
      let key = action.data.post_id;
      if (action.data.post_code) {
        key = action.data.post_code;
      }
      return {
        ...state,
        ...(typeof state.companyPosts.posts[key] !== "undefined" && {
          companyPosts: {
            ...state.companyPosts,
            posts: {
              ...state.companyPosts.posts,
              [key]: {
                ...state.companyPosts.posts[key],
                claps: state.companyPosts.posts[key].claps.filter((c) => c.user_id !== action.data.user_id),
                clap_count: state.companyPosts.posts[key].clap_count - 1,
                user_clap_count: 0,
              },
            },
          },
        }),
      };
    }
    case "INCOMING_WORKSPACE_POST":
    case "INCOMING_POST": {
      if (action.data.sharedSlug) return state;
      let postKey = action.data.id;
      if (action.data.sharedSlug && action.data.code) {
        postKey = action.data.code;
      }
      return {
        ...state,
        companyPosts: {
          ...state.companyPosts,
          posts: {
            ...state.companyPosts.posts,
            [postKey]: action.data,
          },
        },
      };
    }
    //to update
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
      let postKey = action.data.id;
      if (action.data.sharedSlug && action.data.code) {
        postKey = action.data.code;
      }
      let posts = { ...state.companyPosts.posts };
      if (action.data.is_personal && !action.data.post_participant_data.all_participant_ids.some((id) => id === action.data.userId)) {
        delete posts[postKey];
      } else {
        if (posts.hasOwnProperty(postKey)) {
          posts[postKey] = { ...action.data, claps: posts[postKey].claps };
        } else {
          posts[postKey] = { ...action.data, claps: [] };
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
          //sort: action.data.sort ? action.data.sort : state.companyPosts.sort,
          tag: action.data.tag,
          postListTag: action.data.postListTag,
        },
      };
    }
    case "INCOMING_POST_CLAP": {
      let postKey = action.data.id;
      if (action.data.sharedSlug && action.data.post_code) {
        postKey = action.data.post_code;
      }
      return {
        ...state,
        ...(typeof state.companyPosts.posts[postKey] !== "undefined" && {
          companyPosts: {
            ...state.companyPosts,
            posts: {
              ...state.companyPosts.posts,
              [postKey]: {
                ...state.companyPosts.posts[postKey],
                ...(action.data.clap_count === 1
                  ? {
                      clap_count: state.companyPosts.posts[postKey].clap_count + 1,
                      claps: [...state.companyPosts.posts[postKey].claps.filter((c) => c.user_id !== action.data.author.id), { user_id: action.data.author.id }],
                      user_clap_count: action.data.author.id === action.data.userId ? 1 : state.companyPosts.posts[postKey].user_clap_count,
                    }
                  : {
                      clap_count: state.companyPosts.posts[postKey].clap_count - 1,
                      claps: state.companyPosts.posts[postKey].claps.filter((c) => c.user_id !== action.data.author.id),
                      user_clap_count: action.data.author.id === action.data.userId ? 0 : state.companyPosts.posts[postKey].user_clap_count,
                    }),
              },
            },
          },
        }),
      };
    }
    case "STAR_POST_REDUCER": {
      let postKey = action.data.post_id;
      if (action.data.post_code) {
        postKey = action.data.post_code;
      }
      return {
        ...state,
        companyPosts: {
          ...state.companyPosts,
          posts: {
            ...state.companyPosts.posts,
            ...(state.companyPosts.posts[postKey] && {
              [postKey]: {
                ...state.companyPosts.posts[postKey],
                is_favourite: !state.companyPosts.posts[postKey].is_favourite,
              },
            }),
          },
        },
      };
    }
    // case "FETCH_RECENT_POSTS_SUCCESS": {
    //   return {
    //     ...state,
    //     recentPosts: {
    //       [action.data.topic_id]: {
    //         folderId: action.data.workspace_id,
    //         posts: convertArrayToObject(action.data.posts, "id"),
    //       },
    //     },
    //   };
    // }
    case "INCOMING_FAVOURITE_ITEM": {
      return {
        ...state,
        companyPosts: {
          ...state.companyPosts,
          posts: Object.keys(state.companyPosts.posts).reduce((acc, key) => {
            if (state.companyPosts.posts[key].id === action.data.type_id && state.companyPosts.posts[key].sharedSlug === action.data.sharedSlug) {
              acc[key] = {
                ...state.companyPosts.posts[key],
                is_favourite: action.data.is_favourite,
              };
            } else {
              acc[key] = state.companyPosts.posts[key];
            }
            return acc;
          }, {}),
        },
      };
    }
    case "GET_DRAFTS_SUCCESS": {
      let drafts = action.data
        .filter((d) => d.data.type === "draft_post")
        .map((d) => {
          return Object.assign({}, d, {
            ...d.data,
            post_id: d.data.id,
            draft_id: d.id,
            updated_at: d.data.created_at,
            is_unread: 0,
            unread_count: 0,
            is_close: false,
            approval_label: null,
          });
        });
      let postDrafts = [];
      let commentDrafts = action.data.filter((d) => d.data.type === "comment");
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
        commentDrafts: commentDrafts,
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
          is_unread: 0,
          unread_count: 0,
          is_close: false,
          approval_label: null,
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
      } else if (action.data.data.draft_type === "comment") {
        return {
          ...state,
          commentDrafts: [...state.commentDrafts, action.data],
        };
      } else {
        return state;
      }
    }
    case "REMOVE_COMMENT_DRAFT": {
      return {
        ...state,
        commentDrafts: state.commentDrafts.filter((d) => d.id !== action.data.id),
      };
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
          is_unread: 0,
          unread_count: 0,
          is_close: false,
          approval_label: null,
        };
        return {
          ...state,
          companyPosts: companyPosts,
        };
      } else if (action.data.data.draft_type === "comment") {
        return {
          ...state,
          commentDrafts: state.commentDrafts.map((d) => {
            if (d.id === parseInt(action.data.id)) {
              return { ...action.data, id: parseInt(action.data.id) };
            } else {
              return d;
            }
          }),
        };
      } else {
        return state;
      }
    }
    case "INCOMING_POST_VIEWER": {
      return {
        ...state,
        // ...(state.companyPosts.posts.hasOwnProperty(action.data.post_id) && {
        //   companyPosts: {
        //     ...state.companyPosts,
        //     posts: {
        //       ...state.companyPosts.posts,
        //       [action.data.post_id]: {
        //         ...state.companyPosts.posts[action.data.post_id],
        //         view_user_ids: [...state.companyPosts.posts[action.data.post_id].view_user_ids, action.data.viewer.id],
        //         //is_unread: 0,
        //       },
        //     },
        //   },
        // }),
        companyPosts: {
          ...state.companyPosts,
          posts: Object.keys(state.companyPosts.posts).reduce((acc, key) => {
            if (state.companyPosts.posts[key].id === action.data.post_id && state.companyPosts.posts[key].sharedSlug === action.data.sharedSlug) {
              acc[key] = {
                ...state.companyPosts.posts[key],
                view_user_ids: [...state.companyPosts.posts[key].view_user_ids, action.data.viewer.id],
              };
            } else {
              acc[key] = state.companyPosts.posts[key];
            }
            return acc;
          }, {}),
        },
      };
    }
    case "ARCHIVE_POST_REDUCER": {
      return {
        ...state,
        companyPosts: {
          ...state.companyPosts,
          posts: {
            ...state.companyPosts.posts,
            ...(Object.values(state.companyPosts.posts).length > 0 && {
              ...Object.values(state.companyPosts.posts).reduce((pos, p) => {
                if (action.data.post_code && action.data.post_code === p.code) {
                  pos[p.code] = {
                    ...p,
                    is_archived: action.data.is_archived,
                  };
                } else if (action.data.post_id === p.id) {
                  pos[p.id] = {
                    ...p,
                    is_archived: action.data.is_archived,
                  };
                } else {
                  pos[p.id] = p;
                }
                return pos;
              }, {}),
            }),
          },
        },
      };
    }
    case "INCOMING_POST_TOGGLE_FOLLOW": {
      let postKey = action.data.post_code ? action.data.post_code : action.data.post_id;
      return {
        ...state,
        ...(state.companyPosts.posts.hasOwnProperty(postKey) && {
          companyPosts: {
            ...state.companyPosts,
            posts: {
              ...state.companyPosts.posts,
              [postKey]: {
                ...state.companyPosts.posts[postKey],
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
        ...(!action.data.sharedSlug &&
          state.companyPosts.posts.hasOwnProperty(action.data.post_id) && {
            companyPosts: {
              ...state.companyPosts,
              flipper: !state.flipper,
              posts: {
                ...state.companyPosts.posts,
                [action.data.post_id]: {
                  ...state.companyPosts.posts[action.data.post_id],
                  is_unread: action.data.unread,
                  unread_count: action.data.unread === 0 ? 0 : state.companyPosts.posts[action.data.post_id].unread_count,
                },
              },
            },
          }),
        ...(action.data.sharedSlug &&
          action.data.post_code &&
          state.companyPosts.posts.hasOwnProperty(action.data.post_code) && {
            companyPosts: {
              ...state.companyPosts,
              flipper: !state.flipper,
              posts: {
                ...state.companyPosts.posts,
                [action.data.post_code]: {
                  ...state.companyPosts.posts[action.data.post_code],
                  is_unread: action.data.unread,
                  unread_count: action.data.unread === 0 ? 0 : state.companyPosts.posts[action.data.post_code].unread_count,
                },
              },
            },
          }),
      };
    }
    case "INCOMING_COMMENT": {
      if (action.data.SOCKET_TYPE === "POST_COMMENT_CREATE") {
        let postKey = action.data.post_id;
        if (action.data.sharedSlug) {
          postKey = action.data.post_code;
        }
        const hasPendingAproval = action.data.users_approval.length > 0 && action.data.users_approval.filter((u) => u.ip_address === null).length === action.data.users_approval.length;
        const allUsersDisagreed = action.data.users_approval.length > 0 && action.data.users_approval.filter((u) => u.ip_address !== null && !u.is_approved).length === action.data.users_approval.length;
        const allUsersAgreed = action.data.users_approval.length > 0 && action.data.users_approval.filter((u) => u.ip_address !== null && u.is_approved).length === action.data.users_approval.length;
        const isApprover = action.data.users_approval.some((ua) => ua.id === action.data.userId);
        return {
          ...state,
          companyPosts: {
            ...state.companyPosts,
            posts: {
              ...state.companyPosts.posts,
              ...(state.companyPosts.posts[postKey] && {
                [postKey]: {
                  ...state.companyPosts.posts[postKey],
                  unread_count: action.data.author.id !== action.data.userId ? state.companyPosts.posts[postKey].unread_count + 1 : state.companyPosts.posts[postKey].unread_count,
                  is_unread:
                    action.data.hasOwnProperty("allMuted") && action.data.allMuted === true ? state.companyPosts.posts[postKey].is_unread : action.data.author.id !== action.data.userId ? 1 : state.companyPosts.posts[postKey].is_unread,
                  updated_at: action.data.updated_at,
                  reply_count: state.companyPosts.posts[postKey].reply_count + 1,
                  has_replied: action.data.author.id === action.data.userId ? true : false,
                  post_approval_label: allUsersAgreed
                    ? "ACCEPTED"
                    : allUsersDisagreed
                    ? "REQUEST_UPDATE"
                    : isApprover && hasPendingAproval
                    ? "NEED_ACTION"
                    : state.companyPosts.posts[postKey].author.id === action.data.author.id && hasPendingAproval
                    ? "REQUEST_APPROVAL"
                    : state.companyPosts.posts[postKey].post_approval_label,
                },
              }),
            },
          },
        };
      } else {
        return state;
      }
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
      delete companyPosts.posts[action.data.sharedSlug ? action.data.post_code : action.data.id];
      return {
        ...state,
        companyPosts: companyPosts,
      };
    }
    case "ADD_USER_TO_POST_RECIPIENTS": {
      let companyPosts = { ...state.companyPosts };
      if (companyPosts.posts.hasOwnProperty(action.data.post_id)) {
        if (!companyPosts.posts[action.data.post_id].hasOwnProperty("to_add")) {
          companyPosts.posts[action.data.post_id].to_add = [...action.data.recipient_ids];
        } else {
          companyPosts.posts[action.data.post_id].to_add = [...companyPosts.posts[action.data.post_id].to_add, ...action.data.recipient_ids];
        }

        companyPosts.posts[action.data.post_id].recipients = [...companyPosts.posts[action.data.post_id].recipients, ...action.data.recipients];
        companyPosts.posts[action.data.post_id].recipient_ids = [...companyPosts.posts[action.data.post_id].recipient_ids, ...action.data.recipient_ids];
      }
      return {
        ...state,
        companyPosts: companyPosts,
      };
    }
    case "REMOVE_USER_TO_POST_RECIPIENTS": {
      let companyPosts = { ...state.companyPosts };
      if (companyPosts.posts.hasOwnProperty(action.data.post_id)) {
        const filteredRecipientsIds = companyPosts.posts[action.data.post_id].recipient_ids.filter((id) => {
          return !action.data.remove_recipient_ids.includes(id);
        });
        const filteredRecipients = companyPosts.posts[action.data.post_id].recipients.filter((r) => {
          return !action.data.remove_recipient_ids.includes(r.id);
        });

        companyPosts.posts[action.data.post_id].recipient_ids = filteredRecipientsIds;
        companyPosts.posts[action.data.post_id].recipients = filteredRecipients;
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
            ...action.data.posts.reduce((res, post) => {
              let postKey = action.isSharedSlug ? post.code : post.id;
              if (state.companyPosts.posts[postKey]) {
                res[postKey] = {
                  claps: [],
                  ...state.companyPosts.posts[postKey],
                  ...post,
                  slug: action.slug,
                  sharedSlug: action.isSharedSlug,
                };
              } else {
                res[postKey] = {
                  claps: [],
                  ...post,
                  slug: action.slug,
                  sharedSlug: action.isSharedSlug,
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
            [action.data.id]: {
              ...action.data,
              claps: state.companyPosts.posts[action.data.id] ? state.companyPosts.posts[action.data.id].claps : [],
              last_visited_at: state.companyPosts.posts[action.data.id] && state.companyPosts.posts[action.data.id].last_visited_at ? state.companyPosts.posts[action.data.id].last_visited_at : { timestamp: null },
              slug: action.slug,
              sharedSlug: action.isSharedSlug,
            },
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
            ...action.data.posts.reduce((res, p) => {
              if (action.data.sharedSlug) {
                if (state.companyPosts.posts[p.post_code]) {
                  res[p.post_code] = {
                    ...state.companyPosts.posts[p.post_code],
                    is_read: true,
                    unread_count: 0,
                    is_unread: 0,
                  };
                }
              } else {
                if (state.companyPosts.posts[p.post_id]) {
                  res[p.post_id] = {
                    ...state.companyPosts.posts[p.post_id],
                    is_read: true,
                    unread_count: 0,
                    is_unread: 0,
                  };
                }
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
            ...action.data.posts.reduce((res, p) => {
              if (action.data.sharedSlug) {
                if (state.companyPosts.posts[p.post_code]) {
                  res[p.post_code] = {
                    ...state.companyPosts.posts[p.post_code],
                    is_archived: 1,
                    unread_count: 0,
                    is_unread: 0,
                  };
                }
              } else {
                if (state.companyPosts.posts[p.post_id]) {
                  res[p.post_id] = {
                    ...state.companyPosts.posts[p.post_id],
                    is_archived: 1,
                    unread_count: 0,
                    is_unread: 0,
                  };
                }
              }
              return res;
            }, {}),
          },
        },
      };
    }
    //case "POST_APPROVE_SUCCESS":
    case "INCOMING_POST_APPROVAL": {
      let postKey = action.data.post.id;
      if ((action.data.sharedSlug || action.isSharedSlug) && action.data.post.post_code) {
        postKey = action.data.post.post_code;
      }
      const allUsersDisagreed = action.data.users_approval.filter((u) => u.ip_address !== null && !u.is_approved).length === action.data.users_approval.length;
      const allUsersAgreed = action.data.users_approval.filter((u) => u.ip_address !== null && u.is_approved).length === action.data.users_approval.length;
      const allUsersAnswered = !action.data.users_approval.some((ua) => ua.ip_address === null);
      return {
        ...state,
        companyPosts: {
          ...state.companyPosts,
          posts: {
            ...state.companyPosts.posts,
            ...(typeof state.companyPosts.posts[postKey] !== "undefined" && {
              [postKey]: {
                ...state.companyPosts.posts[postKey],
                post_approval_label: allUsersAgreed
                  ? "ACCEPTED"
                  : allUsersDisagreed
                  ? "REQUEST_UPDATE"
                  : allUsersAnswered && !allUsersDisagreed && !allUsersAgreed
                  ? "SPLIT"
                  : action.data.user_approved.id === action.data.userId
                  ? null
                  : state.companyPosts.posts[postKey].post_approval_label,
                users_approval: state.companyPosts.posts[postKey].users_approval.map((u) => {
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
    //to update
    case "INCOMING_COMMENT_APPROVAL": {
      const allUsersDisagreed = action.data.users_approval.filter((u) => u.ip_address !== null && !u.is_approved).length === action.data.users_approval.length;
      const allUsersAgreed = action.data.users_approval.filter((u) => u.ip_address !== null && u.is_approved).length === action.data.users_approval.length;
      const allUsersAnswered = !action.data.users_approval.some((ua) => ua.ip_address === null);
      return {
        ...state,
        companyPosts: {
          ...state.companyPosts,
          posts: {
            ...state.companyPosts.posts,
            ...(state.companyPosts.posts[action.data.post.id] && {
              [action.data.post.id]: {
                ...state.companyPosts.posts[action.data.post.id],
                post_approval_label: allUsersAgreed
                  ? "ACCEPTED"
                  : allUsersDisagreed
                  ? "REQUEST_UPDATE"
                  : allUsersAnswered && !allUsersDisagreed && !allUsersAgreed
                  ? "SPLIT"
                  : action.data.user_approved.id === state.user.id
                  ? null
                  : state.companyPosts.posts[action.data.post.id].post_approval_label,
              },
            }),
          },
        },
      };
    }
    case "CLEAR_COMMENT_APPROVING_STATE": {
      return {
        ...state,
        clearApprovingState: action.data,
      };
    }
    case "SET_CHANGE_REQUESTED_COMMENT": {
      return {
        ...state,
        changeRequestedComment: action.data,
      };
    }
    case "INCOMING_CLOSE_POST": {
      let postKey = action.data.post.id;
      if (action.data.sharedSlug && action.data.post.post_code) {
        postKey = action.data.post.post_code;
      }
      const mustRead = action.data.must_read_users.some((u) => u.id === state.user.id && !u.must_read);
      const mustReply = action.data.must_reply_users.some((u) => u.id === state.user.id && !u.must_reply);
      return {
        ...state,
        companyPosts: {
          ...state.companyPosts,
          posts: {
            ...state.companyPosts.posts,
            ...(state.companyPosts.posts[postKey] && {
              [postKey]: {
                ...state.companyPosts.posts[postKey],
                is_close: action.data.is_close,
                post_close: {
                  initiator: action.data.initiator,
                },
              },
            }),
          },
        },
        ...(state.categoryCountLoaded && {
          closedPost: {
            ...state.closedPost,
            count: action.data.is_close ? state.closedPost.count + 1 : state.closedPost.count - 1,
          },
          mustReply: {
            ...state.mustReply,
            count: action.data.is_close && mustReply ? state.mustReply.count - 1 : !action.data.is_close && mustReply ? state.mustReply.count + 1 : state.mustReply.count,
          },
          mustRead: {
            ...state.mustRead,
            count: action.data.is_close && mustRead ? state.mustRead.count - 1 : !action.data.is_close && mustRead ? state.mustRead.count + 1 : state.mustRead.count,
          },
        }),
      };
    }
    case "REFETCH_UNREAD_COMPANY_POSTS_SUCCESS": {
      return {
        ...state,
        companyPosts: {
          ...state.companyPosts,
          posts: {
            ...state.companyPosts.posts,
            ...action.data.posts.reduce((res, post) => {
              let postKey = action.isSharedSlug ? post.code : post.id;
              if (state.companyPosts.posts[postKey]) {
                res[postKey] = {
                  claps: [],
                  ...state.companyPosts.posts[postKey],
                  ...post,
                  slug: action.slug,
                  sharedSlug: action.isSharedSlug,
                };
              } else {
                res[postKey] = {
                  claps: [],
                  ...post,
                  slug: action.slug,
                  sharedSlug: action.isSharedSlug,
                };
              }

              return res;
            }, {}),
          },
        },
      };
    }
    case "GET_UNREAD_COMPANY_POSTS_SUCCESS": {
      const filteredPosts = action.data.posts.filter((p) => {
        const hasCompanyAsRecipient = p.recipients.find((r) => r.main_department === true);
        if (hasCompanyAsRecipient) {
          return true;
        } else {
          const allParticipantIds = p.recipients
            .map((r) => {
              if (r.type === "USER") {
                return [r.type_id];
              } else return r.participant_ids;
            })
            .flat();
          return allParticipantIds.some((id) => id === state.user.id) || p.author.id === state.user.id;
        }
      });
      return {
        ...state,
        companyPosts: {
          ...state.companyPosts,
          posts: {
            ...state.companyPosts.posts,
            ...filteredPosts.reduce((res, post) => {
              let postKey = action.isSharedSlug ? post.code : post.id;
              if (state.companyPosts.posts[postKey]) {
                res[postKey] = {
                  claps: [],
                  ...state.companyPosts.posts[postKey],
                  ...post,
                  slug: action.slug,
                  sharedSlug: action.isSharedSlug,
                };
              } else {
                res[postKey] = {
                  claps: [],
                  ...post,
                  slug: action.slug,
                  sharedSlug: action.isSharedSlug,
                };
              }

              return res;
            }, {}),
          },
        },
        unreadPosts: {
          skip: action.data.next_skip,
          has_more: action.data.posts.length === 15,
          limit: 15,
          loaded: true,
        },
      };
    }
    case "GET_READ_COMPANY_POSTS_SUCCESS": {
      const filteredPosts = action.data.posts.filter((p) => {
        const hasCompanyAsRecipient = p.recipients.find((r) => r.main_department === true);
        if (hasCompanyAsRecipient) {
          return true;
        } else {
          const allParticipantIds = p.recipients
            .map((r) => {
              if (r.type === "USER") {
                return [r.type_id];
              } else return r.participant_ids;
            })
            .flat();
          return allParticipantIds.some((id) => id === state.user.id) || p.author.id === state.user.id;
        }
      });
      return {
        ...state,
        companyPosts: {
          ...state.companyPosts,
          posts: {
            ...state.companyPosts.posts,
            ...filteredPosts.reduce((res, post) => {
              let postKey = action.isSharedSlug ? post.code : post.id;
              if (state.companyPosts.posts[postKey]) {
                res[postKey] = {
                  claps: [],
                  ...state.companyPosts.posts[postKey],
                  ...post,
                  slug: action.slug,
                  sharedSlug: action.isSharedSlug,
                };
              } else {
                res[postKey] = {
                  claps: [],
                  ...post,
                  slug: action.slug,
                  sharedSlug: action.isSharedSlug,
                };
              }

              return res;
            }, {}),
          },
        },
        readPosts: {
          skip: action.data.next_skip,
          has_more: action.data.posts.length === 15,
          limit: 15,
        },
      };
    }
    //to update
    case "POST_LIST_SUCCESS": {
      return {
        ...state,
        postsLists: [...action.data],
      };
    }
    case "POST_LIST_CONNECT": {
      const post = {
        ...state.companyPosts.posts[action.data.post_id],
        post_list_connect: [{ id: action.data.link_id }],
      };
      return {
        ...state,
        companyPosts: {
          ...state.companyPosts,
          posts: {
            ...state.companyPosts.posts,
            [action.data.post_id]: post,
          },
        },
      };
    }
    case "POST_LIST_DISCONNECT": {
      const post = {
        ...state.companyPosts.posts[action.data.post_id],
        post_list_connect: [],
      };
      return {
        ...state,
        companyPosts: {
          ...state.companyPosts,
          posts: {
            ...state.companyPosts.posts,
            [action.data.post_id]: post,
          },
        },
      };
    }
    case "REMOVE_POST": {
      return {
        ...state,
        companyPosts: {
          ...state.companyPosts,
          posts: {
            ...Object.keys(state.companyPosts.posts)
              .filter((key) => {
                if (action.data.sharedSlug) {
                  return key !== action.data.post_code;
                } else {
                  return parseInt(key) !== action.data.id;
                }
              })
              .reduce((res, key) => {
                res[key] = { ...state.companyPosts.posts[key] };
                return res;
              }, {}),
          },
        },
      };
    }
    case "INCOMING_POST_REQUIRED": {
      let postKey = action.data.sharedSlug ? action.data.post.post_code : action.data.post.id;
      return {
        ...state,
        companyPosts: {
          ...state.companyPosts,
          posts: {
            ...state.companyPosts.posts,
            ...(typeof state.companyPosts.posts[postKey] !== "undefined" && {
              [postKey]: {
                ...state.companyPosts.posts[postKey],
                required_users: action.data.required_users,
                user_reads: action.data.user_reads,
                must_read_users: action.data.must_read_users,
                must_reply_users: action.data.must_reply_users,
              },
            }),
          },
        },
        mustRead: {
          ...state.mustRead,
          count: action.data.must_read_users && action.data.must_read_users.some((u) => u.id === action.data.userId && u.must_read) ? state.mustRead.count - 1 : state.mustRead.count,
        },
        mustReply: {
          ...state.mustReply,
          count: action.data.must_reply_users && action.data.must_reply_users.some((u) => u.id === action.data.userId && u.must_reply) ? state.mustReply.count - 1 : state.mustReply.count,
        },
      };
    }
    case "SET_POST_COMMENT_TYPE": {
      return {
        ...state,
        commentType: action.data,
      };
    }
    //to update
    case "INCOMING_REMOVED_FILE_AUTOMATICALLY": {
      return {
        ...state,
        companyPosts: {
          ...state.companyPosts,
          posts: {
            ...state.companyPosts.posts,
            ...action.data.files.reduce((res, obj) => {
              if (obj.post_id && state.companyPosts.posts[obj.post_id]) {
                const files_trashed =
                  state.companyPosts.posts[obj.post_id].files.length === 0
                    ? []
                    : state.companyPosts.posts[obj.post_id].files
                        .filter((f) => action.data.files.some((file) => file.file_id === f.file_id))
                        .map((f) => {
                          return { ...f, deleted_at: { timestamp: getCurrentTimestamp() } };
                        });
                res[obj.post_id] = {
                  ...state.companyPosts.posts[obj.post_id],
                  files: state.companyPosts.posts[obj.post_id].files.filter((f) => !action.data.files.some((file) => file.file_id === f.file_id)),
                  files_trashed: files_trashed,
                };
              }
              return res;
            }, {}),
          },
        },
      };
    }
    //to update
    case "INCOMING_REMOVED_FILE_AFTER_DOWNLOAD": {
      return {
        ...state,
        companyPosts: {
          ...state.companyPosts,
          posts: {
            ...state.companyPosts.posts,
            ...Object.values(state.companyPosts.posts).reduce((res, post) => {
              let postKey = post.sharedSlug ? post.code : post.id;
              if (post.files.some((f) => f.file_id === action.data.file_id)) {
                res[postKey] = { ...state.companyPosts.posts[postKey], files: state.companyPosts.posts[postKey].files.filter((f) => f.file_id !== action.data.file_id) };
              } else {
                res[postKey] = { ...state.companyPosts.posts[postKey] };
              }
              return res;
            }, {}),
          },
        },
      };
    }
    case "REMOVE_DRAFT_POST": {
      return {
        ...state,
        companyPosts: {
          ...state.companyPosts,
          posts: {
            ...Object.values(state.companyPosts.posts).reduce((res, post) => {
              let postKey = post.sharedSlug ? post.code : post.id;
              if (post.id !== action.data.post_id) {
                res[postKey] = { ...state.companyPosts.posts[postKey] };
              }
              return res;
            }, {}),
          },
        },
      };
    }
    case "GET_ARCHIVED_COMPANY_POSTS_SUCCESS": {
      return {
        ...state,
        archived: {
          ...state.archived,
          limit: 25,
          skip: action.data.next_skip,
          has_more: action.data.total_take === state.archived.limit,
        },
        companyPosts: {
          ...state.companyPosts,
          posts: {
            ...state.companyPosts.posts,
            ...action.data.posts.reduce((res, post) => {
              let postKey = action.isSharedSlug ? post.code : post.id;
              if (state.companyPosts.posts[postKey]) {
                res[postKey] = {
                  claps: [],
                  ...state.companyPosts.posts[postKey],
                  ...post,
                  slug: action.slug,
                  sharedSlug: action.isSharedSlug,
                };
              } else {
                res[postKey] = {
                  claps: [],
                  ...post,
                  slug: action.slug,
                  sharedSlug: action.isSharedSlug,
                };
              }
              return res;
            }, {}),
          },
        },
      };
    }
    case "GET_MY_COMPANY_POSTS_SUCCESS": {
      return {
        ...state,
        myPosts: {
          ...state.myPosts,
          limit: 25,
          skip: action.data.next_skip,
          has_more: action.data.total_take === state.myPosts.limit,
        },
        companyPosts: {
          ...state.companyPosts,
          posts: {
            ...state.companyPosts.posts,
            ...action.data.posts.reduce((res, post) => {
              let postKey = action.isSharedSlug ? post.code : post.id;
              if (state.companyPosts.posts[postKey]) {
                res[postKey] = {
                  claps: [],
                  ...state.companyPosts.posts[postKey],
                  ...post,
                  slug: action.slug,
                  sharedSlug: action.isSharedSlug,
                };
              } else {
                res[postKey] = {
                  claps: [],
                  ...post,
                  slug: action.slug,
                  sharedSlug: action.isSharedSlug,
                };
              }
              return res;
            }, {}),
          },
        },
      };
    }
    case "GET_STAR_COMPANY_POSTS_SUCCESS": {
      return {
        ...state,
        favourites: {
          ...state.favourites,
          limit: 25,
          skip: action.data.next_skip,
          has_more: action.data.total_take === state.favourites.limit,
        },
        companyPosts: {
          ...state.companyPosts,
          posts: {
            ...state.companyPosts.posts,
            ...action.data.posts.reduce((res, post) => {
              let postKey = action.isSharedSlug ? post.code : post.id;
              if (state.companyPosts.posts[postKey]) {
                res[postKey] = {
                  claps: [],
                  ...state.companyPosts.posts[postKey],
                  ...post,
                  slug: action.slug,
                  sharedSlug: action.isSharedSlug,
                };
              } else {
                res[postKey] = {
                  claps: [],
                  ...post,
                  slug: action.slug,
                  sharedSlug: action.isSharedSlug,
                };
              }
              return res;
            }, {}),
          },
        },
      };
    }
    case "INCOMING_FOLLOW_POST": {
      const post = Object.values(state.companyPosts.posts).find((p) => p.id === action.data.post_id && p.sharedSlug === action.data.sharedSlug);
      return {
        ...state,
        ...(!action.data.sharedSlug &&
          state.companyPosts.posts.hasOwnProperty(action.data.post_id) && {
            companyPosts: {
              ...state.companyPosts,
              posts: {
                ...state.companyPosts.posts,
                [action.data.post_id]: {
                  ...state.companyPosts.posts[action.data.post_id],
                  //is_followed: action.data.new_recipient_id === state.user.id ? true : state.companyPosts.posts[action.data.post_id].is_followed,
                  user_unfollow: state.companyPosts.posts[action.data.post_id].user_unfollow.filter((p) => p.id !== action.data.user_follow.id),
                },
              },
            },
          }),
        ...(action.data.sharedSlug &&
          post && {
            companyPosts: {
              ...state.companyPosts,
              posts: {
                ...state.companyPosts.posts,
                [post.code]: {
                  ...state.companyPosts.posts[post.code],
                  //is_followed: action.data.user_unfollow.id === state.user.id ? false : state.companyPosts.posts[action.data.post_id].is_followed,
                  user_unfollow: state.companyPosts.posts[post.code].user_unfollow.filter((p) => p.id !== action.data.user_follow.id),
                },
              },
            },
          }),
      };
    }
    case "INCOMING_UNFOLLOW_POST": {
      const post = Object.values(state.companyPosts.posts).find((p) => p.id === action.data.post_id && p.sharedSlug === action.data.sharedSlug);
      return {
        ...state,
        ...(!action.data.sharedSlug &&
          state.companyPosts.posts.hasOwnProperty(action.data.post_id) && {
            companyPosts: {
              ...state.companyPosts,
              posts: {
                ...state.companyPosts.posts,
                [action.data.post_id]: {
                  ...state.companyPosts.posts[action.data.post_id],
                  //is_followed: action.data.user_unfollow.id === state.user.id ? false : state.companyPosts.posts[action.data.post_id].is_followed,
                  user_unfollow: [...state.companyPosts.posts[action.data.post_id].user_unfollow, action.data.user_unfollow],
                },
              },
            },
          }),
        ...(action.data.sharedSlug &&
          post && {
            companyPosts: {
              ...state.companyPosts,
              posts: {
                ...state.companyPosts.posts,
                [post.code]: {
                  ...state.companyPosts.posts[post.code],
                  //is_followed: action.data.user_unfollow.id === state.user.id ? false : state.companyPosts.posts[action.data.post_id].is_followed,
                  user_unfollow: [...state.companyPosts.posts[post.code].user_unfollow, action.data.user_unfollow],
                },
              },
            },
          }),
      };
    }
    case "GET_IN_PROGRESS_COMPANY_POSTS_SUCCESS": {
      return {
        ...state,
        inProgress: {
          ...state.inProgress,
          limit: 25,
          skip: action.data.next_skip,
          has_more: action.data.total_take === state.inProgress.limit,
        },
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
    case "INCOMING_REMOVED_TEAM_MEMBER":
    case "REMOVE_TEAM_MEMBER_SUCCESS": {
      return {
        ...state,
        companyPosts: {
          ...state.companyPosts,
          posts: Object.values(state.companyPosts.posts)
            .filter((post) => {
              if (state.user && action.data.remove_member_ids.some((id) => id === state.user.id)) {
                if (
                  post.recipients.some((r) => r.type === "DEPARTMENT") ||
                  post.recipients.some((r) => r.type === "USER" && r.type_id === state.user.id) ||
                  post.recipients.some((r) => r.type === "TOPIC" && r.participant_ids.some((id) => id === state.user.id))
                ) {
                  return true;
                }
                if (post.recipients.some((r) => r.type === "TEAM" && r.id !== parseInt(action.data.id) && r.participant_ids && r.participant_ids.some((id) => id === state.user.id))) {
                  return true;
                }
                if (post.recipients.some((r) => r.type === "TEAM" && r.id === parseInt(action.data.id) && r.participant_ids && r.participant_ids.some((id) => id === state.user.id))) {
                  return false;
                } else {
                  return true;
                }
              } else {
                return true;
              }
            })
            .reduce((acc, post) => {
              let postKey = post.sharedSlug ? post.code : post.id;
              if (post.recipients.some((r) => r.type === "TEAM" && r.id === parseInt(action.data.id))) {
                acc[postKey] = {
                  ...post,
                  recipients: post.recipients.map((r) => {
                    if (r.type === "TEAM" && r.id === parseInt(action.data.id)) {
                      return { ...r, participant_ids: action.data.member_ids };
                    } else {
                      return r;
                    }
                  }),
                };
              } else {
                acc[postKey] = post;
              }
              return acc;
            }, {}),
        },
      };
    }
    case "INCOMING_TEAM_MEMBER":
    case "ADD_TEAM_MEMBER_SUCCESS": {
      return {
        ...state,
        companyPosts: {
          ...state.companyPosts,
          posts: Object.values(state.companyPosts.posts).reduce((acc, post) => {
            let postKey = post.sharedSlug ? post.code : post.id;
            if (post.recipients.some((r) => r.type === "TEAM" && r.id === parseInt(action.data.id))) {
              acc[postKey] = {
                ...post,
                recipients: post.recipients.map((r) => {
                  if (r.type === "TEAM" && r.id === parseInt(action.data.id)) {
                    return { ...r, participant_ids: action.data.member_ids };
                  } else {
                    return r;
                  }
                }),
              };
            } else {
              acc[postKey] = post;
            }
            return acc;
          }, {}),
        },
      };
    }
    case "INCOMING_DELETED_TEAM": {
      return {
        ...state,
        companyPosts: {
          ...state.companyPosts,
          posts: Object.values(state.companyPosts.posts)
            .filter((post) => {
              if (
                post.recipients.some((r) => r.type === "DEPARTMENT") ||
                post.recipients.some((r) => r.type === "USER" && r.type_id === state.user.id) ||
                post.recipients.some((r) => r.type === "TOPIC" && r.participant_ids.some((id) => id === state.user.id))
              ) {
                return true;
              }
              if (post.recipients.some((r) => r.type === "TEAM" && r.id !== parseInt(action.data.id) && r.participant_ids && r.participant_ids.some((id) => id === state.user.id))) {
                return true;
              }
              if (post.recipients.some((r) => r.type === "TEAM" && r.id === parseInt(action.data.id) && r.participant_ids && r.participant_ids.some((id) => id === state.user.id))) {
                return false;
              } else {
                return true;
              }
            })
            .reduce((acc, post) => {
              let postKey = post.sharedSlug ? post.code : post.id;
              if (post.recipients.some((r) => r.type === "TEAM" && r.id === parseInt(action.data.id))) {
                acc[postKey] = {
                  ...post,
                  recipients: post.recipients.filter((r) => {
                    if (r.type === "TEAM" && r.id === parseInt(action.data.id)) {
                      return false;
                    } else {
                      return true;
                    }
                  }),
                };
              } else {
                acc[postKey] = post;
              }
              return acc;
            }, {}),
        },
      };
    }
    case "INCOMING_ACCEPTED_INTERNAL_USER": {
      if (action.data.team_ids.length) {
        return {
          ...state,
          companyPosts: {
            ...state.companyPosts,
            posts: Object.values(state.companyPosts.posts).reduce((acc, post) => {
              let postKey = post.sharedSlug ? post.code : post.id;
              if (post.recipients.some((r) => r.type === "TEAM" && action.data.team_ids.some((id) => id === r.id))) {
                acc[postKey] = {
                  ...post,
                  recipients: post.recipients.map((r) => {
                    if (r.type === "TEAM" && action.data.team_ids.some((id) => id === r.id)) {
                      return { ...r, participant_ids: [...r.participant_ids, action.data.id] };
                    } else {
                      return r;
                    }
                  }),
                };
              } else {
                acc[postKey] = post;
              }
              return acc;
            }, {}),
          },
        };
      } else {
        return state;
      }
    }
    case "INCOMING_LAST_VISIT_POST": {
      return {
        ...state,
        companyPosts: {
          ...state.companyPosts,
          posts: Object.values(state.companyPosts.posts).reduce((acc, post) => {
            let postKey = post.sharedSlug ? post.code : post.id;
            if (post.id && action.data.post_id) {
              acc[postKey] = {
                ...post,
                last_visited_at: { timestamp: action.data.last_visit },
              };
            } else {
              acc[postKey] = post;
            }
            return acc;
          }, {}),
        },
      };
    }
    case "GET_POST_READ_CLAP_SUCCESS": {
      return {
        ...state,
        companyPosts: {
          ...state.companyPosts,
          posts: Object.values(state.companyPosts.posts).reduce((acc, post) => {
            let postKey = post.id;
            if (post.sharedSlug) {
              postKey = post.code;
            }
            if (post.code === action.data.code) {
              acc[postKey] = {
                ...post,
                claps: action.data.claps,
                post_reads: action.data.reads.map((r) => {
                  return {
                    ...r.user,
                    last_read_timestamp: r.last_read_timestamp,
                  };
                }),
              };
            } else {
              acc[postKey] = post;
            }
            return acc;
          }, {}),
        },
      };
    }
    case "SET_SELECTED_COMPANY_POST": {
      return {
        ...state,
        companyPosts: {
          ...state.companyPosts,
          posts: {
            ...state.companyPosts.posts,
            ...(state.companyPosts.posts[action.data.companyPostId] && {
              [action.data.companyPostId]: {
                ...state.companyPosts.posts[action.data.companyPostId],
                is_selected: action.data.isSelected,
              },
            }),
          },
        },
      };
    }
    case "GET_COMPANY_POST_CATEGORY_COUNTER_SUCCESS": {
      return {
        ...state,
        categoryCountLoaded: true,
        mustRead: {
          ...state.mustRead,
          count: action.data.must_read,
        },
        mustReply: {
          ...state.mustReply,
          count: action.data.must_reply,
        },
        noReplies: {
          ...state.noReplies,
          count: action.data.no_replies,
        },
        closedPost: {
          ...state.closedPost,
          count: action.data.closed_post,
        },
      };
    }
    case "GET_COMPANY_POSTS_BY_CATEGORY_SUCCESS": {
      return {
        ...state,
        companyPosts: {
          ...state.companyPosts,
          posts: {
            ...state.companyPosts.posts,
            ...action.data.posts.reduce((res, post) => {
              let postKey = action.isSharedSlug ? post.cod : post.id;
              if (state.companyPosts.posts[postKey]) {
                res[postKey] = {
                  claps: [],
                  ...state.companyPosts.posts[postKey],
                  ...post,
                };
              } else {
                res[postKey] = {
                  claps: [],
                  ...post,
                };
              }

              return res;
            }, {}),
          },
        },
      };
    }
    case "UPDATE_POST_CATEGORY": {
      return {
        ...state,
        [action.data.mode]: {
          ...state[action.data.mode],
          has_more: action.data.has_more,
          skip: action.data.skip,
        },
      };
    }
    case "UPDATE_POST_CATEGORY_COUNT": {
      return {
        ...state,
        mustRead: {
          ...state.mustRead,
          count: action.data.must_read_users && action.data.must_read_users.some((u) => u.id === state.user.id && !u.must_read) ? state.mustRead.count + 1 : state.mustRead.count,
        },
        mustReply: {
          ...state.mustReply,
          count: action.data.must_reply_users && action.data.must_reply_users.some((u) => u.id === state.user.id && !u.must_reply) ? state.mustReply.count + 1 : state.mustReply.count,
        },
        noReplies: {
          ...state.noReplies,
          count: action.data.is_read_only ? state.noReplies.count + 1 : state.noReplies.count,
        },
      };
    }
    case "SET_SHOW_UNREAD": {
      return {
        ...state,
        showUnread: action.data,
      };
    }
    case "GET_SHARED_UNREAD_COMPANY_POSTS_SUCCESS": {
      return {
        ...state,
        sharedCompanyPosts: {
          ...state.sharedCompanyPosts,
          ...(state.sharedCompanyPosts[action.slug] && {
            [action.slug]: {
              ...state.sharedCompanyPosts[action.slug],
              posts: {
                ...(state.sharedCompanyPosts[action.slug].posts && {
                  ...state.sharedCompanyPosts[action.slug].posts,
                }),
                ...action.data.posts.reduce((res, post) => {
                  res[post.code] = {
                    claps: [],
                    ...post,
                    sharedSlug: true,
                    slug: action.slug,
                  };

                  return res;
                }, {}),
              },
              unreadPosts: {
                prev_skip: parseInt(action.data.prev_skip),
                next_skip: action.data.next_skip,
                total_take: action.data.total_take,
                has_more: action.data.total_take === 25,
              },
            },
          }),
          ...(!state.sharedCompanyPosts[action.slug] && {
            [action.slug]: {
              posts: {
                ...action.data.posts.reduce((res, post) => {
                  res[post.code] = {
                    claps: [],
                    ...post,
                    sharedSlug: true,
                    slug: action.slug,
                  };

                  return res;
                }, {}),
              },
              archived: {
                skip: 0,
                has_more: true,
                limit: 25,
                next_skip: 0,
              },
              favourites: {
                skip: 0,
                has_more: true,
                limit: 25,
                next_skip: 0,
              },
              myPosts: {
                skip: 0,
                has_more: true,
                limit: 25,
                next_skip: 0,
              },
              unreadPosts: {
                prev_skip: parseInt(action.data.prev_skip),
                next_skip: action.data.next_skip,
                total_take: action.data.total_take,
                has_more: action.data.total_take === 25,
              },
              readPosts: {
                skip: 0,
                has_more: true,
                limit: 25,
                next_skip: 0,
              },
            },
          }),
        },
        companyPosts: {
          ...state.companyPosts,
          posts: {
            ...state.companyPosts.posts,
            ...action.data.posts.reduce((res, post) => {
              res[post.code] = {
                claps: [],
                ...post,
                sharedSlug: true,
                slug: action.slug,
              };
              return res;
            }, {}),
          },
        },
      };
    }
    case "GET_SHARED_READ_COMPANY_POSTS_SUCCESS": {
      return {
        ...state,
        sharedCompanyPosts: {
          ...state.sharedCompanyPosts,
          ...(state.sharedCompanyPosts[action.slug] && {
            [action.slug]: {
              ...state.sharedCompanyPosts[action.slug],
              posts: {
                ...(state.sharedCompanyPosts[action.slug].posts && {
                  ...state.sharedCompanyPosts[action.slug].posts,
                }),
                ...action.data.posts.reduce((res, post) => {
                  res[post.code] = {
                    claps: [],
                    ...post,
                    sharedSlug: true,
                    slug: action.slug,
                  };

                  return res;
                }, {}),
              },
              readPosts: {
                prev_skip: parseInt(action.data.prev_skip),
                next_skip: action.data.next_skip,
                total_take: action.data.total_take,
                has_more: action.data.total_take === 25,
              },
            },
          }),
          ...(!state.sharedCompanyPosts[action.slug] && {
            [action.slug]: {
              posts: {
                ...action.data.posts.reduce((res, post) => {
                  res[post.code] = {
                    claps: [],
                    ...post,
                    sharedSlug: true,
                    slug: action.slug,
                  };

                  return res;
                }, {}),
              },
              archived: {
                skip: 0,
                has_more: true,
                limit: 25,
                next_skip: 0,
              },
              favourites: {
                skip: 0,
                has_more: true,
                limit: 25,
                next_skip: 0,
              },
              myPosts: {
                skip: 0,
                has_more: true,
                limit: 25,
                next_skip: 0,
              },
              unreadPosts: {
                skip: 0,
                has_more: true,
                limit: 25,
                loaded: false,
                next_skip: 0,
              },
              readPosts: {
                prev_skip: parseInt(action.data.prev_skip),
                next_skip: action.data.next_skip,
                total_take: action.data.total_take,
                has_more: action.data.total_take === 25,
              },
            },
          }),
        },
        companyPosts: {
          ...state.companyPosts,
          posts: {
            ...state.companyPosts.posts,
            ...action.data.posts.reduce((res, post) => {
              res[post.code] = {
                claps: [],
                ...post,
                sharedSlug: true,
                slug: action.slug,
              };
              return res;
            }, {}),
          },
        },
      };
    }
    default:
      return state;
  }
};
