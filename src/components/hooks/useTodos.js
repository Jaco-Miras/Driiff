import { useEffect } from "react";
import { useSelector } from "react-redux";
import moment from "moment-timezone";
import { useTimeFormat, useTodoActions } from "./index";

let init = false;
const useTodos = (fetchTodosOnMount = false) => {
  const { isLoaded, skip, limit, hasMore, items, count, doneRecently } = useSelector((state) => state.global.todos);

  const { user: loggedUser } = useSelector((state) => state.session);
  const users = useSelector((state) => state.users.users);

  const todoActions = useTodoActions();
  const { localizeDate } = useTimeFormat();

  const loadMore = () => {
    if (!hasMore) return;
    todoActions.fetch({
      skip: skip,
      limit: limit,
    });
  };

  const getReminders = ({ filter = "" }) => {
    return Object.values(items)
      .map((t) => {
        if (t.author === null && t.link_type === null) {
          const author = Object.values(users).find((u) => u.id === t.user);
          return {
            ...t,
            author: author ? author : { ...loggedUser },
            status: t.remind_at !== null && localizeDate(t.remind_at.timestamp, "YYYY-MM-DD") === moment().format("YYYY-MM-DD") && t.status === "NEW" ? "TODAY" : t.status,
          };
        } else {
          return {
            ...t,
            status: t.remind_at !== null && localizeDate(t.remind_at.timestamp, "YYYY-MM-DD") === moment().format("YYYY-MM-DD") && t.status === "NEW" ? "TODAY" : t.status,
          };
        }
      })
      .filter((t) => {
        if (t.workspace && t.assigned_to && t.assigned_to.id !== loggedUser.id) {
          return false;
        } else if (t.workspace && !t.assigned_to) {
          return false;
        } else {
          if (filter) {
            if (filter.search !== "") {
              if (!(t.title.toLowerCase().includes(filter.search.toLowerCase().trim()) || t.description.toLowerCase().includes(filter.search.toLowerCase().trim()))) {
                return false;
              }
            }
            /*
            if (filter.status !== "")
              return t.status === filter.status;
            */

            if (filter.status !== "") {
              if (filter.status === "ASSIGNED_TO_OTHERS") return t.assigned_to && t.assigned_to.id !== loggedUser.id && t.user === loggedUser.id;
              if (filter.status === "ADDED_BY_OTHERS") return t.assigned_to && t.assigned_to.id === loggedUser.id && t.user !== loggedUser.id;
              if (t.status === filter.status) return true;
              if (t.status === "DONE") {
                if (filter.status === "TODAY" && t.remind_at !== null && localizeDate(t.remind_at.timestamp, "YYYY-MM-DD") === moment().format("YYYY-MM-DD")) return true;
                if (filter.status === "OVERDUE" && t.remind_at !== null && localizeDate(t.remind_at.timestamp, "YYYY-MM-DD") < moment().format("YYYY-MM-DD")) return true;
                if (filter.status === "NEW" && t.remind_at !== null && localizeDate(t.remind_at.timestamp, "YYYY-MM-DD") > moment().format("YYYY-MM-DD")) return true;
                if (filter.status === "NEW" && t.remind_at === null) return true;
              }
              return false;
            } else {
              return !t.assigned_to_others;
            }
          }
          return true;
        }
      });
  };

  useEffect(() => {
    if (!init) {
      init = true;
    }
    if (!isLoaded && fetchTodosOnMount) {
      loadMore();
    }
    todoActions.fetchDetail({});
  }, []);

  return {
    isLoaded,
    items,
    count,
    //getSortedItems,
    getReminders,
    action: {
      ...todoActions,
      loadMore,
    },
    doneRecently,
  };
};

export default useTodos;
