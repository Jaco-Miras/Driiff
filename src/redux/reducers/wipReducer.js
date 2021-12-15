import { convertArrayToObject } from "../../helpers/arrayHelper";
const INITIAL_STATE = {
  user: {},
  WIPs: {},
  subjects: [],
  activeSubject: null,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "ADD_USER_TO_REDUCERS": {
      return {
        ...state,
        user: action.data,
      };
    }
    case "INCOMING_WIP": {
      return {
        ...state,
        WIPs: {
          ...state.WIPs,
          [action.data.subject.topic_id]: {
            ...(state.WIPs[action.data.subject.topic_id] && {
              ...state.WIPs[action.data.subject.topic_id],
              items: {
                ...state.WIPs[action.data.subject.topic_id].wips,
                [action.data.id]: {
                  ...action.data,
                },
              },
            }),
            ...(!state.WIPs[action.data.subject.topic_id] && {
              items: {
                [action.data.id]: {
                  ...action.data,
                },
              },
            }),
          },
        },
      };
    }
    case "INCOMING_WIP_SUBJECT":
    case "CREATE_WIP_SUCCESS": {
      return {
        ...state,
        subjects: [...state.subjects, action.data],
      };
    }
    case "GET_WIP_SUBJECTS_SUCCESS": {
      return {
        ...state,
        subjects: [...state.subjects, ...action.data],
      };
    }
    case "ADD_WIPS": {
      return {
        ...state,
        WIPs: {
          ...state.WIPs,
          [action.data.topic_id]: {
            ...(state.WIPs[action.data.topic_id] && {
              ...state.WIPs[action.data.topic_id],
              items: {
                ...state.WIPs[action.data.topic_id].wips,
                ...convertArrayToObject(action.data.proposals, "id"),
              },
            }),
            ...(!state.WIPs[action.data.topic_id] && {
              items: convertArrayToObject(action.data.proposals, "id"),
            }),
          },
        },
      };
    }
    case "GET_WIP_DETAIL_SUCCESS": {
      return {
        ...state,
        WIPs: {
          ...state.WIPs,
          [action.data.topic_id]: {
            ...(state.WIPs[action.data.topic_id] && {
              ...state.WIPs[action.data.topic_id],
              items: {
                ...state.WIPs[action.data.topic_id].wips,
                ...(!state.WIPs[action.data.topic_id].items[action.data.id] && {
                  [action.data.id]: {
                    ...action.data,
                    clap_user_ids: [],
                  },
                }),
              },
            }),
            ...(!state.WIPs[action.data.topic_id] && {
              items: {
                [action.data.id]: {
                  ...action.data,
                  clap_user_ids: [],
                },
              },
            }),
          },
        },
      };
    }
    default:
      return state;
  }
};
