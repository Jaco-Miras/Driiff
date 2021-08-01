//import {uniqBy} from "lodash";
import { getCurrentTimestamp, getTimestampInMins } from "../../helpers/dateFormatter";
import { uniqByProp } from "../../helpers/arrayHelper";

/** Initial State  */
const INITIAL_STATE = {
  user: null,
  companyChannel: null,
  channels: {},
  selectedChannel: null,
  selectedChannelId: null,
  startNewChannels: {},
  channelDrafts: {},
  unreadChatCount: 0,
  historicalPositions: [],
  editChatMessage: null,
  sendButtonClicked: false,
  chatQuotes: {},
  channelsLoaded: false,
  lastVisitedChannel: null,
  isLastChatVisible: false,
  lastReceivedMessage: null,
  chatSidebarSearch: "",
  searchingChannels: false,
  channelRange: {},
  channelDraftsLoaded: false,
  bots: {
    loaded: false,
    channels: [],
    user_bots: [],
  },
  huddleBots: [],
  huddleBot: null,
  editHuddle: null,
  fetch: {
    skip: 0,
    limit: 25,
    fetching: false,
    hasMore: false,
  },
  skipIds: [],
  hasUnpublishedAnswers: [],
  searchArchivedChannels: false,
};

const date = new Date();
const today = date.getDate();
const thisYear = date.getFullYear();
const thisMonth = date.getMonth();
const isLeapYear = (thisYear % 4 === 0 && thisYear % 100 !== 0) || thisYear % 400 === 0;

const monthDates = {
  0: { maxDate: 31 },
  1: { maxDate: isLeapYear ? 29 : 28 },
  2: { maxDate: 31 },
  3: { maxDate: 30 },
  4: { maxDate: 31 },
  5: { maxDate: 30 },
  6: { maxDate: 31 },
  7: { maxDate: 31 },
  8: { maxDate: 30 },
  9: { maxDate: 31 },
  10: { maxDate: 30 },
  11: { maxDate: 31 },
};
const monthHasDate = (month, date) => {
  return monthDates[month].maxDate >= date;
};

const isWeekend = (d) => {
  if (d.getDay() === 0 || d.getDay() === 6) {
    return true;
  } else {
    return false;
  }
};

