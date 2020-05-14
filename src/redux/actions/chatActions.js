import dispatchActionToReducer, {SimpleDispatchActionToReducer} from "../actionDispatcher";
import {
    getChannel as getChannelService,
    getChannels as getChannelsService,
    getChatMessages as getChatMessagesService,
    getLastVisitedChannel as getLastVisitedChannelService,
    markReadChannel as markReadChannelService,
    markUnreadChannel as markUnreadChannelService,
    updateChannel as updateChannelService,
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

export function getChannel(payload, callback) {
    return dispatchActionToReducer(
        getChannelService(payload),
        "GET_CHAT_CHANNEL_START",
        "GET_CHAT_CHANNEL_SUCCESS",
        "GET_CHAT_CHANNEL_FAIL",
        callback,
    );
}

export function getLastVisitedChannel(payload, callback) {
    return dispatchActionToReducer(
        getLastVisitedChannelService(payload),
        "GET_LAST_VISITED_CHANNEL_START",
        "GET_LAST_VISITED_CHANNEL_SUCCESS",
        "GET_LAST_VISITED_CHANNEL_FAILURE",
        callback,
    );
}

export function updateMemberTimestamp(payload, callback) {
    return SimpleDispatchActionToReducer(
        "UPDATE_MEMBER_TIMESTAMP",
        payload,
        callback,
    );
}

export function addToChannels(payload, callback) {
    return SimpleDispatchActionToReducer(
        "ADD_TO_CHANNELS",
        payload,
        callback,
    );
}

export function getChatMessages(payload, callback) {
    return dispatchActionToReducer(
        getChatMessagesService(payload),
        "GET_CHAT_MESSAGES_START",
        "GET_CHAT_MESSAGES_SUCCESS",
        "GET_CHAT_MESSAGES_FAILURE",
        callback,
    );
}