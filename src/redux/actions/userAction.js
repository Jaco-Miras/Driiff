import dispatchActionToReducer from "../actionDispatcher";
import {googleLogin as googleLoginService, login as loginService} from "../services";

export const userLogin = (payload, callback) => {
    return dispatchActionToReducer(
        loginService(payload),
        "LOGIN_START",
        "LOGIN_SUCCESS",
        "LOGIN_FAILURE",
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