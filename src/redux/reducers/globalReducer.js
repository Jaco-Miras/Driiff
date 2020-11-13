import { convertArrayToObject } from "../../helpers/arrayHelper";
//import { groupBy } from "lodash";

const INITIAL_STATE = {
  user: null,
  i18nLoaded: false,
  recipients: [],
  isLoading: false,
  isBrowserActive: true,
  modals: {},
  slugs: [],
  navMode: 2,
  dataFromInput: null,
  unreadCounter: {
    chat_message: 0,
    workspace_post: 0,
    workspace_chat_message: 0,
    chat_reminder_message: 0,
    unread_channel: 0,
    unread_posts: 0,
    general_post: 0
  },
  socketMounted: false,
  searchValue: "",
  searchResults: {},
  searchCount: 0,
  searching: false,
  tabs: {},
  links: [],
  todos: {
    isLoaded: false,
    hasMore: true,
    skip: 0,
    limit: 50,
    count: {
      new: 0,
      overdue: 0,
      done: 0,
    },
    items: {}
  }
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
      localStorage.setItem("i18n", JSON.stringify(action.data));
      return {
        ...state,
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
      const unreadType = action.data.entity_type ? action.data.entity_type.toLowerCase() : "";

      return {
        ...state,
        ...(unreadType !== "" && {
          unreadCounter: {
            ...state.unreadCounter,
            [unreadType]: state.unreadCounter[unreadType] + action.data.count
          },
        })
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
        tabs: {}
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
    case "GET_TO_DO_DETAIL_SUCCESS": {
      let count = state.todos.count;

      action.data.forEach(d => {
        count[d.status.toLowerCase()] = d.count;
      })

      return {
        ...state,
        todos: {
          ...state.todos,
          count: count
        }
      }
    }
    case "GET_TO_DO_SUCCESS": {
      let items = state.todos.items;
      action.data.todos.forEach(t => {
        items[t.id] = t;

        switch (t.link_type) {
          case "CHAT": {
            items[t.id].link = `/chat/${t.data.channel.code}/${t.data.chat_message.code}`
            break;
          }
          case "POST": {
            if (t.data.workspaces.length) {
              items[t.id].link = `/workspace/posts/${t.data.workspaces[0].topic.id}/${t.data.workspaces[0].topic.name}/post/${t.data.post.id}/${t.data.post.title.toLowerCase().replace(" ", "-")}`;
            } else {
              items[t.id].link = `/posts/${t.data.post.id}/${t.data.post.title.toLowerCase().replace(" ", "-")}`;
            }
            break;
          }
          case "POST_COMMENT": {
            if (t.data.workspaces.length) {
              items[t.id].link = `/workspace/posts/${t.data.workspaces[0].topic.id}/${t.data.workspaces[0].topic.name}/post/${t.data.post.id}/${t.data.post.title.toLowerCase().replace(" ", "-")}/${t.data.comment.code}`;
            } else {
              items[t.id].link = `/posts/${t.data.post.id}/${t.data.post.title.toLowerCase().replace(" ", "-")}/${t.data.comment.code}`;
            }
            break;
          }
        }
      });

      return {
        ...state,
        todos: {
          ...state.todos,
          isLoaded: true,
          hasMore: action.data.todos.length === state.todos.limit,
          limit: state.todos.limit + state.todos.limit,
          items: items
        }
      }
    }
    case "INCOMING_TO_DO": {
      let items = state.todos.items;
      items[action.data.id] = action.data;

      switch (action.data.link_type) {
        case "CHAT": {
          items[action.data.id].link = `/chat/${action.data.data.channel.code}/${action.data.data.chat_message.code}`
          break;
        }
        case "POST": {
          if (action.data.data.workspaces.length) {
            items[action.data.id].link = `/workspace/posts/${action.data.data.workspaces[0].topic.id}/${action.data.data.workspaces[0].topic.name}/post/${action.data.data.post.id}/${action.data.data.post.title.toLowerCase().replace(" ", "-")}`;
          } else {
            items[action.data.id].link = `/posts/${action.data.data.post.id}/${action.data.data.post.title.toLowerCase().replace(" ", "-")}`;
          }
          break;
        }
        case "POST_COMMENT": {
          if (action.data.data.workspaces.length) {
            items[action.data.id].link = `/workspace/posts/${action.data.data.workspaces[0].topic.id}/${action.data.data.workspaces[0].topic.name}/post/${action.data.data.post.id}/${action.data.data.post.title.toLowerCase().replace(" ", "-")}/${action.data.data.comment.code}`;
          } else {
            items[action.data.id].link = `/posts/${action.data.data.post.id}/${action.data.data.post.title.toLowerCase().replace(" ", "-")}/${action.data.data.comment.code}`;
          }
          break;
        }
      }

      return {
        ...state,
        todos: {
          ...state.todos,
          count: {
            ...state.todos.count,
            [action.data.status.toLowerCase()]: state.todos.count[action.data.status.toLowerCase()] + 1
          },
          items: items
        }
      }
    }
    case "INCOMING_UPDATE_TO_DO": {
      let items = state.todos.items;
      let count = state.todos.count;
      if (typeof items[action.data.id] !== "undefined") {
        if (items[action.data.id].status !== action.data.status) {
          count[action.data.status.toLowerCase()] += 1;
          count[items[action.data.id].status.toLowerCase()] -= 1;
        }

        items[action.data.id] = {
          ...items[action.data.id],
          ...action.data
        };
      }
      return {
        ...state,
        todos: {
          ...state.todos,
          count: count,
          items: items
        }
      }
    }
    case "INCOMING_DONE_TO_DO": {
      let items = state.todos.items;
      let count = state.todos.count;

      if (typeof items[action.data.id] !== "undefined") {
        if (items[action.data.id].status !== action.data.status) {
          count[action.data.status.toLowerCase()] += 1;
          count[items[action.data.id].status.toLowerCase()] -= 1;
        }

        items[action.data.id] = action.data;
      }

      return {
        ...state,
        todos: {
          ...state.todos,
          count: count,
          items: items
        }
      }
    }
    case "INCOMING_REMOVE_TO_DO": {
      let items = state.todos.items;
      let count = state.todos.count;

      if (typeof items[action.data.todo_id] !== "undefined") {
        count[items[action.data.todo_id].status.toLowerCase()] -= 1;

        delete items[action.data.todo_id];
      }
      return {
        ...state,
        todos: {
          ...state.todos,
          count: count,
          items: items
        }
      }
    }
    case "GET_UNREAD_POST_ENTRIES_SUCCESS": {
      return {
        ...state,
        unreadCounter: {
          ...state.companyPosts.unreadCounter,
          general_post: action.data.result,
          unread_posts: action.data.result,
        }
      }
    }
    case "READ_ALL_POSTS": {
      if (action.data.topic_id) return state;
      let unreadCounter = {...state.unreadCounter};
      unreadCounter = {
        ...unreadCounter,
        general_post: 0,
        unread_posts: 0,
        workspace_post: 0,
      }
      return {
        ...state,
        unreadCounter: unreadCounter
      };
    }
    case "ARCHIVE_ALL_POSTS": {
      if (action.data.topic_id) return state;
      let unreadCounter = {...state.unreadCounter};
      unreadCounter = {
        ...unreadCounter,
        general_post: 0,
        unread_posts: 0,
        workspace_post: 0,
      }
      return {
        ...state,
        unreadCounter: unreadCounter
      };
    }
    default:
      return state;
  }
};
