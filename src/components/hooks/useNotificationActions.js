import React from "react";
import { useDispatch, useSelector } from "react-redux";
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
  snoozeNotificationReducer,
  snoozeNotificationAll,
  snoozeNotification,
  snoozeAllNotification,
} from "../../redux/actions/notificationActions";
import { setActiveTopic } from "../../redux/actions/workspaceActions";
import { useToaster } from "./index";

const useNotificationActions = (props) => {
  const dispatch = useDispatch();
  const toaster = useToaster();
  const sharedWs = useSelector((state) => state.workspaces.sharedWorkspaces);

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
    if (Object.keys(sharedWs).length) {
      Object.keys(sharedWs).forEach((ws) => {
        const sharedPayload = { slug: ws, token: sharedWs[ws].access_token, is_shared: true };
        dispatch(readAllNotification({ ...payload, sharedPayload: sharedPayload }));
      });
    }
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
    if (Object.keys(sharedWs).length) {
      Object.keys(sharedWs).forEach((ws) => {
        const sharedPayload = { slug: ws, token: sharedWs[ws].access_token, is_shared: true };
        dispatch(deleteAllNotification({ sharedPayload: sharedPayload }));
      });
    }
  };

  const selectWorkspace = (workspace, callback) => {
    dispatch(setActiveTopic(workspace, callback));
  };

  const snooze = (payload) => {
    dispatch(snoozeNotificationReducer(payload));
  };

  const snoozeAll = (payload) => {
    dispatch(snoozeNotificationAll(payload));
  };

  const snoozeNotif = (payload) => {
    dispatch(snoozeNotification(payload));
  };

  const snoozeAllNotif = (payload) => {
    dispatch(snoozeAllNotification(payload));
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
    snoozeAll,
    snoozeNotif,
    snoozeAllNotif,
  };
};

export default useNotificationActions;
