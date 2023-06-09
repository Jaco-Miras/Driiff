import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getNotifications, getAllSnoozedNotification } from "../../redux/actions/notificationActions";
import { getUsers, getExternalUsers, getTeams } from "../../redux/actions/userAction";
import { getUnreadNotificationCounterEntries, getToDoDetail, getAllRecipients } from "../../redux/actions/globalActions";
import { getGlobalRecipients, getHuddleChatbot, getCompanyChannel, setChannelInitialLoad, adjustHuddleDate, getUnpublishedAnswers, getSkippedAnswers, addHasUnpublishedAnswers } from "../../redux/actions/chatActions";
import { getNotificationSettings, getSecuritySettings } from "../../redux/actions/adminActions";
import { useChannelActions } from "../hooks";

const useInitialLoad = () => {
  //const notifications = useSelector((state) => state.notifications.notifications);
  const user = useSelector((state) => state.session.user);

  const channelActions = useChannelActions();

  const dispatch = useDispatch();

  const getChannelsWithUnpublishedMessage = (id) => {
    dispatch(
      getUnpublishedAnswers({ channel_id: id }, (err, res) => {
        if (err) return;
        if (res.data && res.data.length > 0) {
          dispatch(addHasUnpublishedAnswers({ channel_id: id }));
        }
      })
    );
  };

  useEffect(() => {
    document.body.classList.remove("form-membership");
    const fetchChannelCb = () => {
      dispatch(setChannelInitialLoad());
      dispatch(getSecuritySettings({}));
      dispatch(getAllRecipients());
      dispatch(
        getUsers({}, () => {
          dispatch(getTeams());
          dispatch(getToDoDetail());
        })
      );
      dispatch(getExternalUsers());

      dispatch(
        getAllSnoozedNotification({}, () => {
          dispatch(getNotifications({ skip: 0, limit: 50 }));
          dispatch(getHuddleChatbot({}));
        })
      );

      dispatch(getUnreadNotificationCounterEntries({}));
      dispatch(getGlobalRecipients({}));
      dispatch(getNotificationSettings({}));
      if (user && user.type === "internal") dispatch(getCompanyChannel());
    };

    if (user && user.type === "internal") dispatch(getCompanyChannel());
    channelActions.loadMore({ skip: 0, limit: 15 }, fetchChannelCb);
    dispatch(getSkippedAnswers({}));
    dispatch(
      getHuddleChatbot({}, (err, res) => {
        if (err) return;
        dispatch(adjustHuddleDate());
        if (res.data) {
          res.data.forEach((d) => {
            getChannelsWithUnpublishedMessage(d.channel.id);
          });
        }
      })
    );
  }, []);
};

export default useInitialLoad;
