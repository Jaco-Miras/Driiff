import { useSelector } from "react-redux";

const useNotifications = (props) => {
  const { notifications, unreadCount } = useSelector((state) => state.notifications);

  return {
    notifications,
    unreadCount,
  };
};

export default useNotifications;
