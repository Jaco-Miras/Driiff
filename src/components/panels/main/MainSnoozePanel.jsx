import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { useNotificationActions, useNotifications, useRedirect, useTranslationActions, useSettings, useTodos, useTodoActions, useHuddleChatbot, useCompanyPosts } from "../../hooks";

import { ToastContainer, toast } from "react-toastify";
import { getTimestampInMins, getCurrentTimestamp } from "../../../helpers/dateFormatter";
import { setSelectedChannel } from "../../../redux/actions/chatActions";
import SnoozeItem from "../../list/snooze/SnoozeItem";

const Wrapper = styled.div`
  .snooze-container {
    margin-bottom: 8px !important;
    color: ${(props) => (props.darkMode === "1" ? "#afb8bd !important" : "#aaa !important")};
    background: ${(props) => (props.darkMode === "1" ? "#191c20 !important" : "#fff !important")};
  }
  .snooze-container p.snooze-body {
    color: ${(props) => (props.darkMode === "1" ? "#afb8bd !important" : "#505050 !important")};
  }
  .snooze-container .snooze-me {
    font-size: 11px;
    margin: 0 5px;
    text-decoration: underline;
    position: absolute;
    right: 0;
    margin-right: 1em;
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
    font-size: 12px;
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
    font-size: 27px;
    text-align: center;
    width: 100%;
    height: 100%;
  }
`;
const MainSnooze = (props) => {
  const { notifications } = useNotifications();
  const { getReminders } = useTodos(true);
  const todos = useSelector((state) => state.global.todos);

  const user = useSelector((state) => state.session.user);
  const { _t } = useTranslationActions();

  const notifActions = useNotificationActions();
  const todoActions = useTodoActions();
  const {
    generalSettings: { dark_mode },
  } = useSettings();
  const redirect = useRedirect();

  const huddleActions = useHuddleChatbot();

  const history = useHistory();

  const currentDate = new Date();
  const currentTime = currentDate.getTime();
  const dispatch = useDispatch();

  const users = useSelector((state) => state.users.users);
  //const users = useSelector((state) => state.users);
  //const chats = useSelector((state) => state.chat);

  //const hasUnpublishedAnswers = chats.hasUnpublishedAnswers;
  // const huddleBots = chats.huddleBots;
  //const channels = chats.channels;
  const huddleBots = useSelector((state) => state.chat.huddleBots);
  const channels = useSelector((state) => state.chat.channels);
  // const weekDays = [
  //   { day: "M", value: 1 },
  //   { day: "T", value: 2 },
  //   { day: "W", value: 3 },
  //   { day: "TH", value: 4 },
  //   { day: "F", value: 5 },
  // ];

  const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6;
  const huddleAnswered = localStorage.getItem("huddle");
  //const answeredChannels = [...hasUnpublishedAnswers];
  const answeredChannels = huddleAnswered ? JSON.parse(huddleAnswered).channels : [];

  const snoozeTime = 1, snoozeCycle = 1, expTodo = 59; //mins

  const dictionary = {
    notificationMention: _t("SNOOZE.MENTION", "mentioned you in ::title::", { title: "" }),
    todoReminder: _t("SNOOZE.REMINDER", "A friendly automated reminder"),
    sentProposal: _t("SNOOZE.SENT_PROPOSAL", "sent a proposal."),
    notificationNewPost: _t("SNOOZE.NEW_POST", "shared a post"),
    mustRead: _t("SNOOZE.MUST_READ", "Must read"),
    needsReply: _t("SNOOZE.NEEDS_REPLY", "Needs reply"),
    timeTOHuddle: _t("SNOOZE.TIME_TO_HUDDLE", "Time to huddle, "),
    hasRequestedChange: _t("SNOOZE.HAS_REQUESTED_CHANGE", "has requested a change."),
    //snoozeAll: _t("SNOOZE.SNOOZE_ALL", `Snoozed all for ${snoozeTime} min(s)`),
    snoozeMe: _t("SNOOZE.SNOOZE_ME", `Snoozed for ${snoozeTime} min(s)`),
    actionNeeded: _t("SNOOZE.ACTION_NEEDED", "Action needed"),
    changeRequested: _t("SNOOZE.CHANGE_REQUESTED", "Change requested"),
    timeTOHuddle: _t("SNOOZE.TIME_TO_HUDDLE", "Time to huddle, "),
    huddleSkip: _t("SNOOZE.HUDDLE_SKIP", "Huddle is Skipped"),
  };

  const notifCLean = () => {
    return Object.values(notifications)
      .filter((n) => n.type === "POST_MENTION" || n.type === "POST_REQST_APPROVAL" || n.type === "POST_REJECT_APPROVAL" || n.type === "PST_CMT_REJCT_APPRVL" || n.type === "POST_COMMENT" || (n.type === "POST_CREATE" && (n.data.must_read || n.data.must_reply)))
      .sort((a, b) => b.created_at.timestamp - a.created_at.timestamp);
  };

  const todoCLean = () => {
    var inMins = getTimestampInMins(expTodo);
    const todos = getReminders({ filter: { status: "", search: "" } });
    return todos.filter((t) => t.remind_at.timestamp <= inMins && t.status !== "OVERDUE");
  };

  const huddleClean = (h) => {
    if (h.questions.filter((q) => q.answer === null).length > 0) {
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
      // will return true if in time range
      return currentTime > startAtDate.getTime() && publishAtDate.getTime() > currentTime;
    } else {
      return false;
    }
  };

  /* For v2 of huddle*/
  // const huddleClean = (h) => {
  //   if (h.questions && h.questions.filter((q) => q.answer === null).length > 0) {
  //     let inTimeRange = false;
  //     const startAtHour = parseInt(h.start_at.time.substr(0, 2));
  //     const startAtMinutes = parseInt(h.start_at.time.substr(3, 2));
  //     const publishAtHour = parseInt(h.publish_at.time.substr(0, 2));
  //     const publishAtMinutes = parseInt(h.publish_at.time.substr(3, 2));
  //     let startAtDate = new Date();
  //     startAtDate.setUTCHours(startAtHour, startAtMinutes, 0);
  //     startAtDate.setDate(currentDate.getDate());
  //     let publishAtDate = new Date();
  //     publishAtDate.setUTCHours(publishAtHour, publishAtMinutes, 0);
  //     publishAtDate.setDate(currentDate.getDate());
  //     inTimeRange = currentTime > startAtDate.getTime() && publishAtDate.getTime() > currentTime;
  //     //  if (selectedChannel && h.channel.id !== selectedChannel.id && inTimeRange) {
  //     if (inTimeRange) {
  //       if (h.end_type === "NEVER") {
  //         if (h.repeat_type === "DAILY") {
  //           return true;
  //         } else if (h.repeat_type === "WEEKLY") {
  //           if (h.repeat_select_weekly && weekDays.find((d) => d.day === h.repeat_select_weekly).value === currentDate.getDay()) {
  //             return true;
  //           } else {
  //             return false;
  //           }
  //         } else if (h.repeat_type === "MONTHLY") {
  //           return h.showToday;
  //         } else if (h.repeat_type === "YEARLY") {
  //           // same day and month
  //           return h.showToday;
  //         }
  //       } else if (h.end_type === "END_ON") {
  //         const endDate = new Date(h.end_select_on.substr(0, 4), parseInt(h.end_select_on.substr(5, 2)) - 1, h.end_select_on.substr(8, 2));
  //         if (currentDate.getTime() < endDate.getTime()) {
  //           if (h.repeat_type === "DAILY") {
  //             return true;
  //           } else if (h.repeat_type === "WEEKLY") {
  //             if (h.repeat_select_weekly && weekDays.find((d) => d.day === h.repeat_select_weekly).value === currentDate.getDay()) {
  //               return true;
  //             } else {
  //               return false;
  //             }
  //           } else if (h.repeat_type === "MONTHLY") {
  //             return h.showToday;
  //           } else if (h.repeat_type === "YEARLY") {
  //             // same day and month
  //             return h.showToday;
  //           }
  //         } else {
  //           return false;
  //         }
  //       } else if (h.end_type === "END_AFTER_REPEAT") {
  //         if (h.repeat_count < h.end_select_after) {
  //           if (h.repeat_type === "DAILY") {
  //             return true;
  //           } else if (h.repeat_type === "WEEKLY") {
  //             if (h.repeat_select_weekly && weekDays.find((d) => d.day === h.repeat_select_weekly).value === currentDate.getDay()) {
  //               return true;
  //             } else {
  //               return false;
  //             }
  //           } else if (h.repeat_type === "MONTHLY") {
  //             return h.showToday;
  //           } else if (h.repeat_type === "YEARLY") {
  //             // same day and month
  //             return h.showToday;
  //           }
  //         }
  //       }
  //     } else {
  //       return false;
  //     }
  //   }
  //   return false;
  // };

  const handleRedirect = (type, n, e) => {
    var actions = type === "notification" ? notifActions : n.type === "todo" ? todoActions : huddleActions;
    e.preventDefault();
    if (n.is_read === 0) { //&& n.type === "POST_MENTION"
      notifActions.read({ id: n.id });
    }

    if (type === "huddle") {
      history.push(`/chat/${n.channel.code}`);
      dispatch(setSelectedChannel({ id: n.channel.id }));
      return;
    } else if (type === 'todo') {
      redirect.toTodos();
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

    actions.snooze({ id: n.id, is_snooze: false });
  };

  const snoozeMeButton = ({ closeToast }) => {
    return (
      <span
        className="snooze-me"
        onClick={(e) => {
          e.stopPropagation();
          closeToast();
        }}
      >
        Snooze
      </span>
    );
  };

  const hasMustReadAction = (n) => {
    return n.data.must_read && n.data.must_read_users && n.data.must_read_users.some((u) => u.id === user.id && !u.must_read);
  };

  const hasMustReplyAction = (n) => {
    return n.data.must_reply && n.data.must_reply_users && n.data.must_reply_users.some((u) => u.id === user.id && !u.must_reply);
  };

  const hasApprovalAction = (n) => {
    return n.data.users_approval && n.data.users_approval.find((u) => u.ip_address === null && user.id === u.id);
  };

  const hasCommentRejectApproval = (notification) => {
    return Object.values(notifications)
      .filter((n) => n.id !== notification.id)
      .some((n) => n.type === "PST_CMT_REJCT_APPRVL" && n.data.post_id === notification.data.post_id && n.id > notification.id);
  };

  const handleSnoozeAll = (a, e) => {
    e.preventDefault();

    const items = [];
    let todos = [],
      notifs = [],
      huddles = [];

    todos = processItems("todo", todoCLean());
    notifs = processItems("notification", notifCLean());
    huddles = processItems("huddle", huddleBots);
    const snooze = items.concat(todos, notifs, huddles);

    snooze.map((item) => {
      const elemId = item.type + "__" + item.id;
      var actions = item.type === "notification" ? notifActions : item.type === "todo" ? todoActions : huddleActions;
      const n = item.type === "notification" ? notifications[item.id] : item.type === "todo" ? todos.items[item.id] : Object.values(huddleBots).find((el) => el.id == item.id);
      const data = { id: n.id, is_snooze: true, snooze_time: getTimestampInMins(snoozeTime) };
      if (!n.is_snooze) {
        toast.isActive(elemId) && toast.dismiss(elemId);
        actions.snooze(data);
      }
    });
    // toast.success(<span dangerouslySetInnerHTML={{ __html: dictionary.snoozeAll }} />, { containerId: "toastA", toastId: "btnSnoozeAll" });
  };

  const [activeSnooze, setActiveSnooze] = useState([]);

  const snoozeOpen = (snooze) => {

    if (snooze.length > 0) {

      const count = snooze.length;
      if (!toast.isActive("btnSnoozeAll"))
        toast(
          <span className="snooze-all" onClick={(e) => handleSnoozeAll(snooze, e)}>
            Snooze all {count > 4 && count} Notifications
          </span>,
          {
            className: "snooze-all-container",
            bodyClassName: "snooze-all-body",
            containerId: "toastS",
            toastId: "btnSnoozeAll",
            closeButton: false,
          }
        );
      else {
        toast.update("btnSnoozeAll", {
          render: () => (
            <span className="snooze-all" onClick={(e) => handleSnoozeAll(snooze, e)}>
              Snooze all {count > 4 && count} Notifications
            </span>
          ),
          containerId: "toastS",
        });
      }

      const items = snooze.slice(0, 4);
      let active = [];
      items.map((item) => {
        var actions = item.type === "notification" ? notifActions : item.type === "todo" ? todoActions : huddleActions;
        const elemId = item.type + "__" + item.id;
        const n = item.type === "notification" ? notifications[item.id] : item.type === "todo" ? todos.items[item.id] : Object.values(huddleBots).find((el) => el.id == item.id);

        let ca = false;
        if (!toast.isActive(elemId)) {
          toast(<SnoozeItem type={item.type} dictionary={dictionary} id={n.id} item={n} user={user} users={users} actions={actions} handleRedirect={handleRedirect} channels={channels} darkMode={dark_mode} />, {
            className: "snooze-container",
            bodyClassName: "snooze-body",
            containerId: "toastS",
            toastId: elemId,
            onClose: () => {
              const data = { id: n.id, is_snooze: true, snooze_time: getTimestampInMins(snoozeTime) };
              if (item.type === "notification" && notifications[n.id]) {
                if (n.type === "POST_CREATE" && (hasMustReadAction(n) || hasMustReplyAction(n))) ca = true;
                else if (n.type === "POST_REQST_APPROVAL" && hasApprovalAction(n)) { ca = true; }
                else if (n.type === "POST_MENTION" && !notifications[n.id].is_read) ca = true;
                else if (n.type === "POST_REJECT_APPROVAL" && !hasCommentRejectApproval(n) && notifications[n.id].data.post_approval_label && notifications[n.id].data.post_approval_label == "REQUEST_UPDATE") ca = true;
                else if (n.type === "PST_CMT_REJCT_APPRVL" && !hasCommentRejectApproval(n) && notifications[n.id].data.post_approval_label && notifications[n.id].data.post_approval_label == "REQUEST_UPDATE") ca = true;
                else if (n.type === "POST_COMMENT" && notifications[n.id].data.post_approval_label && notifications[n.id].data.post_approval_label === "NEED_ACTION") ca = true;
              } else if (item.type === "todo" && todos.items[n.id] && todos.items[n.id].status !== "DONE") ca = true;
              else if (item.type === "huddle" && huddleClean(n)) ca = true;
              if (ca) {
                actions.snooze(data);
                toast.success(<span dangerouslySetInnerHTML={{ __html: dictionary.snoozeMe }} />, { containerId: "toastA", toastId: "btnSnoozeMe" });
              }
            },
          });
        } else {
          if (item.update) {
            toast.update(elemId, {
              render: () => <SnoozeItem type={item.type} dictionary={dictionary} id={n.id} item={n} user={user} users={users} actions={actions} handleRedirect={handleRedirect} channels={channels} darkMode={dark_mode} />,
              containerId: "toastS",
            });
          }
        }
        active.push(elemId);
      });

      /*
      activeSnooze
        .filter((t) => {
          return active.indexOf(t) < 0;
        })
        .map((t) => {
          toast.dismiss(t);
        });
      setActiveSnooze(active);
      */
    } else toast.dismiss("btnSnoozeAll");
  };

  const processItems = (type, items) => {
    const snooze = [];
    items.map((n) => {
      const elemId = type + "__" + n.id;
      const data = { type: type, id: n.id, created_at: type === "huddle" ? n.start_at.timestamp : n.created_at.timestamp };
      if (type === "notification") {
        if (n.type === "POST_MENTION") !n.is_read && !n.is_snooze ? snooze.push(data) : n.is_read && toast.isActive(elemId) && toast.dismiss(elemId);
        else if (n.type === "POST_CREATE") {
          if ((hasMustReadAction(n) || hasMustReplyAction(n)) && !n.is_snooze) {
            snooze.push({ ...data, update: true });
          }
          else toast.isActive(elemId) && toast.dismiss(elemId);
        } else if (n.type === "POST_REQST_APPROVAL") {
          if (hasApprovalAction(n) && !n.is_snooze)
            snooze.push(data);
          else toast.isActive(elemId) && toast.dismiss(elemId);
        }
        else if (n.type === "POST_REJECT_APPROVAL") {
          if (!hasCommentRejectApproval(n) && n.data.post_approval_label && n.data.post_approval_label === "REQUEST_UPDATE" && !n.is_snooze)
            snooze.push(data)
          else
            toast.isActive(elemId) && toast.dismiss(elemId);
        }
        else if (n.type === "PST_CMT_REJCT_APPRVL") {
          if (!hasCommentRejectApproval(n) && n.data.post_approval_label && n.data.post_approval_label === "REQUEST_UPDATE" && !n.is_snooze)
            snooze.push(data);
          else toast.isActive(elemId) && toast.dismiss(elemId);
        }
        else if (n.type === "POST_COMMENT") {
          if (n.data.post_approval_label && n.data.post_approval_label === "NEED_ACTION" && !n.is_snooze)
            snooze.push(data);
          else toast.isActive(elemId) && toast.dismiss(elemId);
        }
      } else if (type === "todo") {
        (n.status !== "DONE" && !n.is_snooze) ? snooze.push(data) : toast.isActive(elemId) && toast.dismiss(elemId);
      } else if (type === "huddle") {
        (!isWeekend && !answeredChannels.includes(n.channel.id) && huddleClean(n) && !n.is_snooze) ? snooze.push(data) : toast.isActive(elemId) && toast.dismiss(elemId);
      }
    });
    return snooze;
  };

  const unSnoozeMe = (type, items) => {
    const inMins = getCurrentTimestamp();
    const actions = type === "notification" ? notifActions : type === "todo" ? todoActions : huddleActions;
    let counter = 0;
    items.map((n) => {
      if (type === "notification" && n.is_snooze && n.snooze_time <= inMins || !n.is_read) {
        counter++;
        actions.snooze({ id: n.id, is_snooze: false, snooze_time: null });
      } else if (type === "todo" && n.status !== "DONE" && n.is_snooze && n.snooze_time <= inMins) {
        counter++;
        actions.snooze({ id: n.id, is_snooze: false, snooze_time: null });
      } else if (type === "huddle" && n.is_snooze && n.snooze_time <= inMins) {
        counter++;
        actions.snooze({ id: n.id, is_snooze: false, snooze_time: null });
      }
    });
    return counter;
  };

  const putToSnooze = () => {
    const items = [];
    let todos = [], notifs = [], huddles = [];

    todos = processItems("todo", todoCLean());
    notifs = processItems("notification", notifCLean());
    huddles = processItems("huddle", huddleBots);

    const snooze = items.concat(todos, notifs, huddles);
    snooze.length ? snoozeOpen(snooze) : toast.dismiss("btnSnoozeAll");
  };

  //interval for all snoozed items
  useEffect(() => {
    const interval = setInterval(() => {
      if (Object.keys(channels).length > 0 && users) {
        const todos = unSnoozeMe("todo", todoCLean()),
          notis = unSnoozeMe("notification", notifCLean()),
          huddles = unSnoozeMe("huddle", huddleBots);
        toast.info(<span dangerouslySetInnerHTML={{ __html: `interval for all snoozed items ${snoozeCycle} mins` }} />, { containerId: "toastA", toastId: "xxy" });

        if (todos === 0 && notis === 0 && huddles === 0) putToSnooze();
      }
    }, 1000 * 60 * snoozeCycle);
    return () => clearInterval(interval);
  }, [notifications, todos, huddleBots]);

  //handler for all non-snoozed items
  useEffect(() => {
    if (Object.keys(channels).length > 0 && users) {
      putToSnooze();
    }
  }, [notifications, todos, huddleBots]);

  return (
    <Wrapper darkMode={dark_mode}>
      <ToastContainer
        enableMultiContainer
        containerId={"toastS"}
        position="bottom-left"
        autoClose={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        limit={5}
        closeButton={snoozeMeButton}
      />
    </Wrapper>
  );
};
export default MainSnooze;
