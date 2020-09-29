import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {useTodoActions} from "./index";

let init = false;
const useTodos = () => {

  const {isLoaded, skip, limit, hasMore, items, count} = useSelector((state) => state.global.todos);

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
        }

        return b.remind_at.timestamp - a.remind_at.timestamp;
      })
      .filter(t => {
        if (filter) {
          if (filter.status !== "")
            return t.status === filter.status;
        }
        return true;
      })
  }

  useEffect(() => {
    if (!init) {
      init = true;
      loadMore()
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
