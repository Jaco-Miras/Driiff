import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useHistory, useRouteMatch } from "react-router-dom";
import useChannelActions from "./useChannelActions";

const useLoadChannel = () => {
  const { channels, lastVisitedChannel } = useSelector((state) => state.chat);
  const actions = useChannelActions();

  const route = useRouteMatch();
  const history = useHistory();
  const {params, url} = route;
  
  useEffect(() => {
    const fetchLastVisited = () => {
        let cb = (callback,channel) => {
            actions.select({
                ...channel.data,
                hasMore: true,
                skip: 0,
                selected: false,
                isFetching: false,
            });
            if (url === "/chat") {
                history.push(`/chat/${channel.data.code}`);
            }
        }
        actions.fetchLastVisited(cb);
    };

    if (lastVisitedChannel) {
        actions.select(channels[lastVisitedChannel.id]);
        if (url === "/chat" && typeof params.code === "undefined") {
            history.push(`/chat/${lastVisitedChannel.code}`);
        }
    } else if (typeof params.code === "undefined") {
        fetchLastVisited();
    } else {
        actions.fetchByCode(params.code, (err, res) => {
            if (err) {
                fetchLastVisited();
            }
            if (res) {
                let channel = {
                    ...res.data,
                    hasMore: true,
                    skip: 0,
                    selected: false,
                    isFetching: false
                }
              actions.select(channel);
              actions.setLastVisitedChannel(channel);
            }
        });
    }
    
  }, []);
};

export default useLoadChannel;
