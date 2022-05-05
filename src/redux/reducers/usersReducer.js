const INITIAL_STATE = {
  user: null,
  users: {},
  usersLoaded: false,
  getUserFilter: {
    hasMore: false,
    limit: 1000,
    skip: 0,
  },
  viewedProfile: null,
  onlineUsers: [],
  mentions: {},
  roles: {},
  externalUsers: [],
  archivedUsers: [],
  profileSlider: null,
  usersWithoutActivity: [],
  usersWithoutActivityLoaded: false,
  teams: {},
  teamsLoaded: false,
  archivedUsersLoaded: false,
  impersonation: {
    loading: false,
  },
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "INCOMING_INTERNAL_USER": {
      let user = {
        ...action.data,
        active: 1,
        has_accepted: false,
        address: "",
        company: "",
        contact: "",
        deactivate: false,
        designation: "",
        external_company_name: "",
        external_id: null,
        is_favourite: false,
        place: "",
        profile_image_link: null,
        profile_image_thumbnail_link: null,
        type: "internal",
      };
      delete user["SOCKET_TYPE"];

      return {
        ...state,
        users: {
          ...state.users,
          [user.id]: {
            ...user,
            name: user.name.toString(),
          },
        },
        mentions: {
          ...state.mentions,
          [user.id]: user,
        },
      };
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
    case "GET_USERS_SUCCESS": {
      let users = { ...state.users };
      let mentions = { ...state.mentions };
      action.data.users.forEach((item) => {
        users[item.id] = {
          ...users[item.id],
          ...item,
          name: item.name.toString(),
        };
        mentions[item.id] = {
          ...mentions[item.id],
          ...item,
        };
      });

      return {
        ...state,
        users: users,
        mentions: mentions,
        getUserFilter: {
          hasMore: action.data.users.length === action.data.limit,
          limit: action.data.limit,
          skip: action.data.next_skip,
        },
        usersLoaded: true,
      };
    }
    case "GET_EXTERNAL_USERS_SUCCESS": {
      let users = { ...state.users };
      let mentions = { ...state.mentions };
      action.data.users.forEach((item) => {
        users[item.id] = {
          ...users[item.id],
          ...item,
          name: item.name.toString(),
        };
        mentions[item.id] = {
          ...mentions[item.id],
          ...item,
        };
      });

      return {
        ...state,
        users: users,
        mentions: mentions,
        externalUsers: action.data.users,
      };
    }
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
            name: user.name.toString(),
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
            name: userData.name.toString(),
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
          ...action.data,
          id: action.data.id,
          first_name: action.data.first_name,
          middle_name: action.data.middle_name,
          last_name: action.data.last_name,
          name: action.data.name.toString(),
          email: action.data.email,
          active: action.data.active,
          profile_image_link: action.data.profile_image_link,
          contact: action.data.contact,
          company: action.data.company,
          designation: action.data.designation,
          partial_name: action.data.partial_name,
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
          name: action.data.current_user.name.toString(),
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
      let roles = { ...state.roles };
      action.data.forEach((role) => {
        roles[role.name] = role.id;
      });
      return {
        ...state,
        roles: roles,
      };
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
              id: action.data.role.id,
              name: action.data.role.name,
              display_name: action.data.role.name,
            },
          },
        },
      };
    }
    case "GET_ARCHIVED_USERS_SUCCESS": {
      return {
        ...state,
        archivedUsers: action.data.users,
        archivedUsersLoaded: true,
      };
    }
    case "INCOMING_ARCHIVED_USER": {
      //let archivedUser = state.users[action.data.user.id];
      let updatedUsers = { ...state.users };
      updatedUsers[action.data.user.id].active = 0;
      let updatedMentions = { ...state.mentions };
      delete updatedMentions[action.data.user.id];
      return {
        ...state,
        //archivedUsers: [...state.archivedUsers, archivedUser],
        mentions: updatedMentions,
        users: updatedUsers,
      };
    }
    case "INCOMING_UNARCHIVED_USER": {
      //let archivedUser = state.users[action.data.user.id];
      let updatedUsers = { ...state.users };
      updatedUsers[action.data.profile.id] = action.data.profile;
      let updatedMentions = { ...state.mentions };
      updatedMentions[action.data.profile.id] = action.data.profile;
      return {
        ...state,
        archivedUsers: state.archivedUsers.filter((m) => m.id !== action.data.profile.id),
        mentions: updatedMentions,
        users: updatedUsers,
      };
    }
    case "INCOMING_DEACTIVATED_USER": {
      let updatedUsers = { ...state.users };
      updatedUsers[action.data.user_id].active = 0;
      updatedUsers[action.data.user_id].deactivate = true;
      let updatedMentions = { ...state.mentions };
      delete updatedMentions[action.data.user_id];
      return {
        ...state,
        mentions: updatedMentions,
        users: updatedUsers,
      };
    }
    case "INCOMING_ACTIVATED_USER": {
      let updatedUsers = { ...state.users };
      updatedUsers[action.data.user.id] = { ...action.data.user, deactivate: false };
      let updatedMentions = { ...state.mentions };
      updatedMentions[action.data.user.id] = action.data.user;
      return {
        ...state,
        mentions: updatedMentions,
        users: updatedUsers,
        archivedUsers: state.archivedUsers.filter((m) => m.id !== action.data.user.id),
      };
    }
    case "INCOMING_ONLINE_USERS": {
      return {
        ...state,
        onlineUsers: action.data.result,
      };
    }
    case "SET_PROFILE_SLIDER": {
      return {
        ...state,
        profileSlider: action.data.id && state.users[action.data.id] ? state.users[action.data.id] : null,
      };
    }
    case "GET_USERS_WITHOUT_ACTIVITY_SUCCESS": {
      return {
        ...state,
        usersWithoutActivity: action.data,
        usersWithoutActivityLoaded: true,
      };
    }
    case "INCOMING_DELETED_USER": {
      return {
        ...state,
        users: Object.values(state.users).reduce((acc, user) => {
          if (user.id !== action.data.id) {
            acc[user.id] = user;
          }
          return acc;
        }, {}),
      };
    }
    case "INCOMING_ACCEPTED_INTERNAL_USER": {
      const newUser = {
        active: 1,
        email: action.data.email,
        first_name: action.data.first_name,
        has_accepted: true,
        id: action.data.id,
        name: action.data.name,
        partial_name: action.data.partial_name,
        profile_image_link: action.data.profile_image_link,
        profile_image_thumbnail_link: action.data.profile_image_thumbnail_link,
        slug: null,
        type: "internal",
      };
      return {
        ...state,
        users: Object.values(state.users).reduce((acc, user) => {
          if (user.id === action.data.id) {
            acc[user.id] = { ...user, ...action.data, has_accepted: true };
          } else {
            acc[user.id] = user;
          }
          return acc;
        }, {}),
        teams: action.data.team_ids.length
          ? Object.values(state.teams).reduce((acc, t) => {
              if (action.data.team_ids.some((id) => id === t.id)) {
                acc[t.id] = {
                  ...t,
                  member_ids: t.member_ids.some((mid) => mid === action.data.id) ? t.member_ids : [...t.member_ids, action.data.id],
                  members: t.member_ids.some((mid) => mid === action.data.id)
                    ? t.members.map((m) => {
                        if (action.data.id === m.id) {
                          return { ...m, has_accepted: true };
                        } else return m;
                      })
                    : [...t.members, newUser],
                };
              } else {
                acc[t.id] = t;
              }
              return acc;
            }, {})
          : state.teams,
      };
    }
    case "GET_TEAMS_SUCCESS": {
      return {
        ...state,
        teamsLoaded: true,
        teams: action.data.teams.reduce((acc, team) => {
          acc[team.id] = team;
          return acc;
        }, {}),
      };
    }
    case "INCOMING_UPDATED_TEAM":
    case "INCOMING_TEAM":
    case "CREATE_TEAM_SUCCESS": {
      return {
        ...state,
        teams: {
          ...state.teams,
          [action.data.id]: { ...action.data, is_shared: null },
        },
      };
    }
    case "INCOMING_DELETED_TEAM": {
      return {
        ...state,
        teams: Object.values(state.teams)
          .filter((t) => t.id !== action.data.id)
          .reduce((acc, team) => {
            acc[team.id] = team;
            return acc;
          }, {}),
      };
    }
    case "INCOMING_REMOVED_TEAM_MEMBER":
    case "REMOVE_TEAM_MEMBER_SUCCESS":
    case "INCOMING_TEAM_MEMBER":
    case "ADD_TEAM_MEMBER_SUCCESS": {
      return {
        ...state,
        teams: Object.values(state.teams).reduce((acc, team) => {
          if (team.id === parseInt(action.data.id)) {
            acc[team.id] = { ...team, member_ids: action.data.member_ids, members: action.data.members };
          } else {
            acc[team.id] = team;
          }
          return acc;
        }, {}),
      };
    }
    case "SEARCH_USERS_SUCCESS": {
      return {
        ...state,
        users: {
          ...state.users,
          ...(action.data.users && {
            ...Object.values(action.data.users).reduce((acc, user) => {
              if (!state.users[user.id]) {
                acc[user.id] = user;
              }
              return acc;
            }, {}),
          }),
        },
      };
    }
    case "BATCH_UPDATE_PROFILE_IMAGE_SUCCESS": {
      const updatedUser = action.data.reduce((acc, user) => {
        acc[user.id] = { ...user };
        return acc;
      }, {});
      return {
        ...state,
        users: {
          ...state.users,
          ...updatedUser,
        },
      };
    }

    case "IMPERSONATION_LOGIN_START": {
      debugger;
      return {
        ...state,
        impersonation: {
          ...state.impersonation,
          loading: true,
        },
      };
    }
    case "IMPERSONATION_LOGIN_FAILURE": {
      return {
        ...state,
        impersonation: {
          ...state.impersonation,
          loading: false,
        },
      };
    }
    case "GET_CURRENT_IMPERSONATION_USER_SUCCESS": {
      return {
        ...state,
        impersonation: {
          ...state.impersonation,
          loading: false,
        },
      };
    }
    case "GET_CURRENT_IMPERSONATION_USER_FAILURE": {
      return {
        ...state,
        impersonation: {
          ...state.impersonation,
          loading: false,
        },
      };
    }
    default:
      return state;
  }
};
