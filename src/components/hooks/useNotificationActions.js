import {useCallback} from "react";
import {useDispatch} from "react-redux";
import {
    getNotifications,
    patchNotification,
    readNotificationReducer,
    readAllNotification,
    readAllNotificationReducer,
    unreadNotification,
    unreadNotificationReducer,
} from "../../redux/actions/notificationActions";

const useNotificationActions = props => {

    const dispatch = useDispatch();

    const get = useCallback((payload, callback) => {
        dispatch(
            getNotifications(payload, callback),
        );
    }, [dispatch]);

    const read = useCallback((payload) => {
        let callback = (err,res) => {
            if (err) return;
            dispatch(
                readNotificationReducer(payload)
            );
        }
        dispatch(
            patchNotification(payload, callback),
        );
    }, [dispatch]);

    const readAll = useCallback((payload) => {
        let callback = (err,res) => {
            if (err) return;
            dispatch(
                readAllNotificationReducer()
            );
        }
        dispatch(
            readAllNotification(payload, callback),
        );
    }, [dispatch]);

    const unread = useCallback((payload) => {
        let callback = (err,res) => {
            if (err) return;
            dispatch(
                unreadNotificationReducer(payload)
            );
        }
        dispatch(
            unreadNotification(payload, callback),
        );
    }, [dispatch]);

    return {
        get,
        read,
        readAll,
        unread,
    }
};

export default useNotificationActions;