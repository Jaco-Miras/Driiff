import React from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { useNotificationActions, useNotifications, useRedirect, useTranslationActions, useSettings } from "../../hooks";
import { NotificationTimelineItem } from "../../list/notification/item";
import { SvgEmptyState } from "../../common";
import { UserNotificationSidebar } from "./index";
//import { CompanyPostTimeline } from "../dashboard/timeline/company";
const Wrapper = styled.div`
  .empty-notification {
    h4 {
      margin: 2rem auto;
      text-align: center;
      color: ${(props) => props.theme.colors.primary};
    }
  }
  overflow: auto;
`;

const UserNotificationPanel = (props) => {
  const { className = "" } = props;

  const user = useSelector((state) => state.session.user);
  const history = useHistory();
  const actions = useNotificationActions();
  const { notifications, unreadNotifications } = useNotifications();
  const { _t } = useTranslationActions();
  const redirect = useRedirect();

  const {
    generalSettings: { dark_mode },
  } = useSettings();

  const dictionary = {
    new: _t("NOTIFICATION.NEW", "New"),
    markAllAsRead: _t("NOTIFICATION.MARK_ALL_AS_READ", "Mark all as read"),
    oldNotifications: _t("NOTIFICATION.OLD_NOTIFICATIONS", "Old notifications"),
    noNotificationsToShow: _t("NOTIFICATION.NO_NOTIFICATIONS_TO_SHOW", "There are no notifications to show."),
    howdy: _t("NOTIFICATION.HOWDY", "Here you go, "),
    notificationCount1: _t("NOTIFICATION.NOTIFICATIONCOUNT1", "You have"),
    notificationCount2: _t("NOTIFICATION.NOTIFICATIONCOUNT2", "new notifications."),
    viewSettings: _t("NOTIFICATION.VIEW_SETTINGS", "View Settings"),
    improve: _t("NOTIFICATION.IMPROVE_NOTIFICATIONS", "Improve your notifications"),
    mustRead: _t("NOTIFICATION.MUST_READ", "Must read"),
    needsReply: _t("NOTIFICATION.NEEDS_REPLY", "Needs reply"),
  };

  const notif = Object.values(notifications).sort((a, b) => b.created_at.timestamp - a.created_at.timestamp);

  return (
    <Wrapper className={`user-profile-panel container-fluid h-100 ${className}`}>
      <div className="row row-user-profile-panel">
        <UserNotificationSidebar className="col-md-3" dictionary={dictionary} user={user} unreadNotifications={unreadNotifications} darkMode={dark_mode} />
        <div className="col-md-6">
          {notif.length > 0 && (
            <div className="card app-content-body mb-4 ">
              <div className="card-body " style={{ padding: "0px" }}>
                <div className="timeline">
                  {notif.map((n) => {
                    return <NotificationTimelineItem key={n.id} notification={n} actions={actions} history={history} redirect={redirect} user={user} _t={_t} darkMode={dark_mode} />;
                  })}
                </div>
              </div>
            </div>
          )}
          {!notif.length && (
            <div className="card empty-notification">
              <h4 className="text-primary">{dictionary.noNotificationsToShow}</h4>
              <div className="card-body d-flex justify-content-center align-items-center">
                <SvgEmptyState icon={1} height={330} />
              </div>
            </div>
          )}
        </div>
      </div>
    </Wrapper>
  );
};

export default React.memo(UserNotificationPanel);
