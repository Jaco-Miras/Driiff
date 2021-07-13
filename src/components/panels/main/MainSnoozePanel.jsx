import React, { useEffect } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { replaceChar, stripHtml } from "../../../helpers/stringFormatter";
import { useNotificationActions, useNotifications, useRedirect, useTranslationActions, useSettings, useTimeFormat, useTodos, useTodoActions } from "../../hooks";
import { Avatar, SvgIconFeather } from "../../common";
import { ToastContainer, toast, Slide } from "react-toastify";


const Wrapper = styled.div`
.snooze-container {}
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
  const { getReminders, items } = useTodos();
  const todos = useSelector((state) => state.global.todos);
  //const toaster = useToaster();
  const user = useSelector((state) => state.session.user);
  const { _t } = useTranslationActions();
  const { fromNow } = useTimeFormat();
  const notifActions = useNotificationActions();
  const todoActions = useTodoActions();
  const { generalSettings: { dark_mode }, } = useSettings();
  const redirect = useRedirect();

  const dictionary = {
    notificationMention: _t("SNOOZE.MENTION", `mentioned you in`),
    todoReminder: _t("SNOOZE.REMINDER", `A friendly automated reminder`),
  };

  const notifCLean = () => {
    return Object.values(notifications).filter(n => n.type === 'POST_MENTION').sort((a, b) => b.created_at.timestamp - a.created_at.timestamp);;
  }

  const todoCLean = () => {
    const todos = getReminders({ filter: { status: '', search: '' } });
    return todos;
    //return todos.filter((i) => i.status !== "DONE");
  }

  const handleRedirect = (n, closeToast, e) => {
    e.preventDefault();
    if (n.is_read === 0) {
      notifActions.read({ id: n.id });
    }
    if (n.type === "NEW_TODO") {
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
    //closeToast();
    notifActions.snooze({ id: n.id, is_snooze: false });
  };

  const getMustText = (data) => {
    if (data.must_read) return dictionary.mustRead;
    if (data.must_reply) return dictionary.needsReply;
    return null;
  };

  const snoozeMeButton = ({ closeToast }) => (
    <span className="snooze-me" onClick={closeToast}>Snooze</span>
  );

  const handleSnoozeAll = (e) => {
    e.preventDefault();
    toast.clearWaitingQueue({ containerId: "toastS" });
    toast.dismiss();
    notifActions.snoozeAll({ is_snooze: true });
    todoActions.snoozeAll({ is_snooze: true });
  }

  const renderContent = (type, n) => {
    const actions = n[0] === 'mention' ? notifActions : todoActions;
    if (type === 'mention') {
      if (n.type === "POST_MENTION") {
        return (
          <>
            <div style={{ lineHeight: '1' }}>
              {n.author.name + " " + dictionary.notificationMention}
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
      }
    } else {
      return (
        <>
          <div style={{ lineHeight: '1' }}>
            {dictionary.todoReminder}
          </div>
          <p style={{ color: '#000' }}> {stripHtml(n.title)}</p>
        </>
      );
    }
    return null;
  };

  const snoozeContent = (type, n, closeToast) => {
    return (<NotifWrapper className="timeline-item timeline-item-no-line d-flex" isRead={n.is_read} darkMode={null} onClick={(e) => handleRedirect(n, closeToast, e)}>
      <div>
        {type === 'mention' ? n.author ? (
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
      toast(<span className="snooze-all" onClick={(e) => handleSnoozeAll(e)}>Snooze All</span>, {
        className: 'snooze-all-container',
        bodyClassName: "snooze-all-body",
        containerId: 'toastS',
        toastId: 'sn',
        closeButton: false,
      });
      snooze.map((n, i) => {
        var actions = n[3] === 'mention' ? notifActions : todoActions;
        toast(n[1], {
          className: 'snooze-container',
          bodyClassName: "snooze-body",
          containerId: 'toastS',
          toastId: n[2],
          onClose: () => actions.snooze({ id: n[0], is_snooze: true })
        });
      });
    }
  }

  const processSnooze = () => {
    const snooze = [];
    //if (snooze.length) {
    if (unreadNotifications) {
      const notifs = notifCLean();
      notifs.map((n) => {
        let elemId = 'smen-' + n.id;
        if (!n.is_read && !n.is_snooze)
          snooze.push([n.id, ({ closeToast }) => snoozeContent('mention', n, closeToast), elemId, 'mention'])
        else toast.isActive(elemId) && toast.dismiss(elemId);
      });
    }

    const todos = todoCLean();
    todos.map((n) => {
      let elemId = 'stod-' + n.id;
      if (n.status !== "DONE" && !n.is_snooze)
        snooze.push([n.id, ({ closeToast }) => snoozeContent('todo', n, closeToast), elemId, 'todo'])
      else
        toast.isActive(elemId) && toast.dismiss(elemId);
    });

    snooze.length ? snoozeOpen(snooze) : toast.dismiss();
    //} else {
    // toast.dismiss();
    // }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const snooze = [];
      if (unreadNotifications > 0) {
        const notif = notifCLean();
        notif.map((n) => {
          let elemId = 'smen-' + n.id;
          if (!n.is_read && n.is_snooze)
            snooze.push([n.id, ({ closeToast }) => snoozeContent('mention', n, closeToast), elemId, 'mention']);
        });
      }

      const todos = todoCLean();
      todos.map((n) => {
        let elemId = 'stod-' + n.id;
        if (n.status !== "DONE" && n.is_snooze)
          snooze.push([n.id, ({ closeToast }) => snoozeContent('todo', n, closeToast), elemId, 'todo']);
      });

      snoozeOpen(snooze);
      todoActions.snoozeAll({ is_snooze: false });
      notifActions.snoozeAll({ is_snooze: false });

    }, 15000);
    return () => clearInterval(interval);
  }, [notifications, todos]);

  useEffect(() => {
    !notificationSnooze && !todos.is_snooze && processSnooze();
  }, [notifications, todos]);

  return (
    <Wrapper>
      <ToastContainer enableMultiContainer containerId={'toastS'} position="bottom-left" autoClose={false} newestOnTop={false}
        closeOnClick={false} rtl={false} pauseOnFocusLoss={false} draggable={false} limit={6} closeButton={snoozeMeButton}
      />
    </Wrapper>
  );
};
export default MainSnooze;