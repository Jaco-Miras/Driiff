/* eslint-disable no-prototype-builtins */
import { convertArrayToObject } from "../../helpers/arrayHelper";

const INITIAL_STATE = {
  flipper: true,
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
  workspace: {},
  folders: {},
  activeChannelId: null,
  workspaceToDelete: null,
  folderToDelete: null,
  search: {
    results: [],
    searching: false,
    value: "",
    page: 1,
    maxPage: 1,
    count: 0,
  },
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    // case "GET_ALL_WORKSPACE_SUCCESS": {
    //   return {
    //     ...state,
    //     search: {
    //       ...state.search,
    //       count: action.data.total_count,
    //       searching: false,
    //       results: [...new Set([...action.data.workspaces, ...state.search.results])],
    //       maxPage: Math.ceil(action.data.total_count / 25)
    //     }
    //   }
    // }
    case "UPDATE_WORKSPACE_SEARCH": {
      return {
        ...state,
        search: action.data,
      };
    }
    case "ADD_USER_TO_REDUCERS": {
      return {
        ...state,
        user: action.data,
      };
    }
    case "INCOMING_UPDATED_USER": {
      let workspaces = { ...state.workspaces };
      let activeTopic = { ...state.activeTopic };

      const index = activeTopic.members.map((m) => m.id).indexOf(action.data.id);
      if (index !== -1) {
        Object.keys(activeTopic.members[index]).forEach((attr) => {
          const value = action.data[attr];
          if (activeTopic.members[index].hasOwnProperty(attr)) {
            activeTopic.members[index][attr] = value;
          }
        });
      }

      Object.values(workspaces).forEach((ws) => {
        const index = workspaces[ws.id].members.map((m) => m.id).indexOf(action.data.id);
        if (index !== -1) {
          Object.keys(workspaces[ws.id].members[index]).forEach((attr) => {
            const value = action.data[attr];
            if (workspaces[ws.id].members[index].hasOwnProperty(attr)) {
              workspaces[ws.id].members[index][attr] = value;
            }
          });
        }
      });
      return {
        ...state,
        flipper: !state.flipper,
        workspaces: workspaces,
      };
    }
    case "GET_WORKSPACES_SUCCESS": {
      let updatedWorkspaces = { ...state.workspaces };
      let updatedFolders = { ...state.folders };
      action.data.workspaces.forEach((ws) => {
        if (ws.type === "FOLDER") {
          if (updatedFolders.hasOwnProperty(ws.id)) {
            updatedFolders[ws.id].workspace_ids = [...updatedFolders[ws.id].workspace_ids, ...ws.topics.map((t) => t.id)];
          } else {
            updatedFolders[ws.id] = {
              ...ws,
              workspace_ids: ws.topics.map((t) => t.id),
            };
          }
          ws.topics.forEach((t) => {
            updatedWorkspaces[t.id] = {
              ...t,
              channel: { ...t.channel, loaded: false },
              is_lock: t.private,
              folder_id: ws.id,
              folder_name: ws.name,
              type: "WORKSPACE",
            };
          });
          delete updatedFolders[ws.id].topics;
        } else if (ws.type === "WORKSPACE") {
          updatedWorkspaces[ws.id] = {
            ...ws,
            is_shared: ws.topic_detail.is_shared,
            active: ws.topic_detail.active,
            channel: { ...ws.topic_detail.channel, loaded: false },
            unread_chats: ws.topic_detail.unread_chats,
            unread_posts: ws.topic_detail.unread_posts,
            folder_id: null,
            folder_name: null,
          };
          delete updatedWorkspaces[ws.id].topic_detail;
        }
      });
      return {
        ...state,
        workspaces: updatedWorkspaces,
        workspacesLoaded: true,
        externalWorkspacesLoaded: true,
        // workspacesLoaded: !state.workspacesLoaded && action.data.is_external === 0 ? true : state.workspacesLoaded,
        // externalWorkspacesLoaded: !state.externalWorkspacesLoaded && action.data.is_external === 1 ? true : state.externalWorkspacesLoaded,
        folders: updatedFolders,
      };
    }
    case "INCOMING_WORKSPACE_FOLDER": {
      let updatedFolders = { ...state.folders };
      if (state.workspacesLoaded) {
        updatedFolders[action.data.id] = {
          ...action.data,
          unread_count: 0,
          member_ids: [],
          members: [],
          workspace_ids: [],
        };
      }
      return {
        ...state,
        folders: updatedFolders,
      };
    }
    case "INCOMING_WORKSPACE": {
      let updatedWorkspaces = { ...state.workspaces };
      let updatedFolders = { ...state.folders };
      if (state.workspacesLoaded) {
        updatedWorkspaces[action.data.id] = {
          id: action.data.id,
          name: action.data.topic.name,
          is_external: action.data.is_external,
          is_lock: action.data.is_lock,
          description: action.data.topic.description,
          unread_count: 0,
          type: "WORKSPACE",
          key_id: action.data.key_id,
          active: 1,
          unread_chats: 0,
          unread_posts: 0,
          folder_id: action.data.workspace ? action.data.workspace.id : null,
          folder_name: action.data.workspace ? action.data.workspace.name : null,
          member_ids: action.data.member_ids,
          members: action.data.members,
          channel: {
            code: action.data.channel.code,
            id: action.data.channel.id,
            loaded: false,
          },
          created_at: action.data.topic.created_at,
          updated_at: action.data.topic.created_at,
          primary_files: [],
          is_shared: action.data.members.filter((m) => m.type === "external").length > 0,
        };
        if (action.data.workspace !== null && updatedFolders[action.data.workspace.id]) {
          updatedFolders[action.data.workspace.id].workspace_ids = [...updatedFolders[action.data.workspace.id].workspace_ids, action.data.id];
        }
      }
      return {
        ...state,
        workspaces: updatedWorkspaces,
        folders: updatedFolders,
      };
    }
    case "INCOMING_UPDATED_WORKSPACE_FOLDER": {
      let updatedWorkspaces = { ...state.workspaces };
      let updatedFolders = { ...state.folders };
      let workspace = null;
      let workspaceToDelete = state.workspaceToDelete;
      let folderToDelete = state.folderToDelete;
      let updatedSearch = { ...state.search };

      if (updatedSearch.results.length && action.data.type === "WORKSPACE") {
        updatedSearch.results = updatedSearch.results.map((item) => {
          if (item.topic.id === action.data.id) {
            return {
              ...item,
              ...action.data,
              members: action.data.members,
              topic: {
                ...item.topic,
                name: action.data.name,
                description: action.data.description,
                is_locked: action.data.private === 1,
              },
              workspace: action.data.workspace_id === 0 ? null : { id: action.data.workspace_id, name: action.data.current_workspace_folder_name },
            };
          } else {
            return item;
          }
        });
      }

      if (state.workspacesLoaded && action.data.type === "WORKSPACE" && updatedWorkspaces.hasOwnProperty(action.data.id)) {
        let updatedTopic = state.activeTopic ? { ...state.activeTopic } : null;
        workspace = {
          ...state.workspaces[action.data.id],
          ...action.data,
          is_lock: action.data.private,
          folder_id: action.data.workspace_id === 0 ? null : action.data.workspace_id,
          folder_name: action.data.workspace_id === 0 ? null : action.data.current_workspace_folder_name,
        };
        updatedWorkspaces[workspace.id] = workspace;
        if (state.activeTopic && state.activeTopic.id === workspace.id) {
          updatedTopic = workspace;
        }
        if (!action.data.member_ids.some((id) => id === state.user.id)) {
          if (workspace.is_lock === 1 || state.user.type === "external") {
            delete updatedWorkspaces[workspace.id];
            if (Object.values(updatedWorkspaces).length) {
              if (Object.values(updatedWorkspaces)[0].id === action.data.id) {
                updatedTopic = Object.values(updatedWorkspaces)[1];
              } else {
                updatedTopic = Object.values(updatedWorkspaces)[0];
              }
            }
            if (action.data.workspace_id !== 0 && updatedFolders.hasOwnProperty(action.data.workspace_id)) {
              let isMember = false;
              updatedFolders[action.data.workspace_id].workspace_ids
                .filter((id) => id !== action.data.id)
                .forEach((wsid) => {
                  if (state.workspaces.hasOwnProperty(wsid) && action.data.id !== wsid) {
                    if (state.workspaces[wsid].member_ids.some((id) => id === state.user.id)) {
                      isMember = true;
                    }
                  }
                });
              if (!isMember) {
                delete updatedFolders[action.data.workspace_id];
              }
            }
          } else {
            if (state.activeTopic && state.activeTopic.id === action.data.id) {
              workspaceToDelete = action.data.id;
              //check if workspace is under a folder
              //then check if the user is a member in other workspace under the same folder
              // if user is no longer a member then set the folderToDelete id
              if (action.data.workspace_id !== 0 && updatedFolders.hasOwnProperty(action.data.workspace_id)) {
                let isMember = false;
                updatedFolders[action.data.workspace_id].workspace_ids
                  .filter((id) => id !== action.data.id)
                  .forEach((wsid) => {
                    if (state.workspaces.hasOwnProperty(wsid) && action.data.id !== wsid) {
                      if (state.workspaces[wsid].member_ids.some((id) => id === state.user.id)) {
                        isMember = true;
                      }
                    }
                  });
                if (!isMember) {
                  folderToDelete = action.data.workspace_id;
                }
              }
            } else {
              delete updatedWorkspaces[action.data.id];
              //check if workspace is under a folder
              //then check if the user is a member in other workspace under the same folder
              // if user is no longer a member then delete the folder
              if (action.data.workspace_id !== 0 && updatedFolders.hasOwnProperty(action.data.workspace_id)) {
                let isMember = false;
                updatedFolders[action.data.workspace_id].workspace_ids.forEach((wsid) => {
                  if (state.workspaces.hasOwnProperty(wsid) && action.data.id !== wsid) {
                    if (state.workspaces[wsid].member_ids.some((id) => id === state.user.id)) {
                      isMember = true;
                    }
                  }
                });
                if (!isMember) {
                  delete updatedFolders[action.data.workspace_id];
                }
              }
            }
          }
        }
        if (action.data.workspace_id !== 0 && updatedFolders.hasOwnProperty(action.data.workspace_id)) {
          if (action.data.original_workspace_id !== action.data.workspace_id) {
            //different folder
            updatedFolders[action.data.workspace_id].workspace_ids = [...updatedFolders[action.data.workspace_id].workspace_ids, action.data.id];
            if (action.data.original_workspace_id !== 0) {
              updatedFolders[action.data.original_workspace_id].workspace_ids = updatedFolders[action.data.original_workspace_id].workspace_ids.filter((id) => id !== action.data.id);
            }
          }
        } else {
          if (action.data.original_workspace_id !== action.data.workspace_id && updatedFolders[action.data.original_workspace_id]) {
            // to general folder
            updatedFolders[action.data.original_workspace_id].workspace_ids = updatedFolders[action.data.original_workspace_id].workspace_ids.filter((id) => id !== action.data.id);
          }
        }
        return {
          ...state,
          activeTopic: updatedTopic,
          folders: updatedFolders,
          workspaces: updatedWorkspaces,
          workspaceToDelete: workspaceToDelete,
          folderToDelete: folderToDelete,
          search: updatedSearch,
        };
      } else if (state.workspacesLoaded && action.data.type === "FOLDER") {
        if (updatedFolders[action.data.id]) {
          updatedFolders[action.data.id] = {
            ...updatedFolders[action.data.id],
            name: action.data.name,
            description: action.data.description,
            is_lock: action.data.is_lock,
            updated_at: action.data.updated_at,
          };
          updatedFolders[action.data.id].workspace_ids.forEach((id) => {
            updatedWorkspaces[id].folder_name = action.data.name;
          });
        }
        return {
          ...state,
          activeTopic:
            state.activeTopic && state.activeTopic.folder_id && state.activeTopic.folder_id === action.data.id
              ? {
                  ...state.activeTopic,
                  folder_name: action.data.name,
                }
              : state.activeTopic,
          folders: updatedFolders,
          workspaces: updatedWorkspaces,
        };
      } else {
        return {
          ...state,
          search: updatedSearch,
        };
      }
    }
    case "SET_ACTIVE_TOPIC": {
      let updatedWorkspaces = { ...state.workspaces };
      let updatedFolders = { ...state.folders };
      if (state.workspaceToDelete) {
        delete updatedWorkspaces[state.workspaceToDelete];
      }
      if (state.folderToDelete) {
        delete updatedFolders[state.folderToDelete];
      }
      return {
        ...state,
        workspaces: updatedWorkspaces,
        workspaceToDelete: null,
        folderToDelete: null,
        folders: updatedFolders,
        activeTopic: action.data.hasOwnProperty("members") ? action.data : state.workspaces.hasOwnProperty(action.data.id) ? { ...state.workspaces[action.data.id] } : state.activeTopic,
      };
    }
    case "SET_SELECTED_CHANNEL": {
      // let workspace = { ...state.activeTopic };
      // let workspaces = { ...state.workspaces };
      // if (action.data.type === "TOPIC") {
      //   workspaces[workspace.id].channel.loaded = true;
      //   workspace.channel.loaded = true;
      // }

      return {
        ...state,
        // activeTopic: action.data.type === "TOPIC" ? workspace : state.activeTopic,
        // workspaces: workspaces,
        activeChannelId: action.data.type === "TOPIC" ? action.data.id : state.activeChannelId,
      };
    }
    case "GET_WORKSPACE_CHANNELS_SUCCESS": {
      let updatedWorkspaces = { ...state.workspaces };
      action.data.forEach((c) => {
        if (updatedWorkspaces.hasOwnProperty(c.entity_id)) {
          updatedWorkspaces[c.entity_id].channel.loaded = true;
        }
      });

      return {
        ...state,
        workspaces: updatedWorkspaces,
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
            filter: "all",
          },
        },
      };
    }
    case "ADD_TO_WORKSPACE_POSTS": {
      // let convertedPosts = convertArrayToObject(action.data.posts.reduce((arr, obj) => {
      //   return arr.concat({
      //     ...obj,
      //     clap_user_ids: []
      //   });
      // }, []), "id");
      let convertedPosts = convertArrayToObject(
        action.data.posts.map((p) => {
          return Object.assign({}, p, { clap_user_ids: [] });
        }),
        "id"
      );
      let postDrafts = [];
      if (state.drafts.length) {
        postDrafts = convertArrayToObject(state.drafts, "post_id");
      }
      if (state.workspacePosts.hasOwnProperty(action.data.topic_id)) {
        return {
          ...state,
          workspacePosts: {
            ...state.workspacePosts,
            [action.data.topic_id]: {
              ...state.workspacePosts[action.data.topic_id],
              filters: {
                ...state.workspacePosts[action.data.topic_id].filters,
                ...action.data.filters,
              },
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
              filters: action.data.filters,
              filter: "all",
              sort: "recent",
              tag: null,
              search: "",
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
            filter: action.data.filter ? action.data.filter : state.workspacePosts[action.data.topic_id].filter,
            sort: action.data.sort ? (action.data.sort === state.workspacePosts[action.data.topic_id].sort ? state.workspacePosts[action.data.topic_id].sort : action.data.sort) : state.workspacePosts[action.data.topic_id].sort,
            tag: action.data.tag ? action.data.tag : state.workspacePosts[action.data.topic_id].tag,
          },
        },
      };
    }
    case "JOIN_WORKSPACE_REDUCER": {
      let updatedWorkspaces = { ...state.workspaces };
      let updatedSearch = { ...state.search };
      let activeTopic = null;
      if (Object.keys(updatedWorkspaces).length) {
        Object.values(updatedWorkspaces).forEach((ws) => {
          if (ws.channel.id === action.data.channel_id) {
            updatedWorkspaces[ws.id].members = [...updatedWorkspaces[ws.id].members, ...action.data.users];
            updatedWorkspaces[ws.id].member_ids = [...updatedWorkspaces[ws.id].member_ids, ...action.data.users.map((u) => u.id)];
            activeTopic = updatedWorkspaces[ws.id];
          }
        });
      }
      if (updatedSearch.results.length) {
        updatedSearch.results = updatedSearch.results.map((item) => {
          if (item.channel.id === action.data.channel_id) {
            return {
              ...item,
              members: [...item.members, ...action.data.users],
            };
          } else {
            return item;
          }
        });
      }
      return {
        ...state,
        workspaces: updatedWorkspaces,
        activeTopic: state.activeTopic && state.activeTopic.channel.id === action.data.channel_id && activeTopic ? activeTopic : state.activeTopic,
        search: updatedSearch,
      };
    }
    case "GET_DRAFTS_SUCCESS": {
      return {
        ...state,
        drafts: action.data.map((d) => {
          if (d.data.type === "draft_post") {
            return Object.assign({}, d, {
              ...d.data,
              draft_id: d.id,
              post_id: d.data.id,
              updated_at: d.data.created_at,
            });
          } else {
            return d;
          }
        }),
      };
    }
    case "SAVE_DRAFT_SUCCESS": {
      if (action.data.data.draft_type === "draft_post" && typeof action.data.data.topic_id !== "undefined") {
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
          workspacePosts: {
            ...state.workspacePosts,
            [action.data.data.topic_id]: {
              ...state.workspacePosts[action.data.data.topic_id],
              posts: {
                ...state.workspacePosts[action.data.data.topic_id].posts,
                [draft.id]: draft,
              },
            },
          },
        };
      } else {
        return state;
      }
    }
    case "UPDATE_DRAFT_SUCCESS": {
      if (action.data.data.draft_type === "draft_post" && typeof action.data.data.topic_id !== "undefined" && typeof state.workspacePosts[action.data.data.topic_id] !== "undefined") {
        const workspacePosts = { ...state.workspacePosts };
        workspacePosts[action.data.data.topic_id].posts[action.data.data.id] = {
          ...workspacePosts[action.data.data.topic_id].posts[action.data.data.post_id],
          ...action.data.data,
          id: action.data.data.post_id,
          post_id: action.data.data.post_id,
          draft_id: action.data.id,
        };
        return {
          ...state,
          workspacePosts: workspacePosts,
        };
      } else {
        return state;
      }
    }
    case "DELETE_DRAFT": {
      if (action.data.draft_type === "draft_post" && action.data.topic_id && typeof state.workspacePosts[action.data.topic_id] !== "undefined") {
        const drafts = [...state.drafts.filter((d) => d.draft_id !== action.data.draft_id)];

        let posts = { ...state.workspacePosts[action.data.topic_id].posts };
        delete posts[action.data.post_id];
        return {
          ...state,
          drafts: drafts,
          workspacePosts: {
            ...state.workspacePosts,
            [action.data.topic_id]: {
              ...state.workspacePosts[action.data.topic_id],
              posts: posts,
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
      let postComments = { ...state.postComments };
      let comments = {};
      if (action.data.messages.length) {
        action.data.messages.forEach((c) => {
          comments[c.id] = {
            ...c,
            clap_user_ids: [],
            replies: convertArrayToObject(
              c.replies.map((r) => {
                return { ...r, clap_user_ids: [] };
              }),
              "id"
            ),
            skip: c.replies.length,
            hasMore: c.replies.length === 10,
            limit: 10,
          };
        });
      }
      postComments[action.data.post_id] = {
        ...(typeof postComments[action.data.post_id] !== "undefined" && postComments[action.data.post_id]),
        skip: action.data.next_skip,
        hasMore: action.data.messages.length === 20,
        comments: { ...comments, ...(typeof postComments[action.data.post_id] !== "undefined" && postComments[action.data.post_id].comments) },
      };
      return {
        ...state,
        postComments: postComments,
      };
    }
    case "REFETCH_POST_COMMENTS_SUCCESS": {
      let postComments = { ...state.postComments };
      let comments = {};
      if (action.data.messages.length) {
        action.data.messages.forEach((c) => {
          comments[c.id] = {
            ...c,
            clap_user_ids: [],
            replies: convertArrayToObject(
              c.replies.map((r) => {
                return { ...r, clap_user_ids: [] };
              }),
              "id"
            ),
            skip: c.replies.length,
            hasMore: c.replies.length === 10,
            limit: 10,
          };
        });
      }
      postComments[action.data.post_id] = {
        ...(typeof postComments[action.data.post_id] !== "undefined" && postComments[action.data.post_id]),
        skip: action.data.next_skip,
        hasMore: action.data.messages.length === 20,
        comments: { ...comments, ...(typeof postComments[action.data.post_id] !== "undefined" && postComments[action.data.post_id].comments) },
      };
      return {
        ...state,
        postComments: postComments,
      };
    }
    case "ADD_COMMENT_REACT": {
      return {
        ...state,
        postComments: {
          ...state.postComments,
          [action.data.post_id]: {
            ...state.postComments[action.data.post_id],
            ...(action.data.parent_id
              ? {
                  comments: {
                    ...state.postComments[action.data.post_id].comments,
                    [action.data.parent_id]: {
                      ...state.postComments[action.data.post_id].comments[action.data.parent_id],
                      replies: {
                        ...state.postComments[action.data.post_id].comments[action.data.parent_id].replies,
                        [action.data.id]: {
                          ...state.postComments[action.data.post_id].comments[action.data.parent_id].replies[action.data.id],
                          clap_user_ids: [...state.postComments[action.data.post_id].comments[action.data.parent_id].replies[action.data.id].clap_user_ids, state.user.id],
                          clap_count: state.postComments[action.data.post_id].comments[action.data.parent_id].replies[action.data.id].clap_count + 1,
                          user_clap_count: 1,
                        },
                      },
                    },
                  },
                }
              : {
                  ...(state.postComments[action.data.post_id] && {
                    comments: {
                      ...state.postComments[action.data.post_id].comments,
                      [action.data.id]: {
                        ...state.postComments[action.data.post_id].comments[action.data.id],
                        clap_user_ids: [...state.postComments[action.data.post_id].comments[action.data.id].clap_user_ids, state.user.id],
                        clap_count: state.postComments[action.data.post_id].comments[action.data.id].clap_count + 1,
                        user_clap_count: 1,
                      },
                    },
                  }),
                }),
          },
        },
      };
    }
    case "REMOVE_COMMENT_REACT": {
      return {
        ...state,
        postComments: {
          ...state.postComments,
          [action.data.post_id]: {
            ...state.postComments[action.data.post_id],
            ...(action.data.parent_id && state.postComments[action.data.post_id]
              ? {
                  comments: {
                    ...state.postComments[action.data.post_id].comments,
                    [action.data.parent_id]: {
                      ...state.postComments[action.data.post_id].comments[action.data.parent_id],
                      replies: {
                        ...state.postComments[action.data.post_id].comments[action.data.parent_id].replies,
                        [action.data.id]: {
                          ...state.postComments[action.data.post_id].comments[action.data.parent_id].replies[action.data.id],
                          clap_user_ids: state.postComments[action.data.post_id].comments[action.data.parent_id].replies[action.data.id].clap_user_ids.filter((id) => id !== state.user.id),
                          clap_count: state.postComments[action.data.post_id].comments[action.data.parent_id].replies[action.data.id].clap_count - 1,
                          user_clap_count: 0,
                        },
                      },
                    },
                  },
                }
              : {
                  ...(state.postComments[action.data.post_id] && {
                    comments: {
                      ...state.postComments[action.data.post_id].comments,
                      [action.data.id]: {
                        ...state.postComments[action.data.post_id].comments[action.data.id],
                        clap_user_ids: state.postComments[action.data.post_id].comments[action.data.id].clap_user_ids.filter((id) => id !== state.user.id),
                        clap_count: state.postComments[action.data.post_id].comments[action.data.id].clap_count - 1,
                        user_clap_count: 0,
                      },
                    },
                  }),
                }),
          },
        },
      };
    }
    case "GET_REPLY_CLAP_HOVER_SUCCESS": {
      return {
        ...state,
        postComments: {
          ...state.postComments,
          [action.data.post_id]: {
            ...state.postComments[action.data.post_id],
            ...(action.data.parent_id && state.postComments[action.data.post_id]
              ? {
                  comments: {
                    ...state.postComments[action.data.post_id].comments,
                    [action.data.parent_id]: {
                      ...state.postComments[action.data.post_id].comments[action.data.parent_id],
                      replies: {
                        ...state.postComments[action.data.post_id].comments[action.data.parent_id].replies,
                        [action.data.message_id]: {
                          ...state.postComments[action.data.post_id].comments[action.data.parent_id].replies[action.data.message_id],
                          clap_user_ids: action.data.claps.map((c) => c.user_id),
                          fetchedReact: true,
                        },
                      },
                    },
                  },
                }
              : {
                  ...(state.postComments[action.data.post_id] && {
                    comments: {
                      ...state.postComments[action.data.post_id].comments,
                      [action.data.message_id]: {
                        ...state.postComments[action.data.post_id].comments[action.data.message_id],
                        clap_user_ids: action.data.claps.map((c) => c.user_id),
                        fetchedReact: true,
                      },
                    },
                  }),
                }),
          },
        },
      };
    }
    case "ADD_POST_REACT": {
      return {
        ...state,
        workspacePosts: {
          ...state.workspacePosts,
          ...Object.keys(state.workspacePosts)
            .filter((wsId) => state.workspacePosts[wsId].posts && state.workspacePosts[wsId].posts.hasOwnProperty(action.data.post_id))
            .map((wsId) => {
              return {
                [wsId]: {
                  ...state.workspacePosts[wsId],
                  posts: {
                    ...state.workspacePosts[wsId].posts,
                    [action.data.post_id]: {
                      ...state.workspacePosts[wsId].posts[action.data.post_id],
                      clap_user_ids: [...state.workspacePosts[wsId].posts[action.data.post_id].clap_user_ids, state.user.id],
                      clap_count: state.workspacePosts[wsId].posts[action.data.post_id].clap_count + 1,
                      user_clap_count: 1,
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
    case "REMOVE_POST_REACT": {
      return {
        ...state,
        workspacePosts: {
          ...state.workspacePosts,
          ...Object.keys(state.workspacePosts)
            .filter((wsId) => state.workspacePosts[wsId].posts && state.workspacePosts[wsId].posts.hasOwnProperty(action.data.post_id))
            .map((wsId) => {
              return {
                [wsId]: {
                  ...state.workspacePosts[wsId],
                  posts: {
                    ...state.workspacePosts[wsId].posts,
                    [action.data.post_id]: {
                      ...state.workspacePosts[wsId].posts[action.data.post_id],
                      clap_user_ids: state.workspacePosts[wsId].posts[action.data.post_id].clap_user_ids.filter((id) => id !== state.user.id),
                      clap_count: state.workspacePosts[wsId].posts[action.data.post_id].clap_count - 1,
                      user_clap_count: 0,
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
    case "GET_POST_CLAP_HOVER_SUCCESS": {
      const user_ids = action.data.claps.map((c) => c.user_id);
      return {
        ...state,
        workspacePosts: {
          ...state.workspacePosts,
          ...Object.keys(state.workspacePosts)
            .filter((wsId) => state.workspacePosts[wsId].posts && state.workspacePosts[wsId].posts.hasOwnProperty(action.data.post_id))
            .map((wsId) => {
              return {
                [wsId]: {
                  ...state.workspacePosts[wsId],
                  posts: {
                    ...state.workspacePosts[wsId].posts,
                    [action.data.post_id]: {
                      ...state.workspacePosts[wsId].posts[action.data.post_id],
                      fetchedReact: true,
                      clap_user_ids: user_ids,
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
      if (!action.data.topic_id) return { ...state };

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
    case "INCOMING_FAVOURITE_ITEM": {
      return {
        ...state,
        ...(action.data.type === "post" && {
          workspacePosts: {
            ...state.workspacePosts,
            ...Object.keys(state.workspacePosts)
              .filter((wsId) => state.workspacePosts[wsId].posts && state.workspacePosts[wsId].posts.hasOwnProperty(action.data.type_id))
              .map((wsId) => {
                return {
                  [wsId]: {
                    ...state.workspacePosts[wsId],
                    posts: {
                      ...state.workspacePosts[wsId].posts,
                      [action.data.type_id]: {
                        ...state.workspacePosts[wsId].posts[action.data.type_id],
                        is_favourite: action.data.is_favourite,
                      },
                    },
                  },
                };
              })
              .reduce((obj, workspace) => {
                return { ...obj, ...workspace };
              }, {}),
          },
        }),
      };
    }
    case "INCOMING_POST_MARK_DONE": {
      return {
        ...state,
        flipper: !state.flipper,
        workspacePosts: {
          ...state.workspacePosts,
          ...Object.keys(state.workspacePosts)
            .filter((wsId) => state.workspacePosts[wsId].posts && state.workspacePosts[wsId].posts.hasOwnProperty(action.data.post_id))
            .map((wsId) => {
              return {
                [wsId]: {
                  ...state.workspacePosts[wsId],
                  posts: {
                    ...state.workspacePosts[wsId].posts,
                    [action.data.post_id]: {
                      ...state.workspacePosts[wsId].posts[action.data.post_id],
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
    case "INCOMING_MARK_AS_READ": {
      return {
        ...state,
        ...Object.keys(state.workspacePosts)
          .filter((wsid) => {
            return wsid !== "flipper" && state.workspacePosts[wsid] && state.workspacePosts[wsid].posts[action.data.result.post_id];
          })
          .map((wsid) => ({
            ...state.workspacePosts,
            post: {
              ...state.workspacePosts[wsid].posts,
              [action.data.result.post_id]: {
                ...state.workspacePosts[wsid].posts[action.data.result.post_id],
                user_reads: action.data.result.user_reads,
              },
            },
          }))
          .reduce((obj, workspace) => {
            return { ...obj, ...workspace };
          }, {}),
      };
    }
    case "INCOMING_POST": {
      let newWorkspacePosts = { ...state.workspacePosts };
      let updatedWorkspaces = { ...state.workspaces };
      let updatedFolders = { ...state.folders };
      let addUnreadPost = false;
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
        if (action.data.author.id !== state.user.id && typeof updatedWorkspaces[ws.topic_id] !== "undefined") {
          updatedWorkspaces[ws.topic_id].unread_posts = updatedWorkspaces[ws.topic_id].unread_posts + 1;
          if (state.activeTopic && state.activeTopic.id === ws.topic_id) {
            addUnreadPost = true;
          }
          if (ws.workspace_id !== null) {
            updatedFolders[ws.workspace_id].unread_count = updatedFolders[ws.workspace_id].unread_count + 1;
          }
        }
      });
      return {
        ...state,
        workspacePosts: newWorkspacePosts,
        workspaces: updatedWorkspaces,
        activeTopic: addUnreadPost
          ? {
              ...state.activeTopic,
              unread_posts: state.activeTopic.unread_posts + 1,
            }
          : state.activeTopic,
      };
    }
    case "INCOMING_TO_DO":
    case "INCOMING_UPDATE_TO_DO":
    case "INCOMING_DONE_TO_DO":
    case "INCOMING_REMOVE_TO_DO": {
      let newWorkspacePosts = { ...state.workspacePosts };
      let postComments = { ...state.postComments };
      if (action.data.link_type === "POST" && action.data.data) {
        action.data.data.workspaces.forEach((w) => {
          if (typeof newWorkspacePosts[w.topic.id] !== "undefined" && typeof newWorkspacePosts[w.topic.id].posts[action.data.data.post.id] !== "undefined") {
            newWorkspacePosts[w.topic.id].posts[action.data.data.post.id] = {
              ...newWorkspacePosts[w.topic.id].posts[action.data.data.post.id],
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
        });
      }

      if (
        action.data.link_type === "POST_COMMENT" &&
        action.data.data &&
        typeof postComments[action.data.data.post.id] !== "undefined" &&
        typeof postComments[action.data.data.post.id].comments[action.data.data.comment.id] !== "undefined"
      ) {
        postComments[action.data.data.post.id] = {
          ...postComments[action.data.data.post.id],
          comments: {
            ...postComments[action.data.data.post.id].comments,
            [action.data.data.comment.id]: {
              ...postComments[action.data.data.post.id].comments[action.data.data.comment.id],
              todo_reminder:
                action.type === "INCOMING_REMOVE_TO_DO"
                  ? null
                  : {
                      id: action.data.id,
                      remind_at: action.data.remind_at,
                      status: action.data.status,
                    },
            },
          },
        };
      }

      return {
        ...state,
        postComments: postComments,
        workspacePosts: newWorkspacePosts,
      };
    }
    case "INCOMING_UPDATED_POST": {
      let newWorkspacePosts = { ...state.workspacePosts };
      action.data.recipient_ids.forEach((id) => {
        if (newWorkspacePosts.hasOwnProperty(id)) {
          if (action.data.is_personal && !action.data.post_participant_data.all_participant_ids.some((id) => id === state.user.id)) {
            delete newWorkspacePosts[id].posts[action.data.id];
          } else {
            if (newWorkspacePosts[id].posts.hasOwnProperty(action.data.id)) {
              newWorkspacePosts[id].posts[action.data.id] = { ...action.data, clap_user_ids: newWorkspacePosts[id].posts[action.data.id].clap_user_ids };
            } else {
              newWorkspacePosts[id].posts[action.data.id] = { ...action.data, clap_user_ids: [] };
            }
          }
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
      let updatedTopic = state.activeTopic ? { ...state.activeTopic } : null;
      const hasPendingApproval =
        action.data.users_approval.length > 0 && action.data.users_approval.filter((u) => u.ip_address === null).length === action.data.users_approval.length && action.data.users_approval.some((u) => u.id === state.user.id);

      if (action.data.workspaces.length && action.data.SOCKET_TYPE === "POST_COMMENT_CREATE") {
        action.data.workspaces.forEach((ws) => {
          if (newWorkspacePosts.hasOwnProperty(ws.topic_id) && newWorkspacePosts[ws.topic_id].posts.hasOwnProperty(action.data.post_id)) {
            //post = newWorkspacePosts[ws.topic_id].posts[action.data.post_id];
            if (!newWorkspacePosts[ws.topic_id].posts[action.data.post_id].users_responsible.some((u) => u.id === action.data.author.id)) {
              newWorkspacePosts[ws.topic_id].posts[action.data.post_id].users_responsible = [...newWorkspacePosts[ws.topic_id].posts[action.data.post_id].users_responsible, action.data.author];
            }
            if (newWorkspacePosts[ws.topic_id].posts[action.data.post_id].is_archived === 1) {
              newWorkspacePosts[ws.topic_id].posts[action.data.post_id].is_archived = 0;
            }
            newWorkspacePosts[ws.topic_id].posts[action.data.post_id].reply_count = newWorkspacePosts[ws.topic_id].posts[action.data.post_id].reply_count + 1;
            if (action.data.author.id !== state.user.id) {
              // if (updatedWorkspaces.hasOwnProperty(ws.topic_id)) {
              //   updatedWorkspaces[ws.topic_id].unread_posts = updatedWorkspaces[ws.topic_id].unread_posts + 1;
              // }
              if (updatedTopic && updatedTopic.id === ws.topic_id && state.workspacePosts[ws.topic_id].posts[action.data.post_id].unread_reply_ids.length === 0) {
                //updatedTopic.unread_posts = updatedTopic.unread_posts + 1;
              }
              newWorkspacePosts[ws.topic_id].posts[action.data.post_id].unread_count = newWorkspacePosts[ws.topic_id].posts[action.data.post_id].unread_count + 1;
              newWorkspacePosts[ws.topic_id].posts[action.data.post_id].unread_reply_ids = [...new Set([...newWorkspacePosts[ws.topic_id].posts[action.data.post_id].unread_reply_ids, action.data.id])];
            }
            newWorkspacePosts[ws.topic_id].posts[action.data.post_id].updated_at = action.data.updated_at;

            if (action.data.author.id === state.user.id) newWorkspacePosts[ws.topic_id].posts[action.data.post_id].has_replied = true;
            if (hasPendingApproval && action.data.users_approval.some((ua) => ua.id === state.user.id)) {
              newWorkspacePosts[ws.topic_id].posts[action.data.post_id].need_approval = true;
            }
          }
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
            if (newPostComments[action.data.post_id].comments[action.data.parent_id].replies.hasOwnProperty(action.data.id)) {
              newPostComments[action.data.post_id].comments[action.data.parent_id].replies[action.data.id] = {
                ...action.data,
                clap_user_ids: newPostComments[action.data.post_id].comments[action.data.parent_id].replies[action.data.id].clap_user_ids,
              };
            } else {
              newPostComments[action.data.post_id].comments[action.data.parent_id].replies[action.data.id] = action.data;
            }
          } else {
            if (newPostComments[action.data.post_id].comments.hasOwnProperty(action.data.id)) {
              newPostComments[action.data.post_id].comments[action.data.id] = { ...action.data, clap_user_ids: newPostComments[action.data.post_id].comments[action.data.id].clap_user_ids };
            } else {
              newPostComments[action.data.post_id].comments[action.data.id] = action.data;
            }
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
      return {
        ...state,
        workspaces: {
          ...state.workspaces,
          ...(action.data.folder_id &&
            state.workspaces[action.data.folder_id] &&
            state.workspaces[action.data.folder_id].topics[action.data.id] && {
              [action.data.folder_id]: {
                ...state.workspaces[action.data.folder_id],
                topics: {
                  ...state.workspaces[action.data.folder_id].topics,
                  [action.data.id]: {
                    ...state.workspaces[action.data.folder_id].topics[action.data.id],
                    primary_files: action.data.files,
                  },
                },
              },
            }),
          ...(state.workspaces[action.data.id] && {
            [action.data.id]: {
              ...state.workspaces[action.data.id],
              primary_files: action.data.files,
            },
          }),
        },
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
      let files = action.data.files.map((f) => {
        return {
          ...f,
          uploader: state.user,
        };
      });
      if (newWorkspaces.hasOwnProperty(action.data.topic_id)) {
        if (newWorkspaces[action.data.topic_id].hasOwnProperty("primary_files")) {
          newWorkspaces[action.data.topic_id].primary_files = [...new Set([...newWorkspaces[action.data.topic_id].primary_files, ...files])];
        } else {
          newWorkspaces[action.data.topic_id].primary_files = files;
        }
      }
      return {
        ...state,
        workspaces: newWorkspaces,
        activeTopic:
          state.activeTopic && state.activeTopic.id === action.data.topic_id
            ? {
                ...state.activeTopic,
                primary_files: state.activeTopic.hasOwnProperty("primary_files") ? [...new Set([...state.activeTopic.primary_files, ...files])] : files,
              }
            : state.activeTopic,
      };
    }
    case "INCOMING_POST_CLAP": {
      const channelIds = Object.keys(state.workspacePosts);
      return {
        ...state,
        ...(channelIds.length && {
          workspacePosts: {
            ...state.workspacePosts,
            ...channelIds.reduce((ws, channelId) => {
              ws = {
                ...ws,
                [channelId]:
                  typeof state.workspacePosts[channelId].posts === "undefined" || typeof state.workspacePosts[channelId].posts[action.data.post_id] === "undefined"
                    ? state.workspacePosts[channelId]
                    : {
                        ...state.workspacePosts[channelId],
                        posts: {
                          ...state.workspacePosts[channelId].posts,
                          [action.data.post_id]: {
                            ...state.workspacePosts[channelId].posts[action.data.post_id],
                            ...(action.data.clap_count === 1
                              ? {
                                  clap_count: state.workspacePosts[channelId].posts[action.data.post_id].clap_count + 1,
                                  clap_user_ids: [...state.workspacePosts[channelId].posts[action.data.post_id].clap_user_ids.filter((id) => id !== action.data.author.id), action.data.author.id],
                                  user_clap_count: action.data.author.id === state.user.id ? 1 : state.workspacePosts[channelId].posts[action.data.post_id].user_clap_count,
                                }
                              : {
                                  clap_count: state.workspacePosts[channelId].posts[action.data.post_id].clap_count - 1,
                                  clap_user_ids: state.workspacePosts[channelId].posts[action.data.post_id].clap_user_ids.filter((id) => id !== action.data.author.id),
                                  user_clap_count: action.data.author.id === state.user.id ? 0 : state.workspacePosts[channelId].posts[action.data.post_id].user_clap_count,
                                }),
                          },
                        },
                      },
              };
              return ws;
            }, {}),
          },
        }),
      };
    }
    case "INCOMING_COMMENT_CLAP": {
      return {
        ...state,
        ...(typeof state.postComments[action.data.post_id] !== "undefined" &&
          (action.data.parent_message_id
            ? typeof state.postComments[action.data.post_id].comments[action.data.parent_message_id] !== "undefined" &&
              typeof state.postComments[action.data.post_id].comments[action.data.parent_message_id].replies[action.data.message_id] !== "undefined"
            : typeof state.postComments[action.data.post_id].comments[action.data.message_id] !== "undefined") && {
            postComments: {
              ...state.postComments,
              [action.data.post_id]: {
                ...state.postComments[action.data.post_id],
                ...(action.data.parent_message_id
                  ? {
                      comments: {
                        ...state.postComments[action.data.post_id].comments,
                        [action.data.parent_message_id]: {
                          ...state.postComments[action.data.post_id].comments[action.data.parent_message_id],
                          replies: {
                            ...state.postComments[action.data.post_id].comments[action.data.parent_message_id].replies,
                            [action.data.message_id]: {
                              ...state.postComments[action.data.post_id].comments[action.data.parent_message_id].replies[action.data.message_id],
                              user_clap_count: action.data.clap_count,
                              clap_count: state.postComments[action.data.post_id].comments[action.data.parent_message_id].replies[action.data.message_id].clap_count + (action.data.clap_count === 1 ? 1 : -1),
                              clap_user_ids:
                                action.data.clap_count === 1
                                  ? [...state.postComments[action.data.post_id].comments[action.data.parent_message_id].replies[action.data.message_id].clap_user_ids, action.data.author.id]
                                  : state.postComments[action.data.post_id].comments[action.data.parent_message_id].replies[action.data.message_id].clap_user_ids.filter((id) => id !== action.data.author.id),
                            },
                          },
                        },
                      },
                    }
                  : {
                      comments: {
                        ...state.postComments[action.data.post_id].comments,
                        [action.data.message_id]: {
                          ...state.postComments[action.data.post_id].comments[action.data.message_id],
                          user_clap_count: action.data.clap_count,
                          clap_count: state.postComments[action.data.post_id].comments[action.data.message_id].clap_count + (action.data.clap_count === 1 ? 1 : -1),
                          clap_user_ids:
                            action.data.clap_count === 1
                              ? [...state.postComments[action.data.post_id].comments[action.data.message_id].clap_user_ids, action.data.author.id]
                              : state.postComments[action.data.post_id].comments[action.data.message_id].clap_user_ids.filter((id) => id !== action.data.author.id),
                        },
                      },
                    }),
              },
            },
          }),
      };
    }
    case "FETCH_TIMELINE_SUCCESS": {
      console.log(action.data.timeline);
      return {
        ...state,
        workspaceTimeline: {
          ...state.workspaceTimeline,
          [action.data.topic_id]: {
            ...(typeof state.workspaceTimeline[action.data.topic_id] === "undefined"
              ? {
                  hasMore: action.data.total_count > 10,
                  timeline: action.data.timeline.reduce((timeline, item) => {
                    timeline[item.id] = item;
                    return timeline;
                  }, {}),
                  total_items: action.data.total_count,
                  page: 1,
                  maxPage: Math.ceil(action.data.total_count / 10),
                }
              : {
                  ...state.workspaceTimeline[action.data.topic_id],
                  hasMore: Object.keys(state.workspaceTimeline[action.data.topic_id].timeline).length + action.data.timeline.length === action.data.total_count,
                  timeline: {
                    ...state.workspaceTimeline[action.data.topic_id].timeline,
                    ...action.data.timeline.reduce((timeline, item) => {
                      timeline[item.id] = item;
                      return timeline;
                    }, {}),
                  },
                  total_items: action.data.total_count,
                  maxPage: Math.ceil(action.data.total_count / 10),
                }),
          },
        },
      };
    }
    case "FETCH_WORKSPACE_MEMBERS_SUCCESS": {
      let newWorkspaces = { ...state.workspaces };

      newWorkspaces[action.data.id].members = action.data.members;

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
      return {
        ...state,
        workspacePosts: {
          ...state.workspacePosts,
          ...Object.keys(state.workspacePosts)
            .filter((wsId) => state.workspacePosts[wsId].posts && state.workspacePosts[wsId].posts.hasOwnProperty(action.data.post_id))
            .map((wsId) => {
              return {
                [wsId]: {
                  ...state.workspacePosts[wsId],
                  posts: {
                    ...state.workspacePosts[wsId].posts,
                    [action.data.post_id]: {
                      ...state.workspacePosts[wsId].posts[action.data.post_id],
                      view_user_ids: [...state.workspacePosts[wsId].posts[action.data.post_id].view_user_ids, action.data.viewer.id],
                      is_unread: 0,
                    },
                  },
                },
              };
            })
            .reduce((obj, workspace) => {
              return { ...obj, ...workspace };
            }, {}),
          flipper: !state.workspacePosts.flipper,
        },
      };
    }
    case "ARCHIVE_POST_REDUCER": {
      if (isNaN(action.data.topic_id)) return state;

      let newWorkspacePosts = { ...state.workspacePosts };
      newWorkspacePosts[action.data.topic_id].posts[action.data.post_id].is_archived = action.data.is_archived;
      return {
        ...state,
        workspacePosts: newWorkspacePosts,
      };
    }
    case "ARCHIVE_REDUCER": {
      let workspaces = { ...state.workspaces };
      let updatedFolders = { ...state.folders };
      let updatedSearch = { ...state.search };

      if (workspaces[action.data.topic_detail.id]) {
        workspaces[action.data.topic_detail.id].active = 0;
      }

      if (action.data.topic_detail.workspace_id && action.data.topic_detail.workspace_id !== 0) {
        if (updatedFolders[action.data.topic_detail.workspace_id]) {
          updatedFolders[action.data.topic_detail.workspace_id].workspace_ids = updatedFolders[action.data.topic_detail.workspace_id].workspace_ids.filter((id) => id !== action.data.topic_detail.id);
        }
      }

      if (updatedSearch.results.length) {
        updatedSearch.results = updatedSearch.results.map((item) => {
          if (item.topic.id === action.data.topic_detail.id) {
            return {
              ...item,
              is_archive: true,
            };
          } else {
            return item;
          }
        });
      }

      return {
        ...state,
        folders: updatedFolders,
        workspaces: workspaces,
        activeTopic:
          state.activeTopic && state.activeTopic.id === action.data.topic_detail.id
            ? {
                ...state.activeTopic,
                active: 0,
              }
            : state.activeTopic,
        search: updatedSearch,
      };
    }
    case "UNARCHIVE_REDUCER": {
      let workspaces = { ...state.workspaces };
      let updatedSearch = { ...state.search };
      if (workspaces.hasOwnProperty(action.data.topic_detail.id)) {
        workspaces[action.data.topic_detail.id].active = 1;
      }
      if (updatedSearch.results.length) {
        updatedSearch.results = updatedSearch.results.map((item) => {
          if (item.topic.id === action.data.topic_detail.id) {
            return {
              ...item,
              is_archive: false,
            };
          } else {
            return item;
          }
        });
      }
      return {
        ...state,
        workspaces: workspaces,
        activeTopic:
          state.activeTopic && state.activeTopic.id === action.data.topic_detail.id
            ? {
                ...state.activeTopic,
                active: 1,
              }
            : state.activeTopic,
      };
    }
    case "INCOMING_POST_TOGGLE_FOLLOW": {
      return {
        ...state,
        workspacePosts: {
          ...state.workspacePosts,
          ...Object.keys(state.workspacePosts)
            .filter((wsId) => state.workspacePosts[wsId].posts && state.workspacePosts[wsId].posts.hasOwnProperty(action.data.post_id))
            .map((wsId) => {
              return {
                [wsId]: {
                  ...state.workspacePosts[wsId],
                  posts: {
                    ...state.workspacePosts[wsId].posts,
                    [action.data.post_id]: {
                      ...state.workspacePosts[wsId].posts[action.data.post_id],
                      is_followed: action.data.is_followed,
                    },
                  },
                },
              };
            })
            .reduce((obj, workspace) => {
              return { ...obj, ...workspace };
            }, {}),
        },
        activeTopic: {
          ...state.activeTopic,
          ...(state.workspacePosts.hasOwnProperty(state.workspacePosts) &&
            state.workspacePosts[state.activeTopic.id].posts.hasOwnProperty(action.data.post_id) && {
              is_followed: false,
            }),
        },
      };
    }
    case "INCOMING_READ_UNREAD_REDUCER": {
      return {
        ...state,
        workspacePosts: {
          ...state.workspacePosts,
          ...Object.keys(state.workspacePosts)
            .filter((wsId) => state.workspacePosts[wsId].posts && state.workspacePosts[wsId].posts.hasOwnProperty(action.data.post_id))
            .map((wsId) => {
              return {
                [wsId]: {
                  ...state.workspacePosts[wsId],
                  posts: {
                    ...state.workspacePosts[wsId].posts,
                    [action.data.post_id]: {
                      ...state.workspacePosts[wsId].posts[action.data.post_id],
                      view_user_ids:
                        action.data.unread === 0
                          ? [...state.workspacePosts[wsId].posts[action.data.post_id].view_user_ids, action.data.user_id]
                          : state.workspacePosts[wsId].posts[action.data.post_id].view_user_ids.filter((id) => id !== action.data.user_id),
                      is_unread: action.data.unread,
                      unread_count: action.data.unread === 0 ? 0 : state.workspacePosts[wsId].posts[action.data.post_id].unread_count,
                      unread_reply_ids: action.data.unread === 0 ? [] : state.workspacePosts[wsId].posts[action.data.post_id].unread_reply_ids,
                    },
                  },
                },
              };
            })
            .reduce((obj, workspace) => {
              return { ...obj, ...workspace };
            }, {}),
        },
        activeTopic: {
          ...state.activeTopic,
          ...(state.workspacePosts.hasOwnProperty(state.activeTopic.id) &&
            state.workspacePosts[state.activeTopic.id].posts.hasOwnProperty(action.data.post_id) && {
              unread_count: state.activeTopic.unread_count + (action.data.unread ? 1 : -1),
              unread_posts: state.activeTopic.unread_posts + (action.data.unread ? 1 : -1),
            }),
        },
      };
    }
    case "INCOMING_TIMELINE": {
      let newTimeline = { ...state.workspaceTimeline };
      if (newTimeline.hasOwnProperty(action.data.workspace_data.topic_id)) {
        newTimeline[action.data.workspace_data.topic_id].timeline[action.data.timeline_data.id] = action.data.timeline_data;
        newTimeline[action.data.workspace_data.topic_id].total_items = newTimeline[action.data.workspace_data.topic_id].total_items + 1;
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
      let updatedTopic = state.activeTopic ? { ...state.activeTopic } : null;
      if (!action.data.is_read) {
        let updatedWorkspaces = { ...state.workspaces };
        if (Object.keys(updatedWorkspaces).length > 0) {
          if (updatedWorkspaces.hasOwnProperty(action.data.workspace_id)) {
            updatedWorkspaces[action.data.workspace_id].unread_chats = updatedWorkspaces[action.data.workspace_id].unread_chats + 1;
            if (state.activeTopic && state.activeTopic.id === action.data.workspace_id) {
              updatedTopic.unread_chats = updatedTopic.unread_chats + 1;
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
      } else {
        let updatedWorkspaces = { ...state.workspaces };
        if (Object.keys(updatedWorkspaces).length > 0) {
          if (updatedWorkspaces.hasOwnProperty(action.data.workspace_id)) {
            updatedWorkspaces[action.data.workspace_id].unread_chats = 0;
            if (state.activeTopic && state.activeTopic.id === action.data.workspace_id) {
              updatedTopic.unread_chats = 0;
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
    }
    case "READ_CHANNEL_REDUCER": {
      let updatedWorkspaces = { ...state.workspaces };
      let updatedTopic = { ...state.activeTopic };
      if (Object.keys(updatedWorkspaces).length > 0) {
        if (updatedWorkspaces.hasOwnProperty(action.data.id)) {
          updatedWorkspaces[action.data.id].unread_chats = 0;
          if (state.activeTopic && state.activeTopic.id === action.data.id) {
            updatedTopic.unread_chats = 0;
          }
        }
      }
      return {
        ...state,
        workspaces: updatedWorkspaces,
        activeTopic: updatedTopic,
      };
    }
    case "GET_WORKSPACE_SUCCESS": {
      let updatedWorkspaces = { ...state.workspaces };
      let updatedFolders = { ...state.folders };
      if (Object.keys(updatedWorkspaces).length > 0) {
        if (updatedWorkspaces.hasOwnProperty(action.data.topic_id)) {
          return state;
        } else {
          updatedWorkspaces[action.data.topic_id] = {
            ...action.data.workspace_data,
            active: action.data.workspace_data.topic_detail.active,
            channel: action.data.workspace_data.topic_detail.channel,
            unread_chats: action.data.workspace_data.topic_detail.unread_chats,
            unread_count: action.data.workspace_data.topic_detail.unread_count,
            folder_id: action.data.workspace_id && action.data.workspace_id !== 0 ? action.data.workspace_id : null,
            folder_name: action.data.workspace_id && action.data.workspace_id !== 0 ? action.data.workspace_name : null,
          };
          delete updatedWorkspaces[action.data.topic_id].topic_detail;

          if (action.data.workspace_id && action.data.workspace_id !== 0 && updatedFolders[action.data.workspace_id]) {
            updatedFolders[action.data.workspace_id].workspace_ids = [...updatedFolders[action.data.workspace_id].workspace_ids, action.data.topic_id];
          }
          return {
            ...state,
            workspaces: updatedWorkspaces,
            folders: updatedFolders,
          };
        }
      } else {
        return state;
      }
    }
    case "GET_FOLDER_SUCCESS": {
      let updatedFolders = { ...state.folders };
      updatedFolders[action.data.workspace_id] = {
        ...action.data.workspace_data,
        workspace_ids: action.data.workspace_data.topics.map((t) => t.id),
      };
      return {
        ...state,
        folders: updatedFolders,
      };
    }
    case "UPDATE_WORKSPACE_COUNTER": {
      let updatedWorkspaces = { ...state.workspaces };
      let updatedTopic = { ...state.activeTopic };
      if (Object.keys(updatedWorkspaces).length > 0) {
        updatedWorkspaces[action.data.topic_id].unread_posts = action.data.unread_posts;
        if (action.data.folder_id) {
          //check undefined unread count
          //updatedWorkspaces[action.data.folder_id].unread_count = action.data.unread_count;
        }
        if (state.activeTopic && state.activeTopic.id === action.data.topic_id) {
          updatedTopic.unread_posts = action.data.unread_posts;
        }
      }
      return {
        ...state,
        workspaces: updatedWorkspaces,
        activeTopic: updatedTopic,
      };
    }
    case "INCOMING_DELETED_FILES": {
      let updatedWorkspaces = { ...state.workspaces };
      if (updatedWorkspaces.hasOwnProperty(action.data.topic_id) && action.data.is_primary === 1) {
        if (updatedWorkspaces[action.data.topic_id].hasOwnProperty("primary_files")) {
          updatedWorkspaces[action.data.topic_id].primary_files = updatedWorkspaces[action.data.topic_id].primary_files.filter((f) => {
            return !action.data.deleted_file_ids.some((id) => id === f.id);
          });
        }
      }
      return {
        ...state,
        activeTopic:
          state.activeTopic && state.activeTopic.id === action.data.topic_id
            ? {
                ...state.activeTopic,
                primary_files: state.activeTopic.hasOwnProperty("primary_files")
                  ? state.activeTopic.primary_files.filter((f) => {
                      return !action.data.deleted_file_ids.some((id) => id === f.id);
                    })
                  : [],
              }
            : state.activeTopic,
        workspaces: updatedWorkspaces,
      };
    }
    case "LEAVE_WORKSPACE": {
      let updatedWorkspaces = { ...state.workspaces };
      if (updatedWorkspaces.hasOwnProperty(action.data.workspace_id)) {
        updatedWorkspaces[action.data.workspace_id].members = updatedWorkspaces[action.data.workspace_id].members.filter((m) => m.id !== state.user.id);
        updatedWorkspaces[action.data.workspace_id].member_ids = updatedWorkspaces[action.data.workspace_id].member_ids.filter((id) => id !== state.user.id);
      }
      return {
        ...state,
        workspaces: updatedWorkspaces,
        activeTopic:
          state.activeTopic && state.activeTopic.id === action.data.workspace_id
            ? {
                ...state.activeTopic,
                members: state.activeTopic.members.filter((m) => m.id !== state.user.id),
                member_ids: state.activeTopic.member_ids.filter((id) => id !== state.user.id),
              }
            : state.activeTopic,
      };
    }
    case "INCOMING_WORKSPACE_ROLE": {
      let updatedWorkspaces = { ...state.workspaces };
      if (updatedWorkspaces.hasOwnProperty(action.data.topic_id)) {
        updatedWorkspaces[action.data.topic_id].members = updatedWorkspaces[action.data.topic_id].members.map((m) => {
          if (m.id === action.data.user_id) {
            return {
              ...m,
              workspace_role: action.data.role,
            };
          } else {
            return m;
          }
        });
      }
      return {
        ...state,
        workspaces: updatedWorkspaces,
        activeTopic:
          state.activeTopic && state.activeTopic.id === action.data.topic_id
            ? {
                ...state.activeTopic,
                members: state.activeTopic.members.map((m) => {
                  if (m.id === action.data.user_id) {
                    return {
                      ...m,
                      workspace_role: action.data.role,
                    };
                  } else {
                    return m;
                  }
                }),
              }
            : state.activeTopic,
      };
    }
    case "INCOMING_DELETED_WORKSPACE_FOLDER": {
      let updatedFolders = { ...state.folders };
      let updatedWorkspaces = { ...state.workspaces };
      let updatedTopic = state.activeTopic ? { ...state.activeTopic } : null;
      if (updatedFolders.hasOwnProperty(action.data.id)) {
        Object.values(updatedWorkspaces).forEach((ws) => {
          if (ws.folder_id && ws.folder_id === action.data.id) {
            updatedWorkspaces[ws.id].folder_id = null;
            updatedWorkspaces[ws.id].folder_name = null;
            if (updatedTopic && updatedTopic.id === ws.id) {
              updatedTopic.folder_id = null;
              updatedTopic.folder_name = null;
            }
          }
        });
        delete updatedFolders[action.data.id];
      }
      return {
        ...state,
        activeTopic: updatedTopic,
        workspaces: updatedWorkspaces,
        folders: updatedFolders,
      };
    }
    case "SET_WORKSPACE_TO_DELETE": {
      return {
        ...state,
        workspaceToDelete: action.data,
      };
    }
    case "INCOMING_EXTERNAL_USER": {
      let updatedWorkspaces = { ...state.workspaces };
      let updatedTopic = null;
      if (updatedWorkspaces.hasOwnProperty(action.data.current_topic.id)) {
        updatedWorkspaces[action.data.current_topic.id].members = updatedWorkspaces[action.data.current_topic.id].members.map((m) => {
          if (m.id === action.data.current_user.id) {
            return {
              ...m,
              ...action.data.current_user,
            };
          } else {
            return m;
          }
        });
        if (state.activeTopic && state.activeTopic.id === action.data.current_topic.id) {
          updatedTopic = {
            ...state.activeTopic,
            members: state.activeTopic.members.map((m) => {
              if (m.id === action.data.current_user.id) {
                return {
                  ...m,
                  ...action.data.current_user,
                };
              } else {
                return m;
              }
            }),
          };
        }
      }
      return {
        ...state,
        workspaces: updatedWorkspaces,
        activeTopic: updatedTopic,
      };
    }
    case "UPDATE_WORKSPACE_TIMELINE_PAGE": {
      let workspaceTimeline = { ...state.workspaceTimeline };
      workspaceTimeline[action.data.id].page = action.data.page;
      return {
        ...state,
        workspaceTimeline: workspaceTimeline,
      };
    }
    case "READ_ALL_POSTS": {
      let workspacePosts = { ...state.workspacePosts };
      let workspaces = { ...state.workspaces };
      let activeTopic = state.activeTopic ? { ...state.activeTopic } : null;
      if (action.data.topic_id && workspacePosts.hasOwnProperty(action.data.topic_id)) {
        Object.values(workspacePosts[action.data.topic_id].posts).forEach((p) => {
          workspacePosts[action.data.topic_id].posts[p.id].is_read = true;
          workspacePosts[action.data.topic_id].posts[p.id].is_updated = true;
          workspacePosts[action.data.topic_id].posts[p.id].unread_count = 0;
          workspacePosts[action.data.topic_id].posts[p.id].is_unread = 0;
          workspacePosts[action.data.topic_id].posts[p.id].unread_reply_ids = [];
        });
        workspaces[action.data.topic_id].unread_posts = 0;
        if (activeTopic && activeTopic.id === action.data.topic_id) {
          activeTopic.unread_posts = 0;
        }
        return {
          ...state,
          workspacePosts: workspacePosts,
          workspaces: workspaces,
          activeTopic: activeTopic,
        };
      } else {
        return state;
      }
    }
    case "ARCHIVE_ALL_POSTS": {
      let workspacePosts = { ...state.workspacePosts };
      if (action.data.topic_id && workspacePosts.hasOwnProperty(action.data.topic_id)) {
        Object.values(workspacePosts[action.data.topic_id].posts).forEach((p) => {
          workspacePosts[action.data.topic_id].posts[p.id].is_archived = 1;
          workspacePosts[action.data.topic_id].posts[p.id].unread_count = 0;
          workspacePosts[action.data.topic_id].posts[p.id].unread_reply_ids = [];
        });
        return {
          ...state,
          workspacePosts: workspacePosts,
        };
      } else {
        return state;
      }
    }
    case "GET_POST_DETAIL_SUCCESS": {
      let newWorkspacePosts = { ...state.workspacePosts };
      let post = { ...action.data, clap_user_ids: [] };
      action.data.workspaces.forEach((ws) => {
        if (newWorkspacePosts.hasOwnProperty(ws.topic_id)) {
          newWorkspacePosts[ws.topic_id].posts[post.id] = post;
        } else {
          newWorkspacePosts[ws.topic_id] = {
            filters: {},
            filter: "all",
            sort: "recent",
            tag: null,
            search: "",
            searchResults: [],
            count: null,
            posts: {
              [post.id]: post,
            },
            post_ids: [post.id],
          };
        }
      });
      return {
        ...state,
        workspacePosts: newWorkspacePosts,
      };
    }
    case "UPDATE_POST_FILES": {
      return {
        ...state,
        workspacePosts: {
          ...state.workspacePosts,
          ...(action.data.topic_id && {
            [action.data.topic_id]: {
              ...state.workspacePosts[action.data.topic_id],
              posts: {
                ...state.workspacePosts[action.data.topic_id].posts,
                [action.data.post_id]: {
                  ...state.workspacePosts[action.data.topic_id].posts[action.data.post_id],
                  files: state.workspacePosts[action.data.topic_id].posts[action.data.post_id].files.map((f) => {
                    if (f.id === action.data.file.id) {
                      return action.data.file;
                    } else {
                      return f;
                    }
                  }),
                },
              },
            },
          }),
        },
      };
    }
    case "UPDATE_COMMENT_FILES": {
      return {
        ...state,
        postComments: {
          ...state.postComments,
          ...(action.data.post_id && {
            [action.data.post_id]: {
              ...state.postComments[action.data.post_id],
              comments: {
                ...state.postComments[action.data.post_id].comments,
                ...(action.data.parent_id && {
                  [action.data.parent_id]: {
                    ...state.postComments[action.data.post_id].comments[action.data.parent_id],
                    replies: {
                      ...state.postComments[action.data.post_id].comments[action.data.parent_id].replies,
                      [action.data.id]: {
                        ...state.postComments[action.data.post_id].comments[action.data.parent_id].replies[action.data.id],
                        files: state.postComments[action.data.post_id].comments[action.data.parent_id].replies[action.data.id].files.map((f) => {
                          if (f.id === action.data.file.id) {
                            return action.data.file;
                          } else {
                            return f;
                          }
                        }),
                      },
                    },
                  },
                }),
                ...(action.data.parent_id === null && {
                  [action.data.id]: {
                    ...state.postComments[action.data.post_id].comments[action.data.id],
                    files: state.postComments[action.data.post_id].comments[action.data.id].files.map((f) => {
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
          }),
        },
      };
    }
    case "INCOMING_IMPORTANT_COMMENT": {
      return {
        ...state,
        ...(state.postComments[action.data.post.id] && {
          postComments: {
            ...state.postComments,
            [action.data.post.id]: {
              ...state.postComments[action.data.post.id],
              comments: {
                ...state.postComments[action.data.post.id].comments,
                ...(state.postComments[action.data.post.id].comments[action.data.comment.id] && {
                  [action.data.comment.id]: {
                    ...state.postComments[action.data.post.id].comments[action.data.comment.id],
                    is_important: !state.postComments[action.data.post.id].comments[action.data.comment.id].is_important,
                  },
                }),
              },
            },
          },
        }),
      };
    }
    case "INCOMING_READ_SELECTED_POSTS": {
      return {
        ...state,
        workspacePosts: {
          ...state.workspacePosts,
          ...(action.data.topic_id && {
            [action.data.topic_id]: {
              ...state.workspacePosts[action.data.topic_id],
              posts: {
                ...state.workspacePosts[action.data.topic_id].posts,
                ...action.data.post_ids.reduce((res, id) => {
                  if (state.workspacePosts[action.data.topic_id].posts[id]) {
                    res[id] = {
                      ...state.workspacePosts[action.data.topic_id].posts[id],
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
          }),
        },
      };
    }
    case "INCOMING_ARCHIVED_SELECTED_POSTS": {
      return {
        ...state,
        workspacePosts: {
          ...state.workspacePosts,
          ...(action.data.topic_id && {
            [action.data.topic_id]: {
              ...state.workspacePosts[action.data.topic_id],
              posts: {
                ...state.workspacePosts[action.data.topic_id].posts,
                ...action.data.post_ids.reduce((res, id) => {
                  if (state.workspacePosts[action.data.topic_id].posts[id]) {
                    res[id] = {
                      ...state.workspacePosts[action.data.topic_id].posts[id],
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
          }),
        },
      };
    }
    case "UPDATE_WORKSPACE_POST_COUNT": {
      return {
        ...state,
        activeTopic: state.activeTopic && state.activeTopic.id === action.data.topic_id ? { ...state.activeTopic, unread_posts: action.data.count } : state.activeTopic,
        workspaces: {
          ...state.workspaces,
          [action.data.topic_id]: {
            ...state.workspaces[action.data.topic_id],
            unread_posts: action.data.count,
          },
        },
      };
    }
    case "INCOMING_POST_APPROVAL": {
      return {
        ...state,
        workspacePosts: {
          ...state.workspacePosts,
          ...(action.data.workspaces.length > 0 && {
            ...state.workspacePosts,
            ...action.data.workspaces.reduce((res, ws) => {
              if (state.workspacePosts[ws.topic.id]) {
                res[ws.topic.id] = {
                  ...state.workspacePosts[ws.topic.id],
                  posts: {
                    ...state.workspacePosts[ws.topic.id].posts,
                    [action.data.post.id]: {
                      ...state.workspacePosts[ws.topic.id].posts[action.data.post.id],
                      need_approval: false,
                      users_approval: state.workspacePosts[ws.topic.id].posts[action.data.post.id].users_approval.map((u) => {
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
                  },
                };
              }
              return res;
            }, {}),
          }),
        },
      };
    }
    case "INCOMING_COMMENT_APPROVAL": {
      return {
        ...state,
        postComments: {
          ...state.postComments,
          ...(state.postComments[action.data.post.id] && {
            [action.data.post.id]: {
              ...state.postComments[action.data.post.id],
              comments: {
                ...state.postComments[action.data.post.id].comments,
                ...(state.postComments[action.data.post.id].comments[action.data.comment.id] && {
                  [action.data.comment.id]: {
                    ...state.postComments[action.data.post.id].comments[action.data.comment.id],
                    users_approval: state.postComments[action.data.post.id].comments[action.data.comment.id].users_approval.map((u) => {
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
          }),
        },
        workspacePosts: {
          ...state.workspacePosts,
          ...(action.data.workspaces.length > 0 && {
            ...state.workspacePosts,
            ...action.data.workspaces.reduce((res, ws) => {
              if (state.workspacePosts[ws.topic.id]) {
                res[ws.topic.id] = {
                  ...state.workspacePosts[ws.topic.id],
                  posts: {
                    ...state.workspacePosts[ws.topic.id].posts,
                    [action.data.post.id]: {
                      ...state.workspacePosts[ws.topic.id].posts[action.data.post.id],
                      need_approval: false,
                    },
                  },
                };
              }
              return res;
            }, {}),
          }),
        },
      };
    }
    case "INCOMING_ARCHIVED_USER": {
      let updatedWorkspaces = { ...state.workspaces };
      action.data.topic_ids.forEach((wid) => {
        updatedWorkspaces[wid].members = updatedWorkspaces[wid].members.filter((m) => m.id !== action.data.user.id);
      });
      return {
        ...state,
        workspaces: updatedWorkspaces,
      };
    }
    case "INCOMING_UNARCHIVED_USER": {
      let updatedWorkspaces = { ...state.workspaces };
      action.data.connected_topic_ids.forEach((wid) => {
        updatedWorkspaces[wid].members = [...updatedWorkspaces[wid].members, action.data.profile];
      });
      return {
        ...state,
        workspaces: updatedWorkspaces,
      };
    }
    default:
      return state;
  }
};
