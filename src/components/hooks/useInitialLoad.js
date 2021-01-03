import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getNotifications } from "../../redux/actions/notificationActions";
import { getUsers, getExternalUsers } from "../../redux/actions/userAction";
import { getAllRecipients, getQuickLinks, getUnreadNotificationCounterEntries, getToDoDetail, getDrafts } from "../../redux/actions/globalActions";
//import { getUnreadPostEntries } from "../../redux/actions/postActions";
import { getChannels, getGlobalRecipients, getHuddleChatbot } from "../../redux/actions/chatActions";

const useInitialLoad = () => {
  const notifications = useSelector((state) => state.notifications.notifications);

  const [hasMoreChannels, setHasMoreChannels] = useState(null);
  const [skip, setSkip] = useState(0);
  const [isFetching, setIsFetching] = useState(false);

  const dispatch = useDispatch();

  const fetchChannels = (callback = null) => {
    setIsFetching(true);
    setSkip(skip + 50);
    dispatch(
      getChannels({ skip: skip, limit: 50 }, (err, res) => {
        if (callback) callback();
        setIsFetching(false);
        if (err) return;

        setHasMoreChannels(res.data.results.length === 50);
      })
    );
  };

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
      dispatch(getHuddleChatbot({}));
    };
    fetchChannels(fetchChannelCb);

    setInterval(() => {
      const currentDate = new Date();
      const currentDay = currentDate.getDay();
      const huddleStorage = localStorage.getItem("huddle");
      if (huddleStorage) {
        const { day } = JSON.parse(huddleStorage);
        if (day < currentDay || currentDay === 0 || currentDay === 6) {
          localStorage.removeItem("huddle");
        }
      }
    }, 60000);
  }, []);

  useEffect(() => {
    if (hasMoreChannels && !isFetching) {
      fetchChannels();
    }
  }, [hasMoreChannels, fetchChannels, skip, isFetching]);
};

export default useInitialLoad;
