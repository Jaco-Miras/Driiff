import { convertArrayToObject } from "../../helpers/arrayHelper";
//import { groupBy } from "lodash";

const INITIAL_STATE = {
  user: null,
  i18n: null,
  i18nLoaded: false,
  recipients: [],
  isLoading: false,
  isBrowserActive: true,
  modals: {},
  slugs: [],
  navMode: 2,
  dataFromInput: null,
  unreadCounter: {},
  socketMounted: false,
  searchValue: "",
  searchResults: {},
  searchCount: 0,
  searching: false,
  tabs: {},
  links: []
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
        recipients: action.data.recipients.filter((r) => r.name !== null),
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
      let updatedModals = { ...state.modals };
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
        user: action.data,
        socketMounted: true
      };
    }
    case "GET_TRANSLATION_OBJECT_SUCCESS": {
      return {
        ...state,
        i18n:
          state.i18n === null
            ? action.data
            : {
                ...state.i18n,
                ...action.data,
              },
        i18nLoaded: true,
      };
    }
    case "GET_UNREAD_NOTIFICATION_COUNTER_SUCCESS": {
      let unreadCounter = state.unreadCounter;

      for (const i in action.data) {
        const item = action.data[i];
        unreadCounter = {
          ...unreadCounter,
          [item.entity_type.toLowerCase()]: item.count,
        };
      }

      return {
        ...state,
        unreadCounter: unreadCounter,
      };
    }
    case "UPDATE_GENERAL_CHAT_NOTIFICATION": {
      let unreadCounter = { ...state.unreadCounter };
      let unreadType = action.data.entity_type.toLowerCase();

      unreadCounter[unreadType] = unreadCounter[unreadType] + action.data.count;

      return {
        ...state,
        unreadCounter: unreadCounter,
      };
    }
    case "UPDATE_UNREAD_LIST_COUNTER": {
      let unreadCounter = state.unreadCounter;

      for (const i in action.data.result) {
        const item = action.data.result[i];
        unreadCounter = {
          ...unreadCounter,
          [item.entity_type.toLowerCase()]: item.count,
        };
      }
      return {
        ...state,
        unreadCounter: unreadCounter,
      };
    }
    case "SEARCH_SUCCESS": {
      let tabs = {...state.tabs};
      if (action.data.hasOwnProperty("count_category")) {
        let keys = Object.keys(action.data.count_category);
        keys.sort((a,b) => a.localeCompare(b)).map((k) => {
          let items = action.data.result.filter((r) => r.type === k);
          if (action.data.count_category[k] > 0) {
            tabs[k] = {
              count: items.length,
              total_count: action.data.count_category[k],
              page: 1,
              items: items,
              maxPage: Math.ceil(action.data.count_category[k] / 10)
            }
          }
        })
      } else {
        if (action.data.result.length) {
          let category = action.data.result[0].type;
          let items = action.data.result.filter((r) => r.type === category);
          tabs[category].count = items.length + tabs[category].count
          tabs[category].items = [...tabs[category].items, ...action.data.result]
        }
      }
      return {
        ...state,
        searchResults: action.data.result.length ? {...state.searchResults, ...convertArrayToObject(action.data.result, "id")}
                      : {},
        searchCount: action.data.hasOwnProperty("count_category") ? action.data.total_result : state.searchCount,
        searching: false,
        tabs: tabs
      }
    }
    case "SAVE_SEARCH_INPUT": {
      return {
        ...state,
        searchValue: action.data.value,
        searchCount: 0,
        searchResults: {},
        searching: action.data.value !== "",
        tabs: action.data.value === "" ? {} : state.tabs
      }
    }
    case "UPDATE_TAB": {
      return {
        ...state,
        tabs: {
          ...state.tabs,
          [action.data.key]: action.data
        }
      }
    }
    case "GET_QUICK_LINKS_SUCCESS": {
      return {
        ...state,
        links: action.data
      }
    }
    default:
      return state;
  }
};
