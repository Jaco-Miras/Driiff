import dispatchActionToReducer, { SimpleDispatchActionToReducer } from "../actionDispatcher";
import {
  deleteChannelMembers as deleteChannelMembersService,
  deleteChatMessage as deleteChatMessageService,
  deleteHuddleChatbot as deleteHuddleChatbotService,
  getChannel as getChannelService,
  getChannelDetail as getChannelDetailService,
  getChannelDrafts as getChannelDraftsService,
  getChannelLastReply as getChannelLastReplyService,
  getChannelMembers as getChannelMembersService,
  getChannels as getChannelsService,
  getChatMessages as getChatMessagesService,
  getChatStar as getChatStarService,
  getGlobalRecipients as getGlobalRecipientsService,
  getHuddleChatbot as getHuddleChatbotService,
  getLastChannel as getLastChannelService,
  getLastVisitedChannel as getLastVisitedChannelService,
  getSearchChannels as getSearchChannelsService,
  getSelectChannel as getSelectChannelService,
  getUnpublishedAnswers as getUnpublishedAnswersService,
  getUserBots as getUserBotsService,
  getWorkspaceChannels as getWorkspaceChannelsService,
  postChannelMembers as postChannelMembersService,
  postChatMessage as postChatMessageService,
  postChatReaction as postChatReactionService,
  postChatReminder as postChatReminderService,
  postCreateChannel as postCreateChannelService,
  postHuddleAnswer as postHuddleAnswerService,
  postHuddleChatbot as postHuddleChatbotService,
  postSearchExistingChannels as postSearchExistingChannelsService,
  postUserBots as postUserBotsService,
  putChannel as putChannelService,
  putChannelUpdate as putChannelUpdateService,
  putChatMessage as putChatMessageService,
  putChatStar as putChatStarService,
  putHuddleChatbot as putHuddleChatbotService,
  putImportantChat as putImportantChatService,
  putMarkReadChannel as putMarkReadChannelService,
  putMarkReminderComplete as putMarkReminderCompleteService,
  putMarkUnreadChannel as putMarkUnreadChannelService,
  putUnpublishedAnswers as putUnpublishedAnswersService,
} from "../services";

export function setSelectedChannel(payload, callback) {
  return SimpleDispatchActionToReducer("SET_SELECTED_CHANNEL", payload, callback);
}

export function getChannels(payload, callback) {
  return dispatchActionToReducer(getChannelsService(payload), "GET_CHANNELS_START", "GET_CHANNELS_SUCCESS", "GET_CHANNELS_FAIL", callback);
}

export function putChannel(payload, callback) {
  return dispatchActionToReducer(putChannelService(payload), "UPDATE_CHANNEL_START", "UPDATE_CHANNEL_SUCCESS", "UPDATE_CHANNEL_FAIL", callback);
}

export function setChannel(payload, callback) {
  return SimpleDispatchActionToReducer("UPDATE_CHANNEL_REDUCER", payload, callback);
}

export function putMarkReadChannel(payload, callback) {
  return dispatchActionToReducer(putMarkReadChannelService(payload), "MARK_READ_CHANNEL_START", "MARK_READ_CHANNEL_SUCCESS", "MARK_READ_CHANNEL_FAIL", callback);
}

export function updateUnreadChatReplies(payload, callback) {
  return SimpleDispatchActionToReducer("UPDATE_UNREAD_CHAT_REPLIES", payload, callback);
}

export function putMarkUnreadChannel(payload, callback) {
  return dispatchActionToReducer(putMarkUnreadChannelService(payload), "MARK_AS_UNREAD_CHANNEL_START", "MARK_AS_UNREAD_CHANNEL_SUCCESS", "MARK_AS_UNREAD_CHANNEL_FAIL", callback);
}

export function getChannel(payload, callback) {
  return dispatchActionToReducer(getChannelService(payload), "GET_CHANNEL_START", "GET_CHANNEL_SUCCESS", "GET_CHANNEL_FAIL", callback);
}

export function getLastVisitedChannel(payload, callback) {
  return dispatchActionToReducer(getLastVisitedChannelService(payload), "GET_LAST_VISITED_CHANNEL_START", "GET_LAST_VISITED_CHANNEL_SUCCESS", "GET_LAST_VISITED_CHANNEL_FAILURE", callback);
}

