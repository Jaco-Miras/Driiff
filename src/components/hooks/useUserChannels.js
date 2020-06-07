import {useCallback, useEffect, useRef} from "react";
import {useDispatch} from "react-redux";
import {getGlobalRecipients} from "../../redux/actions/chatActions";
import {useChannels, useUsers} from "./index";

let init = true;

/**
 * @returns {{fetchUsers: function({skip?: *, limit?: *, [p: string]: *}, *=): void, userChannels: {}, unArchiveChannel: function(*, *=): void, selectedChannel: *, fetchMoreUsers: function(): void, selectChannel: function(*=, *=): void, loadSelectedChannel: function(*=, *=): void, users: *, createUserChannel: function(*, *=): void, selectUserChannel: (...args: any[]) => any, channels: *, fetchChannels: function({skip?: *, limit?: *, [p: string]: *}, *=): void, lastVisitedChannel: *, channelsLoaded: *}}
 */
const useUserChannels = () => {

    const dispatch = useDispatch();

    const users = useUsers();
    const {channels, selectChannel} = useChannels();
    const userChannels = useRef({});

    const selectUserChannel = useCallback((user,
                                           callback = () => {
                                           }) => {
        try {
            selectChannel(channels[userChannels.current[user.id]], callback);
        }
        catch (e) {
            console.log("no channel from selected user");
        }
    }, [channels, selectChannel]);

    useEffect(() => {
        for (const i in channels) {
            let channel = channels[i];

            if (channel.type !== "DIRECT")
                continue;

            userChannels.current = {
                ...userChannels.current,
                [channel.profile.id]: channel.id,
            };
        }
    }, [users, channels]);

    useEffect(() => {
        if (init) {
            init = false;
            dispatch(
                getGlobalRecipients({}, (err) => {
                    if (err) {
                        console.log(err);
                        init = true;
                    }
                }),
            );
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