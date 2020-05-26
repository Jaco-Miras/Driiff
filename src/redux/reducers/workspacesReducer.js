import {convertArrayToObject} from "../../helpers/arrayHelper";

const INITIAL_STATE = {
    user: {},
    workspaces: {},
    activeTopic: null
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
            let workspaces = {...state.workspaces};
            action.data.workspaces.forEach(ws => {
                let topics = {};
                if (ws.topics.length > 0) {
                    ws.topics.forEach(t => {
                        topics[t.id] = { ...t,
                            selected: false
                        }
                    })
                }
                workspaces[ws.id] = {
                    ...workspaces[ws.id],
                    ...ws,
                    selected: false,
                    topics: topics
                };
            })
            return {
                ...state,
                workspaces: workspaces
            }
        }
        default:
            return state;
    }
} 