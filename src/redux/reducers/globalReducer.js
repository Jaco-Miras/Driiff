const INITIAL_STATE = {
    _global: {
        user: {},
    },
    recipients: {},
    isLoading: 0,
    isBrowserActive: true,
    modals: {},
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {

        default:
            return state;
    }
} 