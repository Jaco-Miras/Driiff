import dispatchActionToReducer from "../actionDispatcher";
import {googleLogin as googleLoginService, login as loginService, logout as logoutService} from "../services";

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