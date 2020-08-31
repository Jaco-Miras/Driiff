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
  workspace: {},
  folders: {},
  activeChannelId: null,
  workspaceToDelete: null,
  folderToDelete: null,
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
      let updatedWorkspaces = { ...state.workspaces };
      let updatedFolders = { ...state.folders };
      action.data.workspaces.forEach((ws) => {

        if (ws.type === "FOLDER") {
          if (updatedFolders.hasOwnProperty(ws.id)) {
            updatedFolders[ws.id].workspace_ids = [...updatedFolders[ws.id].workspace_ids, ...ws.topics.map((t) => t.id)];
          } else {
            updatedFolders[ws.id] = {
              ...ws,
              workspace_ids: ws.topics.map((t) => t.id)
            }
          }
          ws.topics.forEach((t) => {
            updatedWorkspaces[t.id] = {
              ...t,
              channel: {...t.channel, loaded: false},
              is_lock: t.private,
              folder_id: ws.id,
              folder_name: ws.name,
              type: "WORKSPACE"
            }
          })
          delete updatedFolders[ws.id].topics
        } else if (ws.type === "WORKSPACE") {
          updatedWorkspaces[ws.id] = {
            ...ws,
            active: ws.topic_detail.active,
            channel: {...ws.topic_detail.channel, loaded: false},
            unread_chats: ws.topic_detail.unread_chats,
            unread_posts: ws.topic_detail.unread_posts,
            folder_id: null,
            folder_name: null,
          }
          delete updatedWorkspaces[ws.id].topic_detail
        }
      })
      return {
        ...state,
        workspaces: updatedWorkspaces,
        workspacesLoaded: !state.workspacesLoaded && action.data.is_external === 0 ? true : state.workspacesLoaded,
        externalWorkspacesLoaded: !state.externalWorkspacesLoaded && action.data.is_external === 1 ? true : state.externalWorkspacesLoaded,
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
          workspace_ids: []
        }
      }
      return {
        ...state,
        folders: updatedFolders
      }
    }
    case "INCOMING_WORKSPACE": {
      let updatedWorkspaces = { ...state.workspaces };
      let folders = { ...state.folders };
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
            loaded: false
          },
          created_at: action.data.topic.created_at,
          updated_at: action.data.topic.created_at,
        }
        if (action.data.workspace && folders.hasOwnProperty(action.data.workspace.id)) {
          folders[action.data.workspace.id].workspace_ids = [...folders[action.data.workspace.id].workspace_ids, action.data.id]
        }
      }
      return {
        ...state,
        workspaces: updatedWorkspaces,
        folders: folders
      };
    }
    case "INCOMING_UPDATED_WORKSPACE_FOLDER": {
      let updatedWorkspaces = { ...state.workspaces };
      let updatedFolders = { ...state.folders };
      let workspace = null;
      let workspaceToDelete = state.workspaceToDelete;
      let folderToDelete = state.folderToDelete;
      if (state.workspacesLoaded && action.data.type === "WORKSPACE" && updatedWorkspaces.hasOwnProperty(action.data.id)) {
        let updatedTopic = { ...state.activeTopic };
        workspace = {
          ...state.workspaces[action.data.id],
          name: action.data.name,
          member_ids: action.data.member_ids,
          members: action.data.members,
          description: action.data.description,
          updated_at: action.data.updated_at,
          is_lock: action.data.private,
          folder_id: action.data.workspace_id === 0 ? null : action.data.workspace_id,
          folder_name: action.data.workspace_id === 0 ? null : action.data.current_workspace_folder_name 
        };
        updatedWorkspaces[workspace.id] = workspace;
        if (state.activeTopic && state.activeTopic.id === workspace.id) {
          updatedTopic = workspace;
        }
        if (!action.data.member_ids.some((id) => id === state.user.id)) {
          if (workspace.is_lock === 1 || state.user.type === "external") {
            delete updatedWorkspaces[workspace.id];
            if (Object.values(updatedWorkspaces).length) {
              updatedTopic = Object.values(updatedWorkspaces)[0];
            }
          } else {
            if (state.activeTopic.id === action.data.id) {
              workspaceToDelete = action.data.id;
              //check if workspace is under a folder 
              //then check if the user is a member in other workspace under the same folder
              // if user is no longer a member then set the folderToDelete id
              if (action.data.workspace_id !== 0 && updatedFolders.hasOwnProperty(action.data.workspace_id)) {
                let isMember = false;
                updatedFolders[action.data.workspace_id].workspace_ids.forEach((wsid) => {
                  if (state.workspaces.hasOwnProperty(wsid) && action.data.id !== wsid) {
                    if (state.workspaces[wsid].member_ids.some((id) => id === state.user.id)) {
                      isMember = true;
                      return;
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
                      return;
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
          if (action.data.original_workspace_id !== action.data.workspace_id) {
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
        }
      } else if (state.workspacesLoaded && action.data.type === "FOLDER") {
        updatedFolders[action.data.id] = {
          ...updatedFolders[action.data.id],
          name: action.data.name,
          description: action.data.description,
          is_lock: action.data.is_lock,
          updated_at: action.data.updated_at
        }
        updatedFolders[action.data.id].workspace_ids.forEach((id) => {
          updatedWorkspaces[id].folder_name = action.data.name;
        })
        return {
          ...state,
          activeTopic: state.activeTopic && state.activeTopic.folder_id && state.activeTopic.folder_id === action.data.id ? {...state.activeTopic, folder_name: action.data.name} : state.activeTopic,
          folders: updatedFolders,
          workspaces: updatedWorkspaces
        }
      } else {
        return state;
      }
    }
    case "SET_ACTIVE_TOPIC": {
      let updatedWorkspaces = { ...state.workspaces };
      let updatedFolders = { ...state.folders };
      if (state.workspaceToDelete) {
        delete updatedWorkspaces[state.workspaceToDelete];
      }
      if (state.folderToDelete) {
        delete updatedFolders[state.folderToDelete]
      }
      return {
        ...state,
        workspaces: updatedWorkspaces,
        workspaceToDelete: null,
        folderToDelete: null,
        folders: updatedFolders,
        activeTopic: action.data.hasOwnProperty("members") ? action.data : state.workspaces.hasOwnProperty(action.data.id) ? {...state.workspaces[action.data.id]} : state.activeTopic
      }
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
        activeChannelId: action.data.type === "TOPIC" ? action.data.id : state.activeChannelId
      };
    }
    case "GET_WORKSPACE_CHANNELS_SUCCESS": {
      let updatedWorkspaces = { ...state.workspaces };
      action.data.forEach((c) => {
        if (updatedWorkspaces.hasOwnProperty(c.entity_id)) {
          updatedWorkspaces[c.entity_id].channel.loaded = true;
        }
      })

      return {
        ...state,
        workspaces: updatedWorkspaces
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
            filter: action.data.filter,
            sort: action.data.sort ? (action.data.sort === state.workspacePosts[action.data.topic_id].sort ? state.workspacePosts[action.data.topic_id].sort : action.data.sort) : state.workspacePosts[action.data.topic_id].sort,
            tag: action.data.tag,
          },
        },
      };
    }
    case "JOIN_WORKSPACE_REDUCER": {
      let updatedWorkspaces = {...state.workspaces};
      let activeTopic = null;
      if (Object.keys(updatedWorkspaces).length) {
        Object.values(updatedWorkspaces).forEach((ws) => {
          if (ws.channel.id === action.data.channel_id) {
            updatedWorkspaces[ws.id].members = [...updatedWorkspaces[ws.id].members, ...action.data.users];
            updatedWorkspaces[ws.id].member_ids = [...updatedWorkspaces[ws.id].member_ids, ...action.data.users.map((u) => u.id)];
            activeTopic = updatedWorkspaces[ws.id];
          }
        })
      }
      return {
        ...state,
        workspaces: updatedWorkspaces,
        activeTopic: state.activeTopic && state.activeTopic.channel.id === action.data.channel_id && activeTopic ? activeTopic : state.activeTopic
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
    case "DELETE_DRAFT": {
      const draft = state.drafts.find(d => d.id === action.data.draft_id);

      let posts = state.workspacePosts[action.data.topic_id].posts;
      delete posts[draft.data.timestamp];

      if (action.data.draft_type === "draft_post") {
        return {
          ...state,
          drafts: [...state.drafts.filter(d => d.id !== action.data.draft_id)],
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
      let newWorkspacePosts = {...state.workspacePosts};
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
      if (!action.data.topic_id)
        return {...state};

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
      if (isNaN(action.data.topic_id))
        return state;

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
        if (action.data.author.id !== state.user.id) {
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
        activeTopic: addUnreadPost ? { ...state.activeTopic, unread_posts: state.activeTopic.unread_posts + 1} : state.activeTopic
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
      let updatedTopic = state.activeTopic ? { ...state.activeTopic } : null;

      if (action.data.workspaces.length && action.data.SOCKET_TYPE === "POST_COMMENT_CREATE") {
        action.data.workspaces.forEach((ws) => {
          if (newWorkspacePosts.hasOwnProperty(ws.topic_id) && newWorkspacePosts[ws.topic_id].posts.hasOwnProperty(action.data.post_id)) {
            //post = newWorkspacePosts[ws.topic_id].posts[action.data.post_id];
            newWorkspacePosts[ws.topic_id].posts[action.data.post_id].reply_count = newWorkspacePosts[ws.topic_id].posts[action.data.post_id].reply_count + 1;
            if (action.data.author.id !== state.user.id) {
              newWorkspacePosts[ws.topic_id].posts[action.data.post_id].unread_count = newWorkspacePosts[ws.topic_id].posts[action.data.post_id].unread_count + 1;
              if (updatedWorkspaces.hasOwnProperty(ws.topic_id)) {
                updatedWorkspaces[ws.topic_id].unread_posts = updatedWorkspaces[ws.topic_id].unread_posts + 1;
              }
              if (updatedTopic && updatedTopic.id === ws.topic_id) {
                updatedTopic.unread_posts = updatedTopic.unread_posts + 1;
              }
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
        activeTopic: updatedTopic
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
      let files = action.data.files.map(f => {
        return {
          ...f,
          uploader: state.user
        };
      })
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
      if (newWorkspaceTimeline.hasOwnProperty(action.data.topic_id)) {
        newWorkspaceTimeline[action.data.topic_id] = {
          ...newWorkspaceTimeline[action.data.topic_id],
          hasMore: action.data.timeline.length === 10,
          timeline: {...newWorkspaceTimeline[action.data.topic_id].timeline, ...convertArrayToObject(action.data.timeline, "id")}
        }
      } else {
        newWorkspaceTimeline[action.data.topic_id] = {
          hasMore: action.data.timeline.length === 10,
          timeline: convertArrayToObject(action.data.timeline, "id")
        }
      }
      return {
        ...state,
        workspaceTimeline: newWorkspaceTimeline,
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
      if (isNaN(action.data.topic_id))
        return state;

      let newWorkspacePosts = {...state.workspacePosts};
      newWorkspacePosts[action.data.topic_id].posts[action.data.post_id].is_archived = action.data.is_archived;
      return {
        ...state,
        workspacePosts: newWorkspacePosts,
      };
    }
    case "ARCHIVE_REDUCER": {
      let workspaces = {...state.workspaces};

      if (workspaces[action.data.topic_detail.id])
        workspaces[action.data.topic_detail.id].active = 0;

      return {
        ...state,
        workspaces: workspaces,
        activeTopic: state.activeTopic && state.activeTopic.id === action.data.topic_detail.id ? {
          ...state.activeTopic,
          active: 0
        } : state.activeTopic
      };
    }
    case "UNARCHIVE_REDUCER": {
      let workspaces = {...state.workspaces};
      workspaces[action.data.topic_detail.id].active = 1;
      return {
        ...state,
        workspaces: workspaces,
        activeTopic: state.activeTopic && state.activeTopic.id === action.data.topic_detail.id ? { ...state.activeTopic, active: 1 } : state.activeTopic
      };
    }
    case "MARK_READ_UNREAD_REDUCER": {
      let newWorkspacePosts = {...state.workspacePosts};
      let updatedWorkspaces = {...state.workspaces};
      let updatedTopic = {...state.activeTopic};
      let updatedFolders = { ...state.folders };
      newWorkspacePosts[action.data.topic_id].posts[action.data.post_id].is_unread = action.data.unread;
      if (action.data.unread === 0) {
        newWorkspacePosts[action.data.topic_id].posts[action.data.post_id].unread_count = action.data.unread;
        newWorkspacePosts[action.data.topic_id].posts[action.data.post_id].is_updated = true;
        if (action.data.folderId) {
          updatedFolders[action.data.folderId].unread_count = updatedFolders[action.data.folderId].unread_count - action.data.count;
          updatedWorkspaces[action.data.topic_id].unread_posts = updatedWorkspaces[action.data.topic_id].unread_posts - action.data.count;
          if (updatedTopic.id === action.data.topic_id) {
            updatedTopic.unread_posts = updatedTopic.unread_posts - action.data.count;
          }
        } else {
          if (updatedTopic.id === action.data.topic_id) {
            updatedTopic.unread_posts = updatedTopic.unread_posts - action.data.count;
          }
          updatedWorkspaces[action.data.topic_id].unread_posts = updatedWorkspaces[action.data.topic_id].unread_posts - action.data.count;
        }
      } else {
        if (action.data.folderId) {
          updatedFolders[action.data.folderId].unread_count = updatedFolders[action.data.folderId].unread_count + 1;
          updatedWorkspaces[action.data.topic_id].unread_posts = updatedWorkspaces[action.data.topic_id].unread_posts + 1;
          if (updatedTopic.id === action.data.topic_id) {
            updatedTopic.unread_posts = updatedTopic.unread_posts + 1;
          }
        } else {
          updatedWorkspaces[action.data.topic_id].unread_posts = updatedWorkspaces[action.data.topic_id].unread_posts + 1;
          if (updatedTopic.id === action.data.topic_id) {
            updatedTopic.unread_posts = updatedTopic.unread_posts + 1;
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
        let updatedTopic = { ...state.activeTopic };
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
          return {
            ...state,
            workspaces: updatedWorkspaces,
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
        workspace_ids: action.data.workspace_data.topics.map((t) => t.id)
      }
      return {
        ...state,
        folders: updatedFolders
      }
    }
    case "UPDATE_WORKSPACE_COUNTER": {
      let updatedWorkspaces = { ...state.workspaces };
      let updatedTopic = { ...state.activeTopic };
      if (Object.keys(updatedWorkspaces).length > 0) {
        updatedWorkspaces[action.data.topic_id].unread_posts = action.data.unread_posts;
        if (action.data.folder_id) {
          updatedWorkspaces[action.data.folder_id].unread_count = action.data.unread_count;
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
        activeTopic: state.activeTopic && state.activeTopic.id === action.data.topic_id ? 
                      {
                        ...state.activeTopic,
                        primary_files: state.activeTopic.hasOwnProperty("primary_files") ? state.activeTopic.primary_files.filter((f) => {
                                        return !action.data.deleted_file_ids.some((id) => id === f.id);
                                      }) : [],
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
      return  {
        ...state,
        workspaces: updatedWorkspaces,
        activeTopic: state.activeTopic && state.activeTopic.id === action.data.workspace_id ? 
        {
          ...state.activeTopic,
          members: state.activeTopic.members.filter((m) => m.id !== state.user.id),
          member_ids: state.activeTopic.member_ids.filter((id) => id !== state.user.id)
        } 
        : state.activeTopic
      }
    }
    case "INCOMING_WORKSPACE_ROLE": {
      let updatedWorkspaces = { ...state.workspaces };
      if (updatedWorkspaces.hasOwnProperty(action.data.topic_id)) {
        updatedWorkspaces[action.data.topic_id].members = updatedWorkspaces[action.data.topic_id].members.map((m) => {
          if (m.id === action.data.user_id) {
            return {
              ...m,
              workspace_role: action.data.role
            };
          } else {
            return m;
          }
        });
      }
      return {
        ...state,
        workspaces: updatedWorkspaces,
        activeTopic: state.activeTopic && state.activeTopic.id === action.data.topic_id ? 
          {
            ...state.activeTopic,
            members: state.activeTopic.members.map((m) => {
              if (m.id === action.data.user_id) {
                return {
                  ...m,
                  workspace_role: action.data.role
                };
              } else {
                return m;
              }
            })
          }
          : state.activeTopic
      }
    }
    case "INCOMING_DELETED_WORKSPACE_FOLDER": {
      let updatedFolders = { ...state.folders };
      let updatedWorkspaces = { ...state.workspaces };
      if (updatedFolders.hasOwnProperty(action.data.id)) {
        Object.values(updatedWorkspaces).forEach((ws) => {
          if (ws.folder_id && ws.folder_id === action.data.id) {
            updatedWorkspaces[ws.id].folder_id = null;
            updatedWorkspaces[ws.id].folder_name = null;
          }
        })
        delete updatedFolders[action.data.id];
      }
      return {
        ...state,
        workspaces: updatedWorkspaces,
        folders: updatedFolders
      }
    }
    case "SET_WORKSPACE_TO_DELETE": {
      return {
        ...state,
        workspaceToDelete: action.data
      }
    }
    case "INCOMING_EXTERNAL_USER": {
      let updatedWorkspaces = {...state.workspaces};
      let updatedTopic = null;
      if (updatedWorkspaces.hasOwnProperty(action.data.current_topic.id)) {
        updatedWorkspaces[action.data.current_topic.id].members = updatedWorkspaces[action.data.current_topic.id].members.map((m) => {
          if (m.id === action.data.current_user.id) {
            return {
              ...m,
              ...action.data.current_user
            }
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
                  ...action.data.current_user
                }
              } else {
                return m;
              }
            })
          }
        }
      }
      return {
        ...state,
        workspaces: updatedWorkspaces,
        activeTopic: updatedTopic
      }
    }
    default:
      return state;
  }
};
