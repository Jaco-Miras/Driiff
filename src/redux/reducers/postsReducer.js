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
                };
              } else {
                res[obj.id] = {
                  claps: [],
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
                  claps: [],
                  ...state.companyPosts.posts[obj.id],
                  ...obj,
                };
              } else {
                res[obj.id] = {
                  claps: [],
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
                claps: [...state.companyPosts.posts[action.data.post_id].claps, { user_id: state.user.id }],
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
                claps: state.companyPosts.posts[action.data.post_id].claps.filter((c) => c.user_id !== state.user.id),
                clap_count: state.companyPosts.posts[action.data.post_id].clap_count - 1,
                user_clap_count: 0,
              },
            },
          },
        }),
      };
    }
    // case "GET_POST_CLAP_HOVER_SUCCESS": {
    //   const user_ids = action.data.claps.map((c) => c.user_id);
    //   return {
    //     ...state,
    //     ...(typeof state.companyPosts.posts[action.data.post_id] !== "undefined" && {
    //       companyPosts: {
    //         ...state.companyPosts,
    //         posts: {
    //           ...state.companyPosts.posts,
    //           [action.data.post_id]: {
    //             ...state.companyPosts.posts[action.data.post_id],
    //             //clap_user_ids: [...user_ids],
    //             fetchedReact: true,
    //           },
    //         },
    //       },
    //     }),
    //   };
    // }
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
      if (action.data.show_post) {
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
      } else {
        return state;
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
          posts[action.data.id] = { ...action.data, claps: posts[action.data.id].claps };
        } else {
          posts[action.data.id] = { ...action.data, claps: [] };
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
                      claps: [...state.companyPosts.posts[action.data.post_id].claps.filter((c) => c.user_id !== action.data.author.id), { user_id: action.data.author.id }],
                      user_clap_count: action.data.author.id === state.user.id ? 1 : state.companyPosts.posts[action.data.post_id].user_clap_count,
                    }
                  : {
                      clap_count: state.companyPosts.posts[action.data.post_id].clap_count - 1,
                      claps: state.companyPosts.posts[action.data.post_id].claps.filter((c) => c.user_id !== action.data.author.id),
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
        ...(state.companyPosts.posts.hasOwnProperty(action.data.post_id) && {
          companyPosts: {
            ...state.companyPosts,
            posts: {
              ...state.companyPosts.posts,
              [action.data.post_id]: {
                ...state.companyPosts.posts[action.data.post_id],
                view_user_ids: [...state.companyPosts.posts[action.data.post_id].view_user_ids, action.data.viewer.id],
                //is_unread: 0,
              },
            },
          },
        }),
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
                pos[p.id] = {
                  ...p,
                  is_archived: p.id === action.data.post_id ? action.data.is_archived : p.is_archived,
                };
                return pos;
              }, {}),
            }),
          },
        },
      };
    }
    case "INCOMING_POST_TOGGLE_FOLLOW": {
      return {
        ...state,
        ...(state.companyPosts.posts.hasOwnProperty(action.data.post_id) && {
          companyPosts: {
            ...state.companyPosts,
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
                // view_user_ids:
                //   action.data.unread === 0 ? [...state.companyPosts.posts[action.data.post_id].view_user_ids, action.data.user_id] : state.companyPosts.posts[action.data.post_id].view_user_ids.filter((id) => id !== action.data.user_id),
                is_unread: action.data.unread,
                unread_count: action.data.unread === 0 ? 0 : state.companyPosts.posts[action.data.post_id].unread_count,
              },
            },
          },
        }),
      };
    }
    case "INCOMING_COMMENT": {
      if (action.data.SOCKET_TYPE === "POST_COMMENT_CREATE") {
        const hasPendingAproval = action.data.users_approval.length > 0 && action.data.users_approval.filter((u) => u.ip_address === null).length === action.data.users_approval.length;
        const allUsersDisagreed = action.data.users_approval.length > 0 && action.data.users_approval.filter((u) => u.ip_address !== null && !u.is_approved).length === action.data.users_approval.length;
        const allUsersAgreed = action.data.users_approval.length > 0 && action.data.users_approval.filter((u) => u.ip_address !== null && u.is_approved).length === action.data.users_approval.length;
        const isApprover = action.data.users_approval.some((ua) => ua.id === state.user.id);
        return {
          ...state,
          companyPosts: {
            ...state.companyPosts,
            posts: {
              ...state.companyPosts.posts,
              ...(state.companyPosts.posts[action.data.post_id] && {
                [action.data.post_id]: {
                  ...state.companyPosts.posts[action.data.post_id],
                  unread_count: action.data.author.id !== state.user.id ? state.companyPosts.posts[action.data.post_id].unread_count + 1 : state.companyPosts.posts[action.data.post_id].unread_count,
                  is_unread: action.data.author.id !== state.user.id ? 1 : state.companyPosts.posts[action.data.post_id].is_unread,
                  updated_at: action.data.updated_at,
                  reply_count: state.companyPosts.posts[action.data.post_id].reply_count + 1,
                  has_replied: action.data.author.id === state.user.id ? true : false,
                  post_approval_label: allUsersAgreed
                    ? "ACCEPTED"
                    : allUsersDisagreed
                    ? "REQUEST_UPDATE"
                    : isApprover && hasPendingAproval
                    ? "NEED_ACTION"
                    : state.companyPosts.posts[action.data.post_id].author.id === action.data.author.id && hasPendingAproval
                    ? "REQUEST_APPROVAL"
                    : state.companyPosts.posts[action.data.post_id].post_approval_label,
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
          //companyPosts.posts[p.id].is_updated = true;
          companyPosts.posts[p.id].unread_count = 0;
          companyPosts.posts[p.id].is_unread = 0;
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
            ...action.data.posts.reduce((res, obj) => {
              if (state.companyPosts.posts[obj.id]) {
                res[obj.id] = {
                  claps: [],
                  ...state.companyPosts.posts[obj.id],
                  ...obj,
                };
              } else {
                res[obj.id] = {
                  claps: [],
                  ...obj,
                };
              }
              return res;
            }, {}),
          },
        },
      };
    }
    case "GET_UNARCHIVE_POST_DETAIL_SUCCESS":
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
            ...action.data.post_ids.reduce((res, id) => {
              if (state.companyPosts.posts[id]) {
                res[id] = {
                  ...state.companyPosts.posts[id],
                  is_read: true,
                  unread_count: 0,
                  is_unread: 0,
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
                };
              }
              return res;
            }, {}),
          },
        },
      };
    }
    case "POST_APPROVE_SUCCESS":
    case "INCOMING_POST_APPROVAL": {
      const allUsersDisagreed = action.data.users_approval.filter((u) => u.ip_address !== null && !u.is_approved).length === action.data.users_approval.length;
      const allUsersAgreed = action.data.users_approval.filter((u) => u.ip_address !== null && u.is_approved).length === action.data.users_approval.length;
      const allUsersAnswered = !action.data.users_approval.some((ua) => ua.ip_address === null);
      return {
        ...state,
        companyPosts: {
          ...state.companyPosts,
          posts: {
            ...state.companyPosts.posts,
            ...(typeof state.companyPosts.posts[action.data.post.id] !== "undefined" && {
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
    case "SET_POSTREAD": {
      return {
        ...state,
        companyPosts: {
          ...state.companyPosts,
          posts: {
            ...state.companyPosts.posts,
            ...(state.companyPosts.posts[action.data.postId] && {
              [action.data.postId]: {
                ...state.companyPosts.posts[action.data.postId],
                post_reads: [...action.data.readPosts],
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
      return {
        ...state,
        companyPosts: {
          ...state.companyPosts,
          posts: {
            ...state.companyPosts.posts,
            ...(state.companyPosts.posts[action.data.post.id] && {
              [action.data.post.id]: {
                ...state.companyPosts.posts[action.data.post.id],
                is_close: action.data.is_close,
                post_close: {
                  initiator: action.data.initiator,
                },
              },
            }),
          },
        },
        closedPost: {
          ...state.closedPost,
          count: state.closedPost.count + 1,
        },
      };
    }
    case "REFETCH_UNREAD_COMPANY_POSTS_SUCCESS": {
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
                };
              } else {
                res[obj.id] = {
                  claps: [],
                  ...obj,
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
            ...filteredPosts.reduce((res, obj) => {
              if (state.companyPosts.posts[obj.id]) {
                res[obj.id] = {
                  claps: [],
                  ...state.companyPosts.posts[obj.id],
                  ...obj,
                };
              } else {
                res[obj.id] = {
                  claps: [],
                  ...obj,
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
            ...filteredPosts.reduce((res, obj) => {
              if (state.companyPosts.posts[obj.id]) {
                res[obj.id] = {
                  claps: [],
                  ...state.companyPosts.posts[obj.id],
                  ...obj,
                };
              } else {
                res[obj.id] = {
                  claps: [],
                  ...obj,
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
              .filter((key) => parseInt(key) !== action.data.id)
              .reduce((res, id) => {
                res[id] = { ...state.companyPosts.posts[id] };
                return res;
              }, {}),
          },
        },
      };
    }
    case "INCOMING_POST_REQUIRED": {
      return {
        ...state,
        companyPosts: {
          ...state.companyPosts,
          posts: {
            ...state.companyPosts.posts,
            ...(typeof state.companyPosts.posts[action.data.post.id] !== "undefined" && {
              [action.data.post.id]: {
                ...state.companyPosts.posts[action.data.post.id],
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
          count: action.data.must_read_users && action.data.must_read_users.some((u) => u.id === state.user.id && u.must_read) ? state.mustRead.count - 1 : state.mustRead.count,
        },
        mustReply: {
          ...state.mustReply,
          count: action.data.must_reply_users && action.data.must_reply_users.some((u) => u.id === state.user.id && u.must_reply) ? state.mustReply.count - 1 : state.mustReply.count,
        },
      };
    }
    case "SET_POST_COMMENT_TYPE": {
      return {
        ...state,
        commentType: action.data,
      };
    }
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
    case "INCOMING_REMOVED_FILE_AFTER_DOWNLOAD": {
      return {
        ...state,
        companyPosts: {
          ...state.companyPosts,
          posts: {
            ...state.companyPosts.posts,
            ...Object.values(state.companyPosts.posts).reduce((res, post) => {
              if (post.files.some((f) => f.file_id === action.data.file_id)) {
                res[post.id] = { ...state.companyPosts.posts[post.id], files: state.companyPosts.posts[post.id].files.filter((f) => f.file_id !== action.data.file_id) };
              } else {
                res[post.id] = { ...state.companyPosts.posts[post.id] };
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
              if (post.id !== action.data.post_id) {
                res[post.id] = { ...state.companyPosts.posts[post.id] };
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
            ...action.data.posts.reduce((res, obj) => {
              if (state.companyPosts.posts[obj.id]) {
                res[obj.id] = {
                  claps: [],
                  ...state.companyPosts.posts[obj.id],
                  ...obj,
                };
              } else {
                res[obj.id] = {
                  claps: [],
                  ...obj,
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
            ...action.data.posts.reduce((res, obj) => {
              if (state.companyPosts.posts[obj.id]) {
                res[obj.id] = {
                  claps: [],
                  ...state.companyPosts.posts[obj.id],
                  ...obj,
                };
              } else {
                res[obj.id] = {
                  claps: [],
                  ...obj,
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
            ...action.data.posts.reduce((res, obj) => {
              if (state.companyPosts.posts[obj.id]) {
                res[obj.id] = {
                  claps: [],
                  ...state.companyPosts.posts[obj.id],
                  ...obj,
                };
              } else {
                res[obj.id] = {
                  claps: [],
                  ...obj,
                };
              }
              return res;
            }, {}),
          },
        },
      };
    }
    case "INCOMING_FOLLOW_POST": {
      return {
        ...state,
        ...(state.companyPosts.posts.hasOwnProperty(action.data.post_id) && {
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
      };
    }
    case "INCOMING_UNFOLLOW_POST": {
      return {
        ...state,
        ...(state.companyPosts.posts.hasOwnProperty(action.data.post_id) && {
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
              if (post.recipients.some((r) => r.type === "TEAM" && r.id === parseInt(action.data.id))) {
                acc[post.id] = {
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
                acc[post.id] = post;
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
            if (post.recipients.some((r) => r.type === "TEAM" && r.id === parseInt(action.data.id))) {
              acc[post.id] = {
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
              acc[post.id] = post;
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
              if (post.recipients.some((r) => r.type === "TEAM" && r.id === parseInt(action.data.id))) {
                acc[post.id] = {
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
                acc[post.id] = post;
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
              if (post.recipients.some((r) => r.type === "TEAM" && action.data.team_ids.some((id) => id === r.id))) {
                acc[post.id] = {
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
                acc[post.id] = post;
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
            if (post.id && action.data.post_id) {
              acc[post.id] = {
                ...post,
                last_visited_at: { timestamp: action.data.last_visit },
              };
            } else {
              acc[post.id] = post;
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
            if (post.id === action.data.id) {
              acc[post.id] = {
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
              acc[post.id] = post;
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
            [action.data.companyPostId]: {
              ...state.companyPosts.posts[action.data.companyPostId],
              is_selected: action.data.isSelected,
            },
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
            ...action.data.posts.reduce((res, obj) => {
              if (state.companyPosts.posts[obj.id]) {
                res[obj.id] = {
                  claps: [],
                  ...state.companyPosts.posts[obj.id],
                  ...obj,
                };
              } else {
                res[obj.id] = {
                  claps: [],
                  ...obj,
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
    default:
      return state;
  }
};
