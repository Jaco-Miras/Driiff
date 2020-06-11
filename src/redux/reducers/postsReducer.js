const INITIAL_STATE = {
    user: null,
    posts: {},
    totalPostsCount: 0,
    unreadPostsCount: 0,
    editPostComment: null,
    commentQuotes: {},
    parentId: null
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
        case "ADD_COMMENT_QUOTE": {
            let updatedQuotes = {...state.commentQuotes};
            if (Object.keys(state.commentQuotes).length > 0 && state.commentQuotes.hasOwnProperty(action.data.id)) {
                updatedQuotes = {...state.commentQuotes};
                delete updatedQuotes[action.data.id];
                updatedQuotes = {
                    ...updatedQuotes,
                    [action.data.id]: action.data,
                };
            } else {
                updatedQuotes = {
                    ...state.commentQuotes,
                    [action.data.id]: action.data,
                };
            }
            return {
                ...state,
                commentQuotes: updatedQuotes,
            };
        }
        case "CLEAR_COMMENT_QUOTE": {
            let updatedQuotes = {...state.commentQuotes};
            delete updatedQuotes[action.data];

            return {
                ...state,
                commentQuotes: updatedQuotes,
            };
        }
        case "SET_PARENT_ID": {
            return {
                ...state,
                parentId: action.data
            }
        }
        default:
            return state;
    }
} 