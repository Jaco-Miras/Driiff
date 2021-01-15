import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getNotifications } from "../../redux/actions/notificationActions";
import { getUsers, getExternalUsers } from "../../redux/actions/userAction";
import { getAllRecipients, getQuickLinks, getUnreadNotificationCounterEntries, getToDoDetail, getDrafts } from "../../redux/actions/globalActions";
import { getGlobalRecipients, getHuddleChatbot } from "../../redux/actions/chatActions";
import { useChannelActions } from "../hooks";

const useInitialLoad = () => {
  const notifications = useSelector((state) => state.notifications.notifications);

  const channelActions = useChannelActions();

  const dispatch = useDispatch();

  useEffect(() => {
    document.body.classList.remove("form-membership");
    const fetchChannelCb = () => {
      dispatch(getAllRecipients());
      dispatch(getUsers());
      dispatch(getExternalUsers());
      //dispatch(getUnreadPostEntries());
      if (Object.keys(notifications).length === 0) {
        dispatch(getNotifications({ skip: 0, limit: 50 }));
      }
      dispatch(getUnreadNotificationCounterEntries({ add_unread_comment: 1 }));
      dispatch(getQuickLinks());
      dispatch(getToDoDetail());
      dispatch(getGlobalRecipients());
      //dispatch(getDrafts());
    };
    channelActions.loadMore({ skip: 0, limit: 25 }, fetchChannelCb);
    dispatch(getHuddleChatbot({}));
  }, []);
};

export default useInitialLoad;
