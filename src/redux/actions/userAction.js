import dispatchActionToReducer from "../actionDispatcher";
import {
    authenticateGoogleLogin as authenticateGoogleLoginService,
    getOnlineUsers as getOnlineUsersService,
    getMentions as getMentionsService,
    getUser as getUserService,
    googleLogin as googleLoginService,
    login as loginService,
    logout as logoutService,
    resetPassword as resetPasswordService,
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

export const authenticateGoogleLogin = (payload, callback) => {
    return dispatchActionToReducer(
        authenticateGoogleLoginService(payload),
        "GOOGLE_AUTH_LOGIN_START",
        "GOOGLE_AUTH_LOGIN_SUCCESS",
        "GOOGLE_AUTH_LOGIN_FAILURE",
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

export function getMentions(callback) {
    return dispatchActionToReducer(
        getMentionsService(),
        "GET_MENTION_USERS_START",
        "GET_MENTION_USERS_SUCCESS",
        "GET_MENTION_USERS_FAILURE",
        callback,
    );
}

export function resetPassword(payload, callback) {
    return dispatchActionToReducer(
        resetPasswordService(payload),
        "GET_USER_START",
        "GET_USER_SUCCESS",
        "GET_USER_FAILURE",
        callback,
    );
}
