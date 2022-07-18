/* eslint-disable no-prototype-builtins */
import _ from "lodash";
import { convertArrayToObject } from "../../helpers/arrayHelper";
import { getCurrentTimestamp } from "../../helpers/dateFormatter";
import { uniqBy } from "lodash";

const getSlug = () => {
  let driff = localStorage.getItem("slug");
  if (driff) {
    return driff;
  } else {
    const host = window.location.host.split(".");
    if (host.length === 3) {
      localStorage.setItem("slug", host[0]);
      return host[0];
    } else {
      return null;
    }
  }
};

const INITIAL_STATE = {
  selectedWorkspaceId: null,
  showAboutModal: false,
  flipper: true,
  user: {},
  allFoldersLoaded: false,
  allFolders: {},
  workspaces: {},
  activeTopic: null,
  activeTab: "intern",
  favoriteWorkspacesLoaded: false,
  workspacesLoaded: false,
  externalWorkspacesLoaded: false,
  workspacePosts: {},
  postComments: {},
  drafts: [],
  workspaceTimeline: {},
  workspace: {},
  folders: {},
  activeChannel: null,
  workspaceToDelete: null,
  folderToDelete: null,
  isOnClientChat: null,
  search: {
    loaded: false,
    folders: {},
    filterByFolder: null,
    results: [],
    searching: false,
    filterBy: "all",
    value: "",
    page: 1,
    maxPage: 1,
    count: 0,
    hasMore: false,
    limit: 25,
    skip: 0,
    query: {
      hasMore: false,
      limit: 25,
      skip: 0,
      filterBy: "all",
      value: "",
    },
    counters: {
      all: 0,
      new: 0,
      nonMember: 0,
      external: 0,
      private: 0,
      archived: 0,
      member: 0,
      favourites: 0,
    },
    filters: {
      private: {
        checked: false,
        label: "Private",
        key: "private",
      },
      archived: {
        checked: false,
        label: "Archived",
        key: "archived",
      },
      nonMember: {
        checked: false,
        label: "Non member",
        key: "nonMember",
      },
      new: {
        checked: false,
        label: "New",
        key: "new",
      },
      external: {
        checked: false,
        label: "External",
        key: "external",
      },
    },
  },
  workspaceReminders: {},
  connectedTeamIds: [],
  workspaceQuickLinks: {},
  relatedworkspace: {
    loading: false,
    error: null,
    data: [],
    hasMore: false,
  },
  sharedWorkspaces: {},
  sharedWorkspacesLoaded: false,
  sharedPostLists: {},
  sharedWorkspaceInitialFetch: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "UPDATE_WORKSPACE_SEARCH": {
      return {
        ...state,
        search: {
          ...state.search,
          ...action.data,
        },
      };
    }
    case "ADD_USER_TO_REDUCERS": {
      return {
        ...state,
        user: action.data,
      };
    }

    case "INCOMING_UPDATED_USER": {
      let activeTopic = state.activeTopic;

      if (activeTopic && action.data.fromSharedWs && activeTopic.sharedSlug && activeTopic.members.some((m) => m.id === action.data.id)) {
        const updatedMembers = activeTopic.members.map((m) => {
          if (m.id === action.data.id) {
            return {
              ...m,
              active: action.data.active ? action.data.active : m.active,
              email: action.data.email ? action.data.email : m.email,
              name: action.data.name ? action.data.name : m.name,
              profile_image_link: action.data.profile_image_link ? action.data.profile_image_link : m.profile_image_link,
              profile_image_thumbnail_link: action.data.profile_image_thumbnail_link ? action.data.profile_image_thumbnail_link : m.profile_image_thumbnail_link,
              type: action.data.type ? action.data.type : m.type,
              designation: action.data.designation ? action.data.designation : m.designation,
              contact: action.data.contact ? action.data.contact : m.contact,
              external_company_name: action.data.external_company_name ? action.data.external_company_name : m.external_company_name,
            };
          } else {
            return m;
          }
        });
        activeTopic = {
          ...activeTopic,
          is_shared: action.data.type === "external" ? true : activeTopic.is_shared,
          members: updatedMembers,
        };
      } else if (activeTopic && !action.data.fromSharedWs && !activeTopic.sharedSlug && activeTopic.members.some((m) => m.id === action.data.id)) {
        const updatedMembers = activeTopic.members.map((m) => {
          if (m.id === action.data.id) {
            return {
              ...m,
              active: action.data.active ? action.data.active : m.active,
              email: action.data.email ? action.data.email : m.email,
              name: action.data.name ? action.data.name : m.name,
              profile_image_link: action.data.profile_image_link ? action.data.profile_image_link : m.profile_image_link,
              profile_image_thumbnail_link: action.data.profile_image_thumbnail_link ? action.data.profile_image_thumbnail_link : m.profile_image_thumbnail_link,
              type: action.data.type ? action.data.type : m.type,
              designation: action.data.designation ? action.data.designation : m.designation,
              contact: action.data.contact ? action.data.contact : m.contact,
              external_company_name: action.data.external_company_name ? action.data.external_company_name : m.external_company_name,
            };
          } else {
            return m;
          }
        });
        activeTopic = {
          ...activeTopic,
          is_shared: action.data.type === "external" ? true : activeTopic.is_shared,
          members: updatedMembers,
        };
      }

      return {
        ...state,
        flipper: !state.flipper,
        workspaces: Object.values(state.workspaces).reduce((res, ws) => {
          const wsMembers =
            (ws.members.some((m) => m.id === action.data.id) && action.data.fromSharedWs && ws.sharedSlug) || (ws.members.some((m) => m.id === action.data.id) && !action.data.fromSharedWs && !ws.sharedSlug)
              ? ws.members.map((m) => {
                  if (m.id === action.data.id) {
                    return {
                      ...m,
                      active: action.data.active ? action.data.active : m.active,
                      email: action.data.email ? action.data.email : m.email,
                      name: action.data.name ? action.data.name : m.name,
                      profile_image_link: action.data.profile_image_link ? action.data.profile_image_link : m.profile_image_link,
                      profile_image_thumbnail_link: action.data.profile_image_thumbnail_link ? action.data.profile_image_thumbnail_link : m.profile_image_thumbnail_link,
                      type: action.data.type ? action.data.type : m.type,
                      designation: action.data.designation ? action.data.designation : m.designation,
                      contact: action.data.contact ? action.data.contact : m.contact,
                      external_company_name: action.data.external_company_name ? action.data.external_company_name : m.external_company_name,
                    };
                  } else {
                    return m;
                  }
                })
              : ws.members;
          res[ws.sharedSlug ? ws.key : ws.id] = {
            ...ws,
            members: wsMembers,
            is_shared: ws.members.some((m) => m.id === action.data.id) && action.data.type === "external" ? true : ws.is_shared,
          };
          return res;
        }, {}),
        activeTopic: activeTopic,
      };
    }
    case "GET_WORKSPACES_SUCCESS": {
      let updatedWorkspaces = { ...state.workspaces };
      let updatedFolders = { ...state.folders };
      let connectedTeamIds = [];
      let workspaces = action.data.workspaces.map((ws) => {
        if (action.slug !== getSlug()) {
          return { ...ws, isSharedWs: true };
        } else {
          return { ...ws, isSharedWs: false };
        }
      });
      workspaces.forEach((ws) => {
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
            if (t.members.some((m) => m.hasOwnProperty("parent_team"))) {
              const teams = t.members.filter((m) => m.hasOwnProperty("parent_team"));
              connectedTeamIds.push(teams);
            }
            if (!state.workspaces[ws.isSharedWs ? `${t.id}-${action.slug}` : t.id]) {
              updatedWorkspaces[ws.isSharedWs ? `${t.id}-${action.slug}` : t.id] = {
                ...t,
                channel: { ...t.channel, loaded: false },
                is_lock: t.private,
                folder_id: ws.id,
                folder_name: ws.name,
                team_channel: t.team_channel,
                is_favourite: t.is_favourite,
                is_active: t.is_active,
                type: "WORKSPACE",
                slug: action.slug,
                sharedSlug: action.slug !== getSlug(),
                key: ws.isSharedWs ? `${t.id}-${action.slug}` : t.id,
                is_shared_wp: ws.isSharedWs,
              };
            }
          });
          delete updatedFolders[ws.id].topics;
        } else if (ws.type === "WORKSPACE") {
          if (ws.members.some((m) => m.hasOwnProperty("parent_team"))) {
            const teams = ws.members.filter((m) => m.hasOwnProperty("parent_team"));
            connectedTeamIds.push(teams);
          }
          updatedWorkspaces[ws.isSharedWs ? `${ws.id}-${action.slug}` : ws.id] = {
            ...ws,
            is_favourite: ws.topic_detail.is_favourite,
            is_shared: ws.topic_detail.is_shared,
            active: ws.topic_detail.active,
            is_active: ws.topic_detail.is_active,
            channel: { ...ws.topic_detail.channel, loaded: false },
            unread_chats: ws.topic_detail.unread_chats,
            unread_posts: ws.topic_detail.unread_posts,
            folder_id: null,
            folder_name: null,
            team_channel: ws.topic_detail.team_channel,
            team_unread_chats: ws.topic_detail.team_unread_chats,
            workspace_counter_entries: ws.topic_detail.workspace_counter_entries,
            show_about: ws.topic_detail.show_about,
            slug: action.slug,
            sharedSlug: action.slug !== getSlug(),
            key: ws.isSharedWs ? `${ws.id}-${action.slug}` : ws.id,
            is_shared_wp: ws.isSharedWs,
            team_channel_bot: ws.topic_detail.team_channel_bot,
            channel_bot: ws.topic_detail.channel_bot,
          };
          delete updatedWorkspaces[ws.isSharedWs ? `${ws.id}-${action.slug}` : ws.id].topic_detail;
        }
      });
      let searchWs = [];
      if (action.slug !== getSlug()) {
        searchWs = action.data.workspaces
          .map((ws) => {
            if (ws.type === "FOLDER") {
              return ws.topics.map((t) => {
                return {
                  ...t,
                  timestamp: t.created_at.timestamp,
                  search: t.name,
                  topic: { ...t },
                  workspace: { id: ws.id, name: ws.name },
                  slug: action.slug,
                };
              });
            } else {
              return {
                channel: ws.topic_detail.channel,
                timestamp: ws.created_at.timestamp,
                search: ws.name,
                members: ws.members,
                created_at: ws.created_at,
                topic: { ...ws.topic_detail },
                workspace: null,
                slug: action.slug,
              };
            }
          })
          .flat();
      }
      return {
        ...state,
        search: {
          ...state.search,
          results: [...state.search.results, ...searchWs],
        },
        connectedTeamIds: [...new Set(connectedTeamIds.flat().map((t) => t.id))],
        workspaces: updatedWorkspaces,
        workspacesLoaded: true,
        externalWorkspacesLoaded: true,
        folders: updatedFolders,
        isOnClientChat:
          state.activeChannel &&
          updatedWorkspaces[state.activeChannel.entity_id] &&
          updatedWorkspaces[state.activeChannel.entity_id].team_channel &&
          updatedWorkspaces[state.activeChannel.entity_id].team_channel.code &&
          updatedWorkspaces[state.activeChannel.entity_id].channel.id === state.activeChannel.id
            ? { code: updatedWorkspaces[state.activeChannel.entity_id].team_channel.code, id: updatedWorkspaces[state.activeChannel.entity_id].team_channel.id }
            : null,
      };
    }
    case "GET_FAVORITE_WORKSPACES_SUCCESS": {
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
              team_channel: t.team_channel,
              is_favourite: true,
              is_active: t.is_active,
              type: "WORKSPACE",
              sharedSlug: false,
              slug: action.slug,
              key: t.id,
            };
          });
          delete updatedFolders[ws.id].topics;
        } else if (ws.type === "WORKSPACE") {
          updatedWorkspaces[ws.id] = {
            ...ws,
            is_favourite: true,
            is_shared: ws.topic_detail.is_shared,
            active: ws.topic_detail.active,
            is_active: ws.topic_detail.is_active,
            channel: { ...ws.topic_detail.channel, loaded: false },
            unread_chats: ws.topic_detail.unread_chats,
            unread_posts: ws.topic_detail.unread_posts,
            folder_id: null,
            folder_name: null,
            team_channel: ws.topic_detail.team_channel,
            team_unread_chats: ws.topic_detail.team_unread_chats,
            workspace_counter_entries: ws.topic_detail.workspace_counter_entries,
            sharedSlug: false,
            slug: action.slug,
            key: ws.id,
            team_channel_bot: ws.topic_detail.team_channel_bot,
            channel_bot: ws.topic_detail.channel_bot,
          };
          delete updatedWorkspaces[ws.id].topic_detail;
        }
      });
      return {
        ...state,
        workspaces: updatedWorkspaces,
        folders: updatedFolders,
        favoriteWorkspacesLoaded: true,
      };
    }
    case "GET_WORKSPACE_SET_TO_FAV_SUCCESS": {
      let ws = {
        ...action.data.workspace_data,
        channel: action.data.workspace_data.topic_detail.channel,
        team_channel: action.data.workspace_data.topic_detail.team_channel,
        team_unread_chats: action.data.workspace_data.topic_detail.team_unread_chats,
        unread_chats: action.data.workspace_data.topic_detail.unread_chats,
        unread_posts: action.data.workspace_data.topic_detail.unread_posts,
        folder_id: action.data.workspace_id === 0 ? null : action.data.workspace_id,
        folder_name: action.data.workspace_name,
        is_shared: action.data.workspace_data.topic_detail.is_shared,
        is_favourite: true,
        show_about: action.data.workspace_data.topic_detail.show_about,
        active: action.data.workspace_data.topic_detail.active,
        team_channel_bot: action.data.workspace_data.topic_detail.team_channel_bot,
        channel_bot: action.data.workspace_data.topic_detail.channel_bot,
      };
      return {
        ...state,
        workspaces: {
          ...state.workspaces,
          [ws.id]: ws,
        },
      };
    }
    case "GET_WORKSPACE_SUCCESS": {
      if (action.data.tye === "FOLDER") {
        return {
          ...state,
          allFolders: {
            ...state.allFolders,
            [action.data.workspace.id]: {
              ...action.data.workspace,
              workspaces: [],
            },
          },
        };
      } else {
        let ws = {
          ...action.data.workspace_data,
          channel: action.data.workspace_data.topic_detail.channel,
          team_channel: action.data.workspace_data.topic_detail.team_channel,
          team_unread_chats: action.data.workspace_data.topic_detail.team_unread_chats,
          unread_chats: action.data.workspace_data.topic_detail.unread_chats,
          unread_posts: action.data.workspace_data.topic_detail.unread_posts,
          folder_id: action.data.workspace_id === 0 ? null : action.data.workspace_id,
          folder_name: action.data.workspace_name,
          is_shared: action.data.workspace_data.topic_detail.is_shared,
          show_about: action.data.workspace_data.topic_detail.show_about,
          active: action.data.workspace_data.topic_detail.active,
          is_favourite: action.data.workspace_data.topic_detail.is_favourite,
          is_active: action.data.workspace_data.topic_detail.is_active,
          key: action.data.workspace_data.topic_detail.id,
          sharedSlug: false,
          team_channel_bot: action.data.workspace_data.topic_detail.team_channel_bot,
          channel_bot: action.data.workspace_data.topic_detail.channel_bot,
          slug: action.slug,
        };
        return {
          ...state,
          workspaces: {
            ...state.workspaces,
            [ws.id]: ws,
          },
          activeTopic: ws,
          selectedWorkspaceId: ws.id,
          showAboutModal: ws.show_about,
        };
      }
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
        allFolders: {
          ...state.allFolders,
          [action.data.id]: {
            ...action.data,
            workspaces: [],
          },
        },
      };
    }
    case "CREATE_WORKSPACE_SUCCESS": {
      if (action.data.topic.is_shared_wp) {
        const ws = {
          channel: action.data.channel,
          created_at: action.data.topic.created_at,
          members: action.data.members,
          search: action.data.topic.name,
          timestamp: action.data.topic.created_at.timestamp,
          workspace: action.data.workspace,
          topic: {
            description: action.data.topic.description,
            icon_link: null,
            id: action.data.topic.id,
            is_active: true,
            is_archive: false,
            is_favourite: false,
            is_locked: !!action.data.topic.private,
            is_shared: !!action.data.topic.is_shared,
            name: action.data.topic.name,
            created_at: action.data.topic.created_at,
            updated_at: action.data.topic.created_at,
          },
          sharedSlug: true,
          slug: action.data.channel.slug_owner,
        };
        return {
          ...state,
          search: {
            ...state.search,
            results: [ws, ...state.search.results],
          },
        };
      } else {
        return state;
      }
    }
    //check if new workspace is shared
    case "INCOMING_WORKSPACE": {
      if (action.data.sharedSlug || action.data.topic.slug_owner === `${getSlug()}-shared`) return state;
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
          team_unread_chats: 0,
          is_active: true,
          channel: {
            code: action.data.channel.code,
            id: action.data.channel.id,
            icon_link: null,
            loaded: false,
          },
          team_channel: {
            code: action.data.team_channel.code ? action.data.team_channel.code : null,
            id: action.data.team_channel.id ? action.data.team_channel.id : null,
            icon_link: null,
          },
          created_at: action.data.topic.created_at,
          updated_at: action.data.topic.created_at,
          primary_files: [],
          is_shared: action.data.members.filter((m) => m.type === "external").length > 0,
          key: action.data.id,
          sharedSlug: false,
        };
        if (action.data.workspace !== null && updatedFolders[action.data.workspace.id]) {
          updatedFolders[action.data.workspace.id].workspace_ids = [...updatedFolders[action.data.workspace.id].workspace_ids, action.data.id];
        }
      }
      const ws = {
        channel: action.data.channel,
        created_at: action.data.topic.created_at,
        members: action.data.members,
        search: action.data.topic.name,
        timestamp: action.data.topic.created_at.timestamp,
        workspace: action.data.workspace,
        topic: {
          description: action.data.topic.description,
          icon_link: null,
          id: action.data.topic.id,
          is_active: true,
          is_archive: false,
          is_favourite: false,
          is_locked: !!action.data.topic.private,
          is_shared: !!action.data.topic.is_shared,
          name: action.data.topic.name,
          created_at: action.data.topic.created_at,
          updated_at: action.data.topic.created_at,
        },
      };
      return {
        ...state,
        workspaces: updatedWorkspaces,
        folders: updatedFolders,
        allFolders: action.data.workspace
          ? Object.values(state.allFolders).reduce((acc, folder) => {
              if (folder.id === action.data.workspace.id) {
                acc[folder.id] = { ...folder, workspaces: [...folder.workspaces, { id: action.data.id, name: action.data.topic.name, active: 1, description: action.data.topic.description }] };
              } else {
                acc[folder.id] = folder;
              }
              return acc;
            }, {})
          : state.allFolders,
        search: {
          ...state.search,
          results: state.search.results.some((r) => r.topic.id === ws.id) ? state.search.results : [ws, ...state.search.results],
        },
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
              slug: action.data.slug_owner,
              sharedSlug: action.data.is_shared_wp,
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

      if (state.workspacesLoaded && action.data.type === "WORKSPACE" && Object.values(state.workspaces).some((ws) => ws.id === action.data.id)) {
        let updatedTopic = state.activeTopic ? { ...state.activeTopic } : null;
        workspace = Object.values(state.workspaces).find((ws) => {
          if (action.data.is_shared_wp) {
            return ws.id === action.data.id && ws.sharedSlug;
          } else {
            return ws.id === action.data.id;
          }
        });
        workspace = {
          ...state.workspaces[workspace.sharedSlug ? workspace.key : workspace.id],
          ...action.data,
          slug: workspace.slug,
          sharedSlug: workspace.sharedSlug,
          is_lock: action.data.private,
          folder_name: action.data.current_workspace_folder_name,
        };
        updatedWorkspaces[workspace.sharedSlug ? workspace.key : workspace.id] = workspace;
        if (state.activeTopic && state.activeTopic.id === workspace.id) {
          updatedTopic = workspace;
        }
        let members = action.data.members
          .map((m) => {
            if (m.member_ids) {
              return m.members;
            } else return m;
          })
          .flat();
        if (!members.some((m) => m.id === state.user.id)) {
          if (workspace.is_lock === 1 || state.user.type === "external") {
            delete updatedWorkspaces[workspace.id];
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
      if (!updatedWorkspaces[action.data.key] && action.data.sharedSlug) {
        updatedWorkspaces[action.data.key] = action.data;
      }
      return {
        ...state,
        workspaces: updatedWorkspaces,
        workspaceToDelete: null,
        folderToDelete: null,
        folders: updatedFolders,
        activeTopic: action.data.hasOwnProperty("members") ? action.data : state.workspaces.hasOwnProperty(action.data.id) ? { ...state.workspaces[action.data.id] } : state.activeTopic,
        selectedWorkspaceId: action.data ? action.data.id : null,
        showAboutModal: action.data && state.workspaces[action.data.id] ? state.workspaces[action.data.id].show_about : false,
      };
    }
    case "GET_LAST_CHANNEL_SUCCESS": {
      if (action.data) {
        return {
          ...state,
          activeChannel: {
            id: action.data.id,
            entity_id: action.data.entity_id,
            type: action.data.type,
          },
          isOnClientChat:
            action.data.type === "TOPIC" && state.workspaces[action.data.entity_id] && state.workspaces[action.data.entity_id].team_channel.code && state.workspaces[action.data.entity_id].channel.id === action.data.id
              ? { code: state.workspaces[action.data.entity_id].team_channel.code, id: state.workspaces[action.data.entity_id].team_channel.id }
              : null,
        };
      } else {
        return state;
      }
    }
    case "GET_SELECT_CHANNEL_SUCCESS": {
      return {
        ...state,
        activeChannel: {
          id: action.data.id,
          entity_id: action.data.entity_id,
          type: action.data.type,
        },
        isOnClientChat:
          action.data.type === "TOPIC" &&
          state.workspaces[action.data.entity_id] &&
          state.workspaces[action.data.entity_id].team_channel &&
          state.workspaces[action.data.entity_id].team_channel.code &&
          state.workspaces[action.data.entity_id].channel.id === action.data.id
            ? { code: state.workspaces[action.data.entity_id].team_channel.code, id: state.workspaces[action.data.entity_id].team_channel.id }
            : null,
      };
    }
    case "SET_SELECTED_CHANNEL": {
      return {
        ...state,
        activeChannel: {
          id: action.data.id,
          entity_id: action.data.entity_id,
          type: action.data.type,
        },
        isOnClientChat:
          action.data.type === "TOPIC" &&
          state.workspaces[action.data.entity_id] &&
          state.workspaces[action.data.entity_id].team_channel &&
          state.workspaces[action.data.entity_id].team_channel.code &&
          state.workspaces[action.data.entity_id].channel.id === action.data.id
            ? { code: state.workspaces[action.data.entity_id].team_channel.code, id: state.workspaces[action.data.entity_id].team_channel.id }
            : null,
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
          ...(state.workspaces[action.data.topicKey] && {
            [action.data.topicKey]: {
              ...state.workspacePosts[action.data.topicKey],
              search: action.data.search,
              searchResults: action.data.search_result,
              filter: "all",
            },
          }),
        },
      };
    }
    case "ADD_TO_WORKSPACE_POSTS": {
      let convertedPosts = {};
      if (action.data.isSharedSlug) {
        convertedPosts = convertArrayToObject(
          action.data.posts.map((p) => {
            return Object.assign({}, p, { claps: [], slug: action.data.slug });
          }),
          "code"
        );
      } else {
        convertedPosts = convertArrayToObject(
          action.data.posts.map((p) => {
            return Object.assign({}, p, { claps: [], slug: action.data.slug });
          }),
          "id"
        );
      }

      let postDrafts = [];
      if (state.drafts.length) {
        postDrafts = convertArrayToObject(state.drafts, "post_id");
      }
      let key = action.data.topic_id;
      if (action.data.isSharedSlug) {
        key = `${action.data.topic_id}-${action.data.slug}`;
      }
      if (state.workspacePosts[key]) {
        return {
          ...state,
          workspacePosts: {
            ...state.workspacePosts,
            [key]: {
              ...state.workspacePosts[key],
              ...(action.data.filters && {
                filters: {
                  ...state.workspacePosts[key].filters,
                  ...action.data.filters,
                },
              }),
              posts: {
                ...state.workspacePosts[key].posts,
                ...convertedPosts,
                ...postDrafts,
              },
              ...(action.data.categories && {
                categoriesLoaded: true,
                categories: {
                  ...state.workspacePosts[key].categories,
                  ...action.data.categories,
                },
              }),
              ...(action.data.category && {
                categories: {
                  ...state.workspacePosts[key].categories,
                  ...(action.data.category.mustRead && {
                    mustRead: {
                      ...state.workspacePosts[key].categories.mustRead,
                      ...action.data.category.mustRead,
                    },
                  }),
                  ...(action.data.category.mustReply && {
                    mustReply: {
                      ...state.workspacePosts[key].categories.mustReply,
                      ...action.data.category.mustReply,
                    },
                  }),
                  ...(action.data.category.noReplies && {
                    noReplies: {
                      ...state.workspacePosts[key].categories.noReplies,
                      ...action.data.category.noReplies,
                    },
                  }),
                  ...(action.data.category.closedPost && {
                    closedPost: {
                      ...state.workspacePosts[key].categories.closedPost,
                      ...action.data.category.closedPost,
                    },
                  }),
                },
              }),
            },
          },
        };
      } else {
        return {
          ...state,
          workspacePosts: {
            ...state.workspacePosts,
            [key]: {
              filters: action.data.filters,
              filter: "inbox",
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
              categoriesLoaded: false,
              categories: {
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
              },
            },
          },
        };
      }
    }
    case "UPDATE_WORKSPACE_POST_FILTER_SORT": {
      let key = action.data.topic_id;
      if (action.data.isSharedSlug) {
        key = `${action.data.topic_id}-${action.data.slug}`;
      }
      return {
        ...state,
        workspacePosts: {
          ...state.workspacePosts,
          ...(state.workspacePosts[key] && {
            [key]: {
              ...state.workspacePosts[key],
              filter: action.data.filter,
              tag: action.data.tag,
              postListTag: action.data.postListTag,
            },
          }),
        },
      };
    }
    case "JOIN_WORKSPACE_REDUCER": {
      let updatedSearch = { ...state.search };
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
        workspaces: Object.values(state.workspaces).reduce((acc, ws) => {
          if (action.data.data.workspace_data.topic && action.data.data.workspace_data.topic.id === ws.id) {
            acc[ws.sharedSlug ? ws.key : ws.id] = { ...ws, members: [...ws.members, ...action.data.users], member_ids: [...ws.member_ids, ...action.data.users.map((u) => u.id)] };
          } else {
            acc[ws.sharedSlug ? ws.key : ws.id] = ws;
          }
          return acc;
        }, {}),
        activeTopic:
          state.activeTopic && action.data.data.workspace_data.topic && action.data.data.workspace_data.topic.id === state.activeTopic.id
            ? {
                ...state.activeTopic,
                members: [...state.activeTopic.members, ...action.data.users],
                member_ids: [...state.activeTopic.member_ids, ...action.data.users.map((u) => u.id)],
              }
            : state.activeTopic,
        search: updatedSearch,
      };
    }
    case "GET_DRAFTS_SUCCESS": {
      return {
        ...state,
        drafts: action.data
          .filter((d) => d.data.type === "draft_post")
          .map((d) => {
            return Object.assign({}, d, {
              ...d.data,
              draft_id: d.id,
              post_id: d.data.id,
              updated_at: d.data.created_at,
              is_unread: 0,
              unread_count: 0,
              is_close: false,
              post_approval_label: null,
            });
          }),
      };
    }
    case "SAVE_DRAFT_SUCCESS": {
      if (action.data.data.draft_type === "draft_post" && action.data.data.topic_id) {
        const draft = {
          ...action.data,
          ...action.data.data,
          id: action.data.data.id,
          post_id: action.data.data.id,
          draft_id: action.data.id,
          is_unread: 0,
          unread_count: 0,
          is_close: false,
          post_approval_label: null,
        };
        return {
          ...state,
          drafts: [...state.drafts, draft],
          workspacePosts: {
            ...state.workspacePosts,
            ...(action.data.data.form.selectedAddressTo &&
              state.workspacePosts[action.data.data.form.selectedAddressTo[0].key] && {
                [action.data.data.form.selectedAddressTo[0].key]: {
                  ...state.workspacePosts[action.data.data.form.selectedAddressTo[0].key],
                  posts: {
                    ...state.workspacePosts[action.data.data.form.selectedAddressTo[0].key].posts,
                    [draft.id]: draft,
                  },
                },
              }),
          },
        };
      } else {
        return state;
      }
    }
    case "UPDATE_DRAFT_SUCCESS": {
      if (action.data.data.draft_type === "draft_post" && action.data.data.topic_id && state.workspacePosts[action.data.data.form.selectedAddressTo[0].key]) {
        const workspacePosts = { ...state.workspacePosts };
        workspacePosts[action.data.data.form.selectedAddressTo[0].key].posts[action.data.data.id] = {
          ...workspacePosts[action.data.data.form.selectedAddressTo[0].key].posts[action.data.data.post_id],
          ...action.data.data,
          id: action.data.data.post_id,
          post_id: action.data.data.post_id,
          draft_id: action.data.id,
          is_unread: 0,
          unread_count: 0,
          is_close: false,
          post_approval_label: null,
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
      if (action.data.draft_type === "draft_post" && action.data.topic_id && state.workspacePosts[action.data.topic_id]) {
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
    case "FETCH_COMMENTS_SUCCESS": {
      let postComments = { ...state.postComments };
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
      let key = action.isSharedSlug ? action.data.post_code : action.data.post_id;
      postComments[key] = {
        ...(typeof postComments[key] !== "undefined" && postComments[key]),
        skip: action.data.next_skip,
        hasMore: action.data.messages.length === 20,
        comments: { ...comments, ...(typeof postComments[key] !== "undefined" && postComments[key].comments) },
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
            replies: convertArrayToObject(c.replies, "id"),
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
      let key = action.data.post_code ? action.data.post_code : action.data.post_id;
      return {
        ...state,
        postComments: {
          ...state.postComments,
          [key]: {
            ...state.postComments[key],
            ...(action.data.parent_id
              ? {
                  comments: {
                    ...state.postComments[key].comments,
                    [action.data.parent_id]: {
                      ...state.postComments[key].comments[action.data.parent_id],
                      replies: {
                        ...state.postComments[key].comments[action.data.parent_id].replies,
                        [action.data.id]: {
                          ...state.postComments[key].comments[action.data.parent_id].replies[action.data.id],
                          claps: [...state.postComments[key].comments[action.data.parent_id].replies[action.data.id].claps, { user_id: state.user.id }],
                          clap_count: state.postComments[key].comments[action.data.parent_id].replies[action.data.id].clap_count + 1,
                          user_clap_count: 1,
                        },
                      },
                    },
                  },
                }
              : {
                  ...(state.postComments[key] && {
                    comments: {
                      ...state.postComments[key].comments,
                      [action.data.id]: {
                        ...state.postComments[key].comments[action.data.id],
                        claps: [...state.postComments[key].comments[action.data.id].claps, { user_id: state.user.id }],
                        clap_count: state.postComments[key].comments[action.data.id].clap_count + 1,
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
      let key = action.data.post_code ? action.data.post_code : action.data.post_id;
      return {
        ...state,
        postComments: {
          ...state.postComments,
          [key]: {
            ...state.postComments[key],
            ...(action.data.parent_id && state.postComments[key]
              ? {
                  comments: {
                    ...state.postComments[key].comments,
                    [action.data.parent_id]: {
                      ...state.postComments[key].comments[action.data.parent_id],
                      replies: {
                        ...state.postComments[key].comments[action.data.parent_id].replies,
                        [action.data.id]: {
                          ...state.postComments[key].comments[action.data.parent_id].replies[action.data.id],
                          claps: state.postComments[key].comments[action.data.parent_id].replies[action.data.id].claps.filter((c) => c.user_id !== state.user.id),
                          clap_count: state.postComments[key].comments[action.data.parent_id].replies[action.data.id].clap_count - 1,
                          user_clap_count: 0,
                        },
                      },
                    },
                  },
                }
              : {
                  ...(state.postComments[key] && {
                    comments: {
                      ...state.postComments[key].comments,
                      [action.data.id]: {
                        ...state.postComments[key].comments[action.data.id],
                        claps: state.postComments[key].comments[action.data.id].claps.filter((c) => c.user_id !== state.user.id),
                        clap_count: state.postComments[key].comments[action.data.id].clap_count - 1,
                        user_clap_count: 0,
                      },
                    },
                  }),
                }),
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
        workspacePosts: {
          ...state.workspacePosts,
          ...Object.keys(state.workspacePosts)
            .filter((wsId) => state.workspacePosts[wsId].posts && state.workspacePosts[wsId].posts.hasOwnProperty(key))
            .map((wsId) => {
              return {
                [wsId]: {
                  ...state.workspacePosts[wsId],
                  posts: {
                    ...state.workspacePosts[wsId].posts,
                    [key]: {
                      ...state.workspacePosts[wsId].posts[key],
                      claps: [...state.workspacePosts[wsId].posts[key].claps, { user_id: state.user.id }],
                      clap_count: state.workspacePosts[wsId].posts[key].clap_count + 1,
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
      let key = action.data.post_id;
      if (action.data.post_code) {
        key = action.data.post_code;
      }
      return {
        ...state,
        workspacePosts: {
          ...state.workspacePosts,
          ...Object.keys(state.workspacePosts)
            .filter((wsId) => state.workspacePosts[wsId].posts && state.workspacePosts[wsId].posts.hasOwnProperty(key))
            .map((wsId) => {
              return {
                [wsId]: {
                  ...state.workspacePosts[wsId],
                  posts: {
                    ...state.workspacePosts[wsId].posts,
                    [key]: {
                      ...state.workspacePosts[wsId].posts[key],
                      claps: state.workspacePosts[wsId].posts[key].claps.filter((c) => c.user_id !== state.user.id),
                      clap_count: state.workspacePosts[wsId].posts[key].clap_count - 1,
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
    case "ADD_COMMENT": {
      let key = action.data.post_id;
      if (action.data.post_code) {
        key = action.data.post_code;
      }
      let postComment = { ...state.postComments[key] };
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
          [key]: postComment,
        },
      };
    }
    case "STAR_POST_REDUCER": {
      if (!action.data.topic_id) return { ...state };
      let postKey = action.data.post_id;
      if (action.data.post_code) {
        postKey = action.data.post_code;
      }
      return {
        ...state,
        workspacePosts: {
          [action.data.topic_id]: {
            ...state.workspacePosts[action.data.topic_id],
            posts: {
              ...state.workspacePosts[action.data.topic_id].posts,
              [postKey]: {
                ...state.workspacePosts[action.data.topic_id].posts[postKey],
                is_favourite: !state.workspacePosts[action.data.topic_id].posts[postKey].is_favourite,
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
              .filter((wsId) => state.workspacePosts[wsId].posts && Object.values(state.workspacePosts[wsId].posts).some((p) => p.id === action.data.type_id))
              .map((wsId) => {
                return {
                  [wsId]: {
                    ...state.workspacePosts[wsId],
                    posts: Object.keys(state.workspacePosts[wsId].posts).reduce((posts, key) => {
                      if (state.workspacePosts[wsId].posts[key].id === action.data.type_id) {
                        posts[key] = {
                          ...state.workspacePosts[wsId].posts[key],
                          is_favourite: action.data.is_favourite,
                        };
                      } else {
                        posts[key] = state.workspacePosts[wsId].posts[key];
                      }
                      return posts;
                    }, {}),
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
    case "INCOMING_MARK_AS_READ": {
      return {
        ...state,
        ...Object.keys(state.workspacePosts)
          .filter((wsId) => state.workspacePosts[wsId].posts && Object.values(state.workspacePosts[wsId].posts).some((p) => p.id === action.data.result.post_id))
          .map((wsId) => ({
            ...state.workspacePosts[wsId],
            posts: Object.keys(state.workspacePosts[wsId].posts).reduce((posts, key) => {
              if (state.workspacePosts[wsId].posts[key].id === action.data.result.post_id) {
                posts[key] = {
                  ...state.workspacePosts[wsId].posts[key],
                  user_reads: action.data.result.user_reads,
                };
              } else {
                posts[key] = state.workspacePosts[wsId].posts[key];
              }
              return posts;
            }, {}),
          }))
          .reduce((obj, workspace) => {
            return { ...obj, ...workspace };
          }, {}),
      };
    }
    case "INCOMING_WORKSPACE_POST":
    case "INCOMING_POST": {
      let postKey = action.data.id;
      if (action.data.sharedSlug && action.data.code) {
        postKey = action.data.code;
      }
      return {
        ...state,
        workspacePosts: {
          ...Object.keys(state.workspacePosts)
            .filter((wsId) => state.workspacePosts[wsId])
            .map((wsId) => {
              if (action.data.sharedSlug && wsId === `${action.data.recipient_ids[0]}-${action.data.slug}`) {
                return {
                  [wsId]: {
                    ...state.workspacePosts[wsId],
                    posts: {
                      ...state.workspacePosts[wsId].posts,
                      [postKey]: action.data,
                    },
                    count: state.workspacePosts[wsId].count
                      ? {
                          ...state.workspacePosts[wsId].count,
                          is_must_read: state.workspacePosts[wsId].count.is_must_read + 1,
                          is_must_reply: state.workspacePosts[wsId].count.is_must_reply + 1,
                          is_read_only: state.workspacePosts[wsId].count.is_read_only + 1,
                        }
                      : null,
                  },
                };
              } else {
                if (action.data.workspaces.some((ws) => ws.topic_id == wsId)) {
                  return {
                    [wsId]: {
                      ...state.workspacePosts[wsId],
                      posts: {
                        ...state.workspacePosts[wsId].posts,
                        [postKey]: action.data,
                      },
                      count: state.workspacePosts[wsId].count
                        ? {
                            ...state.workspacePosts[wsId].count,
                            is_must_read: state.workspacePosts[wsId].count.is_must_read + 1,
                            is_must_reply: state.workspacePosts[wsId].count.is_must_reply + 1,
                            is_read_only: state.workspacePosts[wsId].count.is_read_only + 1,
                          }
                        : null,
                    },
                  };
                }
              }
            })
            .reduce((obj, workspace) => {
              return { ...obj, ...workspace };
            }, {}),
        },
      };
    }
    case "INCOMING_TO_DO":
    case "INCOMING_UPDATE_TO_DO":
    case "INCOMING_DONE_TO_DO":
    case "INCOMING_REMOVE_TO_DO": {
      let newWorkspacePosts = { ...state.workspacePosts };
      let postComments = { ...state.postComments };
      let postKey = null;
      let topicKey = null;
      if (action.data.link_type === "POST" && action.data.data) {
        if (action.data.sharedSlug) {
          postKey = action.data.data.post.post_code;
        }
        action.data.data.workspaces.forEach((w) => {
          topicKey = w.topic.id;
          if (action.data.sharedSlug) {
            topicKey = `${w.topic.id}-${action.data.slug}`;
          }
          if (typeof newWorkspacePosts[topicKey] !== "undefined" && typeof newWorkspacePosts[topicKey].posts[postKey] !== "undefined") {
            newWorkspacePosts[topicKey].posts[postKey] = {
              ...newWorkspacePosts[topicKey].posts[postKey],
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

      if (action.data.link_type === "POST_COMMENT" && action.data.data) {
        postKey = action.data.data.post.id;
        if (action.data.sharedSlug) {
          postKey = action.data.data.post.post_code;
        }
        if (typeof postComments[postKey] !== "undefined" && typeof postComments[postKey].comments[action.data.data.comment.id] !== "undefined") {
          postComments[postKey] = {
            ...postComments[postKey],
            comments: {
              ...postComments[postKey].comments,
              [action.data.data.comment.id]: {
                ...postComments[postKey].comments[action.data.data.comment.id],
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
      }

      return {
        ...state,
        postComments: postComments,
        workspacePosts: newWorkspacePosts,
      };
    }
    case "INCOMING_UPDATED_POST": {
      let newWorkspacePosts = { ...state.workspacePosts };
      let postKey = action.data.id;
      if (action.data.sharedSlug && action.data.code) {
        postKey = action.data.code;
      }
      action.data.recipient_ids.forEach((id) => {
        let key = id;
        if (action.data.slug !== getSlug()) {
          key = `${id}-${action.data.slug}`;
        }
        if (newWorkspacePosts.hasOwnProperty(key)) {
          if (action.data.is_personal && !action.data.post_participant_data.all_participant_ids.some((id) => id === state.user.id)) {
            delete newWorkspacePosts[key].posts[postKey];
          } else {
            if (newWorkspacePosts[key].posts.hasOwnProperty(postKey)) {
              newWorkspacePosts[key].posts[postKey] = { ...action.data, claps: newWorkspacePosts[key].posts[postKey].claps };
            } else {
              newWorkspacePosts[key].posts[postKey] = { ...action.data, claps: [] };
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
      return {
        ...state,
        workspacePosts: {
          ...state.workspacePosts,
          ...action.data.recipient_ids.reduce((res, rid) => {
            let key = rid;
            if (action.data.slug !== getSlug()) {
              key = `${rid}-${action.data.slug}`;
            }
            if (state.workspacePosts[key]) {
              res[key] = {
                ...state.workspacePosts[key],
                ...(state.workspacePosts[key].posts && {
                  posts: {
                    ...Object.values(state.workspacePosts[key].posts)
                      .filter((p) => p.id !== action.data.post_id)
                      .reduce((posts, post) => {
                        posts[action.data.sharedSlug ? post.code : post.id] = post;
                        return posts;
                      }, {}),
                  },
                }),
              };
            }
            return res;
          }, {}),
        },
      };
    }
    case "INCOMING_COMMENT": {
      const isNewComment = action.data.SOCKET_TYPE === "POST_COMMENT_CREATE";
      const hasPendingAproval = action.data.users_approval.length > 0 && action.data.users_approval.filter((u) => u.ip_address === null).length === action.data.users_approval.length;
      const allUsersDisagreed = action.data.users_approval.length > 0 && action.data.users_approval.filter((u) => u.ip_address !== null && !u.is_approved).length === action.data.users_approval.length;
      const allUsersAgreed = action.data.users_approval.length > 0 && action.data.users_approval.filter((u) => u.ip_address !== null && u.is_approved).length === action.data.users_approval.length;
      const isApprover = action.data.users_approval.some((ua) => ua.id === state.user.id);
      let postKey = action.data.post_id;
      if (action.data.sharedSlug) {
        postKey = action.data.post_code;
      }
      return {
        ...state,
        postComments: {
          ...state.postComments,
          ...(state.postComments[postKey] && {
            [postKey]: {
              ...state.postComments[postKey],
              comments: {
                ...Object.keys(state.postComments[postKey].comments).reduce((res, key) => {
                  if (action.data.parent_id) {
                    res[key] = {
                      ...state.postComments[postKey].comments[key],
                      replies: {
                        ...Object.keys(state.postComments[postKey].comments[key].replies).reduce((rep, k) => {
                          if (action.data.reference_id && k === action.data.reference_id) {
                            rep[action.data.id] = {
                              ...action.data,
                              claps: state.postComments[postKey].comments[key].replies[action.data.reference_id].claps,
                            };
                          } else {
                            if (parseInt(k) === action.data.id) {
                              rep[k] = { ...state.postComments[postKey].comments[key].replies[k], body: action.data.body, updated_at: action.data.updated_at, quote: action.data.quote };
                            } else {
                              rep[k] = state.postComments[postKey].comments[key].replies[k];
                            }
                          }
                          return rep;
                        }, {}),
                      },
                    };
                  } else {
                    if (action.data.reference_id && key === action.data.reference_id) {
                      res[action.data.id] = action.data;
                    } else {
                      if (parseInt(key) === action.data.id) {
                        res[key] = { ...state.postComments[postKey].comments[key], body: action.data.body, updated_at: action.data.updated_at, quote: action.data.quote };
                      } else {
                        res[key] = state.postComments[postKey].comments[key];
                      }
                    }
                  }
                  return res;
                }, {}),
                ...(state.user.id !== action.data.author.id &&
                  isNewComment && {
                    //new comment from other user
                    ...(action.data.parent_id &&
                      state.postComments[postKey].comments[action.data.parent_id] && {
                        [action.data.parent_id]: {
                          ...state.postComments[postKey].comments[action.data.parent_id],
                          replies: {
                            ...state.postComments[postKey].comments[action.data.parent_id].replies,
                            [action.data.id]: action.data,
                          },
                        },
                      }),
                    ...(!action.data.parent_id && {
                      [action.data.id]: action.data,
                    }),
                  }),
                ...(!action.data.hasOwnProperty("reference_id") && {
                  ...(action.data.parent_id &&
                    state.postComments[postKey].comments[action.data.parent_id] && {
                      [action.data.parent_id]: {
                        ...state.postComments[postKey].comments[action.data.parent_id],
                        replies: {
                          ...state.postComments[postKey].comments[action.data.parent_id].replies,
                          [action.data.id]: action.data,
                        },
                      },
                    }),
                  ...(!action.data.parent_id && {
                    [action.data.id]: action.data,
                  }),
                }),
              },
            },
          }),
        },
        workspacePosts: {
          ...state.workspacePosts,
          ...action.data.workspaces.reduce((res, ws) => {
            let key = ws.topic_id;
            if (action.data.sharedSlug) {
              key = `${ws.topic_id}-${action.data.slug}`;
            }
            if (state.workspacePosts[key]) {
              res[key] = {
                ...state.workspacePosts[key],
                posts: {
                  ...state.workspacePosts[key].posts,
                  ...(state.workspacePosts[key].posts[postKey] && {
                    [postKey]: {
                      ...state.workspacePosts[key].posts[postKey],
                      post_approval_label: allUsersAgreed
                        ? "ACCEPTED"
                        : allUsersDisagreed
                        ? "REQUEST_UPDATE"
                        : isApprover && hasPendingAproval
                        ? "NEED_ACTION"
                        : state.workspacePosts[key].posts[postKey].author.id === action.data.author.id && hasPendingAproval
                        ? "REQUEST_APPROVAL"
                        : state.workspacePosts[key].posts[postKey].post_approval_label,
                      reply_count: isNewComment ? state.workspacePosts[key].posts[postKey].reply_count + 1 : state.workspacePosts[key].posts[postKey].reply_count,
                      updated_at: isNewComment ? action.data.updated_at : state.workspacePosts[key].posts[postKey].updated_at,
                      has_replied: isNewComment && action.data.author.id === state.user.id ? true : state.workspacePosts[key].posts[postKey].has_replied,
                      unread_count: isNewComment && action.data.author.id !== state.user.id ? state.workspacePosts[key].posts[postKey].unread_count + 1 : state.workspacePosts[key].posts[postKey].unread_count,
                      is_unread: isNewComment && action.data.author.id !== state.user.id ? 1 : state.workspacePosts[key].posts[postKey].is_unread,
                    },
                  }),
                },
              };
            }
            return res;
          }, {}),
        },
      };
    }
    case "INCOMING_POST_CLAP": {
      const channelIds = Object.keys(state.workspacePosts);
      let postKey = action.data.sharedSlug && action.data.post_code ? action.data.post_code : action.data.post_id;
      return {
        ...state,
        ...(channelIds.length && {
          workspacePosts: {
            ...state.workspacePosts,
            ...channelIds.reduce((ws, channelId) => {
              ws = {
                ...ws,
                [channelId]:
                  typeof state.workspacePosts[channelId].posts === "undefined" || typeof state.workspacePosts[channelId].posts[postKey] === "undefined"
                    ? state.workspacePosts[channelId]
                    : {
                        ...state.workspacePosts[channelId],
                        posts: {
                          ...state.workspacePosts[channelId].posts,
                          [postKey]: {
                            ...state.workspacePosts[channelId].posts[postKey],
                            ...(action.data.clap_count === 1
                              ? {
                                  clap_count: state.workspacePosts[channelId].posts[postKey].clap_count + 1,
                                  claps: [...state.workspacePosts[channelId].posts[postKey].claps.filter((c) => c.user_id !== action.data.author.id), { user_id: action.data.author.id }],
                                  user_clap_count: action.data.author.id === state.user.id ? 1 : state.workspacePosts[channelId].posts[postKey].user_clap_count,
                                }
                              : {
                                  clap_count: state.workspacePosts[channelId].posts[postKey].clap_count - 1,
                                  claps: state.workspacePosts[channelId].posts[postKey].claps.filter((c) => c.user_id !== action.data.author.id),
                                  user_clap_count: action.data.author.id === state.user.id ? 0 : state.workspacePosts[channelId].posts[postKey].user_clap_count,
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
      let postKey = action.data.sharedSlug && action.data.post_code ? action.data.post_code : action.data.post_id;
      return {
        ...state,
        ...(typeof state.postComments[postKey] !== "undefined" &&
          (action.data.parent_message_id
            ? typeof state.postComments[postKey].comments[action.data.parent_message_id] !== "undefined" && typeof state.postComments[postKey].comments[action.data.parent_message_id].replies[action.data.message_id] !== "undefined"
            : typeof state.postComments[postKey].comments[action.data.message_id] !== "undefined") && {
            postComments: {
              ...state.postComments,
              [postKey]: {
                ...state.postComments[postKey],
                ...(action.data.parent_message_id
                  ? {
                      comments: {
                        ...state.postComments[postKey].comments,
                        [action.data.parent_message_id]: {
                          ...state.postComments[postKey].comments[action.data.parent_message_id],
                          replies: {
                            ...state.postComments[postKey].comments[action.data.parent_message_id].replies,
                            [action.data.message_id]: {
                              ...state.postComments[postKey].comments[action.data.parent_message_id].replies[action.data.message_id],
                              user_clap_count: action.data.clap_count,
                              clap_count: state.postComments[postKey].comments[action.data.parent_message_id].replies[action.data.message_id].clap_count + (action.data.clap_count === 1 ? 1 : -1),
                              claps:
                                action.data.clap_count === 1
                                  ? [...state.postComments[postKey].comments[action.data.parent_message_id].replies[action.data.message_id].claps, { user_id: action.data.author.id }]
                                  : state.postComments[postKey].comments[action.data.parent_message_id].replies[action.data.message_id].claps.filter((c) => c.user_id !== action.data.author.id),
                            },
                          },
                        },
                      },
                    }
                  : {
                      comments: {
                        ...state.postComments[postKey].comments,
                        [action.data.message_id]: {
                          ...state.postComments[postKey].comments[action.data.message_id],
                          user_clap_count: action.data.clap_count,
                          clap_count: state.postComments[postKey].comments[action.data.message_id].clap_count + (action.data.clap_count === 1 ? 1 : -1),
                          claps:
                            action.data.clap_count === 1
                              ? [...state.postComments[postKey].comments[action.data.message_id].claps, { user_id: action.data.author.id }]
                              : state.postComments[postKey].comments[action.data.message_id].claps.filter((c) => c.user_id !== action.data.author.id),
                        },
                      },
                    }),
              },
            },
          }),
      };
    }
    case "FETCH_WORKSPACE_MEMBERS_SUCCESS": {
      let newWorkspaces = { ...state.workspaces };
      if (action.slug !== getSlug()) {
        newWorkspaces[`${action.data.id}-${action.slug}`].members = action.data.members;
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
      let key = action.data.topic_id;
      if (action.slug !== getSlug()) {
        key = `${action.data.id}-${action.slug}`;
      }
      return {
        ...state,
        workspacePosts: {
          ...state.workspacePosts,
          [key]: {
            ...state.workspacePosts[key],
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
            .filter((wsId) => state.workspacePosts[wsId].posts && Object.values(state.workspacePosts[wsId].posts).some((p) => p.id === action.data.post_id))
            .map((wsId) => {
              return {
                [wsId]: {
                  ...state.workspacePosts[wsId],
                  posts: Object.keys(state.workspacePosts[wsId].posts).reduce((posts, key) => {
                    if (state.workspacePosts[wsId].posts[key].id === action.data.post_id) {
                      posts[key] = {
                        ...state.workspacePosts[wsId].posts[key],
                        ...(state.workspacePosts[wsId].posts[key].view_user_ids && {
                          view_user_ids: [...state.workspacePosts[wsId].posts[key].view_user_ids, action.data.viewer.id],
                        }),
                      };
                    } else {
                      posts[key] = state.workspacePosts[wsId].posts[key];
                    }
                    return posts;
                  }, {}),
                },
              };
            })
            .reduce((obj, workspace) => {
              return { ...obj, ...workspace };
            }, {}),
        },
      };
    }
    case "ARCHIVE_POST_REDUCER": {
      return {
        ...state,
        workspacePosts: {
          ...state.workspacePosts,
          ...(Object.keys(state.workspacePosts).length > 0 && {
            ...Object.keys(state.workspacePosts).reduce((res, id) => {
              res[id] = {
                ...state.workspacePosts[id],
                posts: {
                  ...state.workspacePosts[id].posts,
                  ...(Object.values(state.workspacePosts[id].posts).length > 0 && {
                    ...Object.values(state.workspacePosts[id].posts).reduce((pos, p) => {
                      pos[action.data.post_code ? p.code : p.id] = {
                        ...p,
                        is_archived: p.id === action.data.post_id ? action.data.is_archived : p.is_archived,
                      };
                      return pos;
                    }, {}),
                  }),
                },
              };
              return res;
            }, {}),
          }),
        },
      };
    }
    case "ARCHIVE_REDUCER": {
      let workspaces = { ...state.workspaces };
      let updatedFolders = { ...state.folders };
      let updatedSearch = { ...state.search };
      let key = action.data.topic_detail.id;
      if (action.data.sharedSlug) {
        key = `${action.data.topic_detail.id}-${action.slug}`;
      }
      if (workspaces[key]) {
        workspaces[key].active = 0;
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
              topic: {
                ...item.topic,
                is_archive: true,
              },
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
      let key = action.data.topic_detail.id;
      if (action.data.sharedSlug) {
        key = `${action.data.topic_detail.id}-${action.slug}`;
      }
      if (workspaces[key]) {
        workspaces[key].active = 1;
      }

      if (updatedSearch.results.length) {
        updatedSearch.results = updatedSearch.results.map((item) => {
          if (item.topic.id === action.data.topic_detail.id) {
            return {
              ...item,
              topic: {
                ...item.topic,
                is_archive: false,
              },
            };
          } else {
            return item;
          }
        });
      }
      return {
        ...state,
        search: updatedSearch,
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
      let postKey = action.data.post_code ? action.data.post_code : action.data.post_id;
      return {
        ...state,
        workspacePosts: {
          ...state.workspacePosts,
          ...Object.keys(state.workspacePosts)
            .filter((wsId) => state.workspacePosts[wsId].posts && state.workspacePosts[wsId].posts.hasOwnProperty(postKey))
            .map((wsId) => {
              return {
                [wsId]: {
                  ...state.workspacePosts[wsId],
                  posts: {
                    ...state.workspacePosts[wsId].posts,
                    [postKey]: {
                      ...state.workspacePosts[wsId].posts[postKey],
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
      };
    }
    case "INCOMING_READ_UNREAD_REDUCER": {
      return {
        ...state,
        workspacePosts: {
          ...state.workspacePosts,
          ...Object.keys(state.workspacePosts)
            .filter((wsId) => state.workspacePosts[wsId].posts && Object.values(state.workspacePosts[wsId].posts).some((p) => p.id === action.data.post_id))
            .map((wsId) => {
              return {
                [wsId]: {
                  ...state.workspacePosts[wsId],
                  posts: Object.keys(state.workspacePosts[wsId].posts).reduce((posts, key) => {
                    if (state.workspacePosts[wsId].posts[key].id === action.data.post_id) {
                      posts[key] = {
                        ...state.workspacePosts[wsId].posts[key],
                        is_unread: action.data.unread,
                        unread_count: action.data.unread === 0 ? 0 : state.workspacePosts[wsId].posts[key].unread_count,
                      };
                    } else {
                      posts[key] = state.workspacePosts[wsId].posts[key];
                    }
                    return posts;
                  }, {}),
                },
              };
            })
            .reduce((obj, workspace) => {
              return { ...obj, ...workspace };
            }, {}),
        },
      };
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
      let postKey = action.data.post_code ? action.data.post_code : action.data.post_id;
      let newPostComments = { ...state.postComments };
      if (newPostComments.hasOwnProperty(postKey)) {
        if (action.data.parent_id) {
          delete newPostComments[postKey].comments[action.data.parent_id].replies[action.data.message_id];
        } else {
          delete newPostComments[postKey].comments[action.data.message_id];
        }
      }
      return {
        ...state,
        postComments: newPostComments,
      };
    }
    case "INCOMING_CHAT_MESSAGE": {
      let updatedTopic = state.activeTopic ? { ...state.activeTopic } : null;
      let key = action.data.workspace_id;
      if (action.data.slug && action.data.slug !== getSlug()) {
        key = `${action.data.workspace_id}-${action.data.slug}`;
      }
      if (!action.data.is_read) {
        let updatedWorkspaces = { ...state.workspaces };
        if (Object.keys(updatedWorkspaces).length > 0) {
          if (updatedWorkspaces.hasOwnProperty(key)) {
            if (state.activeTopic && state.activeTopic.id === action.data.workspace_id && action.data.is_active) {
              if (state.activeTopic.team_channel && state.activeTopic.team_channel.id === action.data.channel_id) {
                updatedTopic.team_unread_chats = updatedTopic.team_unread_chats + 1;
                updatedWorkspaces[key].team_unread_chats = updatedWorkspaces[key].team_unread_chats + 1;
              } else {
                updatedTopic.unread_chats = updatedTopic.unread_chats + 1;
                updatedWorkspaces[key].unread_chats = updatedWorkspaces[key].unread_chats + 1;
              }
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
          if (updatedWorkspaces.hasOwnProperty(key)) {
            if (state.activeTopic && state.activeTopic.id === action.data.workspace_id && action.data.is_active) {
              if (state.activeTopic.team_channel && state.activeTopic.team_channel.id === action.data.channel_id) {
                updatedTopic.team_unread_chats = 0;
                updatedWorkspaces[key].team_unread_chats = 0;
              } else {
                updatedWorkspaces[key].unread_chats = 0;
                updatedTopic.unread_chats = 0;
              }
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
      return {
        ...state,
        workspaces: {
          ...Object.values(state.workspaces)
            .map((ws) => {
              if (ws.id === action.data.id) {
                return {
                  ...ws,
                  team_unread_chats: action.data.channel_id === ws.team_channel.id ? 0 : ws.team_unread_chats,
                  unread_chats: action.data.channel_id === ws.channel.id ? 0 : ws.unread_chats,
                };
              } else {
                return ws;
              }
            })
            .reduce((workspaces, workspace) => {
              workspaces[workspace.sharedSlug ? `${workspace.id}-${workspace.slug}` : workspace.id] = workspace;
              return workspaces;
            }, {}),
        },
        activeTopic:
          state.activeTopic && state.activeTopic.id === action.data.id
            ? {
                ...state.activeTopic,
                team_unread_chats: action.data.channel_id === state.activeTopic.team_channel.id ? 0 : state.activeTopic.team_unread_chats,
                unread_chats: action.data.channel_id === state.activeTopic.channel.id ? 0 : state.activeTopic.unread_chats,
              }
            : state.activeTopic,
      };
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
      let key = action.data.topic_id;
      if (action.data.slug && action.data.slug !== getSlug()) {
        key = `${action.data.topic_id}-${action.data.slug}`;
      }
      if (updatedWorkspaces.hasOwnProperty(key)) {
        updatedWorkspaces[key].members = updatedWorkspaces[key].members.map((m) => {
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
          let key = ws.id;
          if (ws.sharedSlug) {
            key = `${ws.id}-${ws.slug}`;
          }
          if (ws.folder_id && ws.folder_id === action.data.id) {
            updatedWorkspaces[key].folder_id = null;
            updatedWorkspaces[key].folder_name = null;
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
      let key = action.data.current_topic.id;
      if (action.data.sharedSlug) {
        key = `${action.data.current_topic.id}-${action.data.slug}`;
      }
      if (updatedWorkspaces.hasOwnProperty(key)) {
        updatedWorkspaces[key].members = updatedWorkspaces[key].members.map((m) => {
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
    case "GET_POST_DETAIL_SUCCESS": {
      let newWorkspacePosts = { ...state.workspacePosts };
      let post = { ...action.data, claps: [], last_visited_at: { timestamp: null } };
      action.data.workspaces.forEach((ws) => {
        let key = ws.topic_id;
        let postKey = post.id;
        if (action.slug !== getSlug()) {
          key = `${ws.topic_id}-${action.slug}`;
          postKey = post.code;
        }
        if (newWorkspacePosts.hasOwnProperty(key)) {
          if (newWorkspacePosts[key].posts[postKey]) {
            newWorkspacePosts[key].posts[postKey] = { ...post, claps: newWorkspacePosts[key].posts[postKey].claps, last_visited_at: newWorkspacePosts[key].posts[postKey].last_visited_at };
          } else newWorkspacePosts[key].posts[postKey] = post;
        } else {
          newWorkspacePosts[key] = {
            filters: {},
            filter: "all",
            sort: "recent",
            tag: null,
            search: "",
            searchResults: [],
            count: null,
            posts: {
              [postKey]: post,
            },
            post_ids: [postKey],
            categoriesLoaded: false,
            categories: {
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
            },
          };
        }
      });
      return {
        ...state,
        workspacePosts: newWorkspacePosts,
      };
    }
    case "UPDATE_POST_FILES": {
      let postKey = action.data.post_code ? action.data.post_code : action.data.post_id;
      return {
        ...state,
        workspacePosts: {
          ...state.workspacePosts,
          ...(action.data.topic_id && {
            [action.data.topic_id]: {
              ...state.workspacePosts[action.data.topic_id],
              posts: {
                ...state.workspacePosts[action.data.topic_id].posts,
                [postKey]: {
                  ...state.workspacePosts[action.data.topic_id].posts[postKey],
                  files: state.workspacePosts[action.data.topic_id].posts[postKey].files.map((f) => {
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
      let postKey = action.data.post_code ? action.data.post_code : action.data.post_id;
      return {
        ...state,
        postComments: {
          ...state.postComments,
          ...(postKey && {
            [postKey]: {
              ...state.postComments[postKey],
              comments: {
                ...state.postComments[postKey].comments,
                ...(action.data.parent_id && {
                  [action.data.parent_id]: {
                    ...state.postComments[postKey].comments[action.data.parent_id],
                    replies: {
                      ...state.postComments[postKey].comments[action.data.parent_id].replies,
                      [action.data.id]: {
                        ...state.postComments[postKey].comments[action.data.parent_id].replies[action.data.id],
                        files: state.postComments[postKey].comments[action.data.parent_id].replies[action.data.id].files.map((f) => {
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
                    ...state.postComments[postKey].comments[action.data.id],
                    files: state.postComments[postKey].comments[action.data.id].files.map((f) => {
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
      let postKey = action.data.sharedSlug && action.data.post.post_code ? action.data.post.post_code : action.data.post.id;
      return {
        ...state,
        ...(state.postComments[postKey] && {
          postComments: {
            ...state.postComments,
            [postKey]: {
              ...state.postComments[postKey],
              comments: {
                ...state.postComments[postKey].comments,
                ...(state.postComments[postKey].comments[action.data.comment.id] && {
                  [action.data.comment.id]: {
                    ...state.postComments[postKey].comments[action.data.comment.id],
                    is_important: !state.postComments[postKey].comments[action.data.comment.id].is_important,
                  },
                }),
              },
            },
          },
        }),
      };
    }
    case "INCOMING_READ_SELECTED_POSTS": {
      let isSharedSlug = false;
      let key = action.data.topic_id;
      if (action.data.topic_id && action.data.sharedSlug) {
        key = `${action.data.topic_id}-${action.data.slug}`;
        isSharedSlug = true;
      }
      return {
        ...state,
        workspacePosts: {
          ...state.workspacePosts,
          ...(key && {
            [key]: {
              ...state.workspacePosts[key],
              posts: {
                ...state.workspacePosts[key].posts,
                ...action.data.post_ids.reduce((res, id) => {
                  if (isSharedSlug) {
                    let post = Object.values(state.workspacePosts[key].posts).find((p) => p.id === id);
                    if (post) {
                      res[post.code] = {
                        ...state.workspacePosts[key].posts[post.code],
                        is_read: true,
                        unread_count: 0,
                        is_unread: 0,
                      };
                    }
                  } else {
                    if (state.workspacePosts[key].posts[id]) {
                      res[id] = {
                        ...state.workspacePosts[key].posts[id],
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
          }),
        },
      };
    }
    case "INCOMING_ARCHIVED_SELECTED_POSTS": {
      let isSharedSlug = false;
      let key = action.data.topic_id;
      if (action.data.topic_id && action.data.sharedSlug) {
        key = `${action.data.topic_id}-${action.data.slug}`;
        isSharedSlug = true;
      }
      return {
        ...state,
        workspacePosts: {
          ...state.workspacePosts,
          ...(key && {
            [key]: {
              ...state.workspacePosts[key],
              posts: {
                ...state.workspacePosts[key].posts,
                ...action.data.post_ids.reduce((res, id) => {
                  if (isSharedSlug) {
                    let post = Object.values(state.workspacePosts[key].posts).find((p) => p.id === id);
                    if (post) {
                      res[post.code] = {
                        ...state.workspacePosts[key].posts[post.code],
                        is_archived: 1,
                        unread_count: 0,
                        is_unread: 0,
                      };
                    }
                  } else {
                    if (state.workspacePosts[key].posts[id]) {
                      res[id] = {
                        ...state.workspacePosts[key].posts[id],
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
          }),
        },
      };
    }
    case "UPDATE_WORKSPACE_POST_COUNT": {
      let key = action.data.topic_id;
      if (action.data.topic_id && action.data.sharedSlug) {
        key = `${action.data.topic_id}-${action.data.slug}`;
      }
      return {
        ...state,
        activeTopic: state.activeTopic && state.activeTopic.id === action.data.topic_id ? { ...state.activeTopic, unread_posts: action.data.count } : state.activeTopic,
        workspaces: {
          ...state.workspaces,
          ...(state.workspaces[key] && {
            [key]: {
              ...state.workspaces[key],
              unread_posts: action.data.count,
            },
          }),
        },
      };
    }
    case "POST_APPROVE_SUCCESS":
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
        workspacePosts: {
          ...state.workspacePosts,
          ...(action.data.workspaces.length > 0 && {
            ...state.workspacePosts,
            ...action.data.workspaces.reduce((res, ws) => {
              let key = ws.topic.id;
              if (action.data.sharedSlug || action.isSharedSlug) {
                if (action.data.sharedSlug) {
                  key = `${ws.topic.id}-${action.data.slug}`;
                } else {
                  key = `${ws.topic.id}-${action.slug}`;
                }
              }
              if (state.workspacePosts[key]) {
                res[key] = {
                  ...state.workspacePosts[key],
                  posts: {
                    ...state.workspacePosts[key].posts,
                    ...(state.workspacePosts[key].posts[postKey] && {
                      [postKey]: {
                        ...state.workspacePosts[key].posts[postKey],
                        post_approval_label: allUsersAgreed
                          ? "ACCEPTED"
                          : allUsersDisagreed
                          ? "REQUEST_UPDATE"
                          : allUsersAnswered && !allUsersDisagreed && !allUsersAgreed
                          ? "SPLIT"
                          : action.data.user_approved.id === state.user.id
                          ? null
                          : state.workspacePosts[key].posts[postKey].post_approval_label,
                        users_approval: state.workspacePosts[key].posts[postKey].users_approval.map((u) => {
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
                };
              }
              return res;
            }, {}),
          }),
        },
      };
    }
    case "INCOMING_COMMENT_APPROVAL": {
      let postKey = action.data.post.id;
      if (action.data.sharedSlug && action.data.post.post_code) {
        postKey = action.data.post.post_code;
      }
      const allUsersDisagreed = action.data.users_approval.filter((u) => u.ip_address !== null && !u.is_approved).length === action.data.users_approval.length;
      const allUsersAgreed = action.data.users_approval.filter((u) => u.ip_address !== null && u.is_approved).length === action.data.users_approval.length;
      const allUsersAnswered = !action.data.users_approval.some((ua) => ua.ip_address === null);
      return {
        ...state,
        postComments: {
          ...state.postComments,
          ...(state.postComments[postKey] && {
            [postKey]: {
              ...state.postComments[postKey],
              comments: {
                ...state.postComments[postKey].comments,
                ...(state.postComments[postKey].comments[action.data.comment.id] && {
                  [action.data.comment.id]: {
                    ...state.postComments[postKey].comments[action.data.comment.id],
                    users_approval:
                      state.postComments[postKey].comments[action.data.comment.id].users_approval.length > 1
                        ? state.postComments[postKey].comments[action.data.comment.id].users_approval.map((ua) => {
                            if (ua.id === action.data.user_approved.id) {
                              return {
                                ...ua,
                                ...action.data.user_approved,
                              };
                            } else {
                              return ua;
                            }
                          })
                        : [],
                    replies: {
                      ...state.postComments[postKey].comments[action.data.comment.id].replies,
                      ...(action.data.transferred_comment &&
                        state.postComments[postKey].comments[action.data.comment.id].replies[action.data.transferred_comment.id] && {
                          [action.data.transferred_comment.id]: {
                            ...state.postComments[postKey].comments[action.data.comment.id].replies[action.data.transferred_comment.id],
                            users_approval: [{ ...action.data.user_approved, created_at: action.data.created_at }],
                          },
                        }),
                    },
                  },
                }),
                ...(!state.postComments[postKey].comments.hasOwnProperty(action.data.comment.id) && {
                  ...Object.keys(state.postComments[postKey].comments).reduce((res, key) => {
                    res[key] = {
                      ...state.postComments[postKey].comments[key],
                      ...(state.postComments[postKey].comments[key].replies[action.data.comment.id] && {
                        replies: {
                          ...state.postComments[postKey].comments[key].replies,
                          [action.data.comment.id]: {
                            ...state.postComments[postKey].comments[key].replies[action.data.comment.id],
                            users_approval: [],
                          },
                          ...(action.data.transferred_comment &&
                            state.postComments[postKey].comments[key].replies[action.data.transferred_comment.id] && {
                              [action.data.transferred_comment.id]: {
                                ...state.postComments[postKey].comments[key].replies[action.data.transferred_comment.id],
                                users_approval: [{ ...action.data.user_approved, created_at: action.data.created_at }],
                              },
                            }),
                        },
                      }),
                    };
                    return res;
                  }, {}),
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
              let key = ws.topic.id;
              if (action.data.sharedSlug) {
                key = `${ws.topic.id}-${action.data.slug}`;
              }
              if (state.workspacePosts[key]) {
                res[key] = {
                  ...state.workspacePosts[key],
                  posts: {
                    ...state.workspacePosts[key].posts,
                    [postKey]: {
                      ...state.workspacePosts[key].posts[postKey],
                      post_approval_label: allUsersAgreed
                        ? "ACCEPTED"
                        : allUsersDisagreed
                        ? "REQUEST_UPDATE"
                        : allUsersAnswered && !allUsersDisagreed && !allUsersAgreed
                        ? "SPLIT"
                        : action.data.user_approved.id === state.user.id
                        ? null
                        : state.workspacePosts[key].posts[postKey].post_approval_label,
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
        let key = wid;
        if (action.data.sharedSlug) {
          key = `${wid}-${action.data.slug}`;
        }
        updatedWorkspaces[key].members = updatedWorkspaces[key].members.filter((m) => m.id !== action.data.user.id);
      });
      return {
        ...state,
        workspaces: updatedWorkspaces,
      };
    }
    case "INCOMING_UNARCHIVED_USER": {
      let updatedWorkspaces = { ...state.workspaces };
      action.data.connected_topic_ids.forEach((wid) => {
        let key = wid;
        if (action.data.sharedSlug) {
          key = `${wid}-${action.data.slug}`;
        }
        updatedWorkspaces[key].members = [...updatedWorkspaces[key].members, action.data.profile];
      });
      return {
        ...state,
        workspaces: updatedWorkspaces,
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
        workspacePosts: {
          ...state.workspacePosts,
          ...(action.data.workspaces.length > 0 && {
            ...state.workspacePosts,
            ...action.data.workspaces.reduce((res, ws) => {
              let key = ws.topic.id;
              if (action.data.sharedSlug) {
                key = `${ws.topic.id}-${action.data.slug}`;
              }
              if (state.workspacePosts[key]) {
                res[key] = {
                  ...state.workspacePosts[key],
                  posts: {
                    ...state.workspacePosts[key].posts,
                    [postKey]: {
                      ...state.workspacePosts[key].posts[postKey],
                      is_close: action.data.is_close,
                      post_close: {
                        initiator: action.data.initiator,
                      },
                    },
                  },
                  ...(state.workspacePosts[key].categories && {
                    categories: {
                      ...state.workspacePosts[key].categories,
                      closedPost: {
                        ...state.workspacePosts[key].categories.closedPost,
                        count: action.data.is_close ? state.workspacePosts[key].categories.closedPost.count + 1 : state.workspacePosts[key].categories.closedPost.count - 1,
                      },
                      mustReply: {
                        ...state.workspacePosts[key].categories.mustReply,
                        count:
                          action.data.is_close && mustReply
                            ? state.workspacePosts[key].categories.mustReply.count - 1
                            : !action.data.is_close && mustReply
                            ? state.workspacePosts[key].categories.mustReply.count + 1
                            : state.workspacePosts[key].categories.mustReply.count,
                      },
                      mustRead: {
                        ...state.workspacePosts[key].categories.mustRead,
                        count:
                          action.data.is_close && mustRead
                            ? state.workspacePosts[key].categories.mustRead.count - 1
                            : !action.data.is_close && mustRead
                            ? state.workspacePosts[key].categories.mustRead.count + 1
                            : state.workspacePosts[key].categories.mustRead.count,
                      },
                    },
                  }),
                };
              }
              return res;
            }, {}),
          }),
        },
      };
    }
    case "ADD_USER_TO_POST_RECIPIENTS": {
      let workspacePost = { ...state.workspacePosts };
      if (action.data.hasOwnProperty("topic_id") && workspacePost.hasOwnProperty(action.data.topic_id)) {
        if (workspacePost[action.data.topic_id].posts.hasOwnProperty(action.data.post_id)) {
          if (!workspacePost[action.data.topic_id].posts[action.data.post_id].hasOwnProperty("to_add")) {
            workspacePost[action.data.topic_id].posts[action.data.post_id].to_add = [...action.data.recipient_ids];
          } else {
            workspacePost[action.data.topic_id].posts[action.data.post_id].to_add = [...workspacePost[action.data.topic_id].posts[action.data.post_id].to_add, ...action.data.recipient_ids];
          }
          workspacePost[action.data.topic_id].posts[action.data.post_id].recipients = [...workspacePost[action.data.topic_id].posts[action.data.post_id].recipients, ...action.data.recipients];
          workspacePost[action.data.topic_id].posts[action.data.post_id].recipient_ids = [...workspacePost[action.data.topic_id].posts[action.data.post_id].recipient_ids, ...action.data.recipient_ids];
        }
      }

      return {
        ...state,
        workspacePosts: workspacePost,
      };
    }

    case "REMOVE_USER_TO_POST_RECIPIENTS": {
      let workspacePost = { ...state.workspacePosts };
      if (action.data.hasOwnProperty("topic_id") && workspacePost.hasOwnProperty(action.data.topic_id)) {
        if (workspacePost[action.data.topic_id].posts.hasOwnProperty(action.data.post_id)) {
          const filteredRecipientsIds = workspacePost[action.data.topic_id].posts[action.data.post_id].recipient_ids.filter((id) => {
            return !action.data.remove_recipient_ids.includes(id);
          });

          const filteredRecipients = workspacePost[action.data.topic_id].posts[action.data.post_id].recipients.filter((r) => {
            return !action.data.remove_recipient_ids.includes(r.id);
          });
          workspacePost[action.data.topic_id].posts[action.data.post_id].recipients = filteredRecipients;
          workspacePost[action.data.topic_id].posts[action.data.post_id].recipient_ids = filteredRecipientsIds;
        }
      }

      return {
        ...state,
        workspacePosts: workspacePost,
      };
    }
    case "REMOVE_POST": {
      return {
        ...state,
        workspacePosts: {
          ...state.workspacePosts,
          ...action.data.recipients
            .filter((r) => r.type === "TOPIC")
            .reduce((res, ws) => {
              if (state.workspacePosts[ws.id]) {
                res[ws.id] = {
                  ...state.workspacePosts[ws.id],
                  ...(state.workspacePosts[ws.id].posts && {
                    posts: {
                      ...Object.keys(state.workspacePosts[ws.id].posts)
                        .filter((key) => {
                          if (action.data.sharedSlug) {
                            return key !== action.data.post_code;
                          } else {
                            return parseInt(key) !== action.data.id;
                          }
                        })
                        .reduce((post, key) => {
                          post[key] = { ...state.workspacePosts[ws.id].posts[key] };
                          return post;
                        }, {}),
                    },
                  }),
                };
              }
              return res;
            }, {}),
        },
      };
    }
    case "POST_LIST_CONNECT": {
      const newWp = Object.entries(state.workspacePosts).reduce((newValue, [topic_id, wp]) => {
        if (!Object.values(wp.posts).some((p) => p.id === action.data.post_id)) {
          newValue[topic_id] = wp;
        } else {
          const post = Object.values(wp.posts).find((p) => p.id === action.data.post_id);
          if (post) {
            newValue[topic_id] = {
              ...wp,
              posts: {
                ...wp.posts,
                [action.data.sharedSlug ? post.code : post.id]: {
                  ...wp.posts[action.data.sharedSlug ? post.code : post.id],
                  post_list_connect: [{ id: action.data.link_id }],
                },
              },
            };
          }
        }
        return newValue;
      }, {});
      return {
        ...state,
        workspacePosts: newWp,
      };
    }
    case "POST_LIST_DISCONNECT": {
      const newWp = Object.entries(state.workspacePosts).reduce((newValue, [topic_id, wp]) => {
        if (!Object.values(wp.posts).some((p) => p.id === action.data.post_id)) {
          newValue[topic_id] = wp;
        } else {
          const post = Object.values(wp.posts).find((p) => p.id === action.data.post_id);
          if (post) {
            newValue[topic_id] = {
              ...wp,
              posts: {
                ...wp.posts,
                [action.data.sharedSlug ? post.code : post.id]: {
                  ...wp.posts[action.data.sharedSlug ? post.code : post.id],
                  post_list_connect: [],
                },
              },
            };
          }
        }
        return newValue;
      }, {});

      return {
        ...state,
        workspacePosts: newWp,
      };
    }
    case "INCOMING_POST_REQUIRED": {
      let postKey = action.data.post.id;
      if (action.data.sharedSlug && action.data.post.post_code) {
        postKey = action.data.post.post_code;
      }
      return {
        ...state,
        workspacePosts: {
          ...state.workspacePosts,
          ...(action.data.workspaces.length > 0 && {
            ...state.workspacePosts,
            ...action.data.workspaces.reduce((res, ws) => {
              let key = ws.topic.id;
              if (action.data.sharedSlug) {
                key = `${ws.topic.id}-${action.data.slug}`;
              }
              if (state.workspacePosts[key] && state.workspacePosts[key].posts[postKey]) {
                res[key] = {
                  ...state.workspacePosts[key],
                  posts: {
                    ...state.workspacePosts[key].posts,
                    [postKey]: {
                      ...state.workspacePosts[key].posts[postKey],
                      required_users: action.data.required_users,
                      user_reads: action.data.user_reads,
                      must_read_users: action.data.must_read_users,
                      must_reply_users: action.data.must_reply_users,
                    },
                  },
                  ...(state.workspacePosts[key].hasOwnProperty("categories") && {
                    categories: {
                      ...state.workspacePosts[key].categories,
                      mustRead: {
                        ...state.workspacePosts[key].categories.mustRead,
                        count:
                          action.data.must_read_users && action.data.must_read_users.some((u) => u.id === state.user.id && u.must_read)
                            ? state.workspacePosts[key].categories.mustRead.count - 1
                            : state.workspacePosts[key].categories.mustRead.count,
                      },
                      mustReply: {
                        ...state.workspacePosts[key].categories.mustReply,
                        count:
                          action.data.must_reply_users && action.data.must_reply_users.some((u) => u.id === state.user.id && u.must_reply)
                            ? state.workspacePosts[key].categories.mustReply.count - 1
                            : state.workspacePosts[key].categories.mustReply.count,
                      },
                    },
                  }),
                };
              }
              return res;
            }, {}),
          }),
        },
      };
    }
    case "INCOMING_TEAM_CHANNEL": {
      return {
        ...state,
        workspaces: {
          ...Object.values(state.workspaces)
            .map((ws) => {
              if (ws.id === action.data.workspace_id) {
                return {
                  ...ws,
                  team_channel: {
                    id: action.data.team_channel.id,
                    code: action.data.team_channel.code,
                    icon_link: null,
                  },
                };
              } else {
                return ws;
              }
            })
            .reduce((workspaces, workspace) => {
              workspaces[workspace.sharedSlug ? workspace.key : workspace.id] = workspace;
              return workspaces;
            }, {}),
        },
        activeTopic:
          state.activeTopic && state.activeTopic.id === action.data.workspace_id
            ? {
                ...state.activeTopic,
                team_channel: {
                  id: action.data.team_channel.id,
                  code: action.data.team_channel.code,
                  icon_link: null,
                },
              }
            : state.activeTopic,
      };
    }
    case "INCOMING_FAVOURITE_WORKSPACE": {
      return {
        ...state,
        search: {
          ...state.search,
          results: state.search.results.map((r) => {
            if (r.topic.id === action.data.topic_id.id) {
              return {
                ...r,
                topic: {
                  ...r.topic,
                  is_favourite: action.data.SOCKET_TYPE === "WORKSPACE_FAVOURITE" ? true : false,
                },
              };
            } else {
              return r;
            }
          }),
        },
        workspaces: {
          ...Object.values(state.workspaces).reduce((res, ws) => {
            res[ws.sharedSlug ? ws.key : ws.id] = {
              ...ws,
              is_favourite:
                (ws.sharedSlug && action.data.fromSharedWs && ws.id === action.data.topic_id.id) || (!ws.sharedSlug && !action.data.fromSharedWs && ws.id === action.data.topic_id.id)
                  ? action.data.SOCKET_TYPE === "WORKSPACE_FAVOURITE"
                    ? true
                    : false
                  : ws.is_favourite,
            };
            return res;
          }, {}),
        },
        activeTopic: state.activeTopic && state.activeTopic.id === action.data.topic_id.id ? { ...state.activeTopic, is_favourite: action.data.SOCKET_TYPE === "WORKSPACE_FAVOURITE" ? true : false } : state.activeTopic,
      };
    }
    case "GET_WORKSPACE_FILTER_COUNT_SUCCESS": {
      return {
        ...state,
        search: {
          ...state.search,
          counters: action.data.reduce((res, obj) => {
            if (obj.entity_type === "NON_MEMBER") {
              res["nonMember"] = obj.count;
            } else {
              res[obj.entity_type.toLowerCase()] = obj.count;
            }
            return res;
          }, {}),
        },
      };
    }
    case "GET_ALL_WORKSPACE_SUCCESS": {
      return {
        ...state,
        search: {
          ...state.search,
          results: uniqBy([...state.search.results, ...action.data.workspaces], "topic.id"),
          folders: action.data.workspaces
            .filter((ws) => ws.workspace !== null)
            .reduce((acc, ws) => {
              acc[ws.workspace.id] = {
                id: ws.workspace.id,
                name: ws.workspace.name,
                workspaces: action.data.workspaces.filter((w) => w.workspace && w.workspace.id === ws.workspace.id).map((ws) => ws.topic.id),
              };
              return acc;
            }, {}),
        },
      };
    }
    case "REMOVE_DRAFT_POST": {
      return {
        ...state,
        workspacePosts: {
          ...state.workspacePosts,
          ...Object.keys(state.workspacePosts).reduce((ws, id) => {
            if (state.workspacePosts[id]) {
              ws[id] = {
                ...state.workspacePosts[id],
                posts: {
                  ...Object.values(state.workspacePosts[id].posts).reduce((res, post) => {
                    if (post.id !== action.data.post_id) {
                      res[post.id] = { ...state.workspacePosts[id].posts[post.id] };
                    }
                    return res;
                  }, {}),
                },
              };
            }
            return ws;
          }, {}),
        },
      };
    }
    case "INCOMING_REMOVED_FILE_AUTOMATICALLY": {
      return {
        ...state,
        workspacePosts: {
          ...state.workspacePosts,
          ...action.data.files.reduce((res, obj) => {
            if (state.workspacePosts[obj.topic_id]) {
              res[obj.topic_id] = {
                ...state.workspacePosts[obj.topic_id],
                posts: {
                  ...state.workspacePosts[obj.topic_id].posts,
                  ...action.data.files.reduce((pos, p) => {
                    if (p.post_id && state.workspacePosts[obj.topic_id].posts[p.post_id]) {
                      const files_trashed =
                        state.workspacePosts[obj.topic_id].posts[p.post_id].files.length === 0
                          ? []
                          : state.workspacePosts[obj.topic_id].posts[p.post_id].files
                              .filter((f) => action.data.files.some((file) => file.file_id === f.file_id))
                              .map((f) => {
                                return { ...f, deleted_at: { timestamp: getCurrentTimestamp() } };
                              });
                      pos[p.post_id] = {
                        ...state.workspacePosts[obj.topic_id].posts[p.post_id],
                        files: state.workspacePosts[obj.topic_id].posts[p.post_id].files.filter((f) => !action.data.files.some((file) => file.file_id === f.file_id)),
                        files_trashed: files_trashed,
                      };
                    }
                    return pos;
                  }, {}),
                },
              };
            }
            return res;
          }, {}),
        },
        postComments: {
          ...state.postComments,
          ...Object.keys(state.postComments).reduce((ws, id) => {
            ws[id] = {
              ...state.postComments[id],
              comments: {
                ...state.postComments[id].comments,
                ...Object.values(state.postComments[id].comments).reduce((res, com) => {
                  if (com.files.some((f) => action.data.files.some((file) => file.file_id === f.file_id))) {
                    const files_trashed =
                      state.postComments[id].comments[com.id].files.length === 0
                        ? []
                        : state.postComments[id].comments[com.id].files
                            .filter((f) => action.data.files.some((file) => file.file_id === f.file_id))
                            .map((f) => {
                              return { ...f, deleted_at: { timestamp: getCurrentTimestamp() } };
                            });
                    res[com.id] = {
                      ...state.postComments[id].comments[com.id],
                      files: state.postComments[id].comments[com.id].files.filter((f) => !action.data.files.some((file) => file.file_id === f.file_id)),
                      files_trashed: files_trashed,
                    };
                  } else {
                    res[com.id] = {
                      ...state.postComments[id].comments[com.id],
                      replies: {
                        ...state.postComments[id].comments[com.id].replies,
                        ...Object.values(state.postComments[id].comments[com.id].replies).reduce((sres, scom) => {
                          if (scom.files.some((f) => action.data.files.some((file) => file.file_id === f.file_id))) {
                            const files_trashed =
                              state.postComments[id].comments[com.id].replies[scom.id].files.length === 0
                                ? []
                                : state.postComments[id].comments[com.id].replies[scom.id].files
                                    .filter((f) => action.data.files.some((file) => file.file_id === f.file_id))
                                    .map((f) => {
                                      return { ...f, deleted_at: { timestamp: getCurrentTimestamp() } };
                                    });
                            sres[scom.id] = {
                              ...state.postComments[id].comments[com.id].replies[scom.id],
                              files: state.postComments[id].comments[com.id].replies[scom.id].files.filter((f) => !action.data.files.some((file) => file.file_id === f.file_id)),
                              files_trashed: files_trashed,
                            };
                          } else {
                            sres[scom.id] = { ...state.postComments[id].comments[com.id].replies[scom.id] };
                          }
                          return sres;
                        }, {}),
                      },
                    };
                  }
                  return res;
                }, {}),
              },
            };
            return ws;
          }, {}),
        },
      };
    }
    case "INCOMING_REMOVED_FILE_AFTER_DOWNLOAD": {
      return {
        ...state,
        workspacePosts: {
          ...state.workspacePosts,
          ...Object.keys(state.workspacePosts).reduce((ws, id) => {
            if (state.workspacePosts[id]) {
              ws[id] = {
                ...state.workspacePosts[id],
                posts: {
                  ...state.workspacePosts[id].posts,
                  ...Object.values(state.workspacePosts[id].posts).reduce((res, post) => {
                    if (post.files.some((f) => f.file_id === action.data.file_id)) {
                      res[post.id] = { ...state.workspacePosts[id].posts[post.id], files: state.workspacePosts[id].posts[post.id].files.filter((f) => f.file_id !== action.data.file_id) };
                    } else {
                      res[post.id] = { ...state.workspacePosts[id].posts[post.id] };
                    }
                    return res;
                  }, {}),
                },
              };
            }
            return ws;
          }, {}),
        },
        postComments: {
          ...state.postComments,
          ...Object.keys(state.postComments).reduce((ws, id) => {
            ws[id] = {
              ...state.postComments[id],
              comments: {
                ...state.postComments[id].comments,
                ...Object.values(state.postComments[id].comments).reduce((res, com) => {
                  if (com.files.some((f) => f.file_id === action.data.file_id)) {
                    res[com.id] = { ...state.postComments[id].comments[com.id], files: state.postComments[id].comments[com.id].files.filter((f) => f.file_id !== action.data.file_id) };
                  } else {
                    res[com.id] = {
                      ...state.postComments[id].comments[com.id],
                      replies: {
                        ...state.postComments[id].comments[com.id].replies,
                        ...Object.values(state.postComments[id].comments[com.id].replies).reduce((sres, scom) => {
                          if (scom.files.some((f) => f.file_id === action.data.file_id)) {
                            sres[scom.id] = {
                              ...state.postComments[id].comments[com.id].replies[scom.id],
                              files: state.postComments[id].comments[com.id].replies[scom.id].files.filter((f) => f.file_id !== action.data.file_id),
                            };
                          } else {
                            sres[scom.id] = {
                              ...state.postComments[id].comments[com.id].replies[scom.id],
                            };
                          }
                          return sres;
                        }, {}),
                      },
                    };
                  }
                  return res;
                }, {}),
              },
            };
            return ws;
          }, {}),
        },
      };
    }
    case "GET_FAVORITE_WORKSPACE_COUNTERS_SUCCESS": {
      return {
        ...state,
        workspaces: {
          ...state.workspaces,
          ...(action.data.length > 0 && {
            ...action.data.reduce((res, obj) => {
              const ws = Object.values(state.workspaces).find((ws) => ws.id === obj.topic_id);
              if (ws) {
                res[ws.sharedSlug ? ws.key : ws.id] = {
                  ...state.workspaces[ws.sharedSlug ? ws.key : ws.id],
                  workspace_counter_entries: obj.workspace_counter_entries,
                };
              }
              return res;
            }, {}),
          }),
        },
      };
    }
    case "GET_WORKSPACE_REMINDERS_CALLBACK": {
      return {
        ...state,
        workspaceReminders: {
          ...state.workspaceReminders,
          ...(state.workspaceReminders[action.data.wsKey] && {
            [action.data.wsKey]: {
              ...state.workspaceReminders[action.data.wsKey],
              hasMore: action.data.todos.length === action.data.limit,
              skip: state.workspaceReminders[action.data.wsKey].skip + action.data.todos.length,
              reminderIds: [...state.workspaceReminders[action.data.wsKey].reminderIds, ...action.data.todos.map((t) => t.id)],
            },
          }),
          ...(!state.workspaceReminders[action.data.wsKey] && {
            [action.data.wsKey]: {
              skip: action.data.todos.length,
              hasMore: action.data.todos.length === action.data.limit,
              reminderIds: [...action.data.todos.map((t) => t.id)],
              done: {
                limit: 10,
                hasMore: true,
                skip: 0,
              },
              overdue: {
                limit: 25,
                hasMore: true,
                skip: 0,
              },
              today: {
                limit: 25,
                hasMore: true,
                skip: 0,
              },
              count: {
                all: 0,
                overdue: 0,
                today: 0,
                new: 0,
              },
            },
          }),
        },
      };
    }
    case "GET_DONE_WORKSPACE_REMINDERS_CALLBACK": {
      return {
        ...state,
        workspaceReminders: {
          ...state.workspaceReminders,
          ...(state.workspaceReminders[action.data.wsKey] && {
            [action.data.wsKey]: {
              ...state.workspaceReminders[action.data.wsKey],
              reminderIds: [...state.workspaceReminders[action.data.wsKey].reminderIds, ...action.data.todos.map((t) => t.id)],
              done: {
                limit: 10,
                hasMore: action.data.todos.length === action.data.limit,
                skip: state.workspaceReminders[action.data.wsKey].done.skip + action.data.todos.length,
              },
            },
          }),
          ...(!state.workspaceReminders[action.data.wsKey] && {
            [action.data.wsKey]: {
              hasMore: true,
              skip: 0,
              done: {
                limit: 10,
                skip: action.data.todos.length,
                hasMore: action.data.todos.length === action.data.limit,
              },
              reminderIds: [...action.data.todos.map((t) => t.id)],
              count: {
                all: 0,
                overdue: 0,
                today: 0,
                new: 0,
              },
            },
          }),
        },
      };
    }
    case "GET_OVERDUE_WORKSPACE_REMINDERS_CALLBACK": {
      return {
        ...state,
        workspaceReminders: {
          ...state.workspaceReminders,
          ...(state.workspaceReminders[action.data.wsKey] && {
            [action.data.wsKey]: {
              ...state.workspaceReminders[action.data.wsKey],
              reminderIds: [...state.workspaceReminders[action.data.wsKey].reminderIds, ...action.data.todos.map((t) => t.id)],
              overdue: {
                limit: 25,
                hasMore: action.data.todos.length === action.data.limit,
                skip: state.workspaceReminders[action.data.wsKey].overdue.skip + action.data.todos.length,
              },
            },
          }),
          ...(!state.workspaceReminders[action.data.wsKey] && {
            [action.data.wsKey]: {
              hasMore: true,
              skip: 0,
              overdue: {
                limit: 25,
                skip: action.data.todos.length,
                hasMore: action.data.todos.length === action.data.limit,
              },
              reminderIds: [...action.data.todos.map((t) => t.id)],
              count: {
                all: 0,
                overdue: 0,
                today: 0,
                new: 0,
              },
            },
          }),
        },
      };
    }
    case "GET_TODAY_WORKSPACE_REMINDERS_CALLBACK": {
      return {
        ...state,
        workspaceReminders: {
          ...state.workspaceReminders,

          ...(state.workspaceReminders[action.data.wsKey] && {
            [action.data.wsKey]: {
              ...state.workspaceReminders[action.data.wsKey],
              reminderIds: [...state.workspaceReminders[action.data.wsKey].reminderIds, ...action.data.todos.map((t) => t.id)],
              today: {
                limit: 25,
                hasMore: action.data.todos.length === action.data.limit,
                skip: state.workspaceReminders[action.data.wsKey].today.skip + action.data.todos.length,
              },
            },
          }),
          ...(!state.workspaceReminders[action.data.wsKey] && {
            [action.data.wsKey]: {
              hasMore: true,
              skip: 0,
              today: {
                limit: 25,
                skip: action.data.todos.length,
                hasMore: action.data.todos.length === action.data.limit,
              },
              reminderIds: [...action.data.todos.map((t) => t.id)],
              count: {
                all: 0,
                overdue: 0,
                today: 0,
                new: 0,
              },
            },
          }),
        },
      };
    }
    case "UPDATE_WORKSPACE_REMINDERS_COUNT": {
      return {
        ...state,
        workspaceReminders: {
          ...state.workspaceReminders,
          ...(state.workspaceReminders[action.data.id] && {
            [action.data.id]: {
              ...state.workspaceReminders[action.data.id],
              count: action.data.count.reduce((res, c) => {
                res[c.status.toLowerCase()] = c.count;
                return res;
              }, {}),
            },
          }),
          ...(typeof state.workspaceReminders[action.data.id] === "undefined" && {
            [action.data.id]: {
              skip: 0,
              hasMore: true,
              reminderIds: [],
              done: {
                limit: 10,
                skip: 0,
                hasMore: true,
              },
              overdue: {
                limit: 25,
                skip: 0,
                hasMore: true,
              },
              today: {
                limit: 25,
                skip: 0,
                hasMore: true,
              },
              count: action.data.count.reduce((res, c) => {
                res[c.status.toLowerCase()] = c.count;
                return res;
              }, {}),
            },
          }),
        },
      };
    }
    case "INCOMING_FOLLOW_POST": {
      let postKey = action.data.post_id;
      return {
        ...state,
        workspacePosts: {
          ...state.workspacePosts,
          ...(action.data.workspaces &&
            action.data.workspaces.length > 0 && {
              ...state.workspacePosts,
              ...action.data.workspaces.reduce((res, ws) => {
                let key = ws.topic.id;
                if (action.data.sharedSlug) {
                  key = `${ws.topic.id}-${action.data.slug}`;
                }
                if (state.workspacePosts[key] && state.workspacePosts[key].posts && Object.values(state.workspacePosts[key].posts).some((p) => p.id === action.data.post_id)) {
                  const post = Object.values(state.workspacePosts[key].posts).find((p) => p.id === action.data.post_id);
                  if (post) {
                    if (action.data.sharedSlug) {
                      postKey = post.code;
                    }
                    res[key] = {
                      ...state.workspacePosts[key],
                      posts: {
                        ...state.workspacePosts[key].posts,
                        [postKey]: {
                          ...state.workspacePosts[key].posts[postKey],
                          user_unfollow: state.workspacePosts[key].posts[postKey].user_unfollow.filter((p) => p.id !== action.data.user_follow.id),
                        },
                      },
                    };
                  }
                }
                return res;
              }, {}),
            }),
        },
      };
    }
    case "INCOMING_UNFOLLOW_POST": {
      let postKey = action.data.post_id;
      return {
        ...state,
        workspacePosts: {
          ...state.workspacePosts,
          ...(action.data.workspaces &&
            action.data.workspaces.length > 0 && {
              ...state.workspacePosts,
              ...action.data.workspaces.reduce((res, ws) => {
                let key = ws.topic.id;
                if (action.data.sharedSlug) {
                  key = `${ws.topic.id}-${action.data.slug}`;
                }
                if (state.workspacePosts[key] && state.workspacePosts[key].posts && Object.values(state.workspacePosts[key].posts).some((p) => p.id === action.data.post_id)) {
                  const post = Object.values(state.workspacePosts[key].posts).find((p) => p.id === action.data.post_id);
                  if (post) {
                    if (action.data.sharedSlug) {
                      postKey = post.code;
                    }
                    res[key] = {
                      ...state.workspacePosts[key],
                      posts: {
                        ...state.workspacePosts[key].posts,
                        [postKey]: {
                          ...state.workspacePosts[key].posts[postKey],
                          user_unfollow: [...state.workspacePosts[key].posts[postKey].user_unfollow, action.data.user_unfollow],
                        },
                      },
                    };
                  }
                }
                return res;
              }, {}),
            }),
        },
      };
    }
    case "GET_ALL_WORKSPACE_FOLDERS_SUCCESS": {
      return {
        ...state,
        allFolders: action.data.folders.reduce((acc, f) => {
          acc[f.id] = {
            ...f,
            workspaces: f.topics,
          };
          return acc;
        }, {}),
        allFoldersLoaded: true,
      };
    }
    //to do
    case "INCOMING_UPDATED_TEAM":
    case "INCOMING_TEAM": {
      return {
        ...state,
        workspaces: Object.values(state.workspaces).reduce((acc, ws) => {
          if (ws.sharedSlug && action.data.fromSharedWs && ws.members.some((m) => m.members && m.id === action.data.id)) {
            acc[ws.key] = {
              ...ws,
              members: ws.members.map((m) => {
                if (m.id === action.data.id) {
                  return action.data;
                } else {
                  return m;
                }
              }),
            };
          } else if (!ws.sharedSlug && !action.data.fromSharedWs && ws.members.some((m) => m.members && m.id === action.data.id)) {
            acc[ws.id] = {
              ...ws,
              members: ws.members.map((m) => {
                if (m.id === action.data.id) {
                  return action.data;
                } else {
                  return m;
                }
              }),
            };
          } else {
            acc[ws.sharedSlug ? ws.key : ws.id] = ws;
          }
          return acc;
        }, {}),
        activeTopic:
          state.activeTopic && state.activeTopic.members.some((m) => m.members && m.id === action.data.id)
            ? {
                ...state.activeTopic,
                members: state.activeTopic.members.map((m) => {
                  if (m.id === action.data.id) {
                    return action.data;
                  } else {
                    return m;
                  }
                }),
              }
            : state.activeTopic,
      };
    }
    case "INCOMING_REMOVED_TEAM_MEMBER":
    case "REMOVE_TEAM_MEMBER_SUCCESS": {
      const resetActiveTopic =
        state.activeTopic &&
        state.activeTopic.is_lock === 1 &&
        state.activeTopic.members.some((m) => m.members && m.id === action.data.id && m.members.some((mem) => mem.id === state.user.id)) &&
        state.user &&
        action.data.remove_member_ids.some((id) => id === state.user.id) &&
        !state.activeTopic.members.some((m) => (m.type === "internal" || m.type === "external") && state.user.id === m.id);
      return {
        ...state,
        workspaces: Object.values(state.workspaces)
          .filter((ws) => {
            if (ws.is_lock === 0) return true;
            if (ws.members.some((m) => m.members && m.id === action.data.id && m.members.some((mem) => mem.id === state.user.id)) && !ws.members.some((m) => (m.type === "internal" || m.type === "external") && state.user.id === m.id)) {
              return false;
            } else {
              return true;
            }
          })
          .reduce((acc, ws) => {
            if (ws.members.some((m) => m.members && m.id === action.data.id)) {
              acc[ws.sharedSlug ? ws.key : ws.id] = {
                ...ws,
                members: ws.members.map((m) => {
                  if (m.id === action.data.id) {
                    return action.data;
                  } else {
                    return m;
                  }
                }),
              };
            } else {
              acc[ws.sharedSlug ? ws.key : ws.id] = ws;
            }
            return acc;
          }, {}),
        activeTopic: resetActiveTopic ? null : state.activeTopic,
        selectedWorkspaceId: resetActiveTopic ? null : state.selectedWorkspaceId,
        workspacePosts: Object.keys(state.workspacePosts).reduce((acc, id) => {
          acc[id] = {
            ...state.workspacePosts[id],
            posts: state.workspacePosts[id].posts
              ? Object.values(state.workspacePosts[id].posts)
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
                  .reduce((wp, post) => {
                    if (post.recipients.some((r) => r.type === "TEAM" && r.id === parseInt(action.data.id))) {
                      wp[post.id] = {
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
                      wp[post.id] = post;
                    }
                    return wp;
                  }, {})
              : {},
          };
          return acc;
        }, {}),
      };
    }
    case "INCOMING_DELETED_TEAM": {
      return {
        ...state,
        workspaces: Object.values(state.workspaces).reduce((acc, ws) => {
          if (ws.sharedSlug && action.data.fromSharedWs && ws.members.some((m) => m.members && m.id === action.data.id)) {
            acc[ws.key] = {
              ...ws,
              members: ws.members.filter((m) => {
                if (m.id === action.data.id) {
                  return false;
                } else {
                  return true;
                }
              }),
            };
          } else if (!ws.sharedSlug && !action.data.fromSharedWs && ws.members.some((m) => m.members && m.id === action.data.id)) {
            acc[ws.id] = {
              ...ws,
              members: ws.members.filter((m) => {
                if (m.id === action.data.id) {
                  return false;
                } else {
                  return true;
                }
              }),
            };
          } else {
            acc[ws.sharedSlug ? ws.key : ws.id] = ws;
          }
          return acc;
        }, {}),
        activeTopic:
          state.activeTopic && state.activeTopic.members.some((m) => m.members && m.id === action.data.id)
            ? {
                ...state.activeTopic,
                members: state.activeTopic.members.filter((m) => {
                  if (m.id === action.data.id) {
                    return false;
                  } else {
                    return true;
                  }
                }),
              }
            : state.activeTopic,
        workspacePosts: Object.keys(state.workspacePosts).reduce((acc, id) => {
          acc[id] = {
            ...state.workspacePosts[id],
            posts: state.workspacePosts[id].posts
              ? Object.values(state.workspacePosts[id].posts)
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
                  .reduce((wp, post) => {
                    if (post.recipients.some((r) => r.type === "TEAM" && r.id === parseInt(action.data.id))) {
                      wp[post.id] = {
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
                      wp[post.id] = post;
                    }
                    return wp;
                  }, {})
              : {},
          };
          return acc;
        }, {}),
      };
    }
    case "INCOMING_TEAM_MEMBER":
    case "ADD_TEAM_MEMBER_SUCCESS": {
      return {
        ...state,
        workspaces: Object.values(state.workspaces).reduce((acc, ws) => {
          if (ws.sharedSlug && ws.members.some((m) => m.members && m.id === action.data.id)) {
            acc[ws.key] = {
              ...ws,
              members: ws.members.map((m) => {
                if (m.id === action.data.id) {
                  return { ...m, member_ids: action.data.member_ids, members: action.data.members };
                } else {
                  return m;
                }
              }),
            };
          } else if (!ws.sharedSlug && ws.members.some((m) => m.members && m.id === action.data.id)) {
            acc[ws.id] = {
              ...ws,
              members: ws.members.map((m) => {
                if (m.id === action.data.id) {
                  return { ...m, member_ids: action.data.member_ids, members: action.data.members };
                } else {
                  return m;
                }
              }),
            };
          } else {
            acc[ws.sharedSlug ? ws.key : ws.id] = ws;
          }
          return acc;
        }, {}),
        activeTopic:
          state.activeTopic && state.activeTopic.members.some((m) => m.members && m.id === action.data.id)
            ? {
                ...state.activeTopic,
                members: state.activeTopic.members.map((m) => {
                  if (m.id === action.data.id) {
                    return { ...m, member_ids: action.data.member_ids, members: action.data.members };
                  } else {
                    return m;
                  }
                }),
              }
            : state.activeTopic,
        workspacePosts: Object.keys(state.workspacePosts).reduce((acc, id) => {
          acc[id] = {
            ...state.workspacePosts[id],
            posts: state.workspacePosts[id].posts
              ? Object.values(state.workspacePosts[id].posts).reduce((wp, post) => {
                  if (post.recipients.some((r) => r.type === "TEAM" && r.id === parseInt(action.data.id))) {
                    wp[post.id] = {
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
                    wp[post.id] = post;
                  }
                  return wp;
                }, {})
              : {},
          };
          return acc;
        }, {}),
      };
    }
    //to review workspace post
    case "INCOMING_ACCEPTED_INTERNAL_USER": {
      if (action.data.team_ids.length) {
        const newUser = {
          active: 1,
          email: action.data.email,
          first_name: action.data.first_name,
          has_accepted: true,
          id: action.data.id,
          name: action.data.name,
          partial_name: action.data.partial_name,
          profile_image_link: action.data.profile_image_link,
          profile_image_thumbnail_link: action.data.profile_image_thumbnail_link,
          slug: null,
          type: "internal",
        };
        return {
          ...state,
          workspaces: Object.values(state.workspaces).reduce((acc, ws) => {
            if (!ws.sharedSlug && ws.members.some((m) => m.members && action.data.team_ids.some((id) => id === m.id))) {
              acc[ws.id] = {
                ...ws,
                members: ws.members.map((mem) => {
                  if (action.data.team_ids.some((id) => id === mem.id)) {
                    return {
                      ...mem,
                      member_ids: mem.member_ids.some((id) => id === action.data.id) ? mem.member_ids : [...mem.member_ids, action.data.id],
                      members: mem.members.some((m) => m.id === action.data.id)
                        ? mem.members.map((m) => {
                            if (action.data.id === m.id) {
                              return { ...m, has_accepted: true };
                            } else return m;
                          })
                        : [...mem.members, newUser],
                    };
                  } else return mem;
                }),
              };
            } else if (ws.sharedSlug && ws.members.some((m) => m.members && action.data.team_ids.some((id) => id === m.id))) {
              acc[ws.key] = {
                ...ws,
                members: ws.members.map((mem) => {
                  if (action.data.team_ids.some((id) => id === mem.id)) {
                    return {
                      ...mem,
                      member_ids: mem.member_ids.some((id) => id === action.data.id) ? mem.member_ids : [...mem.member_ids, action.data.id],
                      members: mem.members.some((m) => m.id === action.data.id)
                        ? mem.members.map((m) => {
                            if (action.data.id === m.id) {
                              return { ...m, has_accepted: true };
                            } else return m;
                          })
                        : [...mem.members, newUser],
                    };
                  } else return mem;
                }),
              };
            } else {
              acc[ws.sharedSlug ? ws.key : ws.id] = ws;
            }
            return acc;
          }, {}),
          activeTopic:
            state.activeTopic && !state.activeTopic.sharedSlug && state.activeTopic.members.some((m) => m.members && action.data.team_ids.some((id) => id === m.id))
              ? {
                  ...state.activeTopic,
                  members: state.activeTopic.members.map((mem) => {
                    if (action.data.team_ids.some((id) => id === mem.id)) {
                      return {
                        ...mem,
                        member_ids: mem.member_ids.some((id) => id === action.data.id) ? mem.member_ids : [...mem.member_ids, action.data.id],
                        members: mem.members.some((m) => m.id === action.data.id)
                          ? mem.members.map((m) => {
                              if (action.data.id === m.id) {
                                return { ...m, has_accepted: true };
                              } else return m;
                            })
                          : [...mem.members, newUser],
                      };
                    } else return mem;
                  }),
                }
              : state.activeTopic,
          workspacePosts: Object.keys(state.workspacePosts).reduce((acc, id) => {
            acc[id] = {
              ...state.workspacePosts[id],
              posts: state.workspacePosts[id].posts
                ? Object.values(state.workspacePosts[id].posts).reduce((wp, post) => {
                    if (post.recipients.some((r) => r.type === "TEAM" && action.data.team_ids.some((id) => id === r.id))) {
                      wp[post.id] = {
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
                      wp[post.id] = post;
                    }
                    return wp;
                  }, {})
                : {},
            };
            return acc;
          }, {}),
        };
      } else {
        return state;
      }
    }
    case "FETCH_COMMENTS_ON_VISIT_SUCCESS": {
      let postComments = { ...state.postComments };
      let postKey = action.data.post_id;
      if (action.isSharedSlug) {
        postKey = action.data.post_code;
      }
      if (action.data.messages.length) {
        const comments = action.data.messages.reduce((acc, c) => {
          acc[c.id] = {
            ...c,
            claps: [],
            replies: convertArrayToObject(c.replies, "id"),
            skip: c.replies.length,
            hasMore: c.replies.length === 10,
            limit: 10,
          };
          return acc;
        }, {});
        postComments[postKey] = {
          ...(typeof postComments[postKey] !== "undefined" && postComments[postKey]),
          comments: { ...comments, ...(typeof postComments[postKey] !== "undefined" && postComments[postKey].comments) },
        };
        return {
          ...state,
          postComments: postComments,
        };
      } else {
        return state;
      }
    }
    case "INCOMING_DELETED_USER": {
      return {
        ...state,
        workspaces: Object.values(state.workspaces).reduce((acc, ws) => {
          if (ws.sharedSlug) {
            acc[ws.key] = ws;
          } else if (ws.members.some((m) => m.id === action.data.id)) {
            acc[ws.id] = { ...ws, members: ws.members.filter((m) => m.id !== action.data.id) };
          } else {
            acc[ws.id] = ws;
          }
          return acc;
        }, {}),
        activeTopic: state.activeTopic && state.activeTopic.members.some((m) => m.id === action.data.id) ? { ...state.activeTopic, members: state.activeTopic.members.filter((m) => m.id !== action.data.id) } : state.activeTopic,
      };
    }
    case "INCOMING_WORKSPACE_NOTIFICATION_STATUS": {
      return {
        ...state,
        workspaces: Object.values(state.workspaces).reduce((acc, ws) => {
          if (ws.sharedSlug && ws.id === action.data.id && state.user && state.user.id === action.data.user.id) {
            acc[ws.key] = { ...ws, is_active: action.data.is_active };
          } else if (ws.id === action.data.id && state.user && state.user.id === action.data.user.id) {
            acc[ws.sharedSlug ? ws.key : ws.id] = { ...ws, is_active: action.data.is_active };
          } else {
            acc[ws.sharedSlug ? ws.key : ws.id] = ws;
          }
          return acc;
        }, {}),
        activeTopic: state.activeTopic && state.activeTopic.id === action.data.id && state.user && state.user.id === action.data.user.id ? { ...state.activeTopic, is_active: action.data.is_active } : state.activeTopic,
        search:
          state.user && state.user.id === action.data.user.id
            ? {
                ...state.search,
                results: state.search.results.map((ws) => {
                  if (ws.topic.id === action.data.id) {
                    return {
                      ...ws,
                      topic: { ...ws.topic, is_active: action.data.is_active },
                    };
                  } else {
                    return ws;
                  }
                }),
              }
            : state.search,
      };
    }
    case "INCOMING_LAST_VISIT_POST": {
      const isSharedHub = action.data.workspace && action.data.workspace.sharedSlug;
      return {
        ...state,
        workspacePosts: {
          ...state.workspacePosts,
          ...(Object.keys(state.workspacePosts).length > 0 && {
            ...Object.keys(state.workspacePosts).reduce((res, id) => {
              res[id] = {
                ...state.workspacePosts[id],
                posts: {
                  ...state.workspacePosts[id].posts,
                  ...(state.workspacePosts[id].posts &&
                    Object.values(state.workspacePosts[id].posts).length > 0 && {
                      ...Object.values(state.workspacePosts[id].posts).reduce((pos, post) => {
                        if (post.id === action.data.post_id) {
                          pos[isSharedHub ? post.code : post.id] = {
                            ...post,
                            last_visited_at: { timestamp: action.data.last_visit },
                          };
                        } else {
                          pos[isSharedHub ? post.code : post.id] = post;
                        }
                        return pos;
                      }, {}),
                    }),
                },
              };
              return res;
            }, {}),
          }),
        },
      };
    }
    case "GET_POST_READ_CLAP_SUCCESS": {
      let postKey = action.data.id;
      if (action.isSharedSlug && action.data.code) {
        postKey = action.data.code;
      }
      return {
        ...state,
        workspacePosts: {
          ...state.workspacePosts,
          ...Object.keys(state.workspacePosts)
            .filter((wsId) => state.workspacePosts[wsId].posts && state.workspacePosts[wsId].posts.hasOwnProperty(postKey))
            .map((wsId) => {
              return {
                [wsId]: {
                  ...state.workspacePosts[wsId],
                  posts: {
                    ...state.workspacePosts[wsId].posts,
                    [postKey]: {
                      ...state.workspacePosts[wsId].posts[postKey],
                      claps: action.data.claps,
                      post_reads: action.data.reads.map((r) => {
                        return {
                          ...r.user,
                          last_read_timestamp: r.last_read_timestamp,
                        };
                      }),
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
    case "INCOMING_COMPANY_DESCRIPTION": {
      return {
        ...state,
        workspaces: Object.values(state.workspaces).reduce((acc, ws) => {
          if (ws.id === action.data.id) {
            acc[ws.sharedSlug ? ws.key : ws.id] = { ...ws, description: action.data.description };
          } else {
            acc[ws.sharedSlug ? ws.key : ws.id] = ws;
          }
          return acc;
        }, {}),
      };
    }
    case "SET_SELECTED_POST": {
      return {
        ...state,
        workspacePosts: {
          ...state.workspacePosts,
          ...(state.workspacePosts[action.data.workspaceKey] && {
            [action.data.workspaceKey]: {
              ...state.workspacePosts[action.data.workspaceKey],
              posts: {
                ...state.workspacePosts[action.data.workspaceKey].posts,
                ...(state.workspacePosts[action.data.workspaceKey].posts[action.data.postKey] && {
                  [action.data.postKey]: {
                    ...state.workspacePosts[action.data.workspaceKey].posts[action.data.postKey],
                    is_selected: action.data.isSelected,
                  },
                }),
              },
            },
          }),
        },
      };
    }
    case "UPDATE_POST_CATEGORY_COUNT": {
      return {
        ...state,
        workspacePosts: {
          ...state.workspacePosts,
          ...action.data.recipients
            .filter((r) => r.type === "TOPIC")
            .reduce((res, ws) => {
              if (state.workspacePosts[ws.id]) {
                res[ws.id] = {
                  ...state.workspacePosts[ws.id],
                  ...(state.workspacePosts[ws.id].categories && {
                    categories: {
                      ...state.workspacePosts[ws.id].categories,
                      mustRead: {
                        ...state.workspacePosts[ws.id].categories.mustRead,
                        count:
                          action.data.is_must_read && action.data.must_read_users.some((u) => u.id === state.user.id && !u.must_read)
                            ? state.workspacePosts[ws.id].categories.mustRead.count + 1
                            : state.workspacePosts[ws.id].categories.mustRead.count,
                      },
                      mustReply: {
                        ...state.workspacePosts[ws.id].categories.mustReply,
                        count:
                          action.data.is_must_reply && action.data.must_reply_users.some((u) => u.id === state.user.id && !u.must_reply)
                            ? state.workspacePosts[ws.id].categories.mustReply.count + 1
                            : state.workspacePosts[ws.id].categories.mustReply.count,
                      },
                      noReplies: {
                        ...state.workspacePosts[ws.id].categories.noReplies,
                        count: action.data.is_read_only ? state.workspacePosts[ws.id].categories.noReplies.count + 1 : state.workspacePosts[ws.id].categories.noReplies.count,
                      },
                    },
                  }),
                };
              }
              return res;
            }, {}),
        },
      };
    }
    case "UPDATE_POST_CATEGORY_COUNT": {
      return {
        ...state,
        workspacePosts: {
          ...state.workspacePosts,
          ...action.data.recipients
            .filter((r) => r.type === "TOPIC")
            .reduce((res, ws) => {
              let wsKey = ws.id;
              if (action.data.sharedSlug) {
                wsKey = `${ws.id}-${action.data.slug}`;
              }
              if (state.workspacePosts[wsKey]) {
                res[wsKey] = {
                  ...state.workspacePosts[wsKey],
                  ...(state.workspacePosts[wsKey].categories && {
                    categories: {
                      ...state.workspacePosts[wsKey].categories,
                      mustRead: {
                        ...state.workspacePosts[wsKey].categories.mustRead,
                        count:
                          action.data.is_must_read && action.data.must_read_users.some((u) => u.id === state.user.id && !u.must_read)
                            ? state.workspacePosts[wsKey].categories.mustRead.count + 1
                            : state.workspacePosts[wsKey].categories.mustRead.count,
                      },
                      mustReply: {
                        ...state.workspacePosts[wsKey].categories.mustReply,
                        count:
                          action.data.is_must_reply && action.data.must_reply_users.some((u) => u.id === state.user.id && !u.must_reply)
                            ? state.workspacePosts[wsKey].categories.mustReply.count + 1
                            : state.workspacePosts[wsKey].categories.mustReply.count,
                      },
                      noReplies: {
                        ...state.workspacePosts[wsKey].categories.noReplies,
                        count: action.data.is_read_only ? state.workspacePosts[wsKey].categories.noReplies.count + 1 : state.workspacePosts[wsKey].categories.noReplies.count,
                      },
                    },
                  }),
                };
              }
              return res;
            }, {}),
        },
      };
    }
    case "INCOMING_UPDATED_WORKSPACE_QUICK_LINKS": {
      let workspaceKey = action.data.quick_links[0].group_id;
      if (action.data.sharedSlug) {
        workspaceKey = `${action.data.quick_links[0].group_id}-${action.data.slug}`;
      }
      return {
        ...state,
        workspaceQuickLinks: {
          ...state.workspaceQuickLinks,
          [workspaceKey]: action.data.quick_links,
        },
      };
    }
    case "GET_WORKSPACE_QUICKLINKS_SUCCESS": {
      let workspaceKey = action.data[0].group_id;
      if (action.isSharedSlug) {
        workspaceKey = `${action.data[0].group_id}-${action.slug}`;
      }
      return {
        ...state,
        workspaceQuickLinks: {
          ...state.workspaceQuickLinks,
          [workspaceKey]: action.data,
        },
      };
    }
    case "GET_RELATED_WORKSPACE_START": {
      return {
        ...state,
        relatedworkspace: {
          ...state.relatedworkspace,
          loading: true,
          error: null,
          hasMore: false,
        },
      };
    }
    case "GET_RELATED_WORKSPACE_SUCCESS": {
      return {
        ...state,
        relatedworkspace: {
          loading: false,
          error: null,
          data: [...state.relatedworkspace.data, ...action.data.workspaces],
          hasMore: action.data.has_more,
        },
      };
    }
    case "GET_RELATED_WORKSPACE_FAIL": {
      return {
        ...state,
        relatedworkspace: {
          ...state.relatedworkspace,
          loading: false,
          error: action.error.response.message || "Something went wrong",
          hasMore: false,
        },
      };
    }
    case "CLEAR_RELATED_WORKSPACE": {
      return {
        ...state,
        relatedworkspace: {
          ...state.relatedworkspace,
          loading: false,
          data: [],
          hasMore: false,
        },
      };
    }
    case "ADD_WORKSPACE_TO_FOLDER": {
      return {
        ...state,
        folders: {
          ...state.folders,
          [action.data.id]: action.data,
        },
      };
    }
    case "REMOVE_WORKSPACE_FROM_FOLDER": {
      return {
        ...state,
        folders: _.omit(state.folders, action.data.id),
      };
    }
    // to update
    case "UPDATE_WORKSPACE_MEMBERS": {
      const workspaceId = action.data.workspaceId;
      return {
        ...state,
        activeTopic: state.activeTopic
          ? {
              ...state.activeTopic,
              members: action.data.members,
              member_ids: action.data.members.map((m) => m.id),
            }
          : state.activeTopic,
        workspaces: {
          ...state.workspaces,
          ...(state.workspaces[workspaceId] && {
            [workspaceId]: {
              ...state.workspaces[workspaceId],
              members: action.data.members,
              member_ids: action.data.members.map((m) => m.id),
            },
          }),
        },
      };
    }
    case "GET_SHARED_WORKSPACES_SUCCESS": {
      return {
        ...state,
        sharedWorkspaces: action.data.length === 0 ? state.sharedWorkspaces : action.data,
        sharedWorkspacesLoaded: action.data.length === 0 ? false : true,
        sharedWorkspaceInitialFetch: true,
      };
    }
    case "POST_LIST_SUCCESS": {
      if (action.isSharedSlug) {
        return {
          ...state,
          sharedPostLists: {
            ...state.sharedPostLists,
            [action.slug]: [...action.data],
          },
        };
      } else {
        return state;
      }
    }
    case "INCOMING_ACCEPTED_SHARED_USER": {
      return {
        ...state,
        workspaces: {
          ...state.workspaces,
          ...(state.workspaces[`${action.data.current_topic.id}-${action.data.shared_slug}`] && {
            [`${action.data.current_topic.id}-${action.data.shared_slug}`]: {
              ...state.workspaces[`${action.data.current_topic.id}-${action.data.shared_slug}`],
              members: state.workspaces[`${action.data.current_topic.id}-${action.data.shared_slug}`].members.map((m) => {
                if (m.id === action.data.current_user.id) {
                  return { ...m, has_accepted: true, active: 1, slug: action.data.current_user.slug, external_id: action.data.current_user.external_id };
                } else {
                  return m;
                }
              }),
            },
          }),
        },
      };
    }
    default:
      return state;
  }
};
