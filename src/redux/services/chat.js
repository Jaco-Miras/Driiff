import { objToUrlParams } from "../../helpers/commonFunctions";
import { apiCall } from "./index";

export function getChannels(payload) {
  payload = {
    order_by: "updated_at",
    sort_by: "desc",
    ...payload,
  };

  if (payload.order_by === "channel_date_updated") {
    payload = {
      ...payload,
      order_by: "updated_at",
    };
  }
  let sharedPayload;
  if (payload.sharedPayload) {
    sharedPayload = payload.sharedPayload;
    delete payload.sharedPayload;
  }

  return apiCall({
    method: "GET",
    url: `/v2/post-channels?${objToUrlParams(payload)}`,
    sharedPayload: sharedPayload,
  });
}

export function putChannel(payload) {
  let sharedPayload;
  if (payload.sharedPayload) {
    sharedPayload = payload.sharedPayload;
    delete payload.sharedPayload;
  }
  let url = `/v2/post-channels/${payload.id}`;
  return apiCall({
    method: "PUT",
    url: url,
    data: payload,
    is_shared: !!payload.is_shared,
    is_translate: !!payload.is_translate,
    sharedPayload: sharedPayload,
  });
}

export function putMarkReadChannel(payload) {
  let sharedPayload;
  if (payload.sharedPayload) {
    sharedPayload = payload.sharedPayload;
    delete payload.sharedPayload;
  }
  return apiCall({
    method: "PUT",
    url: `/v2/read-notification-counter/all-chat?channel_id=${payload.channel_id}`,
    data: payload,
    sharedPayload: sharedPayload,
  });
}

export function putMarkUnreadChannel(payload) {
  const { channel_id, ...rest } = payload;

  return apiCall({
    method: "PUT",
    url: `/v2/unread-notification-counter/all-chat?channel_id=${channel_id}`,
    is_shared: !!payload.is_shared,
    data: rest,
  });
}

export function getChannel(payload) {
  let url = `/v2/post-channels/${payload.code}`;
  return apiCall({
    method: "GET",
    url: url,
    sharedPayload: payload.sharedPayload,
  });
}

export function getLastVisitedChannel(payload) {
  let url = "/v2/last-visit-channel";
  return apiCall({
    method: "GET",
    url: url,
    data: payload,
  });
}

export function getChatMessages(payload) {
  let url;
  let sharedPayload;
  if (payload.sharedPayload) {
    sharedPayload = payload.sharedPayload;
    delete payload.sharedPayload;
  }
  url = `/v2/post-channel-messages?${objToUrlParams(payload)}`;

  return apiCall({
    method: "GET",
    url: url,
    //is_shared: !!payload.topic_id,
    sharedPayload: sharedPayload,
  });
}

export function postChatMessageTranslate(payload) {
  let sharedPayload;
  if (payload.sharedPayload) {
    sharedPayload = payload.sharedPayload;
    delete payload.sharedPayload;
  }
  let url = "/v2/post-channel-messages-translate";
  return apiCall({
    method: "POST",
    url: url,
    data: payload,
    sharedPayload: sharedPayload,
  });
}

export function postChatMessage(payload) {
  let sharedPayload;
  if (payload.sharedPayload) {
    sharedPayload = payload.sharedPayload;
    delete payload.sharedPayload;
  }
  let url = "/v2/post-channel-messages";
  return apiCall({
    method: "POST",
    url: url,
    data: payload,
    sharedPayload: sharedPayload,
  });
}

export function putChatMessage(payload) {
  let sharedPayload;
  if (payload.sharedPayload) {
    sharedPayload = payload.sharedPayload;
    delete payload.sharedPayload;
  }
  let url = `/v2/post-channel-messages/${payload.message_id}`;
  return apiCall({
    method: "PUT",
    url: url,
    data: payload,
    sharedPayload: sharedPayload,
  });
}

export function postChatReaction(payload) {
  let sharedPayload;
  if (payload.sharedPayload) {
    sharedPayload = payload.sharedPayload;
    delete payload.sharedPayload;
  }
  let url = "/v2/post-message-react";
  return apiCall({
    method: "POST",
    url: url,
    data: payload,
    sharedPayload: sharedPayload,
  });
}

export function deleteChatMessage(payload) {
  let sharedPayload;
  if (payload.sharedPayload) {
    sharedPayload = payload.sharedPayload;
    delete payload.sharedPayload;
  }
  let url = `/v2/post-channel-messages/${payload.message_id}`;
  return apiCall({
    method: "DELETE",
    url: url,
    data: payload,
    sharedPayload: sharedPayload,
  });
}

