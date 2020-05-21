const INITIAL_STATE = {
    user: null,
    notifications: {},
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case "ADD_USER_TO_REDUCERS": {
            return {
                ...state,
                user: action.data,
            };
        }
        default:
            return state;
    }
} 