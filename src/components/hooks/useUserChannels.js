import {useCallback, useEffect, useRef} from "react";
import {useChannels, useUsers} from "./index";

let init = true;

/**
 * @returns {{fetchUsers: function({skip?: *, limit?: *, [p: string]: *}, *=): void, selectUserChannel: (...args: any[]) => any, getUserFilter: *, channels: *, userChannels: {}, selectedChannel: *, fetchMoreUsers: function(): void, lastVisitedChannel: *, actions: {fetchMembersById: function(*=, *=): void, saveHistoricalPosition: function(*=, *, *=): void, unArchive: function(*=, *=): void, fetchNoChannelUsers: function(*=): void, createByUserChannel: function(*, *=): void, select: function(*=, *=): void, update: function(*, *, *=): void, unMute: function(*=, *=): void, markAsRead: function(*=, *=): void, searchExisting: function(*=, *=, *=): void, pin: function(*=, *=): void, fetchLastVisited: function(*=): void, fetchByCode: function(*=, *=): void, unPin: function(*=, *=): void, fetchAll: function({skip?: *, limit?: *, [p: string]: *}, *=): void, saveLastVisited: function(*=, *=): void, archive: function(*=, *=): void, mute: function(*=, *=): void, unHide: function(*=, *=): void, updateName: function(*=, *=, *=): void, hide: function(*=, *=): void, addMembers: function(*=, *=, *=): void, deleteMembers: function(*=, *=, *=): void, fetch: function({skip?: *, limit?: *, [p: string]: *}, *=): void, fetchDrafts: function(*=): void, markAsUnRead: function(*=, *=): void}, channelsLoaded: *, users: *}}
 */
const useUserChannels = () => {

    const {channels, actions: channelActions} = useChannels();
    const userChannels = useRef({});

    for (const i in channels) {
        let channel = channels[i];

        if (channel.type !== "DIRECT")
            continue;

        if(userChannels)
        if (userChannels.current.hasOwnProperty(channel.profile.id))
            continue;

        userChannels.current = {
            ...userChannels.current,
            [channel.profile.id]: channel.id,
        };
    }

    const selectUserChannel = useCallback((user,
                                           callback = () => {
                                           }) => {
        try {
            channelActions.select(channels[userChannels.current[user.id]], callback);
        }
        catch (e) {
            console.log("no channel from selected user");
        }
    }, [channels, channelActions]);

    useEffect(() => {
        if (init) {
            init = false;
            channelActions.fetchNoChannelUsers((err) => {
                if (err)
                    init = false;
            });
        }

        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return {
        ...useChannels(),
        ...useUsers(),
        userChannels: userChannels.current,
        selectUserChannel,
    };
};

export default useUserChannels;