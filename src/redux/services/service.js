import axios from "axios";
import { sessionService } from "redux-react-session";
// import { source } from "../../helpers/cancelRequest";
//import {requireAxiosDebugLog} from "../../helpers/commonFunctions";
import { getAPIUrl } from "../../helpers/slugHelper";

//requireAxiosDebugLog();

export const apiCall = async ({ method, url, data = null, register = false, mockServer = false, responseType, hasFile = false, is_shared = false, config = { timeout: 5000 }, cancelToken = null }) => {
  let userLang = navigator.language || navigator.userLanguage;
  let tzOffset = new Date().getTimezoneOffset();
  let tzName = Intl.DateTimeFormat().resolvedOptions().timeZone;
  if (localStorage.getItem("loggedInUser.language")) {
    userLang = localStorage.getItem("loggedInUser.language");
  }

  if (localStorage.getItem("loggedInUser.timezoneOffset")) {
    tzOffset = localStorage.getItem("loggedInUser.timezoneOffset");
  }

  if (localStorage.getItem("loggedInUser.timezoneName")) {
    tzName = localStorage.getItem("loggedInUser.timezoneName");
  }

  const urls = register
    ? `${getAPIUrl({ noSlug: true })}${url}`
    : is_shared
    ? `${getAPIUrl({
        is_shared: true,
        token: data.token,
        slug: data.slug,
      })}${url}`
    : `${getAPIUrl()}${url}`;

  /**
   * @param {Object} session
   * @param {string} session.access_broadcast_token
   * @param {string} session.download_token
   * @param {string} session.token
   * @returns {never}
   */
  function apiPromise(session) {
    if (hasFile) {
      let formData = new FormData();
      for (const name of Object.keys(data)) {
        formData.append(name, data[name]);
      }
      data = formData;
    }
    return axios({
      method,
      url: mockServer ? `${getAPIUrl({ isMockBased: true })}${url}` : urls,
      data,
      responseType,
      crossDomain: true,
      cancelToken: cancelToken,
      headers: {
        "Access-Control-Allow-Origin": "*",
        crossorigin: true,
        "Content-Type": hasFile ? "multipart/form-data" : "application/json",
        Authorization: is_shared && data.token ? `Bearer ${data.token}` : session.token,
        "Accept-Language": userLang,
        "X-Timezone-Offset": tzOffset,
        "X-Timezone-Name": tzName,
      },
      onUploadProgress: config.onUploadProgress,
      config,
    });
  }

  return sessionService
    .loadSession()
    .catch((err) => {
      throw err;
    })
    .then((session) => {
      return apiPromise(session);
    })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export const apiNoTokenCall = async ({ method, url, actualUrl = null, data = null, register = false, mockServer = false, responseType = "json", token = null, config = { timeout: 5000 }, cancelToken = null }) => {
  let userLang = navigator.language || navigator.userLanguage;
  let tzOffset = new Date().getTimezoneOffset();

  if (localStorage.getItem("loggedInUser.language")) {
    userLang = localStorage.getItem("loggedInUser.language");
  }

  if (localStorage.getItem("loggedInUser.timezoneOffset")) {
    tzOffset = localStorage.getItem("loggedInUser.timezoneOffset");
  }

  const urls = register ? `${getAPIUrl({ noSlug: true })}${url}` : `${getAPIUrl()}${url}`;

  function apiPromise() {
    let api_url = mockServer ? `${getAPIUrl({ isMockBased: true })}${url}` : urls;

    if (actualUrl) {
      api_url = actualUrl;
    } else {
      //forced to use LIVE API
      const { REACT_APP_apiProtocol, REACT_APP_apiBaseUrl } = process.env;
      if (url === "/announcement") {
        api_url = `${REACT_APP_apiProtocol}${REACT_APP_apiBaseUrl}/announcement`;
      }
    }

    let axiosParam = {
      method,
      url: api_url,
      data,
      responseType,
      crossDomain: true,
      cancelToken: cancelToken,
      headers: {
        "Access-Control-Allow-Origin": "*",
        crossorigin: true,
        "Content-Type": "application/json",
        "Accept-Language": userLang,
        "X-Timezone-Offset": tzOffset,
      },
      config,
    };

    if (token) {
      axiosParam = {
        ...axiosParam,
        headers: {
          ...axiosParam.headers,
          Authorization: token,
        },
      };
    }
    return axios(axiosParam);
  }

  return apiPromise()
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
