import React from "react";
import ReactDOM from "react-dom";
import * as Sentry from "@sentry/react";
import { Provider } from "react-redux";
import { Integrations } from "@sentry/tracing";
import { BrowserRouter } from "react-router-dom";
import LogRocket from "logrocket";

import App from "./App";
import "./assets/style/app.scss";
import store from "./redux/store/configStore";
//import * as serviceWorker from "./serviceWorker";

const { REACT_APP_sentry_dsn } = process.env;

(() => {
  // overrides URL methods to be able to retrieve the original blobs later
  const old_create = URL.createObjectURL;
  const old_revoke = URL.revokeObjectURL;
  Object.defineProperty(URL, "createObjectURL", {
    get: () => storeAndCreate,
  });
  Object.defineProperty(URL, "revokeObjectURL", {
    get: () => forgetAndRevoke,
  });
  Object.defineProperty(URL, "getFromObjectURL", {
    get: () => getBlob,
  });
  const dict = {};

  function storeAndCreate(blob) {
    var url = old_create(blob);
    dict[url] = blob;
    return url;
  }

  function forgetAndRevoke(url) {
    old_revoke(url);
    try {
      if (new URL(url).protocol === "blob:") delete dict[url];
    } catch (e) {
      console.log(e);
    }
  }

  function getBlob(url) {
    return dict[url];
  }
})();

if (localStorage.getItem("sentry") === "1") {
  Sentry.init({
    dsn: REACT_APP_sentry_dsn,
    integrations: [new Integrations.BrowserTracing()],

    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 1.0,
  });
}

if (localStorage.getItem("log_rocket") === "1") {
  LogRocket.init("z1ni7v/driff", {
    dom: {
      textSanitizer: true,
      inputSanitizer: true,
    },
  });

  LogRocket.getSessionURL((sessionURL) => {
    Sentry.configureScope((scope) => {
      scope.setExtra("sessionURL", sessionURL);
    });
  });
}

const wrapApp = (reduxStore) => (
  <Provider store={reduxStore}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);

ReactDOM.render(wrapApp(store), document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
//serviceWorker.unregister();
