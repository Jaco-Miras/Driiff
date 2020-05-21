const INITIAL_STATE = {
    user: null,
    users: {},
    getUserFilter: {
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
            action.data.result.forEach((item, index) => {
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
            action.data.users.forEach((item, index) => {
                users[item.id] = {
                    ...users[item.id],
                    ...item,
                };
            });

            return {
                ...state,
                users: users,
                getUserFilter: {
                    limit: 1000,
                    skip: action.data.next_skip,
                },
            };
        default:
            return state;
    }
} 