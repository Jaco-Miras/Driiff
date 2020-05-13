const INITIAL_STATE = {
    _global: {
        user: {},
    },
    posts: {},
    totalPostsCount: 0,
    unreadPostsCount: 0,
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {

        default:
            return state;
    }
} 