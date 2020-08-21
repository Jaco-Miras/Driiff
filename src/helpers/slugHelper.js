import React from "react";
import {getDriffName} from "../components/hooks/useDriff";
import {driffData} from "../config/environment";
import {apiCall} from "../redux/services";
import {$_GET, isIPAddress} from "./commonFunctions";

export const updateFaviconState = (isActive = false) => {
  let link = document.querySelectorAll("link[rel*='icon']");
  let driffUrl = getCurrentDriffUrl();

  for (let i = 0; i < link.length; i++) {
    if (isActive !== true) {
      switch (link[i].href) {
        case `${driffUrl}/assets/icons/apple-icon-active-57x57.png`:
          link[i].href = `${driffUrl}/assets/icons/apple-icon-57x57.png`;
          break;
        case `${driffUrl}/assets/icons/apple-icon-active-60x60.png`:
          link[i].href = `${driffUrl}/assets/icons/apple-icon-60x60.png`;
          break;
        case `${driffUrl}/assets/icons/apple-icon-active-72x72.png`:
          link[i].href = `${driffUrl}/assets/icons/apple-icon-72x72.png`;
          break;
        case `${driffUrl}/assets/icons/apple-icon-active-76x76.png`:
          link[i].href = `${driffUrl}/assets/icons/apple-icon-76x76.png`;
          break;
        case `${driffUrl}/assets/icons/apple-icon-active-114x114.png`:
          link[i].href = `${driffUrl}/assets/icons/apple-icon-114x114.png`;
          break;
        case `${driffUrl}/assets/icons/apple-icon-active-120x120.png`:
          link[i].href = `${driffUrl}/assets/icons/apple-icon-120x120.png`;
          break;
        case `${driffUrl}/assets/icons/apple-icon-active-144x144.png`:
          link[i].href = `${driffUrl}/assets/icons/apple-icon-144x144.png`;
          break;
        case `${driffUrl}/assets/icons/apple-icon-active-152x152.png`:
          link[i].href = `${driffUrl}/assets/icons/apple-icon-152x152.png`;
          break;
        case `${driffUrl}/assets/icons/apple-icon-active-180x180.png`:
          link[i].href = `${driffUrl}/assets/icons/apple-icon-180x180.png`;
          break;
        case `${driffUrl}/assets/icons/android-icon-active-192x192.png`:
          link[i].href = `${driffUrl}/assets/icons/android-icon-192x192.png`;
          break;
        case `${driffUrl}/assets/icons/favicon-active-32x32.png`:
          link[i].href = `${driffUrl}/assets/icons/favicon-32x32.png`;
          break;
        case `${driffUrl}/assets/icons/favicon-active-96x96.png`:
          link[i].href = `${driffUrl}/assets/icons/favicon-96x96.png`;
          break;
        case `${driffUrl}/assets/icons/favicon-active-16x16.png`:
          link[i].href = `${driffUrl}/assets/icons/favicon-16x16.png`;
          break;
        case `${driffUrl}/assets/icons/favicon-active.ico`:
          link[i].href = `${driffUrl}/assets/icons/favicon.ico`;
          break;
        default:
      }
    } else if (isActive === true) {
      switch (link[i].href) {
        case `${driffUrl}/assets/icons/apple-icon-57x57.png`:
          link[i].href = `${driffUrl}/assets/icons/apple-icon-active-57x57.png`;
          break;
        case `${driffUrl}/assets/icons/apple-icon-60x60.png`:
          link[i].href = `${driffUrl}/assets/icons/apple-icon-active-60x60.png`;
          break;
        case `${driffUrl}/assets/icons/apple-icon-72x72.png`:
          link[i].href = `${driffUrl}/assets/icons/apple-icon-active-72x72.png`;
          break;
        case `${driffUrl}/assets/icons/apple-icon-76x76.png`:
          link[i].href = `${driffUrl}/assets/icons/apple-icon-active-76x76.png`;
          break;
        case `${driffUrl}/assets/icons/apple-icon-114x114.png`:
          link[i].href = `${driffUrl}/assets/icons/apple-icon-active-114x114.png`;
          break;
        case `${driffUrl}/assets/icons/apple-icon-120x120.png`:
          link[i].href = `${driffUrl}/assets/icons/apple-icon-active-120x120.png`;
          break;
        case `${driffUrl}/assets/icons/apple-icon-144x144.png`:
          link[i].href = `${driffUrl}/assets/icons/apple-icon-active-144x144.png`;
          break;
        case `${driffUrl}/assets/icons/apple-icon-152x152.png`:
          link[i].href = `${driffUrl}/assets/icons/apple-icon-active-152x152.png`;
          break;
        case `${driffUrl}/assets/icons/apple-icon-180x180.png`:
          link[i].href = `${driffUrl}/assets/icons/apple-icon-active-180x180.png`;
          break;
        case `${driffUrl}/assets/icons/android-icon-192x192.png`:
          link[i].href = `${driffUrl}/assets/icons/android-icon-active-192x192.png`;
          break;
        case `${driffUrl}/assets/icons/favicon-32x32.png`:
          link[i].href = `${driffUrl}/assets/icons/favicon-active-32x32.png`;
          break;
        case `${driffUrl}/assets/icons/favicon-96x96.png`:
          link[i].href = `${driffUrl}/assets/icons/favicon-active-96x96.png`;
          break;
        case `${driffUrl}/assets/icons/favicon-16x16.png`:
          link[i].href = `${driffUrl}/assets/icons/favicon-active-16x16.png`;
          break;
        case `${driffUrl}/assets/icons/favicon.ico`:
          link[i].href = `${driffUrl}/assets/icons/favicon-active.ico`;
          break;
        default:
      }
    }
    document.getElementsByTagName("head")[0].appendChild(link[i]);
  }
};

