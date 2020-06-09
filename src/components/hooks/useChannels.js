import {useEffect} from "react";
import {useSelector} from "react-redux";
import useChannelActions from "./useChannelActions";

let init = true;

/**
 * @returns {{channels, selectedChannel, lastVisitedChannel, actions: {fetchMembersById: (...args: any[]) => any, saveHistoricalPosition: (...args: any[]) => any, unArchive, fetchNoChannelUsers: (...args: any[]) => any, createByUserChannel: (...args: any[]) => any, select, update, unMute, markAsRead, searchExisting, pin, fetchLastVisited: (...args: any[]) => any, fetchByCode: (...args: any[]) => any, unPin, fetchAll: (...args: any[]) => any, saveLastVisited: (...args: any[]) => any, archive, mute, unHide, updateName, hide, addMembers, deleteMembers, fetch: (...args: any[]) => any, fetchDrafts: (...args: any[]) => any, markAsUnRead}, channelsLoaded}}
 */
const useChannels = () => {
    const {channels, selectedChannel, channelsLoaded, lastVisitedChannel} = useSelector(state => state.chat);
    const actions = useChannelActions();

    useEffect(() => {
        if (init) {
            init = false;

            actions.fetchAll({
                skip: 0,
                limit: 100,
            });

            actions.fetchAll({
                skip: 0,
                limit: 20,
                filter: "hidden",
            });

            actions.fetchAll({
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