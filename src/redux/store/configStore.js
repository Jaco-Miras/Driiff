
import LogRocket from "logrocket";
import {applyMiddleware, createStore} from "redux";
import {composeWithDevTools} from "redux-devtools-extension";
import {createLogger} from "redux-logger";
import {sessionService} from "redux-react-session";
import ReduxThunk from "redux-thunk";
import {isLoggedALlowed} from "../../helpers/slugHelper";
import rootReducer from "../reducers";

let middleware = [ReduxThunk];

const logger = createLogger({
    predicate: (getState, action) => isLoggedALlowed(),
    collapsed: true,
});
middleware = [...middleware, logger, LogRocket.reduxMiddleware()];

const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(...middleware)));

sessionService.initSessionService(store, {redirectPath: "/login"});

export default store