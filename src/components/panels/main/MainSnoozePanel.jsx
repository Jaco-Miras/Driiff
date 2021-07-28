import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { stripHtml } from "../../../helpers/stringFormatter";
import {
  useNotificationActions, useNotifications, useRedirect, useTranslationActions,
  useSettings, useTodos, useTodoActions, useHuddleChatbot
} from "../../hooks";
import { Avatar, SvgIconFeather } from "../../common";
import { ToastContainer, toast, Slide } from "react-toastify";
import { getTimestampInMins } from "../../../helpers/dateFormatter";
import NotificationBadge from "../../list/notification/item/NotificationBadge";
import { setSelectedChannel} from "../../../redux/actions/chatActions";

import ChannelIcon from "../../list/chat/ChannelIcon";
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
  div.snooze-header {
    display: inline-block;
    width: 180px;
    white-space: nowrap;
    overflow: hidden !important;
    text-overflow: ellipsis;
    line-height: 1
  }
  p.snooze-body {
    display: inline-block;
    width: 180px;
    overflow: hidden !important;
    text-overflow: ellipsis;
    color: #000;
    line-height: 1
  }
  .chat-header-icon {padding:0px !important;}
`;

const MainSnooze = (props) => {
  const { notifications, notificationSnooze } = useNotifications();
  const { getReminders, items } = useTodos(true);
  const todos = useSelector((state) => state.global.todos);
  //const toaster = useToaster();
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

  const hasUnpublishedAnswers = useSelector((state) => state.chat.hasUnpublishedAnswers);
  const chats = useSelector((state) => state.chat);
  const huddleBots = chats.huddleBots;
  const channels = chats.channels;
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
    timeTOHuddle: _t("SNOOZE.TIME_TO_HUDDLE", "Time to huddle, "),
    hasRequestedChange: _t("SNOOZE.HAS_REQUESTED_CHANGE", "has requested a change."),
    snoozeAll: _t("SNOOZE.SNOOZE_ALL", "Snoozed for 60 mins"),
    actionNeeded: _t("SNOOZE.ACTION_NEEDED", "Action needed"),
    changeRequested: _t("SNOOZE.CHANGE_REQUESTED", "Change requested"),
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
    var inMins = getTimestampInMins(15);
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
  const handleRedirect = (n, type, closeToast, e) => {
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

  const snoozeMeButton = ({ closeToast }) => (
    <span className="snooze-me" onClick={(e) => {
      e.stopPropagation();
      closeToast();
    }}>Snooze</span>
  );

  const handleSnoozeAll = (a, e) => {
    e.preventDefault();
    notifActions.snoozeAll({ is_snooze: true });
    todoActions.snoozeAll({ is_snooze: true });
    huddleActions.snoozeAll({ is_snooze: true });

    //toast.clearWaitingQueue({ containerId: "toastS" });
    //toast.dismiss({ containerId: "toastS" });
    toast.success(<span dangerouslySetInnerHTML={{ __html: dictionary.snoozeAll }} />, { containerId: "toastA" });
  }

  const renderContent = (type, n) => {
    const actions = n.type === 'notification' ? notifActions : n.type === 'todo' ? todoActions : huddleActions;
    if (type === 'notification') {
      var name = n.author.name;
      var firstName = name.split(' ').slice(0, -1).join(' ');
      if (n.type === "POST_MENTION") {
        return (
          <>
            <div className="snooze-header ">
              {firstName} {" "}  {dictionary.notificationMention}   {" "} {n.data.title} {" "}
              {n.data.workspaces && n.data.workspaces.length > 0 && n.data.workspaces[0].workspace_name && (
                <>
                  <Icon icon="folder" /> {" "}
                  {n.data.workspaces[0].workspace_name}
                </>
              )}
            </div>
            <p className="snooze-body "> {stripHtml(n.data.comment_body)}</p>
          </>
        );
      } else if (n.type === "POST_CREATE") {
        return (
          <>
            <div className="snooze-header ">
              {firstName} {" "} {dictionary.notificationNewPost} {" "}
              {n.data.workspaces && n.data.workspaces.length > 0 && n.data.workspaces[0].workspace_name && (
                <>
                  <Icon icon="folder" /> {" "}
                  {n.data.workspaces[0].workspace_name}
                </>
              )}
            </div>
            <p className="snooze-body "> {stripHtml(n.data.title)}</p>
            <NotificationBadge notification={n} dictionary={dictionary} user={user} />
          </>
        );
      }
      else if (n.type === "POST_REQST_APPROVAL") {
        return (
          <>
            <div className="snooze-header ">
              {firstName}{" "} {dictionary.sentProposal}
            </div>
            <NotificationBadge notification={n} dictionary={dictionary} user={user} />
          </>
        );
      }
      else if (n.type === "POST_REJECT_APPROVAL") {
        return (
          <>
            <div className="snooze-header ">
              {firstName}{" "} {dictionary.hasRequestedChange}
            </div>
            <NotificationBadge notification={n} dictionary={dictionary} user={user} />
          </>
        );
      }
    } else if (type === 'todo') {
      return (
        <>
          <div className="snooze-header ">
            {dictionary.todoReminder}
          </div>
          <p className="snooze-body "> {stripHtml(n.title)}</p>
        </>
      );
    } else if (type === 'huddle') {
      return (
        <>
          <div className="snooze-header ">
            {dictionary.timeTOHuddle}{" "}{user.first_name}
          </div>
          <p className="snooze-body "> {stripHtml(`${n.introduction_message}`)}</p>
          <span className={"badge badge-info text-white"} onClick={(e) => {
            e.stopPropagation();
            huddleActions.skipHuddle({
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
            })
            // huddleActions.snoozeSkip({ id: n.id, is_skip: true });
            toast.dismiss(type + '__' + n.id);
          }}>Skip</span>
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
        ) :
          (
            <Avatar id={user.id} name={user.name} imageLink={user.profile_image_thumbnail_link ? user.profile_image_thumbnail_link : user.profile_image_link} showSlider={false} />
          ) : type === 'todo' ? (<div className="robotAvatar" ><div>🤖</div></div>) : (
            <ChannelIcon className="chat-header-icon" channel={channels[n.channel.id]} />
          )}
      </div>
      <div style={{ display: 'inline-block', marginTop: '1px' }}>
        {renderContent(type, n)}
      </div>
    </NotifWrapper>);
  };
  const snoozeOpen = (snooze) => {
    if (snooze.length > 0) {
      const count = snooze.length;
      const items = snooze.slice(0, 4);
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
      items.map((n) => {
        var actions = n.type === 'notification' ? notifActions : n.type === 'todo' ? todoActions : huddleActions;
        if (!toast.isActive(n.element))
          toast(n.content, {
            className: 'snooze-container',
            bodyClassName: "snooze-body",
            containerId: 'toastS',
            toastId: n.element,
            onClose: () => {
              if (n.type === 'notification' && notifications[n.id] && !notifications[n.id].is_read)
                actions.snooze({ id: n.id, is_snooze: true });
              else if (n.type === 'todo' && todos.items[n.id] && !todos.items[n.id].status !== "DONE")
                actions.snooze({ id: n.id, is_snooze: true });
              else if (n.type === 'huddle') {
                if (!huddleClean(n))
                  actions.snooze({ id: n.id, is_snooze: true });
              }
            }
          });
      });

    } else
      toast.dismiss('btnSnoozeAll');
  }

  const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6;
  const answeredChannels = [...hasUnpublishedAnswers];

  const processSnooze = (type, items, snoozed) => {
    const snooze = [];
    items.map((n) => {
      let elemId = type + '__' + n.id;
      if (type === 'notification') {
        let content = { 'id': n.id, 'content': ({ closeToast, toastProps }) => snoozeContent(type, n, closeToast, toastProps), 'element': elemId, 'type': type, 'snooze_time': (n.snooze_time) ? n.snooze_time : n.created_at.timestamp };
        snoozed && !n.is_read && n.is_snooze ? snooze.push(content) : (!n.is_read && !n.is_snooze) ? snooze.push(content) : toast.isActive(elemId) && toast.dismiss(elemId);
      } else if (type === 'todo') {
        let content = { 'id': n.id, 'content': ({ closeToast, toastProps }) => snoozeContent(type, n, closeToast, toastProps), 'element': elemId, 'type': type, 'snooze_time': (n.snooze_time) ? n.snooze_time : n.created_at.timestamp };
        snoozed && n.status !== "DONE" && n.is_snooze ? snooze.push(content) : (n.status !== "DONE" && !n.is_snooze) ? snooze.push(content) : toast.isActive(elemId) && toast.dismiss(elemId);
      }
      else if (type === 'huddle') {
        if (!isWeekend && !answeredChannels.includes(n.channel.id)) {
          let content = { 'id': n.id, 'content': ({ closeToast, toastProps }) => snoozeContent(type, n, closeToast, toastProps), 'element': elemId, 'type': type, 'snooze_time': (n.snooze_time) ? n.snooze_time : n.start_at.timestamp, 'huddle': n };
          if (snoozed && !huddleClean(n) && n.is_snooze)
            snooze.push(content);
          else if (!huddleClean(n) && !n.is_snooze)
            snooze.push(content);
          else
            toast.isActive(elemId) && toast.dismiss(elemId);
        } else
          toast.isActive(elemId) && toast.dismiss(elemId);
      }
    });

    return snooze;
  };

  const snoozeUs = (is_snoozed) => {
    const items = [];
    let todos = [], notifs = [], huddles = [];
    if (!notificationSnooze && !todos.is_snooze && !chats.is_snooze) {
      todos = processSnooze('todo', todoCLean(), is_snoozed);
      notifs = processSnooze('notification', notifCLean(), is_snoozed);
      huddles = processSnooze('huddle', huddleBots, is_snoozed);
    }
    const snooze = items.concat(todos, notifs, huddles);
    snooze.length ? snoozeOpen(snooze) : toast.dismiss('btnSnoozeAll');
  };
  //interval for all snoozed items
  useEffect(() => {
    const interval = setInterval(() => {
      notifActions.snoozeAll({ is_snooze: false });
      todoActions.snoozeAll({ is_snooze: false });
      huddleActions.snoozeAll({ is_snooze: false });
      if (chats.channels.length > 0)
        snoozeUs(true);
    }, 1000 * 60 * 60);
    return () => clearInterval(interval);
  }, [notifications, todos, huddleBots]);

  //interval for all expiring todos
  useEffect(() => {
    const interval = setInterval(() => {
      if (chats.channels.length > 0)
        snoozeUs(false);
    }, 1000 * 60 * 15);
    return () => clearInterval(interval);
  }, [todos]);

  //handler for all non-snoozed items
  useEffect(() => {
    if (chats.channels.length > 0)
      snoozeUs(false);
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