export const getCurrentDriffUrl = () => {
  const { REACT_APP_localDNSName } = process.env;
  const slugName = getDriffName();
  let url = window.location.protocol;
  let port = window.location.port && window.location.port !== 80 ? `:${window.location.port}` : "";

  if (isIPAddress(window.location.hostname) || window.location.hostname === "localhost") {
    return `${url}//${window.location.hostname}${port}`;
  } else {
    if (slugName) {
      return `${url}//${slugName}.${REACT_APP_localDNSName}${port}`;
    } else {
      return `${url}//${REACT_APP_localDNSName}${port}`;
    }
  }
};

export const imgAsLogin = () => {
  if (localStorage.getItem("atoken") && localStorage.getItem("slug")) {
    return <img style={{ visibility: "hidden", display: "none" }} alt={"login token"} src={`${getAPIUrl({ isDNS: true })}/auth-web/login?token=${localStorage.getItem("atoken")}`} height={1} width={1} />;
  } else {
  }
};

export const getAPIUrl = (data = {}) => {
  const driffName = getDriffName();
  const { REACT_APP_ENV, REACT_APP_apiProtocol, REACT_APP_apiBaseUrl, REACT_APP_apiDNSName, REACT_APP_mockServerBaseUrl } = process.env;

  switch (REACT_APP_ENV) {
    case "local":
      if (typeof data.isDNS !== "undefined" && data.isDNS === true) {
        return `${REACT_APP_apiProtocol}${REACT_APP_apiDNSName}`;
      } else {
        return `${REACT_APP_apiProtocol}${REACT_APP_apiBaseUrl}`;
      }
    case "development":
    case "production":
      let url = REACT_APP_apiProtocol;

      if (typeof data.noSlug === "undefined" || data.noSlug !== true) {
        url += `${driffName}.`;
      }

      if (typeof data.isDNS !== "undefined" && data.isDNS === true) {
        url += REACT_APP_apiDNSName;
      } else if (typeof data.isMockBased !== "undefined" && data.isMockBased === true) {
        url += REACT_APP_mockServerBaseUrl;
      } else if (data.is_shared && data.token) {
        return `${REACT_APP_apiProtocol}${data.slug}.${REACT_APP_apiBaseUrl}`;
      } else {
        url += REACT_APP_apiBaseUrl;
      }
      return url;
    default:
      return;
  }
};

