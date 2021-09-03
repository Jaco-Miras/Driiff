import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getNotifications, getAllSnoozedNotification } from "../../redux/actions/notificationActions";
import { getUsers, getExternalUsers, getArchivedUsers } from "../../redux/actions/userAction";
import { getAllRecipients, getQuickLinks, getUnreadNotificationCounterEntries, getToDoDetail, getDrafts } from "../../redux/actions/globalActions";
import { getGlobalRecipients, getHuddleChatbot, getCompanyChannel, adjustHuddleDate, getUnpublishedAnswers, getSkippedAnswers, addHasUnpublishedAnswers } from "../../redux/actions/chatActions";
import { useChannelActions } from "../hooks";

const useInitialLoad = () => {
  const notifications = useSelector((state) => state.notifications.notifications);
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
      dispatch(getAllRecipients());
      dispatch(
        getUsers({}, () => {
          dispatch(getArchivedUsers());
        })
      );
      dispatch(getExternalUsers());
      dispatch(getDrafts());
      if (Object.keys(notifications).length === 0) {
        dispatch(getAllSnoozedNotification({}, () => {
          dispatch(getNotifications({ skip: 0, limit: 50 }));
        }))
      }
      dispatch(getUnreadNotificationCounterEntries({ add_unread_comment: 1 }));
      dispatch(getQuickLinks());
      dispatch(getToDoDetail());
      dispatch(getGlobalRecipients());
    };
    if (user && user.type === "internal") dispatch(getCompanyChannel());
    channelActions.loadMore({ skip: 0, limit: 25 }, fetchChannelCb);
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
