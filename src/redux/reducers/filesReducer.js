import {convertArrayToObject} from "../../helpers/arrayHelper";

const INITIAL_STATE = {
    user: null,
    files: {},
    channelFiles: {},
    viewFiles: null,
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
                        for(let i in action.data.file_ids) {
                            if(cf.file_id === action.data.file_ids[i]) {
                                fileFound = true;
                            }
                        }
                        return !fileFound;
                    })
                },
            };
        }
        case "SET_VIEW_FILES": {
            return {
                ...state,
                viewFiles: action.data,
            };
        }
        default:
            return state;
    }
} 