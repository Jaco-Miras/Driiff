import dispatchActionToReducer, {SimpleDispatchActionToReducer} from "../actionDispatcher";
import {
    chatReaction as chatReactionService,
    createChatMessage as createChatMessageService,
    createNewChat as createNewChatService,
    deleteChatMessage as deleteChatMessageService,
    getChannel as getChannelService,
    getChannelDrafts as getChannelDraftsService,
    getChannels as getChannelsService,
    getChatMessages as getChatMessagesService,
    getGlobalRecipients as getGlobalRecipientsService,
    getLastVisitedChannel as getLastVisitedChannelService,
    markReadChannel as markReadChannelService,
    markUnreadChannel as markUnreadChannelService,
    setChatReminder as setChatReminderService,
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

export function incomingArchivedChannel(payload, callback) {
    return SimpleDispatchActionToReducer(
        "INCOMING_ARCHIVED_CHANNEL",
        payload,
        callback,
    );
}

export function chatReaction(payload, callback) {
    return dispatchActionToReducer(
        chatReactionService(payload),
        "CHAT_REACTIONS_START",
        "CHAT_REACTIONS_SUCCESS",
        "CHAT_REACTIONS_FAILURE",
        callback,
    );
}

export function incomingChatMessageReaction(payload, callback) {
    return SimpleDispatchActionToReducer(
        "INCOMING_CHAT_MESSAGE_REACTION",
        payload,
        callback,
    );
}

export function setChannelHistoricalPosition(payload, callback) {
    return SimpleDispatchActionToReducer(
        "SET_CHANNEL_HISTORICAL_POSITION",
        payload,
        callback,
    );
}

export function incomingUpdatedChatMessage(payload, callback) {
    return SimpleDispatchActionToReducer(
        "INCOMING_UPDATED_CHAT_MESSAGE",
        payload,
        callback,
    );
}

export function setEditChatMessage(payload, callback) {
    return SimpleDispatchActionToReducer(
        "SET_EDIT_CHAT_MESSAGE",
        payload,
        callback,
    );
}

export function deleteChatMessage(payload, callback) {
    return dispatchActionToReducer(
        deleteChatMessageService(payload),
        "DELETE_CHAT_MESSAGE_START",
        "DELETE_CHAT_MESSAGE_SUCCESS",
        "DELETE_CHAT_MESSAGE_FAILURE",
        callback,
    );
}

export function incomingDeletedChatMessage(payload, callback) {
    return SimpleDispatchActionToReducer(
        "INCOMING_DELETED_CHAT_MESSAGE",
        payload,
        callback,
    );
}

export function onClickSendButton(payload, callback) {
    return SimpleDispatchActionToReducer(
        "ON_CLICK_SEND_BUTTON",
        payload,
        callback,
    );
}

export function addQuote(payload, callback) {
    return SimpleDispatchActionToReducer(
        "ADD_QUOTE",
        payload,
        callback,
    );
}

export function clearQuote(payload, callback) {
    return SimpleDispatchActionToReducer(
        "CLEAR_QUOTE",
        payload,
        callback,
    );
}

export function setChatReminder(payload, callback) {
    return dispatchActionToReducer(
        setChatReminderService(payload),
        "SET_CHAT_REMINDER_START",
        "SET_CHAT_REMINDER_SUCCESS",
        "SET_CHAT_REMINDER_FAILURE",
        callback,
    );
}

export function addToChannelDraft(payload, callback) {
    return SimpleDispatchActionToReducer(
        "ADD_TO_CHANNEL_DRAFTS",
        payload,
        callback,
    );
}

export function clearChannelDraft(payload, callback) {
    return SimpleDispatchActionToReducer(
        "CLEAR_CHANNEL_DRAFT",
        payload,
        callback,
    );
}

export function getChannelDrafts(payload, callback) {
    return dispatchActionToReducer(
        getChannelDraftsService(payload),
        "GET_CHANNEL_DRAFTS_START",
        "GET_CHANNEL_DRAFTS_SUCCESS",
        "GET_CHANNEL_DRAFTS_FAILURE",
        callback,
    );
}

/**
 * Get all recipients which are not added by the user yet
 *
 * @param payload
 * @param callback
 * @returns {function(...[*]=)}
 */
export function getGlobalRecipients(payload = {}, callback) {
    return dispatchActionToReducer(
        getGlobalRecipientsService(payload),
        "GET_GLOBAL_RECIPIENTS_START",
        "GET_GLOBAL_RECIPIENTS_SUCCESS",
        "GET_GLOBAL_RECIPIENTS_FAILURE",
        callback,
    );
}

export function createNewChat(payload, callback) {
    return dispatchActionToReducer(
        createNewChatService(payload),
        "CREATE_NEW_CHAT_START",
        "CREATE_NEW_CHAT_SUCCESS",
        "CREATE_NEW_CHAT_FAILURE",
        callback,
    );
}

export function deleteAddNewChatChannel(payload, callback) {
    return SimpleDispatchActionToReducer(
        "DELETE_ADD_NEW_CHAT_CHANNEL",
        payload,
        callback,
    );
}