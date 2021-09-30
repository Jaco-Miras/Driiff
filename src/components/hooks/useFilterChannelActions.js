import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import useSettings from "./useSettings";
import { getUnreadChannels } from "../../redux/actions/chatActions";

const useFilterChannelActions = () => {
  const dispatch = useDispatch();
  const unreadChannels = useSelector((state) => state.chat.unreadChannels);
  const { setChatSetting, chatSettings } = useSettings();

  const filterChannel = () => {
    setChatSetting({
      filter_channel: !chatSettings.filter_channel,
    });
  };

  const fetchUnreadChanels = ({ skip = 0, limit = 25, ...res }, callback = () => {}) => {
    let payload = {
      skip: skip,
      limit: limit,
      order_by: chatSettings.order_channel.order_by,
      sort_by: chatSettings.order_channel.sort_by.toLowerCase(),
    };

    dispatch(getUnreadChannels(payload, callback));
  };

  useEffect(() => {
    if (chatSettings.filter_channel && !unreadChannels.fetching && unreadChannels.hasMore) {
      fetchUnreadChanels({ skip: unreadChannels.skip, limit: unreadChannels.limit });
    }
  }, [unreadChannels, chatSettings.filter_channel]);

  return {
    filterChannel,
    fetchUnreadChanels,
    chatSettings,
  };
};

export default useFilterChannelActions;
