import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { stripHtml } from "../../../helpers/stringFormatter";
import {
  useNotificationActions, useNotifications, useRedirect, useTranslationActions,
  useSettings, useTimeFormat, useTodos, useTodoActions, useHuddleChatbot
} from "../../hooks";
import { Avatar, SvgIconFeather } from "../../common";
import { ToastContainer, toast, Slide } from "react-toastify";
import { getTimestampInMins } from "../../../helpers/dateFormatter";
import NotificationBadge from "../../list/notification/item/NotificationBadge";
import { setSelectedChannel, clearHuddleAnswers, adjustHuddleDate, clearHasUnpiblishedAnswers } from "../../../redux/actions/chatActions";
const Wrapper = styled.div`
.snooze-container {margin-bottom:8px !important;}
.snooze-container .snooze-body {}
.snooze-container .snooze-me {font-size: 12px; margin:0 5px; text-decoration: underline;}
.snooze-all-container {background: transparent;
  box-shadow: none;
  margin: 0;
  padding: 0;
  height: auto;
  min-height: 25px;}
.snooze-all-container .snooze-all-body {height: auto; font-size: 12px; margin:0 5px; text-decoration: underline;}
.robotAvatar {margin-right : 1rem; height: 2.7rem; width: 2.7rem }
.robotAvatar div { background: #F1F2F7; border-radius: 40px; font-size: 25px; text-align: center; width: 100%; height: 100%;}
`;

const Icon = styled(SvgIconFeather)`
  width: 12px;
  height:12px;
`;

const IconSnooze = styled(SvgIconFeather)`
width: 16px;  height:16px;`;

const NotifWrapper = styled.div`
  cursor: pointer;
  display: flex;
  font-family: Inter;
  letter-spacing: 0;
  font-size: 12px;
  .avatar {
    margin-right: 1rem;
    height: 2.7rem;
    width: 2.7rem;
  }
  p {
    margin: 0;
  }
`;

