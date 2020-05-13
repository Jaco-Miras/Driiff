const INITIAL_STATE = {
    _global: {
        user: {},
    },
    channels: {},
    selectedChannel: null,
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {

        default:
            return state;
    }
} 