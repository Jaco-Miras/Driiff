import dispatchActionToReducer, {SimpleDispatchActionToReducer} from "../actionDispatcher";
import {
    getChannels as getChannelsService,
    updateChannel as updateChannelService,
    markReadChannel as markReadChannelService,
    markUnreadChannel as markUnreadChannelService,
} from "../services";


export function setSelectedChannel(payload, callback) {
    return SimpleDispatchActionToReducer(
        "SET_SELECTED_CHANNEL",
        payload,
        callback,
    );
}

export function getChannels(payload, callback) {
    return dispatchActionToReducer(
        getChannelsService(payload),
        "GET_CHANNELS_START",
        "GET_CHANNELS_SUCCESS",
        "GET_CHANNELS_FAIL",
        callback,
    );
}

export function updateChannel(payload, callback) {
    return dispatchActionToReducer(
        updateChannelService(payload),
        "UPDATE_CHANNEL_START",
        "UPDATE_CHANNEL_SUCCESS",
        "UPDATE_CHANNEL_FAIL",
        callback,
    );
}

export function updateChannelReducer(payload, callback) {
    return SimpleDispatchActionToReducer(
        "UPDATE_CHANNEL_REDUCER",
        payload,
        callback,
    );
}

export function markReadChannel(payload, callback) {
    return dispatchActionToReducer(
        markReadChannelService(payload),
        "MARK_READ_CHANNEL_START",
        "MARK_READ_CHANNEL_SUCCESS",
        "MARK_READ_CHANNEL_FAIL",
        callback,
    );
}

export function updateUnreadChatReplies(payload, callback) {
    return SimpleDispatchActionToReducer(
        "UPDATE_UNREAD_CHAT_REPLIES",
        payload,
        callback,
    );
}

export function markUnreadChannel(payload, callback) {
    return dispatchActionToReducer(
        markUnreadChannelService(payload),
        "MARK_AS_UNREAD_CHANNEL_START",
        "MARK_AS_UNREAD_CHANNEL_SUCCESS",
        "MARK_AS_UNREAD_CHANNEL_FAIL",
        callback,
    );
}