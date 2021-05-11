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

  var newCount = count;

  const handleNewCount = () => {
    newCount.new = 0;
    newCount.today = 0;
    newCount.all = 0;
    newCount.overdue = 0;
    Object.values(items).map((item, i) => {
      if (item.status !== "DONE") {
        if (item.status === "NEW") newCount.new++;
        if (item.remind_at !== null) {
          if (localizeDate(item.remind_at.timestamp, "YYYY-MM-DD") === moment().format("YYYY-MM-DD")) newCount.today++;
        }
        if (item.status === "OVERDUE") newCount.overdue++;
        newCount.all++;
      }
    });
    return newCount;
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
        if (t.workspace) {
          //remove if condition if workspace reminders will be displayed on the main reminder page
          return false;
        } else {
          if (filter) {
            if (filter.search !== "") {
              if (!(t.title.toLowerCase().includes(filter.search.toLowerCase().trim()) || t.description.toLowerCase().includes(filter.search.toLowerCase().trim()))) {
                return false;
              }
            }
            if (filter.status !== "") return t.status === filter.status;
          }
          return true;
        }
      });
  };

  useEffect(() => {
    if (!init) {
      init = true;
      // todoActions.fetchDetail({});
    }
    if (!isLoaded && fetchTodosOnMount) {
      loadMore();
    }
  }, []);

  return {
    isLoaded,
    items,
    count: handleNewCount(),
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
