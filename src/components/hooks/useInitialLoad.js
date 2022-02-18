import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getNotifications, getAllSnoozedNotification } from "../../redux/actions/notificationActions";
import { getUsers, getExternalUsers, getTeams } from "../../redux/actions/userAction";
import { getUnreadNotificationCounterEntries, getToDoDetail, getAllRecipients } from "../../redux/actions/globalActions";
import { getGlobalRecipients, getHuddleChatbot, getCompanyChannel } from "../../redux/actions/chatActions";
import { getNotificationSettings, getSecuritySettings } from "../../redux/actions/adminActions";
import { useChannelActions } from "../hooks";

const useInitialLoad = () => {
  const notifications = useSelector((state) => state.notifications.notifications);
  const user = useSelector((state) => state.session.user);

  const channelActions = useChannelActions();

  const dispatch = useDispatch();

  useEffect(() => {
    document.body.classList.remove("form-membership");
    const fetchChannelCb = () => {
      dispatch(getAllRecipients());
      dispatch(
        getUsers({}, () => {
          dispatch(getTeams());
          dispatch(getToDoDetail());
        })
      );
      dispatch(getExternalUsers());
      if (Object.keys(notifications).length === 0) {
        dispatch(
          getAllSnoozedNotification({}, () => {
            dispatch(getNotifications({ skip: 0, limit: 50 }));
            dispatch(getHuddleChatbot({}));
          })
        );
      }
      dispatch(getUnreadNotificationCounterEntries());
      dispatch(getGlobalRecipients());
      dispatch(getNotificationSettings());
      dispatch(getSecuritySettings());
      if (user && user.type === "internal") dispatch(getCompanyChannel());
    };

    channelActions.loadMore({ skip: 0, limit: 15 }, fetchChannelCb);
  }, []);
};

export default useInitialLoad;
