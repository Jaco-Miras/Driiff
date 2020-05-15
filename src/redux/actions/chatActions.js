import dispatchActionToReducer, {SimpleDispatchActionToReducer} from "../actionDispatcher";
import {
    createChatMessage as createChatMessageService,
    getChannel as getChannelService,
    getChannels as getChannelsService,
    getChatMessages as getChatMessagesService,
    getLastVisitedChannel as getLastVisitedChannelService,
    markReadChannel as markReadChannelService,
    markUnreadChannel as markUnreadChannelService,
    updateChannel as updateChannelService,
    updateChatMessage as updateChatMessageService,
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

export function markAllMessagesAsRead(cbdata, callback) {
    return SimpleDispatchActionToReducer(
        "MARK_ALL_MESSAGES_AS_READ",
        cbdata,
        callback,
    );
}

export function addChatMessage(payload, callback) {
    return SimpleDispatchActionToReducer(
        "ADD_CHAT_MESSAGE",
        payload,
        callback,
    );
}

export function createChatMessage(payload, callback) {
    return dispatchActionToReducer(
        createChatMessageService(payload),
        "CREATE_CHAT_MESSAGE_START",
        "CREATE_CHAT_MESSAGE_SUCCESS",
        "CREATE_CHAT_MESSAGE_FAILURE",
        callback,
    );
}

export function updateChatMessage(payload, callback) {
    return dispatchActionToReducer(
        updateChatMessageService(payload),
        "UPDATE_CHAT_MESSAGE_START",
        "UPDATE_CHAT_MESSAGE_SUCCESS",
        "UPDATE_CHAT_MESSAGE_FAILURE",
        callback,
    );
}

export function incomingChatMessage(payload, callback) {
    return SimpleDispatchActionToReducer(
        "INCOMING_CHAT_MESSAGE",
        payload,
        callback,
    );
}

export function incomingChatMessageFromOthers(payload, callback) {
    return SimpleDispatchActionToReducer(
        "INCOMING_CHAT_MESSAGE_FROM_OTHERS",
        payload,
        callback,
    );
}
