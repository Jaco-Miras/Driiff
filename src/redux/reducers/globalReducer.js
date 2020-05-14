const INITIAL_STATE = {
    user: {},
    recipients: {},
    isLoading: 0,
    isBrowserActive: true,
    modals: {},
    slugs: [],
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {

        default:
            return state;
    }
} 