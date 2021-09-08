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
    default:
      return state;
  }
};