export function setMemberTimestamp(payload, callback) {
  return SimpleDispatchActionToReducer("UPDATE_MEMBER_TIMESTAMP", payload, callback);
}

export function addToChannels(payload, callback) {
  return SimpleDispatchActionToReducer("ADD_TO_CHANNELS", payload, callback);
}

export function getChatMessages(payload, callback) {
  return dispatchActionToReducer(getChatMessagesService(payload), "GET_CHAT_MESSAGES_START", "GET_CHAT_MESSAGES_SUCCESS", "GET_CHAT_MESSAGES_FAILURE", callback);
}

export function setAllMessagesAsRead(cbdata, callback) {
  return SimpleDispatchActionToReducer("MARK_ALL_MESSAGES_AS_READ", cbdata, callback);
}

export function addChatMessage(payload, callback) {
  return SimpleDispatchActionToReducer("ADD_CHAT_MESSAGE", payload, callback);
}

export function postChatMessage(payload, callback) {
  return dispatchActionToReducer(postChatMessageService(payload), "CREATE_CHAT_MESSAGE_START", "CREATE_CHAT_MESSAGE_SUCCESS", "CREATE_CHAT_MESSAGE_FAILURE", callback);
}

export function putChatMessage(payload, callback) {
  return dispatchActionToReducer(putChatMessageService(payload), "UPDATE_CHAT_MESSAGE_START", "UPDATE_CHAT_MESSAGE_SUCCESS", "UPDATE_CHAT_MESSAGE_FAILURE", callback);
}

export function incomingChatMessage(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_CHAT_MESSAGE", payload, callback);
}

export function incomingChatMessageFromOthers(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_CHAT_MESSAGE_FROM_OTHERS", payload, callback);
}

export function incomingArchivedChannel(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_ARCHIVED_CHANNEL", payload, callback);
}

export function postChatReaction(payload, callback) {
  return dispatchActionToReducer(postChatReactionService(payload), "CHAT_REACTIONS_START", "CHAT_REACTIONS_SUCCESS", "CHAT_REACTIONS_FAILURE", callback);
}

export function incomingChatMessageReaction(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_CHAT_MESSAGE_REACTION", payload, callback);
}

export function setChannelHistoricalPosition(payload, callback) {
  return SimpleDispatchActionToReducer("SET_CHANNEL_HISTORICAL_POSITION", payload, callback);
}

export function incomingUpdatedChatMessage(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_UPDATED_CHAT_MESSAGE", payload, callback);
}

export function setEditChatMessage(payload, callback) {
  return SimpleDispatchActionToReducer("SET_EDIT_CHAT_MESSAGE", payload, callback);
}

export function deleteChatMessage(payload, callback) {
  return dispatchActionToReducer(deleteChatMessageService(payload), "DELETE_CHAT_MESSAGE_START", "DELETE_CHAT_MESSAGE_SUCCESS", "DELETE_CHAT_MESSAGE_FAILURE", callback);
}

export function incomingDeletedChatMessage(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_DELETED_CHAT_MESSAGE", payload, callback);
}

export function onClickSendButton(payload, callback) {
  return SimpleDispatchActionToReducer("ON_CLICK_SEND_BUTTON", payload, callback);
}

export function addQuote(payload, callback) {
  return SimpleDispatchActionToReducer("ADD_QUOTE", payload, callback);
}

export function clearQuote(payload, callback) {
  return SimpleDispatchActionToReducer("CLEAR_QUOTE", payload, callback);
}

export function postChatReminder(payload, callback) {
  return dispatchActionToReducer(postChatReminderService(payload), "SET_CHAT_REMINDER_START", "SET_CHAT_REMINDER_SUCCESS", "SET_CHAT_REMINDER_FAILURE", callback);
}

export function addToChannelDraft(payload, callback) {
  return SimpleDispatchActionToReducer("ADD_TO_CHANNEL_DRAFTS", payload, callback);
}

export function clearChannelDraft(payload, callback) {
  return SimpleDispatchActionToReducer("CLEAR_CHANNEL_DRAFT", payload, callback);
}

