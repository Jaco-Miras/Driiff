import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getChannels} from "../../redux/actions/chatActions";

const useLoadChannels = () => {

    const dispatch = useDispatch();
    //const settings  = useSelector(state => state.user.settings)
    const channels = useSelector(state => state.chat.channels);
    const [activeChannelsLoaded, setActiveChannelsLoaded] = useState(false);
    const [hiddenChannelsLoaded, setHiddenChannelsLoaded] = useState(false);
    const [archivedChannelsLoaded, setArchivedChannelsLoaded] = useState(false);

    useEffect(() => {
        let activeChannelSkip = 0;
        let hiddenChannelSkip = 0;
        let archiveChannelSkip = 0;

        const fetchChannels = (hasMore = false, limit = 5, filter = null) => {
            let payload = {
                skip: filter === "hidden" ? hiddenChannelSkip : filter === "archived" ? archiveChannelSkip : activeChannelSkip,
                limit: limit,
                order_by: "channel_name",
                sort_by: "asc",
                // order_by: settings.CHAT_SETTINGS.order_channel.order_by,
                // sort_by: settings.CHAT_SETTINGS.order_channel.sort_by.toLowerCase(),
            };
            if (filter) {
                payload = {
                    ...payload,
                    filter: filter,
                };
            }
            dispatch(
                getChannels(payload, (err, res) => {
                    if (err) return;
                    if (res.data.results.length === 20 && filter === null) {
                        activeChannelSkip += 20;
                        fetchChannels(true, 20);
                    } else if (res.data.results.length === limit && filter === "hidden") {
                        hiddenChannelSkip += limit;
                        fetchChannels(true, limit, "hidden");
                    } else if (res.data.results.length === limit && filter === "archived") {
                        archiveChannelSkip += limit;
                        fetchChannels(true, limit, "archived");
                    } else {
                        if (filter === "hidden") {
                            setHiddenChannelsLoaded(true);
                        } else if (filter === "archived") {
                            setArchivedChannelsLoaded(true);
                        } else {
                            setActiveChannelsLoaded(true);
                        }
                    }
                }),
            );
        };
        
        if (Object.keys(channels).length === 0) {
            fetchChannels(true, 20);
            fetchChannels(true, 5, "hidden");
            fetchChannels(true, 5, "archived");
        }
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (archivedChannelsLoaded && hiddenChannelsLoaded && activeChannelsLoaded) {
            console.log("channels loaded");
        }
    }, [activeChannelsLoaded, hiddenChannelsLoaded, archivedChannelsLoaded]);
};

export default useLoadChannels;