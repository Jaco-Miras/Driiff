import React from "react";
import ReactDOM from "react-dom";
import * as Sentry from "@sentry/react";
import { Provider } from "react-redux";
import { Integrations } from "@sentry/tracing";
import { BrowserRouter } from "react-router-dom";
import LogRocket from "logrocket";

import App from "./App";
import "toasted-notes/src/styles.css";
import "./assets/style/app.scss";
import store from "./redux/store/configStore";
//import * as serviceWorker from "./serviceWorker";

const { REACT_APP_sentry_dsn } = process.env;

Sentry.init({
  dsn: REACT_APP_sentry_dsn,
  integrations: [
    new Integrations.BrowserTracing(),
  ],

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,
});


LogRocket.init('z1ni7v/driff', {
  dom: {
    textSanitizer: true,
    inputSanitizer: true,
  }
});

LogRocket.getSessionURL(sessionURL => {
  Sentry.configureScope(scope => {
    scope.setExtra("sessionURL", sessionURL);
  });
});

const wrapApp = (reduxStore) => (
  <Provider store={reduxStore}>
    <BrowserRouter>
      <App/>
    </BrowserRouter>
  </Provider>
);

ReactDOM.render(wrapApp(store), document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
//serviceWorker.unregister();
