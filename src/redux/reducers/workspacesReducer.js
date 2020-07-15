/* eslint-disable no-prototype-builtins */
import {convertArrayToObject} from "../../helpers/arrayHelper";

const INITIAL_STATE = {
  user: {},
  workspaces: {},
  activeTopic: null,
  activeTab: "intern",
  workspacesLoaded: false,
  externalWorkspacesLoaded: false,
  workspacePosts: {},
  postComments: {},
  drafts: [],
  workspaceTimeline: {},
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "ADD_USER_TO_REDUCERS": {
      return {
        ...state,
        user: action.data,
      };
    }
    case "GET_WORKSPACES_SUCCESS": {
      let workspaces = { ...state.workspaces };
      action.data.workspaces.forEach((ws) => {
        let topics = {};
        if (typeof workspaces[ws.id] !== "undefined" && typeof workspaces[ws.id].topics !== "undefined") {
          topics = workspaces[ws.id].topics;
        }

        if (ws.topics !== undefined && ws.topics.length > 0) {
          ws.topics.forEach((t) => {
            topics[t.id] = {
              ...t,
              selected: false,
              is_external: ws.is_external,
              workspace_id: ws.id,
              workspace_name: ws.name,
              workspace_description: ws.description,
              type: "TOPIC",
            };
          });
        }
        workspaces[ws.id] = {
          ...workspaces[ws.id],
          ...ws,
          selected: false,
          topics: topics,
        };
      });

      return {
        ...state,
        workspaces: workspaces,
        workspacesLoaded: !state.workspacesLoaded && action.data.is_external === 0 ? true : state.workspacesLoaded,
        externalWorkspacesLoaded: !state.externalWorkspacesLoaded && action.data.is_external === 1 ? true : state.externalWorkspacesLoaded,
      };
    }
    case "INCOMING_WORKSPACE_FOLDER": {
      if (state.workspacesLoaded) {
        let newWorkspaces = { ...state.workspaces };
        newWorkspaces = {
          ...newWorkspaces,
          [action.data.id]: {
            ...action.data,
            topics: {},
            selected: false,
          },
        };
        return {
          ...state,
          workspaces: newWorkspaces,
        };
      } else {
        return state;
      }
    }
    case "INCOMING_WORKSPACE": {
      if (state.workspacesLoaded) {
        let newWorkspaces = { ...state.workspaces };
        if (action.data.workspace) {
          newWorkspaces = {
            ...newWorkspaces,
            [action.data.workspace.id]: {
              ...newWorkspaces[action.data.workspace.id],
              topics: {
                ...newWorkspaces[action.data.workspace.id].topics,
                [action.data.topic.id]: {
                  ...action.data.topic,
                  selected: false,
                  unread_posts: 0,
                  unread_chats: 0,
                  private: action.data.topic.private ? 1 : 0,
                  channel: action.data.channel,
                  is_external: action.data.is_external,
                  workspace_name: action.data.workspace.name,
                },
              },
              selected: false,
            },
          };
        } else {
          newWorkspaces = {
            ...newWorkspaces,
            [action.data.id]: {
              ...action.data,
              name: action.data.topic.name,
              description: action.data.topic.description,
              selected: false,
              topic_detail: {
                ...action.data.topic,
                channel: action.data.channel,
              },
            },
          };
        }

        return {
          ...state,
          workspaces: newWorkspaces,
        };
      } else {
        return state;
      }
    }
    case "INCOMING_UPDATED_WORKSPACE_FOLDER": {
      if (state.workspacesLoaded && action.data.type === "FOLDER") {
        let workspace = { ...state.workspaces[action.data.id] };
        workspace = {
          ...workspace,
          name: action.data.name,
          description: action.data.description,
        };
        return {
          ...state,
          workspaces: {
            ...state.workspaces,
            [action.data.id]: workspace,
          },
          activeTopic:
            state.activeTopic && state.activeTopic.workspace_id !== undefined && state.activeTopic.workspace_id === action.data.id
              ? {
                  ...state.activeTopic,
                  workspace_name: action.data.name,
                  workspace_description: action.data.description,
                }
              : state.activeTopic,
        };
      } else if (state.workspacesLoaded && action.data.type === "WORKSPACE") {
        let workspace = null;
        if (action.data.workspace_id === 0) {
          //direct workspace
          if (action.data.original_workspace_id === 0) {
            // still direct workspace
            if (!state.workspaces.hasOwnProperty(action.data.id)) {
              //new member - add workspace here
              return state;
            } else {
              workspace = { ...state.workspaces[action.data.id] };
              workspace = {
                ...workspace,
                name: action.data.name,
                member_ids: action.data.member_ids,
                members: action.data.members,
                description: action.data.description,
                updated_at: action.data.updated_at,
              };
              return {
                ...state,
                workspaces: {
                  ...state.workspaces,
                  [action.data.id]: workspace,
                },
                activeTopic:
                  state.activeTopic && state.activeTopic.id === action.data.id
                    ? {
                        ...state.activeTopic,
                        ...workspace,
                      }
                    : state.activeTopic,
              };
            }
          } else {
            //make workspace as direct
            //delete the original workspace
            let newWorkspaces = { ...state.workspaces };
            workspace = { ...newWorkspaces[action.data.original_workspace_id].topics[action.data.id] };
            delete newWorkspaces[action.data.original_workspace_id].topics[action.data.id];

            if (workspace.hasOwnProperty("id")) {
              workspace = {
                ...workspace,
                name: action.data.name,
                description: action.data.description,
                member_ids: action.data.member_ids,
                members: action.data.members,
                type: action.data.type,
                key_id: action.data.key_id,
                is_lock: workspace.private,
                unread_count: workspace.unread_chats + workspace.unread_posts,
                topic_detail: {
                  ...workspace,
                  channel: workspace.channel,
                  member_ids: action.data.member_ids,
                  members: action.data.members,
                  description: action.data.description,
                },
                updated_at: action.data.updated_at,
              };
              delete workspace.workspace_id;
              delete workspace.workspace_name;
              delete workspace.workspace_descripiton;
              newWorkspaces = {
                ...newWorkspaces,
                [action.data.id]: workspace,
              };
            }

            return {
              ...state,
              workspaces: newWorkspaces,
              activeTopic:
                state.activeTopic && state.activeTopic.id === action.data.id
                  ? {
                      ...workspace,
                    }
                  : state.activeTopic,
            };
          }
        } else {
          //workspace under folder
          let workspace = null;
          if (action.data.original_workspace_id === action.data.workspace_id) {
            //no change on folder workspace
            let newWorkspaces = { ...state.workspaces };
            workspace = { ...newWorkspaces[action.data.original_workspace_id].topics[action.data.id] };
            if (workspace.hasOwnProperty("id")) {
              workspace = {
                ...workspace,
                name: action.data.name,
                description: action.data.description,
                member_ids: action.data.member_ids,
                members: action.data.members,
                updated_at: action.data.updated_at,
              };
              newWorkspaces = {
                ...newWorkspaces,
                [action.data.workspace_id]: {
                  ...newWorkspaces[action.data.workspace_id],
                  updated_at: action.data.updated_at,
                  topics: {
                    ...newWorkspaces[action.data.workspace_id].topics,
                    [action.data.id]: workspace,
                  },
                },
              };
            }

            return {
              ...state,
              workspaces: newWorkspaces,
              activeTopic:
                state.activeTopic && state.activeTopic.workspace_id !== undefined && state.activeTopic.id === action.data.id
                  ? {
                      ...state.activeTopic,
                      ...workspace,
                    }
                  : state.activeTopic,
            };
          } else {
            //moved workspace to another folder
            // delete original workspace
            let newWorkspaces = { ...state.workspaces };
            let workspaceFolder = { ...newWorkspaces[action.data.workspace_id] };

            if (action.data.original_workspace_id === 0) {
              workspace = { ...newWorkspaces[action.data.id] };
              delete newWorkspaces[action.data.id];
            } else {
              workspace = { ...newWorkspaces[action.data.original_workspace_id].topics[action.data.id] };
              delete newWorkspaces[action.data.original_workspace_id].topics[action.data.id];
            }

            if (workspace.hasOwnProperty("id")) {
              workspace = {
                ...workspace,
                name: action.data.name,
                description: action.data.description,
                member_ids: action.data.member_ids,
                members: action.data.members,
                workspace_id: action.data.workspace_id,
                workspace_descripiton: workspaceFolder.description,
                workspace_name: workspaceFolder.name,
                updated_at: action.data.updated_at,
              };
              newWorkspaces = {
                ...newWorkspaces,
                [action.data.workspace_id]: {
                  ...newWorkspaces[action.data.workspace_id],
                  topics: {
                    ...newWorkspaces[action.data.workspace_id].topics,
                    [action.data.id]: workspace,
                  },
                },
              };
            }
            return {
              ...state,
              workspaces: newWorkspaces,
              activeTopic:
                state.activeTopic && state.activeTopic.workspace_id !== undefined && state.activeTopic.id === action.data.id
                  ? {
                      ...state.activeTopic,
                      ...workspace,
                    }
                  : state.activeTopic,
            };
          }
        }
      } else {
        return state;
      }
    }
    case "INCOMING_MOVED_TOPIC": {
      // get the topic from the original workspace id and transfer to the new workspace id
      if (state.workspacesLoaded) {
        // let topic = {...state.workspaces[action.data.original_workspace_id].topics[action.data.topic.id]}
        // let workspace = {...state.workspaces[action.data.workspace_id]}
        // workspace = {
        //     ...workspace,
        //     topics: {
        //         ...workspace.topics,
        //         [action.data.topic.id]: topic
        //     }
        // }
        // let newWorkspaces = {...state.workspaces}
        // delete newWorkspaces[action.data.original_workspace_id].topics[action.data.topic.id]
        // newWorkspaces = {
        //     ...newWorkspaces,
        //     [action.data.workspace_id]: workspace
        // }

        // return {
        //     ...state,
        //     workspaces: newWorkspaces
        // }
        return state;
      } else {
        return state;
      }
    }
    case "SET_ACTIVE_TOPIC": {
      let newWorkspaces = { ...state.workspaces };
      if (state.activeTopic) {
        if (state.activeTopic.workspace_id !== undefined) {
          newWorkspaces = {
            ...newWorkspaces,
            [state.activeTopic.workspace_id]: {
              ...newWorkspaces[state.activeTopic.workspace_id],
              topics: {
                ...newWorkspaces[state.activeTopic.workspace_id].topics,
                [state.activeTopic.id]: {
                  ...state.activeTopic,
                  selected: false,
                  channel: {
                    ...state.activeTopic.channel,
                    channel_loaded: true,
                  },
                },
              },
              selected: false,
            },
          };
        } else {
          //last active is direct workspace
          if (newWorkspaces.hasOwnProperty(state.activeTopic.id)) {
            newWorkspaces = {
              ...newWorkspaces,
              [state.activeTopic.id]: {
                ...newWorkspaces[state.activeTopic.id],
                selected: false,
                channel_loaded: true,
              },
            };
          }
        }
      }
      if (action.data.workspace_id !== undefined) {
        newWorkspaces = {
          ...newWorkspaces,
          [action.data.workspace_id]: {
            ...newWorkspaces[action.data.workspace_id],
            topics: {
              ...newWorkspaces[action.data.workspace_id].topics,
              [action.data.id]: {
                ...action.data,
                selected: true,
                channel: {
                  ...action.data.channel,
                  channel_loaded: true,
                },
              },
            },
            selected: true,
          },
        };
      } else {
        newWorkspaces = {
          ...newWorkspaces,
          [action.data.id]: {
            ...newWorkspaces[action.data.id],
            selected: true,
            channel_loaded: true,
          },
        };
      }

      return {
        ...state,
        workspaces: newWorkspaces,
        activeTopic: { ...action.data, selected: true },
      };
    }
    case "SET_ACTIVE_TAB": {
      return {
        ...state,
        activeTab: action.data,
      };
    }
    case "ADD_POST_SEARCH_RESULT": {
      return {
        ...state,
        workspacePosts: {
          ...state.workspacePosts,
          [action.data.topic_id]: {
            ...state.workspacePosts[action.data.topic_id],
            search: action.data.search,
            searchResults: action.data.search_result,
          },
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
      if (state.workspacePosts.hasOwnProperty(action.data.topic_id)) {
        return {
          ...state,
          workspacePosts: {
            ...state.workspacePosts,
            [action.data.topic_id]: {
              ...state.workspacePosts[action.data.topic_id],
              posts: {
                ...state.workspacePosts[action.data.topic_id].posts,
                ...convertedPosts,
                ...postDrafts,
              },
            },
          },
        };
      } else {
        return {
          ...state,
          workspacePosts: {
            ...state.workspacePosts,
            [action.data.topic_id]: {
              filter: "all",
              sort: "recent",
              tag: null,
              search: null,
              searchResults: [],
              count: null,
              posts: {
                ...convertedPosts,
                ...postDrafts,
              },
              post_ids: [...action.data.posts.map((p) => p.id), ...state.drafts.map((d) => d.data.id)],
            },
          },
        };
      }
    }
    case "UPDATE_WORKSPACE_POST_FILTER_SORT": {
      return {
        ...state,
        workspacePosts: {
          ...state.workspacePosts,
          [action.data.topic_id]: {
            ...state.workspacePosts[action.data.topic_id],
            filter: action.data.filter
              ? action.data.filter === state.workspacePosts[action.data.topic_id].filter
                ? state.workspacePosts[action.data.topic_id].filter
                : action.data.filter
              : state.workspacePosts[action.data.topic_id].filter,
            sort: action.data.sort ? (action.data.sort === state.workspacePosts[action.data.topic_id].sort ? state.workspacePosts[action.data.topic_id].sort : action.data.sort) : state.workspacePosts[action.data.topic_id].sort,
            tag: action.data.tag,
            // tag: action.data.tag ? action.data.tag === state.workspacePosts[action.data.topic_id].tag ? null
            //     : action.data.tag : state.workspacePosts[action.data.topic_id].tag
          },
        },
      };
    }
    case "JOIN_WORKSPACE_REDUCER": {
      let user = {
        id: action.data.user.id,
        name: action.data.user.name,
        first_name: action.data.user.first_name,
        profile_image_link: action.data.user.profile_image_link,
        partial_name: action.data.user.partial_name,
        active: 1,
      };
      let newWorkspaces = { ...state.workspaces };
      let topic = null;
      if (newWorkspaces.hasOwnProperty(action.data.topic_id)) {
        topic = { ...newWorkspaces[action.data.topic_id] };
        topic = {
          ...topic,
          members: [
            ...topic.members,
            {
              ...user,
              type: topic.members[0].type,
              slug: topic.members[0].slug,
            },
          ],
          member_ids: [...topic.member_ids, user.id],
        };
        newWorkspaces = {
          ...newWorkspaces,
          [action.data.topic_id]: topic,
        };
      } else {
        if (state.activeTopic.id === action.data.topic_id && (state.activeTopic.workspace_id !== undefined || state.activeTopic.workspace_id !== 0)) {
          topic = { ...newWorkspaces[state.activeTopic.workspace_id].topics[state.activeTopic.id] };
          topic = {
            ...topic,
            members: [
              ...topic.members,
              {
                ...user,
                type: topic.members[0].type,
                slug: topic.members[0].slug,
              },
            ],
            member_ids: [...topic.member_ids, user.id],
          };
          newWorkspaces = {
            ...newWorkspaces,
            [state.activeTopic.workspace_id]: {
              ...newWorkspaces[state.activeTopic.workspace_id],
              topics: {
                ...newWorkspaces[state.activeTopic.workspace_id].topics,
                [action.data.topic_id]: topic,
              },
            },
          };
        } else {
          // let folders = Object.values(newWorkspaces).filter(ws => {
          //     return ws.type === "FOLDER" && Object.keys(ws.topics).length > 0
          // })
        }
      }
      if (topic) {
        return {
          ...state,
          workspaces: newWorkspaces,
          activeTopic: state.activeTopic.id === action.data.topic_id ? topic : state.activeTopic,
        };
      } else {
        return state;
      }
    }
    case "GET_DRAFTS_SUCCESS": {
      return {
        ...state,
        drafts: action.data,
      };
    }
    case "SAVE_DRAFT_SUCCESS": {
      if (action.data.data.draft_type === "draft_post") {
        return {
          ...state,
          drafts: [...state.drafts, action.data],
          workspacePosts: {
            ...state.workspacePosts,
            [action.data.data.topic_id]: {
              ...state.workspacePosts[action.data.data.topic_id],
              posts: {
                ...state.workspacePosts[action.data.data.topic_id].posts,
                [action.data.data.id]: {
                  ...action.data,
                  ...action.data.data,
                  ...action.data.data.form,
                  id: action.data.data.id,
                  draft_id: action.data.id,
                  form: action.data.data.form,
                },
              },
            },
          },
        };
      } else {
        return state;
      }
    }
    case "REMOVE_POST": {
      let newWorkspacePosts = { ...state.workspacePosts };
      delete state.workspacePosts[action.data.topic_id].posts[action.data.post_id];
      return {
        ...state,
        workspacePosts: newWorkspacePosts,
      };
    }
    case "FETCH_COMMENTS_SUCCESS": {
      let comments = {};
      if (action.data.messages.length) {
        action.data.messages.forEach((c) => {
          comments[c.id] = {
            ...c,
            replies: convertArrayToObject(c.replies, "id"),
            skip: c.replies.length,
            hasMore: c.replies.length === 10,
            limit: 10,
          };
        });
      }
      return {
        ...state,
        postComments: {
          [action.data.post_id]: {
            skip: action.data.next_skip,
            hasMore: action.data.messages.length === 20,
            comments: comments,
          },
        },
      };
    }
    case "ADD_COMMENT": {
      let postComment = { ...state.postComments[action.data.post_id] };
      if (action.data.parent_id) {
        postComment = {
          ...postComment,
          comments: {
            ...postComment.comments,
            [action.data.parent_id]: {
              ...postComment.comments[action.data.parent_id],
              replies: {
                ...postComment.comments[action.data.parent_id].replies,
                [action.data.id]: action.data,
              },
            },
          },
        };
      } else {
        postComment = {
          ...postComment,
          comments: {
            ...postComment.comments,
            [action.data.id]: action.data,
          },
        };
      }
      return {
        ...state,
        postComments: {
          ...state.postComments,
          [action.data.post_id]: postComment,
        },
      };
    }
    case "STAR_POST_REDUCER": {
      return {
        ...state,
        workspacePosts: {
          [action.data.topic_id]: {
            ...state.workspacePosts[action.data.topic_id],
            posts: {
              ...state.workspacePosts[action.data.topic_id].posts,
              [action.data.post_id]: {
                ...state.workspacePosts[action.data.topic_id].posts[action.data.post_id],
                is_favourite: !state.workspacePosts[action.data.topic_id].posts[action.data.post_id].is_favourite,
              },
            },
          },
        },
      };
    }
    case "MARK_POST_REDUCER": {
      return {
        ...state,
        workspacePosts: {
          [action.data.topic_id]: {
            ...state.workspacePosts[action.data.topic_id],
            posts: {
              ...state.workspacePosts[action.data.topic_id].posts,
              [action.data.post_id]: {
                ...state.workspacePosts[action.data.topic_id].posts[action.data.post_id],
                is_mark_done: !state.workspacePosts[action.data.topic_id].posts[action.data.post_id].is_mark_done,
              },
            },
          },
        },
      };
    }
    case "INCOMING_POST": {
      let newWorkspacePosts = { ...state.workspacePosts };
      let updatedWorkspaces = { ...state.workspaces };
      let updatedTopic = { ...state.activeTopic };

      action.data.workspaces.forEach((ws) => {
        if (newWorkspacePosts.hasOwnProperty(ws.topic_id)) {
          newWorkspacePosts[ws.topic_id].posts[action.data.id] = action.data;
          if (newWorkspacePosts[ws.topic_id].posts[action.data.id].is_must_read === 1) {
            newWorkspacePosts[ws.topic_id].count.is_must_read = newWorkspacePosts[ws.topic_id].count.is_must_read + 1;
          } else if (newWorkspacePosts[ws.topic_id].posts[action.data.id].is_must_reply === 1) {
            newWorkspacePosts[ws.topic_id].count.is_must_reply = newWorkspacePosts[ws.topic_id].count.is_must_reply + 1;
          } else if (newWorkspacePosts[ws.topic_id].posts[action.data.id].is_read_only === 1) {
            newWorkspacePosts[ws.topic_id].count.is_read_only = newWorkspacePosts[ws.topic_id].count.is_read_only + 1;
          }
        }
        if (action.data.author.id !== state.user.id) {
          if (ws.workspace_id !== 0 && updatedWorkspaces.hasOwnProperty(ws.workspace_id)) {
            updatedWorkspaces[ws.workspace_id].unread_count = updatedWorkspaces[ws.workspace_id].unread_count + 1;
            updatedWorkspaces[ws.workspace_id].topics[ws.topic_id].unread_posts = updatedWorkspaces[ws.workspace_id].topics[ws.topic_id].unread_posts + 1;
            if (state.activeTopic.id === ws.topic_id) {
              updatedTopic.unread_posts = updatedTopic.unread_posts + 1;
            }
          } else if (ws.workspace_id === 0 && updatedWorkspaces.hasOwnProperty(ws.topic_id)) {
            updatedWorkspaces[ws.topic_id].unread_count = updatedWorkspaces[ws.topic_id].unread_count + 1;
            updatedWorkspaces[ws.topic_id].topic_detail.unread_posts = updatedWorkspaces[ws.topic_id].topic_detail.unread_posts + 1;
            if (state.activeTopic.id === ws.topic_id) {
              updatedTopic.topic_detail.unread_posts = updatedTopic.topic_detail.unread_posts + 1;
            }
          }
        }
      });
      return {
        ...state,
        workspacePosts: newWorkspacePosts,
        workspaces: updatedWorkspaces,
        activeTopic: updatedTopic,
      };
    }
    case "INCOMING_UPDATED_POST": {
      let newWorkspacePosts = { ...state.workspacePosts };
      action.data.recipient_ids.forEach((id) => {
        if (newWorkspacePosts.hasOwnProperty(id)) {
          newWorkspacePosts[id].posts[action.data.id] = action.data;
        }
      });
      return {
        ...state,
        workspacePosts: newWorkspacePosts,
      };
    }
    case "INCOMING_DELETED_POST": {
      let newWorkspacePosts = { ...state.workspacePosts };
      //need recipient ids
      return {
        ...state,
        workspacePosts: newWorkspacePosts,
      };
    }
    case "INCOMING_COMMENT": {
      let newPostComments = { ...state.postComments };
      let newWorkspacePosts = { ...state.workspacePosts };
      let updatedWorkspaces = { ...state.workspaces };
      let updatedTopic = { ...state.activeTopic };
      //let post = null;

      if (action.data.workspaces.length && action.data.SOCKET_TYPE === "POST_COMMENT_CREATE") {
        action.data.workspaces.forEach((ws) => {
          if (newWorkspacePosts.hasOwnProperty(ws.topic_id) && newWorkspacePosts[ws.topic_id].posts.hasOwnProperty(action.data.post_id)) {
            //post = newWorkspacePosts[ws.topic_id].posts[action.data.post_id];
            newWorkspacePosts[ws.topic_id].posts[action.data.post_id].reply_count = newWorkspacePosts[ws.topic_id].posts[action.data.post_id].reply_count + 1;
            if (action.data.author.id !== state.user.id) {
              newWorkspacePosts[ws.topic_id].posts[action.data.post_id].unread_count = newWorkspacePosts[ws.topic_id].posts[action.data.post_id].unread_count + 1;
            }
          }
          // if (action.data.author.id !== state.user.id) {
          //   if (ws.workspace_id !== 0) {
          //     if (updatedWorkspaces.hasOwnProperty(ws.workspace_id) && updatedWorkspaces[ws.workspace_id].topics.hasOwnProperty(ws.topic_id)) {
          //       if (post) {
          //         if (!post.is_updated && post.unread_count > 1) {
          //           updatedWorkspaces[ws.workspace_id].unread_count = updatedWorkspaces[ws.workspace_id].unread_count + 1;
          //           updatedWorkspaces[ws.workspace_id].topics[ws.topic_id].unread_posts = updatedWorkspaces[ws.workspace_id].topics[ws.topic_id].unread_posts + 1;
          //           if (state.activeTopic.id === ws.topic_id) {
          //             updatedTopic.unread_posts = updatedTopic.unread_posts + 1;
          //           }
          //         }
          //       } else {
          //         updatedWorkspaces[ws.workspace_id].unread_count = updatedWorkspaces[ws.workspace_id].unread_count + 1;
          //         updatedWorkspaces[ws.workspace_id].topics[ws.topic_id].unread_posts = updatedWorkspaces[ws.workspace_id].topics[ws.topic_id].unread_posts + 1;
          //         if (state.activeTopic.id === ws.topic_id) {
          //           updatedTopic.unread_posts = updatedTopic.unread_posts + 1;
          //         }
          //       }
          //     }
          //   } else {
          //     if (updatedWorkspaces.hasOwnProperty(ws.topic_id)) {
          //       if (post) {
          //         if (!post.is_updated && post.unread_count > 1) {
          //           updatedWorkspaces[ws.topic_id].unread_count = updatedWorkspaces[ws.topic_id].unread_count + 1;
          //           updatedWorkspaces[ws.topic_id].topic_detail.unread_posts = updatedWorkspaces[ws.topic_id].topic_detail.unread_posts + 1;
          //           if (state.activeTopic.id === ws.topic_id) {
          //             updatedTopic.topic_detail.unread_posts = updatedTopic.topic_detail.unread_posts + 1;
          //           }
          //         }
          //       } else {
          //         updatedWorkspaces[ws.topic_id].unread_count = updatedWorkspaces[ws.topic_id].unread_count + 1;
          //         updatedWorkspaces[ws.topic_id].topic_detail.unread_posts = updatedWorkspaces[ws.topic_id].topic_detail.unread_posts + 1;
          //         if (state.activeTopic.id === ws.topic_id) {
          //           updatedTopic.topic_detail.unread_posts = updatedTopic.topic_detail.unread_posts + 1;
          //         }
          //       }
          //     }
          //   }
          // }
        });
      }
      if (newPostComments.hasOwnProperty(action.data.post_id)) {
        if (action.data.reference_id) {
          if (action.data.parent_id) {
            delete newPostComments[action.data.post_id].comments[action.data.parent_id].replies[action.data.reference_id];
            newPostComments[action.data.post_id].comments[action.data.parent_id].replies[action.data.id] = action.data;
          } else {
            delete newPostComments[action.data.post_id].comments[action.data.reference_id];
            newPostComments[action.data.post_id].comments[action.data.id] = action.data;
          }
        } else {
          if (action.data.parent_id) {
            newPostComments[action.data.post_id].comments[action.data.parent_id].replies[action.data.id] = action.data;
          } else {
            newPostComments[action.data.post_id].comments[action.data.id] = action.data;
          }
        }
      }
      return {
        ...state,
        postComments: newPostComments,
        workspacePosts: newWorkspacePosts,
        workspaces: updatedWorkspaces,
        activeTopic: updatedTopic,
      };
    }
    case "ADD_PRIMARY_FILES": {
      let newWorkspaces = { ...state.workspaces };
      if (action.data.folder_id) {
        newWorkspaces[action.data.folder_id].topics[action.data.id].primary_files = action.data.files;
      } else {
        newWorkspaces[action.data.id].primary_files = action.data.files;
      }
      return {
        ...state,
        workspaces: newWorkspaces,
        activeTopic:
          state.activeTopic.id === action.data.id
            ? {
                ...state.activeTopic,
                primary_files: action.data.files,
              }
            : state.activeTopic,
      };
    }
    case "UPLOADING_WORKSPACE_FILES_SUCCESS": {
      let newWorkspaces = { ...state.workspaces };
      if (action.data.workspace_id) {
        if (newWorkspaces[action.data.workspace_id].topics[action.data.topic_id].hasOwnProperty("primary_files")) {
          newWorkspaces[action.data.workspace_id].topics[action.data.topic_id].primary_files = [...newWorkspaces[action.data.workspace_id].topics[action.data.topic_id].primary_files, ...action.data.files];
        } else {
          newWorkspaces[action.data.workspace_id].topics[action.data.topic_id].primary_files = action.data.files;
        }
      } else {
        newWorkspaces[action.data.topic_id].primary_files = action.data.files;
      }
      return {
        ...state,
        workspaces: newWorkspaces,
        activeTopic:
          state.activeTopic.id === action.data.topic_id
            ? {
                ...state.activeTopic,
                primary_files: state.activeTopic.hasOwnProperty("primary_files") ? [...state.activeTopic.primary_files, ...action.data.files] : action.data.files,
              }
            : state.activeTopic,
      };
    }
    case "INCOMING_POST_CLAP": {
      let newWorkspacePosts = { ...state.workspacePosts };
      Object.values(newWorkspacePosts).forEach((ws) => {
        if (ws.posts.hasOwnProperty(action.data.post_id)) {
          ws.posts[action.data.post_id].clap_count = action.data.clap_count === 0 ? ws.posts[action.data.post_id].clap_count - 1 : ws.posts[action.data.post_id].clap_count + 1;
          ws.posts[action.data.post_id].user_clap_count = action.data.clap_count;
        }
      });
      return {
        ...state,
        workspacePosts: newWorkspacePosts,
      };
    }
    case "INCOMING_COMMENT_CLAP": {
      let newPostComments = { ...state.postComments };
      if (newPostComments.hasOwnProperty(action.data.post_id)) {
        if (action.data.parent_message_id) {
          newPostComments[action.data.post_id].comments[action.data.parent_message_id].replies[action.data.message_id].clap_count =
            action.data.clap_count === 0
              ? newPostComments[action.data.post_id].comments[action.data.parent_message_id].replies[action.data.message_id].clap_count - 1
              : newPostComments[action.data.post_id].comments[action.data.parent_message_id].replies[action.data.message_id].clap_count + 1;
          newPostComments[action.data.post_id].comments[action.data.parent_message_id].replies[action.data.message_id].user_clap_count = action.data.clap_count;
        } else {
          newPostComments[action.data.post_id].comments[action.data.message_id].clap_count =
            action.data.clap_count === 0 ? newPostComments[action.data.post_id].comments[action.data.message_id].clap_count - 1 : newPostComments[action.data.post_id].comments[action.data.message_id].clap_count + 1;
          newPostComments[action.data.post_id].comments[action.data.message_id].user_clap_count = action.data.clap_count;
        }
        return {
          ...state,
          postComments: newPostComments,
        };
      } else {
        return state;
      }
    }
    case "FETCH_TIMELINE_SUCCESS": {
      let newWorkspaceTimeline = { ...state.workspaceTimeline };
      newWorkspaceTimeline = {
        ...newWorkspaceTimeline,
        [action.data.topic_id]: {
          timeline: convertArrayToObject(action.data.timeline, "id"),
        },
      };
      return {
        ...state,
        workspaceTimeline: newWorkspaceTimeline,
      };
    }
    case "FETCH_WORKSPACE_MEMBERS_SUCCESS": {
      let newWorkspaces = { ...state.workspaces };
      if (action.data.workspace_id !== 0) {
        newWorkspaces[action.data.workspace_id].topics[action.data.id].members = action.data.members;
      } else {
        newWorkspaces[action.data.id].members = action.data.members;
      }
      return {
        ...state,
        workspaces: newWorkspaces,
        activeTopic:
          state.activeTopic && state.activeTopic.id === action.data.id
            ? {
                ...state.activeTopic,
                members: action.data.members,
              }
            : state.activeTopic,
      };
    }
    case "FETCH_TAG_COUNTER_SUCCESS": {
      return {
        ...state,
        workspacePosts: {
          ...state.workspacePosts,
          [action.data.topic_id]: {
            ...state.workspacePosts[action.data.topic_id],
            count: {
              is_must_reply: action.data.counters.filter((c) => c.type === "MUST_REPLY")[0].counter,
              is_must_read: action.data.counters.filter((c) => c.type === "MUST_READ")[0].counter,
              is_read_only: action.data.counters.filter((c) => c.type === "READ_ONLY")[0].counter,
            },
          },
        },
      };
    }
    case "INCOMING_POST_VIEWER": {
      if (Object.keys(state.workspacePosts).length > 0) {
        let updatedWsPosts = { ...state.workspacePosts };
        Object.keys(updatedWsPosts).forEach((ws) => {
          if (updatedWsPosts[ws].hasOwnProperty("posts")) {
            if (updatedWsPosts[ws].posts.hasOwnProperty(action.data.post_id)) {
              updatedWsPosts[ws].posts[action.data.post_id].view_user_ids = [...updatedWsPosts[ws].posts[action.data.post_id].view_user_ids, action.data.viewer.id];
            }
          }
        });
        return {
          ...state,
          workspacePosts: updatedWsPosts,
        };
      } else {
        return state;
      }
    }
    case "ARCHIVE_POST_REDUCER": {
      let newWorkspacePosts = {...state.workspacePosts};
      newWorkspacePosts[action.data.topic_id].posts[action.data.post_id].is_archived = action.data.is_archived;
      return {
        ...state,
        workspacePosts: newWorkspacePosts,
      };
    }
    case "ARCHIVE_REDUCER": {
      let workspaces = {...state.workspaces};
      if (action.data.workspace_id) {
        workspaces[action.data.workspace_id].topics[action.data.id].active = 0;
      } else {
        workspaces[action.data.id].topic_detail.active = 0;
      }
      return {
        ...state,
        workspaces: workspaces,
      };
    }
    case "UNARCHIVE_REDUCER": {
      let workspaces = {...state.workspaces};
      if (action.data.workspace_id) {
        workspaces[action.data.workspace_id].topics[action.data.id].active = 1;
      } else {
        workspaces[action.data.id].topic_detail.active = 1;
      }
      return {
        ...state,
        workspaces: workspaces,
      };
    }
    case "MARK_READ_UNREAD_REDUCER": {
      let newWorkspacePosts = {...state.workspacePosts};
      let updatedWorkspaces = {...state.workspaces};
      let updatedTopic = {...state.activeTopic};
      newWorkspacePosts[action.data.topic_id].posts[action.data.post_id].is_unread = action.data.unread;
      if (action.data.unread === 0) {
        newWorkspacePosts[action.data.topic_id].posts[action.data.post_id].unread_count = action.data.unread;
        newWorkspacePosts[action.data.topic_id].posts[action.data.post_id].is_updated = true;
        if (action.data.folderId) {
          updatedWorkspaces[action.data.folderId].unread_count = updatedWorkspaces[action.data.folderId].unread_count - action.data.count;
          updatedWorkspaces[action.data.folderId].topics[action.data.topic_id].unread_posts = updatedWorkspaces[action.data.folderId].topics[action.data.topic_id].unread_posts - action.data.count;
          if (updatedTopic.id === action.data.topic_id) {
            updatedTopic.unread_posts = updatedTopic.unread_posts - action.data.count;
          }
        } else {
          updatedWorkspaces[action.data.topic_id].unread_count = updatedWorkspaces[action.data.topic_id].unread_count - action.data.count;
          updatedWorkspaces[action.data.topic_id].topic_detail.unread_posts = updatedWorkspaces[action.data.topic_id].topic_detail.unread_posts - action.data.count;
          if (updatedTopic.id === action.data.topic_id) {
            updatedTopic.topic_detail.unread_posts = updatedTopic.topic_detail.unread_posts - action.data.count;
          }
        }
      } else {
        if (action.data.folderId) {
          updatedWorkspaces[action.data.folderId].unread_count = updatedWorkspaces[action.data.folderId].unread_count + 1;
          updatedWorkspaces[action.data.folderId].topics[action.data.topic_id].unread_posts = updatedWorkspaces[action.data.folderId].topics[action.data.topic_id].unread_posts + 1;
          if (updatedTopic.id === action.data.topic_id) {
            updatedTopic.unread_posts = updatedTopic.unread_posts + 1;
          }
        } else {
          updatedWorkspaces[action.data.topic_id].unread_count = updatedWorkspaces[action.data.topic_id].unread_count + 1;
          updatedWorkspaces[action.data.topic_id].topic_detail.unread_posts = updatedWorkspaces[action.data.topic_id].topic_detail.unread_posts + 1;
          if (updatedTopic.id === action.data.topic_id) {
            updatedTopic.topic_detail.unread_posts = updatedTopic.topic_detail.unread_posts + 1;
          }
        }
      }
      return {
        ...state,
        workspacePosts: newWorkspacePosts,
        activeTopic: updatedTopic,
      };
    }
    case "MUST_READ_REDUCER": {
      let newWorkspacePosts = { ...state.workspacePosts };
      newWorkspacePosts[action.data.topic_id].posts[action.data.post_id].is_read_requirement = true;
      return {
        ...state,
        workspacePosts: newWorkspacePosts,
      };
    }
    case "INCOMING_TIMELINE": {
      let newTimeline = { ...state.workspaceTimeline };
      if (newTimeline.hasOwnProperty(action.data.workspace_data.topic_id)) {
        newTimeline[action.data.workspace_data.topic_id].timeline[action.data.timeline_data.id] = action.data.timeline_data;
        return {
          ...state,
          workspaceTimeline: newTimeline,
        };
      } else {
        return state;
      }
    }
    case "INCOMING_DELETED_POST_FILE": {
      let newWorkspacePosts = { ...state.workspacePosts };
      let newPostComments = { ...state.postComments };
      if (action.data.connected_workspace.length && Object.keys(newWorkspacePosts).length) {
        action.data.connected_workspace.forEach((ws) => {
          if (newWorkspacePosts.hasOwnProperty(ws.topic_id) && newWorkspacePosts[ws.topic_id].hasOwnProperty("posts")) {
            if (newWorkspacePosts[ws.topic_id].posts.hasOwnProperty(action.data.post_id)) {
              newWorkspacePosts[ws.topic_id].posts[action.data.post_id].files = newWorkspacePosts[ws.topic_id].posts[action.data.post_id].files.filter((f) => f.id !== action.data.file_id);
            }
          }
          if (action.data.message_id) {
            if (Object.keys(newPostComments).length && newPostComments.hasOwnProperty(action.data.post_id)) {
              Object.values(newPostComments[action.data.post_id].comments).forEach((c) => {
                if (c.id === action.data.message_id) {
                  newPostComments[action.data.post_id].comments[action.data.message_id].files = newPostComments[action.data.post_id].comments[action.data.message_id].files.filter((f) => f.id !== action.data.file_id);
                } else {
                  if (c.replies.hasOwnProperty(action.data.message_id)) {
                    newPostComments[action.data.post_id].comments[c.id].replies[action.data.message_id].files = newPostComments[action.data.post_id].comments[c.id].replies[action.data.message_id].files.filter(
                      (f) => f.id !== action.data.file_id
                    );
                  }
                }
              });
            }
          }
        });
        return {
          ...state,
          workspacePosts: newWorkspacePosts,
          postComments: newPostComments,
        };
      } else {
        return state;
      }
    }
    case "INCOMING_DELETED_COMMENT": {
      let newPostComments = { ...state.postComments };
      //let newWorkspacePosts = {...state.workspacePosts};
      // if (action.data.workspaces.length) {
      //     action.data.workspaces.forEach(ws => {
      //         if (newWorkspacePosts.hasOwnProperty(ws.topic_id) && newWorkspacePosts[ws.topic_id].posts.hasOwnProperty(action.data.post_id)) {
      //             newWorkspacePosts[ws.topic_id].posts[action.data.post_id].reply_count = newWorkspacePosts[ws.topic_id].posts[action.data.post_id].reply_count - 1;
      //             return;
      //         }
      //     })
      // }
      if (newPostComments.hasOwnProperty(action.data.post_id)) {
        if (action.data.parent_id) {
          delete newPostComments[action.data.post_id].comments[action.data.parent_id].replies[action.data.message_id];
        } else {
          delete newPostComments[action.data.post_id].comments[action.data.message_id];
        }
      }
      return {
        ...state,
        postComments: newPostComments,
        //workspacePosts: newWorkspacePosts
      };
    }
    case "INCOMING_CHAT_MESSAGE": {
      if (!action.data.is_read) {
        let updatedWorkspaces = { ...state.workspaces };
        let updatedTopic = { ...state.activeTopic };
        if (Object.keys(updatedWorkspaces).length > 0) {
          if (updatedWorkspaces.hasOwnProperty(action.data.workspace_id)) {
            updatedWorkspaces[action.data.workspace_id].topic_detail.unread_chats = updatedWorkspaces[action.data.workspace_id].topic_detail.unread_chats + 1;
            updatedWorkspaces[action.data.workspace_id].unread_count = updatedWorkspaces[action.data.workspace_id].unread_count + 1;
            if (state.activeTopic && state.activeTopic.id === action.data.workspace_id) {
              updatedTopic.unread_count = updatedTopic.unread_count + 1;
              updatedTopic.topic_detail.unread_chats = updatedTopic.topic_detail.unread_chats + 1;
            }
          } else {
            Object.values(updatedWorkspaces).forEach((ws) => {
              if (ws.hasOwnProperty("topics") && ws.topics.hasOwnProperty(action.data.workspace_id)) {
                updatedWorkspaces[ws.id].unread_count = updatedWorkspaces[ws.id].unread_count + 1;
                updatedWorkspaces[ws.id].topics[action.data.workspace_id].unread_chats = updatedWorkspaces[ws.id].topics[action.data.workspace_id].unread_chats + 1;
                if (state.activeTopic && state.activeTopic.id === action.data.workspace_id) {
                  updatedTopic.unread_chats = updatedTopic.unread_chats + 1;
                }
              }
            });
          }
          return {
            ...state,
            workspaces: updatedWorkspaces,
            activeTopic: updatedTopic,
          };
        } else {
          return state;
        }
      } else {
        let updatedWorkspaces = { ...state.workspaces };
        let updatedTopic = { ...state.activeTopic };
        if (Object.keys(updatedWorkspaces).length > 0) {
          if (updatedWorkspaces.hasOwnProperty(action.data.workspace_id)) {
            updatedWorkspaces[action.data.workspace_id].topic_detail.unread_chats = 0;
            updatedWorkspaces[action.data.workspace_id].unread_count = updatedWorkspaces[action.data.workspace_id].unread_count - updatedWorkspaces[action.data.workspace_id].topic_detail.unread_chats;
            if (state.activeTopic && state.activeTopic.id === action.data.workspace_id) {
              updatedTopic.unread_count = updatedTopic.unread_count - updatedTopic.topic_detail.unread_chats;
              updatedTopic.topic_detail.unread_chats = 0;
            }
          } else {
            Object.values(updatedWorkspaces).forEach((ws) => {
              if (ws.hasOwnProperty("topics") && ws.topics.hasOwnProperty(action.data.workspace_id)) {
                updatedWorkspaces[ws.id].unread_count = updatedWorkspaces[ws.id].unread_count - updatedWorkspaces[ws.id].topics[action.data.workspace_id].unread_chats;
                updatedWorkspaces[ws.id].topics[action.data.workspace_id].unread_chats = 0;
                if (state.activeTopic && state.activeTopic.id === action.data.workspace_id) {
                  updatedTopic.unread_chats = 0;
                }
              }
            });
          }
          return {
            ...state,
            workspaces: updatedWorkspaces,
            activeTopic: updatedTopic,
          };
        } else {
          return state;
        }
      }
    }
    case "READ_CHANNEL_REDUCER": {
      let updatedWorkspaces = { ...state.workspaces };
      let updatedTopic = { ...state.activeTopic };
      if (Object.keys(updatedWorkspaces).length > 0) {
        if (updatedWorkspaces.hasOwnProperty(action.data.id)) {
          updatedWorkspaces[action.data.id].topic_detail.unread_chats = 0;
          updatedWorkspaces[action.data.id].unread_count = updatedWorkspaces[action.data.id].unread_count - action.data.count;
          if (state.activeTopic && state.activeTopic.id === action.data.id) {
            updatedTopic.unread_count = updatedTopic.unread_count - action.data.count;
            updatedTopic.topic_detail.unread_chats = 0;
          }
        } else {
          Object.values(updatedWorkspaces).forEach((ws) => {
            if (ws.hasOwnProperty("topics") && ws.topics.hasOwnProperty(action.data.id)) {
              updatedWorkspaces[ws.id].topics[action.data.id].unread_chats = 0;
              updatedWorkspaces[ws.id].unread_count = updatedWorkspaces[ws.id].unread_count - action.data.count;
              if (state.activeTopic && state.activeTopic.id === action.data.id) {
                updatedTopic.unread_chats = 0;
              }
            }
          });
        }
        return {
          ...state,
          workspaces: updatedWorkspaces,
          activeTopic: updatedTopic,
        };
      } else {
        return state;
      }
    }
    case "GET_WORKSPACE_SUCCESS": {
      let updatedWorkspaces = { ...state.workspaces };
      if (Object.keys(updatedWorkspaces).length > 0) {
        if (updatedWorkspaces.hasOwnProperty(action.data.topic_id)) {
          return state;
        } else {
          updatedWorkspaces[action.data.topic_id] = {
            ...action.data.workspace_data,
          };
          return {
            ...state,
            workspaces: updatedWorkspaces,
          };
        }
      } else {
        return state;
      }
    }
    case "UPDATE_WORKSPACE_COUNTER": {
      let updatedWorkspaces = { ...state.workspaces };
      let updatedTopic = { ...state.activeTopic };
      if (Object.keys(updatedWorkspaces).length > 0) {
        if (action.data.folder_id) {
          updatedWorkspaces[action.data.folder_id].unread_count = action.data.unread_count;
          updatedWorkspaces[action.data.folder_id].topics[action.data.topic_id].unread_posts = action.data.unread_posts;
        } else {
          updatedWorkspaces[action.data.topic_id].unread_count = action.data.unread_count;
          updatedWorkspaces[action.data.topic_id].topic_detail.unread_posts = action.data.unread_posts;
        }
        if (state.activeTopic && state.activeTopic.id === action.data.topic_id) {
          if (state.activeTopic.type === "TOPIC") {
            updatedTopic.unread_posts = action.data.unread_posts;
          } else {
            updatedTopic.unread_count = action.data.unread_count;
            updatedTopic.topic_detail.unread_posts = action.data.unread_posts;
          }
        }
        return {
          ...state,
          workspaces: updatedWorkspaces,
          activeTopic: updatedTopic,
        };
      } else {
        return state;
      }
    }
    default:
      return state;
  }
};
