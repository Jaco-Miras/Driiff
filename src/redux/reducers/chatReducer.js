//import {uniqBy} from "lodash";
import { getCurrentTimestamp } from "../../helpers/dateFormatter";
import { uniqByProp } from "../../helpers/arrayHelper";

/** Initial State  */
const INITIAL_STATE = {
  user: null,
  channels: {},
  selectedChannel: null,
  startNewChannels: {},
  channelDrafts: {},
  unreadChatCount: 0,
  historicalPositions: [],
  editChatMessage: null,
  sendButtonClicked: false,
  chatQuotes: {},
  channelsLoaded: false,
  lastVisitedChannel: null,
  isLastChatVisible: false
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case "GET_GLOBAL_RECIPIENTS_SUCCESS": {
      let channels = state.channels;
      action.data.result.forEach((ac) => {
        if (ac.type === "DIRECT") {
          ac.members = [
            {
              ...ac.profile
            },
            {
              id: state.user.id,
              name: state.user.name,
              profile_image_link: state.user.profile_image_link,
              email: state.user.email
            },
          ];
          ac.title = ac.profile.name;
          ac.replies = [];
          ac.recipient_ids = [ac.id];
          ac.add_user = true;
        }

        if (ac.type === "TOPIC") {
          ac.members = ac.channel_members;
          ac.replies = [];
          ac.add_open_topic = true;

          if (ac.channel_code === null) {
            ac.recipient_ids = [ac.id];
          } else {
            ac.hasMore = true;
            ac.code = ac.channel_code;
            ac.entity_id = ac.channel_id;
            ac.read_only = true;
          }
        }

        channels[ac.key_id] = {
          ...channels[ac.key_id],
          ...ac,
          id: ac.key_id,
          is_pinned: false,
          is_hidden: false,
          is_archived: false,
        };
      });
      return {
        ...state,
        channels: channels,
      };
    }
    case "RENAME_CHANNEL_KEY":
      let channels = {...state.channels};
      delete channels[action.data.old_id];
      delete action.data.old_id;

      channels[action.data.id] = action.data;
      let selectedChannel = {...state.selectedChannel};
      if (action.data.selected) {
        if (selectedChannel) {
          channels[selectedChannel.id].selected = false;
        }
        selectedChannel = action.data;
      }

      return {
        ...state,
        channels: channels,
        selectedChannel: selectedChannel,
        lastVisitedChannel: selectedChannel
      };
    case "GET_CHANNELS_SUCCESS": {
      let channels = { ...state.channels };
      action.data.results
        .filter((r) => {
          return !(state.selectedChannel && state.selectedChannel.id === r.id);
        })
        .forEach((r) => {
          channels[r.id] = {
            ...channels[r.id],
            ...r,
            hasMore: true,
            skip: 0,
            replies: [],
            selected: false,
            isFetching: false,
          };
        });

      return {
        ...state,
        channels: channels,
        channelsLoaded: true,
      };
    }
    case "GET_WORKSPACE_CHANNELS_SUCCESS": {
      let channels = { ...state.channels };
      action.data
        .filter((r) => {
          return !(state.selectedChannel && state.selectedChannel.id === r.id);
        })
        .forEach((r) => {
          channels[r.id] = {
            ...channels[r.id],
            ...r,
            hasMore: true,
            skip: 0,
            replies: [],
            selected: false,
            isFetching: false,
          };
        });

      return {
        ...state,
        channels: channels,
      };
    }
    case "GET_CHANNEL_SUCCESS": {
      let channel = state.channels[action.data.id];

      if (typeof channel === "undefined")
        channel = {
          ...action.data,
          hasMore: true,
          skip: 0,
          isFetching: false,
        };

      return {
        ...state,
        channels: {
          ...state.channels,
          [action.data.id]: channel,
        },
      };
    }
    case "GET_WORKSPACES_SUCCESS": {
      //let topics = action.data.workspaces.map(ws => ws.topics).flat().filter(t => t !== undefined);
      // let topicChannels = action.data.workspaces.map(ws => {
      //     if (ws.type === "FOLDER") {
      //         return ws.topics
      //     } else if (ws.type === "WORKSPACE") {
      //         return ws.topic_detail
      //     }
      // })
      // console.log(topicChannels.flat());
      return state;
    }
    case "UPDATE_CHANNEL_REDUCER": {
      let channel = {
        ...state.channels[action.data.id],
        ...action.data,
      };

      return {
        ...state,
        channels: {
          ...state.channels,
          [action.data.id]: channel,
        },
        selectedChannel: state.selectedChannel && state.selectedChannel.id === channel.id ? channel : state.selectedChannel,
      };
    }
    case "SET_SELECTED_CHANNEL": {
      let channel = {
        ...state.channels[action.data.id],
        // ...action.data,
        // replies: [
        //   ...state.channels[action.data.id].replies,
        //   //...action.data.replies,
        // ],
      };

      let updatedChannels = { ...state.channels };
      if (state.selectedChannel) {
        updatedChannels[state.selectedChannel.id].selected = false;
        updatedChannels[action.data.id].selected = true;
      }

      return {
        ...state,
        selectedChannel: channel,
        channels: updatedChannels,
        lastVisitedChannel: channel.type !== "TOPIC" ? channel : state.lastVisitedChannel
      };
    }
    case "UPDATE_MEMBER_TIMESTAMP": {
      let channel = null;
      if (Object.keys(state.channels).length > 0 && state.channels.hasOwnProperty(action.data.channel_id)) {
        channel = { ...state.channels[action.data.channel_id] };
        channel = {
          ...channel,
          is_read: true,
          total_unread: state.user && state.user.id === action.data.member_id ? 0 : channel.total_unread,
          members: channel.members.map((m) => {
            if (m.id === action.data.member_id) {
              return {
                ...m,
                last_visited_at: {
                  timestamp: action.data.timestamp + 3,
                },
              };
            } else return m;
          }),
          replies:
            action.data.member_id === state.user.id
              ? channel.replies.map((r) => {
                  return {
                    ...r,
                    is_read: true,
                  };
                })
              : channel.replies,
        };
      }
      return {
        ...state,
        channels:
          channel !== null
            ? {
                ...state.channels,
                [action.data.channel_id]: channel,
              }
            : state.channels,
        selectedChannel: state.selectedChannel && state.selectedChannel.id === parseInt(action.data.channel_id) ? channel : state.selectedChannel,
      };
    }
    case "ADD_TO_CHANNELS": {
      return {
        ...state,
        channels: {
          ...state.channels,
          [action.data.id]: action.data,
        },
      };
    }
    case "GET_CHAT_MESSAGES_SUCCESS": {
      let channel = { ...state.channels[action.data.channel_id] };
      let messsages = [...action.data.results.map((r) => {
        return {
          ...r,
          is_read: true,
          channel_id: action.data.channel_id,
          //g_date: localizeDate(r.created_at.timestamp, "YYYY-MM-DD"),
        };
      }), ...channel.replies];
      let uniqMessages = uniqByProp(messsages, "id");
      channel = {
        ...channel,
        replies: uniqMessages.sort((a, b) => a.created_at.timestamp - b.created_at.timestamp),
        read_only: action.data.read_only,
        hasMore: action.data.results.length === 20,
        skip: channel.skip === 0 && channel.replies.length ? channel.replies.length + 20 : channel.skip + 20,
        isFetching: false
      };
      return {
        ...state,
        channels: {
          ...state.channels,
          [action.data.channel_id]: channel,
        },
        selectedChannel: channel.id === state.selectedChannel.id ? channel : state.selectedChannel,
      };
    }
    case "MARK_ALL_MESSAGES_AS_READ": {
      let channel = null;
      if (Object.keys(state.channels).length > 0 && state.channels.hasOwnProperty(action.data.channel_id)) {
        channel = { ...state.channels[action.data.channel_id] };
        channel = {
          ...channel,
          replies: channel.replies.map((r) => {
            return {
              ...r,
              is_read: true,
            };
          }),
        };
      }
      return {
        ...state,
        channels:
          channel !== null
            ? {
                ...state.channels,
                [action.data.channel_id]: channel,
              }
            : state.channels,
        selectedChannel:
          state.selectedChannel && state.selectedChannel.id === action.data.channel_id
            ? {
                ...channel,
              }
            : state.selectedChannel,
      };
    }
    case "UPDATE_UNREAD_CHAT_REPLIES": {
      return {
        ...state,
        selectedChannel: action.data.id === state.selectedChannel.id ? action.data : state.selectedChannel,
        channels: {
          ...state.channels,
          [action.data.id]: action.data,
        },
        unreadChatCount: state.unreadChatCount > 0 ? state.unreadChatCount - action.data.minus_count : state.unreadChatCount,
      };
    }
    case "ADD_CHAT_MESSAGE": {
      let channel = { ...state.channels[action.data.channel_id] };
      channel = {
        ...channel,
        replies: [...channel.replies, action.data],
      };
      return {
        ...state,
        channels: {
          ...state.channels,
          [action.data.channel_id]: channel,
        },
        selectedChannel:
          state.selectedChannel.id === action.data.channel_id
            ? {
                ...state.selectedChannel,
                replies: [...state.selectedChannel.replies, action.data],
              }
            : state.selectedChannel,
      };
    }
    case "INCOMING_CHAT_MESSAGE": {
      let haveReference = false;
      let channel = null;
      if (Object.keys(state.channels).length > 0 && state.channels.hasOwnProperty(action.data.channel_id)) {
        channel = { ...state.channels[action.data.channel_id] };
        if (channel.id === action.data.channel_id && action.data.user.id === state.user.id) {
          if (action.data.reference_id) haveReference = channel.replies.some((r) => r.reference_id === action.data.reference_id);
        }
        channel = {
          ...channel,
          is_hidden: false,
          replies: haveReference
            ? channel.replies.map((r) => {
              if (r.id === action.data.reference_id) {
                r.id = action.data.id;
                return r;
              } else {
                r.is_read = true;
                return r;
              }
            })
            : [...channel.replies, action.data].sort((a, b) => a.created_at.timestamp - b.created_at.timestamp),
          last_visited_at_timestamp: getCurrentTimestamp(),
          last_reply: action.data,
          total_unread: action.data.is_read ? 0 : channel.total_unread + 1,
        };
      }
      return {
        ...state,
        selectedChannel:
          state.selectedChannel && channel && state.selectedChannel.id === channel.id
            ? channel
            : state.selectedChannel,
        channels:
          channel !== null
            ? {
                ...state.channels,
                [action.data.channel_id]: channel,
              }
            : state.channels,
      };
    }
    case "INCOMING_CHAT_MESSAGE_FROM_OTHERS": {
      let channel = null;
      if (Object.keys(state.channels).length > 0 && state.channels.hasOwnProperty(action.data.reply.channel_id)) {
        channel = { ...state.channels[action.data.reply.channel_id] };
        channel = {
          ...channel,
          replies: [...channel.replies, action.data.reply],
          is_hidden: false,
          last_reply: action.data.last_reply,
          total_unread: state.selectedChannel && state.selectedChannel.id === action.data.reply.channel_id ? channel.total_unread : channel.total_unread + 1,
        };
      }
      return {
        ...state,
        channels:
          channel !== null
            ? {
                ...state.channels,
                [action.data.reply.channel_id]: channel,
              }
            : state.channels,
        selectedChannel:
          state.selectedChannel && state.selectedChannel.id === action.data.reply.channel_id && state.selectedChannel.replies
            ? {
                ...state.selectedChannel,
                replies: [...state.selectedChannel.replies, action.data.reply],
                last_reply: action.data.last_reply ? action.data.last_reply : state.selectedChannel.last_reply,
              }
            : state.selectedChannel,
      };
    }
    case "GENERATE_UNFURL_REDUCER": {
      if (action.data.channel_id) {
        let channel = null;
        if (Object.keys(state.channels).length > 0 && state.channels.hasOwnProperty(action.data.channel_id)) {
          channel = { ...state.channels[action.data.channel_id] };
          channel = {
            ...channel,
            replies: channel.replies.map((r) => {
              if (r.id === action.data.message_id) {
                return {
                  ...r,
                  unfurls: action.data.unfurls,
                  unfurl_loading: false,
                };
              } else {
                return r;
              }
            }),
          };
        }
        return {
          ...state,
          selectedChannel:
            state.selectedChannel && state.selectedChannel.id === action.data.channel_id
              ? {
                  ...state.selectedChannel,
                  replies: state.selectedChannel.replies.map((r) => {
                    if (r.id === action.data.message_id) {
                      return {
                        ...r,
                        unfurls: action.data.unfurls,
                        unfurl_loading: false,
                      };
                    } else {
                      return r;
                    }
                  }),
                }
              : state.selectedChannel,
          channels:
            channel !== null
              ? {
                  ...state.channels,
                  [action.data.channel_id]: channel,
                }
              : state.channels,
        };
      } else {
        return state;
      }
    }
    case "INCOMING_ARCHIVED_CHANNEL": {
      let channel = null;
      if (Object.keys(state.channels).length > 0 && state.channels.hasOwnProperty(action.data.channel_id)) {
        channel = { ...state.channels[action.data.channel_id] };
        channel = {
          ...channel,
          is_archived: action.data.status === "ARCHIVED" ? true : false,
        };
      }
      return {
        ...state,
        channels:
          channel !== null
            ? {
                ...state.channels,
                [action.data.channel_id]: channel,
              }
            : state.channels,
        selectedChannel:
          state.selectedChannel && state.selectedChannel.id === action.data.channel_id
            ? {
                ...state.selectedChannel,
                is_archived: action.data.status === "ARCHIVED" ? true : false,
              }
            : state.selectedChannel,
      };
    }
    case "ARCHIVE_REDUCER": {
      let channel = null;
      if (Object.keys(state.channels).length > 0 && state.channels.hasOwnProperty(action.data.channel_id)) {
        channel = { ...state.channels[action.data.channel_id] };
        channel = {
          ...channel,
          is_archived: action.data.status === "ARCHIVED" ? true : false,
        };
      }
      return {
        ...state,
        channels:
          channel !== null
            ? {
                ...state.channels,
                [action.data.channel_id]: channel,
              }
            : state.channels,
        selectedChannel:
          state.selectedChannel && state.selectedChannel.id === action.data.channel_id
            ? {
                ...state.selectedChannel,
                is_archived: action.data.status === "ARCHIVED" ? true : false,
              }
            : state.selectedChannel,
      };
    }
    case "UNARCHIVE_REDUCER": {
      let channel = null;
      if (Object.keys(state.channels).length > 0 && state.channels.hasOwnProperty(action.data.channel_id)) {
        channel = { ...state.channels[action.data.channel_id] };
        channel = {
          ...channel,
          is_archived: action.data.status === "UNARCHIVED" ? false : true,
        };
      }
      return {
        ...state,
        channels:
          channel !== null
            ? {
                ...state.channels,
                [action.data.channel_id]: channel,
              }
            : state.channels,
        selectedChannel:
          state.selectedChannel && state.selectedChannel.id === action.data.channel_id
            ? {
                ...state.selectedChannel,
                is_archived: action.data.status === "UNARCHIVED" ? false : true,
              }
            : state.selectedChannel,
      };
    }
    case "INCOMING_CHAT_MESSAGE_REACTION": {
      let channel = null;
      if (Object.keys(state.channels).length > 0 && state.channels.hasOwnProperty(action.data.channel_id)) {
        channel = { ...state.channels[action.data.channel_id] };
        channel = {
          ...channel,
          replies: channel.replies.map((r) => {
            if (r.id === action.data.message_id) {
              if (action.data.status === "CREATED") {
                let reactions = r.reactions.filter((reaction) => reaction.id !== action.data.id);
                return Object.assign({}, r, { reactions: [...reactions, action.data] });
              } else {
                return Object.assign({}, r, { reactions: r.reactions.filter((reaction) => reaction.id !== action.data.id) });
              }
            } else return r;
          }),
        };
      }
      return {
        ...state,
        channels:
          channel !== null
            ? {
                ...state.channels,
                [action.data.channel_id]: channel,
              }
            : state.channels,
        selectedChannel:
          state.selectedChannel && state.selectedChannel.id === action.data.channel_id
            ? {
                ...channel,
              }
            : state.selectedChannel,
      };
    }
    case "SET_CHANNEL_HISTORICAL_POSITION": {
      let channelExists = false;
      if (state.historicalPositions.length) {
        state.historicalPositions.forEach((hp) => {
          if (hp.channel_id === action.data.channel_id) {
            channelExists = true;
          }
        });
        if (channelExists) {
          return {
            ...state,
            historicalPositions: state.historicalPositions.map((h) => {
              if (h.channel_id === action.data.channel_id) {
                return action.data;
              } else return h;
            }),
          };
        } else {
          return {
            ...state,
            historicalPositions: [...state.historicalPositions, action.data],
          };
        }
      } else {
        return {
          ...state,
          historicalPositions: [action.data],
        };
      }
    }
    case "INCOMING_UPDATED_CHAT_MESSAGE": {
      let channel = null;
      if (Object.keys(state.channels).length > 0 && state.channels.hasOwnProperty(action.data.channel_id)) {
        channel = { ...state.channels[action.data.channel_id] };
        channel = {
          ...channel,
          replies: channel.replies.map((r) => {
            if (r.id === action.data.id) {
              return {
                ...r,
                body: action.data.body,
                updated_at: action.data.updated_at,
              };
            } else return r;
          }).sort((a, b) => a.created_at.timestamp - b.created_at.timestamp),
          last_reply:
            channel.last_reply && channel.last_reply.id === action.data.id
              ? {
                  ...channel.last_reply,
                  body: action.data.body,
                }
              : channel.last_reply,
        };
      }
      return {
        ...state,
        channels:
          channel !== null
            ? {
                ...state.channels,
                [action.data.channel_id]: channel,
              }
            : state.channels,
        selectedChannel:
          state.selectedChannel && state.selectedChannel.id === action.data.channel_id
            ? {
                ...channel,
              }
            : state.selectedChannel,
      };
    }
    case "SET_EDIT_CHAT_MESSAGE": {
      return {
        ...state,
        editChatMessage: action.data,
      };
    }
    case "INCOMING_DELETED_CHAT_MESSAGE": {
      let channel = null;
      if (Object.keys(state.channels).length > 0 && state.channels.hasOwnProperty(action.data.channel_id)) {
        channel = { ...state.channels[action.data.channel_id] };
        channel = {
          ...channel,
          replies: channel.replies.map((r) => {
            if (r.id === action.data.id) {
              return {
                ...r,
                is_deleted: true,
                //body: "CHAT_MESSAGE_DELETED",
                body: "The chat message has been deleted",
                files: [],
              };
            } else {
              return r;
            }
          }).sort((a, b) => a.created_at.timestamp - b.created_at.timestamp),
          last_reply:
            channel.last_reply.id === action.data.id
              ? {
                  ...channel.last_reply,
                  body: "The chat message has been deleted",
                  is_deleted: true,
                }
              : channel.last_reply,
        };
      }
      return {
        ...state,
        channels:
          channel !== null
            ? {
                ...state.channels,
                [action.data.channel_id]: channel,
              }
            : state.channels,
        selectedChannel:
          state.selectedChannel && state.selectedChannel.id === action.data.channel_id
            ? {
                ...channel,
              }
            : state.selectedChannel,
      };
    }
    case "ON_CLICK_SEND_BUTTON": {
      return {
        ...state,
        sendButtonClicked: action.data,
      };
    }
    case "ADD_QUOTE": {
      let updatedQuotes = state.chatQuotes;
      if (Object.keys(state.chatQuotes).length > 0 && state.chatQuotes.hasOwnProperty(action.data.channel_id)) {
        updatedQuotes = { ...state.chatQuotes };
        delete updatedQuotes[action.data.channel_id];
        updatedQuotes = {
          ...updatedQuotes,
          [action.data.channel_id]: action.data,
        };
      } else {
        updatedQuotes = {
          ...state.chatQuotes,
          [action.data.channel_id]: action.data,
        };
      }
      return {
        ...state,
        chatQuotes: updatedQuotes,
      };
    }
    case "CLEAR_QUOTE": {
      let updatedQuotes = { ...state.chatQuotes };
      delete updatedQuotes[action.data.channel_id];

      return {
        ...state,
        chatQuotes: updatedQuotes,
      };
    }
    case "SAVE_DRAFT_SUCCESS": {
      let updatedDrafts = { ...state.channelDrafts };
      if (action.data.data.draft_type === "channel") {
        updatedDrafts[action.data.data.channel_id] = {
          ...action.data.data,
          draft_id: action.data.id
        }
      }
      return {
        ...state,
        channelDrafts: updatedDrafts
      };
    }
    case "ADD_TO_CHANNEL_DRAFTS": {
      let updatedChannelDrafts = state.channelDrafts;
      if (Object.keys(state.channelDrafts).length > 0 && state.channelDrafts.hasOwnProperty(action.data.channel_id)) {
        updatedChannelDrafts = { ...state.channelDrafts };
        delete updatedChannelDrafts[action.data.channel_id];
        updatedChannelDrafts = {
          ...updatedChannelDrafts,
          [action.data.channel_id]: action.data,
        };
      } else {
        updatedChannelDrafts = {
          ...updatedChannelDrafts,
          [action.data.channel_id]: action.data,
        };
      }
      return {
        ...state,
        channelDrafts: updatedChannelDrafts,
      };
    }
    case "CLEAR_CHANNEL_DRAFT": {
      let updatedChannelDrafts = { ...state.channelDrafts };
      delete updatedChannelDrafts[action.data.channel_id];

      return {
        ...state,
        channelDrafts: updatedChannelDrafts,
      };
    }
    case "GET_CHANNEL_DRAFTS_SUCCESS": {
      let channelDrafts = state.channelDrafts;
      action.data
        .filter((item) => {
          return item.data.type === "channel";
        })
        .forEach((item) => {
          channelDrafts[item.data.channel_id] = {
            ...item.data,
            draft_id: item.id,
          };
        });
      return {
        ...state,
        channelDrafts: channelDrafts,
      };
    }
    case "INCOMING_UPDATED_CHANNEL_DETAIL": {
      let channel = null;
      if (Object.keys(state.channels).length > 0 && state.channels.hasOwnProperty(action.data.id)) {
        channel = { ...state.channels[action.data.id] };
        channel = {
          ...channel,
          members: action.data.members,
          title: action.data.title,
          replies: [...channel.replies, action.data.message].sort((a, b) => a.created_at.timestamp - b.created_at.timestamp),
        };
      }
      return {
        ...state,
        channels:
          channel !== null
            ? {
                ...state.channels,
                [action.data.id]: channel,
              }
            : state.channels,
        selectedChannel:
          state.selectedChannel && state.selectedChannel.id === action.data.id
            ? {
                ...channel,
              }
            : state.selectedChannel,
      };
    }
    case "ADD_USER_TO_REDUCERS": {
      return {
        ...state,
        user: action.data,
      };
    }
    case "UPDATE_CHAT_MESSAGE_REMINDER_COMPLETE": {
      let channel = null;
      if (Object.keys(state.channels).length > 0 && state.channels.hasOwnProperty(action.data.channel_id)) {
        channel = { ...state.channels[action.data.channel_id] };
        channel = {
          ...channel,
          replies: channel.replies.map((r) => {
            if (r.id === action.data.message_id) {
              if (r.original_body) r.body = r.original_body;

              const channelName = r.body.replace(r.body.substr(0, r.body.search(" in ") + 4, r.body), "");
              r.body = r.body.replace(` in ${channelName}`, ` in <a class="push" data-href="/chat/${r.quote.channel_code}">#${channelName}</a>`);

              const link = `/chat/${r.quote.channel_code}/${r.quote.code}`;
              r.body = r.body.replace("this message", `<a class="push" data-href="${link}">this message</a>`);

              r.body = `<span class="completed">${r.body}</span><br/> ${r.original_body.replace("You asked me to remind you", "OK! I’ve marked the reminder")} as complete.`;
              return r;
            } else return r;
          }),
        };
      }
      return {
        ...state,
        channels:
          channel !== null
            ? {
                ...state.channels,
                [action.data.channel_id]: channel,
              }
            : state.channels,
        selectedChannel:
          state.selectedChannel && state.selectedChannel.id === action.data.channel_id
            ? {
                ...channel,
              }
            : state.selectedChannel,
      };
    }
    case "UPDATE_CHANNEL_MEMBERS_TITLE": {
      let channel = null;
      if (Object.keys(state.channels).length > 0 && state.channels.hasOwnProperty(action.data.channel_id)) {
        channel = { ...state.channels[action.data.channel_id] };
        channel = {
          ...channel,
          members: action.data.members,
          title: action.data.title,
        };
      }
      return {
        ...state,
        channels:
          channel !== null
            ? {
                ...state.channels,
                [action.data.channel_id]: channel,
              }
            : state.channels,
        selectedChannel:
          state.selectedChannel && state.selectedChannel.id === action.data.channel_id
            ? {
                ...channel,
              }
            : state.selectedChannel,
      };
    }
    case "SAVE_LAST_VISITED_CHANNEL": {
      let channel = state.channels[action.data.id];

      if (typeof channel === "undefined") {
        channel = action.data;
      }

      return {
        ...state,
        lastVisitedChannel: channel,
      };
    }
    case "RESTORE_LAST_VISITED_CHANNEL": {
      let channel = { ...state.channels[action.data.channel_id] };
      return {
        ...state,
        selectedChannel: channel.hasOwnProperty("id") ? channel : state.selectedChannel,
      };
    }
    case "CLEAR_SELECTED_CHANNEL": {
      return {
        ...state,
        selectedChannel: state.lastVisitedChannel ? {...state.channels[state.lastVisitedChannel.id]} : null
      };
    }
    case "JOIN_WORKSPACE_REDUCER": {
      let updatedChannels = { ...state.channels };
      let updatedChannel = state.selectedChannel ? { ...state.selectedChannel } : null;
      if (Object.keys(updatedChannels).length && updatedChannels.hasOwnProperty(action.data.channel_id)) {
        let channel = {
          ...updatedChannels[action.data.channel_id],
          members: [...updatedChannels[action.data.channel_id].members, ...action.data.users],
          replies: [...updatedChannels[action.data.channel_id].replies, action.data.message]
        }
        updatedChannels[action.data.channel_id].members = [...updatedChannels[action.data.channel_id].members, ...action.data.users];
        updatedChannels[action.data.channel_id].replies = [...updatedChannels[action.data.channel_id].replies, action.data.message];
        if (updatedChannel && channel.id === updatedChannel.id) {
          updatedChannel = channel;
        }
      }
      return {
        ...state,
        channels: updatedChannels,
        selectedChannel: updatedChannel
      }
    }
    case "UNREAD_CHANNEL_REDUCER": {
      let updatedChannels = { ...state.channels };
      if (updatedChannels.hasOwnProperty(action.data.channel_id)) {
        updatedChannels = {
          ...updatedChannels,
          [action.data.channel_id]: {
            ...updatedChannels[action.data.channel_id],
            is_read: false,
          },
        };
      }
      return {
        ...state,
        channels: updatedChannels,
        selectedChannel:
          state.selectedChannel && state.selectedChannel.id === action.data.channel_id
            ? {
                ...state.selectedChannel,
                is_read: false,
              }
            : state.selectedChannel,
      };
    }
    case "UPDATE_UNREAD_LIST_COUNTER": {
      let updatedChannels = { ...state.channels };
      let updatedChannel = { ...state.selectedChannel };
      if (action.data.entity_group_type === "UNREAD_CHANNEL") {
        if (updatedChannels.hasOwnProperty(action.data.entity_id)) {
          updatedChannels[action.data.entity_id].is_read = false;
          if (state.selectedChannel && state.selectedChannel.id === action.data.entity_id) {
            updatedChannel.is_read = false;
          }
        }
        return {
          ...state,
          channels: updatedChannels,
          selectedChannel: updatedChannel,
        };
      } else {
        return state;
      }
    }
    case "INCOMING_UPDATED_WORKSPACE_FOLDER": {
      if (Object.keys(state.channels).length && action.data.type === "WORKSPACE") {
        let updatedChannels = { ...state.channels };
        if (updatedChannels.hasOwnProperty(action.data.channel.id)) {
          let channel = updatedChannels[action.data.channel.id];
          if (action.data.system_message) {
            let message = {
              ...action.data.system_message,
              created_at: action.data.updated_at,
              editable: false,
              is_read: true,
              is_deleted: false,
              files: [],
              reactions: [],
              unfurls: [],
            }
            updatedChannels[action.data.channel.id].replies = [...updatedChannels[action.data.channel.id].replies, message]
          }
          // if (action.data.new_member_ids.length) {
          //   let newMembers = action.data.members
          //     .filter((m) => {
          //       const isNewMember = action.data.new_member_ids.some((id) => id === m.id);
          //       return isNewMember;
          //     })
          //     .map((m) => {
          //       return {
          //         ...m,
          //         bot_profile_image_link: null,
          //         last_visited_at: null,
          //       };
          //     });
          //   channel.members = [...channel.members, ...newMembers];
          // }
          channel.members = action.data.members.map((m) => {
            return {
              ...m,
              bot_profile_image_link: null,
              last_visited_at: null,
            }
          })
          channel.title = action.data.name;
          // if (action.data.remove_member_ids.length) {
          //   channel.members = channel.members.filter((m) => {
          //     const isMember = action.data.remove_member_ids.some((id) => id === m.id);
          //     return !isMember;
          //   });
          // }
          return {
            ...state,
            channels: updatedChannels,
            selectedChannel: state.selectedChannel && state.selectedChannel.id === channel.id ? channel : state.selectedChannel,
          };
        } else {
          return state;
        }
      } else {
        return state;
      }
    }
    case "REMOVE_UNFURL": {
      let channels = { ...state.channels };
      let channel = null;
      if (action.data.type === "chat" && channels.hasOwnProperty(action.data.channel_id)) {
        channel = {
          ...channels[action.data.channel_id],
          replies: channels[action.data.channel_id].replies.map((m) => {
            if (m.id === action.data.message_id) {
              return {
                ...m,
                unfurls: m.unfurls.filter((u) => u.id !== action.data.unfurl_id)
              };
            } else {
              return m;
            }
          })
        }
        channels[action.data.channel_id] = channel;
      }
      return {
        ...state,
        channels: channels,
        selectedChannel: state.selectedChannel && channel && channel.id === state.selectedChannel.id ? channel : state.selectedChannel
      }
    }
    case "LEAVE_WORKSPACE": {
      let updatedChannels = { ...state.channels };
      if (updatedChannels.hasOwnProperty(action.data.channel_id)) {
        updatedChannels[action.data.channel_id].members = updatedChannels[action.data.channel_id].members.filter((m) => m.id !== state.user.id);
      }
      return {
        ...state,
        channels: updatedChannels,
        selectedChannel: state.selectedChannel && state.selectedChannel.id === action.data.channel_id ? 
        {
          ...state.selectedChannel,
          members: state.selectedChannel.members.filter((m) => m.id !== state.user.id)
        }
        : state.selectedChannel
      }
    }
    case "INCOMING_EXTERNAL_USER": {
      let updatedChannel = state.selectedChannel ? { ...state.selectedChannel } : null;
      let updatedChannels = { ...state.channels };
      if (updatedChannel) {
        updatedChannel = {
          ...updatedChannel,
          members: updatedChannel.members.map((m) => {
            if (m.id === action.data.current_user.id) {
              return {
                ...m,
                ...action.data.current_user
              }
            } else {
              return m;
            }
          })
        }
        updatedChannels[updatedChannel.id] = updatedChannel;
      }
      return {
        ...state,
        selectedChannel: updatedChannel,
        channels: updatedChannels
      }
    }
    case "SET_FETCHING_MESSAGES": {
      let updatedChannels = { ...state.channels };
      if (updatedChannels.hasOwnProperty(action.data.id)) {
        updatedChannels[action.data.id].isFetching = action.data.status;
      }
      return {
        ...state,
        channels: updatedChannels,
        selectedChannel: state.selectedChannel && state.selectedChannel.id === action.data.id ? { ...state.selectedChannel, isFetching: action.data.status } : state.selectedChannel
      }
    }
    case "SET_LAST_CHAT_VISIBILITY": {
      return {
        ...state,
        isLastChatVisible: action.data.status
      }
    }
    case "DELETE_POST_NOTIFICATION": {
      let channels = {...state.channels};
      let selectedChannel = state.selectedChannel ? {...state.selectedChannel} : null
      action.data.forEach((data) => {
        if (channels.hasOwnProperty(data.channel.id)) {
          if (channels[data.channel.id].replies.length) {
            channels[data.channel.id].replies = channels[data.channel.id].replies.filter((r) => r.id !== data.system_message.id);
          }
        }
        if (selectedChannel && selectedChannel.id === data.channel.id && selectedChannel.replies.length) {
          selectedChannel.replies = selectedChannel.replies.filter((r) => r.id !== data.system_message.id)
        }
      })
      return {
        ...state,
        channels: channels,
        selectedChannel: selectedChannel
      }
    }
    case "INCOMING_POST_NOTIFICATION_MESSAGE": {
      let channel = null;
      if (Object.keys(state.channels).length > 0 && state.channels.hasOwnProperty(action.data.channel_id)) {
        channel = { ...state.channels[action.data.channel_id] };
        channel = {
          ...channel,
          is_hidden: false,
          replies: channel.replies.some((r) => r.id === action.data.id) ? 
            channel.replies.map((r) => {
              if (r.id === action.data.id) {
                return action.data
              } else {
                return r
              }
            })
            : [...channel.replies, action.data]
        };
      }
      return {
        ...state,
        selectedChannel:
          state.selectedChannel && state.selectedChannel.id === action.data.channel_id
            ? channel
            : state.selectedChannel,
        channels:
          channel !== null
            ? {
                ...state.channels,
                [action.data.channel_id]: channel,
              }
            : state.channels,
      };
    }
    default:
      return state;
  }
}
