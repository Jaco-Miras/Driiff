import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import useChannelActions from "./useChannelActions";

const useLoadChannel = () => {
  const channels = useSelector((state) => state.chat.channels);
  const lastVisitedChannel = useSelector((state) => state.chat.lastVisitedChannel);
  const actions = useChannelActions();

  const params = useParams();

  useEffect(() => {
    if (lastVisitedChannel) {
      actions.select(channels[lastVisitedChannel.id]);
    } else if (typeof params.code === "undefined") {
      actions.fetchLastChannel();
    } else {
      actions.fetchSelectChannel(params.code);
    }
  }, []);
};

export default useLoadChannel;
