const INITIAL_STATE = {
    user: {},
    recipients: [],
    isLoading: 0,
    isBrowserActive: true,
    modals: {},
    slugs: [],
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {

        case "SET_BROWSER_TAB_STATUS": {
            return {
                ...state,
                isBrowserActive: action.data.status,
            };
        }
        case "GET_ALL_RECIPIENTS_SUCCESS": {
            return {
                ...state,
                recipients: action.data.recipients.filter(r => r.name !== null),
            };
        }
        default:
            return state;
    }
} 