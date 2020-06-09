import {useCallback} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    deleteChannelMembers,
    getChannel,
    getChannelDrafts,
    getChannelMembers,
    getChannels,
    getGlobalRecipients,
    getLastVisitedChannel,
    postChannelMembers,
    postCreateChannel,
    postSearchExistingChannels,
    putChannel,
    putChannelUpdateName,
    putMarkReadChannel,
    putMarkUnreadChannel,
    renameChannelKey,
    setChannel,
    setChannelHistoricalPosition,
    setLastVisitedChannel,
    setSelectedChannel,
} from "../../redux/actions/chatActions";
import {useSettings} from "./index";

const useChannelActions = () => {

    const {chatSettings} = useSettings();

    const sharedSlugs = useSelector(state => state.global.slugs);

    const dispatch = useDispatch();

    /**
     * @param {Object} channel
     * @returns {{}|{is_shared: boolean, slug: string, token: string}}
     */
    const getSharedPayload = useCallback((channel) => {
        if (channel.is_shared && sharedSlugs.length) {
            return {
                is_shared: true,
                token: sharedSlugs.filter(s => s.slug_name === channel.slug_owner)[0].access_token,
                slug: sharedSlugs.filter(s => s.slug_name === channel.slug_owner)[0].slug_name,
            };
        } else {
            return {};
        }
    }, [sharedSlugs]);

    /**
     * @param {string} code - channel.code
     * @param {function} [callback]
     */
    const fetchByCode = useCallback((
        code,
        callback = () => {}) => {

        dispatch(
            getChannel({code: code}, callback),
        );
    }, [dispatch]);

    /**
     *
     * @param {Object} payload
     * @param {string} payload.title
     * @param {string} payload.type
     * @param {Array} payload.recipient_ids
     * @param {string} [payload.message_body]
     */
    const create = useCallback((payload, callback) => {
        dispatch(
            postCreateChannel(payload, callback),
        );
    }, [dispatch]);

    /**
     * @param {Object} channel - from fetchNoChannelUsers
     * @param {function} [callback]
     */
    const createByUserChannel = useCallback((
        channel,
        callback = () => {}) => {

        let old_channel = channel;

        create({
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
        });
    }, [dispatch, create]);

    /**
     * @param {Object} channel
     * @param {Object} channelUpdate - channel attributes update
     * @param {function} [callback]
     */
    const update = useCallback((channel, channelUpdate, callback = () => {}) => {
        let payload = {
            is_pinned: channel.is_pinned,
            is_muted: channel.is_muted,
            is_archived: channel.is_archived,
        };

        payload = {
            ...payload,
            ...channelUpdate,
            ...getSharedPayload(channel.is_shared),
        };

        dispatch(
            putChannel(payload, (err) => {
                let updatedChannel = {
                    ...channel,
                    ...channelUpdate,
                };
                dispatch(
                    setChannel(updatedChannel, () => {
                        callback(err, {
                            data: updatedChannel,
                        });
                    }),
                );
            }),
        );
    }, [dispatch, sharedSlugs]);

    /**
     * @param {Object} channel
     * @param {function} [callback]
     */
    const archive = useCallback((
        channel,
        callback = () => {}) => {
        let payload = {
            id: channel.id,
            is_archived: 1,
        };

        update(channel, payload, callback);
    }, [update]);

    /**
     * @param {Object} channel
     * @param {function} [callback]
     */
    const unArchive = useCallback((
        channel,
        callback = () => {}) => {

        let payload = {
            id: channel.id,
            is_archived: 0,
        };

        update(channel, payload, callback);
    }, [update]);

    /**
     * @param {Object} channel
     * @param {function} [callback]
     */
    const pin = useCallback((
        channel,
        callback = () => {}) => {

        let payload = {
            id: channel.id,
            is_pinned: 1,
        };

        update(channel, payload, callback);
    }, [update]);

    /**
     * @param {Object} channel
     * @param {function} [callback]
     */
    const unPin = useCallback((
        channel,
        callback = () => {}) => {

        let payload = {
            id: channel.id,
            is_pinned: 0,
        };

        update(channel, payload, callback);
    }, [update]);

    /**
     * @param {Object} channel
     * @param {function} [callback]
     */
    const mute = useCallback((
        channel,
        callback = () => {}) => {

        let payload = {
            id: channel.id,
            is_muted: 1,
        };

        update(channel, payload, callback);
    }, [update]);

    /**
     * @param {Object} channel
     * @param {function} [callback]
     */
    const unMute = useCallback((
        channel,
        callback = () => {}) => {

        let payload = {
            id: channel.id,
            is_muted: 0,
        };

        update(channel, payload, callback);
    }, [update]);

    /**
     * @param {Object} channel
     * @param {function} [callback]
     */
    const hide = useCallback((channel,
                              callback = () => {}) => {
        let payload = {
            id: channel.id,
            is_hide: 1,
        };

        update(channel, payload, callback);
    }, [update]);

    /**
     * @param {Object} channel
     * @param {function} [callback]
     */
    const unHide = useCallback((channel,
                                callback = () => {}) => {
        let payload = {
            id: channel.id,
            is_hide: 0,
        };

        update(channel, payload, callback);
    }, [update]);

    /**
     * @param {Object} channel
     * @param {function} [callback]
     */
    const select = useCallback((
        channel,
        callback = () => {}) => {

        //if contact doesn't have a chat channel yet
        if (typeof channel === "undefined") {
            console.log(channel, "channel not found");

        } else if (channel.hasOwnProperty("add_user") && channel.add_user === true) {
            createByUserChannel(channel, (err, res) => {
                const data = res.data;
                dispatch(
                    setSelectedChannel(res.data, () => {
                        callback(data);
                    }),
                );
            });

            //if unarchived archived chat
        } else if (channel.is_archived === 1) {
            unArchive(channel, (err, res) => {
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
    }, [dispatch, createByUserChannel, unArchive]);

    /**
     * @param {Object} filter
     * @param {number} [filter.skip=0]
     * @param {number} [filter.limit=20]
     * @param {"hidden"|"archived"} [filter.filter]
     * @param {function} [callback]
     */
    const fetch = useCallback((
        {skip = 0, limit = 20, ...res},
        callback = () => {}) => {

        let params = {
            ...res,
            skip: skip,
            limit: limit,
            order_by: chatSettings.order_channel.order_by,
            sort_by: chatSettings.order_channel.sort_by.toLowerCase(),
        };

        dispatch(
            getChannels(params, callback),
        );
    }, [dispatch, chatSettings.order_channel.order_by, chatSettings.order_channel.sort_by]);

    /**
     * @param {Object} filter
     * @param {number} [filter.skip=0]
     * @param {number} [filter.limit=20]
     * @param {"hidden"|"archived"} [filter.filter]
     * @param {function} [callback]
     */
    const fetchAll = useCallback((
        {skip = 0, limit = 20, ...res},
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
                    fetchAll({
                        ...payload,
                        skip: payload.skip + limit,
                    });
                } else {
                    callback(err, res);
                }
            }),
        );
    }, [dispatch, chatSettings.order_channel.order_by, chatSettings.order_channel.sort_by]);


    /**
     * @param {Object} channel
     * @param {function} [callback]
     */
    const saveLastVisited = useCallback((
        channel,
        callback = () => {}) => {
        dispatch(
            setLastVisitedChannel(channel, callback),
        );
    }, [dispatch]);

    /**
     * @param {number} channelId
     * @param {Object} scrollComponent
     * @param {Object} scrollComponent.scrollHeight
     * @param {Object} scrollComponent.scrollTop
     * @param {function} [callback]
     */
    const saveHistoricalPosition = useCallback((channelId, scrollComponent, callback = () => {}) => {
        dispatch(
            setChannelHistoricalPosition({
                channel_id: channelId,
                scrollPosition: scrollComponent.scrollHeight - scrollComponent.scrollTop,
            }, callback),
        );
    }, [dispatch]);

    /**
     * @param {function} [callback]
     */
    const fetchNoChannelUsers = useCallback((callback) => {
        dispatch(
            getGlobalRecipients({}, callback),
        );
    }, [dispatch]);

    /**
     * @param {function} [callback]
     */
    const fetchDrafts = useCallback((
        callback) => {

        dispatch(
            getChannelDrafts({}, callback),
        );
    }, [dispatch]);

    /**
     * @param {number} channelId
     * @param {function} [callback]
     */
    const fetchMembersById = useCallback((
        channelId,
        callback = () => {},
    ) => {

        dispatch(
            getChannelMembers({channel_id: channelId}, callback),
        );
    }, [dispatch]);

    /**
     * @param {Object} channel
     * @param {function} [callback]
     */
    const markAsRead = useCallback((
        channel,
        callback = () => {},
    ) => {
        dispatch(
            putMarkReadChannel({
                channel_id: channel.id,
                ...getSharedPayload(channel),
            }, callback),
        );
    }, [dispatch]);

    /**
     * @param {Object} channel
     * @param {function} [callback]
     */
    const markAsUnRead = useCallback((
        channel,
        callback = () => {},
    ) => {
        dispatch(
            putMarkUnreadChannel({
                channelId: channel.id,
                ...getSharedPayload(channel),
            }, callback),
        );
    }, [dispatch]);

    /**
     * @param {string} title
     * @param {number[]} recipientIds
     * @param {function} [callback]
     */
    const searchExisting = useCallback((
        title,
        recipientIds,
        callback = () => {}) => {
        dispatch(
            postSearchExistingChannels({
                title: title,
                recipient_ids: recipientIds,
            }, callback),
        );
    }, [dispatch]);

    /**
     * @param {number} channelId
     * @param {number[]} recipientIds
     * @param {function} [callback]
     */
    const addMembers = useCallback((
        channelId,
        recipientIds,
        callback = () => {}) => {
        dispatch(
            postChannelMembers({
                channel_id: channelId,
                recipient_ids: recipientIds,
            }, callback),
        );
    }, [dispatch]);

    /**
     * @param {number} channelId
     * @param {number[]} recipientIds
     * @param {function} [callback]
     */
    const deleteMembers = useCallback((
        channelId,
        recipientIds,
        callback = () => {}) => {

        dispatch(
            deleteChannelMembers({
                channel_id: channelId,
                recipient_ids: recipientIds,
            }, callback),
        );
    }, [dispatch]);


    /**
     * @param {number} channelId
     * @param {string} name
     * @param {function} [callback]
     */
    const updateName = useCallback((
        channelId,
        name,
        callback = () => {}) => {

        dispatch(
            putChannelUpdateName({
                channel_id: channelId,
                channel_name: name,
            }, callback),
        );
    }, [dispatch]);

    /**
     * @param {Object} callback
     */
    const fetchLastVisited = useCallback((
        callback = () => {}) => {

        dispatch(
            getLastVisitedChannel({}, (err, res) => {
                fetchByCode(res.data.code, (err, res) => {
                    const channel = res.data;
                    saveLastVisited(res.data, () => {
                        callback(null, {
                            data: channel,
                        });
                    });
                });
            }),
        );
    }, [dispatch, fetchByCode, saveLastVisited]);

    return {
        createByUserChannel,
        fetchAll,
        fetch,
        fetchNoChannelUsers,
        fetchByCode,
        fetchDrafts,
        fetchMembersById,
        fetchLastVisited,
        saveHistoricalPosition,
        saveLastVisited,
        select,
        archive,
        unArchive,
        update,
        pin,
        unPin,
        mute,
        unMute,
        hide,
        unHide,
        markAsRead,
        markAsUnRead,
        searchExisting,
        addMembers,
        deleteMembers,
        updateName,
    };
};

export default useChannelActions;