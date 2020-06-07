import {useEffect} from "react";
import {useSelector} from "react-redux";
import useChannelActions from "./useChannelActions";

let init = true;

/**
 * @returns {{channels, selectedChannel, lastVisitedChannel, actions: {createUserChannel: (...args: any[]) => any, saveHistoricalPosition: (...args: any[]) => any, fetchChannels: (...args: any[]) => any, fetchNoUserChannels: (...args: any[]) => any, fetchLastVisitedChannel: (...args: any[]) => any, unArchiveChannel: (...args: any[]) => any, fetchAllChannels: (...args: any[]) => any, selectChannel: (...args: any[]) => any, loadSelectedChannel: (...args: any[]) => any, saveLastVisitedChannel: (...args: any[]) => any}, channelsLoaded}}
 */
const useChannels = () => {
    const {channels, selectedChannel, channelsLoaded, lastVisitedChannel} = useSelector(state => state.chat);
    const actions = useChannelActions();

    useEffect(() => {
        if (init) {
            init = false;

            actions.fetchAllChannels({
                skip: 0,
                limit: 100,
            });

            actions.fetchAllChannels({
                skip: 0,
                limit: 20,
                filter: "hidden",
            });

            actions.fetchAllChannels({
                skip: 0,
                limit: 20,
                filter: "archived",
            });
        }

        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return {
        actions,
        channels,
        selectedChannel,
        lastVisitedChannel,
        channelsLoaded,
    };
};

export default useChannels;