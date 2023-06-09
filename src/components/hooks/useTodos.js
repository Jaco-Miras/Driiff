import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import moment from "moment-timezone";
import { useTimeFormat, useTodoActions } from "./index";

const useTodos = (fetchTodosOnMount = false) => {
  const { isLoaded, skip, limit, hasMore, items, count, doneRecently, done, overdue, today } = useSelector((state) => state.global.todos);
  const snoozedRemindersLoaded = useSelector((state) => state.global.snoozedRemindersLoaded);

  const { user: loggedUser } = useSelector((state) => state.session);
  const users = useSelector((state) => state.users.users);
  const params = useParams();

  const todoActions = useTodoActions();
  const { localizeDate } = useTimeFormat();

  const loadMore = () => {
    // todoActions.fetch({
    //   skip: skip,
    //   limit: 100,
    //   //filter: "new",
    // });
    if (hasMore) {
      todoActions.fetch({
        skip: skip,
        limit: limit,
        filter: "new",
      });
    }
    if (today.hasMore) {
      todoActions.fetchToday({
        skip: today.skip,
        limit: today.limit,
        filter: "today",
      });
    }
    if (done.hasMore) {
      todoActions.fetchDone({
        skip: done.skip,
        limit: done.limit,
        filter: "done",
      });
    }
    if (overdue.hasMore) {
      todoActions.fetchOverdue({
        skip: overdue.skip,
        limit: overdue.limit,
        filter: "overdue",
      });
    }
  };

  let timestamp = Math.floor(Date.now() / 1000);

  const getReminders = ({ filter = "" }) => {
    return Object.values(items)
      .filter((t) => t.link_type !== "DRIFF_TALK")
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
        if (filter) {
          if (filter.search !== "") {
            if (!(t.title.toLowerCase().includes(filter.search.toLowerCase().trim()) || t.description.toLowerCase().includes(filter.search.toLowerCase().trim()))) {
              return false;
            }
          }
          /*
          if (filter.status !== "")
            return t.status === filter.status;
          */
          const notExpired = t.remind_at === null || (t.remind_at && t.remind_at.timestamp > timestamp);
          if (filter.status !== "") {
            if (filter.status === "ASSIGNED_TO_OTHERS") return t.user === loggedUser.id && notExpired;
            if (filter.status === "ADDED_BY_OTHERS") return t.assigned_to && t.assigned_to.id === loggedUser.id && t.user !== loggedUser.id;
            if (t.status === filter.status) return !(t.workspace && !t.assigned_to);
            if (t.status === "DONE") {
              if (filter.status === "TODAY" && t.remind_at !== null && localizeDate(t.remind_at.timestamp, "YYYY-MM-DD") === moment().format("YYYY-MM-DD")) return true;
              if (filter.status === "OVERDUE" && t.remind_at !== null && localizeDate(t.remind_at.timestamp, "YYYY-MM-DD") < moment().format("YYYY-MM-DD")) return true;
              if (filter.status === "NEW" && t.remind_at !== null && localizeDate(t.remind_at.timestamp, "YYYY-MM-DD") > moment().format("YYYY-MM-DD")) return true;
              if (filter.status === "NEW" && t.remind_at === null) return true;
            }
            return false;
          } else {
            const notExpired = t.remind_at === null || (t.remind_at && t.remind_at.timestamp > timestamp);
            //if (t.workspace && !t.assigned_to) return false;
            if (t.user && t.user === loggedUser.id && notExpired) return true;
            if (t.assigned_to && t.assigned_to.id !== loggedUser.id) return false;
            //if (t.assigned_to && t.assigned_to.id === loggedUser.id && t.user !== loggedUser.id) return false;
            return notExpired;
          }
        }
        return true;
      })
      .sort((a, b) => b.created_at.timestamp - a.created_at.timestamp);
  };

  const getVideoReminders = ({ filter = "" }) => {
    return Object.values(items)
      .filter((t) => {
        if (filter.isWorkspace) {
          return t.workspace && params.workspaceId && t.workspace.id === parseInt(params.workspaceId);
        } else {
          return t.link_type === "DRIFF_TALK";
        }
      })
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
        if (filter) {
          if (filter.search !== "") {
            if (!(t.title.toLowerCase().includes(filter.search.toLowerCase().trim()) || t.description.toLowerCase().includes(filter.search.toLowerCase().trim()))) {
              return false;
            }
          }

          if (filter.status !== "ALL") {
            if (filter.status === "ASSIGNED_TO_OTHERS") return t.assigned_to && t.assigned_to.id !== loggedUser.id && t.user === loggedUser.id && t.link_type === "DRIFF_TALK";
            if (filter.status === "ADDED_BY_OTHERS") return t.assigned_to && t.assigned_to.id === loggedUser.id && t.user !== loggedUser.id && t.link_type === "DRIFF_TALK";
            if (t.status === filter.status) return !(t.workspace && !t.assigned_to) && t.link_type === "DRIFF_TALK";
            return false;
          } else {
            return t.link_type === "DRIFF_TALK";
          }
        }
        return t.link_type === "DRIFF_TALK";
      });
  };

  useEffect(() => {
    todoActions.fetchDetail({});
  }, []);

  useEffect(() => {
    if (snoozedRemindersLoaded && !isLoaded && fetchTodosOnMount) {
      loadMore();
    }
  }, [snoozedRemindersLoaded]);

  return {
    isLoaded,
    items,
    count,
    //getSortedItems,
    getReminders,
    getVideoReminders,
    action: {
      ...todoActions,
      loadMore,
    },
    doneRecently,
  };
};

export default useTodos;
