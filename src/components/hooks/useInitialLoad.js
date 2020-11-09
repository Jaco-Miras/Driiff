import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getNotifications } from "../../redux/actions/notificationActions";
import { getUsers } from "../../redux/actions/userAction";
import { getAllRecipients } from "../../redux/actions/globalActions";
import { getUnreadPostEntries } from "../../redux/actions/postActions";
import { getChannels } from "../../redux/actions/chatActions";

const useInitialLoad = () => {
  
  const notifications = useSelector((state) => state.notifications.notifications);

  const [hasMoreChannels, setHasMoreChannels] = useState(null);
  const [skip, setSkip] = useState(0);
  const [isFetching, setIsFetching] = useState(false);

  const dispatch = useDispatch();

  const fetchChannels = () => {
    setIsFetching(true);
    setSkip(skip + 50);
    dispatch(
      getChannels({skip: skip, limit: 50}, (err,res) => {
        setIsFetching(false);
        if (err) return;
        
        setHasMoreChannels(res.data.results.length === 50);
      })
    );
  }

  useEffect(() => {
    document.body.classList.remove("form-membership");
    fetchChannels();
    dispatch(getAllRecipients());
    dispatch(getUsers());
    dispatch(getUnreadPostEntries());
    // if (Object.keys(files).length === 0) {
    //   dispatch(getFiles({sort: "desc"}));
    // }
    if (Object.keys(notifications).length === 0) {
      dispatch(getNotifications({skip: 0, limit: 50}));
    }
    //fetchRoles();
  }, []);

  useEffect(() => {
    if (hasMoreChannels && !isFetching) {
      fetchChannels();
    }
  }, [hasMoreChannels, fetchChannels, skip, isFetching])

};

export default useInitialLoad;
