import {convertArrayToObject} from "../../helpers/arrayHelper";

const INITIAL_STATE = {
    users: {},
    viewedProfile: null,
    onlineUsers: [],
    mentions: {},
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case "GET_MENTION_USERS_SUCCESS": {
            return {
                ...state,
                mentions: convertArrayToObject(action.data.result, "id"),
            };
        }
        case "GET_ONLINE_USERS_SUCCESS": {
            return {
                ...state,
                onlineUsers: action.data.result,
            };
        }
        default:
            return state;
    }
} 