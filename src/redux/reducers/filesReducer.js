import {convertArrayToObject} from "../../helpers/arrayHelper";

const INITIAL_STATE = {
    user: null,
    files: {},
    channelFiles: {},
    viewFiles: null,
    pendingWorkspaceFilesUpload: {},
    progressWorkspaceFilesUpload: {},
    workspaceFiles: {}
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case "ADD_USER_TO_REDUCERS": {
            return {
                ...state,
                user: action.data,
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
                return state
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
                    [action.data.channel_id]: channelFiles.filter(cf => {
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
                    }
                }
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
                    }
                }
            }
            return {
                ...state,
                workspaceFiles: newWorkspaceFiles
            }
        }
        case "GET_WORKSPACE_FILES_SUCCESS": {
            let newWorkspaceFiles = {...state.workspaceFiles};
            if (newWorkspaceFiles.hasOwnProperty(action.data.topic_id)) {
                if (action.data.folder_id && newWorkspaceFiles[action.data.topic_id].folders.hasOwnProperty(action.data.folder_id)) {
                    newWorkspaceFiles[action.data.topic_id].folders[action.data.folder_id].loaded = true;
                    newWorkspaceFiles[action.data.topic_id].folders[action.data.folder_id].files = action.data.files.map(f => f.id)
                }
                newWorkspaceFiles = {
                    [action.data.topic_id]: {
                        ...newWorkspaceFiles[action.data.topic_id],
                        files: {...convertArrayToObject(action.data.files, "id"), ...newWorkspaceFiles[action.data.topic_id].files},
                        loaded: true
                    }
                }
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
                        loaded: true
                    }
                }
            }
            return {
                ...state,
                workspaceFiles: newWorkspaceFiles
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
                    }
                }
            } else {
                newWorkspaceFiles = {
                    ...newWorkspaceFiles,
                    [action.data.topic_id]: {
                        ...newWorkspaceFiles[action.data.topic_id],
                        storage: action.data.total_storage,
                        count: action.data.total_file_count,
                        stars: action.data.total_file_stars,
                        trash: action.data.total_file_trash,
                    }
                }
            }
            return {
                ...state,
                workspaceFiles: newWorkspaceFiles
            }
        }
        case "GET_WORKSPACE_TRASH_FILES_SUCCESS": {
            let newWorkspaceFiles = {...state.workspaceFiles};
            if (newWorkspaceFiles.hasOwnProperty(action.data.topic_id)) {
                newWorkspaceFiles = {
                    [action.data.topic_id]: {
                        ...newWorkspaceFiles[action.data.topic_id],
                        //files: {...convertArrayToObject(action.data.files, "id"), ...newWorkspaceFiles[action.data.topic_id].files},
                        trash_files: convertArrayToObject(action.data.files, "id")
                    }
                }
            } else {
                newWorkspaceFiles = {
                    ...newWorkspaceFiles,
                    [action.data.topic_id]: {
                        ...newWorkspaceFiles[action.data.topic_id],
                        //files: {...convertArrayToObject(action.data.files, "id"), ...newWorkspaceFiles[action.data.topic_id].files},
                        trash_files: convertArrayToObject(action.data.files, "id")
                    }
                }
            }
            return {
                ...state,
                workspaceFiles: newWorkspaceFiles
            }
        }
        case "GET_WORKSPACE_FAVORITE_FILES_SUCCESS": {
            let newWorkspaceFiles = {...state.workspaceFiles};
            if (newWorkspaceFiles.hasOwnProperty(action.data.topic_id)) {
                newWorkspaceFiles = {
                    [action.data.topic_id]: {
                        ...newWorkspaceFiles[action.data.topic_id],
                        files: {...convertArrayToObject(action.data.files, "id"), ...newWorkspaceFiles[action.data.topic_id].files},
                        favorite_files: action.data.files.map(f => f.id)
                    }
                }
            } else {
                newWorkspaceFiles = {
                    ...newWorkspaceFiles,
                    [action.data.topic_id]: {
                        ...newWorkspaceFiles[action.data.topic_id],
                        files: {...convertArrayToObject(action.data.files, "id"), ...newWorkspaceFiles[action.data.topic_id].files},
                        favorite_files: action.data.files.map(f => f.id)
                    }
                }
            }
            return {
                ...state,
                workspaceFiles: newWorkspaceFiles
            }
        }
        case "GET_WORKSPACE_POPULAR_FILES_SUCCESS": {
            let newWorkspaceFiles = {...state.workspaceFiles};
            if (newWorkspaceFiles.hasOwnProperty(action.data.topic_id)) {
                newWorkspaceFiles = {
                    [action.data.topic_id]: {
                        ...newWorkspaceFiles[action.data.topic_id],
                        popular_files: action.data.files.map(f => f.id)
                    }
                }
            } else {
                newWorkspaceFiles = {
                    ...newWorkspaceFiles,
                    [action.data.topic_id]: {
                        ...newWorkspaceFiles[action.data.topic_id],
                        popular_files: action.data.files.map(f => f.id)
                    }
                }
            }
            return {
                ...state,
                workspaceFiles: newWorkspaceFiles
            }
        }
        case "GET_WORKSPACE_RECENT_EDIT_FILES_SUCCESS": {
            let newWorkspaceFiles = {...state.workspaceFiles};
            if (newWorkspaceFiles.hasOwnProperty(action.data.topic_id)) {
                newWorkspaceFiles = {
                    [action.data.topic_id]: {
                        ...newWorkspaceFiles[action.data.topic_id],
                        recently_edited: action.data.files.map(f => f.id)
                    }
                }
            } else {
                newWorkspaceFiles = {
                    ...newWorkspaceFiles,
                    [action.data.topic_id]: {
                        ...newWorkspaceFiles[action.data.topic_id],
                        recently_edited: action.data.files.map(f => f.id)
                    }
                }
            }
            return {
                ...state,
                workspaceFiles: newWorkspaceFiles
            }
        }
        case "GET_WORKSPACE_FOLDER_SUCCESS": {
            let newWorkspaceFiles = {...state.workspaceFiles};
            if (newWorkspaceFiles.hasOwnProperty(action.data.topic_id)) {
                newWorkspaceFiles = {
                    [action.data.topic_id]: {
                        ...newWorkspaceFiles[action.data.topic_id],
                        folders: convertArrayToObject(action.data.folders, "id"),
                    }
                }
            } else {
                newWorkspaceFiles = {
                    ...newWorkspaceFiles,
                    [action.data.topic_id]: {
                        ...newWorkspaceFiles[action.data.topic_id],
                        folders: convertArrayToObject(action.data.folders, "id"),
                    }
                }
            }
            return {
                ...state,
                workspaceFiles: newWorkspaceFiles
            }
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
                                [action.data.folder.id]: action.data.folder
                            }
                        }
                    }
                   return {
                       ...state,
                       workspaceFiles: newWorkspaceFiles
                   }
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
                    delete newWorkspaceFiles[action.data.topic_id].folders[action.data.folder.id];
                   return {
                       ...state,
                       workspaceFiles: newWorkspaceFiles
                   }
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
                                [action.data.file.id]: action.data.file
                            }
                        }
                    }
                   return {
                       ...state,
                       workspaceFiles: newWorkspaceFiles
                   }
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
                if (newWorkspaceFiles[action.data.topic_id].hasOwnProperty("folders") && action.data.folder_id) {
                    newWorkspaceFiles = {
                        ...newWorkspaceFiles,
                        [action.data.topic_id]: {
                            ...newWorkspaceFiles[action.data.topic_id],
                            folders: {
                                ...newWorkspaceFiles[action.data.topic_id].folders,
                                [action.data.folder_id]: {
                                    ...newWorkspaceFiles[action.data.topic_id].folders[action.data.folder_id],
                                    files: [...newWorkspaceFiles[action.data.topic_id].folders[action.data.folder_id].files, ...action.data.files.map(f => f.id)]
                                }
                            },
                            files: {...convertArrayToObject(action.data.files, "id"), ...newWorkspaceFiles[action.data.topic_id].files},
                            count: newWorkspaceFiles[action.data.topic_id].count + action.data.files.length
                        }
                    }
                } else {
                    newWorkspaceFiles = {
                        ...newWorkspaceFiles,
                        [action.data.topic_id]: {
                            ...newWorkspaceFiles[action.data.topic_id],
                            files: {...convertArrayToObject(action.data.files, "id"), ...newWorkspaceFiles[action.data.topic_id].files},
                            count: newWorkspaceFiles[action.data.topic_id].count + action.data.files.length
                        }
                    }
                }
                return {
                    ...state,
                    workspaceFiles: newWorkspaceFiles
                }
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
                        search_results: action.data.search_results.map(f => f.id),
                        search_value: action.data.search
                    }
                }
            } 
            return {
                ...state,
                workspaceFiles: newWorkspaceFiles
            }
        }
        case "CLEAR_FILE_SEARCH_RESULTS": {
            let newWorkspaceFiles = {...state.workspaceFiles};
            if (newWorkspaceFiles.hasOwnProperty(action.data.topic_id)) {
                newWorkspaceFiles = {
                    [action.data.topic_id]: {
                        ...newWorkspaceFiles[action.data.topic_id],
                        search_results: [],
                        search_value: ""
                    }
                }
            } 
            return {
                ...state,
                workspaceFiles: newWorkspaceFiles
            }
        }
        case "INCOMING_DELETED_FILE": {
            let newWorkspaceFiles = {...state.workspaceFiles};
            if (newWorkspaceFiles.hasOwnProperty(action.data.topic_id)) {
                let file = {...newWorkspaceFiles[action.data.topic_id].files[action.data.file_id]};
                newWorkspaceFiles = {
                    [action.data.topic_id]: {
                        ...newWorkspaceFiles[action.data.topic_id],
                        trash_files: {
                            ...newWorkspaceFiles[action.data.topic_id].trash_files, 
                            [file.id]: file
                        },
                        count: newWorkspaceFiles[action.data.topic_id].count - 1,
                        trash: newWorkspaceFiles[action.data.topic_id].trash + 1,
                    }
                }
                delete newWorkspaceFiles[action.data.topic_id].files[action.data.file_id];
                if (newWorkspaceFiles[action.data.topic_id].hasOwnProperty("folders")) {
                    Object.values(newWorkspaceFiles[action.data.topic_id].folders).forEach(f => {
                        if (f.hasOwnProperty("files") && newWorkspaceFiles[action.data.topic_id].folders[f.id].files.length) {
                            newWorkspaceFiles[action.data.topic_id].folders[f.id].files = newWorkspaceFiles[action.data.topic_id].folders[f.id].files.filter(id => id != action.data.file_id)
                        } else return;
                    })
                   return {
                       ...state,
                       workspaceFiles: newWorkspaceFiles
                   }
                } else {
                    return {
                        ...state,
                        workspaceFiles: newWorkspaceFiles
                    }
                }
            } else {
                return state;
            }
        }
        case "ADD_REMOVE_FAVORITE": {
            let newWorkspaceFiles = {...state.workspaceFiles};
            newWorkspaceFiles[action.data.topic_id].files[action.data.file_id].is_favorite = action.data.is_favorite;
            newWorkspaceFiles = {
                ...newWorkspaceFiles,
                [action.data.topic_id]: {
                    ...newWorkspaceFiles[action.data.topic_id],
                    stars: action.data.is_favorite ? 
                            newWorkspaceFiles[action.data.topic_id].stars + 1 
                            : newWorkspaceFiles[action.data.topic_id].stars - 1,
                    favorite_files: action.data.is_favorite ? 
                                [...newWorkspaceFiles[action.data.topic_id].favorite_files, action.data.file_id] 
                                : newWorkspaceFiles[action.data.topic_id].favorite_files.filter(id => id != action.data.file_id)
                }
            }
            return {
                ...state,
                workspaceFiles: newWorkspaceFiles
            }     
        }
        case "INCOMING_MOVED_FILE": {
            let newWorkspaceFiles = {...state.workspaceFiles};
            if (newWorkspaceFiles.hasOwnProperty(action.data.topic_id)) {
                if (newWorkspaceFiles[action.data.topic_id].folders[action.data.folder_id].hasOwnProperty("loaded")) {
                    newWorkspaceFiles[action.data.topic_id].folders[action.data.folder_id].files = [...newWorkspaceFiles[action.data.topic_id].folders[action.data.folder_id].files, action.data.file_id];
                   return {
                       ...state,
                       workspaceFiles: newWorkspaceFiles
                   }
                } else {
                    return state;
                }
            } else {
                return state;
            }
        }
        case "INCOMING_EMPTY_TRASH": {
            let newWorkspaceFiles = {...state.workspaceFiles};
            if (newWorkspaceFiles.hasOwnProperty(action.data.topic_id) && newWorkspaceFiles[action.data.topic_id].hasOwnProperty("trash_files")) {
                newWorkspaceFiles[action.data.topic_id].trash_files = {};
                newWorkspaceFiles[action.data.topic_id].trash = 0;
                return {
                    ...state,
                    workspaceFiles: newWorkspaceFiles
                }
            } else {
                return state;
            }
        }
        default:
            return state;
    }
} 