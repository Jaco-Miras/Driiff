import Push from "push.js";

const shortid = require("shortid");
export const pushBrowserNotification = (title, body, icon = null, redirect, timeout = 5000, tag = null, push = null) => {
  if (tag === null) {
    tag = shortid.generate();
  }
  Push.create(title, {
    body: body,
    icon: icon !== null ? icon : "./assets/icons/favicon.png",
    timeout: timeout,
    tag: title,
    onClick: function () {
      window.focus();
      if (redirect) redirect();
      this.close();
    },
  });
};

export const browserSupported = () => {
  return "Notification" in window;
};

export const pushRequestPermission = (callbackGranted, callbackDenied) => {
  return Push.Permission.request(callbackGranted, callbackDenied);
};

export const pushOnGranted = (pushData) => {
  return Push.Permission.request(pushData, null);
};

export const hasPushNoti = () => {
  return Push.Permission.has();
};

export const pushPermission = () => {
  return Push.Permission;
};

export const getPushPermission = () => {
  return Push.Permission.get();
};
