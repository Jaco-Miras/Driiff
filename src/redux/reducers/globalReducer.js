const INITIAL_STATE = {
    user: null,
    recipients: [],
    isLoading: false,
    isBrowserActive: true,
    modals: {},
    slugs: [],
    navMode: 2,
    dataFromInput: null,
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
        case "SET_NAV_MODE": {
            return {
                ...state,
                navMode: action.data.mode,
            };
        }
        case "TOGGLE_LOADING": {
            return {
                ...state,
                isLoading: typeof action.data !== "undefined" ? action.data : !state.isLoading,
            };
        }
        case "ADD_TO_MODALS": {
            return {
                ...state,
                modals: {
                    ...state.modals,
                    [action.data.type]: action.data,
                },
            };
        }
        case "CLEAR_MODAL": {
            let updatedModals = {...state.modals};
            delete updatedModals[action.data.type];

            return {
                ...state,
                modals: updatedModals,
            };
        }
        case "SAVE_INPUT_DATA": {
            return {
                ...state,
                dataFromInput: action.data,
            };
        }
        case "CLEAR_INPUT_DATA": {
            return {
                ...state,
                dataFromInput: null,
            };
        }
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