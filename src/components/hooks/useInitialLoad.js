import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getNotifications, getAllSnoozedNotification } from "../../redux/actions/notificationActions";
import { getUsers, getExternalUsers, getArchivedUsers, getTeams } from "../../redux/actions/userAction";
import { getAllRecipients, getQuickLinks, getUnreadNotificationCounterEntries, getToDoDetail, getDrafts } from "../../redux/actions/globalActions";
import { getGlobalRecipients, getHuddleChatbot, getCompanyChannel } from "../../redux/actions/chatActions";
import { getAllWorkspaceFolders } from "../../redux/actions/workspaceActions";
import { getNotificationSettings } from "../../redux/actions/adminActions";
import { useChannelActions } from "../hooks";

const useInitialLoad = () => {
  const notifications = useSelector((state) => state.notifications.notifications);
  const user = useSelector((state) => state.session.user);

  const channelActions = useChannelActions();

  const dispatch = useDispatch();

  useEffect(() => {
    document.body.classList.remove("form-membership");
    const fetchChannelCb = () => {
      // dispatch(getAllRecipients());
      dispatch(
        getUsers({}, () => {
          dispatch(getArchivedUsers());
          dispatch(getTeams());
        })
      );
      dispatch(getExternalUsers());
      dispatch(getAllWorkspaceFolders());
      dispatch(getDrafts());
      //dispatch(getUnreadPostEntries());
      if (Object.keys(notifications).length === 0) {
        dispatch(
          getAllSnoozedNotification({}, () => {
            dispatch(getNotifications({ skip: 0, limit: 50 }));
            dispatch(getHuddleChatbot({}));
          })
        );
      }
      //dispatch(getPostAccess());
      dispatch(getUnreadNotificationCounterEntries({ add_unread_comment: 1 }));
      dispatch(getQuickLinks());
      dispatch(getToDoDetail());
      dispatch(getGlobalRecipients());
      //dispatch(getDrafts());
      dispatch(getNotificationSettings());
    };
    dispatch(getAllRecipients());
    if (user && user.type === "internal") dispatch(getCompanyChannel());
    channelActions.loadMore({ skip: 0, limit: 25 }, fetchChannelCb);
  }, []);
};

export default useInitialLoad;
