import React, { useEffect } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { replaceChar, stripHtml } from "../../../helpers/stringFormatter";
import { useNotificationActions, useNotifications, useRedirect, useTranslationActions, useSettings, useTimeFormat } from "../../hooks";
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
  const { notifications, unreadNotifications, is_snooze } = useNotifications();
  //const toaster = useToaster();
  const user = useSelector((state) => state.session.user);
  const { _t } = useTranslationActions();
  const { fromNow } = useTimeFormat();
  const actions = useNotificationActions();
  const { generalSettings: { dark_mode }, } = useSettings();
  const redirect = useRedirect();

  const dictionary = {
    notificationNewPost: _t("SNOOZE.NEW_POST", `shared a post in`),
    notificationComment: _t("SNOOZE.COMMENT", `made a comment in`),
    notificationMention: _t("SNOOZE.MENTION", `mentioned you in`),
    hasAcceptedProposal: _t("POST.HAS_ACCEPTED_PROPOSAL", "has accepted the proposal."),
    hasRequestedChange: _t("POST.HAS_REQUESTED_CHANGE", "has requested a change."),
    sentProposal: _t("POST.SENT_PROPOSAL", "sent a proposal."),
    notificationClosedPost: _t("SNOOZE.CLOSED_POST", `closed the post`),
    addedYouInWorkspace: _t("SNOOZE.WORKSPACE_ADDED_MEMBER", "added you in a workspace"),
    reminder: _t("SNOOZE.REMINDER_ICON", "Reminder"),
    mustRead: _t("SNOOZE.MUST_READ", "Must read"),
    needsReply: _t("SNOOZE.NEEDS_REPLY", "Needs reply"),
    markAsRead: _t("SNOOZE.MARK_AS_READ", "Mark as read"),
    markAsUnread: _t("SNOOZE.MARK_AS_UNREAD", "Mark as unread"),
  };

  const handleRedirect = (n, closeToast, e) => {
    e.preventDefault();
    if (n.is_read === 0) {
      actions.read({ id: n.id });
    }
    if (n.type === "NEW_TODO") {
      redirect.toTodos();
    } else if (n.type === "WORKSPACE_ADD_MEMBER") {
      let payload = {
        id: n.data.id,
        name: n.data.title,
        folder_id: n.data.workspace_folder_id !== 0 ? n.data.workspace_folder_id : null,
        folder_name: n.data.workspace_folder_name !== "" ? n.data.workspace_folder_name : null,
      };
      redirect.toWorkspace(payload);
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
    actions.snooze({ id: n.id, is_snooze: false }) ;
  };

  const renderContent = (n) => {
    switch (n.type) {
      case "POST_MENTION": {
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
      case "NEW_TODO": {
        return (
          <>
            <div style={{ lineHeight: '1' }}>
              {_t("SNOOZE.REMINDER", "You asked to be reminded about ::title::", { title: n.data.title })}
            </div>
          </>
        );
      }
      case "POST_ACCEPT_APPROVAL": {
        return (
          <>
            <div style={{ lineHeight: '1' }}>
              {n.author.name} {dictionary.hasAcceptedProposal}
            </div>
          </>
        );
      }
      case "POST_REJECT_APPROVAL": {
        return (
          <>
            <div style={{ lineHeight: '1' }}>
              {n.author.name} {dictionary.hasRequestedChange}
            </div>
          </>
        );
      }
      case "POST_REQST_APPROVAL": {
        return (
          <>
            <div style={{ lineHeight: '1' }}>
              {n.author.name} {dictionary.sentProposal}
            </div>
          </>
        );
      }
      default:
        return null;
    }
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
    actions.snoozeAll({ is_snooze: true });
  }
  const snoozeContent = (n, closeToast) => {
    return (<NotifWrapper className="timeline-item timeline-item-no-line d-flex" isRead={n.is_read} darkMode={null} onClick={(e) => handleRedirect(n, closeToast, e)}>
      <div>
        {n.author ? (
          <Avatar
            id={n.author.id}
            name={n.author.name}
            imageLink={n.author.profile_image_thumbnail_link ? n.author.profile_image_thumbnail_link : n.author.profile_image_link}
            showSlider={true}
          />
        ) : (
          <Avatar id={user.id} name={user.name} imageLink={user.profile_image_thumbnail_link ? user.profile_image_thumbnail_link : user.profile_image_link} showSlider={true} />
        )}
      </div>
      <div style={{ display: 'inline-block', marginTop: '4px' }}>
        {renderContent(n)}
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
        toast(n[1], {
          className: 'snooze-container',
          bodyClassName: "snooze-body",
          containerId: 'toastS',
          toastId: 'sn-' + n[0],
          onClose: () => actions.snooze({ id: n[0], is_snooze: true }) 
        });
      });
    }
  }

  const notifCLean = () => {
    return Object.values(notifications).filter(n => n.type === 'POST_MENTION' || n.type === 'NEW_TODO' || n.type === 'POST_ACCEPT_APPROVAL' || n.type === 'POST_REJECT_APPROVAL' || n.type === 'POST_REQST_APPROVAL').sort((a, b) => b.created_at.timestamp - a.created_at.timestamp);;
  }

  const processSnooze = () => {
    const snooze = [];
    if (unreadNotifications > 0) {
      const notif = notifCLean();
      notif.map((n) => {
        if (!n.is_read) {
          snooze.push([n.id, ({ closeToast }) => snoozeContent(n, closeToast)]);
        } else {
          if (toast.isActive('sn-' + n.id)) {
            toast.dismiss('sn-' + n.id);
          }
        }
      });
      snooze.length ? snoozeOpen(snooze) : toast.dismiss();
    } else {
      toast.dismiss();
    }
  };

  
  useEffect(() => {
    const interval = setInterval(() => {
      const snooze = [];
      if (unreadNotifications > 0) {
        const notif = notifCLean();
        notif.map((n) => {
          if (!n.is_read && n.is_snooze) {
            snooze.push([n.id, ({ closeToast }) => snoozeContent(n, closeToast)]);
          }
        });
        snoozeOpen(snooze);
        actions.snoozeAll({ is_snooze: false });
      }
    },5000);
    return () => clearInterval(interval);
  }, [notifications]);

  useEffect(() => {
    !is_snooze && processSnooze();
  }, [notifications]);

  return (
    <Wrapper>
      <ToastContainer enableMultiContainer containerId={'toastS'} position="bottom-left" autoClose={false} newestOnTop={false}
        closeOnClick={false} rtl={false} pauseOnFocusLoss={false} draggable={false} limit={3} closeButton={snoozeMeButton}
      />
    </Wrapper>
  );
};
export default MainSnooze;