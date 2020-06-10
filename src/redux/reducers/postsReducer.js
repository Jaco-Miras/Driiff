const INITIAL_STATE = {
    user: null,
    posts: {},
    totalPostsCount: 0,
    unreadPostsCount: 0,
    editPostComment: null
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case "ADD_USER_TO_REDUCERS": {
            return {
                ...state,
                user: action.data,
            };
        }
        case "SET_EDIT_POST_COMMENT": {
            return {
                ...state,
                editPostComment: action.data,
            };
        }
        default:
            return state;
    }
} 