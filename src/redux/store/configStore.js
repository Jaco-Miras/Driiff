import LogRocket from "logrocket";
import { applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { createLogger } from "redux-logger";
import { sessionService } from "redux-react-session";
import ReduxThunk from "redux-thunk";
import { initLogging, isConsoleLogAllowed, isLoggedAllowed } from "../../helpers/slugHelper";
import rootReducer from "../reducers";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["chat"],
};

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

/** orig store config **/
// const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(...middleware)));

// export default store;

const persistedReducer = persistReducer(persistConfig, rootReducer);
let persistenceOn = localStorage.getItem("persistence") ? true : false;
//let persistenceOn = true;
let store = null;

if (persistenceOn) {
  store = createStore(persistedReducer, composeWithDevTools(applyMiddleware(...middleware)));
} else {
  store = createStore(rootReducer, composeWithDevTools(applyMiddleware(...middleware)));
}
//store = createStore(persistedReducer, composeWithDevTools(applyMiddleware(...middleware)));

let persistor = persistStore(store);

sessionService.initSessionService(store, { redirectPath: "/login" });

export default () => {
  return { store, persistor, persistenceOn };
};
