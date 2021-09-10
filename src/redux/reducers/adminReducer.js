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
    grippBots: [],
    hasGrippLinked: null,
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
          ...state.automation,
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
    case "GET_GRIPP_BOT_SUCCESS": {
      return {
        ...state,
        automation: {
          ...state.automation,
          grippBots: action.data.gripp_bot_users,
          channels: action.data.channels,
          hasGrippLinked: true,
        },
      };
    }
    case "GET_GRIPP_BOT_FAILURE": {
      if (action.error.response?.data?.errors?.error_message.includes("Required gripp credentials")) {
        return {
          ...state,
          automation: {
            ...state.automation,
            hasGrippLinked: false,
          },
        };
      } else {
        return state;
      }
    }
    case "UPDATE_GRIPP_BOT_SUCCESS": {
      return {
        ...state,
        automation: {
          ...state.automation,
          grippBots: state.automation.grippBots.map((b) => {
            if (b.id === parseInt(action.data.id)) {
              return { ...action.data, id: parseInt(action.data.id) };
            } else {
              return b;
            }
          }),
        },
      };
    }
    case "POST_UPLOAD_USER_BOT_ICON_SUCCESS": {
      return {
        ...state,
        automation: {
          ...state.automation,
          bots: state.automation.bots.map((b) => {
            if (b.id === action.data.image_data.user) {
              return { ...b, image_path: action.data.image_data.image_url };
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
