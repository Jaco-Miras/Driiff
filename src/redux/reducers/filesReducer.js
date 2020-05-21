import {convertArrayToObject} from "../../helpers/arrayHelper";

const INITIAL_STATE = {
    user: null,
    files: {},
    channelFiles: {},
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
                files: convertArrayToObject(action.data.files, "id")
            }
        }
        case "GET_CHANNEL_FILES_SUCCESS": {
            return {
                ...state,
                channelFiles: {
                    ...state.channelFiles,
                    [action.data.channel_id]: action.data.results.map(f => f.file_id)
                }
            }
        }
        default:
            return state;
    }
} 