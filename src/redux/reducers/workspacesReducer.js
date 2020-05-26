import {convertArrayToObject} from "../../helpers/arrayHelper";

const INITIAL_STATE = {
    user: {},
    workspaces: {},
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
            console.log(action.data)
            return {
                ...state,
                workspaces: convertArrayToObject(action.data.workspaces, 'id')
            }
        }
        default:
            return state;
    }
} 