export function getChannelDrafts(payload, callback) {
  return dispatchActionToReducer(getChannelDraftsService(payload), "GET_CHANNEL_DRAFTS_START", "GET_CHANNEL_DRAFTS_SUCCESS", "GET_CHANNEL_DRAFTS_FAILURE", callback);
}

/**
 * Get all recipients which are not added by the user yet
 *
 * @param payload
 * @param callback
 * @returns {function(...[*]=)}
 */
export function getGlobalRecipients(payload = {}, callback) {
  return dispatchActionToReducer(getGlobalRecipientsService(payload), "GET_GLOBAL_RECIPIENTS_START", "GET_GLOBAL_RECIPIENTS_SUCCESS", "GET_GLOBAL_RECIPIENTS_FAILURE", callback);
}

export function postCreateChannel(payload, callback) {
  return dispatchActionToReducer(postCreateChannelService(payload), "CREATE_NEW_CHAT_START", "CREATE_NEW_CHAT_SUCCESS", "CREATE_NEW_CHAT_FAILURE", callback);
}

export function renameChannelKey(payload, callback) {
  return SimpleDispatchActionToReducer("RENAME_CHANNEL_KEY", payload, callback);
}

export function putChannelUpdate(payload, callback) {
  return dispatchActionToReducer(putChannelUpdateService(payload), "EDIT_CHANNEL_DETAIL_START", "EDIT_CHANNEL_DETIL_SUCCESS", "EDIT_CHANNEL_DETAIL_FAILURE", callback);
}

export function incomingUpdatedChannelDetail(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_UPDATED_CHANNEL_DETAIL", payload, callback);
}

export function postSearchExistingChannels(payload, callback) {
  return dispatchActionToReducer(postSearchExistingChannelsService(payload), "SEARCH_EXISTING_CHAT_START", "SEARCH_EXISTING_CHAT_SUCCESS", "SEARCH_EXISTING_CHAT_FAILURE", callback);
}

export function updateChatMessageReminderComplete(payload, callback) {
  return SimpleDispatchActionToReducer("UPDATE_CHAT_MESSAGE_REMINDER_COMPLETE", payload, callback);
}

export function putMarkReminderComplete(payload, callback) {
  return dispatchActionToReducer(putMarkReminderCompleteService(payload), "MARK_REMINDER_COMPLETE_START", "MARK_REMINDER_COMPLETE_SUCCESS", "MARK_REMINDER_COMPLETE_FAILURE", callback);
}

export function postChannelMembers(payload, callback) {
  return dispatchActionToReducer(postChannelMembersService(payload), "ADD_CHANNEL_MEMBERS_START", "ADD_CHANNEL_MEMBERS_SUCCESS", "ADD_CHANNEL_MEMBERS_FAILURE", callback);
}

export function deleteChannelMembers(payload, callback) {
  return dispatchActionToReducer(deleteChannelMembersService(payload), "DELETE_CHANNEL_MEMBERS_START", "DELETE_CHANNEL_MEMBERS_SUCCESS", "DELETE_CHANNEL_MEMBERS_FAILURE", callback);
}

export function getChannelMembers(payload, callback) {
  return dispatchActionToReducer(getChannelMembersService(payload), "GET_CHAT_MEMBERS_START", "GET_CHAT_MEMBERS_SUCCESS", "GET_CHAT_MEMBERS_FAILURE", callback);
}

export function updateChannelMembersTitle(payload, callback) {
  return SimpleDispatchActionToReducer("UPDATE_CHANNEL_MEMBERS_TITLE", payload, callback);
}

export function setLastVisitedChannel(payload, callback) {
  return SimpleDispatchActionToReducer("SAVE_LAST_VISITED_CHANNEL", payload, callback);
}

export function restoreLastVisitedChannel(payload, callback) {
  return SimpleDispatchActionToReducer("RESTORE_LAST_VISITED_CHANNEL", payload, callback);
}

export function clearSelectedChannel(payload, callback) {
  return SimpleDispatchActionToReducer("CLEAR_SELECTED_CHANNEL", payload, callback);
}

export function unreadChannelReducer(payload, callback) {
  return SimpleDispatchActionToReducer("UNREAD_CHANNEL_REDUCER", payload, callback);
}

