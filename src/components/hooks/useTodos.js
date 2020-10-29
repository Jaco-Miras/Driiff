import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import moment from "moment-timezone";
import { useTimeFormat, useTodoActions } from "./index";

let init = false;
const useTodos = () => {

  const { isLoaded, skip, limit, hasMore, items, count } = useSelector((state) => state.global.todos);

  const todoActions = useTodoActions();
  const { localizeDate } = useTimeFormat();
  const [isFetchLoading, setIsFetchLoading] = useState(false);

  const loadMore = () => {
    if (isFetchLoading || !hasMore)
      return;

    setIsFetchLoading(true);
    todoActions.fetch({
      skip: skip,
      limit: limit
    }, () => {
      setIsFetchLoading(false);
    });
  }

  const getSortedItems = ({filter = ""}) => {
    return Object
      .values(items)
      .sort((a, b) => {
        if (a.status !== b.status) {
          if (a.status === "DONE") {
            return 1;
          }

          if (b.status === "DONE") {
            return -1;
          }

          if (a.status === "OVERDUE") {
            return -1;
          }

          if (b.status === "OVERDUE") {
            return 1;
          }
        }

        if (b.remind_at !== null && a.remind_at !== null) {
          return b.remind_at.timestamp - a.remind_at.timestamp;
        } else if (b.remind_at !== null) {
          return -1;
        } else if (a.remind_at !== null) {
          return 1;
        }
      })
      .filter(t => {
        if (filter) {
          if (filter.search !== "") {
            if (!(t.title.toLowerCase().includes(filter.search.toLowerCase().trim())
              || t.description.toLowerCase().includes(filter.search.toLowerCase().trim()))) {
              return false;
            }
          }

          if (filter.status !== "")
            return t.status === filter.status;
          else {
            if (t.status === "OVERDUE") return true;
            if (t.status === "DONE") return false;
            if (t.remind_at === null) return false;
            if (localizeDate(t.remind_at.timestamp, "YYYY-MM-DD") === moment().format('YYYY-MM-DD')) {
              t.status = "TODAY";
              return true;
            } else {
              return false;
            }
          }
        }
        return true;
      })
  }

  useEffect(() => {
    if (!init) {
      init = true;
      todoActions.fetchDetail({});
      loadMore();
    }
  }, []);

  return {
    isLoaded,
    items,
    count,
    getSortedItems,
    action: {
      ...todoActions,
      loadMore
    },
  };
};

export default useTodos;
