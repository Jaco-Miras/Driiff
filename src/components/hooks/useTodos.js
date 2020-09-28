import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {useTodoActions} from "./index";

const useTodos = () => {

  const {isLoaded, items} = useSelector((state) => state.global.todos);

  const todoActions = useTodoActions();
  const [isFetchLoading, setIsFetchLoading] = useState(false);

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
    if (!isLoaded && !isFetchLoading) {
      setIsFetchLoading(true);
      todoActions.fetch({}, () => {
        setIsFetchLoading(false);
      });
    }
  }, []);

  return {
    isLoaded,
    items,
    getSortedItems,
    action: todoActions,
  };
};

export default useTodos;
