import {convertArrayToObject} from "../../helpers/arrayHelper";

const INITIAL_STATE = {
    user: {},
    workspaces: {},
    activeTopic: null,
    activeTab: "internal",
    workspacesLoaded: false
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
                workspaces: workspaces,
                workspacesLoaded: true
            }
        }
        case "INCOMING_WORKSPACE_FOLDER": {
            if (state.workspacesLoaded) {
                let newWorkspaces = {...state.workspaces};
                newWorkspaces = {
                    ...newWorkspaces,
                    [action.data.id]: {
                        ...action.data,
                        topics: {},
                        selected: false
                    }
                }
                return {
                    ...state,
                    workspaces: newWorkspaces
                }
            } else {
                return state
            }
        }
        case "INCOMING_WORKSPACE": {
            if (state.workspacesLoaded) {
                let newWorkspaces = {...state.workspaces};
                newWorkspaces = {
                    ...newWorkspaces,
                    [action.data.workspace.id]: {
                        ...newWorkspaces[action.data.workspace.id],
                        topics: {
                            ...newWorkspaces[action.data.workspace.id].topics,
                            [action.data.topic.id]: {
                                ...action.data.topic,
                                selected: false,
                                unread_posts: 0,
                                unread_chats: 0,
                                private: action.data.topic.private ? 1 : 0,
                                channel: action.data.channel
                            }
                        },
                        selected: false
                    }
                }
                return {
                    ...state,
                    workspaces: newWorkspaces
                }
            } else {
                return state;
            }
        }
        case "INCOMING_UPDATED_WORKSPACE_FOLDER": {
            if (state.workspacesLoaded) {
                let workspace = {...state.workspaces[action.data.id]};
                workspace = {
                    ...workspace,
                    name: action.data.name,
                }
                return {
                    ...state,
                    workspaces: {
                        ...state.workspaces,
                        [action.data.id]: workspace
                    }
                }
            } else {
                return state;
            }
        }
        case "INCOMING_MOVED_TOPIC": {
            // get the topic from the original workspace id and transfer to the new workspace id
            if (state.workspacesLoaded) {
                // let topic = {...state.workspaces[action.data.original_workspace_id].topics[action.data.topic.id]}
                // let workspace = {...state.workspaces[action.data.workspace_id]}
                // workspace = {
                //     ...workspace,
                //     topics: {
                //         ...workspace.topics,
                //         [action.data.topic.id]: topic
                //     }
                // }
                // let newWorkspaces = {...state.workspaces}
                // delete newWorkspaces[action.data.original_workspace_id].topics[action.data.topic.id]
                // newWorkspaces = {
                //     ...newWorkspaces,
                //     [action.data.workspace_id]: workspace
                // }
                
                // return {
                //     ...state,
                //     workspaces: newWorkspaces
                // }
                return state
            } else {
                return state;
            }
        }
        default:
            return state;
    }
} 