import {useCallback, useEffect, useRef} from "react";
import {useChannels, useUsers} from "./index";

let init = true;

/**
 * @returns {{fetchUsers: function({skip?: *, limit?: *, [p: string]: *}, *=): void, selectUserChannel: (...args: any[]) => any, getUserFilter: *, channels: *, userChannels: {}, selectedChannel: *, fetchMoreUsers: function(): void, lastVisitedChannel: *, actions: {createUserChannel: function(*, *=): void, saveHistoricalPosition: function(*=, *, *=): void, fetchChannels: function({skip?: *, limit?: *, [p: string]: *}, *=): void, fetchNoUserChannels: function(*=): void, fetchLastVisitedChannel: function(*=): void, unArchiveChannel: function({channel: *, sharedSlugs: *}, *=): void, fetchAllChannels: function({skip?: *, limit?: *, [p: string]: *}, *=): void, selectChannel: function(*=, *=): void, loadSelectedChannel: function(*=, *=): void, saveLastVisitedChannel: function(*=, *=): void}, channelsLoaded: *, users: *}}
 */
const useUserChannels = () => {

    const {channels, actions: chatActions} = useChannels();
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
            chatActions.selectChannel(channels[userChannels.current[user.id]], callback);
        }
        catch (e) {
            console.log("no channel from selected user");
        }
    }, [channels, chatActions]);

    useEffect(() => {
        if (init) {
            init = false;
            chatActions.fetchNoUserChannels((err) => {
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