export function readChannelReducer(payload, callback) {
  return SimpleDispatchActionToReducer("READ_CHANNEL_REDUCER", payload, callback);
}

export function getWorkspaceChannels(payload, callback) {
  return dispatchActionToReducer(getWorkspaceChannelsService(payload), "GET_WORKSPACE_CHANNELS_START", "GET_WORKSPACE_CHANNELS_SUCCESS", "GET_WORKSPACE_CHANNELS_FAIL", callback);
}

export function setFetchingMessages(payload, callback) {
  return SimpleDispatchActionToReducer("SET_FETCHING_MESSAGES", payload, callback);
}

export function setLastChatVisibility(payload, callback) {
  return SimpleDispatchActionToReducer("SET_LAST_CHAT_VISIBILITY", payload, callback);
}

export function deletePostNotification(payload, callback) {
  return SimpleDispatchActionToReducer("DELETE_POST_NOTIFICATION", payload, callback);
}

export function incomingPostNotificationMessage(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_POST_NOTIFICATION_MESSAGE", payload, callback);
}

export function getChannelDetail(payload, callback) {
  return dispatchActionToReducer(getChannelDetailService(payload), "GET_CHANNEL_DETAIL_START", "GET_CHANNEL_DETAIL_SUCCESS", "GET_CHANNEL_DETAIL_FAIL", callback);
}

export function setSidebarSearch(payload, callback) {
  return SimpleDispatchActionToReducer("SET_SIDEBAR_SEARCH", payload, callback);
}

export function setChannelRange(payload, callback) {
  return SimpleDispatchActionToReducer("SET_CHANNEL_RANGE", payload, callback);
}

export function getLastChannel(payload, callback) {
  return dispatchActionToReducer(getLastChannelService(payload), "GET_LAST_CHANNEL_START", "GET_LAST_CHANNEL_SUCCESS", "GET_LAST_CHANNEL_FAIL", callback);
}

export function getSelectChannel(payload, callback) {
  return dispatchActionToReducer(getSelectChannelService(payload), "GET_SELECT_CHANNEL_START", "GET_SELECT_CHANNEL_SUCCESS", "GET_SELECT_CHANNEL_FAIL", callback);
}

export function putImportantChat(payload, callback) {
  return dispatchActionToReducer(putImportantChatService(payload), "PUT_IMPORTANT_CHAT_START", "PUT_IMPORTANT_CHAT_SUCCESS", "PUT_IMPORTANT_CHAT_FAIL", callback);
}

export function incomingImportantChat(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_IMPORTANT_CHAT", payload, callback);
}

export function getChannelLastReply(payload, callback) {
  return dispatchActionToReducer(getChannelLastReplyService(payload), "GET_CHANNEL_LAST_REPLY_START", "GET_CHANNEL_LAST_REPLY_SUCCESS", "GET_CHANNEL_LAST_REPLY_FAIL", callback);
}

export function putChatStar(payload, callback) {
  return dispatchActionToReducer(putChatStarService(payload), "PUT_CHAT_STAR_START", "PUT_CHAT_STAR_SUCCESS", "PUT_CHAT_STAR_FAIL", callback);
}

export function getChatStar(payload, callback) {
  return dispatchActionToReducer(getChatStarService(payload), "GET_CHAT_STAR_START", "GET_CHAT_STAR_SUCCESS", "GET_CHAT_STAR_FAIL", callback);
}

export function setIsStarred(payload, callback) {
  return SimpleDispatchActionToReducer("SET_IS_STARRED", payload, callback);
}

export function incomingChatStar(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_CHAT_STAR", payload, callback);
}

export function getHuddleChatbot(payload, callback) {
  return dispatchActionToReducer(getHuddleChatbotService(payload), "GET_HUDDLE_CHATBOT_START", "GET_HUDDLE_CHATBOT_SUCCESS", "GET_HUDDLE_CHATBOT_FAIL", callback);
}

export function postHuddleChatbot(payload, callback) {
  return dispatchActionToReducer(postHuddleChatbotService(payload), "POST_HUDDLE_CHATBOT_START", "POST_HUDDLE_CHATBOT_SUCCESS", "POST_HUDDLE_CHATBOT_FAIL", callback);
}

