import React, { useEffect } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { replaceChar, stripHtml } from "../../../helpers/stringFormatter";
import { useNotificationActions, useNotifications, useRedirect, useTranslationActions, useSettings, useTimeFormat, useTodos, useTodoActions } from "../../hooks";
import { Avatar, SvgIconFeather } from "../../common";
import { ToastContainer, toast, Slide } from "react-toastify";
import { getTimestampInMins } from "../../../helpers/dateFormatter";

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

  const onSnooze = [];
  const dictionary = {
    notificationMention: _t("SNOOZE.MENTION", "mentioned you in ::title::", { title: "" }),
    todoReminder: _t("SNOOZE.REMINDER", `A friendly automated reminder`),
    sentProposal: _t("SNOOZE.SENT_PROPOSAL", "sent a proposal."),
    notificationNewPost: _t("SNOOZE.NEW_POST", `shared a post`),
    mustRead: _t("SNOOZE.MUST_READ", "Must read"),
    needsReply: _t("SNOOZE.NEEDS_REPLY", "Needs reply"),
    hasRequestedChange: _t("SNOOZE.HAS_REQUESTED_CHANGE", "has requested a change."),
  };

  const notifCLean = () => {
    return Object.values(notifications).filter(n => (n.type === 'POST_MENTION'
      || n.type === 'POST_REQST_APPROVAL'
      || n.type === 'POST_REJECT_APPROVAL'
      ||
      (n.type === 'POST_CREATE' && (n.data.must_read || n.data.must_reply)))).sort((a, b) => b.created_at.timestamp - a.created_at.timestamp);
  }

  const todoCLean = () => {
    var inMins = getTimestampInMins(50);
    const todos = getReminders({ filter: { status: '', search: '' } });
    return todos.filter((t) => t.assigned_to && t.assigned_to.id === user.id && t.remind_at && t.remind_at.timestamp <= inMins && t.status !== "OVERDUE");
  }

  const handleRedirect = (n, type, closeToast, e) => {
    var actions = type === 'notification' ? notifActions : todoActions;
    e.preventDefault();
    if (n.is_read === 0) {
      notifActions.read({ id: n.id });
    }
    if (n.type === "NEW_TODO" || type === 'todo') {
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

  const snoozeMeButton = ({ closeToast }) => (
    <span className="snooze-me" onClick={closeToast}>Snooze</span>
  );

  const handleSnoozeAll = (e) => {
    e.preventDefault();
    notifActions.snoozeAll({ is_snooze: true });
    todoActions.snoozeAll({ is_snooze: true });
    toast.clearWaitingQueue({ containerId: "toastS" });
    toast.dismiss();
  }

  const getMustReadText = (data) => {
    if ((data.must_read && data.required_users && data.required_users.some((u) => u.id === user.id && !u.must_read)) || (data.must_read_users && data.must_read_users.some((u) => u.id === user.id && !u.must_read)))
      return dictionary.mustRead;
    return null;
  };


  const getMustReplyText = (data) => {
    if ((data.must_reply && data.required_users && data.required_users.some((u) => u.id === user.id && !u.must_reply)) || (data.must_reply_users && data.must_reply_users.some((u) => u.id === user.id && !u.must_reply)))
      return dictionary.needsReply;
    return null;
  };

  const renderContent = (type, n) => {
    const actions = n[0] === 'notification' ? notifActions : todoActions;
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
            <p>
              {" "}
              <span className={"badge badge-danger text-white"}>{getMustReadText(n.data)}</span>
              <span className={"badge badge-success text-white"}>{getMustReplyText(n.data)}</span>
            </p>
          </>
        );
      }
      else if (n.type === "POST_REQST_APPROVAL") {
        return (
          <>
            <div style={{ lineHeight: '1' }}>
              {firstName}{" "} {dictionary.sentProposal}
            </div>
          </>
        );
      }
      else if (n.type === "POST_REJECT_APPROVAL") {
        return (
          <>
            <div style={{ lineHeight: '1' }}>
              {firstName}{" "} {dictionary.hasRequestedChange}
            </div>
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
      if (!toast.isActive('btnSnoozeAll'))
        toast(<span className="snooze-all" onClick={(e) => handleSnoozeAll(e)}>Snooze All</span>, {
          className: 'snooze-all-container',
          bodyClassName: "snooze-all-body",
          containerId: 'toastS',
          toastId: 'btnSnoozeAll',
          closeButton: false,
        });


      snooze.map((n, i) => {
        var actions = n[3] === 'notification' ? notifActions : todoActions;

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

  const processSnooze = (type, items, snoozed) => {
    const snooze = [];
    items.map((n) => {
      let elemId = type + '__' + n.id;
      let content = [n.id, ({ closeToast }) => snoozeContent(type, n, closeToast), elemId, type, (n.snooze_time) ? n.snooze_time : n.created_at.timestamp];
      if (type === 'notification') {
        snoozed && !n.is_read && n.is_snooze ? snooze.push(content) : (!n.is_read && !n.is_snooze) ? snooze.push(content) : toast.isActive(elemId) && toast.dismiss(elemId);
      } else {
        snoozed && n.status !== "DONE" && n.is_snooze ? snooze.push(content) : (n.status !== "DONE" && !n.is_snooze) ? snooze.push(content) : toast.isActive(elemId) && toast.dismiss(elemId);
      }
    });
    return snooze;
  };

  //interval for all snoozed items
  useEffect(() => {
    const interval = setInterval(() => {
      const items = processSnooze('notification', notifCLean(), true);
      notifActions.snoozeAll({ is_snooze: false });

      const snooze = items.concat(processSnooze('todo', todoCLean(), true));
      todoActions.snoozeAll({ is_snooze: false });

      snooze.length ? snoozeOpen(snooze.sort((a, b) => a[4] - b[4])) : toast.dismiss();
    }, 1000 * 60 * 60);
    return () => clearInterval(interval);
  }, [notifications, todos]);

  //interval for all expiring todos
  useEffect(() => {
    const interval = setInterval(() => {
      if (!todos.is_snooze) {
        const snooze = processSnooze('todo', todoCLean(), false);
        snoozeOpen(snooze.sort((a, b) => a[4] - b[4]));
      }
    }, 15000);
    return () => clearInterval(interval);
  }, [todos]);

  //handler for all non-snoozed items
  useEffect(() => {
    if (!notificationSnooze && !todos.is_snooze) {
      console.log(notifCLean());
      const items = processSnooze('notification', notifCLean(), false);
      const snooze = items.concat(processSnooze('todo', todoCLean(), false));

      snooze.length ? snoozeOpen(snooze.sort((a, b) => b[4] - a[4]).slice(0, 5)) : toast.dismiss();
    }
  }, [notifications, todos]);

  return (
    <Wrapper>
      <ToastContainer enableMultiContainer containerId={'toastS'} position="bottom-left" autoClose={false} newestOnTop={false}
        closeOnClick={false} rtl={false} pauseOnFocusLoss={false} draggable={false} limit={5} closeButton={snoozeMeButton}
      />
    </Wrapper>
  );
};
export default MainSnooze;