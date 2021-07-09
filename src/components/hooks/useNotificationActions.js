import React from "react";
import { useDispatch } from "react-redux";
import {
  deleteAllNotification,
  deleteNotification,
  getNotifications,
  patchNotification,
  readAllNotification,
  readAllNotificationReducer,
  readNotificationReducer,
  removeAllNotificationReducer,
  removeNotificationReducer,
  unreadNotification,
  unreadNotificationReducer,
  snoozeNotification
} from "../../redux/actions/notificationActions";
import { setActiveTopic } from "../../redux/actions/workspaceActions";
import { useToaster } from "./index";

const useNotificationActions = (props) => {
  const dispatch = useDispatch();
  const toaster = useToaster();

  const get = (payload, callback) => {
    dispatch(getNotifications(payload, callback));
  };

  const read = (payload) => {
    let callback = (err, res) => {
      if (err) return;
      dispatch(readNotificationReducer(payload));
    };
    dispatch(patchNotification(payload, callback));
  };

  const readAll = (payload) => {
    let callback = (err, res) => {
      if (err) {
        toaster.error(<>Action failed</>);
        return;
      }
      if (res) {
        dispatch(readAllNotificationReducer());
        toaster.success(<>You marked all notifications read</>);
      }
    };
    dispatch(readAllNotification(payload, callback));
  };

  const unread = (payload) => {
    let callback = (err, res) => {
      if (err) return;
      dispatch(unreadNotificationReducer(payload));
    };
    dispatch(unreadNotification(payload, callback));
  };

  const remove = (payload) => {
    let callback = (err, res) => {
      if (err) return;
      dispatch(removeNotificationReducer(payload));
    };
    dispatch(deleteNotification(payload, callback));
  };

  const removeAll = () => {
    let callback = (err, res) => {
      if (err) return;
      dispatch(removeAllNotificationReducer());
    };
    dispatch(deleteAllNotification({}, callback));
  };

  const selectWorkspace = (workspace, callback) => {
    dispatch(setActiveTopic(workspace, callback));
  };

  const snooze = (payload) => {
    dispatch(snoozeNotification(payload));
  };
  return {
    get,
    read,
    readAll,
    remove,
    removeAll,
    selectWorkspace,
    unread,
    snooze,
  };
};

export default useNotificationActions;
