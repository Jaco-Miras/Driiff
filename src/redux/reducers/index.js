import { combineReducers } from "redux";
import { sessionReducer } from "redux-react-session";
import chat from "./chatReducer";
import dashboard from "./dashboardReducer";
import files from "./filesReducer";
import global from "./globalReducer";
import notifications from "./notificationsReducer";
import posts from "./postsReducer";
import settings from "./settingsReducer";
import tags from "./tagsReducer";
import users from "./usersReducer";
import workspaces from "./workspacesReducer";
import admin from "./adminReducer";

const appReducer = combineReducers({
  session: sessionReducer,
  admin,
  chat,
  dashboard,
  files,
  global,
  notifications,
  posts,
  settings,
  tags,
  users,
  workspaces,
});

const rootReducer = (state, action) => {
  let newState = state;
  if (action.type === "LOGOUT") {
    newState = {};
  }
  return appReducer(newState, action);
};

export default rootReducer;
