const INITIAL_STATE = {
    user: null,
    users: {},
    getUserFilter: {
        hasMore: false,
        limit: 1000,
        skip: 0,
    },
    viewedProfile: null,
    onlineUsers: [],
    mentions: {},
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case "ADD_USER_TO_REDUCERS": {
            return {
                ...state,
                user: action.data,
            };
        }
        case "GET_MENTION_USERS_SUCCESS": {
            let mentions = state.mentions;
            action.data.result.forEach((item) => {
                mentions[item.id] = {
                    ...mentions[item.id],
                    ...item,
                };
            });

            return {
                ...state,
                mentions: mentions,
            };
        }
        case "GET_ONLINE_USERS_SUCCESS": {
            return {
                ...state,
                onlineUsers: action.data.result,
            };
        }
        case "GET_USERS_SUCCESS":
            let users = state.users;
            action.data.users.forEach((item) => {
                users[item.id] = {
                    ...users[item.id],
                    ...item,
                };
            });

            return {
                ...state,
                users: users,
                getUserFilter: {
                    hasMore: action.data.users.length === action.data.limit,
                    limit: action.data.limit,
                    skip: action.data.next_skip,
                },
            };
        case "GET_USER_SUCCESS": {
            const {CHAT_SETTINGS, DISABLE_SOUND, GENERAL_SETTINGS, ORDER_CHANNEL, id, ...userData} = action.data;

            let user = state.users[id];
            if (user) {
                user = {
                    ...user,
                    userData,
                };
            } else {
                user = userData;
            }

            return {
                ...state,
                users: {
                    ...state.users,
                    [id]: {
                        id: id,
                        ...user,
                        loaded: true,
                    },
                },
            };
        }
        case "UPDATE_USER_SUCCESS": {
            const {CHAT_SETTINGS, DISABLE_SOUND, GENERAL_SETTINGS, ORDER_CHANNEL, id, ...userData} = action.data;

            return {
                ...state,
                users: {
                    ...state.users,
                    [id]: {
                        id: id,
                        ...state.users[id],
                        ...userData,
                    },
                },
            };
        }
        default:
            return state;
    }
} 