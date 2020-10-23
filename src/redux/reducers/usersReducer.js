const INITIAL_STATE = {
  user: null,
  users: {},
  getUserFilter: {
    hasMore: false,
    limit: 1000,
    skip: 0,
  },
  viewedProfile: null,
  onlineUsers: [],
  mentions: {},
  roles: {}
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "INCOMING_INTERNAL_USER": {
      let user = {
        contact: "",
        active: 1,
        ...action.data
      };
      delete user["SOCKET_TYPE"];

      return {
        ...state,
        users: {
          ...state.users,
          [user.id]: user
        },
        mentions: {
          ...state.mentions,
          [user.id]: user
        }
      }
    }
    case "ADD_USER_TO_REDUCERS": {
      return {
        ...state,
        user: action.data,
      };
    }
    case "GET_MENTION_USERS_SUCCESS": {
      let mentions = state.mentions;
      action.data.result.forEach((item) => {
        mentions[item.id] = {
          ...mentions[item.id],
          ...item,
        };
      });

      return {
        ...state,
        mentions: mentions,
      };
    }
    case "GET_ONLINE_USERS_SUCCESS": {
      return {
        ...state,
        onlineUsers: action.data.result,
      };
    }
    case "GET_USERS_SUCCESS":
      let users = {...state.users};
      action.data.users.forEach((item) => {
        users[item.id] = {
          ...users[item.id],
          ...item,
        };
      });

      return {
        ...state,
        users: users,
        getUserFilter: {
          hasMore: action.data.users.length === action.data.limit,
          limit: action.data.limit,
          skip: action.data.next_skip,
        },
      };
    case "GET_USER_SUCCESS": {
      const { CHAT_SETTINGS, GENERAL_SETTINGS, ORDER_CHANNEL, id, ...userData } = action.data;

      let user = state.users[id];
      if (user) {
        user = {
          ...user,
          userData,
        };
      } else {
        user = userData;
      }

      return {
        ...state,
        users: {
          ...state.users,
          [id]: {
            id: id,
            ...user,
            loaded: true,
          },
        },
      };
    }
    case "UPDATE_USER_SUCCESS": {
      const { CHAT_SETTINGS, GENERAL_SETTINGS, ORDER_CHANNEL, id, ...userData } = action.data;

      return {
        ...state,
        users: {
          ...state.users,
          [id]: {
            id: id,
            ...state.users[id],
            ...userData,
          },
        },
      };
    }
    case "INCOMING_UPDATED_USER": {
      let updatedUsers = { ...state.users };
      let updatedMentions = { ...state.mentions };
      if (Object.keys(state.users).length) {
        updatedUsers[action.data.id] = {
          ...updatedUsers[action.data.id],
          id: action.data.id,
          first_name: action.data.first_name,
          middle_name: action.data.middle_name,
          last_name: action.data.last_name,
          name: action.data.name,
          email: action.data.email,
          active: action.data.active,
          profile_image_link: action.data.profile_image_link,
          contact: action.data.contact,
          company: action.data.company,
          designation: action.data.designation,
          partial_name: action.data.partian_name,
          import_from: action.data.import_from,
          place: action.data.place,
          address: action.data.address,
        };
      }
      if (Object.keys(state.mentions).length) {
        updatedMentions[action.data.id] = {
          id: action.data.id,
          first_name: action.data.first_name,
          name: action.data.name,
          profile_image_link: action.data.profile_image_link,
        };
      }
      return {
        ...state,
        users: updatedUsers,
        mentions: updatedMentions,
      };
    }
    case "INCOMING_EXTERNAL_USER": {
      let updatedUsers = { ...state.users };
      let updatedMentions = { ...state.mentions };
      if (Object.keys(state.users).length) {
        updatedUsers[action.data.current_user.id] = {
          ...action.data.current_user,
          address: "",
          role: null,
          designation: "",
          is_favourite: false,
          place: "",
          slug: null,
          contact: "",
          company: "",
        };
      }
      if (Object.keys(state.mentions).length) {
        updatedMentions[action.data.current_user.id] = {
          id: action.data.current_user.id,
          first_name: action.data.current_user.first_name,
          name: action.data.current_user.name,
          profile_image_link: action.data.current_user.profile_image_link,
        };
      }
      return {
        ...state,
        users: updatedUsers,
        mentions: updatedMentions,
      };
    }
    case "GET_ROLES_SUCCESS": {
      let roles = {...state.roles};
      action.data.forEach((role) => {
        roles[role.name] = role.id
      });
      return {
        ...state,
        roles: roles
      }
    }
    case "INCOMING_USER_ROLE": {
      return {
        ...state,
        users: {
          ...state.users,
          [action.data.user_id]: {
            ...state.users[action.data.user_id],
            role: {
              ...state.users[action.data.user_id].role,
              name: action.data.role.name,
              display_name: action.data.role.name === "admin" ? "Site Admin" : "Employee"
            }
          }
        }
      }
    }
    default:
      return state;
  }
};
