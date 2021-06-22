import LogRocket from "logrocket";
import { applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { createLogger } from "redux-logger";
import { sessionService } from "redux-react-session";
import ReduxThunk from "redux-thunk";
import { initLogging, isConsoleLogAllowed, isLoggedAllowed } from "../../helpers/slugHelper";
import rootReducer from "../reducers";

initLogging();

if (isConsoleLogAllowed()) {
  //window.console.log("turn on log");
} else {
  //window.console.log("turn off log");
  if (typeof window.console != "undefined") {
    window.console = {};
    window.console.log = function () {};
    window.console.info = function () {};
    window.console.warn = function () {};
    window.console.error = function () {};
  }
}

let middleware = [ReduxThunk];

const logger = createLogger({
  predicate: (getState, action) => isLoggedAllowed(),
  collapsed: true,
});
middleware = [...middleware, logger, LogRocket.reduxMiddleware()];

const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(...middleware)));

sessionService.initSessionService(store, { redirectPath: "/login" });

export default store;