export const getBaseUrl = (data = {}) => {
  const driffName = getDriffName();
  const { REACT_APP_ENV, REACT_APP_localDNSProtocol, REACT_APP_localDNSName } = process.env;
  let url = REACT_APP_localDNSProtocol;

  switch (REACT_APP_ENV) {
    case "local":
      return `${REACT_APP_localDNSProtocol}${REACT_APP_localDNSName}`;
    case "development":
      if (typeof data.noSlug === "undefined" || data.noSlug !== true) {
        url += `${driffName}.`;
      }

      url += REACT_APP_localDNSName;

      return url;
    case "production":
      if (typeof data.noSlug === "undefined" || data.noSlug !== true) {
        url += `${driffName}.`;
      }

      url += REACT_APP_localDNSName;

      return url;
    default:
      return;
  }
};

export const initLogging = () => {
  let logger = $_GET("logger");
  if (logger) {
    if (logger === "remove") {
      localStorage.removeItem("logger");
    } else {
      localStorage.setItem("logger", logger);
    }
  }
}

export const isConsoleLogAllowed = () => {
  if (["all", "console"].includes(localStorage.getItem("logger"))) {
    return true;
  }

  return (isIPAddress(window.location.hostname) || window.location.hostname === "localhost");
}

export const isLoggedAllowed = () => {
  if (["all", "reducer", "axios"].includes(localStorage.getItem("logger"))) {
    return true;
  }

  return (isIPAddress(window.location.hostname) || window.location.hostname === "localhost");
};

export const isTranslationLogged = () => {
  if (localStorage.getItem("logger") === "translation-off") {
    return false;
  }

  if (["all", "translation"].includes(localStorage.getItem("logger"))) {
    return true;
  }

  return (isIPAddress(window.location.hostname) || window.location.hostname === "localhost");
};

export const processTabActive = () => {
  let hidden = "hidden";

  // Standards:
  if (hidden in document) document.addEventListener("visibilitychange", onchange);
  else if ((hidden = "mozHidden") in document) document.addEventListener("mozvisibilitychange", onchange);
  else if ((hidden = "webkitHidden") in document) document.addEventListener("webkitvisibilitychange", onchange);
  else if ((hidden = "msHidden") in document) document.addEventListener("msvisibilitychange", onchange);
  // IE 9 and lower:
  else if ("onfocusin" in document) document.onfocusin = document.onfocusout = onchange;
  // All others:
  else window.onpageshow = window.onpagehide = window.onfocus = window.onblur = onchange;

  function onchange(evt) {
    var v = "visible",
      h = "hidden",
      evtMap = {
        focus: v,
        focusin: v,
        pageshow: v,
        blur: h,
        focusout: h,
        pagehide: h,
      };

    evt = evt || window.event;
    if (evt.type in evtMap) document.body.className = evtMap[evt.type];
    else document.body.className = this[hidden] ? "hidden" : "visible";
  }

  // set the initial state (but only if browser supports the Page Visibility API)
  if (document[hidden] !== undefined) onchange({ type: document[hidden] ? "blur" : "focus" });
};

export const checkUpdate = () => {
  if (localStorage.getItem("driffVersion") !== driffData.version) {
    apiCall({
      method: "PATCH",
      url: "/update-driff-version",
      data: {
        data: {
          version: driffData.version,
          requirement: driffData.requirement,
        },
      },
    }).then(() => {
      localStorage.setItem("driffVersion", driffData.version);
    });
  }
};

export const getTranslationAPIUrl = () => {
  const { REACT_APP_translation_api_base_url } = process.env;

  let url = "";
  if (typeof REACT_APP_translation_api_base_url !== "undefined") {
    url = REACT_APP_translation_api_base_url;
  }

  /**
   * @todo
   * add condition for driff API
   */

  return url;
};
