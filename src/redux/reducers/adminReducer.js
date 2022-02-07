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
  security: {
    password_policy: 0,
    invite_internal: 2,
    invite_guest: 3,
  },
  securityLoaded: false,
  postAccess: {
    post: null,
    post_user_ids: [],
    loaded: false,
  },
  notifications: {
    email: true,
    webpush: true,
    apn: true,
  },
  notificationsLoaded: false,
  automation: {
    bots: [],
    channels: [],
    grippBots: [],
    hasGrippLinked: null,
    grippDetails: null,
    grippUsers: [],
    grippToken: null,
    grippApiUrl: null,
  },
  subscriptions: null,
  stripe: {
    pricing: [],
    products: [],
    pricingFetched: false,
    productsFetched: false,
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
          grippBots: state.automation.grippBots.map((b) => {
            if (b.id === action.data.image_data.user) {
              return { ...b, image_path: action.data.image_data.image_url };
            } else {
              return b;
            }
          }),
        },
      };
    }
    case "GET_GRIPP_DETAILS_SUCCESS": {
      return {
        ...state,
        automation: {
          ...state.automation,
          grippDetails: action.data,
        },
      };
    }
    case "GET_GRIPP_USERS_SUCCESS": {
      return {
        ...state,
        automation: {
          ...state.automation,
          grippUsers: action.data.employees,
          grippApiUrl: action.data.gripp_api_url,
          grippToken: action.data.gripp_token,
        },
      };
    }
    case "SYNC_GRIPP_USERS_SUCCESS": {
      return {
        ...state,
        automation: {
          ...state.automation,
          hasGrippLinked: true,
        },
      };
    }
    case "GET_DRIFF_COMP_SETTINGS_SUCCESS": {
      let subscriptions = null;
      Array.from(action.data.settings).map((value) => {
        if (value.subscriptions) {
          subscriptions = value.subscriptions;
        }
        return value;
      });
      if (subscriptions) {
        return {
          ...state,
          subscriptions: subscriptions,
        };
      } else {
        return state;
      }
    }
    case "INCOMING_UPDATED_SUBSCRIPTION": {
      return {
        ...state,
        subsrcriptions: action.data.subscriptions,
      };
    }
    case "GET_STRIPE_PRICING_SUCCESS": {
      return {
        ...state,
        stripe: {
          ...state.stripe,
          pricing: action.data.pricing,
          pricingFetched: true,
        },
      };
    }
    case "GET_STRIPE_PRODUCTS_SUCCESS": {
      return {
        ...state,
        stripe: {
          ...state.stripe,
          products: action.data.products,
          productsFetched: true,
        },
      };
    }
    case "GET_POST_ACCESS_SUCCESS": {
      return {
        ...state,
        postAccess: {
          post: action.data.post_access,
          post_user_ids: action.data.post_user_access,
          loaded: true,
        },
      };
    }
    case "INCOMING_POST_ACCESS": {
      return {
        ...state,
        postAccess: {
          post: action.data.post_access,
          post_user_ids: action.data.post_user_access,
          loaded: true,
        },
      };
    }
    case "PUT_NOTIFICATIONS_SETTINGS_SUCCESS": {
      return {
        ...state,
        notifications: action.data,
      };
    }
    case "GET_NOTIFICATIONS_SETTINGS_SUCCESS": {
      return {
        ...state,
        notifications: { ...action.data },
        notificationsLoaded: true,
      };
    }
    case "PUT_SECURITY_SETTINGS_SUCCESS": {
      return {
        ...state,
        security: action.data,
      };
    }
    case "GET_SECURITY_SETTINGS_SUCCESS": {
      return {
        ...state,
        security: action.data,
        securityLoaded: true,
      };
    }
    default:
      return state;
  }
};
