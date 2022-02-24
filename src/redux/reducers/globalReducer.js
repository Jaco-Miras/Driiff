import { convertArrayToObject } from "../../helpers/arrayHelper";
import { getCurrentTimestamp, convertUTCDateToLocalDate } from "../../helpers/dateFormatter";
//import { groupBy } from "lodash";

const INITIAL_STATE = {
  user: null,
  draftsLoaded: false,
  i18nLoaded: false,
  recipients: [],
  recipientsLoaded: false,
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
  linksFetched: false,
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
    today: {
      hasMore: true,
      skip: 0,
      limit: 25,
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
    is_snooze: false,
  },
  releases: {
    timestamp: null,
    items: [],
  },
  zoomData: null,
  snoozedReminders: [],
  snoozedRemindersLoaded: false,
  newDriffData: {
    showNewDriffBar: false,
    requirement: "",
  },
  dontShowIds: [],
  showNotificationStatusBar: false,
};

const getLink = (t) => {
  switch (t.link_type) {
    case "CHAT": {
      return `/chat/${t.data.channel.code}/${t.data.chat_message.code}`;
    }
    case "POST": {
      if (t.data.workspaces.length) {
        return `/workspace/posts/${t.data.workspaces[0].topic.id}/${t.data.workspaces[0].topic.name}/post/${t.data.post.id}/${t.data.post.title.toLowerCase().replace(" ", "-")}`;
      } else {
        return `/posts/${t.data.post.id}/${t.data.post.title.toLowerCase().replace(" ", "-")}`;
      }
    }
    case "POST_COMMENT": {
      if (t.data.workspaces.length) {
        return `/workspace/posts/${t.data.workspaces[0].topic.id}/${t.data.workspaces[0].topic.name}/post/${t.data.post.id}/${t.data.post.title.toLowerCase().replace(" ", "-")}/${t.data.comment.code}`;
      } else {
        return `/posts/${t.data.post.id}/${t.data.post.title.toLowerCase().replace(" ", "-")}/${t.data.comment.code}`;
      }
    }
    default:
      return null;
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
        recipientsLoaded: true,
        recipients: action.data.recipients.filter((r) => {
          if (typeof r.name === "string" || r.name instanceof String) {
            return true;
          } else {
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
        linksFetched: true,
      };
    }
    case "GET_TO_DO_DETAIL_SUCCESS": {
      let items = state.todos.items;
      Object.values(items).forEach((n) => {
        if (typeof items[n.id].is_snooze === "undefined") items[n.id].is_snooze = false;
      });

      return {
        ...state,
        todos: {
          ...state.todos,
          is_snooze: action.data.is_snooze,
          show_notification: true,
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
      const reminderNotif = localStorage.getItem("reminderNotif");
      const reminderNotifications = reminderNotif ? JSON.parse(reminderNotif) : null;
      const currentDate = new Date();
      return {
        ...state,
        todos: {
          ...state.todos,
          isLoaded: true,
          hasMore: action.data.todos.length === state.todos.limit,
          skip: state.todos.skip + action.data.todos.length,
          items: {
            ...state.todos.items,
            ...(Object.values(action.data.todos).length > 0 && {
              ...Object.values(action.data.todos).reduce((acc, todo) => {
                const snoozedReminder = state.snoozedReminders.find((sn) => sn.notification_id === todo.id && sn.type && sn.type === "REMINDER_SNOOZE");
                const reminder = state.todos.items[todo.id];
                acc[todo.id] = {
                  ...todo,
                  is_snooze: snoozedReminder ? !!snoozedReminder.is_snooze : reminder ? reminder.is_snooze : false,
                  snooze_time: snoozedReminder ? snoozedReminder.snooze_time : reminder ? reminder.snooze_time : null,
                  show_notification: reminderNotifications && currentDate.getDay() === reminderNotifications.day && reminderNotifications.reminders.some((id) => id === todo.id) ? false : true,
                  link: getLink(todo),
                };
                return acc;
              }, {}),
            }),
          },
          doneRecently: [],
        },
      };
    }
    case "GET_DONE_TO_DO_SUCCESS": {
      const reminderNotif = localStorage.getItem("reminderNotif");
      const reminderNotifications = reminderNotif ? JSON.parse(reminderNotif) : null;
      const currentDate = new Date();
      return {
        ...state,
        todos: {
          ...state.todos,
          items: {
            ...state.todos.items,
            ...(Object.values(action.data.todos).length > 0 && {
              ...Object.values(action.data.todos).reduce((acc, todo) => {
                const snoozedReminder = state.snoozedReminders.find((sn) => sn.notification_id === todo.id && sn.type && sn.type === "REMINDER_SNOOZE");
                const reminder = state.todos.items[todo.id];
                acc[todo.id] = {
                  ...todo,
                  is_snooze: snoozedReminder ? !!snoozedReminder.is_snooze : reminder ? reminder.is_snooze : false,
                  snooze_time: snoozedReminder ? snoozedReminder.snooze_time : reminder ? reminder.snooze_time : null,
                  show_notification: reminderNotifications && currentDate.getDay() === reminderNotifications.day && reminderNotifications.reminders.some((id) => id === todo.id) ? false : true,
                  link: getLink(todo),
                };
                return acc;
              }, {}),
            }),
          },
          done: {
            limit: 10,
            hasMore: action.data.todos.length === state.todos.done.limit,
            skip: state.todos.done.skip + action.data.todos.length,
          },
        },
      };
    }
    case "GET_OVERDUE_TO_DO_SUCCESS": {
      const reminderNotif = localStorage.getItem("reminderNotif");
      const reminderNotifications = reminderNotif ? JSON.parse(reminderNotif) : null;
      const currentDate = new Date();
      return {
        ...state,
        todos: {
          ...state.todos,
          items: {
            ...state.todos.items,
            ...(Object.values(action.data.todos).length > 0 && {
              ...Object.values(action.data.todos).reduce((acc, todo) => {
                const snoozedReminder = state.snoozedReminders.find((sn) => sn.notification_id === todo.id && sn.type && sn.type === "REMINDER_SNOOZE");
                const reminder = state.todos.items[todo.id];
                acc[todo.id] = {
                  ...todo,
                  is_snooze: snoozedReminder ? !!snoozedReminder.is_snooze : reminder ? reminder.is_snooze : false,
                  snooze_time: snoozedReminder ? snoozedReminder.snooze_time : reminder ? reminder.snooze_time : null,
                  show_notification: reminderNotifications && currentDate.getDay() === reminderNotifications.day && reminderNotifications.reminders.some((id) => id === todo.id) ? false : true,
                  link: getLink(todo),
                };
                return acc;
              }, {}),
            }),
          },
          overdue: {
            ...state.todos.overdue.limit,
            hasMore: action.data.todos.length === state.todos.overdue.limit,
            skip: state.todos.overdue.skip + action.data.todos.length,
          },
        },
      };
    }
    case "GET_TODAY_TO_DO_SUCCESS": {
      const reminderNotif = localStorage.getItem("reminderNotif");
      const reminderNotifications = reminderNotif ? JSON.parse(reminderNotif) : null;
      const currentDate = new Date();
      return {
        ...state,
        todos: {
          ...state.todos,
          items: {
            ...state.todos.items,
            ...(Object.values(action.data.todos).length > 0 && {
              ...Object.values(action.data.todos).reduce((acc, todo) => {
                const snoozedReminder = state.snoozedReminders.find((sn) => sn.notification_id === todo.id && sn.type && sn.type === "REMINDER_SNOOZE");
                const reminder = state.todos.items[todo.id];
                acc[todo.id] = {
                  ...todo,
                  is_snooze: snoozedReminder ? !!snoozedReminder.is_snooze : reminder ? reminder.is_snooze : false,
                  snooze_time: snoozedReminder ? snoozedReminder.snooze_time : reminder ? reminder.snooze_time : null,
                  show_notification: reminderNotifications && currentDate.getDay() === reminderNotifications.day && reminderNotifications.reminders.some((id) => id === todo.id) ? false : true,
                  link: getLink(todo),
                };
                return acc;
              }, {}),
            }),
          },
          today: {
            ...state.todos.today.limit,
            hasMore: action.data.todos.length === state.todos.today.limit,
            skip: state.todos.today.skip + action.data.todos.length,
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
      items[action.data.id].is_snooze = false;
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
          is_snooze: false,
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

        item = { ...items[action.data.id], status: action.data.status, updated_at: action.data.updated_at, is_snooze: false };
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
        draftsLoaded: true,
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
    case "REMINDER_SNOOZE_ALL": {
      let items = state.todos.items;
      Object.values(items).forEach((n) => {
        items[n.id].is_snooze = action.data.is_snooze;
        items[n.id].snooze_time = action.data.snooze_time;
      });

      return {
        ...state,
        todos: {
          ...state.todos,
          is_snooze: action.data.is_snooze,
          items: items,
        },
      };
    }
    case "REMINDER_SNOOZE": {
      let items = state.todos.items;
      items[action.data.id].is_snooze = action.data.is_snooze;
      items[action.data.id].snooze_time = action.data.snooze_time;
      return {
        ...state,
        todos: {
          ...state.todos,
          items: items,
        },
      };
    }
    case "REMOVE_REMINDER_NOTIFICATION": {
      return {
        ...state,
        todos: {
          ...state.todos,
          items: Object.values(state.todos.items).reduce((acc, todo) => {
            if (todo.id === action.data.id) {
              acc[todo.id] = { ...todo, show_notification: false };
            } else {
              acc[todo.id] = todo;
            }
            return acc;
          }, {}),
        },
      };
    }
    case "CREATE_QUICK_LINKS_SUCCESS":
    case "PUT_QUICK_LINKS_SUCCESS": {
      const links = [...state.links, ...action.data.quick_links];
      let uniqLinks = [...new Map(links.map((item) => [item["id"], item])).values()];
      return {
        ...state,
        links: uniqLinks,
      };
    }
    case "GET_ALL_SNOOZED_NOTIFICATION_SUCCESS": {
      const regex = /\s|\/|-|:/g;
      return {
        ...state,
        snoozedRemindersLoaded: true,
        snoozedReminders: [
          ...state.snoozedReminders,
          ...action.data.snoozed_notifications
            .filter((sn) => sn.type && sn.type === "REMINDER_SNOOZE")
            .map((sn) => {
              const timeString = sn.snooze_time.replace(regex, ",");
              const timeSplit = timeString.split(",");
              const utcDate = new Date(parseInt(timeSplit[0]), parseInt(timeSplit[1]) - 1, parseInt(timeSplit[2]), parseInt(timeSplit[3]), parseInt(timeSplit[4]), parseInt(timeSplit[5]));
              const date = convertUTCDateToLocalDate(utcDate);
              return {
                ...sn,
                is_snooze: !!sn.is_snooze,
                snooze_time: Math.round(date / 1000),
              };
            }),
        ],
      };
    }
    case "SNOOZE_NOTIFICATION_SUCCESS":
    case "INCOMING_SNOOZED_NOTIFICATION": {
      if (action.data.type === "REMINDER_SNOOZE") {
        return {
          ...state,
          todos: {
            ...state.todos,
            items: Object.values(state.todos.items).reduce((acc, item) => {
              if (item.id === action.data.notification_id) {
                acc[item.id] = { ...item, is_snooze: action.data.is_snooze, snooze_time: getCurrentTimestamp(), type: action.data.type };
              } else {
                acc[item.id] = item;
              }
              return acc;
            }, {}),
          },
          snoozedReminders: state.snoozedReminders.map((sn) => {
            if (sn.notification_id === action.data.notification_id) {
              return { ...sn, is_snooze: action.data.is_snooze, snooze_time: getCurrentTimestamp(), type: action.data.type };
            } else return sn;
          }),
        };
      } else {
        return state;
      }
    }
    case "INCOMING_SNOOZED_ALL_NOTIFICATION":
    case "SNOOZE_ALL_NOTIFICATION_SUCCESS": {
      return {
        ...state,
        snoozedReminders: [
          ...state.snoozedReminders,
          ...action.data.data.map((sn) => {
            return {
              ...sn,
              is_snooze: sn.is_snooze,
              snooze_time: getCurrentTimestamp(),
            };
          }),
        ],
        todos: {
          ...state.todos,
          items: Object.values(state.todos.items).reduce((acc, item) => {
            const todo = action.data.data.find((d) => d.notification_id === item.id && d.type === "HUDDLE_SNOOZE");
            if (todo) {
              acc[item.id] = { ...item, is_snooze: todo.is_snooze, snooze_time: getCurrentTimestamp() };
            } else {
              acc[item.id] = item;
            }
            return acc;
          }, {}),
        },
      };
    }
    case "INCOMING_ZOOM_DATA": {
      return {
        ...state,
        zoomData: action.data,
      };
    }
    case "CLEAR_ZOOM_DATA": {
      return {
        ...state,
        zoomData: null,
      };
    }
    case "SHOW_NEW_DRIFF_BAR": {
      return {
        ...state,
        newDriffData: action.data,
      };
    }
    case "SET_DONT_SHOW_IDS": {
      return {
        ...state,
        dontShowIds: [action.data],
      };
    }
    case "UPDATE_UNREAD_COUNTER": {
      return {
        ...state,
        unreadCounter: {
          ...state.unreadCounter,
          ...(action.data.hasOwnProperty("general_post") && {
            general_post: (action.data.general_post === -1 && state.unreadCounter.general_post > 0) || action.data.general_post === 1 ? state.unreadCounter.general_post + action.data.general_post : state.unreadCounter.general_post,
          }),
        },
      };
    }
    default:
      return state;
  }
};
