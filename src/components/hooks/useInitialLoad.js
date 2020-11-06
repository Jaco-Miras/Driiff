import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getNotifications } from "../../redux/actions/notificationActions";
import { getUsers } from "../../redux/actions/userAction";
import { getAllRecipients } from "../../redux/actions/globalActions";
import { getUnreadPostEntries } from "../../redux/actions/postActions";
import { getChannels } from "../../redux/actions/chatActions";

const useInitialLoad = () => {
  
  const notifications = useSelector((state) => state.notifications.notifications);

  const dispatch = useDispatch();

  useEffect(() => {
    document.body.classList.remove("form-membership");
    dispatch(getChannels({skip: 0, limit: 100}));
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

};

export default useInitialLoad;
