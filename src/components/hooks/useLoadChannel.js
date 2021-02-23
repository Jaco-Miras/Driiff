import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import useChannelActions from "./useChannelActions";

const useLoadChannel = () => {
  const channels = useSelector((state) => state.chat.channels);
  const lastVisitedChannel = useSelector((state) => state.chat.lastVisitedChannel);
  const actions = useChannelActions();

  // const route = useRouteMatch();
  // const history = useHistory();
  // const { params, url } = route;
  const params = useParams();

  useEffect(() => {
    if (lastVisitedChannel) {
      actions.select(channels[lastVisitedChannel.id]);
      // if (url === "/chat" && typeof params.code === "undefined") {
      //   history.push(`/chat/${lastVisitedChannel.code}`);
      // }
    } else if (typeof params.code === "undefined") {
      actions.fetchLastChannel();
    } else {
      actions.fetchSelectChannel(params.code);
    }
  }, []);
};

export default useLoadChannel;
