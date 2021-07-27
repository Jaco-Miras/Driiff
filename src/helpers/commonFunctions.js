//import axios from "axios";
import { DeviceUUID } from "device-uuid";
//import md5 from "md5";
import React from "react";
import { browserName, isMobile, mobileModel, mobileVendor, osName, osVersion } from "react-device-detect";
import ReactDOM from "react-dom";

export const checkObjInArray = (obj, list) => {
  for (let i = 0, l = list.length; i < l; i++) {
    if (JSON.stringify(list[i]) === JSON.stringify(obj)) {
      return true;
    }
  }
  return false;
};

export const $_GET = (variable) => {
  let query = window.location.search.substring(1);
  let vars = query.split("&");

  for (var i = 0; i < vars.length; i++) {
    let pair = vars[i].split("=");
    if (pair[0] === variable) {
      return decodeURIComponent(pair[1]);
    }
  }
  return null;
};

export const setCookie = (name, value, days) => {
  let expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
};

export const getCookie = (name) => {
  var nameEQ = name + "=";
  var ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

export const eraseCookie = (name) => {
  document.cookie = name + "=; Max-Age=-99999999;";
};

export const getUrlParams = (url) => {
  let params = {};
  let parser = document.createElement("a");
  parser.href = url;
  let query = parser.search.substring(1);
  let vars = query.split("&");
  for (let i = 0; i < vars.length; i++) {
    let pair = vars[i].split("=");
    params[pair[0]] = decodeURIComponent(pair[1]);
  }
  return params;
};

export const renderReactComponent = (component, props, args) => {
  let TagName = component;
  return <TagName {...args} {...props} />;
};

export const isElementChildOf = (parent, child, childOnly = false) => {
  let node = child.parentNode;
  while (node != null) {
    if (node === parent) {
      return true;
    }
    node = node.parentNode;
  }

  if (!childOnly) {
    return parent === child;
  }

  return false;
};

export const isThisComponentHasFocus = (component) => {
  let node = ReactDOM.findDOMNode(component);
  if (node.querySelectorAll(":focus").length === 0) {
    return false;
  }

  return true;
};

export const getReactElementDOM = (component, querySelector) => {
  let node = ReactDOM.findDOMNode(component);
  return node.querySelector(querySelector);
};

export const getReactElementDOMAll = (component, querySelectorAll) => {
  let node = ReactDOM.findDOMNode(component);
  return node.querySelectorAll(querySelectorAll);
};

export const isIPAddress = (ipaddress) => {
  if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress)) {
    return true;
  }
  return false;
};

export const getThisDeviceInfo = () => {
  let deviceUUID = new DeviceUUID();

  let device = "";
  if (isMobile) {
    device = `${mobileVendor}${mobileModel}:${osName}${osVersion}`;
  } else {
    device = `${osName}${osVersion}`;
  }

  return {
    serial: deviceUUID.get(),
    device: device,
    browser: browserName,
  };
};

export const getClientWidth = () => {
  return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
};

function fallbackCopyTextToClipboard(toaster, text, notification) {
  let textArea = document.createElement("textarea");
  textArea.style.position = "fixed";
  textArea.style.top = 0;
  textArea.style.left = 0;
  textArea.style.opacity = 0;
  textArea.style.width = "2em";
  textArea.style.height = "2em";
  textArea.style.padding = 0;
  textArea.style.border = "none";
  textArea.style.outline = "none";
  textArea.style.boxShadow = "none";
  textArea.style.background = "transparent";

  textArea.value = text;

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    var successful = document.execCommand("copy");
    if (successful) toaster.info(notification);
  } catch (err) {
    toaster.error(
      <>
        Oops, unable to copy <b>{text}</b>
      </>
    );
    console.error("Fallback: Oops, unable to copy", err);
  }
  document.body.removeChild(textArea);
}

export const copyTextToClipboard = (toaster, text, notification = "Link copied to the clipboard.") => {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(toaster, text, notification);
    return;
  }
  navigator.clipboard.writeText(text).then(
    () => {
      toaster.info(notification);
    },
    (err) => {
      toaster.error(
        <>
          Oops, unable to copy <b>{text}</b>
        </>
      );
      console.error("Async: Could not copy text: ", err);
    }
  );
};

export const getHttpStatus = (url, async = true) => {
  try {
    let http = new XMLHttpRequest();

    http.open("HEAD", url, async);
    http.setRequestHeader("Access-Control-Allow-Origin", "*");
    http.setRequestHeader("Accept", "application/json");
    http.send();

    if (http.status === 0) return false;

    return http.status;
  } catch (err) {
    return false;
  }
};

// export const getGravatar = (email, imgClass = ".gravatar-profile-img-src") => {
//   if (email !== "") {
//     let MD5 = md5(email);
//     let gravatar = "https://gravatar.com/avatar/" + MD5 + "?d=404";

//     axios({
//       url: gravatar,
//       type: "HEAD",
//       crossDomain: true,
//     })
//       .then((res) => {
//         let elProfPic = document.querySelector(imgClass);
//         elProfPic.setAttribute("src", gravatar);
//       })
//       .catch((err) => {
//         let elProfPic = document.querySelector(imgClass);
//         elProfPic.setAttribute("src", "https://www.gravatar.com/avatar/" + MD5 + "?d=identicon");
//       });
//   }
// };

export const objToUrlParams = (obj, options = {}) => {
  if (options.encode === false) {
    return Object.entries(obj)
      .map(([key, val]) => `${key}=${val}`)
      .join("&");
  } else {
    return Object.entries(obj)
      .map(([key, val]) => `${key}=${encodeURIComponent(val)}`)
      .join("&");
  }
};

export const getPasswordStrength = (password) => {
  let strength = 0;

  if (password.match(/[a-z]+/)) strength += 1;

  if (password.match(/[A-Z]+/)) strength += 1;

  if (password.match(/[0-9]+/)) strength += 1;

  if (password.match(/[$@#&!]+/)) strength += 1;

  if (password.length > 7) strength += 1;

  if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) strength += 1;

  if (password.match(/([a-zA-Z])/) && password.match(/([0-9])/)) strength += 1;

  if (password.match(/([!,%,&,@,#,$,^,*,?,_,~])/)) strength += 1;

  if (password.match(/(.*[!,%,&,@,#,$,^,*,?,_,~].*[!,%,&,@,#,$,^,*,?,_,~])/)) strength += 1;

  return strength;
};

// export const requireAxiosDebugLog = () => {
//     let logger = $_GET("logger");

//     if (logger === "") {
//         logger = localStorage.getItem("logger");
//     }

//     if (logger !== "" && ["all", "axios"].includes(logger)) {
//         require("axios-debug-log");
//     }
// };