/**
 * @param {Object} payload
 * @param {number} payload.message_id
 * @param {string} payload.set_time
 */
export function postChatReminder(payload) {
  let url = "/v2/set-reminder";
  return apiCall({
    method: "POST",
    url: url,
    data: payload,
  });
}

export function getChannelDrafts(payload) {
  let url = "/v1/drafts?draft_type=channel";
  return apiCall({
    method: "GET",
    url: url,
    data: payload,
  });
}

/**
 * @param payload
 * @param payload.search
 * @returns {Promise<*>}
 */
export function getGlobalRecipients(payload) {
  let url = `/v2/global-recipients?${objToUrlParams(payload)}`;
  return apiCall({
    method: "GET",
    url: url,
    data: payload,
  });
}

/**
 * @param payload
 * @returns {Promise<*>}
 */
export function postCreateChannel(payload) {
  let url = "/v2/chat-channel/create";
  return apiCall({
    method: "POST",
    url: url,
    data: payload,
  });
}

export function putChannelUpdate(payload) {
  let url = "/v2/chat-channel/update";
  return apiCall({
    method: "PUT",
    url: url,
    data: payload,
  });
}

export function postSearchExistingChannels(payload) {
  let url = "/v2/search-post-channels";
  return apiCall({
    method: "POST",
    url: url,
    data: payload,
  });
}

/**
 * @param payload
 * @param payload.message_id
 * @returns {Promise<*>}
 */
export function putMarkReminderComplete(payload) {
  let url = "/v2/bot-marked-completed";
  return apiCall({
    method: "PUT",
    url: url,
    data: payload,
  });
}

export function postChannelMembers(payload) {
  let url = "/v2/post-channel-members";
  return apiCall({
    method: "POST",
    url: url,
    data: payload,
  });
}

export function deleteChannelMembers(payload) {
  let url = "/v2/post-channel-members";
  return apiCall({
    method: "DELETE",
    url: url,
    data: payload,
  });
}

export function getChannelMembers(payload) {
  let url = `/v2/post-channel-members?channel_id=${payload.channel_id}`;
  return apiCall({
    method: "GET",
    url: url,
  });
}

export function getWorkspaceChannels(payload) {
  return apiCall({
    method: "GET",
    url: `/v2/workspace-channels?${objToUrlParams(payload)}`,
  });
}

export function getChannelDetail(payload) {
  let url = `/v2/post-channels/${payload.id}`;
  return apiCall({
    method: "GET",
    url: url,
  });
}

export function getLastChannel(payload) {
  let url = "/v2/last-visit-channel?need_detail=11";
  return apiCall({
    method: "GET",
    url: url,
    data: payload,
  });
}

export function getSelectChannel(payload) {
  let url = `/v2/post-channels/${payload.code}`;
  return apiCall({
    method: "GET",
    url: url,
  });
}

/**
 * @param payload
 * @param payload.message_id
 * @param payload.is_important
 * @returns {Promise<*>}
 */
export function putImportantChat(payload) {
  let sharedPayload;
  if (payload.sharedPayload) {
    sharedPayload = payload.sharedPayload;
    delete payload.sharedPayload;
  }
  let url = "/v2/set-message-important";
  return apiCall({
    method: "PUT",
    url: url,
    data: payload,
    sharedPayload: sharedPayload,
  });
}

/**
 * @param payload
 * @param payload.channel_id
 * @returns {Promise<*>}
 */
export function getChannelLastReply(payload) {
  let url = `/v2/get-channel-last-reply?${objToUrlParams(payload)}`;
  return apiCall({
    method: "GET",
    url: url,
    data: payload,
  });
}

/**
 * @param payload
 * @param number payload.message_id
 * @param number payload.star 1|0
 * @returns {Promise<*>}
 */
export function putChatStar(payload) {
  let url = "/v2/chat-star";
  return apiCall({
    method: "PUT",
    url: url,
    data: payload,
  });
}

/**
 * @param payload
 * @returns {Promise<*>}
 */
export function getHuddleChatbot(payload) {
  let url = `/v2/huddle-chatbot?${objToUrlParams(payload)}`;
  return apiCall({
    method: "GET",
    url: url,
    data: payload,
  });
}

/**
 * @param payload
 * @returns {Promise<*>}
 */
export function postHuddleChatbot(payload) {
  let url = "/v2/huddle-chatbot";
  return apiCall({
    method: "POST",
    url: url,
    data: payload,
  });
}

