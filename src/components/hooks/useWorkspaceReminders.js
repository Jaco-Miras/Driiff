import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import moment from "moment-timezone";
import { useTimeFormat, useTodoActions } from "./index";

const useWorkspaceReminders = () => {
  const items = useSelector((state) => state.global.todos.items);

  const params = useParams();
  const { user: loggedUser } = useSelector((state) => state.session);
  const todoActions = useTodoActions();
  const { localizeDate } = useTimeFormat();
  const [isFetchLoading, setIsFetchLoading] = useState(false);

  const workspaceReminders = useSelector((state) => state.workspaces.workspaceReminders);
  const activeTopic = useSelector((state) => state.workspaces.activeTopic);

  const loadMore = () => {
    if (isFetchLoading) return;

    setIsFetchLoading(true);
    let payload = {
      skip: 0,
      limit: 25,
      topic_id: params.workspaceId,
    };
    if (workspaceReminders[params.workspaceId]) {
      payload = {
        ...payload,
        skip: workspaceReminders[params.workspaceId].reminderIds.length,
      };
      todoActions.fetchWs(payload, () => {
        setIsFetchLoading(false);
      });
    } else {
      todoActions.fetchWs(payload, () => {
        setIsFetchLoading(false);
      });
    }
  };

  let count = {
    new: 0,
    today: 0,
    all: 0,
    overdue: 0,
  };

  const getWorkspaceReminders = ({ filter = "" }) => {
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
        if (t.workspace && activeTopic && t.workspace.id === activeTopic.id) {
          if (filter) {
            if (filter.search !== "") {
              if (!(t.title.toLowerCase().includes(filter.search.toLowerCase().trim()) || t.description.toLowerCase().includes(filter.search.toLowerCase().trim()))) {
                return false;
              }
            }
            if (filter.status !== "") return t.status === filter.status;
          }
          return true;
        } else {
          return false;
        }
      });
  };

  useEffect(() => {
    loadMore();
  }, []);

  return {
    isLoaded: typeof workspaceReminders[params.workspaceId] !== "undefined",
    items,
    count: count,
    getWorkspaceReminders,
    action: {
      ...todoActions,
      loadMore,
    },
  };
};

export default useWorkspaceReminders;
