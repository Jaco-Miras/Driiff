import { useDispatch } from "react-redux";
import { snoozeNotification, snoozeAllNotification } from "../../redux/actions/notificationActions";

const useSnoozeActions = () => {
  const dispatch = useDispatch();
  const snoozeNotif = (payload) => {
    dispatch(snoozeNotification(payload));
  };

  const snoozeAllNotif = (payload) => {
    dispatch(snoozeAllNotification(payload));
  };

  return {
    snoozeNotif,
    snoozeAllNotif,
  };
};

export default useSnoozeActions;
