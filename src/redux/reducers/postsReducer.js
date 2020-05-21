const INITIAL_STATE = {
    user: null,
    posts: {},
    totalPostsCount: 0,
    unreadPostsCount: 0,
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case "ADD_USER_TO_REDUCERS": {
            return {
                ...state,
                user: action.data
            }
        }
        default:
            return state;
    }
} 