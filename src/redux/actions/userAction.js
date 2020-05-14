import dispatchActionToReducer from "../actionDispatcher";
import {apiNoTokenCall} from "../services";
import {
    getOnlineUsers as getOnlineUsersService,
    getUser as getUserService,
    googleLogin as googleLoginService, 
    login as loginService,
    logout as logoutService,
} from "../services";

export const userLogin = (payload, callback) => {
    return dispatchActionToReducer(
        loginService(payload),
        "LOGIN_START",
        "LOGIN_SUCCESS",
        "LOGIN_FAILURE",
        callback,
    );
};

export const userLogout = (payload, callback) => {
    return dispatchActionToReducer(
        logoutService(payload),
        "LOGOUT_START",
        "LOGOUT_SUCCESS",
        "LOGOUT_FAILURE",
        callback,
    );
};

export const userGoogleLogin = (payload, callback) => {
    return dispatchActionToReducer(
        googleLoginService(payload),
        "GOOGLE_LOGIN_START",
        "GOOGLE_LOGIN_SUCCESS",
        "GOOGLE_LOGIN_FAILURE",
        callback,
    );
};
export function getOnlineUsers(payload, callback) {
    return dispatchActionToReducer(
        getOnlineUsersService(payload),
        "GET_ONLINE_USERS_START",
        "GET_ONLINE_USERS_SUCCESS",
        "GET_ONLINE_USERS_FAIL",
        callback,
    );
}

export function getUser(userId, history, callback) {
    return dispatchActionToReducer(
        getUserService(userId, history),
        "GET_USER_START",
        "GET_USER_SUCCESS",
        "GET_USER_FAILURE",
        callback,
    );
}
