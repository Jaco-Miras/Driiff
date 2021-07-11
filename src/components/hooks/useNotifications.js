import { useSelector } from "react-redux";

const useNotifications = (props) => {
  const { notifications, unreadCount, is_snooze } = useSelector((state) => state.notifications);

  return {
    notifications,
    unreadCount,
    unreadNotifications: Object.values(notifications).filter((n) => n.is_read === 0).length,
    is_snooze
  };
};

export default useNotifications;
