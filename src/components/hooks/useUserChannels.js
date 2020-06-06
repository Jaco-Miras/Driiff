import React, {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {getGlobalRecipients} from "../../redux/actions/chatActions";
import {useChannel, useUsers} from "./index";

let init = true;

/**
 * @returns {{createUserChannel: function(*): void, fetchUsers: function(*=, *=): void, selectUserChannel: selectUserChannel, channels: *, fetchChannels: function(*=, *=, *=): void, selectedChannel: *, fetchMoreUsers: function(): void, unArchiveUser: function(*): void, channelsLoaded: *, selectChannel: function(*=, *=): void, loadSelectedChannel: function(*=): void, users: *}}
 */
const useUserChannels = () => {

    const dispatch = useDispatch();

    const users = useUsers();
    const {channels, selectChannel} = useChannel();
    const [userChannel, setUserChannel] = useState({});
    const directChannels = Object.keys(channels)
        .filter(key => channels[key].type === "DIRECT")
        .reduce((obj, key) => {
            obj[key] = channels[key];
            return obj;
        }, {});

    const selectUserChannel = (user,
                               callback = () => {
                               }) => {

        if (userChannel.hasOwnProperty(user.id) && channels.hasOwnProperty(userChannel[user.id])) {
            selectChannel(channels[userChannel[user.id]], callback);
        }
    };

    useEffect(() => {
        for (const i in directChannels) {
            let channel = directChannels[i];
            if (!userChannel.hasOwnProperty(channel.profile.id)) {
                setUserChannel({
                    ...userChannel,
                    [channel.profile.id]: channel.id,
                });
            }
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
    }, []);

    return {
        ...useChannel(),
        ...useUsers(),
        userChannel,
        selectUserChannel,
    };
};

export default useUserChannels;