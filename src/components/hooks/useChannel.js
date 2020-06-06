import {useCallback, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    createNewChat,
    getChannel,
    getChannels,
    getLastVisitedChannel,
    renameChannelKey,
    saveLastVisitedChannel,
    setSelectedChannel,
    updateChannel,
} from "../../redux/actions/chatActions";
import {useSettings} from "./index";

let init = true;
let limit = 50;

/**
 * @returns {{createUserChannel: (...args: any[]) => any, channels, fetchChannels: (...args: any[]) => any, selectedChannel, unArchiveUser: (...args: any[]) => any, channelsLoaded, selectChannel: (...args: any[]) => any, loadSelectedChannel: (...args: any[]) => any}}
 */
const useChannel = () => {

    const {chatSettings} = useSettings();

    const dispatch = useDispatch();
    const sharedSlugs = useSelector(state => state.global.slugs);
    const {channels, selectedChannel, channelsLoaded, lastVisitedChannel} = useSelector(state => state.chat);

    const loadSelectedChannel = useCallback((code,
                                             callback = () => {
                                             }) => {
        dispatch(
            getChannel({code: code}, callback),
        );
    });

    const createUserChannel = useCallback((channel,
                                           callback = () => {
                                           }) => {
        let old_channel = channel;
        dispatch(
            createNewChat({
                title: "",
                type: "person",
                recipient_ids: channel.recipient_ids,
            }, (err, res) => {
                if (err)
                    console.log(err);

                if (res) {
                    let timestamp = Math.round(+new Date() / 1000);
                    let channel = {
                        ...res.data.channel,
                        old_id: old_channel.id,
                        code: res.data.code,
                        selected: true,
                        hasMore: false,
                        skip: 0,
                        replies: [],
                        created_at: {
                            timestamp: timestamp,
                        },
                        last_reply: null,
                        title: old_channel.first_name,
                    };
                    dispatch(
                        renameChannelKey(channel, callback),
                    );
                }
            }),
        );
    }, []);

    const unArchiveChannel = useCallback((channel) => {
        let payload = {
            id: channel.id,
            is_pinned: channel.is_pinned,
            is_archived: 0,
            is_muted: channel.is_muted,
            //title: channel.title,
        };

        if (channel.is_shared && sharedSlugs.length) {
            payload = {
                ...payload,
                is_shared: true,
                token: sharedSlugs.filter(s => s.slug_name === channel.slug_owner)[0].access_token,
                slug: sharedSlugs.filter(s => s.slug_name === channel.slug_owner)[0].slug_name,
            };
        }
        dispatch(
            updateChannel(payload, () => {
                dispatch(
                    setSelectedChannel({...channel, is_archived: 0}),
                );
            }),
        );
    }, []);

    const selectChannel = useCallback((channel, callback = () => {
    }) => {
        //if contact doesn't have a chat channel yet
        if (typeof channel === "undefined") {
            console.log(channel, "channel not found");
        } else if (channel.hasOwnProperty("add_user") && channel.add_user === true) {
            createUserChannel(channel);

            //if unarchived archived chat
        } else if (channel.is_archived === 1) {
            unArchiveChannel(channel);

        } else {
            dispatch(
                setSelectedChannel({...channel, selected: true}),
            );
            callback(channel);
        }
    }, []);

    const fetchChannels = useCallback(({skip = 0, limit = limit, ...res},
                                       callback = () => {
                                       }) => {
        let payload = {
            ...res,
            skip: skip,
            limit: limit,
            order_by: chatSettings.order_channel.order_by,
            sort_by: chatSettings.order_channel.sort_by.toLowerCase(),
        };

        dispatch(
            getChannels(payload, callback),
        );
    });

    const fetchAllChannels = useCallback(({skip = 0, limit = limit, ...res},
                                          callback = () => {
                                          }) => {
        let payload = {
            ...res,
            skip: skip,
            limit: limit,
            order_by: chatSettings.order_channel.order_by,
            sort_by: chatSettings.order_channel.sort_by.toLowerCase(),
        };

        dispatch(
            getChannels(payload, (err, res) => {
                if (err) {
                    console.log(err);
                }

                if (res.data.results.length === limit) {
                    fetchAllChannels({
                        ...payload,
                        skip: payload.skip + limit,
                    });
                } else {
                    callback(err, res);
                }
            }),
        );
    });

    useEffect(() => {
        if (init) {
            init = false;

            dispatch(
                getLastVisitedChannel({}, (err, res) => {
                    console.log(res.data);
                    loadSelectedChannel(res.data.code, (err, res) => {
                        if (err) {
                            console.log(err);
                        }

                        if (res) {
                            dispatch(
                                saveLastVisitedChannel(res.data),
                            );
                        }
                    });
                }),
            );

            fetchAllChannels({
                skip: 0,
                limit: 100,
            });

            fetchAllChannels({
                skip: 0,
                limit: 20,
                filter: "hidden",
            });

            fetchAllChannels({
                skip: 0,
                limit: 20,
                filter: "archived",
            });
        }

        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return {
        channels,
        selectedChannel,
        lastVisitedChannel,
        channelsLoaded,
        loadSelectedChannel,
        unArchiveChannel,
        createUserChannel,
        selectChannel,
        fetchChannels,
    };
};

export default useChannel;