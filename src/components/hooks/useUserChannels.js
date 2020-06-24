import {useCallback, useEffect, useRef} from "react";
import {useChannels, useUsers} from "./index";

let init = true;

const useUserChannels = () => {

    const {channels, actions: channelActions} = useChannels();
    const userChannels = useRef({});

    for (const i in channels) {
        if (channels.hasOwnProperty(i)) {
            let channel = channels[i];

            if (channel.type !== "DIRECT")
                continue;

            if (userChannels)
                if (userChannels.current.hasOwnProperty(channel.profile.id))
                    continue;

            userChannels.current = {
                ...userChannels.current,
                [channel.profile.id]: channel.id,
            };
        }
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