const MainSnooze = (props) => {
  const { notifications, unreadNotifications, notificationSnooze } = useNotifications();
  const { getReminders, items } = useTodos(true);
  const todos = useSelector((state) => state.global.todos);
  //const toaster = useToaster();
  const user = useSelector((state) => state.session.user);
  const { _t } = useTranslationActions();
  const { fromNow } = useTimeFormat();
  const notifActions = useNotificationActions();
  const todoActions = useTodoActions();
  const { generalSettings: { dark_mode }, } = useSettings();
  const redirect = useRedirect();

  const [toggleInterval, setToggleInterval] = useState(true);
  const huddleActions = useHuddleChatbot();
  const history = useHistory();

  const currentDate = new Date();
  const currentTime = currentDate.getTime();
  const dispatch = useDispatch();

  const selectedChannel = useSelector((state) => state.chat.selectedChannel);

  const hasUnpublishedAnswers = useSelector((state) => state.chat.hasUnpublishedAnswers);
  const huddleBots = useSelector((state) => state.chat.huddleBots);
  const weekDays = [
    { day: "M", value: 1 },
    { day: "T", value: 2 },
    { day: "W", value: 3 },
    { day: "TH", value: 4 },
    { day: "F", value: 5 },
  ];

  const dictionary = {
    notificationMention: _t("SNOOZE.MENTION", "mentioned you in ::title::", { title: "" }),
    todoReminder: _t("SNOOZE.REMINDER", `A friendly automated reminder`),
    sentProposal: _t("SNOOZE.SENT_PROPOSAL", "sent a proposal."),
    notificationNewPost: _t("SNOOZE.NEW_POST", `shared a post`),
    mustRead: _t("SNOOZE.MUST_READ", "Must read"),
    needsReply: _t("SNOOZE.NEEDS_REPLY", "Needs reply"),
    hasRequestedChange: _t("SNOOZE.HAS_REQUESTED_CHANGE", "has requested a change."),
    snoozeAll: _t("SNOOZE.SNOOZE_ALL", "Snoozed for 60 mins"),
    actionNeeded: _t("SNOOZE.ACTION_NEEDED", "Action needed"),
    changeRequested: _t("SNOOZE.CHANGE_REQUESTED", "Change requested"),
  };

  const notifCLean = () => {
    return Object.values(notifications).filter(n => (n.type === 'POST_MENTION'
      || n.type === 'POST_REQST_APPROVAL'
      || n.type === 'POST_REJECT_APPROVAL'
    )).sort((a, b) => b.created_at.timestamp - a.created_at.timestamp);
  }

  const todoCLean = () => {
    var inMins = getTimestampInMins(50);
    const todos = getReminders({ filter: { status: '', search: '' } });
    return todos.filter((t) => t.assigned_to && t.assigned_to.id === user.id && t.remind_at && t.remind_at.timestamp <= inMins && t.status !== "OVERDUE");
  }

  const huddleClean = () => {
    return huddleBots.find((h) => {
      if (h.questions.filter((q) => q.answer === null).length > 0) {
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
        if (selectedChannel && h.channel.id !== selectedChannel.id && inTimeRange) {
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
      } else {
        return false;
      }
    });
  }

  const handleRedirect = (n, type, closeToast, e) => {
    var actions = type === 'notification' ? notifActions : n[3] === 'todo' ? todoActions : huddleActions;
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

  const snoozeMeButton = ({ closeToast }) => (
    <span className="snooze-me" onClick={closeToast}>Snooze</span>
  );

  const handleSnoozeAll = (items, e) => {
    e.preventDefault();
    notifActions.snoozeAll({ is_snooze: true });
    todoActions.snoozeAll({ is_snooze: true });
    toast.clearWaitingQueue({ containerId: "toastS" });
    toast.success(<span dangerouslySetInnerHTML={{ __html: dictionary.snoozeAll }} />, { containerId: "toastA" });

  }

  const renderContent = (type, n) => {
    const actions = n[0] === 'notification' ? notifActions : n[3] === 'todo' ? todoActions : huddleActions;
    if (type === 'notification') {
      var name = n.author.name;
      var firstName = name.split(' ').slice(0, -1).join(' ');
      if (n.type === "POST_MENTION") {
        return (
          <>
            <div style={{ lineHeight: '1' }}>
              {firstName} {" "}  {dictionary.notificationMention}   {" "} {n.data.title} {" "}
              {n.data.workspaces && n.data.workspaces.length > 0 && n.data.workspaces[0].workspace_name && (
                <>
                  <Icon icon="folder" /> {" "}
                  {n.data.workspaces[0].workspace_name}
                </>
              )}
            </div>
            <p style={{ color: '#000' }}> {stripHtml(n.data.comment_body)}</p>
          </>
        );
      } else if (n.type === "POST_CREATE") {
        return (
          <>
            <div style={{ lineHeight: '1' }}>
              {firstName} {" "} {dictionary.notificationNewPost} {" "}
              {n.data.workspaces && n.data.workspaces.length > 0 && n.data.workspaces[0].workspace_name && (
                <>
                  <Icon icon="folder" /> {" "}
                  {n.data.workspaces[0].workspace_name}
                </>
              )}
            </div>
            <p style={{ color: '#000' }}> {stripHtml(n.data.title)}</p>
            <NotificationBadge notification={n} dictionary={dictionary} user={user} />
          </>
        );
      }
      else if (n.type === "POST_REQST_APPROVAL") {
        return (
          <>
            <div style={{ lineHeight: '1' }}>
              {firstName}{" "} {dictionary.sentProposal}
            </div>
            <NotificationBadge notification={n} dictionary={dictionary} user={user} />
          </>
        );
      }
      else if (n.type === "POST_REJECT_APPROVAL") {
        return (
          <>
            <div style={{ lineHeight: '1' }}>
              {firstName}{" "} {dictionary.hasRequestedChange}
            </div>
            <NotificationBadge notification={n} dictionary={dictionary} user={user} />
          </>
        );
      }
    } else if (type === 'todo') {
      return (
        <>
          <div style={{ lineHeight: '1' }}>
            {dictionary.todoReminder}
          </div>
          <p style={{ color: '#000' }}> {stripHtml(n.title)}</p>
        </>
      );
    } else {
      return (
        <>
          <div style={{ lineHeight: '1' }}>
            {""}
          </div>
          <p style={{ color: '#000' }}> {stripHtml(`Huddle time at ${n.channel.name}`)}</p>
        </>
      );
    }
    return null;
  };

  const snoozeContent = (type, n, closeToast) => {
    return (<NotifWrapper className="timeline-item timeline-item-no-line d-flex" isRead={n.is_read} darkMode={null} onClick={(e) => handleRedirect(n, type, closeToast, e)}>
      <div>
        {type === 'notification' ? n.author ? (
          <Avatar
            id={n.author.id}
            name={n.author.name}
            imageLink={n.author.profile_image_thumbnail_link ? n.author.profile_image_thumbnail_link : n.author.profile_image_link}
            showSlider={false}
          />
        ) : (
          <Avatar id={user.id} name={user.name} imageLink={user.profile_image_thumbnail_link ? user.profile_image_thumbnail_link : user.profile_image_link} showSlider={false} />
        ) : <div className="robotAvatar" ><div>🤖</div></div>}
      </div>
      <div style={{ display: 'inline-block', marginTop: '4px' }}>
        {renderContent(type, n)}
      </div>
    </NotifWrapper>);
  };

  const snoozeOpen = (snooze) => {
    if (snooze.length > 0) {
      const count = snooze.length;
      if (!toast.isActive('btnSnoozeAll'))
        toast(<span className="snooze-all" onClick={(e) => handleSnoozeAll(snooze, e)}>Snooze All {count > 4 && count} {" "} Notifications</span>, {
          className: 'snooze-all-container',
          bodyClassName: "snooze-all-body",
          containerId: 'toastS',
          toastId: 'btnSnoozeAll',
          closeButton: false,
        });
      else {
        toast.update('btnSnoozeAll', {
          render: () => <span className="snooze-all" onClick={(e) => handleSnoozeAll(snooze, e)}>Snooze All {count > 4 && count} {" "} Notifications</span>,
          containerId: 'toastS',
        });
      }

      snooze.slice(0, 4).map((n, i) => {
        var actions = n[3] === 'notification' ? notifActions : n[3] === 'todo' ? todoActions : huddleActions;
        toast(n[1], {
          className: 'snooze-container',
          bodyClassName: "snooze-body",
          containerId: 'toastS',
          toastId: n[2],
          onClose: () => n[3] === 'huddle' ? actions.skipHuddle({
            channel_id: n.channel.id,
            huddle_id: n.id,
            body: `HUDDLE_SKIP::${JSON.stringify({
              huddle_id: n.id,
              author: {
                name: user.name,
                first_name: user.first_name,
                id: user.id,
                profile_image_link: user.profile_image_link,
              },
              user_bot: n.user_bot,
            })}`,
          }) : actions.snooze({ id: n[0], is_snooze: true })
        });
      });
    } else {
      toast.dismiss('btnSnoozeAll');
    }
  }

  const processSnooze = (type, items, snoozed) => {

    const snooze = [];
    items.map((n) => {
      let elemId = type + '__' + n.id;
      let content = [n.id, ({ closeToast }) => snoozeContent(type, n, closeToast), elemId, type, (n.snooze_time) ? n.snooze_time : n.created_at.timestamp];
      if (type === 'notification') {
        snoozed && !n.is_read && n.is_snooze ? snooze.push(content) : (!n.is_read && !n.is_snooze) ? snooze.push(content) : toast.isActive(elemId) && toast.dismiss(elemId);
      } else if (type === 'todo') {
        snoozed && n.status !== "DONE" && n.is_snooze ? snooze.push(content) : (n.status !== "DONE" && !n.is_snooze) ? snooze.push(content) : toast.isActive(elemId) && toast.dismiss(elemId);
      } else {
        snooze.push(content);
      }
    });
    return snooze;
  };

  //interval for all snoozed items
  useEffect(() => {
    const interval = setInterval(() => {
      const items = [];
      let todos = [];
      let notifs = [];
      let huddles = [];

      todos = processSnooze('todo', todoCLean(), true);
      notifs = processSnooze('notification', notifCLean(), true);

      const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6;
      const answeredChannels = [...hasUnpublishedAnswers];
      const huddle = huddleClean();
      const showToaster = huddle !== undefined && !answeredChannels.some((id) => huddle && huddle.channel.id === id) && !isWeekend;

      if (showToaster)
        huddles = processSnooze('notification', huddle, false);

      const snooze = items.concat(todos, notifs, huddles);
      snooze.length ? snoozeOpen(snooze) : toast.dismiss();

      notifActions.snoozeAll({ is_snooze: false });
      todoActions.snoozeAll({ is_snooze: false });

      const d = new Date();
      if (d.getDate() !== currentDate.getDate()) {
        dispatch(clearHuddleAnswers());
        dispatch(adjustHuddleDate());
        dispatch(clearHasUnpiblishedAnswers());
        clearInterval(interval);
        setToggleInterval((prevState) => !prevState);
      }

    }, 1000 * 60 * 60);
    return () => clearInterval(interval);
  }, [notifications, todos, toggleInterval]);

  //interval for all expiring todos
  useEffect(() => {
    const interval = setInterval(() => {
      if (!todos.is_snooze) {
        const snooze = processSnooze('todo', todoCLean(), false);
        snoozeOpen(snooze);
      }
    }, 15000);
    return () => clearInterval(interval);
  }, [todos]);

  //handler for all non-snoozed items
  useEffect(() => {

    const items = [];
    let todos = [], notifs = [], huddles = [];

    //if (!isSnoozedAll) {
    if (!notificationSnooze && !todos.is_snooze) {
      todos = processSnooze('todo', todoCLean(), false);
      notifs = processSnooze('notification', notifCLean(), false);
    }

    const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6;
    const answeredChannels = [...hasUnpublishedAnswers];
    const huddle = huddleClean();
    const showToaster = huddle !== undefined && !answeredChannels.some((id) => huddle && huddle.channel.id === id) && !isWeekend;
    if (showToaster)
      huddles = processSnooze('notification', huddle, false);

    const snooze = items.concat(todos, notifs, huddles);
    snoozeOpen(snooze);

  }, [notifications, todos, huddleBots]);

  return (
    <Wrapper>
      <ToastContainer enableMultiContainer containerId={'toastS'} position="bottom-left" autoClose={false} newestOnTop={false}
        closeOnClick={false} rtl={false} pauseOnFocusLoss={false} draggable={false} limit={5} closeButton={snoozeMeButton}
      />
    </Wrapper>
  );
};
export default MainSnooze;