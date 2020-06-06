import {useCallback, useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {getGlobalRecipients} from "../../redux/actions/chatActions";
import {useChannel, useUsers} from "./index";

let init = true;

/**
 * @returns {{fetchUsers: function({skip?: *, limit?: *, [p: string]: *}, *=): void, unArchiveChannel: function(*): void, selectedChannel: *, fetchMoreUsers: function(): void, selectChannel: function(*=, *=): void, loadSelectedChannel: function(*=, *=): void, users: *, createUserChannel: function(*, *=): void, selectUserChannel: (...args: any[]) => any, channels: *, fetchChannels: function({skip?: *, limit?: *, [p: string]: *}, *=): void, userChannel: {}, lastVisitedChannel: *, channelsLoaded: *}}
 */
const useUserChannels = () => {

    const dispatch = useDispatch();

    const users = useUsers();
    const {channels, selectChannel} = useChannel();
    const [userChannel, setUserChannel] = useState({});

    const selectUserChannel = useCallback((user,
                                           callback = () => {
                                           }) => {
        for (const i in channels) {
            let channel = channels[i];

            if (channel.type !== "DIRECT")
                continue;

            if (channel.profile.id === user.id) {
                selectChannel(channel, callback);
            }
        }
    }, [channels, selectChannel]);

    useEffect(() => {
        for (const i in channels) {
            let channel = channels[i];

            if (channel.type !== "DIRECT")
                continue;

            if (!userChannel.hasOwnProperty(channel.profile.id)) {
                setUserChannel({
                    ...userChannel,
                    [channel.profile.id]: channel.id,
                });
            }
        }
    }, [users, channels, userChannel]);

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

        /*setDirectChannels(Object.keys(channels)
         .filter(key => channels[key].type === "DIRECT")
         .reduce((obj, key) => {
         obj[key] = channels[key];
         return obj;
         }, {}));*/

        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return {
        ...useChannel(),
        ...useUsers(),
        userChannel,
        selectUserChannel,
    };
};

export default useUserChannels;