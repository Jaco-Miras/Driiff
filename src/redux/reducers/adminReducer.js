const INITIAL_STATE = {
  filters: {
    automation: false,
    quick_links: false,
    settings: false,
    bots: false,
    subsrcription: false,
    contact: false,
    support: false,
  },
  loginFetched: false,
  login: {
    google_login: true,
    magic_link: true,
    sign_up: true,
    password_login: true,
  },
  automation: {
    bots: [],
    channels: [],
  },
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "GET_LOGIN_SETTINGS_SUCCESS": {
      return {
        ...state,
        login: { ...state.login, ...action.data },
        loginFetched: true,
      };
    }
    case "SET_ADMIN_FILTER": {
      return {
        ...state,
        filters: { ...action.data.filters },
      };
    }
    case "PUT_LOGIN_SETTINGS_SUCCESS": {
      return {
        ...state,
        login: { ...state.login, ...action.data },
      };
    }
    case "GET_USER_BOT_SUCCESS": {
      return {
        ...state,
        automation: {
          bots: action.data.bots,
          channels: action.data.channels,
        },
      };
    }
    case "DELETE_USER_BOT_SUCCESS": {
      return {
        ...state,
        automation: {
          ...state.automation,
          bots: state.automation.bots.filter((b) => b.id !== parseInt(action.data.user_id)),
        },
      };
    }
    case "CREATE_USER_BOT_SUCCESS": {
      return {
        ...state,
        automation: {
          ...state.automation,
          bots: [...state.automation.bots, action.data],
        },
      };
    }
    case "UPDATE_USER_BOT_SUCCESS": {
      return {
        ...state,
        automation: {
          ...state.automation,
          bots: state.automation.bots.map((b) => {
            if (b.id === action.data.id) {
              return action.data;
            } else {
              return b;
            }
          }),
        },
      };
    }
    default:
      return state;
  }
};