export function putHuddleChatbot(payload, callback) {
  return dispatchActionToReducer(putHuddleChatbotService(payload), "PUT_HUDDLE_CHATBOT_START", "PUT_HUDDLE_CHATBOT_SUCCESS", "PUT_HUDDLE_CHATBOT_FAIL", callback);
}

export function deleteHuddleChatbot(payload, callback) {
  return dispatchActionToReducer(deleteHuddleChatbotService(payload), "DELETE_HUDDLE_CHATBOT_START", "DELETE_HUDDLE_CHATBOT_SUCCESS", "DELETE_HUDDLE_CHATBOT_FAIL", callback);
}

export function postHuddleAnswer(payload, callback) {
  return dispatchActionToReducer(postHuddleAnswerService(payload), "POST_HUDDLE_ANSWER_START", "POST_HUDDLE_ANSWER_SUCCESS", "POST_HUDDLE_ANSWER_FAIL", callback);
}

export function getUserBots(payload, callback) {
  return dispatchActionToReducer(getUserBotsService(payload), "GET_USER_BOTS_START", "GET_USER_BOTS_SUCCESS", "GET_USER_BOTS_FAIL", callback);
}

export function incomingHuddleBot(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_HUDDLE_BOT", payload, callback);
}

export function saveHuddleAnswer(payload, callback) {
  return SimpleDispatchActionToReducer("SAVE_HUDDLE_ANSWER", payload, callback);
}

export function incomingUpdatedHuddleBot(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_UPDATED_HUDDLE_BOT", payload, callback);
}

export function incomingDeletedHuddleBot(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_DELETED_HUDDLE_BOT", payload, callback);
}

export function postUserBots(payload, callback) {
  return dispatchActionToReducer(postUserBotsService(payload), "POST_USER_BOTS_START", "POST_USER_BOTS_SUCCESS", "POST_USER_BOTS_FAIL", callback);
}

export function clearHuddleAnswers(payload, callback) {
  return SimpleDispatchActionToReducer("CLEAR_HUDDLE", payload, callback);
}

export function incomingHuddleAnswers(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_HUDDLE_ANSWERS", payload, callback);
}

export function getUnpublishedAnswers(payload, callback) {
  return dispatchActionToReducer(getUnpublishedAnswersService(payload), "GET_UNPUBLISHED_ANSWERS_START", "GET_UNPUBLISHED_ANSWERS_SUCCESS", "GET_UNPUBLISHED_ANSWERS_FAIL", callback);
}

export function putUnpublishedAnswers(payload, callback) {
  return dispatchActionToReducer(putUnpublishedAnswersService(payload), "PUT_UNPUBLISHED_ANSWERS_START", "PUT_UNPUBLISHED_ANSWERS_SUCCESS", "PUT_UNPUBLISHED_ANSWERS_FAIL", callback);
}

export function setEditHuddleAnswers(payload, callback) {
  return SimpleDispatchActionToReducer("SET_EDIT_HUDDLE_ANSWERS", payload, callback);
}

export function addHuddleLog(payload, callback) {
  return SimpleDispatchActionToReducer("ADD_HUDDLE_LOG", payload, callback);
}

export function clearEditHuddle(payload, callback) {
  return SimpleDispatchActionToReducer("CLEAR_EDIT_HUDDLE", payload, callback);
}

export function updateHuddleAnswer(payload, callback) {
  return SimpleDispatchActionToReducer("UPDATE_HUDDLE_ANSWER", payload, callback);
}

export function clearUnpublishedAnswer(payload, callback) {
  return SimpleDispatchActionToReducer("CLEAR_UNPUBLISHED_HUDDLE_ANSWER", payload, callback);
}

export function addChannels(payload, callback) {
  return SimpleDispatchActionToReducer("ADD_CHANNELS", payload, callback);
}

export function searchChannels(payload, callback) {
  return dispatchActionToReducer(getChannelsService(payload), "SEARCH_CHANNELS_START", "SEARCH_CHANNELS_SUCCESS", "SEARCH_CHANNELS_FAIL", callback);
}

export function setSearchArchivedChannels(payload, callback) {
  return SimpleDispatchActionToReducer("SET_SEARCH_ARCHIVED_CHANNELS", payload, callback);
}
