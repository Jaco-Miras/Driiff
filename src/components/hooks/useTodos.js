import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import moment from "moment-timezone";
import { useTimeFormat, useTodoActions } from "./index";

let init = false;
const useTodos = (fetchTodosOnMount = false) => {
  const { isLoaded, skip, limit, hasMore, items, count, doneRecently } = useSelector((state) => state.global.todos);

  const { user: loggedUser } = useSelector((state) => state.session);

  const todoActions = useTodoActions();
  const { localizeDate } = useTimeFormat();
  const [isFetchLoading, setIsFetchLoading] = useState(false);

  const loadMore = () => {
    if (isFetchLoading || !hasMore) return;

    setIsFetchLoading(true);
    todoActions.fetch(
      {
        skip: skip,
        limit: limit,
      },
      () => {
        setIsFetchLoading(false);
      }
    );
  };

  const getReminders = ({ filter = "" }) => {
    return Object.values(items)
      .map((t) => {
        if (t.author === null && t.link_type === null) {
          return {
            ...t,
            author: { ...loggedUser },
            status: t.remind_at !== null && localizeDate(t.remind_at.timestamp, "YYYY-MM-DD") === moment().format("YYYY-MM-DD") && t.status !== "DONE" ? "TODAY" : t.status,
          };
        } else {
          return {
            ...t,
            status: t.remind_at !== null && localizeDate(t.remind_at.timestamp, "YYYY-MM-DD") === moment().format("YYYY-MM-DD") && t.status !== "DONE" ? "TODAY" : t.status,
          };
        }
      })
      .filter((t) => {
        if (filter) {
          if (filter.search !== "") {
            if (!(t.title.toLowerCase().includes(filter.search.toLowerCase().trim()) || t.description.toLowerCase().includes(filter.search.toLowerCase().trim()))) {
              return false;
            }
          }
          if (filter.status !== "") return t.status === filter.status;
        }
        return true;
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