const toNextMonday = (d, plusDays) => {
  const adjustedDate = d;
  adjustedDate.setDate(d.getDate() + plusDays);
  return adjustedDate;
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case "SET_SIDEBAR_SEARCH": {
      return {
        ...state,
        chatSidebarSearch: action.data.value,
        searchingChannels: action.data.searching,
      };
    }
    case "GET_GLOBAL_RECIPIENTS_SUCCESS": {
      let channels = { ...state.channels };
      action.data.result
        .filter((r) => {
          if (r.id) {
            if (r.type === "DIRECT" && r.profile) {
              return true;
            } else {
              return false;
            }
          } else {
            return false;
          }
        })
        .forEach((ac) => {
          if (ac.type === "DIRECT") {
            ac.members = [
              {
                ...ac.profile,
              },
              {
                id: state.user.id,
                name: state.user.name,
                profile_image_link: state.user.profile_image_link,
                profile_image_thumbnail_link: state.user.profile_image_thumbnail_link ? state.user.profile_image_thumbnail_link : state.user.profile_image_link,
                email: state.user.email,
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
    case "RENAME_CHANNEL_KEY": {
      let channels = { ...state.channels };
      delete channels[action.data.old_id];
      delete action.data.old_id;
      let newChannel = { ...action.data, selected: true };
      let previousSelectedChannel = { ...state.selectedChannel };
      if (action.data.selected) {
        if (previousSelectedChannel) {
          channels[previousSelectedChannel.id].selected = false;
        }
        ///selectedChannel = action.data;
      }

      return {
        ...state,
        channels: {
          ...channels,
          [newChannel.id]: newChannel,
        },
        selectedChannel: newChannel,
        lastVisitedChannel: newChannel,
      };
    }
    // case "GET_CHANNELS_SUCCESS": {
    //   let channels = { ...state.channels };
    //   if (action.data.results.length > 0) {
    //     action.data.results
    //       .filter((r) => r.id !== null)
    //       .filter((r) => {
    //         return !(state.selectedChannel && state.selectedChannel.id === r.id);
    //       })
    //       .forEach((r) => {
    //         channels[r.id] = {
    //           ...(typeof channels[r.id] !== "undefined" && channels[r.id]),
    //           ...r,
    //           hasMore: true,
    //           skip: 0,
    //           replies: [],
    //           selected: false,
    //           isFetching: false,
    //         };
    //       });
    //   }
    //   return {
    //     ...state,
    //     channels: channels,
    //     channelsLoaded: true,
    //   };
    // }
    case "ADD_CHANNELS": {
      let channels = { ...state.channels };
      let fetchedChannels = {};
      action.data.channels
        .filter((r) => r.id !== null)
        .filter((r) => {
          return !(state.selectedChannel && state.selectedChannel.id === r.id);
        })
        .forEach((r) => {
          if (channels.hasOwnProperty(r.id)) {
            fetchedChannels[r.id] = {
              ...(typeof fetchedChannels[r.id] !== "undefined" && fetchedChannels[r.id]),
              ...r,
              replies: channels[r.id].replies,
              hasMore: true,
              skip: 0,
              isFetching: false,
            };
          } else {
            fetchedChannels[r.id] = {
              ...(typeof fetchedChannels[r.id] !== "undefined" && fetchedChannels[r.id]),
              ...r,
              hasMore: true,
              skip: 0,
              replies: [],
              selected: false,
              isFetching: false,
            };
          }
        });
      return {
        ...state,
        channels: {
          ...state.channels,
          ...fetchedChannels,
        },
        fetch: {
          skip: action.data.channels.length + state.fetch.skip,
          limit: 25,
          fetching: false,
          hasMore: action.data.channels.length === 25,
        },
        channelsLoaded: true,
      };
    }
    case "SEARCH_CHANNELS_SUCCESS": {
      let channels = { ...state.channels };
      if (action.data.results.length > 0) {
        action.data.results
          .filter((r) => r.id !== null)
          .filter((r) => {
            return !(state.selectedChannel && state.selectedChannel.id === r.id);
          })
          .forEach((r) => {
            if (!channels.hasOwnProperty(r.id)) {
              channels[r.id] = {
                ...(typeof channels[r.id] !== "undefined" && channels[r.id]),
                ...r,
                hasMore: true,
                skip: 0,
                replies: [],
                selected: false,
                isFetching: false,
              };
            }
          });
      }
      return {
        ...state,
        channels: channels,
        searchingChannels: false,
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
        companyChannel: state.companyChannel && state.companyChannel.id === action.data.id ? { ...state.companyChannel, ...action.data } : state.companyChannel,
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
        if (updatedChannels[state.selectedChannel.id]) updatedChannels[state.selectedChannel.id].selected = false;
        if (updatedChannels[action.data.id]) updatedChannels[action.data.id].selected = true;
      }

      return {
        ...state,
        selectedChannel: channel,
        channels: updatedChannels,
        //lastVisitedChannel: channel.type !== "TOPIC" ? channel : state.lastVisitedChannel
        lastVisitedChannel: channel,
        selectedChannelId: action.data.id,
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
            action.data.member_id === state.user.id && channel.replies
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
      let messsages = [
        ...action.data.results.map((r) => {
          return {
            ...r,
            is_read: true,
            body: r.body.replace(/<[/]?img src=\"data:image[^>]*>/gi, ""),
            channel_id: action.data.channel_id,
          };
        }),
        ...channel.replies,
      ];
      let uniqMessages = uniqByProp(messsages, "id");
      channel = {
        ...channel,
        replies: uniqMessages,
        // replies: uniqMessages.sort((a, b) => {
        //   if (a.created_at.timestamp - b.created_at.timestamp === 0) {
        //     return a.id - b.id;
        //   } else {
        //     return a.created_at.timestamp - b.created_at.timestamp;
        //   }
        // }),
        read_only: action.data.read_only,
        hasMore: action.data.results.length === 20,
        skip: channel.skip === 0 && channel.replies.length ? channel.replies.length + 20 : channel.skip + 20,
        isFetching: false,
        replyCount: action.data.total,
      };
      return {
        ...state,
        channels: {
          ...state.channels,
          [action.data.channel_id]: channel,
        },
        ...(channel &&
          state.selectedChannel && {
          selectedChannel: channel.id === state.selectedChannel.id ? channel : state.selectedChannel,
        }),
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
        last_reply: action.data,
        replyCount: channel.replyCount ? channel.replyCount + 1 : 1000,
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
              last_reply: action.data,
            }
            : state.selectedChannel,
      };
    }
    case "SET_TRANSLATED_BODY": {
      let channel = null;
      if (Object.keys(state.channels).length > 0 && state.channels.hasOwnProperty(action.data.channel_id)) {
        channel = { ...state.channels[action.data.channel_id] };
        channel = {
          ...channel,
          is_hidden: false,
          last_reply: channel.last_reply && channel.last_reply.id === action.data.id ? action.data : channel.last_reply,
          replies: channel.replies.map((r) => {
            if (r.id === action.data.id) {
              return action.data;
            } else return r;
          }),
        };
      }
      return {
        ...state,
        selectedChannel: state.selectedChannel && channel && state.selectedChannel.id === channel.id ? channel : state.selectedChannel,
        channels:
          channel !== null
            ? {
              ...state.channels,
              [action.data.channel_id]: channel,
            }
            : state.channels,
      };
    }
    case "SET_FANCY_LINK": {
      let channel = null;
      if (Object.keys(state.channels).length > 0 && state.channels.hasOwnProperty(action.data.channel_id)) {
        channel = { ...state.channels[action.data.channel_id] };
        channel = {
          ...channel,
          is_hidden: false,
          last_reply: channel.last_reply && channel.last_reply.id === action.data.id ? action.data : channel.last_reply,
          replies: channel.replies.map((r) => {
            if (r.id === action.data.id) {
              return action.data;
            } else return r;
          }),
        };
      }
      return {
        ...state,
        selectedChannel: state.selectedChannel && channel && state.selectedChannel.id === channel.id ? channel : state.selectedChannel,
        channels:
          channel !== null
            ? {
              ...state.channels,
              [action.data.channel_id]: channel,
            }
            : state.channels,
      };
    }
    case "SET_CHANNEL_TRANSLATE_STATE": {
      let channel = null;

      if (Object.keys(state.channels).length > 0 && state.channels.hasOwnProperty(action.data.id)) {
        channel = { ...state.channels[action.data.id] };
        channel = {
          ...channel,
          is_translate: action.data.is_translate,
        };
      }

      return {
        ...state,
        selectedChannel: state.selectedChannel && channel && state.selectedChannel.id === channel.id ? channel : state.selectedChannel,
        channels:
          channel !== null
            ? {
              ...state.channels,
              [action.data.id]: channel,
            }
            : state.channels,
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
                return {
                  ...r,
                  id: action.data.id,
                  created_at: action.data.created_at,
                  updated_at: action.data.created_at,
                };
              } else {
                return {
                  ...r,
                  is_read: true,
                };
              }
            })
            : // .sort((a, b) => {
            //   if (a.created_at.timestamp - b.created_at.timestamp === 0) {
            //     return a.id - b.id;
            //   } else {
            //     return a.created_at.timestamp - b.created_at.timestamp;
            //   }
            // })
            [...channel.replies, action.data],
          // .sort((a, b) => {
          //     if (a.created_at.timestamp - b.created_at.timestamp === 0) {
          //       return a.id - b.id;
          //     } else {
          //       return a.created_at.timestamp - b.created_at.timestamp;
          //     }
          //   })
          last_visited_at_timestamp: getCurrentTimestamp(),
          last_reply: action.data,
          total_unread: action.data.is_read ? 0 : channel.total_unread + 1,
          replyCount: (channel.replyCount && action.data.user && action.data.user.id !== state.user.id) || (channel.replyCount && !action.data.user) ? channel.replyCount + 1 : channel.replyCount ? channel.replyCount : 1000,
        };
      }
      return {
        ...state,
        lastReceivedMessage: action.data,
        selectedChannel: state.selectedChannel && channel && state.selectedChannel.id === channel.id ? channel : state.selectedChannel,
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
      const isArchived = action.data.status === "ARCHIVED";
      return {
        ...state,
        channels: {
          ...Object.values(state.channels)
            .map((channel) => {
              if (isArchived) {
                if (action.data.topic_detail) {
                  if (channel.entity_id === action.data.topic_detail.id) {
                    return {
                      ...channel,
                      is_archived: true,
                    };
                  } else {
                    return channel;
                  }
                } else {
                  if (action.data.channel_id === channel.id) {
                    return {
                      ...channel,
                      is_archived: true,
                    };
                  } else {
                    return channel;
                  }
                }
              } else {
                return channel;
              }
            })
            .reduce((channels, channel) => {
              channels[channel.id] = channel;
              return channels;
            }, {}),
        },
        selectedChannel:
          state.selectedChannel && action.data.topic_detail && action.data.topic_detail.id === state.selectedChannel.entity_id
            ? {
              ...state.selectedChannel,
              is_archived: action.data.status === "ARCHIVED" ? true : false,
            }
            : state.selectedChannel && state.selectedChannel.id === action.data.channel_id
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
          }),
          // .sort((a, b) => {
          //   if (a.created_at.timestamp - b.created_at.timestamp === 0) {
          //     return a.id - b.id;
          //   } else {
          //     return a.created_at.timestamp - b.created_at.timestamp;
          //   }
          // }),
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
          }),
          // .sort((a, b) => {
          //   if (a.created_at.timestamp - b.created_at.timestamp === 0) {
          //     return a.id - b.id;
          //   } else {
          //     return a.created_at.timestamp - b.created_at.timestamp;
          //   }
          // }),
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
      // let updatedQuotes = state.chatQuotes;
      // if (Object.keys(state.chatQuotes).length > 0 && state.chatQuotes.hasOwnProperty(action.data.channel_id)) {
      //   updatedQuotes = { ...state.chatQuotes };
      //   delete updatedQuotes[action.data.channel_id];
      //   updatedQuotes = {
      //     ...updatedQuotes,
      //     [action.data.channel_id]: action.data,
      //   };
      // } else {
      //   updatedQuotes = {
      //     ...state.chatQuotes,
      //     [action.data.channel_id]: action.data,
      //   };
      // }
      return {
        ...state,
        chatQuotes: {
          ...state.chatQuotes,
          [state.selectedChannel.id]: { ...action.data, channel_id: state.selectedChannel.id },
        },
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
          draft_id: action.data.id,
        };
      }
      return {
        ...state,
        channelDrafts: updatedDrafts,
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
        channelDraftsLoaded: true,
      };
    }
    case "INCOMING_UPDATED_CHANNEL_DETAIL": {
      let channel = null;
      if (Object.keys(state.channels).length > 0 && state.channels.hasOwnProperty(action.data.id)) {
        channel = { ...state.channels[action.data.id] };
        channel = {
          ...channel,
          ...action.data,
          replies: [...channel.replies, action.data.message],
          //.sort((a, b) => a.created_at.timestamp - b.created_at.timestamp),
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
        channels: {
          ...Object.values(state.channels)
            .map((channel) => {
              return {
                ...channel,
                isFetching: false,
              };
            })
            .reduce((channels, channel) => {
              channels[channel.id] = channel;
              return channels;
            }, {}),
        },
        selectedChannel: state.selectedChannel ? { ...state.selectedChannel, isFetching: false } : state.selectedChannel,
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
        ...(state.lastVisitedChannel && {
          selectedChannel: state.lastVisitedChannel ? { ...state.channels[state.lastVisitedChannel.id] } : null,
        }),
      };
    }
    case "JOIN_WORKSPACE_REDUCER": {
      let updatedChannels = { ...state.channels };
      let updatedChannel = state.selectedChannel ? { ...state.selectedChannel } : null;
      if (Object.keys(updatedChannels).length && updatedChannels.hasOwnProperty(action.data.channel_id)) {
        let channel = {
          ...updatedChannels[action.data.channel_id],
          members: [...updatedChannels[action.data.channel_id].members, ...action.data.users],
          replies: [...updatedChannels[action.data.channel_id].replies, action.data.message],
        };
        updatedChannels[action.data.channel_id].members = [...updatedChannels[action.data.channel_id].members, ...action.data.users];
        updatedChannels[action.data.channel_id].replies = [...updatedChannels[action.data.channel_id].replies, action.data.message];
        if (updatedChannel && channel.id === updatedChannel.id) {
          updatedChannel = channel;
        }
      }
      return {
        ...state,
        channels: updatedChannels,
        selectedChannel: updatedChannel,
      };
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
      let teamPostNotif = [];
      if (action.data.type === "WORKSPACE" && action.data.team_channel && state.channels[action.data.team_channel.id]) {
        teamPostNotif = state.channels[action.data.team_channel.id].replies.filter((r) => r.body.startsWith("POST_CREATE::") && !r.shared_with_client);
      }
      return {
        ...state,
        channels: {
          ...state.channels,
          ...(action.data.type === "WORKSPACE" &&
            state.channels[action.data.channel.id] && {
            [action.data.channel.id]: {
              ...state.channels[action.data.channel.id],
              ...(action.data.system_message && {
                // remove internal post in client chat
                replies: [
                  ...state.channels[action.data.channel.id].replies.filter((r) => {
                    if (r.body.startsWith("POST_CREATE::") && action.data.is_shared && !r.shared_with_client) {
                      return false;
                    } else {
                      return true;
                    }
                  }),
                  {
                    ...action.data.system_message,
                    created_at: action.data.updated_at,
                    editable: false,
                    is_read: true,
                    is_deleted: false,
                    files: [],
                    reactions: [],
                    unfurls: [],
                  },
                  ...teamPostNotif,
                ],
              }),
              icon_link: action.data.channel.icon_link,
              title: action.data.name,
              members: action.data.members.map((m) => {
                return {
                  ...m,
                  bot_profile_image_link: null,
                  last_visited_at: null,
                };
              }),
            },
          }),
          ...(action.data.type === "WORKSPACE" &&
            action.data.team_channel &&
            state.channels[action.data.team_channel.id] && {
            [action.data.team_channel.id]: {
              //transfer the internal post notification here
              ...state.channels[action.data.team_channel.id],
              replies:
                action.data.type === "WORKSPACE" && state.channels[action.data.channel.id] && action.data.is_shared
                  ? [...state.channels[action.data.team_channel.id].replies, ...state.channels[action.data.channel.id].replies.filter((r) => r.body.startsWith("POST_CREATE::") && !r.shared_with_client)]
                  : state.channels[action.data.team_channel.id].replies.filter((r) => !r.body.startsWith("POST_CREATE::")),
              icon_link: action.data.channel.icon_link,
              title: action.data.name,
              members: action.data.members
                .filter((m) => m.type !== "external")
                .map((m) => {
                  return {
                    ...m,
                    bot_profile_image_link: null,
                    last_visited_at: null,
                  };
                }),
            },
          }),
        },
        ...(state.selectedChannel &&
          state.selectedChannel.id === action.data.channel.id && {
          selectedChannel: {
            ...state.selectedChannel,
            ...(action.data.system_message && {
              replies: [
                ...state.channels[action.data.channel.id].replies.filter((r) => {
                  if (r.body.startsWith("POST_CREATE::") && action.data.is_shared && !r.shared_with_client) {
                    return false;
                  } else {
                    return true;
                  }
                }),
                {
                  ...action.data.system_message,
                  created_at: action.data.updated_at,
                  editable: false,
                  is_read: true,
                  is_deleted: false,
                  files: [],
                  reactions: [],
                  unfurls: [],
                },
                ...teamPostNotif,
              ],
            }),
            icon_link: action.data.channel.icon_link,
            title: action.data.name,
            members: action.data.members.map((m) => {
              return {
                ...m,
                bot_profile_image_link: null,
                last_visited_at: null,
              };
            }),
          },
        }),
        ...(state.selectedChannel &&
          action.data.team_channel &&
          state.selectedChannel.id === action.data.team_channel.id && {
          selectedChannel: {
            ...state.selectedChannel,
            replies:
              action.data.type === "WORKSPACE" && state.channels[action.data.channel.id] && action.data.is_shared
                ? [...state.selectedChannel.replies, ...state.channels[action.data.channel.id].replies.filter((r) => r.body.startsWith("POST_CREATE::") && !r.shared_with_client)]
                : state.selectedChannel.replies.filter((r) => !r.body.startsWith("POST_CREATE::")),
            icon_link: action.data.channel.icon_link,
            title: action.data.name,
            members: action.data.members
              .filter((m) => m.type !== "external")
              .map((m) => {
                return {
                  ...m,
                  bot_profile_image_link: null,
                  last_visited_at: null,
                };
              }),
          },
        }),
      };
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
                unfurls: m.unfurls.filter((u) => u.id !== action.data.unfurl_id),
              };
            } else {
              return m;
            }
          }),
        };
        channels[action.data.channel_id] = channel;
      }
      return {
        ...state,
        channels: channels,
        selectedChannel: state.selectedChannel && channel && channel.id === state.selectedChannel.id ? channel : state.selectedChannel,
      };
    }
    case "LEAVE_WORKSPACE": {
      let updatedChannels = { ...state.channels };
      if (updatedChannels.hasOwnProperty(action.data.channel_id)) {
        updatedChannels[action.data.channel_id].members = updatedChannels[action.data.channel_id].members.filter((m) => m.id !== state.user.id);
      }
      return {
        ...state,
        channels: updatedChannels,
        selectedChannel:
          state.selectedChannel && state.selectedChannel.id === action.data.channel_id
            ? {
              ...state.selectedChannel,
              members: state.selectedChannel.members.filter((m) => m.id !== state.user.id),
            }
            : state.selectedChannel,
      };
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
                ...action.data.current_user,
              };
            } else {
              return m;
            }
          }),
        };
        updatedChannels[updatedChannel.id] = updatedChannel;
      }
      return {
        ...state,
        selectedChannel: updatedChannel,
        channels: updatedChannels,
      };
    }
    case "SET_FETCHING_MESSAGES": {
      let updatedChannels = { ...state.channels };
      if (updatedChannels.hasOwnProperty(action.data.id)) {
        updatedChannels[action.data.id].isFetching = action.data.status;
      }
      return {
        ...state,
        channels: updatedChannels,
        selectedChannel:
          state.selectedChannel && state.selectedChannel.id === action.data.id
            ? {
              ...state.selectedChannel,
              isFetching: action.data.status,
            }
            : state.selectedChannel,
      };
    }
    case "SET_LAST_CHAT_VISIBILITY": {
      if (state.isLastChatVisible !== action.data.status) {
        return {
          ...state,
          isLastChatVisible: action.data.status,
        };
      } else {
        return state;
      }
    }
    case "DELETE_POST_NOTIFICATION": {
      let channels = { ...state.channels };
      let selectedChannel = state.selectedChannel ? { ...state.selectedChannel } : null;
      action.data.forEach((data) => {
        if (channels.hasOwnProperty(data.channel.id)) {
          if (channels[data.channel.id].replies.length) {
            channels[data.channel.id].replies = channels[data.channel.id].replies.filter((r) => r.id !== data.system_message.id);
          }
        }
        if (selectedChannel && selectedChannel.id === data.channel.id && selectedChannel.replies.length) {
          selectedChannel.replies = selectedChannel.replies.filter((r) => r.id !== data.system_message.id);
        }
      });
      return {
        ...state,
        channels: channels,
        selectedChannel: selectedChannel,
      };
    }
    case "INCOMING_POST_NOTIFICATION_MESSAGE": {
      let channels = { ...state.channels };
      if (Object.keys(channels).length && channels.hasOwnProperty(action.data.channel_id)) {
        channels = {
          ...Object.values(state.channels)
            .map((channel) => {
              if (channel.id === action.data.channel_id) {
                return {
                  ...channel,
                  is_hidden: false,
                  last_reply: action.data,
                  replies: channel.replies.some((r) => r.id === action.data.id)
                    ? channel.replies.map((r) => {
                      if (r.id === action.data.id) {
                        return action.data;
                      } else {
                        return r;
                      }
                    })
                    : [...channel.replies, action.data],
                };
              } else if (!action.data.new_post && action.data.topic) {
                if (channel.type === "TOPIC" && channel.entity_id === action.data.topic.id) {
                  return {
                    ...channel,
                    replies: channel.replies.filter((r) => r.id !== action.data.id),
                    //replies: (channel.team && action.data.shared_with_client) || (channel.team && !action.data.shared_with_client) ? channel.replies.filter((r) => r.id !== action.data.id) : channel.replies,
                  };
                } else {
                  return channel;
                }
              } else {
                return channel;
              }
            })
            .reduce((channels, channel) => {
              channels[channel.id] = channel;
              return channels;
            }, {}),
        };
      }
      return {
        ...state,
        selectedChannel: state.selectedChannel && channels[state.selectedChannel.id] ? { ...channels[state.selectedChannel.id], selected: true } : state.selectedChannel,
        channels: channels,
      };
    }
    case "REFETCH_MESSAGES_SUCCESS": {
      let channels = { ...state.channels };
      let channel = null;
      if (action.data.channel_detail && channels.hasOwnProperty(action.data.channel_detail.id)) {
        let messages = [
          ...channels[action.data.channel_detail.id].replies,
          ...action.data.current_latest_messages.map((m) => {
            return { ...m, channel_id: action.data.channel_detail.id };
          }),
        ];
        channel = {
          ...action.data.channel_detail,
          icon_link: channels[action.data.channel_detail.id].icon_link,
          replies: uniqByProp(messages, "id"),
          //.sort((a, b) => a.created_at.timestamp - b.created_at.timestamp),
          hasMore: channels[action.data.channel_detail.id].hasMore,
          skip: channels[action.data.channel_detail.id].skip,
          isFetching: false,
          team: channels[action.data.channel_detail.id].team,
        };
        channels[action.data.channel_detail.id] = channel;
      }
      return {
        ...state,
        channels: channels,
        selectedChannel: state.selectedChannel && channel && state.selectedChannel.id === channel.id ? channel : state.selectedChannel,
      };
    }
    case "REFETCH_OTHER_MESSAGES_SUCCESS": {
      let channelsWithMessage = action.data.filter((c) => c.count_message > 0);
      let channels = { ...state.channels };
      channelsWithMessage.forEach((c) => {
        if (channels.hasOwnProperty(c.channel_id)) {
          let newMessages = Object.values(c.messages).map((m) => {
            return { ...m, channel_id: c.channel_id };
          });
          let messages = [...channels[c.channel_id].replies, ...newMessages];
          channels[c.channel_id].replies = uniqByProp(messages, "id").sort((a, b) => a.created_at.timestamp - b.created_at.timestamp);
          // channels[c.channel_id].last_reply = newMessages[0];
        }
      });
      return {
        ...state,
        channels: channels,
        selectedChannel: state.selectedChannel && channels.hasOwnProperty(state.selectedChannel.id) ? channels[state.selectedChannel.id] : state.selectedChannel,
      };
    }
    case "GET_CHANNEL_DETAIL_SUCCESS": {
      let channels = { ...state.channels };
      if (channels.hasOwnProperty(action.data.id)) {
        channels[action.data.id] = {
          ...action.data,
          icon_link: channels[action.data.id].icon_link,
          replies: channels[action.data.id].replies,
          hasMore: channels[action.data.id].hasMore,
          skip: channels[action.data.id].skip,
          isFetching: false,
        };
      }
      return {
        ...state,
        channels: channels,
      };
    }
    case "GET_LATEST_REPLY_SUCCESS": {
      return {
        ...state,
        lastReceivedMessage: action.data.latest_reply
          ? {
            id: action.data.latest_reply.reply_id,
            channel_id: action.data.latest_reply.channel_id,
          }
          : state.lastReceivedMessage,
      };
    }
    case "SET_CHANNEL_RANGE": {
      return {
        ...state,
        channelRange: {
          ...state.channelRange,
          [action.data.id]: action.data.range,
        },
      };
    }
    case "GET_SELECT_CHANNEL_SUCCESS": {
      if (action.data) {
        let channels = { ...state.channels };
        let channel = {
          ...action.data,
          hasMore: true,
          skip: 0,
          selected: true,
          isFetching: false,
        };
        channels = {
          ...channels,
          [channel.id]: channel,
        };
        return {
          ...state,
          channels: channels,
          lastVisitedChannel: channel,
          selectedChannel: channel,
          selectedChannelId: channel.id ? channel.id : state.selectedChannelId,
        };
      } else {
        return state;
      }
    }
    case "GET_LAST_CHANNEL_SUCCESS": {
      if (action.data) {
        let channels = { ...state.channels };
        let channel = {
          ...action.data,
          replies: action.data.replies.length ? action.data.replies : [],
          hasMore: action.data.replies.length === 20,
          skip: action.data.replies.length,
          selected: true,
          isFetching: false,
        };
        channels = {
          ...channels,
          [channel.id]: channel,
        };
        return {
          ...state,
          channels: channels,
          lastVisitedChannel: channel,
          selectedChannel: channel,
          selectedChannelId: channel.id ? channel.id : state.selectedChannelId,
        };
      } else {
        return state;
      }
    }
    case "INCOMING_IMPORTANT_CHAT": {
      return {
        ...state,
        ...(state.selectedChannel &&
          state.selectedChannel.id === action.data.channel.id && {
          selectedChannel: {
            ...state.selectedChannel,
            replies: state.selectedChannel.replies.map((r) => {
              if (r.id === action.data.chat_message.id) {
                return {
                  ...r,
                  ...action.data.chat_message,
                };
              } else {
                return r;
              }
            }),
          },
        }),
        ...(typeof state.channels[action.data.channel.id] !== "undefined" && {
          channels: {
            ...state.channels,
            [action.data.channel.id]: {
              ...state.channels[action.data.channel.id],
              replies: state.channels[action.data.channel.id].replies.map((r) => {
                if (r.id === action.data.chat_message.id) {
                  return {
                    ...r,
                    ...action.data.chat_message,
                  };
                } else {
                  return r;
                }
              }),
            },
          },
        }),
      };
    }
    case "GET_CHAT_STAR_SUCCESS": {
      return {
        ...state,
        ...(state.selectedChannel &&
          state.selectedChannel.replies.findIndex((r) => r.id === action.data.chat_message_id) !== -1 && {
          selectedChannel: {
            ...state.selectedChannel,
            replies: state.selectedChannel.replies.map((r) => {
              if (r.id === action.data.chat_message_id) {
                return {
                  ...r,
                  star_users: action.data.users,
                };
              } else {
                return r;
              }
            }),
          },
        }),
        channels: {
          ...Object.values(state.channels)
            .map((channel) => {
              if (state.channels[channel.id].replies.findIndex((r) => r.id === action.data.chat_message_id) !== -1) {
                return {
                  ...state.channels[channel.id],
                  replies: state.channels[channel.id].replies.map((r) => {
                    if (r.id === action.data.chat_message_id) {
                      return {
                        ...r,
                        star_users: action.data.users,
                      };
                    } else {
                      return r;
                    }
                  }),
                };
              } else {
                return channel;
              }
            })
            .reduce((channels, channel) => {
              channels[channel.id] = channel;
              return channels;
            }, {}),
        },
      };
    }
    case "INCOMING_CHAT_STAR": {
      return {
        ...state,
        ...(state.selectedChannel &&
          state.selectedChannel.id === action.data.channel.id && {
          selectedChannel: {
            ...state.selectedChannel,
            replies: state.selectedChannel.replies.map((r) => {
              if (r.id === action.data.chat.id) {
                return {
                  ...r,
                  ...(state.user.id === action.data.author.id && { i_starred: action.data.star === 1 ? true : false }),
                  star_count: action.data.star === 1 ? r.star_count + 1 : r.star_count - 1,
                  ...(typeof state.star_users === "undefined"
                    ? {
                      ...(action.data.star === 1 ? { star_users: [action.data.author] } : { star_users: [] }),
                    }
                    : {
                      ...(action.data.star === 1 ? { star_users: [state.star_users, action.data.author] } : { star_users: state.star_users.filter((u) => u.id !== action.data.author.id) }),
                    }),
                };
              } else {
                return r;
              }
            }),
          },
        }),
        ...(typeof state.channels[action.data.channel.id] !== "undefined" && {
          channels: {
            ...state.channels,
            [action.data.channel.id]: {
              ...state.channels[action.data.channel.id],
              replies: state.channels[action.data.channel.id].replies.map((r) => {
                if (r.id === action.data.chat.id) {
                  return {
                    ...r,
                    ...(state.user.id === action.data.author.id && { i_starred: action.data.star === 1 ? true : false }),
                    star_count: action.data.star === 1 ? r.star_count + 1 : r.star_count - 1,
                    ...(typeof state.star_users === "undefined"
                      ? {
                        ...(action.data.star === 1 ? { star_users: [action.data.author] } : { star_users: [] }),
                      }
                      : {
                        ...(action.data.star === 1 ? { star_users: [state.star_users, action.data.author] } : { star_users: state.star_users.filter((u) => u.id !== action.data.author.id) }),
                      }),
                  };
                } else {
                  return r;
                }
              }),
            },
          },
        }),
      };
    }
    case "INCOMING_ARCHIVED_USER": {
      return {
        ...state,
        channels: {
          ...Object.values(state.channels)
            .map((channel) => {
              if (action.data.channel_ids.some((id) => id === channel.id)) {
                return {
                  ...channel,
                  members: channel.members.filter((m) => m.id !== action.data.user.id),
                };
              } else {
                return channel;
              }
            })
            .reduce((channels, channel) => {
              channels[channel.id] = channel;
              return channels;
            }, {}),
        },
      };
    }
    case "INCOMING_UNARCHIVED_USER": {
      return {
        ...state,
        channels: {
          ...Object.values(state.channels)
            .map((channel) => {
              if (action.data.connected_channel_ids.some((id) => id === channel.id)) {
                return {
                  ...channel,
                  members: [...channel.members, { ...action.data.profile, last_visited_at: { timestamp: Math.floor(Date.now() / 1000) } }],
                };
              } else {
                return channel;
              }
            })
            .reduce((channels, channel) => {
              channels[channel.id] = channel;
              return channels;
            }, {}),
        },
      };
    }
    case "GET_USER_BOTS_SUCCESS": {
      return {
        ...state,
        bots: {
          channels: action.data.channels.map((c) => {
            return {
              ...c,
              huddle: state.huddleBots.some((h) => h.channel.id === c.id) ? state.huddleBots.find((h) => h.channel.id === c.id) : null,
            };
          }),
          user_bots: action.data.user_bots,
          loaded: true,
        },
        huddleBot: action.data.user_bots && action.data.user_bots.length > 0 ? action.data.user_bots[0] : null,
      };
    }
    case "GET_HUDDLE_CHATBOT_SUCCESS": {
      return {
        ...state,
        huddleBots: action.data.map((h) => {
          return {
            ...h,
            is_snooze: false,
            is_skip: false,
            snooze_time: getCurrentTimestamp(),
            showToday: false,
            questions: h.questions
              .sort((a, b) => a.id - b.id)
              .map((q, k) => {
                return {
                  ...q,
                  isFirstQuestion: k === 0,
                  isLastQuestion: h.questions.length === k + 1,
                  answer: null,
                  original_answer: null,
                };
              }),
          };
        }),
        bots: {
          ...state.bots,
          channels: state.bots.channels.map((c) => {
            if (action.data.some((hb) => hb.channel.id === c.id)) {
              return {
                ...c,
                huddle: action.data.find((hb) => hb.channel.id === c.id),
              };
            } else {
              return c;
            }
          }),
        },
      };
    }
    case "INCOMING_HUDDLE_BOT": {
      return {
        ...state,
        huddleBots: [...state.huddleBots, action.data],
        bots: {
          ...state.bots,
          channels: state.bots.channels.map((c) => {
            if (action.data.channel.id === c.id) {
              return {
                ...c,
                huddle: action.data,
              };
            } else {
              return c;
            }
          }),
        },
      };
    }
    case "INCOMING_UPDATED_HUDDLE_BOT": {
      return {
        ...state,
        huddleBots: state.huddleBots.map((hb) => {
          if (hb.channel.id === action.data.channel.id) {
            return {
              ...hb,
              ...action.data,
            };
          } else {
            return hb;
          }
        }),
        bots: {
          ...state.bots,
          channels: state.bots.channels.map((c) => {
            if (action.data.channel.id === c.id) {
              return {
                ...c,
                huddle: c.huddle
                  ? {
                    ...c.huddle,
                    ...action.data,
                  }
                  : action.data,
              };
            } else {
              return c;
            }
          }),
        },
      };
    }
    case "INCOMING_DELETED_HUDDLE_BOT": {
      return {
        ...state,
        huddleBots: state.huddleBots.filter((hb) => hb.id !== action.data.id),
        bots: {
          ...state.bots,
          channels: state.bots.channels.map((c) => {
            if (c.huddle && c.huddle.id === action.data.id) {
              return {
                ...c,
                huddle: null,
              };
            } else {
              return c;
            }
          }),
        },
      };
    }
    case "SAVE_HUDDLE_ANSWER": {
      return {
        ...state,
        huddleBots: state.huddleBots.map((h) => {
          if (h.channel.id === action.data.channel_id) {
            return {
              ...h,
              questions: h.questions.map((q) => {
                if (q.id === action.data.question_id) {
                  return {
                    ...q,
                    answer: action.data.answer,
                    original_answer: action.data.answer,
                  };
                } else {
                  return q;
                }
              }),
            };
          } else {
            return h;
          }
        }),
      };
    }
    case "POST_USER_BOTS_SUCCESS": {
      return {
        ...state,
        huddleBot: action.data,
        user_bots: [...state.bots.user_bots, action.data],
      };
    }
    case "CLEAR_HUDDLE": {
      return {
        ...state,
        huddleBots: state.huddleBots.map((h) => {
          return {
            ...h,
            questions: h.questions.map((q) => {
              return {
                ...q,
                answer: null,
              };
            }),
          };
        }),
      };
    }
    case "INCOMING_HUDDLE_ANSWERS": {
      let channel = null;
      if (Object.keys(state.channels).length > 0 && state.channels.hasOwnProperty(action.data.channel.id)) {
        channel = { ...state.channels[action.data.channel.id] };
        channel = {
          ...channel,
          replies: channel.replies
            .map((r) => {
              if (r.id === action.data.message.id) {
                return {
                  ...r,
                  huddle_log: action.data.huddle_log,
                  body: action.data.message.body,
                };
              } else {
                return r;
              }
            })
            .filter((r) => {
              if (action.data.skip_message_ids) {
                return !action.data.skip_message_ids.some((id) => id === r.id);
              } else {
                return true;
              }
            }),
        };
      }
      return {
        ...state,
        hasUnpublishedAnswers: [...state.hasUnpublishedAnswers, action.data.channel.id],
        selectedChannel: state.selectedChannel && channel && state.selectedChannel.id === channel.id ? channel : state.selectedChannel,
        channels:
          channel !== null
            ? {
              ...state.channels,
              [action.data.channel.id]: channel,
            }
            : state.channels,
        huddleBots: state.huddleBots.map((h) => {
          if (h.channel.id === action.data.channel.id) {
            return {
              ...h,
              huddle_log: {
                ...action.data.huddle_log,
                huddle_id: h.id,
              },
              questions: h.questions.map((q) => {
                let answer = action.data.huddle_answers.find((ha) => ha.huddle_question_id === q.id);
                if (answer) {
                  return {
                    ...q,
                    answer: answer.answer,
                    original_answer: answer.answer,
                    answer_id: answer.id,
                  };
                } else {
                  return q;
                }
              }),
            };
          } else {
            return h;
          }
        }),
        skipIds: action.data.skip_message_ids ? state.skipIds.filter((s) => !action.data.skip_message_ids.some((id) => id === s.id)) : state.skipIds,
      };
    }
    case "ADD_HUDDLE_LOG": {
      let channel = null;
      if (Object.keys(state.channels).length > 0 && state.channels.hasOwnProperty(action.data.channel_id)) {
        channel = { ...state.channels[action.data.channel_id] };
        channel = {
          ...channel,
          replies: channel.replies.map((r) => {
            if (r.id === action.data.message_id) {
              return {
                ...r,
                huddle_log: action.data.huddle_log,
              };
            } else {
              return r;
            }
          }),
        };
      }
      return {
        ...state,
        selectedChannel: state.selectedChannel && channel && state.selectedChannel.id === channel.id ? channel : state.selectedChannel,
        channels:
          channel !== null
            ? {
              ...state.channels,
              [action.data.channel_id]: channel,
            }
            : state.channels,
        huddleBots: state.huddleBots.map((h) => {
          if (h.channel.id === action.data.channel_id) {
            return {
              ...h,
              questions: h.questions.map((q) => {
                let answer = action.data.huddle_answers.find((ha) => ha.huddle_question_id === q.id);
                if (answer) {
                  return {
                    ...q,
                    answer: answer.answer,
                    original_answer: answer.answer,
                    answer_id: answer.id,
                  };
                } else {
                  return q;
                }
              }),
            };
          } else {
            return h;
          }
        }),
      };
    }
    case "SET_EDIT_HUDDLE_ANSWERS": {
      let huddle = state.huddleBots.find((h) => h.channel.id === action.data.channel_id);
      return {
        ...state,
        editHuddle: huddle
          ? {
            ...huddle,
            // huddle_log: action.data.huddle_log,
            questions: huddle.questions.map((q) => {
              return {
                ...q,
                answer: null,
              };
            }),
          }
          : null,
      };
    }
    case "UPDATE_HUDDLE_ANSWER": {
      return {
        ...state,
        editHuddle: {
          ...state.editHuddle,
          questions: state.editHuddle.questions.map((q) => {
            if (q.id === action.data.question_id) {
              return {
                ...q,
                answer: action.data.answer,
              };
            } else {
              return q;
            }
          }),
        },
      };
    }
    case "CLEAR_EDIT_HUDDLE": {
      return {
        ...state,
        editHuddle: null,
      };
    }
    case "CLEAR_UNPUBLISHED_HUDDLE_ANSWER": {
      let channel = null;
      let huddleChannel = null;
      if (Object.keys(state.channels).length > 0 && state.channels.hasOwnProperty(action.data.channel_id)) {
        channel = { ...state.channels[action.data.channel_id] };
        channel = {
          ...channel,
          replies: channel.replies.filter((r) => !action.data.huddle_deleted_message_ids.some((id) => id === r.id)),
        };
      }
      if (state.channels[action.data.huddle_channel_id]) {
        huddleChannel = { ...state.channels[action.data.huddle_channel_id] };
        huddleChannel = {
          ...huddleChannel,
          replies: huddleChannel.replies.filter((r) => !action.data.huddle_deleted_message_ids.some((id) => id === r.id)),
        };
      }
      return {
        ...state,
        selectedChannel:
          state.selectedChannel && channel && state.selectedChannel.id === channel.id ? channel : state.selectedChannel && huddleChannel && state.selectedChannel.id === huddleChannel.id ? huddleChannel : state.selectedChannel,
        channels: {
          ...state.channels,
          ...(channel && {
            [action.data.channel_id]: channel,
          }),
          ...(huddleChannel && {
            [action.data.huddle_channel_id]: huddleChannel,
          }),
        },
      };
    }
    case "INCOMING_HUDDLE_SKIP": {
      let channel = null;
      if (Object.keys(state.channels).length > 0 && state.channels.hasOwnProperty(action.data.channel.id)) {
        channel = { ...state.channels[action.data.channel.id] };
        channel = {
          ...channel,
          replies: [...channel.replies, action.data.message],
        };
      }
      return {
        ...state,
        hasUnpublishedAnswers: [...state.hasUnpublishedAnswers, action.data.channel.id],
        selectedChannel: state.selectedChannel && channel && state.selectedChannel.id === channel.id ? channel : state.selectedChannel,
        channels:
          channel !== null
            ? {
              ...state.channels,
              [action.data.channel.id]: channel,
            }
            : state.channels,
      };
    }
    case "ADD_SKIP_ID": {
      return {
        ...state,
        skipIds: [...state.skipIds, action.data],
        hasUnpublishedAnswers: state.hasUnpublishedAnswers.filter((id) => id !== action.data.channel_id),
      };
    }
    case "ADJUST_HUDDLE_DATE": {
      return {
        ...state,
        huddleBots: state.huddleBots.map((h) => {
          if (h.repeat_select_monthly) {
            if (today <= 3) {
              //check if last month is in range is adjusted to current month
              const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
              if (monthHasDate(lastMonth, h.repeat_select_monthly)) {
                const lastMonthDate = new Date(thisMonth === 0 ? thisYear - 1 : thisYear, thisMonth === 0 ? 11 : thisMonth - 1, h.repeat_select_monthly);
                if (isWeekend(lastMonthDate)) {
                  const adjustedDate = toNextMonday(lastMonthDate, lastMonthDate.getDay() === 0 ? 1 : 2);
                  if (adjustedDate.getMonth() === thisMonth) {
                    return {
                      ...h,
                      showToday: adjustedDate.getDate() === today,
                    };
                  } else {
                    return {
                      ...h,
                      showToday: false,
                    };
                  }
                } else {
                  return {
                    ...h,
                    showToday: false,
                  };
                }
              } else {
                //adjust date to first date of the current month
                const firstDateOfTheMonth = new Date(thisYear, thisMonth, 1);
                if (isWeekend(firstDateOfTheMonth)) {
                  const adjustedDate = toNextMonday(firstDateOfTheMonth, firstDateOfTheMonth.getDay() === 0 ? 1 : 2);
                  return {
                    ...h,
                    showToday: adjustedDate.getDate() === today,
                  };
                } else {
                  return {
                    ...h,
                    showToday: firstDateOfTheMonth.getDate() === today,
                  };
                }
              }
            } else if (today > 3 && monthHasDate(thisMonth, h.repeat_select_monthly)) {
              //check if show date is not on weekend and adjusted date is still in range(same month)
              const showDate = new Date(thisYear, thisMonth, h.repeat_select_monthly);
              if (isWeekend(showDate)) {
                const adjustedDate = toNextMonday(showDate, showDate.getDay() === 0 ? 1 : 2);
                if (adjustedDate.getMonth() === thisMonth) {
                  return {
                    ...h,
                    showToday: adjustedDate.getDate() === today,
                  };
                } else {
                  return {
                    ...h,
                    showToday: false,
                  };
                }
              } else {
                return {
                  ...h,
                  showToday: h.repeat_select_monthly === today,
                };
              }
            } else {
              return {
                ...h,
                showToday: false,
              };
            }
          } else if (h.repeat_select_yearly) {
            const parseYear = parseInt(h.repeat_select_yearly.substr(0, 4));
            const parseMonth = parseInt(h.repeat_select_yearly.substr(5, 2)) - 1;
            const parseDate = parseInt(h.repeat_select_yearly.substr(8, 2));
            const showDate = new Date(parseYear, parseMonth, parseDate);
            if (parseMonth === 11 && (parseDate === 30 || parseDate === 31)) {
              if (isWeekend(showDate)) {
                const adjustedDate = toNextMonday(showDate, showDate.getDay() === 0 ? 1 : 2);
                return {
                  ...h,
                  showToday: adjustedDate.getDate() === today && adjustedDate.getMonth() === thisMonth,
                };
              } else {
                return {
                  ...h,
                  showToday: showDate.getDate() === today && parseMonth === thisMonth,
                };
              }
            } else {
              if (isWeekend(showDate)) {
                const adjustedDate = toNextMonday(showDate, showDate.getDay() === 0 ? 1 : 2);
                return {
                  ...h,
                  showToday: adjustedDate.getDate() === today && adjustedDate.getMonth() === thisMonth,
                };
              } else {
                return {
                  ...h,
                  showToday: showDate.getDate() === today && parseMonth === thisMonth,
                };
              }
            }
          } else {
            //other repeat type
            return h;
          }
        }),
      };
    }
    case "GET_SKIPPED_ANSWERS_SUCCESS": {
      return {
        ...state,
        hasUnpublishedAnswers: [...state.hasUnpublishedAnswers, ...action.data.map((d) => d.channel_id)],
      };
    }
    case "ADD_HAS_UNPUBLISHED_ANSWERS": {
      return {
        ...state,
        hasUnpublishedAnswers: [...state.hasUnpublishedAnswers, action.data.channel_id],
      };
    }
    case "CLEAR_HAS_UNPUBLISHED_ANSWERS": {
      return {
        ...state,
        hasUnpublishedAnswers: [],
      };
    }
    case "GET_UNPUBLISHED_ANSWERS_SUCCESS": {
      if (action.data.length) {
        const huddleLog = action.data[0].huddle_log;
        const answers = action.data[0].huddle_answers;
        return {
          ...state,
          huddleBots: state.huddleBots.map((h) => {
            if (h.id === huddleLog.huddle_id) {
              return {
                ...h,
                huddle_log: {
                  ...huddleLog,
                  message_id: huddleLog.connected_message_id,
                },
                questions: h.questions.map((q) => {
                  const answer = answers.find((a) => a.huddle_question_id === q.id);
                  if (answer) {
                    return {
                      ...q,
                      answer_id: answer.id,
                      answer: answer.answer,
                      original_answer: answer.answer,
                    };
                  } else {
                    return q;
                  }
                }),
              };
            } else {
              return h;
            }
          }),
        };
      } else {
        return state;
      }
    }
    case "SET_SEARCH_ARCHIVED_CHANNELS": {
      return {
        ...state,
        searchArchivedChannels: action.data,
      };
    }
    case "GET_COMPANY_CHANNEL_SUCCESS": {
      return {
        ...state,
        companyChannel: action.data,
      };
    }
    case "UPDATE_COMPANY_CHANNEL": {
      return {
        ...state,
        companyChannel: {
          ...state.companyChannel,
          ...action.data,
        },
        channels: {
          ...state.channels,
          ...(state.channels[action.data.id] && {
            [action.data.id]: {
              ...state.channels[action.data.id],
              ...action.data,
            },
          }),
        },
        selectedChannel: state.selectedChannel && state.selectedChannel.id === action.data.id ? { ...state.selectedChannel, ...action.data } : state.selectedChannel,
      };
    }
    case "INCOMING_REMOVED_FILE_AUTOMATICALLY": {
      return {
        ...state,
        channels: {
          ...state.channels,
          ...action.data.files.reduce((res, obj) => {
            if (state.channels[obj.channel_id]) {
              res[obj.channel_id] = {
                ...state.channels[obj.channel_id],
                replies: state.channels[obj.channel_id].replies.map((r) => {
                  if (r.files.some((f) => f.file_id === obj.file_id)) {
                    return {
                      ...r,
                      files: r.files.map((file) => {
                        if (file.file_id === obj.file_id) {
                          return {
                            ...file,
                            deleted_at: { timestamp: getCurrentTimestamp() },
                            file_type: "trashed",
                          };
                        } else {
                          return file;
                        }
                      }),
                    };
                  } else {
                    return r;
                  }
                }),
              };
            }
            return res;
          }, {}),
        },
        selectedChannel:
          state.selectedChannel && action.data.files.some((f) => f.channel_id === state.selectedChannel.id)
            ? {
              ...state.selectedChannel,
              replies: state.selectedChannel.replies.map((r) => {
                if (r.files.some((f) => action.data.files.some((file) => file.file_id === f.file_id))) {
                  return {
                    ...r,
                    files: r.files.map((file) => {
                      if (action.data.files.some((f) => file.file_id === f.file_id)) {
                        return {
                          ...file,
                          deleted_at: { timestamp: getCurrentTimestamp() },
                          file_type: "trashed",
                        };
                      } else {
                        return file;
                      }
                    }),
                  };
                } else {
                  return r;
                }
              }),
            }
            : state.selectedChannel,
      };
    }
    case "INCOMING_REMOVED_FILE_AFTER_DOWNLOAD": {
      return {
        ...state,
        channels: {
          ...Object.values(state.channels).reduce((res, channel) => {
            res[channel.id] = {
              ...channel,
              replies: channel.replies.map((r) => {
                if (r.files.some((f) => f.file_id === action.data.file_id)) {
                  return {
                    ...r,
                    files: r.files.map((file) => {
                      if (file.file_id === action.data.file_id) {
                        return {
                          ...file,
                          deleted_at: { timestamp: getCurrentTimestamp() },
                          file_type: "trashed",
                        };
                      } else {
                        return file;
                      }
                    }),
                  };
                } else {
                  return r;
                }
              }),
            };
            return res;
          }, {}),
        },
        selectedChannel: state.selectedChannel
          ? {
            ...state.selectedChannel,
            replies: state.selectedChannel.replies.map((r) => {
              if (r.files.some((f) => f.file_id === action.data.file_id)) {
                return {
                  ...r,
                  files: r.files.map((file) => {
                    if (file.file_id === action.data.file_id) {
                      return {
                        ...file,
                        deleted_at: { timestamp: getCurrentTimestamp() },
                        file_type: "trashed",
                      };
                    } else {
                      return file;
                    }
                  }),
                };
              } else {
                return r;
              }
            }),
          }
          : state.selectedChannel,
      };
    }

    case "SET_EDIT_HUDDLE_ANSWERS": {
      let huddle = state.huddleBots.find((h) => h.channel.id === action.data.channel_id);
      return {
        ...state,
        editHuddle: huddle
          ? {
            ...huddle,
            // huddle_log: action.data.huddle_log,
            questions: huddle.questions.map((q) => {
              return {
                ...q,
                answer: null,
              };
            }),
          }
          : null,
      };
    }

    case "HUDDLE_SNOOZE": {
      let huddleBots = Object.values(state.huddleBots).map((r) => {
        if (r.id === action.data.id) {
          return {
            ...r,
            is_snooze: action.data.is_snooze,
            snooze_time: action.data.snooze_time
          };
        }
        return {
          ...r
        };
      })

      return {
        ...state,
        huddleBots: huddleBots,
      };
    }

    case "HUDDLE_SNOOZE_SKIP": {
      let huddleBots = Object.values(state.huddleBots).map((r) => {
        if (r.id === action.data.id) {
          return {
            ...r,
            is_skip: action.data.is_skip,
            is_snooze: false,
          };
        }
        return {
          ...r
        };
      })
      return {
        ...state,
        huddleBots: huddleBots,
      };
    }

    case "HUDDLE_SNOOZE_ALL": {
      let huddleBots = Object.values(state.huddleBots).map((r) => {
        return {
          ...r,
          is_snooze: action.data.is_snooze,
          snooze_time: action.data.snooze_time
        };

      })
      return {
        ...state,
        huddleBots: huddleBots,
      };
    }

    // case "INCOMING_DELETED_POST": {
    //   return {
    //     ...state,
    //     channels: Object.values(state.channels).reduce((acc, channel) => {
    //       if (channel.replies.length && action.data.channel_ids.some((c) => c.channel_id === channel.id)) {
    //         acc[channel.id] = {
    //           ...channel,
    //           replies: channel.replies.filter((reply) => {
    //             if (action.data.channel_ids.some((c) => c.message_id === reply.id)) {
    //               return false;
    //             } else {
    //               return true;
    //             }
    //           }),
    //         };
    //       } else {
    //         acc[channel.id] = channel;
    //       }
    //       return acc;
    //     }, {}),
    //     selectedChannel:
    //       state.selectedChannel && action.data.channel_ids.some((c) => c.channel_id === state.selectedChannel.id)
    //         ? {
    //             ...state.selectedChannel,
    //             replies: state.selectedChannel.replies.filter((reply) => {
    //               if (action.data.channel_ids.some((c) => c.message_id === reply.id)) {
    //                 return false;
    //               } else {
    //                 return true;
    //               }
    //             }),
    //           }
    //         : state.selectedChannel,
    //   };
    // }
    default:
      return state;
  }
}
