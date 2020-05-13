import dispatchActionToReducer from "../actionDispatcher";
import {apiNoTokenCall} from "../services";

export const userLogin = (data, callback) => {
    return dispatchActionToReducer(
        apiNoTokenCall({
            method: "POST",
            url: `/login`,
            data: data,
        }),
        "LOGIN_START",
        "LOGIN_SUCCESS",
        "LOGIN_FAILURE",
        callback,
    );
};