import React from "react";
import { useDispatch } from "react-redux";
import {
  addChannels,
  addHuddleLog,
  deleteChannelMembers,
  getChannel,
  getChannelDrafts,
  getChannelLastReply,
  getChannelMembers,
  getChannels,
  getGlobalRecipients,
  getLastChannel,
  getLastVisitedChannel,
  getSelectChannel,
  getUnpublishedAnswers,
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
  searchChannels,
  setChannel,
  setChannelHistoricalPosition,
  setFetchingMessages,
  setLastVisitedChannel,
  setSelectedChannel,
  setSidebarSearch as setSidebarSearchReducer,
  setSearchArchivedChannels,
} from "../../redux/actions/chatActions";
import { useSettings, useToaster, useTranslationActions } from "./index";
import { useHistory } from "react-router-dom";
import { replaceChar } from "../../helpers/stringFormatter";

const useChannelActions = () => {
  const dispatch = useDispatch();

  const { chatSettings } = useSettings();
  const { _t } = useTranslationActions();
  const toaster = useToaster();
  const history = useHistory();

  const dictionary = {
    toasterGeneraError: _t("TOASTER.GENERAL_ERROR", "An error has occurred try again!"),
    createChannel: _t("TOASTER.CHANNEL_CREATE_SUCCESS", "Channel ::channel_title:: is successfully created."),
    updateChannel: _t("TOASTER.CHANNEL_UPDATE_SUCCESS", "Channel ::channel_title:: is successfully modified."),
  };

  /**
   * @param {string} code - channel.code
   * @param {function} [callback]
   */
  const fetchByCode = (code, callback = () => {}) => {
    dispatch(getChannel({ code: code }, callback));
  };

  /**
   *
   * @param {Object} payload
   * @param {string} payload.title
   * @param {string} payload.type
   * @param {Array} payload.recipient_ids
   * @param {string} [payload.message_body]
   */
  const create = (payload, callback) => {
    dispatch(
      postCreateChannel(payload, (err, res) => {
        if (err) {
          toaster.success(dictionary.toasterGeneraError);
        }
        if (res) {
          const channelTitle = payload.channel_name !== undefined ? payload.channel_name : res.data.entity_type === "DIRECT" ? (res.data.channel.profile ? res.data.channel.profile.name : "") : "";
          toaster.success(<span dangerouslySetInnerHTML={{ __html: dictionary.createChannel.replace("::channel_title::", `<b>${channelTitle}</b>`) }} />);
        }
        callback(err, res);
      })
    );
  };

  /**
   * @param {Object} channel - from fetchNoChannelUsers
   * @param {function} [callback]
   */
  const createByUserChannel = (channel, callback = () => {}) => {
    let old_channel = { ...channel };

    create(
      {
        title: "",
        type: "person",
        recipient_ids: channel.recipient_ids,
      },
      (err, res) => {
        if (res) {
          let timestamp = Math.round(+new Date() / 1000);
          let newchannel = {
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
            title: res.data.channel.profile.name,
          };

          dispatch(
            renameChannelKey(newchannel, () => {
              history.push(`/chat/${newchannel.code}`);
              dispatch(setSelectedChannel(newchannel));
              if (callback) {
                callback(newchannel);
              }
            })
          );
        }
      }
    );
  };

  /**
   * @param {Object} channel
   * @param {Object} channelUpdate - channel attributes update
   * @param {function} [callback]
   */
  const updateStatus = (channel, channelUpdate, callback = () => {}) => {
    let payload = {
      is_pinned: channel.is_pinned,
      is_muted: channel.is_muted,
      is_archived: channel.is_archived,
    };

    payload = {
      ...payload,
      ...channelUpdate,
      //...getSharedPayload(channel),
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
  };

  /**
   * @param {Object} channel
   * @param {function} [callback]
   */
  const archive = (channel, callback = () => {}) => {
    let payload = {
      id: channel.id,
      is_archived: true,
    };

    updateStatus(channel, payload, callback);
  };
  /**
   * @param {Object} channel
   * @param {function} [callback]
   */
  const unArchive = (channel, callback = () => {}) => {
    let payload = {
      id: channel.id,
      is_archived: false,
      push_unarchived: 1,
    };

    updateStatus(channel, payload, callback);
  };

  /**
   * @param {Object} channel
   * @param {function} [callback]
   */
  const pin = (channel, callback = () => {}) => {
    let payload = {
      id: channel.id,
      is_pinned: true,
    };

    updateStatus(channel, payload, callback);
  };

  /**
   * @param {Object} channel
   * @param {function} [callback]
   */
  const unPin = (channel, callback = () => {}) => {
    let payload = {
      id: channel.id,
      is_pinned: false,
    };

    updateStatus(channel, payload, callback);
  };

  /**
   * @param {Object} channel
   * @param {function} [callback]
   */
  const mute = (channel, callback = () => {}) => {
    let payload = {
      id: channel.id,
      is_muted: true,
    };

    updateStatus(channel, payload, callback);
  };

  /**
   * @param {Object} channel
   * @param {function} [callback]
   */
  const unMute = (channel, callback = () => {}) => {
    let payload = {
      id: channel.id,
      is_muted: false,
    };

    updateStatus(channel, payload, callback);
  };

  /**
   * @param {Object} channel
   * @param {function} [callback]
   */
  const hide = (channel, callback = () => {}) => {
    let payload = {
      id: channel.id,
      is_hidden: true,
      is_hide: true,
    };

    updateStatus(channel, payload, callback);
  };

  /**
   * @param {Object} channel
   * @param {function} [callback]
   */
  const unHide = (channel, callback = () => {}) => {
    let payload = {
      id: channel.id,
      is_hidden: false,
      is_hide: false,
    };

    updateStatus(channel, payload, callback);
  };

  /**
   * @param {Object} channel
   * @param {function} [callback]
   */
  const select = (channel, callback = () => {}) => {
    //if contact doesn't have a chat channel yet
    if (typeof channel === "undefined") {
    } else if (channel.hasOwnProperty("add_user") && channel.add_user === true) {
      createByUserChannel({ ...channel, selected: true });
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
      history.push(`/chat/${channel.code}`);
    } else {
      dispatch(
        setSelectedChannel({
          ...channel,
          selected: true,
        })
      );
      callback(channel);
      // history.push(`/chat/${channel.code}`);
    }
  };

  /**
   * @param {Object} filter
   * @param {number} [filter.skip=0]
   * @param {number} [filter.limit=20]
   * @param {"hidden"|"archived"} [filter.filter]
   * @param {function} [callback]
   */
  const fetch = ({ skip = 0, limit = 20, ...res }, callback = () => {}) => {
    let params = {
      ...res,
      skip: skip,
      limit: limit,
      order_by: chatSettings.order_channel.order_by,
      sort_by: chatSettings.order_channel.sort_by.toLowerCase(),
    };

    dispatch(getChannels(params, callback));
  };

  /**
   * @param {Object} filter
   * @param {number} [filter.skip=0]
   * @param {number} [filter.limit=20]
   * @param {"hidden"|"archived"} [filter.filter]
   * @param {function} [callback]
   */
  const fetchAll = ({ skip = 0, limit = 20, ...res }, callback = () => {}) => {
    let payload = {
      ...res,
      skip: skip,
      limit: limit,
      order_by: chatSettings.order_channel.order_by,
      sort_by: chatSettings.order_channel.sort_by.toLowerCase(),
    };

    dispatch(
      getChannels(payload, (err, res) => {
        if (res && res.data.results.length === limit) {
          fetchAll({
            ...payload,
            skip: payload.skip + limit,
          });
        }
        callback(err, res);
      })
    );
  };

  /**
   * @param {Object} channel
   * @param {function} [callback]
   */
  const saveLastVisited = (channel, callback = () => {}) => {
    dispatch(setLastVisitedChannel(channel, callback));
  };

  /**
   * @param {number} channelId
   * @param {Object} scrollComponent
   * @param {Object} scrollComponent.scrollHeight
   * @param {Object} scrollComponent.scrollTop
   * @param {function} [callback]
   */
  const saveHistoricalPosition = (channelId, scrollComponent, callback = () => {}) => {
    dispatch(
      setChannelHistoricalPosition(
        {
          channel_id: channelId,
          scrollPosition: scrollComponent.scrollHeight - scrollComponent.scrollTop,
        },
        callback
      )
    );
  };

  /**
   * @param {function} [callback]
   */
  const fetchNoChannelUsers = (callback) => {
    dispatch(getGlobalRecipients({}, callback));
  };

  /**
   * @param {function} [callback]
   */
  const fetchDrafts = (callback) => {
    dispatch(getChannelDrafts({}, callback));
  };

  /**
   * @param {number} channelId
   * @param {function} [callback]
   */
  const fetchMembersById = (channelId, callback = () => {}) => {
    dispatch(getChannelMembers({ channel_id: channelId }, callback));
  };

  /**
   * @param {Object} channel
   * @param {function} [callback]
   */
  const markAsRead = (channel, callback) => {
    let cb = (err, res) => {
      if (callback) callback();
      if (err) return;
      if (channel.type === "TOPIC") {
        dispatch(readChannelReducer({ id: channel.entity_id, channel_id: channel.id, count: channel.replies.filter((r) => !r.is_read).length }));
      }
    };
    dispatch(
      putMarkReadChannel(
        {
          channel_id: channel.id,
          //...getSharedPayload(channel),
        },
        cb
      )
    );
  };

  /**
   * @param {Object} channel
   * @param {function} [callback]
   */
  const markAsUnRead = (channel, callback = () => {}) => {
    dispatch(
      putMarkUnreadChannel(
        {
          channel_id: channel.id,
          //...getSharedPayload(channel),
        },
        callback
      )
    );
  };

  /**
   * @param {string} title
   * @param {number[]} recipientIds
   * @param {function} [callback]
   */
  const searchExisting = (title, recipientIds, callback = () => {}) => {
    dispatch(
      postSearchExistingChannels(
        {
          title: title,
          search_recipient_ids: recipientIds,
        },
        callback
      )
    );
  };

  /**
   * @param {number} channelId
   * @param {number[]} recipientIds
   * @param {function} [callback]
   */
  const addMembers = (channelId, recipientIds, callback = () => {}) => {
    dispatch(
      postChannelMembers(
        {
          channel_id: channelId,
          recipient_ids: recipientIds,
        },
        callback
      )
    );
  };

  /**
   * @param {number} channelId
   * @param {number[]} recipientIds
   * @param {function} [callback]
   */
  const deleteMembers = (channelId, recipientIds, callback = () => {}) => {
    dispatch(
      deleteChannelMembers(
        {
          channel_id: channelId,
          recipient_ids: recipientIds,
        },
        callback
      )
    );
  };

  /**
   * @param {Object} payload
   * @param {number} payload.channel_id
   * @param {string} payload.channel_name
   * @param {Array} add_member_ids
   * @param {Array} remove_member_ids
   * @param {string} payload.message_body
   * @param {function} [callback]
   */
  const update = (payload, callback = () => {}) => {
    dispatch(
      putChannelUpdate(payload, (err, res) => {
        if (err) {
          toaster.success(dictionary.toasterGeneraError);
        }
        if (res) {
          const channelTitle = payload.channel_name !== undefined ? payload.channel_name : res.data.entity_type === "DIRECT" ? res.data.profile.name : "";
          toaster.success(<span dangerouslySetInnerHTML={{ __html: dictionary.updateChannel.replace("::channel_title::", `<b>${channelTitle}</b>`) }} />);
        }

        callback(err, res);
      })
    );
  };

  /**
   * @param {Object} callback
   */
  const fetchLastVisited = (callback = () => {}) => {
    dispatch(
      getLastVisitedChannel({}, (err, res) => {
        if (res) {
          fetchByCode(res.data.code, (err, res) => {
            if (res) {
              const channel = res.data;
              saveLastVisited(res.data, () => {
                callback(null, {
                  data: channel,
                });
              });
            } else {
              callback(err, null);
            }
          });
        } else {
          callback(err, null);
        }
      })
    );
  };

  const fetchWorkspaceChannels = ({ skip = 0, limit = 20, ...res }, callback = () => {}) => {
    dispatch(getWorkspaceChannels({ skip: 0, limit: 100 }));
  };

  /**
   * @param {Object} channel
   * @param {Object} status
   * @param {function} [callback]
   */
  const fetchingMessages = (channel, status) => {
    let payload = {
      id: channel.id,
      status: status,
    };

    dispatch(setFetchingMessages(payload));
  };

  const getUrlTitle = (channelTitle) => {
    if (typeof channelTitle === "string") return replaceChar(channelTitle.toLowerCase());

    return "";
  };

  const getChannelLink = (channel) => {
    if (channel.workspace_folder) {
      return `/workspace/chat/${channel.workspace_folder.id}/${getUrlTitle(channel.workspace_folder.name)}/${channel.entity_id}/${getUrlTitle(channel.title)}`;
    } else {
      return `/workspace/chat/${channel.entity_id}/${getUrlTitle(channel.title)}`;
    }
  };

  const setSidebarSearch = (payload, callback = () => {}) => {
    dispatch(setSidebarSearchReducer(payload, callback));
  };

  /**
   * @param {Object} callback
   */
  const fetchLastChannel = (callback = null) => {
    dispatch(
      getLastChannel({}, (err, res) => {
        if (err) return;
        if (callback) callback();
        if (history.location.pathname.startsWith("/chat")) {
          history.push(`/chat/${res.data.code}`);
        }
      })
    );
  };

  /**
   * @param {string} code - channel.code
   * @param {function} [callback]
   */
  const fetchSelectChannel = (code, callback) => {
    dispatch(
      getSelectChannel({ code: code }, (err, res) => {
        if (err) {
          fetchLastChannel();
          return;
        }
        if (res && res.data) {
          history.push(`/chat/${res.data.code}`);
          if (callback) callback();
        }
      })
    );
  };

  const fetchChannelLastReply = (channelId, callback = () => {}) => {
    dispatch(getChannelLastReply({ channel_id: channelId }, callback));
  };

  /**
   * @param {Object} callback
   */
  const fetchUnpublishedAnswers = (payload = {}) => {
    let cb = (err, res) => {
      if (err) return;
      let huddle = res.data.find((d) => !d.huddle_log.published);
      if (huddle) {
        dispatch(
          addHuddleLog({
            ...payload,
            message_id: huddle.huddle_log.connected_message_id,
            huddle_log: {
              ...huddle.huddle_log,
              message_id: huddle.huddle_log.connected_message_id,
            },
            huddle_answers: huddle.huddle_answers,
          })
        );
      }
    };
    dispatch(getUnpublishedAnswers(payload, cb));
  };

  /**
   * @param {Object} filter
   * @param {number} [filter.skip=0]
   * @param {number} [filter.limit=25]
   * @param {"hidden"|"archived"} [filter.filter]
   * @param {function} [callback]
   */
  const loadMore = ({ skip = 0, limit = 25 }, callback = () => {}) => {
    let params = {
      skip: skip,
      limit: limit,
      order_by: chatSettings.order_channel.order_by,
      sort_by: chatSettings.order_channel.sort_by.toLowerCase(),
    };

    dispatch(
      getChannels(params, (err, res) => {
        if (callback) callback();
        if (err) return;
        dispatch(
          addChannels({
            channels: res.data.results,
          })
        );
      })
    );
  };

  /**
   * @param {Object} payload
   * @param {string} payload.search
   * @param {number} payload.skip
   * @param {number} payload.limit
   * @param {function} [callback]
   */
  const search = (payload, callback = () => {}) => {
    dispatch(searchChannels(payload, callback));
  };

  const searchArchivedChannels = (value) => {
    dispatch(setSearchArchivedChannels(value));
  };

  return {
    create,
    createByUserChannel,
    fetchAll,
    fetch,
    fetchNoChannelUsers,
    fetchByCode,
    fetchDrafts,
    fetchMembersById,
    fetchLastChannel,
    fetchLastVisited,
    fetchSelectChannel,
    fetchUnpublishedAnswers,
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
    getChannelLink,
    getUrlTitle,
    setSidebarSearch,
    fetchChannelLastReply,
    loadMore,
    search,
    searchArchivedChannels,
  };
};

export default useChannelActions;
