import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useTodoActions } from "./index";

let init = false;
const useTodos = () => {

  const { isLoaded, skip, limit, hasMore, items, count } = useSelector((state) => state.global.todos);
  const { user: loggedUser } = useSelector((state) => state.session);
  const todoActions = useTodoActions();
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
        } else if (b.remind_at !== "null") {
          return -1
        } else if (a.remind_at !== "null") {
          return 1
        }
      })
      .filter(t => {
        if (t.author === null && t.link_type === null) {
          t.author = loggedUser;
        }
        if (filter) {
          if (filter.search !== "") {
            if (!(t.title.toLowerCase().includes(filter.search.toLowerCase().trim())
              || t.description.toLowerCase().includes(filter.search.toLowerCase().trim()))) {
              return false;
            }
          }

          if (filter.status !== "")
            return t.status === filter.status;
          else
            return t.status !== "DONE";
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
