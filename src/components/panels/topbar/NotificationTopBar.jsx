import React, { useEffect } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { SvgIconFeather } from "../../common";
import { sessionService } from "redux-react-session";
import { useTranslationActions } from "../../hooks";

const Wrapper = styled.div`
  padding: 10px;
  width: 100%;
  color: #fff;
  height: 40px;
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  text-align: center;
  justify-content: center;
  background-color: ${(props) => props.theme.colors.fourth};
  .feather {
    cursor: pointer;
  }
`;

const NotificationTopBar = (props) => {
  const notificationsLoaded = useSelector((state) => state.admin.notificationsLoaded);
  const notifications = useSelector((state) => state.admin.notifications);
  const user = useSelector((state) => state.session.user);

  const { _t } = useTranslationActions();

  const dictionary = {
    email: _t("EMAIL_TEXT", "E-mail / text"),
    webPush: _t("WEBPUSH", "Web push"),
    apn: _t("APN_IOS", "Apple push notification"),
    notificationsOff: _t("NOTIFICATIONS_ARE_OFF", "notifications are off"),
  };

  const handleCloseBar = () => {
    sessionService.saveUser({ ...user, showNotificationSettingsBar: false });
    const mainElement = document.getElementById("main");
    const mainHeader = document.getElementById("main-top-header");
    const navigation = document.getElementById("main-sidebar");
    mainElement.classList.remove("top-40");
    mainHeader.classList.remove("top-40");
    navigation.classList.remove("top-40");
  };
  useEffect(() => {
    if (notificationsLoaded && Object.values(notifications).some((n) => n === false) && user && !user.hasOwnProperty("showNotificationSettingsBar")) {
      sessionService.saveUser({ ...user, showNotificationSettingsBar: true });
    } else if (notificationsLoaded && Object.values(notifications).some((n) => n === false) && user && user.hasOwnProperty("showNotificationSettingsBar") && user.showNotificationSettingsBar) {
      const mainElement = document.getElementById("main");
      const mainHeader = document.getElementById("main-top-header");
      const navigation = document.getElementById("main-sidebar");
      mainElement.classList.add("top-40");
      mainHeader.classList.add("top-40");
      navigation.classList.add("top-40");
    }
  }, [notificationsLoaded, notifications, user]);

  if (notificationsLoaded && Object.values(notifications).some((n) => n === false) && user && user.hasOwnProperty("showNotificationSettingsBar") && user.showNotificationSettingsBar) {
    const offNotifications = Object.keys(notifications)
      .filter((n) => {
        return notifications[n] === false;
      })
      .map((n) => {
        if (n === "email") return dictionary.email;
        else if (n === "webpush") return dictionary.webPush;
        else if (n === "apn") return dictionary.apn;
      });
    return (
      <Wrapper>
        <p>
          {offNotifications.join(", ")} {dictionary.notificationsOff}
        </p>
        <SvgIconFeather icon="x" className={"ml-3"} onClick={handleCloseBar} />
      </Wrapper>
    );
  } else {
    return null;
  }
};

export default NotificationTopBar;
