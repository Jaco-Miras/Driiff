import {convertArrayToObject} from "../../helpers/arrayHelper";

const INITIAL_STATE = {
    user: {},
    workspaces: {},
    activeTopic: null,
    activeTab: "intern",
    workspacesLoaded: false,
    externalWorkspacesLoaded: false,
    workspacePosts: {}
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
                if (ws.topics !== undefined && ws.topics.length > 0) {
                    ws.topics.forEach(t => {
                        topics[t.id] = { 
                            ...t,
                            selected: false,
                            is_external: ws.is_external,
                            workspace_id: ws.id,
                            workspace_name: ws.name,
                            workspace_description: ws.description,
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
                workspacesLoaded: !state.workspacesLoaded && action.data.is_external === 0 ? true : state.workspacesLoaded,
                externalWorkspacesLoaded: !state.externalWorkspacesLoaded && action.data.is_external === 1 ? true : state.externalWorkspacesLoaded,
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
                if (action.data.workspace) {
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
                                    channel: action.data.channel,
                                    is_external: action.data.is_external,
                                    workspace_name: action.data.workspace.name
                                }
                            },
                            selected: false
                        }
                    }
                } else {
                    newWorkspaces = {
                        ...newWorkspaces,
                        [action.data.id]: {
                            ...action.data,
                            name: action.data.topic.name,
                            selected: false,
                            topic_detail: {
                                ...action.data.topic,
                                channel: action.data.channel
                            }
                        }
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
            if (state.workspacesLoaded && action.data.type === "FOLDER") {
                let workspace = {...state.workspaces[action.data.id]};
                workspace = {
                    ...workspace,
                    name: action.data.name,
                    description: action.data.description,
                }
                return {
                    ...state,
                    workspaces: {
                        ...state.workspaces,
                        [action.data.id]: workspace
                    },
                    activeTopic: state.activeTopic && state.activeTopic.workspace_id !== undefined && state.activeTopic.workspace_id === action.data.id ?
                        {
                            ...state.activeTopic,
                            workspace_name: action.data.name,
                            workspace_description: action.data.description,
                        }
                    : state.activeTopic
                }
            } else if (state.workspacesLoaded && action.data.type === "WORKSPACE") {
                let workspace = null;
                if (action.data.workspace_id === 0) {
                    //direct workspace
                    if (action.data.original_workspace_id === 0) {
                        // still direct workspace
                        workspace = {...state.workspaces[action.data.id]};
                        workspace = {
                            ...workspace,
                            name: action.data.name,
                            member_ids: action.data.member_ids,
                            members: action.data.members,
                            description: action.data.description,
                        }
                        return {
                            ...state,
                            workspaces: {
                                ...state.workspaces,
                                [action.data.id]: workspace
                            },
                            activeTopic: state.activeTopic && state.activeTopic.id === action.data.id ?
                                {
                                    ...state.activeTopic,
                                    ...workspace
                                }
                            : state.activeTopic
                        }
                    } else {
                        //make workspace as direct
                        //delete the original workspace
                        let newWorkspaces = {...state.workspaces};
                        workspace = {...newWorkspaces[action.data.original_workspace_id].topics[action.data.id]};
                        delete newWorkspaces[action.data.original_workspace_id].topics[action.data.id]

                        workspace = {
                            ...workspace,
                            name: action.data.name,
                            description: action.data.description,
                            member_ids: action.data.member_ids,
                            members: action.data.members,
                            type: action.data.type,
                            key_id: action.data.key_id
                        }
                        delete workspace.workspace_id;
                        delete workspace.workspace_name;
                        delete workspace.workspace_descripiton;
                        newWorkspaces = {
                            ...newWorkspaces,
                            [action.data.id]: workspace
                        }
                        return {
                            ...state,
                            workspaces: newWorkspaces,
                            activeTopic: state.activeTopic && state.activeTopic.id === action.data.id ?
                                {
                                    ...workspace
                                }
                            : state.activeTopic
                        }
                    }
                } else {
                    //workspace under folder
                    let workspace = null;
                    if (action.data.original_workspace_id === action.data.workspace_id) {
                        //no change on folder workspace
                        let newWorkspaces = {...state.workspaces};
                        workspace = {...newWorkspaces[action.data.original_workspace_id].topics[action.data.id]};
                        workspace = {
                            ...workspace,
                            name: action.data.name,
                            description: action.data.description,
                            member_ids: action.data.member_ids,
                            members: action.data.members,
                        }
                        newWorkspaces = {
                            ...newWorkspaces,
                            [action.data.workspace_id]: {
                                ...newWorkspaces[action.data.workspace_id],
                                topics: {
                                    ...newWorkspaces[action.data.workspace_id].topics,
                                    [action.data.id]: workspace
                                }
                            }
                        }
                        return {
                            ...state,
                            workspaces: newWorkspaces,
                            activeTopic: state.activeTopic && state.activeTopic.workspace_id !== undefined && state.activeTopic.id === action.data.id ?
                                {
                                    ...state.activeTopic,
                                    ...workspace
                                }
                            : state.activeTopic
                        }
                    } else {
                        //moved workspace to another folder
                        // delete original workspace
                        let newWorkspaces = {...state.workspaces};
                        let workspaceFolder = {...newWorkspaces[action.data.workspace_id]}
                        
                        if (action.data.original_workspace_id === 0) {
                            workspace = {...newWorkspaces[action.data.id]};
                            delete newWorkspaces[action.data.id]
                        } else {
                            workspace = {...newWorkspaces[action.data.original_workspace_id].topics[action.data.id]};
                            delete newWorkspaces[action.data.original_workspace_id].topics[action.data.id]
                        }
                        
                        workspace = {
                            ...workspace,
                            name: action.data.name,
                            description: action.data.description,
                            member_ids: action.data.member_ids,
                            members: action.data.members,
                            workspace_id: action.data.workspace_id,
                            workspace_descripiton: workspaceFolder.description,
                            workspace_name: workspaceFolder.name
                        }
                        newWorkspaces = {
                            ...newWorkspaces,
                            [action.data.workspace_id]: {
                                ...newWorkspaces[action.data.workspace_id],
                                topics: {
                                    ...newWorkspaces[action.data.workspace_id].topics,
                                    [action.data.id]: workspace
                                }
                            }
                        }
                        return {
                            ...state,
                            workspaces: newWorkspaces,
                            activeTopic: state.activeTopic && state.activeTopic.workspace_id !== undefined && state.activeTopic.id === action.data.id ?
                                {
                                    ...state.activeTopic,
                                    ...workspace
                                }
                            : state.activeTopic
                        }
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
        case "SET_ACTIVE_TOPIC": {
            let newWorkspaces = {...state.workspaces};
            if (state.activeTopic) {
                if (state.activeTopic.workspace_id !== undefined) {
                    newWorkspaces = {
                        ...newWorkspaces,
                        [state.activeTopic.workspace_id]: {
                            ...newWorkspaces[state.activeTopic.workspace_id],
                            topics: {
                                ...newWorkspaces[state.activeTopic.workspace_id].topics,
                                [state.activeTopic.id]: {
                                    ...state.activeTopic,
                                    selected: false,
                                    channel: {
                                        ...state.activeTopic.channel,
                                        channel_loaded: true,
                                    }
                                }
                            },
                            selected: false
                        }
                    }
                } else {
                    //last active is direct workspace
                    newWorkspaces = {
                        ...newWorkspaces,
                        [state.activeTopic.id]: {
                            ...newWorkspaces[state.activeTopic.id],
                            selected: false,
                            channel_loaded: true,
                        }
                    }
                }
            }
            if (action.data.workspace_id !== undefined) {
                newWorkspaces = {
                    ...newWorkspaces,
                    [action.data.workspace_id]: {
                        ...newWorkspaces[action.data.workspace_id],
                        topics: {
                            ...newWorkspaces[action.data.workspace_id].topics,
                            [action.data.id]: {
                                ...action.data,
                                selected: true,
                                channel: {
                                    ...action.data.channel,
                                    channel_loaded: true,
                                }
                            }
                        },
                        selected: true
                    }
                }
            } else {
                newWorkspaces = {
                    ...newWorkspaces,
                    [action.data.id]: {
                        ...newWorkspaces[action.data.id],
                        selected: true,
                        channel_loaded: true,
                    }
                }
            }
            
            return {
                ...state,
                workspaces: newWorkspaces,
                activeTopic: {...action.data, selected: true}
            }
        }
        case "SET_ACTIVE_TAB": {
            return {
                ...state,
                activeTab: action.data
            }
        }
        case "ADD_TO_WORKSPACE_POSTS": {
            let convertedPosts = convertArrayToObject(action.data.posts, "id");
            return {
                ...state,
                workspacePosts: {
                    ...state.workspacePosts,
                    [action.data.topic_id]: {
                        filter: null,
                        sort: null,
                        posts: {
                            ...[action.data.topic_id].posts,
                            ...convertedPosts
                        }
                    }
                }
            }
        }
        case "UPDATE_WORKSPACE_POST_FILTER_SORT": {
            return {
                ...state,
                workspacePosts: {
                    ...state.workspacePosts,
                    [action.data.topic_id]: {
                        ...state.workspacePosts[action.data.topic_id],
                        filter: action.data.filter ? action.data.filter : state.workspacePosts[action.data.topic_id].filter,
                        sort: action.data.sort ? action.data.sort : state.workspacePosts[action.data.topic_id].sort,
                    }
                }
            }
        }
        case "JOIN_WORKSPACE_REDUCER": {
            let user = {
                id: action.data.user.id,
                name: action.data.user.name,
                first_name: action.data.user.first_name,
                profile_image_link: action.data.user.profile_image_link,
                partial_name: action.data.user.partial_name,
                active: 1,
            }
            let newWorkspaces = {...state.workspaces};
            let topic = null;
            if (newWorkspaces.hasOwnProperty(action.data.topic_id)){
                topic = {...newWorkspaces[action.data.topic_id]};
                topic = {
                    ...topic,
                    members: [...topic.members, {
                        ...user,
                        type: topic.members[0].type,
                        slug: topic.members[0].slug
                    }],
                    member_ids: [...topic.member_ids, user.id]
                };
                newWorkspaces = {
                    ...newWorkspaces,
                    [action.data.topic_id]: topic
                };
            } else {
                if (state.activeTopic.id === action.data.topic_id && 
                    (state.activeTopic.workspace_id !== undefined || state.activeTopic.workspace_id !== 0)) {
                    topic = {...newWorkspaces[state.activeTopic.workspace_id].topics[state.activeTopic.id]};
                    topic = {
                        ...topic,
                        members: [...topic.members, {
                            ...user,
                            type: topic.members[0].type,
                            slug: topic.members[0].slug
                        }],
                        member_ids: [...topic.member_ids, user.id]
                    };
                    newWorkspaces = {
                        ...newWorkspaces,
                        [state.activeTopic.workspace_id]: {
                            ...newWorkspaces[state.activeTopic.workspace_id],
                            topics: {
                                ...newWorkspaces[state.activeTopic.workspace_id].topics,
                                [action.data.topic_id]: topic
                            }
                        }
                    };
                } else {

                    // let folders = Object.values(newWorkspaces).filter(ws => {
                    //     return ws.type === "FOLDER" && Object.keys(ws.topics).length > 0
                    // })
                }
            }
            if (topic) {
                return {
                    ...state,
                    workspaces: newWorkspaces,
                    activeTopic: state.activeTopic.id === action.data.topic_id 
                        ? topic  
                        : state.activeTopic
                }
            } else {
                return state
            }
        }
        default:
            return state;
    }
} 