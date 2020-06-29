import {useCallback} from "react";
import {useDispatch} from "react-redux";
import {
    deleteNotification,
    deleteAllNotification,
    getNotifications,
    patchNotification,
    readNotificationReducer,
    readAllNotification,
    readAllNotificationReducer,
    removeNotificationReducer,
    removeAllNotificationReducer,
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

    const remove = useCallback((payload) => {
        let callback = (err,res) => {
            if (err) return;
            dispatch(
                removeNotificationReducer(payload)
            );
        }
        dispatch(
            deleteNotification(payload, callback),
        );
    }, [dispatch]);

    const removeAll = useCallback(() => {
        let callback = (err,res) => {
            if (err) return;
            dispatch(
                removeAllNotificationReducer()
            );
        }
        dispatch(
            deleteAllNotification({}, callback),
        );
    }, [dispatch]);

    return {
        get,
        read,
        readAll,
        remove,
        removeAll,
        unread,
    }
};

export default useNotificationActions;