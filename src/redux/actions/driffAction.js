import dispatchActionToReducer from "../actionDispatcher";
import {patchCheckDriff as patchCheckDriffService, postRegisterDriff as postRegisterDriffService} from "../services";

export const postRegisterDriff = (payload, callback) => {
    return dispatchActionToReducer(
        postRegisterDriffService(payload),
        "REGISTER_DRIFF_START",
        "REGISTER_DRIFF_SUCCESS",
        "REGISTER_DRIFF_FAILURE",
        callback,
    );
};

export const patchCheckDriff = (payload, callback) => {
    return dispatchActionToReducer(
        patchCheckDriffService(payload),
        "CHECK_DRIFF_START",
        "CHECK_DRIFF_SUCCESS",
        "CHECK_DRIFF_FAILURE",
        callback,
    );
};