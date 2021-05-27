import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import moment from "moment-timezone";
import { useTimeFormat, useTodoActions } from "./index";

const useWorkspaceReminders = () => {
  const items = useSelector((state) => state.global.todos.items);

  const params = useParams();
  const { user: loggedUser } = useSelector((state) => state.session);
  const todoActions = useTodoActions();
  const { localizeDate } = useTimeFormat();
  const users = useSelector((state) => state.users.users);

  const workspaceReminders = useSelector((state) => state.workspaces.workspaceReminders);
  const activeTopic = useSelector((state) => state.workspaces.activeTopic);

  const isLoaded = typeof workspaceReminders[params.workspaceId] !== "undefined";

  const loadMore = () => {
    if (isLoaded) {
      let ws = workspaceReminders[params.workspaceId];
      if (ws && ws.hasMore) {
        let payload = {
          skip: ws.skip,
          limit: 25,
          topic_id: params.workspaceId,
        };
        todoActions.fetchWs(payload, () => {
          fetchCount();
        });
      }
    } else {
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
          fetchCount();
        });
      } else {
        todoActions.fetchWs(payload, () => {
          fetchCount();
        });
      }
    }
  };

  const fetchCount = () => {
    todoActions.fetchWsCount({ topic_id: params.workspaceId });
  };

  let defaultCount = {
    new: 0,
    today: 0,
    all: 0,
    overdue: 0,
    assigned_to_others: 0,
    added_by_others: 0,
  };

  const getWorkspaceReminders = ({ filter = "" }) => {
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
        if (t.workspace && activeTopic && t.workspace.id === activeTopic.id) {
          if (filter) {
            if (filter.search !== "") {
              if (!(t.title.toLowerCase().includes(filter.search.toLowerCase().trim()) || t.description.toLowerCase().includes(filter.search.toLowerCase().trim()))) {
                return false;
              }
            }
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
        } else {
          return false;
        }
      });
  };

  useEffect(() => {
    loadMore();
    //fetchCount();
  }, []);

  return {
    isLoaded: isLoaded,
    items,
    count: isLoaded ? workspaceReminders[params.workspaceId].count : defaultCount,
    getWorkspaceReminders,
    action: {
      ...todoActions,
      loadMore,
    },
    workspaceName: activeTopic ? activeTopic.name : null,
  };
};

export default useWorkspaceReminders;
