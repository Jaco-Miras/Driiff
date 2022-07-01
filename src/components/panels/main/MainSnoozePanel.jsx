import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import moment from "moment-timezone";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { useNotificationActions, useNotifications, useRedirect, useTranslationActions, useSettings, useTodoActions, useHuddleChatbot, useSnoozeActions, useTimeFormat } from "../../hooks";
import { ToastContainer, toast } from "react-toastify";
import { getTimestampInMins } from "../../../helpers/dateFormatter";
import { setSelectedChannel, clearHuddleAnswers } from "../../../redux/actions/chatActions";
import SnoozeItem from "../../list/snooze/SnoozeItem";
import { replaceChar } from "../../../helpers/stringFormatter";

const Wrapper = styled.div`
  .snooze-container {
    margin-bottom: 8px !important;
    color: ${(props) => (props.darkMode === "1" ? "#afb8bd !important" : "#aaa !important")};
    background: ${(props) => (props.darkMode === "1" ? "#191c20 !important" : "#fff !important")};
    .feather-x {
      margin-top: -1px;
    }
  }
  .snooze-container p.snooze-body {
    color: ${(props) => (props.darkMode === "1" ? "#afb8bd !important" : "#505050 !important")};
  }
  .snooze-container .snooze-me {
    font-size: 11px;
    //margin: 0 5px;
    text-decoration: underline;
    // position: absolute;
    // right: 0;
    // margin-right: 1em;
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
  //const { getReminders } = useTodos(true);
  const todos = useSelector((state) => state.global.todos);

  const user = useSelector((state) => state.session.user);
  const { _t } = useTranslationActions();

  const snoozeActions = useSnoozeActions();
  const notifActions = useNotificationActions();
  const todoActions = useTodoActions();
  const {
    generalSettings: { dark_mode },
  } = useSettings();
  const redirect = useRedirect();

  const huddleActions = useHuddleChatbot();

  const history = useHistory();
  const { localizeDate } = useTimeFormat();

  const currentDate = new Date();
  const currentTime = currentDate.getTime();
  const dispatch = useDispatch();

  const sharedWs = useSelector((state) => state.workspaces.sharedWorkspaces);
  const users = useSelector((state) => state.users.users);
  //const users = useSelector((state) => state.users);
  //const chats = useSelector((state) => state.chat);

  //const hasUnpublishedAnswers = chats.hasUnpublishedAnswers;
  // const huddleBots = chats.huddleBots;
  //const channels = chats.channels;
  const huddleBots = useSelector((state) => state.chat.huddleBots.filter((h) => h.show_notification && h.show_notification === true));
  const channels = useSelector((state) => state.chat.channels);
  const huddleBotsLoaded = useSelector((state) => state.chat.huddleBotsLoaded);
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

  const [triggerUnsnooze, setTriggerUnsnooze] = useState(false);

  const snoozeTime = 180;
  const snoozeCycle = 180;
  const expTodo = 179; //mins

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
    huddleSkip: _t("SNOOZE.HUDDLE_SKIP", "Huddle is Skipped"),
    replyRequired: _t("POST.REPLY_REQUIRED", "Reply required"),
    snoozeAllNotifications: _t("SNOOZE.SNOOZE_ALL_NOTIFICATIONS", "Snooze all notifications"),
    skip: _t("SNOOZE.SKIP", "Skip"),
    open: _t("SNOOZE.OPEN", "Open"),
    snooze: _t("SNOOZE.SNOOZE", "Snooze"),
    closeNotification: _t("NOTIFICATION.CLOSE", "Notification will not be shown again."),
    addedYouInWorkspace: _t("NOTIFICATION.WORKSPACE_ADDED_MEMBER", "added you in a workspace"),
  };

  const getReminders = ({ filter = "" }) => {
    return Object.values(todos.items)
      .map((t) => {
        if (t.author === null && t.link_type === null) {
          const author = Object.values(users).find((u) => u.id === t.user);
          return {
            ...t,
            author: author ? author : { ...user },
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

          if (filter.status !== "") {
            if (filter.status === "ASSIGNED_TO_OTHERS") return t.assigned_to && t.assigned_to.id !== user.id && t.user === user.id;
            if (filter.status === "ADDED_BY_OTHERS") return t.assigned_to && t.assigned_to.id === user.id && t.user !== user.id;
            if (t.status === filter.status) return !(t.workspace && !t.assigned_to);
            if (t.status === "DONE") {
              if (filter.status === "TODAY" && t.remind_at !== null && localizeDate(t.remind_at.timestamp, "YYYY-MM-DD") === moment().format("YYYY-MM-DD")) return true;
              if (filter.status === "OVERDUE" && t.remind_at !== null && localizeDate(t.remind_at.timestamp, "YYYY-MM-DD") < moment().format("YYYY-MM-DD")) return true;
              if (filter.status === "NEW" && t.remind_at !== null && localizeDate(t.remind_at.timestamp, "YYYY-MM-DD") > moment().format("YYYY-MM-DD")) return true;
              if (filter.status === "NEW" && t.remind_at === null) return true;
            }
            return false;
          } else {
            if (t.workspace && !t.assigned_to) return false;
            if (t.user && t.user === user.id) return true;
            if (t.assigned_to && t.assigned_to.id !== user.id) return false;
            //if (t.assigned_to && t.assigned_to.id === user.id && t.user !== user.id) return false;
            return true;
          }
        }
        return true;
      })
      .sort((a, b) => b.created_at.timestamp - a.created_at.timestamp);
  };

  const notifCLean = () => {
    return Object.values(notifications)
      .filter((n) => {
        return (
          n.type === "POST_MENTION" ||
          n.type === "WORKSPACE_ADD_MEMBER" ||
          n.type === "POST_REQST_APPROVAL" ||
          n.type === "POST_REJECT_APPROVAL" ||
          n.type === "PST_CMT_REJCT_APPRVL" ||
          n.type === "POST_COMMENT" ||
          (n.type === "POST_CREATE" && (n.data.must_read || n.data.must_reply))
        );
      })
      .sort((a, b) => b.created_at.timestamp - a.created_at.timestamp);
  };

  const todoCLean = () => {
    var inMins = getTimestampInMins(expTodo);
    const todos = getReminders({ filter: { status: "", search: "" } });
    return todos.filter((t) => t.remind_at && t.remind_at.timestamp <= inMins && t.status !== "OVERDUE" && t.show_notification);
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
    if (n.is_read === 0) {
      let payload = {
        id: n.id,
      };
      if (n.sharedSlug && sharedWs[n.slug]) {
        const sharedPayload = { slug: n.slug, token: sharedWs[n.slug].access_token, is_shared: true };
        payload = {
          ...payload,
          sharedPayload: sharedPayload,
        };
      }
      notifActions.read(payload);
    }

    if (type === "huddle") {
      history.push(`/chat/${n.channel.code}`);
      dispatch(setSelectedChannel({ id: n.channel.id }));
      return;
    } else if (type === "todo") {
      redirect.toTodos();
    } else {
      let post = { id: n.data.post_id, title: n.data.title };
      let workspace = null;
      let focusOnMessage = null;
      if (n.data.workspaces && n.data.workspaces.length) {
        // workspace = n.data.workspaces[0];
        // workspace = {
        //   id: workspace.topic_id,
        //   name: workspace.topic_name,
        //   folder_id: workspace.workspace_id ? workspace.workspace_id : null,
        //   folder_name: workspace.workspace_name ? workspace.workspace_name : null,
        // };
        if (n.sharedSlug) {
          workspace = n.data.workspaces[0];
          workspace = {
            key: `${workspace.topic_id}-${n.slug}`,
            id: workspace.topic_id,
            name: workspace.topic_name,
            folder_id: workspace.workspace_id ? workspace.workspace_id : null,
            folder_name: workspace.workspace_name ? workspace.workspace_name : null,
          };
        } else if (n.data.workspaces && n.data.workspaces.length) {
          workspace = n.data.workspaces[0];
          workspace = {
            key: workspace.topic_id,
            id: workspace.topic_id,
            name: workspace.topic_name,
            folder_id: workspace.workspace_id ? workspace.workspace_id : null,
            folder_name: workspace.workspace_name ? workspace.workspace_name : null,
          };
        }
      }
      if (n.type === "POST_MENTION") {
        if (n.data.comment_id) {
          focusOnMessage = { focusOnMessage: n.data.comment_id };
        }
      }
      if (n.type === "WORKSPACE_ADD_MEMBER") {
        let key = n.sharedSlug ? `${n.data.id}-${n.slug}` : n.data.id;
        let payload = {
          id: key,
          name: n.data.title,
          folder_id: n.data.workspace_folder_id !== 0 ? n.data.workspace_folder_id : null,
          folder_name: n.data.workspace_folder_name !== "" ? n.data.workspace_folder_name : null,
          sharedSlug: n.sharedSlug,
          slug: n.slug,
        };
        redirect.toWorkspace(payload);
      } else {
        redirect.toPost({ workspace, post, sharedSlug: n.sharedSlug }, focusOnMessage);
      }
    }
    actions.snooze({ id: n.id, is_snooze: false });
  };

  const hasMustReadAction = (n) => {
    const userId = n.sharedSlug && sharedWs[n.slug] ? sharedWs[n.slug].user_auth.id : user.id;
    return n.data.must_read && n.data.must_read_users && n.data.must_read_users.some((u) => u.id === userId && !u.must_read);
  };

  const hasMustReplyAction = (n) => {
    const userId = n.sharedSlug && sharedWs[n.slug] ? sharedWs[n.slug].user_auth.id : user.id;
    return n.data.must_reply && n.data.must_reply_users && n.data.must_reply_users.some((u) => u.id === userId && !u.must_reply);
  };

  const hasApprovalAction = (n) => {
    const userId = n.sharedSlug && sharedWs[n.slug] ? sharedWs[n.slug].user_auth.id : user.id;
    return n.data.users_approval && n.data.users_approval.find((u) => u.ip_address === null && userId === u.id);
  };

  const hasCommentRejectApproval = (notification) => {
    return Object.values(notifications)
      .filter((n) => n.id !== notification.id)
      .some((n) => n.type === "PST_CMT_REJCT_APPRVL" && n.data.post_id === notification.data.post_id && n.id > notification.id);
  };

  const handleSnoozeAll = (a, e) => {
    e.preventDefault();

    const items = [];
    let reminders = [];
    let notifs = [];
    let huddles = [];

    reminders = processItems("todo", todoCLean());
    notifs = processItems("notification", notifCLean());
    huddles = processItems("huddle", huddleBots);
    const snooze = items.concat(reminders, notifs, huddles);

    snooze.map((item) => {
      const elemId = item.type + "__" + item.id;
      var actions = item.type === "notification" ? notifActions : item.type === "todo" ? todoActions : huddleActions;
      const n = item.type === "notification" ? notifications[item.id] : item.type === "todo" ? todos.items[item.id] : Object.values(huddleBots).find((el) => el.id == item.id);
      if (n) {
        const data = { id: n.id, is_snooze: true, snooze_time: getTimestampInMins(snoozeTime) };
        if (!n.is_snooze) {
          toast.isActive(elemId) && toast.dismiss(elemId);
          actions.snooze(data);
        }
      }
    });
    if (notifs.length) {
      snoozeActions.snoozeAllNotif({ is_snooze: true, notification_ids: notifs.map((n) => n.id), type: "POST_SNOOZE" });
    }
    if (reminders.length) {
      snoozeActions.snoozeAllNotif({ is_snooze: true, notification_ids: reminders.map((n) => n.id), type: "REMINDER_SNOOZE" });
    }
    if (huddles.length) {
      snoozeActions.snoozeAllNotif({ is_snooze: true, notification_ids: huddles.map((n) => n.id), type: "HUDDLE_SNOOZE" });
    }
    if (notifs.length || reminders.length || huddles.length) {
      toast.success(<span dangerouslySetInnerHTML={{ __html: dictionary.snoozeMe }} />, { containerId: "toastA", toastId: "btnSnoozeMe" });
    }
  };

  const snoozeOpen = (snooze) => {
    if (snooze.length > 0) {
      //const count = snooze.length;
      if (!toast.isActive("btnSnoozeAll"))
        toast(
          <span className="snooze-all" onClick={(e) => handleSnoozeAll(snooze, e)}>
            {/* Snooze all {count > 4 && count} Notifications */}
            {dictionary.snoozeAllNotifications}
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
              {/* Snooze all {count > 4 && count} Notifications */}
              {dictionary.snoozeAllNotifications}
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

        //let ca = false;
        if (!toast.isActive(elemId)) {
          toast(
            <SnoozeItem
              type={item.type}
              dictionary={dictionary}
              id={n.id}
              item={n}
              user={user}
              users={users}
              actions={actions}
              handleRedirect={handleRedirect}
              darkMode={dark_mode}
              snoozeData={{ id: n.id, is_snooze: true, snooze_time: getTimestampInMins(snoozeTime) }}
            />,
            {
              className: "snooze-container",
              bodyClassName: "snooze-body",
              containerId: "toastS",
              toastId: elemId,
            }
          );
        } else {
          if (item.update) {
            toast.update(elemId, {
              render: () => (
                <SnoozeItem
                  type={item.type}
                  dictionary={dictionary}
                  id={n.id}
                  item={n}
                  user={user}
                  users={users}
                  actions={actions}
                  handleRedirect={handleRedirect}
                  darkMode={dark_mode}
                  snoozeData={{ id: n.id, is_snooze: true, snooze_time: getTimestampInMins(snoozeTime) }}
                />
              ),
              containerId: "toastS",
            });
          }
        }
        active.push(elemId);
      });
    } else toast.dismiss("btnSnoozeAll");
  };

  const processItems = (type, items) => {
    const snooze = [];
    items.map((n) => {
      const elemId = type + "__" + n.id;
      const data = { type: type, id: n.id, created_at: type === "huddle" ? n.start_at.timestamp : n.created_at.timestamp };
      if (type === "notification") {
        if (n.type === "POST_MENTION") {
          if (!n.is_read && !n.is_snooze && n.data && n.data.is_close === 0) {
            snooze.push(data);
          } else if ((n.is_read || n.is_snooze || (n.data && n.data.is_close === 1)) && toast.isActive(elemId)) {
            toast.dismiss(elemId);
          }
        } else if (n.type === "WORKSPACE_ADD_MEMBER") {
          if (!n.is_read && !n.is_snooze) {
            snooze.push(data);
          } else if ((n.is_read || n.is_snooze || (n.data && n.data.is_close === 1)) && toast.isActive(elemId)) {
            toast.dismiss(elemId);
          }
        } else if (n.type === "POST_CREATE") {
          if (n.data && n.data.is_close === 1 && toast.isActive(elemId)) toast.dismiss(elemId);
          else if ((hasMustReadAction(n) || hasMustReplyAction(n)) && !n.is_snooze && n.data && n.data.is_close === 0) snooze.push({ ...data, update: true });
          else toast.isActive(elemId) && toast.dismiss(elemId);
        } else if (n.type === "POST_REQST_APPROVAL") {
          if (n.data && n.data.is_close === 1 && toast.isActive(elemId)) toast.dismiss(elemId);
          else if (hasApprovalAction(n) && !n.is_snooze && n.data && n.data.is_close === 0) snooze.push(data);
          else toast.isActive(elemId) && toast.dismiss(elemId);
        } else if (n.type === "POST_REJECT_APPROVAL") {
          if (n.data && n.data.is_close === 1 && toast.isActive(elemId)) toast.dismiss(elemId);
          else if (!hasCommentRejectApproval(n) && n.data.post_approval_label && n.data.post_approval_label === "REQUEST_UPDATE" && !n.is_snooze && n.data && n.data.is_close === 0) snooze.push(data);
          else toast.isActive(elemId) && toast.dismiss(elemId);
        } else if (n.type === "PST_CMT_REJCT_APPRVL") {
          if (n.data && n.data.is_close === 1 && toast.isActive(elemId)) toast.dismiss(elemId);
          else if (!hasCommentRejectApproval(n) && n.data.post_approval_label && n.data.post_approval_label === "REQUEST_UPDATE" && !n.is_snooze && n.data && n.data.is_close === 0) snooze.push(data);
          else toast.isActive(elemId) && toast.dismiss(elemId);
        } else if (n.type === "POST_COMMENT") {
          // if (
          //   n.data.post_approval_label &&
          //   n.data.post_approval_label === "NEED_ACTION" &&
          //   n.data.comment_body &&
          //   !n.data.comment_body.startsWith("COMMENT_APPROVAL::") &&
          //   n.data.users_approval.some((u) => user.id === u.id && !u.is_approved && u.ip_address === null) &&
          //   !n.is_snooze
          // )
          //   snooze.push(data);
          // else toast.isActive(elemId) && toast.dismiss(elemId);
        }
      } else if (type === "todo") {
        n.status !== "DONE" && !n.is_snooze ? snooze.push(data) : toast.isActive(elemId) && toast.dismiss(elemId);
      } else if (type === "huddle") {
        !isWeekend && !answeredChannels.includes(n.channel.id) && huddleClean(n) && !n.is_snooze ? snooze.push(data) : toast.isActive(elemId) && toast.dismiss(elemId);
      }
    });
    return snooze;
  };

  const unSnoozeMe = (type, items) => {
    const currentTimestamp = Math.round(+new Date() / 1000);
    const actions = type === "notification" ? notifActions : type === "todo" ? todoActions : huddleActions;
    let counter = 0;
    items.map((n) => {
      const snoozedTime = n.snooze_time + snoozeCycle * 60;
      if (type === "notification") {
        if (n.is_snooze && n.snooze_time && currentTimestamp > snoozedTime) {
          counter++;
          snoozeActions.snoozeNotif({ notification_id: n.id, is_snooze: false, type: "POST_SNOOZE" });
          actions.snooze({ id: n.id, is_snooze: false, snooze_time: null, type: "POST_SNOOZE" });
        }
      } else if (type === "todo") {
        if (n.status !== "DONE" && n.is_snooze && n.snooze_time && currentTimestamp > snoozedTime) {
          counter++;
          snoozeActions.snoozeNotif({ notification_id: n.id, is_snooze: false, type: "REMINDER_SNOOZE" });
          actions.snooze({ id: n.id, is_snooze: false, snooze_time: null, type: "REMINDER_SNOOZE" });
        }
      } else if (type === "huddle") {
        if (n.is_snooze && n.snooze_time && currentTimestamp > snoozedTime) {
          counter++;
          snoozeActions.snoozeNotif({ notification_id: n.id, is_snooze: false, type: "HUDDLE_SNOOZE" });
          actions.snooze({ id: n.id, is_snooze: false, snooze_time: null, type: "HUDDLE_SNOOZE" });
        }
      }
    });
    return counter;
  };

  const putToSnooze = () => {
    const items = [];
    let reminders = [],
      notifs = [],
      huddles = [];

    reminders = processItems("todo", todoCLean());
    notifs = processItems("notification", notifCLean());
    huddles = processItems("huddle", huddleBots);

    const snooze = items.concat(reminders, notifs, huddles);
    snooze.length ? snoozeOpen(snooze) : toast.dismiss("btnSnoozeAll");
  };

  //interval for all snoozed items
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     if (Object.keys(channels).length > 0 && users) {
  //       console.log("trigger interval");
  //       const todos = unSnoozeMe("todo", todoCLean());
  //       const notis = unSnoozeMe("notification", notifCLean());
  //       const huddles = unSnoozeMe("huddle", huddleBots);
  //       toast.info(<span dangerouslySetInnerHTML={{ __html: `interval for all snoozed items ${snoozeCycle} mins` }} />, { containerId: "toastA", toastId: "xxy" });
  //       if (todos === 0 && notis === 0 && huddles === 0) putToSnooze();
  //     }
  //     //}, 1000 * 10);
  //   }, 1000 * 60 * snoozeCycle);
  //   return () => {
  //     console.log("clear interval");
  //     clearInterval(interval);
  //   };
  // }, [notifications, todos, huddleBots]);

  useEffect(() => {
    const interval = setInterval(() => {
      //console.log("trigger interval");
      setTriggerUnsnooze(true);
    }, 1000 * 60);
    if (todos.today.hasMore) {
      todoActions.fetchToday({
        skip: todos.today.skip,
        limit: todos.today.limit,
        filter: "today",
      });
    }
    return () => {
      //console.log("clear interval");
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (triggerUnsnooze) {
      setTriggerUnsnooze(false);
      const todos = unSnoozeMe("todo", todoCLean());
      const notis = unSnoozeMe("notification", notifCLean());
      const huddles = unSnoozeMe("huddle", huddleBots);
      if (todos === 0 && notis === 0 && huddles === 0) putToSnooze();
    }
  }, [triggerUnsnooze, notifications, todos, huddleBots]);

  //handler for all non-snoozed items
  useEffect(() => {
    if (Object.keys(channels).length > 0 && huddleBotsLoaded) {
      putToSnooze();
    }
  }, [notifications, todos, huddleBots, huddleBotsLoaded, sharedWs]);

  const currentDay = currentDate.getDay();

  const renderCount = useRef(0);

  useEffect(() => {
    renderCount.current++;
    if (renderCount.current > 1) {
      localStorage.removeItem("huddle");
      localStorage.removeItem("huddleNotif");
      localStorage.removeItem("reminderNotif");
      dispatch(clearHuddleAnswers());
    }
  }, [currentDay]);

  useEffect(() => {
    const date = new Date();
    const today = date.getDay();
    const huddleStorage = localStorage.getItem("huddle");
    //setCurrentTime(currentDate.getTime());
    if (huddleStorage) {
      const { day } = JSON.parse(huddleStorage);
      if (day !== today || today === 0 || today === 6) {
        localStorage.removeItem("huddle");
        dispatch(clearHuddleAnswers());
      }
    }
    setTriggerUnsnooze(true);
  }, []);

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
        //closeButton={snoozeMeButton}
        closeButton={false}
        style={{ zIndex: 999 }}
      />
    </Wrapper>
  );
};
export default MainSnooze;
