import {convertArrayToObject} from "../../helpers/arrayHelper";

const INITIAL_STATE = {
  user: null,
  files: {},
  channelFiles: {},
  viewFiles: null,
  pendingWorkspaceFilesUpload: {},
  progressWorkspaceFilesUpload: {},
  workspaceFiles: {},
  googleDriveApiFiles: {},
  companyFiles: {
    init: false,
    search_results: [],
    search_value: "",
    count: {
      all: 0,
      stars: 0,
      trash: 0,
      storage: 0,
    },
    has_more: true,
    skip: 0,
    limit: 100,
    items: {},
    favorite_files: {
      init: false,
      has_more: true,
      skip: 0,
      limit: 100,
      items: []
    },
    popular_files: {
      init: false,
      has_more: true,
      skip: 0,
      limit: 100,
      items: []
    },
    recently_edited: {
      init: false,
      has_more: true,
      skip: 0,
      limit: 100,
      items: []
    },
    trash_files: {
      init: false,
      has_more: true,
      skip: 0,
      limit: 100,
      items: {}
    }
  },
  companyFolders: {
    init: false,
    has_more: true,
    skip: 0,
    limit: 100,
    items: {}
  }
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "ADD_USER_TO_REDUCERS": {
      return {
        ...state,
        user: action.data,
      };
    }
    case "INCOMING_COMPANY_FOLDER": {
      return {
        ...state,
        companyFolders: {
          ...state.companyFolders,
          items: {
            ...state.companyFolders.items,
            [action.data.folder.id]: {
              ...action.data.folder,
              files: [],
              has_more: true,
              init: false,
              skip: 100,
              limit: 100,
            }
          }
        }
      }
    }
    case "INCOMING_COMPANY_UPDATED_FOLDER": {
      let folderItems = state.companyFolders.items;

      if (folderItems[action.data.folder.id])
        folderItems[action.data.folder.id] = {
          ...folderItems[action.data.folder.id],
          ...action.data.folder
        };

      return {
        ...state,
        companyFolders: {
          ...state.companyFolders,
          items: folderItems
        }
      }
    }
    case "INCOMING_COMPANY_DELETED_FOLDER": {
      let folderItems = state.companyFolders.items;

      if (folderItems[action.data.folder.id])
        folderItems[action.data.folder.id].is_archived = true;

      return {
        ...state,
        companyFolders: {
          ...state.companyFolders,
          items: folderItems
        }
      }
    }
    case "INCOMING_COMPANY_MOVE_FILE": {
      let folderItems = state.companyFolders.items;
      if (folderItems[action.data.folder_id]) {
        folderItems[action.data.folder_id].files.push(action.data.file_id)
      } else {
        folderItems[action.data.folder_id] = {
          init: false,
          skip: 0,
          limit: 100,
          files: [action.data.file_id]
        }
      }

      if (action.data.original_folder_id && folderItems[action.data.original_folder_id]) {
        const index = folderItems[action.data.original_folder_id].files.indexOf(action.data.folder_id);
        if (index > -1) {
          folderItems[action.data.original_folder_id].files.splice(index, 1);
        }
      }

      return {
        ...state,
        companyFolders: {
          ...state.companyFolders,
          items: folderItems
        }
      }
    }
    case "COMPANY_FILE_UPDATE":
    case "INCOMING_COMPANY_UPDATED_FILE": {
      let items = state.companyFiles.items;
      if (items[action.data.file.id]) {
        items[action.data.file.id] = action.data.file;
      }

      return {
        ...state,
        companyFiles: {
          ...state.companyFiles,
          items: items
        }
      }
    }
    case "INCOMING_COMPANY_RESTORE_FILE": {
      let items = state.companyFiles.trash_files.items;

      if (typeof items[action.data.file.id] === "undefined") {
        return state;
      }

      delete items[action.data.file.id];

      return {
        ...state,
        companyFiles: {
          ...state.companyFiles,
          count: {
            ...state.companyFiles.count,
            all: state.companyFiles.count.all + 1,
            stars: action.data.file.is_favorite ? (state.companyFiles.count.stars + 1) : state.companyFiles.count.stars,
            trash: state.companyFiles.count.trash - 1,
            storage: state.companyFiles.count.storage + action.data.file.size,
          },
          items: {
            ...state.companyFiles.items,
            [action.data.file.id]: action.data.file
          },
          trash_files: {
            ...state.companyFiles.trash_files,
            items: items
          }
        }
      }
    }
    case "INCOMING_REMOVED_COMPANY_FILE": {
      let items = state.companyFiles.items;

      if (typeof items[action.data.file_id] === "undefined") {
        if (typeof state.companyFiles.trash_files.items[action.data.file_id] !== "undefined") {
          items = state.companyFiles.trash_files.items;
          delete items[action.data.file_id];

          return {
            ...state,
            companyFiles: {
              ...state.companyFiles,
              count: {
                ...state.companyFiles.count,
                trash: state.companyFiles.count.trash - 1,
              },
              trash_files: {
                ...state.companyFiles.trash_files,
                items: items,
              }
            }
          }
        }

        return state;
      }

      const deletedItem = items[action.data.file_id];
      delete items[action.data.file_id];

      return {
        ...state,
        companyFiles: {
          ...state.companyFiles,
          count: {
            ...state.companyFiles.count,
            all: state.companyFiles.count.all - 1,
            stars: deletedItem.is_favorite ? (state.companyFiles.count.stars - 1) : state.companyFiles.count.stars,
            trash: state.companyFiles.count.trash + 1,
            storage: state.companyFiles.count.storage - deletedItem.size
          },
          items: items,
          favorite_files: {
            ...state.companyFiles.favorite_files,
            items: state.companyFiles.favorite_files.filter(id => id !== deletedItem.id),
          },
          popular_files: {
            ...state.companyFiles.popular_files,
            items: state.companyFiles.popular_files.filter(id => id !== deletedItem.id),
          },
          recently_edited: {
            ...state.companyFiles.recently_edited,
            items: state.companyFiles.recently_edited.filter(id => id !== deletedItem.id),
          },
          trash_files: {
            ...state.companyFiles.trash_files,
            items: {
              ...state.companyFiles.trash_files.items,
              [action.data.file_id]: deletedItem
            }
          }
        }
      }
    }
    case "INCOMING_COMPANY_EMPTY_TRASH": {
      let files = state.companyFiles.items;
      let trashItems = state.companyFiles.trash_files.items;
      let count = 0;
      let storage = 0;
      let stars = 0;
      let trash = 0;
      action.data.deleted_file_ids.forEach(id => {
        if (files[id]) {
          count += 1;
          storage += files[id].size;

          if (files[id].is_favorite) {
            stars += 1;
          }
          delete files[id];
        }

        if (trashItems[id]) {
          trash += 1;
          delete trashItems[id];
        }
      })

      let folders = state.companyFolders.items;
      action.data.deleted_folder_ids.forEach(id => {
        if (folders[id])
          delete folders[id];
      });

      return {
        ...state,
        companyFiles: {
          ...state.companyFiles,
          count: {
            ...state.companyFiles.count,
            all: state.companyFiles.count.all - count,
            stars: state.companyFiles.count.stars - stars,
            trash: state.companyFiles.count.trash - trash,
            storage: state.companyFiles.count.trash - storage,
          },
          items: files,
          trash_files: {
            ...state.companyFiles.trash_files,
            items: trashItems
          }
        },
        companyFolders: {
          ...state.companyFolders,
          items: folders
        }
      }
    }
    case "ADD_COMPANY_FILE_SEARCH_RESULTS": {
      return {
        ...state,
        companyFiles: {
          ...state.companyFiles,
          items: {
            ...state.companyFiles.items,
            ...convertArrayToObject(action.data.search_results, "id")
          },
          search_results: action.data.search_results.map((f) => f.id),
          search_value: action.data.search,
        }
      }
    }
    case "UPLOAD_COMPANY_FILES_REDUCER": {
      return {
        ...state,
        companyFiles: {
          ...state.companyFiles,
          init: true,
          skip: state.companyFiles.skip + state.companyFiles.limit,
          has_more: action.data.files.length === state.companyFiles.limit,
          items: {
            ...convertArrayToObject(action.data.files, "id"),
            ...state.companyFiles.items,
          },
        }
      }
    }
    case "INCOMING_COMPANY_FILES": {
      let items = state.companyFiles.items;
      let fileItems = Object.values(state.companyFiles.items).filter(f => f.uploading);

      let storage = 0;
      action.data.files.forEach(f => {
        const i = fileItems.find(file => file.size === f.size && file.search === f.search);
        delete items[i.id];
        items[f.id] = f;
        storage += f.size;
      })

      return {
        ...state,
        companyFiles: {
          ...state.companyFiles,
          items: items,
          count: {
            ...state.companyFiles.count,
            all: state.companyFiles.count.all + action.data.files.length,
            storage: state.companyFiles.count.storage + storage
          }
        }
      }
    }
    case "GET_COMPANY_FILES_SUCCESS": {
      let fileItems = state.companyFiles.items;
      let folderItems = state.companyFolders.items;

      action.data.files.forEach(f => {
        fileItems[f.id] = f;

        if (f.folder_id) {
          if (folderItems[f.folder_id]) {
            if (!folderItems[f.folder_id].files.includes(f.id)) {
              folderItems[f.folder_id].files.push(f.id);
            }
          }
        }
      })

      if (action.data.folder_id && folderItems[action.data.folder_id]) {
        folderItems[action.data.folder_id] = {
          ...folderItems[action.data.folder_id],
          init: false,
          has_more: action.data.files.length === folderItems[action.data.folder_id].limit,
          skip: folderItems[action.data.folder_id].skip + folderItems[action.data.folder_id].limit,
        }
      }

      return {
        ...state,
        companyFiles: {
          ...state.companyFiles,
          init: true,
          skip: state.companyFiles.skip + state.companyFiles.limit,
          has_more: action.data.files.length === state.companyFiles.limit,
          items: fileItems,
        },
        companyFolders: {
          ...state.companyFolders,
          items: folderItems
        }
      }
    }
    case "GET_COMPANY_FOLDERS_SUCCESS": {
      let items = state.companyFolders.items;
      action.data.folders.forEach(f => {
        items[f.id] = {
          ...f,
          init: false,
          has_more: true,
          skip: 0,
          limit: 100,
          files: []
        };
      });
      return {
        ...state,
        companyFolders: {
          ...state.companyFolders,
          init: true,
          skip: state.companyFolders.skip + state.companyFolders.limit,
          has_more: action.data.folders.length === state.companyFolders.limit,
          items: items,
        }
      }
    }
    case "GET_COMPANY_FILES_DETAIL_SUCCESS": {
      return {
        ...state,
        companyFiles: {
          ...state.companyFiles,
          count: {
            all: action.data.total_file_count,
            storage: action.data.total_storage,
            stars: action.data.total_file_stars,
            trash: action.data.total_file_trash,
          }
        },
      };
    }
    case "GET_COMPANY_FAVORITE_FILES_SUCCESS": {
      let items = state.companyFiles.items;
      action.data.files.forEach(f => {
        items[f.id] = f;
      })

      let fileItems = state.companyFiles.favorite_files.items;
      action.data.files.forEach(f => {
        if (!fileItems.includes(f.id)) {
          fileItems.push(f.id);
        }
      })

      return {
        ...state,
        companyFiles: {
          ...state.companyFiles,
          items: items,
          favorite_files: {
            ...state.companyFiles.favorite_files,
            has_more: action.data.files.length === state.companyFiles.favorite_files.limit,
            skip: state.companyFiles.favorite_files.skip + state.companyFiles.favorite_files.limit,
            items: fileItems,
          }
        }
      }
    }
    case "GET_COMPANY_POPULAR_FILES_SUCCESS": {
      let items = state.companyFiles.items;
      action.data.files.forEach(f => {
        items[f.id] = f;
      })

      let fileItems = state.companyFiles.popular_files.items;
      action.data.files.forEach(f => {
        if (!fileItems.includes(f.id)) {
          fileItems.push(f.id);
        }
      })

      return {
        ...state,
        companyFiles: {
          ...state.companyFiles,
          items: items,
          popular_files: {
            ...state.companyFiles.popular_files,
            has_more: action.data.files.length === state.companyFiles.popular_files.limit,
            skip: state.companyFiles.popular_files.skip + state.companyFiles.popular_files.limit,
            items: fileItems
          }
        }
      }
    }
    case "GET_COMPANY_RECENT_EDITED_FILES_SUCCESS": {
      let items = state.companyFiles.items;
      action.data.files.forEach(f => {
        items[f.id] = f;
      })

      let fileItems = state.companyFiles.recently_edited.items;
      action.data.files.forEach(f => {
        if (!fileItems.includes(f.id)) {
          fileItems.push(f.id);
        }
      })

      return {
        ...state,
        companyFiles: {
          ...state.companyFiles,
          items: items,
          recently_edited: {
            ...state.companyFiles.trash_files,
            has_more: action.data.files.length === state.companyFiles.recently_edited.limit,
            skip: state.companyFiles.recently_edited.skip + state.companyFiles.recently_edited.limit,
            items: fileItems
          }
        }
      }
    }
    case "GET_COMPANY_TRASHED_FILES_SUCCESS": {
      let fileItems = state.companyFiles.trash_files.items;
      action.data.files.forEach(f => {
        fileItems[f.id] = f;
      })

      return {
        ...state,
        companyFiles: {
          ...state.companyFiles,
          trash_files: {
            ...state.companyFiles.trash_files,
            has_more: action.data.files.length === state.companyFiles.trash_files.limit,
            skip: state.companyFiles.trash_files.skip + state.companyFiles.trash_files.limit,
            items: fileItems
          }
        }
      }
    }
    case "GET_FILES_SUCCESS": {
      return {
        ...state,
        files: convertArrayToObject(action.data.files, "id"),
      };
    }
    case "GET_CHANNEL_FILES_SUCCESS": {
      return {
        ...state,
        channelFiles: {
          ...state.channelFiles,
          [action.data.channel_id]: action.data.results,
          //temporary
          //[action.data.channel_id]: action.data.results.map(f => f.file_id)
        },
      };
    }
    case "INCOMING_CHAT_MESSAGE": {
      if (action.data.files.length) {
        let channelFiles = [];
        if (typeof state.channelFiles[action.data.channel_id] !== "undefined") {
          channelFiles = state.channelFiles[action.data.channel_id];
        }

        return {
          ...state,
          channelFiles: {
            ...state.channelFiles,
            [action.data.channel_id]: channelFiles.concat(action.data.files),
          },
        };
      } else {
        return state;
      }
    }
    case "ADD_CHANNEL_FILES": {
      let channelFiles = [];
      if (typeof state.channelFiles[action.data.channel_id] !== "undefined") {
        channelFiles = state.channelFiles[action.data.channel_id];
      }

      return {
        ...state,
        channelFiles: {
          ...state.channelFiles,
          [action.data.channel_id]: channelFiles.concat(action.data.files),
        },
      };
    }
    case "DELETE_CHANNEL_FILES": {
      let channelFiles = [];
      if (typeof state.channelFiles[action.data.channel_id] !== "undefined") {
        channelFiles = state.channelFiles[action.data.channel_id];
      }

      return {
        ...state,
        channelFiles: {
          ...state.channelFiles,
          [action.data.channel_id]: channelFiles.filter((cf) => {
            let fileFound = false;
            for (let i in action.data.file_ids) {
              if (cf.file_id === action.data.file_ids[i]) {
                fileFound = true;
              }
            }
            return !fileFound;
          }),
        },
      };
    }
    case "SET_VIEW_FILES": {
      return {
        ...state,
        viewFiles: action.data,
      };
    }
    case "PREPARE_WORKSPACE_FILES_UPLOAD": {
      return {
        ...state,
        pendingWorkspaceFilesUpload: {
          ...state.pendingWorkspaceFilesUpload,
          [action.data.workspace_id]: action.data,
        },
      };
    }
    case "PROCESS_WORKSPACE_FILES_UPLOAD": {
      let pendingWorkspaceFilesUpload = state.pendingWorkspaceFilesUpload;
      delete state.pendingWorkspaceFilesUpload[action.data.workspace_id];

      return {
        ...state,
        pendingWorkspaceFilesUpload: pendingWorkspaceFilesUpload,
        progressWorkspaceFilesUpload: {
          ...state.progressWorkspaceFilesUpload,
          [action.data.workspace_id]: action.data,
        },
      };
    }
    case "UPLOADING_WORKSPACE_FILES_SUCCESS": {
      let progressWorkspaceFilesUpload = state.progressWorkspaceFilesUpload;
      delete state.progressWorkspaceFilesUpload[action.data.workspace_id];

      return {
        ...state,
        progressWorkspaceFilesUpload: progressWorkspaceFilesUpload,
      };
    }
    case "ADD_PRIMARY_FILES": {
      let newWorkspaceFiles = {...state.workspaceFiles};
      if (newWorkspaceFiles.hasOwnProperty(action.data.id)) {
        newWorkspaceFiles = {
          [action.data.id]: {
            ...newWorkspaceFiles[action.data.id],
            files: {...convertArrayToObject(action.data.files, "id"), ...newWorkspaceFiles[action.data.id].files},
          },
        };
      } else {
        newWorkspaceFiles = {
          ...newWorkspaceFiles,
          [action.data.id]: {
            files: convertArrayToObject(action.data.files, "id"),
            folders: {},
            storage: 0,
            count: 0,
            stars: 0,
            trash: 0,
            popular_files: [],
            recently_edited: [],
            favorite_files: [],
            trash_files: {},
            search_results: [],
            search_value: "",
          },
        };
      }
      return {
        ...state,
        workspaceFiles: newWorkspaceFiles,
      };
    }
    case "ADD_TO_WORKSPACE_POSTS": {
      if (action.data.files.length) {
        let newWorkspaceFiles = {...state.workspaceFiles};
        if (newWorkspaceFiles.hasOwnProperty(action.data.topic_id)) {
          newWorkspaceFiles = {
            [action.data.topic_id]: {
              ...newWorkspaceFiles[action.data.topic_id],
              files: {...convertArrayToObject(action.data.files, "id"), ...newWorkspaceFiles[action.data.topic_id].files},
            },
          };
        } else {
          newWorkspaceFiles = {
            ...newWorkspaceFiles,
            [action.data.topic_id]: {
              files: convertArrayToObject(action.data.files, "id"),
              folders: {},
              storage: 0,
              count: 0,
              stars: 0,
              trash: 0,
              popular_files: [],
              recently_edited: [],
              favorite_files: [],
              trash_files: {},
              search_results: [],
              search_value: "",
            },
          };
        }
        return {
          ...state,
          workspaceFiles: newWorkspaceFiles,
        };
      } else return state;
    }
    case "GET_WORKSPACE_FILES_SUCCESS": {
      let newWorkspaceFiles = {...state.workspaceFiles};
      if (newWorkspaceFiles.hasOwnProperty(action.data.topic_id)) {
        if (action.data.folder_id && newWorkspaceFiles[action.data.topic_id].folders.hasOwnProperty(action.data.folder_id)) {
          newWorkspaceFiles[action.data.topic_id].folders[action.data.folder_id].loaded = true;
          newWorkspaceFiles[action.data.topic_id].folders[action.data.folder_id].files = action.data.files.filter((f) => f.folder_id === action.data.folder_id).map((f) => f.id);
        }
        newWorkspaceFiles = {
          [action.data.topic_id]: {
            ...newWorkspaceFiles[action.data.topic_id],
            files: {...convertArrayToObject(action.data.files, "id"), ...newWorkspaceFiles[action.data.topic_id].files},
            loaded: true,
          },
        };
      } else {
        newWorkspaceFiles = {
          ...newWorkspaceFiles,
          [action.data.topic_id]: {
            files: convertArrayToObject(action.data.files, "id"),
            folders: {},
            storage: 0,
            count: 0,
            stars: 0,
            trash: 0,
            popular_files: [],
            recently_edited: [],
            favorite_files: [],
            trash_files: {},
            search_results: [],
            search_value: "",
            loaded: true,
          },
        };
      }
      return {
        ...state,
        workspaceFiles: newWorkspaceFiles,
      };
    }
    case "GET_WORKSPACE_GOOGLE_FILE_ATTACHMENTS_SUCCESS": {
      let newWorkspaceFiles = {...state.workspaceFiles};
      if (newWorkspaceFiles.hasOwnProperty(action.data.topic_id)) {

        let gFiles = action.data.attachments.map((attachment) => {
          return {
            created_at: {
              timestamp: attachment.payload.lastEditedUtc
            },
            download_link: attachment.payload.embedUrl,
            folder_id: null,
            id: attachment.id,
            payload_id: attachment.payload.id,
            is_favorite: false,
            link_id: action.data.topic_id,
            link_index_id: 0,
            link_type: "TOPIC",
            mime_type: attachment.payload.mimeType,
            search: attachment.payload.name,
            size: attachment.payload.sizeBytes,
            type: attachment.payload.type,
            attachment_type: attachment.attachment_type
          }
        });

        newWorkspaceFiles[action.data.topic_id].files = {...newWorkspaceFiles[action.data.topic_id].files, ...convertArrayToObject(gFiles, "id")};
      }

      return {
        ...state,
        workspaceFiles: newWorkspaceFiles,
      };
    }
    case "GET_WORKSPACE_GOOGLE_FOLDER_ATTACHMENTS_SUCCESS": {
      let newWorkspaceFiles = {...state.workspaceFiles};
      if (newWorkspaceFiles.hasOwnProperty(action.data.topic_id)) {
        if (newWorkspaceFiles[action.data.topic_id].hasOwnProperty("folders")) {
          action.data.attachments.map((a) => {
            newWorkspaceFiles[a.link_id].folders[a.id] = {
              id: a.id,
              is_archived: false,
              parent_folder: null,
              search: a.payload.name,
              payload: a.payload,
              created_at: {timestamp: a.payload.lastEditedUtc},
              updated_at: {timestamp: a.payload.lastEditedUtc},
              files: [],
              link_type: a.link_type,
              link_id: a.link_index_id,
              attachment_type: a.attachment_type
            }
          })
        }
      }

      return {
        ...state,
        workspaceFiles: newWorkspaceFiles,
      };
    }
    case "INCOMING_GOOGLE_FILE": {
      let updatedWorkspaceFiles = {...state.workspaceFiles};
      if (updatedWorkspaceFiles.hasOwnProperty(action.data.link_id)) {
        if (updatedWorkspaceFiles[action.data.link_id].hasOwnProperty("folders")) {
          let file = {
            created_at: action.data.created_at,
            user_id: action.data.user_id,
            folder_id: null,
            download_link: action.data.payload.embedUrl,
            id: action.data.id,
            payload_id: action.data.payload.id,
            is_favorite: false,
            link_id: parseInt(action.data.link_id),
            link_index_id: 0,
            link_type: "TOPIC",
            mime_type: action.data.payload.mimeType,
            search: action.data.payload.name,
            size: action.data.payload.sizeBytes,
            type: action.data.payload.type,
            payload: action.data.payload
          };
          updatedWorkspaceFiles[action.data.link_id].files[action.data.id] = file;
        }
      }
      return {
        ...state,
        workspaceFiles: updatedWorkspaceFiles
      }
    }
    case "INCOMING_GOOGLE_FOLDER": {
      let updatedWorkspaceFiles = {...state.workspaceFiles};
      if (updatedWorkspaceFiles.hasOwnProperty(action.data.link_id)) {
        if (updatedWorkspaceFiles[action.data.link_id].hasOwnProperty("folders")) {
          let folder = {
            id: action.data.id,
            is_archived: false,
            parent_folder: null,
            search: action.data.payload.name,
            payload: action.data.payload,
            created_at: action.data.created_at,
            updated_at: action.data.updated_at,
            files: []
          };
          updatedWorkspaceFiles[action.data.link_id].folders[action.data.id] = folder;
        }
      }
      return {
        ...state,
        workspaceFiles: updatedWorkspaceFiles
      }
    }
    case "GET_WORKSPACE_FILE_DETAILS_SUCCESS": {
      let newWorkspaceFiles = {...state.workspaceFiles};
      if (newWorkspaceFiles.hasOwnProperty(action.data.topic_id)) {
        newWorkspaceFiles = {
          [action.data.topic_id]: {
            ...newWorkspaceFiles[action.data.topic_id],
            storage: action.data.total_storage,
            count: action.data.total_file_count,
            stars: action.data.total_file_stars,
            trash: action.data.total_file_trash,
          },
        };
      } else {
        newWorkspaceFiles = {
          ...newWorkspaceFiles,
          [action.data.topic_id]: {
            ...newWorkspaceFiles[action.data.topic_id],
            storage: action.data.total_storage,
            count: action.data.total_file_count,
            stars: action.data.total_file_stars,
            trash: action.data.total_file_trash,
          },
        };
      }
      return {
        ...state,
        workspaceFiles: newWorkspaceFiles,
      };
    }
    case "GET_WORKSPACE_TRASH_FILES_SUCCESS": {
      let newWorkspaceFiles = {...state.workspaceFiles};
      if (newWorkspaceFiles.hasOwnProperty(action.data.topic_id)) {
        newWorkspaceFiles = {
          [action.data.topic_id]: {
            ...newWorkspaceFiles[action.data.topic_id],
            //files: {...convertArrayToObject(action.data.files, "id"), ...newWorkspaceFiles[action.data.topic_id].files},
            trash_files: convertArrayToObject(action.data.files, "id"),
          },
        };
      } else {
        newWorkspaceFiles = {
          ...newWorkspaceFiles,
          [action.data.topic_id]: {
            ...newWorkspaceFiles[action.data.topic_id],
            //files: {...convertArrayToObject(action.data.files, "id"), ...newWorkspaceFiles[action.data.topic_id].files},
            trash_files: convertArrayToObject(action.data.files, "id"),
          },
        };
      }
      return {
        ...state,
        workspaceFiles: newWorkspaceFiles,
      };
    }
    case "GET_WORKSPACE_FAVORITE_FILES_SUCCESS": {
      let newWorkspaceFiles = {...state.workspaceFiles};
      if (newWorkspaceFiles.hasOwnProperty(action.data.topic_id)) {
        newWorkspaceFiles = {
          [action.data.topic_id]: {
            ...newWorkspaceFiles[action.data.topic_id],
            files: {...convertArrayToObject(action.data.files, "id"), ...newWorkspaceFiles[action.data.topic_id].files},
            favorite_files: action.data.files.map((f) => f.id),
          },
        };
      } else {
        newWorkspaceFiles = {
          ...newWorkspaceFiles,
          [action.data.topic_id]: {
            ...newWorkspaceFiles[action.data.topic_id],
            files: {...convertArrayToObject(action.data.files, "id"), ...newWorkspaceFiles[action.data.topic_id].files},
            favorite_files: action.data.files.map((f) => f.id),
          },
        };
      }
      return {
        ...state,
        workspaceFiles: newWorkspaceFiles,
      };
    }
    case "GET_WORKSPACE_POPULAR_FILES_SUCCESS": {
      let newWorkspaceFiles = {...state.workspaceFiles};
      if (newWorkspaceFiles.hasOwnProperty(action.data.topic_id)) {
        newWorkspaceFiles = {
          [action.data.topic_id]: {
            ...newWorkspaceFiles[action.data.topic_id],
            popular_files: action.data.files.map((f) => f.id),
          },
        };
      } else {
        newWorkspaceFiles = {
          ...newWorkspaceFiles,
          [action.data.topic_id]: {
            ...newWorkspaceFiles[action.data.topic_id],
            popular_files: action.data.files.map((f) => f.id),
          },
        };
      }
      return {
        ...state,
        workspaceFiles: newWorkspaceFiles,
      };
    }
    case "GET_WORKSPACE_RECENT_EDIT_FILES_SUCCESS": {
      let newWorkspaceFiles = {...state.workspaceFiles};
      if (newWorkspaceFiles.hasOwnProperty(action.data.topic_id)) {
        newWorkspaceFiles = {
          [action.data.topic_id]: {
            ...newWorkspaceFiles[action.data.topic_id],
            recently_edited: action.data.files.map((f) => f.id),
          },
        };
      } else {
        newWorkspaceFiles = {
          ...newWorkspaceFiles,
          [action.data.topic_id]: {
            ...newWorkspaceFiles[action.data.topic_id],
            recently_edited: action.data.files.map((f) => f.id),
          },
        };
      }
      return {
        ...state,
        workspaceFiles: newWorkspaceFiles,
      };
    }
    case "GET_WORKSPACE_FOLDER_SUCCESS": {
      let newWorkspaceFiles = {...state.workspaceFiles};
      let folders = action.data.folders.map((f) => {
        return {
          ...f,
          files: []
        }
      })
      if (newWorkspaceFiles.hasOwnProperty(action.data.topic_id)) {
        newWorkspaceFiles = {
          [action.data.topic_id]: {
            ...newWorkspaceFiles[action.data.topic_id],
            folders: {...convertArrayToObject(folders, "id"), ...newWorkspaceFiles[action.data.topic_id].folders}
          },
        };
      } else {
        newWorkspaceFiles = {
          ...newWorkspaceFiles,
          [action.data.topic_id]: {
            ...newWorkspaceFiles[action.data.topic_id],
            folders: convertArrayToObject(folders, "id"),
          },
        };
      }
      return {
        ...state,
        workspaceFiles: newWorkspaceFiles,
      };
    }
    case "INCOMING_FOLDER": {
      let newWorkspaceFiles = {...state.workspaceFiles};
      if (newWorkspaceFiles.hasOwnProperty(action.data.topic_id)) {
        if (newWorkspaceFiles[action.data.topic_id].hasOwnProperty("folders")) {
          newWorkspaceFiles = {
            ...newWorkspaceFiles,
            [action.data.topic_id]: {
              ...newWorkspaceFiles[action.data.topic_id],
              folders: {
                ...newWorkspaceFiles[action.data.topic_id].folders,
                [action.data.folder.id]: {
                  ...action.data.folder,
                  loaded: true,
                  files: []
                }
              },
            },
          };
          return {
            ...state,
            workspaceFiles: newWorkspaceFiles,
          };
        } else {
          return state;
        }
      } else {
        return state;
      }
    }
    case "INCOMING_DELETED_FOLDER": {
      let newWorkspaceFiles = {...state.workspaceFiles};
      if (newWorkspaceFiles.hasOwnProperty(action.data.topic_id)) {
        if (newWorkspaceFiles[action.data.topic_id].hasOwnProperty("folders")) {
          newWorkspaceFiles[action.data.topic_id].folders[action.data.folder.id].is_archived = true;
          newWorkspaceFiles[action.data.topic_id].folders[action.data.folder.id].files.forEach((f) => {
            newWorkspaceFiles[action.data.topic_id].trash_files[f] = newWorkspaceFiles[action.data.topic_id].files[f];
            delete newWorkspaceFiles[action.data.topic_id].files[f];
          });
          newWorkspaceFiles[action.data.topic_id].trash = newWorkspaceFiles[action.data.topic_id].folders[action.data.folder.id].files.length + newWorkspaceFiles[action.data.topic_id].trash;
          return {
            ...state,
            workspaceFiles: newWorkspaceFiles,
          };
        } else {
          return state;
        }
      } else {
        return state;
      }
    }
    case "INCOMING_REMOVED_FOLDER": {
      let newWorkspaceFiles = {...state.workspaceFiles};
      if (newWorkspaceFiles.hasOwnProperty(action.data.topic_id)) {
        if (newWorkspaceFiles[action.data.topic_id].hasOwnProperty("folders")) {
          delete newWorkspaceFiles[action.data.topic_id].folders[action.data.folder.id];
          return {
            ...state,
            workspaceFiles: newWorkspaceFiles,
          };
        } else {
          return state;
        }
      } else {
        return state;
      }
    }
    case "INCOMING_FILE": {
      let newWorkspaceFiles = {...state.workspaceFiles};
      if (newWorkspaceFiles.hasOwnProperty(action.data.topic_id)) {
        // if (newWorkspaceFiles[action.data.topic_id].hasOwnProperty("folders")) {
        newWorkspaceFiles = {
          ...newWorkspaceFiles,
          [action.data.topic_id]: {
            ...newWorkspaceFiles[action.data.topic_id],
            files: {
              ...newWorkspaceFiles[action.data.topic_id].files,
              [action.data.file.id]: action.data.file,
            },
          },
        };
        return {
          ...state,
          workspaceFiles: newWorkspaceFiles,
        };
        // } else {
        //     return state;
        // }
      } else {
        return state;
      }
    }
    case "INCOMING_FILES": {
      let newWorkspaceFiles = {...state.workspaceFiles};
      if (newWorkspaceFiles.hasOwnProperty(action.data.topic_id)) {
        let add = (total, num) => total + num;
        if (newWorkspaceFiles[action.data.topic_id].hasOwnProperty("folders") && action.data.folder_id) {
          if (newWorkspaceFiles[action.data.topic_id].folders.hasOwnProperty(action.data.folder_id)) {
            newWorkspaceFiles[action.data.topic_id].folders[action.data.folder_id].files = [...newWorkspaceFiles[action.data.topic_id].folders[action.data.folder_id].files, ...action.data.files.map((f) => f.id)];
          }
        }
        newWorkspaceFiles[action.data.topic_id].files = {...convertArrayToObject(action.data.files, "id"), ...newWorkspaceFiles[action.data.topic_id].files};
        Object.values(newWorkspaceFiles[action.data.topic_id].files).map((f) => {
          if (typeof f.id === "string") {
            action.data.files.forEach((af) => {
              if (af.size === f.size && af.search === f.search) {
                delete newWorkspaceFiles[action.data.topic_id].files[f.id];
              }
            });
          }
        });
        newWorkspaceFiles[action.data.topic_id].count = Object.keys(newWorkspaceFiles[action.data.topic_id].files).length;
        newWorkspaceFiles[action.data.topic_id].storage = Object.values(newWorkspaceFiles[action.data.topic_id].files).filter((f) => typeof f.size === "number").map((f) => f.size).reduce(add);
        return {
          ...state,
          workspaceFiles: newWorkspaceFiles,
        };
      } else {
        return state;
      }
    }
    case "UPLOAD_FILES_REDUCER": {
      let newWorkspaceFiles = {...state.workspaceFiles};
      if (newWorkspaceFiles.hasOwnProperty(action.data.topic_id)) {
        if (newWorkspaceFiles[action.data.topic_id].hasOwnProperty("folders") && action.data.folder_id) {
          newWorkspaceFiles[action.data.topic_id].folders[action.data.folder_id].files = [...newWorkspaceFiles[action.data.topic_id].folders[action.data.folder_id].files, ...action.data.files.map((f) => f.id)];
        }
        newWorkspaceFiles[action.data.topic_id].files = {...convertArrayToObject(action.data.files, "id"), ...newWorkspaceFiles[action.data.topic_id].files};
        return {
          ...state,
          workspaceFiles: newWorkspaceFiles,
        };
      } else {
        return state;
      }
    }
    case "ADD_FILE_SEARCH_RESULTS": {
      let newWorkspaceFiles = {...state.workspaceFiles};
      if (newWorkspaceFiles.hasOwnProperty(action.data.topic_id)) {
        newWorkspaceFiles = {
          [action.data.topic_id]: {
            ...newWorkspaceFiles[action.data.topic_id],
            files: {...convertArrayToObject(action.data.search_results, "id"), ...newWorkspaceFiles[action.data.topic_id].files},
            search_results: action.data.search_results.map((f) => f.id),
            search_value: action.data.search,
          },
        };
      }
      return {
        ...state,
        workspaceFiles: newWorkspaceFiles,
      };
    }
    case "CLEAR_FILE_SEARCH_RESULTS": {
      let newWorkspaceFiles = {...state.workspaceFiles};
      if (newWorkspaceFiles.hasOwnProperty(action.data.topic_id)) {
        newWorkspaceFiles = {
          [action.data.topic_id]: {
            ...newWorkspaceFiles[action.data.topic_id],
            search_results: [],
            search_value: "",
          },
        };
      }
      return {
        ...state,
        workspaceFiles: newWorkspaceFiles,
      };
    }
    case "INCOMING_DELETED_FILE": {
      if (typeof state.workspaceFiles[action.data.topic_id] === "undefined"
        && typeof state.workspaceFiles[action.data.topic_id].files[action.data.file_id])
        return state;

      let items = state.workspaceFiles[action.data.topic_id];
      let file = items.files[action.data.file_id];

      items.storage -= file.size;
      items.count -= 1;
      items.trash += 1;
      items.trash_files[action.data.file_id] = file;
      items.recently_edited.filter(id => id !== file.id);

      if (file.folder_id && items.folders[file.folder_id]) {
        let index = items.folders[file.folder_id].files.findIndex(file.id);
        if (index !== -1) {
          items.folders[file.folder_id].files.splice(index, 1);
        }
      }

      delete items.files[file.id];

      return {
        ...state,
        workspaceFiles: {
          ...state.workspaceFiles,
          [action.data.topic_id]: items
        }
      }
    }
    case "INCOMING_DELETED_FILES": {
      let newWorkspaceFiles = {...state.workspaceFiles};
      if (newWorkspaceFiles.hasOwnProperty(action.data.topic_id)) {
        newWorkspaceFiles[action.data.topic_id].count = newWorkspaceFiles[action.data.topic_id].count - action.data.deleted_file_ids.length;
        newWorkspaceFiles[action.data.topic_id].trash = newWorkspaceFiles[action.data.topic_id].trash + action.data.deleted_file_ids.length;
        let deletedFiles = Object.values(newWorkspaceFiles[action.data.topic_id].files).filter((f) => {
          return action.data.deleted_file_ids.some((df) => df === f.id);
        });
        newWorkspaceFiles[action.data.topic_id].trash_files = {...convertArrayToObject(deletedFiles, "id"), ...newWorkspaceFiles[action.data.topic_id].trash_files};
        action.data.deleted_file_ids.map((df) => {
          delete newWorkspaceFiles[action.data.topic_id].files[df];
        });

        if (newWorkspaceFiles[action.data.topic_id].hasOwnProperty("folders")) {
          Object.values(newWorkspaceFiles[action.data.topic_id].folders).forEach((f) => {
            if (f.hasOwnProperty("files") && newWorkspaceFiles[action.data.topic_id].folders[f.id].files.length) {
              newWorkspaceFiles[action.data.topic_id].folders[f.id].files = newWorkspaceFiles[action.data.topic_id].folders[f.id].files.filter((id) => {
                return !action.data.deleted_file_ids.some((df) => df === id)
              });
            } else {
            }
          });
          return {
            ...state,
            workspaceFiles: newWorkspaceFiles,
          };
        } else {
          return {
            ...state,
            workspaceFiles: newWorkspaceFiles,
          };
        }
      } else {
        return state;
      }
    }
    case "INCOMING_REMOVED_FILE": {
      let newWorkspaceFiles = {...state.workspaceFiles};
      if (newWorkspaceFiles.hasOwnProperty(action.data.topic_id)) {
        delete newWorkspaceFiles[action.data.topic_id].trash_files[action.data.file_id];
        newWorkspaceFiles[action.data.topic_id].trash = newWorkspaceFiles[action.data.topic_id].trash - 1;
        return {
          ...state,
          workspaceFiles: newWorkspaceFiles,
        };
      } else {
        return state;
      }
    }
    case "ADD_REMOVE_FAVORITE": {
      if (action.data.topic_id) {
        let newWorkspaceFiles = {...state.workspaceFiles};
        newWorkspaceFiles[action.data.topic_id].files[action.data.file_id].is_favorite = action.data.is_favorite;
        newWorkspaceFiles = {
          ...newWorkspaceFiles,
          [action.data.topic_id]: {
            ...newWorkspaceFiles[action.data.topic_id],
            stars: action.data.is_favorite ? newWorkspaceFiles[action.data.topic_id].stars + 1 : newWorkspaceFiles[action.data.topic_id].stars - 1,
            favorite_files: action.data.is_favorite ? [...newWorkspaceFiles[action.data.topic_id].favorite_files, action.data.file_id] : newWorkspaceFiles[action.data.topic_id].favorite_files.filter((id) => id !== action.data.file_id),
          },
        };
        return {
          ...state,
          workspaceFiles: newWorkspaceFiles,
        };
      } else {
        let items = state.companyFiles.items;

        if (items[action.data.file_id]) {
          items[action.data.file_id].is_favorite = action.data.is_favorite;
        }

        let favorite_files_items = state.companyFiles.favorite_files.items;
        const index = favorite_files_items.findIndex(x => x.id === action.data.file_id);
        if (index !== -1) {
          if (action.data.is_favorite) {
            favorite_files_items[index].is_favorite = action.data.is_favorite;
          } else {
            favorite_files_items.splice(index, 1);
          }
        } else if (action.data.is_favorite) {
          favorite_files_items.push(items[action.data.file_id]);
        }

        return {
          ...state,
          companyFiles: {
            ...state.companyFiles,
            count: {
              ...state.companyFiles.count,
              stars: action.data.is_favorite ? state.companyFiles.count.stars + 1 : state.companyFiles.count.stars - 1
            },
            items: items,
            favorite_files: {
              ...state.companyFiles.favorite_files,
              items: favorite_files_items
            }
          }
        };
      }
    }
    case "INCOMING_RESTORE_FILE": {

      if (typeof state.workspaceFiles[action.data.topic.id] === "undefined")
        return state;

      let items = state.workspaceFiles[action.data.topic.id];

      if (items.trash_files[action.data.file.id]) {
        items.files[action.data.file.id] = action.data.file;
        delete items.trash_files[action.data.file.id];
      }

      if (action.data.folder && items.folders[action.data.folder.id] && !items.folders[action.data.folder.id].files.includes(action.data.file.id)) {
        items.folders[action.data.folder.id].files.push(action.data.file.id);
      }

      if (action.data.file.is_favorite && !items.favorite_files.includes(action.data.file.id)) {
        items.favorite_files.push(action.data.file.id);
        items.stars += 1;
      }

      items.trash -= 1;
      items.count += 1;
      items.storage += action.data.file.size;

      return {
        ...state,
        workspaceFiles: {
          ...state.workspaceFiles,
          [action.data.topic.id]: items
        }
      }
    }
    case "INCOMING_MOVED_FILE": {
      let newWorkspaceFiles = {...state.workspaceFiles};
      if (newWorkspaceFiles.hasOwnProperty(action.data.topic_id)) {
        if (newWorkspaceFiles[action.data.topic_id].folders.hasOwnProperty(action.data.original_folder_id) && newWorkspaceFiles[action.data.topic_id].folders[action.data.original_folder_id].hasOwnProperty("files")) {
          newWorkspaceFiles[action.data.topic_id].folders[action.data.original_folder_id].files = newWorkspaceFiles[action.data.topic_id].folders[action.data.original_folder_id].files.filter((id) => id !== action.data.file_id);
        }
        if (newWorkspaceFiles[action.data.topic_id].folders.hasOwnProperty(action.data.folder_id) && newWorkspaceFiles[action.data.topic_id].folders[action.data.folder_id].hasOwnProperty("loaded")) {
          newWorkspaceFiles[action.data.topic_id].folders[action.data.folder_id].files = [...newWorkspaceFiles[action.data.topic_id].folders[action.data.folder_id].files, action.data.file_id];
          return {
            ...state,
            workspaceFiles: newWorkspaceFiles,
          };
        } else {
          return {
            ...state,
            workspaceFiles: newWorkspaceFiles,
          };
        }
      } else {
        return state;
      }
    }
    case "INCOMING_EMPTY_TRASH": {
      let newWorkspaceFiles = {...state.workspaceFiles};
      if (newWorkspaceFiles.hasOwnProperty(action.data.topic_id) && newWorkspaceFiles[action.data.topic_id].hasOwnProperty("trash_files")) {
        let add = (total, num) => total + num;
        let totalSize = 0;
        if (action.data.deleted_file_ids.length) {
          totalSize = Object.values(state.workspaceFiles[action.data.topic_id].trash_files).filter((f) => typeof f !== "undefined")
            .filter((f) => {
              return action.data.deleted_file_ids.some((df) => df === f.id);
            }).map((f) => f.size).reduce(add);
        }

        newWorkspaceFiles[action.data.topic_id].trash_files = {};
        newWorkspaceFiles[action.data.topic_id].trash = 0;
        newWorkspaceFiles[action.data.topic_id].storage = newWorkspaceFiles[action.data.topic_id].storage - totalSize;
        Object.values(newWorkspaceFiles[action.data.topic_id].folders).forEach((f) => {
          if (f.is_archived) {
            delete newWorkspaceFiles[action.data.topic_id].folders[f.id];
          }
        });
        return {
          ...state,
          workspaceFiles: newWorkspaceFiles,
        };
      } else {
        return state;
      }
    }
    case "FETCH_TIMELINE_SUCCESS": {
      let newWorkspaceFiles = {...state.workspaceFiles};
      if (newWorkspaceFiles.hasOwnProperty(action.data.topic_id)) {
        newWorkspaceFiles[action.data.topic_id].files = {
          ...convertArrayToObject(
            action.data.timeline.filter((t) => t.tag === "DOCUMENT").map((i) => i.item),
            "id"
          ),
          ...newWorkspaceFiles[action.data.topic_id].files,
        };
      } else {
        newWorkspaceFiles = {
          ...newWorkspaceFiles,
          [action.data.topic_id]: {
            files: convertArrayToObject(
              action.data.timeline.filter((t) => t.tag === "DOCUMENT").map((i) => i.item),
              "id"
            ),
            folders: {},
            storage: 0,
            count: 0,
            stars: 0,
            trash: 0,
            popular_files: [],
            recently_edited: [],
            favorite_files: [],
            trash_files: {},
            search_results: [],
            search_value: "",
          },
        };
      }
      return {
        ...state,
        workspaceFiles: newWorkspaceFiles,
      };
    }
    case "INCOMING_COMMENT": {
      let newWorkspaceFiles = {...state.workspaceFiles};

      if (action.data.workspaces.length && action.data.files.length) {
        action.data.workspaces.forEach((ws) => {
          if (newWorkspaceFiles.hasOwnProperty(ws.topic_id)) {
            newWorkspaceFiles[ws.topic_id].files = {...convertArrayToObject(action.data.files, "id"), ...newWorkspaceFiles[ws.topic_id].files};
          }
        });
        return {
          ...state,
          workspaceFiles: newWorkspaceFiles,
        };
      } else {
        return state;
      }
    }
    case "INCOMING_POST": {
      let newWorkspaceFiles = {...state.workspaceFiles};
      if (action.data.files.length) {
        action.data.recipient_ids.forEach((id) => {
          if (newWorkspaceFiles.hasOwnProperty(id)) {
            newWorkspaceFiles[id].files = {...convertArrayToObject(action.data.files, "id"), ...newWorkspaceFiles[id].files};
          }
        });
        return {
          ...state,
          workspaceFiles: newWorkspaceFiles,
        };
      } else {
        return state;
      }
    }
    case "INCOMING_DELETED_POST_FILE": {
      let newWorkspaceFiles = {...state.workspaceFiles};
      if (action.data.connected_workspace.length && Object.keys(newWorkspaceFiles).length) {
        action.data.connected_workspace.forEach((ws) => {
          if (newWorkspaceFiles.hasOwnProperty(ws.topic_id) && newWorkspaceFiles[ws.topic_id].hasOwnProperty("files")) {
            delete newWorkspaceFiles[ws.topic_id].files[action.data.file_id];
          }
        });
      } else {
        return state;
      }

      return state;
    }
    case "ADD_GOOGLE_DRIVE_FILE": {
      return {
        ...state,
        googleDriveApiFiles: {
          ...state.googleDriveApiFiles,
          [action.data.file_id]: action.data.metadata
        }
      }
    }
    case "INCOMING_DELETED_GOOGLE_FILE": {
      let updatedWorkspaceFiles = {...state.workspaceFiles};
      let workspace = {
        id: action.data.data_type.topic.id,
        name: action.data.data_type.topic.name,
        folder_id: action.data.data_type.workspace ? action.data.data_type.workspace.id : null,
        folder_name: action.data.data_type.workspace ? action.data.data_type.workspace.name : null,
      }
      if (updatedWorkspaceFiles.hasOwnProperty(workspace.id)) {
        if (updatedWorkspaceFiles[workspace.id].files.hasOwnProperty(action.data.attachment_id)) {
          delete updatedWorkspaceFiles[workspace.id].files[action.data.attachment_id];
        } else if (updatedWorkspaceFiles[workspace.id].folders.hasOwnProperty(action.data.attachment_id)) {
          delete updatedWorkspaceFiles[workspace.id].folders[action.data.attachment_id];
        }
      }
      return {
        ...state,
        workspaceFiles: updatedWorkspaceFiles
      }
    }
    default:
      return state;
  }
};
