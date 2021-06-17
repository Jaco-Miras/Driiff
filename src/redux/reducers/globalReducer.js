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
  isIdle: false,
  unreadCounter: {
    chat_message: 0,
    workspace_post: 0,
    workspace_chat_message: 0,
    chat_reminder_message: 0,
    unread_channel: 0,
    unread_posts: 0,
    general_post: 0,
    generate_post_comment: 0,
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
    limit: 25,
    count: {
      new: 0,
      today: 0,
      all: 0,
      overdue: 0,
      done: 0,
      assigned_to_others: 0,
      added_by_others: 0,
    },
    done: {
      hasMore: true,
      skip: 0,
      limit: 10,
    },
    overdue: {
      hasMore: true,
      skip: 0,
      limit: 25,
    },
    items: {},
    doneRecently: [],
  },
  releases: {
    timestamp: null,
    items: [],
  },
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
        recipients: action.data.recipients.filter((r) => {
          if (typeof r.name === "string" || r.name instanceof String) {
            return true;
          } else {
            console.log(r.name);
            return false;
          }
        }),
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
        socketMounted: true,
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
            [unreadType]: state.unreadCounter[unreadType] + action.data.count,
          },
        }),
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
      let tabs = { ...state.tabs };
      if (action.data.hasOwnProperty("count_category")) {
        let keys = Object.keys(action.data.count_category);
        keys
          .sort((a, b) => a.localeCompare(b))
          .map((k) => {
            let items = action.data.result.filter((r) => r.type === k);
            if (action.data.count_category[k] > 0) {
              tabs[k] = {
                count: items.length,
                total_count: action.data.count_category[k],
                page: 1,
                items: items,
                maxPage: Math.ceil(action.data.count_category[k] / 10),
              };
            }
          });
      } else {
        if (action.data.result.length) {
          let category = action.data.result[0].type;
          let items = action.data.result.filter((r) => r.type === category);
          tabs[category].count = items.length + tabs[category].count;
          tabs[category].items = [...tabs[category].items, ...action.data.result];
        }
      }
      return {
        ...state,
        searchResults: action.data.result.length ? { ...state.searchResults, ...convertArrayToObject(action.data.result, "id") } : {},
        searchCount: action.data.hasOwnProperty("count_category") ? action.data.total_result : state.searchCount,
        searching: false,
        tabs: tabs,
      };
    }
    case "SAVE_SEARCH_INPUT": {
      return {
        ...state,
        searchValue: action.data.value,
        searchCount: 0,
        searchResults: {},
        searching: action.data.value !== "",
        tabs: {},
      };
    }
    case "UPDATE_TAB": {
      return {
        ...state,
        tabs: {
          ...state.tabs,
          [action.data.key]: action.data,
        },
      };
    }
    case "GET_QUICK_LINKS_SUCCESS": {
      return {
        ...state,
        links: action.data,
      };
    }
    case "GET_TO_DO_DETAIL_SUCCESS": {
      return {
        ...state,
        todos: {
          ...state.todos,
          count: action.data.reduce((res, c) => {
            res[c.status.toLowerCase()] = c.count;
            return res;
          }, {}),
        },
      };
    }
    case "GET_WORKSPACE_REMINDERS_SUCCESS": {
      let items = state.todos.items;
      action.data.todos.forEach((t) => {
        items[t.id] = t;
        switch (t.link_type) {
          case "CHAT": {
            items[t.id].link = `/chat/${t.data.channel.code}/${t.data.chat_message.code}`;
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
          default:
            return null;
        }
      });

      return {
        ...state,
        todos: {
          ...state.todos,
          items: { ...items, ...state.todos.items },
        },
      };
    }
    case "GET_TO_DO_SUCCESS": {
      let items = state.todos.items;
      action.data.todos.forEach((t) => {
        items[t.id] = t;
        switch (t.link_type) {
          case "CHAT": {
            items[t.id].link = `/chat/${t.data.channel.code}/${t.data.chat_message.code}`;
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
      let recent = action.data.today_todos.map((t) => {
        if (t.link_type) {
          if (t.link_type === "CHAT") {
            return {
              ...t,
              link: `/chat/${t.data.channel.code}/${t.data.chat_message.code}`,
            };
          } else if (t.link_type === "POST") {
            return {
              ...t,
              link: t.data.workspaces.length
                ? `/workspace/posts/${t.data.workspaces[0].topic.id}/${t.data.workspaces[0].topic.name}/post/${t.data.post.id}/${t.data.post.title.toLowerCase().replace(" ", "-")}`
                : `/posts/${t.data.post.id}/${t.data.post.title.toLowerCase().replace(" ", "-")}`,
            };
          } else if (t.link_type === "POST_COMMENT") {
            return {
              ...t,
              link: t.data.workspaces.length
                ? `/workspace/posts/${t.data.workspaces[0].topic.id}/${t.data.workspaces[0].topic.name}/post/${t.data.post.id}/${t.data.post.title.toLowerCase().replace(" ", "-")}/${t.data.comment.code}`
                : `/posts/${t.data.post.id}/${t.data.post.title.toLowerCase().replace(" ", "-")}/${t.data.comment.code}`,
            };
          }
        } else {
          return { ...t, link: null };
        }
      });

      return {
        ...state,
        todos: {
          ...state.todos,
          isLoaded: true,
          hasMore: action.data.todos.length === state.todos.limit,
          skip: state.todos.skip + action.data.todos.length,
          items: items,
          doneRecently: recent,
        },
      };
    }
    case "GET_DONE_TO_DO_SUCCESS": {
      let items = state.todos.items;
      action.data.todos.forEach((t) => {
        items[t.id] = t;
        switch (t.link_type) {
          case "CHAT": {
            items[t.id].link = `/chat/${t.data.channel.code}/${t.data.chat_message.code}`;
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
          default:
            return;
        }
      });

      return {
        ...state,
        todos: {
          ...state.todos,
          done: {
            limit: 10,
            hasMore: action.data.todos.length === state.todos.done.limit,
            skip: state.todos.done.skip + action.data.todos.length,
          },
        },
      };
    }
    case "GET_OVERDUE_TO_DO_SUCCESS": {
      let items = state.todos.items;
      action.data.todos.forEach((t) => {
        items[t.id] = t;
        switch (t.link_type) {
          case "CHAT": {
            items[t.id].link = `/chat/${t.data.channel.code}/${t.data.chat_message.code}`;
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
          default:
            return;
        }
      });

      return {
        ...state,
        todos: {
          ...state.todos,
          overdue: {
            ...state.todos.overdue.limit,
            hasMore: action.data.todos.length === state.todos.overdue.limit,
            skip: state.todos.overdue.skip + action.data.todos.length,
          },
        },
      };
    }
    case "INCOMING_TO_DO": {
      let items = state.todos.items;
      items[action.data.id] = action.data;

      switch (action.data.link_type) {
        case "CHAT": {
          items[action.data.id].link = `/chat/${action.data.data.channel.code}/${action.data.data.chat_message.code}`;
          break;
        }
        case "POST": {
          if (action.data.data.workspaces.length) {
            items[action.data.id].link = `/workspace/posts/${action.data.data.workspaces[0].topic.id}/${action.data.data.workspaces[0].topic.name}/post/${action.data.data.post.id}/${action.data.data.post.title
              .toLowerCase()
              .replace(" ", "-")}`;
          } else {
            items[action.data.id].link = `/posts/${action.data.data.post.id}/${action.data.data.post.title.toLowerCase().replace(" ", "-")}`;
          }
          break;
        }
        case "POST_COMMENT": {
          if (action.data.data.workspaces.length) {
            items[action.data.id].link = `/workspace/posts/${action.data.data.workspaces[0].topic.id}/${action.data.data.workspaces[0].topic.name}/post/${action.data.data.post.id}/${action.data.data.post.title
              .toLowerCase()
              .replace(" ", "-")}/${action.data.data.comment.code}`;
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
          // count: {
          //   ...state.todos.count,
          //   [action.data.status.toLowerCase()]: state.todos.count[action.data.status.toLowerCase()] + 1,
          // },
          items: items,
        },
      };
    }
    case "INCOMING_UPDATE_TO_DO": {
      let items = state.todos.items;
      //let count = state.todos.count;
      if (typeof items[action.data.id] !== "undefined") {
        // if (items[action.data.id].status !== action.data.status) {
        //   count[action.data.status.toLowerCase()] += 1;
        //   count[items[action.data.id].status.toLowerCase()] -= 1;
        // }

        items[action.data.id] = {
          ...items[action.data.id],
          ...action.data,
        };
      }
      return {
        ...state,
        todos: {
          ...state.todos,
          //count: count,
          items: items,
        },
      };
    }
    case "INCOMING_DONE_TO_DO": {
      let items = state.todos.items;
      //let count = state.todos.count;
      let item = null;

      if (typeof items[action.data.id] !== "undefined") {
        if (items[action.data.id].status !== action.data.status) {
          // count[action.data.status.toLowerCase()] += 1;
          // count[items[action.data.id].status.toLowerCase()] -= 1;
        }

        item = { ...items[action.data.id], status: action.data.status, updated_at: action.data.updated_at };
        items[action.data.id] = item;
      }

      return {
        ...state,
        todos: {
          ...state.todos,
          //count: count,
          items: items,
          doneRecently: [...state.todos.doneRecently, item],
        },
      };
    }
    case "INCOMING_REMOVE_TO_DO": {
      let items = state.todos.items;
      //let count = state.todos.count;

      if (typeof items[action.data.todo_id] !== "undefined") {
        //count[items[action.data.todo_id].status.toLowerCase()] -= 1;

        delete items[action.data.todo_id];
      }
      return {
        ...state,
        todos: {
          ...state.todos,
          //count: count,
          items: items,
        },
      };
    }
    case "GET_UNREAD_POST_ENTRIES_SUCCESS": {
      return {
        ...state,
        unreadCounter: {
          ...state.unreadCounter,
          general_post: action.data.result,
          unread_posts: action.data.result,
        },
      };
    }
    case "GET_UNREAD_POST_COMMENTS_SUCCESS": {
      return {
        ...state,
        unreadCounter: {
          ...state.unreadCounter,
          generate_post_comment: action.data.result,
        },
      };
    }
    case "READ_ALL_POSTS": {
      if (action.data.topic_id) return state;
      let unreadCounter = { ...state.unreadCounter };
      unreadCounter = {
        ...unreadCounter,
        general_post: 0,
        unread_posts: 0,
        workspace_post: 0,
        generate_post_comment: 0,
      };
      return {
        ...state,
        unreadCounter: unreadCounter,
      };
    }
    case "ARCHIVE_ALL_POSTS": {
      if (action.data.topic_id) return state;
      let unreadCounter = { ...state.unreadCounter };
      unreadCounter = {
        ...unreadCounter,
        general_post: 0,
        unread_posts: 0,
        workspace_post: 0,
      };
      return {
        ...state,
        unreadCounter: unreadCounter,
      };
    }
    case "GET_RELEASE_ANNOUNCEMENTS_SUCCESS": {
      return {
        ...state,
        releases: {
          timestamp: action.data.READ_RELEASE_UPDATES.timestamp,
          items: [...state.releases.items.filter((r) => r.draft_type), ...action.data.items],
        },
      };
    }
    case "INCOMING_UPDATED_ANNOUNCEMENT": {
      return {
        ...state,
        releases: {
          ...state.releases,
          items: state.releases.items.map((item) => {
            if (item.id === action.data.id) {
              return {
                ...item,
                action_text: action.data.action_text,
                body: action.data.body,
                // updated_at: { timeline: action.data.updated_at.timestamp },
              };
            } else {
              return item;
            }
          }),
        },
      };
    }
    case "INCOMING_CREATED_ANNOUNCEMENT": {
      return {
        ...state,
        releases: {
          ...state.releases,
          items: [
            {
              ...action.data,
              // created_at: { timeline: action.data.created_at.timestamp },
              // updated_at: { timeline: action.data.updated_at.timestamp },
            },
            ...state.releases.items,
          ],
        },
      };
    }
    case "INCOMING_DELETED_ANNOUNCEMENT": {
      return {
        ...state,
        releases: {
          ...state.releases,
          items: state.releases.items.filter((item) => item.id !== action.data.id),
        },
      };
    }
    case "SAVE_DRAFT_SUCCESS": {
      if (action.data.data.draft_type === "release") {
        const draft = {
          draft_id: action.data.id,
          ...action.data.data,
          created_at: { timestamp: Math.floor(Date.now() / 1000) },
        };
        return {
          ...state,
          releases: {
            ...state.releases,
            items: [draft, ...state.releases.items],
          },
        };
      } else {
        return state;
      }
    }
    case "GET_DRAFTS_SUCCESS": {
      let drafts = action.data
        .filter((d) => d.data.draft_type === "release")
        .map((d) => {
          return {
            ...d.data,
            draft_id: d.id,
            action_text: d.data.title,
            body: d.data.description,
            created_at: { timestamp: Math.floor(Date.now() / 1000) },
          };
        });
      return {
        ...state,
        releases: {
          ...state.releases,
          items: [...drafts, ...state.releases.items],
        },
      };
    }
    case "UPDATE_DRAFT_SUCCESS": {
      if (action.data.data.draft_type === "release") {
        const draft = {
          draft_id: action.data.id,
          ...action.data.data,
          created_at: { timestamp: Math.floor(Date.now() / 1000) },
        };
        return {
          ...state,
          releases: {
            ...state.releases,
            items: state.releases.items.map((item) => {
              if (item.draft_id && item.draft_id === parseInt(action.data.id)) {
                return draft;
              } else {
                return item;
              }
            }),
          },
        };
      } else {
        return state;
      }
    }
    case "SET_IDLE_STATUS": {
      return {
        ...state,
        isIdle: action.data,
      };
    }
    default:
      return state;
  }
};
