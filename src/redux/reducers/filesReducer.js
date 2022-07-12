import { convertArrayToObject } from "../../helpers/arrayHelper";

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
    driveLinks: {},
    favorite_files: {
      init: false,
      has_more: true,
      skip: 0,
      limit: 100,
      items: [],
    },
    popular_files: {
      init: false,
      has_more: true,
      skip: 0,
      limit: 100,
      items: [],
    },
    recently_edited: {
      init: false,
      has_more: true,
      skip: 0,
      limit: 100,
      items: [],
    },
    google_files: {
      init: false,
      has_more: true,
      skip: 0,
      limit: 100,
      items: [],
    },
    trash_files: {
      init: false,
      has_more: true,
      skip: 0,
      limit: 100,
      items: {},
    },
  },
  companyFolders: {
    init: false,
    has_more: true,
    skip: 0,
    limit: 100,
    items: {},
    google_folders: {
      init: false,
      has_more: true,
      skip: 0,
      limit: 100,
      items: [],
    },
  },
  gifBlobs: {},
  fileBlobs: {},
  fileThumbnailBlobs: {},
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
            ...(action.data.folder.parent_folder &&
              state.companyFolders.items[action.data.folder.parent_folder.id] && {
                [action.data.folder.parent_folder.id]: {
                  ...state.companyFolders.items[action.data.folder.parent_folder.id],
                  subFolders: [...state.companyFolders.items[action.data.folder.parent_folder.id].subFolders, action.data.folder],
                },
              }),
            [action.data.folder.id]: {
              ...action.data.folder,
              files: [],
              has_more: true,
              init: false,
              skip: 100,
              limit: 100,
            },
          },
        },
      };
    }
    case "INCOMING_COMPANY_UPDATED_FOLDER": {
      let folderItems = state.companyFolders.items;

      if (folderItems[action.data.folder.id])
        folderItems[action.data.folder.id] = {
          ...folderItems[action.data.folder.id],
          ...action.data.folder,
        };

      return {
        ...state,
        companyFolders: {
          ...state.companyFolders,
          items: folderItems,
        },
      };
    }
    case "INCOMING_COMPANY_DELETED_FOLDER": {
      let folderItems = state.companyFolders.items;

      if (folderItems[action.data.folder.id]) folderItems[action.data.folder.id].is_archived = true;

      action.data.connected_folder_ids.forEach((id) => {
        if (typeof folderItems[id] !== "undefined") {
          folderItems[id].is_archived = true;
        }
      });

      let companyFiles = state.companyFiles;
      action.data.connected_file_ids.forEach((id) => {
        if (typeof companyFiles.items[id] !== "undefined") {
          companyFiles.count = {
            all: companyFiles.count.all - 1,
            stars: companyFiles.count.stars - (companyFiles.items[id].is_favorite ? 1 : 0),
            trash: companyFiles.count.trash + 1,
            storage: companyFiles.count.storage - companyFiles.items[id].size,
          };
          companyFiles.trash_files.items[id] = companyFiles.items[id];
        }
      });

      return {
        ...state,
        companyFiles: companyFiles,
        companyFolders: {
          ...state.companyFolders,
          items: folderItems,
        },
      };
    }
    case "INCOMING_COMPANY_MOVE_FILE": {
      let folderItems = state.companyFolders.items;
      if (folderItems[action.data.folder_id]) {
        folderItems[action.data.folder_id].files.push(action.data.file_id);
      } else {
        if (action.data.folder_id) {
          folderItems[action.data.folder_id] = {
            init: false,
            skip: 0,
            limit: 100,
            files: [action.data.file_id],
          };
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
        companyFiles: {
          ...state.companyFiles,
          items: {
            ...state.companyFiles.items,
            ...(typeof state.companyFiles.items[action.data.file_id] !== "undefined" && {
              [action.data.file_id]: {
                ...state.companyFiles.items[action.data.file_id],
                folder_id: action.data.folder_id,
              },
            }),
          },
        },
        companyFolders: {
          ...state.companyFolders,
          items: folderItems,
        },
      };
    }
    case "INCOMING_COMPANY_REMOVED_FILE": {
      return {
        ...state,
        companyFiles: {
          ...state.companyFiles,
          count: {
            ...state.companyFiles.count,
            trash: state.companyFiles.count.trash > 0 ? state.companyFiles.count.trash - 1 : 0,
          },
          items: Object.values(state.companyFiles.items).reduce((acc, file) => {
            if (file.id !== parseInt(action.data.file_id)) {
              acc[file.id] = file;
            }
            return acc;
          }, {}),
          trash_files: {
            ...state.companyFiles.trash_files,
            items: Object.values(state.companyFiles.trash_files).reduce((acc, file) => {
              if (file.id !== parseInt(action.data.file_id)) {
                acc[file.id] = file;
              }
              return acc;
            }, {}),
          },
        },
      };
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
          items: items,
        },
      };
    }
    case "INCOMING_COMPANY_RESTORE_FOLDER": {
      let folderItems = state.companyFolders.items;

      action.data.connected_folder_ids.forEach((id) => {
        if (typeof folderItems[id] !== "undefined") {
          folderItems[id].is_archived = false;
        }
      });

      let items = state.companyFiles.trash_files.items;
      let fileItems = state.companyFiles.items;
      let count = 0;
      let stars = 0;
      let storage = 0;
      action.data.connected_file_ids.forEach((id) => {
        if (typeof items[id] !== "undefined") {
          count += 1;
          stars += items[id].is_favorite ? 1 : 0;
          storage += items[id].size;
          fileItems[id] = items[id];
          delete items[id];
        }
      });

      return {
        ...state,
        companyFiles: {
          ...state.companyFiles,
          count: {
            ...state.companyFiles.count,
            all: state.companyFiles.count.all + count,
            stars: state.companyFiles.count.stars + stars,
            trash: state.companyFiles.count.trash - count,
            storage: state.companyFiles.count.storage + storage,
          },
          items: {
            ...state.companyFiles.items,
            items: fileItems,
          },
          trash_files: {
            ...state.companyFiles.trash_files,
            items: items,
          },
        },
        companyFolders: {
          ...state.companyFolders,
          items: folderItems,
        },
      };
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
            stars: action.data.file.is_favorite ? state.companyFiles.count.stars + 1 : state.companyFiles.count.stars,
            trash: state.companyFiles.count.trash - 1,
            storage: state.companyFiles.count.storage + action.data.file.size,
          },
          items: {
            ...state.companyFiles.items,
            [action.data.file.id]: action.data.file,
          },
          trash_files: {
            ...state.companyFiles.trash_files,
            items: items,
          },
        },
      };
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
              },
            },
          };
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
            stars: deletedItem.is_favorite ? state.companyFiles.count.stars - 1 : state.companyFiles.count.stars,
            trash: state.companyFiles.count.trash + 1,
            storage: state.companyFiles.count.storage - deletedItem.size,
          },
          items: items,
          favorite_files: {
            ...state.companyFiles.favorite_files,
            items: state.companyFiles.favorite_files.items.filter((id) => id !== deletedItem.id),
          },
          popular_files: {
            ...state.companyFiles.popular_files,
            items: state.companyFiles.popular_files.items.filter((id) => id !== deletedItem.id),
          },
          recently_edited: {
            ...state.companyFiles.recently_edited,
            items: state.companyFiles.recently_edited.items.filter((id) => id !== deletedItem.id),
          },
          trash_files: {
            ...state.companyFiles.trash_files,
            items: {
              ...state.companyFiles.trash_files.items,
              [action.data.file_id]: deletedItem,
            },
          },
        },
      };
    }
    case "INCOMING_COMPANY_EMPTY_TRASH": {
      let files = state.companyFiles.items;
      let trashItems = state.companyFiles.trash_files.items;
      let count = 0;
      let storage = 0;
      let stars = 0;
      let trash = 0;
      action.data.deleted_file_ids.forEach((id) => {
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
      });

      let folders = state.companyFolders.items;
      action.data.deleted_folder_ids.forEach((id) => {
        if (folders[id]) delete folders[id];
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
            items: trashItems,
          },
        },
        companyFolders: {
          ...state.companyFolders,
          items: folders,
        },
      };
    }
    case "ADD_COMPANY_FILE_SEARCH_RESULTS": {
      return {
        ...state,
        companyFiles: {
          ...state.companyFiles,
          items: {
            ...state.companyFiles.items,
            ...convertArrayToObject(action.data.search_results, "id"),
          },
          search_results: action.data.search_results.map((f) => f.id),
          search_value: action.data.search,
        },
      };
    }
    case "UPLOAD_COMPANY_FILES_REDUCER": {
      let companyFolders = state.companyFolders;

      let items = state.companyFiles.items;
      action.data.files.forEach((f) => {
        items[f.id] = f;

        if (action.data.folder_id && typeof companyFolders.items[action.data.folder_id] !== "undefined" && !companyFolders.items[action.data.folder_id].files.includes(f.id)) {
          companyFolders.items[action.data.folder_id].files.push(f.id);
        }
      });

      return {
        ...state,
        companyFiles: {
          ...state.companyFiles,
          items: items,
        },
        companyFolders: companyFolders,
      };
    }
    case "INCOMING_COMPANY_FILES": {
      let companyFolders = state.companyFolders;
      let companyFiles = state.companyFiles;

      let uploadedItems = Object.values(companyFiles.items).filter((f) => f.uploading);
      action.data.files.forEach((f) => {
        const i = uploadedItems.find((file) => file.size === f.size && file.search === f.search);

        if (i && typeof companyFiles.items[i.id] !== "undefined") {
          delete companyFiles.items[i.id];
          if (f.folder_id) {
            const ix = companyFolders.items[f.folder_id].files.findIndex((id) => id === i.id);
            if (ix !== -1) {
              companyFolders.items[f.folder_id].files.splice(ix, 1);
            }
          }
        }
        companyFiles.items[f.id] = f;
        companyFiles.count.all += 1;
        companyFiles.count.storage += f.size;
        companyFiles.count.stars += f.is_favorite ? 1 : 0;

        if (typeof companyFolders.items[f.folder_id] !== "undefined" && !companyFolders.items[f.folder_id].files.includes(f.id)) {
          companyFolders.items[f.folder_id].files.push(f.id);
        }
      });

      return {
        ...state,
        companyFiles: companyFiles,
        companyFolders: companyFolders,
      };
    }
    case "GET_COMPANY_GOOGLE_ATTACHMENTS_FOLDER_SUCCESS": {
      let items = state.companyFolders.items;

      action.data.attachments.forEach((a) => {
        items[a.id] = {
          id: a.id,
          is_archived: false,
          parent_folder: null,
          search: a.payload.name,
          payload: a.payload,
          created_at: { timestamp: a.payload.lastEditedUtc },
          updated_at: { timestamp: a.payload.lastEditedUtc },
          link_type: a.link_type,
          link_id: a.link_index_id,
          attachment_type: a.attachment_type,
          files: [],
          subFolders: [],
        };
      });

      return {
        ...state,
        companyFolders: {
          ...state.companyFolders,
          google_folders: {
            ...state.companyFolders.google_folders,
            init: true,
            skip: state.companyFolders.google_folders.skip + state.companyFolders.google_folders.limit,
            has_more: action.data.attachments.length === state.companyFolders.google_folders.limit,
          },
          items: items,
        },
      };
    }
    case "GET_COMPANY_GOOGLE_ATTACHMENTS_FILE_SUCCESS": {
      let companyFiles = { ...state.companyFiles };
      let google_files = state.companyFiles.google_files.items;

      let gFiles = action.data.attachments.map((attachment) => {
        if (!google_files.includes(attachment.id)) google_files.push(attachment.id);

        return {
          created_at: {
            timestamp: attachment.payload.lastEditedUtc,
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
          attachment_type: attachment.attachment_type,
        };
      });

      companyFiles.items = { ...companyFiles.items, ...convertArrayToObject(gFiles, "id") };

      return {
        ...state,
        companyFiles: {
          ...companyFiles,
          google_files: {
            init: true,
            skip: state.companyFiles.google_files.skip + state.companyFiles.google_files.limit,
            has_more: gFiles.length === state.companyFiles.google_files.limit,
            items: google_files,
          },
        },
      };
    }
    case "GET_COMPANY_FILES_SUCCESS": {
      let companyFiles = state.companyFiles;
      let folderItems = state.companyFolders.items;

      action.data.files.forEach((f) => {
        if (typeof companyFiles.items[f.id] === "undefined") {
          //double count issue
          // companyFiles.count.all += 1;
          // companyFiles.count.stars += (f.is_favorite) ? 1 : 0;
          // companyFiles.count.storage += f.size;
        }

        companyFiles.items[f.id] = f;

        if (f.folder_id) {
          if (folderItems[f.folder_id]) {
            if (!folderItems[f.folder_id].files.includes(f.id)) {
              folderItems[f.folder_id].files.push(f.id);
            }
          }
        }
      });

      if (action.data.folder_id && typeof folderItems[action.data.folder_id] !== "undefined") {
        folderItems[action.data.folder_id] = {
          ...folderItems[action.data.folder_id],
          init: false,
          has_more: action.data.files.length === folderItems[action.data.folder_id].limit,
          skip: folderItems[action.data.folder_id].skip + folderItems[action.data.folder_id].limit,
        };
      }

      return {
        ...state,
        companyFiles: {
          ...state.companyFiles,
          ...companyFiles,
          init: true,
          skip: state.companyFiles.skip + state.companyFiles.limit,
          has_more: action.data.files.length === state.companyFiles.limit,
        },
        companyFolders: {
          ...state.companyFolders,
          items: folderItems,
        },
      };
    }
    /*case "GET_COMPANY_FOLDER_BREAD_CRUMBS_SUCCESS": {
      if (typeof state.companyFolders.items[action.data.parent_folder.id] === "undefined")
        return state;

      let items = state.companyFolders.items[action.data.parent_folder.id];

      action.data.folders
        .forEach(f => {
          if (!items.subFolders.some(sf => sf.id === f.id)) {
            items.subFolders.push(f);
          }
        })

      return {
        ...state,
        companyFolders: {
          ...state.companyFolders,
          items: {
            ...state.companyFolders.items,
            [action.data.parent_folder.id]: items
          },
        }
      }
    }*/
    case "GET_COMPANY_FOLDERS_SUCCESS": {
      return {
        ...state,
        companyFolders: {
          ...state.companyFolders,
          init: true,
          skip: state.companyFolders.skip + state.companyFolders.limit,
          has_more: action.data.folders.length === state.companyFolders.limit,
          items: action.data.folders.reduce((acc, f) => {
            acc[f.id] = {
              ...f,
              init: false,
              has_more: true,
              skip: 0,
              limit: 100,
              files: [],
              subFolders: action.data.folders.filter((sf) => sf.parent_folder && f.id === sf.parent_folder.id),
            };
            return acc;
          }, {}),
        },
      };
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
          },
        },
      };
    }
    case "GET_COMPANY_FAVORITE_FILES_SUCCESS": {
      let items = state.companyFiles.items;
      action.data.files.forEach((f) => {
        items[f.id] = f;
      });

      let fileItems = state.companyFiles.favorite_files.items;
      action.data.files.forEach((f) => {
        if (!fileItems.includes(f.id)) {
          fileItems.push(f.id);
        }
      });

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
          },
        },
      };
    }
    case "GET_COMPANY_POPULAR_FILES_SUCCESS": {
      let items = state.companyFiles.items;
      action.data.files.forEach((f) => {
        items[f.id] = f;
      });

      let fileItems = state.companyFiles.popular_files.items;
      action.data.files.forEach((f) => {
        if (!fileItems.includes(f.id)) {
          fileItems.push(f.id);
        }
      });

      return {
        ...state,
        companyFiles: {
          ...state.companyFiles,
          items: items,
          popular_files: {
            ...state.companyFiles.popular_files,
            has_more: action.data.files.length === state.companyFiles.popular_files.limit,
            skip: state.companyFiles.popular_files.skip + state.companyFiles.popular_files.limit,
            items: fileItems,
          },
        },
      };
    }
    case "GET_COMPANY_RECENT_EDITED_FILES_SUCCESS": {
      let items = state.companyFiles.items;
      action.data.files.forEach((f) => {
        items[f.id] = f;
      });

      let fileItems = state.companyFiles.recently_edited.items;
      action.data.files.forEach((f) => {
        if (!fileItems.includes(f.id)) {
          fileItems.push(f.id);
        }
      });

      return {
        ...state,
        companyFiles: {
          ...state.companyFiles,
          items: items,
          recently_edited: {
            ...state.companyFiles.trash_files,
            has_more: action.data.files.length === state.companyFiles.recently_edited.limit,
            skip: state.companyFiles.recently_edited.skip + state.companyFiles.recently_edited.limit,
            items: fileItems,
          },
        },
      };
    }
    case "GET_COMPANY_TRASHED_FILES_SUCCESS": {
      let fileItems = state.companyFiles.trash_files.items;
      action.data.files.forEach((f) => {
        fileItems[f.id] = f;
      });

      return {
        ...state,
        companyFiles: {
          ...state.companyFiles,
          trash_files: {
            ...state.companyFiles.trash_files,
            has_more: action.data.files.length === state.companyFiles.trash_files.limit,
            skip: state.companyFiles.trash_files.skip + state.companyFiles.trash_files.limit,
            items: fileItems,
          },
        },
      };
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
          [action.data.channel_id]: [
            ...(typeof state.channelFiles[action.data.channel_id] === "undefined"
              ? Object.values(action.data.results).sort((a, b) => {
                  return a.created_at.timestamp - b.created_at.timestamp;
                })
              : Object.values(action.data.results)
                  .filter((r) => !state.channelFiles[action.data.channel_id].some((f) => f.file_id === r.file_id))
                  .sort((a, b) => {
                    return a.created_at.timestamp - b.created_at.timestamp;
                  })),
          ],
        },
      };
    }
    case "INCOMING_CHAT_MESSAGE": {
      let hubKey = action.data.workspace_id ? `${action.data.workspace_id}-${action.data.slug}` : null;
      return {
        ...state,
        ...(action.data.files.length &&
          typeof state.channelFiles[action.data.channel_id] !== "undefined" && {
            channelFiles: {
              ...state.channelFiles,
              [action.data.channel_id]: [
                ...state.channelFiles[action.data.channel_id],
                ...action.data.files
                  .filter((df) => !state.channelFiles[action.data.channel_id].some((f) => f.file_id === df.file_id))
                  .sort((a, b) => {
                    return a.created_at.timestamp - b.created_at.timestamp;
                  }),
              ],
            },
          }),
        ...(action.data.workspace_id &&
          action.data.files.length &&
          state.workspaceFiles[hubKey] && {
            workspaceFiles: {
              ...state.workspaceFiles,
              [hubKey]: {
                ...state.workspaceFiles[hubKey],
                files: {
                  ...state.workspaceFiles[hubKey].files,
                  ...action.data.files.reduce((res, file) => {
                    res[file.file_id] = {
                      ...file,
                      id: file.file_id,
                      is_favorite: false,
                      link_type: "CHANNEL",
                      user_id: action.data.user ? action.data.user.id : null,
                      updated_at: action.data.created_at,
                      search: file.filename,
                      thumbnail_link: null,
                    };
                    return res;
                  }, {}),
                },
              },
            },
          }),
      };
    }
    case "ADD_CHANNEL_FILES": {
      return {
        ...state,
        ...(typeof state.channelFiles[action.data.channel_id] !== "undefined" && {
          channelFiles: {
            ...state.channelFiles,
            [action.data.channel_id]: [
              ...state.channelFiles[action.data.channel_id],
              ...action.data.files
                .filter((df) => !state.channelFiles[action.data.channel_id].some((f) => f.file_id === df.file_id))
                .sort((a, b) => {
                  return a.created_at.timestamp - b.created_at.timestamp;
                }),
            ],
          },
        }),
      };
    }
    case "GET_CHAT_MESSAGES_SUCCESS": {
      return {
        ...state,
        ...(typeof state.channelFiles[action.data.channel_id] !== "undefined" && {
          channelFiles: {
            ...state.channelFiles,
            [action.data.channel_id]: [
              ...state.channelFiles[action.data.channel_id],
              ...action.data.results
                .map((r) => r.files)
                .reduce((file, value) => {
                  return [...file, ...value];
                }, [])
                .filter((r) => !state.channelFiles[action.data.channel_id].some((f) => f.file_id === r.file_id))
                .sort((a, b) => {
                  return a.created_at.timestamp - b.created_at.timestamp;
                }),
            ],
          },
        }),
      };
    }
    case "INCOMING_DELETED_CHAT_MESSAGE": {
      return {
        ...state,
        ...(typeof state.channelFiles[action.data.channel_id] !== "undefined" && {
          channelFiles: {
            ...state.channelFiles,
            [action.data.channel_id]: state.channelFiles[action.data.channel_id].filter((f) => !action.data.file_ids.includes(f.file_id)),
          },
        }),
      };
    }
    case "DELETE_CHANNEL_FILES": {
      return {
        ...state,
        ...(typeof state.channelFiles[action.data.channel_id] !== "undefined" && {
          channelFiles: {
            ...state.channelFiles,
            [action.data.channel_id]: state.channelFiles[action.data.channel_id].filter((f) => !action.data.file_ids.includes(f.file_id)),
          },
        }),
      };
    }
    case "SET_VIEW_FILES": {
      return {
        ...state,
        viewFiles: action.data,
        channelFiles: {
          ...state.channelFiles,
          ...(action.data !== null &&
            typeof action.data.channel_id !== "undefined" &&
            typeof action.data.files !== "undefined" && {
              [action.data.channel_id]:
                typeof state.channelFiles[action.data.channel_id] === "undefined" ? action.data.files : [...state.channelFiles[action.data.channel_id].filter((f1) => !action.data.files.some((f2) => f2.id === f1.id)), ...action.data.files],
            }),
        },
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
    case "ADD_TO_WORKSPACE_POSTS": {
      if (action.data.files && action.data.files.length) {
        let newWorkspaceFiles = { ...state.workspaceFiles };
        let hubKey = `${action.data.topic_id}-${action.data.slug}`;
        if (newWorkspaceFiles.hasOwnProperty(hubKey)) {
          newWorkspaceFiles = {
            [hubKey]: {
              ...newWorkspaceFiles[hubKey],
              files: { ...convertArrayToObject(action.data.files, "id"), ...newWorkspaceFiles[hubKey].files },
            },
          };
        } else {
          newWorkspaceFiles = {
            ...newWorkspaceFiles,
            [hubKey]: {
              files: convertArrayToObject(action.data.files, "id"),
              folders: {},
              storage: 0,
              count: 0,
              stars: 0,
              trash: 0,
              popular_files: [],
              recently_edited: [],
              favorite_files: [],
              team_chat: [],
              client_chat: [],
              private_post: [],
              client_post: [],
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
      let hubKey = `${action.data.topic_id}-${action.slug}`;
      return {
        ...state,
        workspaceFiles: {
          [hubKey]: {
            ...(typeof state.workspaceFiles[hubKey] === "undefined"
              ? {
                  files: convertArrayToObject(action.data.files, "id"),
                  folders: {
                    ...(action.data.folder_id && {
                      [action.data.folder_id]: {
                        loaded: true,
                        files: action.data.files.filter((f) => f.folder_id === action.data.folder_id).map((f) => f.id),
                      },
                    }),
                  },
                  storage: 0,
                  count: 0,
                  stars: 0,
                  trash: 0,
                  popular_files: [],
                  recently_edited: [],
                  favorite_files: [],
                  team_chat: [],
                  client_chat: [],
                  private_post: [],
                  client_post: [],
                  trash_files: {},
                  search_results: [],
                  search_value: "",
                  loaded: true,
                }
              : {
                  ...state.workspaceFiles[hubKey],
                  ...(action.data.folder_id &&
                    state.workspaceFiles[hubKey].folders[action.data.folder_id] && {
                      folders: {
                        ...state.workspaceFiles[hubKey].folders,
                        [action.data.folder_id]: {
                          ...state.workspaceFiles[hubKey].folders[action.data.folder_id],
                          loaded: true,
                          files: [...new Set([...state.workspaceFiles[hubKey].folders[action.data.folder_id].files, ...action.data.files.filter((f) => f.folder_id === action.data.folder_id).map((f) => f.id)])],
                        },
                      },
                    }),
                  loaded: true,
                  files: { ...convertArrayToObject(action.data.files, "id"), ...state.workspaceFiles[hubKey].files },
                }),
          },
        },
      };
    }
    case "GET_WORKSPACE_GOOGLE_FILE_ATTACHMENTS_SUCCESS": {
      let hubKey = `${action.data.topic_id}-${action.slug}`;
      let newWorkspaceFiles = { ...state.workspaceFiles };
      if (newWorkspaceFiles.hasOwnProperty(hubKey)) {
        let gFiles = action.data.attachments.map((attachment) => {
          return {
            created_at: {
              timestamp: attachment.payload.lastEditedUtc,
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
            attachment_type: attachment.attachment_type,
          };
        });

        newWorkspaceFiles[hubKey].files = { ...newWorkspaceFiles[hubKey].files, ...convertArrayToObject(gFiles, "id") };
      }

      return {
        ...state,
        workspaceFiles: newWorkspaceFiles,
      };
    }
    case "GET_WORKSPACE_GOOGLE_FOLDER_ATTACHMENTS_SUCCESS": {
      let hubKey = `${action.data.topic_id}-${action.slug}`;
      let newWorkspaceFiles = { ...state.workspaceFiles };
      if (newWorkspaceFiles.hasOwnProperty(hubKey)) {
        if (newWorkspaceFiles[hubKey].hasOwnProperty("folders")) {
          action.data.attachments.map((a) => {
            let key = `${a.link_id}-${action.slug}`;
            newWorkspaceFiles[key].folders[a.id] = {
              id: a.id,
              is_archived: false,
              parent_folder: null,
              search: a.payload.name,
              payload: a.payload,
              created_at: { timestamp: a.payload.lastEditedUtc },
              updated_at: { timestamp: a.payload.lastEditedUtc },
              files: [],
              link_type: a.link_type,
              link_id: a.link_index_id,
              attachment_type: a.attachment_type,
            };
          });
        }
      }

      return {
        ...state,
        workspaceFiles: newWorkspaceFiles,
      };
    }
    case "INCOMING_GOOGLE_FILE": {
      let updatedWorkspaceFiles = { ...state.workspaceFiles };
      let companyFiles = { ...state.companyFiles };
      let hubKey = `${action.data.link_id}-${action.data.slug}`;
      if (action.data.link_type === "TOPIC" && updatedWorkspaceFiles.hasOwnProperty(hubKey)) {
        if (updatedWorkspaceFiles[hubKey].hasOwnProperty("folders")) {
          updatedWorkspaceFiles[hubKey].files[action.data.id] = {
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
            payload: action.data.payload,
          };
        }
      }

      if (action.data.link_type === "COMPANY_DRIVE") {
        if (!companyFiles.google_files.items.includes(action.data.id)) {
          companyFiles.google_files.items.push(action.data.id);
        }

        if (typeof companyFiles.items[action.data.id] === "undefined") {
          companyFiles.items = {
            ...companyFiles.items,
            [action.data.id]: {
              id: action.data.id,
              created_at: action.data.created_at,
              download_link: action.data.payload.embedUrl,
              folder_id: null,
              payload_id: action.data.payload.id,
              is_favorite: false,
              link_id: parseInt(action.data.link_id),
              link_index_id: 0,
              link_type: action.data.link_type,
              mime_type: action.data.payload.mimeType,
              search: action.data.payload.name,
              size: action.data.payload.sizeBytes,
              type: action.data.payload.type,
              attachment_type: action.data.attachment_type,
              payload: action.data.payload,
            },
          };
        }
      }

      return {
        ...state,
        workspaceFiles: updatedWorkspaceFiles,
        companyFiles: companyFiles,
      };
    }
    case "INCOMING_GOOGLE_FOLDER": {
      let updatedWorkspaceFiles = { ...state.workspaceFiles };
      let hubKey = `${action.data.link_id}-${action.data.slug}`;
      if (updatedWorkspaceFiles.hasOwnProperty(hubKey)) {
        if (updatedWorkspaceFiles[hubKey].hasOwnProperty("folders")) {
          updatedWorkspaceFiles[hubKey].folders[action.data.id] = {
            id: action.data.id,
            is_archived: false,
            parent_folder: null,
            search: action.data.payload.name,
            payload: action.data.payload,
            created_at: action.data.created_at,
            updated_at: action.data.updated_at,
            files: [],
          };
        }
      }
      return {
        ...state,
        workspaceFiles: updatedWorkspaceFiles,
      };
    }
    case "GET_WORKSPACE_FILE_DETAILS_SUCCESS": {
      let hubKey = `${action.data.topic_id}-${action.slug}`;
      return {
        ...state,
        workspaceFiles: {
          [hubKey]: {
            ...(state.workspaceFiles[hubKey] ? state.workspaceFiles[hubKey] : {}),
            storage: action.data.total_storage,
            count: action.data.total_file_count,
            stars: action.data.total_file_stars,
            trash: action.data.total_file_trash,
          },
        },
      };
    }
    case "GET_WORKSPACE_TRASH_FILES_SUCCESS": {
      let hubKey = `${action.data.topic_id}-${action.slug}`;
      let newWorkspaceFiles = { ...state.workspaceFiles };
      if (newWorkspaceFiles.hasOwnProperty(hubKey)) {
        newWorkspaceFiles = {
          [hubKey]: {
            ...newWorkspaceFiles[hubKey],
            //files: {...convertArrayToObject(action.data.files, "id"), ...newWorkspaceFiles[hubKey].files},
            trash_files: convertArrayToObject(action.data.files, "id"),
          },
        };
      } else {
        newWorkspaceFiles = {
          ...newWorkspaceFiles,
          [hubKey]: {
            ...newWorkspaceFiles[hubKey],
            //files: {...convertArrayToObject(action.data.files, "id"), ...newWorkspaceFiles[hubKey].files},
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
      let hubKey = `${action.data.topic_id}-${action.slug}`;
      let newWorkspaceFiles = { ...state.workspaceFiles };
      if (newWorkspaceFiles.hasOwnProperty(hubKey)) {
        newWorkspaceFiles = {
          [hubKey]: {
            ...newWorkspaceFiles[hubKey],
            files: { ...convertArrayToObject(action.data.files, "id"), ...newWorkspaceFiles[hubKey].files },
            favorite_files: action.data.files.map((f) => f.id),
          },
        };
      } else {
        newWorkspaceFiles = {
          ...newWorkspaceFiles,
          [hubKey]: {
            ...newWorkspaceFiles[hubKey],
            files: { ...convertArrayToObject(action.data.files, "id"), ...newWorkspaceFiles[hubKey].files },
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
      let hubKey = `${action.data.topic_id}-${action.slug}`;
      let newWorkspaceFiles = { ...state.workspaceFiles };
      if (newWorkspaceFiles.hasOwnProperty(hubKey)) {
        newWorkspaceFiles = {
          [hubKey]: {
            ...newWorkspaceFiles[hubKey],
            popular_files: action.data.files.map((f) => f.id),
          },
        };
      } else {
        newWorkspaceFiles = {
          ...newWorkspaceFiles,
          [hubKey]: {
            ...newWorkspaceFiles[hubKey],
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
      let hubKey = `${action.data.topic_id}-${action.slug}`;
      return {
        ...state,
        workspaceFiles: {
          [hubKey]: {
            ...(typeof state.workspaceFiles[hubKey] === "undefined"
              ? {
                  recently_edited: [...new Set(action.data.files.map((f) => f.id))],
                }
              : {
                  ...state.workspaceFiles[hubKey],
                  recently_edited: [...new Set(state.workspaceFiles[hubKey].recently_edited.concat(action.data.files.map((f) => f.id)))],
                }),
          },
        },
      };
    }
    case "GET_WORKSPACE_FOLDER_SUCCESS": {
      let hubKey = `${action.data.topic_id}-${action.slug}`;
      let newWorkspaceFiles = { ...state.workspaceFiles };
      let folders = action.data.folders
        .filter((f) => !(!f.shared_with_client && state.user.type === "external"))
        .map((f) => {
          return {
            ...f,
            files: [],
          };
        });
      if (newWorkspaceFiles.hasOwnProperty(hubKey)) {
        newWorkspaceFiles = {
          [hubKey]: {
            ...newWorkspaceFiles[hubKey],
            folders: { ...convertArrayToObject(folders, "id"), ...newWorkspaceFiles[hubKey].folders },
          },
        };
      } else {
        newWorkspaceFiles = {
          ...newWorkspaceFiles,
          [hubKey]: {
            ...newWorkspaceFiles[hubKey],
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
      let hubKey = `${action.data.topic_id}-${action.data.slug}`;
      let newWorkspaceFiles = { ...state.workspaceFiles };
      if (newWorkspaceFiles.hasOwnProperty(hubKey)) {
        if (newWorkspaceFiles[hubKey].hasOwnProperty("folders")) {
          newWorkspaceFiles = {
            ...newWorkspaceFiles,
            [hubKey]: {
              ...newWorkspaceFiles[hubKey],
              folders: {
                ...newWorkspaceFiles[hubKey].folders,
                [action.data.folder.id]: {
                  ...action.data.folder,
                  loaded: true,
                  files: [],
                },
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
      let hubKey = `${action.data.topic_id}-${action.data.slug}`;
      if (typeof state.workspaceFiles[hubKey] === "undefined") {
        return state;
      }

      let newWorkspaceFiles = { ...state.workspaceFiles };

      action.data.connected_folder_ids.forEach((id) => {
        if (typeof newWorkspaceFiles[hubKey].folders[id] !== "undefined") {
          newWorkspaceFiles[hubKey].folders[id].is_archived = true;
        }
      });

      action.data.connected_file_ids.forEach((id) => {
        if (typeof newWorkspaceFiles[hubKey].files[id] !== "undefined") {
          newWorkspaceFiles[hubKey].trash_files[id] = newWorkspaceFiles[hubKey].files[id];

          newWorkspaceFiles[hubKey].count -= 1;
          newWorkspaceFiles[hubKey].trash += 1;

          if (newWorkspaceFiles[hubKey].files[id].is_favorite) {
            newWorkspaceFiles[hubKey].stars -= 1;

            const ix = newWorkspaceFiles[hubKey].favorite_files.indexOf(id);
            if (ix !== -1) {
              newWorkspaceFiles[hubKey].favorite_files.splice(ix, 1);
            }
          }

          delete newWorkspaceFiles[hubKey].files[id];
        }
      });

      return {
        ...state,
        workspaceFiles: newWorkspaceFiles,
      };
    }
    case "INCOMING_REMOVED_FOLDER": {
      let hubKey = `${action.data.topic_id}-${action.data.slug}`;
      let newWorkspaceFiles = { ...state.workspaceFiles };
      if (newWorkspaceFiles.hasOwnProperty(hubKey)) {
        if (newWorkspaceFiles[hubKey].hasOwnProperty("folders")) {
          delete newWorkspaceFiles[hubKey].folders[action.data.folder.id];
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
      let hubKey = `${action.data.topic_id}-${action.data.slug}`;
      let newWorkspaceFiles = { ...state.workspaceFiles };
      if (newWorkspaceFiles.hasOwnProperty(hubKey)) {
        // if (newWorkspaceFiles[hubKey].hasOwnProperty("folders")) {
        newWorkspaceFiles = {
          ...newWorkspaceFiles,
          [hubKey]: {
            ...newWorkspaceFiles[hubKey],
            files: {
              ...newWorkspaceFiles[hubKey].files,
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
      let hubKey = `${action.data.topic_id}-${action.data.slug}`;
      let newWorkspaceFiles = { ...state.workspaceFiles };
      if (newWorkspaceFiles.hasOwnProperty(hubKey)) {
        let add = (total, num) => total + num;
        if (newWorkspaceFiles[hubKey].hasOwnProperty("folders") && action.data.folder_id) {
          if (newWorkspaceFiles[hubKey].folders.hasOwnProperty(action.data.folder_id)) {
            newWorkspaceFiles[hubKey].folders[action.data.folder_id].files = [...newWorkspaceFiles[hubKey].folders[action.data.folder_id].files, ...action.data.files.map((f) => f.id)];
          }
        }
        newWorkspaceFiles[hubKey].files = { ...convertArrayToObject(action.data.files, "id"), ...newWorkspaceFiles[hubKey].files };
        Object.values(newWorkspaceFiles[hubKey].files).map((f) => {
          if (typeof f.id === "string") {
            action.data.files.forEach((af) => {
              if (af.size === f.size && af.search === f.search) {
                delete newWorkspaceFiles[hubKey].files[f.id];
              }
            });
          }
        });
        newWorkspaceFiles[hubKey].count = newWorkspaceFiles[hubKey].count + action.data.files.length;
        newWorkspaceFiles[hubKey].storage = Object.values(newWorkspaceFiles[hubKey].files)
          .filter((f) => typeof f.size === "number")
          .map((f) => f.size)
          .reduce(add);
        return {
          ...state,
          workspaceFiles: newWorkspaceFiles,
        };
      } else {
        return state;
      }
    }
    case "UPLOAD_FILES_REDUCER": {
      let hubKey = `${action.data.topic_id}-${action.data.slug}`;
      let newWorkspaceFiles = { ...state.workspaceFiles };
      if (newWorkspaceFiles.hasOwnProperty(hubKey)) {
        if (newWorkspaceFiles[hubKey].hasOwnProperty("folders") && action.data.folder_id) {
          newWorkspaceFiles[hubKey].folders[action.data.folder_id].files = [...newWorkspaceFiles[hubKey].folders[action.data.folder_id].files, ...action.data.files.map((f) => f.id)];
        }
        newWorkspaceFiles[hubKey].files = { ...convertArrayToObject(action.data.files, "id"), ...newWorkspaceFiles[hubKey].files };
        return {
          ...state,
          workspaceFiles: newWorkspaceFiles,
        };
      } else {
        return state;
      }
    }
    case "ADD_FILE_SEARCH_RESULTS": {
      let hubKey = `${action.data.topic_id}-${action.data.slug}`;
      let newWorkspaceFiles = { ...state.workspaceFiles };
      if (newWorkspaceFiles.hasOwnProperty(hubKey)) {
        newWorkspaceFiles = {
          [hubKey]: {
            ...newWorkspaceFiles[hubKey],
            files: { ...convertArrayToObject(action.data.search_results, "id"), ...newWorkspaceFiles[hubKey].files },
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
      let hubKey = `${action.data.topic_id}-${action.data.slug}`;
      let newWorkspaceFiles = { ...state.workspaceFiles };
      if (newWorkspaceFiles.hasOwnProperty(hubKey)) {
        newWorkspaceFiles = {
          [hubKey]: {
            ...newWorkspaceFiles[hubKey],
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
      let hubKey = `${action.data.topic_id}-${action.data.slug}`;
      if (typeof state.workspaceFiles[hubKey] === "undefined" || typeof state.workspaceFiles[hubKey].files[action.data.file_id] === "undefined") return state;

      let items = state.workspaceFiles[hubKey];
      let file = items.files[action.data.file_id];

      items.storage -= file.size;
      items.count -= 1;
      items.trash += 1;
      items.trash_files[action.data.file_id] = file;
      items.recently_edited.filter((id) => id !== file.id);

      if (file.folder_id && items.folders[file.folder_id]) {
        let index = items.folders[file.folder_id].files.findIndex((f) => f.id === file.id);
        if (index !== -1) {
          items.folders[file.folder_id].files.splice(index, 1);
        }
      }

      delete items.files[file.id];

      return {
        ...state,
        workspaceFiles: {
          ...state.workspaceFiles,
          [hubKey]: items,
        },
      };
    }
    case "INCOMING_DELETED_FILES": {
      let hubKey = `${action.data.topic_id}-${action.data.slug}`;
      let newWorkspaceFiles = { ...state.workspaceFiles };
      if (newWorkspaceFiles.hasOwnProperty(hubKey)) {
        newWorkspaceFiles[hubKey].count = newWorkspaceFiles[hubKey].count - action.data.deleted_file_ids.length;
        newWorkspaceFiles[hubKey].trash = newWorkspaceFiles[hubKey].trash + action.data.deleted_file_ids.length;
        let deletedFiles = Object.values(newWorkspaceFiles[hubKey].files).filter((f) => {
          return action.data.deleted_file_ids.some((df) => df === f.id);
        });
        newWorkspaceFiles[hubKey].trash_files = { ...convertArrayToObject(deletedFiles, "id"), ...newWorkspaceFiles[hubKey].trash_files };
        action.data.deleted_file_ids.map((df) => {
          delete newWorkspaceFiles[hubKey].files[df];
        });

        if (newWorkspaceFiles[hubKey].hasOwnProperty("folders")) {
          Object.values(newWorkspaceFiles[hubKey].folders).forEach((f) => {
            if (f.hasOwnProperty("files") && newWorkspaceFiles[hubKey].folders[f.id].files.length) {
              newWorkspaceFiles[hubKey].folders[f.id].files = newWorkspaceFiles[hubKey].folders[f.id].files.filter((id) => {
                return !action.data.deleted_file_ids.some((df) => df === id);
              });
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
      let hubKey = `${action.data.topic_id}-${action.data.slug}`;
      let newWorkspaceFiles = { ...state.workspaceFiles };

      if (typeof newWorkspaceFiles[hubKey] === "undefined") return state;

      delete newWorkspaceFiles[hubKey].trash_files[action.data.file_id];
      newWorkspaceFiles[hubKey].trash -= 1;

      return {
        ...state,
        workspaceFiles: newWorkspaceFiles,
      };
    }
    case "ADD_REMOVE_FAVORITE": {
      let hubKey = `${action.data.topic_id}-${action.data.slug}`;
      if (hubKey) {
        let newWorkspaceFiles = { ...state.workspaceFiles };
        newWorkspaceFiles[hubKey].files[action.data.file_id].is_favorite = action.data.is_favorite;
        newWorkspaceFiles = {
          ...newWorkspaceFiles,
          [hubKey]: {
            ...newWorkspaceFiles[hubKey],
            stars: action.data.is_favorite ? newWorkspaceFiles[hubKey].stars + 1 : newWorkspaceFiles[hubKey].stars - 1,
            favorite_files: action.data.is_favorite ? [...newWorkspaceFiles[hubKey].favorite_files, action.data.file_id] : newWorkspaceFiles[hubKey].favorite_files.filter((id) => id !== action.data.file_id),
          },
        };
        return {
          ...state,
          workspaceFiles: newWorkspaceFiles,
        };
      } else {
        let items = { ...state.companyFiles.items };

        if (items[action.data.file_id]) {
          items[action.data.file_id].is_favorite = action.data.is_favorite;
        }

        // let favorite_files_items = state.companyFiles.favorite_files.items;
        // const index = favorite_files_items.findIndex(x => x.id === action.data.file_id);
        // if (index !== -1) {
        //   if (action.data.is_favorite) {
        //     favorite_files_items[index].is_favorite = action.data.is_favorite;
        //   } else {
        //     favorite_files_items.splice(index, 1);
        //   }
        // } else if (action.data.is_favorite) {
        //   favorite_files_items.push(items[action.data.file_id]);
        // }

        return {
          ...state,
          companyFiles: {
            ...state.companyFiles,
            count: {
              ...state.companyFiles.count,
              stars: action.data.is_favorite ? state.companyFiles.count.stars + 1 : state.companyFiles.count.stars - 1,
            },
            items: items,
            favorite_files: {
              ...state.companyFiles.favorite_files,
              items: action.data.is_favorite ? [...state.companyFiles.favorite_files.items, action.data.file_id] : state.companyFiles.favorite_files.items.filter((id) => id !== action.data.file_id),
            },
          },
        };
      }
    }
    case "INCOMING_RESTORE_FOLDER": {
      let hubKey = `${action.data.topic_id}-${action.data.slug}`;
      if (typeof state.workspaceFiles[hubKey] === "undefined") return state;

      let items = state.workspaceFiles[hubKey];

      action.data.connected_folder_ids.forEach((id) => {
        items.folders[id].is_archived = false;
      });

      action.data.connected_file_ids.forEach((id) => {
        if (items.trash_files[id]) {
          items.files[id] = items.trash_files[id];
          items.count += 1;
          items.trash -= 1;
          items.storage += items.trash_files[id].size;

          if (items.trash_files[id].is_favorite && !items.favorite_files.includes(id)) {
            items.stars += 1;
            items.favorite_files.push(id);
          }

          delete items.trash_files[id];
        }
      });

      return {
        ...state,
        workspaceFiles: {
          ...state.workspaceFiles,
          [hubKey]: items,
        },
      };
    }
    case "INCOMING_RESTORE_FILE": {
      let hubKey = `${action.data.topic_id}-${action.data.slug}`;
      if (typeof state.workspaceFiles[hubKey] === "undefined") return state;

      let items = state.workspaceFiles[hubKey];

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
          [hubKey]: items,
        },
      };
    }
    case "INCOMING_MOVED_FILE": {
      let hubKey = `${action.data.topic_id}-${action.data.slug}`;
      let newWorkspaceFiles = { ...state.workspaceFiles };
      if (newWorkspaceFiles.hasOwnProperty(hubKey)) {
        newWorkspaceFiles[hubKey].files[action.data.file_id].folder_id = action.data.folder_id;
        newWorkspaceFiles[hubKey] = {
          ...newWorkspaceFiles[hubKey],
          files: {
            ...newWorkspaceFiles[hubKey].files,
            ...(typeof newWorkspaceFiles[hubKey].files[action.data.file_id] !== "undefined" && {
              [action.data.file_id]: {
                ...newWorkspaceFiles[hubKey].files[action.data.file_id],
                folder_id: action.data.folder_id,
              },
            }),
          },
        };
        if (action.data.folder_id && newWorkspaceFiles[hubKey].folders.hasOwnProperty(action.data.original_folder_id) && newWorkspaceFiles[hubKey].folders[action.data.original_folder_id].hasOwnProperty("files")) {
          newWorkspaceFiles[hubKey].folders[action.data.original_folder_id].files = newWorkspaceFiles[hubKey].folders[action.data.original_folder_id].files.filter((id) => id !== action.data.file_id);
        }
        if (action.data.folder_id && newWorkspaceFiles[hubKey].folders.hasOwnProperty(action.data.folder_id) && newWorkspaceFiles[hubKey].folders[action.data.folder_id].hasOwnProperty("loaded")) {
          newWorkspaceFiles[hubKey].folders[action.data.folder_id].files = [...newWorkspaceFiles[hubKey].folders[action.data.folder_id].files, action.data.file_id];
        }
        return {
          ...state,
          workspaceFiles: newWorkspaceFiles,
        };
      } else {
        return state;
      }
    }
    case "INCOMING_EMPTY_TRASH": {
      let hubKey = `${action.data.topic_id}-${action.data.slug}`;
      let newWorkspaceFiles = { ...state.workspaceFiles };
      if (newWorkspaceFiles.hasOwnProperty(hubKey) && newWorkspaceFiles[hubKey].hasOwnProperty("trash_files")) {
        let add = (total, num) => total + num;
        let totalSize = 0;
        if (action.data.deleted_file_ids.length) {
          totalSize = Object.values(state.workspaceFiles[hubKey].trash_files)
            .filter((f) => typeof f !== "undefined")
            .filter((f) => {
              return action.data.deleted_file_ids.some((df) => df === f.id);
            })
            .map((f) => f.size)
            .reduce(add);
        }

        newWorkspaceFiles[hubKey].trash_files = {};
        newWorkspaceFiles[hubKey].trash = 0;
        newWorkspaceFiles[hubKey].storage = newWorkspaceFiles[hubKey].storage - totalSize;
        Object.values(newWorkspaceFiles[hubKey].folders).forEach((f) => {
          if (f.is_archived) {
            delete newWorkspaceFiles[hubKey].folders[f.id];
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
    // case "FETCH_TIMELINE_SUCCESS": {
    //   let newWorkspaceFiles = { ...state.workspaceFiles };
    //   if (newWorkspaceFiles.hasOwnProperty(action.data.topic_id)) {
    //     newWorkspaceFiles[action.data.topic_id].files = {
    //       ...convertArrayToObject(
    //         action.data.timeline.filter((t) => t.tag === "DOCUMENT").map((i) => i.item),
    //         "id"
    //       ),
    //       ...newWorkspaceFiles[action.data.topic_id].files,
    //     };
    //   } else {
    //     newWorkspaceFiles = {
    //       ...newWorkspaceFiles,
    //       [action.data.topic_id]: {
    //         files: convertArrayToObject(
    //           action.data.timeline.filter((t) => t.tag === "DOCUMENT").map((i) => i.item),
    //           "id"
    //         ),
    //         folders: {},
    //         storage: 0,
    //         count: 0,
    //         stars: 0,
    //         trash: 0,
    //         popular_files: [],
    //         recently_edited: [],
    //         favorite_files: [],
    //         trash_files: {},
    //         search_results: [],
    //         search_value: "",
    //       },
    //     };
    //   }
    //   return {
    //     ...state,
    //     workspaceFiles: newWorkspaceFiles,
    //   };
    // }
    case "INCOMING_COMMENT": {
      let newWorkspaceFiles = { ...state.workspaceFiles };

      if (action.data.workspaces.length && action.data.files.length) {
        if (action.data.files[0].shared_with_client === 1 || (state.user.type === "internal" && action.data.files[0].shared_with_client === 0)) {
          action.data.workspaces.forEach((ws) => {
            let hubKey = `${ws.topic_id}-${action.data.slug}`;
            if (newWorkspaceFiles.hasOwnProperty(hubKey)) {
              newWorkspaceFiles[hubKey].files = { ...convertArrayToObject(action.data.files, "id"), ...newWorkspaceFiles[hubKey].files };
            }
          });
        }

        return {
          ...state,
          workspaceFiles: newWorkspaceFiles,
        };
      } else {
        return state;
      }
    }
    case "INCOMING_POST": {
      let newWorkspaceFiles = { ...state.workspaceFiles };
      if (action.data.files.length) {
        action.data.recipient_ids.forEach((id) => {
          let hubKey = `${id}-${action.data.slug}`;
          if (newWorkspaceFiles.hasOwnProperty(hubKey)) {
            newWorkspaceFiles[hubKey].files = { ...convertArrayToObject(action.data.files, "id"), ...newWorkspaceFiles[hubKey].files };
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
      let newWorkspaceFiles = { ...state.workspaceFiles };
      if (action.data.connected_workspace.length && Object.keys(newWorkspaceFiles).length) {
        action.data.connected_workspace.forEach((ws) => {
          let hubKey = `${ws.topic_id}-${action.data.slug}`;
          if (newWorkspaceFiles.hasOwnProperty(hubKey) && newWorkspaceFiles[hubKey].hasOwnProperty("files")) {
            delete newWorkspaceFiles[hubKey].files[action.data.file_id];
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
          [action.data.file_id]: action.data.metadata,
        },
      };
    }
    case "INCOMING_DELETED_GOOGLE_FILE": {
      let updatedWorkspaceFiles = { ...state.workspaceFiles };
      let companyFiles = { ...state.companyFiles };

      if (action.data.data_type) {
        let workspace = {
          id: action.data.data_type.topic.id,
          name: action.data.data_type.topic.name,
          folder_id: action.data.data_type.workspace ? action.data.data_type.workspace.id : null,
          folder_name: action.data.data_type.workspace ? action.data.data_type.workspace.name : null,
        };
        let hubKey = `${workspace.id}-${action.data.slug}`;
        if (updatedWorkspaceFiles.hasOwnProperty(workspace.id)) {
          if (updatedWorkspaceFiles[hubKey].files.hasOwnProperty(action.data.attachment_id)) {
            delete updatedWorkspaceFiles[hubKey].files[action.data.attachment_id];
          } else if (updatedWorkspaceFiles[hubKey].folders.hasOwnProperty(action.data.attachment_id)) {
            delete updatedWorkspaceFiles[hubKey].folders[action.data.attachment_id];
          }
        }
      } else {
        const ix = companyFiles.google_files.items.findIndex((id) => id === action.data.attachment_id);
        if (ix !== -1) {
          companyFiles.google_files.items.splice(ix, 1);
        }

        if (typeof companyFiles.items[action.data.attachment_id] !== "undefined") {
          delete companyFiles.items[action.data.attachment_id];
        }
      }

      return {
        ...state,
        workspaceFiles: updatedWorkspaceFiles,
        companyFiles: companyFiles,
      };
    }
    case "INCOMING_GIF_DATA": {
      return {
        ...state,
        gifBlobs: {
          ...state.gifBlobs,
          [action.data.id]: action.data.src,
        },
      };
    }
    case "INCOMING_FILE_DATA": {
      return {
        ...state,
        fileBlobs: {
          ...state.fileBlobs,
          [action.data.key]: action.data.src,
        },
      };
    }
    case "INCOMING_FILE_THUMBNAIL_DATA": {
      return {
        ...state,
        fileThumbnailBlobs: {
          ...state.fileThumbnailBlobs,
          [action.data.key]: action.data.src,
        },
      };
    }
    case "GET_TEAM_CHAT_FILES_SUCCESS": {
      return {
        ...state,
        workspaceFiles: {
          ...state.workspaceFiles,
          ...(state.workspaceFiles[action.data.topic_id] && {
            [action.data.topic_id]: {
              ...state.workspaceFiles[action.data.topic_id],
              files: { ...convertArrayToObject(action.data.files, "id"), ...state.workspaceFiles[action.data.topic_id].files },
              team_chat: [...state.workspaceFiles[action.data.topic_id].team_chat, ...action.data.files.map((f) => f.id)],
            },
          }),
        },
      };
    }
    case "GET_CLIENT_CHAT_FILES_SUCCESS": {
      return {
        ...state,
        workspaceFiles: {
          ...state.workspaceFiles,
          ...(state.workspaceFiles[action.data.topic_id] && {
            [action.data.topic_id]: {
              ...state.workspaceFiles[action.data.topic_id],
              files: { ...convertArrayToObject(action.data.files, "id"), ...state.workspaceFiles[action.data.topic_id].files },
              client_chat: [...state.workspaceFiles[action.data.topic_id].client_chat, ...action.data.files.map((f) => f.id)],
            },
          }),
        },
      };
    }
    case "GET_CLIENT_POST_FILES_SUCCESS": {
      return {
        ...state,
        workspaceFiles: {
          ...state.workspaceFiles,
          ...(state.workspaceFiles[action.data.topic_id] && {
            [action.data.topic_id]: {
              ...state.workspaceFiles[action.data.topic_id],
              files: { ...convertArrayToObject(action.data.files, "id"), ...state.workspaceFiles[action.data.topic_id].files },
              client_post: [...state.workspaceFiles[action.data.topic_id].client_post, ...action.data.files.map((f) => f.id)],
            },
          }),
        },
      };
    }
    case "GET_PRIVATE_POST_FILES_SUCCESS": {
      return {
        ...state,
        workspaceFiles: {
          ...state.workspaceFiles,
          ...(state.workspaceFiles[action.data.topic_id] && {
            [action.data.topic_id]: {
              ...state.workspaceFiles[action.data.topic_id],
              files: { ...convertArrayToObject(action.data.files, "id"), ...state.workspaceFiles[action.data.topic_id].files },
              private_post: [...state.workspaceFiles[action.data.topic_id].private_post, ...action.data.files.map((f) => f.id)],
            },
          }),
        },
      };
    }
    case "INCOMING_REMOVED_FILE_AUTOMATICALLY": {
      return {
        ...state,
        workspaceFiles: {
          ...state.workspaceFiles,
          ...action.data.files.reduce((res, obj) => {
            let hubKey = `${obj.topic_id}-${action.data.slug}`;
            if (state.workspaceFiles[hubKey]) {
              res[hubKey] = {
                ...state.workspaceFiles[hubKey],
                files: {
                  ...Object.values(state.workspaceFiles[hubKey].files).reduce((fres, f) => {
                    if (!action.data.files.some((file) => file.file_id === f.id)) {
                      fres[f.id] = { ...f };
                    }
                    return fres;
                  }, {}),
                },
                recently_edited: state.workspaceFiles[hubKey].recently_edited.filter((id) => !action.data.files.some((file) => file.file_id === id)),
                favorite_files: state.workspaceFiles[hubKey].favorite_files.filter((id) => !action.data.files.some((file) => file.file_id === id)),
                popular_files: state.workspaceFiles[hubKey].popular_files.filter((id) => !action.data.files.some((file) => file.file_id === id)),
              };
            }
            return res;
          }, {}),
        },
      };
    }
    case "GET_TOPIC_DRIVE_LINKS_SUCCESS": {
      if (action.data.length) {
        const workspaceId = action.data[0].link_id;
        let hubKey = `${workspaceId}-${action.slug}`;
        return {
          ...state,
          workspaceFiles: {
            ...state.workspaceFiles,
            ...(state.workspaceFiles[hubKey] && {
              [hubKey]: {
                ...state.workspaceFiles[hubKey],
                driveLinks: action.data.reduce((acc, f) => {
                  acc[f.id] = f;
                  return acc;
                }, {}),
              },
            }),
          },
        };
      } else {
        return state;
      }
    }
    case "GET_DRIVE_LINKS_SUCCESS": {
      return {
        ...state,
        companyFiles: {
          ...state.companyFiles,
          driveLinks: action.data.data.reduce((acc, f) => {
            acc[f.id] = f;
            return acc;
          }, {}),
        },
      };
    }
    case "PUT_DRIVE_LINK_SUCCESS":
    case "POST_DRIVE_LINK_SUCCESS": {
      if (action.data.data.link_id) {
        let hubKey = `${action.data.data.link_id}-${action.slug}`;
        return {
          ...state,
          workspaceFiles: {
            ...state.workspaceFiles,
            ...(state.workspaceFiles[hubKey] && {
              [hubKey]: {
                ...state.workspaceFiles[hubKey],
                driveLinks: {
                  ...state.workspaceFiles[hubKey].driveLinks,
                  [action.data.data.id]: action.data.data,
                },
              },
            }),
          },
        };
      } else {
        return {
          ...state,
          companyFiles: {
            ...state.companyFiles,
            driveLinks: {
              ...state.companyFiles.driveLinks,
              [action.data.data.id]: action.data.data,
            },
          },
        };
      }
    }
    case "INCOMING_UPDATED_DRIVE_LINK":
    case "INCOMING_DRIVE_LINK": {
      if (action.data.data.link_id) {
        let hubKey = `${action.data.data.link_id}-${action.data.slug}`;
        return {
          ...state,
          workspaceFiles: {
            ...state.workspaceFiles,
            ...(state.workspaceFiles[hubKey] && {
              [hubKey]: {
                ...state.workspaceFiles[hubKey],
                driveLinks: {
                  ...state.workspaceFiles[hubKey].driveLinks,
                  [action.data.data.id]: action.data.data,
                },
              },
            }),
          },
        };
      } else {
        return {
          ...state,
          companyFiles: {
            ...state.companyFiles,
            driveLinks: {
              ...state.companyFiles.driveLinks,
              [action.data.data.id]: action.data.data,
            },
          },
        };
      }
    }

    case "ADD_GOOGLE_DRIVE_FILE_SUCCESS": {
      if (action.data.data.link_id) {
        return {
          ...state,
          workspaceFiles: {
            ...state.workspaceFiles,
            ...(state.workspaceFiles[action.data.data.link_id] && {
              [action.data.data.link_id]: {
                ...state.workspaceFiles[action.data.data.link_id],
                driveLinks: {
                  ...state.workspaceFiles[action.data.data.link_id].driveLinks,
                  [action.data.data.id]: action.data.data,
                },
              },
            }),
          },
        };
      } else {
        return {
          ...state,
          companyFiles: {
            ...state.companyFiles,
            driveLinks: {
              ...state.companyFiles.driveLinks,
              [action.data.data.id]: action.data.data,
            },
          },
        };
      }
    }
    case "INCOMING_DELETED_DRIVE_LINK": {
      if (action.data.data.topic_id) {
        let hubKey = `${action.data.data.topic_id}-${action.data.slug}`;
        return {
          ...state,
          workspaceFiles: {
            ...state.workspaceFiles,
            ...(state.workspaceFiles[hubKey] && {
              [hubKey]: {
                ...state.workspaceFiles[hubKey],
                driveLinks: Object.values(state.workspaceFiles[hubKey].driveLinks)
                  .filter((d) => d.id !== action.data.data.id)
                  .reduce((acc, f) => {
                    acc[f.id] = f;
                    return acc;
                  }, {}),
              },
            }),
          },
        };
      } else {
        return {
          ...state,
          companyFiles: {
            ...state.companyFiles,
            driveLinks: Object.values(state.companyFiles.driveLinks)
              .filter((d) => d.id !== action.data.data.id)
              .reduce((acc, f) => {
                acc[f.id] = f;
                return acc;
              }, {}),
          },
        };
      }
    }
    case "REMOVE_COMPANY_FILES_UPLOADING_BAR": {
      return {
        ...state,
        companyFiles: {
          ...state.companyFiles,
          items: Object.values(state.companyFiles.items)
            .filter((f) => !action.data.fileIds.some((id) => id === f.id))
            .reduce((acc, file) => {
              acc[file.id] = file;
              return acc;
            }, {}),
        },
      };
    }
    case "REMOVE_WORKSPACE_FILES_UPLOADING_BAR": {
      let hubKey = `${action.data.topic_id}-${action.data.slug}`;
      return {
        ...state,
        workspaceFiles: {
          ...state.workspaceFiles,
          ...(state.workspaceFiles[hubKey] && {
            [hubKey]: {
              ...state.workspaceFiles[hubKey],
              files: Object.values(state.workspaceFiles[hubKey].files)
                .filter((f) => !action.data.fileIds.some((id) => id === f.id))
                .reduce((acc, file) => {
                  acc[file.id] = file;
                  return acc;
                }, {}),
            },
          }),
        },
      };
    }
    default:
      return state;
  }
};
