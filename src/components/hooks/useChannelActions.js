import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteChannelMembers,
  getChannel,
  getChannelDrafts,
  getChannelMembers,
  getChannels,
  getGlobalRecipients,
  getLastVisitedChannel,
  getWorkspaceChannels,
  postChannelMembers,
  postCreateChannel,
  postSearchExistingChannels,
  putChannel,
  putChannelUpdate,
  putMarkReadChannel,
  putMarkUnreadChannel,
  readChannelReducer,
  renameChannelKey,
  setChannel,
  setChannelHistoricalPosition,
  setLastVisitedChannel,
  setSelectedChannel,
  setFetchingMessages
} from "../../redux/actions/chatActions";
import { useSettings } from "./index";

const useChannelActions = () => {
  const { chatSettings } = useSettings();

  const sharedSlugs = useSelector((state) => state.global.slugs);

  const dispatch = useDispatch();

  /**
   * @param {Object} channel
   * @returns {{}|{is_shared: boolean, slug: string, token: string}}
   */
  const getSharedPayload = useCallback(
    (channel) => {
      if (channel.hasOwnProperty("is_shared") && channel.is_shared && sharedSlugs.length) {
        return {
          is_shared: true,
          token: sharedSlugs.filter((s) => s.slug_name === channel.slug_owner)[0].access_token,
          slug: sharedSlugs.filter((s) => s.slug_name === channel.slug_owner)[0].slug_name,
        };
      } else {
        return {};
      }
    },
    [sharedSlugs]
  );

  /**
   * @param {string} code - channel.code
   * @param {function} [callback]
   */
  const fetchByCode = useCallback(
    (code, callback = () => {}) => {
      dispatch(getChannel({ code: code }, callback));
    },
    [dispatch]
  );

  /**
   *
   * @param {Object} payload
   * @param {string} payload.title
   * @param {string} payload.type
   * @param {Array} payload.recipient_ids
   * @param {string} [payload.message_body]
   */
  const create = useCallback(
    (payload, callback) => {
      dispatch(postCreateChannel(payload, callback));
    },
    [dispatch]
  );

  /**
   * @param {Object} channel - from fetchNoChannelUsers
   * @param {function} [callback]
   */
  const createByUserChannel = useCallback(
    (channel, callback = () => {}) => {
      let old_channel = channel;

      create(
        {
          title: "",
          type: "person",
          recipient_ids: channel.recipient_ids,
        },
        (err, res) => {
          if (err) console.log(err);

          if (res) {
            let timestamp = Math.round(+new Date() / 1000);
            let channel = {
              ...res.data.channel,
              old_id: old_channel.id,
              code: res.data.code,
              selected: true,
              hasMore: false,
              isFetching: false,
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
              })
            );
          }
        }
      );
    },
    [dispatch, create]
  );

  /**
   * @param {Object} channel
   * @param {Object} channelUpdate - channel attributes update
   * @param {function} [callback]
   */
  const updateStatus = useCallback(
    (channel, channelUpdate, callback = () => {}) => {
      let payload = {
        is_pinned: channel.is_pinned,
        is_muted: channel.is_muted,
        is_archived: channel.is_archived,
      };

      payload = {
        ...payload,
        ...channelUpdate,
        ...getSharedPayload(channel),
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
            })
          );
        })
      );
    },
    [dispatch, sharedSlugs]
  );

  /**
   * @param {Object} channel
   * @param {function} [callback]
   */
  const archive = useCallback(
    (channel, callback = () => {}) => {
      let payload = {
        id: channel.id,
        is_archived: true,
      };

      updateStatus(channel, payload, callback);
    },
    [updateStatus]
  );

  /**
   * @param {Object} channel
   * @param {function} [callback]
   */
  const unArchive = useCallback(
    (channel, callback = () => {}) => {
      let payload = {
        id: channel.id,
        is_archived: false,
        push_unarchived: 1,
      };

      updateStatus(channel, payload, callback);
    },
    [updateStatus]
  );

  /**
   * @param {Object} channel
   * @param {function} [callback]
   */
  const pin = useCallback(
    (channel, callback = () => {}) => {
      let payload = {
        id: channel.id,
        is_pinned: true,
      };

      updateStatus(channel, payload, callback);
    },
    [updateStatus]
  );

  /**
   * @param {Object} channel
   * @param {function} [callback]
   */
  const unPin = useCallback(
    (channel, callback = () => {}) => {
      let payload = {
        id: channel.id,
        is_pinned: false,
      };

      updateStatus(channel, payload, callback);
    },
    [updateStatus]
  );

  /**
   * @param {Object} channel
   * @param {function} [callback]
   */
  const mute = useCallback(
    (channel, callback = () => {}) => {
      let payload = {
        id: channel.id,
        is_muted: true,
      };

      updateStatus(channel, payload, callback);
    },
    [updateStatus]
  );

  /**
   * @param {Object} channel
   * @param {function} [callback]
   */
  const unMute = useCallback(
    (channel, callback = () => {}) => {
      let payload = {
        id: channel.id,
        is_muted: false,
      };

      updateStatus(channel, payload, callback);
    },
    [updateStatus]
  );

  /**
   * @param {Object} channel
   * @param {function} [callback]
   */
  const hide = useCallback(
    (channel, callback = () => {}) => {
      let payload = {
        id: channel.id,
        is_hidden: true,
      };

      updateStatus(channel, payload, callback);
    },
    [updateStatus]
  );

  /**
   * @param {Object} channel
   * @param {function} [callback]
   */
  const unHide = useCallback(
    (channel, callback = () => {}) => {
      let payload = {
        id: channel.id,
        is_hidden: false,
      };

      updateStatus(channel, payload, callback);
    },
    [updateStatus]
  );

  /**
   * @param {Object} channel
   * @param {function} [callback]
   */
  const select = useCallback(
    (channel, callback = () => {}) => {
      //if contact doesn't have a chat channel yet
      if (typeof channel === "undefined") {
        console.log(channel, "channel not found");
      } else if (channel.hasOwnProperty("add_user") && channel.add_user === true) {
        createByUserChannel(channel, (err, res) => {
          const data = res.data;
          dispatch(
            setSelectedChannel(res.data, () => {
              callback(data);
            })
          );
        });

        //if unarchived archived chat
      } else if (channel.type === "DIRECT" && channel.members.length === 2 && channel.is_archived) {
        unArchive(channel, (err, res) => {
          const channel = res.data;
          dispatch(
            setSelectedChannel(res.data, () => {
              callback(channel);
            })
          );
        });
      } else {
        dispatch(
          setSelectedChannel({
            ...channel,
            selected: true,
          })
        );
        callback(channel);
      }
    },
    [dispatch, createByUserChannel, unArchive]
  );

  /**
   * @param {Object} filter
   * @param {number} [filter.skip=0]
   * @param {number} [filter.limit=20]
   * @param {"hidden"|"archived"} [filter.filter]
   * @param {function} [callback]
   */
  const fetch = useCallback(
    ({ skip = 0, limit = 20, ...res }, callback = () => {}) => {
      let params = {
        ...res,
        skip: skip,
        limit: limit,
        order_by: chatSettings.order_channel.order_by,
        sort_by: chatSettings.order_channel.sort_by.toLowerCase(),
      };

      dispatch(getChannels(params, callback));
    },
    [dispatch, chatSettings.order_channel.order_by, chatSettings.order_channel.sort_by]
  );

  /**
   * @param {Object} filter
   * @param {number} [filter.skip=0]
   * @param {number} [filter.limit=20]
   * @param {"hidden"|"archived"} [filter.filter]
   * @param {function} [callback]
   */
  const fetchAll = useCallback(
    ({ skip = 0, limit = 20, ...res }, callback = () => {}) => {
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
        })
      );
    },
    [dispatch, chatSettings.order_channel.order_by, chatSettings.order_channel.sort_by]
  );

  /**
   * @param {Object} channel
   * @param {function} [callback]
   */
  const saveLastVisited = useCallback(
    (channel, callback = () => {}) => {
      dispatch(setLastVisitedChannel(channel, callback));
    },
    [dispatch]
  );

  /**
   * @param {number} channelId
   * @param {Object} scrollComponent
   * @param {Object} scrollComponent.scrollHeight
   * @param {Object} scrollComponent.scrollTop
   * @param {function} [callback]
   */
  const saveHistoricalPosition = useCallback(
    (channelId, scrollComponent, callback = () => {}) => {
      dispatch(
        setChannelHistoricalPosition(
          {
            channel_id: channelId,
            scrollPosition: scrollComponent.scrollHeight - scrollComponent.scrollTop,
          },
          callback
        )
      );
    },
    [dispatch]
  );

  /**
   * @param {function} [callback]
   */
  const fetchNoChannelUsers = useCallback(
    (callback) => {
      dispatch(getGlobalRecipients({}, callback));
    },
    [dispatch]
  );

  /**
   * @param {function} [callback]
   */
  const fetchDrafts = useCallback(
    (callback) => {
      dispatch(getChannelDrafts({}, callback));
    },
    [dispatch]
  );

  /**
   * @param {number} channelId
   * @param {function} [callback]
   */
  const fetchMembersById = useCallback(
    (channelId, callback = () => {}) => {
      dispatch(getChannelMembers({ channel_id: channelId }, callback));
    },
    [dispatch]
  );

  /**
   * @param {Object} channel
   * @param {function} [callback]
   */
  const markAsRead = useCallback(
    (channel, callback) => {
      let cb = (err, res) => {
        if (callback) callback();
        if (err) return;
        if (channel.type === "TOPIC") {
          dispatch(readChannelReducer({ id: channel.entity_id, count: channel.replies.filter((r) => !r.is_read).length }));
        }
      };
      dispatch(
        putMarkReadChannel(
          {
            channel_id: channel.id,
            ...getSharedPayload(channel),
          },
          cb
        )
      );
    },
    [dispatch]
  );

  /**
   * @param {Object} channel
   * @param {function} [callback]
   */
  const markAsUnRead = useCallback(
    (channel, callback = () => {}) => {
      dispatch(
        putMarkUnreadChannel(
          {
            channel_id: channel.id,
            ...getSharedPayload(channel),
          },
          callback
        )
      );
    },
    [dispatch]
  );

  /**
   * @param {string} title
   * @param {number[]} recipientIds
   * @param {function} [callback]
   */
  const searchExisting = useCallback(
    (title, recipientIds, callback = () => {}) => {
      dispatch(
        postSearchExistingChannels(
          {
            title: title,
            search_recipient_ids: recipientIds,
          },
          callback
        )
      );
    },
    [dispatch]
  );

  /**
   * @param {number} channelId
   * @param {number[]} recipientIds
   * @param {function} [callback]
   */
  const addMembers = useCallback(
    (channelId, recipientIds, callback = () => {}) => {
      dispatch(
        postChannelMembers(
          {
            channel_id: channelId,
            recipient_ids: recipientIds,
          },
          callback
        )
      );
    },
    [dispatch]
  );

  /**
   * @param {number} channelId
   * @param {number[]} recipientIds
   * @param {function} [callback]
   */
  const deleteMembers = useCallback(
    (channelId, recipientIds, callback = () => {}) => {
      dispatch(
        deleteChannelMembers(
          {
            channel_id: channelId,
            recipient_ids: recipientIds,
          },
          callback
        )
      );
    },
    [dispatch]
  );

  /**
   * @param {Object} payload
   * @param {number} payload.channel_id
   * @param {string} payload.channel_name
   * @param {Array} add_member_ids
   * @param {Array} remove_member_ids
   * @param {string} payload.message_body
   * @param {function} [callback]
   */
  const update = useCallback(
    (payload, callback = () => {}) => {
      dispatch(putChannelUpdate(payload, callback));
    },
    [dispatch]
  );

  /**
   * @param {Object} callback
   */
  const fetchLastVisited = useCallback(
    (callback = () => {}) => {
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
        })
      );
    },
    [dispatch, fetchByCode, saveLastVisited]
  );

  const fetchWorkspaceChannels = useCallback(
    ({ skip = 0, limit = 20, ...res }, callback = () => {}) => {
      dispatch(getWorkspaceChannels({ skip: 0, limit: 100 }));
    },
    [dispatch]
  );

  /**
   * @param {Object} channel
   * @param {Object} status
   * @param {function} [callback]
   */
  const fetchingMessages = useCallback(
    (channel, status) => {
      let payload = {
        id: channel.id,
        status: status
      };

      dispatch(setFetchingMessages(payload));
    },
    [dispatch]
  );

  return {
    create,
    createByUserChannel,
    fetchAll,
    fetch,
    fetchNoChannelUsers,
    fetchByCode,
    fetchDrafts,
    fetchMembersById,
    fetchLastVisited,
    fetchWorkspaceChannels,
    saveHistoricalPosition,
    saveLastVisited,
    select,
    archive,
    unArchive,
    updateStatus,
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
    update,
    fetchingMessages,
  };
};

export default useChannelActions;