/**
 * @param payload
 * @param number payload.huddle_id
 * @returns {Promise<*>}
 */
export function putHuddleChatbot(payload) {
  let url = `/v2/huddle-chatbot/${payload.huddle_id}`;
  return apiCall({
    method: "PUT",
    url: url,
    data: payload,
  });
}

/**
 * @param payload
 * @param number payload.huddle_id
 * @returns {Promise<*>}
 */
export function deleteHuddleChatbot(payload) {
  let url = `/v2/huddle-chatbot/${payload.huddle_id}`;
  return apiCall({
    method: "DELETE",
    url: url,
    data: payload,
  });
}

/**
 * @param payload
 * @returns {Promise<*>}
 */
export function postHuddleAnswer(payload) {
  let url = "/v2/huddle-answer";
  return apiCall({
    method: "POST",
    url: url,
    data: payload,
  });
}

/**
 * @param payload
 * @returns {Promise<*>}
 */
export function getUserBots(payload) {
  let url = `/v2/user-bots?${objToUrlParams(payload)}`;
  return apiCall({
    method: "GET",
    url: url,
    data: payload,
  });
}

/**
 * @param payload
 * @returns {Promise<*>}
 */
export function postUserBots(payload) {
  let url = "/v2/user-bots";
  return apiCall({
    method: "POST",
    url: url,
    data: payload,
  });
}

/**
 * @param payload
 * @returns {Promise<*>}
 */
export function getUnpublishedAnswers(payload) {
  let url = `/v2/get-huddle-answer?${objToUrlParams(payload)}`;
  return apiCall({
    method: "GET",
    url: url,
    data: payload,
  });
}

/**
 * @param payload
 * @returns {Promise<*>}
 */
export function putUnpublishedAnswers(payload) {
  let url = "/v2/update-huddle-answer";
  return apiCall({
    method: "PUT",
    url: url,
    data: payload,
  });
}

export function getSearchChannels(payload) {
  let url = `/v2/search-post-channels?${objToUrlParams(payload)}`;
  return apiCall({
    method: "GET",
    url: url,
  });
}

export function postSkipHuddle(payload) {
  let url = "/v2/huddle-chatbot-skip";
  return apiCall({
    method: "POST",
    url: url,
    data: payload,
  });
}

/**
 * @param payload
 * @returns {Promise<*>}
 */
export function getSkippedAnswers(payload) {
  let url = `/v2/get-skip-answer?${objToUrlParams(payload)}`;
  return apiCall({
    method: "GET",
    url: url,
    data: payload,
  });
}

export function getCompanyChannel(payload) {
  let url = "/v2/company-post-channel";
  return apiCall({
    method: "GET",
    url: url,
  });
}

export function getChatMsgsForFancy(payload) {
  let url = "/v2/fancy-link";
  return apiCall({
    method: "POST",
    url: url,
    data: payload,
  });
}

export function getSiteMetaData(payload) {
  let url = "/v2/fancy-link";
  return apiCall({
    method: "POST",
    url: url,
    data: payload,
  });
}

export function generateZoomSignature(payload) {
  let url = `/zoom/signature?${objToUrlParams(payload)}`;
  return apiCall({
    method: "GET",
    url: url,
    data: payload,
  });
}

export function createZoomMeeting(payload) {
  let url = `/zoom/meeting?${objToUrlParams(payload)}`;
  return apiCall({
    method: "GET",
    url: url,
    data: payload,
  });
}

export function getChatMsgsSearch(payload) {
  let sharedPayload;
  if (payload.sharedPayload) {
    sharedPayload = payload.sharedPayload;
    delete payload.sharedPayload;
  }
  let url = "/v2/search-on-chat";
  return apiCall({
    method: "POST",
    url: url,
    data: payload,
    sharedPayload: sharedPayload,
  });
}

export function createGoogleMeet(payload) {
  let url = "/google-meet/create-meet";
  return apiCall({
    method: "POST",
    url: url,
    data: payload,
  });
}

export function createJitsiMeet(payload) {
  let url;
  let sharedPayload;
  if (payload.sharedPayload) {
    sharedPayload = payload.sharedPayload;
    delete payload.sharedPayload;
  }
  url = `/meet/signature?channel_id=${payload.channel_id}&host=${payload.host}&room_name=${payload.room_name}`;
  return apiCall({
    method: "GET",
    url: url,
    data: payload,
    sharedPayload: sharedPayload,
  });
}
