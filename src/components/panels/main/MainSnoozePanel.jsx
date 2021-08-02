import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { useNotificationActions, useNotifications, useRedirect, useTranslationActions, useSettings, useTodos, useTodoActions, useHuddleChatbot } from "../../hooks";

import { ToastContainer, toast } from "react-toastify";
import { getTimestampInMins, getCurrentTimestamp } from "../../../helpers/dateFormatter";
import { setSelectedChannel } from "../../../redux/actions/chatActions";
import SnoozeItem from "../../list/snooze/SnoozeItem";

const Wrapper = styled.div`
.snooze-container {
  margin-bottom: 8px !important;
  color: ${(props) => (props.darkMode === "1" ? "#afb8bd" : "#aaa")};
  background: ${(props) => (props.darkMode === "1" ? "#191c20" : "#fff !important")};
}
.snooze-container .snooze-me {
  font-size: 11px;
  margin: 0 5px;
  text-decoration: underline;
}
.snooze-all-container {
  background: 0 0;
  box-shadow: none;
  margin: 0;
  padding: 0;
  height: auto;
  min-height: 25px;
  color: ${(props) => (props.darkMode === "1" ? "#afb8bd" : "#aaa")};
  background: transparent;
}
.snooze-all-container .snooze-all-body {
  height: auto;
  font-size: 12px;
  margin: 0 5px;
  text-decoration: underline;
}
.robotAvatar {
  margin-right: 1rem;
  height: 2.7rem;
  width: 2.7rem;
}
.robotAvatar div {
  background: #f1f2f7;
  border-radius: 40px;
  font-size: 25px;
  text-align: center;
  width: 100%;
  height: 100%;
}
`;
const MainSnooze = (props) => {
  const { notifications, notificationSnooze } = useNotifications();
  const { getReminders, items } = useTodos(true);
  const todos = useSelector((state) => state.global.todos);

  const user = useSelector((state) => state.session.user);
  const { _t } = useTranslationActions();

  const notifActions = useNotificationActions();
  const todoActions = useTodoActions();
  const { generalSettings: { dark_mode }, } = useSettings();
  const redirect = useRedirect();

  const huddleActions = useHuddleChatbot();
  const history = useHistory();

  const currentDate = new Date();
  const currentTime = currentDate.getTime();
  const dispatch = useDispatch();

  const users = useSelector((state) => state.users);
  const chats = useSelector((state) => state.chat);

  const hasUnpublishedAnswers = chats.hasUnpublishedAnswers;
  const huddleBots = chats.huddleBots;
  const channels = chats.channels;
  const weekDays = [{ day: "M", value: 1 }, { day: "T", value: 2 }, { day: "W", value: 3 }, { day: "TH", value: 4 }, { day: "F", value: 5 },];

  const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6;
  const answeredChannels = [...hasUnpublishedAnswers];

  const snoozeTime = 5, snoozeCycle = 2, todoCycle = 7, expTodo = 59; //mins

  const dictionary = {
    notificationMention: _t("SNOOZE.MENTION", "mentioned you in ::title::", { title: "" }), todoReminder: _t("SNOOZE.REMINDER", `A friendly automated reminder`),
    sentProposal: _t("SNOOZE.SENT_PROPOSAL", "sent a proposal."), notificationNewPost: _t("SNOOZE.NEW_POST", `shared a post`),
    mustRead: _t("SNOOZE.MUST_READ", "Must read"), needsReply: _t("SNOOZE.NEEDS_REPLY", "Needs reply"),
    timeTOHuddle: _t("SNOOZE.TIME_TO_HUDDLE", "Time to huddle, "), hasRequestedChange: _t("SNOOZE.HAS_REQUESTED_CHANGE", "has requested a change."),
    snoozeAll: _t("SNOOZE.SNOOZE_ALL", "Snoozed for 60 mins"), snoozeMe: _t("SNOOZE.SNOOZE_ME", "Snoozed for 60 mins"),
    actionNeeded: _t("SNOOZE.ACTION_NEEDED", "Action needed"), changeRequested: _t("SNOOZE.CHANGE_REQUESTED", "Change requested"),
  };

  const notifCLean = () => {
    return Object.values(notifications).filter(n => (n.type === 'POST_MENTION'
      || n.type === 'POST_REQST_APPROVAL'
      || n.type === 'POST_REJECT_APPROVAL'
      ||
      (n.type === 'POST_CREATE' && (n.data.must_read || n.data.must_reply))
    )).sort((a, b) => b.created_at.timestamp - a.created_at.timestamp);
  }

  const todoCLean = () => {
    var inMins = getTimestampInMins(expTodo);
    const todos = getReminders({ filter: { status: '', search: '' } });
    return todos.filter((t) => t.assigned_to && t.assigned_to.id === user.id && t.remind_at && t.remind_at.timestamp <= inMins && t.status !== "OVERDUE");
  }

  const huddleClean = (h) => {
    if (h.questions && h.questions.filter((q) => q.answer === null).length > 0) {
      let inTimeRange = false;
      const startAtHour = parseInt(h.start_at.time.substr(0, 2));
      const startAtMinutes = parseInt(h.start_at.time.substr(3, 2));
      const publishAtHour = parseInt(h.publish_at.time.substr(0, 2));
      const publishAtMinutes = parseInt(h.publish_at.time.substr(3, 2));
      let startAtDate = new Date();
      startAtDate.setUTCHours(startAtHour, startAtMinutes, 0);
      startAtDate.setDate(currentDate.getDate());
      let publishAtDate = new Date();
      publishAtDate.setUTCHours(publishAtHour, publishAtMinutes, 0);
      publishAtDate.setDate(currentDate.getDate());
      inTimeRange = currentTime > startAtDate.getTime() && publishAtDate.getTime() > currentTime;
      //  if (selectedChannel && h.channel.id !== selectedChannel.id && inTimeRange) {
      if (inTimeRange) {
        if (h.end_type === "NEVER") {
          if (h.repeat_type === "DAILY") {
            return true;
          } else if (h.repeat_type === "WEEKLY") {
            if (h.repeat_select_weekly && weekDays.find((d) => d.day === h.repeat_select_weekly).value === currentDate.getDay()) {
              return true;
            } else {
              return false;
            }
          } else if (h.repeat_type === "MONTHLY") {
            return h.showToday;
          } else if (h.repeat_type === "YEARLY") {
            // same day and month
            return h.showToday;
          }
        } else if (h.end_type === "END_ON") {
          const endDate = new Date(h.end_select_on.substr(0, 4), parseInt(h.end_select_on.substr(5, 2)) - 1, h.end_select_on.substr(8, 2));
          if (currentDate.getTime() < endDate.getTime()) {
            if (h.repeat_type === "DAILY") {
              return true;
            } else if (h.repeat_type === "WEEKLY") {
              if (h.repeat_select_weekly && weekDays.find((d) => d.day === h.repeat_select_weekly).value === currentDate.getDay()) {
                return true;
              } else {
                return false;
              }
            } else if (h.repeat_type === "MONTHLY") {
              return h.showToday;
            } else if (h.repeat_type === "YEARLY") {
              // same day and month
              return h.showToday;
            }
          } else {
            return false;
          }
        } else if (h.end_type === "END_AFTER_REPEAT") {
          if (h.repeat_count < h.end_select_after) {
            if (h.repeat_type === "DAILY") {
              return true;
            } else if (h.repeat_type === "WEEKLY") {
              if (h.repeat_select_weekly && weekDays.find((d) => d.day === h.repeat_select_weekly).value === currentDate.getDay()) {
                return true;
              } else {
                return false;
              }
            } else if (h.repeat_type === "MONTHLY") {
              return h.showToday;
            } else if (h.repeat_type === "YEARLY") {
              // same day and month
              return h.showToday;
            }
          }
        }
      } else {
        return false;
      }
    } return false;
  }

  const handleRedirect = (type, n, e) => {
    var actions = type === 'notification' ? notifActions : n.type === 'todo' ? todoActions : huddleActions;
    e.preventDefault();
    if (n.is_read === 0) {
      notifActions.read({ id: n.id });
    }
    if (n.type === "NEW_TODO" || type === 'todo') {
      redirect.toTodos();
    } else {
      if (type === 'huddle') {
        history.push(`/chat/${n.channel.code}`);
        dispatch(setSelectedChannel({ id: n.channel.id }));
        return;
      } else {
        let post = { id: n.data.post_id, title: n.data.title };
        let workspace = null;
        let focusOnMessage = null;
        if (n.data.workspaces && n.data.workspaces.length) {
          workspace = n.data.workspaces[0];
          workspace = {
            id: workspace.topic_id,
            name: workspace.topic_name,
            folder_id: workspace.workspace_id ? workspace.workspace_id : null,
            folder_name: workspace.workspace_name ? workspace.workspace_name : null,
          };
        }
        if (n.type === "POST_MENTION") {
          if (n.data.comment_id) {
            focusOnMessage = { focusOnMessage: n.data.comment_id };
          }
        }
        redirect.toPost({ workspace, post }, focusOnMessage);
      }
    }
    actions.snooze({ id: n.id, is_snooze: false });
  };

  const snoozeMeButton = ({ closeToast }) => {
    return ( <span className="snooze-me" onClick={(e) => {e.stopPropagation();closeToast();}}>Snooze</span>);
  }

  const handleSnoozeAll = (a, e) => {
    e.preventDefault();

    const items = [];
    let todos = [], notifs = [], huddles = [];

    todos = processItems('todo', todoCLean());
    notifs = processItems('notification', notifCLean());
    huddles = processItems('huddle', huddleBots);
    const snooze = items.concat(todos, notifs, huddles);

    snooze.map((item) => {
      const elemId = item.type + '__' + item.id;
      var actions = item.type === 'notification' ? notifActions : item.type === 'todo' ? todoActions : huddleActions;
      const n = item.type === 'notification' ? notifications[item.id] : item.type === 'todo' ? todos.items[item.id] : Object.values(huddleBots).find(el => el.id == item.id);
      const data = { id: n.id, is_snooze: true, snooze_time: getTimestampInMins(snoozeTime) };
      if (!n.is_snooze) {
        if (toast.isActive(elemId))
          toast.dismiss(elemId);
        actions.snooze(data);
      }
    });
    toast.success(<span dangerouslySetInnerHTML={{ __html: dictionary.snoozeAll }} />, { containerId: "toastA", toastId: 'btnSnoozeMe' });
  }

  const [activeSnooze, setActiveSnooze] = useState([]);

  const snoozeOpen = (snooze) => {
    if (snooze.length > 0) {
      const count = snooze.length;
      if (!toast.isActive('btnSnoozeAll'))
        toast(<span className="snooze-all"
          onClick={(e) => handleSnoozeAll(snooze, e)}>Snooze All {count > 4 && count} {" "} Notifications</span>,
          {
            className: 'snooze-all-container', bodyClassName: "snooze-all-body", containerId: 'toastS', toastId: 'btnSnoozeAll', closeButton: false,
          });
      else {
        toast.update('btnSnoozeAll', {
          render: () => <span className="snooze-all" onClick={(e) => handleSnoozeAll(snooze, e)}>Snooze All {count > 4 && count} {" "} Notifications</span>,
          containerId: 'toastS',
        });
      }

      const items = snooze.slice(0, 4);
      const active = [];
      items.map((item) => {
        var actions = item.type === 'notification' ? notifActions : item.type === 'todo' ? todoActions : huddleActions;
        const elemId = item.type + '__' + item.id;
        const n = item.type === 'notification' ? notifications[item.id] : item.type === 'todo' ? todos.items[item.id] : Object.values(huddleBots).find(el => el.id == item.id);
        let closeAction = false;
        if (!toast.isActive(elemId)) {
          toast(<SnoozeItem type={item.type} id={n.id} item={n} user={user} users={users} actions={actions} handleRedirect={handleRedirect} channels={channels} darkMode={dark_mode} />, {
            className: 'snooze-container', bodyClassName: "snooze-body", containerId: 'toastS', toastId: elemId,
            onClose: () => {
              const data = { id: n.id, is_snooze: true, snooze_time: getTimestampInMins(snoozeTime) };
              if (item.type === 'notification' && notifications[n.id] && !notifications[n.id].is_read) {
                actions.snooze(data);
                closeAction = true;
              }
              else if (item.type === 'todo' && todos.items[n.id] && todos.items[n.id].status !== "DONE") {
                actions.snooze(data);
                closeAction = true;
              } else if (item.type === 'huddle' && !huddleClean(n)) {
                actions.snooze(data);
                closeAction = true;
              }
              closeAction && toast.success(<span dangerouslySetInnerHTML={{ __html: dictionary.snoozeMe }} />, { containerId: "toastA", toastId: 'btnSnoozeMe' });
            }
          });
        }
        active.push(elemId);
      });

      activeSnooze.filter((t) => { return active.indexOf(t) < 0; }).map((t) => { toast.dismiss(t); });

      setActiveSnooze(active);
    } else
      toast.dismiss('btnSnoozeAll');
  }

  const hasActions = (n) => {
    return ((n.data.must_read && n.data.required_users && n.data.required_users.some((u) => u.id === user.id && !u.must_read)) || (n.data.must_read_users && n.data.must_read_users.some((u) => u.id === user.id && !u.must_read))) ||
      (n.data.must_reply && n.data.required_users && n.data.required_users.some((u) => u.id === user.id && !u.must_reply)) || (n.data.must_reply_users && n.data.must_reply_users.some((u) => u.id === user.id && !u.must_reply));
  }

  const processItems = (type, items) => {
    const snooze = [];
    items.map((n) => {
      const elemId = type + '__' + n.id;
      const data = { 'type': type, 'id': n.id, 'created_at': type === 'huddle' ? n.start_at.timestamp : n.created_at.timestamp };
      if (type === 'notification') {
        if (!n.is_read && !n.is_snooze)
          if (n.type === "POST_CREATE" && hasActions(n))
            snooze.push(data);
          else snooze.push(data);
        n.is_read && toast.isActive(elemId) && toast.dismiss(elemId);
      } else if (type === 'todo') {
        if (n.status !== "DONE" && !n.is_snooze)
          snooze.push(data);
        n.status === "DONE" && toast.isActive(elemId) && toast.dismiss(elemId);
      }
      else if (type === 'huddle') {
        if (!isWeekend && !answeredChannels.includes(n.channel.id) && !huddleClean(n) && !n.is_snooze)
          snooze.push(data);
      }
    });
    return snooze;
  };

  const unSnoozeMe = (type, items) => {
    const inMins = getCurrentTimestamp();
    items.map((n) => {
      const actions = type === 'notification' ? notifActions : type === 'todo' ? todoActions : huddleActions;
      if (type === 'notification' && !n.is_read && n.is_snooze && n.snooze_time <= inMins)
        actions.snooze({ id: n.id, is_snooze: false, snooze_time: null });
      else if (type === 'todo' && n.status !== "DONE" && n.is_snooze && n.snooze_time <= inMins)
        actions.snooze({ id: n.id, is_snooze: false, snooze_time: null });
      else if (type === 'huddle' && n.is_snooze && n.snooze_time <= inMins)
        actions.snooze({ id: n.id, is_snooze: false, snooze_time: null })
    });
  };

  const putToSnooze = () => {
    const items = [];
    let todos = [], notifs = [], huddles = [];

    todos = processItems('todo', todoCLean());
    notifs = processItems('notification', notifCLean());
    huddles = processItems('huddle', huddleBots);

    const snooze = items.concat(todos, notifs, huddles);
    snooze.length ? snoozeOpen(snooze) : toast.dismiss('btnSnoozeAll');
  };

  //interval for all snoozed items
  useEffect(() => {
    const interval = setInterval(() => {
      if (Object.keys(chats.channels).length > 0) {
        console.log('interval for all snoozed items');
        unSnoozeMe('todo', todoCLean());
        unSnoozeMe('notification', notifCLean());
        unSnoozeMe('huddle', huddleBots);
        toast.info(<span dangerouslySetInnerHTML={{ __html: `interval for all snoozed items ${snoozeCycle} mins` }} />, { containerId: "toastA", toastId: 'xxy' });
      }
    }, 1000 * 60 * snoozeCycle);
    return () => clearInterval(interval);
  }, [notifications, todos, huddleBots]);

  //interval for all expiring todos
  useEffect(() => {
    const interval = setInterval(() => {
      if (Object.keys(chats.channels).length > 0){
        console.log('interval for all expiring todos');
        putToSnooze();
        toast.warning(<span dangerouslySetInnerHTML={{ __html: `interval for all expiring todos ${todoCycle} mins` }} />, { containerId: "toastA", toastId: 'xxz' });
      }
       
    }, 1000 * 60 * todoCycle);
    return () => clearInterval(interval);
  }, [todos]);

  //handler for all non-snoozed items
  useEffect(() => {
    if (Object.keys(chats.channels).length > 0) {
      putToSnooze();
    }
  }, [notifications, todos, huddleBots]);

  return (
    <Wrapper darkMode={dark_mode}>
      <ToastContainer enableMultiContainer containerId={'toastS'} position="bottom-left" autoClose={false} newestOnTop={false}
        closeOnClick={false} rtl={false} pauseOnFocusLoss={false} draggable={false} limit={5} closeButton={snoozeMeButton}
      />
    </Wrapper>
  );
};
export default MainSnooze;