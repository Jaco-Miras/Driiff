import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {useTodoActions} from "./index";

const useTodos = () => {

  const {isLoaded, items} = useSelector((state) => state.global.todos);

  const todoActions = useTodoActions();
  const [isFetchLoading, setIsFetchLoading] = useState(false);

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
    action: todoActions,
  };
};

export default useTodos;
