import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import moment from "moment-timezone";
import { useTimeFormat, useTodoActions, useFetchWsCount } from "./index";
import { useHistory } from "react-router-dom";

const useWorkspaceReminders = () => {
  const items = useSelector((state) => state.global.todos.items);

  const history = useHistory();
  const params = useParams();
  const { user: loggedUser } = useSelector((state) => state.session);
  const users = useSelector((state) => state.users.users);
  const todoActions = useTodoActions();
  const { localizeDate } = useTimeFormat();

  const workspaceReminders = useSelector((state) => state.workspaces.workspaceReminders);
  const activeTopic = useSelector((state) => state.workspaces.activeTopic);
  const sharedWs = useSelector((state) => state.workspaces.sharedWorkspaces);
  const onSharedWsURL = history.location.pathname.startsWith("/shared-workspace");
  const wsKey = activeTopic && onSharedWsURL ? activeTopic.key : params.workspaceId;

  const isLoaded = typeof workspaceReminders[wsKey] !== "undefined";

  useFetchWsCount();

  const loadMore = () => {
    if (isLoaded) {
      let ws = workspaceReminders[wsKey];
      let sharedPayload = null;
      if (onSharedWsURL && activeTopic && sharedWs[activeTopic.slug]) {
        sharedPayload = { slug: activeTopic.slug, token: sharedWs[activeTopic.slug].access_token, is_shared: true, key: activeTopic.key };
      }
      if (ws) {
        if (ws.hasMore) {
          let payload = {
            skip: ws.skip,
            limit: 25,
            topic_id: params.workspaceId,
            filter: "new",
            sharedPayload: sharedPayload,
          };
          todoActions.fetchWs(payload);
        }
        if (ws.done && ws.done.hasMore) {
          let payload = {
            skip: ws.done.skip,
            limit: 10,
            topic_id: params.workspaceId,
            filter: "done",
            sharedPayload: sharedPayload,
          };
          todoActions.fetchWsDone(payload);
        }
        if (ws.overdue && ws.overdue.hasMore) {
          let payload = {
            skip: ws.overdue.skip,
            limit: 10,
            topic_id: params.workspaceId,
            filter: "overdue",
            sharedPayload: sharedPayload,
          };
          todoActions.fetchWsOverdue(payload);
        }
        if (ws.today && ws.today.hasMore) {
          let payload = {
            skip: ws.today.skip,
            limit: 10,
            topic_id: params.workspaceId,
            filter: "today",
            sharedPayload: sharedPayload,
          };
          todoActions.fetchWsToday(payload);
        }
      }
    } else {
      let payload = {
        skip: 0,
        limit: 25,
        topic_id: params.workspaceId,
        filter: "new",
      };
      if (onSharedWsURL) {
        if (activeTopic && sharedWs[activeTopic.slug]) {
          payload = {
            ...payload,
            sharedPayload: { slug: activeTopic.slug, token: sharedWs[activeTopic.slug].access_token, is_shared: true, key: activeTopic.key },
          };
          todoActions.fetchWs(payload);
          todoActions.fetchWsDone({ ...payload, limit: 10, filter: "done" });
          todoActions.fetchWsOverdue({ ...payload, limit: 25, filter: "overdue" });
          todoActions.fetchWsToday({ ...payload, limit: 25, filter: "today" });
        }
      } else {
        todoActions.fetchWs(payload);
        todoActions.fetchWsDone({ ...payload, limit: 10, filter: "done" });
        todoActions.fetchWsOverdue({ ...payload, limit: 25, filter: "overdue" });
        todoActions.fetchWsToday({ ...payload, limit: 25, filter: "today" });
      }
    }
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
      })
      .sort((a, b) => b.created_at.timestamp - a.created_at.timestamp);
  };

  useEffect(() => {
    loadMore();
  }, []);

  return {
    isLoaded: isLoaded,
    items,
    count: isLoaded ? workspaceReminders[wsKey].count : defaultCount,
    getWorkspaceReminders,
    action: {
      ...todoActions,
      loadMore,
    },
    workspaceName: activeTopic ? activeTopic.name : null,
  };
};

export default useWorkspaceReminders;
