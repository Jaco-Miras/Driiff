import {useCallback} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    createNewChat,
    getChannel,
    getChannels,
    getGlobalRecipients,
    getLastVisitedChannel,
    renameChannelKey,
    setChannelHistoricalPosition,
    setLastVisitedChannel,
    setSelectedChannel,
    updateChannel,
} from "../../redux/actions/chatActions";
import {useSettings} from "./index";

/**
 * @returns {{createUserChannel: (...args: any[]) => any, fetchChannels: (...args: any[]) => any, unArchiveChannel: (...args: any[]) => any, fetchAllChannels: (...args: any[]) => any, selectChannel: (...args: any[]) => any, loadSelectedChannel: (...args: any[]) => any}}
 */
const useChannelActions = () => {

    const dispatch = useDispatch();
    const {chatSettings} = useSettings();
    const sharedSlugs = useSelector(state => state.global.slugs);

    const loadSelectedChannel = useCallback((code,
                                             callback = () => {}) => {
        dispatch(
            getChannel({code: code}, callback),
        );
    }, [dispatch]);

    const createUserChannel = useCallback((channel,
                                           callback = () => {}) => {
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
                        renameChannelKey(channel, (err) => {
                            if (err) {
                                console.log(err);
                            }

                            callback(err, {
                                data: channel,
                            });
                        }),
                    );
                }
            }),
        );
    }, [dispatch]);

    const unArchiveChannel = useCallback(({channel},
                                          callback = () => {}) => {
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
            updateChannel(payload, (err) => {
                callback(err, {
                    data: {...channel, is_archived: 0},
                });
            }),
        );
    }, [dispatch, sharedSlugs]);

    const selectChannel = useCallback((channel,
                                       callback = () => {}) => {
        //if contact doesn't have a chat channel yet
        if (typeof channel === "undefined") {
            console.log(channel, "channel not found");

        } else if (channel.hasOwnProperty("add_user") && channel.add_user === true) {
            createUserChannel(channel, (err, res) => {
                const data = res.data;
                dispatch(
                    setSelectedChannel(res.data, () => {
                        callback(data);
                    }),
                );
            });

            //if unarchived archived chat
        } else if (channel.is_archived === 1) {
            unArchiveChannel(channel, (err, res) => {
                const channel = res.data;
                dispatch(
                    setSelectedChannel(res.data, () => {
                        callback(channel);
                    }),
                );
            });

        } else {
            if (!channel.hasOwnProperty("replies")) {
                channel = {
                    ...channel,
                    replies: [],
                };
            }
            dispatch(
                setSelectedChannel({
                    ...channel,
                    selected: true,
                }),
            );
            callback(channel);
        }
    }, [dispatch, createUserChannel, unArchiveChannel]);

    const fetchChannels = useCallback(({skip = 0, limit = 20, ...res},
                                       callback = () => {}) => {
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
    }, [dispatch, chatSettings.order_channel.order_by, chatSettings.order_channel.sort_by]);

    const fetchAllChannels = useCallback(({skip = 0, limit = 20, ...res},
                                          callback = () => {}) => {
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
    }, [dispatch, chatSettings.order_channel.order_by, chatSettings.order_channel.sort_by]);

    const fetchLastVisitedChannel = useCallback((
        callback = () => {}) => {
        dispatch(
            getLastVisitedChannel({}, callback),
        );
    }, [dispatch]);

    const saveLastVisitedChannel = useCallback((channel,
                                                callback = () => {}) => {
        dispatch(
            setLastVisitedChannel(channel, callback),
        );
    }, [dispatch]);

    const saveHistoricalPosition = useCallback((channelId, scrollComponent, callback = () => {}) => {
        dispatch(
            setChannelHistoricalPosition({
                channel_id: channelId,
                scrollPosition: scrollComponent.scrollHeight - scrollComponent.scrollTop,
            }, callback),
        );
    }, [dispatch]);

    const fetchNoUserChannels = useCallback((callback) => {
        dispatch(
            getGlobalRecipients({}, callback),
        );
    }, [dispatch]);

    return {
        createUserChannel,
        fetchAllChannels,
        fetchChannels,
        fetchNoUserChannels,
        loadSelectedChannel,
        saveHistoricalPosition,
        saveLastVisitedChannel,
        selectChannel,
        unArchiveChannel,
        fetchLastVisitedChannel,
    };
};

export default useChannelActions;