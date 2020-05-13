const INITIAL_STATE = {
    _global: {
        user: {},
    },
    recipients: {},
    isBrowserActive: true,
    modals: {},
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {

        default:
            return state;
    }
} 