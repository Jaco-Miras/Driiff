import React, { useRef } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { useNotificationActions, useNotifications, useTranslationActions } from "../../hooks";
import { NotificationLists } from "../../list/notification/item";

const Wrapper = styled.div`
  .text-link {
    color: #828282;
    cursor: pointer;

    &:hover {
      color: #000;
    }
  }

  .notification-title-wrapper {
    background: ${(props) => props.theme.colors.primary};
    color: #fff;
  }
`;

const NotificationDropdown = (props) => {
  const { className = "", toggleDropdown } = props;

  const history = useHistory();
  const actions = useNotificationActions();
  const { notifications, unreadCount } = useNotifications(actions);

  const refs = {
    container: useRef(null),
  };

  const markAllRead = (e) => {
    actions.readAll({});
    removeOverlay(e);
  };

  const removeOverlay = (e) => {
    toggleDropdown(e);
  };

  const viewAll = (e) => {
    removeOverlay(e);
    history.push("/notifications");
  };

  const { _t } = useTranslationActions();

  const dictionary = {
    new: _t("NOTIFICATION.NEW", "New"),
    notifications: _t("NOTIFICATION.NOTIFICATIONS", "Notifications"),
    markAllAsRead: _t("NOTIFICATION.MARK_ALL_AS_READ", "Mark all as read"),
    viewAll: _t("NOTIFICATION.VIEW_ALL", "View all"),
    unreadNotifications: _t("NOTIFICATION.UNREAD_NOTIFICATIONS", "Unread notifications"),
    oldNotifications: _t("NOTIFICATION.OLD_NOTIFICATIONS", "Old notifications"),
    noNotificationsToShow: _t("NOTIFICATION.NO_NOTIFICATIONS_TO_SHOW", "There are no notifications to show."),
  };

  return (
    <Wrapper
      ref={refs.container}
      className={`dropdown-menu dropdown-menu-right dropdown-menu-big notification-drop-down show ${className}`}
      styles="position: absolute; will-change: transform; top: 0px; left: 0px; transform: translate3d(-252px, 38px, 0px);"
    >
      <div className="notification-title-wrapper p-4 text-center d-flex justify-content-between">
        <h6 className="mb-0">{dictionary.notifications}</h6>
        {unreadCount > 0 && (
          <small className="font-size-11 opacity-7">
            {unreadCount} {dictionary.unreadNotifications}
          </small>
        )}
      </div>
      <div>
        <NotificationLists data-toggle={"notification"} notifications={notifications} actions={actions} history={history} dictionary={dictionary} removeOverlay={toggleDropdown} />
      </div>
      <div className="p-2 text-right">
        <ul className="list-inline small">
          <li className="list-inline-item d-flex">
            <span className="cursor-pointer text-link" onClick={viewAll}>
              {dictionary.viewAll}
            </span>
            <span className="cursor-pointer ml-auto text-link" onClick={markAllRead}>
              {dictionary.markAllAsRead}
            </span>
          </li>
        </ul>
      </div>
    </Wrapper>
  );
};

export default React.memo(NotificationDropdown);
