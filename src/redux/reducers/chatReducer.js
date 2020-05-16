// import {uniqBy} from "lodash";
import {convertArrayToObject} from "../../helpers/arrayHelper";
import {getCurrentTimestamp} from "../../helpers/dateFormatter";
import {localizeDate} from "../../helpers/momentFormatJS";

/** Initial State  */
const INITIAL_STATE = {
    user: {},
    channels: {},
    selectedChannel: null,
    startNewChannels: {},
    channelDrafts: [],
    unreadChatCount: 0,
    historicalPositions: [],
    editChatMessage: null,
};

export default function (state = INITIAL_STATE, action) {

    switch (action.type) {
        case "GET_CHANNELS_SUCCESS": {
            let results = action.data.results.filter(r => {
                if (state.selectedChannel && state.selectedChannel.id === r.id) return false;
                else return true;
            }).map(r => {
                return {
                    ...r,
                    hasMore: true,
                    skip: 0,
                    replies: [],
                    selected: false,
                };
            });
            return {
                ...state,
                channels: {
                    ...state.channels,
                    ...convertArrayToObject(results, "id"),
                },
            };
        }
        case "UPDATE_CHANNEL_REDUCER": {
            return {
                ...state,
                channels: {
                    ...state.channels,
                    [action.data.id]: action.data,
                },
                selectedChannel: state.selectedChannel && state.selectedChannel.id === action.data.id ? action.data : state.selectedChannel,
            };
        }
        case "SET_SELECTED_CHANNEL": {
            let channel = action.data;

            if (channel.last_reply)
                channel.last_reply.body = channel.last_reply.body.replace(" in ", " in #");

            channel.original_title = channel.title;

            if (channel.original_title === "PERSONAL_BOT") {
                channel.type = "PERSONAL_BOT";
            }

            let updatedChannels = {...state.channels};
            if (state.selectedChannel) {
                updatedChannels[state.selectedChannel.id].selected = false;
                updatedChannels[action.data.id].selected = true;
            }

            return {
                ...state,
                selectedChannel: action.data,
                channels: updatedChannels,
            };
        }
        case "UPDATE_MEMBER_TIMESTAMP": {
            let channel = state.channels[action.data.channel_id];
            if (typeof channel !== "undefined") {
                return {
                    ...state,
                    selectedChannel: state.selectedChannel && state.selectedChannel.id === action.data.channel_id
                        ? {
                            ...state.selectedChannel,
                            is_read: 1,
                            members: state.selectedChannel.members.map(m => {
                                if (m.id === action.data.member_id) {
                                    return {
                                        ...m,
                                        last_visited_at: {
                                            timestamp: action.data.timestamp + 3,
                                        },
                                    };
                                } else return m;
                            }),
                        }
                        : state.selectedChannel,
                    channels: {
                        ...state.channels,
                        [action.data.channel_id]: {
                            ...channel,
                            is_read: 1,
                            members: channel.members.map(m => {
                                if (m.id === action.data.member_id) {
                                    return {
                                        ...m,
                                        last_visited_at: {
                                            timestamp: action.data.timestamp + 3,
                                        },
                                    };
                                } else return m;
                            }),
                        },
                    },
                };
            } else {
                return state;
            }
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
            let channel = {...state.channels[action.data.channel_id]};
            channel = {
                ...channel,
                replies: [...action.data.results.map(r => {
                    if (action.data.type === "PERSONAL_BOT" && r.body.search(/You asked me to remind you about/) > -1) {
                        r.original_body = r.body;

                        const channelName = r.body.replace(r.body.substr(0, r.body.search(" in ") + 4, r.body), "");
                        r.body = r.body.replace(` in ${channelName}`, ` in <a class="push" data-href="/chat/${r.quote.channel_code}">#${channelName}</a>`);

                        const link = `/chat/${r.quote.channel_code}/${r.quote.code}`;
                        r.body = r.body.replace("this message", `<a class="push" data-href="${link}">this message</a>`);

                        if (r.is_completed === true) {
                            r.body = `<span class="completed">${r.body}</span><br/> ${r.original_body.replace("You asked me to remind you", "OK! I’ve marked the reminder")} as complete.`;
                        } else {
                            r.body = `${r.body}<br/> <span class="action"><a class="btn btn-complete btn-action" data-message_id="${r.id}">Mark as Complete</a> <a class="btn btn-delete btn-action" data-message_id="${r.id}">Delete</a></span>`;
                        }
                    }

                    return {
                        ...r,
                        is_read: true,
                        channel_id: action.data.channel_id,
                        g_date: localizeDate(r.created_at.timestamp, "YYYY-MM-DD"),
                    };
                }), ...channel.replies],
                read_only: action.data.read_only,
                hasMore: action.data.results.length === 20,
                skip: channel.skip === 0 && channel.replies.length ?
                    channel.replies.length + 20 : channel.skip + 20,
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
            let channel = {...state.channels[action.data.channel_id]};
            channel = {
                ...channel,
                replies: channel.replies.map(r => {
                    return {
                        ...r,
                        is_read: true,
                    };
                }),
            };
            return {
                ...state,
                selectedChannel: state.selectedChannel && state.selectedChannel.id === action.data.channel_id ?
                    channel : state.selectedChannel,
                channels: {
                    ...state.channels,
                    [action.data.channel_id]: channel,
                },
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
            let channel = {...state.channels[action.data.channel_id]};
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
                selectedChannel: state.selectedChannel.id === action.data.channel_id ?
                    {
                        ...state.selectedChannel,
                        replies: [...state.selectedChannel.replies, action.data],
                    }
                    : state.selectedChannel,
            };
        }
        case "INCOMING_CHAT_MESSAGE": {
            let haveReference = false;
            if (state.selectedChannel && state.selectedChannel.id === action.data.reply.channel_id) {
                state.selectedChannel.replies.forEach(rep => {
                    if (rep.reference_id === action.data.reply.reference_id) {
                        haveReference = true;

                    }
                });
            }
            let channel = null;
            if (Object.keys(state.channels).length > 0 && state.channels.hasOwnProperty(action.data.reply.channel_id)) {
                channel = {...state.channels[action.data.reply.channel_id]};
                channel = {
                    ...channel,
                    is_hidden: 0,
                    replies: [...channel.replies, action.data.reply],
                    last_visited_at_timestamp: getCurrentTimestamp(),
                    last_reply: action.data.last_reply,
                };
            }
            return {
                ...state,
                selectedChannel: state.selectedChannel && state.selectedChannel.id === action.data.reply.channel_id ?
                    {
                        ...state.selectedChannel,
                        last_visited_at_timestamp: getCurrentTimestamp(),
                        last_reply: action.data.last_reply,
                        replies: haveReference ? state.selectedChannel.replies.map(r => {
                                if (r.id === action.data.reply.reference_id) {
                                    return action.data.reply;
                                } else {
                                    return r;
                                }
                            })
                            : [...state.selectedChannel.replies, action.data.reply],
                    }
                    : state.selectedChannel,
                channels: channel !== null ?
                    {
                        ...state.channels,
                        [action.data.reply.channel_id]: channel,
                    }
                    : state.channels,
            };
        }
        case "INCOMING_CHAT_MESSAGE_FROM_OTHERS": {
            let channel = null;
            if (Object.keys(state.channels).length > 0 && state.channels.hasOwnProperty(action.data.reply.channel_id)) {
                channel = {...state.channels[action.data.reply.channel_id]};
                channel = {
                    ...channel,
                    replies: [...channel.replies, action.data.reply],
                    is_hidden: 0,
                    last_reply: action.data.last_reply,
                    total_unread: state.selectedChannel && state.selectedChannel.id === action.data.reply.channel_id
                        ? channel.total_unread
                        : channel.total_unread + 1,
                };
            }
            return {
                ...state,
                channels: channel !== null ?
                    {
                        ...state.channels,
                        [action.data.reply.channel_id]: channel,
                    }
                    : state.channels,
                selectedChannel: state.selectedChannel && state.selectedChannel.id === action.data.reply.channel_id ?
                    {
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
                    channel = {...state.channels[action.data.channel_id]};
                    channel = {
                        ...channel,
                        replies: channel.replies.map(r => {
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
                    selectedChannel: state.selectedChannel && state.selectedChannel.id === action.data.channel_id ?
                        {
                            ...state.selectedChannel,
                            replies: state.selectedChannel.replies.map(r => {
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
                    channels: channel !== null ?
                        {
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
                channel = {...state.channels[action.data.channel_id]};
                channel = {
                    ...channel,
                    is_archived: action.data.status === "ARCHIVED" ? 1 : 0,
                };
            }
            return {
                ...state,
                channels: channel !== null ?
                    {
                        ...state.channels,
                        [action.data.channel_id]: channel,
                    }
                    : state.channels,
                selectedChannel: state.selectedChannel && state.selectedChannel.id === action.data.channel_id ?
                    {
                        ...state.selectedChannel,
                        is_archived: action.data.status === "ARCHIVED" ? 1 : 0,
                    }
                    : state.selectedChannel,
            };
        }
        case "INCOMING_CHAT_MESSAGE_REACTION": {
            let channel = null;
            if (Object.keys(state.channels).length > 0 && state.channels.hasOwnProperty(action.data.channel_id)) {
                channel = {...state.channels[action.data.channel_id]};
                channel = {
                    ...channel,
                    replies: channel.replies.map(r => {
                        if (r.id === action.data.message_id) {
                            if (action.data.status === "CREATED") {
                                let reactions = r.reactions.filter(reaction => reaction.id !== action.data.id);
                                return Object.assign({}, r, {reactions: [...reactions, action.data]});
                            } else {
                                return Object.assign({}, r, {reactions: r.reactions.filter(reaction => reaction.id !== action.data.id)});
                            }
                        } else return r;
                    }),
                };
            }
            return {
                ...state,
                channels: channel !== null ?
                    {
                        ...state.channels,
                        [action.data.channel_id]: channel,
                    }
                    : state.channels,
                selectedChannel: state.selectedChannel && state.selectedChannel.id === action.data.channel_id ?
                    {
                        ...channel,
                    }
                    : state.selectedChannel,
            };
        }
        case "SET_CHANNEL_HISTORICAL_POSITION": {
            let channelExists = false;
            if (state.historicalPositions.length) {
                state.historicalPositions.forEach(hp => {
                    if (hp.channel_id === action.data.channel_id) {
                        channelExists = true;

                    }
                });
                if (channelExists) {
                    return {
                        ...state,
                        historicalPositions: state.historicalPositions.map(h => {
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
                channel = {...state.channels[action.data.channel_id]};
                channel = {
                    ...channel,
                    replies: channel.replies.map(r => {
                        if (r.id === action.data.message_id) {
                            return Object.assign({}, r, {
                                body: action.data.body,
                                mention_html: action.data.mention_html,
                                updated_at: action.data.updated_at,
                                unfurls: action.data.unfurls,
                            });
                        } else return r;
                    }),
                    last_reply: channel.last_reply && channel.last_reply.id === action.data.message_id ? {
                        ...channel.last_reply,
                        body: action.data.body,
                    } : channel.last_reply,
                };
            }
            return {
                ...state,
                channels: channel !== null ?
                    {
                        ...state.channels,
                        [action.data.channel_id]: channel,
                    }
                    : state.channels,
                selectedChannel: state.selectedChannel && state.selectedChannel.id === action.data.channel_id ?
                    {
                        ...channel,
                    }
                    : state.selectedChannel,
            };
        }
        case "SET_EDIT_CHAT_MESSAGE": {
            return {
                ...state,
                //editChatMessage: action.data.set_to_null ? null : action.data
                editChatMessage: action.data,
            };
        }
        default:
            return state;
    }
}